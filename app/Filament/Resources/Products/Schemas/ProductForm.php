<?php

namespace App\Filament\Resources\Products\Schemas;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class ProductForm
{
    public static function getCategoryOptions(): array
    {
        return Category::query()
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get()
            ->mapWithKeys(function ($cat) {
                $name = is_array($cat->name) ? ($cat->name['id'] ?? reset($cat->name)) : ($cat->name ?: $cat->slug);
                $prefix = $cat->parent_id ? '↳ ' : '';

                return [(string) $cat->id => $prefix . $name];
            })
            ->toArray();
    }

    public static function getProductOptions(): array
    {
        return Product::query()
            ->where('slug', '!=', 'byob')
            ->orderBy('name')
            ->get()
            ->mapWithKeys(function ($prod) {
                $brand = $prod->producer ? "[{$prod->producer}] " : '';
                $price = 'Rp ' . number_format((float) $prod->min_price, 0, ',', '.');

                return [(string) $prod->id => "{$brand}{$prod->name} ({$price})"];
            })
            ->toArray();
    }

    public static function configure(Schema $schema): Schema
    {
        $categoryOptions = static::getCategoryOptions();
        $productOptions = static::getProductOptions();

        return $schema
            ->columns(1)
            ->components([
                Section::make('Informasi Produk & Brand')
                    ->columnSpanFull()
                    ->schema([
                        Grid::make(2)->schema([
                            TextInput::make('name')
                                ->label('Nama Produk')
                                ->placeholder('Contoh: La Marzocco Linea Mini R Espresso Machine')
                                ->required()
                                ->live(onBlur: true)
                                ->afterStateUpdated(function ($state, callable $set, callable $get) {
                                    if (! empty($state) && empty($get('slug'))) {
                                        $set('slug', Str::slug($state));
                                    }
                                }),
                            TextInput::make('slug')
                                ->label('Slug URL Produk')
                                ->required()
                                ->unique(ignoreRecord: true),
                        ]),
                        Grid::make(2)->schema([
                            Select::make('producer')
                                ->label('Brand Produk')
                                ->placeholder('Pilih Brand Produk...')
                                ->options(function (?Product $record) {
                                    $options = Brand::query()
                                        ->orderBy('sort_order')
                                        ->orderBy('name')
                                        ->pluck('name', 'name')
                                        ->toArray();

                                    if ($record && ! empty($record->producer) && ! isset($options[$record->producer])) {
                                        $options[$record->producer] = $record->producer;
                                    }

                                    return $options;
                                })
                                ->searchable()
                                ->preload()
                                ->required()
                                ->createOptionForm([
                                    TextInput::make('name')
                                        ->label('Nama Brand Baru')
                                        ->placeholder('Contoh: La Marzocco, Hario, Mahlkönig...')
                                        ->required(),
                                    TextInput::make('origin')
                                        ->label('Negara / Kota Asal Brand (Opsional)')
                                        ->placeholder('Contoh: Florence, Italy'),
                                ])
                                ->createOptionUsing(function (array $data): string {
                                    $brand = Brand::firstOrCreate(
                                        ['name' => trim($data['name'])],
                                        [
                                            'slug' => Str::slug($data['name']),
                                            'origin' => $data['origin'] ?? null,
                                            'is_active' => true,
                                        ]
                                    );

                                    return $brand->name;
                                })
                                ->live()
                                ->afterStateUpdated(function ($state, callable $set) {
                                    if (! empty($state)) {
                                        $set('series', $state);
                                    }
                                }),
                            Select::make('categories')
                                ->label('Kategori Produk')
                                ->relationship('categories', 'slug')
                                ->getOptionLabelFromRecordUsing(fn ($record) => is_array($record->name) ? ($record->name['id'] ?? $record->slug) : ($record->name ?: $record->slug))
                                ->multiple()
                                ->searchable()
                                ->preload()
                                ->required(),
                        ]),
                        Grid::make(3)->schema([
                            Select::make('status')
                                ->label('Status Tampil')
                                ->options([
                                    'active' => 'Aktif (Ditampilkan)',
                                    'archived' => 'Arsip (Disembunyikan)',
                                ])
                                ->required()
                                ->default('active'),
                            Select::make('stock_status')
                                ->label('Status Stok')
                                ->options([
                                    'in_stock' => 'Tersedia (In Stock)',
                                    'pre_order' => 'Pre-Order',
                                    'out_of_stock' => 'Stok Habis (Sold Out)',
                                ])
                                ->required()
                                ->default('in_stock')
                                ->live()
                                ->afterStateUpdated(function ($state, callable $set) {
                                    if ($state === 'pre_order') {
                                        $set('is_preorder', true);
                                    }
                                }),
                            DateTimePicker::make('released_at')
                                ->label('Tanggal Rilis')
                                ->default(now()),
                        ]),
                        Grid::make(4)->schema([
                            Toggle::make('is_featured')
                                ->label('Produk Unggulan (Best Seller)'),
                            Toggle::make('is_new')
                                ->label('Tandai Sebagai Produk Baru'),
                            Toggle::make('is_preorder')
                                ->label('Pre-Order'),
                            Toggle::make('is_custom_bundle')
                                ->label('Produk Paket Custom (Custom Bundling)')
                                ->live(),
                        ]),
                    ]),

                Section::make('Pengaturan Slot Produk Paket Custom (Custom Bundling)')
                    ->description('Atur kotak-kotak slot pemilihan produk (Slot Wajib +, Slot GRATIS Rp0, dan Slot OPTIONAL) beserta diskon harga coret pada masing-masing slot.')
                    ->columnSpanFull()
                    ->visible(fn (callable $get): bool => (bool) $get('is_custom_bundle'))
                    ->schema([
                        Repeater::make('bundle_config.slots')
                            ->label('Daftar Kotak Slot Paket (Urutan Kotak di Halaman Produk)')
                            ->defaultItems(0)
                            ->reorderable()
                            ->collapsible()
                            ->addActionLabel('+ Tambah Kotak Slot Paket')
                            ->itemLabel(function (array $state): string {
                                $type = match ($state['slot_type'] ?? 'required') {
                                    'free' => '🎁 SLOT GRATIS (Rp 0)',
                                    'optional' => '🏷️ SLOT OPTIONAL (Opsional)',
                                    default => '➕ SLOT WAJIB (Pilih Produk)',
                                };
                                $label = ! empty($state['slot_label']) ? " — {$state['slot_label']}" : '';

                                return "{$type}{$label}";
                            })
                            ->schema([
                                Grid::make(2)->schema([
                                    Select::make('slot_type')
                                        ->label('Jenis Kotak Slot')
                                        ->options([
                                            'required' => 'Slot Produk Wajib (+ Please select a product!)',
                                            'optional' => 'Slot Produk Opsional (Pita OPTIONAL + Please select a product!)',
                                            'free' => 'Slot Produk GRATIS / Bonus Bawaan (GRATIS Rp0)',
                                        ])
                                        ->default('required')
                                        ->required()
                                        ->live(),
                                    TextInput::make('slot_label')
                                        ->label('Judul / Petunjuk Slot (Opsional)')
                                        ->placeholder('Contoh: Pilih Mesin Espresso / Please select a product!')
                                        ->default('Please select a product!'),
                                ]),

                                // Untuk Slot Wajib & Slot Optional: Pilih berdasarkan Kategori dan/atau Produk Spesifik
                                Grid::make(2)
                                    ->visible(fn (callable $get): bool => in_array($get('slot_type') ?? 'required', ['required', 'optional']))
                                    ->schema([
                                        Select::make('category_ids')
                                            ->label('Pilih Berdasarkan Kategori Produk (Otomatis Memuat Produk di Kategori Ini)')
                                            ->multiple()
                                            ->searchable()
                                            ->preload()
                                            ->options($categoryOptions)
                                            ->helperText('Contoh: Pilih kategori "Espresso Machine" untuk Slot 1, atau "Coffee Grinder" untuk Slot 2.'),
                                        Select::make('product_ids')
                                            ->label('Atau Pilih Produk Spesifik Satu per Satu')
                                            ->multiple()
                                            ->searchable()
                                            ->preload()
                                            ->options($productOptions)
                                            ->helperText('Anda bebas memilih kategori saja, produk spesifik saja, atau gabungan keduanya.'),
                                    ]),

                                Grid::make(2)
                                    ->visible(fn (callable $get): bool => in_array($get('slot_type') ?? 'required', ['required', 'optional']))
                                    ->schema([
                                        Select::make('discount_mode')
                                            ->label('Tipe Diskon pada Slot Ini')
                                            ->options([
                                                'percentage' => 'Diskon Persentase (%)',
                                                'fixed' => 'Potongan Nominal (Rp)',
                                                'none' => 'Harga Normal (Tanpa Diskon)',
                                            ])
                                            ->default('percentage')
                                            ->required()
                                            ->live(),
                                        TextInput::make('discount_value')
                                            ->label('Nilai Diskon pada Slot Ini')
                                            ->numeric()
                                            ->default(2)
                                            ->helperText('Contoh: Isi 2 untuk diskon 2%, atau isi 250000 untuk potongan Rp 250.000 pada produk di slot ini.')
                                            ->visible(fn (callable $get): bool => ($get('discount_mode') ?? 'percentage') !== 'none'),
                                    ]),

                                // Untuk Slot GRATIS / Bonus Bawaan
                                Grid::make(1)
                                    ->visible(fn (callable $get): bool => ($get('slot_type') ?? 'required') === 'free')
                                    ->schema([
                                        Select::make('free_product_id')
                                            ->label('Pilih Produk Katalog yang Digratiskan (GRATIS Rp 0)')
                                            ->searchable()
                                            ->preload()
                                            ->options($productOptions)
                                            ->required(fn (callable $get): bool => ($get('slot_type') ?? 'required') === 'free')
                                            ->helperText('Produk ini akan langsung tampil di kotak slot dengan label GRATIS, harga asli dicoret merah, dan harga paket Rp 0.'),
                                    ]),
                            ]),
                    ]),

                Section::make('Deskripsi Produk')
                    ->columnSpanFull()
                    ->schema([
                        Textarea::make('description.id')
                            ->label('Deskripsi Lengkap Produk')
                            ->rows(4)
                            ->columnSpanFull(),
                    ]),

                Section::make('Varian & Harga Produk')
                    ->columnSpanFull()
                    ->schema([
                        Repeater::make('variants')
                            ->label('Daftar Varian / Harga')
                            ->relationship('variants')
                            ->defaultItems(1)
                            ->schema([
                                Grid::make(5)->schema([
                                    TextInput::make('label')
                                        ->label('Nama Varian / Satuan')
                                        ->placeholder('Contoh: 1 Unit / 1 Set / 500ml')
                                        ->default('1 Unit')
                                        ->required(),
                                    TextInput::make('price')
                                        ->label('Harga Jual (Rp)')
                                        ->numeric()
                                        ->prefix('Rp')
                                        ->required(),
                                    TextInput::make('original_price')
                                        ->label('Harga Coret / Normal (Opsional)')
                                        ->numeric()
                                        ->prefix('Rp'),
                                    TextInput::make('weight_grams')
                                        ->label('Berat Kirim (Gram)')
                                        ->numeric()
                                        ->default(1000)
                                        ->required(),
                                    Select::make('stock_status')
                                        ->label('Stok Varian')
                                        ->options([
                                            'in_stock' => 'Tersedia',
                                            'pre_order' => 'Pre-Order',
                                            'out_of_stock' => 'Habis',
                                        ])
                                        ->default('in_stock')
                                        ->required(),
                                ]),
                            ]),
                    ]),

                Section::make('Galeri Foto Produk')
                    ->columnSpanFull()
                    ->schema([
                        Repeater::make('images')
                            ->label('Foto Produk')
                            ->relationship('images')
                            ->defaultItems(1)
                            ->schema([
                                Grid::make(3)->schema([
                                    FileUpload::make('path')
                                        ->label('Upload Foto Produk')
                                        ->disk('public')
                                        ->directory('products')
                                        ->image()
                                        ->required(),
                                    TextInput::make('alt')
                                        ->label('Keterangan Foto (Alt Text)'),
                                    Toggle::make('is_primary')
                                        ->label('Foto Utama')
                                        ->default(true),
                                ]),
                            ]),
                    ]),
            ]);
    }
}

