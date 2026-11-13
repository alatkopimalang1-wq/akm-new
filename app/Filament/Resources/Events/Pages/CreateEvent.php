<?php

namespace App\Filament\Resources\Events\Pages;

use App\Filament\Concerns\RedirectsToPreviousUrl;
use App\Filament\Resources\Events\EventResource;
use Filament\Resources\Pages\CreateRecord;

class CreateEvent extends CreateRecord
{
    use RedirectsToPreviousUrl;

    protected static string $resource = EventResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        $data['type'] = 'event';

        if (! empty($data['cover_image'])) {
            if (is_array($data['cover_image'])) {
                $data['cover_image'] = array_values($data['cover_image'])[0] ?? null;
            }
        } elseif (! empty($data['cover_image_url'])) {
            $data['cover_image'] = $data['cover_image_url'];
        }

        unset($data['cover_image_url']);

        if (empty($data['published_at'])) {
            $data['published_at'] = now();
        }

        return $data;
    }
}

