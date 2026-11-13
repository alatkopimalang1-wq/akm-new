<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Manual Brew',
                'slug' => 'manual-brew',
                'icon' => 'coffee',
                'description' => 'Dripper Pour Over, Server Kaca & Alat Seduh Lambat',
                'sort_order' => 1,
            ],
            [
                'name' => 'Grinder Kopi',
                'slug' => 'grinder',
                'icon' => 'cog',
                'description' => 'Hand Grinder Presisi Tinggi dengan Mata Burr CNC',
                'sort_order' => 2,
            ],
            [
                'name' => 'Espresso & Lever',
                'slug' => 'espresso-tools',
                'icon' => 'flame',
                'description' => 'Mesin Manual Lever 9-Bar & Aksesoris Barista 58mm',
                'sort_order' => 3,
            ],
            [
                'name' => 'Kettle Gooseneck',
                'slug' => 'kettle',
                'icon' => 'pipette',
                'description' => 'Teko Leher Angsa Pengontrol Aliran Air Presisi',
                'sort_order' => 4,
            ],
            [
                'name' => 'Scale & Timer',
                'slug' => 'scale',
                'icon' => 'timer',
                'description' => 'Timbangan Digital Cerdas dengan Auto-Timer & Flow-Rate',
                'sort_order' => 5,
            ],
            [
                'name' => 'Aksesoris Barista',
                'slug' => 'accessories',
                'icon' => 'sparkles',
                'description' => 'Kertas Filter, Tamping Mat, WDT Tool & Dosing Cup',
                'sort_order' => 6,
            ],
            [
                'name' => 'Biji Kopi Filter',
                'slug' => 'filter-beans',
                'icon' => 'coffee',
                'description' => 'Biji Kopi Sangrai Profil Seduh Manual Sanubari Roastery',
                'sort_order' => 7,
            ],
            [
                'name' => 'Biji Kopi Espresso',
                'slug' => 'espresso-beans',
                'icon' => 'flame',
                'description' => 'Biji Kopi Sangrai Profil Mesin Espresso & Susu',
                'sort_order' => 8,
            ],
        ];

        foreach ($categories as $cat) {
            Category::updateOrCreate(['slug' => $cat['slug']], $cat);
        }
    }
}

