<?php

namespace App\Filament\Pages\HalamanAwal;

use App\Models\Category;
use App\Models\Product;
use App\Models\Setting;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
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
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;

class ManageFlashSale extends Page
{
    protected static string|BackedEnum|null $navigationIcon = Heroicon::Bolt;

    protected static string|\UnitEnum|null $navigationGroup = 'Halaman Awal';

    protected static ?string $navigationLabel = 'Flash Sale';

    protected static ?string $title = 'Pengaturan Promo Flash Sale';

    protected static ?int $navigationSort = 3;

    /**
     * @var array<string, mixed> | null
     */
    public ?array $data = [];

    public function mount(): void
    {
        $settings = Setting::all()->pluck('value', 'key')->toArray();

        $defaultFlashSaleItems = [
            [
                'id' => 'fs-1',
                'name' => 'Otten - Vietnam Drip XL',
                'slug' => 'otten-vietnam-drip-xl',
                'category_id' => null,
                'price' => 189000,
                'original_price' => 249000,
                'image' => '/storage/flashsale/vietnam_drip.jpg',
                'badge' => 'DISKON 24%',
                'stock_status' => 'Tersedia',
                'sold_percentage' => 78,
            ],
            [
                'id' => 'fs-2',
                'name' => 'Hario - Alat Seduh Saringan Kopi V60 Ceramic Cyan',
                'slug' => 'hario-v60-ceramic-cyan',
                'category_id' => null,
                'price' => 159000,
                'original_price' => 200000,
                'image' => '/storage/flashsale/v60_dripper.jpg',
                'badge' => 'FLASH SALE',
                'stock_status' => 'Tersedia',
                'sold_percentage' => 85,
            ],
            [
                'id' => 'fs-3',
                'name' => 'Fellow - Rocky Lowball Tumblers (Matte White / Black)',
                'slug' => 'fellow-rocky-lowball-tumblers',
                'category_id' => null,
                'price' => 395000,
                'original_price' => 495000,
                'image' => '/storage/flashsale/fellow_tumbler.jpg',
                'badge' => 'DISKON 20%',
                'stock_status' => 'Tersedia',
                'sold_percentage' => 62,
            ],
            [
                'id' => 'fs-4',
                'name' => 'Hario V60 Station VSS-1-OV Olive Wood',
                'slug' => 'hario-v60-station-olive-wood',
                'category_id' => null,
                'price' => 1850000,
                'original_price' => 2310000,
                'image' => '/storage/flashsale/v60_wood_station.jpg',
                'badge' => 'FLASH SALE',
                'stock_status' => 'Sisa 4 unit',
                'sold_percentage' => 92,
            ],
        ];

        $defaultEndTime = Carbon::now()->addDays(2)->format('Y-m-d H:i:s');
        $defaultStartTime = Carbon::now()->format('Y-m-d H:i:s');

        $this->form->fill([
            'home_flash_sale_is_active' => $settings['home_flash_sale_is_active'] ?? true,
            'home_flash_sale_title' => $settings['home_flash_sale_title'] ?? 'FLASH SALE',
            'home_flash_sale_subtitle' => $settings['home_flash_sale_subtitle'] ?? 'Penawaran terbatas harga terbaik hari ini',
            'home_flash_sale_start_time' => $settings['home_flash_sale_start_time'] ?? $defaultStartTime,
            'home_flash_sale_end_time' => $settings['home_flash_sale_end_time'] ?? $defaultEndTime,
            'home_flash_sale_items' => $settings['home_flash_sale_items'] ?? $defaultFlashSaleItems,
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
                Section::make('Jadwal Waktu & Status Flash Sale')
                    ->description('Atur waktu mulai, batas akhir promo (hitung mundur timer), serta judul banner.')
                    ->schema([
                        Grid::make(3)->schema([
                            Toggle::make('home_flash_sale_is_active')
                                ->label('Status Aktif')
                                ->helperText('Tampilkan bagian flash sale di beranda & katalog promo')
                                ->default(true)
                                ->inline(false)
                                ->columnSpan(1),

                            DateTimePicker::make('home_flash_sale_start_time')
                                ->label('Waktu Mulai Promo')
                                ->helperText('Waktu dimulainya promo flash sale')
                                ->seconds(false)
                                ->columnSpan(1),

                            DateTimePicker::make('home_flash_sale_end_time')
                                ->label('Waktu Berakhir Promo (Hitung Mundur)')
                                ->helperText('Timer hitung mundur di website akan menghitung mundur ke jam ini')
                                ->seconds(false)
                                ->required()
                                ->columnSpan(1),
                        ]),

                        Grid::make(2)->schema([
                            TextInput::make('home_flash_sale_title')
                                ->label('Judul Banner')
                                ->placeholder('Contoh: FLASH SALE')
                                ->default('FLASH SALE')
                                ->required(),

                            TextInput::make('home_flash_sale_subtitle')
                                ->label('Subjudul / Keterangan')
                                ->placeholder('Contoh: Penawaran terbatas harga terbaik hari ini')
                                ->default('Penawaran terbatas harga terbaik hari ini')
                                ->required(),
                        ]),
                    ]),

                Section::make('Pengaturan Produk Flash Sale (Berdasarkan Kategori)')
                    ->description('Pilih kategori produk untuk memfilter daftar produk, lalu pilih produk yang akan diikutsertakan dalam promo flash sale beserta harga khusus dan stoknya.')
                    ->schema([
                        Repeater::make('home_flash_sale_items')
                            ->label('Daftar Produk Flash Sale')
                            ->itemLabel(fn (array $state): ?string => ! empty($state['name']) ? ($state['name'] . ' (Rp ' . number_format((int) ($state['price'] ?? 0), 0, ',', '.') . ')') : 'Produk Flash Sale')
                            ->schema([
                                Grid::make(2)->schema([
                                    Select::make('category_id')
                                        ->label('1. Filter Kategori Produk')
                                        ->placeholder('-- Semua Kategori (Pilih untuk memfilter) --')
                                        ->options(function () {
                                            return Category::all()->mapWithKeys(function ($cat) {
                                                $name = is_array($cat->name) ? ($cat->name['id'] ?? reset($cat->name)) : $cat->name;
                                                return [$cat->id => $name];
                                            })->toArray();
                                        })
                                        ->live()
                                        ->afterStateUpdated(fn ($set) => $set('product_id', null)),

                                    Select::make('product_id')
                                        ->label('2. Pilih Produk')
                                        ->placeholder('-- Pilih Produk dari Katalog --')
                                        ->options(function ($get) {
                                            $categoryId = $get('category_id');
                                            $query = Product::active();
                                            if ($categoryId) {
                                                $query->whereHas('categories', fn ($q) => $q->where('categories.id', $categoryId));
                                            }
                                            return $query->pluck('name', 'id')->toArray();
                                        })
                                        ->searchable()
                                        ->live()
                                        ->afterStateUpdated(function ($state, $set) {
                                            if (! $state) return;
                                            $product = Product::with(['images', 'variants'])->find($state);
                                            if ($product) {
                                                $set('name', $product->name);
                                                $set('slug', $product->slug);
                                                $origPrice = (int) $product->min_price;
                                                $set('original_price', $origPrice);
                                                // Default 20% discount
                                                $set('price', (int) round($origPrice * 0.8));
                                                $img = $product->images->firstWhere('is_primary', true) ?? $product->images->first();
                                                if ($img) {
                                                    $imgPath = $img->path;
                                                    $set('image', str_starts_with($imgPath, 'http') || str_starts_with($imgPath, '/') ? $imgPath : '/storage/' . $imgPath);
                                                }
                                            }
                                        }),
                                ]),

                                Grid::make(3)->schema([
                                    TextInput::make('name')
                                        ->label('Nama Produk Promo')
                                        ->placeholder('Contoh: Hario V60 Ceramic Cyan')
                                        ->required()
                                        ->columnSpan(2),

                                    TextInput::make('slug')
                                        ->label('Slug Halaman Produk')
                                        ->placeholder('contoh: hario-v60-ceramic-cyan')
                                        ->helperText('Tautan saat produk diklik di toko')
                                        ->columnSpan(1),
                                ]),

                                Grid::make(2)->schema([
                                    TextInput::make('price')
                                        ->label('Harga Flash Sale (Rp)')
                                        ->numeric()
                                        ->prefix('Rp')
                                        ->placeholder('159000')
                                        ->required(),

                                    TextInput::make('original_price')
                                        ->label('Harga Normal / Coret (Rp)')
                                        ->numeric()
                                        ->prefix('Rp')
                                        ->placeholder('200000'),

                                    TextInput::make('badge')
                                        ->label('Badge Promo')
                                        ->placeholder('FLASH SALE')
                                        ->default('FLASH SALE'),

                                    TextInput::make('stock_status')
                                        ->label('Keterangan Stok')
                                        ->placeholder('Tersedia / Sisa 4 unit')
                                        ->default('Tersedia'),
                                ]),

                                Grid::make(2)->schema([
                                    TextInput::make('image')
                                        ->label('URL Foto Produk')
                                        ->placeholder('/storage/... atau https://...')
                                        ->helperText('Foto yang ditampilkan pada kartu flash sale')
                                        ->required(),

                                    FileUpload::make('image_upload')
                                        ->label('Atau Upload Foto Khusus Promo')
                                        ->disk('public')
                                        ->directory('flashsale')
                                        ->image()
                                        ->maxSize(5120)
                                        ->helperText('Upload foto banner/produk khusus (JPG, PNG, WEBP maks 5MB)')
                                        ->dehydrateStateUsing(fn ($state) => $state ? '/storage/' . $state : null),
                                ]),
                            ])
                            ->collapsible()
                            ->collapsed(false)
                            ->cloneable()
                            ->reorderable()
                            ->addActionLabel('+ Tambah Produk Flash Sale')
                            ->columnSpanFull(),
                    ]),
            ]);
    }

    public function save(): void
    {
        $data = $this->form->getState();

        if (isset($data['home_flash_sale_items']) && is_array($data['home_flash_sale_items'])) {
            $processedItems = [];
            foreach ($data['home_flash_sale_items'] as $index => $item) {
                $imageUrl = $item['image'] ?? '';
                if (! empty($item['image_upload'])) {
                    $imageUrl = str_starts_with($item['image_upload'], '/storage/')
                        ? $item['image_upload']
                        : '/storage/' . $item['image_upload'];
                }

                $processedItems[] = [
                    'id' => $item['id'] ?? ('fs-' . ($index + 1) . '-' . uniqid()),
                    'product_id' => $item['product_id'] ?? null,
                    'category_id' => $item['category_id'] ?? null,
                    'name' => $item['name'] ?? '',
                    'slug' => $item['slug'] ?? '',
                    'price' => (int) ($item['price'] ?? 0),
                    'original_price' => ! empty($item['original_price']) ? (int) $item['original_price'] : null,
                    'image' => $imageUrl,
                    'badge' => $item['badge'] ?? 'FLASH SALE',
                    'stock_status' => $item['stock_status'] ?? 'Tersedia',
                    'sold_percentage' => (int) ($item['sold_percentage'] ?? 75),
                ];
            }
            $data['home_flash_sale_items'] = $processedItems;
        }

        foreach ($data as $key => $value) {
            Setting::set($key, $value);
        }

        Cache::forget('sanubari_settings');

        Notification::make()
            ->title('Pengaturan Flash Sale Berhasil Disimpan!')
            ->body('Produk dan jadwal waktu flash sale telah diperbarui.')
            ->success()
            ->send();
    }

    protected function getFormActions(): array
    {
        return [
            Action::make('save')
                ->label('Simpan Pengaturan Flash Sale')
                ->submit('save'),
        ];
    }
}

