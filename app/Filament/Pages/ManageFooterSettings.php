<?php

namespace App\Filament\Pages;

use App\Models\Setting;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
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

class ManageFooterSettings extends Page
{
    protected static string|BackedEnum|null $navigationIcon = Heroicon::Bars3BottomLeft;

    protected static string|\UnitEnum|null $navigationGroup = 'Pengaturan';

    protected static ?string $navigationLabel = 'Pengaturan Footer';

    protected static ?string $title = 'Pengaturan Footer Website';

    protected static ?int $navigationSort = 13;

    /**
     * @var array<string, mixed> | null
     */
    public ?array $data = [];

    public static function defaultFooterSettings(): array
    {
        return [
            // Kolom 1: Brand Info & Showroom
            'brand_title' => 'Alat Kopi Malang',
            'brand_tagline' => 'Close to Every Brew',
            'brand_description' => 'Roastery kopi artisan yang berfokus pada eksplorasi biji kopi Gunung Kawi, proses klasik, eksperimental, dan co-fermentasi presisi di Malang, Jawa Timur.',
            'brand_logo' => null,
            'showroom_label' => 'Roastery & Showroom:',
            'showroom_name' => 'Alat Kopi Malang',
            'showroom_address' => 'Jl. Terusan Kawi No. 12, Klojen, Malang',

            // Kolom 2: Menu Tautan 1
            'column_2_title' => 'Alat Kopi Malang',
            'column_2_links' => [
                ['label' => 'Tentang Kami', 'url' => '/tentang', 'is_external' => false, 'is_active' => true],
                ['label' => 'Kemitraan Kedai', 'url' => '/wholesale', 'is_external' => false, 'is_active' => true],
                ['label' => 'Jasa Roasting Kopi', 'url' => '/jasa-roasting', 'is_external' => false, 'is_active' => true],
                ['label' => 'Training Barista', 'url' => '/training-barista', 'is_external' => false, 'is_active' => true],
                ['label' => 'Artikel Alat Kopi Malang', 'url' => '/blog', 'is_external' => false, 'is_active' => true],
                ['label' => 'Lacak Pesanan & Pembayaran', 'url' => '/lacak-pesanan', 'is_external' => false, 'is_active' => true],
            ],

            // Kolom 3: Menu Tautan 2
            'column_3_title' => 'Eksplorasi & Seduh',
            'column_3_links' => [
                ['label' => 'Resep & Panduan Seduh', 'url' => '/panduan-seduh', 'is_external' => false, 'is_active' => true],
                ['label' => 'C.Y.B.R Custom Blend', 'url' => '/cybr', 'is_external' => false, 'is_active' => true],
                ['label' => 'Flash Sale Kopi Pilihan', 'url' => '/flash-sale', 'is_external' => false, 'is_active' => true],
                ['label' => 'Public Cupping & Workshop', 'url' => '/acara', 'is_external' => false, 'is_active' => true],
                ['label' => 'Kunjungi Slow Bar & Roastery', 'url' => '/kunjungi', 'is_external' => false, 'is_active' => true],
            ],

            // Kolom 4: Operasional & Kontak
            'column_4_title' => 'Jam Operasional & Kontak',
            'hours' => 'Buka setiap hari: 09.00 – 23.00 WIB',
            'phone' => '+6285121930454',
            'whatsapp' => '6285121930454',
            'city' => 'Kota Malang, Jawa Timur',
            'whatsapp_cta_text' => 'Pesan via WhatsApp',
            'whatsapp_message' => 'Halo Alat Kopi Malang! Saya ingin bertanya tentang produk kopi.',

            // Sosial Media
            'social_title' => 'Dapatkan Update Seputar Kopi',
            'instagram' => 'https://instagram.com/alatkopimalang',
            'facebook' => 'https://facebook.com/alatkopimalang',
            'x_url' => 'https://x.com/alatkopimalang',
            'tiktok' => 'https://tiktok.com/@alatkopimalang',
            'youtube' => '',

            // Bottom Bar / Copyright & Legal
            'copyright_text' => '© {year} Alat Kopi Malang. Hak Cipta Dilindungi.',
            'legal_links' => [
                ['label' => 'Syarat & Ketentuan Pre-Order', 'url' => '/syarat-ketentuan-pre-order', 'is_active' => true],
                ['label' => 'Kebijakan Privasi', 'url' => '/legal/privacy', 'is_active' => true],
                ['label' => 'Syarat & Ketentuan', 'url' => '/legal/terms', 'is_active' => true],
                ['label' => 'Kebijakan Retur', 'url' => '/legal/refund', 'is_active' => true],
            ],
        ];
    }

    public function mount(): void
    {
        $existing = Setting::get('footer_settings');
        $defaults = static::defaultFooterSettings();

        // Fallbacks from general settings if footer setting is not set yet
        $generalSettings = Setting::all()->pluck('value', 'key')->toArray();

        if (is_array($existing)) {
            $footerData = array_merge($defaults, $existing);
        } else {
            $footerData = $defaults;
            if (! empty($generalSettings['address'])) {
                $footerData['showroom_address'] = $generalSettings['address'];
            }
            if (! empty($generalSettings['hours'])) {
                $footerData['hours'] = $generalSettings['hours'];
            }
            if (! empty($generalSettings['phone'])) {
                $footerData['phone'] = $generalSettings['phone'];
            }
            if (! empty($generalSettings['whatsapp'])) {
                $footerData['whatsapp'] = $generalSettings['whatsapp'];
            }
            if (! empty($generalSettings['instagram'])) {
                $footerData['instagram'] = $generalSettings['instagram'];
            }
            if (! empty($generalSettings['facebook'])) {
                $footerData['facebook'] = $generalSettings['facebook'];
            }
            if (! empty($generalSettings['x_url']) || ! empty($generalSettings['twitter'])) {
                $footerData['x_url'] = $generalSettings['x_url'] ?? $generalSettings['twitter'];
            }
            if (! empty($generalSettings['tiktok'])) {
                $footerData['tiktok'] = $generalSettings['tiktok'];
            }
        }

        $this->form->fill($footerData);
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
                // SECTION 1: IDENTITAS ROASTERY & SHOWROOM (KOLOM 1 FOOTER)
                Section::make('Kolom 1: Profil Brand & Showroom')
                    ->description('Atur nama roastery, slogan, deskripsi pengantar, dan alamat lokasi roastery / showroom di bagian kiri footer.')
                    ->icon(Heroicon::BuildingStorefront)
                    ->collapsible()
                    ->schema([
                        Grid::make(3)->schema([
                            TextInput::make('brand_title')
                                ->label('Nama Brand Roastery')
                                ->required()
                                ->placeholder('Alat Kopi Malang'),
                            TextInput::make('brand_tagline')
                                ->label('Slogan / Tagline')
                                ->placeholder('Close to Every Brew'),
                            FileUpload::make('brand_logo')
                                ->label('Logo Khusus Footer (Opsional)')
                                ->disk('public')
                                ->directory('footer')
                                ->image()
                                ->imagePreviewHeight('50')
                                ->helperText('Jika dikosongkan, menggunakan logo standar bulat Alat Kopi Malang.'),
                        ]),
                        Textarea::make('brand_description')
                            ->label('Deskripsi Singkat Roastery')
                            ->rows(3)
                            ->required()
                            ->placeholder('Tulis pengantar roastery kopi artisan...'),
                        Grid::make(3)->schema([
                            TextInput::make('showroom_label')
                                ->label('Label Bagian Showroom')
                                ->default('Roastery & Showroom:'),
                            TextInput::make('showroom_name')
                                ->label('Nama Tempat / Kolaborasi')
                                ->placeholder('Alat Kopi Malang'),
                            TextInput::make('showroom_address')
                                ->label('Alamat Roastery & Showroom')
                                ->placeholder('Jl. Terusan Kawi No. 12, Klojen, Malang')
                                ->columnSpan(1),
                        ]),
                    ]),

                // SECTION 2: MENU NAVIGASI 1 (KOLOM 2 FOOTER)
                Section::make('Kolom 2: Tautan Menu Navigasi 1')
                    ->description('Kelola daftar tautan informasi roastery (misal: Tentang Kami, Kemitraan, Blog, dll).')
                    ->icon(Heroicon::ListBullet)
                    ->collapsible()
                    ->schema([
                        TextInput::make('column_2_title')
                            ->label('Judul Kolom 2')
                            ->required()
                            ->default('Alat Kopi Malang'),
                        Repeater::make('column_2_links')
                            ->label('Daftar Tautan Kolom 2')
                            ->schema([
                                Grid::make(4)->schema([
                                    TextInput::make('label')
                                        ->label('Nama Tautan')
                                        ->required()
                                        ->placeholder('cth: Tentang Kami'),
                                    TextInput::make('url')
                                        ->label('URL / Rute')
                                        ->required()
                                        ->placeholder('/tentang atau https://...'),
                                    Toggle::make('is_external')
                                        ->label('Buka Tab Baru')
                                        ->inline(false)
                                        ->default(false),
                                    Toggle::make('is_active')
                                        ->label('Tampilkan')
                                        ->inline(false)
                                        ->default(true),
                                ]),
                            ])
                            ->itemLabel(fn (array $state): ?string => $state['label'] ?? null)
                            ->reorderable()
                            ->collapsible()
                            ->cloneable()
                            ->addActionLabel('+ Tambah Tautan Kolom 2')
                            ->defaultItems(4),
                    ]),

                // SECTION 3: MENU NAVIGASI 2 (KOLOM 3 FOOTER)
                Section::make('Kolom 3: Tautan Menu Navigasi 2')
                    ->description('Kelola daftar tautan eksplorasi, panduan seduh, dan layanan kopi.')
                    ->icon(Heroicon::Sparkles)
                    ->collapsible()
                    ->schema([
                        TextInput::make('column_3_title')
                            ->label('Judul Kolom 3')
                            ->required()
                            ->default('Eksplorasi & Seduh'),
                        Repeater::make('column_3_links')
                            ->label('Daftar Tautan Kolom 3')
                            ->schema([
                                Grid::make(4)->schema([
                                    TextInput::make('label')
                                        ->label('Nama Tautan')
                                        ->required()
                                        ->placeholder('cth: Resep & Panduan Seduh'),
                                    TextInput::make('url')
                                        ->label('URL / Rute')
                                        ->required()
                                        ->placeholder('/panduan-seduh atau https://...'),
                                    Toggle::make('is_external')
                                        ->label('Buka Tab Baru')
                                        ->inline(false)
                                        ->default(false),
                                    Toggle::make('is_active')
                                        ->label('Tampilkan')
                                        ->inline(false)
                                        ->default(true),
                                ]),
                            ])
                            ->itemLabel(fn (array $state): ?string => $state['label'] ?? null)
                            ->reorderable()
                            ->collapsible()
                            ->cloneable()
                            ->addActionLabel('+ Tambah Tautan Kolom 3')
                            ->defaultItems(5),
                    ]),

                // SECTION 4: JAM OPERASIONAL & KONTAK (KOLOM 4 FOOTER)
                Section::make('Kolom 4: Jam Operasional & Tombol Pesan WhatsApp')
                    ->description('Atur jam buka, kontak telepon/WhatsApp, dan teks tombol pemesanan langsung.')
                    ->icon(Heroicon::Clock)
                    ->collapsible()
                    ->schema([
                        Grid::make(3)->schema([
                            TextInput::make('column_4_title')
                                ->label('Judul Kolom 4')
                                ->required()
                                ->default('Jam Operasional & Kontak'),
                            TextInput::make('hours')
                                ->label('Teks Jam Operasional')
                                ->required()
                                ->placeholder('Buka setiap hari: 09.00 – 23.00 WIB'),
                            TextInput::make('city')
                                ->label('Teks Lokasi Kota')
                                ->required()
                                ->placeholder('Kota Malang, Jawa Timur'),
                        ]),
                        Grid::make(2)->schema([
                            TextInput::make('phone')
                                ->label('Nomor Telepon Tampil')
                                ->required()
                                ->placeholder('+6285121930454'),
                            TextInput::make('whatsapp')
                                ->label('Nomor WhatsApp (Format internasional tanpa simbol)')
                                ->required()
                                ->placeholder('6285121930454'),
                        ]),
                        Grid::make(2)->schema([
                            TextInput::make('whatsapp_cta_text')
                                ->label('Teks Tombol CTA WhatsApp')
                                ->required()
                                ->placeholder('Pesan via WhatsApp'),
                            TextInput::make('whatsapp_message')
                                ->label('Pesan Awal Saat Chat WA Diklik')
                                ->placeholder('Halo Alat Kopi Malang! Saya ingin bertanya tentang produk kopi.'),
                        ]),
                    ]),

                // SECTION 5: SOSIAL MEDIA & UPDATE
                Section::make('Bagian Media Sosial & Komunitas')
                    ->description('Tautkan akun Instagram, Facebook, X (Twitter), TikTok, dan YouTube Alat Kopi Malang.')
                    ->icon(Heroicon::Share)
                    ->collapsible()
                    ->schema([
                        TextInput::make('social_title')
                            ->label('Judul Ajakan Sosial Media')
                            ->required()
                            ->default('Dapatkan Update Seputar Kopi'),
                        Grid::make(3)->schema([
                            TextInput::make('instagram')
                                ->label('Instagram URL')
                                ->placeholder('https://instagram.com/alatkopimalang'),
                            TextInput::make('facebook')
                                ->label('Facebook URL')
                                ->placeholder('https://facebook.com/alatkopimalang'),
                            TextInput::make('x_url')
                                ->label('X (Twitter) URL')
                                ->placeholder('https://x.com/alatkopimalang'),
                        ]),
                        Grid::make(2)->schema([
                            TextInput::make('tiktok')
                                ->label('TikTok URL')
                                ->placeholder('https://tiktok.com/@alatkopimalang'),
                            TextInput::make('youtube')
                                ->label('YouTube URL (Opsional)')
                                ->placeholder('https://youtube.com/@alatkopimalang'),
                        ]),
                    ]),

                // SECTION 6: HAK CIPTA & TAUTAN KEBIJAKAN HUKUM (BOTTOM BAR)
                Section::make('Bagian Bawah: Hak Cipta & Kebijakan Hukum')
                    ->description('Teks hak cipta tahunan dan tautan syarat ketentuan serta kebijakan retur di bagian paling bawah.')
                    ->icon(Heroicon::ShieldCheck)
                    ->collapsible()
                    ->schema([
                        TextInput::make('copyright_text')
                            ->label('Teks Hak Cipta (Gunakan {year} untuk tahun otomatis)')
                            ->required()
                            ->default('© {year} Alat Kopi Malang. Hak Cipta Dilindungi.'),
                        Repeater::make('legal_links')
                            ->label('Daftar Tautan Hukum / Legal')
                            ->schema([
                                Grid::make(3)->schema([
                                    TextInput::make('label')
                                        ->label('Nama Kebijakan')
                                        ->required()
                                        ->placeholder('cth: Kebijakan Privasi'),
                                    TextInput::make('url')
                                        ->label('URL')
                                        ->required()
                                        ->placeholder('/legal/privacy'),
                                    Toggle::make('is_active')
                                        ->label('Aktif')
                                        ->inline(false)
                                        ->default(true),
                                ]),
                            ])
                            ->itemLabel(fn (array $state): ?string => $state['label'] ?? null)
                            ->reorderable()
                            ->collapsible()
                            ->addActionLabel('+ Tambah Tautan Legal')
                            ->defaultItems(3),
                    ]),
            ]);
    }

    public function save(): void
    {
        $data = $this->form->getState();

        // Save consolidated footer settings
        Setting::set('footer_settings', $data);

        // Also sync contact/social fields to standard keys for global consistency
        if (! empty($data['whatsapp'])) {
            Setting::set('whatsapp', $data['whatsapp']);
        }
        if (! empty($data['phone'])) {
            Setting::set('phone', $data['phone']);
        }
        if (! empty($data['showroom_address'])) {
            Setting::set('address', $data['showroom_address']);
        }
        if (! empty($data['hours'])) {
            Setting::set('hours', $data['hours']);
        }
        if (! empty($data['instagram'])) {
            Setting::set('instagram', $data['instagram']);
        }
        if (! empty($data['facebook'])) {
            Setting::set('facebook', $data['facebook']);
        }
        if (! empty($data['x_url'])) {
            Setting::set('x_url', $data['x_url']);
            Setting::set('twitter', $data['x_url']);
        }
        if (! empty($data['tiktok'])) {
            Setting::set('tiktok', $data['tiktok']);
        }

        Cache::forget('sanubari_settings');

        Notification::make()
            ->title('Pengaturan Footer Berhasil Disimpan!')
            ->body('Seluruh isi, tautan navigasi, kontak, dan teks hak cipta pada footer website telah diperbarui.')
            ->success()
            ->send();
    }

    protected function getFormActions(): array
    {
        return [
            Action::make('save')
                ->label('Simpan Pengaturan Footer')
                ->submit('save'),
        ];
    }
}

