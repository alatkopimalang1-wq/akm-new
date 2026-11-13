<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'name' => 'Timemore Chestnut C3S Pro Hand Grinder',
                'brand' => 'Timemore',
                'sku' => 'AKM-GR-001',
                'slug' => 'timemore-chestnut-c3s-pro-grinder',
                'tagline' => 'S2C 660 Stainless Steel Conical Burr dengan Foldable Crank Handle',
                'short_description' => 'Grinder manual generasi terbaru dengan mata burr Spike to Cut (S2C 660) SUS420 stainless steel yang menghasilkan gilingan seragam dengan fines minimal.',
                'description' => 'Grinder manual generasi terbaru dengan mata burr Spike to Cut (S2C 660) berbahan SUS420 stainless steel yang menghasilkan gilingan seragam dengan fines minimal. Dilengkapi handle lipat paten Timemore yang kokoh dan mudah dibawa bepergian.',
                'price' => 875000,
                'original_price' => 950000,
                'stock' => 14,
                'rating' => 4.9,
                'reviews_count' => 142,
                'is_featured' => true,
                'is_flash_sale' => true,
                'category_slug' => 'grinder',
                'image' => 'https://images.unsplash.com/photo-1589396575653-c09c794ff6a6?auto=format&fit=crop&w=800&q=80',
                'specifications' => [
                    'Tipe Burr' => '420 Stainless Steel S2C660 38mm Conical Burr',
                    'Kapasitas' => '20 - 25 gram biji kopi',
                    'Material Body' => 'Aluminium Alloy unibody dengan grip silikon',
                    'Garansi' => '1 Tahun Garansi Resmi Distributor',
                ],
            ],
            [
                'name' => 'Hario V60 Ceramic Dripper 02 Kasuya Model',
                'brand' => 'Hario',
                'sku' => 'AKM-MB-001',
                'slug' => 'hario-v60-kasuya-ceramic',
                'tagline' => 'Desain Khas Tetsu Kasuya (World Brewers Cup 2016 Champion)',
                'short_description' => 'Didesain dengan alur spiral modifikasi yang memperlambat ekstraksi air kopi untuk metode 4:6 yang legendaris, menghasilkan body lebih tebal.',
                'description' => 'Kolaborasi Hario dengan juara dunia seduh manual Tetsu Kasuya. Didesain dengan alur spiral modifikasi yang memperlambat ekstraksi air kopi untuk metode 4:6 yang legendaris.',
                'price' => 365000,
                'original_price' => 420000,
                'stock' => 22,
                'rating' => 5.0,
                'reviews_count' => 98,
                'is_featured' => true,
                'is_flash_sale' => false,
                'category_slug' => 'manual-brew',
                'image' => 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
                'specifications' => [
                    'Material' => 'Arita-yaki Ceramic Made in Japan',
                    'Kapasitas' => '1 - 4 Cups (Ukuran 02)',
                    'Warna' => 'Matte Black Kasuya Edition',
                ],
            ],
            [
                'name' => 'Fellow Stagg EKG Electric Gooseneck Kettle 0.9L',
                'brand' => 'Fellow',
                'sku' => 'AKM-KT-001',
                'slug' => 'fellow-stagg-ekg-electric-kettle',
                'tagline' => 'Variable Temperature Control Kettle dengan LCD Screen & PID Controller',
                'short_description' => 'Kettle pour-over standar kompetisi internasional. Spout presisi gooseneck yang memberikan kontrol aliran air seimbang tanpa tumpah.',
                'description' => 'Kettle pour-over standar kompetisi internasional. Spout presisi gooseneck yang memberikan kontrol aliran air seimbang tanpa tumpah. Dilengkapi fitur penahan suhu (Hold Mode) selama 60 menit.',
                'price' => 2950000,
                'original_price' => 3200000,
                'stock' => 6,
                'rating' => 4.9,
                'reviews_count' => 76,
                'is_featured' => true,
                'is_flash_sale' => false,
                'category_slug' => 'kettle',
                'image' => 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=800&q=80',
                'specifications' => [
                    'Kapasitas' => '0.9 Liter (30 oz)',
                    'Daya Listrik' => '1200 Watt fast heating',
                    'Rentang Suhu' => '40°C - 100°C',
                    'Garansi' => '1 Tahun Garansi Resmi Distributor',
                ],
            ],
            [
                'name' => 'Timemore Black Mirror Basic 2 Smart Scale',
                'brand' => 'Timemore',
                'sku' => 'AKM-SC-001',
                'slug' => 'timemore-black-mirror-basic-2',
                'tagline' => 'Auto-Timing Precision Coffee Scale dengan Flow-Rate Real-time',
                'short_description' => 'Timbangan kopi pintar dengan sensor akurasi 0.1g, tampilan LED tersembunyi, dan fitur deteksi laju tuangan air (flow-rate indicator).',
                'description' => 'Timbangan kopi pintar dengan sensor akurasi 0.1g, tampilan LED tersembunyi, dan fitur deteksi laju tuangan air (flow-rate indicator) untuk memastikan ekstraksi seduh manual konsisten.',
                'price' => 545000,
                'original_price' => 620000,
                'stock' => 19,
                'rating' => 4.8,
                'reviews_count' => 110,
                'is_featured' => true,
                'is_flash_sale' => true,
                'category_slug' => 'scale',
                'image' => 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80',
                'specifications' => [
                    'Akurasi' => '0.1 gram',
                    'Kapasitas Maksimal' => '2000 gram',
                    'Port Pengisian' => 'USB Type-C Rechargeable Lithium Battery',
                ],
            ],
            [
                'name' => 'Flair 58 Manual Lever Espresso Machine',
                'brand' => 'Flair Espresso',
                'sku' => 'AKM-ESP-001',
                'slug' => 'flair-58-manual-lever-espresso',
                'tagline' => 'Industry Standard 58mm Portafilter dengan Pre-heat Temperature Controller',
                'short_description' => 'Mesin espresso manual tuas profesional dengan portafilter komersial 58mm dan pengatur pemanas silinder 3 level.',
                'description' => 'Mesin espresso manual tuas profesional dengan portafilter komersial 58mm dan pengatur pemanas silinder 3 level. Mampu menghasilkan profil ekstraksi 9 bar layaknya mesin espresso kafe komersial.',
                'price' => 8450000,
                'original_price' => 8900000,
                'stock' => 4,
                'rating' => 5.0,
                'reviews_count' => 34,
                'is_featured' => true,
                'is_flash_sale' => false,
                'category_slug' => 'espresso-tools',
                'image' => 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
                'specifications' => [
                    'Ukuran Portafilter' => 'Standard Komersial 58mm',
                    'Kapasitas Silinder Air' => '85 ml',
                    'Tekanan Maksimal' => 'Hingga 12 Bar (Pressure Gauge Included)',
                    'Garansi' => '2 Tahun Garansi Resmi',
                ],
            ],
            [
                'name' => 'Origami Dripper M Size (Matte Green)',
                'brand' => 'Origami',
                'sku' => 'AKM-MB-002',
                'slug' => 'origami-dripper-m-matte-green',
                'tagline' => '20-Ribbed Mino Ceramic Dripper Made in Japan',
                'short_description' => 'Dripper keramik 20 rusuk ikonik yang kompatibel dengan kertas filter kerucut V60 maupun wave/kalita flat bottom.',
                'description' => 'Dripper keramik 20 rusuk ikonik yang kompatibel dengan kertas filter kerucut V60 maupun wave/kalita flat bottom. Menghasilkan laju alir stabil dan aroma cerah.',
                'price' => 495000,
                'original_price' => 550000,
                'stock' => 11,
                'rating' => 4.9,
                'reviews_count' => 64,
                'is_featured' => false,
                'is_flash_sale' => false,
                'category_slug' => 'manual-brew',
                'image' => 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
                'specifications' => [
                    'Material' => 'Mino Porcelain Made in Japan',
                    'Ukuran' => 'M (1 - 4 Cups)',
                    'Warna' => 'Matte Green',
                ],
            ],
            [
                'name' => 'Kingrinder K6 Manual Coffee Grinder',
                'brand' => 'Kingrinder',
                'sku' => 'AKM-GR-002',
                'slug' => 'kingrinder-k6-heptagonal-burr',
                'tagline' => '48mm Heptagonal Stainless Steel Burrs dengan External Adjustment',
                'short_description' => 'Grinder serba bisa dengan mata burr 48mm 7-sisi dan dial eksternal presisi 16 mikron per klik.',
                'description' => 'Grinder serba bisa dengan mata burr 48mm 7-sisi dan dial eksternal presisi 16 mikron per klik. Cocok sempurna dari espresso hingga pour over.',
                'price' => 1650000,
                'original_price' => 1800000,
                'stock' => 8,
                'rating' => 4.9,
                'reviews_count' => 52,
                'is_featured' => true,
                'is_flash_sale' => false,
                'category_slug' => 'grinder',
                'image' => 'https://images.unsplash.com/photo-1589396575653-c09c794ff6a6?auto=format&fit=crop&w=800&q=80',
                'specifications' => [
                    'Burr' => '48mm Heptagonal SUS420 Stainless Steel',
                    'Adjustment' => 'External Dial 60 clicks/rotation (16 micron/click)',
                    'Kapasitas' => '30 - 35 gram',
                ],
            ],
            [
                'name' => 'WDT Tool Espresso Needle Distributor 0.35mm',
                'brand' => 'MechCraft',
                'sku' => 'AKM-ACC-001',
                'slug' => 'wdt-needle-distributor-espresso',
                'tagline' => '9 Jarum Stainless Steel 304 Fleksibel dengan Stand Aluminium Standar Barista',
                'short_description' => 'Alat de-clumping bubuk kopi espresso untuk mencegah channeling dan menghasilkan ekstraksi sempurna.',
                'description' => 'Alat de-clumping bubuk kopi espresso untuk mencegah channeling dan menghasilkan ekstraksi sempurna pada portafilter 58mm maupun 51mm.',
                'price' => 125000,
                'original_price' => 160000,
                'stock' => 45,
                'rating' => 4.8,
                'reviews_count' => 189,
                'is_featured' => false,
                'is_flash_sale' => false,
                'category_slug' => 'accessories',
                'image' => 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
                'specifications' => [
                    'Ketebalan Jarum' => '0.35mm Medical Grade Stainless Steel',
                    'Jumlah Jarum' => '8 - 9 needles replaceable',
                    'Stand' => 'Solid Aluminium Stand Included',
                ],
            ],
        ];

        foreach ($products as $item) {
            $catSlug = $item['category_slug'];
            unset($item['category_slug']);
            $img = $item['image'];
            unset($item['image']);

            $product = Product::updateOrCreate(
                ['slug' => $item['slug']],
                $item
            );

            $category = Category::where('slug', $catSlug)->first();
            if ($category) {
                $product->categories()->syncWithoutDetaching([$category->id]);
            }

            if ($img) {
                $product->images()->updateOrCreate(
                    ['path' => $img],
                    ['alt' => $product->name, 'is_primary' => true, 'sort_order' => 1]
                );
            }
        }
    }
}

