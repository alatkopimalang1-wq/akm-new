<?php

namespace App\Filament\Pages\HalamanAwal;

use App\Models\Setting;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Schemas\Components\Actions;
use Filament\Schemas\Components\EmbeddedSchema;
use Filament\Schemas\Components\Form;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Illuminate\Support\Facades\Cache;

class ManageTasteRecommendations extends Page
{
    protected static string|BackedEnum|null $navigationIcon = Heroicon::Beaker;

    protected static string|\UnitEnum|null $navigationGroup = 'Halaman Awal';

    protected static ?string $navigationLabel = 'Rekomendasi Taste';

    protected static ?string $title = 'Pengaturan Rekomendasi Karakter Rasa';

    protected static ?int $navigationSort = 8;

    /**
     * @var array<string, mixed> | null
     */
    public ?array $data = [];

    public function mount(): void
    {
        $settings = Setting::all()->pluck('value', 'key')->toArray();

        $defaultFlavorProfiles = [
            [
                'title' => 'Manis & Floral',
                'desc' => 'Single Origin Lereng Gunung Kawi',
                'href' => '/shop?series=kawi',
                'bgImage' => 'taste-recommendations/taste-1.jpg',
            ],
            [
                'title' => 'Fruity & Juicy',
                'desc' => 'Inovasi CO-Ferment Buah Alami',
                'href' => '/shop?series=co-ferment',
                'bgImage' => 'taste-recommendations/taste-2.jpg',
            ],
            [
                'title' => 'Bold & Cokelat',
                'desc' => 'Espresso Roast & Robusta Dampit',
                'href' => '/shop?category=espresso-beans',
                'bgImage' => 'taste-recommendations/taste-3.jpg',
            ],
            [
                'title' => 'Clean & Asam Cerah',
                'desc' => 'Washed Classic Terroir Kawi',
                'href' => '/shop?category=classic-process',
                'bgImage' => 'taste-recommendations/taste-4.jpg',
            ],
            [
                'title' => 'Paket Seduh Rumah',
                'desc' => 'Starter Pack Biji Kopi Pemula',
                'href' => '/shop',
                'bgImage' => 'taste-recommendations/taste-5.jpg',
            ],
            [
                'title' => 'Pasokan Kedai B2B',
                'desc' => 'Wholesale Grosir & Mesin Espresso',
                'href' => '/wholesale',
                'bgImage' => 'taste-recommendations/taste-6.jpg',
            ],
        ];

        $flavorItems = $settings['home_flavor_items'] ?? $defaultFlavorProfiles;
        if (is_array($flavorItems)) {
            foreach ($flavorItems as $index => &$item) {
                if (isset($item['bgImage']) && is_string($item['bgImage']) && str_starts_with($item['bgImage'], 'http')) {
                    $item['bgImage'] = 'taste-recommendations/taste-' . (($index % 6) + 1) . '.jpg';
                }
            }
            unset($item);
        }

        $this->form->fill([
            'home_flavor_title' => $settings['home_flavor_title'] ?? 'Temukan Kopi Sesuai Karakter Seduhan Anda!',
            'home_flavor_subtitle' => $settings['home_flavor_subtitle'] ?? 'Pilih biji kopi berdasarkan preferensi aroma, metode seduh, atau kebutuhan bisnis',
            'home_flavor_items' => $flavorItems,
        ]);
    }

    public function defaultForm(Schema $schema): Schema
    {
        return $schema->statePath('data');
    }

    public function content(Schema $schema): Schema
    {
        return $schema
            ->components([
                Form::make([EmbeddedSchema::make('form')])
                    ->id('form')
                    ->livewireSubmitHandler('save')
                    ->footer([
                        Actions::make($this->getFormActions())
                            ->key('form-actions'),
                    ]),
            ]);
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Rekomendasi Karakter Rasa Kopi')
                    ->description('6 kartu profil karakter rasa (Manis & Floral, Fruity & Juicy, Bold & Cokelat, dll) dengan tautan langsung ke katalog.')
                    ->schema([
                        Grid::make(2)->schema([
                            TextInput::make('home_flavor_title')
                                ->label('Judul Bagian')
                                ->required(),
                            Textarea::make('home_flavor_subtitle')
                                ->label('Subjudul / Deskripsi')
                                ->rows(2)
                                ->required(),
                        ]),
                        Repeater::make('home_flavor_items')
                            ->label('Daftar Kartu Profil Karakter Rasa')
                            ->itemLabel(fn (array $state): ?string => $state['title'] ?? 'Karakter Rasa')
                            ->collapsible()
                            ->collapseAllAction(fn ($action) => $action->hidden())
                            ->expandAllAction(fn ($action) => $action->hidden())
                            ->reorderable()
                            ->cloneable()
                            ->addActionLabel('Tambah Profil Karakter Rasa')
                            ->schema([
                                Grid::make(3)->schema([
                                    TextInput::make('title')
                                        ->label('Karakter Rasa')
                                        ->placeholder('Manis & Floral')
                                        ->required(),
                                    TextInput::make('desc')
                                        ->label('Keterangan / Terroir')
                                        ->placeholder('Single Origin Lereng Gunung Kawi')
                                        ->required(),
                                    TextInput::make('href')
                                        ->label('Tautan Katalog')
                                        ->placeholder('/shop?series=kawi')
                                        ->required(),
                                ]),
                                FileUpload::make('bgImage')
                                    ->label('Upload Foto Latar Profil Rasa')
                                    ->disk('public')
                                    ->directory('taste-recommendations')
                                    ->image()
                                    ->imageEditor()
                                    ->maxSize(5120)
                                    ->helperText('Format JPG, PNG, WEBP (maks 5MB)')
                                    ->required(),
                            ])
                            ->defaultItems(3)
                            ->columnSpanFull(),
                    ]),
            ]);
    }

    public function save(): void
    {
        $data = $this->form->getState();

        if (isset($data['home_flavor_items']) && is_array($data['home_flavor_items'])) {
            foreach ($data['home_flavor_items'] as &$item) {
                if (isset($item['bgImage'])) {
                    if (is_array($item['bgImage'])) {
                        $item['bgImage'] = ! empty($item['bgImage']) ? array_values($item['bgImage'])[0] : null;
                    }
                }
            }
            unset($item);
        }

        foreach ($data as $key => $value) {
            Setting::set($key, $value);
        }

        Cache::forget('sanubari_settings');

        Notification::make()
            ->title('Rekomendasi Taste Berhasil Disimpan!')
            ->body('Profil karakter rasa kopi di halaman beranda telah diperbarui.')
            ->success()
            ->send();
    }

    protected function getFormActions(): array
    {
        return [
            Action::make('save')
                ->label('Simpan Rekomendasi Taste')
                ->submit('save'),
        ];
    }
}
