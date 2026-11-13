<?php

namespace App\Filament\Resources\VideoReels\Pages;

use App\Filament\Concerns\RedirectsToPreviousUrl;
use App\Filament\Resources\VideoReels\VideoReelResource;
use App\Models\VideoReel;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditVideoReel extends EditRecord
{
    use RedirectsToPreviousUrl;

    protected static string $resource = VideoReelResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }

    protected function mutateFormDataBeforeFill(array $data): array
    {
        $rawThumb = $this->record->getRawOriginal('thumbnail') ?? ($data['thumbnail'] ?? '');
        if (! empty($rawThumb) && ! str_starts_with($rawThumb, 'http://') && ! str_starts_with($rawThumb, 'https://')) {
            // Convert '/storage/reels/thumbnails/abc.jpg' -> 'reels/thumbnails/abc.jpg' for Filament FileUpload preview
            $cleanDiskPath = preg_replace('#^/?(?:(?:storage|public)/)+#', '', trim((string) $rawThumb));
            $data['thumbnail_upload'] = ltrim((string) $cleanDiskPath, '/');
        }

        return $data;
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        if (! empty($data['thumbnail_upload'])) {
            $data['thumbnail'] = VideoReel::normalizeThumbnailPath($data['thumbnail_upload']);
        } else {
            // Keep existing thumbnail if already set on record
            $existing = $this->record->getRawOriginal('thumbnail');
            if (! empty($existing)) {
                $data['thumbnail'] = VideoReel::normalizeThumbnailPath($existing);
            }
        }

        if (! empty($data['video_upload'])) {
            $data['video_url'] = VideoReel::normalizeThumbnailPath($data['video_upload']);
        }

        unset($data['thumbnail_upload'], $data['video_upload']);

        return $data;
    }
}
