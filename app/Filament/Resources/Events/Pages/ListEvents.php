<?php

namespace App\Filament\Resources\Events\Pages;

use App\Filament\Resources\Events\EventResource;
use Filament\Actions\Action;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;
use Filament\Support\Icons\Heroicon;

class ListEvents extends ListRecords
{
    protected static string $resource = EventResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make()
                ->label('Buat Acara Baru')
                ->icon(Heroicon::Plus),
            Action::make('preview_page')
                ->label('Buka Halaman /acara')
                ->icon(Heroicon::GlobeAlt)
                ->color('gray')
                ->url('/acara', shouldOpenInNewTab: true),
            Action::make('manage_content')
                ->label('Pengaturan Tampilan /acara')
                ->icon(Heroicon::Cog6Tooth)
                ->color('gray')
                ->url('/admin/manage-content-pages'),
        ];
    }
}

