<?php

namespace App\Filament\Resources\Events\Pages;

use App\Filament\Concerns\RedirectsToPreviousUrl;
use App\Filament\Resources\Events\EventResource;
use Filament\Actions\Action;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;
use Filament\Support\Icons\Heroicon;

class EditEvent extends EditRecord
{
    use RedirectsToPreviousUrl;

    protected static string $resource = EventResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Action::make('preview_acara')
                ->label('Lihat di Website (/acara)')
                ->icon(Heroicon::ArrowTopRightOnSquare)
                ->color('gray')
                ->url('/acara', shouldOpenInNewTab: true),
            DeleteAction::make(),
        ];
    }

    protected function mutateFormDataBeforeFill(array $data): array
    {
        if (! empty($data['cover_image']) && is_string($data['cover_image']) && str_starts_with($data['cover_image'], 'http')) {
            $data['cover_image_url'] = $data['cover_image'];
            $data['cover_image'] = null;
        }

        if (empty($data['meta']['entry_type'])) {
            $data['meta']['entry_type'] = in_array($data['category'] ?? '', ['Live Music', 'Live DJ', 'Stand Sanubari']) ? 'walk_in' : 'rsvp';
        }

        return $data;
    }

    protected function mutateFormDataBeforeSave(array $data): array
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

        return $data;
    }
}

