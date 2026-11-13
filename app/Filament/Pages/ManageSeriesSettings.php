<?php

namespace App\Filament\Pages;

use App\Models\Product;
use App\Models\Setting;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
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
use Illuminate\Support\Str;

class ManageSeriesSettings extends Page
{
    protected static string|BackedEnum|null $navigationIcon = Heroicon::RectangleStack;

    protected static string|\UnitEnum|null $navigationGroup = 'Katalog & Toko';

    protected static ?string $navigationLabel = 'Lini / Seri Produk';

    protected static ?string $title = 'Pengaturan Lini / Seri Produk';

    protected static ?int $navigationSort = 3;

    /**
     * @var array<string, mixed> | null
     */
    public ?array $data = [];

    public function mount(): void
    {
        $series = Setting::get('product_series', null);

        if (! is_array($series) || empty($series)) {
            $series = Product::defaultSeriesList();
        }

        $this->form->fill([
            'series_list' => $series,
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
                Section::make('Kelola Lini / Seri Produk Kopi')
                    ->description('Atur daftar pilihan lini atau seri kopi (misalnya: Gunung Kawi Terroir, Classic Series, CO-Ferment Experimental, dll). Pilihan di sini otomatis menjadi opsi pilihan pada form produk dan filter pencarian katalog.')
                    ->icon(Heroicon::Tag)
                    ->schema([
                        Repeater::make('series_list')
                            ->label('Daftar Lini / Seri')
                            ->reorderable()
                            ->collapsible()
                            ->cloneable()
                            ->itemLabel(fn (array $state): ?string => 
                                ! empty($state['name']) 
                                    ? ($state['name'] . ' [' . ($state['slug'] ?? '-') . ']' . ((isset($state['is_active']) && ! $state['is_active']) ? ' (Nonaktif)' : '')) 
                                    : null
                            )
                            ->schema([
                                Grid::make(3)->schema([
                                    TextInput::make('name')
                                        ->label('Nama Lini / Seri')
                                        ->required()
                                        ->live(onBlur: true)
                                        ->afterStateUpdated(function (string $operation, ?string $state, callable $set, callable $get) {
                                            if (empty($get('slug')) && ! empty($state)) {
                                                $set('slug', Str::slug($state));
                                            }
                                        })
                                        ->placeholder('cth: Gunung Kawi Terroir'),

                                    TextInput::make('slug')
                                        ->label('Kode / Slug Unik')
                                        ->required()
                                        ->rules(['regex:/^[a-z0-9\-]+$/'])
                                        ->helperText('Hanya huruf kecil, angka, dan tanda hubung (-). cth: kawi, co-ferment')
                                        ->placeholder('cth: kawi'),

                                    Select::make('badge_color')
                                        ->label('Warna Badge')
                                        ->options([
                                            'amber' => 'Amber / Emas',
                                            'emerald' => 'Emerald / Hijau',
                                            'purple' => 'Ungu (CO-Ferment)',
                                            'rose' => 'Rose / Merah',
                                            'indigo' => 'Indigo / Biru',
                                            'sky' => 'Sky / Biru Terang',
                                            'teal' => 'Teal / Hijau Laut',
                                            'orange' => 'Orange',
                                            'gray' => 'Abu-abu',
                                        ])
                                        ->default('amber')
                                        ->required(),
                                ]),

                                Grid::make(2)->schema([
                                    TextInput::make('description')
                                        ->label('Deskripsi Singkat Karakter Seri')
                                        ->placeholder('cth: Kopi khas lereng Gunung Kawi dengan karakter terroir vulkanik Malang.')
                                        ->columnSpan(1),

                                    Toggle::make('is_active')
                                        ->label('Aktif (Tersedia untuk Dipilih)')
                                        ->default(true)
                                        ->inline(false)
                                        ->columnSpan(1),
                                ]),
                            ])
                            ->addActionLabel('+ Tambah Lini / Seri Baru')
                            ->defaultItems(1),
                    ]),
            ]);
    }

    public function save(): void
    {
        $data = $this->form->getState();
        $seriesList = $data['series_list'] ?? [];

        // Normalize slugs
        foreach ($seriesList as &$item) {
            if (! empty($item['name']) && empty($item['slug'])) {
                $item['slug'] = Str::slug($item['name']);
            }
            if (! empty($item['slug'])) {
                $item['slug'] = Str::slug($item['slug']);
            }
            $item['is_active'] = (bool) ($item['is_active'] ?? true);
        }
        unset($item);

        Setting::set('product_series', $seriesList);

        Cache::forget('sanubari_settings');
        Cache::forget('product_series');

        Notification::make()
            ->title('Lini / Seri Produk Berhasil Disimpan!')
            ->body('Daftar pilihan lini/seri telah diperbarui dan langsung tersedia pada form produk.')
            ->success()
            ->send();
    }

    protected function getFormActions(): array
    {
        return [
            Action::make('save')
                ->label('Simpan Perubahan Lini / Seri')
                ->submit('save'),
        ];
    }
}

