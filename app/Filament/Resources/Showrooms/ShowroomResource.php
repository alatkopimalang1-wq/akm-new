<?php

namespace App\Filament\Resources\Showrooms;

use App\Filament\Resources\Showrooms\Pages\CreateShowroomItem;
use App\Filament\Resources\Showrooms\Pages\EditShowroomItem;
use App\Filament\Resources\Showrooms\Pages\ListShowroomItems;
use App\Models\ShowroomItem;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Textarea;
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

class ShowroomResource extends Resource
{
    protected static ?string $model = ShowroomItem::class;

    protected static string|\BackedEnum|null $navigationIcon = Heroicon::BuildingStorefront;

    protected static string|\UnitEnum|null $navigationGroup = 'Promosi & Konten';

    protected static ?string $navigationLabel = 'Galeri Showroom Malang';

    protected static ?int $navigationSort = 2;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Informasi Foto & Galeri Showroom')
                ->schema([
                    TextInput::make('title')
                        ->label('Judul Sudut / Fasilitas Showroom')
                        ->required()
                        ->placeholder('e.g. Espresso Machine Experience Bar & Testing Station'),
                    Textarea::make('description')
                        ->label('Deskripsi Fasilitas')
                        ->rows(3)
                        ->placeholder('Pelanggan dapat mencoba langsung ekstraksi mesin espresso dan dial-in grinder sebelum membeli.'),
                    Grid::make(2)->schema([
                        FileUpload::make('image_url')
                            ->label('Foto Showroom')
                            ->image()
                            ->disk('public')
                            ->directory('showroom')
                            ->imageEditor()
                            ->required(),
                        Grid::make(1)->schema([
                            TextInput::make('sort_order')
                                ->label('Nomor Urut Tampil')
                                ->numeric()
                                ->default(0),
                            Toggle::make('is_active')
                                ->label('Tampilkan di Website')
                                ->default(true),
                        ]),
                    ]),
                ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('image_url')
                    ->label('Foto')
                    ->disk('public'),
                TextColumn::make('title')
                    ->label('Fasilitas Showroom')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),
                TextColumn::make('sort_order')
                    ->label('Urutan')
                    ->sortable(),
                IconColumn::make('is_active')
                    ->label('Aktif')
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
            'index' => ListShowroomItems::route('/'),
            'create' => CreateShowroomItem::route('/create'),
            'edit' => EditShowroomItem::route('/{record}/edit'),
        ];
    }
}

