<?php

namespace Database\Seeders;

use App\Models\MegaMenu;
use App\Models\MegaMenuItem;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Cache;

class MegaMenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Cache::forget('sanubari_mega_menus');

        // 1. Katalog Kopi (shop)
        $shop = MegaMenu::updateOrCreate(
            ['slug' => 'shop'],
            [
                'name' => 'Katalog Kopi',
                'sort_order' => 1,
                'is_active' => true,
                'featured_badge' => 'Fresh Roast Pekan Ini',
                'featured_title' => 'Gunung Kawi Honey Anaerobic',
                'featured_subtitle' => 'Aroma brown sugar, red apple, dan floral lembut. Disangrai segar setiap Senin & Kamis.',
                'featured_image' => 'mega-menu/roast-fresh.jpg',
                'featured_url' => '/shop',
                'featured_button_text' => 'Lihat Semua Katalog Kopi',
            ]
        );

        $shop->items()->delete();
        $shopItems = [
            // Section 1: Kategori Biji Kopi
            [
                'section_title' => 'Kategori Biji Kopi',
                'title' => 'Koleksi Gunung Kawi',
                'description' => 'Single origin vulkanis 1.200–1.600 mdpl dengan rasa manis madu alami.',
                'url' => '/shop?series=kawi',
                'icon' => 'mountain',
                'badge' => null,
                'sort_order' => 1,
            ],
            [
                'section_title' => 'Kategori Biji Kopi',
                'title' => 'Filter Beans (Washed & Honey)',
                'description' => 'Karakter cangkir bersih, asam buah cerah, dan aromatik untuk seduh pour-over.',
                'url' => '/shop?category=filter-beans',
                'icon' => 'coffee',
                'badge' => null,
                'sort_order' => 2,
            ],
            [
                'section_title' => 'Kategori Biji Kopi',
                'title' => 'Espresso & Houseblend',
                'description' => 'Crema tebal, bodi karamel manis, diformulasikan untuk mesin komersial & moka pot.',
                'url' => '/shop?category=espresso-beans',
                'icon' => 'flame',
                'badge' => null,
                'sort_order' => 3,
            ],
            [
                'section_title' => 'Kategori Biji Kopi',
                'title' => 'CO-Ferment Eksperimental',
                'description' => 'Inovasi anaerobik bersama ekstrak buah segar menghasilkan aroma intens modern.',
                'url' => '/shop?series=co-ferment',
                'icon' => 'flask-conical',
                'badge' => null,
                'sort_order' => 4,
            ],
            // Section 2: Blend & Penawaran
            [
                'section_title' => 'Blend & Penawaran',
                'title' => 'C.Y.B.R (Custom Blend)',
                'description' => 'Pilih komposisi dan rasio blend biji kopi Anda bersama roaster kami.',
                'url' => '/cybr',
                'icon' => 'sliders-horizontal',
                'badge' => 'Baru',
                'sort_order' => 5,
            ],
            [
                'section_title' => 'Blend & Penawaran',
                'title' => 'Paket Sample Tiga Rasa',
                'description' => 'Tiga varian 100g untuk mencicipi spektrum rasa proses Gunung Kawi.',
                'url' => '/shop',
                'icon' => 'arrow-right',
                'badge' => null,
                'sort_order' => 6,
            ],
            [
                'section_title' => 'Blend & Penawaran',
                'title' => 'Biji Kopi Kemasan 1 Kg',
                'description' => 'Pilihan kemasan hemat untuk konsumsi harian di rumah maupun kantor.',
                'url' => '/shop',
                'icon' => 'arrow-right',
                'badge' => null,
                'sort_order' => 7,
            ],
        ];

        foreach ($shopItems as $item) {
            $shop->items()->create($item);
        }

        // 2. Kemitraan & Bisnis (b2b)
        $b2b = MegaMenu::updateOrCreate(
            ['slug' => 'b2b'],
            [
                'name' => 'Kemitraan & Bisnis',
                'sort_order' => 2,
                'is_active' => true,
                'featured_badge' => 'Showroom & Lab',
                'featured_title' => 'Showroom & Lab Roastery',
                'featured_subtitle' => 'Jl. Terusan Kawi No. 12, Klojen, Kota Malang. Buka Setiap Hari: 09.00 - 23.00 WIB',
                'featured_image' => 'mega-menu/showroom.jpg',
                'featured_url' => 'https://wa.me/6285121930454?text=Halo%20Sanubari%20Roastery!%20Saya%20ingin%20konsultasi%20pasokan%20kopi%20grosir%20dan%20sample%20kedai.',
                'featured_button_text' => 'Hubungi Tim Wholesale (WhatsApp)',
            ]
        );

        $b2b->items()->delete();
        $b2bItems = [
            // Section 1: Pasokan Biji Kopi Grosir
            [
                'section_title' => 'Pasokan Biji Kopi Grosir',
                'title' => 'Harga Grosir Bertingkat',
                'description' => 'Diskon kuantiti mulai pemesanan 5 kg, 10 kg, hingga kontrak pasokan bulanan rutin.',
                'url' => '/wholesale',
                'icon' => 'truck',
                'badge' => null,
                'sort_order' => 1,
            ],
            [
                'section_title' => 'Pasokan Biji Kopi Grosir',
                'title' => 'Custom Roast Profile',
                'description' => 'Kembangkan signature houseblend eksklusif untuk menu coffee shop Anda bersama roaster kami.',
                'url' => '/wholesale',
                'icon' => 'award',
                'badge' => null,
                'sort_order' => 2,
            ],
            [
                'section_title' => 'Pasokan Biji Kopi Grosir',
                'title' => 'Sample Tester 100g Gratis',
                'description' => 'Kirim sampel biji kopi filter maupun espresso untuk diuji coba di bar kedai Anda.',
                'url' => '/wholesale',
                'icon' => 'check-circle',
                'badge' => null,
                'sort_order' => 3,
            ],
            // Section 2: Alat Kopi Malang Showroom
            [
                'section_title' => 'Alat Kopi Malang Showroom',
                'title' => 'Mesin Espresso & Grinder Komersial',
                'description' => 'Pilihan mesin 1-group, 2-group, serta grinder espresso on-demand bergaransi resmi.',
                'url' => '/kunjungi',
                'icon' => 'arrow-right',
                'badge' => null,
                'sort_order' => 4,
            ],
            [
                'section_title' => 'Alat Kopi Malang Showroom',
                'title' => 'Pelatihan Barista & Kalibrasi Bar',
                'description' => 'Bimbingan kalibrasi ekstraksi, milk texturing, dan alur kerja bar yang efisien.',
                'url' => '/wholesale',
                'icon' => 'arrow-right',
                'badge' => null,
                'sort_order' => 5,
            ],
            [
                'section_title' => 'Alat Kopi Malang Showroom',
                'title' => 'Konsultasi Paket Buka Kedai',
                'description' => 'Perhitungan estimasi HPP cangkir, kebutuhan alat, dan pasokan biji kopi harian.',
                'url' => '/wholesale',
                'icon' => 'arrow-right',
                'badge' => null,
                'sort_order' => 6,
            ],
        ];

        foreach ($b2bItems as $item) {
            $b2b->items()->create($item);
        }

        // 3. Cerita & Panduan (explore)
        $explore = MegaMenu::updateOrCreate(
            ['slug' => 'explore'],
            [
                'name' => 'Cerita & Panduan',
                'sort_order' => 3,
                'is_active' => true,
                'featured_badge' => 'Workshop Komunitas',
                'featured_title' => 'Public Cupping Session',
                'featured_subtitle' => 'Kelas seduh dan uji cita rasa berkala terbuka untuk umum dan barista di Roastery Malang.',
                'featured_image' => 'mega-menu/cupping.jpg',
                'featured_url' => '/events',
                'featured_button_text' => 'Lihat Jadwal Workshop',
            ]
        );

        $explore->items()->delete();
        $exploreItems = [
            // Section 1: Panduan Ritual Menyeduh
            [
                'section_title' => 'Panduan Ritual Menyeduh',
                'title' => 'Resep V60 Pour-Over',
                'description' => 'Rasio 1:15, suhu 92°C, dan teknik tuangan untuk kejernihan rasa buah alami.',
                'url' => '/panduan-seduh/v60-pourover',
                'icon' => 'book-open',
                'badge' => null,
                'sort_order' => 1,
            ],
            [
                'section_title' => 'Panduan Ritual Menyeduh',
                'title' => 'Kalibrasi Ekstraksi Espresso',
                'description' => 'Rasio 1:2 dalam 25–30 detik untuk crema manis dan bodi yang seimbang.',
                'url' => '/panduan-seduh/espresso-extraction',
                'icon' => 'flame',
                'badge' => null,
                'sort_order' => 2,
            ],
            [
                'section_title' => 'Panduan Ritual Menyeduh',
                'title' => 'Lihat Semua Panduan Seduh',
                'description' => 'Kumpulan panduan ekstraksi lengkap untuk AeroPress, French Press, dan Cold Brew.',
                'url' => '/panduan-seduh',
                'icon' => 'arrow-right',
                'badge' => null,
                'sort_order' => 3,
            ],
            // Section 2: Cerita & Ruang Sanubari
            [
                'section_title' => 'Cerita & Ruang Sanubari',
                'title' => 'Tentang Sanubari',
                'description' => 'Didirikan di Malang sejak 2017 dengan dedikasi mengangkat kopi lokal lereng Kawi.',
                'url' => '/tentang',
                'icon' => 'arrow-right',
                'badge' => null,
                'sort_order' => 4,
            ],
            [
                'section_title' => 'Cerita & Ruang Sanubari',
                'title' => 'Kunjungi Showroom Malang',
                'description' => 'Cicipi seduhan kopi, uji alat seduh manual, dan konsultasi blend langsung.',
                'url' => '/kunjungi',
                'icon' => 'arrow-right',
                'badge' => null,
                'sort_order' => 5,
            ],
            [
                'section_title' => 'Cerita & Ruang Sanubari',
                'title' => 'Jurnal & Wawasan Kopi',
                'description' => 'Catatan sangrai, varietas kopi Nusantara, dan panduan merawat grinder.',
                'url' => '/blog',
                'icon' => 'arrow-right',
                'badge' => null,
                'sort_order' => 6,
            ],
        ];

        foreach ($exploreItems as $item) {
            $explore->items()->create($item);
        }
    }
}
