<?php

namespace App\Filament\Pages\HalamanAwal;

use App\Models\Setting;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
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

class ManageCategoryMenu extends Page
{
    protected static string|BackedEnum|null $navigationIcon = Heroicon::Squares2x2;

    protected static string|\UnitEnum|null $navigationGroup = 'Halaman Awal';

    protected static ?string $navigationLabel = 'Menu Kategori';

    protected static ?string $title = 'Pengaturan 7 Menu Kategori & Pintasan Beranda';

    protected static ?int $navigationSort = 2;

    /**
     * @var array<string, mixed> | null
     */
    public ?array $data = [];

    public function mount(): void
    {
        $settings = Setting::all()->pluck('value', 'key')->toArray();

        $defaultCategoryMenuItems = [
            [
                'label' => 'Filter Beans',
                'visual_type' => 'icon',
                'icon' => 'lucide-droplet',
                'image' => null,
                'link_type' => 'preset',
                'preset_url' => '/shop?category=filter-beans',
                'custom_url' => null,
                'badge' => null,
            ],
            [
                'label' => 'Espresso Beans',
                'visual_type' => 'icon',
                'icon' => 'lucide-flame',
                'image' => null,
                'link_type' => 'preset',
                'preset_url' => '/shop?category=espresso-beans',
                'custom_url' => null,
                'badge' => null,
            ],
            [
                'label' => 'Koleksi Kawi',
                'visual_type' => 'icon',
                'icon' => 'lucide-mountain',
                'image' => null,
                'link_type' => 'preset',
                'preset_url' => '/shop?series=kawi',
                'custom_url' => null,
                'badge' => null,
            ],
            [
                'label' => 'C.Y.B.R',
                'visual_type' => 'icon',
                'icon' => 'lucide-sliders-horizontal',
                'image' => null,
                'link_type' => 'preset',
                'preset_url' => '/cybr',
                'custom_url' => null,
                'badge' => 'Baru',
            ],
            [
                'label' => 'Panduan Seduh',
                'visual_type' => 'icon',
                'icon' => 'lucide-book-open',
                'image' => null,
                'link_type' => 'preset',
                'preset_url' => '/panduan-seduh',
                'custom_url' => null,
                'badge' => null,
            ],
            [
                'label' => 'Grosir B2B',
                'visual_type' => 'icon',
                'icon' => 'lucide-truck',
                'image' => null,
                'link_type' => 'preset',
                'preset_url' => '/wholesale',
                'custom_url' => null,
                'badge' => null,
            ],
            [
                'label' => 'Showroom',
                'visual_type' => 'icon',
                'icon' => 'lucide-map-pin',
                'image' => null,
                'link_type' => 'preset',
                'preset_url' => '/kunjungi',
                'custom_url' => null,
                'badge' => null,
            ],
        ];

        $existingItems = $settings['home_category_menu_items'] ?? null;
        if (! empty($existingItems) && is_array($existingItems)) {
            foreach ($existingItems as &$existingItem) {
                if (! empty($existingItem['icon']) && ! str_contains($existingItem['icon'], '-')) {
                    $existingItem['icon'] = 'lucide-' . $existingItem['icon'];
                }
            }
            unset($existingItem);
        }

        $this->form->fill([
            'home_category_menu_items' => ! empty($existingItems) ? $existingItems : $defaultCategoryMenuItems,
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
                Section::make('Tombol Menu Kategori Beranda (7 Pilihan Utama)')
                    ->description('Atur tepat 7 tombol lingkaran yang tampil di bawah banner hero beranda. Tentukan ikon atau upload gambar, nama label, tautan tujuan, dan teks badge aksen (kosongkan jika tanpa badge). Anda juga dapat mengubah urutan tombol dengan cara menggeser (drag & drop).')
                    ->schema([
                        Repeater::make('home_category_menu_items')
                            ->label('Daftar Tombol Menu & Pintasan')
                            ->itemLabel(fn (array $state): ?string => ($state['label'] ?? 'Tombol Menu') . (! empty($state['badge']) ? " [Badge: {$state['badge']}]" : ''))
                            ->collapsible()
                            ->collapseAllAction(fn ($action) => $action->hidden())
                            ->expandAllAction(fn ($action) => $action->hidden())
                            ->reorderable()
                            ->cloneable()
                            ->maxItems(8)
                            ->addActionLabel('Tambah Tombol Menu')
                            ->schema([
                                Grid::make(2)->schema([
                                    TextInput::make('label')
                                        ->label('Nama Label')
                                        ->placeholder('Contoh: Filter Beans')
                                        ->required(),

                                    TextInput::make('badge')
                                        ->label('Teks Badge Aksen (Opsional)')
                                        ->placeholder('Contoh: Baru, Promo, B2B')
                                        ->helperText('Kosongkan jika tidak ingin menampilkan badge aksen pada tombol ini.'),
                                ]),

                                Grid::make(2)->schema([
                                    Select::make('visual_type')
                                        ->label('Tipe Tampilan')
                                        ->options([
                                            'icon' => 'Ikon Vektor (Rekomendasi)',
                                            'image' => 'Upload Gambar / Logo Sendiri',
                                        ])
                                        ->default('icon')
                                        ->live(),

                                    \Wallacemartinss\FilamentIconPicker\Forms\Components\IconPickerField::make('icon')
                                        ->label('Pilih Ikon Visual (Ultimate Icon Picker)')
                                        ->visible(fn ($get) => ($get('visual_type') ?? 'icon') === 'icon')
                                        ->allowedSets(['lucide', 'heroicons'])
                                        ->searchable()
                                        ->showSetFilter(true)
                                        ->modalSize('4xl')
                                        ->placeholder('Klik untuk memilih ikon visual...')
                                        ->default('lucide-coffee'),

                                    FileUpload::make('image')
                                        ->label('Upload Gambar Ikon')
                                        ->visible(fn ($get) => ($get('visual_type') ?? 'icon') === 'image')
                                        ->disk('public')
                                        ->directory('category-icons')
                                        ->image()
                                        ->imageResizeMode('cover')
                                        ->imageCropAspectRatio('1:1')
                                        ->maxSize(2048)
                                        ->helperText('Format PNG/JPG transparan persegi 1:1, maks 2MB.'),
                                ]),

                                Grid::make(2)->schema([
                                    Select::make('link_type')
                                        ->label('Tujuan Tautan')
                                        ->options([
                                            'preset' => 'Pilih Halaman Sanubari',
                                            'custom' => 'Tautan Kustom Sendiri',
                                        ])
                                        ->default('preset')
                                        ->live(),

                                    Select::make('preset_url')
                                        ->label('Pilih Halaman Target')
                                        ->visible(fn ($get) => ($get('link_type') ?? 'preset') === 'preset')
                                        ->searchable()
                                        ->options([
                                            '/shop?category=filter-beans' => 'Katalog: Filter Beans',
                                            '/shop?category=espresso-beans' => 'Katalog: Espresso Beans',
                                            '/shop?series=kawi' => 'Katalog: Koleksi Gunung Kawi',
                                            '/shop?series=co-ferment' => 'Katalog: CO-Ferment Eksperimental',
                                            '/cybr' => 'Studio C.Y.B.R: Racik Blend Kopi Mandiri (/cybr)',
                                            '/shop/cybr' => 'Studio C.Y.B.R (/shop/cybr)',
                                            '/shop/byob' => 'Studio C.Y.B.R (Legacy /shop/byob)',
                                            '/panduan-seduh' => 'Panduan Seduh: Resep & Teknik',
                                            '/wholesale' => 'Grosir B2B: Kemitraan & Pasokan Kafe',
                                            '/jasa-roasting' => 'Jasa Roasting: Layanan Sangrai Kopi (/jasa-roasting)',
                                            '/training-barista' => 'Training Barista: Kursus & Sertifikasi (/training-barista)',
                                            '/kunjungi' => 'Showroom: Kunjungan & Slow Bar Malang',
                                            '/shop' => 'Semua Katalog Kopi',
                                            '/tentang' => 'Tentang Sanubari Roastery (/tentang)',
                                            '/tentang-kami' => 'Tentang Sanubari Roastery (Legacy)',
                                        ])
                                        ->default('/shop'),

                                    TextInput::make('custom_url')
                                        ->label('Ketik Alamat URL Tujuan')
                                        ->visible(fn ($get) => ($get('link_type') ?? 'preset') === 'custom')
                                        ->placeholder('/shop?series=... atau https://...')
                                        ->helperText('Bisa berupa path internal (mis: /shop) atau tautan luar (mis: https://wa.me/...)'),
                                ]),
                            ]),
                    ]),
            ]);
    }

    public function save(): void
    {
        $data = $this->form->getState();
        $items = $data['home_category_menu_items'] ?? [];

        $savedItems = [];
        foreach ($items as $index => $item) {
            $imagePath = null;
            if (! empty($item['image'])) {
                $imagePath = is_array($item['image']) ? array_values($item['image'])[0] : $item['image'];
            }

            $resolvedUrl = ($item['link_type'] ?? 'preset') === 'preset'
                ? ($item['preset_url'] ?? '/shop')
                : ($item['custom_url'] ?? '/shop');

            $badge = ! empty($item['badge']) ? trim($item['badge']) : null;

            $savedItems[] = [
                'id' => 'cat-item-' . ($index + 1),
                'label' => $item['label'] ?? ('Pilihan ' . ($index + 1)),
                'visual_type' => $item['visual_type'] ?? 'icon',
                'icon' => $item['icon'] ?? 'lucide-coffee',
                'image' => $imagePath,
                'link_type' => $item['link_type'] ?? 'preset',
                'preset_url' => $item['preset_url'] ?? null,
                'custom_url' => $item['custom_url'] ?? null,
                'url' => $resolvedUrl,
                'badge' => $badge,
            ];
        }

        Setting::set('home_category_menu_items', $savedItems);
        Cache::forget('sanubari_settings');

        Notification::make()
            ->title('Menu Kategori Berhasil Disimpan!')
            ->body('Daftar 7 pilihan menu beranda telah diperbarui secara langsung.')
            ->success()
            ->send();
    }

    protected function getFormActions(): array
    {
        return [
            Action::make('save')
                ->label('Simpan Menu Kategori')
                ->submit('save'),
        ];
    }
}
