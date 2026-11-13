<?php

namespace App\Filament\Resources\Orders\Tables;

use App\Models\Order;
use App\Services\ShippingService;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class OrdersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('order_number')
                    ->label('No. Pesanan')
                    ->searchable()
                    ->sortable()
                    ->weight('bold')
                    ->copyable(),
                TextColumn::make('customer_name')
                    ->label('Pelanggan')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('customer_phone')
                    ->label('WhatsApp')
                    ->searchable(),
                TextColumn::make('payment_method')
                    ->label('Metode Bayar')
                    ->badge()
                    ->formatStateUsing(fn (string $state, $record): string => match ($state) {
                        'qris' => 'QRIS Toko',
                        'bank_transfer' => 'Transfer ' . strtoupper((string) ($record->payment_channel ?? 'Bank')),
                        'whatsapp' => 'WhatsApp',
                        default => ucfirst($state),
                    })
                    ->color(fn (string $state): string => match ($state) {
                        'qris' => 'primary',
                        'bank_transfer' => 'info',
                        default => 'gray',
                    }),
                TextColumn::make('shipping_courier')
                    ->label('Metode Kirim / Ambil')
                    ->badge()
                    ->color(fn ($state) => str_contains(strtolower((string) $state), 'ambil') ? 'warning' : 'secondary')
                    ->formatStateUsing(fn ($state, $record) => $state ? "{$state} ({$record->shipping_service})" : '-'),
                TextColumn::make('tracking_number')
                    ->label('No. Resi (AWB)')
                    ->badge()
                    ->color('info')
                    ->placeholder('-')
                    ->copyable()
                    ->searchable(),
                TextColumn::make('total_amount')
                    ->label('Total Tagihan')
                    ->money('IDR', locale: 'id')
                    ->sortable()
                    ->weight('bold'),
                TextColumn::make('payment_status')
                    ->label('Status Bayar')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'paid' => 'success',
                        'verifying' => 'warning',
                        'cancelled' => 'danger',
                        default => 'gray',
                    })
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'pending' => 'Belum Bayar',
                        'verifying' => 'Cek Mutasi/Bukti',
                        'paid' => 'Lunas',
                        'cancelled' => 'Batal',
                        default => ucfirst($state),
                    }),
                ImageColumn::make('payment_proof')
                    ->label('Bukti Transfer')
                    ->disk('public')
                    ->circular(),
                TextColumn::make('status')
                    ->label('Status Order')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'processing' => 'warning',
                        'ready_for_pickup' => 'primary',
                        'shipped' => 'info',
                        'completed' => 'success',
                        'cancelled' => 'danger',
                        default => 'gray',
                    })
                    ->formatStateUsing(fn (string $state, $record): string => match ($state) {
                        'pending' => 'Pending',
                        'processing' => 'Diproses',
                        'ready_for_pickup' => 'Siap Diambil di Toko',
                        'shipped' => ($record->shipping_courier === 'Ambil di Toko' ? 'Siap Diambil' : 'Dikirim'),
                        'completed' => 'Selesai',
                        'cancelled' => 'Batal',
                        default => ucfirst($state),
                    }),
                TextColumn::make('created_at')
                    ->label('Waktu Pemesanan')
                    ->dateTime('d M Y, H:i')
                    ->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                SelectFilter::make('payment_status')
                    ->label('Status Pembayaran')
                    ->options([
                        'pending' => 'Belum Bayar',
                        'verifying' => 'Menunggu Verifikasi',
                        'paid' => 'Lunas',
                        'cancelled' => 'Batal',
                    ]),
                SelectFilter::make('payment_method')
                    ->label('Metode Bayar')
                    ->options([
                        'qris' => 'QRIS Toko',
                        'bank_transfer' => 'Transfer Bank',
                        'whatsapp' => 'WhatsApp Order',
                    ]),
                SelectFilter::make('status')
                    ->label('Status Pesanan')
                    ->options([
                        'pending' => 'Pending',
                        'processing' => 'Diproses',
                        'shipped' => 'Dikirim',
                        'completed' => 'Selesai',
                        'cancelled' => 'Batal',
                    ]),
            ])
            ->actions([
                // 1. Buat Resi (AWB) RajaOngkir
                Action::make('createShipment')
                    ->label(fn (Order $record) => $record->tracking_number ? 'Ubah AWB' : 'Buat Resi (AWB)')
                    ->icon(Heroicon::PaperAirplane)
                    ->color('success')
                    ->tooltip('Terbitkan nomor resi otomatis (Air Waybill) untuk pesanan ini')
                    ->visible(fn (Order $record) => ! str_contains(strtolower((string) $record->shipping_courier), 'ambil'))
                    ->requiresConfirmation()
                    ->modalHeading('Terbitkan Air Waybill (AWB) RajaOngkir')
                    ->modalDescription(fn (Order $record) => "Terbitkan resi resmi untuk pesanan {$record->order_number} ({$record->shipping_courier} - {$record->shipping_service})?")
                    ->action(function (Order $record) {
                        $res = ShippingService::createShipmentOrder($record);
                        Notification::make()
                            ->title('Resi Berhasil Diterbitkan!')
                            ->body($res['message'])
                            ->success()
                            ->duration(6000)
                            ->send();
                    }),

                // 2. Request Pick Up Kurir
                Action::make('requestPickup')
                    ->label('Request Pick Up')
                    ->icon(Heroicon::Truck)
                    ->color('primary')
                    ->tooltip('Jadwalkan kurir ekspedisi untuk menjemput paket di roastery')
                    ->visible(fn (Order $record) => ! str_contains(strtolower((string) $record->shipping_courier), 'ambil'))
                    ->modalHeading('Jadwal Request Pick Up Kurir Ekspedisi')
                    ->modalDescription(fn (Order $record) => "Atur jadwal penjemputan paket untuk pesanan {$record->order_number} ({$record->shipping_courier}).")
                    ->form([
                        DatePicker::make('pickup_date')
                            ->label('Tanggal Penjemputan')
                            ->default(now()->format('Y-m-d'))
                            ->required(),
                        Select::make('pickup_time')
                            ->label('Jendela Waktu Pick Up')
                            ->options([
                                '09:00 - 12:00' => 'Pagi (09:00 - 12:00 WIB)',
                                '13:00 - 16:00' => 'Siang (13:00 - 16:00 WIB)',
                                '16:00 - 19:00' => 'Sore (16:00 - 19:00 WIB)',
                            ])
                            ->default('13:00 - 16:00')
                            ->required(),
                        Select::make('vehicle')
                            ->label('Tipe Kendaraan Kurir')
                            ->options([
                                'Motor' => 'Motor (Paket Reguler)',
                                'Mobil' => 'Mobil / Van (Paket Sedang)',
                                'Truk' => 'Truk Box (Grosir)',
                            ])
                            ->default('Motor')
                            ->required(),
                        TextInput::make('notes')
                            ->label('Catatan untuk Driver')
                            ->default('Paket biji kopi Sanubari Roastery (Fragile). Ambil di bar kasir.')
                            ->required(),
                    ])
                    ->action(function (Order $record, array $data) {
                        $res = ShippingService::requestCourierPickup($record, $data);
                        Notification::make()
                            ->title('Request Pick Up Kurir Dijadwalkan!')
                            ->body($res['message'])
                            ->success()
                            ->duration(8000)
                            ->send();
                    }),

                // 3. Cetak Label Pengiriman Thermal AWB (100x150 mm)
                Action::make('printLabel')
                    ->label('Cetak Label AWB')
                    ->icon(Heroicon::Printer)
                    ->color('warning')
                    ->tooltip('Buka label pengiriman siap cetak ukuran printer termal 100x150 mm')
                    ->url(fn (Order $record) => route('orders.shipping-label', ['orderNumber' => $record->order_number]))
                    ->openUrlInNewTab(),

                // 4. Lacak Resi Live (Cek Resi RajaOngkir Pro)
                Action::make('trackWaybill')
                    ->label('Lacak Resi')
                    ->icon(Heroicon::MagnifyingGlass)
                    ->color('info')
                    ->tooltip('Cek status & timeline perjalanan paket dari RajaOngkir secara real-time')
                    ->visible(fn (Order $record) => ! empty($record->tracking_number))
                    ->modalHeading(fn (Order $record) => "Status Lacak Resi: {$record->tracking_number}")
                    ->modalContent(fn (Order $record) => view('filament.orders.track-modal', [
                        'order' => $record,
                        'tracking' => ShippingService::trackWaybill(
                            $record->tracking_number,
                            $record->shipping_courier,
                            $record->customer_phone
                        ),
                    ]))
                    ->modalSubmitAction(false)
                    ->modalCancelActionLabel('Tutup'),

                EditAction::make(),
            ])
            ->bulkActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
