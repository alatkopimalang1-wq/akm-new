<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use Carbon\Carbon;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class RealtimeIncomingOrdersOverview extends BaseWidget
{
    protected ?string $pollingInterval = '5s';

    protected static ?int $sort = 1;

    protected function getStats(): array
    {
        $today = Carbon::today();

        $pendingCount = Order::where('status', 'pending')->count();
        $verifyingCount = Order::where('payment_status', 'verifying')->count();
        $preorderCount = Order::where(function ($q) {
            $q->where('payment_details->has_preorder', true)
              ->orWhere('payment_details->is_preorder_dp', true);
        })->whereIn('status', ['pending', 'processing'])->count();

        $todayOrdersCount = Order::whereDate('created_at', $today)->count();
        $todayRevenue = (float) Order::whereDate('created_at', $today)
            ->where('payment_status', 'paid')
            ->sum('total_amount');

        // Sparkline for orders in the last 7 days
        $sparkline = [];
        for ($i = 6; $i >= 0; $i--) {
            $day = Carbon::today()->subDays($i);
            $sparkline[] = Order::whereDate('created_at', $day)->count();
        }

        return [
            Stat::make('Pesanan Baru Masuk (Pending)', number_format($pendingCount))
                ->description($pendingCount > 0 ? "🔔 {$pendingCount} pesanan menunggu konfirmasi" : 'Semua pesanan terkonfirmasi')
                ->descriptionIcon('heroicon-m-inbox-arrow-down')
                ->color($pendingCount > 0 ? 'warning' : 'success')
                ->chart($sparkline),

            Stat::make('Perlu Verifikasi Bukti Bayar', number_format($verifyingCount))
                ->description($verifyingCount > 0 ? "📸 {$verifyingCount} bukti transfer siap dicek" : 'Tidak ada antrean verifikasi')
                ->descriptionIcon('heroicon-m-clipboard-document-check')
                ->color($verifyingCount > 0 ? 'danger' : 'success'),

            Stat::make('Pre-Order (DP) Aktif', number_format($preorderCount))
                ->description("⏳ {$preorderCount} pesanan indent / roasting berjalan")
                ->descriptionIcon('heroicon-m-clock')
                ->color('warning'),

            Stat::make('Omzet Lunas Hari Ini', 'Rp ' . number_format($todayRevenue, 0, ',', '.'))
                ->description("{$todayOrdersCount} total pesanan masuk hari ini")
                ->descriptionIcon('heroicon-m-banknotes')
                ->color('success'),
        ];
    }
}
