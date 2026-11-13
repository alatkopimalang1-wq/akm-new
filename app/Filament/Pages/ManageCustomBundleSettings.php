<?php

namespace App\Filament\Pages;

use App\Models\Category;
use App\Models\Product;
use App\Models\Setting;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Forms\Components\Repeater;
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

class ManageCustomBundleSettings extends Page
{
    protected static string|BackedEnum|null $navigationIcon = Heroicon::Gift;

    protected static string|\UnitEnum|null $navigationGroup = 'Katalog & Produk';

    protected static ?string $navigationLabel = 'Pengaturan Paket Custom';

    protected static ?string $title = 'Pengaturan Custom Produk Paket (Bundle Builder)';

    protected static ?int $navigationSort = 4;

    /**
     * @var array<string, mixed> | null
     */
    public ?array $data = [];

    public static function defaultBundleSettings(): array
    {
        return [
            'is_active' => true,
            'badge_text' => 'Custom Bundle & Diskon Bertingkat',
            'title' => 'Buat Paket Alat Kopi Custom Anda',
            'subtitle' => 'Pilih kombinasi peralatan kopi dari katalog kami berdasarkan kategori produk. Semakin banyak produk yang Anda masukkan ke dalam paket, semakin besar diskon otomatis yang Anda dapatkan!',
            'whatsapp_number' => '6285121930454',

            // Produk Wajib
            'required_section_title' => '1. Pilih Produk Wajib (Utama)',
            'required_section_desc' => 'Pilih minimal produk wajib di bawah ini sebagai komponen utama paket Anda sebelum menambahkan produk opsional.',
            'min_required_items' => 1,
            'required_category_ids' => [],
            'required_product_ids' => [],

            // Produk Opsional
            'optional_section_title' => '2. Pilih Produk Opsional (Berdasarkan Kategori)',
            'optional_section_desc' => 'Pilih produk tambahan dari berbagai kategori katalog untuk melengkapi kebutuhan seduh Anda dan membuka tingkatan diskon berikutnya.',
            'optional_category_ids' => [],
            'optional_product_ids' => [],

            // Tingkatan Diskon
            'discount_tiers' => [
                [
                    'min_items' => 2,
                    'discount_type' => 'percentage',
                    'discount_value' => 5,
                    'label' => 'Hemat 5% (Min. 2 Produk)',
                ],
                [
                    'min_items' => 3,
                    'discount_type' => 'percentage',
                    'discount_value' => 10,
                    'label' => 'Hemat 10% (Min. 3 Produk)',
                ],
                [
                    'min_items' => 5,
                    'discount_type' => 'percentage',
                    'discount_value' => 15,
                    'label' => 'Hemat 15% (Min. 5 Produk)',
                ],
            ],
        ];
    }

    public function mount(): void
    {
        $saved = Setting::get('custom_bundle_settings', []);
        $defaults = static::defaultBundleSettings();

        $merged = array_merge($defaults, is_array($saved) ? $saved : []);
        if (empty($merged['discount_tiers']) || ! is_array($merged['discount_tiers'])) {
            $merged['discount_tiers'] = $defaults['discount_tiers'];
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

    protected function getCategoryOptions(): array
    {
        return Category::whereNull('parent_id')
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get()
            ->mapWithKeys(function ($cat) {
                $name = $cat->getTranslation('name') ?: (is_array($cat->name) ? ($cat->name['id'] ?? reset($cat->name)) : $cat->name);

                return [(string) $cat->id => $name];
            })
            ->toArray();
    }

    protected function getProductOptions(): array
    {
        return Product::where('slug', '!=', 'byob')
            ->orderBy('name')
            ->get()
            ->mapWithKeys(function ($prod) {
                $brand = $prod->producer ? "[{$prod->producer}] " : '';

                return [(string) $prod->id => $brand . $prod->name];
            })
            ->toArray();
    }

    public function form(Schema $schema): Schema
    {
        $categoryOptions = $this->getCategoryOptions();
        $productOptions = $this->getProductOptions();

        return $schema
            ->components([
                Section::make('Informasi Halaman Custom Produk Paket')
                    ->description('Atur judul, deskripsi, dan status aktif halaman pembuatan paket custom (/paket-custom).')
                    ->schema([
                        Toggle::make('is_active')
                            ->label('Aktifkan Fitur Paket Custom')
                            ->default(true),
                        Grid::make(2)->schema([
                            TextInput::make('badge_text')
                                ->label('Badge Header')
                                ->placeholder('Contoh: Custom Bundle & Diskon Bertingkat')
                                ->required(),
                            TextInput::make('whatsapp_number')
                                ->label('Nomor WhatsApp Konsultasi / Order Paket')
                                ->placeholder('6285121930454')
                                ->required(),
                        ]),
                        TextInput::make('title')
                            ->label('Judul Halaman Paket Custom')
                            ->placeholder('Buat Paket Alat Kopi Custom Anda')
                            ->required(),
                        Textarea::make('subtitle')
                            ->label('Subjudul / Penjelasan Singkat')
                            ->rows(2)
                            ->required(),
                    ]),

                Section::make('Pengaturan Produk Wajib (Mandatory Products)')
                    ->description('Tentukan produk atau kategori produk yang WAJIB dipilih pelanggan sebagai syarat utama pembuatan paket custom.')
                    ->schema([
                        Grid::make(2)->schema([
                            TextInput::make('required_section_title')
                                ->label('Judul Bagian Produk Wajib')
                                ->default('1. Pilih Produk Wajib (Utama)')
                                ->required(),
                            TextInput::make('min_required_items')
                                ->label('Minimal Jumlah Produk Wajib yang Harus Dipilih')
                                ->numeric()
                                ->minValue(0)
                                ->default(1)
                                ->required()
                                ->helperText('Isi 1 jika pelanggan wajib memilih minimal 1 produk dari daftar Produk Wajib (isi 0 jika tidak diwajibkan).'),
                        ]),
                        Textarea::make('required_section_desc')
                            ->label('Deskripsi Bagian Produk Wajib')
                            ->rows(2)
                            ->required(),
                        Grid::make(2)->schema([
                            Select::make('required_category_ids')
                                ->label('Kategori Produk Wajib')
                                ->multiple()
                                ->searchable()
                                ->preload()
                                ->options($categoryOptions)
                                ->helperText('Pilih kategori yang masuk ke dalam kelompok Produk Wajib (contoh: Espresso Machine, Coffee Grinder, Manual Brew). Jika kosong dan daftar produk wajib di samping juga kosong, sistem menampilkan produk unggulan.'),
                            Select::make('required_product_ids')
                                ->label('Pilih Produk Wajib Spesifik')
                                ->multiple()
                                ->searchable()
                                ->preload()
                                ->options($productOptions)
                                ->helperText('Pilih produk spesifik yang menjadi Produk Wajib. Dapat dikombinasikan dengan Kategori Produk Wajib di samping.'),
                        ]),
                    ]),

                Section::make('Pengaturan Produk Opsional (Optional Products)')
                    ->description('Tentukan produk atau kategori produk opsional yang dapat dipilih pelanggan untuk melengkapi paket dan menambah jumlah item agar mencapai target diskon.')
                    ->schema([
                        TextInput::make('optional_section_title')
                            ->label('Judul Bagian Produk Opsional')
                            ->default('2. Pilih Produk Opsional (Berdasarkan Kategori)')
                            ->required(),
                        Textarea::make('optional_section_desc')
                            ->label('Deskripsi Bagian Produk Opsional')
                            ->rows(2)
                            ->required(),
                        Grid::make(2)->schema([
                            Select::make('optional_category_ids')
                                ->label('Filter Kategori Produk Opsional')
                                ->multiple()
                                ->searchable()
                                ->preload()
                                ->options($categoryOptions)
                                ->helperText('Kosongkan jika ingin menampilkan SEMUA kategori produk katalog pada bagian Produk Opsional.'),
                            Select::make('optional_product_ids')
                                ->label('Pilih Produk Opsional Spesifik (Opsional)')
                                ->multiple()
                                ->searchable()
                                ->preload()
                                ->options($productOptions)
                                ->helperText('Kosongkan jika semua produk aktif di katalog boleh dipilih sebagai produk opsional.'),
                        ]),
                    ]),

                Section::make('Pengaturan Tingkatan Diskon Paket (Discount Tiers)')
                    ->description('Atur diskon otomatis yang didapatkan pelanggan setelah memasukkan sejumlah produk ke dalam paket.')
                    ->schema([
                        Repeater::make('discount_tiers')
                            ->label('Tingkatan Diskon Berdasarkan Jumlah Produk')
                            ->schema([
                                Grid::make(4)->schema([
                                    TextInput::make('min_items')
                                        ->label('Minimal Jumlah Produk')
                                        ->numeric()
                                        ->minValue(1)
                                        ->default(2)
                                        ->required()
                                        ->helperText('Contoh: 2 produk'),
                                    Select::make('discount_type')
                                        ->label('Tipe Diskon')
                                        ->options([
                                            'percentage' => 'Persentase (%)',
                                            'fixed' => 'Potongan Nominal (Rp)',
                                        ])
                                        ->default('percentage')
                                        ->required(),
                                    TextInput::make('discount_value')
                                        ->label('Nilai Diskon')
                                        ->numeric()
                                        ->minValue(0)
                                        ->default(5)
                                        ->required()
                                        ->helperText('Contoh: 5 untuk 5%, atau 100000 untuk Rp 100.000'),
                                    TextInput::make('label')
                                        ->label('Label Promo')
                                        ->placeholder('Contoh: Hemat 5% (Min. 2 Produk)')
                                        ->required(),
                                ]),
                            ])
                            ->itemLabel(fn (array $state): ?string => ($state['label'] ?? 'Tier Diskon') . ' — Min. ' . ($state['min_items'] ?? '?') . ' Produk')
                            ->reorderable()
                            ->collapsible()
                            ->addActionLabel('+ Tambah Tingkatan Diskon'),
                    ]),
            ]);
    }

    public function save(): void
    {
        $data = $this->form->getState();

        Setting::set('custom_bundle_settings', $data);
        Cache::forget('sanubari_settings');

        Notification::make()
            ->title('Pengaturan Paket Custom Disimpan!')
            ->body('Konfigurasi produk wajib, produk opsional, dan tingkatan diskon paket telah diperbarui.')
            ->success()
            ->send();
    }

    protected function getFormActions(): array
    {
        return [
            Action::make('save')
                ->label('Simpan Pengaturan Paket Custom')
                ->submit('save'),
        ];
    }
}
