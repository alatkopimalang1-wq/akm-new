<?php

namespace App\Filament\Resources\Posts\Schemas;

use App\Models\Post;
use App\Support\IconCatalog;
use Filament\Forms\Components\Builder;
use Filament\Forms\Components\Builder\Block;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Illuminate\Support\Str;

class PostForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(1)
            ->components([
                // SECTION 1: INFORMASI UTAMA ARTIKEL
                Section::make('Informasi Utama Artikel')
                    ->description('Masukkan judul, tautan URL, kategori, dan informasi penulis artikel.')
                    ->columnSpanFull()
                    ->schema([
                        Grid::make(3)->schema([
                            TextInput::make('title.id')
                                ->label('Judul Artikel')
                                ->placeholder('Contoh: Jejak Rasa Kopi Lereng Kawi: Eksplorasi Profil Catimor')
                                ->required()
                                ->columnSpan(2)
                                ->live(onBlur: true)
                                ->afterStateUpdated(function (string $operation, $state, callable $set, $get) {
                                    if ($operation === 'create' || empty($get('slug'))) {
                                        $set('slug', Str::slug((string) $state));
                                    }
                                }),
                            TextInput::make('slug')
                                ->label('Slug URL')
                                ->placeholder('jejak-rasa-kopi-kawi')
                                ->required()
                                ->unique(Post::class, 'slug', ignoreRecord: true)
                                ->helperText('Alamat URL: /blog/{slug}')
                                ->columnSpan(1),
                        ]),
                        Grid::make(4)->schema([
                            Select::make('category')
                                ->label('Kategori Artikel')
                                ->options([
                                    'Journal' => 'Journal & Cerita',
                                    'Edukasi' => 'Edukasi Seduh',
                                    'Terroir' => 'Terroir & Petani',
                                    'Roasting' => 'Catatan Roastery',
                                    'Kabar' => 'Kabar Sanubari',
                                ])
                                ->default('Journal')
                                ->searchable()
                                ->required(),
                            TextInput::make('author_name')
                                ->label('Nama Penulis')
                                ->default('Sanubari Roastery')
                                ->required(),
                            TextInput::make('read_time_minutes')
                                ->label('Estimasi Waktu Baca')
                                ->numeric()
                                ->default(3)
                                ->suffix('menit'),
                            TextInput::make('sort_order')
                                ->label('Urutan Tampilan')
                                ->numeric()
                                ->default(0)
                                ->helperText('0 = urutan standar'),
                        ]),
                    ]),

                // SECTION 2: PUBLIKASI KE WEBSITE
                Section::make('Publikasi ke Website')
                    ->description('Atur apakah artikel ini langsung ditayangkan di halaman https://sanubari.co.id/blog atau disimpan sebagai draf.')
                    ->schema([
                        Grid::make(2)->schema([
                            Toggle::make('is_published')
                                ->label('Publikasikan ke Website Sekarang')
                                ->helperText('Aktifkan agar artikel langsung tampil di halaman /blog.')
                                ->live()
                                ->formatStateUsing(fn ($record) => $record && $record->published_at && $record->published_at <= now())
                                ->dehydrated(false)
                                ->afterStateUpdated(function (bool $state, callable $set, $get) {
                                    if ($state) {
                                        if (empty($get('published_at'))) {
                                            $set('published_at', now()->format('Y-m-d H:i:s'));
                                        }
                                    } else {
                                        $set('published_at', null);
                                    }
                                }),
                            DateTimePicker::make('published_at')
                                ->label('Jadwal / Waktu Publikasi')
                                ->helperText('Kosongkan untuk menyimpan sebagai Draf. Isi tanggal untuk menayangkan atau menjadwalkan.')
                                ->default(now())
                                ->seconds(false),
                        ]),
                    ]),

                // SECTION 3: FOTO SAMPUL & KOLOM GAMBAR
                Section::make('Foto Sampul & Kolom Galeri Gambar')
                    ->description('Atur gambar sampul utama, rasio aspek, caption, serta kolom galeri gambar tambahan.')
                    ->schema([
                        FileUpload::make('cover_image')
                            ->label('Unggah Foto Sampul Utama')
                            ->disk('public')
                            ->directory('posts')
                            ->image()
                            ->imageEditor()
                            ->maxSize(5120)
                            ->helperText('Format: JPG, PNG, WEBP (maks. 5MB). Ditampilkan di kartu daftar blog dan banner artikel.')
                            ->columnSpanFull(),
                        Grid::make(3)->schema([
                            TextInput::make('meta.cover_caption')
                                ->label('Keterangan Foto Sampul (Caption)')
                                ->placeholder('Contoh: Petani kopi memetik buah matang di lereng Gunung Kawi')
                                ->columnSpan(2),
                            Select::make('meta.image_aspect_ratio')
                                ->label('Rasio Kolom Gambar Sampul')
                                ->options([
                                    '' => 'Ikuti Pengaturan Global (/blog)',
                                    'aspect-16/10' => '16:10 (Default Modern)',
                                    'aspect-16/9' => '16:9 (Lanskap Sinematik)',
                                    'aspect-4/3' => '4:3 (Klasik)',
                                    'aspect-square' => '1:1 (Persegi)',
                                ])
                                ->columnSpan(1),
                        ]),
                        FileUpload::make('meta.gallery_images')
                            ->label('Kolom Galeri Gambar Tambahan')
                            ->disk('public')
                            ->directory('posts/gallery')
                            ->multiple()
                            ->image()
                            ->reorderable()
                            ->maxSize(5120)
                            ->helperText('Unggah beberapa gambar pendukung untuk ditampilkan dalam format susunan kolom galeri rapi pada halaman artikel.')
                            ->columnSpanFull(),
                        Grid::make(3)->schema([
                            Select::make('meta.gallery_columns')
                                ->label('Format / Jumlah Kolom Galeri Gambar')
                                ->options([
                                    '2' => '2 Kolom Gambar (Berdampingan Luas)',
                                    '3' => '3 Kolom Gambar (Grid Ideal)',
                                    '4' => '4 Kolom Gambar (Grid Kompak)',
                                    'flipbook_3d' => '📖 Interactive 3D Page-Flip Book Slider',
                                ])
                                ->default('3'),
                            TextInput::make('meta.gallery_title')
                                ->label('Judul Bagian Kolom Galeri (Opsional)')
                                ->placeholder('Contoh: Dokumentasi Sangrai & Petani'),
                            Select::make('meta.gallery_position')
                                ->label('Posisi Kolom Gambar di Halaman')
                                ->options([
                                    'after_cover' => 'Di Bawah Foto Sampul',
                                    'after_content' => 'Di Bawah Isi Naskah Artikel',
                                ])
                                ->default('after_content'),
                        ]),
                    ]),

                // SECTION 3B: INTERACTIVE 3D PAGE-FLIP BOOK IMAGE SLIDER
                Section::make('Interactive 3D Page-Flip Book Image Slider (Rasio 4:5 Full Gambar)')
                    ->description('Tampilkan buku interaktif 3D (Page-Flip Book) rasio 4:5 full gambar tanpa bingkai pinggir, judul, maupun deskripsi.')
                    ->columnSpanFull()
                    ->schema([
                        Grid::make(3)->schema([
                            Toggle::make('meta.flipbook_enabled')
                                ->label('Aktifkan 3D Page-Flip Book Slider')
                                ->helperText('Tampilkan buku interaktif 3D pada halaman artikel ini.')
                                ->default(false)
                                ->live(),
                            Select::make('meta.flipbook_position')
                                ->label('Posisi Buku 3D di Halaman')
                                ->options([
                                    'after_cover' => 'Di Bawah Foto Sampul Utama',
                                    'before_content' => 'Di Awal Isi Naskah Artikel',
                                    'after_content' => 'Di Bawah Isi Naskah Artikel',
                                ])
                                ->default('after_cover'),
                            Toggle::make('meta.flipbook_autoplay')
                                ->label('Putar Halaman Otomatis (Auto-Flip)')
                                ->helperText('Balik lembar otomatis setiap 6 detik.')
                                ->default(false),
                        ]),
                        Repeater::make('meta.flipbook_pages')
                            ->label('Daftar Halaman Gambar 3D Book (Rasio 4:5)')
                            ->addActionLabel('Tambah Halaman Gambar 3D')
                            ->itemLabel('Halaman Gambar 4:5')
                            ->schema([
                                Grid::make(2)->schema([
                                    FileUpload::make('image')
                                        ->label('Unggah Foto Halaman (Rasio 4:5)')
                                        ->disk('public')
                                        ->directory('posts/flipbook')
                                        ->image()
                                        ->imageEditor()
                                        ->maxSize(5120)
                                        ->helperText('Unggah foto rasio 4:5 (JPG/PNG/WEBP, maks. 5MB). Ditampilkan penuh tanpa bingkai/judul/deskripsi.'),
                                    TextInput::make('image_url')
                                        ->label('Atau Gunakan URL Gambar Eksternal (Opsional)')
                                        ->placeholder('https://images.unsplash.com/...'),
                                ]),
                            ])
                            ->defaultItems(2)
                            ->reorderable()
                            ->collapsible()
                            ->columnSpanFull(),
                    ]),

                // SECTION 4: ICON, BADGE & STATUS SOROTAN
                Section::make('Icon, Badge & Status Sorotan')
                    ->description('Pilih ikon visual untuk artikel, label badge tambahan, serta penanda artikel sorotan (featured).')
                    ->schema([
                        Grid::make(3)->schema([
                            Select::make('meta.icon')
                                ->label('Icon Visual Artikel (Lucide Icon)')
                                ->helperText('Ikon yang tampil pada badge kategori artikel.')
                                ->options(IconCatalog::options())
                                ->searchable()
                                ->prefixIcon(fn (?string $state) => IconCatalog::getPrefixIcon($state))
                                ->default('newspaper'),
                            TextInput::make('meta.badge_label')
                                ->label('Label Badge Khusus (Opsional)')
                                ->placeholder('Contoh: Sorotan, Eksklusif, Pilihan Roaster'),
                            Select::make('meta.badge_color')
                                ->label('Warna Badge')
                                ->options([
                                    'copper' => 'Copper Gold (Sanubari Theme)',
                                    'amber' => 'Amber Hangat',
                                    'emerald' => 'Emerald Green (Segar)',
                                    'blue' => 'Blue Sky (Info)',
                                    'slate' => 'Dark Slate (Minimalis)',
                                ])
                                ->default('copper'),
                        ]),
                        Toggle::make('meta.is_featured')
                            ->label('Tandai Sebagai Artikel Sorotan (Featured Article)')
                            ->helperText('Artikel ini akan mendapatkan penanda khusus "★ Sorotan" di daftar blog.')
                            ->default(false),
                    ]),

                // SECTION 5: RINGKASAN ARTIKEL (EXCERPT)
                Section::make('Ringkasan Artikel (Excerpt)')
                    ->description('Cuplikan pengantar yang ditampilkan pada kartu artikel di halaman /blog.')
                    ->schema([
                        Textarea::make('excerpt.id')
                            ->label('Ringkasan Singkat')
                            ->placeholder('Tulis rangkuman 1-2 kalimat menarik mengenai artikel ini...')
                            ->rows(3)
                            ->helperText('Akan tampil di kartu preview blog sebelum pembaca membuka artikel lengkap.')
                            ->columnSpanFull(),
                    ]),

                // SECTION 6: KONTEN LENGKAP ARTIKEL
                Section::make('Isi Lengkap Artikel (Konten)')
                    ->description('Tulis naskah lengkap artikel dan atur tata letak gambar serta grid responsif (desktop & mobile).')
                    ->schema([
                        RichEditor::make('body.id')
                            ->label('Konten Artikel Lengkap')
                            ->placeholder('Mulai menulis isi artikel di sini...')
                            ->toolbarButtons([
                                'attachFiles',
                                'blockquote',
                                'bold',
                                'bulletList',
                                'codeBlock',
                                'h2',
                                'h3',
                                'italic',
                                'link',
                                'orderedList',
                                'redo',
                                'strike',
                                'underline',
                                'undo',
                            ])
                            ->fileAttachmentsDisk('public')
                            ->fileAttachmentsDirectory('posts/content')
                            ->required()
                            ->columnSpanFull(),

                        // PENGATURAN ISI GAMBAR & TATA LETAK GRID (DESKTOP & MOBILE)
                        Section::make('Pengaturan Gambar Isi Konten & Grid (Desktop & Mobile)')
                            ->description('Atur gambar di dalam naskah, tata letak kolom grid desktop, serta penyesuaian khusus tampilan layar mobile (HP).')
                            ->schema([
                                FileUpload::make('meta.content_images')
                                    ->label('Unggah Gambar Isi Konten (Multi-Foto / Grid)')
                                    ->disk('public')
                                    ->directory('posts/content_images')
                                    ->multiple()
                                    ->image()
                                    ->reorderable()
                                    ->maxSize(5120)
                                    ->helperText('Unggah foto-foto pendukung naskah untuk disusun dalam grid atau disandingkan dengan teks.')
                                    ->columnSpanFull(),

                                Grid::make(3)->schema([
                                    Select::make('meta.content_image_layout')
                                        ->label('Tata Letak Gambar (Desktop/Tablet)')
                                        ->options([
                                            'grid' => 'Grid Kolom Foto (Galeri Gambar)',
                                            'flipbook_3d' => '📖 Interactive 3D Page-Flip Book Slider',
                                            'split_right' => 'Berdampingan: Teks di Kiri (50%), Gambar di Kanan (50%)',
                                            'split_left' => 'Berdampingan: Gambar di Kiri (50%), Teks di Kanan (50%)',
                                            'banner_top' => 'Banner Lebar di Awal Naskah',
                                            'banner_bottom' => 'Banner Lebar di Akhir Naskah',
                                        ])
                                        ->default('grid'),

                                    Select::make('meta.content_grid_cols_desktop')
                                        ->label('Jumlah Kolom Grid (Desktop)')
                                        ->options([
                                            '1' => '1 Kolom (Besar / Lebar Penuh)',
                                            '2' => '2 Kolom Berdampingan',
                                            '3' => '3 Kolom (Grid Seimbang)',
                                            '4' => '4 Kolom (Grid Kompak)',
                                        ])
                                        ->default('2'),

                                    Select::make('meta.content_image_aspect')
                                        ->label('Rasio Gambar')
                                        ->options([
                                            'auto' => 'Rasio Asli Foto (Natural)',
                                            'aspect-16/9' => '16:9 (Lanskap Sinematik)',
                                            'aspect-4/3' => '4:3 (Klasik)',
                                            'aspect-square' => '1:1 (Persegi)',
                                        ])
                                        ->default('aspect-16/9'),
                                ]),

                                Grid::make(3)->schema([
                                    Select::make('meta.content_mobile_mode')
                                        ->label('Mode Tampilan Mobile (Layar HP)')
                                        ->options([
                                            'stacked_full' => '📱 Tumpuk 1 Kolom Penuh (Full Width - Direkomendasikan)',
                                            'grid_2' => '📱 Grid 2 Kolom Kompak di HP',
                                            'carousel_swipe' => '📱 Slider Geser Horizontal (Swipe Carousel di HP)',
                                            'hidden_mobile' => '📱 Sembunyikan Gambar di HP (Khusus Teks)',
                                        ])
                                        ->default('stacked_full')
                                        ->helperText('Pilih bagaimana gambar ditampilkan saat dibuka di layar HP smartphone.'),

                                    Select::make('meta.content_mobile_order')
                                        ->label('Urutan Tampilan di HP')
                                        ->options([
                                            'image_first' => 'Gambar di Atas Teks',
                                            'text_first' => 'Teks di Atas Gambar',
                                        ])
                                        ->default('image_first'),

                                    Select::make('meta.content_image_position')
                                        ->label('Posisi Gambar Terhadap Naskah')
                                        ->options([
                                            'before_text' => 'Sebelum Naskah Konten',
                                            'after_text' => 'Setelah Naskah Konten',
                                        ])
                                        ->default('before_text'),
                                ]),

                                TextInput::make('meta.content_image_caption')
                                    ->label('Keterangan Gambar / Caption (Opsional)')
                                    ->placeholder('Contoh: Dokumentasi proses seduh manual brew di roastery')
                                    ->columnSpanFull(),
                            ]),

                        // SISIPAN BLOK RESPONSIF: TABEL, ICON, GAMBAR & LAYOUT
                        Section::make('Sisipan Elemen Konten (Tabel, Icon, Gambar & Layout Responsif)')
                            ->description('Tambahkan tabel data, kotak icon sorotan, atau kolom grid gambar dengan pengaturan tata letak fleksibel untuk desktop, tablet, dan mobile.')
                            ->collapsible()
                            ->schema([
                                Builder::make('meta.content_blocks')
                                    ->label('Daftar Elemen Sisipan Artikel')
                                    ->addActionLabel('Tambah Elemen Sisipan (Tabel / Icon / Gambar / Teks)')
                                    ->blocks([
                                        // 1. BLOK TABEL DATA
                                        Block::make('table')
                                            ->label('Tabel Data Responsif')
                                            ->icon(Heroicon::TableCells)
                                            ->schema([
                                                Grid::make(2)->schema([
                                                    TextInput::make('title')
                                                        ->label('Judul Tabel')
                                                        ->placeholder('Contoh: Perbandingan Kadar Kafein Kopi')
                                                        ->required(),
                                                    TextInput::make('subtitle')
                                                        ->label('Keterangan / Sumber (Opsional)')
                                                        ->placeholder('Contoh: Catatan Roastery & Riset Kopi 2026'),
                                                ]),
                                                TagsInput::make('headers')
                                                    ->label('Kolom Header Tabel')
                                                    ->placeholder('Ketik nama kolom lalu Enter (contoh: Karakteristik, Robusta, Arabika)')
                                                    ->helperText('Daftar judul kolom tabel dari kiri ke kanan.')
                                                    ->required(),
                                                Repeater::make('rows')
                                                    ->label('Baris Data Tabel')
                                                    ->schema([
                                                        TagsInput::make('cells')
                                                            ->label('Isi Sel Baris (Urut sesuai kolom header)')
                                                            ->placeholder('Ketik nilai sel lalu tekan Enter')
                                                            ->required(),
                                                    ])
                                                    ->defaultItems(2)
                                                    ->addActionLabel('Tambah Baris Data')
                                                    ->columnSpanFull(),
                                                Section::make('Pengaturan Tata Letak Tabel (Desktop, Tablet, Mobile)')
                                                    ->schema([
                                                        Grid::make(3)->schema([
                                                            Select::make('layout_desktop')
                                                                ->label('Tampilan Desktop')
                                                                ->options([
                                                                    'striped' => 'Garis Belang (Zebra Striped)',
                                                                    'bordered' => 'Border Bergaris Penuh',
                                                                    'clean' => 'Minimalis Elegan',
                                                                ])
                                                                ->default('striped'),
                                                            Select::make('layout_tablet')
                                                                ->label('Tampilan Tablet')
                                                                ->options([
                                                                    'responsive' => 'Lebar Penuh Otomatis',
                                                                    'scroll' => 'Geser Horizontal Halus',
                                                                ])
                                                                ->default('responsive'),
                                                            Select::make('layout_mobile')
                                                                ->label('Tampilan Layar Mobile (HP)')
                                                                ->options([
                                                                    'cards' => '📱 Ubah Jadi Kartu Responsif (Rekomendasi HP)',
                                                                    'scroll' => '📱 Geser Horizontal Halus (Swipe Table)',
                                                                    'compact' => '📱 Tabel Mini Kompak (Font Kecil)',
                                                                ])
                                                                ->default('cards')
                                                                ->helperText('Pilih format tabel di HP agar pembaca tidak perlu zoom/geser rumit.'),
                                                        ]),
                                                    ]),
                                            ]),

                                        // 2. BLOK ICON & KOTAK SOROTAN
                                        Block::make('icon_callout')
                                            ->label('Kotak Icon & Sorotan')
                                            ->icon(Heroicon::Sparkles)
                                            ->schema([
                                                Grid::make(3)->schema([
                                                    Select::make('icon')
                                                        ->label('Pilihan Icon Visual')
                                                        ->options(IconCatalog::options())
                                                        ->searchable()
                                                        ->prefixIcon(fn (?string $state) => IconCatalog::getPrefixIcon($state))
                                                        ->default('coffee')
                                                        ->required(),
                                                    TextInput::make('title')
                                                        ->label('Judul Sorotan / Tips')
                                                        ->placeholder('Contoh: Catatan Roaster / Fakta Kafein')
                                                        ->required(),
                                                    Select::make('color')
                                                        ->label('Warna Tema Aksen')
                                                        ->options([
                                                            'copper' => 'Copper Gold (Sanubari Theme)',
                                                            'amber' => 'Amber Hangat',
                                                            'emerald' => 'Emerald Green (Terroir)',
                                                            'blue' => 'Blue Sky (Info)',
                                                            'slate' => 'Dark Slate (Minimalis)',
                                                        ])
                                                        ->default('copper'),
                                                ]),
                                                Textarea::make('text')
                                                    ->label('Isi Teks / Penjelasan')
                                                    ->placeholder('Tulis pesan penting, fakta edukasi, atau catatan tips di sini...')
                                                    ->rows(3)
                                                    ->required(),
                                                Section::make('Pengaturan Tata Letak Icon & Box (Desktop, Tablet, Mobile)')
                                                    ->schema([
                                                        Grid::make(3)->schema([
                                                            Select::make('layout_desktop')
                                                                ->label('Tampilan Desktop')
                                                                ->options([
                                                                    'banner' => 'Kotak Lebar Penuh (Banner Box)',
                                                                    'centered' => 'Kotak Terpusat Elegan (75% Lebar)',
                                                                    'compact_side' => 'Kotak Kompak dengan Bayangan',
                                                                ])
                                                                ->default('banner'),
                                                            Select::make('layout_tablet')
                                                                ->label('Tampilan Tablet')
                                                                ->options([
                                                                    'full' => '100% Lebar Layar Tablet',
                                                                    'boxed' => 'Kotak Ber-padding Nyaman',
                                                                ])
                                                                ->default('full'),
                                                            Select::make('layout_mobile')
                                                                ->label('Tampilan Mobile (HP)')
                                                                ->options([
                                                                    'stacked' => '📱 Icon di Atas (Tumpuk Vertikal Penuh)',
                                                                    'inline' => '📱 Icon di Samping (Kompak Sejajar)',
                                                                ])
                                                                ->default('stacked')
                                                                ->helperText('Format tampilan box icon saat dibaca dari smartphone.'),
                                                        ]),
                                                    ]),
                                            ]),

                                        // 3. BLOK GAMBAR & GRID FOTO
                                        Block::make('image_grid')
                                            ->label('Kolom Gambar & Grid Foto')
                                            ->icon(Heroicon::Photo)
                                            ->schema([
                                                FileUpload::make('images')
                                                    ->label('Unggah Foto (Bisa Lebih Dari 1 Gambar)')
                                                    ->disk('public')
                                                    ->directory('posts/content_images')
                                                    ->multiple()
                                                    ->image()
                                                    ->reorderable()
                                                    ->maxSize(5120)
                                                    ->required(),
                                                TextInput::make('caption')
                                                    ->label('Keterangan Gambar / Caption (Opsional)')
                                                    ->placeholder('Contoh: Biji kopi sangrai lereng Kawi siap uji cupping'),
                                                Section::make('Pengaturan Kolom & Layout Grid (Desktop, Tablet, Mobile)')
                                                    ->schema([
                                                        Grid::make(4)->schema([
                                                            Select::make('layout_desktop')
                                                                ->label('Kolom Desktop')
                                                                ->options([
                                                                    '1' => '1 Kolom (Penuh Besar)',
                                                                    '2' => '2 Kolom Berdampingan',
                                                                    '3' => '3 Kolom (Grid Ideal)',
                                                                    '4' => '4 Kolom (Grid Kompak)',
                                                                ])
                                                                ->default('2'),
                                                            Select::make('layout_tablet')
                                                                ->label('Kolom Tablet')
                                                                ->options([
                                                                    '1' => '1 Kolom',
                                                                    '2' => '2 Kolom',
                                                                    '3' => '3 Kolom',
                                                                ])
                                                                ->default('2'),
                                                            Select::make('layout_mobile')
                                                                ->label('Mode Tampilan Mobile (HP)')
                                                                ->options([
                                                                    'stacked' => '📱 1 Kolom Penuh (Stacked Full)',
                                                                    'grid_2' => '📱 2 Kolom Kompak di HP',
                                                                    'swipe' => '📱 Slider Geser Horizontal (Swipe Carousel)',
                                                                ])
                                                                ->default('stacked')
                                                                ->helperText('Responsivitas grid foto di layar HP.'),
                                                            Select::make('aspect_ratio')
                                                                ->label('Rasio Gambar')
                                                                ->options([
                                                                    'auto' => 'Natural (Asli)',
                                                                    'aspect-16/9' => '16:9 (Lanskap)',
                                                                    'aspect-4/3' => '4:3 (Klasik)',
                                                                    'aspect-square' => '1:1 (Persegi)',
                                                                ])
                                                                ->default('aspect-16/9'),
                                                        ]),
                                                    ]),
                                            ]),

                                // 4. BLOK TEKS PARAGRAF TAMBAHAN
                                        Block::make('text')
                                            ->label('Teks Paragraf Tambahan')
                                            ->icon(Heroicon::DocumentText)
                                            ->schema([
                                                RichEditor::make('content')
                                                    ->label('Isi Naskah Paragraf')
                                                    ->required(),
                                                Grid::make(3)->schema([
                                                    Select::make('layout_desktop')
                                                        ->label('Tata Letak Desktop')
                                                        ->options([
                                                            'standard' => 'Standar Lebar Baca',
                                                            'lead' => 'Teks Pengantar Menonjol (Lead)',
                                                        ])
                                                        ->default('standard'),
                                                    Select::make('layout_tablet')
                                                        ->label('Tata Letak Tablet')
                                                        ->options([
                                                            'standard' => 'Standar Proporsional',
                                                        ])
                                                        ->default('standard'),
                                                    Select::make('layout_mobile')
                                                        ->label('Tata Letak Mobile')
                                                        ->options([
                                                            'standard' => 'Standar Proporsional HP',
                                                            'compact' => 'Teks Rapat HP',
                                                        ])
                                                        ->default('standard'),
                                                ]),
                                            ]),

                                        // 5. BLOK INTERACTIVE 3D PAGE-FLIP BOOK IMAGE SLIDER
                                        Block::make('flipbook_3d')
                                            ->label('Interactive 3D Page-Flip Book Slider (4:5 Full Gambar)')
                                            ->icon(Heroicon::BookOpen)
                                            ->schema([
                                                Repeater::make('pages')
                                                    ->label('Daftar Halaman Gambar 3D Book (Rasio 4:5)')
                                                    ->addActionLabel('Tambah Halaman Gambar 3D')
                                                    ->schema([
                                                        Grid::make(2)->schema([
                                                            FileUpload::make('image')
                                                                ->label('Unggah Foto Halaman (Rasio 4:5)')
                                                                ->disk('public')
                                                                ->directory('posts/flipbook')
                                                                ->image()
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
                                    ])
                                    ->collapsible()
                                    ->collapsed(false)
                                    ->columnSpanFull(),
                            ]),
                    ]),

                // SECTION 7: PENGATURAN SEO & TAG TOPIK (DAN LAIN-LAIN)
                Section::make('Tag Topik & Pengaturan SEO (Lain-lain)')
                    ->description('Kata kunci topik artikel dan optimasi mesin pencari Google.')
                    ->collapsible()
                    ->schema([
                        TagsInput::make('meta.tags')
                            ->label('Tag Topik Artikel (Keywords / Tags)')
                            ->placeholder('Ketik tag lalu tekan enter (contoh: kawi, v60, roasting, catimor)')
                            ->columnSpanFull(),
                        Grid::make(2)->schema([
                            TextInput::make('meta.seo_title')
                                ->label('SEO Meta Title')
                                ->placeholder('Judul spesifik untuk hasil pencarian Google'),
                            Textarea::make('meta.seo_description')
                                ->label('SEO Meta Description')
                                ->placeholder('Ringkasan 150-160 karakter untuk deskripsi hasil pencarian Google')
                                ->rows(2),
                        ]),
                    ]),

                // SECTION 8: PENGATURAN LANJUTAN & MULTI-BAHASA
                Section::make('Pengaturan Lanjutan & Multi-Bahasa')
                    ->collapsible()
                    ->collapsed()
                    ->schema([
                        Select::make('type')
                            ->label('Tipe Konten')
                            ->options([
                                'article' => 'Artikel Blog / Catatan Roaster',
                                'guide' => 'Panduan Seduh (Brew Guide)',
                                'event' => 'Acara & Cupping (Event)',
                            ])
                            ->default('article')
                            ->live(),
                        Grid::make(2)->schema([
                            TextInput::make('title.en')
                                ->label('Judul (English - Opsional)'),
                            Textarea::make('excerpt.en')
                                ->label('Ringkasan (English - Opsional)')
                                ->rows(2),
                        ]),
                        Textarea::make('body.en')
                            ->label('Isi Lengkap (English - Opsional)')
                            ->rows(4)
                            ->columnSpanFull(),
                    ]),

                // SECTION 9: KHUSUS PANDUAN SEDUH (JIKA TIPE GUIDE)
                Section::make('Resep & Parameter Seduh (Brew Guide)')
                    ->visible(fn ($get) => $get('type') === 'guide')
                    ->schema([
                        Grid::make(3)->schema([
                            TextInput::make('method')
                                ->label('Metode Seduh')
                                ->placeholder('e.g. V60, AeroPress, Tubruk, Cold Brew'),
                            Select::make('difficulty')
                                ->label('Tingkat Kesulitan')
                                ->options([
                                    'Sangat Mudah' => 'Sangat Mudah',
                                    'Mudah' => 'Mudah',
                                    'Menengah' => 'Menengah',
                                    'Lanjutan' => 'Lanjutan',
                                ])
                                ->default('Mudah'),
                            TextInput::make('brew_time')
                                ->label('Total Waktu Seduh')
                                ->placeholder('e.g. 2:45 menit'),
                        ]),
                        Grid::make(3)->schema([
                            TextInput::make('ratio')
                                ->label('Rasio Kopi : Air')
                                ->placeholder('e.g. 1:15 (15g kopi : 225ml air)'),
                            TextInput::make('grind_size')
                                ->label('Ukuran Gilingan (Grind Size)')
                                ->placeholder('e.g. Medium-Fine'),
                            TextInput::make('water_temp')
                                ->label('Suhu Air Seduh')
                                ->placeholder('e.g. 92°C'),
                        ]),
                        Grid::make(2)->schema([
                            Textarea::make('description.id')
                                ->label('Deskripsi Resep (Indonesia)')
                                ->rows(3),
                            Textarea::make('description.en')
                                ->label('Deskripsi Resep (English)')
                                ->rows(3),
                        ]),
                        Repeater::make('steps')
                            ->label('Langkah-Langkah Seduhan (Interactive Steps)')
                            ->schema([
                                Grid::make(3)->schema([
                                    TextInput::make('step')
                                        ->label('Langkah #')
                                        ->numeric()
                                        ->default(1),
                                    TextInput::make('time')
                                        ->label('Interval Waktu')
                                        ->placeholder('0:00 - 0:45'),
                                    TextInput::make('water_amount')
                                        ->label('Takaran Air (Opsional)')
                                        ->placeholder('45g'),
                                ]),
                                Textarea::make('text')
                                    ->label('Instruksi Langkah')
                                    ->required()
                                    ->rows(2)
                                    ->columnSpanFull(),
                            ])
                            ->defaultItems(2)
                            ->columnSpanFull(),
                    ]),

                // SECTION 10: KHUSUS ACARA (JIKA TIPE EVENT)
                Section::make('Detail Acara & Reservasi (Event)')
                    ->visible(fn ($get) => $get('type') === 'event')
                    ->schema([
                        Grid::make(2)->schema([
                            TextInput::make('location')
                                ->label('Nama Tempat / Lokasi')
                                ->placeholder('e.g. Sanubari Roastery x Alat Kopi Malang'),
                            TextInput::make('address')
                                ->label('Alamat Lengkap')
                                ->placeholder('Jl. Terusan Kawi No. 12, Klojen, Malang'),
                        ]),
                        Grid::make(3)->schema([
                            TextInput::make('fee')
                                ->label('Biaya Pendaftaran')
                                ->numeric()
                                ->prefix('Rp')
                                ->default(0),
                            TextInput::make('capacity')
                                ->label('Kapasitas Peserta (Orang)')
                                ->numeric()
                                ->default(16),
                            Select::make('status')
                                ->label('Status Acara')
                                ->options([
                                    'open' => 'Buka Pendaftaran (Open)',
                                    'full' => 'Penuh (Sold Out)',
                                    'completed' => 'Selesai (Completed)',
                                ])
                                ->default('open'),
                        ]),
                        Grid::make(2)->schema([
                            DateTimePicker::make('starts_at')
                                ->label('Waktu Mulai Acara'),
                            DateTimePicker::make('ends_at')
                                ->label('Waktu Selesai Acara'),
                        ]),
                        TextInput::make('whatsapp_register_text')
                            ->label('Template Pesan WhatsApp Pendaftaran')
                            ->placeholder('Halo Sanubari, saya ingin mendaftar Public Cupping...')
                            ->columnSpanFull(),
                    ]),
            ]);
    }
}
