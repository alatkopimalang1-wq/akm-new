<?php

namespace App\Filament\Resources\Categories\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class CategoryForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Informasi Kategori')
                    ->schema([
                        Grid::make(2)->schema([
                            TextInput::make('name.id')
                                ->label('Nama (Indonesia)')
                                ->required(),
                            TextInput::make('name.en')
                                ->label('Nama (English)'),
                        ]),
                        Grid::make(2)->schema([
                            TextInput::make('slug')
                                ->required(),
                            Select::make('type')
                                ->label('Tipe Kategori')
                                ->options([
                                    'filter' => 'Filter Coffee',
                                    'espresso' => 'Espresso & Blend',
                                    'brand' => 'Series / Origin',
                                    'merch' => 'Merchandise / Tools',
                                ])
                                ->required()
                                ->default('filter'),
                        ]),
                        Select::make('parent_id')
                            ->label('Induk Kategori (Opsional)')
                            ->relationship('parent', 'slug')
                            ->getOptionLabelFromRecordUsing(fn ($record) => is_array($record->name) ? ($record->name['id'] ?? $record->slug) : $record->slug),
                        Select::make('icon')
                            ->label('Icon Visual Kategori (Lucide / Web Icon)')
                            ->helperText('Pilih ikon visual yang akan tampil di katalog belanja dan navigasi beranda.')
                            ->options(\App\Support\IconCatalog::options())
                            ->searchable()
                            ->prefixIcon(fn (?string $state) => \App\Support\IconCatalog::getPrefixIcon($state)),
                        TextInput::make('sort_order')
                            ->label('Urutan')
                            ->numeric()
                            ->default(0),
                        Grid::make(2)->schema([
                            Textarea::make('description.id')
                                ->label('Deskripsi (Indonesia)')
                                ->rows(3),
                            Textarea::make('description.en')
                                ->label('Deskripsi (English)')
                                ->rows(3),
                        ]),
                    ]),
            ]);
    }
}
