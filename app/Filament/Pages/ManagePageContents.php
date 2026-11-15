<?php

namespace App\Filament\Pages;

use App\Models\Setting;
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

class ManagePageContents extends Page
{
    protected static string|BackedEnum|null $navigationIcon = Heroicon::DocumentText;

    protected static string|\UnitEnum|null $navigationGroup = 'Konten & Media';

    protected static ?string $navigationLabel = 'Kelola Isi Semua Halaman';

    protected static ?string $title = 'Pengaturan & Pengelola Isi Halaman Website';

    protected static ?int $navigationSort = 1;

    /**
     * @var array<string, mixed> | null
     */
    public ?array $data = [];

    public function mount(): void
    {
        $settings = Setting::all()->pluck('value', 'key')->toArray();

        $about = $settings['page_about'] ?? [];
        if (is_string($about)) {
            $about = json_decode($about, true) ?: [];
        }

        $visit = $settings['page_visit'] ?? [];
        if (is_string($visit)) {
            $visit = json_decode($visit, true) ?: [];
        }

        $preorder = $settings['page_preorder_terms'] ?? [];
        if (is_string($preorder)) {
            $preorder = json_decode($preorder, true) ?: [];
        }

        $customPages = $settings['custom_visit_pages'] ?? [];
        if (is_string($customPages)) {
            $customPages = json_decode($customPages, true) ?: [];
        }

        $this->form->fill([
            // --- 1. HALAMAN TENTANG KAMI (/tentang) ---
            'about_hero_badge' => $about['hero_badge'] ?? 'Tentang Alat Kopi Malang',
            'about_hero_title' => $about['hero_title'] ?? 'Mendekatkan Kopi Spesialti ke Setiap Seduhan',
            'about_hero_description' => $about['hero_description'] ?? 'Roastery kopi spesialti, distributor resmi mesin espresso, grinder, dan perlengkapan barista berbasis di Kota Malang.',
            'about_story_title' => $about['story_title'] ?? 'Kisah Perjalanan Kami',
            'about_story_subtitle' => $about['story_subtitle'] ?? 'Dari kecintaan menyeduh hingga menjadi rumah bagi para penikmat dan pelaku industri kopi di Indonesia.',
            'about_story_p1' => $about['story_p1'] ?? 'Alat Kopi Malang lahir dari antusiasme sederhana: menghadirkan alat seduh berkualitas tinggi, mesin espresso komersial terpercaya, dan kopi spesialti pilihan terbaik bagi para pecinta kopi, home brewer, dan pemilik kafe.',
            'about_story_p2' => $about['story_p2'] ?? 'Kami percaya bahwa setiap cangkir kopi yang luar biasa bermula dari peralatan yang presisi dan pemahaman mendalam tentang karakter biji kopi. Oleh karena itu, kami tidak hanya menjual produk, tetapi juga mendampingi perjalanan seduh Anda.',
            'about_story_image' => $about['story_image'] ?? null,
            'about_video_url' => $about['video_url'] ?? '',
            'about_video_title' => $about['video_title'] ?? 'Intip Suasana Roastery & Showroom Alat Kopi Malang',
            'about_video_subtitle' => $about['video_subtitle'] ?? 'Mulai dari proses pemilihan green beans spesialti, roasting profil presisi, hingga showroom peralatan espresso.',
            'about_values_title' => $about['values_title'] ?? 'Prinsip & Nilai Kami',
            'about_values_subtitle' => $about['values_subtitle'] ?? 'Fondasi dedikasi kami dalam menghadirkan pengalaman kopi terbaik untuk Anda.',
            'about_pillars' => $about['pillars'] ?? [
                [
                    'title' => 'Kualitas Teruji & Original',
                    'description' => 'Seluruh mesin espresso, grinder, dan aksesoris seduh dijamin 100% original bergaransi resmi dari prinsipal terkemuka dunia.',
                ],
                [
                    'title' => 'Fresh Roasted Beans',
                    'description' => 'Biji kopi sangrai kami dipanggang dalam batch terbatas dengan roast profile terkalibrasi untuk menjaga kesegaran rasa dan aroma terbaik.',
                ],
                [
                    'title' => 'Edukasi & Konsultasi Barista',
                    'description' => 'Tim kami siap memandu kalibrasi resep seduh, pemilihan mesin kafe, serta panduan perawatan mesin secara berkala.',
                ],
                [
                    'title' => 'Pengiriman Cepat & Terpercaya',
                    'description' => 'Didukung proteksi packing kayu, asuransi penuh, dan kurir instan kilat langsung dari Kota Malang ke seluruh Indonesia.',
                ],
            ],

            // --- 2. HALAMAN KUNJUNGI ROASTERY (/kunjungi) ---
            'visit_hero_badge' => $visit['hero_badge'] ?? 'Roastery & Showroom Malang',
            'visit_hero_title' => $visit['hero_title'] ?? 'Alat Kopi Malang',
            'visit_hero_description' => $visit['hero_description'] ?? 'Cicipi beans fresh roast langsung di slow bar kami, coba mesin espresso komersial, dan konsultasikan kebutuhan seduh Anda bersama roaster dan barista kami.',
            'visit_welcome_title' => $visit['welcome_title'] ?? 'Selamat Datang di Roastery & Showroom Malang',
            'visit_address' => $visit['address'] ?? ($settings['address'] ?? 'Ruko Tlogomas Square Kav. 34, Jl. Raya Tlogomas, Lowokwaru, Kota Malang, Jawa Timur 65144'),
            'visit_hours' => $visit['hours'] ?? 'Buka Setiap Hari: 09.00 – 23.00 WIB (Layanan Seduh di Tempat & Pembelian Beans)',
            'visit_phone' => $visit['phone'] ?? ($settings['whatsapp'] ?? '082132095241'),
            'visit_maps_url' => $visit['maps_url'] ?? ($settings['maps_url'] ?? 'https://maps.app.goo.gl/Hua4AUHyaHLuY9uz7'),
            'visit_main_image' => $visit['main_image'] ?? null,
            'visit_facilities' => $visit['facilities'] ?? [
                [
                    'title' => 'Slow Bar & Manual Brew',
                    'description' => 'Cicipi kalibrasi seduhan manual filter V60, Aeropress, atau espresso dari biji kopi sangrai minggu ini.',
                ],
                [
                    'title' => 'Showroom Mesin & Grinder',
                    'description' => 'Coba langsung berbagai grinder profesional, mesin espresso komersial, kettle leher angsa, dripper, dan timbangan digital.',
                ],
                [
                    'title' => 'Konsultasi Kafe & Restoran',
                    'description' => 'Diskusikan kebutuhan peralatan, pasokan biji kopi komersial/wholesale, dan kalibrasi menu kopi bersama tim roaster kami.',
                ],
            ],
            'visit_gallery_title' => $visit['gallery_title'] ?? 'Galeri Suasana Roastery & Showroom',
            'visit_gallery_subtitle' => $visit['gallery_subtitle'] ?? 'Dokumentasi ruang seduh, mesin espresso komersial, dan kehangatan slow bar kami di Malang.',
            'visit_grid_desktop' => $visit['grid_desktop'] ?? '3',
            'visit_grid_tablet' => $visit['grid_tablet'] ?? '2',
            'visit_grid_mobile' => $visit['grid_mobile'] ?? '1',
            'visit_gallery_images' => $visit['gallery_images'] ?? [],

            // --- 3. HALAMAN BERANDA & PENGUMUMAN GLOBAL ---
            'home_site_name' => $settings['site_name'] ?? 'Alat Kopi Malang',
            'home_tagline' => $settings['site_tagline'] ?? 'Specialty Coffee Roaster Malang · Close to Every Brew',
            'home_announcement_enabled' => (bool) ($settings['announcement_enabled'] ?? true),
            'home_announcement_text' => $settings['announcement_text'] ?? 'Gratis ongkir ke seluruh Jawa untuk pesanan di atas Rp 250.000 · Roasting segar setiap minggu di Kota Malang',
            'home_announcement_link' => $settings['announcement_link'] ?? '/shop',
            'home_promo_banner_enabled' => (bool) ($settings['home_promo_banner_enabled'] ?? true),
            'home_promo_banner_position' => $settings['home_promo_banner_position'] ?? 'both',
            'home_promo_banner_image' => $settings['home_promo_banner_image'] ?? 'banners/banner-event-komunitas.jpg',
            'home_promo_banner_link' => $settings['home_promo_banner_link'] ?? 'https://wa.me/6282132095241?text=Halo%20Alat%20Kopi%20Malang,%20saya%20ingin%20booking%20tempat%20untuk%20event%20komunitas%20/%20gathering',
            'home_promo_banner_alt' => $settings['home_promo_banner_alt'] ?? 'Book Now! Place For Your Event Komunitas & Gathering — Alat Kopi Malang',
            'home_partners_enabled' => (bool) ($settings['home_partners_enabled'] ?? true),
            'home_partners_title' => $settings['home_partners_title'] ?? 'Mitra dan Client Langganan AKM',
            'home_partners_subtitle' => $settings['home_partners_subtitle'] ?? 'Deretan Coffee Shop ternama yang mempercayakan perlengkapan mereka kepada kami.',
            'home_partners_slides' => $settings['home_partners_slides'] ?? [
                [
                    'id' => 'gartenhaus',
                    'title' => 'Gartenhaus Malang',
                    'city' => 'MALANG',
                    'image' => 'https://images.unsplash.com/photo-1497636577773-f1231844b336?auto=format&fit=crop&w=800&q=80',
                    'href' => 'https://www.instagram.com/gartenhaus_co/',
                    'open_in_new_tab' => true,
                ],
                [
                    'id' => 'sanubari-roastery',
                    'title' => 'Sanubari Roastery',
                    'city' => 'MALANG',
                    'image' => 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=800&q=80',
                    'href' => 'https://maps.app.goo.gl/Hua4AUHyaHLuY9uz7',
                    'open_in_new_tab' => true,
                ],
                [
                    'id' => 'bataputih',
                    'title' => 'Bataputih Coffee',
                    'city' => 'MALANG',
                    'image' => 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
                    'href' => 'https://www.instagram.com/bataputihkopi/',
                    'open_in_new_tab' => true,
                ],
                [
                    'id' => 'lafayette',
                    'title' => 'Lafayette Coffee & Eatery',
                    'city' => 'MALANG',
                    'image' => 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
                    'href' => 'https://www.instagram.com/lafayettecoffee/',
                    'open_in_new_tab' => true,
                ],
                [
                    'id' => 'coffee-heritage',
                    'title' => 'Coffee Heritage',
                    'city' => 'MALANG',
                    'image' => 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=800&q=80',
                    'href' => 'https://www.instagram.com/coffeeheritagemlg/',
                    'open_in_new_tab' => true,
                ],
                [
                    'id' => 'fee-space',
                    'title' => 'Oura Coffee & Space',
                    'city' => 'MALANG',
                    'image' => 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
                    'href' => 'https://www.instagram.com/ouraspace/',
                    'open_in_new_tab' => true,
                ],
                [
                    'id' => 'dialoog',
                    'title' => 'Dialoog Coffee',
                    'city' => 'MALANG',
                    'image' => 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
                    'href' => 'https://www.instagram.com/dialoog.coffee/',
                    'open_in_new_tab' => true,
                ],
            ],

            // --- 4. HALAMAN SYARAT & KETENTUAN PRE-ORDER (/syarat-ketentuan-pre-order) ---
            'preorder_hero_badge' => $preorder['hero_badge'] ?? 'Kebijakan & Informasi Resmi',
            'preorder_hero_title' => $preorder['hero_title'] ?? 'Syarat & Ketentuan Pre-Order',
            'preorder_hero_subtitle' => $preorder['hero_subtitle'] ?? 'Panduan lengkap mengenai mekanisme pemesanan, estimasi waktu kedatangan, pembayaran, serta jaminan garansi resmi untuk produk berstatus Pre-Order di Alat Kopi Malang.',
            'preorder_intro_text' => $preorder['intro_text'] ?? 'Produk dengan label Pre-Order merupakan unit peralatan kopi, mesin espresso komersial, grinder, atau suku cadang khusus yang dipesan secara khusus (indent) dari distributor resmi maupun prinsipal brand terkait untuk menjamin keaslian dan kondisi unit terbaru.',
            'preorder_sections' => $preorder['sections'] ?? [
                [
                    'title' => '1. Mekanisme & Konfirmasi Pemesanan',
                    'content' => "• Setiap pesanan produk berstatus Pre-Order akan dikonfirmasi langsung oleh tim Alat Kopi Malang melalui WhatsApp atau kontak resmi yang terdaftar saat checkout.\n• Spesifikasi unit (warna, tegangan listrik, tipe burr, atau varian ukuran) akan diverifikasi kembali bersama pembeli sebelum pesanan diproses ke distributor resmi.\n• Kuota Pre-Order bersifat terbatas mengikuti ketersediaan batch pengiriman berjalan.",
                ],
                [
                    'title' => '2. Ketentuan Pembayaran & Down Payment (DP)',
                    'content' => "• Untuk produk Pre-Order kategori aksesoris dan alat seduh manual, pembayaran dilakukan secara penuh (100%) saat pemesanan.\n• Untuk mesin espresso komersial dan grinder skala kafe, pembeli dapat melakukan pembayaran penuh atau Down Payment (DP) minimal sesuai kesepakatan tertulis melalui invoice resmi Alat Kopi Malang.\n• Pelunasan sisa pembayaran dilakukan setelah unit tiba di gudang/showroom Alat Kopi Malang dan siap dikirimkan ke alamat pembeli.",
                ],
                [
                    'title' => '3. Estimasi Waktu Kedatangan & Pengiriman',
                    'content' => "• Estimasi waktu tunggu (lead time) produk Pre-Order berkisar antara 7 hingga 30 hari kerja tergantung ketersediaan stok pada prinsipal brand dan jalur logistik/kepabeanan.\n• Tim Alat Kopi Malang akan memberikan pembaruan status pesanan secara berkala hingga unit tiba di Malang.\n• Sebelum dikirim ke alamat tujuan, setiap unit mesin dan peralatan elektronik akan melalui tahap Quality Control (QC) dan uji fungsi oleh teknisi kami.",
                ],
            ],
            'preorder_faq' => $preorder['faq'] ?? [
                [
                    'question' => 'Apakah pembayaran DP dapat dibatalkan sewaktu-waktu?',
                    'answer' => 'Pesanan Pre-Order yang telah dikonfirmasi dan diproses ke pihak distributor resmi tidak dapat dibatalkan secara sepihak, kecuali terjadi kegagalan pasokan permanen dari pihak distributor.',
                ],
                [
                    'question' => 'Apakah produk Pre-Order tetap mendapatkan garansi resmi?',
                    'answer' => 'Ya, seluruh produk Pre-Order mesin espresso, grinder, dan peralatan seduh bergaransi resmi dari distributor/prinsipal brand bersangkutan.',
                ],
            ],

            // --- 5. HALAMAN KUSTOM TAMBAHAN (/halaman/{slug}) ---
            'custom_pages' => $customPages,
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
                        // TAB 1: TENTANG KAMI
                        Tab::make('Halaman Tentang Kami (/tentang)')
                            ->icon(Heroicon::InformationCircle)
                            ->schema([
                                Section::make('Header & Hero Halaman Tentang Kami')
                                    ->description('Judul, badge, dan pengantar di bagian atas halaman /tentang.')
                                    ->schema([
                                        TextInput::make('about_hero_badge')
                                            ->label('Badge Atas')
                                            ->placeholder('Tentang Alat Kopi Malang'),
                                        TextInput::make('about_hero_title')
                                            ->label('Judul Utama Hero')
                                            ->placeholder('Mendekatkan Kopi Spesialti ke Setiap Seduhan')
                                            ->required(),
                                        Textarea::make('about_hero_description')
                                            ->label('Deskripsi Pengantar Hero')
                                            ->rows(3)
                                            ->placeholder('Roastery kopi spesialti, distributor resmi mesin espresso...'),
                                    ]),

                                Section::make('Kisah Perjalanan & Filosofi Roastery')
                                    ->description('Cerita asal mula, misi, dan foto dokumentasi roastery.')
                                    ->schema([
                                        Grid::make(2)->schema([
                                            TextInput::make('about_story_title')
                                                ->label('Judul Kisah')
                                                ->placeholder('Kisah Perjalanan Kami'),
                                            TextInput::make('about_story_subtitle')
                                                ->label('Subjudul Kisah')
                                                ->placeholder('Dari kecintaan menyeduh hingga...'),
                                        ]),
                                        Textarea::make('about_story_p1')
                                            ->label('Paragraf Cerita Bagian 1')
                                            ->rows(3),
                                        Textarea::make('about_story_p2')
                                            ->label('Paragraf Cerita Bagian 2')
                                            ->rows(3),
                                        FileUpload::make('about_story_image')
                                            ->label('Foto Kisah / Suasana Roastery')
                                            ->image()
                                            ->disk('public')
                                            ->visibility('public')
                                            ->directory('pages')
                                            ->helperText('Format JPG/PNG/WebP resolusi baik.'),
                                    ]),

                                Section::make('Video Profil Roastery (Opsional)')
                                    ->description('Tautkan video YouTube profil atau proses sangrai Alat Kopi Malang.')
                                    ->schema([
                                        TextInput::make('about_video_url')
                                            ->label('Tautan Video (YouTube / Vimeo)')
                                            ->placeholder('Contoh: https://www.youtube.com/watch?v=...'),
                                        Grid::make(2)->schema([
                                            TextInput::make('about_video_title')
                                                ->label('Judul Video')
                                                ->placeholder('Intip Suasana Roastery Alat Kopi Malang'),
                                            TextInput::make('about_video_subtitle')
                                                ->label('Subjudul Video')
                                                ->placeholder('Mulai dari proses pemilihan green beans...'),
                                        ]),
                                    ]),

                                Section::make('Prinsip & Nilai-Nilai Utama (Pillars)')
                                    ->description('Pilar komitmen mutu kopi, garansi produk, dan pendampingan barista.')
                                    ->schema([
                                        Grid::make(2)->schema([
                                            TextInput::make('about_values_title')
                                                ->label('Judul Seksi Nilai')
                                                ->placeholder('Prinsip & Nilai Kami'),
                                            TextInput::make('about_values_subtitle')
                                                ->label('Subjudul Seksi Nilai')
                                                ->placeholder('Fondasi dedikasi kami...'),
                                        ]),
                                        Repeater::make('about_pillars')
                                            ->label('Daftar Nilai / Keunggulan Toko')
                                            ->schema([
                                                TextInput::make('title')
                                                    ->label('Judul Pilar')
                                                    ->placeholder('Kualitas Teruji & Original')
                                                    ->required(),
                                                Textarea::make('description')
                                                    ->label('Uraian Nilai')
                                                    ->rows(2)
                                                    ->placeholder('Seluruh mesin espresso dan grinder bergaransi resmi...')
                                                    ->required(),
                                            ])
                                            ->columns(1)
                                            ->collapsible()
                                            ->itemLabel(fn (array $state): ?string => $state['title'] ?? 'Nilai Toko'),
                                    ]),
                            ]),

                        // TAB 2: KUNJUNGI ROASTERY
                        Tab::make('Halaman Kunjungi Roastery (/kunjungi)')
                            ->icon(Heroicon::BuildingStorefront)
                            ->schema([
                                Section::make('Header & Sambutan Halaman Kunjungi')
                                    ->schema([
                                        Grid::make(2)->schema([
                                            TextInput::make('visit_hero_badge')
                                                ->label('Badge Atas')
                                                ->placeholder('Roastery & Showroom Malang'),
                                            TextInput::make('visit_hero_title')
                                                ->label('Judul Hero')
                                                ->placeholder('Alat Kopi Malang'),
                                        ]),
                                        Textarea::make('visit_hero_description')
                                            ->label('Deskripsi Hero')
                                            ->rows(2),
                                        TextInput::make('visit_welcome_title')
                                            ->label('Judul Sambutan')
                                            ->placeholder('Selamat Datang di Roastery & Showroom Malang'),
                                    ]),

                                Section::make('Alamat, Kontak & Jam Operasional Gerai')
                                    ->schema([
                                        Textarea::make('visit_address')
                                            ->label('Alamat Lengkap Gerai / Showroom')
                                            ->rows(2)
                                            ->required(),
                                        Grid::make(3)->schema([
                                            TextInput::make('visit_hours')
                                                ->label('Jam Buka & Operasional')
                                                ->placeholder('Buka Setiap Hari: 09.00 – 23.00 WIB')
                                                ->required(),
                                            TextInput::make('visit_phone')
                                                ->label('No. WhatsApp / Telepon Gerai')
                                                ->placeholder('082132095241')
                                                ->required(),
                                            TextInput::make('visit_maps_url')
                                                ->label('Link Google Maps Gerai')
                                                ->placeholder('https://maps.app.goo.gl/...'),
                                        ]),
                                        FileUpload::make('visit_main_image')
                                            ->label('Foto Utama Gerai / Showroom')
                                            ->image()
                                            ->disk('public')
                                            ->visibility('public')
                                            ->directory('pages'),
                                    ]),

                                Section::make('Fasilitas Roastery & Showroom')
                                    ->schema([
                                        Repeater::make('visit_facilities')
                                            ->label('Daftar Fasilitas')
                                            ->schema([
                                                TextInput::make('title')
                                                    ->label('Nama Fasilitas')
                                                    ->placeholder('Slow Bar & Cupping')
                                                    ->required(),
                                                Textarea::make('description')
                                                    ->label('Keterangan Fasilitas')
                                                    ->rows(2)
                                                    ->placeholder('Cicipi kalibrasi seduhan manual...')
                                                    ->required(),
                                            ])
                                            ->columns(1)
                                            ->collapsible()
                                            ->itemLabel(fn (array $state): ?string => $state['title'] ?? 'Fasilitas'),
                                    ]),

                                Section::make('Galeri Dokumentasi & Suasana Showroom')
                                    ->schema([
                                        Grid::make(2)->schema([
                                            TextInput::make('visit_gallery_title')
                                                ->label('Judul Galeri')
                                                ->placeholder('Galeri Suasana Roastery & Showroom'),
                                            TextInput::make('visit_gallery_subtitle')
                                                ->label('Subjudul Galeri')
                                                ->placeholder('Dokumentasi ruang seduh, mesin espresso...'),
                                        ]),
                                        Grid::make(3)->schema([
                                            Select::make('visit_grid_desktop')
                                                ->label('Kolom Desktop')
                                                ->options(['2' => '2 Kolom', '3' => '3 Kolom', '4' => '4 Kolom'])
                                                ->default('3'),
                                            Select::make('visit_grid_tablet')
                                                ->label('Kolom Tablet')
                                                ->options(['2' => '2 Kolom', '3' => '3 Kolom'])
                                                ->default('2'),
                                            Select::make('visit_grid_mobile')
                                                ->label('Kolom Mobile')
                                                ->options(['1' => '1 Kolom', '2' => '2 Kolom'])
                                                ->default('1'),
                                        ]),
                                        Repeater::make('visit_gallery_images')
                                            ->label('Foto-Foto Galeri')
                                            ->schema([
                                                FileUpload::make('image')
                                                    ->label('Foto')
                                                    ->image()
                                                    ->disk('public')
                                                    ->visibility('public')
                                                    ->directory('pages')
                                                    ->required(),
                                                TextInput::make('caption')
                                                    ->label('Keterangan Singkat Foto')
                                                    ->placeholder('Slow Bar Espresso Machine'),
                                            ])
                                            ->columns(2)
                                            ->collapsible(),
                                    ]),
                            ]),

                        // TAB 3: BERANDA & PENGUMUMAN
                        Tab::make('Halaman Beranda & Banner (/)')
                            ->icon(Heroicon::Home)
                            ->schema([
                                Section::make('Identitas Toko & Running Banner Pengumuman')
                                    ->description('Informasi judul, slogan, dan pengumuman promo gratis ongkir yang tampil di bagian atas beranda.')
                                    ->schema([
                                        Grid::make(2)->schema([
                                            TextInput::make('home_site_name')
                                                ->label('Nama Toko')
                                                ->placeholder('Alat Kopi Malang'),
                                            TextInput::make('home_tagline')
                                                ->label('Tagline / Slogan Toko')
                                                ->placeholder('Specialty Coffee Roaster Malang · Close to Every Brew'),
                                        ]),
                                        Toggle::make('home_announcement_enabled')
                                            ->label('Aktifkan Banner Pengumuman / Promo Beranda')
                                            ->default(true),
                                        Grid::make(2)->schema([
                                            TextInput::make('home_announcement_text')
                                                ->label('Teks Pengumuman')
                                                ->placeholder('Gratis ongkir ke seluruh Jawa untuk pesanan di atas Rp 250.000...'),
                                            TextInput::make('home_announcement_link')
                                                ->label('Tautan Tujuan Pengumuman')
                                                ->placeholder('/shop'),
                                        ]),
                                    ]),

                                Section::make('Banner Gambar Promo / Event (Beranda)')
                                    ->description('Banner visual memanjang yang tampil pada halaman depan (dapat diletakkan di bawah Brand Pilihan atau di bawah Kategori Pilihan).')
                                    ->schema([
                                        Grid::make(2)->schema([
                                            Toggle::make('home_promo_banner_enabled')
                                                ->label('Tampilkan Banner Gambar Promo di Beranda')
                                                ->default(true),
                                            Select::make('home_promo_banner_position')
                                                ->label('Posisi Penempatan Banner')
                                                ->options([
                                                    'both' => 'Tampilkan di Kedua Posisi (Bawah Kategori & Bawah Brand - Default)',
                                                    'below_brands' => 'Hanya di Bawah Brand Pilihan',
                                                    'below_categories' => 'Hanya di Bawah Kategori Pilihan',
                                                ])
                                                ->default('both')
                                                ->required(),
                                        ]),
                                        FileUpload::make('home_promo_banner_image')
                                            ->label('Gambar Banner Promo')
                                            ->helperText('Unggah gambar banner promo. Format yang disarankan: Landscape (Rasio ~2.5:1 atau 3:1).')
                                            ->image()
                                            ->disk('public')
                                            ->visibility('public')
                                            ->directory('banners'),
                                        Grid::make(2)->schema([
                                            TextInput::make('home_promo_banner_link')
                                                ->label('Tautan Tujuan Ketika Banner Diklik')
                                                ->placeholder('https://wa.me/... atau /kunjungi')
                                                ->helperText('Bisa berupa link eksternal (WhatsApp, Maps) atau link internal website.'),
                                            TextInput::make('home_promo_banner_alt')
                                                ->label('Teks Keterangan Gambar (Alt Text)')
                                                ->placeholder('Book Now! Place For Your Event Komunitas & Gathering'),
                                        ]),
                                    ]),

                                Section::make('Mitra & Client Langganan AKM (Coverflow Slider - Posisi Paling Bawah)')
                                    ->description('Bagian slider 3D interaktif yang menampilkan deretan coffee shop & mitra yang mempercayakan perlengkapan kepada AKM.')
                                    ->schema([
                                        Toggle::make('home_partners_enabled')
                                            ->label('Tampilkan Mitra dan Client Langganan di Beranda')
                                            ->default(true),
                                        Grid::make(2)->schema([
                                            TextInput::make('home_partners_title')
                                                ->label('Judul Bagian')
                                                ->placeholder('Mitra dan Client Langganan AKM')
                                                ->default('Mitra dan Client Langganan AKM')
                                                ->required(),
                                            TextInput::make('home_partners_subtitle')
                                                ->label('Subjudul Bagian')
                                                ->placeholder('Deretan Coffee Shop ternama yang mempercayakan perlengkapan mereka kepada kami.')
                                                ->default('Deretan Coffee Shop ternama yang mempercayakan perlengkapan mereka kepada kami.')
                                                ->required(),
                                        ]),
                                        Repeater::make('home_partners_slides')
                                            ->label('Daftar Kedai / Mitra Coffee Shop')
                                            ->schema([
                                                Grid::make(2)->schema([
                                                    TextInput::make('title')
                                                        ->label('Nama Coffee Shop / Mitra')
                                                        ->placeholder('Contoh: Lafayette Coffee & Eatery')
                                                        ->required(),
                                                    TextInput::make('city')
                                                        ->label('Kota / Wilayah')
                                                        ->placeholder('MALANG')
                                                        ->default('MALANG')
                                                        ->required(),
                                                ]),
                                                Grid::make(2)->schema([
                                                    TextInput::make('image')
                                                        ->label('URL Foto Kedai')
                                                        ->placeholder('https://... atau /storage/partners/...')
                                                        ->helperText('Masukkan URL gambar langsung atau unggah foto di bawah.'),
                                                    FileUpload::make('image_upload')
                                                        ->label('Atau Unggah Foto Baru')
                                                        ->disk('public')
                                                        ->directory('partners')
                                                        ->image()
                                                        ->visibility('public')
                                                        ->helperText('Format JPG/PNG/WEBP.')
                                                        ->dehydrateStateUsing(fn ($state) => $state ? (is_array($state) ? array_values($state)[0] : $state) : null),
                                                ]),
                                                Grid::make(3)->schema([
                                                    TextInput::make('href')
                                                        ->label('Link URL Ketika Diklik (Opsional)')
                                                        ->placeholder('https://instagram.com/... atau https://maps.app.goo.gl/...')
                                                        ->columnSpan(2),
                                                    Toggle::make('open_in_new_tab')
                                                        ->label('Buka Tab Baru')
                                                        ->default(true)
                                                        ->inline(false)
                                                        ->columnSpan(1),
                                                ]),
                                            ])
                                            ->collapsible()
                                            ->collapsed(false)
                                            ->cloneable()
                                            ->reorderable()
                                            ->addActionLabel('+ Tambah Mitra / Coffee Shop')
                                            ->columnSpanFull(),
                                    ]),

                                Section::make('Pintasan Pengaturan Bagian Beranda Lainnya')
                                    ->description('Kelola komponen visual interaktif lainnya yang ada pada halaman depan:')
                                    ->schema([
                                        Actions::make([
                                            Action::make('manageHeroSlider')
                                                ->label('Kelola Hero Slider Banner (Halaman Awal)')
                                                ->url(url('/admin/manage-hero-slider'))
                                                ->icon(Heroicon::ArrowTopRightOnSquare)
                                                ->color('primary'),
                                            Action::make('manageCategoryMenu')
                                                ->label('Kelola Menu Kategori Populer')
                                                ->url(url('/admin/manage-category-menu'))
                                                ->icon(Heroicon::ArrowTopRightOnSquare)
                                                ->color('gray'),
                                            Action::make('manageVideoStats')
                                                ->label('Kelola Video Highlights & Statistik Roastery')
                                                ->url(url('/admin/manage-video-stats'))
                                                ->icon(Heroicon::ArrowTopRightOnSquare)
                                                ->color('gray'),
                                            Action::make('manageBrands')
                                                ->label('Kelola Daftar Brand Pilihan')
                                                ->url(url('/admin/brands'))
                                                ->icon(Heroicon::ArrowTopRightOnSquare)
                                                ->color('gray'),
                                        ]),
                                    ]),
                            ]),

                        // TAB 4: SYARAT & KETENTUAN PRE-ORDER
                        Tab::make('Halaman Syarat Pre-Order (/pre-order)')
                            ->icon(Heroicon::DocumentCheck)
                            ->schema([
                                Section::make('Header Syarat & Ketentuan Pre-Order')
                                    ->schema([
                                        Grid::make(2)->schema([
                                            TextInput::make('preorder_hero_badge')
                                                ->label('Badge Atas')
                                                ->placeholder('Kebijakan & Informasi Resmi'),
                                            TextInput::make('preorder_hero_title')
                                                ->label('Judul Utama')
                                                ->placeholder('Syarat & Ketentuan Pre-Order'),
                                        ]),
                                        Textarea::make('preorder_hero_subtitle')
                                            ->label('Subjudul Pengantar')
                                            ->rows(2),
                                        Textarea::make('preorder_intro_text')
                                            ->label('Paragraf Penjelasan Singkat Pre-Order')
                                            ->rows(3),
                                    ]),

                                Section::make('Poin-Poin Kebijakan & Ketentuan Pre-Order')
                                    ->schema([
                                        Repeater::make('preorder_sections')
                                            ->label('Daftar Pasal / Kebijakan')
                                            ->schema([
                                                TextInput::make('title')
                                                    ->label('Judul Kebijakan')
                                                    ->placeholder('1. Mekanisme & Konfirmasi Pemesanan')
                                                    ->required(),
                                                Textarea::make('content')
                                                    ->label('Isi Kebijakan')
                                                    ->rows(4)
                                                    ->placeholder('Gunakan bullet poin untuk rincian...')
                                                    ->required(),
                                            ])
                                            ->columns(1)
                                            ->collapsible()
                                            ->itemLabel(fn (array $state): ?string => $state['title'] ?? 'Pasal Ketentuan'),
                                    ]),

                                Section::make('Pertanyaan yang Sering Diajukan (FAQ)')
                                    ->schema([
                                        Repeater::make('preorder_faq')
                                            ->label('Daftar FAQ')
                                            ->schema([
                                                TextInput::make('question')
                                                    ->label('Pertanyaan')
                                                    ->placeholder('Apakah pembayaran DP dapat dibatalkan?')
                                                    ->required(),
                                                Textarea::make('answer')
                                                    ->label('Jawaban')
                                                    ->rows(3)
                                                    ->placeholder('Tuliskan jawaban resmi...')
                                                    ->required(),
                                            ])
                                            ->columns(1)
                                            ->collapsible()
                                            ->itemLabel(fn (array $state): ?string => $state['question'] ?? 'FAQ'),
                                    ]),
                            ]),

                        // TAB 5: HALAMAN KUSTOM TAMBAHAN
                        Tab::make('Halaman Kustom Tambahan (/halaman/{slug})')
                            ->icon(Heroicon::DocumentPlus)
                            ->schema([
                                Section::make('Kelola Halaman Kustom Tambahan')
                                    ->description('Buat halaman informasi baru seperti Kebijakan Privasi, Garansi Mesin, Panduan Perawatan, dll. Halaman dapat diakses di URL: /halaman/{slug} atau /{slug}.')
                                    ->schema([
                                        Repeater::make('custom_pages')
                                            ->label('Daftar Halaman Kustom')
                                            ->schema([
                                                Grid::make(3)->schema([
                                                    TextInput::make('title')
                                                        ->label('Nama Halaman')
                                                        ->placeholder('Kebijakan Privasi')
                                                        ->required(),
                                                    TextInput::make('slug')
                                                        ->label('Slug URL (Unik)')
                                                        ->placeholder('kebijakan-privasi')
                                                        ->helperText('Akses di: /halaman/slug atau /slug')
                                                        ->required(),
                                                    Toggle::make('is_active')
                                                        ->label('Status Aktif')
                                                        ->default(true),
                                                ]),
                                                Grid::make(2)->schema([
                                                    TextInput::make('hero_badge')
                                                        ->label('Badge Header')
                                                        ->placeholder('Informasi Resmi'),
                                                    TextInput::make('hero_title')
                                                        ->label('Judul Hero Halaman')
                                                        ->placeholder('Kebijakan Privasi Alat Kopi Malang'),
                                                ]),
                                                Textarea::make('hero_description')
                                                    ->label('Deskripsi / Ringkasan Header')
                                                    ->rows(2),
                                                Textarea::make('welcome_title')
                                                    ->label('Konten Utama / Uraian Lengkap')
                                                    ->rows(6)
                                                    ->placeholder('Tuliskan isi lengkap halaman di sini...'),
                                                FileUpload::make('main_image')
                                                    ->label('Foto / Banner Halaman (Opsional)')
                                                    ->image()
                                                    ->disk('public')
                                                    ->visibility('public')
                                                    ->directory('pages'),
                                            ])
                                            ->columns(1)
                                            ->collapsible()
                                            ->itemLabel(fn (array $state): ?string => ($state['title'] ?? 'Halaman Kustom') . ' (/' . ($state['slug'] ?? 'slug') . ')'),
                                    ]),
                            ]),
                    ]),
            ]);
    }

    public function save(): void
    {
        $data = $this->form->getState();

        // 1. Simpan page_about
        $pageAbout = [
            'hero_badge' => $data['about_hero_badge'] ?? null,
            'hero_title' => $data['about_hero_title'] ?? null,
            'hero_description' => $data['about_hero_description'] ?? null,
            'story_title' => $data['about_story_title'] ?? null,
            'story_subtitle' => $data['about_story_subtitle'] ?? null,
            'story_p1' => $data['about_story_p1'] ?? null,
            'story_p2' => $data['about_story_p2'] ?? null,
            'story_image' => $data['about_story_image'] ?? null,
            'video_url' => $data['about_video_url'] ?? null,
            'video_title' => $data['about_video_title'] ?? null,
            'video_subtitle' => $data['about_video_subtitle'] ?? null,
            'values_title' => $data['about_values_title'] ?? null,
            'values_subtitle' => $data['about_values_subtitle'] ?? null,
            'pillars' => $data['about_pillars'] ?? [],
        ];
        Setting::set('page_about', $pageAbout);

        // 2. Simpan page_visit
        $pageVisit = [
            'hero_badge' => $data['visit_hero_badge'] ?? null,
            'hero_title' => $data['visit_hero_title'] ?? null,
            'hero_description' => $data['visit_hero_description'] ?? null,
            'welcome_title' => $data['visit_welcome_title'] ?? null,
            'address' => $data['visit_address'] ?? null,
            'hours' => $data['visit_hours'] ?? null,
            'phone' => $data['visit_phone'] ?? null,
            'maps_url' => $data['visit_maps_url'] ?? null,
            'main_image' => $data['visit_main_image'] ?? null,
            'facilities' => $data['visit_facilities'] ?? [],
            'gallery_title' => $data['visit_gallery_title'] ?? null,
            'gallery_subtitle' => $data['visit_gallery_subtitle'] ?? null,
            'grid_desktop' => $data['visit_grid_desktop'] ?? '3',
            'grid_tablet' => $data['visit_grid_tablet'] ?? '2',
            'grid_mobile' => $data['visit_grid_mobile'] ?? '1',
            'gallery_images' => $data['visit_gallery_images'] ?? [],
        ];
        Setting::set('page_visit', $pageVisit);

        // 3. Simpan page_preorder_terms
        $pagePreorder = [
            'hero_badge' => $data['preorder_hero_badge'] ?? null,
            'hero_title' => $data['preorder_hero_title'] ?? null,
            'hero_subtitle' => $data['preorder_hero_subtitle'] ?? null,
            'intro_text' => $data['preorder_intro_text'] ?? null,
            'sections' => $data['preorder_sections'] ?? [],
            'faq' => $data['preorder_faq'] ?? [],
        ];
        Setting::set('page_preorder_terms', $pagePreorder);

        // 4. Simpan custom_visit_pages
        if (isset($data['custom_pages'])) {
            Setting::set('custom_visit_pages', $data['custom_pages']);
        }

        // 5. Simpan pengaturan beranda
        if (isset($data['home_site_name'])) {
            Setting::set('site_name', $data['home_site_name']);
        }
        if (isset($data['home_tagline'])) {
            Setting::set('site_tagline', $data['home_tagline']);
        }
        if (isset($data['home_announcement_text'])) {
            Setting::set('announcement_text', $data['home_announcement_text']);
            Setting::set('announcement_link', $data['home_announcement_link'] ?? '/shop');
            Setting::set('announcement_enabled', (bool) ($data['home_announcement_enabled'] ?? true));
        }
        if (isset($data['home_promo_banner_enabled'])) {
            Setting::set('home_promo_banner_enabled', (bool) $data['home_promo_banner_enabled']);
        }
        if (isset($data['home_promo_banner_position'])) {
            Setting::set('home_promo_banner_position', $data['home_promo_banner_position']);
        }
        if (array_key_exists('home_promo_banner_image', $data)) {
            $bannerImg = $data['home_promo_banner_image'];
            if (is_array($bannerImg)) {
                $bannerImg = reset($bannerImg) ?: null;
            }
            Setting::set('home_promo_banner_image', $bannerImg ?: 'banners/banner-event-komunitas.jpg');
        }
        if (isset($data['home_promo_banner_link'])) {
            Setting::set('home_promo_banner_link', $data['home_promo_banner_link']);
        }
        if (isset($data['home_promo_banner_alt'])) {
            Setting::set('home_promo_banner_alt', $data['home_promo_banner_alt']);
        }
        if (isset($data['home_partners_enabled'])) {
            Setting::set('home_partners_enabled', (bool) $data['home_partners_enabled']);
        }
        if (isset($data['home_partners_title'])) {
            Setting::set('home_partners_title', $data['home_partners_title']);
        }
        if (isset($data['home_partners_subtitle'])) {
            Setting::set('home_partners_subtitle', $data['home_partners_subtitle']);
        }
        if (isset($data['home_partners_slides']) && is_array($data['home_partners_slides'])) {
            $processedPartners = [];
            foreach ($data['home_partners_slides'] as $index => $slide) {
                $imageUrl = $slide['image'] ?? '';
                $upload = $slide['image_upload'] ?? null;
                if (!empty($upload)) {
                    $uploadPath = is_array($upload) ? array_values($upload)[0] : $upload;
                    if (!empty($uploadPath)) {
                        $clean = ltrim(preg_replace('#^/?(?:(?:storage|public)/)+#', '', trim($uploadPath)), '/');
                        $imageUrl = '/storage/' . $clean;
                    }
                }
                $processedPartners[] = [
                    'id' => $slide['id'] ?? ('partner-' . ($index + 1) . '-' . uniqid()),
                    'title' => $slide['title'] ?? '',
                    'city' => $slide['city'] ?? 'MALANG',
                    'image' => $imageUrl ?: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
                    'href' => $slide['href'] ?? '',
                    'open_in_new_tab' => (bool) ($slide['open_in_new_tab'] ?? true),
                ];
            }
            Setting::set('home_partners_slides', $processedPartners);
        }

        Cache::forget('sanubari_settings');

        Notification::make()
            ->title('Semua Konten Halaman Berhasil Disimpan!')
            ->body('Perubahan pada halaman Tentang Kami, Kunjungi Roastery, Beranda, Pre-Order, dan Halaman Kustom telah aktif secara langsung.')
            ->success()
            ->send();
    }

    protected function getFormActions(): array
    {
        return [
            Action::make('save')
                ->label('Simpan Semua Perubahan Halaman')
                ->submit('save'),
        ];
    }
}
