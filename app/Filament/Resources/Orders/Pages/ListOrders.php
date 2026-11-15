<?php

namespace App\Filament\Resources\Orders\Pages;

use App\Filament\Pages\ManageOrderSettings;
use App\Filament\Resources\Orders\OrderResource;
use App\Models\Order;
use Filament\Actions\Action;
use Filament\Resources\Pages\ListRecords;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Support\Icons\Heroicon;
use Illuminate\Database\Eloquent\Builder;

class ListOrders extends ListRecords
{
    protected static string $resource = OrderResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Action::make('settings')
                ->label('Pengaturan Pesanan Masuk')
                ->icon(Heroicon::Cog6Tooth)
                ->color('gray')
                ->url(fn (): string => ManageOrderSettings::getUrl()),

            Action::make('track_order')
                ->label('Halaman Lacak Pesanan')
                ->icon(Heroicon::MagnifyingGlass)
                ->color('gray')
                ->url('/lacak-pesanan')
                ->openUrlInNewTab(),

            Action::make('view_shop')
                ->label('Buka Toko Online')
                ->icon(Heroicon::ArrowTopRightOnSquare)
                ->color('info')
                ->url('/shop')
                ->openUrlInNewTab(),
        ];
    }

    public function getTabs(): array
    {
        $pendingCount = Order::where('status', 'pending')->count();
        $verifyingCount = Order::where('payment_status', 'verifying')->count();
        $processingCount = Order::where('status', 'processing')->count();
        $preorderCount = Order::where(function ($q) {
            $q->where('payment_details->has_preorder', true)
              ->orWhere('payment_details->is_preorder_dp', true);
        })->count();
        $shippingCount = Order::whereIn('status', ['ready_for_pickup', 'shipped'])->count();

        return [
            'all' => Tab::make('Semua Pesanan')
                ->badge(Order::count())
                ->badgeColor('gray'),

            'pending' => Tab::make('Baru Masuk (Pending)')
                ->badge($pendingCount > 0 ? (string) $pendingCount : null)
                ->badgeColor('warning')
                ->query(fn (Builder $query) => $query->where('status', 'pending')),

            'verifying' => Tab::make('Verifikasi Bukti Bayar')
                ->badge($verifyingCount > 0 ? (string) $verifyingCount : null)
                ->badgeColor('danger')
                ->query(fn (Builder $query) => $query->where('payment_status', 'verifying')),

            'preorder_dp' => Tab::make('Pre-Order (DP)')
                ->badge($preorderCount > 0 ? (string) $preorderCount : null)
                ->badgeColor('warning')
                ->query(fn (Builder $query) => $query->where(function ($q) {
                    $q->where('payment_details->has_preorder', true)
                      ->orWhere('payment_details->is_preorder_dp', true);
                })),

            'processing' => Tab::make('Sedang Diproses')
                ->badge($processingCount > 0 ? (string) $processingCount : null)
                ->badgeColor('info')
                ->query(fn (Builder $query) => $query->where('status', 'processing')),

            'shipped' => Tab::make('Siap / Dikirim')
                ->badge($shippingCount > 0 ? (string) $shippingCount : null)
                ->badgeColor('primary')
                ->query(fn (Builder $query) => $query->whereIn('status', ['ready_for_pickup', 'shipped'])),

            'completed' => Tab::make('Selesai')
                ->badgeColor('success')
                ->query(fn (Builder $query) => $query->where('status', 'completed')),

            'cancelled' => Tab::make('Dibatalkan')
                ->badgeColor('danger')
                ->query(fn (Builder $query) => $query->where('status', 'cancelled')),
        ];
    }
}
