<?php

namespace App\Filament\Resources\Posts\Pages;

use App\Filament\Concerns\RedirectsToPreviousUrl;
use App\Filament\Resources\Posts\PostResource;
use Filament\Actions\Action;
use Filament\Actions\DeleteAction;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\EditRecord;
use Filament\Support\Icons\Heroicon;

class EditPost extends EditRecord
{
    use RedirectsToPreviousUrl;

    protected static string $resource = PostResource::class;

    protected static ?string $title = 'Edit Artikel Blog';

    protected function getHeaderActions(): array
    {
        return [
            Action::make('viewOnWeb')
                ->label('Lihat di Website')
                ->icon(Heroicon::ArrowTopRightOnSquare)
                ->color('gray')
                ->url(fn () => url("/blog/{$this->record->slug}"))
                ->openUrlInNewTab()
                ->visible(fn () => $this->record->type === 'article' && $this->record->published_at && $this->record->published_at <= now()),
            DeleteAction::make()
                ->label('Hapus Artikel')
                ->modalHeading('Hapus Artikel Blog')
                ->modalDescription('Apakah Anda yakin ingin menghapus artikel ini? Tindakan ini tidak dapat dibatalkan.')
                ->successNotification(
                    Notification::make()
                        ->title('Artikel Berhasil Dihapus')
                        ->body('Artikel blog telah dihapus dari sistem.')
                        ->success()
                ),
        ];
    }

    protected function mutateFormDataBeforeFill(array $data): array
    {
        $meta = is_array($data['meta'] ?? null) ? $data['meta'] : [];

        if (empty($meta['flipbook_pages'])) {
            $meta['flipbook_pages'] = [
                [
                    'image' => null,
                    'image_url' => 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=80',
                ],
                [
                    'image' => null,
                    'image_url' => 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1000&q=80',
                ],
                [
                    'image' => null,
                    'image_url' => 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1000&q=80',
                ],
                [
                    'image' => null,
                    'image_url' => 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=80',
                ],
            ];
            $data['meta'] = $meta;
        }

        return $data;
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        if (empty($data['type'])) {
            $data['type'] = 'article';
        }

        return $data;
    }

    protected function getSavedNotification(): ?Notification
    {
        return Notification::make()
            ->title('Perubahan Disimpan')
            ->body('Artikel blog berhasil diperbarui.')
            ->success();
    }
}
