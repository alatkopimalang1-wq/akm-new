<?php

namespace App\Filament\Resources\Brands\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class BrandForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(1)
            ->components([
                Section::make('Tambah / Edit Brand Produk')
                    ->description('Kelola daftar brand resmi untuk produk peralatan kopi, mesin espresso, grinder, dan bahan baku.')
                    ->columnSpanFull()
                    ->schema([
                        Grid::make(2)->schema([
                            TextInput::make('name')
                                ->label('Nama Brand')
                                ->placeholder('Contoh: La Marzocco, Hario, Mahlkönig, Breville...')
                                ->required()
                                ->unique(ignoreRecord: true)
                                ->live(onBlur: true)
                                ->afterStateUpdated(function ($state, callable $set, callable $get) {
                                    if (! empty($state) && empty($get('slug'))) {
                                        $set('slug', Str::slug($state));
                                    }
                                }),
                            TextInput::make('slug')
                                ->label('Slug / ID Brand')
                                ->placeholder('Contoh: la-marzocco')
                                ->required()
                                ->unique(ignoreRecord: true),
                        ]),
                        Grid::make(3)->schema([
                            TextInput::make('origin')
                                ->label('Negara / Kota Asal Brand (Opsional)')
                                ->placeholder('Contoh: Florence, Italy / Tokyo, Japan'),
                            TextInput::make('sort_order')
                                ->label('Urutan Tampil')
                                ->numeric()
                                ->default(0),
                            Toggle::make('is_active')
                                ->label('Status Brand Aktif')
                                ->default(true)
                                ->inline(false),
                        ]),
                        FileUpload::make('logo')
                            ->label('Logo Brand (Opsional)')
                            ->image()
                            ->disk('public')
                            ->visibility('public')
                            ->directory('brands'),
                        Textarea::make('description')
                            ->label('Deskripsi Singkat Brand (Opsional)')
                            ->placeholder('Keterangan singkat mengenai brand...')
                            ->rows(3),
                    ]),
            ]);
    }
}
