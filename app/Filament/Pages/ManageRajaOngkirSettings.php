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

class ManageRajaOngkirSettings extends Page
{
    protected static string|BackedEnum|null $navigationIcon = Heroicon::Truck;

    protected static string|\UnitEnum|null $navigationGroup = 'Pengaturan';

    protected static ?string $navigationLabel = 'Pengaturan RajaOngkir';

    protected static ?string $title = 'Pengaturan RajaOngkir & Integrasi Ekspedisi';

    protected static ?int $navigationSort = 3;

    /**
     * @var array<string, mixed> | null
     */
    public ?array $data = [];

    public function mount(): void
    {
        $settings = Setting::all()->pluck('value', 'key')->toArray();

        $activeCouriers = $settings['rajaongkir_couriers'] ?? ['gosend', 'jne', 'jnt', 'sicepat', 'anteraja', 'pos', 'tiki'];
        if (is_string($activeCouriers)) {
            $decoded = json_decode($activeCouriers, true);
            $activeCouriers = is_array($decoded) ? $decoded : array_filter(array_map('trim', explode(',', $activeCouriers)));
        }
        if (! is_array($activeCouriers) || empty($activeCouriers)) {
            $activeCouriers = ['gosend', 'jne', 'jnt', 'sicepat', 'anteraja', 'pos', 'tiki'];
        }

        $this->form->fill([
            // 1. Integrasi API RajaOngkir
            'rajaongkir_enabled' => isset($settings['rajaongkir_enabled']) ? (bool) $settings['rajaongkir_enabled'] : true,
            'rajaongkir_account_type' => $settings['rajaongkir_account_type'] ?? 'pro',
            'rajaongkir_api_key' => $settings['rajaongkir_api_key'] ?? ShippingService::DEFAULT_PRO_API_KEY,
            'rajaongkir_fallback_enabled' => isset($settings['rajaongkir_fallback_enabled']) ? (bool) $settings['rajaongkir_fallback_enabled'] : true,

            // 2. Titik Asal Pengiriman (Origin Roastery Malang)
            'shipping_origin_province' => $settings['shipping_origin_province'] ?? 'Jawa Timur',
            'shipping_origin_province_id' => $settings['shipping_origin_province_id'] ?? 18,
            'shipping_origin_city' => $settings['shipping_origin_city'] ?? 'Kota Malang',
            'shipping_origin_city_id' => $settings['shipping_origin_city_id'] ?? 391,
            'shipping_origin_subdistrict' => $settings['shipping_origin_subdistrict'] ?? 'Lowokwaru',
            'shipping_origin_subdistrict_id' => $settings['shipping_origin_subdistrict_id'] ?? 3896,
            'shipping_origin_postal_code' => $settings['shipping_origin_postal_code'] ?? '65144',
            'shipping_origin_latitude' => $settings['shipping_origin_latitude'] ?? -7.9327,
            'shipping_origin_longitude' => $settings['shipping_origin_longitude'] ?? 112.6037,

            // 3. Ekspedisi Kurir Aktif
            'rajaongkir_couriers' => $activeCouriers,

            // 4. Kurir Instan Lokal Malang (GoSend)
            'gosend_enabled' => isset($settings['gosend_enabled']) ? (bool) $settings['gosend_enabled'] : true,
            'gosend_rate_per_km' => (int) ($settings['gosend_rate_per_km'] ?? ShippingService::DEFAULT_GOSEND_RATE_PER_KM),
            'gosend_min_cost' => (int) ($settings['gosend_min_cost'] ?? ShippingService::DEFAULT_GOSEND_MIN_COST),
            'gosend_max_distance_km' => (int) ($settings['gosend_max_distance_km'] ?? ShippingService::DEFAULT_GOSEND_MAX_DISTANCE_KM),

            // 5. Promo Subsidi & Bebas Ongkir
            'free_shipping_enabled' => isset($settings['free_shipping_enabled']) ? (bool) $settings['free_shipping_enabled'] : true,
            'free_shipping_min' => (int) ($settings['free_shipping_min'] ?? 250000),
            'free_shipping_zone' => $settings['free_shipping_zone'] ?? 'java_only',
            'free_shipping_max_subsidy' => (int) ($settings['free_shipping_max_subsidy'] ?? 0),

            // 6. Berat Default & Biaya Penanganan
            'shipping_default_weight_grams' => (int) ($settings['shipping_default_weight_grams'] ?? 200),
            'shipping_handling_fee' => (int) ($settings['shipping_handling_fee'] ?? 0),
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
                Section::make('Kredensial & Status API RajaOngkir')
                    ->description('Kelola aktivasi API RajaOngkir / Komerce Gateway untuk pengecekan tarif ongkir otomatis real-time ke seluruh Indonesia.')
                    ->icon(Heroicon::Truck)
                    ->schema([
                        Toggle::make('rajaongkir_enabled')
                            ->label('Aktifkan Kalkulasi Ongkos Kirim Otomatis (RajaOngkir)')
                            ->helperText('Jika dinonaktifkan, checkout hanya akan menggunakan opsi pengambilan di toko / kurir manual.')
                            ->default(true),

                        Grid::make(2)->schema([
                            Select::make('rajaongkir_account_type')
                                ->label('Tipe / Tingkat Akun RajaOngkir')
                                ->options([
                                    'pro' => 'RajaOngkir Pro / Enterprise (Komerce V2 — Tingkat Kecamatan / Sub-District Akurat)',
                                    'starter' => 'RajaOngkir Starter (Tingkat Kota/Kabupaten, JNE/POS/TIKI)',
                                    'basic' => 'RajaOngkir Basic (Tingkat Kota/Kabupaten)',
                                ])
                                ->default('pro')
                                ->required()
                                ->native(false),

                            TextInput::make('rajaongkir_api_key')
                                ->label('RajaOngkir API Key')
                                ->password()
                                ->revealable()
                                ->placeholder('Masukkan API Key RajaOngkir atau Komerce')
                                ->helperText('Kunci API resmi dari akun RajaOngkir / Komerce. Default sistem telah disetel ke Pro Enterprise Key.')
                                ->required(),
                        ]),

                        Toggle::make('rajaongkir_fallback_enabled')
                            ->label('Aktifkan Fallback Database Internal Otomatis')
                            ->helperText('Jika server RajaOngkir mengalami timeout atau batas kuota tercapai, sistem secara otomatis menghitung tarif ongkir Malang Raya menggunakan database terintegrasi agar pembeli tetap dapat checkout tanpa kendala.')
                            ->default(true),
                    ]),

                Section::make('Titik Asal Pengiriman (Roastery Origin Malang)')
                    ->description('Konfigurasi alamat asal gudang pengiriman pesanan Alat Kopi Malang.')
                    ->icon(Heroicon::MapPin)
                    ->schema([
                        Grid::make(3)->schema([
                            TextInput::make('shipping_origin_province')
                                ->label('Provinsi Asal')
                                ->default('Jawa Timur')
                                ->required(),
                            TextInput::make('shipping_origin_city')
                                ->label('Kota / Kabupaten Asal')
                                ->default('Kota Malang')
                                ->required(),
                            TextInput::make('shipping_origin_subdistrict')
                                ->label('Kecamatan Asal (Roastery)')
                                ->default('Lowokwaru')
                                ->required(),
                        ]),
                        Grid::make(4)->schema([
                            TextInput::make('shipping_origin_province_id')
                                ->label('ID Provinsi (RajaOngkir)')
                                ->numeric()
                                ->default(18)
                                ->helperText('Komerce/Pro: 18 (Jawa Timur)'),
                            TextInput::make('shipping_origin_city_id')
                                ->label('ID Kota (RajaOngkir)')
                                ->numeric()
                                ->default(391)
                                ->helperText('Komerce/Pro: 391 (Kota Malang)'),
                            TextInput::make('shipping_origin_subdistrict_id')
                                ->label('ID Kecamatan (RajaOngkir)')
                                ->numeric()
                                ->default(3896)
                                ->helperText('Komerce/Pro: 3896 (Lowokwaru)'),
                            TextInput::make('shipping_origin_postal_code')
                                ->label('Kode Pos Asal')
                                ->default('65144')
                                ->required(),
                        ]),
                        Grid::make(2)->schema([
                            TextInput::make('shipping_origin_latitude')
                                ->label('Koordinat Latitude Roastery')
                                ->numeric()
                                ->default(-7.933333)
                                ->helperText('Koordinat GPS lokasi roastery untuk kalkulasi radius jarak kurir instan (GoSend).'),
                            TextInput::make('shipping_origin_longitude')
                                ->label('Koordinat Longitude Roastery')
                                ->numeric()
                                ->default(112.599998)
                                ->helperText('Koordinat GPS lokasi roastery.'),
                        ]),
                    ]),

                Section::make('Ekspedisi & Kurir Pengiriman yang Diaktifkan')
                    ->description('Pilih daftar kurir yang dapat dipilih oleh pelanggan pada halaman checkout website.')
                    ->icon(Heroicon::CheckCircle)
                    ->schema([
                        CheckboxList::make('rajaongkir_couriers')
                            ->label('Daftar Ekspedisi Aktif')
                            ->options(ShippingService::getAvailableCouriers())
                            ->columns(3)
                            ->required(),
                    ]),

                Section::make('Kurir Instan Lokal Malang (GoSend / Pengantaran Cepat)')
                    ->description('Layanan pengantaran kilat hari yang sama (Same Day / Instant) khusus radius wilayah Malang Raya.')
                    ->icon(Heroicon::Bolt)
                    ->schema([
                        Toggle::make('gosend_enabled')
                            ->label('Aktifkan Layanan Kurir Instan Lokal Malang')
                            ->default(true),
                        Grid::make(3)->schema([
                            TextInput::make('gosend_rate_per_km')
                                ->label('Tarif per Kilometer')
                                ->prefix('Rp')
                                ->numeric()
                                ->default(2500)
                                ->helperText('Biaya ongkir per km jarak tempuh dari titik roastery.')
                                ->required(),
                            TextInput::make('gosend_min_cost')
                                ->label('Tarif Minimum Instan')
                                ->prefix('Rp')
                                ->numeric()
                                ->default(10000)
                                ->helperText('Tarif dasar minimum untuk pengiriman instan.')
                                ->required(),
                            TextInput::make('gosend_max_distance_km')
                                ->label('Batas Maksimal Radius')
                                ->suffix('KM')
                                ->numeric()
                                ->default(25)
                                ->helperText('Batas jarak terjauh pengantaran instan dari roastery.')
                                ->required(),
                        ]),
                    ]),

                Section::make('Program Subsidi & Promo Gratis Ongkir')
                    ->description('Atur subsidi ongkos kirim otomatis untuk meningkatkan konversi checkout pelanggan.')
                    ->icon(Heroicon::Sparkles)
                    ->schema([
                        Toggle::make('free_shipping_enabled')
                            ->label('Aktifkan Promo Bebas / Subsidi Ongkir')
                            ->default(true),
                        Grid::make(3)->schema([
                            TextInput::make('free_shipping_min')
                                ->label('Minimal Pembelian (Subtotal)')
                                ->prefix('Rp')
                                ->numeric()
                                ->default(250000)
                                ->helperText('Total belanja minimum agar promo bebas ongkir aktif.')
                                ->required(),
                            Select::make('free_shipping_zone')
                                ->label('Wilayah Cakupan Promo')
                                ->options([
                                    'java_only' => 'Pulau Jawa Saja (Seluruh Jawa & Madura)',
                                    'malang_only' => 'Malang Raya Saja (Kota & Kabupaten Malang)',
                                    'all_indonesia' => 'Seluruh Wilayah Indonesia (Nasional)',
                                ])
                                ->default('java_only')
                                ->required()
                                ->native(false),
                            TextInput::make('free_shipping_max_subsidy')
                                ->label('Maksimal Subsidi Ongkir')
                                ->prefix('Rp')
                                ->numeric()
                                ->default(0)
                                ->helperText('Ketik 0 untuk Gratis Ongkir 100% penuh tanpa batas subsidi.')
                                ->required(),
                        ]),
                    ]),

                Section::make('Biaya Penanganan & Bobot Standar Paket')
                    ->description('Pengaturan berat default produk dan biaya ekstra keamanan packaging (Bubble wrap tebal & fragile).')
                    ->icon(Heroicon::ArchiveBox)
                    ->schema([
                        Grid::make(2)->schema([
                            TextInput::make('shipping_default_weight_grams')
                                ->label('Berat Default per Produk')
                                ->suffix('Gram')
                                ->numeric()
                                ->default(200)
                                ->helperText('Digunakan bila data produk tidak memiliki data berat spesifik.')
                                ->required(),
                            TextInput::make('shipping_handling_fee')
                                ->label('Biaya Penanganan / Ekstra Packing (Per Checkout)')
                                ->prefix('Rp')
                                ->numeric()
                                ->default(0)
                                ->helperText('Biaya tambahan ekstra keamanan packing (opsional, ketik 0 jika gratis).')
                                ->required(),
                        ]),
                    ]),
            ]);
    }

    public function testConnection(): void
    {
        try {
            $provinces = ShippingService::getProvinces();
            $count = count($provinces);

            if ($count > 0) {
                Notification::make()
                    ->title('Koneksi RajaOngkir Berhasil!')
                    ->body("Berhasil terhubung ke API RajaOngkir. Terdeteksi {$count} data provinsi Indonesia secara real-time.")
                    ->success()
                    ->send();
            } else {
                Notification::make()
                    ->title('Peringatan Koneksi RajaOngkir')
                    ->body('Koneksi terhubung namun data respon kosong. Mohon periksa kembali API Key dan Tipe Akun Anda.')
                    ->warning()
                    ->send();
            }
        } catch (\Throwable $e) {
            Notification::make()
                ->title('Gagal Terhubung ke RajaOngkir')
                ->body('Terjadi kesalahan saat menguji koneksi: ' . $e->getMessage())
                ->danger()
                ->send();
        }
    }

    public function save(): void
    {
        $data = $this->form->getState();

        foreach ($data as $key => $value) {
            Setting::set($key, $value);
        }

        Cache::forget('sanubari_settings');

        Notification::make()
            ->title('Pengaturan RajaOngkir Berhasil Disimpan!')
            ->body('Konfigurasi API, titik asal roastery, pilihan kurir, dan tarif ongkir telah diperbarui secara langsung.')
            ->success()
            ->send();
    }

    protected function getFormActions(): array
    {
        return [
            Action::make('save')
                ->label('Simpan Pengaturan RajaOngkir')
                ->submit('save'),
            Action::make('testConnection')
                ->label('Uji Koneksi API RajaOngkir')
                ->action('testConnection')
                ->color('gray')
                ->icon(Heroicon::ArrowPath),
        ];
    }
}
