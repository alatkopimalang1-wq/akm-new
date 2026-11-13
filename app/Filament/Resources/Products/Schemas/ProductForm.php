<?php

namespace App\Filament\Resources\Products\Schemas;

use App\Models\Product;
use App\Models\ProductVariant;
use Filament\Forms\Components\CheckboxList;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ProductForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(1)
            ->components([
                Section::make('Informasi Dasar')
                    ->columnSpanFull()
                    ->schema([
                        Grid::make(2)->schema([
                            TextInput::make('name')
                                ->label('Nama Produk')
                                ->required(),
                            TextInput::make('slug')
                                ->label('Slug URL')
                                ->required(),
                        ]),
                        Grid::make(2)->schema([
                            Select::make('series')
                                ->label('Lini / Seri')
                                ->options(function (?Product $record) {
                                    $options = Product::getSeriesOptions(onlyActive: true, includeExistingValues: false);
                                    if ($record && ! empty($record->series) && ! isset($options[$record->series])) {
                                        $options[$record->series] = Product::getSeriesLabel($record->series) . ' (Tersimpan)';
                                    }
                                    return $options;
                                })
                                ->searchable()
                                ->required()
                                ->default(function () {
                                    $options = Product::getSeriesOptions(onlyActive: true, includeExistingValues: false);
                                    return array_key_first($options) ?? 'filter';
                                })
                                ->helperText('Atur daftar lini/seri di menu Katalog & Toko > Lini / Seri Produk.'),
                            Select::make('status')
                                ->label('Status')
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
                                    'out_of_stock' => 'Stok Habis (Sold Out)',
                                ])
                                ->required()
                                ->default('in_stock')
                                ->helperText('Jika Stok Habis, produk otomatis menghitam di katalog dengan badge SOLD OUT dan tidak bisa dibeli.'),
                            DateTimePicker::make('released_at')
                                ->label('Tanggal Rilis'),
                        ]),
                        Select::make('categories')
                            ->label('Kategori')
                            ->relationship('categories', 'slug')
                            ->multiple()
                            ->preload(),
                        Grid::make(2)->schema([
                            Toggle::make('is_featured')
                                ->label('Produk Best Seller (Unggulan)'),
                            Toggle::make('is_new')
                                ->label('Tandai Sebagai Baru (New Arrival)'),
                        ]),
                    ]),

                Section::make('Terroir & Profil Rasa')
                    ->columnSpanFull()
                    ->schema([
                        TextInput::make('tasting_notes')
                            ->label('Catatan Rasa (Tasting Notes)')
                            ->placeholder('contoh: Jasmine, Yellow Peach, Caramel')
                            ->columnSpanFull(),
                        Grid::make(3)->schema([
                            TextInput::make('origin')
                                ->label('Negara / Wilayah Asal')
                                ->default('Indonesia'),
                            TextInput::make('region')
                                ->label('Region / Lereng')
                                ->placeholder('Wagir, Gn. Kawi'),
                            TextInput::make('farm')
                                ->label('Kebun / Farm'),
                        ]),
                        Grid::make(3)->schema([
                            TextInput::make('producer')
                                ->label('Petani / Produser'),
                            TextInput::make('varietal')
                                ->label('Varietas')
                                ->placeholder('Kartika, Typica, Lini S'),
                            TextInput::make('process')
                                ->label('Proses Pascapanen')
                                ->placeholder('Honey Anaerobic, Washed'),
                        ]),
                        Grid::make(2)->schema([
                            TextInput::make('altitude')
                                ->label('Ketinggian')
                                ->placeholder('1.200 - 1.450 mdpl'),
                            TextInput::make('roast_level')
                                ->label('Tingkat Sangrai')
                                ->placeholder('Light to Medium'),
                        ]),
                    ]),

                Section::make('Harga & Metode Seduh')
                    ->columnSpanFull()
                    ->schema([
                        Grid::make(2)->schema([
                            TextInput::make('min_price')
                                ->label('Harga Minimum (Rp)')
                                ->helperText('Otomatis disinkronkan dari harga varian termurah saat disimpan.')
                                ->required()
                                ->numeric()
                                ->prefix('Rp'),
                            TextInput::make('max_price')
                                ->label('Harga Maksimum (Rp)')
                                ->helperText('Otomatis disinkronkan dari harga varian termahal saat disimpan.')
                                ->required()
                                ->numeric()
                                ->prefix('Rp'),
                            TextInput::make('price_per_10g')
                                ->label('Harga per 10g (C.Y.B.R)')
                                ->helperText('Tarif per 10 gram saat diracik di studio blend.')
                                ->numeric()
                                ->prefix('Rp'),
                            TextInput::make('freshness_days')
                                ->label('Masa Segar (Hari)')
                                ->required()
                                ->numeric()
                                ->default(30),
                        ]),
                        TagsInput::make('brew_methods')
                            ->label('Rekomendasi Alat Seduh')
                            ->placeholder('Ketik metode lalu tekan enter (e.g. V60, Aeropress, Espresso)'),
                    ]),

                Section::make('Toko Resmi Marketplace')
                    ->columnSpanFull()
                    ->description('Tautkan link produk ini di Tokopedia dan Shopee agar pelanggan bisa langsung belanja via marketplace.')
                    ->schema([
                        Grid::make(2)->schema([
                            TextInput::make('tokopedia_url')
                                ->label('Link Tokopedia')
                                ->placeholder('https://www.tokopedia.com/Alat Kopi Malang/...')
                                ->url()
                                ->helperText('Kosongkan untuk memakai link toko resmi Tokopedia default.'),
                            TextInput::make('shopee_url')
                                ->label('Link Shopee')
                                ->placeholder('https://shopee.co.id/Alat Kopi Malang/...')
                                ->url()
                                ->helperText('Kosongkan untuk memakai link toko resmi Shopee default.'),
                        ]),
                    ]),

                Section::make('Varian Kemasan & Harga (Bag Sizes)')
                    ->columnSpanFull()
                    ->description('Pilihan ukuran kemasan, berat, harga, ketersediaan stok, dan foto kemasan masing-masing varian.')
                    ->schema([
                        Repeater::make('variants')
                            ->relationship('variants')
                            ->itemLabel(fn (array $state): ?string => ($state['label'] ?? 'Varian') . (! empty($state['price']) ? ' — Rp ' . number_format((float) $state['price'], 0, ',', '.') : ''))
                            ->collapsible()
                            ->reorderable(false)
                            ->schema([
                                Grid::make(2)->schema([
                                    TextInput::make('label')
                                        ->label('Label Ukuran')
                                        ->placeholder('e.g. 200 gr, 500 gr, 1 kg')
                                        ->live(onBlur: true)
                                        ->afterStateUpdated(function ($state, callable $set) {
                                            $parsed = ProductVariant::parseWeightFromLabel((string) $state);
                                            if ($parsed !== null && $parsed > 0) {
                                                $set('weight_grams', $parsed);
                                            }
                                        })
                                        ->required(),
                                    TextInput::make('weight_grams')
                                        ->label('Berat (Gram)')
                                        ->numeric()
                                        ->default(200)
                                        ->live(onBlur: true)
                                        ->afterStateUpdated(function ($state, callable $get, callable $set) {
                                            $weight = (int) $state;
                                            if ($weight > 0) {
                                                $currentLabel = (string) $get('label');
                                                $newLabel = ProductVariant::syncLabelWithWeight($currentLabel, $weight);
                                                if ($newLabel !== $currentLabel) {
                                                    $set('label', $newLabel);
                                                }
                                            }
                                        })
                                        ->required(),
                                    TextInput::make('price')
                                        ->label('Harga (Rp)')
                                        ->numeric()
                                        ->prefix('Rp')
                                        ->live(onBlur: true)
                                        ->required(),
                                    TextInput::make('original_price')
                                        ->label('Harga Coret / Promo (Rp)')
                                        ->numeric()
                                        ->prefix('Rp'),
                                ]),
                                Grid::make(2)->schema([
                                    Grid::make(1)->schema([
                                        Select::make('stock_status')
                                            ->label('Status Stok')
                                            ->options([
                                                'in_stock' => 'Tersedia (In Stock)',
                                                'out_of_stock' => 'Habis (Out of Stock)',
                                                'pre_order' => 'Pre-Order',
                                            ])
                                            ->default('in_stock')
                                            ->required(),
                                        TextInput::make('sku')
                                            ->label('SKU (Opsional)')
                                            ->placeholder('e.g. SNB-KAWI-200G'),
                                    ])->columnSpan(1),
                                    FileUpload::make('image')
                                        ->label('Foto Kemasan Varian')
                                        ->disk('public')
                                        ->directory('products/variants')
                                        ->image()
                                        ->imageEditor()
                                        ->maxSize(5120)
                                        ->helperText('Upload foto kemasan khusus ukuran varian ini (JPG, PNG, WEBP maks 5MB). Jika kosong, otomatis memakai foto produk.')
                                        ->columnSpan(1),
                                ]),
                            ])
                            ->defaultItems(1)
                            ->columnSpanFull(),
                    ]),

                Section::make('Galeri Foto Produk')
                    ->columnSpanFull()
                    ->description('Daftar gambar produk untuk slider katalog dan halaman detail.')
                    ->schema([
                        Repeater::make('images')
                            ->relationship('images')
                            ->schema([
                                Grid::make(2)->schema([
                                    FileUpload::make('path')
                                        ->label('Foto Galeri Produk')
                                        ->disk('public')
                                        ->directory('products/gallery')
                                        ->image()
                                        ->imageEditor()
                                        ->maxSize(5120)
                                        ->required()
                                        ->columnSpan(1),
                                    Grid::make(1)->schema([
                                        TextInput::make('alt')
                                            ->label('Alt Text')
                                            ->placeholder('Deskripsi gambar'),
                                        Toggle::make('is_primary')
                                            ->label('Foto Utama (Primary)')
                                            ->helperText('Gambar pertama otomatis menjadi foto utama jika tidak ada yang dicentang.'),
                                    ])->columnSpan(1),
                                ]),
                            ])
                            ->orderColumn('sort_order')
                            ->columnSpanFull(),
                    ]),

                Section::make('Deskripsi & Narasi')
                    ->columnSpanFull()
                    ->schema([
                        TextInput::make('short_description')
                            ->label('Deskripsi Singkat')
                            ->columnSpanFull(),
                        Grid::make(2)->schema([
                            Textarea::make('tagline.id')
                                ->label('Tagline (Indonesia)')
                                ->rows(2),
                            Textarea::make('tagline.en')
                                ->label('Tagline (English)')
                                ->rows(2),
                        ]),
                        Grid::make(2)->schema([
                            Textarea::make('description.id')
                                ->label('Deskripsi Lengkap (Indonesia)')
                                ->default('Alat Kopi Malang Coffee Beans merupakan biji kopi premium yang dipilih berdasarkan grade terbaik. Yang selalu mempunyai cita rasa yang khas. Dengan level roasting yang disesuaikan dengan kriteria biji kopi. Semua biji kopi yang kopi produksi sudah memiliki ijin edar PIRT dan HALAL.')
                                ->helperText('Deskripsi standar Alat Kopi Malang: "Alat Kopi Malang Coffee Beans merupakan biji kopi premium yang dipilih berdasarkan grade terbaik. Yang selalu mempunyai cita rasa yang khas. Dengan level roasting yang disesuaikan dengan kriteria biji kopi. Semua biji kopi yang kopi produksi sudah memiliki ijin edar PIRT dan HALAL."')
                                ->rows(5),
                            Textarea::make('description.en')
                                ->label('Deskripsi Lengkap (English)')
                                ->default('Alat Kopi Malang Coffee Beans merupakan biji kopi premium yang dipilih berdasarkan grade terbaik. Yang selalu mempunyai cita rasa yang khas. Dengan level roasting yang disesuaikan dengan kriteria biji kopi. Semua biji kopi yang kopi produksi sudah memiliki ijin edar PIRT dan HALAL.')
                                ->rows(5),
                        ]),
                    ]),
            ]);
    }
}
