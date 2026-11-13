<?php

namespace App\Filament\Resources\Banners\Pages;

use App\Filament\Resources\Banners\HeroBannerResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListHeroBanners extends ListRecords
{
    protected static string $resource = HeroBannerResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make()->label('Tambah Banner Promo'),
        ];
    }
}

