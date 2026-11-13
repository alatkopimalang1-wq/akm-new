<?php

namespace Database\Seeders;

use App\Models\HeroBanner;
use Illuminate\Database\Seeder;

class HeroBannerSeeder extends Seeder
{
    public function run(): void
    {
        $banners = [
            [
                'title' => 'Sanubari Roastery Official Gear Partner',
                'subtitle' => 'Pusat Kurasi Peralatan Seduh, Grinder Presisi & Mesin Espresso Terbaik di Malang.',
                'badge' => 'OFFICIAL PARTNER',
                'image' => '/slides/dirty-latte-banner.jpg',
                'link_url' => '#catalog',
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'title' => 'Experience Showroom & Testing Station',
                'subtitle' => 'Uji coba langsung mesin lever Flair 58, Timemore Sculptor, dan ragam dripper di Slow Bar kami.',
                'badge' => 'SHOWROOM MALANG',
                'image' => '/images/article_showroom.jpg',
                'link_url' => '#showroom',
                'sort_order' => 2,
                'is_active' => true,
            ],
        ];

        foreach ($banners as $b) {
            HeroBanner::updateOrCreate(['title' => $b['title']], $b);
        }
    }
}

