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

class ManageNewRelease extends Page
{
    protected static string|BackedEnum|null $navigationIcon = Heroicon::Sparkles;

    protected static string|\UnitEnum|null $navigationGroup = 'Halaman Awal';

    protected static ?string $navigationLabel = 'New Release';

    protected static ?string $title = 'Pengaturan Bagian New Release (Home Page)';

    protected static ?int $navigationSort = 4;

    /**
     * @var array<string, mixed> | null
     */
    public ?array $data = [];

    public function mount(): void
    {
        $settings = Setting::all()->pluck('value', 'key')->toArray();

        $defaultNewReleaseItems = [
            [
                'id' => 'nr-1',
                'name' => 'Sungokong Persimon Natural SS Tank',
                'slug' => 'sungokong-persimon-natural',
                'category_id' => null,
                'price' => 120000,
                'original_price' => 150000,
                'image' => '/storage/products/sungokong.jpg',
                'badge' => 'NEW RELEASE',
                'stock_status' => 'Tersedia',
            ],
            [
                'id' => 'nr-2',
                'name' => 'Kawi Yellow Caturra Natural Filter',
                'slug' => 'kawi-yellow-caturra-natural',
                'category_id' => null,
                'price' => 100000,
                'original_price' => 125000,
                'image' => '/storage/products/yellow-caturra.jpg',
                'badge' => 'NEW RELEASE',
                'stock_status' => 'Tersedia',
            ],
            [
                'id' => 'nr-3',
                'name' => 'Java Jasmine Honey Process',
                'slug' => 'java-jasmine-honey',
                'category_id' => null,
                'price' => 115000,
                'original_price' => 140000,
                'image' => '/storage/products/java-jasmine.jpg',
                'badge' => 'NEW RELEASE',
                'stock_status' => 'Tersedia',
            ],
            [
                'id' => 'nr-4',
                'name' => 'Sanubari House Blend Arabica Signature',
                'slug' => 'sanubari-house-blend-signature',
                'category_id' => null,
                'price' => 95000,
                'original_price' => 110000,
                'image' => '/storage/products/houseblend.jpg',
                'badge' => 'NEW RELEASE',
                'stock_status' => 'Tersedia',
            ],
        ];

        $this->form->fill([
            'home_new_release_is_active' => (bool) ($settings['home_new_release_is_active'] ?? true),
            'home_new_release_badge' => $settings['home_new_release_badge'] ?? 'NEW RELEASE',
            'home_new_release_title' => $settings['home_new_release_title'] ?? 'New Release',
            'home_new_release_subtitle' => $settings['home_new_release_subtitle'] ?? 'Koleksi biji kopi dan racikan terbaru dari Sanubari Roastery',
            'home_new_release_button_text' => $settings['home_new_release_button_text'] ?? 'Lihat Semua',
            'home_new_release_button_url' => $settings['home_new_release_button_url'] ?? '/new-release',
            'home_new_release_items' => $settings['home_new_release_items'] ?? $defaultNewReleaseItems,
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
                Section::make('Status & Tampilan Banner New Release')
                    ->description('Atur visibilitas, badge, judul banner, serta tombol tautan menuju halaman produk New Release.')
                    ->schema([
                        Grid::make(3)->schema([
                            Toggle::make('home_new_release_is_active')
                                ->label('Status Aktif')
                                ->helperText('Tampilkan bagian New Release di halaman utama (posisi di atas Coffee Catering)')
                                ->default(true)
                                ->inline(false)
                                ->columnSpan(1),

                            TextInput::make('home_new_release_badge')
                                ->label('Label Badge')
                                ->placeholder('Contoh: NEW RELEASE atau KOLEKSI TERBARU')
                                ->default('NEW RELEASE')
                                ->required()
                                ->columnSpan(1),

                            TextInput::make('home_new_release_title')
                                ->label('Judul Bagian')
                                ->placeholder('Contoh: New Release')
                                ->default('New Release')
                                ->required()
                                ->columnSpan(1),
                        ]),

                        Grid::make(3)->schema([
                            TextInput::make('home_new_release_subtitle')
                                ->label('Subjudul / Keterangan')
                                ->placeholder('Contoh: Koleksi biji kopi dan racikan terbaru dari Sanubari Roastery')
                                ->default('Koleksi biji kopi dan racikan terbaru dari Sanubari Roastery')
                                ->required()
                                ->columnSpan(2),

                            TextInput::make('home_new_release_button_text')
                                ->label('Teks Tautan Lihat Semua')
                                ->placeholder('Contoh: Lihat Semua')
                                ->default('Lihat Semua')
                                ->required()
                                ->columnSpan(1),
                        ]),

                        TextInput::make('home_new_release_button_url')
                            ->label('URL Tautan Halaman Produk')
                            ->placeholder('Contoh: /new-release')
                            ->default('/new-release')
                            ->helperText('Halaman tujuan saat pengunjung mengklik Lihat Semua')
                            ->required(),
                    ]),

                Section::make('Daftar Produk New Release (Maksimal 4 Produk)')
                    ->description('Pilih hingga maksimal 4 produk unggulan terbaru yang akan ditampilkan pada kartu New Release di halaman utama.')
                    ->schema([
                        Repeater::make('home_new_release_items')
                            ->label('Daftar Produk New Release')
                            ->helperText('Maksimal 4 produk dapat ditampilkan pada menu ini.')
                            ->maxItems(4)
                            ->itemLabel(fn (array $state): ?string => ! empty($state['name']) ? ($state['name'] . ' (Rp ' . number_format((int) ($state['price'] ?? 0), 0, ',', '.') . ')') : 'Produk New Release')
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
                                                $set('badge', 'NEW RELEASE');
                                            }
                                        }),
                                ]),

                                Grid::make(2)->schema([
                                    TextInput::make('name')
                                        ->label('Nama Produk')
                                        ->placeholder('Contoh: Sungokong Persimon Natural')
                                        ->required(),

                                    TextInput::make('slug')
                                        ->label('Slug Halaman Produk')
                                        ->placeholder('contoh: sungokong-persimon-natural')
                                        ->helperText('Tautan saat kartu produk diklik'),
                                ]),

                                Grid::make(3)->schema([
                                    TextInput::make('price')
                                        ->label('Harga Jual (Rp)')
                                        ->numeric()
                                        ->prefix('Rp')
                                        ->placeholder('120000')
                                        ->required(),

                                    TextInput::make('original_price')
                                        ->label('Harga Coret / Asli (Opsional)')
                                        ->numeric()
                                        ->prefix('Rp')
                                        ->placeholder('150000')
                                        ->helperText('Kosongkan jika tidak ada coret'),

                                    TextInput::make('badge')
                                        ->label('Badge Produk')
                                        ->placeholder('NEW RELEASE')
                                        ->default('NEW RELEASE'),
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
                                        ->directory('newrelease')
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
                            ->addActionLabel('+ Tambah Produk New Release (Maks 4)')
                            ->columnSpanFull(),
                    ]),
            ]);
    }

    public function save(): void
    {
        $data = $this->form->getState();

        if (isset($data['home_new_release_items']) && is_array($data['home_new_release_items'])) {
            $processedItems = [];
            // Enforce maximum 4 products
            $itemsToProcess = array_slice($data['home_new_release_items'], 0, 4);

            foreach ($itemsToProcess as $index => $item) {
                $imageUrl = $item['image'] ?? '';
                if (! empty($item['image_upload'])) {
                    $imageUrl = str_starts_with($item['image_upload'], '/storage/')
                        ? $item['image_upload']
                        : '/storage/' . $item['image_upload'];
                }

                $processedItems[] = [
                    'id' => $item['id'] ?? ('nr-' . ($index + 1) . '-' . uniqid()),
                    'product_id' => $item['product_id'] ?? null,
                    'category_id' => $item['category_id'] ?? null,
                    'name' => $item['name'] ?? '',
                    'slug' => $item['slug'] ?? '',
                    'price' => (int) ($item['price'] ?? 0),
                    'original_price' => ! empty($item['original_price']) ? (int) $item['original_price'] : null,
                    'image' => $imageUrl,
                    'badge' => $item['badge'] ?? 'NEW RELEASE',
                    'stock_status' => $item['stock_status'] ?? 'Tersedia',
                ];
            }
            $data['home_new_release_items'] = $processedItems;
        }

        foreach ($data as $key => $value) {
            Setting::set($key, $value);
        }

        Cache::forget('sanubari_settings');

        Notification::make()
            ->title('Pengaturan New Release Berhasil Disimpan!')
            ->body('Produk dan tampilan menu New Release telah diperbarui.')
            ->success()
            ->send();
    }

    protected function getFormActions(): array
    {
        return [
            Action::make('save')
                ->label('Simpan Pengaturan New Release')
                ->submit('save'),
        ];
    }
}

