<?php

namespace App\Filament\Pages;

use App\Models\Setting;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Forms\Components\Select;
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

class ManageOrderSettings extends Page
{
    protected static string|BackedEnum|null $navigationIcon = Heroicon::Cog6Tooth;

    protected static string|\UnitEnum|null $navigationGroup = 'Pesanan & Transaksi';

    protected static ?string $navigationLabel = 'Pengaturan Pesanan Masuk';

    protected static ?string $title = 'Pengaturan Penerimaan Pesanan Masuk (Real-Time)';

    protected static ?int $navigationSort = 2;

    /**
     * @var array<string, mixed> | null
     */
    public ?array $data = [];

    public function mount(): void
    {
        $settings = Setting::all()->pluck('value', 'key')->toArray();

        $this->form->fill([
            'order_acceptance_status' => $settings['order_acceptance_status'] ?? 'open',
            'order_acceptance_announcement' => $settings['order_acceptance_announcement'] ?? '',
            'order_admin_wa_notification' => (bool) ($settings['order_admin_wa_notification'] ?? true),
            'order_admin_wa_number' => $settings['order_admin_wa_number'] ?? ($settings['whatsapp'] ?? '6285121930454'),
            'order_audio_alert_enabled' => (bool) ($settings['order_audio_alert_enabled'] ?? true),
            'order_auto_cancel_hours' => (int) ($settings['order_auto_cancel_hours'] ?? 24),
            'order_preorder_default_min_dp' => (int) ($settings['order_preorder_default_min_dp'] ?? 30),
            'order_invoice_footer_notes' => $settings['order_invoice_footer_notes'] ?? 'Terima kasih atas pesanan Anda di Alat Kopi Malang. Silakan simpan invoice ini sebagai bukti transaksi resmi.',
        ]);
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
                Section::make('Status Penerimaan Pesanan Website (Real-Time)')
                    ->description('Atur apakah website sedang menerima pesanan normal, batch sangrai khusus, atau libur operasional sementara.')
                    ->schema([
                        Select::make('order_acceptance_status')
                            ->label('Status Operasional Penerimaan Pesanan')
                            ->options([
                                'open' => '🟢 Buka Normal (Menerima Semua Pesanan Otomatis)',
                                'roasting_batch' => '🟡 Mode Jadwal Sangrai / Batch Roasting (Pesanan tetap masuk, dikirim batch berikutnya)',
                                'closed_temp' => '🔴 Toko Libur / Tutup Sementara (Pemberitahuan khusus di keranjang & checkout)',
                            ])
                            ->required()
                            ->native(false)
                            ->helperText('Status ini menentukan banner informasi ketersediaan pesanan di website pada keranjang & halaman checkout.'),

                        Textarea::make('order_acceptance_announcement')
                            ->label('Catatan Operasional / Pengumuman Pesanan untuk Pelanggan (Opsional)')
                            ->placeholder('Contoh: Pesanan yang masuk setelah pukul 15.00 WIB akan disangrai segar dan dikirimkan pada hari kerja berikutnya.')
                            ->rows(3)
                            ->helperText('Akan ditampilkan di halaman keranjang belanja dan checkout saat status aktif.'),
                    ]),

                Section::make('Notifikasi Real-Time WhatsApp & Audio Alert Dashboard')
                    ->description('Pengaturan pemberitahuan instan saat pembeli melakukan checkout baru di website.')
                    ->schema([
                        Grid::make(2)->schema([
                            Toggle::make('order_audio_alert_enabled')
                                ->label('Aktifkan Audio Alert Lonceng di Dashboard')
                                ->helperText('Membunyikan nada lonceng notifikasi di dashboard admin secara real-time saat pesanan baru masuk.')
                                ->default(true),

                            Toggle::make('order_admin_wa_notification')
                                ->label('Notifikasi WhatsApp Admin Otomatis')
                                ->helperText('Kirim pesan ringkasan instan ke nomor WhatsApp admin saat pesanan baru masuk.')
                                ->default(true),
                        ]),

                        TextInput::make('order_admin_wa_number')
                            ->label('Nomor WhatsApp Admin Penerima Notifikasi')
                            ->placeholder('6285121930454')
                            ->helperText('Gunakan kode negara (contoh: 6285121930454 tanpa tanda plus atau spasi).')
                            ->required(),
                    ]),

                Section::make('Batas Waktu Pembayaran & Kebijakan Pre-Order')
                    ->description('Konfigurasi batas waktu pembayaran kedaluwarsa serta persentase minimum uang muka Pre-Order.')
                    ->schema([
                        Grid::make(2)->schema([
                            TextInput::make('order_auto_cancel_hours')
                                ->label('Batas Waktu Pembayaran (Jam)')
                                ->numeric()
                                ->default(24)
                                ->helperText('Batas waktu pembayaran pesanan sebelum otomatis kedaluwarsa jika pembeli belum mentransfer dana.'),

                            Select::make('order_preorder_default_min_dp')
                                ->label('Default Minimum DP Pre-Order Toko')
                                ->options([
                                    30 => '30% (Rekomendasi Standar)',
                                    50 => '50% (Mesin Espresso & Grinder)',
                                    70 => '70% (Alat Khusus / Import)',
                                    100 => '100% (Lunas Penuh)',
                                ])
                                ->default(30)
                                ->native(false)
                                ->helperText('Persentase minimum DP default untuk produk baru berstatus Pre-Order.'),
                        ]),

                        Textarea::make('order_invoice_footer_notes')
                            ->label('Catatan Kaki Invoice Resmi')
                            ->rows(2)
                            ->helperText('Teks ini akan dicetak pada bagian bawah lembar invoice PDF/cetak pelanggan.'),
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
            ->title('Pengaturan Pesanan Masuk Berhasil Disimpan!')
            ->body('Konfigurasi operasional penerimaan pesanan dan notifikasi real-time telah diperbarui.')
            ->success()
            ->send();
    }

    protected function getFormActions(): array
    {
        return [
            Action::make('save')
                ->label('Simpan Pengaturan Pesanan Masuk')
                ->submit('save'),
        ];
    }
}
