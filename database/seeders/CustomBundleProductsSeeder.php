<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use Illuminate\Database\Seeder;

class CustomBundleProductsSeeder extends Seeder
{
    public function run(): void
    {
        $catMap = Category::pluck('id', 'slug')->toArray();

        $espressoCatIds = array_values(array_filter([
            $catMap['mesin-espresso'] ?? null,
            $catMap['mesin-rumahan'] ?? null,
            $catMap['mesin-semi-komersil'] ?? null,
            $catMap['mesin-komersil'] ?? null,
        ]));

        $grinderCatIds = array_values(array_filter([
            $catMap['grinder-kopi'] ?? null,
            $catMap['espresso-maker'] ?? null,
        ]));

        $toolsCatIds = array_values(array_filter([
            $catMap['coffee-tools'] ?? null,
            $catMap['espresso-tool-kits'] ?? null,
            $catMap['aksesoris-barista'] ?? null,
        ]));

        $manualBrewCatIds = array_values(array_filter([
            $catMap['manual-brew'] ?? null,
            $catMap['pour-over'] ?? null,
            $catMap['aeropress'] ?? null,
            $catMap['french-press'] ?? null,
            $catMap['immersion'] ?? null,
            $catMap['cold-brew'] ?? null,
        ]));

        $optionalCatIds = array_values(array_filter([
            $catMap['aksesoris-barista'] ?? null,
            $catMap['bahan-baku-cafe'] ?? null,
            $catMap['glass-mug'] ?? null,
            $catMap['paper-filter'] ?? null,
            $catMap['sparepart'] ?? null,
        ]));

        // Find free products for slots 5, 6, 7
        $freeTamper = Product::where('slug', 'like', '%normcore%')->orWhere('slug', 'like', '%tamper%')->first()
            ?: Product::where('slug', '!=', 'byob')->where('is_custom_bundle', false)->orderBy('min_price', 'asc')->first();

        $freePitcher = Product::where('slug', 'like', '%motta%')->orWhere('slug', 'like', '%pitcher%')->first()
            ?: Product::where('slug', '!=', 'byob')->where('is_custom_bundle', false)->orderBy('min_price', 'asc')->skip(1)->first();

        $freeScreen = Product::where('slug', 'like', '%ims%')->orWhere('slug', 'like', '%edelmann%')->first()
            ?: Product::where('slug', '!=', 'byob')->where('is_custom_bundle', false)->orderBy('min_price', 'asc')->skip(2)->first();

        // 1. Custom Paket Usaha Kedai Kopi Standar
        $bundle1 = Product::updateOrCreate(
            ['slug' => 'custom-paket-usaha-kedai-kopi-standar'],
            [
                'name' => 'Custom Paket Usaha Kedai Kopi Standar',
                'series' => 'Alat Kopi Malang',
                'producer' => 'Alat Kopi Malang',
                'short_description' => 'Paket custom usaha kedai kopi lengkap. Pilih sendiri kombinasi Mesin Espresso, Grinder, dan Alat Barista sesuai kebutuhan kedai Anda dengan diskon paket otomatis + bonus aksesoris GRATIS.',
                'description' => [
                    'id' => "Custom Paket Usaha Kedai Kopi Standar dirancang untuk memudahkan Anda merakit paket peralatan coffee shop sesuai konsep dan budget kedai Anda.\n\n• Pilih Mesin Espresso, Grinder Kopi, dan Peralatan Barista pada kotak slot (+).\n• Dapatkan harga diskon paket otomatis pada setiap item yang dipilih.\n• Termasuk 3 item bonus peralatan barista GRATIS (Rp 0).\n• Tersedia slot OPTIONAL apabila Anda ingin menambahkan perlengkapan tambahan.",
                    'en' => 'Customizable standard coffee shop equipment bundle with automatic slot discounts and free barista tools.',
                ],
                'min_price' => 15500000,
                'max_price' => 85000000,
                'is_featured' => true,
                'is_new' => true,
                'is_preorder' => false,
                'is_custom_bundle' => true,
                'status' => 'active',
                'stock_status' => 'in_stock',
                'released_at' => now(),
                'bundle_config' => [
                    'slots' => [
                        [
                            'slot_type' => 'required',
                            'slot_label' => 'Please select a product!',
                            'category_ids' => array_map('strval', $espressoCatIds),
                            'product_ids' => [],
                            'discount_mode' => 'percentage',
                            'discount_value' => 2,
                        ],
                        [
                            'slot_type' => 'required',
                            'slot_label' => 'Please select a product!',
                            'category_ids' => array_map('strval', $grinderCatIds),
                            'product_ids' => [],
                            'discount_mode' => 'percentage',
                            'discount_value' => 2,
                        ],
                        [
                            'slot_type' => 'required',
                            'slot_label' => 'Please select a product!',
                            'category_ids' => array_map('strval', $toolsCatIds),
                            'product_ids' => [],
                            'discount_mode' => 'percentage',
                            'discount_value' => 2,
                        ],
                        [
                            'slot_type' => 'required',
                            'slot_label' => 'Please select a product!',
                            'category_ids' => array_map('strval', $manualBrewCatIds),
                            'product_ids' => [],
                            'discount_mode' => 'percentage',
                            'discount_value' => 2,
                        ],
                        [
                            'slot_type' => 'free',
                            'slot_label' => 'GRATIS',
                            'free_product_id' => $freeTamper ? (string) $freeTamper->id : null,
                        ],
                        [
                            'slot_type' => 'free',
                            'slot_label' => 'GRATIS',
                            'free_product_id' => $freePitcher ? (string) $freePitcher->id : null,
                        ],
                        [
                            'slot_type' => 'free',
                            'slot_label' => 'GRATIS',
                            'free_product_id' => $freeScreen ? (string) $freeScreen->id : null,
                        ],
                        [
                            'slot_type' => 'optional',
                            'slot_label' => 'Please select a product!',
                            'category_ids' => array_map('strval', $optionalCatIds),
                            'product_ids' => [],
                            'discount_mode' => 'percentage',
                            'discount_value' => 5,
                        ],
                    ],
                ],
            ]
        );

        if (! empty($espressoCatIds)) {
            $bundle1->categories()->sync([$espressoCatIds[0]]);
        }

        ProductVariant::updateOrCreate(
            [
                'product_id' => $bundle1->id,
                'sku' => 'AKM-BUNDLE-STD-01',
            ],
            [
                'label' => '1 Paket Custom',
                'weight_grams' => 35000,
                'price' => 15500000,
                'original_price' => 16800000,
                'stock_status' => 'in_stock',
                'image' => 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=85',
            ]
        );

        ProductImage::updateOrCreate(
            [
                'product_id' => $bundle1->id,
                'is_primary' => true,
            ],
            [
                'path' => 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=85',
                'alt' => 'Custom Paket Usaha Kedai Kopi Standar - Alat Kopi Malang',
                'sort_order' => 1,
            ]
        );

        // 2. Custom Paket Usaha Cafe Menengah
        $bundle2 = Product::updateOrCreate(
            ['slug' => 'custom-paket-usaha-cafe-menengah'],
            [
                'name' => 'Custom Paket Usaha Cafe Menengah',
                'series' => 'Alat Kopi Malang',
                'producer' => 'Alat Kopi Malang',
                'short_description' => 'Paket custom usaha cafe skala menengah dengan pilihan mesin espresso 1–2 group, commercial grinder, peralatan seduh, dan bonus barista kit GRATIS.',
                'description' => [
                    'id' => "Custom Paket Usaha Cafe Menengah ditujukan bagi pemilik coffee shop dan resto yang membutuhkan kapasitas ekstraksi harian lebih tinggi.\n\n• Pilih Mesin Espresso, Grinder Kopi Komersial, dan Alat Barista sesuai kebutuhan.\n• Diskon otomatis 5% untuk setiap komponen pilihan di dalam paket.\n• Bonus 3 perlengkapan barista GRATIS (Rp 0) + Slot Optional.",
                    'en' => 'Medium-scale cafe custom equipment bundle with 5% slot discount and free barista kit.',
                ],
                'min_price' => 32000000,
                'max_price' => 120000000,
                'is_featured' => true,
                'is_new' => true,
                'is_preorder' => false,
                'is_custom_bundle' => true,
                'status' => 'active',
                'stock_status' => 'in_stock',
                'released_at' => now(),
                'bundle_config' => [
                    'slots' => [
                        [
                            'slot_type' => 'required',
                            'slot_label' => 'Please select a product!',
                            'category_ids' => array_map('strval', $espressoCatIds),
                            'product_ids' => [],
                            'discount_mode' => 'percentage',
                            'discount_value' => 5,
                        ],
                        [
                            'slot_type' => 'required',
                            'slot_label' => 'Please select a product!',
                            'category_ids' => array_map('strval', $grinderCatIds),
                            'product_ids' => [],
                            'discount_mode' => 'percentage',
                            'discount_value' => 5,
                        ],
                        [
                            'slot_type' => 'required',
                            'slot_label' => 'Please select a product!',
                            'category_ids' => array_map('strval', $toolsCatIds),
                            'product_ids' => [],
                            'discount_mode' => 'percentage',
                            'discount_value' => 5,
                        ],
                        [
                            'slot_type' => 'free',
                            'slot_label' => 'GRATIS',
                            'free_product_id' => $freeTamper ? (string) $freeTamper->id : null,
                        ],
                        [
                            'slot_type' => 'free',
                            'slot_label' => 'GRATIS',
                            'free_product_id' => $freePitcher ? (string) $freePitcher->id : null,
                        ],
                        [
                            'slot_type' => 'optional',
                            'slot_label' => 'Please select a product!',
                            'category_ids' => array_map('strval', $optionalCatIds),
                            'product_ids' => [],
                            'discount_mode' => 'percentage',
                            'discount_value' => 5,
                        ],
                    ],
                ],
            ]
        );

        if (! empty($espressoCatIds)) {
            $bundle2->categories()->sync([$espressoCatIds[0]]);
        }

        ProductVariant::updateOrCreate(
            [
                'product_id' => $bundle2->id,
                'sku' => 'AKM-BUNDLE-MED-01',
            ],
            [
                'label' => '1 Paket Custom',
                'weight_grams' => 45000,
                'price' => 32000000,
                'original_price' => 35000000,
                'stock_status' => 'in_stock',
                'image' => 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=900&q=85',
            ]
        );

        ProductImage::updateOrCreate(
            [
                'product_id' => $bundle2->id,
                'is_primary' => true,
            ],
            [
                'path' => 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=900&q=85',
                'alt' => 'Custom Paket Usaha Cafe Menengah - Alat Kopi Malang',
                'sort_order' => 1,
            ]
        );
    }
}

