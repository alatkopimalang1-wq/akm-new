<?php

namespace App\Filament\Resources\Categories\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class CategoryForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Tambah / Edit Kategori Baru')
                    ->description('Buat kategori atau subkategori baru untuk katalog dan navigasi toko.')
                    ->schema([
                        Grid::make(2)->schema([
                            TextInput::make('name.id')
                                ->label('Nama Kategori (Indonesia)')
                                ->placeholder('Contoh: Mesin Espresso, Grinder Kopi, Manual Brew...')
                                ->required()
                                ->live(onBlur: true)
                                ->afterStateUpdated(function ($state, callable $set, callable $get) {
                                    if (! empty($state)) {
                                        if (empty($get('slug'))) {
                                            $set('slug', Str::slug($state));
                                        }
                                        if (empty($get('name.en'))) {
                                            $set('name.en', $state);
                                        }
                                    }
                                }),
                            TextInput::make('name.en')
                                ->label('Nama Kategori (English - Opsional)')
                                ->placeholder('Contoh: Espresso Machines, Coffee Grinders...'),
                        ]),
                        Grid::make(2)->schema([
                            TextInput::make('slug')
                                ->label('Slug / ID URL Kategori')
                                ->placeholder('Contoh: mesin-espresso')
                                ->helperText('Otomatis dibuat dari nama kategori. Digunakan pada URL /shop?category=slug')
                                ->required()
                                ->unique(ignoreRecord: true),
                            TextInput::make('type')
                                ->label('Label Grup / Tipe (Opsional)')
                                ->placeholder('Contoh: equipment, tools, beans, accessories')
                                ->default('general')
                                ->required(),
                        ]),
                        Grid::make(3)->schema([
                            Select::make('parent_id')
                                ->label('Induk Kategori (Opsional - Jika Subkategori)')
                                ->relationship('parent', 'slug')
                                ->searchable()
                                ->preload()
                                ->placeholder('Pilih kategori utama (kosongkan jika kategori utama)')
                                ->getOptionLabelFromRecordUsing(fn ($record) => is_array($record->name) ? ($record->name['id'] ?? $record->slug) : ($record->name ?: $record->slug)),
                            Select::make('icon')
                                ->label('Ikon Visual Kategori')
                                ->options(\App\Support\IconCatalog::options())
                                ->searchable()
                                ->prefixIcon(fn (?string $state) => \App\Support\IconCatalog::getPrefixIcon($state)),
                            TextInput::make('sort_order')
                                ->label('Urutan Tampil')
                                ->numeric()
                                ->default(0),
                        ]),
                        Grid::make(2)->schema([
                            Textarea::make('description.id')
                                ->label('Deskripsi Kategori (Indonesia - Opsional)')
                                ->rows(3),
                            Textarea::make('description.en')
                                ->label('Deskripsi Kategori (English - Opsional)')
                                ->rows(3),
                        ]),
                    ]),
            ]);
    }
}
