<?php

namespace App\Filament\Widgets;

use App\Models\WebsiteVisit;
use Carbon\Carbon;
use Filament\Widgets\ChartWidget;

class VisitorTrafficChart extends ChartWidget
{
    protected ?string $heading = 'Grafik Tren Kunjungan Website (Real-Time)';

    protected ?string $pollingInterval = '15s';

    protected static ?int $sort = 2;

    public ?string $filter = 'today';

    protected function getFilters(): ?array
    {
        return [
            'today' => 'Hari Ini (Per Jam)',
            'week' => '7 Hari Terakhir',
            'month' => '30 Hari Terakhir',
        ];
    }

    protected function getData(): array
    {
        $filter = $this->filter;

        if ($filter === 'week') {
            $labels = [];
            $views = [];
            $visitors = [];
            for ($i = 6; $i >= 0; $i--) {
                $date = Carbon::today()->subDays($i);
                $labels[] = $date->translatedFormat('D, d M');
                $views[] = WebsiteVisit::whereDate('created_at', $date)->count();
                $visitors[] = WebsiteVisit::whereDate('created_at', $date)->distinct('visitor_id')->count('visitor_id');
            }
        } elseif ($filter === 'month') {
            $labels = [];
            $views = [];
            $visitors = [];
            for ($i = 29; $i >= 0; $i--) {
                $date = Carbon::today()->subDays($i);
                if ($i % 3 === 0 || $i === 0) {
                    $labels[] = $date->format('d M');
                } else {
                    $labels[] = '';
                }
                $views[] = WebsiteVisit::whereDate('created_at', $date)->count();
                $visitors[] = WebsiteVisit::whereDate('created_at', $date)->distinct('visitor_id')->count('visitor_id');
            }
        } else {
            // Today hourly
            $labels = [];
            $views = [];
            $visitors = [];
            $currentHour = (int) Carbon::now()->format('H');
            for ($h = 0; $h <= $currentHour; $h++) {
                $labels[] = sprintf('%02d:00', $h);
                $from = Carbon::today()->addHours($h);
                $to = Carbon::today()->addHours($h + 1);
                $views[] = WebsiteVisit::whereBetween('created_at', [$from, $to])->count();
                $visitors[] = WebsiteVisit::whereBetween('created_at', [$from, $to])->distinct('visitor_id')->count('visitor_id');
            }
        }

        return [
            'datasets' => [
                [
                    'label' => 'Total Tayangan Halaman (Page Views)',
                    'data' => $views,
                    'borderColor' => '#f59e0b',
                    'backgroundColor' => 'rgba(245, 158, 11, 0.15)',
                    'fill' => true,
                    'tension' => 0.3,
                ],
                [
                    'label' => 'Pengunjung Unik (Unique Visitors)',
                    'data' => $visitors,
                    'borderColor' => '#10b981',
                    'backgroundColor' => 'rgba(16, 185, 129, 0.15)',
                    'fill' => true,
                    'tension' => 0.3,
                ],
            ],
            'labels' => $labels,
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }
}
