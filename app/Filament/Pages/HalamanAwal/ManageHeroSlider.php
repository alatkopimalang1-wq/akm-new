<?php

namespace App\Filament\Pages\HalamanAwal;

use App\Models\Category;
use App\Models\Product;
use App\Models\Setting;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
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

class ManageHeroSlider extends Page
{
    protected static string|BackedEnum|null $navigationIcon = Heroicon::Photo;

    protected static string|\UnitEnum|null $navigationGroup = 'Halaman Awal';

    protected static ?string $navigationLabel = 'Hero Slider';

    protected static ?string $title = 'Pengaturan Hero Banner & Slider';

    protected static ?int $navigationSort = 1;

    /**
     * @var array<string, mixed> | null
     */
    public ?array $data = [];

    public function mount(): void
    {
        $settings = Setting::all()->pluck('value', 'key')->toArray();

        $defaultHeroSlides = [
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
        ];

        $rawSlides = $settings['home_hero_slides'] ?? $defaultHeroSlides;
        $normalizedSlides = [];
        if (is_array($rawSlides)) {
            foreach ($rawSlides as $slide) {
                $image = $slide['image'] ?? $slide['bgImage'] ?? null;
                if ($image) {
                    if (is_array($image)) {
                        $image = array_values($image)[0] ?? null;
                    }
                    if (is_string($image)) {
                        if (preg_match('#storage/(banners/[^?"\'\s]+)#', $image, $m)) {
                            $image = $m[1];
                        } elseif (str_contains($image, 'photo-1501339847302-ac426a4a7cbb')) {
                            $image = 'banners/slide-1.jpg';
                        } elseif (str_contains($image, 'photo-1514432324607-a09d9b4aefdd')) {
                            $image = 'banners/slide-2.jpg';
                        } elseif (str_contains($image, 'photo-1442512595331-e89e73853f31')) {
                            $image = 'banners/slide-3.jpg';
                        } elseif (str_contains($image, 'photo-1495474472287-4d71bcdd2085')) {
                            $image = 'banners/slide-4.jpg';
                        }
                    }
                }

                $linkType = $slide['link_type'] ?? null;
                $targetPage = $slide['link_target_page'] ?? null;
                $targetCategory = $slide['link_target_category'] ?? null;
                $targetProduct = $slide['link_target_product'] ?? null;
                $customUrl = $slide['link_custom_url'] ?? null;
                $openInNewTab = (bool) ($slide['open_in_new_tab'] ?? false);

                if (! $linkType) {
                    $href = $slide['url'] ?? $slide['ctaHref'] ?? null;
                    if (! $href || $href === '#') {
                        $linkType = 'none';
                    } elseif (in_array($href, ['/shop', '/cybr', '/shop/cybr', '/shop/byob', '/wholesale', '/jasa-roasting', '/roasting', '/training-barista', '/kursus-barista', '/kunjungi', '/panduan-seduh', '/blog', '/acara', '/tentang'])) {
                        $linkType = 'page';
                        $targetPage = $href;
                    } elseif (str_starts_with($href, '/shop?category=') || str_starts_with($href, '/shop?series=')) {
                        $linkType = 'category';
                        $targetCategory = str_replace(['/shop?category=', '/shop?series='], '', $href);
                    } else {
                        $linkType = 'custom';
                        $customUrl = $href;
                        if (str_starts_with($href, 'http')) {
                            $openInNewTab = true;
                        }
                    }
                }

                $normalizedSlides[] = [
                    'id' => $slide['id'] ?? ('slide-' . uniqid()),
                    'title' => $slide['title'] ?? '',
                    'image' => $image,
                    'link_type' => $linkType ?? 'page',
                    'link_target_page' => $targetPage ?? '/shop',
                    'link_target_category' => $targetCategory ?? null,
                    'link_target_product' => $targetProduct ?? null,
                    'link_custom_url' => $customUrl ?? null,
                    'open_in_new_tab' => $openInNewTab,
                ];
            }
        }

        $this->form->fill([
            'home_hero_slides' => $normalizedSlides,
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
                Section::make('Slider Banner Kampanye Promosi')
                    ->description('Kelola urutan visual banner sinematik dan tentukan tujuan tautan klik banner.')
                    ->schema([
                        Repeater::make('home_hero_slides')
                            ->label('Daftar Slide Banner Promosi')
                            ->itemLabel(function (array $state): ?string {
                                $title = ! empty($state['title']) ? $state['title'] : 'Slide Banner';
                                $hasImg = ! empty($state['image']);
                                return $title . ($hasImg ? ' • 📸 Banner Siap' : ' • ⚠️ Belum Ada Banner');
                            })
                            ->schema([
                                Placeholder::make('slide_preview')
                                    ->label('Pratinjau Banner Saat Ini')
                                    ->content(function ($get): HtmlString {
                                        $image = $get('image');
                                        $src = null;
                                        if (! empty($image)) {
                                            $path = is_array($image) ? array_values($image)[0] : $image;
                                            if (! empty($path)) {
                                                if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
                                                    $src = $path;
                                                } else {
                                                    $clean = ltrim(preg_replace('#^/?(?:(?:storage|public)/)+#', '', trim($path)), '/');
                                                    $src = '/storage/' . $clean;
                                                }
                                            }
                                        }

                                        if (! $src) {
                                            return new HtmlString('<div class="rounded-lg border border-dashed border-gray-700 p-3 text-center text-xs text-gray-400">Belum ada file gambar banner yang diunggah.</div>');
                                        }

                                        $fallbackAttr = '';
                                        if (str_starts_with($src, '/storage/')) {
                                            $prodUrl = 'https://sanubariroastery.co.id' . $src;
                                            $fallbackAttr = ' onerror="if(this.src!=\'' . e($prodUrl) . '\'){this.src=\'' . e($prodUrl) . '\';}"';
                                        }

                                        return new HtmlString(
                                            '<div class="flex items-center gap-4 rounded-xl border border-gray-700/60 bg-gray-900/60 p-3 shadow-inner my-1">' .
                                                '<div class="relative h-24 w-56 flex-shrink-0 overflow-hidden rounded-lg border border-gray-700 bg-black/40">' .
                                                    '<img src="' . e($src) . '" alt="Pratinjau Banner" class="h-full w-full object-cover transition-transform duration-300 hover:scale-105"' . $fallbackAttr . ' />' .
                                                '</div>' .
                                                '<div class="flex flex-col gap-1.5 text-xs text-gray-300 min-w-0">' .
                                                    '<div class="flex items-center gap-2 flex-wrap">' .
                                                        '<span class="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">Banner Aktif</span>' .
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
                                        ->label('Label Banner (Alt Text & SEO)')
                                        ->placeholder('contoh: Promo Biji Kawi Panen Segar')
                                        ->columnSpan(2),
                                    Toggle::make('open_in_new_tab')
                                        ->label('Buka di Tab Baru')
                                        ->inline(false)
                                        ->visible(fn ($get) => $get('link_type') && $get('link_type') !== 'none'),
                                ]),
                                FileUpload::make('image')
                                    ->label('File Gambar Banner')
                                    ->disk('public')
                                    ->directory('banners')
                                    ->image()
                                    ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
                                    ->maxSize(5120)
                                    ->helperText('Rekomendasi rasio banner: 1800 x 680 px. Format: WEBP, JPG, atau PNG.')
                                    ->required()
                                    ->columnSpanFull(),
                                Grid::make(2)->schema([
                                    Select::make('link_type')
                                        ->label('Tujuan Tautan (URL Target)')
                                        ->options([
                                            'none' => 'Tanpa Tautan (Hanya Banner Visual)',
                                            'page' => 'Halaman Utama (Shop, Wholesale, Showroom, dll)',
                                            'category' => 'Kategori Produk',
                                            'product' => 'Produk Tertentu',
                                            'custom' => 'URL Kustom / Tautan Luar',
                                        ])
                                        ->default('page')
                                        ->live()
                                        ->required(),
                                    Select::make('link_target_page')
                                        ->label('Pilih Halaman')
                                        ->options([
                                            '/shop' => 'Katalog Beli Kopi (/shop)',
                                            '/cybr' => 'Studio Racik Blend C.Y.B.R (/cybr)',
                                            '/shop/cybr' => 'Studio Racik Blend C.Y.B.R (/shop/cybr)',
                                            '/shop/byob' => 'Studio Racik Blend C.Y.B.R (Legacy /shop/byob)',
                                            '/wholesale' => 'Grosir & Kemitraan Kedai (/wholesale)',
                                            '/jasa-roasting' => 'Jasa Roasting Kopi Presisi (/jasa-roasting)',
                                            '/training-barista' => 'Training Barista & Sertifikasi (/training-barista)',
                                            '/kunjungi' => 'Roastery & Showroom Malang (/kunjungi)',
                                            '/panduan-seduh' => 'Panduan Seduh (/panduan-seduh)',
                                            '/blog' => 'Artikel Blog & Catatan Roaster (/blog)',
                                            '/acara' => 'Jadwal Acara & Cupping (/acara)',
                                            '/tentang' => 'Tentang Alat Kopi Malang (/tentang)',
                                        ])
                                        ->default('/shop')
                                        ->visible(fn ($get) => $get('link_type') === 'page')
                                        ->required(fn ($get) => $get('link_type') === 'page'),
                                    Select::make('link_target_category')
                                        ->label('Pilih Kategori Produk')
                                        ->options(fn () => Category::pluck('slug', 'slug')->mapWithKeys(function ($slug) {
                                            return [$slug => ucwords(str_replace('-', ' ', $slug))];
                                        })->toArray())
                                        ->searchable()
                                        ->visible(fn ($get) => $get('link_type') === 'category')
                                        ->required(fn ($get) => $get('link_type') === 'category'),
                                    Select::make('link_target_product')
                                        ->label('Pilih Produk Spesifik')
                                        ->options(fn () => Product::active()->pluck('name', 'slug')->toArray())
                                        ->searchable()
                                        ->visible(fn ($get) => $get('link_type') === 'product')
                                        ->required(fn ($get) => $get('link_type') === 'product'),
                                    TextInput::make('link_custom_url')
                                        ->label('Ketik URL Kustom')
                                        ->placeholder('e.g. /shop?series=kawi atau https://instagram.com/Alat Kopi Malang.roastery')
                                        ->visible(fn ($get) => $get('link_type') === 'custom')
                                        ->required(fn ($get) => $get('link_type') === 'custom'),
                                ]),
                            ])
                            ->defaultItems(2)
                            ->reorderable()
                            ->columnSpanFull(),
                    ]),
            ]);
    }

    public function save(): void
    {
        $data = $this->form->getState();

        if (isset($data['home_hero_slides']) && is_array($data['home_hero_slides'])) {
            $processedSlides = [];
            foreach ($data['home_hero_slides'] as $slide) {
                $linkType = $slide['link_type'] ?? 'none';
                $url = null;
                if ($linkType === 'page') {
                    $url = $slide['link_target_page'] ?? '/shop';
                } elseif ($linkType === 'category') {
                    $url = '/shop?category=' . ($slide['link_target_category'] ?? '');
                } elseif ($linkType === 'product') {
                    $productSlug = $slide['link_target_product'] ?? '';
                    $product = $productSlug ? Product::where('slug', $productSlug)->first() : null;
                    $url = $product ? "/shop/{$product->series}/{$product->slug}" : ($productSlug ? "/shop/kawi/{$productSlug}" : '/shop');
                } elseif ($linkType === 'custom') {
                    $url = $slide['link_custom_url'] ?? null;
                }

                $imagePath = $slide['image'] ?? null;
                if (is_array($imagePath)) {
                    $imagePath = array_values($imagePath)[0] ?? null;
                }
                $resolvedImageUrl = $imagePath;
                if ($imagePath && ! str_starts_with($imagePath, 'http://') && ! str_starts_with($imagePath, 'https://')) {
                    $cleanPath = ltrim($imagePath, '/');
                    if (str_starts_with($cleanPath, 'storage/')) {
                        $cleanPath = substr($cleanPath, 8);
                    }
                    $resolvedImageUrl = '/storage/' . $cleanPath;
                } elseif ($resolvedImageUrl && str_starts_with($resolvedImageUrl, 'http://')) {
                    $resolvedImageUrl = preg_replace('#^http://#', 'https://', $resolvedImageUrl);
                }

                $processedSlides[] = [
                    'id' => $slide['id'] ?? ('slide-' . uniqid()),
                    'title' => $slide['title'] ?? '',
                    'image' => $imagePath,
                    'bgImage' => $resolvedImageUrl,
                    'url' => $url,
                    'ctaHref' => $url ?? '#',
                    'link_type' => $linkType,
                    'link_target_page' => $slide['link_target_page'] ?? null,
                    'link_target_category' => $slide['link_target_category'] ?? null,
                    'link_target_product' => $slide['link_target_product'] ?? null,
                    'link_custom_url' => $slide['link_custom_url'] ?? null,
                    'open_in_new_tab' => (bool) ($slide['open_in_new_tab'] ?? false),
                ];
            }
            $data['home_hero_slides'] = $processedSlides;
        }

        Setting::set('home_hero_slides', $data['home_hero_slides'] ?? []);

        Cache::forget('sanubari_settings');

        Notification::make()
            ->title('Hero Slider Berhasil Disimpan!')
            ->body('Banner hero telah diperbarui dan langsung aktif di halaman depan.')
            ->success()
            ->send();
    }

    protected function getFormActions(): array
    {
        return [
            Action::make('save')
                ->label('Simpan Hero Slider')
                ->submit('save'),
        ];
    }
}
