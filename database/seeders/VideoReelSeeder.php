<?php

namespace Database\Seeders;

use App\Models\VideoReel;
use Illuminate\Database\Seeder;

class VideoReelSeeder extends Seeder
{
    public function run(): void
    {
        $reels = [
            [
                'headline' => 'Kalo Mesin Espresso Diperkecil, Maka Jadi Segini..',
                'caption' => 'Kalau mesin espresso bisa diperkecil, maka akan jadi portabel dan praktis dibawa seduh di mana saja...',
                'badge' => 'BARISTA APPROVED! ☕🔥',
                'thumbnail' => 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=800&q=80',
                'video_url' => 'https://www.instagram.com/sanubari.roastery.mlg/',
                'product_count' => 2,
                'products' => [
                    [
                        'id' => 1,
                        'name' => 'Portable Mini Espresso Maker',
                        'price' => 'Rp 680.000',
                        'image' => 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80',
                        'url' => '/shop?category=espresso-beans',
                    ],
                    [
                        'id' => 2,
                        'name' => 'Sanubari Signature Houseblend Espresso 200gr',
                        'price' => 'Rp 85.000',
                        'image' => 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=400&q=80',
                        'url' => '/shop?category=espresso-beans',
                    ],
                ],
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'headline' => 'Sekarang jadi ngerti alasan kenapa orang yang kesurupan selalu minta kopi',
                'caption' => 'Sekarang mulai paham alasan kenapa yang kesurupan selalu minta kopi hitam pekat dengan aroma tajam...',
                'badge' => null,
                'thumbnail' => 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80',
                'video_url' => 'https://www.instagram.com/sanubari.roastery.mlg/',
                'product_count' => 2,
                'products' => [
                    [
                        'id' => 3,
                        'name' => 'Kopi Tubruk Lereng Kawi Tradisional 250gr',
                        'price' => 'Rp 45.000',
                        'image' => 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=400&q=80',
                        'url' => '/shop?series=kawi',
                    ],
                    [
                        'id' => 4,
                        'name' => 'Robusta Dampit Malang Dark Roast 200gr',
                        'price' => 'Rp 48.000',
                        'image' => 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=400&q=80',
                        'url' => '/shop',
                    ],
                ],
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'headline' => 'Review tombol yang ada di mesin kopi Kees Van Der!',
                'caption' => 'Review tombol-tombol yg ada di mesinnya orang have. Kees Van Der Weston Spirit & Mirage commercial grade...',
                'badge' => null,
                'thumbnail' => 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=800&q=80',
                'video_url' => 'https://www.instagram.com/sanubari.roastery.mlg/',
                'product_count' => 1,
                'products' => [
                    [
                        'id' => 5,
                        'name' => 'Konsultasi Mesin Komersial & Showroom Alat Kopi',
                        'price' => 'Hubungi Admin',
                        'image' => 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=400&q=80',
                        'url' => '/kunjungi',
                    ],
                ],
                'sort_order' => 3,
                'is_active' => true,
            ],
            [
                'headline' => 'Campur 2 Single Origin Sendiri Buat Espresso, Rasanya Aneh Nggak?',
                'caption' => 'Campur 2 Single Origin Buat Espresso, Rasanya Enak dan unik banget pakai fitur C.Y.B.R Sanubari...',
                'badge' => null,
                'thumbnail' => 'https://images.unsplash.com/photo-1589396575653-c09c794ff6a6?auto=format&fit=crop&w=800&q=80',
                'video_url' => 'https://www.instagram.com/sanubari.roastery.mlg/',
                'product_count' => 2,
                'products' => [
                    [
                        'id' => 6,
                        'name' => 'C.Y.B.R: Custom Coffee Blend Studio',
                        'price' => 'Mulai Rp 65.000',
                        'image' => 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=400&q=80',
                        'url' => '/cybr',
                    ],
                    [
                        'id' => 7,
                        'name' => 'Arabika Gunung Kawi Honey Anaerobic 200gr',
                        'price' => 'Rp 95.000',
                        'image' => 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80',
                        'url' => '/shop?series=kawi',
                    ],
                ],
                'sort_order' => 4,
                'is_active' => true,
            ],
        ];

        foreach ($reels as $data) {
            VideoReel::updateOrCreate(
                ['headline' => $data['headline']],
                $data
            );
        }
    }
}

