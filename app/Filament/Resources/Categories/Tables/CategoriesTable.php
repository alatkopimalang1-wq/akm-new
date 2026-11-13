<?php

namespace App\Filament\Resources\Categories\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class CategoriesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name.id')
                    ->label('Nama Kategori')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('slug')
                    ->label('Slug URL')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('parent.slug')
                    ->label('Induk Kategori')
                    ->formatStateUsing(fn ($record) => $record->parent ? (is_array($record->parent->name) ? ($record->parent->name['id'] ?? $record->parent->slug) : $record->parent->slug) : 'Kategori Utama')
                    ->badge()
                    ->color(fn ($record) => $record->parent ? 'info' : 'success'),
                TextColumn::make('type')
                    ->label('Tipe')
                    ->badge()
                    ->sortable(),
                TextColumn::make('icon')
                    ->label('Ikon')
                    ->icon(fn (?string $state) => \App\Support\IconCatalog::getPrefixIcon($state))
                    ->badge()
                    ->color('gray')
                    ->sortable(),
                TextColumn::make('sort_order')
                    ->label('Urutan')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('created_at')
                    ->label('Dibuat')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('sort_order')
            ->filters([])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
