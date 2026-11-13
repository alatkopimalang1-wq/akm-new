<?php

namespace App\Filament\Pages\HalamanAwal;

use App\Filament\Resources\VideoReels\VideoReelResource;
use App\Models\Setting;
use BackedEnum;
use Filament\Actions\Action;
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

class ManageReelsSettings extends Page
{
    protected static string|BackedEnum|null $navigationIcon = Heroicon::Film;

    protected static string|\UnitEnum|null $navigationGroup = 'Halaman Awal';

    protected static ?string $navigationLabel = 'Judul & Info Reels';

    protected static ?string $title = 'Pengaturan Judul & Deskripsi Video Reels';

    protected static ?int $navigationSort = 6;

    /**
     * @var array<string, mixed> | null
     */
    public ?array $data = [];

    public function mount(): void
    {
        $settings = Setting::all()->pluck('value', 'key')->toArray();

        $this->form->fill([
            'home_reels_title' => $settings['home_reels_title'] ?? 'Alat Kopi Malang Reels Videos',
            'home_reels_subtitle' => $settings['home_reels_subtitle'] ?? 'Tonton tutorial seduh, bedah mesin & tips kopi langsung di Instagram Reels',
            'home_reels_view_all_text' => $settings['home_reels_view_all_text'] ?? 'Lihat Semua',
            'home_reels_view_all_url' => $settings['home_reels_view_all_url'] ?? '/video',
            'home_reels_instagram_url' => $settings['home_reels_instagram_url'] ?? ($settings['instagram'] ?? 'https://www.instagram.com/alatkopimalang/'),
            'reels_page_title' => $settings['reels_page_title'] ?? 'Alat Kopi Malang Reels Videos',
            'reels_page_description' => $settings['reels_page_description'] ?? 'Klik salah satu video untuk langsung menonton tayangan resmi di aplikasi Instagram. Temukan tips barista, review mesin espresso, hingga tutorial seduh kopi manual.',
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
                Section::make('Header Bagian Video Reels di Halaman Awal')
                    ->description('Atur judul dan deskripsi yang tampil pada banner/slider Video Reels di halaman awal.')
                    ->icon(Heroicon::Film)
                    ->schema([
                        Grid::make(2)->schema([
                            TextInput::make('home_reels_title')
                                ->label('Judul Bagian Reels (Section Title)')
                                ->required()
                                ->placeholder('Alat Kopi Malang Reels Videos')
                                ->helperText('Judul di sebelah ikon Instagram pada halaman beranda.'),
                            TextInput::make('home_reels_view_all_text')
                                ->label('Teks Tautan Lihat Semua')
                                ->default('Lihat Semua')
                                ->required(),
                        ]),
                        Textarea::make('home_reels_subtitle')
                            ->label('Deskripsi / Subtitle Bagian Reels')
                            ->rows(3)
                            ->required()
                            ->placeholder('Tonton tutorial seduh, bedah mesin & tips kopi langsung di Instagram Reels')
                            ->helperText('Teks penjelasan kecil di bawah judul video reels.'),
                        Grid::make(2)->schema([
                            TextInput::make('home_reels_view_all_url')
                                ->label('URL Tautan Lihat Semua')
                                ->default('/video')
                                ->required()
                                ->helperText('Rute halaman tujuan saat tombol Lihat Semua diklik.'),
                            TextInput::make('home_reels_instagram_url')
                                ->label('Tautan Akun Instagram Reels Resmi')
                                ->url()
                                ->placeholder('https://www.instagram.com/alatkopimalang/'),
                        ]),
                    ]),

                Section::make('Header Halaman Galeri Video Reels (/video)')
                    ->description('Atur judul dan deskripsi pengantar pada halaman galeri video reels penuh (/video).')
                    ->icon(Heroicon::Sparkles)
                    ->collapsible()
                    ->schema([
                        TextInput::make('reels_page_title')
                            ->label('Judul Banner Halaman')
                            ->required()
                            ->placeholder('Alat Kopi Malang Reels Videos'),
                        Textarea::make('reels_page_description')
                            ->label('Deskripsi / Paragraf Pengantar Halaman')
                            ->rows(3)
                            ->required()
                            ->placeholder('Klik salah satu video untuk langsung menonton tayangan resmi di aplikasi Instagram...'),
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
            ->title('Pengaturan Video Reels Berhasil Disimpan!')
            ->body('Judul dan deskripsi video reels di halaman awal telah diperbarui.')
            ->success()
            ->send();
    }

    protected function getFormActions(): array
    {
        return [
            Action::make('save')
                ->label('Simpan Pengaturan')
                ->submit('save'),
            Action::make('manageCards')
                ->label('Kelola Daftar Video Reels')
                ->icon(Heroicon::ListBullet)
                ->color('gray')
                ->url(VideoReelResource::getUrl('index')),
        ];
    }
}

