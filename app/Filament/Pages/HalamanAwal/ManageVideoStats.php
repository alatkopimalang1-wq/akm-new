<?php

namespace App\Filament\Pages\HalamanAwal;

use App\Models\Setting;
use BackedEnum;
use Filament\Actions\Action;
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

class ManageVideoStats extends Page
{
    protected static string|BackedEnum|null $navigationIcon = Heroicon::ChartBar;

    protected static string|\UnitEnum|null $navigationGroup = 'Halaman Awal';

    protected static ?string $navigationLabel = 'Statistik Angka';

    protected static ?string $title = 'Pengaturan Statistik Angka Halaman Awal';

    protected static ?int $navigationSort = 4;

    /**
     * @var array<string, mixed> | null
     */
    public ?array $data = [];

    public function mount(): void
    {
        $settings = Setting::all()->pluck('value', 'key')->toArray();

        $this->form->fill([
            'home_stat_1_number' => $settings['home_stat_1_number'] ?? 1450,
            'home_stat_1_unit' => $settings['home_stat_1_unit'] ?? 'mdpl',
            'home_stat_1_label' => $settings['home_stat_1_label'] ?? 'Ketinggian Lereng Kawi',
            'home_stat_1_desc' => $settings['home_stat_1_desc'] ?? 'Tanah andosol vulkanis kaya mineral',

            'home_stat_2_number' => $settings['home_stat_2_number'] ?? 100,
            'home_stat_2_unit' => $settings['home_stat_2_unit'] ?? '%',
            'home_stat_2_label' => $settings['home_stat_2_label'] ?? 'Spesialti Terlacak',
            'home_stat_2_desc' => $settings['home_stat_2_desc'] ?? 'Jejak panen & petani transparan',

            'home_stat_3_number' => $settings['home_stat_3_number'] ?? 18,
            'home_stat_3_unit' => $settings['home_stat_3_unit'] ?? '+',
            'home_stat_3_label' => $settings['home_stat_3_label'] ?? 'Mitra Petani Kawi',
            'home_stat_3_desc' => $settings['home_stat_3_desc'] ?? 'Direct trade harga adil berkelanjutan',

            'home_stat_4_number' => $settings['home_stat_4_number'] ?? 48,
            'home_stat_4_unit' => $settings['home_stat_4_unit'] ?? 'Jam',
            'home_stat_4_label' => $settings['home_stat_4_label'] ?? 'Jaminan Fresh Roast',
            'home_stat_4_desc' => $settings['home_stat_4_desc'] ?? 'Maksimal jeda sangrai ke pengiriman',
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
                Section::make('Statistik Terroir & Dampak (Angka Animasi)')
                    ->description('4 kartu metrik dengan efek animasi angka berjalan (CountingNumber) di halaman beranda.')
                    ->schema([
                        Grid::make(4)->schema([
                            // Metric 1
                            Section::make('Metrik 1 (Ketinggian)')
                                ->schema([
                                    TextInput::make('home_stat_1_number')->label('Angka')->numeric()->required(),
                                    TextInput::make('home_stat_1_unit')->label('Satuan')->placeholder('mdpl')->required(),
                                    TextInput::make('home_stat_1_label')->label('Label Utama')->required(),
                                    TextInput::make('home_stat_1_desc')->label('Keterangan Kecil'),
                                ]),
                            // Metric 2
                            Section::make('Metrik 2 (Spesialti)')
                                ->schema([
                                    TextInput::make('home_stat_2_number')->label('Angka')->numeric()->required(),
                                    TextInput::make('home_stat_2_unit')->label('Satuan')->placeholder('%')->required(),
                                    TextInput::make('home_stat_2_label')->label('Label Utama')->required(),
                                    TextInput::make('home_stat_2_desc')->label('Keterangan Kecil'),
                                ]),
                            // Metric 3
                            Section::make('Metrik 3 (Mitra Petani)')
                                ->schema([
                                    TextInput::make('home_stat_3_number')->label('Angka')->numeric()->required(),
                                    TextInput::make('home_stat_3_unit')->label('Satuan')->placeholder('+')->required(),
                                    TextInput::make('home_stat_3_label')->label('Label Utama')->required(),
                                    TextInput::make('home_stat_3_desc')->label('Keterangan Kecil'),
                                ]),
                            // Metric 4
                            Section::make('Metrik 4 (Fresh Roast)')
                                ->schema([
                                    TextInput::make('home_stat_4_number')->label('Angka')->numeric()->required(),
                                    TextInput::make('home_stat_4_unit')->label('Satuan')->placeholder('Jam')->required(),
                                    TextInput::make('home_stat_4_label')->label('Label Utama')->required(),
                                    TextInput::make('home_stat_4_desc')->label('Keterangan Kecil'),
                                ]),
                        ]),
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
            ->title('Statistik Berhasil Disimpan!')
            ->body('Konten statistik angka beranda telah diperbarui.')
            ->success()
            ->send();
    }

    protected function getFormActions(): array
    {
        return [
            Action::make('save')
                ->label('Simpan Statistik')
                ->submit('save'),
        ];
    }
}
