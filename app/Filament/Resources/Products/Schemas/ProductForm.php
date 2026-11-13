<?php

namespace App\Filament\Resources\Products\Schemas;

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
                        Grid::make(3)->schema([
                            TextInput::make('producer')
                                ->label('Brand Produk')
                                ->placeholder('Contoh: La Marzocco, Hario, Mahlkönig, Breville...')
                                ->required()
                                ->live(onBlur: true)
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
                            TextInput::make('series')
                                ->label('Label Lini / Brand Tampil')
                                ->placeholder('Otomatis mengikuti Brand Produk')
                                ->default('Alat Kopi Malang'),
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
                                    'out_of_stock' => 'Stok Habis (Sold Out)',
                                ])
                                ->required()
                                ->default('in_stock'),
                            DateTimePicker::make('released_at')
                                ->label('Tanggal Rilis')
                                ->default(now()),
                        ]),
                        Grid::make(2)->schema([
                            Toggle::make('is_featured')
                                ->label('Produk Unggulan (Best Seller)'),
                            Toggle::make('is_new')
                                ->label('Tandai Sebagai Produk Baru'),
                        ]),
                    ]),

                Section::make('Spesifikasi & Deskripsi Produk')
                    ->columnSpanFull()
                    ->schema([
                        TextInput::make('tasting_notes')
                            ->label('Highlight Fitur Utama (Dipisahkan Koma)')
                            ->placeholder('Contoh: Dual Boiler, PID Temperature Control, Stainless Steel 304')
                            ->columnSpanFull(),
                        Grid::make(2)->schema([
                            TextInput::make('process')
                                ->label('Material / Tipe Spesifikasi')
                                ->placeholder('Contoh: Stainless Steel 304 • Rotary Pump'),
                            TextInput::make('origin')
                                ->label('Negara / Asal Brand')
                                ->placeholder('Contoh: Florence, Italia'),
                        ]),
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

                Section::make('Tautan Marketplace (Opsional)')
                    ->collapsible()
                    ->collapsed()
                    ->columnSpanFull()
                    ->schema([
                        Grid::make(2)->schema([
                            TextInput::make('tokopedia_url')
                                ->label('Link Produk Tokopedia')
                                ->url(),
                            TextInput::make('shopee_url')
                                ->label('Link Produk Shopee')
                                ->url(),
                        ]),
                    ]),
            ]);
    }
}
