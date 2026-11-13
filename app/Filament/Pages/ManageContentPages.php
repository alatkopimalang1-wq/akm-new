<?php

namespace App\Filament\Pages;

use App\Models\Setting;
use App\Support\IconCatalog;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Schemas\Components\Actions;
use Filament\Schemas\Components\EmbeddedSchema;
use Filament\Schemas\Components\Form;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Illuminate\Support\Facades\Cache;

class ManageContentPages extends Page
{
    protected static string|BackedEnum|null $navigationIcon = Heroicon::DocumentDuplicate;

    protected static string|\UnitEnum|null $navigationGroup = 'Pengaturan';

    protected static ?string $navigationLabel = 'Halaman Konten (Tentang, Wholesale, Roasting, Kunjungi, Blog)';

    protected static ?string $title = 'Pengaturan Halaman Konten (Tentang, Wholesale, Roasting, Kunjungi, Blog)';

    protected static ?int $navigationSort = 12;

    /**
     * @var array<string, mixed> | null
     */
    public ?array $data = [];

    public function mount(): void
    {
        $settings = Setting::all()->pluck('value', 'key')->toArray();

        $pageAbout = $settings['page_about'] ?? [];
        $pageWholesale = $settings['page_wholesale'] ?? [];
        $pageVisit = $settings['page_visit'] ?? [];
        $pageRoasting = $settings['page_roasting'] ?? [];
        $pageBarista = $settings['page_barista_training'] ?? [];
        $pageEvents = $settings['page_events'] ?? [];
        $pageBlog = $settings['page_blog'] ?? [];
        $pageBooking = $settings['page_booking_tempat'] ?? [];
        $pageCatering = $settings['page_coffee_catering'] ?? [];

        $defaultAboutPillars = [
            [
                'title' => 'Terroir Gunung Kawi',
                'description' => 'Ketinggian 1.200–1.600 mdpl dengan tanah andosol vulkanis menghasilkan cangkir kopi manis madu alami dan keasaman seimbang yang ramah di lambung.',
            ],
            [
                'title' => 'Direct & Fair Trade',
                'description' => 'Membeli hasil panen langsung dari petani mitra di lereng Kawi dengan harga di atas pasar komoditas untuk mendukung keberlanjutan kebun lokal.',
            ],
            [
                'title' => 'Fresh Roast Precision',
                'description' => 'Menggunakan kurva roasting digital presisi dan pengujian sensorik cupping pada setiap batch sebelum dikemas dan dikirimkan ke pelanggan.',
            ],
        ];

        $defaultWholesaleBenefits = [
            [
                'title' => 'Harga Grosir Bertingkat',
                'description' => 'Potongan harga berjenjang mulai dari order 5 kg, 10 kg, hingga kontrak pasokan bulanan rutin dengan jaminan ketersediaan stok panen.',
            ],
            [
                'title' => 'Custom Roast Profile',
                'description' => 'Kembangkan profil sangrai eksklusif (signature houseblend) khusus untuk karakter menu coffee shop Anda bersama head roaster kami.',
            ],
            [
                'title' => 'Paket Mesin & Barista Training',
                'description' => 'Bundling mesin espresso komersial, grinder, dan kalibrasi seduh berkala bersama tim teknisi Alat Kopi Malang.',
            ],
        ];

        $defaultWholesaleGallery = [
            [
                'image' => 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=80',
                'caption' => 'Setup mesin espresso komersial & kalibrasi grinder di coffee shop mitra',
            ],
            [
                'image' => 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1000&q=80',
                'caption' => 'Batch roasting segar biji kopi Gunung Kawi kemasan 1 kg dengan one-way valve',
            ],
            [
                'image' => 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1000&q=80',
                'caption' => 'Sesi cupping kalibrasi profil signature houseblend bersama pemilik kedai',
            ],
        ];

        $defaultVisitFacilities = [
            [
                'title' => 'Slow Bar & Manual Brew',
                'description' => 'Cicipi biji kopi musiman single origin pilihan diseduh langsung dengan berbagai metode manual.',
            ],
            [
                'title' => 'Showroom Mesin Espresso',
                'description' => 'Eksplorasi dan coba langsung mesin espresso komersial serta grinder bersama teknisi kami.',
            ],
            [
                'title' => 'Beli Biji Kopi Fresh Roast',
                'description' => 'Tersedia puluhan varian biji kopi sangrai segar lereng Kawi dan Nusantara siap dibawa pulang.',
            ],
        ];

        $defaultVisitGallery = [
            [
                'image' => 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
                'caption' => 'Slow Bar Manual Brew & Kalibrasi Rasa',
            ],
            [
                'image' => 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=800&q=80',
                'caption' => 'Mesin Roasting Digital & Kurva Sangrai Presisi',
            ],
            [
                'image' => 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
                'caption' => 'Showroom Mesin Espresso & Grinder Komersial',
            ],
            [
                'image' => 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
                'caption' => 'Koleksi Biji Kopi Fresh Roast Siap Dibawa Pulang',
            ],
            [
                'image' => 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=80',
                'caption' => 'Eksplorasi Rasa Cupping Session Bersama Barista',
            ],
            [
                'image' => 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=800&q=80',
                'caption' => 'Suasana Nyaman Showroom Malang di Jl. Terusan Kawi',
            ],
        ];

        $defaultRoastingPackages = [
            [
                'name' => 'Sample & R&D Profile',
                'capacity' => '1 – 3 kg',
                'price' => 'Rp 45.000 / kg',
                'badge' => 'Riset Resep',
                'is_popular' => false,
                'description' => 'Ideal untuk riset profil rasa baru atau pengujian sampel green bean sebelum komitmen skala besar.',
                'features' => "Perekaman kurva Artisan\nUji cupping & sensorik notes\nOpsi profil Filter & Espresso\nKemasan sample standing pouch",
            ],
            [
                'name' => 'Batch Komersial (Kedai Kopi)',
                'capacity' => '5 – 30 kg',
                'price' => 'Rp 28.000 / kg',
                'badge' => 'Paling Populer',
                'is_popular' => true,
                'description' => 'Pilihan utama kedai kopi dan brand independen yang membutuhkan pasokan houseblend atau single origin rutin mingguan.',
                'features' => "Profil sangrai eksklusif tersimpan\nJaminan konsistensi antar-batch\nProses destoner pembersih kerikil\nPengemasan standing pouch dengan valve\nDiskon volume untuk kontrak bulanan",
            ],
            [
                'name' => 'Batch Skala Besar & Maklon',
                'capacity' => '> 50 kg',
                'price' => 'Rp 22.000 / kg',
                'badge' => 'Harga Grosir',
                'is_popular' => false,
                'description' => 'Layanan maklon sangrai volume besar untuk roastery partner, distributor, dan pengadaan oleh-oleh / korporat.',
                'features' => "Kapasitas sangrai terjadwal prioritas\nLayanan labeling & sablon kemasan\nLaporan quality control lengkap\nPengiriman via kargo darat/udara murah",
            ],
        ];

        $defaultRoastingGallery = [
            [
                'image' => 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=800&q=80',
                'caption' => 'Proses Sangrai Biji Kopi Menggunakan Mesin Roasting Presisi',
            ],
            [
                'image' => 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
                'caption' => 'Pendinginan Cepat (Cooling Bin) Biji Kopi Sangrai Segar',
            ],
            [
                'image' => 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
                'caption' => 'Cupping Session Sensorik Bersama Head Roaster',
            ],
            [
                'image' => 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
                'caption' => 'Pemeriksaan Visual Warna Sangrai Agtron Scale',
            ],
            [
                'image' => 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=80',
                'caption' => 'Pengemasan Biji Kopi Fresh Roast dengan Valve Food Grade',
            ],
            [
                'image' => 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=800&q=80',
                'caption' => 'Green Bean Pilihan Terkurasi Siap Masuk Drum Sangrai',
            ],
        ];

        $defaultBaristaPackages = [
            [
                'name' => 'Kelas Basic',
                'duration' => '2 Hari (4-5 Jam / hari)',
                'price' => 'Rp 1.500.000 / 2 Orang',
                'badge' => 'PEMULA',
                'is_popular' => false,
                'description' => 'Kelas dasar komprehensif bagi pemula atau calon barista untuk menguasai kalibrasi espresso dan teknik susu yang sempurna.',
                'features' => "Teori dasar biji kopi\nMengenal dasar manual brew dan espresso based\nTeknik pouring, ratio, ekstraksi kopi manual brew\nLatte art pola dasar\nSOP kebersihan mesin & daily maintenance\nSertifikat Resmi Alat Kopi Malang\nBisa diisi untuk 2 Orang\nJam bisa menyesuaikan",
            ],
            [
                'name' => 'Kelas Advance',
                'duration' => '3 Hari (4-5 jam / hari)',
                'price' => 'Rp 1.900.000 / 2 orang',
                'badge' => 'ADVANCE',
                'is_popular' => true,
                'description' => 'Kelas dasar komprehensif bagi pemula atau calon barista untuk menguasai kalibrasi espresso dan membuat menu milk based, mocktail dan menu kekinian.',
                'features' => "Teori dasar biji kopi\nMengenal dasar manual brew dan espresso based\nTeknik pouring, ratio, ekstraksi kopi manual brew\nLatte art pola dasar\nSOP kebersihan mesin kopi dan maintenance\nMeracik minuman dingin seperti mocktail, milk based, es kopi susu\nSertifikat resmi Alat Kopi Malang\nBisa diisi untuk 2 orang\nJadwal bisa menyesuaikan",
            ],
        ];

        $defaultBaristaGallery = [
            [
                'image' => 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
                'caption' => 'Praktik Kalibrasi Grinder dan Ekstraksi Espresso Mesin Komersial',
            ],
            [
                'image' => 'https://images.unsplash.com/photo-1534040385115-33dcb3acba5b?auto=format&fit=crop&w=800&q=80',
                'caption' => 'Latihan Teknik Milk Steaming dan Pouring Latte Art Presisi',
            ],
            [
                'image' => 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
                'caption' => 'Teknik Manual Brew Pour Over V60 Memperhatikan Flow Rate',
            ],
            [
                'image' => 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
                'caption' => 'Sesi Cupping Sensory Mengidentifikasi Tasting Notes Kopi',
            ],
            [
                'image' => 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80',
                'caption' => 'Simulasi Alur Kerja Barista Saat Menghadapi Rush Hour Kedai',
            ],
            [
                'image' => 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=800&q=80',
                'caption' => 'Suasana Belajar Nyaman di Alat Kopi Malang Showroom Malang',
            ],
        ];

        $defaultEventsGallery = [
            [
                'image' => 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
                'caption' => 'Sesi Cupping Kalibrasi Rasa Bersama Komunitas Kopi Malang',
            ],
            [
                'image' => 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
                'caption' => 'Workshop Manual Brew Pour Over V60 dan Eksplorasi Rasio Seduh',
            ],
            [
                'image' => 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
                'caption' => 'Diskusi Dialing Espresso dan Sensori Profil Kopi Lereng Kawi',
            ],
        ];

        $this->form->fill([
            // --- 1. Tentang Kami ---
            'about_hero_badge' => $pageAbout['hero_badge'] ?? 'Didirikan di Malang sejak 2017',
            'about_hero_title' => $pageAbout['hero_title'] ?? 'Dedikasi pada Setiap Cangkir Kopi',
            'about_hero_description' => $pageAbout['hero_description'] ?? 'Alat Kopi Malang berfokus mengangkat karakter biji kopi lereng Gunung Kawi ke cangkir Anda, melalui pemetikan selektif, kurva sangrai digital, dan pengujian rasa yang jujur.',
            'about_hero_image' => $pageAbout['hero_image'] ?? null,

            'about_story_title' => $pageAbout['story_title'] ?? 'Mengapa Nama Kami Alat Kopi Malang',
            'about_story_subtitle' => $pageAbout['story_subtitle'] ?? 'Menghubungkan jerih payah petani lereng Gunung Kawi langsung dengan cangkir kopi Anda.',
            'about_story_p1' => $pageAbout['story_p1'] ?? 'Bagi kami, setiap biji kopi membawa cerita perjalanan panjang: dari tanah vulkanis lereng Gunung Kawi pada ketinggian 1.200–1.600 meter, kabut sore yang memperlambat pematangan buah, ketelitian tangan petani saat memetik buah merah, hingga kalibrasi kurva sangrai di roastery kami di Kota Malang.',
            'about_story_p2' => $pageAbout['story_p2'] ?? 'Kami menjaga kemitraan langsung dengan petani lokal tanpa perantara spekulan, sehingga petani mendapatkan harga yang adil dan Anda mendapatkan biji kopi segar dengan jejak asal-usul yang jelas.',
            'about_story_image' => $pageAbout['story_image'] ?? 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1200&q=80',

            'about_video_upload' => $pageAbout['video_upload'] ?? null,
            'about_video_url' => $pageAbout['video_url'] ?? null,
            'about_video_title' => $pageAbout['video_title'] ?? 'Suasana Studio Roastery & Dedikasi Rasa',
            'about_video_subtitle' => $pageAbout['video_subtitle'] ?? 'Dokumentasi proses sangrai digital presisi dan jejak terroir lereng Gunung Kawi.',
            'about_video_poster' => $pageAbout['video_poster'] ?? null,
            'about_video_position' => $pageAbout['video_position'] ?? 'section',

            'about_values_title' => $pageAbout['values_title'] ?? 'Tiga Pilar Utama Alat Kopi Malang',
            'about_values_subtitle' => $pageAbout['values_subtitle'] ?? 'Prinsip nyata yang kami jalankan di setiap batch kopi yang kami sangrai.',
            'about_pillars' => ! empty($pageAbout['pillars']) ? $pageAbout['pillars'] : $defaultAboutPillars,

            // --- 2. Kemitraan Kedai (Wholesale) ---
            'wholesale_hero_badge' => $pageWholesale['hero_badge'] ?? 'Kemitraan B2B & Pasokan Kedai',
            'wholesale_hero_title' => $pageWholesale['hero_title'] ?? 'Pasokan Biji Kopi Grosir & Setup Kedai',
            'wholesale_hero_description' => $pageWholesale['hero_description'] ?? 'Konsistensi rasa dari batch ke batch, profil sangrai kustom untuk signature drink, dan bundling mesin espresso komersial bersama Alat Kopi Malang.',
            'wholesale_hero_image' => (! empty($pageWholesale['hero_image']) && ! str_starts_with($pageWholesale['hero_image'], 'http')) ? str_replace('/storage/', '', $pageWholesale['hero_image']) : null,
            'wholesale_hero_image_url' => (! empty($pageWholesale['hero_image']) && str_starts_with($pageWholesale['hero_image'], 'http')) ? $pageWholesale['hero_image'] : null,
            'wholesale_benefits' => ! empty($pageWholesale['benefits'])
                ? array_map(function ($item) {
                    $img = $item['image'] ?? null;
                    $isUrl = ! empty($img) && str_starts_with($img, 'http');
                    return [
                        'title' => $item['title'] ?? '',
                        'description' => $item['description'] ?? '',
                        'image_upload' => (! empty($img) && ! $isUrl) ? str_replace('/storage/', '', $img) : null,
                        'image_url' => $isUrl ? $img : null,
                    ];
                }, $pageWholesale['benefits'])
                : array_map(function ($item) {
                    return [
                        'title' => $item['title'] ?? '',
                        'description' => $item['description'] ?? '',
                        'image_upload' => null,
                        'image_url' => null,
                    ];
                }, $defaultWholesaleBenefits),
            'wholesale_whatsapp_number' => $pageWholesale['whatsapp_number'] ?? ($settings['whatsapp'] ?? '6285121930454'),
            'wholesale_form_image' => (! empty($pageWholesale['form_image']) && ! str_starts_with($pageWholesale['form_image'], 'http')) ? str_replace('/storage/', '', $pageWholesale['form_image']) : null,
            'wholesale_form_image_url' => (! empty($pageWholesale['form_image']) && str_starts_with($pageWholesale['form_image'], 'http')) ? $pageWholesale['form_image'] : null,
            'wholesale_form_badge' => $pageWholesale['form_badge'] ?? 'Partner Terpercaya 50+ Kedai Kopi',
            'wholesale_form_title' => $pageWholesale['form_title'] ?? 'Formulir Kemitraan Langsung WhatsApp',
            'wholesale_form_subtitle' => $pageWholesale['form_subtitle'] ?? 'Isi detail singkat usaha Anda untuk langsung berkonsultasi dengan tim kemitraan kami.',
            'wholesale_gallery_title' => $pageWholesale['gallery_title'] ?? 'Dokumentasi Kemitraan & Pasokan Kedai',
            'wholesale_gallery_subtitle' => $pageWholesale['gallery_subtitle'] ?? 'Setup mesin espresso komersial, kalibrasi rasa, dan pasokan rutin biji kopi di berbagai coffee shop mitra kami.',
            'wholesale_grid_desktop' => (string) ($pageWholesale['grid_desktop'] ?? '3'),
            'wholesale_grid_tablet' => (string) ($pageWholesale['grid_tablet'] ?? '2'),
            'wholesale_grid_mobile' => (string) ($pageWholesale['grid_mobile'] ?? '1'),
            'wholesale_image_aspect' => $pageWholesale['image_aspect'] ?? 'aspect-4/3',
            'wholesale_gallery_images' => ! empty($pageWholesale['gallery_images'])
                ? array_map(function ($item) {
                    $img = $item['image'] ?? '';
                    $isUrl = str_starts_with($img, 'http');
                    return [
                        'image_upload' => ! $isUrl ? str_replace('/storage/', '', $img) : null,
                        'image_url' => $isUrl ? $img : null,
                        'caption' => $item['caption'] ?? '',
                    ];
                }, $pageWholesale['gallery_images'])
                : array_map(function ($item) {
                    $img = $item['image'] ?? '';
                    $isUrl = str_starts_with($img, 'http');
                    return [
                        'image_upload' => ! $isUrl ? str_replace('/storage/', '', $img) : null,
                        'image_url' => $isUrl ? $img : null,
                        'caption' => $item['caption'] ?? '',
                    ];
                }, $defaultWholesaleGallery),

            // --- 3. Kunjungi Roastery (Visit) ---
            'visit_hero_badge' => $pageVisit['hero_badge'] ?? 'Roastery & Showroom Malang',
            'visit_hero_title' => $pageVisit['hero_title'] ?? 'Alat Kopi Malang',
            'visit_hero_description' => $pageVisit['hero_description'] ?? 'Cicipi beans fresh roast langsung di slow bar kami, coba mesin espresso komersial, dan konsultasikan kebutuhan seduh Anda bersama roaster dan barista kami.',

            'visit_welcome_title' => $pageVisit['welcome_title'] ?? 'Selamat Datang di Malang',
            'visit_address' => $pageVisit['address'] ?? ($settings['address'] ?? 'Jl. Terusan Kawi No. 12, Klojen, Kota Malang, Jawa Timur 65116 (Gedung Alat Kopi Malang)'),
            'visit_hours' => $pageVisit['hours'] ?? ($settings['hours'] ?? 'Buka Setiap Hari: 09.00–23.00 WIB (Layanan Seduh di Tempat & Pembelian Beans)'),
            'visit_phone' => $pageVisit['phone'] ?? ($settings['phone'] ?? '+62 851-2193-0454'),
            'visit_maps_url' => $pageVisit['maps_url'] ?? ($settings['maps_url'] ?? 'https://maps.app.goo.gl/PMuxaEtsbEvC4APy7'),
            'visit_facilities' => ! empty($pageVisit['facilities']) ? $pageVisit['facilities'] : $defaultVisitFacilities,
            'visit_main_image' => (! empty($pageVisit['main_image']) && ! str_starts_with($pageVisit['main_image'], 'http')) ? str_replace('/storage/', '', $pageVisit['main_image']) : null,
            'visit_main_image_url' => (! empty($pageVisit['main_image']) && str_starts_with($pageVisit['main_image'], 'http')) ? $pageVisit['main_image'] : null,
            'visit_gallery_title' => $pageVisit['gallery_title'] ?? 'Galeri Suasana Roastery & Showroom',
            'visit_gallery_subtitle' => $pageVisit['gallery_subtitle'] ?? 'Dokumentasi ruang seduh, mesin espresso komersial, dan kehangatan slow bar kami di Malang.',
            'visit_grid_desktop' => (string) ($pageVisit['grid_desktop'] ?? '3'),
            'visit_grid_tablet' => (string) ($pageVisit['grid_tablet'] ?? '2'),
            'visit_grid_mobile' => (string) ($pageVisit['grid_mobile'] ?? '1'),
            'visit_image_aspect' => $pageVisit['image_aspect'] ?? 'aspect-4/3',
            'visit_gallery_images' => ! empty($pageVisit['gallery_images'])
                ? array_map(function ($item) {
                    $img = $item['image'] ?? null;
                    $isHttp = ! empty($img) && str_starts_with($img, 'http');

                    return [
                        'image_upload' => (! empty($img) && ! $isHttp) ? str_replace('/storage/', '', $img) : null,
                        'image_url' => $isHttp ? $img : null,
                        'caption' => $item['caption'] ?? '',
                    ];
                }, $pageVisit['gallery_images'])
                : array_map(function ($item) {
                    return [
                        'image_upload' => null,
                        'image_url' => $item['image'],
                        'caption' => $item['caption'] ?? '',
                    ];
                }, $defaultVisitGallery),

            // --- 4. Jasa Roasting Kopi ---
            'roasting_hero_badge' => $pageRoasting['hero_badge'] ?? 'Layanan Roasting Kopi Profesional',
            'roasting_hero_title' => $pageRoasting['hero_title'] ?? 'Jasa Roasting Biji Kopi Presisi & Profil Kustom',
            'roasting_hero_description' => $pageRoasting['hero_description'] ?? 'Percayakan biji kopi mentah (green bean) pilihan Anda kepada roaster berpengalaman kami. Didukung mesin roasting modern bersistem airflow digital, pemantauan kurva artisan, dan quality control sensorik cupping.',
            'roasting_hero_image' => (! empty($pageRoasting['hero_image']) && ! str_starts_with($pageRoasting['hero_image'], 'http')) ? str_replace('/storage/', '', $pageRoasting['hero_image']) : null,
            'roasting_hero_image_url' => (! empty($pageRoasting['hero_image']) && str_starts_with($pageRoasting['hero_image'], 'http')) ? $pageRoasting['hero_image'] : null,
            'roasting_packages' => ! empty($pageRoasting['packages'])
                ? array_map(function ($pkg) {
                    $features = $pkg['features'] ?? '';
                    if (is_array($features)) {
                        $features = implode("\n", $features);
                    }
                    return [
                        'name' => $pkg['name'] ?? '',
                        'capacity' => $pkg['capacity'] ?? '',
                        'price' => $pkg['price'] ?? '',
                        'badge' => $pkg['badge'] ?? '',
                        'is_popular' => (bool) ($pkg['is_popular'] ?? false),
                        'description' => $pkg['description'] ?? '',
                        'features' => $features,
                    ];
                }, $pageRoasting['packages'])
                : $defaultRoastingPackages,
            'roasting_gallery_title' => $pageRoasting['gallery_title'] ?? 'Galeri Fasilitas & Proses Sangrai',
            'roasting_gallery_subtitle' => $pageRoasting['gallery_subtitle'] ?? 'Dokumentasi studio sangrai, mesin roasting, dan quality control cupping di Alat Kopi Malang.',
            'roasting_grid_desktop' => (string) ($pageRoasting['grid_desktop'] ?? '3'),
            'roasting_grid_tablet' => (string) ($pageRoasting['grid_tablet'] ?? '2'),
            'roasting_grid_mobile' => (string) ($pageRoasting['grid_mobile'] ?? '1'),
            'roasting_image_aspect' => $pageRoasting['image_aspect'] ?? 'aspect-4/3',
            'roasting_gallery_images' => ! empty($pageRoasting['gallery_images'])
                ? array_map(function ($item) {
                    $img = $item['image'] ?? null;
                    $isHttp = ! empty($img) && str_starts_with($img, 'http');

                    return [
                        'image_upload' => (! empty($img) && ! $isHttp) ? str_replace('/storage/', '', $img) : null,
                        'image_url' => $isHttp ? $img : null,
                        'caption' => $item['caption'] ?? '',
                    ];
                }, $pageRoasting['gallery_images'])
                : array_map(function ($item) {
                    return [
                        'image_upload' => null,
                        'image_url' => $item['image'],
                        'caption' => $item['caption'] ?? '',
                    ];
                }, $defaultRoastingGallery),
            'roasting_whatsapp_number' => $pageRoasting['whatsapp_number'] ?? ($settings['whatsapp'] ?? '6285121930454'),
            'roasting_form_title' => $pageRoasting['form_title'] ?? 'Formulir Konsultasi Jasa Roasting',
            'roasting_form_subtitle' => $pageRoasting['form_subtitle'] ?? 'Isi detail biji kopi dan kebutuhan sangrai Anda untuk langsung terhubung dengan head roaster kami.',

            // --- 5. Training Barista ---
            'barista_hero_badge' => $pageBarista['hero_badge'] ?? 'Kelas Barista Profesional & Sertifikasi',
            'barista_hero_title' => $pageBarista['hero_title'] ?? 'Training Barista Bersertifikat & Edukasi Seduh Spesialis',
            'barista_hero_description' => $pageBarista['hero_description'] ?? 'Tingkatkan keahlian seduh kopi Anda dari dasar hingga siap kerja atau buka kedai. Dibimbing langsung oleh trainer dan roaster berpengalaman dengan mesin komersial standar industri di Alat Kopi Malang.',
            'barista_hero_image' => (! empty($pageBarista['hero_image']) && ! str_starts_with($pageBarista['hero_image'], 'http')) ? str_replace('/storage/', '', $pageBarista['hero_image']) : null,
            'barista_hero_image_url' => (! empty($pageBarista['hero_image']) && str_starts_with($pageBarista['hero_image'], 'http')) ? $pageBarista['hero_image'] : null,
            'barista_packages' => ! empty($pageBarista['packages'])
                ? array_map(function ($pkg) {
                    $features = $pkg['features'] ?? '';
                    if (is_array($features)) {
                        $features = implode("\n", $features);
                    }
                    return [
                        'name' => $pkg['name'] ?? '',
                        'duration' => $pkg['duration'] ?? '',
                        'price' => $pkg['price'] ?? '',
                        'badge' => $pkg['badge'] ?? '',
                        'is_popular' => (bool) ($pkg['is_popular'] ?? false),
                        'description' => $pkg['description'] ?? '',
                        'features' => $features,
                    ];
                }, $pageBarista['packages'])
                : $defaultBaristaPackages,
            'barista_gallery_title' => $pageBarista['gallery_title'] ?? 'Dokumentasi & Suasana Kelas Barista',
            'barista_gallery_subtitle' => $pageBarista['gallery_subtitle'] ?? 'Momen praktik peserta mengasah teknik espresso, latte art, dan manual brew di Alat Kopi Malang.',
            'barista_grid_desktop' => (string) ($pageBarista['grid_desktop'] ?? '3'),
            'barista_grid_tablet' => (string) ($pageBarista['grid_tablet'] ?? '2'),
            'barista_grid_mobile' => (string) ($pageBarista['grid_mobile'] ?? '1'),
            'barista_image_aspect' => $pageBarista['image_aspect'] ?? 'aspect-4/3',
            'barista_gallery_images' => ! empty($pageBarista['gallery_images'])
                ? array_map(function ($item) {
                    $img = $item['image'] ?? null;
                    $isHttp = ! empty($img) && str_starts_with($img, 'http');

                    return [
                        'image_upload' => (! empty($img) && ! $isHttp) ? str_replace('/storage/', '', $img) : null,
                        'image_url' => $isHttp ? $img : null,
                        'caption' => $item['caption'] ?? '',
                    ];
                }, $pageBarista['gallery_images'])
                : array_map(function ($item) {
                    return [
                        'image_upload' => null,
                        'image_url' => $item['image'],
                        'caption' => $item['caption'] ?? '',
                    ];
                }, $defaultBaristaGallery),
            'barista_whatsapp_number' => $pageBarista['whatsapp_number'] ?? ($settings['whatsapp'] ?? '6285121930454'),
            'barista_form_title' => $pageBarista['form_title'] ?? 'Formulir Pendaftaran & Konsultasi Kelas Barista',
            'barista_form_subtitle' => $pageBarista['form_subtitle'] ?? 'Daftarkan diri Anda atau konsultasikan jadwal kelas privat langsung dengan tim trainer kami via WhatsApp.',

            // --- 6. Acara & Workshop (/acara) ---
            'events_hero_badge' => $pageEvents['hero_badge'] ?? 'Komunitas & Edukasi',
            'events_hero_title' => $pageEvents['hero_title'] ?? 'Workshop & Sesi Cupping Terbuka',
            'events_hero_description' => $pageEvents['hero_description'] ?? 'Bergabung bersama komunitas pecinta kopi di Malang dalam sesi cupping kalibrasi rasa, kelas manual brew, dan bincang santai bersama roaster Alat Kopi Malang.',
            'events_hero_image' => (! empty($pageEvents['hero_image']) && ! str_starts_with($pageEvents['hero_image'], 'http')) ? str_replace('/storage/', '', $pageEvents['hero_image']) : null,
            'events_hero_image_url' => (! empty($pageEvents['hero_image']) && str_starts_with($pageEvents['hero_image'], 'http')) ? $pageEvents['hero_image'] : null,
            'events_upcoming_title' => $pageEvents['upcoming_title'] ?? 'Acara Mendatang',
            'events_empty_message' => $pageEvents['empty_message'] ?? 'Belum ada jadwal acara baru saat ini. Ikuti Instagram kami di @alatkopimalang untuk kabar workshop terdekat!',
            'events_show_past' => (bool) ($pageEvents['show_past'] ?? true),
            'events_past_title' => $pageEvents['past_title'] ?? 'Arsip & Riwayat Acara Sebelumnya',
            'events_whatsapp_number' => $pageEvents['whatsapp_number'] ?? ($settings['whatsapp'] ?? '6285121930454'),
            'events_cta_button_text' => $pageEvents['cta_button_text'] ?? 'Daftar via WhatsApp',
            'events_cta_note' => $pageEvents['cta_note'] ?? 'Slot terbatas • Konfirmasi instan',
            'events_gallery_title' => $pageEvents['gallery_title'] ?? 'Dokumentasi Acara & Workshop Alat Kopi Malang',
            'events_gallery_subtitle' => $pageEvents['gallery_subtitle'] ?? 'Momen kebersamaan komunitas, sesi sensory cupping, dan workshop seduh di Malang.',
            'events_grid_desktop' => (string) ($pageEvents['grid_desktop'] ?? '3'),
            'events_grid_tablet' => (string) ($pageEvents['grid_tablet'] ?? '2'),
            'events_grid_mobile' => (string) ($pageEvents['grid_mobile'] ?? '1'),
            'events_image_aspect' => $pageEvents['image_aspect'] ?? 'aspect-4/3',
            'events_gallery_images' => ! empty($pageEvents['gallery_images'])
                ? array_map(function ($item) {
                    $img = $item['image'] ?? null;
                    $isHttp = ! empty($img) && str_starts_with($img, 'http');

                    return [
                        'image_upload' => (! empty($img) && ! $isHttp) ? str_replace('/storage/', '', $img) : null,
                        'image_url' => $isHttp ? $img : null,
                        'caption' => $item['caption'] ?? '',
                    ];
                }, $pageEvents['gallery_images'])
                : array_map(function ($item) {
                    return [
                        'image_upload' => null,
                        'image_url' => $item['image'],
                        'caption' => $item['caption'] ?? '',
                    ];
                }, $defaultEventsGallery),

            // --- 7. Blog & Artikel ---
            'blog_hero_badge' => $pageBlog['hero_badge'] ?? 'Jejak Rasa Journal',
            'blog_hero_title' => $pageBlog['hero_title'] ?? 'Catatan Roaster & Cerita Dari Lereng Kawi',
            'blog_hero_description' => $pageBlog['hero_description'] ?? 'Kumpulan artikel edukasi proses pascapanen, teknik seduh, profil terroir, dan kabar terbaru dari roastery kami.',
            'blog_posts_per_page' => $pageBlog['posts_per_page'] ?? 9,
            'blog_grid_columns' => (string) ($pageBlog['grid_columns'] ?? '3'),
            'blog_image_aspect' => $pageBlog['image_aspect'] ?? 'aspect-16/10',
            'blog_hero_icon' => $pageBlog['hero_icon'] ?? 'newspaper',
            'blog_hero_bg_image' => $pageBlog['hero_bg_image'] ?? null,
            'blog_show_icons' => $pageBlog['show_icons'] ?? true,
            'blog_show_read_time' => $pageBlog['show_read_time'] ?? true,
            'blog_show_date' => $pageBlog['show_date'] ?? true,
            'blog_show_author' => $pageBlog['show_author'] ?? true,
            'blog_cta_text' => $pageBlog['cta_text'] ?? 'Baca Artikel',
            'blog_flipbook_enabled' => (bool) ($pageBlog['flipbook_enabled'] ?? false),
            'blog_flipbook_title' => $pageBlog['flipbook_title'] ?? 'Lembar Visual & Catatan Roastery',
            'blog_flipbook_subtitle' => $pageBlog['flipbook_subtitle'] ?? 'Klik halaman kanan atau kiri untuk membalik lembar foto 3D',
            'blog_flipbook_theme' => $pageBlog['flipbook_theme'] ?? 'midnight',
            'blog_flipbook_autoplay' => (bool) ($pageBlog['flipbook_autoplay'] ?? false),
            'blog_flipbook_pages' => ! empty($pageBlog['flipbook_pages']) && is_array($pageBlog['flipbook_pages'])
                ? array_map(function ($item) {
                    $img = $item['image'] ?? null;
                    $isHttp = ! empty($img) && str_starts_with($img, 'http');

                    return [
                        'page_number' => $item['page_number'] ?? '',
                        'title' => $item['title'] ?? '',
                        'text_style' => $item['text_style'] ?? 'auto',
                        'image' => (! empty($img) && ! $isHttp) ? str_replace('/storage/', '', $img) : null,
                        'image_url' => $item['image_url'] ?? ($isHttp ? $img : null),
                        'caption' => $item['caption'] ?? '',
                    ];
                }, $pageBlog['flipbook_pages'])
                : [
                    [
                        'page_number' => '01',
                        'title' => 'The Minimalist Void',
                        'text_style' => 'quote_italic',
                        'image' => null,
                        'image_url' => 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=80',
                        'caption' => '"Kesederhanaan bukanlah ketiadaan isi, melainkan kehadiran makna yang paling murni."',
                    ],
                    [
                        'page_number' => '02',
                        'title' => 'Glass Monoliths',
                        'text_style' => 'regular',
                        'image' => null,
                        'image_url' => 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1000&q=80',
                        'caption' => 'Refleksi presisi sangrai dan dedikasi petani menembus cakrawala cita rasa kopi Nusantara.',
                    ],
                ],

            // --- 8. Booking Tempat (/booking-tempat) ---
            'booking_hero_badge' => $pageBooking['hero_badge'] ?? 'Reservasi & Sewa Tempat di Alat Kopi Malang',
            'booking_hero_title' => $pageBooking['hero_title'] ?? 'Booking Tempat Nyaman untuk Acara & Komunitas di Alat Kopi Malang',
            'booking_hero_description' => $pageBooking['hero_description'] ?? 'Ruang berkumpul yang hangat, estetis, dan santai untuk workshop, meeting kerja, gathering komunitas, maupun acara spesial Anda di Malang. Cukup dengan minimum spent ngopi & menu lezat di Alat Kopi Malang.',
            'booking_hero_image' => (! empty($pageBooking['hero_image']) && ! str_starts_with($pageBooking['hero_image'], 'http')) ? str_replace('/storage/', '', $pageBooking['hero_image']) : null,
            'booking_hero_image_url' => (! empty($pageBooking['hero_image']) && str_starts_with($pageBooking['hero_image'], 'http')) ? $pageBooking['hero_image'] : ($pageBooking['hero_image_url'] ?? ''),
            'booking_benefits' => ! empty($pageBooking['benefits'])
                ? array_map(function ($item) {
                    return [
                        'title' => $item['title'] ?? '',
                        'badge' => $item['badge'] ?? '',
                        'description' => $item['description'] ?? '',
                        'is_highlight' => (bool) ($item['is_highlight'] ?? false),
                    ];
                }, $pageBooking['benefits'])
                : [
                    [
                        'title' => 'Muat Hingga Lebih dari 50 Orang',
                        'badge' => 'Kapasitas Luas',
                        'description' => 'Kapasitas luas dan leluasa menampung lebih dari 50 orang dengan pilihan tata letak kursi yang fleksibel (theater, kelas, diskusi melingkar, atau santai).',
                        'is_highlight' => false,
                    ],
                    [
                        'title' => 'Free Proyektor',
                        'badge' => 'Fasilitas Gratis',
                        'description' => 'Fasilitas proyektor jernih dan layar screen siap pakai untuk presentasi kerja, materi workshop, tayangan video, maupun nobar tanpa biaya sewa tambahan.',
                        'is_highlight' => false,
                    ],
                    [
                        'title' => 'Free Sound System',
                        'badge' => 'Fasilitas Gratis',
                        'description' => 'Sound system audio jernih dilengkapi microphone wireless gratis dan koneksi bluetooth untuk mendukung kelancaran pemandu acara maupun musik pengiring.',
                        'is_highlight' => false,
                    ],
                    [
                        'title' => 'Cukup dengan Minimum Spent Ngopi di Alat Kopi Malang',
                        'badge' => 'Tanpa Biaya Sewa Ruang',
                        'description' => 'Bebas biaya sewa gedung atau room charge terpisah! Cukup penuhi minimum spent pesanan kopi artisan, minuman segar, dan aneka menu makanan lezat Alat Kopi Malang.',
                        'is_highlight' => true,
                    ],
                ],
            'booking_facilities' => ! empty($pageBooking['facilities'])
                ? array_map(function ($item, $idx) {
                    $defaultIcons = ['zap', 'wifi', 'plug', 'building-2'];

                    return [
                        'icon' => $item['icon'] ?? ($defaultIcons[$idx] ?? 'zap'),
                        'title' => $item['title'] ?? '',
                        'description' => $item['description'] ?? '',
                    ];
                }, $pageBooking['facilities'], array_keys($pageBooking['facilities']))
                : [
                    ['icon' => 'zap', 'title' => 'Ruangan Ber-AC & Sejuk', 'description' => 'Ruangan sejuk dan nyaman untuk memastikan seluruh tamu betah selama acara.'],
                    ['icon' => 'wifi', 'title' => 'Koneksi Wi-Fi Cepat', 'description' => 'Internet stabil untuk presentasi daring, meeting Zoom, hingga live streaming.'],
                    ['icon' => 'plug', 'title' => 'Banyak Colokan Listrik', 'description' => 'Stopkontak melimpah di setiap area tempat duduk untuk laptop dan gawai.'],
                    ['icon' => 'building-2', 'title' => 'Parkir Luas & Aman', 'description' => 'Akses mudah di Ruko Tlogomas Square dengan fasilitas parkir mobil dan motor yang aman.'],
                ],
            'booking_gallery_title' => $pageBooking['gallery_title'] ?? 'Dokumentasi Suasana Ruangan & Acara',
            'booking_gallery_subtitle' => $pageBooking['gallery_subtitle'] ?? 'Momen kehangatan workshop, meeting, dan gathering komunitas di Alat Kopi Malang.',
            'booking_grid_desktop' => (string) ($pageBooking['grid_desktop'] ?? '3'),
            'booking_grid_tablet' => (string) ($pageBooking['grid_tablet'] ?? '2'),
            'booking_grid_mobile' => (string) ($pageBooking['grid_mobile'] ?? '1'),
            'booking_image_aspect' => $pageBooking['image_aspect'] ?? 'aspect-4/3',
            'booking_gallery_images' => ! empty($pageBooking['gallery_images'])
                ? array_map(function ($item) {
                    $img = $item['image'] ?? null;
                    $isHttp = ! empty($img) && str_starts_with($img, 'http');

                    return [
                        'image_upload' => (! empty($img) && ! $isHttp) ? str_replace('/storage/', '', $img) : null,
                        'image_url' => $isHttp ? $img : null,
                        'caption' => $item['caption'] ?? '',
                    ];
                }, $pageBooking['gallery_images'])
                : [
                    [
                        'image_upload' => null,
                        'image_url' => 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
                        'caption' => 'Suasana Ruangan Luas & Meja Diskusi Komunitas',
                    ],
                    [
                        'image_upload' => null,
                        'image_url' => 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
                        'caption' => 'Presentasi & Workshop dengan Proyektor Layar Lebar',
                    ],
                    [
                        'image_upload' => null,
                        'image_url' => 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&q=80',
                        'caption' => 'Sound System & Mic Wireless Jernih untuk Gathering',
                    ],
                    [
                        'image_upload' => null,
                        'image_url' => 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
                        'caption' => 'Kopi Artisan & Fresh Brew Disajikan Langsung dari Slow Bar',
                    ],
                    [
                        'image_upload' => null,
                        'image_url' => 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
                        'caption' => 'Kenyamanan Berkumpul dengan Ruangan Ber-AC & Stopkontak Melimpah',
                    ],
                    [
                        'image_upload' => null,
                        'image_url' => 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=800&q=80',
                        'caption' => 'Kapasitas Nyaman untuk Lebih dari 50 Tamu Undangan',
                    ],
                ],
            'booking_whatsapp_number' => $pageBooking['whatsapp_number'] ?? ($settings['whatsapp'] ?? '6285121930454'),
            'booking_form_title' => $pageBooking['form_title'] ?? 'Konsultasi Jadwal & Reservasi Tempat',
            'booking_form_subtitle' => $pageBooking['form_subtitle'] ?? 'Isi detail rencana acara Anda di bawah ini untuk langsung terhubung ke WhatsApp reservasi Alat Kopi Malang.',
            'booking_minimum_spent_info' => $pageBooking['minimum_spent_info'] ?? 'Cukup dengan minimum order menu Alat Kopi Malang (makanan & minuman). Bebas biaya sewa ruang (Rp 0 venue fee).',
            'booking_event_types' => ! empty($pageBooking['event_types'])
                ? array_map(function ($item) {
                    return [
                        'name' => is_array($item) ? ($item['name'] ?? '') : $item,
                    ];
                }, $pageBooking['event_types'])
                : [
                    ['name' => 'Workshop & Kelas Pelatihan'],
                    ['name' => 'Meeting Kerja & Seminar Kantor'],
                    ['name' => 'Gathering Komunitas & Reuni'],
                    ['name' => 'Ulang Tahun & Acara Keluarga'],
                    ['name' => 'Bedah Buku, Talkshow, & Mini Showcase'],
                    ['name' => 'Nonton Bareng & Diskusi Kreatif'],
                    ['name' => 'Acara Lainnya'],
                ],
            'booking_address' => $pageBooking['address'] ?? ($settings['address'] ?? 'Ruko Tlogomas Square Kav. 34, Jl. Raya Tlogomas, Lowokwaru, Kota Malang, Jawa Timur 65144'),
            'booking_hours' => $pageBooking['hours'] ?? ($settings['hours'] ?? 'Setiap Hari: 09.00 – 23.00 WIB'),
            'booking_maps_url' => $pageBooking['maps_url'] ?? ($settings['maps_url'] ?? 'https://maps.app.goo.gl/PMuxaEtsbEvC4APy7'),

            // --- 9. Coffee Catering (/coffee-catering) ---
            'catering_hero_badge' => $pageCatering['hero_badge'] ?? 'Live Espresso Bar & Coffee Catering',
            'catering_hero_title' => $pageCatering['hero_title'] ?? 'Alat Kopi Malang Coffee Catering untuk Segala Momen Spesial Anda',
            'catering_hero_description' => $pageCatering['hero_description'] ?? 'Hadirkan pengalaman specialty coffee bar autentik langsung di lokasi acara Anda di Malang & sekitarnya. Cocok untuk Wedding, Acara Kantor, Acara Seminar, maupun Acara Keluarga dengan minimum order 200 cup dan racikan barista profesional Alat Kopi Malang.',
            'catering_hero_image' => (! empty($pageCatering['hero_image']) && ! str_starts_with($pageCatering['hero_image'], 'http')) ? str_replace('/storage/', '', $pageCatering['hero_image']) : null,
            'catering_hero_image_url' => (! empty($pageCatering['hero_image']) && str_starts_with($pageCatering['hero_image'], 'http')) ? $pageCatering['hero_image'] : ($pageCatering['hero_image_url'] ?? ''),
            'catering_minimum_order_cups' => $pageCatering['minimum_order_cups'] ?? '200',
            'catering_benefits' => ! empty($pageCatering['benefits'])
                ? array_map(function ($item) {
                    return [
                        'title' => $item['title'] ?? '',
                        'badge' => $item['badge'] ?? '',
                        'description' => $item['description'] ?? '',
                        'is_highlight' => (bool) ($item['is_highlight'] ?? false),
                    ];
                }, $pageCatering['benefits'])
                : [
                    [
                        'title' => 'Minimum Order 200 Cup',
                        'badge' => 'Kapasitas Fleksibel',
                        'description' => 'Mulai dari 200 cup fresh coffee, sangat ideal untuk intimate party keluarga, acara kantor, hingga resepsi pernikahan akbar.',
                        'is_highlight' => false,
                    ],
                    [
                        'title' => 'Pelayanan Langsung di Tempat Acara',
                        'badge' => 'Live Espresso Bar',
                        'description' => 'Tim barista profesional Alat Kopi Malang hadir langsung di lokasi acara dengan setup mobile coffee bar lengkap, menyajikan kopi segar di hadapan tamu.',
                        'is_highlight' => false,
                    ],
                    [
                        'title' => 'Peralatan Espresso Komersial',
                        'badge' => 'Peralatan Lengkap',
                        'description' => 'Mesin espresso standar specialty coffee, grinder presisi, cooling ice station, dan booth bar estetis yang siap mempercantik dekorasi acara Anda.',
                        'is_highlight' => false,
                    ],
                    [
                        'title' => 'Biji Kopi Fresh Roast Khas Alat Kopi Malang',
                        'badge' => 'Specialty Grade 1',
                        'description' => 'Pilihan espresso blend dan single origin artisan khas Alat Kopi Malang. Cita rasa kaya, manis seimbang, dan ramah di lambung para tamu undangan.',
                        'is_highlight' => true,
                    ],
                ],
            'catering_occasions' => ! empty($pageCatering['occasions'])
                ? array_map(function ($item) {
                    return [
                        'name' => $item['name'] ?? '',
                    ];
                }, $pageCatering['occasions'])
                : [
                    [
                        'name' => 'Wedding & Resepsi Pernikahan',
                    ],
                    [
                        'name' => 'Acara Kantor & Corporate Gathering',
                    ],
                    [
                        'name' => 'Acara Seminar & Konferensi',
                    ],
                    [
                        'name' => 'Acara Keluarga & Private Party',
                    ],
                ],
            'catering_gallery_title' => $pageCatering['gallery_title'] ?? 'Dokumentasi Live Coffee Bar & Catering Acara',
            'catering_gallery_subtitle' => $pageCatering['gallery_subtitle'] ?? 'Momen kebahagiaan para tamu menikmati racikan segar Alat Kopi Malang di berbagai pesta pernikahan, kantor, dan seminar.',
            'catering_grid_desktop' => (string) ($pageCatering['grid_desktop'] ?? '3'),
            'catering_grid_tablet' => (string) ($pageCatering['grid_tablet'] ?? '2'),
            'catering_grid_mobile' => (string) ($pageCatering['grid_mobile'] ?? '1'),
            'catering_image_aspect' => $pageCatering['image_aspect'] ?? 'aspect-4/3',
            'catering_gallery_images' => ! empty($pageCatering['gallery_images'])
                ? array_map(function ($item) {
                    $img = $item['image'] ?? null;
                    $isHttp = ! empty($img) && str_starts_with($img, 'http');

                    return [
                        'image_upload' => (! empty($img) && ! $isHttp) ? str_replace('/storage/', '', $img) : null,
                        'image_url' => $isHttp ? $img : null,
                        'caption' => $item['caption'] ?? '',
                    ];
                }, $pageCatering['gallery_images'])
                : [
                    [
                        'image_upload' => null,
                        'image_url' => 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=80',
                        'caption' => 'Live Espresso Bar & Barista Standby di Lokasi Pernikahan',
                    ],
                    [
                        'image_upload' => null,
                        'image_url' => 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
                        'caption' => 'Coffee Break Cepat & Tertib untuk Seminar Ratusan Peserta',
                    ],
                    [
                        'image_upload' => null,
                        'image_url' => 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=800&q=80',
                        'caption' => 'Booth Estetis Menghangatkan Suasana Corporate Gathering Kantor',
                    ],
                    [
                        'image_upload' => null,
                        'image_url' => 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
                        'caption' => 'Fresh Pour Over & Manual Brew Disajikan Langsung untuk Pecinta Kopi',
                    ],
                    [
                        'image_upload' => null,
                        'image_url' => 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&q=80',
                        'caption' => 'Pilihan Es Kopi Susu Gula Aren & Minuman Non-Coffee Favorit Keluarga',
                    ],
                    [
                        'image_upload' => null,
                        'image_url' => 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
                        'caption' => 'Peralatan Higienis, Rapi, dan Menunjang Estetika Dekorasi Acara',
                    ],
                ],
            'catering_whatsapp_number' => $pageCatering['whatsapp_number'] ?? ($settings['whatsapp'] ?? '6285121930454'),
            'catering_form_title' => $pageCatering['form_title'] ?? 'Konsultasi Jadwal & Pemesanan Coffee Catering',
            'catering_form_subtitle' => $pageCatering['form_subtitle'] ?? 'Isi formulir singkat di bawah ini untuk mendapatkan penawaran harga & paket coffee catering Alat Kopi Malang via WhatsApp.',
            'catering_terms_note' => $pageCatering['terms_note'] ?? '*Minimum pemesanan 200 cup. Pemesanan disarankan minimal H-7 acara untuk persiapan jadwal tim barista dan ketersediaan mesin.',
        ]);
    }

    public function defaultForm(Schema $schema): Schema
    {
        return $schema->statePath('data');
    }

    public function content(Schema $schema): Schema
    {
        return $schema
            ->components([
                Form::make([EmbeddedSchema::make('form')])
                    ->id('form')
                    ->livewireSubmitHandler('save')
                    ->footer([
                        Actions::make($this->getFormActions())
                            ->key('form-actions'),
                    ]),
            ]);
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Tabs::make('Pengaturan Konten Halaman')
                    ->tabs([
                        // TAB 1: Tentang Kami
                        Tab::make('Halaman Tentang Kami (/tentang)')
                            ->icon(Heroicon::InformationCircle)
                            ->schema([
                                Section::make('Banner Atas (Hero Section)')
                                    ->description('Judul, slogan pembuka, dan deskripsi singkat pada halaman Tentang Alat Kopi Malang.')
                                    ->schema([
                                        Grid::make(2)->schema([
                                            TextInput::make('about_hero_badge')
                                                ->label('Label Tag / Eyebrow')
                                                ->placeholder('Contoh: Didirikan di Malang sejak 2017')
                                                ->required(),
                                            TextInput::make('about_hero_title')
                                                ->label('Judul Utama Hero')
                                                ->placeholder('Contoh: Dedikasi pada Setiap Cangkir Kopi')
                                                ->required(),
                                        ]),
                                        Textarea::make('about_hero_description')
                                            ->label('Deskripsi Singkat')
                                            ->rows(3)
                                            ->placeholder('Deskripsi ringkas komitmen roastery...')
                                            ->required(),
                                    ]),

                                Section::make('Cerita Filosofi & Foto Roastery')
                                    ->description('Bagian narasi mengapa nama Alat Kopi Malang dipilih dan hubungan dengan petani lokal.')
                                    ->schema([
                                        Grid::make(2)->schema([
                                            TextInput::make('about_story_title')
                                                ->label('Judul Bagian')
                                                ->placeholder('Contoh: Mengapa Nama Kami Alat Kopi Malang')
                                                ->required(),
                                            TextInput::make('about_story_subtitle')
                                                ->label('Subjudul / Kalimat Pendukung')
                                                ->placeholder('Contoh: Menghubungkan jerih payah petani...')
                                                ->required(),
                                        ]),
                                        Textarea::make('about_story_p1')
                                            ->label('Paragraf 1 (Perjalanan Biji Kopi)')
                                            ->rows(3)
                                            ->required(),
                                        Textarea::make('about_story_p2')
                                            ->label('Paragraf 2 (Kemitraan Langsung)')
                                            ->rows(3)
                                            ->required(),
                                        FileUpload::make('about_story_image')
                                            ->label('Foto Roastery / Cerita Kopi')
                                            ->disk('public')
                                            ->directory('pages/about')
                                            ->image()
                                            ->imageEditor()
                                            ->helperText('Upload foto suasana roasting atau kebun kopi (JPG, PNG, WEBP). Jika kosong, akan memakai foto default.'),
                                    ]),

                                Section::make('Video Sinematik / Profil Roastery')
                                    ->description('Upload video profil proses sangrai atau suasana kebun kopi untuk memperkaya halaman Tentang Kami.')
                                    ->schema([
                                        Grid::make(2)->schema([
                                            FileUpload::make('about_video_upload')
                                                ->label('Upload File Video (.mp4 / .webm / .mov)')
                                                ->disk('public')
                                                ->directory('pages/about/videos')
                                                ->acceptedFileTypes(['video/mp4', 'video/webm', 'video/quicktime', 'video/ogg'])
                                                ->maxSize(102400)
                                                ->helperText('Upload file video profil suasana roastery (MP4, WEBM, MOV, maks. 100MB).'),
                                            TextInput::make('about_video_url')
                                                ->label('Atau URL Video Eksternal (CDN / YouTube / Vimeo / MP4)')
                                                ->placeholder('https://www.youtube.com/watch?v=... atau https://domain/video.mp4')
                                                ->helperText('Digunakan bila video dihosting di YouTube, Vimeo, atau CDN eksternal.'),
                                        ]),
                                        Grid::make(2)->schema([
                                            TextInput::make('about_video_title')
                                                ->label('Judul Bagian Video')
                                                ->placeholder('Suasana Studio Roastery & Dedikasi Rasa'),
                                            TextInput::make('about_video_subtitle')
                                                ->label('Subjudul / Deskripsi Pendukung')
                                                ->placeholder('Dokumentasi proses sangrai digital presisi dan jejak terroir lereng Gunung Kawi.'),
                                        ]),
                                        Grid::make(2)->schema([
                                            FileUpload::make('about_video_poster')
                                                ->label('Thumbnail / Poster Video (Opsional)')
                                                ->disk('public')
                                                ->directory('pages/about')
                                                ->image()
                                                ->imageEditor()
                                                ->helperText('Gambar cover sebelum video diputar (JPG, PNG, WEBP).'),
                                            Select::make('about_video_position')
                                                ->label('Posisi Penayangan Video di Halaman')
                                                ->options([
                                                    'section' => 'Banner Video Sinematik Lebar (Di Bawah Cerita Filosofi)',
                                                    'story' => 'Di Samping Teks Cerita (Menggantikan / Melengkapi Foto)',
                                                    'both' => 'Kedua Posisi (Di Samping Cerita & Banner Sinematik)',
                                                ])
                                                ->default('section'),
                                        ]),
                                    ]),

                                Section::make('Tiga Pilar Utama (Nilai Roastery)')
                                    ->description('Tiga kartu prinsip utama yang menjadi pondasi Alat Kopi Malang.')
                                    ->schema([
                                        Grid::make(2)->schema([
                                            TextInput::make('about_values_title')
                                                ->label('Judul Bagian Nilai')
                                                ->default('Tiga Pilar Utama Alat Kopi Malang')
                                                ->required(),
                                            TextInput::make('about_values_subtitle')
                                                ->label('Subjudul Bagian')
                                                ->default('Prinsip nyata yang kami jalankan di setiap batch kopi yang kami sangrai.')
                                                ->required(),
                                        ]),
                                        Repeater::make('about_pillars')
                                            ->label('Daftar Pilar Nilai')
                                            ->itemLabel(fn (array $state): ?string => $state['title'] ?? 'Pilar Nilai')
                                            ->schema([
                                                Grid::make(2)->schema([
                                                    TextInput::make('title')
                                                        ->label('Judul Pilar')
                                                        ->required(),
                                                    Textarea::make('description')
                                                        ->label('Penjelasan Pilar')
                                                        ->rows(2)
                                                        ->required(),
                                                ]),
                                            ])
                                            ->defaultItems(3)
                                            ->collapsible(),
                                    ]),
                            ]),

                        // TAB 2: Kemitraan Kedai (Wholesale)
                        Tab::make('Halaman Wholesale & B2B (/wholesale)')
                            ->icon(Heroicon::BuildingStorefront)
                            ->schema([
                                Section::make('Banner Atas (Hero Wholesale)')
                                    ->description('Teks pembuka penawaran kemitraan pasokan biji kopi grosir dan setup coffee shop.')
                                    ->schema([
                                        Grid::make(2)->schema([
                                            TextInput::make('wholesale_hero_badge')
                                                ->label('Label Tag / Eyebrow')
                                                ->placeholder('Contoh: Kemitraan B2B & Pasokan Kedai')
                                                ->required(),
                                            TextInput::make('wholesale_hero_title')
                                                ->label('Judul Utama Hero')
                                                ->placeholder('Contoh: Pasokan Biji Kopi Grosir & Setup Kedai')
                                                ->required(),
                                        ]),
                                        Textarea::make('wholesale_hero_description')
                                            ->label('Deskripsi Singkat')
                                            ->rows(3)
                                            ->required(),
                                        Grid::make(2)->schema([
                                            FileUpload::make('wholesale_hero_image')
                                                ->label('Unggah Gambar Latar Hero Banner')
                                                ->disk('public')
                                                ->directory('pages/wholesale')
                                                ->image()
                                                ->imageEditor()
                                                ->helperText('Gambar latar belakang bagian atas halaman wholesale (opsional).'),
                                            TextInput::make('wholesale_hero_image_url')
                                                ->label('Atau Gunakan URL Gambar Eksternal')
                                                ->placeholder('https://images.unsplash.com/...'),
                                        ]),
                                    ]),

                                Section::make('Keuntungan Kemitraan B2B')
                                    ->description('Daftar benefit atau keunggulan bermitra pasokan kopi dengan Alat Kopi Malang beserta foto/ikon.')
                                    ->schema([
                                        Repeater::make('wholesale_benefits')
                                            ->label('Kartu Keuntungan Kemitraan')
                                            ->itemLabel(fn (array $state): ?string => $state['title'] ?? 'Keuntungan')
                                            ->schema([
                                                Grid::make(2)->schema([
                                                    TextInput::make('title')
                                                        ->label('Judul Keuntungan')
                                                        ->required(),
                                                    Textarea::make('description')
                                                        ->label('Penjelasan Detail')
                                                        ->rows(2)
                                                        ->required(),
                                                ]),
                                                Grid::make(2)->schema([
                                                    FileUpload::make('image_upload')
                                                        ->label('Unggah Foto / Ikon Kartu (Opsional)')
                                                        ->disk('public')
                                                        ->directory('pages/wholesale/benefits')
                                                        ->image()
                                                        ->helperText('Jika kosong, sistem menampilkan ikon default.'),
                                                    TextInput::make('image_url')
                                                        ->label('Atau Gunakan URL Gambar Eksternal')
                                                        ->placeholder('https://images.unsplash.com/...'),
                                                ]),
                                            ])
                                            ->defaultItems(3)
                                            ->collapsible(),
                                    ]),

                                Section::make('Galeri Dokumentasi Kemitraan & Pasokan Kedai')
                                    ->description('Tampilkan galeri foto suasana roastery, setup mesin komersial, pengemasan pasokan biji kopi 1kg, dan kedai mitra.')
                                    ->schema([
                                        Grid::make(2)->schema([
                                            TextInput::make('wholesale_gallery_title')
                                                ->label('Judul Galeri')
                                                ->placeholder('Contoh: Dokumentasi Kemitraan & Pasokan Kedai')
                                                ->required(),
                                            TextInput::make('wholesale_gallery_subtitle')
                                                ->label('Subtitle Galeri')
                                                ->placeholder('Contoh: Setup mesin espresso komersial, kalibrasi rasa, dan pasokan rutin ke berbagai coffee shop mitra kami.'),
                                        ]),
                                        Grid::make(4)->schema([
                                            Select::make('wholesale_grid_desktop')
                                                ->label('Kolom Desktop')
                                                ->options([
                                                    '2' => '2 Kolom',
                                                    '3' => '3 Kolom',
                                                    '4' => '4 Kolom',
                                                ])
                                                ->default('3')
                                                ->required(),
                                            Select::make('wholesale_grid_tablet')
                                                ->label('Kolom Tablet')
                                                ->options([
                                                    '1' => '1 Kolom',
                                                    '2' => '2 Kolom',
                                                    '3' => '3 Kolom',
                                                ])
                                                ->default('2')
                                                ->required(),
                                            Select::make('wholesale_grid_mobile')
                                                ->label('Kolom Mobile')
                                                ->options([
                                                    '1' => '1 Kolom',
                                                    '2' => '2 Kolom',
                                                ])
                                                ->default('1')
                                                ->required(),
                                            Select::make('wholesale_image_aspect')
                                                ->label('Rasio Gambar')
                                                ->options([
                                                    'aspect-4/3' => '4:3 (Standar Landscape)',
                                                    'aspect-16/9' => '16:9 (Widescreen)',
                                                    'aspect-square' => '1:1 (Persegi)',
                                                    'aspect-auto' => 'Auto (Asli)',
                                                ])
                                                ->default('aspect-4/3')
                                                ->required(),
                                        ]),
                                        Repeater::make('wholesale_gallery_images')
                                            ->label('Daftar Foto Dokumentasi Wholesale')
                                            ->schema([
                                                Grid::make(3)->schema([
                                                    FileUpload::make('image_upload')
                                                        ->label('Unggah Gambar')
                                                        ->disk('public')
                                                        ->directory('pages/wholesale/gallery')
                                                        ->image()
                                                        ->imageEditor(),
                                                    TextInput::make('image_url')
                                                        ->label('Atau URL Gambar')
                                                        ->placeholder('https://images.unsplash.com/...'),
                                                    TextInput::make('caption')
                                                        ->label('Keterangan / Caption Foto')
                                                        ->placeholder('Contoh: Setup mesin Sanremo Cafe Racer di kedai mitra'),
                                                ]),
                                            ])
                                            ->collapsible()
                                            ->defaultItems(3),
                                    ]),

                                Section::make('Foto Visual & Formulir Konsultasi')
                                    ->description('Atur gambar ilustrasi / showcase pendamping formulir konsultasi kemitraan WhatsApp.')
                                    ->schema([
                                        Grid::make(2)->schema([
                                            TextInput::make('wholesale_form_title')
                                                ->label('Judul Formulir')
                                                ->placeholder('Formulir Kemitraan Langsung WhatsApp')
                                                ->required(),
                                            TextInput::make('wholesale_form_badge')
                                                ->label('Label Tag / Badge Visual')
                                                ->placeholder('Partner Terpercaya 50+ Kedai Kopi'),
                                        ]),
                                        Textarea::make('wholesale_form_subtitle')
                                            ->label('Subjudul / Keterangan Formulir')
                                            ->rows(2),
                                        Grid::make(2)->schema([
                                            FileUpload::make('wholesale_form_image')
                                                ->label('Unggah Foto Showcase Samping Formulir')
                                                ->disk('public')
                                                ->directory('pages/wholesale')
                                                ->image()
                                                ->imageEditor()
                                                ->helperText('Foto mesin espresso atau kemasan biji kopi di samping form pendaftaran (opsional).'),
                                            TextInput::make('wholesale_form_image_url')
                                                ->label('Atau Gunakan URL Gambar Eksternal')
                                                ->placeholder('https://images.unsplash.com/...'),
                                        ]),
                                    ]),

                                Section::make('Kontak WhatsApp Kemitraan Wholesale')
                                    ->description('Nomor tujuan WhatsApp untuk konsultasi dan formulir kemitraan kedai.')
                                    ->schema([
                                        TextInput::make('wholesale_whatsapp_number')
                                            ->label('Nomor WhatsApp Konsultasi (Tanpa tanda +)')
                                            ->placeholder('Contoh: 6285121930454')
                                            ->required(),
                                    ]),
                            ]),

                        // TAB 3: Kunjungi Roastery (Visit)
                        Tab::make('Halaman Kunjungi Roastery (/kunjungi)')
                            ->icon(Heroicon::MapPin)
                            ->schema([
                                Section::make('Banner Atas (Hero Kunjungi)')
                                    ->description('Informasi pengantar slow bar dan showroom alat kopi di Malang.')
                                    ->schema([
                                        Grid::make(2)->schema([
                                            TextInput::make('visit_hero_badge')
                                                ->label('Label Tag / Eyebrow')
                                                ->placeholder('Contoh: Roastery & Showroom Malang')
                                                ->required(),
                                            TextInput::make('visit_hero_title')
                                                ->label('Judul Utama Hero')
                                                ->placeholder('Contoh: Alat Kopi Malang')
                                                ->required(),
                                        ]),
                                        Textarea::make('visit_hero_description')
                                            ->label('Deskripsi Singkat')
                                            ->rows(3)
                                            ->required(),
                                    ]),

                                Section::make('Informasi Lokasi & Jam Operasional')
                                    ->description('Alamat fisik, jam buka, kontak WhatsApp, dan tautan rute Google Maps.')
                                    ->schema([
                                        Grid::make(2)->schema([
                                            TextInput::make('visit_welcome_title')
                                                ->label('Judul Sambutan')
                                                ->default('Selamat Datang di Malang')
                                                ->required(),
                                            TextInput::make('visit_phone')
                                                ->label('Kontak WhatsApp')
                                                ->placeholder('+62 851-2193-0454')
                                                ->required(),
                                        ]),
                                        Textarea::make('visit_address')
                                            ->label('Alamat Lengkap')
                                            ->rows(2)
                                            ->required(),
                                        TextInput::make('visit_hours')
                                            ->label('Jam Operasional')
                                            ->placeholder('Buka Setiap Hari: 09.00–23.00 WIB')
                                            ->required(),
                                        TextInput::make('visit_maps_url')
                                            ->label('URL Tautan Google Maps')
                                            ->placeholder('https://maps.app.goo.gl/...')
                                            ->url()
                                            ->required(),
                                    ]),

                                Section::make('Fasilitas & Layanan Slow Bar')
                                    ->description('Daftar pengalaman yang bisa dinikmati pengunjung di lokasi.')
                                    ->schema([
                                        Repeater::make('visit_facilities')
                                            ->label('Daftar Fasilitas / Layanan')
                                            ->itemLabel(fn (array $state): ?string => $state['title'] ?? 'Fasilitas')
                                            ->schema([
                                                Grid::make(2)->schema([
                                                    TextInput::make('title')
                                                        ->label('Nama Fasilitas')
                                                        ->required(),
                                                    Textarea::make('description')
                                                        ->label('Penjelasan')
                                                        ->rows(2)
                                                        ->required(),
                                                ]),
                                            ])
                                            ->defaultItems(3)
                                            ->collapsible(),
                                    ]),

                                Section::make('Foto Utama Slow Bar & Roastery')
                                    ->description('Foto utama di samping informasi kontak dan di atas kartu fasilitas.')
                                    ->schema([
                                        Grid::make(2)->schema([
                                            FileUpload::make('visit_main_image')
                                                ->label('Unggah Foto Utama Roastery')
                                                ->disk('public')
                                                ->directory('pages/visit')
                                                ->image()
                                                ->imageEditor()
                                                ->maxSize(5120)
                                                ->helperText('Upload foto suasana slow bar (JPG, PNG, WEBP, maks. 5MB).'),
                                            TextInput::make('visit_main_image_url')
                                                ->label('Atau URL Foto Eksternal')
                                                ->placeholder('https://images.unsplash.com/...'),
                                        ]),
                                    ]),

                                Section::make('Galeri Foto Suasana Roastery & Pengaturan Grid')
                                    ->description('Kelola daftar foto suasana slow bar dan showroom dengan pengaturan kolom Grid responsif untuk Desktop, Tablet, dan Mobile.')
                                    ->schema([
                                        Grid::make(2)->schema([
                                            TextInput::make('visit_gallery_title')
                                                ->label('Judul Bagian Galeri')
                                                ->placeholder('Contoh: Galeri Suasana Roastery & Showroom')
                                                ->default('Galeri Suasana Roastery & Showroom')
                                                ->required(),
                                            TextInput::make('visit_gallery_subtitle')
                                                ->label('Subjudul Galeri')
                                                ->placeholder('Contoh: Dokumentasi ruang seduh dan showroom kami di Malang.')
                                                ->default('Dokumentasi ruang seduh, mesin espresso komersial, dan kehangatan slow bar kami di Malang.'),
                                        ]),
                                        Grid::make(4)->schema([
                                            Select::make('visit_grid_desktop')
                                                ->label('Grid Desktop (Layar Lebar)')
                                                ->options([
                                                    '1' => '1 Kolom',
                                                    '2' => '2 Kolom',
                                                    '3' => '3 Kolom',
                                                    '4' => '4 Kolom',
                                                    '5' => '5 Kolom',
                                                    '6' => '6 Kolom',
                                                ])
                                                ->default('3')
                                                ->required(),
                                            Select::make('visit_grid_tablet')
                                                ->label('Grid Tablet (Layar Sedang)')
                                                ->options([
                                                    '1' => '1 Kolom',
                                                    '2' => '2 Kolom',
                                                    '3' => '3 Kolom',
                                                    '4' => '4 Kolom',
                                                ])
                                                ->default('2')
                                                ->required(),
                                            Select::make('visit_grid_mobile')
                                                ->label('Grid Mobile (HP)')
                                                ->options([
                                                    '1' => '1 Kolom',
                                                    '2' => '2 Kolom',
                                                ])
                                                ->default('1')
                                                ->required(),
                                            Select::make('visit_image_aspect')
                                                ->label('Rasio Aspek Foto')
                                                ->options([
                                                    'aspect-16/9' => 'Landscape (16:9)',
                                                    'aspect-4/3' => 'Standard (4:3)',
                                                    'aspect-square' => 'Persegi (1:1)',
                                                    'aspect-auto' => 'Asli / Proporsional (Auto)',
                                                ])
                                                ->default('aspect-4/3')
                                                ->required(),
                                        ]),
                                        Repeater::make('visit_gallery_images')
                                            ->label('Daftar Foto Galeri')
                                            ->itemLabel(fn (array $state): ?string => $state['caption'] ?? 'Foto Galeri')
                                            ->schema([
                                                Grid::make(2)->schema([
                                                    FileUpload::make('image_upload')
                                                        ->label('Unggah Foto')
                                                        ->disk('public')
                                                        ->directory('pages/visit/gallery')
                                                        ->image()
                                                        ->imageEditor()
                                                        ->maxSize(10240)
                                                        ->helperText('Format JPG, PNG, WEBP (maks. 10MB)'),
                                                    TextInput::make('image_url')
                                                        ->label('Atau URL Gambar Eksternal')
                                                        ->placeholder('https://images.unsplash.com/...'),
                                                ]),
                                                TextInput::make('caption')
                                                    ->label('Keterangan / Caption Foto (Opsional)')
                                                    ->placeholder('Contoh: Kalibrasi manual brew V60 di slow bar'),
                                            ])
                                            ->addActionLabel('Tambah Foto Baru')
                                            ->reorderableWithButtons()
                                            ->collapsible(),
                                    ]),
                            ]),

                        // TAB 4: Halaman Jasa Roasting Kopi
                        Tab::make('Halaman Jasa Roasting Kopi (/jasa-roasting)')
                            ->icon(Heroicon::Fire)
                            ->schema([
                                Section::make('Banner Atas (Hero Jasa Roasting)')
                                    ->description('Judul, slogan, deskripsi, dan foto utama untuk halaman penawaran jasa roasting kopi.')
                                    ->schema([
                                        Grid::make(2)->schema([
                                            TextInput::make('roasting_hero_badge')
                                                ->label('Label Tag / Eyebrow')
                                                ->placeholder('Contoh: Layanan Roasting Kopi Profesional')
                                                ->required(),
                                            TextInput::make('roasting_hero_title')
                                                ->label('Judul Utama Hero')
                                                ->placeholder('Contoh: Jasa Roasting Biji Kopi Presisi & Profil Kustom')
                                                ->required(),
                                        ]),
                                        Textarea::make('roasting_hero_description')
                                            ->label('Deskripsi Singkat')
                                            ->rows(3)
                                            ->required(),
                                        Grid::make(2)->schema([
                                            FileUpload::make('roasting_hero_image')
                                                ->label('Unggah Foto Utama Roasting Studio')
                                                ->disk('public')
                                                ->directory('pages/roasting')
                                                ->image()
                                                ->imageEditor()
                                                ->maxSize(5120)
                                                ->helperText('Format JPG, PNG, WEBP (maks. 5MB)'),
                                            TextInput::make('roasting_hero_image_url')
                                                ->label('Atau URL Foto Eksternal')
                                                ->placeholder('https://images.unsplash.com/...'),
                                        ]),
                                    ]),

                                Section::make('Pilihan Paket & Biaya Layanan Sangrai')
                                    ->description('Daftar paket roasting per batch atau per kilogram beserta fitur layanannya.')
                                    ->schema([
                                        Repeater::make('roasting_packages')
                                            ->label('Daftar Paket')
                                            ->itemLabel(fn (array $state): ?string => $state['name'] ?? 'Paket')
                                            ->schema([
                                                Grid::make(3)->schema([
                                                    TextInput::make('name')
                                                        ->label('Nama Paket')
                                                        ->required(),
                                                    TextInput::make('capacity')
                                                        ->label('Estimasi Kapasitas / Volume')
                                                        ->placeholder('Contoh: 5 – 30 kg')
                                                        ->required(),
                                                    TextInput::make('price')
                                                        ->label('Biaya / Harga')
                                                        ->placeholder('Contoh: Rp 28.000 / kg')
                                                        ->required(),
                                                ]),
                                                Grid::make(2)->schema([
                                                    TextInput::make('badge')
                                                        ->label('Label Tag / Badge (Opsional)')
                                                        ->placeholder('Contoh: Paling Populer, Riset Resep'),
                                                    Toggle::make('is_popular')
                                                        ->label('Tandai sebagai Paket Paling Direkomendasikan')
                                                        ->default(false),
                                                ]),
                                                Textarea::make('description')
                                                    ->label('Deskripsi Singkat Paket')
                                                    ->rows(2),
                                                Textarea::make('features')
                                                    ->label('Daftar Fitur / Benefit (1 baris per poin)')
                                                    ->rows(4)
                                                    ->helperText('Tulis tiap fitur dalam baris baru. Contoh: Profil tersimpan' . PHP_EOL . 'Pembersihan destoner' . PHP_EOL . 'Kemasan valve'),
                                            ])
                                            ->addActionLabel('Tambah Paket Baru')
                                            ->defaultItems(3)
                                            ->collapsible(),
                                    ]),

                                Section::make('Galeri Foto Roasting & Pengaturan Grid')
                                    ->description('Kelola dokumentasi foto studio dan proses roasting dengan pengaturan kolom Grid responsif untuk Desktop, Tablet, dan Mobile.')
                                    ->schema([
                                        Grid::make(2)->schema([
                                            TextInput::make('roasting_gallery_title')
                                                ->label('Judul Bagian Galeri')
                                                ->default('Galeri Fasilitas & Proses Sangrai')
                                                ->required(),
                                            TextInput::make('roasting_gallery_subtitle')
                                                ->label('Subjudul Galeri')
                                                ->default('Dokumentasi studio sangrai, mesin roasting, dan quality control cupping di Alat Kopi Malang.'),
                                        ]),
                                        Grid::make(4)->schema([
                                            Select::make('roasting_grid_desktop')
                                                ->label('Grid Kolom Desktop')
                                                ->options([
                                                    '1' => '1 Kolom',
                                                    '2' => '2 Kolom',
                                                    '3' => '3 Kolom (Default)',
                                                    '4' => '4 Kolom',
                                                    '5' => '5 Kolom',
                                                    '6' => '6 Kolom',
                                                ])
                                                ->default('3')
                                                ->required(),
                                            Select::make('roasting_grid_tablet')
                                                ->label('Grid Kolom Tablet')
                                                ->options([
                                                    '1' => '1 Kolom',
                                                    '2' => '2 Kolom (Default)',
                                                    '3' => '3 Kolom',
                                                    '4' => '4 Kolom',
                                                ])
                                                ->default('2')
                                                ->required(),
                                            Select::make('roasting_grid_mobile')
                                                ->label('Grid Kolom Mobile')
                                                ->options([
                                                    '1' => '1 Kolom (Default Rapi)',
                                                    '2' => '2 Kolom (Kompak)',
                                                ])
                                                ->default('1')
                                                ->required(),
                                            Select::make('roasting_image_aspect')
                                                ->label('Rasio Gambar')
                                                ->options([
                                                    'aspect-4/3' => '4:3 (Default Standar)',
                                                    'aspect-16/9' => '16:9 (Lanskap Lebar)',
                                                    'aspect-square' => '1:1 (Persegi Sama Sisi)',
                                                    'aspect-auto' => 'Auto (Sesuai Asli)',
                                                ])
                                                ->default('aspect-4/3')
                                                ->required(),
                                        ]),
                                        Repeater::make('roasting_gallery_images')
                                            ->label('Daftar Foto Galeri')
                                            ->itemLabel(fn (array $state): ?string => $state['caption'] ?? 'Foto Roasting')
                                            ->schema([
                                                Grid::make(2)->schema([
                                                    FileUpload::make('image_upload')
                                                        ->label('Unggah Foto')
                                                        ->disk('public')
                                                        ->directory('pages/roasting/gallery')
                                                        ->image()
                                                        ->imageEditor()
                                                        ->maxSize(10240)
                                                        ->helperText('Format JPG, PNG, WEBP (maks. 10MB)'),
                                                    TextInput::make('image_url')
                                                        ->label('Atau URL Gambar Eksternal')
                                                        ->placeholder('https://images.unsplash.com/...'),
                                                ]),
                                                TextInput::make('caption')
                                                    ->label('Keterangan / Caption Foto (Opsional)')
                                                    ->placeholder('Contoh: Kalibrasi kurva suhu drum roasting'),
                                            ])
                                            ->addActionLabel('Tambah Foto Baru')
                                            ->reorderableWithButtons()
                                            ->collapsible(),
                                    ]),

                                Section::make('Kontak & Formulir Konsultasi WhatsApp')
                                    ->description('Atur nomor WhatsApp tujuan dan teks pembuka formulir konsultasi jasa roasting.')
                                    ->schema([
                                        TextInput::make('roasting_whatsapp_number')
                                            ->label('Nomor WhatsApp Roaster (Tanpa tanda +)')
                                            ->placeholder('Contoh: 6285121930454')
                                            ->required(),
                                        Grid::make(2)->schema([
                                            TextInput::make('roasting_form_title')
                                                ->label('Judul Kotak Formulir')
                                                ->default('Formulir Konsultasi Jasa Roasting')
                                                ->required(),
                                            TextInput::make('roasting_form_subtitle')
                                                ->label('Subjudul Kotak Formulir')
                                                ->default('Isi detail biji kopi dan kebutuhan sangrai Anda untuk langsung terhubung dengan head roaster kami.')
                                                ->required(),
                                        ]),
                                    ]),
                            ]),

                        // TAB 5: Halaman Training Barista
                        Tab::make('Halaman Training Barista (/training-barista)')
                            ->icon(Heroicon::AcademicCap)
                            ->schema([
                                Section::make('Banner Atas (Hero Training Barista)')
                                    ->description('Judul, label, deskripsi, dan foto utama untuk halaman penawaran training barista.')
                                    ->schema([
                                        Grid::make(2)->schema([
                                            TextInput::make('barista_hero_badge')
                                                ->label('Label Tag / Eyebrow')
                                                ->placeholder('Contoh: Kelas Barista Profesional & Sertifikasi')
                                                ->required(),
                                            TextInput::make('barista_hero_title')
                                                ->label('Judul Utama Hero')
                                                ->placeholder('Contoh: Training Barista Bersertifikat & Edukasi Seduh Spesialis')
                                                ->required(),
                                        ]),
                                        Textarea::make('barista_hero_description')
                                            ->label('Deskripsi Singkat')
                                            ->rows(3)
                                            ->required(),
                                        Grid::make(2)->schema([
                                            FileUpload::make('barista_hero_image')
                                                ->label('Unggah Foto Utama Training Barista')
                                                ->disk('public')
                                                ->directory('pages/barista')
                                                ->image()
                                                ->imageEditor()
                                                ->maxSize(5120)
                                                ->helperText('Format JPG, PNG, WEBP (maks. 5MB)'),
                                            TextInput::make('barista_hero_image_url')
                                                ->label('Atau URL Foto Eksternal')
                                                ->placeholder('https://images.unsplash.com/...'),
                                        ]),
                                    ]),

                                Section::make('Pilihan Program & Paket Pelatihan Barista')
                                    ->description('Daftar kelas pelatihan barista, durasi, biaya, dan materi yang diajarkan.')
                                    ->schema([
                                        Repeater::make('barista_packages')
                                            ->label('Daftar Paket Kelas')
                                            ->itemLabel(fn (array $state): ?string => $state['name'] ?? 'Paket Kelas')
                                            ->schema([
                                                Grid::make(3)->schema([
                                                    TextInput::make('name')
                                                        ->label('Nama Program / Kelas')
                                                        ->required(),
                                                    TextInput::make('duration')
                                                        ->label('Durasi / Jadwal')
                                                        ->placeholder('Contoh: 1 Hari (6 Jam Intensif)')
                                                        ->required(),
                                                    TextInput::make('price')
                                                        ->label('Biaya / Investasi')
                                                        ->placeholder('Contoh: Rp 850.000 / orang')
                                                        ->required(),
                                                ]),
                                                Grid::make(2)->schema([
                                                    TextInput::make('badge')
                                                        ->label('Label Tag / Badge (Opsional)')
                                                        ->placeholder('Contoh: Paling Populer, Siap Buka Kedai'),
                                                    Toggle::make('is_popular')
                                                        ->label('Tandai sebagai Paket Rekomendasi Utama')
                                                        ->default(false),
                                                ]),
                                                Textarea::make('description')
                                                    ->label('Deskripsi Singkat Kelas')
                                                    ->rows(2),
                                                Textarea::make('features')
                                                    ->label('Daftar Materi / Benefit (1 baris per poin)')
                                                    ->rows(4)
                                                    ->helperText('Tulis tiap materi dalam baris baru. Contoh: Kalibrasi espresso' . PHP_EOL . 'Teknik milk steaming' . PHP_EOL . 'Sertifikat resmi'),
                                            ])
                                            ->addActionLabel('Tambah Paket Kelas Baru')
                                            ->defaultItems(3)
                                            ->collapsible(),
                                    ]),

                                Section::make('Galeri Foto Pelatihan & Pengaturan Grid')
                                    ->description('Kelola dokumentasi foto kegiatan pelatihan dengan tata letak grid responsif desktop, tablet, dan mobile.')
                                    ->schema([
                                        Grid::make(2)->schema([
                                            TextInput::make('barista_gallery_title')
                                                ->label('Judul Bagian Galeri')
                                                ->default('Dokumentasi & Suasana Kelas Barista')
                                                ->required(),
                                            TextInput::make('barista_gallery_subtitle')
                                                ->label('Subjudul Galeri')
                                                ->default('Momen praktik peserta mengasah teknik espresso, latte art, dan manual brew di Alat Kopi Malang.'),
                                        ]),
                                        Grid::make(4)->schema([
                                            Select::make('barista_grid_desktop')
                                                ->label('Grid Kolom Desktop')
                                                ->options([
                                                    '1' => '1 Kolom',
                                                    '2' => '2 Kolom',
                                                    '3' => '3 Kolom (Default)',
                                                    '4' => '4 Kolom',
                                                    '5' => '5 Kolom',
                                                    '6' => '6 Kolom',
                                                ])
                                                ->default('3')
                                                ->required(),
                                            Select::make('barista_grid_tablet')
                                                ->label('Grid Kolom Tablet')
                                                ->options([
                                                    '1' => '1 Kolom',
                                                    '2' => '2 Kolom (Default)',
                                                    '3' => '3 Kolom',
                                                    '4' => '4 Kolom',
                                                ])
                                                ->default('2')
                                                ->required(),
                                            Select::make('barista_grid_mobile')
                                                ->label('Grid Kolom Mobile')
                                                ->options([
                                                    '1' => '1 Kolom (Default Rapi)',
                                                    '2' => '2 Kolom (Kompak)',
                                                ])
                                                ->default('1')
                                                ->required(),
                                            Select::make('barista_image_aspect')
                                                ->label('Rasio Gambar')
                                                ->options([
                                                    'aspect-4/3' => '4:3 (Default Standar)',
                                                    'aspect-16/9' => '16:9 (Lanskap Lebar)',
                                                    'aspect-square' => '1:1 (Persegi Sama Sisi)',
                                                    'aspect-auto' => 'Auto (Sesuai Asli)',
                                                ])
                                                ->default('aspect-4/3')
                                                ->required(),
                                        ]),
                                        Repeater::make('barista_gallery_images')
                                            ->label('Daftar Foto Galeri')
                                            ->itemLabel(fn (array $state): ?string => $state['caption'] ?? 'Foto Pelatihan')
                                            ->schema([
                                                Grid::make(2)->schema([
                                                    FileUpload::make('image_upload')
                                                        ->label('Unggah Foto')
                                                        ->disk('public')
                                                        ->directory('pages/barista/gallery')
                                                        ->image()
                                                        ->imageEditor()
                                                        ->maxSize(10240)
                                                        ->helperText('Format JPG, PNG, WEBP (maks. 10MB)'),
                                                    TextInput::make('image_url')
                                                        ->label('Atau URL Gambar Eksternal')
                                                        ->placeholder('https://images.unsplash.com/...'),
                                                ]),
                                                TextInput::make('caption')
                                                    ->label('Keterangan / Caption Foto (Opsional)')
                                                    ->placeholder('Contoh: Praktik kalibrasi grinder espresso'),
                                            ])
                                            ->addActionLabel('Tambah Foto Baru')
                                            ->reorderableWithButtons()
                                            ->collapsible(),
                                    ]),

                                Section::make('Kontak & Formulir Pendaftaran WhatsApp')
                                    ->description('Atur nomor WhatsApp tujuan dan teks pengantar formulir pendaftaran training barista.')
                                    ->schema([
                                        TextInput::make('barista_whatsapp_number')
                                            ->label('Nomor WhatsApp Trainer / Roastery (Tanpa tanda +)')
                                            ->placeholder('Contoh: 6285121930454')
                                            ->required(),
                                        Grid::make(2)->schema([
                                            TextInput::make('barista_form_title')
                                                ->label('Judul Kotak Formulir')
                                                ->default('Formulir Pendaftaran & Konsultasi Kelas Barista')
                                                ->required(),
                                            TextInput::make('barista_form_subtitle')
                                                ->label('Subjudul Kotak Formulir')
                                                ->default('Daftarkan diri Anda atau konsultasikan jadwal kelas privat langsung dengan tim trainer kami via WhatsApp.')
                                                ->required(),
                                        ]),
                                    ]),
                            ]),

                        // TAB 6: Halaman Acara & Workshop
                        Tab::make('Halaman Acara & Workshop (/acara)')
                            ->icon(Heroicon::CalendarDays)
                            ->schema([
                                Section::make('Banner Atas (Hero Acara)')
                                    ->description('Judul, label eyebrow, deskripsi, dan foto latar untuk halaman acara.')
                                    ->schema([
                                        Grid::make(2)->schema([
                                            TextInput::make('events_hero_badge')
                                                ->label('Label Tag / Eyebrow')
                                                ->placeholder('Contoh: Komunitas & Edukasi')
                                                ->required(),
                                            TextInput::make('events_hero_title')
                                                ->label('Judul Utama Hero')
                                                ->placeholder('Contoh: Workshop & Sesi Cupping Terbuka')
                                                ->required(),
                                        ]),
                                        Textarea::make('events_hero_description')
                                            ->label('Deskripsi Singkat')
                                            ->rows(3)
                                            ->required(),
                                        Grid::make(2)->schema([
                                            FileUpload::make('events_hero_image')
                                                ->label('Unggah Foto Banner Acara')
                                                ->disk('public')
                                                ->directory('pages/events')
                                                ->image()
                                                ->imageEditor()
                                                ->maxSize(5120)
                                                ->helperText('Format JPG, PNG, WEBP (maks. 5MB)'),
                                            TextInput::make('events_hero_image_url')
                                                ->label('Atau URL Foto Eksternal')
                                                ->placeholder('https://images.unsplash.com/...'),
                                        ]),
                                    ]),

                                Section::make('Pengaturan Daftar Acara')
                                    ->description('Judul seksi acara mendatang, pesan ketika jadwal kosong, dan tampilan riwayat acara.')
                                    ->schema([
                                        TextInput::make('events_upcoming_title')
                                            ->label('Judul Seksi Acara Mendatang')
                                            ->default('Acara Mendatang')
                                            ->required(),
                                        Textarea::make('events_empty_message')
                                            ->label('Pesan Jika Tidak Ada Acara Aktif')
                                            ->default('Belum ada jadwal acara baru saat ini. Ikuti Instagram kami di @alatkopimalang untuk kabar workshop terdekat!')
                                            ->rows(2)
                                            ->required(),
                                        Grid::make(2)->schema([
                                            Toggle::make('events_show_past')
                                                ->label('Tampilkan Riwayat Acara Sebelumnya (Past Events)')
                                                ->default(true),
                                            TextInput::make('events_past_title')
                                                ->label('Judul Seksi Riwayat Acara')
                                                ->default('Arsip & Riwayat Acara Sebelumnya')
                                                ->visible(fn ($get) => (bool) $get('events_show_past')),
                                        ]),
                                    ]),

                                Section::make('Kontak & Reservasi WhatsApp')
                                    ->description('Nomor WhatsApp tujuan pendaftaran acara dan teks tombol pendaftaran.')
                                    ->schema([
                                        TextInput::make('events_whatsapp_number')
                                            ->label('Nomor WhatsApp Tujuan Pendaftaran (Tanpa tanda +)')
                                            ->placeholder('Contoh: 6285121930454')
                                            ->required(),
                                        Grid::make(2)->schema([
                                            TextInput::make('events_cta_button_text')
                                                ->label('Teks Tombol Pendaftaran')
                                                ->default('Daftar via WhatsApp')
                                                ->required(),
                                            TextInput::make('events_cta_note')
                                                ->label('Catatan di Bawah Tombol')
                                                ->default('Slot terbatas • Konfirmasi instan'),
                                        ]),
                                    ]),

                                Section::make('Galeri Dokumentasi Workshop & Acara')
                                    ->description('Dokumentasi foto kegiatan workshop cupping dan edukasi kopi komunitas dengan kolom grid responsif.')
                                    ->schema([
                                        Grid::make(2)->schema([
                                            TextInput::make('events_gallery_title')
                                                ->label('Judul Bagian Galeri')
                                                ->default('Dokumentasi Acara & Workshop Alat Kopi Malang')
                                                ->required(),
                                            TextInput::make('events_gallery_subtitle')
                                                ->label('Subjudul Galeri')
                                                ->default('Momen kebersamaan komunitas, sesi sensory cupping, dan workshop seduh di Malang.'),
                                        ]),
                                        Grid::make(4)->schema([
                                            Select::make('events_grid_desktop')
                                                ->label('Grid Kolom Desktop')
                                                ->options([
                                                    '1' => '1 Kolom',
                                                    '2' => '2 Kolom',
                                                    '3' => '3 Kolom (Default)',
                                                    '4' => '4 Kolom',
                                                    '5' => '5 Kolom',
                                                    '6' => '6 Kolom',
                                                ])
                                                ->default('3')
                                                ->required(),
                                            Select::make('events_grid_tablet')
                                                ->label('Grid Kolom Tablet')
                                                ->options([
                                                    '1' => '1 Kolom',
                                                    '2' => '2 Kolom (Default)',
                                                    '3' => '3 Kolom',
                                                    '4' => '4 Kolom',
                                                ])
                                                ->default('2')
                                                ->required(),
                                            Select::make('events_grid_mobile')
                                                ->label('Grid Kolom Mobile')
                                                ->options([
                                                    '1' => '1 Kolom (Default Rapi)',
                                                    '2' => '2 Kolom (Kompak)',
                                                ])
                                                ->default('1')
                                                ->required(),
                                            Select::make('events_image_aspect')
                                                ->label('Rasio Gambar')
                                                ->options([
                                                    'aspect-4/3' => '4:3 (Default Standar)',
                                                    'aspect-16/9' => '16:9 (Lanskap Lebar)',
                                                    'aspect-square' => '1:1 (Persegi Sama Sisi)',
                                                    'aspect-auto' => 'Auto (Sesuai Asli)',
                                                ])
                                                ->default('aspect-4/3')
                                                ->required(),
                                        ]),
                                        Repeater::make('events_gallery_images')
                                            ->label('Daftar Foto Dokumentasi Acara')
                                            ->itemLabel(fn (array $state): ?string => $state['caption'] ?? 'Foto Dokumentasi')
                                            ->schema([
                                                Grid::make(2)->schema([
                                                    FileUpload::make('image_upload')
                                                        ->label('Unggah Foto')
                                                        ->disk('public')
                                                        ->directory('pages/events/gallery')
                                                        ->image()
                                                        ->imageEditor()
                                                        ->maxSize(10240)
                                                        ->helperText('Format JPG, PNG, WEBP (maks. 10MB)'),
                                                    TextInput::make('image_url')
                                                        ->label('Atau URL Gambar Eksternal')
                                                        ->placeholder('https://images.unsplash.com/...'),
                                                ]),
                                                TextInput::make('caption')
                                                    ->label('Keterangan / Caption Foto (Opsional)')
                                                    ->placeholder('Contoh: Sesi Cupping Kalibrasi Rasa'),
                                            ])
                                            ->addActionLabel('Tambah Foto Dokumentasi')
                                            ->reorderableWithButtons()
                                            ->collapsible(),
                                    ]),
                            ]),

                        // TAB 7: Halaman Blog & Journal
                        Tab::make('Halaman Blog & Journal (/blog)')
                            ->icon(Heroicon::DocumentText)
                            ->schema([
                                Section::make('Banner Atas (Hero Blog)')
                                    ->description('Teks header, icon, dan latar belakang pada halaman katalog artikel dan jurnal edukasi kopi.')
                                    ->schema([
                                        Grid::make(2)->schema([
                                            TextInput::make('blog_hero_badge')
                                                ->label('Label Tag / Eyebrow')
                                                ->placeholder('Contoh: Jejak Rasa Journal')
                                                ->required(),
                                            TextInput::make('blog_hero_title')
                                                ->label('Judul Utama Blog')
                                                ->placeholder('Contoh: Catatan Roaster & Cerita Dari Lereng Kawi')
                                                ->required(),
                                        ]),
                                        Textarea::make('blog_hero_description')
                                            ->label('Deskripsi Header Blog')
                                            ->rows(2)
                                            ->required(),
                                        Grid::make(2)->schema([
                                            Select::make('blog_hero_icon')
                                                ->label('Icon Banner Header')
                                                ->options(IconCatalog::options())
                                                ->searchable()
                                                ->prefixIcon(fn (?string $state) => IconCatalog::getPrefixIcon($state))
                                                ->default('newspaper'),
                                            FileUpload::make('blog_hero_bg_image')
                                                ->label('Gambar Latar Banner Hero (Opsional)')
                                                ->disk('public')
                                                ->directory('blog')
                                                ->image()
                                                ->maxSize(5120),
                                        ]),
                                    ]),

                                Section::make('Pengaturan Kolom Gambar & Tata Letak Grid')
                                    ->description('Atur jumlah kolom artikel dan rasio tampilan gambar pada halaman blog.')
                                    ->schema([
                                        Grid::make(3)->schema([
                                            Select::make('blog_grid_columns')
                                                ->label('Jumlah Kolom Grid Artikel')
                                                ->options([
                                                    '2' => '2 Kolom (Besar & Lega)',
                                                    '3' => '3 Kolom (Standar Rekomendasi)',
                                                    '4' => '4 Kolom (Padat & Ringkas)',
                                                ])
                                                ->default('3')
                                                ->required(),
                                            Select::make('blog_image_aspect')
                                                ->label('Rasio Kolom Gambar Sampul')
                                                ->options([
                                                    'aspect-16/10' => '16:10 (Default Modern)',
                                                    'aspect-16/9' => '16:9 (Lanskap Sinematik)',
                                                    'aspect-4/3' => '4:3 (Fotografi Tradisional)',
                                                    'aspect-square' => '1:1 (Persegi)',
                                                ])
                                                ->default('aspect-16/10')
                                                ->required(),
                                            TextInput::make('blog_posts_per_page')
                                                ->label('Jumlah Artikel per Halaman')
                                                ->numeric()
                                                ->default(9)
                                                ->required(),
                                        ]),
                                    ]),

                                Section::make('Tampilan Komponen Kartu Artikel (Icon, Tanggal, Penulis)')
                                    ->description('Atur elemen informasi apa saja yang dimunculkan pada kartu artikel di website.')
                                    ->schema([
                                        Grid::make(4)->schema([
                                            Toggle::make('blog_show_icons')
                                                ->label('Tampilkan Icon')
                                                ->default(true),
                                            Toggle::make('blog_show_read_time')
                                                ->label('Tampilkan Waktu Baca')
                                                ->default(true),
                                            Toggle::make('blog_show_date')
                                                ->label('Tampilkan Tanggal')
                                                ->default(true),
                                            Toggle::make('blog_show_author')
                                                ->label('Tampilkan Penulis')
                                                ->default(true),
                                        ]),
                                        TextInput::make('blog_cta_text')
                                            ->label('Teks Tombol Aksi Kartu')
                                            ->placeholder('Contoh: Baca Artikel')
                                            ->default('Baca Artikel'),
                                    ]),

                                Section::make('Interactive 3D Page-Flip Book Image Slider (Halaman Blog /blog - Rasio 4:5 Full Gambar)')
                                    ->description('Tampilkan buku foto interaktif 3D (Page-Flip Book) rasio 4:5 full gambar tanpa bingkai pinggir, judul, maupun deskripsi pada halaman utama /blog.')
                                    ->schema([
                                        Grid::make(2)->schema([
                                            Toggle::make('blog_flipbook_enabled')
                                                ->label('Aktifkan 3D Page-Flip Book di Halaman /blog')
                                                ->default(false),
                                            Toggle::make('blog_flipbook_autoplay')
                                                ->label('Putar Halaman Otomatis (Auto-Flip)')
                                                ->default(false),
                                        ]),
                                        Repeater::make('blog_flipbook_pages')
                                            ->label('Daftar Halaman Gambar 3D Book (Rasio 4:5)')
                                            ->addActionLabel('Tambah Halaman Gambar 3D')
                                            ->itemLabel('Halaman Gambar 4:5')
                                            ->schema([
                                                Grid::make(2)->schema([
                                                    FileUpload::make('image')
                                                        ->label('Unggah Foto Halaman (Rasio 4:5)')
                                                        ->disk('public')
                                                        ->directory('blog/flipbook')
                                                        ->image()
                                                        ->imageEditor()
                                                        ->maxSize(5120),
                                                    TextInput::make('image_url')
                                                        ->label('Atau URL Gambar Eksternal')
                                                        ->placeholder('https://images.unsplash.com/...'),
                                                ]),
                                            ])
                                            ->defaultItems(2)
                                            ->reorderable()
                                            ->collapsible()
                                            ->columnSpanFull(),
                                    ]),

                                Section::make('Manajemen Artikel & Konten Blog')
                                    ->description('Untuk menambah artikel baru, mengedit teks, menghapus, atau mempublikasikan artikel ke website, silakan gunakan menu Blog & Artikel yang ada di bilah navigasi admin.')
                                    ->schema([
                                        // Information Callout
                                    ]),
                            ]),

                        // TAB 8: Halaman Booking Tempat
                        Tab::make('Halaman Booking Tempat (/booking-tempat)')
                            ->icon(Heroicon::CalendarDays)
                            ->schema([
                                Section::make('Banner Atas (Hero Booking Tempat)')
                                    ->description('Judul, label, deskripsi, dan foto utama untuk halaman booking tempat.')
                                    ->schema([
                                        Grid::make(2)->schema([
                                            TextInput::make('booking_hero_badge')
                                                ->label('Label Tag / Eyebrow')
                                                ->required(),
                                            TextInput::make('booking_hero_title')
                                                ->label('Judul Utama Hero')
                                                ->required(),
                                        ]),
                                        Textarea::make('booking_hero_description')
                                            ->label('Deskripsi Singkat')
                                            ->rows(3)
                                            ->required(),
                                        Grid::make(2)->schema([
                                            FileUpload::make('booking_hero_image')
                                                ->label('Unggah Foto Utama Tempat')
                                                ->disk('public')
                                                ->directory('pages/booking')
                                                ->image()
                                                ->imageEditor()
                                                ->maxSize(10240)
                                                ->helperText('Format JPG, PNG, WEBP (maks. 10MB)'),
                                            TextInput::make('booking_hero_image_url')
                                                ->label('Atau URL Foto Eksternal')
                                                ->placeholder('https://images.unsplash.com/...'),
                                        ]),
                                    ]),

                                Section::make('4 Manfaat Utama (Kapasitas, Free Proyektor, Free Sound, Minimum Spent)')
                                    ->description('Atur kartu manfaat utama booking tempat di Alat Kopi Malang (Kapasitas 50+ orang, Proyektor Gratis, Sound System Gratis, Cukup Minimum Spent).')
                                    ->schema([
                                        Repeater::make('booking_benefits')
                                            ->label('Daftar Manfaat Utama')
                                            ->itemLabel(fn (array $state): ?string => $state['title'] ?? 'Manfaat')
                                            ->schema([
                                                Grid::make(3)->schema([
                                                    TextInput::make('title')
                                                        ->label('Judul Manfaat')
                                                        ->required(),
                                                    TextInput::make('badge')
                                                        ->label('Label Tag / Badge Kecil')
                                                        ->placeholder('Contoh: Kapasitas Luas / Fasilitas Gratis'),
                                                    Toggle::make('is_highlight')
                                                        ->label('Sorotan / Tema Gelap')
                                                        ->helperText('Aktifkan untuk tampilan kartu gelap kontras (seperti kartu Minimum Spent).')
                                                        ->default(false),
                                                ]),
                                                Textarea::make('description')
                                                    ->label('Penjelasan Detail Manfaat')
                                                    ->rows(2)
                                                    ->required(),
                                            ])
                                            ->defaultItems(4)
                                            ->reorderableWithButtons()
                                            ->collapsible(),
                                    ]),

                                Section::make('Fasilitas Pendukung Ruangan')
                                    ->description('Daftar fasilitas pendukung kenyamanan ruangan (AC, Wi-Fi Cepat, Colokan Listrik, Parkir Luas, dll) beserta pilihan icon.')
                                    ->schema([
                                        Repeater::make('booking_facilities')
                                            ->label('Daftar Fasilitas Pendukung')
                                            ->itemLabel(fn (array $state): ?string => $state['title'] ?? 'Fasilitas')
                                            ->schema([
                                                Grid::make(3)->schema([
                                                    Select::make('icon')
                                                        ->label('Icon Fasilitas')
                                                        ->options(IconCatalog::options())
                                                        ->searchable()
                                                        ->prefixIcon(fn (?string $state) => IconCatalog::getPrefixIcon($state))
                                                        ->default('zap')
                                                        ->required(),
                                                    TextInput::make('title')
                                                        ->label('Nama Fasilitas')
                                                        ->required(),
                                                    TextInput::make('description')
                                                        ->label('Keterangan Singkat')
                                                        ->required(),
                                                ]),
                                            ])
                                            ->defaultItems(4)
                                            ->reorderableWithButtons()
                                            ->collapsible(),
                                    ]),

                                Section::make('Galeri Dokumentasi Foto Ruangan & Suasana Acara')
                                    ->description('Unggah dokumentasi foto suasana ruangan, penataan meja workshop/meeting, dan acara komunitas di Alat Kopi Malang.')
                                    ->schema([
                                        Grid::make(2)->schema([
                                            TextInput::make('booking_gallery_title')
                                                ->label('Judul Bagian Galeri')
                                                ->required(),
                                            TextInput::make('booking_gallery_subtitle')
                                                ->label('Subjudul Galeri')
                                                ->placeholder('Momen kehangatan workshop, meeting, dan gathering...'),
                                        ]),
                                        Grid::make(4)->schema([
                                            Select::make('booking_grid_desktop')
                                                ->label('Grid Kolom Desktop')
                                                ->options([
                                                    '1' => '1 Kolom',
                                                    '2' => '2 Kolom',
                                                    '3' => '3 Kolom (Default)',
                                                    '4' => '4 Kolom',
                                                ])
                                                ->default('3')
                                                ->required(),
                                            Select::make('booking_grid_tablet')
                                                ->label('Grid Kolom Tablet')
                                                ->options([
                                                    '1' => '1 Kolom',
                                                    '2' => '2 Kolom (Default)',
                                                    '3' => '3 Kolom',
                                                ])
                                                ->default('2')
                                                ->required(),
                                            Select::make('booking_grid_mobile')
                                                ->label('Grid Kolom Mobile')
                                                ->options([
                                                    '1' => '1 Kolom (Default)',
                                                    '2' => '2 Kolom',
                                                ])
                                                ->default('1')
                                                ->required(),
                                            Select::make('booking_image_aspect')
                                                ->label('Rasio Gambar')
                                                ->options([
                                                    'aspect-4/3' => '4:3 (Default Standar)',
                                                    'aspect-16/9' => '16:9 (Lanskap Lebar)',
                                                    'aspect-square' => '1:1 (Persegi Sama Sisi)',
                                                    'aspect-auto' => 'Auto (Sesuai Asli)',
                                                ])
                                                ->default('aspect-4/3')
                                                ->required(),
                                        ]),
                                        Repeater::make('booking_gallery_images')
                                            ->label('Daftar Foto Dokumentasi Ruangan & Acara')
                                            ->itemLabel(fn (array $state): ?string => $state['caption'] ?? 'Foto Dokumentasi')
                                            ->schema([
                                                Grid::make(2)->schema([
                                                    FileUpload::make('image_upload')
                                                        ->label('Unggah Foto')
                                                        ->disk('public')
                                                        ->directory('pages/booking/gallery')
                                                        ->image()
                                                        ->imageEditor()
                                                        ->maxSize(10240)
                                                        ->helperText('Format JPG, PNG, WEBP (maks. 10MB)'),
                                                    TextInput::make('image_url')
                                                        ->label('Atau URL Gambar Eksternal')
                                                        ->placeholder('https://images.unsplash.com/...'),
                                                ]),
                                                TextInput::make('caption')
                                                    ->label('Keterangan / Caption Foto (Opsional)')
                                                    ->placeholder('Contoh: Suasana Ruangan Luas & Meja Diskusi Komunitas'),
                                            ])
                                            ->addActionLabel('Tambah Foto Dokumentasi')
                                            ->reorderableWithButtons()
                                            ->collapsible(),
                                    ]),

                                Section::make('Formulir Reservasi, WhatsApp & Jenis Acara')
                                    ->description('Atur nomor WhatsApp tujuan, judul formulir, serta pilihan jenis acara yang tersedia untuk dipilih pengunjung.')
                                    ->schema([
                                        Grid::make(2)->schema([
                                            TextInput::make('booking_whatsapp_number')
                                                ->label('Nomor WhatsApp Reservasi')
                                                ->placeholder('6285121930454')
                                                ->required(),
                                            TextInput::make('booking_form_title')
                                                ->label('Judul Formulir Reservasi')
                                                ->required(),
                                        ]),
                                        Grid::make(2)->schema([
                                            TextInput::make('booking_form_subtitle')
                                                ->label('Subjudul Formulir Reservasi')
                                                ->required(),
                                            Textarea::make('booking_minimum_spent_info')
                                                ->label('Keterangan Ketentuan Minimum Spent')
                                                ->rows(2),
                                        ]),
                                        Repeater::make('booking_event_types')
                                            ->label('Daftar Pilihan Jenis Acara pada Formulir')
                                            ->itemLabel(fn (array $state): ?string => $state['name'] ?? 'Jenis Acara')
                                            ->schema([
                                                TextInput::make('name')
                                                    ->label('Nama Jenis Acara')
                                                    ->placeholder('Contoh: Workshop & Kelas Pelatihan')
                                                    ->required(),
                                            ])
                                            ->addActionLabel('Tambah Jenis Acara')
                                            ->reorderableWithButtons()
                                            ->collapsible(),
                                    ]),

                                Section::make('Informasi Lokasi & Jam Operasional')
                                    ->description('Detail alamat roastery, jam buka, dan link Google Maps untuk kenyamanan tamu yang berkunjung.')
                                    ->schema([
                                        Grid::make(3)->schema([
                                            TextInput::make('booking_address')
                                                ->label('Alamat Lengkap')
                                                ->required(),
                                            TextInput::make('booking_hours')
                                                ->label('Jam Operasional')
                                                ->required(),
                                            TextInput::make('booking_maps_url')
                                                ->label('Tautan Google Maps')
                                                ->placeholder('https://maps.app.goo.gl/...'),
                                        ]),
                                    ]),
                            ]),

                        // TAB 9: Halaman Coffee Catering
                        Tab::make('Halaman Coffee Catering (/coffee-catering)')
                            ->icon(Heroicon::Beaker)
                            ->schema([
                                Section::make('Banner Atas (Hero Coffee Catering)')
                                    ->description('Judul, label tag, deskripsi, dan foto utama untuk halaman coffee catering on-site.')
                                    ->schema([
                                        Grid::make(2)->schema([
                                            TextInput::make('catering_hero_badge')
                                                ->label('Label Tag / Eyebrow')
                                                ->required(),
                                            TextInput::make('catering_hero_title')
                                                ->label('Judul Utama Hero')
                                                ->required(),
                                        ]),
                                        Textarea::make('catering_hero_description')
                                            ->label('Deskripsi Singkat')
                                            ->rows(3)
                                            ->required(),
                                        Grid::make(2)->schema([
                                            FileUpload::make('catering_hero_image')
                                                ->label('Unggah Foto Utama Catering')
                                                ->disk('public')
                                                ->directory('pages/catering')
                                                ->image()
                                                ->imageEditor()
                                                ->maxSize(10240)
                                                ->helperText('Format JPG, PNG, WEBP (maks. 10MB)'),
                                            TextInput::make('catering_hero_image_url')
                                                ->label('Atau URL Foto Eksternal')
                                                ->placeholder('https://images.unsplash.com/...'),
                                        ]),
                                    ]),

                                Section::make('4 Keunggulan Utama (Min. Order 200 Cup, On-site, Mesin Lengkap, Biji Kopi)')
                                    ->description('Atur 4 kartu keunggulan utama layanan coffee catering Alat Kopi Malang.')
                                    ->schema([
                                        Repeater::make('catering_benefits')
                                            ->label('Daftar Keunggulan Utama')
                                            ->itemLabel(fn (array $state): ?string => $state['title'] ?? 'Keunggulan')
                                            ->schema([
                                                Grid::make(3)->schema([
                                                    TextInput::make('title')
                                                        ->label('Judul Keunggulan')
                                                        ->required(),
                                                    TextInput::make('badge')
                                                        ->label('Label Tag / Badge Kecil')
                                                        ->placeholder('Contoh: Kapasitas Fleksibel'),
                                                    Toggle::make('is_highlight')
                                                        ->label('Sorotan / Tema Gelap Kontras')
                                                        ->default(false),
                                                ]),
                                                Textarea::make('description')
                                                    ->label('Penjelasan Detail')
                                                    ->rows(2)
                                                    ->required(),
                                            ])
                                            ->defaultItems(4)
                                            ->reorderableWithButtons()
                                            ->collapsible(),
                                    ]),

                                Section::make('Ragam Acara yang Didukung (Wedding, Kantor, Seminar, Keluarga)')
                                    ->description('Atur kartu fungsi acara (Wedding, Corporate/Kantor, Seminar/Workshop, Keluarga/Private Party).')
                                    ->schema([
                                        Repeater::make('catering_occasions')
                                            ->label('Daftar Ragam Acara')
                                            ->itemLabel(fn (array $state): ?string => $state['name'] ?? 'Acara')
                                            ->schema([
                                                TextInput::make('name')
                                                    ->label('Nama Jenis Acara')
                                                    ->required(),
                                            ])
                                            ->defaultItems(4)
                                            ->reorderableWithButtons()
                                            ->collapsible(),
                                    ]),

                                Section::make('Galeri Dokumentasi Foto On-site Catering & Live Bar')
                                    ->description('Unggah dokumentasi foto suasana live coffee booth di acara pernikahan, seminar, dan event kantor.')
                                    ->schema([
                                        Grid::make(2)->schema([
                                            TextInput::make('catering_gallery_title')
                                                ->label('Judul Bagian Galeri')
                                                ->required(),
                                            TextInput::make('catering_gallery_subtitle')
                                                ->label('Subjudul Galeri')
                                                ->placeholder('Momen kebahagiaan para tamu...'),
                                        ]),
                                        Grid::make(4)->schema([
                                            Select::make('catering_grid_desktop')
                                                ->label('Grid Kolom Desktop')
                                                ->options([
                                                    '1' => '1 Kolom',
                                                    '2' => '2 Kolom',
                                                    '3' => '3 Kolom (Default)',
                                                    '4' => '4 Kolom',
                                                ])
                                                ->default('3')
                                                ->required(),
                                            Select::make('catering_grid_tablet')
                                                ->label('Grid Kolom Tablet')
                                                ->options([
                                                    '1' => '1 Kolom',
                                                    '2' => '2 Kolom (Default)',
                                                    '3' => '3 Kolom',
                                                ])
                                                ->default('2')
                                                ->required(),
                                            Select::make('catering_grid_mobile')
                                                ->label('Grid Kolom Mobile')
                                                ->options([
                                                    '1' => '1 Kolom (Default)',
                                                    '2' => '2 Kolom',
                                                ])
                                                ->default('1')
                                                ->required(),
                                            Select::make('catering_image_aspect')
                                                ->label('Rasio Gambar')
                                                ->options([
                                                    'aspect-4/3' => '4:3 (Default Standar)',
                                                    'aspect-16/9' => '16:9 (Lanskap Lebar)',
                                                    'aspect-square' => '1:1 (Persegi Sama Sisi)',
                                                    'aspect-auto' => 'Auto (Sesuai Asli)',
                                                ])
                                                ->default('aspect-4/3')
                                                ->required(),
                                        ]),
                                        Repeater::make('catering_gallery_images')
                                            ->label('Daftar Foto Dokumentasi Catering')
                                            ->itemLabel(fn (array $state): ?string => $state['caption'] ?? 'Foto Catering')
                                            ->schema([
                                                Grid::make(2)->schema([
                                                    FileUpload::make('image_upload')
                                                        ->label('Unggah Foto')
                                                        ->disk('public')
                                                        ->directory('pages/catering/gallery')
                                                        ->image()
                                                        ->imageEditor()
                                                        ->maxSize(10240)
                                                        ->helperText('Format JPG, PNG, WEBP (maks. 10MB)'),
                                                    TextInput::make('image_url')
                                                        ->label('Atau URL Gambar Eksternal')
                                                        ->placeholder('https://images.unsplash.com/...'),
                                                ]),
                                                TextInput::make('caption')
                                                    ->label('Keterangan / Caption Foto (Opsional)')
                                                    ->placeholder('Contoh: Live Espresso Bar & Barista Standby di Pernikahan'),
                                            ])
                                            ->addActionLabel('Tambah Foto Dokumentasi')
                                            ->reorderableWithButtons()
                                            ->collapsible(),
                                    ]),

                                Section::make('Formulir Reservasi, WhatsApp & Ketentuan Layanan')
                                    ->description('Nomor WhatsApp penerima pesanan catering, judul form, serta ketentuan minimum order.')
                                    ->schema([
                                        Grid::make(3)->schema([
                                            TextInput::make('catering_whatsapp_number')
                                                ->label('Nomor WhatsApp Reservasi')
                                                ->placeholder('6285121930454')
                                                ->required(),
                                            TextInput::make('catering_form_title')
                                                ->label('Judul Formulir Pemesanan')
                                                ->required(),
                                            TextInput::make('catering_minimum_order_cups')
                                                ->label('Ketentuan Minimum Cup')
                                                ->default('200')
                                                ->required(),
                                        ]),
                                        TextInput::make('catering_form_subtitle')
                                            ->label('Subjudul Formulir Pemesanan')
                                            ->required(),
                                        Textarea::make('catering_terms_note')
                                            ->label('Catatan Ketentuan Pemesanan (Paling Bawah Form)')
                                            ->rows(2)
                                            ->required(),
                                    ]),
                            ]),
                    ]),
            ]);
    }

    public function save(): void
    {
        $data = $this->form->getState();

        // 1. Process and format page_about
        $aboutImage = $data['about_story_image'] ?? null;
        if (! empty($aboutImage) && is_string($aboutImage) && ! str_starts_with($aboutImage, 'http') && ! str_starts_with($aboutImage, '/')) {
            $aboutImage = '/storage/' . $aboutImage;
        }

        $aboutVideoUpload = $data['about_video_upload'] ?? null;
        if (is_array($aboutVideoUpload)) {
            $aboutVideoUpload = ! empty($aboutVideoUpload) ? array_values($aboutVideoUpload)[0] : null;
        }
        if (! empty($aboutVideoUpload) && is_string($aboutVideoUpload) && ! str_starts_with($aboutVideoUpload, 'http') && ! str_starts_with($aboutVideoUpload, '/')) {
            $aboutVideoUpload = '/storage/' . $aboutVideoUpload;
        }

        $aboutVideoPoster = $data['about_video_poster'] ?? null;
        if (is_array($aboutVideoPoster)) {
            $aboutVideoPoster = ! empty($aboutVideoPoster) ? array_values($aboutVideoPoster)[0] : null;
        }
        if (! empty($aboutVideoPoster) && is_string($aboutVideoPoster) && ! str_starts_with($aboutVideoPoster, 'http') && ! str_starts_with($aboutVideoPoster, '/')) {
            $aboutVideoPoster = '/storage/' . $aboutVideoPoster;
        }

        $pageAbout = [
            'hero_badge' => $data['about_hero_badge'] ?? '',
            'hero_title' => $data['about_hero_title'] ?? '',
            'hero_description' => $data['about_hero_description'] ?? '',
            'story_title' => $data['about_story_title'] ?? '',
            'story_subtitle' => $data['about_story_subtitle'] ?? '',
            'story_p1' => $data['about_story_p1'] ?? '',
            'story_p2' => $data['about_story_p2'] ?? '',
            'story_image' => $aboutImage,
            'video_upload' => $aboutVideoUpload,
            'video_url' => $data['about_video_url'] ?? null,
            'video_title' => $data['about_video_title'] ?? '',
            'video_subtitle' => $data['about_video_subtitle'] ?? '',
            'video_poster' => $aboutVideoPoster,
            'video_position' => $data['about_video_position'] ?? 'section',
            'values_title' => $data['about_values_title'] ?? '',
            'values_subtitle' => $data['about_values_subtitle'] ?? '',
            'pillars' => $data['about_pillars'] ?? [],
        ];

        // 2. Process page_wholesale
        $wholesaleHeroUpload = $data['wholesale_hero_image'] ?? null;
        if (is_array($wholesaleHeroUpload)) {
            $wholesaleHeroUpload = ! empty($wholesaleHeroUpload) ? array_values($wholesaleHeroUpload)[0] : null;
        }
        if (! empty($wholesaleHeroUpload) && is_string($wholesaleHeroUpload)) {
            $finalWholesaleHero = (str_starts_with($wholesaleHeroUpload, 'http') || str_starts_with($wholesaleHeroUpload, '/'))
                ? $wholesaleHeroUpload
                : '/storage/' . $wholesaleHeroUpload;
        } else {
            $finalWholesaleHero = $data['wholesale_hero_image_url'] ?? null;
        }

        $wholesaleFormUpload = $data['wholesale_form_image'] ?? null;
        if (is_array($wholesaleFormUpload)) {
            $wholesaleFormUpload = ! empty($wholesaleFormUpload) ? array_values($wholesaleFormUpload)[0] : null;
        }
        if (! empty($wholesaleFormUpload) && is_string($wholesaleFormUpload)) {
            $finalWholesaleFormImage = (str_starts_with($wholesaleFormUpload, 'http') || str_starts_with($wholesaleFormUpload, '/'))
                ? $wholesaleFormUpload
                : '/storage/' . $wholesaleFormUpload;
        } else {
            $finalWholesaleFormImage = $data['wholesale_form_image_url'] ?? null;
        }

        $wholesaleBenefits = [];
        if (! empty($data['wholesale_benefits']) && is_array($data['wholesale_benefits'])) {
            foreach ($data['wholesale_benefits'] as $b) {
                $bImgUpload = $b['image_upload'] ?? null;
                if (is_array($bImgUpload)) {
                    $bImgUpload = ! empty($bImgUpload) ? array_values($bImgUpload)[0] : null;
                }
                if (! empty($bImgUpload) && is_string($bImgUpload)) {
                    $finalBImg = (str_starts_with($bImgUpload, 'http') || str_starts_with($bImgUpload, '/'))
                        ? $bImgUpload
                        : '/storage/' . $bImgUpload;
                } else {
                    $finalBImg = $b['image_url'] ?? null;
                }

                $wholesaleBenefits[] = [
                    'title' => $b['title'] ?? '',
                    'description' => $b['description'] ?? '',
                    'image' => $finalBImg,
                ];
            }
        }

        $wholesaleGalleryImages = [];
        if (! empty($data['wholesale_gallery_images']) && is_array($data['wholesale_gallery_images'])) {
            foreach ($data['wholesale_gallery_images'] as $item) {
                $imgUpload = $item['image_upload'] ?? null;
                if (is_array($imgUpload)) {
                    $imgUpload = ! empty($imgUpload) ? array_values($imgUpload)[0] : null;
                }
                if (! empty($imgUpload) && is_string($imgUpload)) {
                    $finalImg = (str_starts_with($imgUpload, 'http') || str_starts_with($imgUpload, '/'))
                        ? $imgUpload
                        : '/storage/' . $imgUpload;
                } else {
                    $finalImg = $item['image_url'] ?? null;
                }

                if (! empty($finalImg)) {
                    $wholesaleGalleryImages[] = [
                        'image' => $finalImg,
                        'caption' => $item['caption'] ?? '',
                    ];
                }
            }
        }

        $pageWholesale = [
            'hero_badge' => $data['wholesale_hero_badge'] ?? '',
            'hero_title' => $data['wholesale_hero_title'] ?? '',
            'hero_description' => $data['wholesale_hero_description'] ?? '',
            'hero_image' => $finalWholesaleHero,
            'benefits' => $wholesaleBenefits,
            'whatsapp_number' => $data['wholesale_whatsapp_number'] ?? '',
            'form_image' => $finalWholesaleFormImage,
            'form_badge' => $data['wholesale_form_badge'] ?? 'Partner Terpercaya 50+ Kedai Kopi',
            'form_title' => $data['wholesale_form_title'] ?? 'Formulir Kemitraan Langsung WhatsApp',
            'form_subtitle' => $data['wholesale_form_subtitle'] ?? 'Isi detail singkat usaha Anda untuk langsung berkonsultasi dengan tim kemitraan kami.',
            'gallery_title' => $data['wholesale_gallery_title'] ?? 'Dokumentasi Kemitraan & Pasokan Kedai',
            'gallery_subtitle' => $data['wholesale_gallery_subtitle'] ?? '',
            'grid_desktop' => (int) ($data['wholesale_grid_desktop'] ?? 3),
            'grid_tablet' => (int) ($data['wholesale_grid_tablet'] ?? 2),
            'grid_mobile' => (int) ($data['wholesale_grid_mobile'] ?? 1),
            'image_aspect' => $data['wholesale_image_aspect'] ?? 'aspect-4/3',
            'gallery_images' => $wholesaleGalleryImages,
        ];

        // 3. Process page_visit
        $visitMainUpload = $data['visit_main_image'] ?? null;
        if (is_array($visitMainUpload)) {
            $visitMainUpload = ! empty($visitMainUpload) ? array_values($visitMainUpload)[0] : null;
        }
        if (! empty($visitMainUpload) && is_string($visitMainUpload)) {
            $finalMainImage = (str_starts_with($visitMainUpload, 'http') || str_starts_with($visitMainUpload, '/'))
                ? $visitMainUpload
                : '/storage/' . $visitMainUpload;
        } else {
            $finalMainImage = $data['visit_main_image_url'] ?? null;
        }

        $galleryImages = [];
        if (! empty($data['visit_gallery_images']) && is_array($data['visit_gallery_images'])) {
            foreach ($data['visit_gallery_images'] as $item) {
                $imgUpload = $item['image_upload'] ?? null;
                if (is_array($imgUpload)) {
                    $imgUpload = ! empty($imgUpload) ? array_values($imgUpload)[0] : null;
                }
                if (! empty($imgUpload) && is_string($imgUpload)) {
                    $finalImg = (str_starts_with($imgUpload, 'http') || str_starts_with($imgUpload, '/'))
                        ? $imgUpload
                        : '/storage/' . $imgUpload;
                } else {
                    $finalImg = $item['image_url'] ?? null;
                }

                if (! empty($finalImg)) {
                    $galleryImages[] = [
                        'image' => $finalImg,
                        'caption' => $item['caption'] ?? '',
                    ];
                }
            }
        }

        $pageVisit = [
            'hero_badge' => $data['visit_hero_badge'] ?? '',
            'hero_title' => $data['visit_hero_title'] ?? '',
            'hero_description' => $data['visit_hero_description'] ?? '',
            'welcome_title' => $data['visit_welcome_title'] ?? '',
            'address' => $data['visit_address'] ?? '',
            'hours' => $data['visit_hours'] ?? '',
            'phone' => $data['visit_phone'] ?? '',
            'maps_url' => $data['visit_maps_url'] ?? '',
            'facilities' => $data['visit_facilities'] ?? [],
            'main_image' => $finalMainImage,
            'gallery_title' => $data['visit_gallery_title'] ?? 'Galeri Suasana Roastery & Showroom',
            'gallery_subtitle' => $data['visit_gallery_subtitle'] ?? '',
            'grid_desktop' => (int) ($data['visit_grid_desktop'] ?? 3),
            'grid_tablet' => (int) ($data['visit_grid_tablet'] ?? 2),
            'grid_mobile' => (int) ($data['visit_grid_mobile'] ?? 1),
            'image_aspect' => $data['visit_image_aspect'] ?? 'aspect-4/3',
            'gallery_images' => $galleryImages,
        ];

        // 4. Process page_roasting
        $roastHeroUpload = $data['roasting_hero_image'] ?? null;
        if (is_array($roastHeroUpload)) {
            $roastHeroUpload = ! empty($roastHeroUpload) ? array_values($roastHeroUpload)[0] : null;
        }
        if (! empty($roastHeroUpload) && is_string($roastHeroUpload)) {
            $finalRoastHero = (str_starts_with($roastHeroUpload, 'http') || str_starts_with($roastHeroUpload, '/'))
                ? $roastHeroUpload
                : '/storage/' . $roastHeroUpload;
        } else {
            $finalRoastHero = $data['roasting_hero_image_url'] ?? null;
        }

        $roastingGalleryImages = [];
        if (! empty($data['roasting_gallery_images']) && is_array($data['roasting_gallery_images'])) {
            foreach ($data['roasting_gallery_images'] as $item) {
                $imgUpload = $item['image_upload'] ?? null;
                if (is_array($imgUpload)) {
                    $imgUpload = ! empty($imgUpload) ? array_values($imgUpload)[0] : null;
                }
                if (! empty($imgUpload) && is_string($imgUpload)) {
                    $finalImg = (str_starts_with($imgUpload, 'http') || str_starts_with($imgUpload, '/'))
                        ? $imgUpload
                        : '/storage/' . $imgUpload;
                } else {
                    $finalImg = $item['image_url'] ?? null;
                }

                if (! empty($finalImg)) {
                    $roastingGalleryImages[] = [
                        'image' => $finalImg,
                        'caption' => $item['caption'] ?? '',
                    ];
                }
            }
        }

        $roastingPackages = [];
        if (! empty($data['roasting_packages']) && is_array($data['roasting_packages'])) {
            foreach ($data['roasting_packages'] as $pkg) {
                $feats = $pkg['features'] ?? '';
                $featureArr = is_array($feats)
                    ? $feats
                    : array_values(array_filter(array_map('trim', explode("\n", (string) $feats))));

                $roastingPackages[] = [
                    'name' => $pkg['name'] ?? '',
                    'capacity' => $pkg['capacity'] ?? '',
                    'price' => $pkg['price'] ?? '',
                    'badge' => $pkg['badge'] ?? '',
                    'is_popular' => (bool) ($pkg['is_popular'] ?? false),
                    'description' => $pkg['description'] ?? '',
                    'features' => $featureArr,
                ];
            }
        }

        $pageRoasting = [
            'hero_badge' => $data['roasting_hero_badge'] ?? '',
            'hero_title' => $data['roasting_hero_title'] ?? '',
            'hero_description' => $data['roasting_hero_description'] ?? '',
            'hero_image' => $finalRoastHero,
            'packages' => $roastingPackages,
            'gallery_title' => $data['roasting_gallery_title'] ?? 'Galeri Fasilitas & Proses Sangrai',
            'gallery_subtitle' => $data['roasting_gallery_subtitle'] ?? '',
            'grid_desktop' => (int) ($data['roasting_grid_desktop'] ?? 3),
            'grid_tablet' => (int) ($data['roasting_grid_tablet'] ?? 2),
            'grid_mobile' => (int) ($data['roasting_grid_mobile'] ?? 1),
            'image_aspect' => $data['roasting_image_aspect'] ?? 'aspect-4/3',
            'gallery_images' => $roastingGalleryImages,
            'whatsapp_number' => $data['roasting_whatsapp_number'] ?? '',
            'form_title' => $data['roasting_form_title'] ?? '',
            'form_subtitle' => $data['roasting_form_subtitle'] ?? '',
        ];

        // 5. Process page_barista_training
        $baristaHeroUpload = $data['barista_hero_image'] ?? null;
        if (is_array($baristaHeroUpload)) {
            $baristaHeroUpload = ! empty($baristaHeroUpload) ? array_values($baristaHeroUpload)[0] : null;
        }
        if (! empty($baristaHeroUpload) && is_string($baristaHeroUpload)) {
            $finalBaristaHero = (str_starts_with($baristaHeroUpload, 'http') || str_starts_with($baristaHeroUpload, '/'))
                ? $baristaHeroUpload
                : '/storage/' . $baristaHeroUpload;
        } else {
            $finalBaristaHero = $data['barista_hero_image_url'] ?? null;
        }

        $baristaGalleryImages = [];
        if (! empty($data['barista_gallery_images']) && is_array($data['barista_gallery_images'])) {
            foreach ($data['barista_gallery_images'] as $item) {
                $imgUpload = $item['image_upload'] ?? null;
                if (is_array($imgUpload)) {
                    $imgUpload = ! empty($imgUpload) ? array_values($imgUpload)[0] : null;
                }
                if (! empty($imgUpload) && is_string($imgUpload)) {
                    $finalImg = (str_starts_with($imgUpload, 'http') || str_starts_with($imgUpload, '/'))
                        ? $imgUpload
                        : '/storage/' . $imgUpload;
                } else {
                    $finalImg = $item['image_url'] ?? null;
                }

                if (! empty($finalImg)) {
                    $baristaGalleryImages[] = [
                        'image' => $finalImg,
                        'caption' => $item['caption'] ?? '',
                    ];
                }
            }
        }

        $baristaPackages = [];
        if (! empty($data['barista_packages']) && is_array($data['barista_packages'])) {
            foreach ($data['barista_packages'] as $pkg) {
                $feats = $pkg['features'] ?? '';
                $featureArr = is_array($feats)
                    ? $feats
                    : array_values(array_filter(array_map('trim', explode("\n", (string) $feats))));

                $baristaPackages[] = [
                    'name' => $pkg['name'] ?? '',
                    'duration' => $pkg['duration'] ?? '',
                    'price' => $pkg['price'] ?? '',
                    'badge' => $pkg['badge'] ?? '',
                    'is_popular' => (bool) ($pkg['is_popular'] ?? false),
                    'description' => $pkg['description'] ?? '',
                    'features' => $featureArr,
                ];
            }
        }

        $pageBarista = [
            'hero_badge' => $data['barista_hero_badge'] ?? '',
            'hero_title' => $data['barista_hero_title'] ?? '',
            'hero_description' => $data['barista_hero_description'] ?? '',
            'hero_image' => $finalBaristaHero,
            'packages' => $baristaPackages,
            'gallery_title' => $data['barista_gallery_title'] ?? 'Dokumentasi & Suasana Kelas Barista',
            'gallery_subtitle' => $data['barista_gallery_subtitle'] ?? '',
            'grid_desktop' => (int) ($data['barista_grid_desktop'] ?? 3),
            'grid_tablet' => (int) ($data['barista_grid_tablet'] ?? 2),
            'grid_mobile' => (int) ($data['barista_grid_mobile'] ?? 1),
            'image_aspect' => $data['barista_image_aspect'] ?? 'aspect-4/3',
            'gallery_images' => $baristaGalleryImages,
            'whatsapp_number' => $data['barista_whatsapp_number'] ?? '',
            'form_title' => $data['barista_form_title'] ?? '',
            'form_subtitle' => $data['barista_form_subtitle'] ?? '',
        ];

        // 6. Process page_events
        $eventsHeroUpload = $data['events_hero_image'] ?? null;
        if (is_array($eventsHeroUpload)) {
            $eventsHeroUpload = ! empty($eventsHeroUpload) ? array_values($eventsHeroUpload)[0] : null;
        }
        if (! empty($eventsHeroUpload) && is_string($eventsHeroUpload)) {
            $finalEventsHero = (str_starts_with($eventsHeroUpload, 'http') || str_starts_with($eventsHeroUpload, '/'))
                ? $eventsHeroUpload
                : '/storage/' . $eventsHeroUpload;
        } else {
            $finalEventsHero = $data['events_hero_image_url'] ?? null;
        }

        $eventsGalleryImages = [];
        if (! empty($data['events_gallery_images']) && is_array($data['events_gallery_images'])) {
            foreach ($data['events_gallery_images'] as $item) {
                $imgUpload = $item['image_upload'] ?? null;
                if (is_array($imgUpload)) {
                    $imgUpload = ! empty($imgUpload) ? array_values($imgUpload)[0] : null;
                }
                if (! empty($imgUpload) && is_string($imgUpload)) {
                    $finalImg = (str_starts_with($imgUpload, 'http') || str_starts_with($imgUpload, '/'))
                        ? $imgUpload
                        : '/storage/' . $imgUpload;
                } else {
                    $finalImg = $item['image_url'] ?? null;
                }

                if (! empty($finalImg)) {
                    $eventsGalleryImages[] = [
                        'image' => $finalImg,
                        'caption' => $item['caption'] ?? '',
                    ];
                }
            }
        }

        $pageEvents = [
            'hero_badge' => $data['events_hero_badge'] ?? '',
            'hero_title' => $data['events_hero_title'] ?? '',
            'hero_description' => $data['events_hero_description'] ?? '',
            'hero_image' => $finalEventsHero,
            'upcoming_title' => $data['events_upcoming_title'] ?? 'Acara Mendatang',
            'empty_message' => $data['events_empty_message'] ?? '',
            'show_past' => (bool) ($data['events_show_past'] ?? true),
            'past_title' => $data['events_past_title'] ?? 'Arsip & Riwayat Acara Sebelumnya',
            'whatsapp_number' => $data['events_whatsapp_number'] ?? '',
            'cta_button_text' => $data['events_cta_button_text'] ?? 'Daftar via WhatsApp',
            'cta_note' => $data['events_cta_note'] ?? '',
            'gallery_title' => $data['events_gallery_title'] ?? 'Dokumentasi Acara & Workshop Alat Kopi Malang',
            'gallery_subtitle' => $data['events_gallery_subtitle'] ?? '',
            'grid_desktop' => (int) ($data['events_grid_desktop'] ?? 3),
            'grid_tablet' => (int) ($data['events_grid_tablet'] ?? 2),
            'grid_mobile' => (int) ($data['events_grid_mobile'] ?? 1),
            'image_aspect' => $data['events_image_aspect'] ?? 'aspect-4/3',
            'gallery_images' => $eventsGalleryImages,
        ];

        // 7. Process page_blog
        $heroBgImage = $data['blog_hero_bg_image'] ?? null;
        if (! empty($heroBgImage) && is_string($heroBgImage) && ! str_starts_with($heroBgImage, 'http') && ! str_starts_with($heroBgImage, '/')) {
            $heroBgImage = '/storage/' . $heroBgImage;
        }

        $blogFlipbookPages = [];
        if (! empty($data['blog_flipbook_pages']) && is_array($data['blog_flipbook_pages'])) {
            foreach ($data['blog_flipbook_pages'] as $item) {
                $imgUpload = $item['image'] ?? null;
                if (is_array($imgUpload)) {
                    $imgUpload = ! empty($imgUpload) ? array_values($imgUpload)[0] : null;
                }
                if (! empty($imgUpload) && is_string($imgUpload)) {
                    $finalImg = (str_starts_with($imgUpload, 'http') || str_starts_with($imgUpload, '/'))
                        ? $imgUpload
                        : '/storage/' . $imgUpload;
                } else {
                    $finalImg = $item['image_url'] ?? null;
                }

                if (! empty($finalImg) || ! empty($item['title']) || ! empty($item['caption'])) {
                    $blogFlipbookPages[] = [
                        'page_number' => $item['page_number'] ?? '',
                        'title' => $item['title'] ?? '',
                        'text_style' => $item['text_style'] ?? 'auto',
                        'image' => $finalImg,
                        'image_url' => $item['image_url'] ?? null,
                        'caption' => $item['caption'] ?? '',
                    ];
                }
            }
        }

        $pageBlog = [
            'hero_badge' => $data['blog_hero_badge'] ?? '',
            'hero_title' => $data['blog_hero_title'] ?? '',
            'hero_description' => $data['blog_hero_description'] ?? '',
            'posts_per_page' => (int) ($data['blog_posts_per_page'] ?? 9),
            'grid_columns' => (int) ($data['blog_grid_columns'] ?? 3),
            'image_aspect' => $data['blog_image_aspect'] ?? 'aspect-16/10',
            'hero_icon' => $data['blog_hero_icon'] ?? 'newspaper',
            'hero_bg_image' => $heroBgImage,
            'show_icons' => (bool) ($data['blog_show_icons'] ?? true),
            'show_read_time' => (bool) ($data['blog_show_read_time'] ?? true),
            'show_date' => (bool) ($data['blog_show_date'] ?? true),
            'show_author' => (bool) ($data['blog_show_author'] ?? true),
            'cta_text' => $data['blog_cta_text'] ?? 'Baca Artikel',
            'flipbook_enabled' => (bool) ($data['blog_flipbook_enabled'] ?? false),
            'flipbook_title' => $data['blog_flipbook_title'] ?? '',
            'flipbook_subtitle' => $data['blog_flipbook_subtitle'] ?? '',
            'flipbook_theme' => $data['blog_flipbook_theme'] ?? 'midnight',
            'flipbook_autoplay' => (bool) ($data['blog_flipbook_autoplay'] ?? false),
            'flipbook_pages' => $blogFlipbookPages,
        ];

        // 8. Process page_booking_tempat
        $bookingHeroUpload = $data['booking_hero_image'] ?? null;
        if (is_array($bookingHeroUpload)) {
            $bookingHeroUpload = ! empty($bookingHeroUpload) ? array_values($bookingHeroUpload)[0] : null;
        }
        if (! empty($bookingHeroUpload) && is_string($bookingHeroUpload)) {
            $finalBookingHero = (str_starts_with($bookingHeroUpload, 'http') || str_starts_with($bookingHeroUpload, '/'))
                ? $bookingHeroUpload
                : '/storage/' . $bookingHeroUpload;
        } else {
            $finalBookingHero = ! empty($data['booking_hero_image_url']) ? $data['booking_hero_image_url'] : null;
        }

        $bookingBenefits = [];
        if (! empty($data['booking_benefits']) && is_array($data['booking_benefits'])) {
            foreach ($data['booking_benefits'] as $b) {
                $bookingBenefits[] = [
                    'title' => $b['title'] ?? '',
                    'badge' => $b['badge'] ?? '',
                    'description' => $b['description'] ?? '',
                    'is_highlight' => (bool) ($b['is_highlight'] ?? false),
                ];
            }
        }

        $bookingFacilities = [];
        if (! empty($data['booking_facilities']) && is_array($data['booking_facilities'])) {
            foreach ($data['booking_facilities'] as $f) {
                $bookingFacilities[] = [
                    'icon' => $f['icon'] ?? 'zap',
                    'title' => $f['title'] ?? '',
                    'description' => $f['description'] ?? '',
                ];
            }
        }

        $bookingGalleryImages = [];
        if (! empty($data['booking_gallery_images']) && is_array($data['booking_gallery_images'])) {
            foreach ($data['booking_gallery_images'] as $imgItem) {
                $imgUpload = $imgItem['image_upload'] ?? null;
                if (is_array($imgUpload)) {
                    $imgUpload = ! empty($imgUpload) ? array_values($imgUpload)[0] : null;
                }
                if (! empty($imgUpload) && is_string($imgUpload)) {
                    $finalImg = (str_starts_with($imgUpload, 'http') || str_starts_with($imgUpload, '/'))
                        ? $imgUpload
                        : '/storage/' . $imgUpload;
                } else {
                    $finalImg = $imgItem['image_url'] ?? null;
                }

                if (! empty($finalImg)) {
                    $bookingGalleryImages[] = [
                        'image' => $finalImg,
                        'caption' => $imgItem['caption'] ?? '',
                    ];
                }
            }
        }

        $bookingEventTypes = [];
        if (! empty($data['booking_event_types']) && is_array($data['booking_event_types'])) {
            foreach ($data['booking_event_types'] as $e) {
                $name = is_array($e) ? ($e['name'] ?? '') : $e;
                if (! empty(trim((string) $name))) {
                    $bookingEventTypes[] = trim((string) $name);
                }
            }
        }

        $pageBooking = [
            'hero_badge' => $data['booking_hero_badge'] ?? 'Reservasi & Sewa Tempat di Alat Kopi Malang',
            'hero_title' => $data['booking_hero_title'] ?? 'Booking Tempat Nyaman untuk Acara & Komunitas di Alat Kopi Malang',
            'hero_description' => $data['booking_hero_description'] ?? '',
            'hero_image' => $finalBookingHero,
            'hero_image_url' => $data['booking_hero_image_url'] ?? null,
            'benefits' => $bookingBenefits,
            'facilities' => $bookingFacilities,
            'gallery_title' => $data['booking_gallery_title'] ?? 'Dokumentasi Suasana Ruangan & Acara',
            'gallery_subtitle' => $data['booking_gallery_subtitle'] ?? '',
            'grid_desktop' => (string) ($data['booking_grid_desktop'] ?? '3'),
            'grid_tablet' => (string) ($data['booking_grid_tablet'] ?? '2'),
            'grid_mobile' => (string) ($data['booking_grid_mobile'] ?? '1'),
            'image_aspect' => $data['booking_image_aspect'] ?? 'aspect-4/3',
            'gallery_images' => $bookingGalleryImages,
            'whatsapp_number' => $data['booking_whatsapp_number'] ?? '6285121930454',
            'minimum_spent_info' => $data['booking_minimum_spent_info'] ?? '',
            'form_title' => $data['booking_form_title'] ?? 'Konsultasi Jadwal & Reservasi Tempat',
            'form_subtitle' => $data['booking_form_subtitle'] ?? '',
            'event_types' => $bookingEventTypes,
            'address' => $data['booking_address'] ?? '',
            'hours' => $data['booking_hours'] ?? '',
            'maps_url' => $data['booking_maps_url'] ?? '',
        ];

        Setting::set('page_about', $pageAbout);
        Setting::set('page_wholesale', $pageWholesale);
        Setting::set('page_visit', $pageVisit);
        Setting::set('page_roasting', $pageRoasting);
        Setting::set('page_barista_training', $pageBarista);
        Setting::set('page_events', $pageEvents);
        Setting::set('page_blog', $pageBlog);
        Setting::set('page_booking_tempat', $pageBooking);

        // 9. Process page_coffee_catering
        $cateringHeroUpload = $data['catering_hero_image'] ?? null;
        if (is_array($cateringHeroUpload)) {
            $cateringHeroUpload = ! empty($cateringHeroUpload) ? array_values($cateringHeroUpload)[0] : null;
        }
        if (! empty($cateringHeroUpload) && is_string($cateringHeroUpload)) {
            $finalCateringHero = (str_starts_with($cateringHeroUpload, 'http') || str_starts_with($cateringHeroUpload, '/'))
                ? $cateringHeroUpload
                : '/storage/' . $cateringHeroUpload;
        } else {
            $finalCateringHero = ! empty($data['catering_hero_image_url']) ? $data['catering_hero_image_url'] : null;
        }

        $cateringBenefits = [];
        if (! empty($data['catering_benefits']) && is_array($data['catering_benefits'])) {
            foreach ($data['catering_benefits'] as $b) {
                $cateringBenefits[] = [
                    'title' => $b['title'] ?? '',
                    'badge' => $b['badge'] ?? '',
                    'description' => $b['description'] ?? '',
                    'is_highlight' => (bool) ($b['is_highlight'] ?? false),
                ];
            }
        }

        $cateringOccasions = [];
        if (! empty($data['catering_occasions']) && is_array($data['catering_occasions'])) {
            foreach ($data['catering_occasions'] as $occ) {
                $cateringOccasions[] = [
                    'name' => $occ['name'] ?? '',
                ];
            }
        }

        $cateringGalleryImages = [];
        if (! empty($data['catering_gallery_images']) && is_array($data['catering_gallery_images'])) {
            foreach ($data['catering_gallery_images'] as $imgItem) {
                $imgUpload = $imgItem['image_upload'] ?? null;
                if (is_array($imgUpload)) {
                    $imgUpload = ! empty($imgUpload) ? array_values($imgUpload)[0] : null;
                }
                if (! empty($imgUpload) && is_string($imgUpload)) {
                    $finalImg = (str_starts_with($imgUpload, 'http') || str_starts_with($imgUpload, '/'))
                        ? $imgUpload
                        : '/storage/' . $imgUpload;
                } else {
                    $finalImg = $imgItem['image_url'] ?? null;
                }

                if (! empty($finalImg)) {
                    $cateringGalleryImages[] = [
                        'image' => $finalImg,
                        'caption' => $imgItem['caption'] ?? '',
                    ];
                }
            }
        }

        $pageCatering = [
            'hero_badge' => $data['catering_hero_badge'] ?? 'Live Espresso Bar & Coffee Catering',
            'hero_title' => $data['catering_hero_title'] ?? 'Alat Kopi Malang Coffee Catering untuk Segala Momen Spesial Anda',
            'hero_description' => $data['catering_hero_description'] ?? '',
            'hero_image' => $finalCateringHero,
            'hero_image_url' => $data['catering_hero_image_url'] ?? null,
            'minimum_order_cups' => $data['catering_minimum_order_cups'] ?? '200',
            'benefits' => $cateringBenefits,
            'occasions' => $cateringOccasions,
            'gallery_title' => $data['catering_gallery_title'] ?? 'Dokumentasi Live Coffee Bar & Catering Acara',
            'gallery_subtitle' => $data['catering_gallery_subtitle'] ?? '',
            'grid_desktop' => (string) ($data['catering_grid_desktop'] ?? '3'),
            'grid_tablet' => (string) ($data['catering_grid_tablet'] ?? '2'),
            'grid_mobile' => (string) ($data['catering_grid_mobile'] ?? '1'),
            'image_aspect' => $data['catering_image_aspect'] ?? 'aspect-4/3',
            'gallery_images' => $cateringGalleryImages,
            'whatsapp_number' => $data['catering_whatsapp_number'] ?? '6285121930454',
            'form_title' => $data['catering_form_title'] ?? 'Konsultasi Jadwal & Pemesanan Coffee Catering',
            'form_subtitle' => $data['catering_form_subtitle'] ?? '',
            'terms_note' => $data['catering_terms_note'] ?? '',
            'address' => 'Ruko Tlogomas Square Kav. 34, Jl. Raya Tlogomas, Lowokwaru, Kota Malang, Jawa Timur 65144',
            'hours' => 'Setiap Hari: 09.00 – 23.00 WIB',
            'maps_url' => 'https://maps.app.goo.gl/PMuxaEtsbEvC4APy7',
        ];

        Setting::set('page_coffee_catering', $pageCatering);

        Cache::forget('sanubari_settings');

        Notification::make()
            ->title('Pengaturan Halaman Berhasil Disimpan!')
            ->body('Konten untuk halaman Tentang, Wholesale, Kunjungi, Jasa Roasting, Training Barista, Acara & Workshop, Blog, Booking Tempat, dan Coffee Catering telah diperbarui.')
            ->success()
            ->send();
    }

    protected function getFormActions(): array
    {
        return [
            Action::make('save')
                ->label('Simpan Semua Pengaturan Halaman')
                ->submit('save'),
        ];
    }
}

