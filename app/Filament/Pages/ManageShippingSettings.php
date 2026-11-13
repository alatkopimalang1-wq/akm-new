<?php

namespace App\Filament\Pages;

use App\Models\Setting;
use App\Services\ShippingService;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Forms\Components\CheckboxList;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\ViewField;
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

class ManageShippingSettings extends Page
{
    protected static string|BackedEnum|null $navigationIcon = Heroicon::Truck;

    protected static string|\UnitEnum|null $navigationGroup = 'Pengaturan';

    protected static ?string $navigationLabel = 'Shipping Gateway (RajaOngkir)';

    protected static ?string $title = 'Pengaturan Shipping Gateway (RajaOngkir)';

    protected static ?int $navigationSort = 12;

    /**
     * @var array<string, mixed> | null
     */
    public ?array $data = [];

    public function mount(): void
    {
        $config = ShippingService::getConfig();

        $this->form->fill([
            'shipping_delivery_enabled' => Setting::get('shipping_delivery_enabled', true),
            'pickup_in_store_enabled' => Setting::get('pickup_in_store_enabled', true),
            'pickup_store_name' => Setting::get('pickup_store_name', 'Sanubari Roastery (Tlogomas, Malang)'),
            'pickup_store_address' => Setting::get('pickup_store_address', 'Ruko Tlogomas Square Kav. 34, Jl. Raya Tlogomas, Lowokwaru, Kota Malang, Jawa Timur 65144'),
            'pickup_store_hours' => Setting::get('pickup_store_hours', 'Buka setiap hari: 09.00 - 23.00 WIB'),
            'pickup_notes' => Setting::get('pickup_notes', 'Pesanan dapat diambil langsung di kasir Sanubari Roastery dengan menunjukkan Nomor Pesanan setelah status pesanan Siap.'),
            'maps_url' => Setting::get('maps_url', 'https://maps.app.goo.gl/PMuxaEtsbEvC4APy7'),

            'rajaongkir_enabled' => $config['enabled'],
            'rajaongkir_account_type' => $config['account_type'],
            'rajaongkir_api_key' => $config['api_key'],
            'rajaongkir_fallback_enabled' => $config['fallback_enabled'],

            'shipping_origin_province_id' => $config['origin_province_id'],
            'shipping_origin_city_id' => $config['origin_city_id'],
            'shipping_origin_subdistrict_id' => $config['origin_subdistrict_id'],
            'shipping_origin_city' => $config['origin_city_name'],
            'shipping_origin_province' => $config['origin_province_name'],
            'shipping_origin_postal_code' => $config['origin_postal_code'],
            'shipping_origin_latitude' => $config['origin_latitude'],
            'shipping_origin_longitude' => $config['origin_longitude'],
            'gosend_min_cost' => $config['gosend_min_cost'],
            'gosend_rate_per_km' => $config['gosend_rate_per_km'],
            'gosend_max_distance_km' => $config['gosend_max_distance_km'],

            'rajaongkir_couriers' => $config['couriers'],

            'free_shipping_enabled' => $config['free_shipping_enabled'],
            'free_shipping_min' => $config['free_shipping_min'],
            'free_shipping_zone' => $config['free_shipping_zone'],
            'free_shipping_max_subsidy' => $config['free_shipping_max_subsidy'],
            'shipping_handling_fee' => $config['handling_fee'],
            'shipping_default_weight_grams' => $config['default_weight_grams'],

            'rajaongkir_auto_booking' => Setting::get('rajaongkir_auto_booking', true),
            'rajaongkir_auto_pickup' => Setting::get('rajaongkir_auto_pickup', false),
            'shipping_sender_name' => Setting::get('shipping_sender_name', 'SANUBARI ROASTERY TLOGOMAS'),
            'shipping_sender_phone' => Setting::get('shipping_sender_phone', '0851-2193-0454'),
            'shipping_sender_address' => Setting::get('shipping_sender_address', 'Ruko Tlogomas Square Kav. 34, Jl. Raya Tlogomas, Lowokwaru, Kota Malang 65144'),
            'shipping_default_pickup_vehicle' => Setting::get('shipping_default_pickup_vehicle', 'Motor'),
            'shipping_default_pickup_time' => Setting::get('shipping_default_pickup_time', '13:00 - 16:00'),
            'shipping_pickup_notes' => Setting::get('shipping_pickup_notes', 'Paket biji kopi spesialti (Fragile). Ambil di bar kasir Sanubari.'),

            'komerce_shipping_delivery_key' => Setting::get('komerce_shipping_delivery_key', ''),
            'komerce_shipping_delivery_env' => Setting::get('komerce_shipping_delivery_env', 'production'),
        ]);
    }

    protected function getHeaderActions(): array
    {
        return [
            Action::make('testConnection')
                ->label('Tes Koneksi API RajaOngkir')
                ->icon(Heroicon::Signal)
                ->color('info')
                ->action(function () {
                    $state = $this->form->getState();
                    $apiKey = $state['rajaongkir_api_key'] ?? '';
                    $accountType = $state['rajaongkir_account_type'] ?? 'pro';
                    $originCityId = (int) ($state['shipping_origin_city_id'] ?? 391);
                    $originSubdistrictId = (int) ($state['shipping_origin_subdistrict_id'] ?? 3895);

                    $result = ShippingService::testConnection($apiKey, $accountType, $originCityId, $originSubdistrictId);

                    if ($result['success']) {
                        Notification::make()
                            ->title('Koneksi RajaOngkir Berhasil!')
                            ->body($result['message'])
                            ->success()
                            ->duration(8000)
                            ->send();
                    } else {
                        Notification::make()
                            ->title('Koneksi RajaOngkir Gagal')
                            ->body($result['message'])
                            ->danger()
                            ->duration(10000)
                            ->send();
                    }
                }),
            Action::make('testShippingDelivery')
                ->label('Tes API Shipping Delivery')
                ->icon(Heroicon::RocketLaunch)
                ->color('success')
                ->action(function () {
                    $state = $this->form->getState();
                    $apiKey = $state['komerce_shipping_delivery_key'] ?? '';
                    $env = $state['komerce_shipping_delivery_env'] ?? 'production';

                    $result = ShippingService::testShippingDeliveryConnection($apiKey, $env);

                    if ($result['success']) {
                        if (! empty($result['detected_env'])) {
                            $this->data['komerce_shipping_delivery_env'] = $result['detected_env'];
                            Setting::set('komerce_shipping_delivery_env', $result['detected_env']);
                        }

                        Notification::make()
                            ->title('Koneksi Shipping Delivery Berhasil!')
                            ->body($result['message'])
                            ->success()
                            ->duration(8000)
                            ->send();
                    } else {
                        Notification::make()
                            ->title('Koneksi Shipping Delivery Gagal')
                            ->body($result['message'])
                            ->danger()
                            ->duration(10000)
                            ->send();
                    }
                }),
            Action::make('clearShippingCache')
                ->label('Segarkan Cache Tarif')
                ->icon(Heroicon::ArrowPath)
                ->color('gray')
                ->action(function () {
                    Cache::flush();

                    Notification::make()
                        ->title('Cache Tarif & Wilayah Dibersihkan')
                        ->body('Data provinsi, kota, kecamatan, dan tarif ongkos kirim telah disegarkan.')
                        ->success()
                        ->send();
                }),
        ];
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
        $provinceOptions = collect(ShippingService::getBuiltInProvinces())
            ->pluck('name', 'id')
            ->toArray();

        $cityOptions = collect(ShippingService::getBuiltInCities())
            ->mapWithKeys(fn ($c) => [$c['id'] => "{$c['type']} {$c['name']} ({$c['postal_code']})"])
            ->toArray();

        return $schema
            ->components([
                Section::make('Metode Pengiriman Website (Delivery & Pick Up Toko)')
                    ->description('Atur ketersediaan opsi pengiriman kurir (Delivery) dan opsi ambil di toko (Pick Up) untuk pelanggan di website.')
                    ->icon(Heroicon::ShoppingBag)
                    ->schema([
                        Grid::make(2)->schema([
                            Toggle::make('shipping_delivery_enabled')
                                ->label('Aktifkan Pengiriman Kurir / Delivery')
                                ->helperText('Izinkan pelanggan memesan dengan pengiriman kurir ekspedisi RajaOngkir dan kurir instan GoSend.')
                                ->default(true),
                            Toggle::make('pickup_in_store_enabled')
                                ->label('Aktifkan Ambil di Toko (Self Pick Up)')
                                ->helperText('Izinkan pelanggan mengambil pesanan sendiri di gerai Sanubari Roastery tanpa ongkos kirim.')
                                ->default(true),
                        ]),
                        Grid::make(2)->schema([
                            TextInput::make('pickup_store_name')
                                ->label('Nama Gerai / Toko Pick Up')
                                ->default('Sanubari Roastery (Tlogomas, Malang)')
                                ->required(),
                            TextInput::make('maps_url')
                                ->label('Tautan Google Maps Toko')
                                ->default('https://maps.app.goo.gl/PMuxaEtsbEvC4APy7'),
                        ]),
                        TextInput::make('pickup_store_address')
                            ->label('Alamat Lengkap Toko untuk Pick Up')
                            ->default('Ruko Tlogomas Square Kav. 34, Jl. Raya Tlogomas, Lowokwaru, Kota Malang, Jawa Timur 65144')
                            ->required(),
                        Grid::make(2)->schema([
                            TextInput::make('pickup_store_hours')
                                ->label('Jam Operasional Pengambilan')
                                ->default('Buka setiap hari: 09.00 - 23.00 WIB')
                                ->required(),
                            TextInput::make('pickup_notes')
                                ->label('Petunjuk Pengambilan Pelanggan')
                                ->default('Pesanan dapat diambil langsung di kasir Sanubari Roastery dengan menunjukkan Nomor Pesanan setelah status pesanan Siap.'),
                        ]),
                    ]),

                Section::make('Kredensial & Paket API RajaOngkir')
                    ->description('Hubungkan toko dengan API resmi RajaOngkir untuk perhitungan ongkos kirim otomatis secara real-time.')
                    ->icon(Heroicon::Key)
                    ->schema([
                        Grid::make(2)->schema([
                            Toggle::make('rajaongkir_enabled')
                                ->label('Aktifkan Shipping Gateway RajaOngkir')
                                ->helperText('Jika aktif, sistem akan menghubungi API RajaOngkir untuk mengambil daftar wilayah & ongkos kirim.')
                                ->default(true),
                            Toggle::make('rajaongkir_fallback_enabled')
                                ->label('Aktifkan Smart Fallback Tarif Otomatis')
                                ->helperText('Jika API Key kosong atau server RajaOngkir sedang gangguan, gunakan matriks tarif resmi Malang Raya agar checkout tetap berjalan lancar.')
                                ->default(true),
                        ]),
                        Grid::make(2)->schema([
                            Select::make('rajaongkir_account_type')
                                ->label('Tipe Akun / Endpoint RajaOngkir')
                                ->options([
                                    'pro' => 'RajaOngkir Enterprise / Pro (Semua Kurir Lengkap — Akurasi Level Kecamatan)',
                                    'komerce_v2' => 'RajaOngkir V2 Komerce API (Endpoint rajaongkir.komerce.id)',
                                    'basic' => 'RajaOngkir Basic (JNE, POS, TIKI, J&T, SiCepat, Wahana — Level Kota/Kabupaten)',
                                    'starter' => 'RajaOngkir Starter (Gratis — JNE, POS, TIKI — Level Kota/Kabupaten)',
                                ])
                                ->default('pro')
                                ->required()
                                ->live(),
                            TextInput::make('rajaongkir_api_key')
                                ->label('RajaOngkir API Key (Hitung Ongkir & Lacak Resi)')
                                ->password()
                                ->revealable()
                                ->placeholder('Masukkan API Key RajaOngkir Enterprise Pro Anda...')
                                ->helperText('Terhubung ke API RajaOngkir Enterprise Pro (rajaongkir.komerce.id). Klik tombol "Tes Koneksi API RajaOngkir" di kanan atas untuk verifikasi.'),
                        ]),
                        Grid::make(2)->schema([
                            TextInput::make('komerce_shipping_delivery_key')
                                ->label('API Key Shipping Delivery (Komerce / RajaOngkir Collaborator)')
                                ->password()
                                ->revealable()
                                ->placeholder('Klik "Show Key" pada baris Shipping Delivery di dashboard Anda...')
                                ->helperText('Kunci khusus dari menu "Shipping Delivery" (klik tombol Show Key di dashboard) untuk otomatisasi booking AWB, request pick up kurir, dan cetak label thermal.'),
                            Select::make('komerce_shipping_delivery_env')
                                ->label('Environment API Shipping Delivery')
                                ->options([
                                    'production' => 'Production Live (api.collaborator.komerce.id)',
                                    'sandbox' => 'Sandbox Testing (api-sandbox.collaborator.komerce.id)',
                                ])
                                ->default('production')
                                ->required(),
                        ]),
                    ]),

                Section::make('Lokasi Pengiriman Asal (Origin Roastery)')
                    ->description('Tentukan kota dan kecamatan asal pengiriman paket biji kopi Sanubari Roastery.')
                    ->icon(Heroicon::MapPin)
                    ->schema([
                        Grid::make(3)->schema([
                            Select::make('shipping_origin_province_id')
                                ->label('Provinsi Asal (Origin)')
                                ->options($provinceOptions)
                                ->default(18)
                                ->searchable()
                                ->required(),
                            Select::make('shipping_origin_city_id')
                                ->label('Kota / Kabupaten Asal (Origin)')
                                ->options($cityOptions)
                                ->default(391)
                                ->searchable()
                                ->required(),
                            TextInput::make('shipping_origin_subdistrict_id')
                                ->label('ID Kecamatan Asal (RajaOngkir Enterprise Pro)')
                                ->numeric()
                                ->default(3896)
                                ->helperText('Default Enterprise Pro: 3896 (Kecamatan Lowokwaru, Tlogomas, Kota Malang).'),
                        ]),
                        Grid::make(3)->schema([
                            TextInput::make('shipping_origin_city')
                                ->label('Label Kota Asal (Tampilan Checkout)')
                                ->default('Kota Malang')
                                ->required(),
                            TextInput::make('shipping_origin_province')
                                ->label('Label Provinsi Asal')
                                ->default('Jawa Timur')
                                ->required(),
                            TextInput::make('shipping_origin_postal_code')
                                ->label('Kode Pos Asal')
                                ->default('65144')
                                ->required(),
                        ]),
                        ViewField::make('origin_map_picker')
                            ->view('filament.forms.components.map-picker')
                            ->columnSpanFull(),
                        Grid::make(5)->schema([
                            TextInput::make('shipping_origin_latitude')
                                ->label('Latitude Titik Roastery (Pinpoint GoSend)')
                                ->numeric()
                                ->default(-7.9327)
                                ->helperText('Default Tlogomas, Malang: -7.9327'),
                            TextInput::make('shipping_origin_longitude')
                                ->label('Longitude Titik Roastery (Pinpoint GoSend)')
                                ->numeric()
                                ->default(112.6037)
                                ->helperText('Default Tlogomas, Malang: 112.6037'),
                            TextInput::make('gosend_min_cost')
                                ->label('Tarif Minimum GoSend Instant (0-4 km)')
                                ->numeric()
                                ->prefix('Rp')
                                ->default(12000),
                            TextInput::make('gosend_rate_per_km')
                                ->label('Tarif GoSend per KM (>4 km)')
                                ->numeric()
                                ->prefix('Rp')
                                ->default(2500),
                            TextInput::make('gosend_max_distance_km')
                                ->label('Radius Maks. GoSend Instant')
                                ->numeric()
                                ->suffix('km')
                                ->default(25),
                        ]),
                    ]),

                Section::make('Ekspedisi / Kurir yang Diaktifkan')
                    ->description('Pilih ekspedisi pengiriman yang ingin ditampilkan kepada pelanggan pada halaman Checkout.')
                    ->icon(Heroicon::Truck)
                    ->schema([
                        CheckboxList::make('rajaongkir_couriers')
                            ->label('Daftar Ekspedisi Aktif')
                            ->options(ShippingService::getAvailableCouriers())
                            ->columns(3)
                            ->gridDirection('row')
                            ->bulkToggleable()
                            ->required()
                            ->helperText('Catatan: Akun RajaOngkir Starter hanya mendukung JNE, POS, dan TIKI dari API live. Akun Basic, Pro, dan Komerce V2 mendukung seluruh kurir di atas.'),
                    ]),

                Section::make('Kebijakan Promo Gratis Ongkir & Biaya Packing')
                    ->description('Atur syarat minimal belanja untuk promo gratis ongkir, batas subsidi, dan biaya tambahan pengemasan.')
                    ->icon(Heroicon::Gift)
                    ->schema([
                        Toggle::make('free_shipping_enabled')
                            ->label('Aktifkan Promo Gratis / Subsidi Ongkir pada Layanan Reguler')
                            ->default(true),
                        Grid::make(3)->schema([
                            Select::make('free_shipping_zone')
                                ->label('Wilayah Promo Gratis Ongkir')
                                ->options([
                                    'java_only' => 'Khusus Pulau Jawa (Jatim, Jateng, DIY, Jabar, DKI, Banten)',
                                    'malang_only' => 'Khusus Malang Raya (Kota Malang, Kab. Malang, Kota Batu)',
                                    'all_indonesia' => 'Seluruh Wilayah Indonesia',
                                    'disabled' => 'Nonaktifkan Gratis Ongkir',
                                ])
                                ->default('java_only')
                                ->required(),
                            TextInput::make('free_shipping_min')
                                ->label('Minimal Belanja Gratis Ongkir (Rp)')
                                ->numeric()
                                ->prefix('Rp')
                                ->default(250000)
                                ->required(),
                            TextInput::make('free_shipping_max_subsidy')
                                ->label('Batas Maksimal Subsidi Ongkir (Rp)')
                                ->numeric()
                                ->prefix('Rp')
                                ->default(0)
                                ->helperText('Isi 0 untuk Gratis Ongkir penuh (Rp 0), atau isi nominal maksimal potongan (misal: 25000).'),
                        ]),
                        Grid::make(2)->schema([
                            TextInput::make('shipping_handling_fee')
                                ->label('Biaya Tambahan Packing / Handling Fee (Rp)')
                                ->numeric()
                                ->prefix('Rp')
                                ->default(0)
                                ->helperText('Ditambahkan otomatis ke tarif dasar kurir (isi 0 jika tidak ada biaya tambahan).'),
                            TextInput::make('shipping_default_weight_grams')
                                ->label('Berat Default Produk (Gram)')
                                ->numeric()
                                ->suffix('gram')
                                ->default(200)
                                ->required(),
                        ]),
                    ]),

                Section::make('Otomatisasi Resi & Request Pick Up Kurir (RajaOngkir Pro Delivery)')
                    ->description('Konfigurasi pembuatan resi otomatis (Air Waybill), penjemputan paket kurir (Pick Up), serta data pengirim toko pada label termal.')
                    ->icon(Heroicon::PaperAirplane)
                    ->schema([
                        Grid::make(2)->schema([
                            Toggle::make('rajaongkir_auto_booking')
                                ->label('Otomatis Buat Nomor Resi (AWB) saat Pembayaran Lunas')
                                ->helperText('Jika aktif, saat status pembayaran pesanan diverifikasi Lunas, sistem otomatis menerbitkan AWB booking kurir.')
                                ->default(true),
                            Toggle::make('rajaongkir_auto_pickup')
                                ->label('Otomatis Request Pick Up Kurir saat Siap')
                                ->helperText('Jika aktif, order yang masuk status Siap Diambil/Dikirim otomatis dijadwalkan pickup kurir.')
                                ->default(false),
                        ]),
                        Grid::make(3)->schema([
                            TextInput::make('shipping_sender_name')
                                ->label('Nama Toko Pengirim (Di Label Resi)')
                                ->default('SANUBARI ROASTERY MALANG')
                                ->required(),
                            TextInput::make('shipping_sender_phone')
                                ->label('No. WhatsApp / HP Pengirim')
                                ->default('0851-2193-0454')
                                ->required(),
                            Select::make('shipping_default_pickup_vehicle')
                                ->label('Tipe Kendaraan Pick Up Kurir')
                                ->options([
                                    'Motor' => 'Motor (Paket < 20 kg)',
                                    'Mobil' => 'Mobil / Blind Van (Paket Sedang)',
                                    'Truk' => 'Truk Box (Grosir / B2B)',
                                ])
                                ->default('Motor')
                                ->required(),
                        ]),
                        Grid::make(2)->schema([
                            TextInput::make('shipping_sender_address')
                                ->label('Alamat Lengkap Pengirim (Di Label Resi & Penjemputan)')
                                ->default('Ruko Tlogomas Square Kav. 34, Jl. Raya Tlogomas, Lowokwaru, Kota Malang 65144')
                                ->required(),
                            Select::make('shipping_default_pickup_time')
                                ->label('Waktu Penjemputan Kurir Default')
                                ->options([
                                    '09:00 - 12:00' => 'Pagi (09:00 - 12:00 WIB)',
                                    '13:00 - 16:00' => 'Siang (13:00 - 16:00 WIB)',
                                    '16:00 - 19:00' => 'Sore (16:00 - 19:00 WIB)',
                                ])
                                ->default('13:00 - 16:00')
                                ->required(),
                        ]),
                        TextInput::make('shipping_pickup_notes')
                            ->label('Catatan Instruksi untuk Driver Penjemput')
                            ->default('Paket biji kopi spesialti (Fragile). Ambil di bar kasir Sanubari.')
                            ->helperText('Catatan ini dicantumkan saat request pickup dikirim ke kurir ekspedisi.'),
                    ]),
            ]);
    }

    public function save(): void
    {
        $data = $this->form->getState();

        foreach ($data as $key => $value) {
            Setting::set($key, $value);
        }

        Cache::flush();

        Notification::make()
            ->title('Pengaturan Shipping Gateway RajaOngkir Disimpan!')
            ->body('Konfigurasi API RajaOngkir, daftar kurir aktif, dan aturan ongkos kirim berhasil diperbarui.')
            ->success()
            ->send();
    }

    protected function getFormActions(): array
    {
        return [
            Action::make('save')
                ->label('Simpan Pengaturan Shipping Gateway')
                ->submit('save'),
        ];
    }
}

