<?php

namespace App\Filament\Resources\Products\Pages;

use App\Filament\Concerns\RedirectsToPreviousUrl;
use App\Filament\Resources\Products\ProductResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditProduct extends EditRecord
{
    use RedirectsToPreviousUrl;

    protected static string $resource = ProductResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }

    protected function afterSave(): void
    {
        $record = $this->getRecord();
        if ($record instanceof \App\Models\Product) {
            $record->syncPricesFromVariants();
            $record->ensurePrimaryImage();
            $record->refresh();
        }
        $this->fillForm();
    }
}
