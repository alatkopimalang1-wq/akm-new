<?php

namespace App\Filament\Widgets;

use App\Models\WebsiteVisit;
use Carbon\Carbon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

class ActivePagesRealtimeWidget extends BaseWidget
{
    protected static ?string $heading = 'Halaman Terpopuler & Aktivitas Terkini (Real-Time)';

    protected ?string $pollingInterval = '10s';

    protected static ?int $sort = 3;

    protected int|string|array $columnSpan = 'full';

    public function table(Table $table): Table
    {
        return $table
            ->query(
                WebsiteVisit::query()
                    ->select([
                        DB::raw('MIN(id) as id'),
                        'url',
                        DB::raw('COUNT(*) as views_count'),
                        DB::raw('COUNT(DISTINCT visitor_id) as visitors_count'),
                        DB::raw('MAX(last_activity_at) as latest_activity'),
                    ])
                    ->whereDate('created_at', Carbon::today())
                    ->groupBy('url')
                    ->orderByDesc('views_count')
            )
            ->columns([
                TextColumn::make('url')
                    ->label('Halaman / URL')
                    ->formatStateUsing(function (string $state): string {
                        $labels = [
                            '/' => '🏠 Beranda (Home)',
                            '/shop' => '☕ Katalog Produk & Kopi (/shop)',
                            '/coffee-catering' => '🎉 Coffee Catering (/coffee-catering)',
                            '/byob' => '🎨 Custom Blend CYBR (/byob)',
                            '/cybr' => '🎨 Custom Blend CYBR (/cybr)',
                            '/booking-tempat' => '🏢 Booking Tempat & Venue (/booking-tempat)',
                            '/panduan-seduh' => '📖 Resep & Panduan Seduh (/panduan-seduh)',
                            '/kunjungi' => '📍 Kunjungi Kedai & Slow Bar (/kunjungi)',
                            '/wholesale' => '🤝 B2B & Wholesale (/wholesale)',
                            '/jasa-roasting' => '🔥 Jasa Roasting Kopi (/jasa-roasting)',
                        ];

                        return $labels[$state] ?? $state;
                    })
                    ->searchable(),

                TextColumn::make('views_count')
                    ->label('Total Tayangan (Views)')
                    ->badge()
                    ->color('primary')
                    ->sortable(),

                TextColumn::make('visitors_count')
                    ->label('Pengunjung Unik')
                    ->badge()
                    ->color('success')
                    ->sortable(),

                TextColumn::make('latest_activity')
                    ->label('Aktivitas Terakhir')
                    ->dateTime('H:i:s (d M)')
                    ->sortable(),
            ])
            ->paginated([5, 10, 25])
            ->defaultPaginationPageOption(5);
    }
}
