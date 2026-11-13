<?php

namespace App\Filament\Pages\HalamanAwal;

use App\Models\Product;
use App\Models\Setting;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Forms\Components\Select;
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

class ManageRecommendedProducts extends Page
{
    protected static string|BackedEnum|null $navigationIcon = Heroicon::Star;

    protected static string|\UnitEnum|null $navigationGroup = 'Halaman Awal';

    protected static ?string $navigationLabel = 'Produk Rekomendasi';

    protected static ?string $title = 'Pengaturan Rekomendasi Biji Kopi';

    protected static ?int $navigationSort = 3;

    /**
     * @var array<string, mixed> | null
     */
    public ?array $data = [];

    public function mount(): void
    {
        $settings = Setting::all()->pluck('value', 'key')->toArray();

        $this->form->fill([
            'home_rec_title' => $settings['home_rec_title'] ?? 'Rekomendasi Biji Kopi',
            'home_rec_subtitle' => $settings['home_rec_subtitle'] ?? 'Kurasi sangrai segar lereng Gunung Kawi dan Nusantara pekan ini',
            'home_rec_product_ids' => $settings['home_rec_product_ids'] ?? [],
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
                Section::make('Slider Rekomendasi Biji Kopi')
                    ->description('Tampilkan kurasi produk unggulan dalam slider horizontal di bagian atas halaman beranda.')
                    ->schema([
                        Grid::make(2)->schema([
                            TextInput::make('home_rec_title')
                                ->label('Judul Bagian')
                                ->placeholder('Rekomendasi Biji Kopi')
                                ->required(),
                            Select::make('home_rec_product_ids')
                                ->label('Pilihan Biji Kopi Spesifik (Opsional)')
                                ->helperText('Pilih biji kopi yang ingin diprioritaskan. Jika dikosongkan, sistem otomatis mengkurasi produk Gunung Kawi & unggulan.')
                                ->multiple()
                                ->searchable()
                                ->preload()
                                ->options(fn () => Product::active()->pluck('name', 'id')->toArray()),
                        ]),
                        Textarea::make('home_rec_subtitle')
                            ->label('Subjudul / Deskripsi Singkat')
                            ->rows(2)
                            ->required(),
                    ]),
            ]);
    }

    public function save(): void
    {
        $data = $this->form->getState();

        foreach ($data as $key => $value) {
            Setting::set($key, $value);
        }

        Cache::forget('sanubari_settings');

        Notification::make()
            ->title('Rekomendasi Biji Kopi Berhasil Disimpan!')
            ->body('Kurasi produk rekomendasi telah diperbarui dan langsung aktif di halaman depan.')
            ->success()
            ->send();
    }

    protected function getFormActions(): array
    {
        return [
            Action::make('save')
                ->label('Simpan Rekomendasi')
                ->submit('save'),
        ];
    }
}
