<?php

namespace App\Filament\Resources\Posts\Pages;

use App\Filament\Concerns\RedirectsToPreviousUrl;
use App\Filament\Resources\Posts\PostResource;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\CreateRecord;

class CreatePost extends CreateRecord
{
    use RedirectsToPreviousUrl;

    protected static string $resource = PostResource::class;

    protected static ?string $title = 'Tulis Artikel Blog Baru';

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        if (empty($data['type'])) {
            $data['type'] = 'article';
        }

        return $data;
    }

    protected function getCreatedNotification(): ?Notification
    {
        return Notification::make()
            ->title('Artikel Berhasil Dibuat')
            ->body('Artikel baru telah berhasil disimpan.')
            ->success();
    }
}
