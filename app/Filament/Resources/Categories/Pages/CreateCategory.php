<?php

namespace App\Filament\Resources\Categories\Pages;

use App\Filament\Concerns\RedirectsToPreviousUrl;
use App\Filament\Resources\Categories\CategoryResource;
use Filament\Resources\Pages\CreateRecord;

class CreateCategory extends CreateRecord
{
    use RedirectsToPreviousUrl;

    protected static string $resource = CategoryResource::class;
}

