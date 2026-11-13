<?php

namespace App\Filament\Resources\Posts\Tables;

use App\Models\Post;
use Filament\Actions\Action;
use Filament\Actions\BulkAction;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Notifications\Notification;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

class PostsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('cover_image')
                    ->label('Sampul')
                    ->disk('public')
                    ->square()
                    ->defaultImageUrl('https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=120&q=80'),

                TextColumn::make('title')
                    ->label('Judul Artikel')
                    ->state(fn (Post $record) => $record->getTranslation('title', 'id') ?? (is_array($record->title) ? ($record->title['id'] ?? reset($record->title)) : $record->title))
                    ->searchable(query: function (Builder $query, string $search): Builder {
                        return $query->where('title', 'like', "%{$search}%")->orWhere('slug', 'like', "%{$search}%");
                    })
                    ->sortable(query: fn (Builder $query, string $direction) => $query->orderBy('id', $direction))
                    ->weight('bold')
                    ->description(fn (Post $record) => $record->slug),

                TextColumn::make('category')
                    ->label('Kategori')
                    ->formatStateUsing(function (Post $record) {
                        if ($record->type === 'guide') {
                            return 'Panduan: ' . ($record->method ?? 'Seduh');
                        }
                        if ($record->type === 'event') {
                            return 'Acara: ' . ($record->location ?? 'Event');
                        }
                        return $record->category ?? 'Journal';
                    })
                    ->badge()
                    ->color(fn (Post $record) => match ($record->type) {
                        'guide' => 'warning',
                        'event' => 'info',
                        default => 'gray',
                    })
                    ->sortable(),

                TextColumn::make('meta.icon')
                    ->label('Icon')
                    ->formatStateUsing(fn ($state) => ucfirst(str_replace('-', ' ', (string) ($state ?: 'newspaper'))))
                    ->badge()
                    ->color('info')
                    ->toggleable(),

                IconColumn::make('meta.is_featured')
                    ->label('Sorotan')
                    ->boolean()
                    ->trueIcon(Heroicon::Star)
                    ->falseIcon(Heroicon::Minus)
                    ->trueColor('warning')
                    ->falseColor('gray')
                    ->toggleable(),

                TextColumn::make('publication_status')
                    ->label('Status Publikasi')
                    ->badge()
                    ->state(function (Post $record): string {
                        if ($record->published_at && $record->published_at <= now()) {
                            return 'Diterbitkan';
                        }
                        if ($record->published_at && $record->published_at > now()) {
                            return 'Terjadwal';
                        }
                        return 'Draf';
                    })
                    ->color(function (Post $record): string {
                        if ($record->published_at && $record->published_at <= now()) {
                            return 'success';
                        }
                        if ($record->published_at && $record->published_at > now()) {
                            return 'warning';
                        }
                        return 'gray';
                    }),

                TextColumn::make('published_at')
                    ->label('Waktu Publikasi')
                    ->dateTime('d M Y, H:i')
                    ->placeholder('Belum diterbitkan (Draf)')
                    ->sortable(),

                TextColumn::make('author_name')
                    ->label('Penulis')
                    ->toggleable(isToggledHiddenByDefault: true),

                TextColumn::make('created_at')
                    ->label('Dibuat')
                    ->dateTime('d M Y')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('published_at', 'desc')
            ->filters([
                SelectFilter::make('status')
                    ->label('Status Publikasi')
                    ->options([
                        'published' => 'Diterbitkan (Online)',
                        'scheduled' => 'Terjadwal',
                        'draft' => 'Draf (Offline)',
                    ])
                    ->query(function (Builder $query, array $data) {
                        if (($data['value'] ?? null) === 'published') {
                            $query->whereNotNull('published_at')->where('published_at', '<=', now());
                        } elseif (($data['value'] ?? null) === 'scheduled') {
                            $query->whereNotNull('published_at')->where('published_at', '>', now());
                        } elseif (($data['value'] ?? null) === 'draft') {
                            $query->whereNull('published_at');
                        }
                    }),

                SelectFilter::make('category')
                    ->label('Kategori')
                    ->options([
                        'Journal' => 'Journal & Cerita',
                        'Edukasi' => 'Edukasi Seduh',
                        'Terroir' => 'Terroir & Petani',
                        'Roasting' => 'Catatan Roastery',
                        'Kabar' => 'Kabar Sanubari',
                    ]),

                TernaryFilter::make('is_featured')
                    ->label('Artikel Sorotan')
                    ->queries(
                        true: fn (Builder $query) => $query->where('meta->is_featured', true),
                        false: fn (Builder $query) => $query->where(fn ($q) => $q->whereNull('meta->is_featured')->orWhere('meta->is_featured', false)),
                    ),
            ])
            ->recordActions([
                Action::make('togglePublish')
                    ->label(fn (Post $record) => ($record->published_at && $record->published_at <= now()) ? 'Jadikan Draf' : 'Publikasikan')
                    ->icon(fn (Post $record) => ($record->published_at && $record->published_at <= now()) ? Heroicon::EyeSlash : Heroicon::GlobeAlt)
                    ->color(fn (Post $record) => ($record->published_at && $record->published_at <= now()) ? 'gray' : 'success')
                    ->tooltip(fn (Post $record) => ($record->published_at && $record->published_at <= now()) ? 'Tarik artikel dari website ke status draf' : 'Publikasikan artikel langsung ke website')
                    ->action(function (Post $record) {
                        if ($record->published_at && $record->published_at <= now()) {
                            $record->update(['published_at' => null]);
                            Notification::make()
                                ->title('Artikel Disimpan Sebagai Draf')
                                ->body("Artikel '{$record->slug}' telah ditarik dari publikasi website.")
                                ->info()
                                ->send();
                        } else {
                            $record->update(['published_at' => now()]);
                            Notification::make()
                                ->title('Artikel Berhasil Dipublikasikan')
                                ->body("Artikel '{$record->slug}' sekarang sudah tayang di website.")
                                ->success()
                                ->send();
                        }
                    }),

                Action::make('viewOnWeb')
                    ->label('Lihat')
                    ->icon(Heroicon::ArrowTopRightOnSquare)
                    ->color('info')
                    ->url(fn (Post $record) => url("/blog/{$record->slug}"))
                    ->openUrlInNewTab()
                    ->visible(fn (Post $record) => $record->type === 'article' && $record->published_at && $record->published_at <= now()),

                EditAction::make(),

                DeleteAction::make()
                    ->label('Hapus')
                    ->modalHeading('Hapus Artikel Blog')
                    ->modalDescription('Apakah Anda yakin ingin menghapus artikel ini? Tindakan ini tidak dapat dibatalkan.')
                    ->successNotificationTitle('Artikel Berhasil Dihapus'),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    BulkAction::make('bulkPublish')
                        ->label('Publikasikan Terpilih')
                        ->icon(Heroicon::GlobeAlt)
                        ->color('success')
                        ->requiresConfirmation()
                        ->modalHeading('Publikasikan Artikel Terpilih')
                        ->modalDescription('Apakah Anda yakin ingin mempublikasikan semua artikel yang dipilih langsung ke website?')
                        ->action(function (Collection $records) {
                            $records->each(fn ($record) => $record->update(['published_at' => now()]));
                            Notification::make()
                                ->title('Artikel Berhasil Dipublikasikan')
                                ->body(count($records) . ' artikel telah dipublikasikan ke website.')
                                ->success()
                                ->send();
                        }),

                    BulkAction::make('bulkDraft')
                        ->label('Jadikan Draf Terpilih')
                        ->icon(Heroicon::EyeSlash)
                        ->color('gray')
                        ->requiresConfirmation()
                        ->modalHeading('Ubah Artikel Terpilih ke Draf')
                        ->modalDescription('Apakah Anda yakin ingin menarik semua artikel yang dipilih dari website ke status draf?')
                        ->action(function (Collection $records) {
                            $records->each(fn ($record) => $record->update(['published_at' => null]));
                            Notification::make()
                                ->title('Artikel Diubah Menjadi Draf')
                                ->body(count($records) . ' artikel telah ditarik dari publikasi website.')
                                ->info()
                                ->send();
                        }),

                    DeleteBulkAction::make()
                        ->label('Hapus Terpilih')
                        ->modalHeading('Hapus Artikel Terpilih')
                        ->modalDescription('Apakah Anda yakin ingin menghapus semua artikel yang dipilih?')
                        ->successNotificationTitle('Artikel Terpilih Berhasil Dihapus'),
                ]),
            ]);
    }
}
