<?php

namespace App\Filament\Pages\HalamanAwal;

use App\Models\Setting;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Forms\Components\FileUpload;
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

class ManageFeaturedMenu extends Page
{
    protected static string|BackedEnum|null $navigationIcon = Heroicon::ShoppingBag;

    protected static string|\UnitEnum|null $navigationGroup = 'Halaman Awal';

    protected static ?string $navigationLabel = 'Menu Fitur';

    protected static ?string $title = 'Pengaturan Menu Fitur (Laris Manis)';

    protected static ?int $navigationSort = 6;

    /**
     * @var array<string, mixed> | null
     */
    public ?array $data = [];

    public function mount(): void
    {
        $settings = Setting::all()->pluck('value', 'key')->toArray();

        $img1 = $settings['home_laris_1_image'] ?? 'featured-menu/laris-1.jpg';
        if (str_starts_with((string) $img1, 'http')) {
            $img1 = 'featured-menu/laris-1.jpg';
        }

        $img2 = $settings['home_laris_2_image'] ?? 'featured-menu/laris-2.jpg';
        if (str_starts_with((string) $img2, 'http')) {
            $img2 = 'featured-menu/laris-2.jpg';
        }

        $img3 = $settings['home_laris_3_image'] ?? 'featured-menu/laris-3.jpg';
        if (str_starts_with((string) $img3, 'http')) {
            $img3 = 'featured-menu/laris-3.jpg';
        }

        $this->form->fill([
            'home_laris_title' => $settings['home_laris_title'] ?? 'Laris Manis',
            'home_laris_subtitle' => $settings['home_laris_subtitle'] ?? 'Koleksi biji kopi paling laris dan sering diseduh di Sanubari yang mungkin kamu sukai',
            'home_laris_1_title' => $settings['home_laris_1_title'] ?? 'Gunung Kawi Honey Anaerobic',
            'home_laris_1_subtitle' => $settings['home_laris_1_subtitle'] ?? 'Karakter Manis Madu & Floral Lereng Kawi',
            'home_laris_1_href' => $settings['home_laris_1_href'] ?? '/shop?series=kawi',
            'home_laris_1_image' => $img1,
            'home_laris_2_title' => $settings['home_laris_2_title'] ?? 'Sanubari Signature Houseblend Espresso',
            'home_laris_2_subtitle' => $settings['home_laris_2_subtitle'] ?? 'Diformulasikan untuk Crema Tebal & Manis Karamel',
            'home_laris_2_href' => $settings['home_laris_2_href'] ?? '/shop?category=espresso-beans',
            'home_laris_2_image' => $img2,
            'home_laris_3_title' => $settings['home_laris_3_title'] ?? 'C.Y.B.R Blend Sendiri',
            'home_laris_3_subtitle' => $settings['home_laris_3_subtitle'] ?? 'Racik Rasio Sendiri dengan Slider Presisi',
            'home_laris_3_href' => $settings['home_laris_3_href'] ?? '/cybr',
            'home_laris_3_image' => $img3,
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
                Section::make('Bagian Laris Manis (3 Banner Pilihan)')
                    ->description('3 kartu banner kurasi produk terpopuler dengan tata letak visual lebar di tengah.')
                    ->schema([
                        Grid::make(2)->schema([
                            TextInput::make('home_laris_title')
                                ->label('Judul Bagian')
                                ->required(),
                            Textarea::make('home_laris_subtitle')
                                ->label('Subjudul')
                                ->rows(2)
                                ->required(),
                        ]),
                        Grid::make(3)->schema([
                            Section::make('Banner 1 (Kiri)')
                                ->schema([
                                    TextInput::make('home_laris_1_title')->label('Judul Produk')->required(),
                                    TextInput::make('home_laris_1_subtitle')->label('Subjudul Aksen')->placeholder('Karakter Manis Madu & Floral Lereng Kawi'),
                                    TextInput::make('home_laris_1_href')->label('Tautan')->required(),
                                    FileUpload::make('home_laris_1_image')
                                        ->label('Upload Foto Banner')
                                        ->disk('public')
                                        ->directory('featured-menu')
                                        ->image()
                                        ->imageEditor()
                                        ->maxSize(5120)
                                        ->helperText('Format JPG, PNG, WEBP (maks 5MB)')
                                        ->required(),
                                ]),
                            Section::make('Banner 2 (Tengah Utama Lebar)')
                                ->schema([
                                    TextInput::make('home_laris_2_title')->label('Judul Produk')->required(),
                                    TextInput::make('home_laris_2_subtitle')->label('Subjudul Aksen')->required(),
                                    TextInput::make('home_laris_2_href')->label('Tautan')->required(),
                                    FileUpload::make('home_laris_2_image')
                                        ->label('Upload Foto Banner Utama')
                                        ->disk('public')
                                        ->directory('featured-menu')
                                        ->image()
                                        ->imageEditor()
                                        ->maxSize(5120)
                                        ->helperText('Format JPG, PNG, WEBP (maks 5MB)')
                                        ->required(),
                                ]),
                            Section::make('Banner 3 (Kanan)')
                                ->schema([
                                    TextInput::make('home_laris_3_title')->label('Judul Produk')->required(),
                                    TextInput::make('home_laris_3_subtitle')->label('Subjudul Aksen')->placeholder('Racik Rasio Sendiri dengan Slider Presisi'),
                                    TextInput::make('home_laris_3_href')->label('Tautan')->required(),
                                    FileUpload::make('home_laris_3_image')
                                        ->label('Upload Foto Banner')
                                        ->disk('public')
                                        ->directory('featured-menu')
                                        ->image()
                                        ->imageEditor()
                                        ->maxSize(5120)
                                        ->helperText('Format JPG, PNG, WEBP (maks 5MB)')
                                        ->required(),
                                ]),
                        ]),
                    ]),
            ]);
    }

    public function save(): void
    {
        $data = $this->form->getState();

        foreach ($data as $key => $value) {
            if (is_array($value) && in_array($key, ['home_laris_1_image', 'home_laris_2_image', 'home_laris_3_image'])) {
                $value = ! empty($value) ? array_values($value)[0] : null;
            }
            Setting::set($key, $value);
        }

        Cache::forget('sanubari_settings');

        Notification::make()
            ->title('Menu Fitur Laris Manis Berhasil Disimpan!')
            ->body('Konten banner laris manis beranda telah diperbarui.')
            ->success()
            ->send();
    }

    protected function getFormActions(): array
    {
        return [
            Action::make('save')
                ->label('Simpan Menu Fitur')
                ->submit('save'),
        ];
    }
}
