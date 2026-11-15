<?php

namespace App\Filament\Pages;

use App\Models\Setting;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Forms\Components\FileUpload;
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

class ManageInvoiceSettings extends Page
{
    protected static string|BackedEnum|null $navigationIcon = Heroicon::DocumentText;

    protected static string|\UnitEnum|null $navigationGroup = 'Pesanan & Transaksi';

    protected static ?string $navigationLabel = 'Pengaturan Faktur & Invoice';

    protected static ?string $title = 'Pengaturan Faktur & Dokumen Invoice';

    protected static ?int $navigationSort = 3;

    /**
     * @var array<string, mixed> | null
     */
    public ?array $data = [];

    public function mount(): void
    {
        $settings = Setting::all()->pluck('value', 'key')->toArray();

        $this->form->fill([
            // Identitas & Header
            'invoice_company_name' => $settings['invoice_company_name'] ?? ($settings['site_name'] ?? 'Alat Kopi Malang'),
            'invoice_company_tagline' => $settings['invoice_company_tagline'] ?? 'Specialty Coffee Roaster Malang · Close to Every Brew',
            'invoice_logo' => $settings['invoice_logo'] ?? null,
            'invoice_company_address' => $settings['invoice_company_address'] ?? ($settings['address'] ?? 'Ruko Tlogomas Square Kav. 34, Jl. Raya Tlogomas, Lowokwaru, Kota Malang, Jawa Timur 65144'),
            'invoice_phone' => $settings['invoice_phone'] ?? ($settings['whatsapp'] ?? '+6285121930454'),
            'invoice_email' => $settings['invoice_email'] ?? ($settings['email'] ?? 'info@alatkopimalang.co.id'),
            'invoice_website' => $settings['invoice_website'] ?? 'https://alatkopimalang.co.id',

            // Format Dokumen & Tampilan
            'invoice_title_label' => $settings['invoice_title_label'] ?? 'FAKTUR PEMBELIAN / INVOICE',
            'invoice_prefix' => $settings['invoice_prefix'] ?? '#',
            'invoice_paper_size' => $settings['invoice_paper_size'] ?? 'A4',
            'invoice_show_paid_stamp' => (bool) ($settings['invoice_show_paid_stamp'] ?? true),
            'invoice_stamp_text' => $settings['invoice_stamp_text'] ?? '★ LUNAS ★',
            'invoice_show_discount_breakdown' => (bool) ($settings['invoice_show_discount_breakdown'] ?? true),

            // Rekening & Petunjuk Pelunasan
            'invoice_bank_info' => $settings['invoice_bank_info'] ?? "BCA: 0113271701 a.n Alat Kopi Malang\nMandiri: 1440012345678 a.n Alat Kopi Malang\nKonfirmasi transfer hubungi WhatsApp: 0851-2193-0454",

            // Catatan Kaki & Garansi
            'invoice_footer_notes' => $settings['invoice_footer_notes'] ?? 'Terima kasih atas kepercayaan Anda berbelanja peralatan seduh kopi di Alat Kopi Malang. Silakan simpan invoice ini sebagai bukti transaksi resmi.',
            'invoice_terms' => $settings['invoice_terms'] ?? "1. Seluruh peralatan seduh, grinder, dan mesin espresso bergaransi resmi sesuai standar pabrikan.\n2. Wajib menyertakan video unboxing utuh tanpa jeda untuk klaim kerusakan fisik saat pengiriman kurir.\n3. Pertanyaan & bantuan teknis hubungi WhatsApp Customer Care Alat Kopi Malang.",

            // Pengesahan / Tanda Tangan
            'invoice_enable_signature' => (bool) ($settings['invoice_enable_signature'] ?? true),
            'invoice_signature_city' => $settings['invoice_signature_city'] ?? 'Malang',
            'invoice_signer_name' => $settings['invoice_signer_name'] ?? 'Finance & Sales Roastery',
            'invoice_signer_title' => $settings['invoice_signer_title'] ?? 'Alat Kopi Malang Official',
            'invoice_signature_image' => $settings['invoice_signature_image'] ?? null,
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
                Section::make('Identitas Toko & Header Invoice')
                    ->description('Kelola nama usaha, logo, slogan, dan kontak resmi yang tercetak pada bagian atas faktur.')
                    ->schema([
                        Grid::make(2)->schema([
                            TextInput::make('invoice_company_name')
                                ->label('Nama Toko / Perusahaan')
                                ->placeholder('Alat Kopi Malang')
                                ->required(),
                            TextInput::make('invoice_company_tagline')
                                ->label('Slogan / Sub-Header')
                                ->placeholder('Specialty Coffee Roaster Malang · Close to Every Brew'),
                        ]),
                        FileUpload::make('invoice_logo')
                            ->label('Logo Khusus Invoice (Opsional)')
                            ->helperText('Jika dikosongkan, invoice akan menggunakan logo default Alat Kopi Malang.')
                            ->image()
                            ->disk('public')
                            ->visibility('public')
                            ->directory('settings'),
                        Textarea::make('invoice_company_address')
                            ->label('Alamat Lengkap Toko di Invoice')
                            ->rows(2)
                            ->required(),
                        Grid::make(3)->schema([
                            TextInput::make('invoice_phone')
                                ->label('Nomor Telepon / WhatsApp')
                                ->placeholder('+6285121930454'),
                            TextInput::make('invoice_email')
                                ->label('Email Resmi')
                                ->email()
                                ->placeholder('info@alatkopimalang.co.id'),
                            TextInput::make('invoice_website')
                                ->label('Website Resmi')
                                ->placeholder('https://alatkopimalang.co.id'),
                        ]),
                    ]),

                Section::make('Format Dokumen & Stempel Lunas')
                    ->description('Sesuaikan teks judul dokumen, stempel status lunas, dan tampilan rincian harga.')
                    ->schema([
                        Grid::make(3)->schema([
                            TextInput::make('invoice_title_label')
                                ->label('Judul Dokumen')
                                ->placeholder('FAKTUR PEMBELIAN / INVOICE')
                                ->required(),
                            TextInput::make('invoice_prefix')
                                ->label('Awalan Simbol No. Pesanan')
                                ->placeholder('# atau INV-')
                                ->default('#'),
                            Select::make('invoice_paper_size')
                                ->label('Ukuran Kertas Cetak')
                                ->options([
                                    'A4' => 'A4 Portrait (Standar 210 x 297 mm)',
                                    'Letter' => 'Letter Portrait (216 x 279 mm)',
                                ])
                                ->default('A4')
                                ->native(false),
                        ]),
                        Grid::make(3)->schema([
                            Toggle::make('invoice_show_paid_stamp')
                                ->label('Tampilkan Stempel Status Lunas')
                                ->helperText('Menampilkan lencana stempel lunas melingkar saat transaksi sudah dibayar.')
                                ->default(true),
                            TextInput::make('invoice_stamp_text')
                                ->label('Teks Pada Stempel Lunas')
                                ->placeholder('★ LUNAS ★')
                                ->default('★ LUNAS ★'),
                            Toggle::make('invoice_show_discount_breakdown')
                                ->label('Tampilkan Rincian Diskon & Harga Coret')
                                ->helperText('Menampilkan baris Total Harga Normal dan potongan hemat bundling pada kalkulasi.')
                                ->default(true),
                        ]),
                    ]),

                Section::make('Rekening Bank & Petunjuk Pelunasan')
                    ->description('Informasi rekening untuk transfer manual serta instruksi pelunasan produk pre-order.')
                    ->schema([
                        Textarea::make('invoice_bank_info')
                            ->label('Daftar Rekening Bank & Instruksi Pembayaran (Opsional)')
                            ->placeholder("Contoh:\nBCA: 0113271701 a.n Alat Kopi Malang\nMandiri: 1440012345678 a.n Alat Kopi Malang")
                            ->rows(3)
                            ->helperText('Akan ditampilkan dalam kotak informasi perbankan pada invoice cetak/PDF.'),
                    ]),

                Section::make('Catatan Penutup, Garansi & Ketentuan')
                    ->description('Teks ucapan terima kasih dan syarat ketentuan klaim garansi yang tercantum di bagian bawah invoice.')
                    ->schema([
                        Textarea::make('invoice_footer_notes')
                            ->label('Catatan Kaki / Ucapan Penutup')
                            ->placeholder('Terima kasih atas pesanan Anda di Alat Kopi Malang...')
                            ->rows(2),
                        Textarea::make('invoice_terms')
                            ->label('Ketentuan Garansi & Pengiriman')
                            ->placeholder("1. Barang bergaransi resmi...\n2. Wajib sertakan video unboxing...")
                            ->rows(3)
                            ->helperText('Gunakan baris baru untuk setiap poin ketentuan garansi.'),
                    ]),

                Section::make('Tanda Tangan & Pengesahan Dokumen')
                    ->description('Kolom pengesahan tanda tangan dan stempel resmi di bagian bawah faktur.')
                    ->schema([
                        Toggle::make('invoice_enable_signature')
                            ->label('Aktifkan Kolom Tanda Tangan Resmi di Invoice')
                            ->default(true),
                        Grid::make(3)->schema([
                            TextInput::make('invoice_signature_city')
                                ->label('Kota Penandatanganan')
                                ->placeholder('Malang')
                                ->default('Malang'),
                            TextInput::make('invoice_signer_name')
                                ->label('Nama Penanggung Jawab')
                                ->placeholder('Finance & Sales Roastery'),
                            TextInput::make('invoice_signer_title')
                                ->label('Jabatan / Unit Kerja')
                                ->placeholder('Alat Kopi Malang Official'),
                        ]),
                        FileUpload::make('invoice_signature_image')
                            ->label('Gambar Tanda Tangan / Stempel Digital (Opsional)')
                            ->helperText('Format PNG transparan disarankan untuk hasil cetak yang bersih.')
                            ->image()
                            ->disk('public')
                            ->visibility('public')
                            ->directory('settings'),
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
            ->title('Pengaturan Invoice Berhasil Disimpan!')
            ->body('Format, identitas toko, stempel, dan catatan faktur telah diperbarui secara langsung.')
            ->success()
            ->send();
    }

    protected function getFormActions(): array
    {
        return [
            Action::make('save')
                ->label('Simpan Pengaturan Invoice')
                ->submit('save'),
        ];
    }
}
