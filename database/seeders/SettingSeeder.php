<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            'store_name' => 'Alat Kopi Malang (AKM)',
            'store_tagline' => 'Curated Coffee Equipment & Barista Tools',
            'store_whatsapp' => '6281234567890',
            'store_address' => 'Jl. Terusan Dieng No. 42, Sukun, Kota Malang, Jawa Timur 65146',
            'store_hours' => 'Senin - Minggu: 09.00 - 21.00 WIB',
            'store_instagram' => 'https://instagram.com/alatkopimalang',
            'announcement_bar' => 'Official Gear Showroom Partner of Sanubari Roastery Malang • Gratis Konsultasi Kalibrasi Grinder',
        ];

        foreach ($settings as $key => $val) {
            Setting::updateOrCreate(['key' => $key], ['value' => $val, 'group' => 'general']);
        }
    }
}

