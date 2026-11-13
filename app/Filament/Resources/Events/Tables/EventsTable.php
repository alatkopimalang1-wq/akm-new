<?php

namespace App\Filament\Resources\Events\Tables;

use App\Models\Event;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class EventsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('cover_image')
                    ->label('Poster')
                    ->disk('public')
                    ->square()
                    ->defaultImageUrl('https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=120&q=80'),

                TextColumn::make('title')
                    ->label('Nama Acara')
                    ->state(fn (Event $record) => $record->getTranslation('title', 'id') ?? (is_array($record->title) ? ($record->title['id'] ?? reset($record->title)) : $record->title))
                    ->searchable(query: function (Builder $query, string $search): Builder {
                        return $query->where('title', 'like', "%{$search}%")->orWhere('slug', 'like', "%{$search}%");
                    })
                    ->sortable(query: fn (Builder $query, string $direction) => $query->orderBy('id', $direction))
                    ->weight('bold')
                    ->description(fn (Event $record) => $record->category ?? 'Acara Alat Kopi Malang'),

                TextColumn::make('timing')
                    ->label('Jadwal Acara')
                    ->badge()
                    ->state(function (Event $record): string {
                        if (! $record->starts_at) {
                            return '-';
                        }
                        if ($record->starts_at > now()) {
                            return 'Mendatang';
                        }
                        if ($record->ends_at && $record->ends_at >= now()) {
                            return 'Sedang Berlangsung';
                        }
                        return 'Selesai';
                    })
                    ->color(fn (string $state): string => match ($state) {
                        'Mendatang' => 'info',
                        'Sedang Berlangsung' => 'warning',
                        'Selesai' => 'gray',
                        default => 'gray',
                    }),

                TextColumn::make('entry_type')
                    ->label('Tipe Akses')
                    ->badge()
                    ->state(function (Event $record): string {
                        $type = $record->meta['entry_type'] ?? null;
                        if ($type === 'walk_in' || in_array($record->category, ['Live Music', 'Live DJ', 'Stand Alat Kopi Malang'])) {
                            return 'Tanpa Daftar';
                        }
                        return 'Perlu RSVP';
                    })
                    ->color(fn (string $state): string => match ($state) {
                        'Tanpa Daftar' => 'success',
                        default => 'info',
                    }),

                TextColumn::make('starts_at')
                    ->label('Waktu Mulai')
                    ->dateTime('d M Y, H:i')
                    ->sortable()
                    ->description(fn (Event $record) => $record->ends_at ? 'Selesai: ' . $record->ends_at->format('H:i') . ' WIB' : null),

                TextColumn::make('location')
                    ->label('Lokasi Venue')
                    ->limit(28)
                    ->toggleable(),

                TextColumn::make('fee')
                    ->label('HTM / Tiket')
                    ->state(fn (Event $record) => $record->fee > 0 ? 'Rp ' . number_format($record->fee, 0, ',', '.') : 'Gratis')
                    ->badge()
                    ->color(fn (Event $record) => $record->fee > 0 ? 'warning' : 'success')
                    ->sortable(),

                TextColumn::make('capacity')
                    ->label('Kuota')
                    ->formatStateUsing(fn ($state) => $state ? "{$state} org" : '-')
                    ->badge()
                    ->color('gray')
                    ->toggleable(),

                TextColumn::make('status')
                    ->label('Status Pendaftaran')
                    ->badge()
                    ->formatStateUsing(fn ($state) => match ($state) {
                        'open' => 'Buka',
                        'full' => 'Penuh',
                        'completed' => 'Selesai',
                        default => ucfirst((string) $state),
                    })
                    ->color(fn ($state) => match ($state) {
                        'open' => 'success',
                        'full' => 'danger',
                        'completed' => 'gray',
                        default => 'info',
                    })
                    ->sortable(),
            ])
            ->defaultSort('starts_at', 'desc')
            ->filters([
                SelectFilter::make('entry_type')
                    ->label('Sistem Masuk')
                    ->options([
                        'walk_in' => 'Tanpa Daftar (Walk-In)',
                        'rsvp' => 'Perlu RSVP (Pendaftaran)',
                    ])
                    ->query(function (Builder $query, array $data) {
                        if (($data['value'] ?? null) === 'walk_in') {
                            $query->where(function ($q) {
                                $q->where('meta->entry_type', 'walk_in')
                                    ->orWhereIn('category', ['Live Music', 'Live DJ', 'Stand Alat Kopi Malang']);
                            });
                        } elseif (($data['value'] ?? null) === 'rsvp') {
                            $query->where(function ($q) {
                                $q->where(fn ($sub) => $sub->whereNull('meta->entry_type')->orWhere('meta->entry_type', '!=', 'walk_in'))
                                    ->whereNotIn('category', ['Live Music', 'Live DJ', 'Stand Alat Kopi Malang']);
                            });
                        }
                    }),

                SelectFilter::make('status')
                    ->label('Status Acara')
                    ->options([
                        'open' => 'Tersedia / Buka (Open)',
                        'full' => 'Penuh (Sold Out)',
                        'completed' => 'Selesai (Completed)',
                    ]),

                SelectFilter::make('category')
                    ->label('Kategori Acara')
                    ->options([
                        'Live Music' => 'Live Music & Akustik',
                        'Live DJ' => 'Live DJ Session',
                        'Stand Alat Kopi Malang' => 'Stand / Pop-up Booth',
                        'Cupping Session' => 'Cupping Session',
                        'Workshop Seduh' => 'Workshop Seduh',
                        'Roasting Masterclass' => 'Roasting Masterclass',
                        'Barista Class' => 'Barista Class',
                        'Sharing & Talkshow' => 'Sharing & Talkshow',
                        'Komunitas' => 'Komunitas',
                    ]),

                SelectFilter::make('schedule_type')
                    ->label('Waktu Acara')
                    ->options([
                        'upcoming' => 'Acara Mendatang (Upcoming)',
                        'past' => 'Riwayat Acara (Selesai)',
                    ])
                    ->query(function (Builder $query, array $data) {
                        if (($data['value'] ?? null) === 'upcoming') {
                            $query->where('starts_at', '>=', now());
                        } elseif (($data['value'] ?? null) === 'past') {
                            $query->where('starts_at', '<', now());
                        }
                    }),
            ])
            ->recordActions([
                Action::make('view_on_site')
                    ->label('Lihat di Website')
                    ->icon(Heroicon::ArrowTopRightOnSquare)
                    ->color('gray')
                    ->url('/acara', shouldOpenInNewTab: true),
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

