<?php

namespace App\Filament\Resources\Products\Tables;

use App\Models\Brand;
use App\Models\Product;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class ProductsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->label('Nama Produk')
                    ->description(fn (Product $record): ?string => $record->is_custom_bundle ? '🎁 Produk Paket Custom (Custom Bundling)' : null)
                    ->searchable()
                    ->sortable()
                    ->limit(45),
                TextColumn::make('producer')
                    ->label('Brand')
                    ->formatStateUsing(fn (Product $record) => $record->producer ?: $record->series)
                    ->badge()
                    ->color('info')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('categories.slug')
                    ->label('Kategori')
                    ->formatStateUsing(function (Product $record) {
                        return $record->categories
                            ->map(fn ($c) => is_array($c->name) ? ($c->name['id'] ?? $c->slug) : ($c->name ?: $c->slug))
                            ->join(', ');
                    })
                    ->badge()
                    ->color('gray'),
                TextColumn::make('min_price')
                    ->label('Harga')
                    ->money('IDR', locale: 'id')
                    ->sortable(),
                TextColumn::make('stock_status')
                    ->label('Stok')
                    ->badge()
                    ->formatStateUsing(fn (string $state, Product $record): string => match (true) {
                        $state === 'out_of_stock' => 'Habis',
                        $state === 'pre_order' || (bool) $record->is_preorder => 'Pre-Order',
                        default => 'Tersedia',
                    })
                    ->color(fn (string $state, Product $record): string => match (true) {
                        $state === 'out_of_stock' => 'danger',
                        $state === 'pre_order' || (bool) $record->is_preorder => 'warning',
                        default => 'success',
                    }),
                TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->color(fn (string $state): string => $state === 'active' ? 'success' : 'gray'),
            ])
            ->defaultSort('id', 'desc')
            ->filters([
                SelectFilter::make('producer')
                    ->label('Filter Brand')
                    ->options(fn () => Brand::query()->orderBy('name')->pluck('name', 'name')->toArray()),
            ])
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

