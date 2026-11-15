<?php

namespace App\Filament\Widgets;

use App\Filament\Pages\ManageOrderSettings;
use App\Filament\Resources\Orders\OrderResource;
use App\Models\Order;
use Filament\Actions\Action;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Notifications\Notification;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class RealtimeIncomingOrdersWidget extends BaseWidget
{
    protected static ?string $heading = '⚡ Pesanan Masuk Real-Time (Live Polling 5s)';

    protected ?string $pollingInterval = '5s';

    protected static ?int $sort = 2;

    protected int|string|array $columnSpan = 'full';

    public function table(Table $table): Table
    {
        return $table
            ->query(Order::query()->latest('id'))
            ->columns([
                TextColumn::make('order_number')
                    ->label('No. Pesanan')
                    ->searchable()
                    ->copyable()
                    ->description(function (Order $record): string {
                        $diff = $record->created_at ? $record->created_at->diffForHumans() : '';
                        $date = $record->created_at ? $record->created_at->format('d/m/Y H:i') : '';

                        return "{$diff} • {$date}";
                    })
                    ->badge(fn (Order $record) => $record->is_pickup ? 'Ambil di Toko' : ($record->payment_details['is_preorder_dp'] ?? false ? 'Pre-Order (DP)' : null))
                    ->color(fn (Order $record) => $record->is_pickup ? 'warning' : 'primary'),

                TextColumn::make('customer_name')
                    ->label('Pelanggan & Lokasi')
                    ->formatStateUsing(fn (Order $record) => $record->customer_name)
                    ->description(function (Order $record): string {
                        $loc = $record->is_pickup ? '📍 Ambil di Gerai Malang' : ($record->shipping_city ?: 'Malang');

                        return "📞 {$record->customer_phone} • {$loc}";
                    }),

                TextColumn::make('items_summary')
                    ->label('Item Pesanan')
                    ->state(function (Order $record): string {
                        $record->loadMissing('items');
                        $count = $record->items->count();
                        if ($count === 0) {
                            return '-';
                        }
                        $first = $record->items->first();
                        $firstStr = "{$first->quantity}x {$first->product_name}" . ($first->variant_label ? " ({$first->variant_label})" : '');
                        if ($count > 1) {
                            $extra = $count - 1;

                            return "{$firstStr}\n(+ {$extra} item lainnya)";
                        }

                        return $firstStr;
                    })
                    ->wrap(),

                TextColumn::make('total_amount')
                    ->label('Total Tagihan')
                    ->money('IDR', locale: 'id')
                    ->description(function (Order $record): ?string {
                        $details = $record->payment_details;
                        if (! empty($details['is_preorder_dp'])) {
                            $pct = $details['dp_percentage'] ?? 30;
                            $rem = number_format((float) ($details['remaining_balance'] ?? 0), 0, ',', '.');

                            return "DP {$pct}% • Sisa: Rp {$rem}";
                        }

                        return null;
                    }),

                TextColumn::make('payment_status')
                    ->label('Status Bayar')
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'pending' => 'Menunggu Bayar',
                        'verifying' => 'Verifikasi Bukti',
                        'paid' => 'Lunas',
                        'cancelled' => 'Dibatalkan',
                        default => ucfirst($state),
                    })
                    ->color(fn (string $state): string => match ($state) {
                        'paid' => 'success',
                        'verifying' => 'warning',
                        'pending' => 'gray',
                        'cancelled' => 'danger',
                        default => 'gray',
                    }),

                TextColumn::make('status')
                    ->label('Status Pesanan')
                    ->badge()
                    ->formatStateUsing(fn (Order $record): string => $record->status_label)
                    ->color(fn (string $state): string => match ($state) {
                        'pending' => 'warning',
                        'processing' => 'info',
                        'ready_for_pickup', 'shipped' => 'primary',
                        'completed' => 'success',
                        'cancelled' => 'danger',
                        default => 'gray',
                    }),

                ImageColumn::make('payment_proof')
                    ->label('Bukti Transfer')
                    ->disk('public')
                    ->square()
                    ->defaultImageUrl(null)
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->recordActions([
                Action::make('confirm_payment')
                    ->label('Konfirmasi Lunas')
                    ->icon(Heroicon::CheckCircle)
                    ->color('success')
                    ->visible(fn (Order $record): bool => $record->payment_status !== 'paid')
                    ->requiresConfirmation()
                    ->modalHeading('Konfirmasi Pembayaran Lunas')
                    ->modalDescription('Verifikasi pembayaran untuk pesanan ini sebagai LUNAS? Status operasional akan dialihkan ke "Sedang Diproses & Disangrai".')
                    ->action(function (Order $record): void {
                        $record->update([
                            'payment_status' => 'paid',
                            'status' => in_array($record->status, ['pending', 'cancelled']) ? 'processing' : $record->status,
                            'paid_at' => now(),
                        ]);

                        Notification::make()
                            ->title("Pesanan {$record->order_number} Berhasil Dikonfirmasi Lunas!")
                            ->success()
                            ->send();
                    }),

                Action::make('update_resi')
                    ->label('Resi')
                    ->icon(Heroicon::Truck)
                    ->color('info')
                    ->modalHeading(fn (Order $record): string => "Update Kurir & Resi: {$record->order_number}")
                    ->form([
                        TextInput::make('shipping_courier')
                            ->label('Kurir Ekspedisi')
                            ->default(fn (Order $record) => $record->shipping_courier ?: 'JNE')
                            ->required(),
                        TextInput::make('tracking_number')
                            ->label('Nomor Resi Pengiriman')
                            ->default(fn (Order $record) => $record->tracking_number)
                            ->required(),
                        Toggle::make('mark_shipped')
                            ->label('Perbarui Status Pesanan Menjadi "Dalam Pengiriman"')
                            ->default(true),
                    ])
                    ->action(function (Order $record, array $data): void {
                        $record->update([
                            'shipping_courier' => $data['shipping_courier'],
                            'tracking_number' => $data['tracking_number'],
                            'status' => ($data['mark_shipped'] ?? false) ? 'shipped' : $record->status,
                        ]);

                        Notification::make()
                            ->title("Nomor Resi Pesanan {$record->order_number} Berhasil Diperbarui!")
                            ->success()
                            ->send();
                    }),

                Action::make('whatsapp_customer')
                    ->label('WA')
                    ->icon(Heroicon::ChatBubbleLeftRight)
                    ->color('success')
                    ->url(function (Order $record): string {
                        $phone = preg_replace('/[^0-9]/', '', (string) $record->customer_phone);
                        if (str_starts_with($phone, '0')) {
                            $phone = '62' . substr($phone, 1);
                        }

                        $record->loadMissing('items');
                        $itemsText = $record->items->map(fn ($i) => "- {$i->quantity}x {$i->product_name}" . ($i->variant_label ? " ({$i->variant_label})" : ''))->join("\n");
                        $totalFmt = number_format((float) $record->total_amount, 0, ',', '.');

                        $msg = "Halo Kak {$record->customer_name},\n\nTerima kasih telah berbelanja di *Alat Kopi Malang*! ☕\n\nNomor Pesanan: *{$record->order_number}*\nStatus: *{$record->status_label}*\nTotal: *Rp {$totalFmt}*\n\nDaftar Item:\n{$itemsText}\n";

                        if ($record->tracking_number) {
                            $msg .= "\nKurir: {$record->shipping_courier}\nNomor Resi: *{$record->tracking_number}*\n";
                        }

                        return "https://wa.me/{$phone}?text=" . urlencode($msg);
                    })
                    ->openUrlInNewTab(),

                Action::make('manage')
                    ->label('Kelola')
                    ->icon(Heroicon::PencilSquare)
                    ->color('primary')
                    ->url(fn (Order $record): string => OrderResource::getUrl('edit', ['record' => $record])),
            ])
            ->headerActions([
                Action::make('view_all_orders')
                    ->label('Lihat Semua Pesanan Masuk')
                    ->icon(Heroicon::InboxArrowDown)
                    ->color('primary')
                    ->url(fn (): string => OrderResource::getUrl()),

                Action::make('order_settings')
                    ->label('Pengaturan Pesanan')
                    ->icon(Heroicon::Cog6Tooth)
                    ->color('gray')
                    ->url(fn (): string => ManageOrderSettings::getUrl()),
            ])
            ->paginated([5, 10, 20])
            ->defaultPaginationPageOption(5);
    }
}
