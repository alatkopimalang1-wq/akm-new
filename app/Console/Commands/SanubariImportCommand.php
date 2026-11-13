<?php

namespace App\Console\Commands;

use App\Models\BrewGuide;
use App\Models\Category;
use App\Models\Event;
use App\Models\Post;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use App\Models\Setting;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class SanubariImportCommand extends Command
{
    protected $signature = 'sanubari:import-seed {--download-images : Download product images to local storage}';
    protected $description = 'Import Sanubari Roastery seed data and demo content';

    public function handle(): int
    {
        $this->info('Starting Sanubari seed data import...');

        // 0. Synchronize starter media assets to storage
        $this->copySeedAssets();

        $seedPath = base_path('docs/research/sanubari-seed.json');
        if (! File::exists($seedPath)) {
            $this->error("Seed file not found at: {$seedPath}");
            return Command::FAILURE;
        }

        $data = json_decode(File::get($seedPath), true);
        if (! $data) {
            $this->error('Failed to parse sanubari-seed.json');
            return Command::FAILURE;
        }

        // 1. Seed Settings
        $this->seedSettings($data['brand'] ?? []);

        // 2. Seed Categories
        $categoryMap = $this->seedCategories($data['categories'] ?? []);

        // 3. Seed Products & Variants
        $this->seedProducts($data['products'] ?? [], $categoryMap);

        // 4. Seed Content (Posts, Brew Guides, Events)
        $this->seedContent();

        $this->info('Sanubari seed data import completed successfully!');
        return Command::SUCCESS;
    }

    protected function copySeedAssets(): void
    {
        $source = resource_path('seed-assets');
        $target = storage_path('app/public');

        if (! File::exists($source)) {
            $this->line('No seed assets found in resources/seed-assets.');
            return;
        }

        File::ensureDirectoryExists($target);
        File::copyDirectory($source, $target);
        $this->info('Starter media assets synchronized from resources/seed-assets to storage/app/public.');
    }

    protected function seedSettings(array $brand): void
    {
        $this->line('Seeding settings...');

        $defaults = [
            'brand_name' => $brand['name'] ?? 'Sanubari Roastery',
            'tagline' => [
                'id' => 'Close to Every Brew — Jejak Rasa di Gunung Kawi',
                'en' => 'Close to Every Brew — Flavor Traces of Mount Kawi',
            ],
            'description' => [
                'id' => 'Sanubari Roastery menyajikan kopi artisan pilihan dari perkebunan terbaik, dengan spesialisasi biji kopi Gunung Kawi dan inovasi proses fermentasi modern.',
                'en' => 'Sanubari Roastery presents curated artisan coffees from the finest estates, specializing in Mount Kawi beans and modern fermentation innovations.',
            ],
            'whatsapp' => $brand['whatsapp'] ?? '6285121930454',
            'maps_url' => $brand['mapsUrl'] ?? 'https://maps.app.goo.gl/PMuxaEtsbEvC4APy7',
            'address' => 'Jl. Terusan Kawi No. 12, Klojen, Kota Malang, Jawa Timur 65116',
            'opening_hours' => '09.00 – 23.00 WIB (Setiap Hari)',
            'instagram' => 'https://instagram.com/sanubariroastery',
            'email' => 'halo@sanubariroastery.id',
            'currency' => 'IDR',
            'free_shipping_min' => 250000,
            // Announcement Ticker
            'announcement_enabled' => true,
            'announcement_text_id' => 'Gratis ongkir ke seluruh Jawa untuk pesanan biji kopi di atas Rp 250.000!',
            'announcement_text_en' => 'Free shipping across Java for coffee bean orders above IDR 250,000!',
            'announcement_link' => '/shop',
            // Homepage Hero & Section Titles
            'home_hero_show_text' => false,
            'home_hero_slides' => [
                [
                    'title' => 'Roastery Kopi Spesialti Asli Malang',
                    'image' => 'banners/slide-1.jpg',
                    'link_type' => 'page',
                    'link_target_page' => '/shop',
                    'open_in_new_tab' => false,
                ],
                [
                    'title' => 'C.Y.B.R: Custom Coffee Blend Studio',
                    'image' => 'banners/slide-2.jpg',
                    'link_type' => 'page',
                    'link_target_page' => '/cybr',
                    'open_in_new_tab' => false,
                ],
                [
                    'title' => 'Pasokan Biji Grosir & Alat Kopi Malang',
                    'image' => 'banners/slide-3.jpg',
                    'link_type' => 'page',
                    'link_target_page' => '/wholesale',
                    'open_in_new_tab' => false,
                ],
                [
                    'title' => 'CO-Ferment & Fruit Infused',
                    'image' => 'banners/slide-4.jpg',
                    'link_type' => 'category',
                    'link_target_category' => 'co-ferment-process',
                    'open_in_new_tab' => false,
                ],
            ],
            'home_category_menu_items' => [
                [
                    'label' => 'Filter Beans',
                    'visual_type' => 'icon',
                    'icon' => 'lucide-droplet',
                    'image' => null,
                    'link_type' => 'preset',
                    'preset_url' => '/shop?category=filter-beans',
                    'custom_url' => null,
                    'badge' => null,
                ],
                [
                    'label' => 'Espresso Beans',
                    'visual_type' => 'icon',
                    'icon' => 'lucide-flame',
                    'image' => null,
                    'link_type' => 'preset',
                    'preset_url' => '/shop?category=espresso-beans',
                    'custom_url' => null,
                    'badge' => null,
                ],
                [
                    'label' => 'Koleksi Kawi',
                    'visual_type' => 'icon',
                    'icon' => 'lucide-mountain',
                    'image' => null,
                    'link_type' => 'preset',
                    'preset_url' => '/shop?series=kawi',
                    'custom_url' => null,
                    'badge' => null,
                ],
                [
                    'label' => 'C.Y.B.R',
                    'visual_type' => 'icon',
                    'icon' => 'lucide-sliders-horizontal',
                    'image' => null,
                    'link_type' => 'preset',
                    'preset_url' => '/cybr',
                    'custom_url' => null,
                    'badge' => 'Baru',
                ],
                [
                    'label' => 'Panduan Seduh',
                    'visual_type' => 'icon',
                    'icon' => 'lucide-book-open',
                    'image' => null,
                    'link_type' => 'preset',
                    'preset_url' => '/panduan-seduh',
                    'custom_url' => null,
                    'badge' => null,
                ],
                [
                    'label' => 'Grosir B2B',
                    'visual_type' => 'icon',
                    'icon' => 'lucide-truck',
                    'image' => null,
                    'link_type' => 'preset',
                    'preset_url' => '/wholesale',
                    'custom_url' => null,
                    'badge' => null,
                ],
                [
                    'label' => 'Showroom',
                    'visual_type' => 'icon',
                    'icon' => 'lucide-map-pin',
                    'image' => null,
                    'link_type' => 'preset',
                    'preset_url' => '/kunjungi',
                    'custom_url' => null,
                    'badge' => null,
                ],
            ],
            'home_rec_title' => 'Rekomendasi Biji Kopi',
            'home_rec_subtitle' => 'Kurasi sangrai segar lereng Gunung Kawi dan Nusantara pekan ini',
            'home_video_tag' => 'Sanubari Roasting Studio',
            'home_video_title' => 'Dedikasi & Presisi Sangrai di Malang',
            'home_video_subtitle' => '',
            'home_video_url' => 'https://www.smokingbarrels.coffee/media/home-hero-video.mp4',
            'home_stat_1_number' => 1450,
            'home_stat_1_unit' => 'mdpl',
            'home_stat_1_label' => 'Ketinggian Lereng Kawi',
            'home_stat_1_desc' => 'Tanah andosol vulkanis kaya mineral',
            'home_stat_2_number' => 100,
            'home_stat_2_unit' => '%',
            'home_stat_2_label' => 'Spesialti Terlacak',
            'home_stat_2_desc' => 'Jejak panen & petani transparan',
            'home_stat_3_number' => 18,
            'home_stat_3_unit' => '+',
            'home_stat_3_label' => 'Mitra Petani Kawi',
            'home_stat_3_desc' => 'Direct trade harga adil berkelanjutan',
            'home_stat_4_number' => 48,
            'home_stat_4_unit' => 'Jam',
            'home_stat_4_label' => 'Jaminan Fresh Roast',
            'home_stat_4_desc' => 'Maksimal jeda sangrai ke pengiriman',
            'home_place_title' => 'Roastery & Showroom Sanubari',
            'home_place_subtitle' => 'Kunjungi slow bar, uji coba mesin espresso, dan rasakan atmosfer sangrai lereng Kawi di Kota Malang',
            'home_place_items' => [
                [
                    'id' => 'place-roastery',
                    'badge' => 'Roasting Room',
                    'subBadge' => 'Live Roasting',
                    'title' => 'Laboratorium Roastery & Kurva Digital',
                    'desc' => 'Pusat sangrai presisi biji kopi lereng Gunung Kawi dengan mesin sangrai berteknologi kurva digital untuk konsistensi profil rasa terbaik.',
                    'href' => '/tentang',
                    'coverImage' => 'mega-menu/roast-fresh.jpg',
                    'actionText' => 'Tentang Roastery',
                ],
                [
                    'id' => 'place-cupping',
                    'badge' => 'Sensory Lab',
                    'subBadge' => 'Public Cupping',
                    'title' => 'Sensory Room & Weekly Public Cupping',
                    'desc' => 'Ruang kalibrasi rasa standar SCA untuk uji sensorik batch baru, cupping bersama roaster, dan workshop seduh terbuka.',
                    'href' => '/acara',
                    'coverImage' => 'mega-menu/cupping.jpg',
                    'actionText' => 'Jadwal Acara & Cupping',
                ],
                [
                    'id' => 'place-beans-bar',
                    'badge' => 'Beans Dispensary',
                    'subBadge' => 'Fresh Roast On-Demand',
                    'title' => 'Beans Bar & Gilingan Presisi Sesuai Alat',
                    'desc' => 'Pilih biji kopi langsung dari toples sangrai segar, konsultasikan profil rasa, dan dapatkan gilingan pas untuk alat seduh di rumah Anda.',
                    'href' => '/shop',
                    'coverImage' => 'mega-menu/showroom.jpg',
                    'actionText' => 'Beli Biji Kopi',
                ],
                [
                    'id' => 'place-b2b',
                    'badge' => 'B2B & Wholesale',
                    'subBadge' => 'Konsultasi Kedai',
                    'title' => 'Lounge Kemitraan & Custom Blending C.Y.B.R',
                    'desc' => 'Ruang diskusi hangat untuk pemilik kedai kopi dan horeka untuk mencicipi racikan houseblend kustom serta negosiasi pasokan grosir.',
                    'href' => '/wholesale',
                    'coverImage' => 'mega-menu/wholesale.jpg',
                    'actionText' => 'Konsultasi Kemitraan',
                ],
            ],
            'home_laris_title' => 'Laris Manis',
            'home_laris_subtitle' => 'Koleksi biji kopi paling laris dan sering diseduh di Sanubari yang mungkin kamu sukai',
            'home_laris_1_title' => 'Gunung Kawi Honey Anaerobic',
            'home_laris_1_href' => '/shop?series=kawi',
            'home_laris_1_image' => 'featured-menu/laris-1.jpg',
            'home_laris_2_title' => 'Sanubari Signature Houseblend Espresso',
            'home_laris_2_subtitle' => 'Diformulasikan untuk Crema Tebal & Manis Karamel',
            'home_laris_2_href' => '/shop?category=espresso-beans',
            'home_laris_2_image' => 'featured-menu/laris-2.jpg',
            'home_laris_3_title' => 'C.Y.B.R Blend Sendiri',
            'home_laris_3_href' => '/cybr',
            'home_laris_3_image' => 'featured-menu/laris-3.jpg',
            'home_editorial_title' => 'Jejak Rasa & Edukasi Seduh',
            'home_editorial_subtitle' => 'Eksplorasi catatan roaster, cerita terroir Gunung Kawi, dan resep seduh presisi',
            'home_koleksi_title' => 'Koleksi Terbaru',
            'home_koleksi_subtitle' => 'Pilihan single origin dan houseblend siap kirim dengan jaminan tanggal sangrai baru',
            'home_flavor_title' => 'Temukan Kopi Sesuai Karakter Seduhan Anda!',
            'home_flavor_subtitle' => 'Pilih biji kopi berdasarkan preferensi aroma, metode seduh, atau kebutuhan bisnis',
            'home_flavor_items' => [
                [
                    'id' => 'manis-floral',
                    'title' => 'Manis & Floral',
                    'desc' => 'Single Origin Lereng Gunung Kawi',
                    'href' => '/shop?series=kawi',
                    'bgImage' => 'taste-recommendations/taste-1.jpg',
                ],
                [
                    'id' => 'fruity-juicy',
                    'title' => 'Fruity & Juicy',
                    'desc' => 'Inovasi CO-Ferment Buah Alami',
                    'href' => '/shop?series=co-ferment',
                    'bgImage' => 'taste-recommendations/taste-2.jpg',
                ],
                [
                    'id' => 'bold-cokelat',
                    'title' => 'Bold & Cokelat',
                    'desc' => 'Espresso Roast & Robusta Dampit',
                    'href' => '/shop?category=espresso-beans',
                    'bgImage' => 'taste-recommendations/taste-3.jpg',
                ],
                [
                    'id' => 'clean-washed',
                    'title' => 'Clean & Asam Cerah',
                    'desc' => 'Washed Classic Terroir Kawi',
                    'href' => '/shop?category=classic-process',
                    'bgImage' => 'taste-recommendations/taste-4.jpg',
                ],
                [
                    'id' => 'home-brewer',
                    'title' => 'Paket Seduh Rumah',
                    'desc' => 'Starter Pack Biji Kopi Pemula',
                    'href' => '/shop',
                    'bgImage' => 'taste-recommendations/taste-5.jpg',
                ],
                [
                    'id' => 'coffee-shop-b2b',
                    'title' => 'Pasokan Kedai B2B',
                    'desc' => 'Wholesale Grosir & Mesin Espresso',
                    'href' => '/wholesale',
                    'bgImage' => 'taste-recommendations/taste-6.jpg',
                ],
            ],
        ];

        foreach ($defaults as $key => $val) {
            $existing = Setting::where('key', $key)->first();
            if (! $existing) {
                Setting::set($key, $val);
            } elseif (is_string($existing->value) && str_contains($existing->value, 'images.unsplash.com') && is_string($val)) {
                // Upgrade obsolete unsplash placeholder to seeded local asset
                Setting::set($key, $val);
            }
        }

        // Seed Admin User for Filament
        \App\Models\User::updateOrCreate(
            ['email' => 'admin@app.com'],
            [
                'name' => 'Admin Sanubari',
                'password' => \Illuminate\Support\Facades\Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
    }

    protected function seedCategories(array $categories): array
    {
        $this->line('Seeding categories...');
        $map = []; // old_id => Category

        // Custom normalized category definitions
        $normalized = [
            'filter-beans' => [
                'name' => ['id' => 'Filter Beans', 'en' => 'Filter Beans'],
                'slug' => 'filter-beans',
                'type' => 'filter',
                'description' => ['id' => 'Koleksi biji kopi filter pilihan dengan profil sangrai light to medium.', 'en' => 'Curated filter coffee beans with light to medium roast profiles.'],
                'icon' => 'droplet',
                'sort_order' => 1,
            ],
            'espresso-beans' => [
                'name' => ['id' => 'Espresso Beans', 'en' => 'Espresso Beans'],
                'slug' => 'espresso-beans',
                'type' => 'espresso',
                'description' => ['id' => 'Biji kopi espresso dengan crema tebal, sweetness tinggi, dan body seimbang.', 'en' => 'Espresso beans crafted for rich crema, high sweetness, and balanced body.'],
                'icon' => 'flame',
                'sort_order' => 2,
            ],
            'kawi' => [
                'name' => ['id' => 'Koleksi Kawi', 'en' => 'Kawi Collection'],
                'slug' => 'kawi',
                'type' => 'brand',
                'description' => ['id' => 'Kopi signature hasil panen petani mitra lereng Gunung Kawi, Jawa Timur.', 'en' => 'Signature coffees harvested by partner farmers on the slopes of Mount Kawi, East Java.'],
                'icon' => 'mountain',
                'sort_order' => 3,
            ],
            'classic-process' => [
                'name' => ['id' => 'Classic Process', 'en' => 'Classic Process'],
                'slug' => 'classic-process',
                'type' => 'filter',
                'parent' => 'filter-beans',
                'description' => ['id' => 'Proses klasik: Washed, Natural, dan Honey yang menonjolkan karakter terroir.', 'en' => 'Classic Washed, Natural, and Honey processes highlighting terroir characteristics.'],
                'sort_order' => 11,
            ],
            'experimental-process' => [
                'name' => ['id' => 'Experimental Process', 'en' => 'Experimental Process'],
                'slug' => 'experimental-process',
                'type' => 'filter',
                'parent' => 'filter-beans',
                'description' => ['id' => 'Proses eksperimental: Anaerobic, Thermal Shock, dan Yeast Inoculation.', 'en' => 'Experimental processes: Anaerobic, Thermal Shock, and Yeast Inoculation.'],
                'sort_order' => 12,
            ],
            'co-ferment-process' => [
                'name' => ['id' => 'CO-Ferment Process', 'en' => 'CO-Ferment Process'],
                'slug' => 'co-ferment-process',
                'type' => 'filter',
                'parent' => 'filter-beans',
                'description' => ['id' => 'Inovasi co-fermentasi buah segar (Fruit Infused) yang intens dan aromatik.', 'en' => 'Fresh fruit co-fermentation innovations creating intense, aromatic cup profiles.'],
                'sort_order' => 13,
            ],
            'arabica' => [
                'name' => ['id' => 'Arabica Espresso', 'en' => 'Arabica Espresso'],
                'slug' => 'arabica',
                'type' => 'espresso',
                'parent' => 'espresso-beans',
                'description' => ['id' => '100% Arabika untuk espresso manis dan modern milk-based drinks.', 'en' => '100% Arabica for sweet espresso and modern milk-based drinks.'],
                'sort_order' => 21,
            ],
            'houseblend' => [
                'name' => ['id' => 'Houseblend', 'en' => 'Houseblend'],
                'slug' => 'houseblend',
                'type' => 'espresso',
                'parent' => 'espresso-beans',
                'description' => ['id' => 'Racikan signature Sanubari untuk coffee shop dan daily brew.', 'en' => 'Sanubari signature blends designed for cafes and daily brewing.'],
                'sort_order' => 22,
            ],
            'robusta' => [
                'name' => ['id' => 'Fine Robusta', 'en' => 'Fine Robusta'],
                'slug' => 'robusta',
                'type' => 'espresso',
                'parent' => 'espresso-beans',
                'description' => ['id' => 'Robusta pilihan bernutrisi tinggi dengan aroma cokelat dan rempah.', 'en' => 'Selected fine robusta with high body, chocolate and warm spice notes.'],
                'sort_order' => 23,
            ],
            'peralatan-seduh' => [
                'name' => ['id' => 'Peralatan Seduh', 'en' => 'Brewing Equipment'],
                'slug' => 'peralatan-seduh',
                'type' => 'merch',
                'description' => ['id' => 'Peralatan seduh kopi manual, dripper, tumbler, dan aksesoris berkualitas.', 'en' => 'Manual brewing gear, drippers, tumblers, and quality accessories.'],
                'icon' => 'filter',
                'sort_order' => 30,
            ],
        ];

        $models = [];
        // First pass: parents
        foreach ($normalized as $key => $conf) {
            if (empty($conf['parent'])) {
                $cat = Category::updateOrCreate(
                    ['slug' => $conf['slug']],
                    [
                        'name' => $conf['name'],
                        'type' => $conf['type'],
                        'description' => $conf['description'],
                        'icon' => $conf['icon'] ?? null,
                        'sort_order' => $conf['sort_order'],
                    ]
                );
                $models[$key] = $cat;
            }
        }

        // Second pass: children
        foreach ($normalized as $key => $conf) {
            if (! empty($conf['parent']) && isset($models[$conf['parent']])) {
                $cat = Category::updateOrCreate(
                    ['slug' => $conf['slug']],
                    [
                        'name' => $conf['name'],
                        'parent_id' => $models[$conf['parent']]->id,
                        'type' => $conf['type'],
                        'description' => $conf['description'],
                        'icon' => $conf['icon'] ?? null,
                        'sort_order' => $conf['sort_order'],
                    ]
                );
                $models[$key] = $cat;
            }
        }

        // Map original seed category slugs to our Category models
        $slugAliases = [
            'filter-bens' => 'filter-beans',
            'classic-process-filter-bens' => 'classic-process',
            'co-ferment-proses' => 'co-ferment-process',
            'experimental-process' => 'experimental-process',
            'espresso-beans' => 'espresso-beans',
            'arabica' => 'arabica',
            'houseblend' => 'houseblend',
            'robusta' => 'robusta',
            'kawi' => 'kawi',
        ];

        foreach ($categories as $cat) {
            $slug = $cat['slug'];
            $target = $slugAliases[$slug] ?? $slug;
            if (isset($models[$target])) {
                $map[$slug] = $models[$target];
            }
        }

        return ['models' => $models, 'aliases' => $slugAliases];
    }

    protected function seedProducts(array $products, array $categoryData): void
    {
        // 4 Special Equipment / Flash Sale products
        $equipmentProducts = [
            [
                'name' => 'Otten - Vietnam Drip XL',
                'slug' => 'otten-vietnam-drip-xl',
                'series' => 'equipment',
                'categories' => ['peralatan-seduh'],
                'price' => 189000,
                'original_price' => 249000,
                'images' => ['flashsale/vietnam_drip.jpg'],
                'shortDescription' => 'Alat seduh kopi tetes Vietnam Drip ukuran XL stainless steel tahan karat.',
                'description' => 'Otten Vietnam Drip XL merupakan alat seduh kopi tradisional Vietnam berbahan stainless steel food-grade berkualitas tinggi. Menghasilkan ekstraksi kopi pekat dan kaya body, sangat pas disajikan bersama susu kental manis untuk kopi susu Vietnam otentik.',
                'attributes' => [
                    [
                        'name' => 'Varian',
                        'terms' => ['Stainless XL'],
                    ],
                ],
            ],
            [
                'name' => 'Hario - Alat Seduh Saringan Kopi V60 Ceramic Cyan',
                'slug' => 'hario-v60-ceramic-cyan',
                'series' => 'equipment',
                'categories' => ['peralatan-seduh'],
                'price' => 159000,
                'original_price' => 200000,
                'images' => ['flashsale/v60_dripper.jpg'],
                'shortDescription' => 'Dripper keramik V60 02 warna Cyan ikonik dari Hario Jepang.',
                'description' => 'Hario V60 Ceramic Cyan Size 02 dirancang dengan alur spiral khas dan lubang tunggal besar di dasar untuk kontrol laju aliran air yang optimal. Bahan keramik menjaga retensi suhu selama penyeduhan manual pour-over.',
                'attributes' => [
                    [
                        'name' => 'Varian',
                        'terms' => ['Ceramic Cyan 02'],
                    ],
                ],
            ],
            [
                'name' => 'Fellow - Rocky Lowball Tumblers (Matte White / Black)',
                'slug' => 'fellow-rocky-lowball-tumblers',
                'series' => 'equipment',
                'categories' => ['peralatan-seduh'],
                'price' => 395000,
                'original_price' => 495000,
                'images' => ['flashsale/fellow_tumbler.jpg'],
                'shortDescription' => 'Tumbler insulasi ganda premium untuk menjaga suhu kopi panas & dingin.',
                'description' => 'Fellow Rocky Lowball Tumbler menghadirkan desain minimalis modern dengan lapisan keramik internal agar rasa kopi tetap murni tanpa aftertaste logam. Dinding vakum ganda menjaga minuman dingin hingga 12 jam dan panas hingga 3 jam.',
                'attributes' => [
                    [
                        'name' => 'Varian',
                        'terms' => ['Matte White / Black'],
                    ],
                ],
            ],
            [
                'name' => 'Hario V60 Station VSS-1-OV Olive Wood',
                'slug' => 'hario-v60-station-olive-wood',
                'series' => 'equipment',
                'categories' => ['peralatan-seduh'],
                'price' => 1850000,
                'original_price' => 2310000,
                'images' => ['flashsale/v60_wood_station.jpg'],
                'shortDescription' => 'Stand seduh kayu zaitun alami eksklusif untuk dripper dan server V60.',
                'description' => 'Hario VSS-1-OV terbuat dari kayu zaitun alami berkualitas tinggi dengan corak serat kayu yang hangat dan elegan. Cocok untuk slow bar roastery maupun meja seduh rumah para antusias specialty coffee.',
                'attributes' => [
                    [
                        'name' => 'Varian',
                        'terms' => ['Olive Wood Set'],
                    ],
                ],
            ],
        ];

        $allProducts = array_merge($products, $equipmentProducts);

        $this->line("Seeding products (" . count($allProducts) . " items)...");
        $shouldDownloadImages = $this->option('download-images');
        $models = $categoryData['models'];
        $aliases = $categoryData['aliases'];

        if ($shouldDownloadImages) {
            $imgDir = storage_path('app/public/seed/products');
            File::ensureDirectoryExists($imgDir);
        }

        $count = 0;
        foreach ($allProducts as $item) {
            $desc = $item['description'] ?? '';
            $specs = $this->extractSpecs($desc);

            // Determine series from categories or explicit series
            $series = $item['series'] ?? 'classic';
            $itemCats = $item['categories'] ?? [];
            if ($series === 'classic') {
                if (in_array('kawi', $itemCats)) {
                    $series = 'kawi';
                } elseif (in_array('co-ferment-proses', $itemCats)) {
                    $series = 'co-ferment';
                } elseif (in_array('experimental-process', $itemCats)) {
                    $series = 'experimental';
                } elseif (in_array('houseblend', $itemCats)) {
                    $series = 'houseblend';
                } elseif (in_array('robusta', $itemCats)) {
                    $series = 'robusta';
                } elseif (in_array('arabica', $itemCats)) {
                    $series = 'arabica';
                }
            }

            $minPrice = (float) ($item['priceRange']['min_amount'] ?? $item['price'] ?? 15000);
            $maxPrice = (float) ($item['priceRange']['max_amount'] ?? $item['price'] ?? 15000);
            if ($minPrice <= 0) $minPrice = 15000;
            if ($maxPrice < $minPrice) $maxPrice = $minPrice;

            $product = Product::updateOrCreate(
                ['slug' => $item['slug']],
                [
                    'name' => $item['name'],
                    'series' => $series,
                    'tagline' => [
                        'id' => $item['shortDescription'] ?: ($specs['tasting_notes'] ?? 'Artisan Specialty Coffee'),
                        'en' => $item['shortDescription'] ?: ($specs['tasting_notes'] ?? 'Artisan Specialty Coffee'),
                    ],
                    'description' => [
                        'id' => $desc,
                        'en' => $desc,
                    ],
                    'short_description' => $item['shortDescription'] ?: ($specs['tasting_notes'] ?? null),
                    'tasting_notes' => $specs['tasting_notes'] ?: ($item['shortDescription'] ?? null),
                    'origin' => $specs['origin'] ?: 'Malang, Jawa Timur',
                    'region' => $specs['region'] ?: ($series === 'kawi' ? 'Gunung Kawi' : null),
                    'varietal' => $specs['varietal'] ?: 'Mix Varietals',
                    'process' => $specs['process'] ?: ucfirst(str_replace('-', ' ', $series)),
                    'altitude' => $specs['altitude'] ?: '1200 - 1500 MASL',
                    'roast_level' => $specs['roast_level'] ?: ($series === 'espresso' || $series === 'houseblend' || $series === 'robusta' ? 'Medium' : 'Light to Medium'),
                    'brew_methods' => $specs['brew_methods'] ?: ($series === 'espresso' || $series === 'houseblend' ? ['Espresso', 'Moka Pot', 'Tubruk'] : ['V60', 'Aeropress', 'Kalita Wave', 'Cold Brew']),
                    'freshness_days' => 30,
                    'min_price' => $minPrice,
                    'max_price' => $maxPrice,
                    'is_featured' => $series === 'kawi' || $series === 'equipment' || $count < 8,
                    'is_new' => $count < 6,
                    'status' => 'active',
                    'released_at' => now()->subDays($count * 2),
                ]
            );

            // Attach categories
            $catIds = [];
            foreach ($itemCats as $catSlug) {
                $targetSlug = $aliases[$catSlug] ?? $catSlug;
                if (isset($models[$targetSlug])) {
                    $catIds[] = $models[$targetSlug]->id;
                }
            }
            if (! empty($catIds)) {
                $product->categories()->sync($catIds);
            }

            // Sync variants
            $this->syncVariants($product, $item, $minPrice, $maxPrice);

            // Sync images
            $this->syncImages($product, $item['images'] ?? [], $shouldDownloadImages);

            $count++;
        }

        $this->line("Synced {$count} products with variants and images.");
    }

    protected function syncVariants(Product $product, array $item, float $minPrice, float $maxPrice): void
    {
        $existingVariants = $product->variants()->get()->keyBy('label');
        $targetWeights = [
            ['label' => '15 gr (Tester)', 'weight' => 15, 'price' => $minPrice, 'image' => 'products/variants/variant-15g.jpg'],
            ['label' => '100 gr', 'weight' => 100, 'price' => round($minPrice + (($maxPrice - $minPrice) * 0.4)), 'image' => 'products/variants/variant-100g.jpg'],
            ['label' => '200 gr', 'weight' => 200, 'price' => round($minPrice + (($maxPrice - $minPrice) * 0.7)), 'image' => 'products/variants/variant-200g.jpg'],
            ['label' => '500 gr', 'weight' => 500, 'price' => round($maxPrice * 1.8), 'image' => null],
            ['label' => '1 kg', 'weight' => 1000, 'price' => round($maxPrice * 3.2), 'image' => null],
        ];

        // If specific variation terms are given in attributes
        $terms = $item['attributes'][0]['terms'] ?? [];
        if (! empty($terms)) {
            $targetWeights = [];
            foreach ($terms as $idx => $term) {
                $w = ProductVariant::parseWeightFromLabel((string) $term) ?? (int) filter_var($term, FILTER_SANITIZE_NUMBER_INT);
                if ($w <= 0) $w = 200;
                $p = $minPrice + ($idx * (($maxPrice - $minPrice) / max(1, count($terms) - 1)));
                $img = match (true) {
                    ! empty($item['images'][0]) && ! str_contains($item['images'][0], 'wp-content') => $item['images'][0],
                    $w <= 25 => 'products/variants/variant-15g.jpg',
                    $w <= 120 => 'products/variants/variant-100g.jpg',
                    $w <= 250 => 'products/variants/variant-200g.jpg',
                    default => null,
                };
                $targetWeights[] = [
                    'label' => $term,
                    'weight' => $w,
                    'price' => round($p),
                    'original_price' => $item['original_price'] ?? null,
                    'image' => $img,
                ];
            }
        }

        foreach ($targetWeights as $idx => $v) {
            $existing = $existingVariants->get($v['label']);
            $imageToUse = $existing?->image ?: $v['image'];

            ProductVariant::updateOrCreate(
                [
                    'product_id' => $product->id,
                    'label' => $v['label'],
                ],
                [
                    'weight_grams' => $v['weight'],
                    'price' => $existing?->price ?? $v['price'],
                    'original_price' => $existing?->original_price ?? ($v['original_price'] ?? ($idx === 1 ? round($v['price'] * 1.15) : null)),
                    'stock_status' => $existing?->stock_status ?? 'in_stock',
                    'sku' => $existing?->sku ?? "SNB-{$product->id}-{$v['weight']}",
                    'image' => $imageToUse,
                ]
            );
        }
    }

    protected function syncImages(Product $product, array $images, bool $download): void
    {
        ProductImage::where('product_id', $product->id)->delete();

        // 1. Filter out remote WordPress URLs and collect local paths
        $filteredImages = [];
        foreach ($images as $img) {
            if (! str_contains($img, 'wp-content') && ! str_contains($img, 'sanubariroastery.id') && ! str_starts_with($img, 'http')) {
                $filteredImages[] = $img;
            }
        }

        // 2. Fallback to clean curated local assets (strip all wp/ usage completely)
        if (empty($filteredImages)) {
            $filteredImages = match ($product->series) {
                'kawi' => ['taste-recommendations/taste-1.jpg', 'products/variants/variant-200g.jpg', 'products/gallery/roasting-pratter-cooling.jpg'],
                'co-ferment' => ['taste-recommendations/taste-2.jpg', 'products/variants/variant-100g.jpg', 'products/gallery/roasting-pratter-cooling.jpg'],
                'espresso', 'houseblend' => ['taste-recommendations/taste-3.jpg', 'featured-menu/laris-2.jpg', 'products/gallery/roasting-pratter-cooling.jpg'],
                'robusta' => ['taste-recommendations/taste-3.jpg', 'products/variants/variant-200g.jpg', 'products/gallery/roasting-pratter-cooling.jpg'],
                'experimental' => ['taste-recommendations/taste-2.jpg', 'products/variants/variant-100g.jpg', 'products/gallery/roasting-pratter-cooling.jpg'],
                'equipment' => ['flashsale/v60_dripper.jpg'],
                default => ['taste-recommendations/taste-4.jpg', 'products/variants/variant-100g.jpg', 'products/gallery/roasting-pratter-cooling.jpg'],
            };
        }

        foreach (array_slice($filteredImages, 0, 4) as $idx => $path) {
            ProductImage::create([
                'product_id' => $product->id,
                'path' => $path,
                'alt' => "{$product->name} photo " . ($idx + 1),
                'sort_order' => $idx,
                'is_primary' => $idx === 0,
            ]);
        }
    }

    protected function extractSpecs(string $text): array
    {
        $specs = [
            'origin' => null,
            'region' => null,
            'varietal' => null,
            'process' => null,
            'altitude' => null,
            'brew_methods' => null,
            'tasting_notes' => null,
            'roast_level' => null,
        ];

        if (preg_match('/Origin\s*:\s*([^V\n\r]+?)(?=\s*Varietas|\s*Process|\s*Altitude|\s*Brew|\s*Taste|\s*Notes|\s*Package|$)/i', $text, $m)) {
            $specs['origin'] = trim($m[1], " ,.\t\n\r");
        }
        if (preg_match('/Varietas\s*:\s*([^P\n\r]+?)(?=\s*Process|\s*Altitude|\s*Brew|\s*Taste|\s*Notes|\s*Package|$)/i', $text, $m)) {
            $specs['varietal'] = trim($m[1], " ,.\t\n\r");
        }
        if (preg_match('/Process\s*:\s*([^A\n\r]+?)(?=\s*Altitude|\s*Brew|\s*Taste|\s*Notes|\s*Package|$)/i', $text, $m)) {
            $specs['process'] = trim($m[1], " ,.\t\n\r");
        }
        if (preg_match('/Altitude\s*:\s*([^B\n\r]+?)(?=\s*Brew|\s*Taste|\s*Notes|\s*Package|$)/i', $text, $m)) {
            $specs['altitude'] = trim($m[1], " ,.\t\n\r");
        }
        if (preg_match('/Taste Profille?\s*:\s*([^N\n\r]+?)(?=\s*Notes|\s*Package|$)/i', $text, $m)) {
            $specs['tasting_notes'] = trim($m[1], " ,.\t\n\r");
        }
        if (preg_match('/Brew Method\s*:\s*([^T\n\r]+?)(?=\s*Taste|\s*Notes|\s*Package|$)/i', $text, $m)) {
            $rawMethods = trim($m[1], " ,.\t\n\r");
            $specs['brew_methods'] = array_map('trim', explode(',', $rawMethods));
        }

        return $specs;
    }

    protected function seedContent(): void
    {
        $this->line('Seeding journal posts, brew guides, and events...');

        // Posts
        $posts = [
            [
                'title' => [
                    'id' => 'Menyusuri Jejak Kopi di Lereng Gunung Kawi',
                    'en' => 'Tracing Coffee Heritage on the Slopes of Mount Kawi',
                ],
                'slug' => 'jejak-kopi-lereng-gunung-kawi',
                'category' => 'Origin Story',
                'excerpt' => [
                    'id' => 'Mengapa Gunung Kawi memiliki tanah vulkanis dan iklim mikro sempurna yang menghasilkan profil rasa manis madu alami pada biji kopi Sanubari.',
                    'en' => 'Why Mount Kawi possesses the ideal volcanic terroir and microclimate yielding natural honey sweetness in Sanubari beans.',
                ],
                'body' => [
                    'id' => "Terletak di barat daya Kota Malang, Gunung Kawi tidak hanya dikenal dengan keindahan alamnya, namun juga sebagai surga tersembunyi bagi perkebunan kopi specialty di ketinggian 1.200 hingga 1.600 meter di atas permukaan laut.\n\nSanubari Roastery bermitra langsung dengan kelompok tani lokal di Kawi untuk menerapkan praktik petik merah selektif dan pengolahan pasca panen presisi. Hasilnya adalah cangkir kopi yang kaya akan aroma bunga kopi, buah plum manis, dan keasaman seimbang yang lembut di lambung.",
                    'en' => "Located southwest of Malang, Mount Kawi is not only celebrated for its serene landscapes, but also as a hidden gem for specialty coffee farming between 1,200 and 1,600 MASL.\n\nSanubari Roastery partners directly with local smallholders on Kawi, establishing selective red-cherry harvesting and precise post-harvest fermentation. The outcome is a distinctive cup bursting with floral aromatics, sweet plum notes, and smooth, balanced acidity.",
                ],
                'cover_image' => 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80',
                'author_name' => 'Didik Kurniawan',
                'read_time_minutes' => 4,
                'published_at' => now()->subDays(5),
            ],
            [
                'title' => [
                    'id' => 'Memahami Eksperimen CO-Fermentasi pada Kopi Spesialti',
                    'en' => 'Understanding CO-Fermentation Experiments in Specialty Coffee',
                ],
                'slug' => 'memahami-eksperimen-co-fermentasi',
                'category' => 'Innovation',
                'excerpt' => [
                    'id' => 'Bagaimana proses fermentasi bersama sari buah segar menghadirkan pengalaman sensorik yang luar biasa tanpa menghilangkan esensi terroir biji kopi.',
                    'en' => 'How co-fermentation with fresh fruit extracts produces extraordinary sensory profiles while preserving core terroir characteristics.',
                ],
                'body' => [
                    'id' => "CO-Fermentasi (Co-Fermentation) adalah salah satu inovasi pascapanen paling dinamis di industri kopi modern. Dengan menambahkan ragi alami dan ekstrak buah murni selama fase fermentasi anaerobik tertutup, bakteri pengurai bekerja mengubah gula alami biji kopi sambil mengikat molekul aromatik buah.\n\nDi Sanubari, kami memastikan kadar fermentasi terkontrol ketat demi menghasilkan rasa yang harmonis: buah berry segar yang meledak di lidah, diakhiri dengan aftertaste cokelat susu yang manis dan bersih.",
                    'en' => "Co-fermentation represents one of the most vibrant innovations in specialty processing. By introducing natural yeasts and pure fruit juices into controlled anaerobic tanks, fermentation breaks down sugars while weaving aromatic fruity compounds into the beans.\n\nAt Sanubari, tight monitoring ensures harmonious cup clarity: vibrant berry bursts finishing with long, sweet milk chocolate notes.",
                ],
                'cover_image' => 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80',
                'author_name' => 'Sanubari Roaster',
                'read_time_minutes' => 5,
                'published_at' => now()->subDays(12),
            ],
            [
                'title' => [
                    'id' => 'Panduan Memilih Profil Sangrai: Light, Medium, atau Dark?',
                    'en' => 'Guide to Choosing Roast Profiles: Light, Medium, or Dark?',
                ],
                'slug' => 'panduan-memilih-profil-sangrai',
                'category' => 'Roastery Guide',
                'excerpt' => [
                    'id' => 'Pelajari perbedaan karakter rasa, tingkat keasaman, dan metode seduh paling pas untuk masing-masing tingkat sangrai.',
                    'en' => 'Learn the nuances of flavor, acidity, and brewing methods suited for each roast development level.',
                ],
                'body' => [
                    'id' => "Tingkat sangrai menentukan seberapa jauh gula alami dan senyawa asam dalam biji kopi didegradasi oleh panas drum roaster.\n\nLight roast menjaga karakter terroir dan asam buah yang jernih, sangat ideal untuk seduhan manual V60. Medium roast menyeimbangkan manis karamel dan body yang bulat, cocok untuk seduhan harian. Dark roast menonjolkan minyak esensial dan aftertaste cokelat pekat tanpa rasa gosong.",
                    'en' => "Roast levels define how sugars and organic acids inside the bean caramelize under drum heat.\n\nLight roast preserves terroir acidity, perfect for manual pour-over. Medium roast balances caramel sweetness with rounded body. Dark roast emphasizes dark cocoa notes and crema density without bitterness.",
                ],
                'cover_image' => 'https://images.unsplash.com/photo-1518832553480-cd0e625ed3e6?auto=format&fit=crop&w=1200&q=80',
                'author_name' => 'Sanubari Roaster',
                'read_time_minutes' => 4,
                'published_at' => now()->subDays(18),
            ],
            [
                'title' => [
                    'id' => 'Direct Trade: Menjaga Kemitraan Berkelanjutan dengan Petani Kawi',
                    'en' => 'Direct Trade: Sustaining Partnerships with Kawi Coffee Farmers',
                ],
                'slug' => 'direct-trade-petani-kawi',
                'category' => 'Terroir & Community',
                'excerpt' => [
                    'id' => 'Transparansi rantai pasok dan komitmen harga adil Sanubari dalam menjaga kelestarian kebun kopi rakyat di lereng Gunung Kawi.',
                    'en' => 'Supply chain transparency and fair price commitments by Sanubari supporting local smallholder farmers on Mount Kawi.',
                ],
                'body' => [
                    'id' => "Bagi Sanubari, kualitas secangkir kopi berawal dari kesejahteraan petani yang merawat pohonnya di lereng Gunung Kawi.\n\nMelalui skema Direct Trade, kami membeli ceri merah dengan harga premium di atas pasar komoditas, mendampingi proses pascapanen, dan menjamin serapan panen secara konsisten setiap musim. Hubungan saling percaya ini melahirkan biji kopi spesialti dengan standar mutu tertinggi.",
                    'en' => "At Sanubari, cup quality begins with the well-being of the farming families tending Mount Kawi slopes.\n\nThrough direct trade relationships, we purchase ripe red cherries at significant premiums above commodity prices, assist with controlled fermentation, and guarantee seasonal harvest uptake.",
                ],
                'cover_image' => 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=1200&q=80',
                'author_name' => 'Didik Kurniawan',
                'read_time_minutes' => 5,
                'published_at' => now()->subDays(24),
            ],
        ];

        foreach ($posts as $post) {
            $post['type'] = 'article';
            Post::updateOrCreate(['slug' => $post['slug']], $post);
        }

        // Brew Guides (type = 'guide')
        $guides = [
            [
                'slug' => 'v60-pourover',
                'title' => [
                    'id' => 'V60 Pour Over — Bersih, Terang & Manis',
                    'en' => 'V60 Pour Over — Clean, Bright & Sweet',
                ],
                'method' => 'V60',
                'difficulty' => 'Mudah',
                'brew_time' => '2:45 menit',
                'ratio' => '1:15 (15g kopi : 225ml air)',
                'grind_size' => 'Medium-Fine',
                'water_temp' => '92°C',
                'description' => [
                    'id' => 'Resep andalan tim Sanubari untuk mengeluarkan karakter floral dan fruity pada lini Filter Beans kami.',
                    'en' => 'Sanubari signature recipe to extract vibrant floral and fruity notes from our Filter Beans.',
                ],
                'steps' => [
                    ['step' => 1, 'time' => '0:00 - 0:45', 'text' => 'Blooming 45g air, biarkan mekar merata dan keluarkan gas CO2.'],
                    ['step' => 2, 'time' => '0:45 - 1:30', 'text' => 'Tuang kedua perlahan hingga 135g dengan gerakan melingkar teratur.'],
                    ['step' => 3, 'time' => '1:30 - 2:15', 'text' => 'Tuang akhir di tengah hingga mencapai 225g.'],
                    ['step' => 4, 'time' => '2:15 - 2:45', 'text' => 'Biarkan air turun seluruhnya. Aduk server perlahan dan nikmati.'],
                ],
                'cover_image' => 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80',
                'sort_order' => 1,
            ],
            [
                'slug' => 'aeropress-recipe',
                'title' => [
                    'id' => 'AeroPress Inverted — Body Tebal & Juicy',
                    'en' => 'AeroPress Inverted — Juicy & Full-Bodied',
                ],
                'method' => 'AeroPress',
                'difficulty' => 'Mudah',
                'brew_time' => '2:00 menit',
                'ratio' => '1:14 (16g kopi : 220ml air)',
                'grind_size' => 'Medium',
                'water_temp' => '90°C',
                'description' => [
                    'id' => 'Metode inverted menghadirkan kepekatan rasa yang intens dan body yang memuaskan.',
                    'en' => 'Inverted method providing intense flavor concentration and satisfying mouthfeel.',
                ],
                'steps' => [
                    ['step' => 1, 'time' => '0:00 - 0:30', 'text' => 'Pasang AeroPress inverted, masukkan 16g kopi, tuang 100g air dan aduk 3 kali.'],
                    ['step' => 2, 'time' => '0:30 - 1:15', 'text' => 'Tuang sisa air hingga 220g. Pasang filter cap yang sudah dibilas.'],
                    ['step' => 3, 'time' => '1:15 - 1:45', 'text' => 'Balikkan ke atas cangkir / server dengan hati-hati.'],
                    ['step' => 4, 'time' => '1:45 - 2:00', 'text' => 'Tekan plunger perlahan dan stabil selama 30 detik.'],
                ],
                'cover_image' => 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=1200&q=80',
                'sort_order' => 2,
            ],
            [
                'slug' => 'kopi-tubruk-nusantara',
                'title' => [
                    'id' => 'Kopi Tubruk Tradisional — Klasik & Kaya Rasa',
                    'en' => 'Traditional Kopi Tubruk — Authentic & Rich',
                ],
                'method' => 'Tubruk',
                'difficulty' => 'Sangat Mudah',
                'brew_time' => '4:00 menit',
                'ratio' => '1:12 (12g kopi : 150ml air)',
                'grind_size' => 'Fine',
                'water_temp' => '95°C',
                'description' => [
                    'id' => 'Seduhan khas nusantara yang menonjolkan aroma otentik kopi Gunung Kawi dan Fine Robusta.',
                    'en' => 'Classic Indonesian immersion technique showcasing authentic Gunung Kawi notes.',
                ],
                'steps' => [
                    ['step' => 1, 'time' => '0:00', 'text' => 'Masukkan 12g kopi giling halus ke dalam cangkir kaca.'],
                    ['step' => 2, 'time' => '0:30', 'text' => 'Tuang air panas 95°C sebanyak 150ml.'],
                    ['step' => 3, 'time' => '0:30 - 4:00', 'text' => 'Biarkan terendam selama 4 menit tanpa diaduk terlebih dahulu.'],
                    ['step' => 4, 'time' => '4:00', 'text' => 'Aduk lapisan atas (crust) perlahan agar ampas mengendap ke dasar cangkir.'],
                ],
                'cover_image' => 'https://images.unsplash.com/photo-1518832553480-cd0e625ed3e6?auto=format&fit=crop&w=1200&q=80',
                'sort_order' => 3,
            ],
        ];

        foreach ($guides as $guide) {
            $guide['type'] = 'guide';
            BrewGuide::updateOrCreate(['slug' => $guide['slug']], $guide);
        }

        // Events (type = 'event')
        $events = [
            [
                'slug' => 'public-cupping-kawi',
                'title' => [
                    'id' => 'Public Cupping: Menjelajah Micro-lot Gunung Kawi',
                    'en' => 'Public Cupping: Exploring Mount Kawi Micro-lots',
                ],
                'description' => [
                    'id' => 'Sesi cupping terbuka untuk umum mencicipi 8 varietas dan proses terbaru dari perkebunan mitra kami di Kawi, didampingi head roaster Sanubari.',
                    'en' => 'Open cupping session tasting 8 fresh varietals and experimental lots from our partner Kawi farms, hosted by our head roaster.',
                ],
                'location' => 'Sanubari Roastery x Alat Kopi Malang',
                'address' => 'Jl. Terusan Kawi No. 12, Klojen, Malang',
                'fee' => 50000,
                'capacity' => 16,
                'starts_at' => now()->addDays(7)->setTime(15, 0),
                'ends_at' => now()->addDays(7)->setTime(17, 30),
                'status' => 'open',
                'whatsapp_register_text' => 'Halo Sanubari, saya ingin mendaftar Public Cupping Gunung Kawi',
                'cover_image' => 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1200&q=80',
            ],
        ];

        foreach ($events as $event) {
            $event['type'] = 'event';
            Event::updateOrCreate(['slug' => $event['slug']], $event);
        }
    }
}
