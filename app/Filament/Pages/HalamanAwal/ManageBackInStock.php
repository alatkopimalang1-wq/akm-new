<?php

namespace App\Filament\Pages\HalamanAwal;

use App\Models\Category;
use App\Models\Product;
use App\Models\Setting;
use BackedEnum;
use Filament\Actions\Action;
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
use Illuminate\Support\Facades\Cache;

class ManageBackInStock extends Page
{
    protected static string|BackedEnum|null $navigationIcon = Heroicon::ArrowPathRoundedSquare;

    protected static string|\UnitEnum|null $navigationGroup = 'Halaman Awal';

    protected static ?string $navigationLabel = 'Back in Stock';

    protected static ?string $title = 'Pengaturan Bagian Back in Stock (Home Page)';

    protected static ?int $navigationSort = 6;

    /**
     * @var array<string, mixed> | null
     */
    public ?array $data = [];

    public function mount(): void
    {
        $settings = Setting::all()->pluck('value', 'key')->toArray();

        $defaultBackInStockItems = [
            [
                'id' => 'bis-1',
                'name' => 'Arabika Java Ijen Fullwash',
                'slug' => 'arabika-java-ijen-fullwash',
                'category_id' => null,
                'price' => 28000,
                'original_price' => 35000,
                'image' => '/storage/products/java-ijen.jpg',
                'badge' => 'BACK IN STOCK',
                'stock_status' => 'Tersedia',
            ],
            [
                'id' => 'bis-2',
                'name' => 'Arabika Flores Bajawa Fullwash',
                'slug' => 'arabika-flores-bajawa-fullwash',
                'category_id' => null,
                'price' => 28000,
                'original_price' => 35000,
                'image' => '/storage/products/flores-bajawa.jpg',
                'badge' => 'BACK IN STOCK',
                'stock_status' => 'Tersedia',
            ],
            [
                'id' => 'bis-3',
                'name' => 'Paket 3 item Box Exclusive KAMOJANG MOOD SERIES',
                'slug' => 'paket-3-item-kamojang-mood-series',
                'category_id' => null,
                'price' => 175000,
                'original_price' => 200000,
                'image' => '/storage/products/kamojang.jpg',
                'badge' => 'BACK IN STOCK',
                'stock_status' => 'Tersedia',
            ],
            [
                'id' => 'bis-4',
                'name' => 'Paket 3 item Box Exclusive Co-Ferment SERIES',
                'slug' => 'paket-3-item-co-ferment-series',
                'category_id' => null,
                'price' => 190000,
                'original_price' => 220000,
                'image' => '/storage/products/co-ferment.jpg',
                'badge' => 'BACK IN STOCK',
                'stock_status' => 'Tersedia',
            ],
        ];

        $this->form->fill([
            'home_back_in_stock_is_active' => (bool) ($settings['home_back_in_stock_is_active'] ?? true),
            'home_back_in_stock_badge' => $settings['home_back_in_stock_badge'] ?? 'BACK IN STOCK',
            'home_back_in_stock_title' => $settings['home_back_in_stock_title'] ?? 'Back in Stock',
            'home_back_in_stock_subtitle' => $settings['home_back_in_stock_subtitle'] ?? 'Koleksi biji kopi dan produk favorit yang kini kembali tersedia',
            'home_back_in_stock_button_text' => $settings['home_back_in_stock_button_text'] ?? 'Lihat Semua',
            'home_back_in_stock_button_url' => $settings['home_back_in_stock_button_url'] ?? '/back-in-stock',
            'home_back_in_stock_items' => $settings['home_back_in_stock_items'] ?? $defaultBackInStockItems,
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
                Section::make('Status & Tampilan Banner Back in Stock')
                    ->description('Atur visibilitas, badge, judul banner, serta tombol tautan menuju halaman produk Back in Stock.')
                    ->schema([
                        Grid::make(3)->schema([
                            Toggle::make('home_back_in_stock_is_active')
                                ->label('Status Aktif')
                                ->helperText('Tampilkan bagian Back in Stock di halaman utama (posisi di bawah Booking Tempat)')
                                ->default(true)
                                ->inline(false)
                                ->columnSpan(1),

                            TextInput::make('home_back_in_stock_badge')
                                ->label('Label Badge')
                                ->placeholder('Contoh: BACK IN STOCK atau KEMBALI TERSEDIA')
                                ->default('BACK IN STOCK')
                                ->required()
                                ->columnSpan(1),

                            TextInput::make('home_back_in_stock_title')
                                ->label('Judul Bagian')
                                ->placeholder('Contoh: Back in Stock')
                                ->default('Back in Stock')
                                ->required()
                                ->columnSpan(1),
                        ]),

                        Grid::make(3)->schema([
                            TextInput::make('home_back_in_stock_subtitle')
                                ->label('Subjudul / Keterangan')
                                ->placeholder('Contoh: Koleksi biji kopi dan produk favorit yang kini kembali tersedia')
                                ->default('Koleksi biji kopi dan produk favorit yang kini kembali tersedia')
                                ->required()
                                ->columnSpan(2),

                            TextInput::make('home_back_in_stock_button_text')
                                ->label('Teks Tautan Lihat Semua')
                                ->placeholder('Contoh: Lihat Semua')
                                ->default('Lihat Semua')
                                ->required()
                                ->columnSpan(1),
                        ]),

                        TextInput::make('home_back_in_stock_button_url')
                            ->label('URL Tautan Halaman Produk')
                            ->placeholder('Contoh: /back-in-stock')
                            ->default('/back-in-stock')
                            ->helperText('Halaman tujuan saat pengunjung mengklik Lihat Semua')
                            ->required(),
                    ]),

                Section::make('Daftar Produk Back in Stock (Maksimal 4 Produk)')
                    ->description('Pilih hingga maksimal 4 produk favorit yang kembali restock untuk ditampilkan pada kartu Back in Stock di halaman utama.')
                    ->schema([
                        Repeater::make('home_back_in_stock_items')
                            ->label('Daftar Produk Back in Stock')
                            ->helperText('Maksimal 4 produk dapat ditampilkan pada menu ini.')
                            ->maxItems(4)
                            ->itemLabel(fn (array $state): ?string => ! empty($state['name']) ? ($state['name'] . ' (Rp ' . number_format((int) ($state['price'] ?? 0), 0, ',', '.') . ')') : 'Produk Back in Stock')
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
                                        ->label('2. Pilih Produk dari Katalog')
                                        ->placeholder('-- Pilih Produk --')
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
                                                $set('price', $origPrice);
                                                $img = $product->images->firstWhere('is_primary', true) ?? $product->images->first();
                                                if ($img) {
                                                    $imgPath = $img->path;
                                                    $set('image', str_starts_with($imgPath, 'http') || str_starts_with($imgPath, '/') ? $imgPath : '/storage/' . $imgPath);
                                                }
                                                $set('badge', 'BACK IN STOCK');
                                            }
                                        }),
                                ]),

                                Grid::make(2)->schema([
                                    TextInput::make('name')
                                        ->label('Nama Produk')
                                        ->placeholder('Contoh: Arabika Java Ijen Fullwash')
                                        ->required(),

                                    TextInput::make('slug')
                                        ->label('Slug Halaman Produk')
                                        ->placeholder('contoh: arabika-java-ijen-fullwash')
                                        ->helperText('Tautan saat kartu produk diklik'),
                                ]),

                                Grid::make(3)->schema([
                                    TextInput::make('price')
                                        ->label('Harga Jual (Rp)')
                                        ->numeric()
                                        ->prefix('Rp')
                                        ->placeholder('28000')
                                        ->required(),

                                    TextInput::make('original_price')
                                        ->label('Harga Coret / Asli (Opsional)')
                                        ->numeric()
                                        ->prefix('Rp')
                                        ->placeholder('35000')
                                        ->helperText('Kosongkan jika tidak ada coret'),

                                    TextInput::make('badge')
                                        ->label('Badge Produk')
                                        ->placeholder('BACK IN STOCK')
                                        ->default('BACK IN STOCK'),
                                ]),

                                Grid::make(2)->schema([
                                    TextInput::make('image')
                                        ->label('URL Foto Produk')
                                        ->placeholder('/storage/... atau https://...')
                                        ->helperText('Foto yang ditampilkan pada kartu produk')
                                        ->required(),

                                    FileUpload::make('image_upload')
                                        ->label('Atau Upload Foto Khusus')
                                        ->disk('public')
                                        ->directory('backinstock')
                                        ->image()
                                        ->maxSize(5120)
                                        ->helperText('Upload foto JPG, PNG, WEBP maks 5MB')
                                        ->dehydrateStateUsing(fn ($state) => $state ? '/storage/' . $state : null),
                                ]),
                            ])
                            ->collapsible()
                            ->collapsed(false)
                            ->cloneable()
                            ->reorderable()
                            ->addActionLabel('+ Tambah Produk Back in Stock (Maks 4)')
                            ->columnSpanFull(),
                    ]),
            ]);
    }

    public function save(): void
    {
        $data = $this->form->getState();

        if (isset($data['home_back_in_stock_items']) && is_array($data['home_back_in_stock_items'])) {
            $processedItems = [];
            // Enforce maximum 4 products
            $itemsToProcess = array_slice($data['home_back_in_stock_items'], 0, 4);

            foreach ($itemsToProcess as $index => $item) {
                $imageUrl = $item['image'] ?? '';
                if (! empty($item['image_upload'])) {
                    $imageUrl = str_starts_with($item['image_upload'], '/storage/')
                        ? $item['image_upload']
                        : '/storage/' . $item['image_upload'];
                }

                $processedItems[] = [
                    'id' => $item['id'] ?? ('bis-' . ($index + 1) . '-' . uniqid()),
                    'product_id' => $item['product_id'] ?? null,
                    'category_id' => $item['category_id'] ?? null,
                    'name' => $item['name'] ?? '',
                    'slug' => $item['slug'] ?? '',
                    'price' => (int) ($item['price'] ?? 0),
                    'original_price' => ! empty($item['original_price']) ? (int) $item['original_price'] : null,
                    'image' => $imageUrl,
                    'badge' => $item['badge'] ?? 'BACK IN STOCK',
                    'stock_status' => $item['stock_status'] ?? 'Tersedia',
                ];
            }
            $data['home_back_in_stock_items'] = $processedItems;
        }

        foreach ($data as $key => $value) {
            Setting::set($key, $value);
        }

        Cache::forget('sanubari_settings');

        Notification::make()
            ->title('Pengaturan Back in Stock Berhasil Disimpan!')
            ->body('Produk dan tampilan menu Back in Stock telah diperbarui.')
            ->success()
            ->send();
    }

    protected function getFormActions(): array
    {
        return [
            Action::make('save')
                ->label('Simpan Pengaturan Back in Stock')
                ->submit('save'),
        ];
    }
}

