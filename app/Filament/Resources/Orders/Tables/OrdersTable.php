<?php

namespace App\Filament\Resources\Orders\Tables;

use App\Models\Order;
use Filament\Actions\Action;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Notifications\Notification;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\Filter;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class OrdersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->poll('5s')
            ->defaultSort('id', 'desc')
            ->columns([
                TextColumn::make('order_number')
                    ->label('No. Pesanan')
                    ->searchable()
                    ->copyable()
                    ->sortable()
                    ->description(function (Order $record): string {
                        $diff = $record->created_at ? $record->created_at->diffForHumans() : '';
                        $date = $record->created_at ? $record->created_at->format('d/m/Y H:i') : '';

                        return "{$diff} • {$date}";
                    })
                    ->badge(fn (Order $record) => $record->is_pickup ? 'Ambil di Toko' : ($record->payment_details['is_preorder_dp'] ?? false ? 'Pre-Order (DP)' : null))
                    ->color(fn (Order $record) => $record->is_pickup ? 'warning' : 'primary'),

                TextColumn::make('customer_name')
                    ->label('Pelanggan & Tujuan')
                    ->searchable(['customer_name', 'customer_phone', 'shipping_city', 'shipping_district'])
                    ->formatStateUsing(fn (Order $record) => $record->customer_name)
                    ->description(function (Order $record): string {
                        $loc = $record->is_pickup
                            ? '📍 Ambil di Gerai Malang'
                            : trim(($record->shipping_district ? $record->shipping_district . ', ' : '') . ($record->shipping_city ?: 'Malang'));
                        $phone = $record->customer_phone ?: '-';

                        return "📞 {$phone} • {$loc}";
                    })
                    ->wrap(),

                TextColumn::make('items_summary')
                    ->label('Daftar Produk')
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
                    ->wrap()
                    ->lineClamp(2),

                TextColumn::make('total_amount')
                    ->label('Total Tagihan')
                    ->money('IDR', locale: 'id')
                    ->sortable()
                    ->description(function (Order $record): ?string {
                        $details = $record->payment_details;
                        if (! empty($details['is_preorder_dp'])) {
                            $pct = $details['dp_percentage'] ?? 30;
                            $rem = number_format((float) ($details['remaining_balance'] ?? 0), 0, ',', '.');

                            return "DP {$pct}% • Sisa: Rp {$rem}";
                        }

                        return null;
                    }),

                TextColumn::make('payment_method')
                    ->label('Metode Bayar')
                    ->badge()
                    ->formatStateUsing(fn (Order $record): string => match ($record->payment_method) {
                        'qris' => 'QRIS Resmi',
                        'bank_transfer' => 'Transfer Bank (' . strtoupper((string) ($record->payment_channel ?? 'BCA')) . ')',
                        'whatsapp' => 'WhatsApp Order',
                        default => ucfirst((string) $record->payment_method),
                    })
                    ->color(fn (Order $record): string => match ($record->payment_method) {
                        'qris' => 'info',
                        'bank_transfer' => 'primary',
                        default => 'gray',
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

                TextColumn::make('tracking_number')
                    ->label('No. Resi Kurir')
                    ->placeholder('-')
                    ->copyable()
                    ->description(fn (Order $record): ?string => $record->shipping_courier ? "Kurir: {$record->shipping_courier}" : null)
                    ->toggleable(isToggledHiddenByDefault: false),
            ])
            ->filters([
                SelectFilter::make('status')
                    ->label('Filter Status Pesanan')
                    ->options([
                        'pending' => 'Menunggu Konfirmasi',
                        'processing' => 'Sedang Diproses',
                        'ready_for_pickup' => 'Siap Diambil di Roastery',
                        'shipped' => 'Dalam Pengiriman',
                        'completed' => 'Selesai',
                        'cancelled' => 'Dibatalkan',
                    ]),

                SelectFilter::make('payment_status')
                    ->label('Filter Status Pembayaran')
                    ->options([
                        'pending' => 'Menunggu Pembayaran',
                        'verifying' => 'Menunggu Verifikasi',
                        'paid' => 'Lunas',
                        'cancelled' => 'Dibatalkan',
                    ]),

                SelectFilter::make('payment_method')
                    ->label('Filter Metode Pembayaran')
                    ->options([
                        'qris' => 'QRIS Toko',
                        'bank_transfer' => 'Transfer Bank',
                        'whatsapp' => 'WhatsApp',
                    ]),

                Filter::make('is_preorder')
                    ->label('Khusus Pre-Order (DP)')
                    ->query(fn (Builder $query) => $query->where(function ($q) {
                        $q->where('payment_details->has_preorder', true)
                          ->orWhere('payment_details->is_preorder_dp', true);
                    })),

                Filter::make('is_pickup')
                    ->label('Khusus Ambil di Toko')
                    ->query(fn (Builder $query) => $query->where('shipping_courier', 'like', '%Ambil%')->orWhere('shipping_courier', 'like', '%Pickup%')),
            ])
            ->recordActions([
                Action::make('confirm_payment')
                    ->label('Konfirmasi Lunas')
                    ->icon(Heroicon::CheckCircle)
                    ->color('success')
                    ->visible(fn (Order $record): bool => $record->payment_status !== 'paid')
                    ->requiresConfirmation()
                    ->modalHeading('Konfirmasi Pembayaran Lunas')
                    ->modalDescription('Apakah Anda yakin ingin memverifikasi pembayaran pesanan ini sebagai LUNAS? Status pesanan akan otomatis dialihkan ke "Sedang Diproses & Disangrai".')
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

                Action::make('biteship_request')
                    ->label('Kirim via Biteship')
                    ->icon(Heroicon::Bolt)
                    ->color('warning')
                    ->visible(fn (Order $record): bool => ! $record->is_pickup && \App\Services\BiteshipService::isEnabled())
                    ->modalHeading(fn (Order $record): string => "Request Pickup & Resi Biteship: {$record->order_number}")
                    ->modalDescription('Sistem akan memanggil kurir via Biteship API untuk penjemputan paket ke roastery dan menerbitkan nomor resi otomatis.')
                    ->form([
                        Select::make('courier_company')
                            ->label('Pilihan Ekspedisi')
                            ->options([
                                'jne' => 'JNE Express',
                                'jnt' => 'J&T Express',
                                'sicepat' => 'SiCepat Ekspres',
                                'anteraja' => 'Anteraja',
                                'pos' => 'POS Indonesia',
                                'tiki' => 'TIKI',
                                'gojek' => 'Gojek (Instant / Same Day)',
                                'grab' => 'Grab (Instant)',
                            ])
                            ->default(function (Order $record): string {
                                $c = strtolower((string) $record->shipping_courier);
                                if (str_contains($c, 'j&t') || str_contains($c, 'jnt')) return 'jnt';
                                if (str_contains($c, 'sicepat')) return 'sicepat';
                                if (str_contains($c, 'anteraja')) return 'anteraja';
                                if (str_contains($c, 'pos')) return 'pos';
                                if (str_contains($c, 'tiki')) return 'tiki';
                                if (str_contains($c, 'gojek') || str_contains($c, 'gosend')) return 'gojek';
                                if (str_contains($c, 'grab')) return 'grab';
                                return 'jne';
                            })
                            ->required()
                            ->native(false),

                        Select::make('courier_type')
                            ->label('Layanan Pengiriman')
                            ->options([
                                'reg' => 'Reguler (Standar 1-3 Hari)',
                                'yes' => 'Express / Next Day (YES / 1 Hari)',
                                'jtr' => 'Kargo / Trucking (Barang Berat)',
                                'instant' => 'Instant Kurir (1-3 Jam)',
                                'same_day' => 'Same Day (Hari yang Sama)',
                            ])
                            ->default('reg')
                            ->required()
                            ->native(false),

                        TextInput::make('destination_postal_code')
                            ->label('Kode Pos Penerima')
                            ->default(fn (Order $record) => $record->shipping_postal_code ?: '65144')
                            ->required(),
                    ])
                    ->action(function (Order $record, array $data): void {
                        if (! empty($data['destination_postal_code'])) {
                            $record->shipping_postal_code = $data['destination_postal_code'];
                            $record->save();
                        }

                        $res = \App\Services\BiteshipService::createShipmentOrder(
                            $record,
                            $data['courier_company'],
                            $data['courier_type']
                        );

                        if ($res['success']) {
                            Notification::make()
                                ->title('Pesanan Berhasil Dikirim ke Biteship!')
                                ->body($res['message'])
                                ->success()
                                ->send();
                        } else {
                            Notification::make()
                                ->title('Gagal Request Biteship')
                                ->body($res['message'])
                                ->danger()
                                ->send();
                        }
                    }),

                Action::make('update_resi')
                    ->label('Input Resi')
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
                    ->label('Chat WA')
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

                        $msg = "Halo Kak {$record->customer_name},\n\nTerima kasih telah berbelanja di *Alat Kopi Malang*! ☕\n\nNomor Pesanan: *{$record->order_number}*\nStatus Pesanan: *{$record->status_label}*\nStatus Pembayaran: *{$record->payment_status_label}*\nTotal Tagihan: *Rp {$totalFmt}*\n\nDaftar Item:\n{$itemsText}\n";

                        if ($record->tracking_number) {
                            $msg .= "\nKurir: {$record->shipping_courier}\nNomor Resi: *{$record->tracking_number}*\n";
                        }

                        $msg .= "\nKami akan segera memproses dan mengabari Anda jika pesanan siap. Terima kasih banyak!";

                        return "https://wa.me/{$phone}?text=" . urlencode($msg);
                    })
                    ->openUrlInNewTab(),

                Action::make('view_invoice')
                    ->label('Invoice')
                    ->icon(Heroicon::DocumentText)
                    ->color('gray')
                    ->url(fn (Order $record): string => route('orders.invoice', ['orderNumber' => $record->order_number]))
                    ->openUrlInNewTab(),

                Action::make('view_shipping_label')
                    ->label('Label AWB')
                    ->icon(Heroicon::Printer)
                    ->color('gray')
                    ->url(fn (Order $record): string => route('orders.shipping-label', ['orderNumber' => $record->order_number]))
                    ->openUrlInNewTab(),

                EditAction::make()
                    ->label('Kelola / Edit'),
            ]);
    }
}
