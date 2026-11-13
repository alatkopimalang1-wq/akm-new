<?php

namespace App\Filament\Resources\Orders\Pages;

use App\Filament\Concerns\RedirectsToPreviousUrl;
use App\Filament\Resources\Orders\OrderResource;
use App\Models\Order;
use App\Services\ShippingService;
use Filament\Actions\Action;
use Filament\Actions\DeleteAction;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\EditRecord;
use Filament\Support\Icons\Heroicon;

class EditOrder extends EditRecord
{
    use RedirectsToPreviousUrl;

    protected static string $resource = OrderResource::class;

    protected function getHeaderActions(): array
    {
        return [
            // 1. Cetak Label AWB Thermal
            Action::make('printLabel')
                ->label('Cetak Label AWB')
                ->icon(Heroicon::Printer)
                ->color('warning')
                ->url(fn (Order $record) => route('orders.shipping-label', ['orderNumber' => $record->order_number]))
                ->openUrlInNewTab(),

            // 2. Lacak Resi Live
            Action::make('trackWaybill')
                ->label('Lacak Resi Live')
                ->icon(Heroicon::MagnifyingGlass)
                ->color('info')
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

            // 3. Request Pick Up Kurir
            Action::make('requestPickup')
                ->label('Request Pick Up Kurir')
                ->icon(Heroicon::Truck)
                ->color('primary')
                ->visible(fn (Order $record) => ! str_contains(strtolower((string) $record->shipping_courier), 'ambil'))
                ->modalHeading('Jadwal Request Pick Up Kurir Ekspedisi')
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
                        ->default('Paket biji kopi Alat Kopi Malang (Fragile). Ambil di bar kasir.')
                        ->required(),
                ])
                ->action(function (Order $record, array $data) {
                    $res = ShippingService::requestCourierPickup($record, $data);
                    Notification::make()
                        ->title('Request Pick Up Kurir Dijadwalkan!')
                        ->body($res['message'])
                        ->success()
                        ->send();
                }),

            // 4. Terbitkan AWB
            Action::make('createShipment')
                ->label(fn (Order $record) => $record->tracking_number ? 'Perbarui AWB' : 'Buat Resi (AWB)')
                ->icon(Heroicon::PaperAirplane)
                ->color('success')
                ->visible(fn (Order $record) => ! str_contains(strtolower((string) $record->shipping_courier), 'ambil'))
                ->requiresConfirmation()
                ->modalHeading('Terbitkan Air Waybill (AWB) RajaOngkir')
                ->action(function (Order $record) {
                    $res = ShippingService::createShipmentOrder($record);
                    Notification::make()
                        ->title('Resi Berhasil Diterbitkan!')
                        ->body($res['message'])
                        ->success()
                        ->send();
                }),

            DeleteAction::make(),
        ];
    }
}
