<?php

namespace App\Filament\Pages\HalamanAwal;

use App\Models\Setting;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Textarea;
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

class ManageBrewBanner extends Page
{
    protected static string|BackedEnum|null $navigationIcon = Heroicon::BookOpen;

    protected static string|\UnitEnum|null $navigationGroup = 'Halaman Awal';

    protected static ?string $navigationLabel = 'Banner Resep Seduh';

    protected static ?string $title = 'Pengaturan Banner Animasi Resep Seduh (Home Page)';

    protected static ?int $navigationSort = 6;

    public ?array $data = [];

    public function mount(): void
    {
        $settings = Setting::all()->pluck('value', 'key')->toArray();

        $bannerImg = $settings['home_brew_banner_image'] ?? null;
        $isHttp = ! empty($bannerImg) && str_starts_with($bannerImg, 'http');

        $this->form->fill([
            'home_brew_banner_enable' => (bool) ($settings['home_brew_banner_enable'] ?? true),
            'home_brew_banner_badge' => $settings['home_brew_banner_badge'] ?? 'Panduan & Resep Seduh',
            'home_brew_banner_title' => $settings['home_brew_banner_title'] ?? 'Resep & Panduan Seduh Kopi Presisi dari Barista Sanubari',
            'home_brew_banner_desc' => $settings['home_brew_banner_desc'] ?? 'Pelajari rasio seduh, ukuran gilingan, suhu air, dan teknik penuangan optimal mulai dari V60, Japanese Ice, hingga Espresso untuk mengeluarkan cita rasa terbaik.',
            'home_brew_banner_button' => $settings['home_brew_banner_button'] ?? 'Eksplorasi Resep Seduh Sekarang',
            'home_brew_banner_image' => (! empty($bannerImg) && ! $isHttp) ? str_replace('/storage/', '', $bannerImg) : null,
            'home_brew_banner_image_url' => $isHttp ? $bannerImg : ($settings['home_brew_banner_image_url'] ?? ''),
            'home_brew_banner_href' => $settings['home_brew_banner_href'] ?? '/panduan-seduh',
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
                Section::make('Status & Tautan Banner')
                    ->description('Atur visibilitas dan link halaman tujuan banner resep seduh di beranda.')
                    ->schema([
                        Toggle::make('home_brew_banner_enable')
                            ->label('Tampilkan Banner Resep Seduh di Home Page')
                            ->helperText('Banner ini tampil di bawah bagian Koleksi Terbaru dengan gambar animasi zoom dan teks melayang (floating).')
                            ->default(true),
                        Grid::make(2)->schema([
                            TextInput::make('home_brew_banner_badge')
                                ->label('Label Badge / Pill Kecil')
                                ->nullable(),
                            TextInput::make('home_brew_banner_href')
                                ->label('Tautan / Link Tujuan')
                                ->default('/panduan-seduh')
                                ->helperText('Dapat diarahkan ke /panduan-seduh atau /resep-seduh.')
                                ->required(),
                        ]),
                    ]),

                Section::make('Konten Judul, Deskripsi & Tombol')
                    ->description('Teks judul banner (opsional, digunakan untuk atribut alt dan aksesibilitas gambar).')
                    ->schema([
                        TextInput::make('home_brew_banner_title')
                            ->label('Judul Banner (Alt Text)')
                            ->default('Resep Seduh Kopi Sanubari')
                            ->nullable(),
                        Textarea::make('home_brew_banner_desc')
                            ->label('Deskripsi / Penjelasan Singkat')
                            ->rows(3)
                            ->nullable(),
                        TextInput::make('home_brew_banner_button')
                            ->label('Teks Tombol Aksi')
                            ->nullable(),
                    ]),

                Section::make('Gambar Latar Animasi (Background Image)')
                    ->description('Pilih foto suasana seduh kopi atau barista Sanubari dengan efek animasi zoom ambient.')
                    ->schema([
                        Grid::make(2)->schema([
                            FileUpload::make('home_brew_banner_image')
                                ->label('Upload Foto Seduh Kopi')
                                ->disk('public')
                                ->directory('home-banners')
                                ->visibility('public')
                                ->image()
                                ->imageEditor()
                                ->helperText('Rekomendasi rasio landscape lebar (16:9 atau 21:9), min. 1600x900px.'),
                            TextInput::make('home_brew_banner_image_url')
                                ->label('Atau Masukkan URL Gambar Eksternal')
                                ->placeholder('https://images.unsplash.com/...'),
                        ]),
                    ]),
            ]);
    }

    public function save(): void
    {
        $data = $this->form->getState();

        $upload = $data['home_brew_banner_image'] ?? null;
        if (is_array($upload)) {
            $upload = ! empty($upload) ? array_values($upload)[0] : null;
        }

        if (! empty($upload) && is_string($upload)) {
            $cleanPath = ltrim(str_replace(['/storage/', 'storage/'], '', $upload), '/');
            $privateFile = storage_path('app/private/' . $cleanPath);
            $publicFile = storage_path('app/public/' . $cleanPath);
            if (file_exists($privateFile) && ! file_exists($publicFile)) {
                @mkdir(dirname($publicFile), 0755, true);
                @copy($privateFile, $publicFile);
            }

            $finalBannerImg = (str_starts_with($upload, 'http') || str_starts_with($upload, '/'))
                ? $upload
                : '/storage/' . $upload;
        } else {
            $finalBannerImg = ! empty($data['home_brew_banner_image_url']) ? $data['home_brew_banner_image_url'] : null;
        }

        $data['home_brew_banner_image'] = $finalBannerImg;

        foreach ($data as $key => $value) {
            Setting::set($key, $value);
        }

        Cache::forget('sanubari_settings');

        Notification::make()
            ->title('Pengaturan Banner Resep Seduh Berhasil Disimpan!')
            ->body('Perubahan banner resep seduh di halaman beranda telah diperbarui.')
            ->success()
            ->send();
    }

    protected function getFormActions(): array
    {
        return [
            Action::make('save')
                ->label('Simpan Pengaturan Banner')
                ->submit('save'),
        ];
    }
}

