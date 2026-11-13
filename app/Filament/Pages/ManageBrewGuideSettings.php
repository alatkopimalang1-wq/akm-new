<?php

namespace App\Filament\Pages;

use App\Models\Setting;
use BackedEnum;
use Filament\Actions\Action;
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
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Illuminate\Support\Facades\Cache;

class ManageBrewGuideSettings extends Page
{
    protected static string|BackedEnum|null $navigationIcon = Heroicon::BookOpen;

    protected static string|\UnitEnum|null $navigationGroup = 'Konten & Media';

    protected static ?string $navigationLabel = 'Panduan & Resep Seduh';

    protected static ?string $title = 'Pengaturan Halaman Panduan Seduh (/panduan-seduh)';

    protected static ?int $navigationSort = 3;

    /**
     * @var array<string, mixed> | null
     */
    public ?array $data = [];

    public function mount(): void
    {
        $settings = Setting::all()->pluck('value', 'key')->toArray();
        $brew = $settings['brew_guide_settings'] ?? [];

        $defaultV60Phases = [
            [
                'name' => 'Blooming',
                'time_range' => '0:00 - 0:45',
                'end_second' => 45,
                'title' => 'Fase 1: Blooming & Pelepasan Gas CO2',
                'instruction' => 'Tuang air panas secara melingkar dari tengah ke luar. Biarkan mengembang selama 45 detik agar gas CO2 terlepas sempurna.',
            ],
            [
                'name' => 'Tuang 1',
                'time_range' => '0:45 - 1:20',
                'end_second' => 80,
                'title' => 'Fase 2: Tuangan Pertama (Acidity & Sweetness)',
                'instruction' => 'Tuang perlahan stabil memutar. Senyawa buah dan keasaman manis alami kopi terekstraksi mekar sempurna.',
            ],
            [
                'name' => 'Tuang 2',
                'time_range' => '1:20 - 2:00',
                'end_second' => 120,
                'title' => 'Fase 3: Tuangan Kedua (Body & Caramel Sweetness)',
                'instruction' => 'Lanjutkan tuangan kedua untuk mengunci body dan rasa manis karamel yang tebal dan seimbang.',
            ],
            [
                'name' => 'Tuang Akhir',
                'time_range' => '2:00 - 2:30',
                'end_second' => 150,
                'title' => 'Fase 4: Tuangan Terakhir (Klaritas Rasa)',
                'instruction' => 'Selesaikan sisa tuangan air target. Lakukan satu kali swirl lembut pada corong V60 untuk meratakan ampas.',
            ],
            [
                'name' => 'Akhir & Tiris',
                'time_range' => '2:30 - 3:00',
                'end_second' => 180,
                'title' => 'Fase 5: Drawdown & Penirisan Akhir',
                'instruction' => 'Biarkan air mengalir tuntas melalui ampas kopi. Angkat dripper saat tetesan air mulai terputus.',
            ],
        ];

        $defaultIcePhases = [
            [
                'name' => 'Bloom 93°C',
                'time_range' => '0:00 - 0:40',
                'end_second' => 40,
                'title' => 'Fase 1: Bloom Suhu Tinggi 93°C',
                'instruction' => 'Tuang air panas mendidih 93°C di atas ampas kopi dengan server berisi es batu kristal padat di bawahnya.',
            ],
            [
                'name' => 'Flash Chill',
                'time_range' => '0:40 - 1:25',
                'end_second' => 85,
                'title' => 'Fase 2: Flash Chill Extraction',
                'instruction' => 'Tuang air panas kedua. Air kopi pekat panas langsung menetes membentur es batu, mengunci aroma volatil buah.',
            ],
            [
                'name' => 'Tuang Akhir',
                'time_range' => '1:25 - 2:15',
                'end_second' => 135,
                'title' => 'Fase 3: Tuangan Air Panas Terakhir',
                'instruction' => 'Selesaikan tuangan sisa air panas hingga target takaran air panas tercapai.',
            ],
            [
                'name' => 'Swirl Bersama Es',
                'time_range' => '2:15 - 2:45',
                'end_second' => 165,
                'title' => 'Fase 4: Drawdown & Swirl Server Bersama Es',
                'instruction' => 'Angkat dripper, lalu putar (swirl) server kaca hingga kopi dingin merata dan es batu mencair sempurna.',
            ],
        ];

        $this->form->fill([
            // Tab 1: Hero & Kalkulator
            'hero_badge' => $brew['hero_badge'] ?? 'ALAT KOPI MALANG BREW STUDIO • PANDUAN & TIMER PRESISI',
            'hero_title' => $brew['hero_title'] ?? 'Resep Seduh V60 Pour Over & Japanese Ice Coffee',
            'hero_subtitle' => $brew['hero_subtitle'] ?? 'Keluarkan potensi terbaik dari biji kopi specialty lereng Gunung Kawi. Sesuaikan takaran dosis kopi, atur sendiri rasio perbandingan air, dan jalankan timer interaktif langkah demi langkah secara langsung.',
            'mode_v60_label' => $brew['mode_v60_label'] ?? 'V60 Pour Over (Hangat)',
            'mode_ice_label' => $brew['mode_ice_label'] ?? 'Japanese Ice (Dingin)',

            'calc_title' => $brew['calc_title'] ?? 'Kalkulator Takaran & Rasio Seduh',
            'calc_subtitle' => $brew['calc_subtitle'] ?? 'Geser slider untuk menyesuaikan dosis kopi dan rasio kepekatan air.',
            'v60_default_grams' => (int) ($brew['v60_default_grams'] ?? 15),
            'v60_default_ratio' => (float) ($brew['v60_default_ratio'] ?? 15),
            'ice_default_grams' => (int) ($brew['ice_default_grams'] ?? 18),
            'ice_default_ratio' => (float) ($brew['ice_default_ratio'] ?? 15),
            'grams_min' => (int) ($brew['grams_min'] ?? 8),
            'grams_max' => (int) ($brew['grams_max'] ?? 40),
            'ratio_min' => (float) ($brew['ratio_min'] ?? 10),
            'ratio_max' => (float) ($brew['ratio_max'] ?? 20),
            'ratio_step' => (float) ($brew['ratio_step'] ?? 0.5),

            'grind_size_text' => $brew['grind_size_text'] ?? 'Gilingan: Medium-Fine',
            'v60_temp_text' => $brew['v60_temp_text'] ?? '(92–93°C)',

            // Tab 2: V60 Pour Over
            'timer_badge' => $brew['timer_badge'] ?? 'LIVE BREWING STOPWATCH TIMER',
            'v60_timer_title' => $brew['v60_timer_title'] ?? 'Timer Asisten Seduh V60 Pour Over',
            'v60_timer_desc' => $brew['v60_timer_desc'] ?? 'Jalankan timer langsung di browser Anda saat mulai menuang. Notifikasi suara halus dan panduan takaran akan memandu Anda di setiap detik ekstraksi.',
            'v60_target_seconds' => (int) ($brew['v60_target_seconds'] ?? 180),
            'v60_standby_title' => $brew['v60_standby_title'] ?? 'Siap Menyeduh V60',
            'v60_standby_instruction' => $brew['v60_standby_instruction'] ?? 'Ratakan bubuk kopi di dripper. Tekan tombol "Mulai Seduh" saat menuang air blooming pertama.',
            'v60_completed_title' => $brew['v60_completed_title'] ?? '🎉 Seduhan V60 Hangat Selesai!',
            'v60_completed_instruction' => $brew['v60_completed_instruction'] ?? 'Goyangkan server kopi agar seluruh ekstraksi bercampur rata. Tuang ke cangkir dan nikmati aromanya!',
            'v60_phases' => $brew['v60_phases'] ?? $defaultV60Phases,

            // Tab 3: Japanese Ice Coffee
            'ice_timer_title' => $brew['ice_timer_title'] ?? 'Timer Asisten Seduh Japanese Ice Coffee',
            'ice_timer_desc' => $brew['ice_timer_desc'] ?? 'Jalankan timer langsung di browser Anda saat mulai menuang. Notifikasi suara halus dan panduan takaran akan memandu Anda di setiap detik ekstraksi.',
            'ice_target_seconds' => (int) ($brew['ice_target_seconds'] ?? 165),
            'ice_standby_title' => $brew['ice_standby_title'] ?? 'Siap Menyeduh Japanese Ice Coffee',
            'ice_standby_instruction' => $brew['ice_standby_instruction'] ?? 'Pastikan es batu sudah ada di server. Tekan "Mulai Seduh" saat tuangan air 93°C dimulai.',
            'ice_completed_title' => $brew['ice_completed_title'] ?? '🎉 Japanese Ice Coffee Segar Selesai!',
            'ice_completed_instruction' => $brew['ice_completed_instruction'] ?? 'Tuang ke gelas saji yang telah diisi es batu baru. Rasakan ledakan aroma buah dan keasaman renyah alami!',
            'ice_phases' => $brew['ice_phases'] ?? $defaultIcePhases,

            // Tab 4: SEO & Metadata
            'meta_title' => $brew['meta_title'] ?? 'Resep Seduh V60 Pour Over & Japanese Ice Coffee — Alat Kopi Malang',
            'meta_description' => $brew['meta_description'] ?? 'Panduan lengkap dan resep presisi seduh V60 Pour Over hangat dan Japanese Ice Coffee dingin segar dari Alat Kopi Malang. Takaran gramatur, rasio air, suhu, dan timer seduh interaktif.',
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
                Tabs::make('BrewGuideSettingsTabs')
                    ->tabs([
                        // Tab 1: Hero Header & Slider Kalkulator
                        Tab::make('Hero & Kalkulator')
                            ->icon(Heroicon::AdjustmentsHorizontal)
                            ->schema([
                                Section::make('Header Utama & Switcher Mode')
                                    ->description('Pengaturan badge, teks judul besar, dan tombol pilihan mode seduh.')
                                    ->schema([
                                        TextInput::make('hero_badge')
                                            ->label('Badge Atas Hero')
                                            ->placeholder('ALAT KOPI MALANG BREW STUDIO • PANDUAN & TIMER PRESISI')
                                            ->required(),
                                        TextInput::make('hero_title')
                                            ->label('Judul Besar Halaman')
                                            ->placeholder('Resep Seduh V60 Pour Over & Japanese Ice Coffee')
                                            ->required(),
                                        Textarea::make('hero_subtitle')
                                            ->label('Deskripsi Pengantar Hero')
                                            ->rows(3)
                                            ->required(),
                                        Grid::make(2)->schema([
                                            TextInput::make('mode_v60_label')
                                                ->label('Label Mode V60 Hangat')
                                                ->default('V60 Pour Over (Hangat)')
                                                ->required(),
                                            TextInput::make('mode_ice_label')
                                                ->label('Label Mode Japanese Ice')
                                                ->default('Japanese Ice (Dingin)')
                                                ->required(),
                                        ]),
                                    ]),

                                Section::make('Parameter Slider Kalkulator Takaran')
                                    ->description('Pengaturan batas minimal, maksimal, nilai default, tombol preset cepat, dan catatan rasio.')
                                    ->schema([
                                        Grid::make(2)->schema([
                                            TextInput::make('calc_title')
                                                ->label('Judul Kalkulator')
                                                ->default('Kalkulator Takaran & Rasio Seduh')
                                                ->required(),
                                            TextInput::make('calc_subtitle')
                                                ->label('Subjudul Petunjuk Slider')
                                                ->default('Geser slider untuk menyesuaikan dosis kopi dan rasio kepekatan air.')
                                                ->required(),
                                        ]),

                                        Section::make('Nilai Bawaan (Default Values)')
                                            ->schema([
                                                Grid::make(4)->schema([
                                                    TextInput::make('v60_default_grams')
                                                        ->label('Default Gram V60')
                                                        ->numeric()
                                                        ->suffix('Gram')
                                                        ->required(),
                                                    TextInput::make('v60_default_ratio')
                                                        ->label('Default Rasio V60')
                                                        ->numeric()
                                                        ->prefix('1 :')
                                                        ->required(),
                                                    TextInput::make('ice_default_grams')
                                                        ->label('Default Gram Ice')
                                                        ->numeric()
                                                        ->suffix('Gram')
                                                        ->required(),
                                                    TextInput::make('ice_default_ratio')
                                                        ->label('Default Rasio Ice')
                                                        ->numeric()
                                                        ->prefix('1 :')
                                                        ->required(),
                                                ]),
                                            ]),

                                        Section::make('Rentang Slider (Slider Constraints)')
                                            ->schema([
                                                Grid::make(5)->schema([
                                                    TextInput::make('grams_min')
                                                        ->label('Gramatur Minimal')
                                                        ->numeric()
                                                        ->suffix('g')
                                                        ->required(),
                                                    TextInput::make('grams_max')
                                                        ->label('Gramatur Maksimal')
                                                        ->numeric()
                                                        ->suffix('g')
                                                        ->required(),
                                                    TextInput::make('ratio_min')
                                                        ->label('Rasio Minimal')
                                                        ->numeric()
                                                        ->prefix('1 :')
                                                        ->required(),
                                                    TextInput::make('ratio_max')
                                                        ->label('Rasio Maksimal')
                                                        ->numeric()
                                                        ->prefix('1 :')
                                                        ->required(),
                                                    TextInput::make('ratio_step')
                                                        ->label('Langkah Slider (Step)')
                                                        ->numeric()
                                                        ->step(0.1)
                                                        ->required(),
                                                ]),
                                            ]),

                                        Section::make('Keterangan Kartu Output (Gilingan & Suhu Air)')
                                            ->description('Label keterangan gilingan kopi dan estimasi suhu air panas pada kartu hasil perhitungan.')
                                            ->schema([
                                                Grid::make(2)->schema([
                                                    TextInput::make('grind_size_text')
                                                        ->label('Keterangan Gilingan')
                                                        ->placeholder('Gilingan: Medium-Fine')
                                                        ->required(),
                                                    TextInput::make('v60_temp_text')
                                                        ->label('Keterangan Suhu Air Panas')
                                                        ->placeholder('(92–93°C)')
                                                        ->required(),
                                                ]),
                                            ]),
                                    ]),
                            ]),

                        // Tab 2: V60 Pour Over
                        Tab::make('Resep V60 (Hangat)')
                            ->icon(Heroicon::Sun)
                            ->schema([
                                Section::make('Header & Stopwatch V60')
                                    ->schema([
                                        TextInput::make('timer_badge')
                                            ->label('Badge Stopwatch Timer')
                                            ->placeholder('LIVE BREWING STOPWATCH TIMER')
                                            ->required(),
                                        Grid::make(2)->schema([
                                            TextInput::make('v60_timer_title')
                                                ->label('Judul Timer V60')
                                                ->default('Timer Asisten Seduh V60 Pour Over')
                                                ->required(),
                                            TextInput::make('v60_target_seconds')
                                                ->label('Target Waktu Total (Detik)')
                                                ->numeric()
                                                ->suffix('Detik (misal: 180s = 03:00)')
                                                ->required(),
                                        ]),
                                        Textarea::make('v60_timer_desc')
                                            ->label('Deskripsi Petunjuk Timer')
                                            ->rows(2)
                                            ->required(),
                                        Grid::make(2)->schema([
                                            TextInput::make('v60_standby_title')
                                                ->label('Judul Standby (Sebelum Mulai)')
                                                ->default('Siap Menyeduh V60')
                                                ->required(),
                                            TextInput::make('v60_standby_instruction')
                                                ->label('Instruksi Standby')
                                                ->default('Ratakan bubuk kopi di dripper. Tekan tombol "Mulai Seduh" saat menuang air blooming pertama.')
                                                ->required(),
                                        ]),
                                    ]),

                                Section::make('Fase-Fase Seduh V60 Pour Over')
                                    ->description('Tahapan petunjuk yang akan otomatis berganti sesuai durasi stopwatch.')
                                    ->schema([
                                        Repeater::make('v60_phases')
                                            ->label('Daftar Fase Seduhan')
                                            ->schema([
                                                Grid::make(12)->schema([
                                                    TextInput::make('name')
                                                        ->label('Nama Chip Milestone')
                                                        ->placeholder('Blooming')
                                                        ->columnSpan(3)
                                                        ->required(),
                                                    TextInput::make('time_range')
                                                        ->label('Label Durasi')
                                                        ->placeholder('0:00 - 0:45')
                                                        ->columnSpan(3)
                                                        ->required(),
                                                    TextInput::make('end_second')
                                                        ->label('Batas Detik')
                                                        ->numeric()
                                                        ->suffix('detik')
                                                        ->columnSpan(2)
                                                        ->required(),
                                                    TextInput::make('title')
                                                        ->label('Judul Lengkap Fase')
                                                        ->placeholder('Fase 1: Blooming')
                                                        ->columnSpan(4)
                                                        ->required(),
                                                ]),
                                                Textarea::make('instruction')
                                                    ->label('Teks Petunjuk Tindakan Barista/Pengguna')
                                                    ->rows(2)
                                                    ->required(),
                                            ])
                                            ->defaultItems(5)
                                            ->collapsible(),
                                    ]),

                                Section::make('Pesan Penutup Saat Selesai')
                                    ->schema([
                                        Grid::make(2)->schema([
                                            TextInput::make('v60_completed_title')
                                                ->label('Judul Selesai')
                                                ->default('🎉 Seduhan V60 Hangat Selesai!')
                                                ->required(),
                                            TextInput::make('v60_completed_instruction')
                                                ->label('Petunjuk Sajian Selesai')
                                                ->default('Goyangkan server kopi agar seluruh ekstraksi bercampur rata. Tuang ke cangkir dan nikmati aromanya!')
                                                ->required(),
                                        ]),
                                    ]),
                            ]),

                        // Tab 3: Japanese Ice Coffee
                        Tab::make('Resep Japanese Ice')
                            ->icon(Heroicon::Sparkles)
                            ->schema([
                                Section::make('Header & Stopwatch Japanese Ice')
                                    ->schema([
                                        Grid::make(2)->schema([
                                            TextInput::make('ice_timer_title')
                                                ->label('Judul Timer Japanese Ice')
                                                ->default('Timer Asisten Seduh Japanese Ice Coffee')
                                                ->required(),
                                            TextInput::make('ice_target_seconds')
                                                ->label('Target Waktu Total (Detik)')
                                                ->numeric()
                                                ->suffix('Detik (misal: 165s = 02:45)')
                                                ->required(),
                                        ]),
                                        Textarea::make('ice_timer_desc')
                                            ->label('Deskripsi Petunjuk Timer')
                                            ->rows(2)
                                            ->required(),
                                        Grid::make(2)->schema([
                                            TextInput::make('ice_standby_title')
                                                ->label('Judul Standby (Sebelum Mulai)')
                                                ->default('Siap Menyeduh Japanese Ice Coffee')
                                                ->required(),
                                            TextInput::make('ice_standby_instruction')
                                                ->label('Instruksi Standby')
                                                ->default('Pastikan es batu sudah ada di server. Tekan "Mulai Seduh" saat tuangan air 93°C dimulai.')
                                                ->required(),
                                        ]),
                                    ]),

                                Section::make('Fase-Fase Seduh Japanese Ice')
                                    ->description('Tahapan petunjuk ekstraksi Japanese Ice coffee di atas es batu.')
                                    ->schema([
                                        Repeater::make('ice_phases')
                                            ->label('Daftar Fase Seduhan')
                                            ->schema([
                                                Grid::make(12)->schema([
                                                    TextInput::make('name')
                                                        ->label('Nama Chip Milestone')
                                                        ->placeholder('Bloom 93°C')
                                                        ->columnSpan(3)
                                                        ->required(),
                                                    TextInput::make('time_range')
                                                        ->label('Label Durasi')
                                                        ->placeholder('0:00 - 0:40')
                                                        ->columnSpan(3)
                                                        ->required(),
                                                    TextInput::make('end_second')
                                                        ->label('Batas Detik')
                                                        ->numeric()
                                                        ->suffix('detik')
                                                        ->columnSpan(2)
                                                        ->required(),
                                                    TextInput::make('title')
                                                        ->label('Judul Lengkap Fase')
                                                        ->placeholder('Fase 1: Bloom Suhu Tinggi')
                                                        ->columnSpan(4)
                                                        ->required(),
                                                ]),
                                                Textarea::make('instruction')
                                                    ->label('Teks Petunjuk Tindakan Barista/Pengguna')
                                                    ->rows(2)
                                                    ->required(),
                                            ])
                                            ->defaultItems(4)
                                            ->collapsible(),
                                    ]),

                                Section::make('Pesan Penutup Saat Selesai')
                                    ->schema([
                                        Grid::make(2)->schema([
                                            TextInput::make('ice_completed_title')
                                                ->label('Judul Selesai')
                                                ->default('🎉 Japanese Ice Coffee Segar Selesai!')
                                                ->required(),
                                            TextInput::make('ice_completed_instruction')
                                                ->label('Petunjuk Sajian Selesai')
                                                ->default('Tuang ke gelas saji yang telah diisi es batu baru. Rasakan ledakan aroma buah dan keasaman renyah alami!')
                                                ->required(),
                                        ]),
                                    ]),
                            ]),

                        // Tab 4: SEO & Metadata
                        Tab::make('SEO & Metadata')
                            ->icon(Heroicon::GlobeAlt)
                            ->schema([
                                Section::make('Metadata Mesin Pencari (Search Engine)')
                                    ->description('Optimasi judul tab browser dan cuplikan deskripsi Google.')
                                    ->schema([
                                        TextInput::make('meta_title')
                                            ->label('Meta Title (Judul Tab Browser)')
                                            ->placeholder('Resep Seduh V60 Pour Over & Japanese Ice Coffee — Alat Kopi Malang')
                                            ->required(),
                                        Textarea::make('meta_description')
                                            ->label('Meta Description')
                                            ->rows(3)
                                            ->required(),
                                    ]),
                            ]),
                    ]),
            ]);
    }

    public function save(): void
    {
        $data = $this->form->getState();

        Setting::set('brew_guide_settings', $data);

        Cache::forget('sanubari_settings');
        Cache::forget('brew_guide_settings');

        Notification::make()
            ->title('Pengaturan Panduan Seduh Berhasil Disimpan!')
            ->body('Seluruh konten judul hero, takaran kalkulator, dan tahapan instruksi stopwatch /panduan-seduh telah diperbarui.')
            ->success()
            ->send();
    }

    protected function getFormActions(): array
    {
        return [
            Action::make('save')
                ->label('Simpan Pengaturan Panduan Seduh')
                ->submit('save'),
        ];
    }
}
