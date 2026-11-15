<?php

namespace App\Filament\Resources\Orders\Pages;

use App\Filament\Concerns\RedirectsToPreviousUrl;
use App\Filament\Resources\Orders\OrderResource;
use App\Models\Order;
use Filament\Actions\Action;
use Filament\Actions\DeleteAction;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\EditRecord;
use Filament\Support\Icons\Heroicon;

class EditOrder extends EditRecord
{
    use RedirectsToPreviousUrl;

    protected static string $resource = OrderResource::class;

    protected function getHeaderActions(): array
    {
        /** @var Order $record */
        $record = $this->getRecord();

        return [
            Action::make('confirm_payment')
                ->label('Tandai Lunas & Proses')
                ->icon(Heroicon::CheckCircle)
                ->color('success')
                ->visible(fn (): bool => $record->payment_status !== 'paid')
                ->requiresConfirmation()
                ->modalHeading('Verifikasi Pembayaran Lunas')
                ->modalDescription('Apakah pembayaran untuk pesanan ini telah diverifikasi masuk ke rekening? Status pesanan akan diubah menjadi "Sedang Diproses & Disangrai".')
                ->action(function () use ($record) {
                    $record->update([
                        'payment_status' => 'paid',
                        'status' => in_array($record->status, ['pending', 'cancelled']) ? 'processing' : $record->status,
                        'paid_at' => now(),
                    ]);

                    Notification::make()
                        ->title("Pesanan {$record->order_number} Berhasil Ditandai Lunas!")
                        ->success()
                        ->send();

                    $this->fillForm();
                }),

            Action::make('whatsapp_customer')
                ->label('Chat WhatsApp')
                ->icon(Heroicon::ChatBubbleLeftRight)
                ->color('success')
                ->url(function () use ($record): string {
                    $phone = preg_replace('/[^0-9]/', '', (string) $record->customer_phone);
                    if (str_starts_with($phone, '0')) {
                        $phone = '62' . substr($phone, 1);
                    }

                    $record->loadMissing('items');
                    $itemsText = $record->items->map(fn ($i) => "- {$i->quantity}x {$i->product_name}" . ($i->variant_label ? " ({$i->variant_label})" : ''))->join("\n");
                    $totalFmt = number_format((float) $record->total_amount, 0, ',', '.');

                    $msg = "Halo Kak {$record->customer_name},\n\nTerima kasih telah berbelanja di *Alat Kopi Malang*! ☕\n\nNomor Pesanan: *{$record->order_number}*\nStatus: *{$record->status_label}*\nTotal Tagihan: *Rp {$totalFmt}*\n\nDaftar Item:\n{$itemsText}\n";

                    if ($record->tracking_number) {
                        $msg .= "\nKurir: {$record->shipping_courier}\nNomor Resi: *{$record->tracking_number}*\n";
                    }

                    $msg .= "\nAda yang bisa kami bantu mengenai pesanan Anda? Terima kasih!";

                    return "https://wa.me/{$phone}?text=" . urlencode($msg);
                })
                ->openUrlInNewTab(),

            Action::make('view_invoice')
                ->label('Invoice')
                ->icon(Heroicon::DocumentText)
                ->color('gray')
                ->url(fn (): string => route('orders.invoice', ['orderNumber' => $record->order_number]))
                ->openUrlInNewTab(),

            Action::make('shipping_label')
                ->label('Label AWB')
                ->icon(Heroicon::Printer)
                ->color('gray')
                ->url(fn (): string => route('orders.shipping-label', ['orderNumber' => $record->order_number]))
                ->openUrlInNewTab(),

            Action::make('customer_page')
                ->label('Tampilan Pelanggan')
                ->icon(Heroicon::ArrowTopRightOnSquare)
                ->color('gray')
                ->url(fn (): string => route('orders.show', ['orderNumber' => $record->order_number]))
                ->openUrlInNewTab(),

            DeleteAction::make(),
        ];
    }
}
