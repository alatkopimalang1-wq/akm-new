<?php

namespace App\Filament\Resources\Products\Schemas;

use App\Models\Brand;
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
    public static function configure(Schema $schema): Schema
    {
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
                        Grid::make(3)->schema([
                            Toggle::make('is_featured')
                                ->label('Produk Unggulan (Best Seller)'),
                            Toggle::make('is_new')
                                ->label('Tandai Sebagai Produk Baru'),
                            Toggle::make('is_preorder')
                                ->label('Pre-Order'),
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

