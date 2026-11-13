<?php

namespace App\Filament\Pages\HalamanAwal;

use App\Models\Setting;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Placeholder;
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
use Illuminate\Support\HtmlString;

class ManageVideoStats extends Page
{
    protected static string|BackedEnum|null $navigationIcon = Heroicon::VideoCamera;

    protected static string|\UnitEnum|null $navigationGroup = 'Halaman Awal';

    protected static ?string $navigationLabel = 'Video & Statistik';

    protected static ?string $title = 'Pengaturan Video Studio & Statistik Terroir';

    protected static ?int $navigationSort = 4;

    /**
     * @var array<string, mixed> | null
     */
    public ?array $data = [];

    public function mount(): void
    {
        $settings = Setting::all()->pluck('value', 'key')->toArray();

        $uploadVal = $settings['home_video_upload'] ?? null;
        if (is_array($uploadVal)) {
            $uploadVal = !empty($uploadVal) ? array_values($uploadVal)[0] : null;
        }

        $urlVal = $settings['home_video_url'] ?? null;
        if ($urlVal === '/' || trim((string) $urlVal) === '') {
            $urlVal = null;
        }

        $this->form->fill([
            'home_video_upload' => $uploadVal,
            'home_video_url' => $urlVal,

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
                Section::make('Video Sinematik Studio Sangrai')
                    ->description('Upload video latar atmosferik studio sangrai (ditampilkan tanpa teks judul & badge).')
                    ->schema([
                        Grid::make(2)->schema([
                            FileUpload::make('home_video_upload')
                                ->label('Upload File Video (.mp4 / .webm)')
                                ->disk('public')
                                ->directory('videos')
                                ->visibility('public')
                                ->acceptedFileTypes(['video/mp4', 'video/webm', 'video/quicktime'])
                                ->maxSize(102400)
                                ->helperText('Upload video studio sangrai lokal (MP4/WEBM, maks. 100MB). Video yang diupload akan otomatis ditampilkan di halaman beranda.')
                                ->live(),
                            TextInput::make('home_video_url')
                                ->label('Atau URL Video Eksternal (CDN / Cloud)')
                                ->placeholder('https://www.smokingbarrels.coffee/media/home-hero-video.mp4')
                                ->helperText('Digunakan bila video dihosting di luar server atau CDN. Kosongkan jika sudah mengupload file video.')
                                ->nullable()
                                ->live(),
                        ]),
                        Placeholder::make('video_preview')
                            ->label('Pratinjau Video Aktif di Beranda')
                            ->content(function ($get): HtmlString {
                                $upload = $get('home_video_upload');
                                $url = $get('home_video_url');

                                $src = null;
                                if ($upload) {
                                    $path = is_array($upload) ? array_values($upload)[0] : $upload;
                                    if (is_string($path) && trim($path) !== '') {
                                        $clean = preg_replace('/^\/?(public\/|storage\/)?/', '', trim($path));
                                        $src = "/storage/{$clean}";
                                    }
                                }
                                if (! $src && $url && is_string($url) && trim($url) !== '') {
                                    $src = trim($url);
                                }
                                if (! $src) {
                                    $src = '/storage/videos/BotsXqCoDHV1eo691EE9HpktTYWD1qLIWVUpieq4.mp4';
                                }

                                return new HtmlString("
                                    <div style='max-width: 640px; border-radius: 14px; overflow: hidden; background: #0f172a; box-shadow: 0 4px 14px rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.12);'>
                                        <video src='{$src}' controls preload='metadata' style='width: 100%; max-height: 320px; display: block; object-fit: contain; background: #000;'>
                                            Browser Anda tidak mendukung pemutar video HTML5.
                                        </video>
                                        <div style='padding: 8px 14px; font-size: 11px; color: #94a3b8; background: #0b1120; display: flex; align-items: center; justify-content: space-between;'>
                                            <span>Sumber: <code style='color: #38bdf8; font-weight: 600;'>{$src}</code></span>
                                            <span style='color: #4ade80;'>● Siap Tayang</span>
                                        </div>
                                    </div>
                                ");
                            }),
                    ]),

                Section::make('Statistik Terroir & Dampak (Angka Animasi)')
                    ->description('4 kartu metrik dengan efek animasi angka berjalan (CountingNumber) di bawah video.')
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

        $videoUpload = $data['home_video_upload'] ?? null;
        if (is_array($videoUpload)) {
            $videoUpload = ! empty($videoUpload) ? array_values($videoUpload)[0] : null;
        }
        $data['home_video_upload'] = $videoUpload;

        // Automatically optimize MP4 with faststart so progressive playback starts immediately
        if ($videoUpload && is_string($videoUpload)) {
            $clean = preg_replace('/^\/?(public\/|storage\/)?/', '', trim($videoUpload));
            $fullPath = storage_path("app/public/{$clean}");
            if (file_exists($fullPath) && pathinfo($fullPath, PATHINFO_EXTENSION) === 'mp4') {
                @exec('python3 -m qtfaststart ' . escapeshellarg($fullPath) . ' ' . escapeshellarg("{$fullPath}.tmp") . ' && mv ' . escapeshellarg("{$fullPath}.tmp") . ' ' . escapeshellarg($fullPath));
            }
        }

        if (isset($data['home_video_url'])) {
            $trimmed = trim((string) $data['home_video_url']);
            $data['home_video_url'] = ($trimmed === '' || $trimmed === '/') ? null : $trimmed;
        }

        foreach ($data as $key => $value) {
            Setting::set($key, $value);
        }

        Cache::forget('sanubari_settings');

        Notification::make()
            ->title('Video & Statistik Berhasil Disimpan!')
            ->body('Konten video dan statistik terroir beranda telah diperbarui.')
            ->success()
            ->send();
    }

    protected function getFormActions(): array
    {
        return [
            Action::make('save')
                ->label('Simpan Video & Statistik')
                ->submit('save'),
        ];
    }
}
