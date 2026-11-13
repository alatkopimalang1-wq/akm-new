<?php

namespace App\Filament\Pages;

use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Setting;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Placeholder;
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
use Illuminate\Support\HtmlString;

class ManageByobSettings extends Page
{
    protected static string|BackedEnum|null $navigationIcon = Heroicon::AdjustmentsHorizontal;

    protected static string|\UnitEnum|null $navigationGroup = 'Katalog & Toko';

    protected static ?string $navigationLabel = 'Studio BYOB (C.Y.B.R)';

    protected static ?string $title = 'Pengaturan Studio Racik BYOB (C.Y.B.R)';

    protected static ?int $navigationSort = 2;

    /**
     * @var array<string, mixed> | null
     */
    public ?array $data = [];

    public function mount(): void
    {
        $settings = Setting::all()->pluck('value', 'key')->toArray();
        $byobSettings = $settings['byob_settings'] ?? [];

        // Default coffee beans if not previously saved
        $defaultBeans = [];
        if (!empty($byobSettings['byob_beans']) && is_array($byobSettings['byob_beans'])) {
            $defaultBeans = $byobSettings['byob_beans'];
        } else {
            $existingProducts = Product::active()
                ->where('slug', '!=', 'byob')
                ->where(function ($q) {
                    $q->whereNull('series')->orWhere('series', '!=', 'equipment');
                })
                ->orderBy('name')
                ->take(12)
                ->get();

            foreach ($existingProducts as $p) {
                $defaultBeans[] = [
                    'product_id' => $p->id,
                    'name' => $p->name,
                    'origin' => $p->origin ?: 'Kawi, Malang',
                    'process' => $p->process ?: 'Artisan Roast',
                    'price_per_10g' => (float) ($p->price_per_10g ?: 3500),
                    'tasting_notes' => $p->tasting_notes ?: '',
                    'is_active' => true,
                ];
            }
        }

        // Default packaging variants
        $defaultVariants = $byobSettings['byob_variants'] ?? [
            ['label' => '200g', 'weight_grams' => 200, 'discount_type' => 'percentage', 'discount_value' => 0, 'is_default' => true],
            ['label' => '500g', 'weight_grams' => 500, 'discount_type' => 'percentage', 'discount_value' => 5, 'is_default' => false],
            ['label' => '1 kg', 'weight_grams' => 1000, 'discount_type' => 'percentage', 'discount_value' => 10, 'is_default' => false],
        ];

        // Ensure discount_type and discount_value are set
        foreach ($defaultVariants as &$v) {
            $v['discount_type'] = $v['discount_type'] ?? 'percentage';
            $v['discount_value'] = (float) ($v['discount_value'] ?? ($v['discount_percentage'] ?? 0));
        }
        unset($v);

        // Default grind options
        $defaultGrindOptions = $byobSettings['byob_grind_options'] ?? [
            ['name' => 'Whole Bean (Biji Utuh)'],
            ['name' => 'Giling Kasar (Cold Brew, French Press)'],
            ['name' => 'Giling Medium (V60, Kalita, Filter)'],
            ['name' => 'Giling Halus (Mokapot, Aeropress)'],
            ['name' => 'Espresso / Tubruk Halus'],
        ];

        $this->form->fill([
            'hero_title' => $byobSettings['hero_title'] ?? 'C.Y.B.R: Custom Your Blend Ratio',
            'hero_description' => $byobSettings['hero_description'] ?? 'Layanan C.Y.B.R (Custom Your Blend Ratio) Kopi Sanubari Roastery Malang. Padukan single origin lereng Gunung Kawi dan Nusantara dengan satu slider rasio persentase presisi.',
            'hero_image' => ! empty($byobSettings['hero_image']) ? ltrim(preg_replace('#^/?(?:(?:storage|public)/)+#', '', trim($byobSettings['hero_image'])), '/') : null,
            'packshot_image' => ! empty($byobSettings['packshot_image']) ? ltrim(preg_replace('#^/?(?:(?:storage|public)/)+#', '', trim($byobSettings['packshot_image'])), '/') : null,

            'studio_title' => $byobSettings['studio_title'] ?? 'Custom Blend Studio',
            'studio_subtitle' => $byobSettings['studio_subtitle'] ?? 'Pilih 2 biji kopi dan tentukan proporsi rasio dengan 1 slider persentase.',
            'default_ratio' => $byobSettings['default_ratio'] ?? 70,
            'possible_notes_title' => $byobSettings['possible_notes_title'] ?? 'Possible Notes:',

            'byob_beans' => $defaultBeans,
            'byob_variants' => $defaultVariants,
            'byob_grind_options' => $defaultGrindOptions,
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
                Section::make('Hero Banner & Informasi Utama')
                    ->description('Pengaturan judul besar, pengantar, dan visual banner di halaman C.Y.B.R.')
                    ->icon(Heroicon::Photo)
                    ->collapsible()
                    ->schema([
                        Grid::make(2)->schema([
                            TextInput::make('hero_title')
                                ->label('Judul Hero Halaman')
                                ->placeholder('C.Y.B.R: Custom Your Blend Ratio')
                                ->required(),
                            TextInput::make('studio_title')
                                ->label('Judul Bagian Studio')
                                ->placeholder('Custom Blend Studio')
                                ->required(),
                        ]),
                        Grid::make(2)->schema([
                            Textarea::make('hero_description')
                                ->label('Deskripsi / Meta Halaman')
                                ->rows(3)
                                ->helperText('Deskripsi teks untuk pengunjung dan meta SEO.'),
                            TextInput::make('studio_subtitle')
                                ->label('Subjudul Studio')
                                ->placeholder('Pilih 2 biji kopi dan tentukan proporsi rasio dengan 1 slider persentase.')
                                ->required(),
                        ]),
                        Grid::make(2)->schema([
                            Placeholder::make('hero_image_preview')
                                ->label('Pratinjau Hero Background Saat Ini')
                                ->content(function ($get): HtmlString {
                                    $img = $get('hero_image');
                                    if (empty($img)) {
                                        return new HtmlString('<div class="rounded-lg border border-dashed border-gray-700 p-2 text-center text-xs text-gray-400">Belum ada foto background kustom.</div>');
                                    }
                                    $path = is_array($img) ? array_values($img)[0] : $img;
                                    $clean = ltrim(preg_replace('#^/?(?:(?:storage|public)/)+#', '', trim($path)), '/');
                                    $src = '/storage/' . $clean;
                                    $prodUrl = 'https://sanubariroastery.co.id' . $src;
                                    $fallback = ' onerror="if(this.src!=\'' . e($prodUrl) . '\'){this.src=\'' . e($prodUrl) . '\';}"';
                                    return new HtmlString('<div class="flex items-center gap-3 rounded-lg border border-gray-700/60 bg-gray-900/60 p-2"><img src="' . e($src) . '" alt="Hero" class="h-16 w-28 object-cover rounded"' . $fallback . ' /><span class="text-xs text-gray-300 font-mono">' . e(basename($src)) . '</span></div>');
                                }),
                            Placeholder::make('packshot_image_preview')
                                ->label('Pratinjau Packshot Kemasan Saat Ini')
                                ->content(function ($get): HtmlString {
                                    $img = $get('packshot_image');
                                    if (empty($img)) {
                                        return new HtmlString('<div class="rounded-lg border border-dashed border-gray-700 p-2 text-center text-xs text-gray-400">Belum ada foto kemasan packshot.</div>');
                                    }
                                    $path = is_array($img) ? array_values($img)[0] : $img;
                                    $clean = ltrim(preg_replace('#^/?(?:(?:storage|public)/)+#', '', trim($path)), '/');
                                    $src = '/storage/' . $clean;
                                    $prodUrl = 'https://sanubariroastery.co.id' . $src;
                                    $fallback = ' onerror="if(this.src!=\'' . e($prodUrl) . '\'){this.src=\'' . e($prodUrl) . '\';}"';
                                    return new HtmlString('<div class="flex items-center gap-3 rounded-lg border border-gray-700/60 bg-gray-900/60 p-2"><img src="' . e($src) . '" alt="Packshot" class="h-16 w-28 object-cover rounded"' . $fallback . ' /><span class="text-xs text-gray-300 font-mono">' . e(basename($src)) . '</span></div>');
                                }),
                        ]),
                        Grid::make(2)->schema([
                            FileUpload::make('hero_image')
                                ->label('Gambar Background Hero Banner')
                                ->disk('public')
                                ->directory('byob')
                                ->image()
                                ->imageEditor()
                                ->live()
                                ->helperText('Upload foto background hero roastery/kebun Kawi. Jika kosong, memakai visual default.'),
                            FileUpload::make('packshot_image')
                                ->label('Foto Kemasan / Packshot (Kolom Kanan)')
                                ->disk('public')
                                ->directory('byob')
                                ->image()
                                ->imageEditor()
                                ->live()
                                ->helperText('Upload foto pouch/standing bag C.Y.B.R Sanubari.'),
                        ]),
                        Grid::make(2)->schema([
                            TextInput::make('default_ratio')
                                ->label('Rasio Biji A Default (%)')
                                ->numeric()
                                ->minValue(10)
                                ->maxValue(90)
                                ->step(10)
                                ->default(70)
                                ->helperText('Contoh: 70 berarti default rasio adalah 70% Biji A dan 30% Biji B.'),
                            TextInput::make('possible_notes_title')
                                ->label('Label Tasting Notes')
                                ->default('Possible Notes:')
                                ->required(),
                        ]),
                    ]),

                Section::make('Daftar Biji Kopi BYOB & Pengaturan Harga per 10 Gram')
                    ->description('Kelola varietas kopi yang tersedia untuk diracik pelanggan, lengkap dengan asal daerah, proses, catatan rasa, dan tarif per 10 gram.')
                    ->icon(Heroicon::Beaker)
                    ->collapsible()
                    ->schema([
                        Repeater::make('byob_beans')
                            ->label('Koleksi Kopi Racik')
                            ->schema([
                                Grid::make(12)->schema([
                                    Select::make('product_id')
                                        ->label('Tautkan Produk (Opsional)')
                                        ->options(fn () => Product::active()
                                            ->where('slug', '!=', 'byob')
                                            ->pluck('name', 'id')
                                            ->toArray())
                                        ->searchable()
                                        ->columnSpan(4)
                                        ->helperText('Otomatis menyinkronkan nama & harga ke katalog toko.'),

                                    TextInput::make('name')
                                        ->label('Nama Biji Kopi')
                                        ->placeholder('Contoh: Arabika Kawi Honey')
                                        ->required()
                                        ->columnSpan(5),

                                    Toggle::make('is_active')
                                        ->label('Tampil di Studio')
                                        ->default(true)
                                        ->inline(false)
                                        ->columnSpan(3),
                                ]),

                                Grid::make(12)->schema([
                                    TextInput::make('origin')
                                        ->label('Asal Daerah (Origin)')
                                        ->placeholder('Contoh: Kawi, Malang atau Hambella, Guji')
                                        ->required()
                                        ->columnSpan(4),

                                    TextInput::make('process')
                                        ->label('Proses Pasca-Panen')
                                        ->placeholder('Contoh: Honey Process, Washed')
                                        ->columnSpan(4),

                                    TextInput::make('price_per_10g')
                                        ->label('Harga per 10 Gram (Rp)')
                                        ->numeric()
                                        ->prefix('Rp')
                                        ->placeholder('3500')
                                        ->required()
                                        ->columnSpan(4)
                                        ->helperText('Tarif dasar 10 gram untuk kalkulasi rasio otomatis.'),
                                ]),

                                TextInput::make('tasting_notes')
                                    ->label('Catatan Rasa / Tasting Notes (Pisahkan koma)')
                                    ->placeholder('Floral, Lime, Apple Sweetness, Brown Sugar')
                                    ->helperText('Akan digabungkan secara dinamis pada blok "Possible Notes:".'),
                            ])
                            ->itemLabel(fn (array $state): ?string => ($state['name'] ?? 'Biji Kopi') . ' (' . ($state['origin'] ?? '-') . ') — Rp ' . number_format($state['price_per_10g'] ?? 0, 0, ',', '.') . '/10g')
                            ->addActionLabel('Tambah Biji Kopi Baru')
                            ->reorderable()
                            ->collapsible()
                            ->cloneable()
                            ->columnSpanFull(),
                    ]),

                Section::make('Pilihan Ukuran Kemasan & Diskon')
                    ->description('Kelola ukuran standing pouch / kemasan yang bisa dipilih pelanggan (misal: 200g, 500g, 1 kg) lengkap dengan potongan diskon persen (%) atau nominal rupiah (Rp).')
                    ->icon(Heroicon::ArchiveBox)
                    ->collapsible()
                    ->schema([
                        Repeater::make('byob_variants')
                            ->label('Ukuran Kemasan & Diskon')
                            ->schema([
                                Grid::make(12)->schema([
                                    TextInput::make('label')
                                        ->label('Label Ukuran')
                                        ->placeholder('200g')
                                        ->required()
                                        ->columnSpan(3),

                                    TextInput::make('weight_grams')
                                        ->label('Berat Gramasi (gr)')
                                        ->numeric()
                                        ->placeholder('200')
                                        ->required()
                                        ->columnSpan(2)
                                        ->helperText('Gramasi murni kalkulasi tarif.'),

                                    Select::make('discount_type')
                                        ->label('Tipe Diskon')
                                        ->options([
                                            'percentage' => 'Persen (%)',
                                            'fixed' => 'Nominal (Rp)',
                                        ])
                                        ->default('percentage')
                                        ->columnSpan(2),

                                    TextInput::make('discount_value')
                                        ->label('Nilai Diskon')
                                        ->numeric()
                                        ->default(0)
                                        ->placeholder('0')
                                        ->helperText('Contoh: 10 untuk 10%, atau 15000 untuk potongan Rp 15.000.')
                                        ->columnSpan(3),

                                    Toggle::make('is_default')
                                        ->label('Default')
                                        ->default(false)
                                        ->inline(false)
                                        ->columnSpan(2),
                                ]),
                            ])
                            ->itemLabel(function (array $state): ?string {
                                $label = ($state['label'] ?? 'Ukuran') . ' (' . ($state['weight_grams'] ?? 0) . ' gram)';
                                $val = (float) ($state['discount_value'] ?? ($state['discount_percentage'] ?? 0));
                                if ($val > 0) {
                                    $type = $state['discount_type'] ?? 'percentage';
                                    $discountLabel = $type === 'fixed'
                                        ? 'Potongan Rp ' . number_format($val, 0, ',', '.')
                                        : 'Diskon ' . $val . '%';
                                    $label .= ' — ' . $discountLabel;
                                }
                                return $label;
                            })
                            ->addActionLabel('Tambah Ukuran Kemasan Baru')
                            ->reorderable()
                            ->columnSpanFull(),
                    ]),

                Section::make('Pilihan Tingkat Kehalusan Gilingan (Grind Size)')
                    ->description('Kelola opsi grind size yang bisa dipilih pelanggan sesuai metode seduh mereka.')
                    ->icon(Heroicon::Sparkles)
                    ->collapsible()
                    ->schema([
                        Repeater::make('byob_grind_options')
                            ->label('Daftar Pilihan Gilingan')
                            ->schema([
                                TextInput::make('name')
                                    ->label('Teks Pilihan Gilingan')
                                    ->placeholder('Contoh: Whole Bean (Biji Utuh)')
                                    ->required(),
                            ])
                            ->addActionLabel('Tambah Pilihan Gilingan')
                            ->reorderable()
                            ->columnSpanFull(),
                    ]),
            ]);
    }

    public function save(): void
    {
        $data = $this->form->getState();

        // Ensure repeater lists are sequential arrays so admin sort order is strictly preserved
        if (!empty($data['byob_variants']) && is_array($data['byob_variants'])) {
            $data['byob_variants'] = array_values($data['byob_variants']);
        }
        if (!empty($data['byob_beans']) && is_array($data['byob_beans'])) {
            $data['byob_beans'] = array_values($data['byob_beans']);
        }
        if (!empty($data['byob_grind_options']) && is_array($data['byob_grind_options'])) {
            $data['byob_grind_options'] = array_values($data['byob_grind_options']);
        }

        // Save byob_settings to database
        Setting::set('byob_settings', $data);

        // Sync packaging variants to the base BYOB product in database
        $byobProduct = Product::firstOrCreate(
            ['slug' => 'byob'],
            [
                'name' => $data['hero_title'] ?? 'C.Y.B.R - Custom Your Blend Ratio',
                'series' => 'custom-blend',
                'tagline' => 'Racik profil sangrai dan paduan biji kopi favorit Anda sendiri',
                'description' => $data['hero_description'] ?? 'Layanan racik blend kustom Sanubari Roastery...',
                'min_price' => 65000,
                'max_price' => 275000,
                'is_featured' => true,
                'status' => 'published',
                'released_at' => now(),
            ]
        );

        if (!empty($data['byob_variants']) && is_array($data['byob_variants'])) {
            $updatedWeights = [];
            foreach ($data['byob_variants'] as $v) {
                $weight = (int) ($v['weight_grams'] ?? 200);
                $updatedWeights[] = $weight;

                ProductVariant::updateOrCreate(
                    [
                        'product_id' => $byobProduct->id,
                        'weight_grams' => $weight,
                    ],
                    [
                        'label' => $v['label'] ?? ($weight . 'g'),
                        'price' => 0,
                        'sku' => 'BYOB-' . $weight,
                        'stock_status' => 'in_stock',
                    ]
                );
            }

            // Clean up removed variants
            ProductVariant::where('product_id', $byobProduct->id)
                ->whereNotIn('weight_grams', $updatedWeights)
                ->delete();
        }

        // Sync price_per_10g to linked catalog products if selected
        if (!empty($data['byob_beans']) && is_array($data['byob_beans'])) {
            foreach ($data['byob_beans'] as $bean) {
                if (!empty($bean['product_id']) && !empty($bean['price_per_10g'])) {
                    Product::where('id', $bean['product_id'])->update([
                        'price_per_10g' => (float) $bean['price_per_10g'],
                    ]);
                }
            }
        }

        Cache::forget('sanubari_settings');
        Cache::forget('byob_settings');

        Notification::make()
            ->title('Pengaturan Studio BYOB Berhasil Disimpan!')
            ->body('Seluruh elemen halaman, koleksi biji kopi, tarif per 10 gram, kemasan, dan pilihan gilingan telah diperbarui secara langsung.')
            ->success()
            ->send();
    }

    protected function getFormActions(): array
    {
        return [
            Action::make('save')
                ->label('Simpan Pengaturan BYOB')
                ->submit('save'),
        ];
    }
}

