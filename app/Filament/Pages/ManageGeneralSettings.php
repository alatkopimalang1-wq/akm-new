<?php

namespace App\Filament\Pages;

use App\Models\Setting;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
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

class ManageGeneralSettings extends Page
{
    protected static string|BackedEnum|null $navigationIcon = Heroicon::Cog6Tooth;

    protected static string|\UnitEnum|null $navigationGroup = 'Pengaturan';

    protected static ?string $navigationLabel = 'Pengaturan Umum & Kontak';

    protected static ?string $title = 'Pengaturan Umum, Kontak & Operasional';

    protected static ?int $navigationSort = 11;

    /**
     * @var array<string, mixed> | null
     */
    public ?array $data = [];

    public function mount(): void
    {
        $settings = Setting::all()->pluck('value', 'key')->toArray();

        $this->form->fill([
            'site_name' => $settings['site_name'] ?? 'Sanubari Roastery Malang',
            'tagline' => $settings['tagline'] ?? 'Specialty Coffee Roaster Malang',
            'currency' => $settings['currency'] ?? 'IDR',
            'site_logo' => $settings['site_logo'] ?? null,
            'site_favicon' => $settings['site_favicon'] ?? null,

            'whatsapp' => $settings['whatsapp'] ?? '6285121930454',
            'whatsapp_gateway_provider' => $settings['whatsapp_gateway_provider'] ?? 'auto',
            'whatsapp_gateway_token' => $settings['whatsapp_gateway_token'] ?? null,
            'phone' => $settings['phone'] ?? '+6285121930454',
            'email' => $settings['email'] ?? 'halo@sanubariroastery.id',

            'address' => $settings['address'] ?? 'Ruko Tlogomas Square Kav. 34, Jl. Raya Tlogomas, Lowokwaru, Kota Malang, Jawa Timur 65144',
            'hours' => $settings['hours'] ?? 'Buka setiap hari: 09.00 - 23.00 WIB',
            'maps_url' => $settings['maps_url'] ?? 'https://maps.app.goo.gl/PMuxaEtsbEvC4APy7',

            'instagram' => $settings['instagram'] ?? 'https://instagram.com/sanubari.roastery.mlg',
            'facebook' => $settings['facebook'] ?? 'https://facebook.com/sanubariroastery',
            'x_url' => $settings['x_url'] ?? $settings['twitter'] ?? 'https://x.com/sanubariroastery',
            'tiktok' => $settings['tiktok'] ?? 'https://tiktok.com/@sanubariroastery',
            'tokopedia' => $settings['tokopedia'] ?? 'https://www.tokopedia.com/sanubariroastery',
            'shopee' => $settings['shopee'] ?? 'https://shopee.co.id/sanubariroastery',
            'free_shipping_min' => $settings['free_shipping_min'] ?? 250000,

            // --- Opsi Ambil di Toko (Self Pick Up) ---
            'pickup_in_store_enabled' => (bool) ($settings['pickup_in_store_enabled'] ?? true),
            'pickup_store_name' => $settings['pickup_store_name'] ?? 'Sanubari Roastery (Tlogomas, Malang)',
            'pickup_store_hours' => $settings['pickup_store_hours'] ?? ($settings['hours'] ?? 'Buka setiap hari: 09.00 - 23.00 WIB'),
            'pickup_store_address' => $settings['pickup_store_address'] ?? ($settings['address'] ?? 'Ruko Tlogomas Square Kav. 34, Jl. Raya Tlogomas, Lowokwaru, Kota Malang, Jawa Timur 65144'),
            'pickup_notes' => $settings['pickup_notes'] ?? 'Pesanan dapat diambil langsung di kasir Sanubari Roastery dengan menunjukkan Nomor Pesanan setelah status pesanan Siap.',

            'announcement_enabled' => (bool) ($settings['announcement_enabled'] ?? true),
            'announcement_text_id' => $settings['announcement_text_id'] ?? 'Gratis ongkir ke seluruh Jawa untuk pesanan biji kopi di atas Rp 250.000!',
            'announcement_text_en' => $settings['announcement_text_en'] ?? 'Free shipping across Java for coffee bean orders above IDR 250,000!',
            'announcement_link' => $settings['announcement_link'] ?? '/shop',

            // --- Metode Pembayaran (Payment Gateway) ---
            'payment_qris_enabled' => (bool) ($settings['payment_qris_enabled'] ?? true),
            'payment_qris_merchant_name' => $settings['payment_qris_merchant_name'] ?? 'SANUBARI ROASTERY MALANG',
            'payment_qris_nmid' => $settings['payment_qris_nmid'] ?? 'ID1020038829102',
            'payment_qris_image' => $settings['payment_qris_image'] ?? null,

            'payment_bank_enabled' => (bool) ($settings['payment_bank_enabled'] ?? true),
            'payment_banks' => $settings['payment_banks'] ?? [
                [
                    'bank_code' => 'bca',
                    'bank_name' => 'Bank BCA',
                    'account_number' => '011-829-9102',
                    'account_holder' => 'SANUBARI ROASTERY MALANG',
                    'branch_info' => 'KCU Malang Kawi',
                    'is_active' => true,
                ],
                [
                    'bank_code' => 'mandiri',
                    'bank_name' => 'Bank Mandiri',
                    'account_number' => '144-00-98213-901',
                    'account_holder' => 'SANUBARI ROASTERY MALANG',
                    'branch_info' => 'KCP Malang Sutoyo',
                    'is_active' => true,
                ],
                [
                    'bank_code' => 'bri',
                    'bank_name' => 'Bank BRI',
                    'account_number' => '0051-01-00291-532',
                    'account_holder' => 'SANUBARI ROASTERY MALANG',
                    'branch_info' => 'KC Malang Martadinata',
                    'is_active' => true,
                ],
            ],
            'payment_instructions' => $settings['payment_instructions'] ?? 'Silakan lakukan pembayaran sesuai nominal tepat. Pesanan akan otomatis diproses setelah pembayaran terverifikasi.',

            // --- Kurir & Pengiriman Otomatis ---
            'rajaongkir_api_key' => $settings['rajaongkir_api_key'] ?? '',
            'shipping_origin_city' => $settings['shipping_origin_city'] ?? 'Kota Malang',
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
                Section::make('Identitas Roastery & Branding')
                    ->description('Nama brand, slogan, dan mata uang dasar toko.')
                    ->icon(Heroicon::BuildingStorefront)
                    ->schema([
                        Grid::make(3)->schema([
                            TextInput::make('site_name')
                                ->label('Nama Roastery / Toko')
                                ->required(),
                            TextInput::make('tagline')
                                ->label('Tagline / Slogan')
                                ->required(),
                            TextInput::make('currency')
                                ->label('Mata Uang')
                                ->default('IDR')
                                ->required(),
                        ]),
                        Grid::make(2)->schema([
                            FileUpload::make('site_logo')
                                ->label('Logo Website (Navbar & Footer)')
                                ->disk('public')
                                ->directory('branding')
                                ->image()
                                ->imageEditor()
                                ->maxSize(2048)
                                ->helperText('Upload logo Sanubari (PNG transparan, WEBP, atau SVG maks 2MB).'),
                            FileUpload::make('site_favicon')
                                ->label('Favicon Tab Browser')
                                ->disk('public')
                                ->directory('branding')
                                ->image()
                                ->maxSize(1024)
                                ->helperText('Upload ikon browser tab (.ico atau .png maks 1MB).'),
                        ]),
                    ]),

                Section::make('Kontak & Layanan WhatsApp')
                    ->description('Nomor WhatsApp yang dituju ketika pengunjung melakukan checkout pesanan atau konsultasi.')
                    ->icon(Heroicon::ChatBubbleLeftRight)
                    ->schema([
                        Grid::make(3)->schema([
                            TextInput::make('whatsapp')
                                ->label('Nomor WhatsApp (Format: 628...)')
                                ->helperText('Tanpa tanda +, contoh: 6285121930454')
                                ->required(),
                            TextInput::make('phone')
                                ->label('Nomor Telepon Tampilan')
                                ->placeholder('+6285121930454'),
                            TextInput::make('email')
                                ->label('Email Resmi')
                                ->email()
                                ->required(),
                        ]),
                        Grid::make(2)->schema([
                            Select::make('whatsapp_gateway_provider')
                                ->label('Layanan Pengiriman WhatsApp OTP (Gateway)')
                                ->options([
                                    'auto' => 'Otomatis (Fonnte / Wablas)',
                                    'fonnte' => 'Fonnte (Rekomendasi Indonesia — api.fonnte.com)',
                                    'wablas' => 'Wablas (bdg.wablas.com)',
                                    'none' => 'Hanya Log Sistem (Uji Coba / Tanpa Kuota)',
                                ])
                                ->default('auto')
                                ->helperText('Pilih gateway API WhatsApp untuk mengirimkan kode OTP langsung ke HP pelanggan.'),

                            TextInput::make('whatsapp_gateway_token')
                                ->label('API Token / Secret Key WhatsApp Gateway')
                                ->password()
                                ->revealable()
                                ->placeholder('Contoh token Fonnte: dK7s... atau Wablas token')
                                ->helperText('Masukkan token API WhatsApp Gateway Anda. Dikosongkan jika masih tahap uji coba.'),
                        ]),
                    ]),

                Section::make('Lokasi Showroom & Jam Operasional')
                    ->description('Alamat fisik, tautan Google Maps, dan jadwal operasional slow bar.')
                    ->icon(Heroicon::MapPin)
                    ->schema([
                        Grid::make(2)->schema([
                            TextInput::make('hours')
                                ->label('Jam Operasional')
                                ->placeholder('Buka setiap hari: 09.00 - 23.00 WIB')
                                ->required(),
                            TextInput::make('maps_url')
                                ->label('Tautan Google Maps')
                                ->url()
                                ->required(),
                        ]),
                        Textarea::make('address')
                            ->label('Alamat Lengkap Roastery & Showroom')
                            ->rows(2)
                            ->required(),
                    ]),

                Section::make('Media Sosial & Kebijakan Ongkos Kirim')
                    ->description('Tautan akun sosial media dan batas minimum promo gratis ongkir.')
                    ->icon(Heroicon::GlobeAlt)
                    ->schema([
                        Grid::make(4)->schema([
                            TextInput::make('instagram')
                                ->label('URL Instagram')
                                ->placeholder('https://instagram.com/sanubari.roastery.mlg'),
                            TextInput::make('facebook')
                                ->label('URL Facebook')
                                ->placeholder('https://facebook.com/sanubariroastery'),
                            TextInput::make('x_url')
                                ->label('URL X (Twitter)')
                                ->placeholder('https://x.com/sanubariroastery'),
                            TextInput::make('tiktok')
                                ->label('URL TikTok')
                                ->placeholder('https://tiktok.com/@sanubariroastery'),
                        ]),
                        Grid::make(1)->schema([
                            TextInput::make('free_shipping_min')
                                ->label('Batas Minimum Belanja Gratis Ongkir (Rp)')
                                ->numeric()
                                ->prefix('Rp')
                                ->default(250000)
                                ->required(),
                        ]),
                        Grid::make(2)->schema([
                            TextInput::make('tokopedia')
                                ->label('Toko Resmi Tokopedia (Default)')
                                ->placeholder('https://www.tokopedia.com/sanubariroastery')
                                ->url(),
                            TextInput::make('shopee')
                                ->label('Toko Resmi Shopee (Default)')
                                ->placeholder('https://shopee.co.id/sanubariroastery')
                                ->url(),
                        ]),
                    ]),

                Section::make('Metode Pembayaran Toko (QRIS & Transfer Bank)')
                    ->description('Atur akun rekening bank resmi dan kode QRIS toko untuk checkout langsung di website.')
                    ->icon(Heroicon::CreditCard)
                    ->collapsible()
                    ->schema([
                        Section::make('Pembayaran QRIS Toko Resmi (Instan)')
                            ->schema([
                                Toggle::make('payment_qris_enabled')
                                    ->label('Aktifkan Metode Pembayaran QRIS')
                                    ->default(true),
                                Grid::make(2)->schema([
                                    TextInput::make('payment_qris_merchant_name')
                                        ->label('Nama Merchant QRIS')
                                        ->placeholder('SANUBARI ROASTERY MALANG')
                                        ->required(),
                                    TextInput::make('payment_qris_nmid')
                                        ->label('NMID QRIS Toko')
                                        ->placeholder('ID1020038829102'),
                                ]),
                                FileUpload::make('payment_qris_image')
                                    ->label('Gambar Barcode QRIS Kustom Toko (Opsional)')
                                    ->helperText('Jika dikosongkan, sistem akan otomatis menggunakan barcode QRIS default Sanubari Roastery.')
                                    ->image()
                                    ->directory('payment/qris')
                                    ->disk('public'),
                            ]),

                        Section::make('Rekening Transfer Bank Resmi')
                            ->description('Kelola daftar rekening bank tujuan transfer. Anda dapat menambah bank baru, mengubah nomor rekening, atau menghapus bank yang tidak digunakan.')
                            ->schema([
                                Toggle::make('payment_bank_enabled')
                                    ->label('Aktifkan Metode Pembayaran Transfer Bank')
                                    ->default(true),
                                Repeater::make('payment_banks')
                                    ->label('Daftar Rekening Bank Toko')
                                    ->addActionLabel('Tambah Rekening Bank Baru')
                                    ->reorderable()
                                    ->collapsible()
                                    ->itemLabel(fn (array $state): ?string => ($state['bank_name'] ?? 'Bank') . ' — ' . ($state['account_number'] ?? ''))
                                    ->schema([
                                        Grid::make(3)->schema([
                                            TextInput::make('bank_name')
                                                ->label('Nama Bank')
                                                ->placeholder('Contoh: Bank BCA / Mandiri / BSI')
                                                ->required(),
                                            TextInput::make('bank_code')
                                                ->label('Kode Bank (Singkat)')
                                                ->placeholder('Contoh: bca / mandiri / bsi')
                                                ->required(),
                                            Toggle::make('is_active')
                                                ->label('Aktifkan Bank Ini')
                                                ->default(true),
                                        ]),
                                        Grid::make(2)->schema([
                                            TextInput::make('account_number')
                                                ->label('Nomor Rekening')
                                                ->placeholder('Contoh: 011-829-9102')
                                                ->required(),
                                            TextInput::make('account_holder')
                                                ->label('Atas Nama Pemilik Rekening')
                                                ->placeholder('Contoh: SANUBARI ROASTERY MALANG')
                                                ->required(),
                                        ]),
                                        Grid::make(2)->schema([
                                            TextInput::make('branch_info')
                                                ->label('Kantor Cabang (Opsional)')
                                                ->placeholder('Contoh: KCU Malang Kawi'),
                                            FileUpload::make('bank_logo')
                                                ->label('Logo Bank (Opsional)')
                                                ->image()
                                                ->directory('payment/banks')
                                                ->disk('public'),
                                        ]),
                                    ])
                                    ->columns(1),
                                Textarea::make('payment_instructions')
                                    ->label('Instruksi Pembayaran Singkat')
                                    ->rows(2)
                                    ->placeholder('Silakan lakukan pembayaran sesuai nominal tepat...'),
                            ]),
                    ]),

                Section::make('Integrasi Kurir & Ongkos Kirim Otomatis (RajaOngkir)')
                    ->description('Pengaturan API kurir (JNE, J&T, SiCepat, AnterAja, POS Indonesia) dari origin Kota Malang.')
                    ->icon(Heroicon::Truck)
                    ->collapsible()
                    ->schema([
                        Grid::make(2)->schema([
                            TextInput::make('shipping_origin_city')
                                ->label('Kota Asal Roastery (Origin)')
                                ->default('Kota Malang')
                                ->disabled(),
                            TextInput::make('rajaongkir_api_key')
                                ->label('RajaOngkir API Key (Opsional)')
                                ->placeholder('Contoh: 8a4b2c9... (Starter / Pro Key)')
                                ->helperText('Jika dikosongkan, sistem secara otomatis menghitung tarif kurir resmi Malang Raya ke seluruh wilayah Indonesia melalui database tarif terintegrasi.'),
                        ]),
                    ]),

                Section::make('Opsi Pengambilan di Toko (Self Pick Up)')
                    ->description('Izinkan pelanggan mengambil pesanan langsung di roastery / kedai tanpa biaya kirim (Rp 0).')
                    ->icon(Heroicon::BuildingStorefront)
                    ->collapsible()
                    ->schema([
                        Toggle::make('pickup_in_store_enabled')
                            ->label('Aktifkan Opsi Ambil di Toko pada Checkout')
                            ->default(true),
                        Grid::make(2)->schema([
                            TextInput::make('pickup_store_name')
                                ->label('Nama Gerai / Toko Pengambilan')
                                ->placeholder('Sanubari Roastery (Tlogomas, Malang)')
                                ->required(),
                            TextInput::make('pickup_store_hours')
                                ->label('Jam Layanan Pengambilan')
                                ->placeholder('Setiap Hari: 09.00 - 23.00 WIB')
                                ->required(),
                        ]),
                        Textarea::make('pickup_store_address')
                            ->label('Alamat Lengkap Pengambilan di Gerai')
                            ->placeholder('Ruko Tlogomas Square Kav. 34, Jl. Raya Tlogomas, Lowokwaru, Kota Malang, Jawa Timur 65144')
                            ->rows(2)
                            ->required(),
                        Textarea::make('pickup_notes')
                            ->label('Petunjuk Pengambilan untuk Pelanggan')
                            ->placeholder('Pesanan dapat diambil di kasir Sanubari Roastery dengan menunjukkan Nomor Pesanan setelah status pesanan Siap.')
                            ->rows(2),
                    ]),

                Section::make('Banner Pengumuman / Announcement Ticker')
                    ->description('Teks ticker berjalan di bagian paling atas halaman situs.')
                    ->icon(Heroicon::Megaphone)
                    ->collapsible()
                    ->schema([
                        Toggle::make('announcement_enabled')
                            ->label('Aktifkan Banner Pengumuman Ticker')
                            ->default(true),
                        Grid::make(2)->schema([
                            TextInput::make('announcement_text_id')
                                ->label('Teks Pengumuman (Bahasa Indonesia)')
                                ->placeholder('Gratis ongkir ke seluruh Jawa...'),
                            TextInput::make('announcement_text_en')
                                ->label('Teks Pengumuman (English)')
                                ->placeholder('Free shipping across Java...'),
                        ]),
                        TextInput::make('announcement_link')
                            ->label('Tautan Tujuan Pengumuman (Opsional)')
                            ->placeholder('/shop'),
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
            ->title('Pengaturan Umum Berhasil Disimpan!')
            ->body('Informasi kontak, jam operasional, dan pengaturan situs telah diperbarui.')
            ->success()
            ->send();
    }

    protected function getFormActions(): array
    {
        return [
            Action::make('save')
                ->label('Simpan Pengaturan Umum')
                ->submit('save'),
        ];
    }
}
