<?php

namespace App\Filament\Pages\HalamanAwal;

use App\Models\Setting;
use App\Support\HelixGalleryDefaults;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Placeholder;
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
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\HtmlString;

class ManageHelixGallery extends Page
{
    protected static string|BackedEnum|null $navigationIcon = Heroicon::ArrowPathRoundedSquare;

    protected static string|\UnitEnum|null $navigationGroup = 'Halaman Awal';

    protected static ?string $navigationLabel = 'Galeri 3D Helix';

    protected static ?string $title = 'Pengaturan Galeri 3D Helix (Helical Ribbon)';

    protected static ?int $navigationSort = 12;

    /**
     * @var array<string, mixed> | null
     */
    public ?array $data = [];

    public function mount(): void
    {
        $settings = Setting::all()->pluck('value', 'key')->toArray();

        $rawItems = $settings['home_helix_gallery_items'] ?? HelixGalleryDefaults::getDefaultItems();

        $sanitizedItems = [];
        if (is_array($rawItems)) {
            foreach ($rawItems as $idx => $item) {
                $rawImage = $item['image'] ?? ($item['image_file'] ?? null);
                $imageFile = null;
                $externalUrl = null;

                if (! empty($rawImage)) {
                    if (str_starts_with($rawImage, 'http://') || str_starts_with($rawImage, 'https://')) {
                        $externalUrl = $rawImage;
                    } else {
                        // Strip /storage/ or public/ prefix so Filament's FileUpload finds it on the public disk
                        $imageFile = ltrim(preg_replace('#^/?(?:(?:storage|public)/)+#', '', trim($rawImage)), '/');
                    }
                }

                $sanitizedItems[] = [
                    'id' => $item['id'] ?? ('helix-item-' . ($idx + 1)),
                    'image_file' => $imageFile,
                    'image' => $externalUrl,
                    'is_active' => isset($item['is_active']) ? (bool) $item['is_active'] : true,
                    'sort_order' => (int) ($item['sort_order'] ?? ($idx + 1)),
                ];
            }
        }

        $this->form->fill([
            'home_helix_auto_rotate' => (bool) ($settings['home_helix_auto_rotate'] ?? true),
            'home_helix_auto_rotate_speed' => (string) ($settings['home_helix_auto_rotate_speed'] ?? '0.20'),
            'home_helix_visible_columns' => (string) ($settings['home_helix_visible_columns'] ?? '5'),
            'home_helix_tiers_count' => (string) ($settings['home_helix_tiers_count'] ?? '2'),
            'home_helix_show_header' => (bool) ($settings['home_helix_show_header'] ?? false),
            'home_helix_badge' => $settings['home_helix_badge'] ?? 'Galeri 3D Interaktif • Three.js',
            'home_helix_title' => $settings['home_helix_title'] ?? 'Helical Ribbon Showcase — Jejak Rasa Sanubari',
            'home_helix_subtitle' => $settings['home_helix_subtitle'] ?? 'Putar dan jelajahi arsip visual lereng Gunung Kawi, proses kurasi sangrai, dan suasana roastery dalam pita spiral 3D interaktif.',
            'home_helix_gallery_items' => $sanitizedItems,
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
                Section::make('Aturan Tampilan, Rotasi & Grid 3D Helix')
                    ->description('Atur kecepatan rotasi otomatis, jumlah gambar menyamping (kolom depan), dan formasi bertingkat.')
                    ->schema([
                        Grid::make(2)->schema([
                            Toggle::make('home_helix_auto_rotate')
                                ->label('Rotasi Otomatis Helix 360°')
                                ->helperText('Helix berputar secara otomatis saat pengguna idle/tidak menyentuh layar.')
                                ->default(true),

                            Select::make('home_helix_auto_rotate_speed')
                                ->label('Kecepatan Rotasi Otomatis')
                                ->options([
                                    '0.08' => 'Sangat Halus & Lambat (0.08)',
                                    '0.15' => 'Lambat Rileks (0.15)',
                                    '0.20' => 'Standar Rekomendasi (0.20)',
                                    '0.30' => 'Sedang Dinamis (0.30)',
                                    '0.45' => 'Cepat Aktif (0.45)',
                                ])
                                ->default('0.20')
                                ->required(),
                        ]),

                        Grid::make(2)->schema([
                            Select::make('home_helix_visible_columns')
                                ->label('Jumlah Gambar Menyamping di Depan (Kolom Grid)')
                                ->options([
                                    '3' => '3 Gambar Menyamping (Besar)',
                                    '4' => '4 Gambar Menyamping (Sedang)',
                                    '5' => '5 Gambar Menyamping (Standar Baru - Ramping)',
                                    '6' => '6 Gambar Menyamping (Padat)',
                                ])
                                ->default('5')
                                ->helperText('Menentukan jumlah panel yang tampak menghadap ke depan.')
                                ->required(),

                            Select::make('home_helix_tiers_count')
                                ->label('Jumlah Baris Bertingkat Vertikal')
                                ->options([
                                    '1' => '1 Baris Tunggal',
                                    '2' => '2 Baris Bertingkat (Rekomendasi)',
                                    '3' => '3 Baris Bertingkat',
                                ])
                                ->default('2')
                                ->helperText('Menentukan formasi susunan vertikal spiral.')
                                ->required(),
                        ]),

                        Grid::make(2)->schema([
                            Toggle::make('home_helix_show_header')
                                ->label('Tampilkan Header Judul di Atas Galeri')
                                ->helperText('Aktifkan jika ingin memunculkan badge & judul. Matikan untuk tampilan melayang bersih tanpa teks pengantar.')
                                ->default(false),

                            TextInput::make('home_helix_badge')
                                ->label('Badge Galeri')
                                ->default('Galeri 3D Interaktif • Three.js'),
                        ]),

                        Grid::make(2)->schema([
                            TextInput::make('home_helix_title')
                                ->label('Judul Utama Galeri')
                                ->default('Helical Ribbon Showcase — Jejak Rasa Sanubari'),

                            Textarea::make('home_helix_subtitle')
                                ->label('Deskripsi / Subtitle Galeri')
                                ->rows(2)
                                ->default('Putar dan jelajahi arsip visual lereng Gunung Kawi, proses kurasi sangrai, dan suasana roastery dalam pita spiral 3D interaktif.'),
                        ]),
                    ]),

                Section::make('Daftar Gambar Galeri Helix 3D')
                    ->description('Unggah gambar untuk galeri spiral 3D, atur urutan tampilan, atau hapus gambar yang tidak ingin ditampilkan.')
                    ->schema([
                        Repeater::make('home_helix_gallery_items')
                            ->label('Daftar Gambar Galeri Helix')
                            ->itemLabel(function (array $state): ?string {
                                $order = $state['sort_order'] ?? null;
                                $hasImg = !empty($state['image_file']) || !empty($state['image']);
                                $fileName = '';
                                if (!empty($state['image_file'])) {
                                    $filePath = is_array($state['image_file']) ? array_values($state['image_file'])[0] : $state['image_file'];
                                    $fileName = ' — ' . basename($filePath);
                                } elseif (!empty($state['image'])) {
                                    $fileName = ' — (URL Eksternal)';
                                }
                                $prefix = $order ? "Gambar #{$order}" : "Gambar";
                                return $hasImg ? "{$prefix} (Foto Terunggah{$fileName})" : "{$prefix} (Procedural/Default)";
                            })
                            ->schema([
                                Placeholder::make('image_preview')
                                    ->label('Pratinjau Foto Saat Ini')
                                    ->content(function ($get): HtmlString {
                                        $file = $get('image_file');
                                        $url = $get('image');
                                        $src = null;
                                        if (!empty($file)) {
                                            $filePath = is_array($file) ? array_values($file)[0] : $file;
                                            $clean = ltrim(preg_replace('#^/?(?:(?:storage|public)/)+#', '', trim($filePath)), '/');
                                            $src = '/storage/' . $clean;
                                        } elseif (!empty($url)) {
                                            $src = $url;
                                        }
                                        if (!$src) {
                                            return new HtmlString('<div class="text-xs text-gray-400 italic">Belum ada foto yang diunggah (menggunakan visual procedural 3D bawaan).</div>');
                                        }

                                        $fallbackAttr = '';
                                        if (str_starts_with($src, '/storage/')) {
                                            $prodUrl = 'https://sanubariroastery.co.id' . $src;
                                            $fallbackAttr = ' onerror="if(this.src!=\'' . e($prodUrl) . '\'){this.src=\'' . e($prodUrl) . '\';}"';
                                        }

                                        return new HtmlString('<div class="my-2 flex items-center gap-3 rounded-lg border border-gray-700/60 bg-gray-900/60 p-2"><img src="' . e($src) . '" alt="Pratinjau Foto" class="h-28 w-36 rounded-lg border border-gray-600 shadow-sm object-cover bg-black/20"' . $fallbackAttr . ' /><div class="flex flex-col gap-1 text-xs"><span class="text-xs text-gray-300 font-mono">' . e(basename($src)) . '</span><span class="text-[11px] text-gray-400 break-all">' . e($src) . '</span><a href="' . e($src) . '" target="_blank" rel="noopener noreferrer" class="text-[11px] text-amber-400 hover:text-amber-300 underline">Buka Ukuran Penuh ↗</a></div></div>');
                                    }),

                                FileUpload::make('image_file')
                                    ->label('Upload Foto / Gambar Baru / Ganti')
                                    ->disk('public')
                                    ->directory('helix-gallery')
                                    ->image()
                                    ->live()
                                    ->maxSize(5120)
                                    ->helperText('Unggah foto dengan rasio 4:3 (JPG, PNG, atau WebP).'),

                                TextInput::make('image')
                                    ->label('Atau URL Gambar Eksternal (Opsional)')
                                    ->live(onBlur: true)
                                    ->placeholder('https://... atau biarkan kosong jika mengunggah file di atas'),

                                Grid::make(2)->schema([
                                    Toggle::make('is_active')
                                        ->label('Tampilkan di Galeri')
                                        ->default(true),

                                    TextInput::make('sort_order')
                                        ->label('Urutan Tampil')
                                        ->numeric()
                                        ->default(0),
                                ]),
                            ])
                            ->collapsed()
                            ->collapsible()
                            ->reorderable()
                            ->cloneable(false)
                            ->addActionLabel('+ Tambah Gambar Baru')
                            ->columnSpanFull(),
                    ]),
            ]);
    }

    public function save(): void
    {
        $data = $this->form->getState();

        Setting::set('home_helix_auto_rotate', (bool) ($data['home_helix_auto_rotate'] ?? true));
        Setting::set('home_helix_auto_rotate_speed', (float) ($data['home_helix_auto_rotate_speed'] ?? 0.20));
        Setting::set('home_helix_visible_columns', (int) ($data['home_helix_visible_columns'] ?? 5));
        Setting::set('home_helix_tiers_count', (int) ($data['home_helix_tiers_count'] ?? 2));
        Setting::set('home_helix_show_header', (bool) ($data['home_helix_show_header'] ?? false));
        Setting::set('home_helix_badge', $data['home_helix_badge'] ?? 'Galeri 3D Interaktif • Three.js');
        Setting::set('home_helix_title', $data['home_helix_title'] ?? 'Helical Ribbon Showcase — Jejak Rasa Sanubari');
        Setting::set('home_helix_subtitle', $data['home_helix_subtitle'] ?? 'Putar dan jelajahi arsip visual lereng Gunung Kawi, proses kurasi sangrai, dan suasana roastery dalam pita spiral 3D interaktif.');

        $items = $data['home_helix_gallery_items'] ?? [];
        $savedItems = [];

        foreach ($items as $idx => $item) {
            $image = null;

            if (!empty($item['image_file'])) {
                $filePath = is_array($item['image_file']) ? array_values($item['image_file'])[0] : $item['image_file'];
                $cleanPath = ltrim(preg_replace('#^/?(?:(?:storage|public)/)+#', '', trim($filePath)), '/');
                $image = '/storage/' . $cleanPath;
            } elseif (!empty($item['image'])) {
                $image = trim($item['image']);
            }

            $savedItems[] = [
                'id' => $item['id'] ?? ('helix-item-' . ($idx + 1)),
                'title' => '',
                'subtitle' => null,
                'badge' => null,
                'category' => null,
                'description' => null,
                'image' => $image,
                'link_url' => null,
                'link_label' => null,
                'is_active' => isset($item['is_active']) ? (bool) $item['is_active'] : true,
                'sort_order' => (int) ($item['sort_order'] ?? ($idx + 1)),
            ];
        }

        Setting::set('home_helix_gallery_items', $savedItems);
        Cache::forget('sanubari_settings');

        Notification::make()
            ->title('Pengaturan Galeri 3D Helix Berhasil Disimpan!')
            ->body('Perubahan rotasi, jumlah grid kolom, dan daftar gambar galeri telah diperbarui secara langsung.')
            ->success()
            ->send();
    }

    protected function getFormActions(): array
    {
        return [
            Action::make('save')
                ->label('Simpan Pengaturan Galeri 3D')
                ->submit('save'),
        ];
    }
}

