<?php

namespace App\Filament\Widgets;

use App\Models\WebsiteVisit;
use Carbon\Carbon;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class RealtimeVisitorOverview extends BaseWidget
{
    protected ?string $pollingInterval = '5s';

    protected static ?int $sort = 1;

    protected function getStats(): array
    {
        $onlineCount = WebsiteVisit::getOnlineVisitorsCount(5);
        $todayUnique = WebsiteVisit::getTodayUniqueVisitorsCount();
        $todayViews = WebsiteVisit::getTodayPageViewsCount();
        $yesterdayUnique = WebsiteVisit::yesterday()->distinct('visitor_id')->count('visitor_id');

        // Sparkline for online activity (last 7 intervals of 10 minutes)
        $sparkline = [];
        for ($i = 6; $i >= 0; $i--) {
            $from = Carbon::now()->subMinutes(($i + 1) * 10);
            $to = Carbon::now()->subMinutes($i * 10);
            $sparkline[] = WebsiteVisit::whereBetween('created_at', [$from, $to])
                ->distinct('visitor_id')
                ->count('visitor_id');
        }

        // Percentage change compared to yesterday
        if ($yesterdayUnique > 0) {
            $diff = (($todayUnique - $yesterdayUnique) / $yesterdayUnique) * 100;
            $diffText = ($diff >= 0 ? '+' : '') . round($diff, 1) . '% vs kemarin';
            $diffIcon = $diff >= 0 ? 'heroicon-m-arrow-trending-up' : 'heroicon-m-arrow-trending-down';
            $diffColor = $diff >= 0 ? 'success' : 'danger';
        } else {
            $diffText = 'Hari ini';
            $diffIcon = 'heroicon-m-arrow-trending-up';
            $diffColor = 'success';
        }

        // Device breakdown for today
        $mobileCount = WebsiteVisit::today()->where('device', 'mobile')->distinct('visitor_id')->count('visitor_id');
        $desktopCount = WebsiteVisit::today()->where('device', 'desktop')->distinct('visitor_id')->count('visitor_id');
        $tabletCount = WebsiteVisit::today()->where('device', 'tablet')->distinct('visitor_id')->count('visitor_id');

        $mobilePercent = $todayUnique > 0 ? round(($mobileCount / max(1, $todayUnique)) * 100) : 0;

        return [
            Stat::make('Pengunjung Online (Live)', number_format($onlineCount))
                ->description('🟢 Aktif dalam 5 menit terakhir')
                ->descriptionIcon('heroicon-m-signal')
                ->color('success')
                ->chart($sparkline),

            Stat::make('Pengunjung Unik Hari Ini', number_format($todayUnique))
                ->description($diffText)
                ->descriptionIcon($diffIcon)
                ->color($diffColor),

            Stat::make('Total Page Views Hari Ini', number_format($todayViews))
                ->description('Total tayangan halaman dibuka')
                ->descriptionIcon('heroicon-m-eye')
                ->color('info'),

            Stat::make('Perangkat Terbanyak', "{$mobilePercent}% Mobile")
                ->description("{$mobileCount} Mobile • {$desktopCount} Desktop" . ($tabletCount > 0 ? " • {$tabletCount} Tablet" : ''))
                ->descriptionIcon('heroicon-m-device-phone-mobile')
                ->color('warning'),
        ];
    }
}
