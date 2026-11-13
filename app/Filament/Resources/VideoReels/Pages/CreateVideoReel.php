<?php

namespace App\Filament\Resources\VideoReels\Pages;

use App\Filament\Concerns\RedirectsToPreviousUrl;
use App\Filament\Resources\VideoReels\VideoReelResource;
use App\Models\VideoReel;
use Filament\Resources\Pages\CreateRecord;

class CreateVideoReel extends CreateRecord
{
    use RedirectsToPreviousUrl;

    protected static string $resource = VideoReelResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        if (! empty($data['thumbnail_upload'])) {
            $data['thumbnail'] = VideoReel::normalizeThumbnailPath($data['thumbnail_upload']);
        }

        if (! empty($data['video_upload'])) {
            $data['video_url'] = VideoReel::normalizeThumbnailPath($data['video_upload']);
        }

        unset($data['thumbnail_upload'], $data['video_upload']);

        return $data;
    }
}
