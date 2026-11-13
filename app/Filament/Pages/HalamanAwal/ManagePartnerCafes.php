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

class ManagePartnerCafes extends Page
{
    protected static string|BackedEnum|null $navigationIcon = Heroicon::BuildingStorefront;

    protected static string|\UnitEnum|null $navigationGroup = 'Halaman Awal';

    protected static ?string $navigationLabel = 'Kedai Pilihan';

    protected static ?string $title = 'Pengaturan Kedai Pilihan (Disajikan di Kedai Pilihan)';

    protected static ?int $navigationSort = 7;

    /**
     * @var array<string, mixed> | null
     */
    public ?array $data = [];

    public function mount(): void
    {
        $settings = Setting::all()->pluck('value', 'key')->toArray();

        $defaultSlides = [
            [
                'id' => 'gartenhaus',
                'title' => 'Gartenhaus Malang',
                'city' => 'MALANG',
                'image' => 'https://images.unsplash.com/photo-1497636577773-f1231844b336?auto=format&fit=crop&w=800&q=80',
                'href' => 'https://www.instagram.com/gartenhaus_co/',
                'open_in_new_tab' => true,
            ],
            [
                'id' => 'Alat Kopi Malang-roastery',
                'title' => 'Alat Kopi Malang Roasting Studio',
                'city' => 'MALANG',
                'image' => 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=800&q=80',
                'href' => '/kunjungi',
                'open_in_new_tab' => false,
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
                'title' => 'Oura Fee & Space',
                'city' => 'MALANG',
                'image' => 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
                'href' => 'https://www.instagram.com/ourafeesinema/',
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
        ];

        $rawSlides = $settings['home_partners_slides'] ?? $defaultSlides;
        $sanitizedSlides = [];
        if (is_array($rawSlides)) {
            foreach ($rawSlides as $index => $slide) {
                $rawImage = $slide['image'] ?? ($slide['image_upload'] ?? '');
                $diskPath = null;
                $externalUrl = null;

                if (! empty($rawImage)) {
                    if (str_starts_with($rawImage, 'http://') || str_starts_with($rawImage, 'https://')) {
                        $externalUrl = $rawImage;
                    } else {
                        // Strip /storage/ or public/ prefix so Filament's FileUpload finds it on the public disk
                        $diskPath = ltrim(preg_replace('#^/?(?:(?:storage|public)/)+#', '', trim($rawImage)), '/');
                    }
                }

                $sanitizedSlides[] = [
                    'id' => $slide['id'] ?? ('partner-' . ($index + 1) . '-' . uniqid()),
                    'title' => $slide['title'] ?? '',
                    'city' => $slide['city'] ?? 'MALANG',
                    'image' => $externalUrl ?? (! empty($diskPath) ? ('/storage/' . $diskPath) : $rawImage),
                    'image_upload' => $diskPath,
                    'href' => $slide['href'] ?? ($slide['url'] ?? ''),
                    'open_in_new_tab' => (bool) ($slide['open_in_new_tab'] ?? true),
                ];
            }
        }

        $this->form->fill([
            'home_partners_title' => $settings['home_partners_title'] ?? 'Disajikan di Kedai Pilihan',
            'home_partners_subtitle' => $settings['home_partners_subtitle'] ?? 'Temukan seduhan biji kopi sangrai Alat Kopi Malang di berbagai kedai kopi dan coffee space terkurasi di Malang',
            'home_partners_slides' => $sanitizedSlides,
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
                Section::make('Judul & Deskripsi Bagian')
                    ->description('Atur judul utama dan teks pengantar bagian Disajikan di Kedai Pilihan pada beranda.')
                    ->schema([
                        Grid::make(2)->schema([
                            TextInput::make('home_partners_title')
                                ->label('Judul Bagian')
                                ->default('Disajikan di Kedai Pilihan')
                                ->required(),
                            Textarea::make('home_partners_subtitle')
                                ->label('Subjudul / Deskripsi')
                                ->default('Temukan seduhan biji kopi sangrai Alat Kopi Malang di berbagai kedai kopi dan coffee space terkurasi di Malang')
                                ->rows(2)
                                ->required(),
                        ]),
                    ]),

                Section::make('Daftar Kedai Kopi & Coffee Space Pilihan')
                    ->description('Kelola daftar foto kedai kopi yang tampil di slider 3D Coverflow. Anda dapat menambah, mengedit nama, kota, foto, dan input link URL untuk setiap foto, serta menghapus atau mengurutkan posisi kedai.')
                    ->schema([
                        Repeater::make('home_partners_slides')
                            ->label('Daftar Kedai Mitra')
                            ->itemLabel(function (array $state): ?string {
                                $title = ! empty($state['title']) ? $state['title'] : 'Kedai Kopi';
                                $city = ! empty($state['city']) ? ' (' . $state['city'] . ')' : '';
                                $hasImg = ! empty($state['image_upload']) || ! empty($state['image']);
                                $imgBadge = $hasImg ? ' • 📸 Foto Siap' : ' • ⚠️ Belum Ada Foto';
                                return $title . $city . $imgBadge;
                            })
                            ->schema([
                                Placeholder::make('image_preview')
                                    ->label('Pratinjau Foto Kedai Saat Ini')
                                    ->content(function ($get): HtmlString {
                                        $upload = $get('image_upload');
                                        $img = $get('image');

                                        $src = null;
                                        if (! empty($upload)) {
                                            $path = is_array($upload) ? array_values($upload)[0] : $upload;
                                            if (! empty($path)) {
                                                $clean = ltrim(preg_replace('#^/?(?:(?:storage|public)/)+#', '', trim($path)), '/');
                                                $src = '/storage/' . $clean;
                                            }
                                        }
                                        if (! $src && ! empty($img)) {
                                            $src = $img;
                                        }

                                        if (! $src) {
                                            return new HtmlString('<div class="rounded-lg border border-dashed border-gray-700 p-3 text-center text-xs text-gray-400">Belum ada foto yang dipilih. Silakan unggah foto kedai atau masukkan URL foto di bawah.</div>');
                                        }

                                        $fallbackAttr = '';
                                        if (str_starts_with($src, '/storage/')) {
                                            $prodUrl = 'https://sanubariroastery.co.id' . $src;
                                            $fallbackAttr = ' onerror="if(this.src!=\'' . e($prodUrl) . '\'){this.src=\'' . e($prodUrl) . '\';}"';
                                        }

                                        return new HtmlString(
                                            '<div class="flex items-center gap-4 rounded-xl border border-gray-700/60 bg-gray-900/60 p-3 shadow-inner my-1">' .
                                                '<div class="relative h-28 w-44 flex-shrink-0 overflow-hidden rounded-lg border border-gray-700 bg-black/40">' .
                                                    '<img src="' . e($src) . '" alt="Pratinjau Foto Kedai" class="h-full w-full object-cover transition-transform duration-300 hover:scale-105"' . $fallbackAttr . ' />' .
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
                                    TextInput::make('title')
                                        ->label('Nama Kedai / Coffee Space')
                                        ->placeholder('Contoh: Gartenhaus Malang')
                                        ->required()
                                        ->columnSpan(2),
                                    TextInput::make('city')
                                        ->label('Kota / Wilayah')
                                        ->placeholder('Contoh: MALANG')
                                        ->default('MALANG')
                                        ->required()
                                        ->columnSpan(1),
                                ]),

                                Grid::make(2)->schema([
                                    TextInput::make('image')
                                        ->label('URL Foto Kedai')
                                        ->placeholder('https://... atau /storage/...')
                                        ->helperText('Otomatis terisi saat mengunggah foto baru, atau masukkan link gambar langsung.')
                                        ->live(onBlur: true)
                                        ->required(),

                                    FileUpload::make('image_upload')
                                        ->label('Atau Upload Foto Baru / Ganti')
                                        ->disk('public')
                                        ->directory('partners')
                                        ->image()
                                        ->maxSize(5120)
                                        ->live()
                                        ->helperText('Upload foto kedai/kopi (JPG, PNG, WEBP maks 5MB). Otomatis mengisi URL gambar saat disimpan.')
                                        ->dehydrateStateUsing(fn ($state) => $state ? (is_array($state) ? array_values($state)[0] : $state) : null),
                                ]),

                                Grid::make(3)->schema([
                                    TextInput::make('href')
                                        ->label('Link URL Tujuan Saat Foto Diklik')
                                        ->placeholder('Contoh: https://instagram.com/gartenhaus_co atau https://maps.google.com/... atau /kunjungi')
                                        ->helperText('Pengunjung yang mengklik foto kedai ini akan diarahkan ke URL ini.')
                                        ->columnSpan(2),

                                    Toggle::make('open_in_new_tab')
                                        ->label('Buka Link di Tab Baru')
                                        ->default(true)
                                        ->inline(false)
                                        ->columnSpan(1),
                                ]),
                            ])
                            ->collapsible()
                            ->collapsed(false)
                            ->cloneable()
                            ->reorderable()
                            ->addActionLabel('+ Tambah Kedai Pilihan')
                            ->columnSpanFull(),
                    ]),
            ]);
    }

    public function save(): void
    {
        $data = $this->form->getState();

        if (isset($data['home_partners_slides']) && is_array($data['home_partners_slides'])) {
            $processedSlides = [];
            foreach ($data['home_partners_slides'] as $index => $slide) {
                $imageUrl = $slide['image'] ?? '';
                $upload = $slide['image_upload'] ?? null;
                $diskPath = null;

                if (! empty($upload)) {
                    $uploadPath = is_array($upload) ? array_values($upload)[0] : $upload;
                    if (! empty($uploadPath)) {
                        $clean = ltrim(preg_replace('#^/?(?:(?:storage|public)/)+#', '', trim($uploadPath)), '/');
                        $imageUrl = '/storage/' . $clean;
                        $diskPath = $clean;
                    }
                } elseif (! empty($imageUrl) && ! str_starts_with($imageUrl, 'http')) {
                    $clean = ltrim(preg_replace('#^/?(?:(?:storage|public)/)+#', '', trim($imageUrl)), '/');
                    $imageUrl = '/storage/' . $clean;
                    $diskPath = $clean;
                }

                $processedSlides[] = [
                    'id' => $slide['id'] ?? ('partner-' . ($index + 1) . '-' . uniqid()),
                    'title' => $slide['title'] ?? '',
                    'city' => $slide['city'] ?? 'MALANG',
                    'image' => $imageUrl,
                    'image_upload' => $diskPath,
                    'href' => $slide['href'] ?? ($slide['url'] ?? ''),
                    'open_in_new_tab' => (bool) ($slide['open_in_new_tab'] ?? true),
                ];
            }
            $data['home_partners_slides'] = $processedSlides;
        }

        foreach ($data as $key => $value) {
            Setting::set($key, $value);
        }

        Cache::forget('sanubari_settings');

        Notification::make()
            ->title('Kedai Pilihan Berhasil Disimpan!')
            ->body('Daftar foto dan link URL kedai pilihan telah diperbarui.')
            ->success()
            ->send();
    }

    protected function getFormActions(): array
    {
        return [
            Action::make('save')
                ->label('Simpan Kedai Pilihan')
                ->submit('save'),
        ];
    }
}

