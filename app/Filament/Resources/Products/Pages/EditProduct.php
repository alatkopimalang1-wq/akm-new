<?php

namespace App\Filament\Resources\Products\Pages;

use App\Filament\Concerns\RedirectsToPreviousUrl;
use App\Filament\Resources\Products\ProductResource;
use App\Models\Product;
use Filament\Actions\Action;
use Filament\Actions\DeleteAction;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Support\Str;

class EditProduct extends EditRecord
{
    use RedirectsToPreviousUrl;

    protected static string $resource = ProductResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Action::make('duplicate')
                ->label('Salin Produk Ini')
                ->icon('heroicon-o-document-duplicate')
                ->color('info')
                ->modalHeading(fn (): string => "Salin Produk: {$this->getRecord()->name}")
                ->modalDescription('Produk akan disalin menjadi produk baru lengkap beserta kategori, varian ukuran berat, harga, profil rasa, dan seluruh foto galeri.')
                ->modalSubmitActionLabel('Buat Salinan')
                ->form([
                    TextInput::make('name')
                        ->label('Nama Produk Baru')
                        ->required()
                        ->default(fn (): string => $this->getRecord()->name . ' (Salinan)'),
                    TextInput::make('slug')
                        ->label('Slug URL Produk')
                        ->required()
                        ->default(function (): string {
                            $baseSlug = Str::slug($this->getRecord()->slug . '-salinan');
                            $slug = $baseSlug;
                            $counter = 1;
                            while (Product::where('slug', $slug)->exists()) {
                                $slug = "{$baseSlug}-{$counter}";
                                $counter++;
                            }
                            return $slug;
                        })
                        ->helperText('Slug otomatis dibuat unik untuk link URL katalog produk.'),
                ])
                ->action(function (array $data): void {
                    /** @var Product $record */
                    $record = $this->getRecord();
                    $newProduct = $record->duplicate($data['name'], $data['slug'] ?? null);

                    Notification::make()
                        ->title('Produk Berhasil Disalin!')
                        ->body("Produk baru '{$newProduct->name}' berhasil dibuat dan Anda dialihkan ke halaman edit produk baru.")
                        ->success()
                        ->send();

                    $this->redirect(ProductResource::getUrl('edit', ['record' => $newProduct]));
                }),
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
