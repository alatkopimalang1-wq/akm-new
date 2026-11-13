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

class ManageBookingBanner extends Page
{
    protected static string|BackedEnum|null $navigationIcon = Heroicon::CalendarDays;

    protected static string|\UnitEnum|null $navigationGroup = 'Halaman Awal';

    protected static ?string $navigationLabel = 'Banner Booking Tempat';

    protected static ?string $title = 'Pengaturan Banner Animasi Booking Tempat (Home Page)';

    protected static ?int $navigationSort = 5;

    public ?array $data = [];

    public function mount(): void
    {
        $settings = Setting::all()->pluck('value', 'key')->toArray();

        $bannerImg = $settings['home_booking_banner_image'] ?? null;
        $isHttp = ! empty($bannerImg) && str_starts_with($bannerImg, 'http');

        $this->form->fill([
            'home_booking_banner_enable' => (bool) ($settings['home_booking_banner_enable'] ?? true),
            'home_booking_banner_badge' => $settings['home_booking_banner_badge'] ?? 'Space & Venue Booking',
            'home_booking_banner_title' => $settings['home_booking_banner_title'] ?? 'Booking Tempat Nyaman untuk Acara, Workshop & Komunitas di Alat Kopi Malang',
            'home_booking_banner_desc' => $settings['home_booking_banner_desc'] ?? 'Ruang leluasa muat 50+ orang dengan free proyektor & sound system audio jernih. Cukup dengan minimum spent pesan kopi & menu lezat!',
            'home_booking_banner_button' => $settings['home_booking_banner_button'] ?? 'Booking Tempat Sekarang',
            'home_booking_banner_image' => (! empty($bannerImg) && ! $isHttp) ? str_replace('/storage/', '', $bannerImg) : null,
            'home_booking_banner_image_url' => $isHttp ? $bannerImg : ($settings['home_booking_banner_image_url'] ?? ''),
            'home_booking_banner_href' => $settings['home_booking_banner_href'] ?? '/booking-tempat',
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
                    ->description('Atur visibilitas dan tautan link banner di halaman beranda.')
                    ->schema([
                        Toggle::make('home_booking_banner_enable')
                            ->label('Tampilkan Banner Booking Tempat di Home Page')
                            ->helperText('Banner ini tampil di atas bagian Koleksi Terbaru dengan gambar animasi dan teks floating.')
                            ->default(true),
                        Grid::make(2)->schema([
                            TextInput::make('home_booking_banner_badge')
                                ->label('Label Badge / Pill Kecil')
                                ->nullable(),
                            TextInput::make('home_booking_banner_href')
                                ->label('Tautan / Link Tujuan')
                                ->default('/booking-tempat')
                                ->required(),
                        ]),
                    ]),

                Section::make('Konten Judul, Deskripsi & Tombol')
                    ->description('Teks judul banner (opsional, digunakan untuk atribut alt dan aksesibilitas gambar).')
                    ->schema([
                        TextInput::make('home_booking_banner_title')
                            ->label('Judul Banner (Alt Text)')
                            ->default('Booking Tempat di Alat Kopi Malang')
                            ->nullable(),
                        Textarea::make('home_booking_banner_desc')
                            ->label('Deskripsi / Penjelasan Fasilitas')
                            ->rows(3)
                            ->nullable(),
                        TextInput::make('home_booking_banner_button')
                            ->label('Teks Tombol Aksi')
                            ->nullable(),
                    ]),

                Section::make('Gambar Latar Animasi (Background Image)')
                    ->description('Pilih foto ruang atau venue Alat Kopi Malang yang tampil dengan efek animasi zoom ambient.')
                    ->schema([
                        Grid::make(2)->schema([
                            FileUpload::make('home_booking_banner_image')
                                ->label('Upload Foto Ruangan')
                                ->disk('public')
                                ->directory('home-banners')
                                ->visibility('public')
                                ->image()
                                ->imageEditor()
                                ->helperText('Rekomendasi rasio landscape lebar (16:9 atau 21:9), min. 1600x900px.'),
                            TextInput::make('home_booking_banner_image_url')
                                ->label('Atau Masukkan URL Gambar Eksternal')
                                ->placeholder('https://images.unsplash.com/...'),
                        ]),
                    ]),
            ]);
    }

    public function save(): void
    {
        $data = $this->form->getState();

        $upload = $data['home_booking_banner_image'] ?? null;
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
            $finalBannerImg = ! empty($data['home_booking_banner_image_url']) ? $data['home_booking_banner_image_url'] : null;
        }

        $data['home_booking_banner_image'] = $finalBannerImg;

        foreach ($data as $key => $value) {
            Setting::set($key, $value);
        }

        Cache::forget('sanubari_settings');

        Notification::make()
            ->title('Pengaturan Banner Booking Tempat Berhasil Disimpan!')
            ->body('Perubahan banner animasi di halaman beranda telah diperbarui.')
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

