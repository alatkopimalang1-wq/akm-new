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
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Illuminate\Support\Facades\Cache;

class ManagePreOrderTerms extends Page
{
    protected static string|BackedEnum|null $navigationIcon = Heroicon::DocumentCheck;

    protected static string|\UnitEnum|null $navigationGroup = 'Konten & Media';

    protected static ?string $navigationLabel = 'Syarat & Ketentuan Pre-Order';

    protected static ?string $title = 'Pengaturan Halaman Syarat & Ketentuan Pre-Order';

    protected static ?int $navigationSort = 2;

    /**
     * @var array<string, mixed> | null
     */
    public ?array $data = [];

    public static function defaultPreOrderTerms(): array
    {
        return [
            'hero_badge' => 'Kebijakan & Informasi Resmi',
            'hero_title' => 'Syarat & Ketentuan Pre-Order',
            'hero_subtitle' => 'Panduan lengkap mengenai mekanisme pemesanan, estimasi waktu kedatangan, pembayaran, serta jaminan garansi resmi untuk produk berstatus Pre-Order di Alat Kopi Malang.',
            'intro_text' => 'Produk dengan label Pre-Order merupakan unit peralatan kopi, mesin espresso komersial, grinder, atau suku cadang khusus yang dipesan secara khusus (indent) dari distributor resmi maupun prinsipal brand terkait untuk menjamin keaslian dan kondisi unit terbaru.',
            'sections' => [
                [
                    'title' => '1. Mekanisme & Konfirmasi Pemesanan',
                    'content' => "• Setiap pesanan produk berstatus Pre-Order akan dikonfirmasi langsung oleh tim Alat Kopi Malang melalui WhatsApp atau kontak resmi yang terdaftar saat checkout.\n• Spesifikasi unit (warna, tegangan listrik, tipe burr, atau varian ukuran) akan diverifikasi kembali bersama pembeli sebelum pesanan diproses ke distributor resmi.\n• Kuota Pre-Order bersifat terbatas mengikuti ketersediaan batch pengiriman berjalan.",
                ],
                [
                    'title' => '2. Ketentuan Pembayaran & Down Payment (DP)',
                    'content' => "• Untuk produk Pre-Order kategori aksesoris dan alat seduh manual, pembayaran dilakukan secara penuh (100%) saat pemesanan.\n• Untuk mesin espresso komersial dan grinder skala kafe, pembeli dapat melakukan pembayaran penuh atau Down Payment (DP) minimal 50% sesuai kesepakatan tertulis melalui invoice resmi Alat Kopi Malang.\n• Pelunasan sisa pembayaran dilakukan setelah unit tiba di gudang/showroom Alat Kopi Malang dan siap dikirimkan ke alamat pembeli.",
                ],
                [
                    'title' => '3. Estimasi Waktu Kedatangan & Pengiriman',
                    'content' => "• Estimasi waktu tunggu (lead time) produk Pre-Order berkisar antara 7 hingga 30 hari kerja tergantung ketersediaan stok pada prinsipal brand dan jalur logistik/kepabeanan.\n• Tim Alat Kopi Malang akan memberikan pembaruan status pesanan secara berkala hingga unit tiba di Malang.\n• Sebelum dikirim ke alamat tujuan, setiap unit mesin dan peralatan elektronik akan melalui tahap Quality Control (QC) dan uji fungsi oleh teknisi kami.",
                ],
                [
                    'title' => '4. Kebijakan Pembatalan & Perubahan Pesanan',
                    'content' => "• Pesanan Pre-Order yang telah dikonfirmasi dan diproses ke distributor tidak dapat dibatalkan atau diubah sepihak oleh pembeli.\n• Apabila terjadi kendala ketersediaan stok dari pihak prinsipal/distributor yang menyebabkan pesanan tidak dapat dipenuhi melebihi batas waktu yang disepakati, maka seluruh dana yang telah dibayarkan akan dikembalikan 100% (Full Refund) kepada pembeli.",
                ],
                [
                    'title' => '5. Jaminan Keaslian & Garansi Resmi',
                    'content' => "• Seluruh produk Pre-Order di Alat Kopi Malang dijamin 100% Original dan bergaransi resmi sesuai ketentuan masing-masing brand.\n• Pembeli berhak mendapatkan dukungan instalasi, konsultasi teknis penggunaan alat, serta layanan purna jual (after-sales service) melalui teknisi Alat Kopi Malang.",
                ],
            ],
            'cta_title' => 'Butuh Konsultasi Sebelum Pre-Order?',
            'cta_description' => 'Tim spesialis peralatan kopi kami siap membantu Anda memastikan spesifikasi mesin, daya listrik, dan estimasi jadwal pengiriman terbaik untuk kebutuhan kedai maupun rumah Anda.',
            'cta_button_text' => 'Konsultasi via WhatsApp',
            'whatsapp_number' => '6285121930454',
            'last_updated' => 'Diperbarui oleh Manajemen Alat Kopi Malang',
        ];
    }

    public function mount(): void
    {
        $saved = Setting::get('page_preorder_terms', []);
        $defaults = static::defaultPreOrderTerms();

        $merged = array_merge($defaults, is_array($saved) ? $saved : []);
        if (empty($merged['sections']) || ! is_array($merged['sections'])) {
            $merged['sections'] = $defaults['sections'];
        }

        $this->form->fill($merged);
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
                Section::make('Header Halaman Syarat & Ketentuan Pre-Order')
                    ->description('Atur teks judul utama, badge, dan paragraf pembuka pada halaman /syarat-ketentuan-pre-order.')
                    ->schema([
                        Grid::make(2)->schema([
                            TextInput::make('hero_badge')
                                ->label('Badge Atas')
                                ->placeholder('Contoh: Kebijakan & Informasi Resmi')
                                ->required(),
                            TextInput::make('last_updated')
                                ->label('Keterangan Pembaruan')
                                ->placeholder('Contoh: Diperbarui oleh Manajemen Alat Kopi Malang'),
                        ]),
                        TextInput::make('hero_title')
                            ->label('Judul Halaman')
                            ->placeholder('Syarat & Ketentuan Pre-Order')
                            ->required(),
                        Textarea::make('hero_subtitle')
                            ->label('Subjudul / Deskripsi Header')
                            ->rows(2)
                            ->required(),
                        Textarea::make('intro_text')
                            ->label('Paragraf Pembuka (Highlight Box)')
                            ->rows(3),
                    ]),

                Section::make('Daftar Poin Syarat & Ketentuan Pre-Order')
                    ->description('Anda dapat menambah, mengubah, mengurutkan, atau menghapus pasal/poin syarat & ketentuan Pre-Order.')
                    ->schema([
                        Repeater::make('sections')
                            ->label('Poin / Pasal Ketentuan')
                            ->schema([
                                TextInput::make('title')
                                    ->label('Judul Poin / Pasal')
                                    ->placeholder('Contoh: 1. Mekanisme & Konfirmasi Pemesanan')
                                    ->required(),
                                Textarea::make('content')
                                    ->label('Isi Ketentuan (Gunakan baris baru untuk setiap poin)')
                                    ->rows(5)
                                    ->required(),
                            ])
                            ->itemLabel(fn (array $state): ?string => $state['title'] ?? 'Poin Ketentuan')
                            ->reorderable()
                            ->collapsible()
                            ->addActionLabel('+ Tambah Poin Ketentuan'),
                    ]),

                Section::make('Kotak Bantuan & Konsultasi WhatsApp (Bagian Bawah)')
                    ->schema([
                        Grid::make(2)->schema([
                            TextInput::make('cta_title')
                                ->label('Judul Kotak Bantuan')
                                ->required(),
                            TextInput::make('cta_button_text')
                                ->label('Teks Tombol WhatsApp')
                                ->required(),
                        ]),
                        TextInput::make('whatsapp_number')
                            ->label('Nomor WhatsApp Tujuan (Format 628xxx)')
                            ->placeholder('6285121930454')
                            ->required(),
                        Textarea::make('cta_description')
                            ->label('Deskripsi Kotak Bantuan')
                            ->rows(2)
                            ->required(),
                    ]),
            ]);
    }

    public function save(): void
    {
        $data = $this->form->getState();

        Setting::set('page_preorder_terms', $data);
        Cache::forget('sanubari_settings');

        Notification::make()
            ->title('Halaman Syarat & Ketentuan Pre-Order Disimpan!')
            ->body('Perubahan isi halaman Syarat & Ketentuan Pre-Order telah berhasil diperbarui.')
            ->success()
            ->send();
    }

    protected function getFormActions(): array
    {
        return [
            Action::make('save')
                ->label('Simpan Pengaturan Halaman')
                ->submit('save'),
        ];
    }
}

