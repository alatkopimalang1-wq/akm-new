<?php

namespace App\Filament\Pages\HalamanAwal;

use App\Models\Setting;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Schemas\Components\Actions;
use Filament\Schemas\Components\EmbeddedSchema;
use Filament\Schemas\Components\Form;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\HtmlString;

class ManageSanubariPlaces extends Page
{
    protected static string|BackedEnum|null $navigationIcon = Heroicon::BuildingStorefront;

    protected static string|\UnitEnum|null $navigationGroup = 'Halaman Awal';

    protected static ?string $navigationLabel = 'Ruang & Showroom';

    protected static ?string $title = 'Pengaturan Ruang & Pengalaman Tempat';

    protected static ?int $navigationSort = 5;

    /**
     * @var array<string, mixed> | null
     */
    public ?array $data = [];

    public function mount(): void
    {
        $settings = Setting::all()->pluck('value', 'key')->toArray();

        $defaultPlaceItems = [
            [
                'badge' => 'Slow Bar & Tasting',
                'subBadge' => '09.00 – 23.00 WIB',
                'title' => 'Slow Bar & Manual Brew Experience',
                'desc' => 'Cicipi kalibrasi seduhan manual filter V60, Aeropress, dan Kalita Wave langsung di hadapan barista dari biji kopi sangrai minggu ini.',
                'href' => '/kunjungi',
                'coverImage' => 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
                'actionText' => 'Kunjungi Slow Bar',
            ],
            [
                'badge' => 'Alat Kopi Malang',
                'subBadge' => 'Gedung Alat Kopi Malang Lt. 1',
                'title' => 'Equipment & Commercial Espresso Showroom',
                'desc' => 'Kolaborasi dengan Alat Kopi Malang: coba langsung mesin espresso komersial, grinder Mahlkönig/Eureka, dripper, dan timbangan digital.',
                'href' => '/kunjungi',
                'coverImage' => 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
                'actionText' => 'Eksplorasi Showroom',
            ],
            [
                'badge' => 'Roasting Room',
                'subBadge' => 'Live Roasting',
                'title' => 'Laboratorium Roastery & Kurva Digital',
                'desc' => 'Pusat sangrai presisi biji kopi lereng Gunung Kawi dengan mesin sangrai berteknologi kurva digital untuk konsistensi profil rasa terbaik.',
                'href' => '/tentang',
                'coverImage' => 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=800&q=80',
                'actionText' => 'Tentang Roastery',
            ],
            [
                'badge' => 'Sensory Lab',
                'subBadge' => 'Public Cupping',
                'title' => 'Sensory Room & Weekly Public Cupping',
                'desc' => 'Ruang kalibrasi rasa standar SCA untuk uji sensorik batch baru, cupping bersama roaster, dan workshop seduh terbuka.',
                'href' => '/acara',
                'coverImage' => 'https://images.unsplash.com/photo-1518832553480-cd0e625ed3e6?auto=format&fit=crop&w=800&q=80',
                'actionText' => 'Jadwal Acara & Cupping',
            ],
            [
                'badge' => 'Beans Dispensary',
                'subBadge' => 'Fresh Roast On-Demand',
                'title' => 'Beans Bar & Gilingan Presisi Sesuai Alat',
                'desc' => 'Pilih biji kopi langsung dari toples sangrai segar, konsultasikan profil rasa, dan dapatkan gilingan pas untuk alat seduh di rumah Anda.',
                'href' => '/shop',
                'coverImage' => 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=800&q=80',
                'actionText' => 'Beli Biji Kopi',
            ],
            [
                'badge' => 'B2B & Wholesale',
                'subBadge' => 'Konsultasi Kedai',
                'title' => 'Lounge Kemitraan & Custom Blending C.Y.B.R',
                'desc' => 'Ruang diskusi hangat untuk pemilik kedai kopi dan horeka untuk mencicipi racikan houseblend kustom serta negosiasi pasokan grosir.',
                'href' => '/wholesale',
                'coverImage' => 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
                'actionText' => 'Konsultasi Kemitraan',
            ],
        ];

        $rawItems = $settings['home_place_items'] ?? $defaultPlaceItems;
        $sanitizedItems = [];
        if (is_array($rawItems)) {
            foreach ($rawItems as $item) {
                $rawImg = $item['coverImage'] ?? ($item['cover_url'] ?? ($item['cover_upload'] ?? ''));
                $diskPath = null;
                $externalUrl = null;

                if (! empty($rawImg)) {
                    if (str_starts_with($rawImg, 'http://') || str_starts_with($rawImg, 'https://')) {
                        $externalUrl = $rawImg;
                    } else {
                        $diskPath = ltrim(preg_replace('#^/?(?:(?:storage|public)/)+#', '', trim($rawImg)), '/');
                    }
                }

                $sanitizedItems[] = [
                    'badge' => $item['badge'] ?? '',
                    'subBadge' => $item['subBadge'] ?? '',
                    'actionText' => $item['actionText'] ?? 'Kunjungi',
                    'title' => $item['title'] ?? '',
                    'href' => $item['href'] ?? '',
                    'coverImage' => $externalUrl ?? (! empty($diskPath) ? ('/storage/' . $diskPath) : $rawImg),
                    'cover_upload' => $diskPath,
                    'cover_url' => $externalUrl,
                    'desc' => $item['desc'] ?? '',
                ];
            }
        }

        $this->form->fill([
            'home_place_title' => $settings['home_place_title'] ?? 'Roastery & Showroom Alat Kopi Malang',
            'home_place_subtitle' => $settings['home_place_subtitle'] ?? 'Kunjungi slow bar, uji coba mesin espresso, dan rasakan atmosfer sangrai lereng Kawi di Kota Malang',
            'home_place_items' => $sanitizedItems,
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
                Section::make('Ruang & Suasana Alat Kopi Malang di Malang')
                    ->description('Kartu pengalaman fisik tempat: Slow Bar, Showroom Alat Kopi, Laboratorium Roasting, Cupping Sensory, dll.')
                    ->schema([
                        Grid::make(2)->schema([
                            TextInput::make('home_place_title')
                                ->label('Judul Bagian')
                                ->required(),
                            Textarea::make('home_place_subtitle')
                                ->label('Subjudul / Deskripsi')
                                ->rows(2)
                                ->required(),
                        ]),
                        Repeater::make('home_place_items')
                            ->label('Daftar Kartu Pengalaman Ruang & Showroom')
                            ->itemLabel(function (array $state): ?string {
                                $title = ! empty($state['title']) ? $state['title'] : 'Ruangan';
                                $hasImg = ! empty($state['cover_upload']) || ! empty($state['cover_url']) || ! empty($state['coverImage']);
                                return $title . ($hasImg ? ' • 📸 Foto Siap' : ' • ⚠️ Belum Ada Foto');
                            })
                            ->schema([
                                Placeholder::make('cover_preview')
                                    ->label('Pratinjau Foto Ruangan Saat Ini')
                                    ->content(function ($get): HtmlString {
                                        $upload = $get('cover_upload');
                                        $url = $get('cover_url');
                                        $img = $get('coverImage');

                                        $src = null;
                                        if (! empty($upload)) {
                                            $path = is_array($upload) ? array_values($upload)[0] : $upload;
                                            if (! empty($path)) {
                                                $clean = ltrim(preg_replace('#^/?(?:(?:storage|public)/)+#', '', trim($path)), '/');
                                                $src = '/storage/' . $clean;
                                            }
                                        }
                                        if (! $src && ! empty($url)) {
                                            $src = $url;
                                        }
                                        if (! $src && ! empty($img)) {
                                            $src = $img;
                                        }

                                        if (! $src) {
                                            return new HtmlString('<div class="rounded-lg border border-dashed border-gray-700 p-3 text-center text-xs text-gray-400">Belum ada foto yang dipilih. Silakan unggah foto atau masukkan URL foto di bawah.</div>');
                                        }

                                        $fallbackAttr = '';
                                        if (str_starts_with($src, '/storage/')) {
                                            $prodUrl = 'https://sanubariroastery.co.id' . $src;
                                            $fallbackAttr = ' onerror="if(this.src!=\'' . e($prodUrl) . '\'){this.src=\'' . e($prodUrl) . '\';}"';
                                        }

                                        return new HtmlString(
                                            '<div class="flex items-center gap-4 rounded-xl border border-gray-700/60 bg-gray-900/60 p-3 shadow-inner my-1">' .
                                                '<div class="relative h-28 w-44 flex-shrink-0 overflow-hidden rounded-lg border border-gray-700 bg-black/40">' .
                                                    '<img src="' . e($src) . '" alt="Pratinjau Foto Ruangan" class="h-full w-full object-cover transition-transform duration-300 hover:scale-105"' . $fallbackAttr . ' />' .
                                                '</div>' .
                                                '<div class="flex flex-col gap-1.5 text-xs text-gray-300 min-w-0">' .
                                                    '<div class="flex items-center gap-2 flex-wrap">' .
                                                        '<span class="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">Foto Terpasang</span>' .
                                                        '<span class="text-gray-400 font-mono text-[11px] truncate max-w-sm">' . e(basename($src)) . '</span>' .
                                                    '</div>' .
                                                    '<div class="text-[11px] text-gray-400 break-all">' . e($src) . '</div>' .
                                                    '<div class="pt-1">' .
                                                        '<a href="' . e($src) . '" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400 hover:text-amber-300 underline">' .
                                                            'Buka Ukuran Penuh ↗' .
                                                        '</a>' .
                                                    '</div>' .
                                                '</div>' .
                                            '</div>'
                                        );
                                    })
                                    ->columnSpanFull(),

                                Grid::make(3)->schema([
                                    TextInput::make('badge')
                                        ->label('Badge Utama')
                                        ->required(),
                                    TextInput::make('subBadge')
                                        ->label('Sub Badge / Jam Operasional'),
                                    TextInput::make('actionText')
                                        ->label('Teks Tombol Aksi')
                                        ->default('Kunjungi'),
                                ]),
                                Grid::make(2)->schema([
                                    TextInput::make('title')
                                        ->label('Nama Ruangan / Pengalaman')
                                        ->required(),
                                    TextInput::make('href')
                                        ->label('Tautan Halaman')
                                        ->required(),
                                ]),
                                Grid::make(2)->schema([
                                    FileUpload::make('cover_upload')
                                        ->label('Unggah Foto Ruangan Baru')
                                        ->disk('public')
                                        ->directory('places')
                                        ->image()
                                        ->imageEditor()
                                        ->maxSize(5120)
                                        ->live()
                                        ->helperText('Upload foto atmosfer ruang (JPG, PNG, WEBP maks 5MB). Otomatis mengisi saat disimpan.')
                                        ->dehydrateStateUsing(fn ($state) => $state ? (is_array($state) ? array_values($state)[0] : $state) : null),
                                    TextInput::make('cover_url')
                                        ->label('Atau URL Gambar Eksternal')
                                        ->placeholder('https://images.unsplash.com/...')
                                        ->live(onBlur: true),
                                ]),
                                Textarea::make('desc')
                                    ->label('Deskripsi Pengalaman')
                                    ->rows(2)
                                    ->required(),
                            ])
                            ->defaultItems(3)
                            ->reorderable()
                            ->columnSpanFull(),
                    ]),
            ]);
    }

    public function save(): void
    {
        $data = $this->form->getState();

        if (isset($data['home_place_items']) && is_array($data['home_place_items'])) {
            $processedItems = [];
            foreach ($data['home_place_items'] as $item) {
                $upload = $item['cover_upload'] ?? null;
                $url = $item['cover_url'] ?? null;
                $finalCover = $item['coverImage'] ?? null;

                if (! empty($upload)) {
                    $uploadPath = is_array($upload) ? array_values($upload)[0] : $upload;
                    if (! empty($uploadPath)) {
                        $clean = ltrim(preg_replace('#^/?(?:(?:storage|public)/)+#', '', trim($uploadPath)), '/');
                        $finalCover = '/storage/' . $clean;
                    }
                } elseif (! empty($url)) {
                    $finalCover = $url;
                }

                $processedItems[] = [
                    'badge' => $item['badge'] ?? '',
                    'subBadge' => $item['subBadge'] ?? '',
                    'actionText' => $item['actionText'] ?? 'Kunjungi',
                    'title' => $item['title'] ?? '',
                    'href' => $item['href'] ?? '',
                    'coverImage' => $finalCover,
                    'desc' => $item['desc'] ?? '',
                ];
            }
            $data['home_place_items'] = $processedItems;
        }

        foreach ($data as $key => $value) {
            Setting::set($key, $value);
        }

        Cache::forget('sanubari_settings');

        Notification::make()
            ->title('Ruang & Showroom Berhasil Disimpan!')
            ->body('Konten ruang dan showroom beranda telah diperbarui.')
            ->success()
            ->send();
    }

    protected function getFormActions(): array
    {
        return [
            Action::make('save')
                ->label('Simpan Ruang & Showroom')
                ->submit('save'),
        ];
    }
}
