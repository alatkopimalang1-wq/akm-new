<?php

namespace App\Filament\Resources\Products\Tables;

use App\Filament\Resources\Products\ProductResource;
use App\Models\Product;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Str;

class ProductsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->modifyQueryUsing(fn (Builder $query) => $query->where('slug', '!=', 'byob'))
            ->columns([
                ImageColumn::make('primaryImage.path')
                    ->label('Foto')
                    ->disk('public')
                    ->circular()
                    ->checkFileExistence(false)
                    ->state(function (Product $record): ?string {
                        $raw = $record->primaryImage?->path
                            ?? $record->images->first(fn ($img) => ! empty($img->path))?->path
                            ?? $record->images()->orderBy('sort_order')->orderBy('id')->first()?->path
                            ?? $record->variants->first(fn ($v) => ! empty($v->image))?->image
                            ?? $record->variants()->whereNotNull('image')->first()?->image;

                        if (empty($raw)) {
                            return null;
                        }

                        if (str_starts_with($raw, 'http://') || str_starts_with($raw, 'https://')) {
                            return $raw;
                        }

                        return ltrim(preg_replace('#^/?(?:(?:storage|public)/)+#', '', trim($raw)), '/');
                    })
                    ->defaultImageUrl(fn () => asset('brand/coffee-beans.png')),
                TextColumn::make('name')
                    ->label('Nama Kopi')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),
                TextColumn::make('series')
                    ->label('Seri')
                    ->badge()
                    ->color(fn (?string $state): string => Product::getSeriesBadgeColor($state))
                    ->formatStateUsing(fn (?string $state): string => Product::getSeriesLabel($state))
                    ->sortable(),
                TextColumn::make('process')
                    ->label('Proses')
                    ->searchable(),
                TextColumn::make('tasting_notes')
                    ->label('Profil Rasa')
                    ->limit(30)
                    ->searchable(),
                TextColumn::make('min_price')
                    ->label('Harga Mulai')
                    ->money('IDR', locale: 'id')
                    ->sortable(),
                IconColumn::make('is_featured')
                    ->label('Best Seller')
                    ->boolean(),
                IconColumn::make('is_new')
                    ->label('Baru')
                    ->boolean(),
                TextColumn::make('stock_status')
                    ->label('Stok')
                    ->badge()
                    ->color(fn (?string $state): string => match ($state) {
                        'out_of_stock' => 'danger',
                        default => 'success',
                    })
                    ->formatStateUsing(fn (?string $state): string => match ($state) {
                        'out_of_stock' => 'Habis (Sold Out)',
                        default => 'Tersedia',
                    })
                    ->sortable(),
                TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'active' => 'success',
                        'archived' => 'gray',
                        default => 'warning',
                    }),
                TextColumn::make('created_at')
                    ->label('Dibuat')
                    ->dateTime('d M Y, H:i')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: false),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                SelectFilter::make('stock_status')
                    ->label('Status Stok')
                    ->options([
                        'in_stock' => 'Tersedia',
                        'out_of_stock' => 'Habis (Sold Out)',
                    ]),
                SelectFilter::make('series')
                    ->label('Lini / Seri')
                    ->options(fn () => Product::getSeriesOptions()),
                SelectFilter::make('status')
                    ->options([
                        'active' => 'Aktif',
                        'archived' => 'Arsip',
                    ]),
            ])
            ->recordActions([
                Action::make('toggleStock')
                    ->label(fn (Product $record): string => $record->stock_status === 'out_of_stock' ? 'Set Tersedia' : 'Set Habis')
                    ->icon(fn (Product $record): string => $record->stock_status === 'out_of_stock' ? 'heroicon-o-check-circle' : 'heroicon-o-no-symbol')
                    ->color(fn (Product $record): string => $record->stock_status === 'out_of_stock' ? 'success' : 'danger')
                    ->requiresConfirmation()
                    ->modalHeading(fn (Product $record): string => $record->stock_status === 'out_of_stock' ? 'Ubah Status Menjadi Tersedia?' : 'Tandai Produk Sebagai Stok Habis (Sold Out)?')
                    ->modalDescription(fn (Product $record): string => $record->stock_status === 'out_of_stock' ? 'Produk akan kembali dapat dibeli dan tampil normal di shop.' : 'Produk akan menghitam di shop page dengan badge SOLD OUT dan tombol beli dinonaktifkan.')
                    ->action(function (Product $record): void {
                        $newStatus = $record->stock_status === 'out_of_stock' ? 'in_stock' : 'out_of_stock';
                        $record->stock_status = $newStatus;
                        $record->saveQuietly();
                    }),
                Action::make('duplicate')
                    ->label('Salin')
                    ->icon('heroicon-o-document-duplicate')
                    ->color('info')
                    ->tooltip('Salin produk ini menjadi produk baru')
                    ->modalHeading(fn (Product $record): string => "Salin Produk: {$record->name}")
                    ->modalDescription('Produk akan disalin menjadi produk baru lengkap beserta kategori, varian ukuran berat, harga, profil rasa, dan seluruh foto galeri.')
                    ->modalSubmitActionLabel('Buat Salinan')
                    ->form([
                        TextInput::make('name')
                            ->label('Nama Produk Baru')
                            ->required()
                            ->default(fn (Product $record): string => $record->name . ' (Salinan)'),
                        TextInput::make('slug')
                            ->label('Slug URL Produk')
                            ->required()
                            ->default(function (Product $record): string {
                                $baseSlug = Str::slug($record->slug . '-salinan');
                                $slug = $baseSlug;
                                $counter = 1;
                                while (Product::where('slug', $slug)->exists()) {
                                    $slug = "{$baseSlug}-{$counter}";
                                    $counter++;
                                }
                                return $slug;
                            })
                            ->helperText('Slug otomatis dibuat unik untuk link URL katalog produk.'),
                    ])
                    ->action(function (Product $record, array $data): void {
                        $newProduct = $record->duplicate($data['name'], $data['slug'] ?? null);

                        Notification::make()
                            ->title('Produk Berhasil Disalin!')
                            ->body("Produk baru '{$newProduct->name}' berhasil dibuat dan berada di urutan paling atas.")
                            ->success()
                            ->actions([
                                Action::make('edit')
                                    ->label('Buka Produk Baru')
                                    ->url(ProductResource::getUrl('edit', ['record' => $newProduct])),
                            ])
                            ->send();
                    }),
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
