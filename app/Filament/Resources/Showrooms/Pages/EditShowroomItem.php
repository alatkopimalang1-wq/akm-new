<?php

namespace App\Filament\Resources\Showrooms\Pages;

use App\Filament\Resources\Showrooms\ShowroomResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditShowroomItem extends EditRecord
{
    protected static string $resource = ShowroomResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}

