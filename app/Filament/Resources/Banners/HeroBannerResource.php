<?php

namespace App\Filament\Resources\Banners;

use App\Filament\Resources\Banners\Pages\CreateHeroBanner;
use App\Filament\Resources\Banners\Pages\EditHeroBanner;
use App\Filament\Resources\Banners\Pages\ListHeroBanners;
use App\Models\HeroBanner;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class HeroBannerResource extends Resource
{
    protected static ?string $model = HeroBanner::class;

    protected static string|\BackedEnum|null $navigationIcon = Heroicon::Photo;

    protected static string|\UnitEnum|null $navigationGroup = 'Promosi & Konten';

    protected static ?string $navigationLabel = 'Hero Banners';

    protected static ?int $navigationSort = 1;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Detail Hero Banner Beranda')
                ->schema([
                    Grid::make(2)->schema([
                        TextInput::make('title')
                            ->label('Judul Utama Banner')
                            ->required()
                            ->placeholder('e.g. Official Sanubari Roastery Gear Partner'),
                        TextInput::make('badge')
                            ->label('Lencana Badge')
                            ->placeholder('e.g. NEW ARRIVAL / PROMO SPESIAL'),
                    ]),
                    TextInput::make('subtitle')
                        ->label('Sub-judul / Penjelasan Singkat')
                        ->placeholder('Peralatan seduh presisi & mesin espresso bergaransi resmi'),
                    Grid::make(2)->schema([
                        FileUpload::make('image')
                            ->label('Gambar Banner (Rasio Lebar)')
                            ->image()
                            ->disk('public')
                            ->directory('banners')
                            ->imageEditor()
                            ->required(),
                        TextInput::make('link_url')
                            ->label('Tautan Aksi (CTA Link)')
                            ->placeholder('/shop?category=grinders atau https://wa.me/...'),
                    ]),
                    Grid::make(2)->schema([
                        TextInput::make('sort_order')
                            ->label('Urutan Slide')
                            ->numeric()
                            ->default(0),
                        Toggle::make('is_active')
                            ->label('Aktifkan Banner')
                            ->default(true),
                    ]),
                ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('image')
                    ->label('Banner')
                    ->disk('public'),
                TextColumn::make('title')
                    ->label('Judul')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),
                TextColumn::make('badge')
                    ->label('Badge')
                    ->badge()
                    ->color('amber'),
                TextColumn::make('sort_order')
                    ->label('Urutan')
                    ->sortable(),
                IconColumn::make('is_active')
                    ->label('Status Aktif')
                    ->boolean(),
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
            'index' => ListHeroBanners::route('/'),
            'create' => CreateHeroBanner::route('/create'),
            'edit' => EditHeroBanner::route('/{record}/edit'),
        ];
    }
}

