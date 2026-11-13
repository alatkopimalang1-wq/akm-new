<?php

namespace App\Filament\Resources\Products;

use App\Filament\Resources\Products\Pages\CreateProduct;
use App\Filament\Resources\Products\Pages\EditProduct;
use App\Filament\Resources\Products\Pages\ListProducts;
use App\Models\Product;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\KeyValue;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Support\Str;

class ProductResource extends Resource
{
    protected static ?string $model = Product::class;

    protected static string|\BackedEnum|null $navigationIcon = Heroicon::ShoppingBag;

    protected static string|\UnitEnum|null $navigationGroup = 'Katalog Peralatan';

    protected static ?string $navigationLabel = 'Peralatan & Mesin Kopi';

    protected static ?int $navigationSort = 1;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Tabs::make('ProductTabs')
                ->tabs([
                    Tab::make('Informasi Utama')
                        ->icon(Heroicon::InformationCircle)
                        ->schema([
                            Grid::make(2)->schema([
                                TextInput::make('name')
                                    ->label('Nama Alat / Mesin Kopi')
                                    ->placeholder('e.g. Timemore Chestnut C3 ESP Pro Grinder')
                                    ->required()
                                    ->live(onBlur: true)
                                    ->afterStateUpdated(fn (string $operation, $state, callable $set) => $operation === 'create' ? $set('slug', Str::slug($state)) : null),
                                TextInput::make('slug')
                                    ->label('URL Slug')
                                    ->required()
                                    ->unique(Product::class, 'slug', ignoreRecord: true),
                            ]),
                            Grid::make(3)->schema([
                                TextInput::make('brand')
                                    ->label('Brand / Produsen')
                                    ->placeholder('e.g. Timemore, Hario, Fellow, Bialetti'),
                                TextInput::make('sku')
                                    ->label('SKU / Kode Barang')
                                    ->placeholder('AKM-GR-001'),
                                Select::make('categories')
                                    ->label('Kategori Alat')
                                    ->relationship('categories', 'name')
                                    ->multiple()
                                    ->preload()
                                    ->searchable(),
                            ]),
                            TextInput::make('tagline')
                                ->label('Tagline Produk')
                                ->placeholder('e.g. Hand Grinder Presisi Tinggi dengan Burrs Stainless Steel CNC'),
                            Textarea::make('short_description')
                                ->label('Deskripsi Ringkas')
                                ->rows(2),
                            RichEditor::make('description')
                                ->label('Deskripsi Lengkap & Panduan Pemakaian')
                                ->fileAttachmentsDirectory('products/descriptions'),
                        ]),

                    Tab::make('Harga & Stok')
                        ->icon(Heroicon::CurrencyDollar)
                        ->schema([
                            Grid::make(3)->schema([
                                TextInput::make('price')
                                    ->label('Harga Jual (Rp)')
                                    ->numeric()
                                    ->prefix('Rp')
                                    ->required(),
                                TextInput::make('original_price')
                                    ->label('Harga Normal / Coret (Rp)')
                                    ->numeric()
                                    ->prefix('Rp')
                                    ->helperText('Kosongkan jika tidak sedang diskon'),
                                TextInput::make('stock')
                                    ->label('Jumlah Stok')
                                    ->numeric()
                                    ->default(10)
                                    ->required(),
                            ]),
                            Grid::make(2)->schema([
                                Select::make('status')
                                    ->label('Status Publikasi')
                                    ->options([
                                        'active' => 'Aktif (Tampil di Storefront)',
                                        'draft' => 'Draft (Disembunyikan)',
                                        'archived' => 'Diarsipkan',
                                    ])
                                    ->default('active')
                                    ->required(),
                                Select::make('stock_status')
                                    ->label('Status Ketersediaan Stok')
                                    ->options([
                                        'in_stock' => 'Stok Tersedia (In Stock)',
                                        'low_stock' => 'Stok Menipis (Low Stock)',
                                        'out_of_stock' => 'Habis (Out of Stock)',
                                    ])
                                    ->default('in_stock')
                                    ->required(),
                            ]),
                            Grid::make(2)->schema([
                                Toggle::make('is_featured')
                                    ->label('Jadikan Produk Unggulan (Featured)')
                                    ->helperText('Tampil di baris atas highlight beranda'),
                                Toggle::make('is_flash_sale')
                                    ->label('Flash Sale Promo')
                                    ->helperText('Beri lencana diskon flash sale khusus'),
                            ]),
                        ]),

                    Tab::make('Foto & Galeri')
                        ->icon(Heroicon::Photo)
                        ->schema([
                            Repeater::make('images')
                                ->relationship('images')
                                ->schema([
                                    FileUpload::make('path')
                                        ->label('Foto Produk')
                                        ->image()
                                        ->disk('public')
                                        ->directory('products/gallery')
                                        ->imageEditor()
                                        ->required(),
                                    TextInput::make('alt')
                                        ->label('Alt Text')
                                        ->placeholder('Foto produk tampak depan'),
                                    Toggle::make('is_primary')
                                        ->label('Jadikan Foto Sampul Utama')
                                        ->default(false),
                                    TextInput::make('sort_order')
                                        ->label('Urutan')
                                        ->numeric()
                                        ->default(0),
                                ])
                                ->columns(4)
                                ->defaultItems(1)
                                ->reorderable('sort_order'),
                        ]),

                    Tab::make('Spesifikasi & Marketplace')
                        ->icon(Heroicon::AdjustmentsHorizontal)
                        ->schema([
                            KeyValue::make('specifications')
                                ->label('Spesifikasi Teknis (Kapasitas, Material, Dimensi, dll)')
                                ->keyLabel('Parameter')
                                ->valueLabel('Nilai / Keterangan')
                                ->placeholder('Contoh: Kapasitas -> 30g Biji Kopi'),
                            Grid::make(2)->schema([
                                TextInput::make('tokopedia_url')
                                    ->label('Tautan Resmi Tokopedia')
                                    ->url(),
                                TextInput::make('shopee_url')
                                    ->label('Tautan Resmi Shopee')
                                    ->url(),
                            ]),
                        ]),
                ])
                ->columnSpanFull(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('primary_image_url')
                    ->label('Foto')
                    ->disk('public')
                    ->circular()
                    ->defaultImageUrl('/favicon.svg'),
                TextColumn::make('name')
                    ->label('Nama Alat Kopi')
                    ->searchable()
                    ->sortable()
                    ->weight('bold')
                    ->description(fn (Product $record) => $record->brand ? "Brand: {$record->brand}" : null),
                TextColumn::make('categories.name')
                    ->label('Kategori')
                    ->badge()
                    ->color('amber'),
                TextColumn::make('price')
                    ->label('Harga')
                    ->money('IDR', locale: 'id')
                    ->sortable(),
                TextColumn::make('stock')
                    ->label('Stok')
                    ->badge()
                    ->color(fn (int $state): string => match (true) {
                        $state <= 0 => 'danger',
                        $state < 5 => 'warning',
                        default => 'success',
                    })
                    ->sortable(),
                IconColumn::make('is_featured')
                    ->label('Featured')
                    ->boolean(),
                IconColumn::make('is_flash_sale')
                    ->label('Flash Sale')
                    ->boolean(),
                TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'active' => 'success',
                        'draft' => 'gray',
                        'archived' => 'danger',
                        default => 'secondary',
                    }),
            ])
            ->filters([
                SelectFilter::make('categories')
                    ->label('Filter Kategori')
                    ->relationship('categories', 'name'),
                SelectFilter::make('status')
                    ->options([
                        'active' => 'Aktif',
                        'draft' => 'Draft',
                        'archived' => 'Arsip',
                    ]),
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListProducts::route('/'),
            'create' => CreateProduct::route('/create'),
            'edit' => EditProduct::route('/{record}/edit'),
        ];
    }
}

