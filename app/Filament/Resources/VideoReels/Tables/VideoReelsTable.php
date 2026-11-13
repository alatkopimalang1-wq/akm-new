<?php

namespace App\Filament\Resources\VideoReels\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;

class VideoReelsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('thumbnail')
                    ->label('Thumbnail')
                    ->disk('public')
                    ->getStateUsing(function ($record): ?string {
                        $raw = $record->getRawOriginal('thumbnail') ?? $record->thumbnail ?? '';
                        if (empty($raw)) {
                            return null;
                        }
                        $trimmed = trim((string) $raw);
                        if (str_starts_with($trimmed, 'http://') || str_starts_with($trimmed, 'https://')) {
                            return $trimmed;
                        }
                        // Return clean public disk relative path (e.g. 'reels/thumbnails/abc.jpg')
                        $clean = preg_replace('#^/?(?:(?:storage|public)/)+#', '', $trimmed);

                        return ltrim((string) $clean, '/') ?: null;
                    })
                    ->square()
                    ->width(48)
                    ->height(64),

                TextColumn::make('headline')
                    ->label('Judul Reel')
                    ->searchable()
                    ->sortable()
                    ->weight('bold')
                    ->wrap(),

                TextColumn::make('caption')
                    ->label('Deskripsi')
                    ->limit(60)
                    ->searchable()
                    ->wrap(),

                TextColumn::make('badge')
                    ->label('Badge')
                    ->badge()
                    ->color('warning')
                    ->placeholder('-'),

                TextColumn::make('video_url')
                    ->label('Tautan Instagram')
                    ->icon('heroicon-o-arrow-top-right-on-square')
                    ->url(fn ($record) => $record->video_url, shouldOpenInNewTab: true)
                    ->limit(30)
                    ->color('primary')
                    ->placeholder('Belum diatur'),

                IconColumn::make('is_active')
                    ->label('Aktif')
                    ->boolean()
                    ->sortable(),

                TextColumn::make('created_at')
                    ->label('Dibuat')
                    ->dateTime('d M Y')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                TernaryFilter::make('is_active')
                    ->label('Status Aktif')
                    ->trueLabel('Hanya yang Aktif')
                    ->falseLabel('Hanya yang Nonaktif'),
            ])
            ->actions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->bulkActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('id', 'desc');
    }
}

