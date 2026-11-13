<?php

namespace App\Filament\Pages;

use App\Models\Setting;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Hidden;
use Filament\Forms\Components\Repeater;
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
use Illuminate\Support\Str;

class ManageDesktopMegaMenu extends Page
{
    protected static string|BackedEnum|null $navigationIcon = Heroicon::Squares2x2;

    protected static string|\UnitEnum|null $navigationGroup = 'Navigasi';

    protected static ?string $navigationLabel = 'Kategori Navigasi (Desktop, Tablet & Mobile)';

    protected static ?string $title = 'Pengaturan Kategori Navigasi (Desktop, Tablet & Mobile)';

    protected static ?int $navigationSort = 2;

    /**
     * @var array<string, mixed> | null
     */
    public ?array $data = [];

    public static function getDefaultCategories(): array
    {
        return [
            [
                'id' => 'coffee',
                'name' => 'Coffee',
                'slug' => 'coffee',
                'url' => '/shop?category=coffee',
                'is_active' => true,
                'subcategories' => [
                    ['id' => 'coffee-beans', 'name' => 'Coffee Beans', 'url' => '/shop?category=filter-beans', 'icon' => 'coffee-beans', 'is_active' => true],
                    ['id' => 'capsules', 'name' => 'Capsules', 'url' => '/shop?category=capsule', 'icon' => 'coffee-capsule', 'is_active' => true],
                    ['id' => 'drip-coffee', 'name' => 'Drip Coffee', 'url' => '/shop?category=drip-bag', 'icon' => 'drip-bag', 'is_active' => true],
                    ['id' => 'cold-brew', 'name' => 'Cold Brew', 'url' => '/shop?category=cold-brew', 'icon' => 'cold-brew', 'is_active' => true],
                    ['id' => 'ready-to-drink', 'name' => 'Ready to Drink', 'url' => '/shop?category=cold-brew', 'icon' => 'cold-brew', 'is_active' => true],
                    ['id' => 'kopi-luwak', 'name' => 'Kopi Luwak', 'url' => '/shop?category=co-ferment', 'icon' => 'specialty-ferment', 'is_active' => true],
                    ['id' => 'green-bean', 'name' => 'Green Bean', 'url' => '/shop?category=green-bean', 'icon' => 'green-bean', 'is_active' => true],
                    ['id' => 'specialty-microlot', 'name' => 'Specialty Micro-lot', 'url' => '/shop?category=experimental', 'icon' => 'coffee-beans', 'is_active' => true],
                ],
            ],
            [
                'id' => 'tea-beverages',
                'name' => 'Tea & Beverages',
                'slug' => 'tea-beverages',
                'url' => '/shop?category=tea',
                'is_active' => true,
                'subcategories' => [
                    ['id' => 'artisan-tea', 'name' => 'Specialty Artisan Tea', 'url' => '/shop?category=tea', 'icon' => 'tea', 'is_active' => true],
                    ['id' => 'matcha-green-tea', 'name' => 'Matcha & Green Tea', 'url' => '/shop?category=powder', 'icon' => 'powder', 'is_active' => true],
                    ['id' => 'cascara-tea', 'name' => 'Cascara Coffee Cherry Tea', 'url' => '/shop?category=tea', 'icon' => 'tea', 'is_active' => true],
                    ['id' => 'artisan-chocolate', 'name' => 'Artisan Chocolate & Cocoa', 'url' => '/shop?category=powder', 'icon' => 'powder', 'is_active' => true],
                    ['id' => 'chai-spiced', 'name' => 'Chai & Spiced Tea', 'url' => '/shop?category=tea', 'icon' => 'tea', 'is_active' => true],
                    ['id' => 'herbal-tisane', 'name' => 'Herbal & Floral Tisane', 'url' => '/shop?category=tea', 'icon' => 'tea', 'is_active' => true],
                    ['id' => 'fruit-infusions', 'name' => 'Fruit Infusions', 'url' => '/shop?category=tea', 'icon' => 'tea', 'is_active' => true],
                    ['id' => 'kombucha-brew', 'name' => 'Kombucha Culture & Brew', 'url' => '/shop?category=cold-brew', 'icon' => 'cold-brew', 'is_active' => true],
                ],
            ],
            [
                'id' => 'grinders',
                'name' => 'Grinders',
                'slug' => 'grinders',
                'url' => '/shop?category=grinders',
                'is_active' => true,
                'subcategories' => [
                    ['id' => 'manual-grinder', 'name' => 'Manual Hand Grinder', 'url' => '/shop?category=hand-grinder', 'icon' => 'manual-grinder', 'is_active' => true],
                    ['id' => 'flat-burr-grinder', 'name' => 'Electric Flat Burr Grinder', 'url' => '/shop?category=electric-grinder', 'icon' => 'electric-grinder', 'is_active' => true],
                    ['id' => 'conical-grinder', 'name' => 'Conical Burr Grinder', 'url' => '/shop?category=conical-grinder', 'icon' => 'electric-grinder', 'is_active' => true],
                    ['id' => 'commercial-grinder', 'name' => 'Commercial Espresso Grinder', 'url' => '/shop?category=espresso-grinder', 'icon' => 'electric-grinder', 'is_active' => true],
                    ['id' => 'single-dose', 'name' => 'Single Dose Grinder', 'url' => '/shop?category=electric-grinder', 'icon' => 'electric-grinder', 'is_active' => true],
                    ['id' => 'burr-replacement', 'name' => 'Burr Replacement & Upgrade', 'url' => '/shop?category=grinder-tools', 'icon' => 'barista-tools', 'is_active' => true],
                    ['id' => 'grinder-cleaner', 'name' => 'Grinder Cleaner & Brush', 'url' => '/shop?category=grinder-tools', 'icon' => 'barista-tools', 'is_active' => true],
                    ['id' => 'bellows-hoppers', 'name' => 'Anti-Popcorn Bellows & Hoppers', 'url' => '/shop?category=grinder-tools', 'icon' => 'barista-tools', 'is_active' => true],
                ],
            ],
            [
                'id' => 'coffee-machines',
                'name' => 'Coffee Machines',
                'slug' => 'coffee-machines',
                'url' => '/shop?category=espresso-machines',
                'is_active' => true,
                'subcategories' => [
                    ['id' => 'home-espresso', 'name' => 'Home Espresso Machine', 'url' => '/shop?category=home-espresso', 'icon' => 'espresso-home', 'is_active' => true],
                    ['id' => 'commercial-espresso', 'name' => 'Commercial Espresso Machine', 'url' => '/shop?category=commercial-espresso', 'icon' => 'espresso-commercial', 'is_active' => true],
                    ['id' => 'lever-espresso', 'name' => 'Lever Espresso Machine', 'url' => '/shop?category=home-espresso', 'icon' => 'espresso-home', 'is_active' => true],
                    ['id' => 'automatic-bean-to-cup', 'name' => 'Automatic Bean to Cup', 'url' => '/shop?category=home-espresso', 'icon' => 'espresso-commercial', 'is_active' => true],
                    ['id' => 'capsule-machine', 'name' => 'Capsule Espresso Machine', 'url' => '/shop?category=home-espresso', 'icon' => 'espresso-home', 'is_active' => true],
                    ['id' => 'cold-drip-tower', 'name' => 'Cold Brew Drip Tower', 'url' => '/shop?category=cold-brew', 'icon' => 'server', 'is_active' => true],
                    ['id' => 'milk-steamer', 'name' => 'Dedicated Milk Steamer Unit', 'url' => '/shop?category=espresso-machines', 'icon' => 'espresso-home', 'is_active' => true],
                    ['id' => 'machine-care', 'name' => 'Machine Care & Descaler', 'url' => '/shop?category=barista-tools', 'icon' => 'barista-tools', 'is_active' => true],
                ],
            ],
            [
                'id' => 'manual-brewers',
                'name' => 'Manual Brewers',
                'slug' => 'manual-brewers',
                'url' => '/shop?category=manual-brew',
                'is_active' => true,
                'subcategories' => [
                    ['id' => 'dripper-v60', 'name' => 'Dripper & Pour Over (V60)', 'url' => '/shop?category=dripper', 'icon' => 'dripper', 'is_active' => true],
                    ['id' => 'french-press', 'name' => 'French Press & Immersion', 'url' => '/shop?category=server', 'icon' => 'server', 'is_active' => true],
                    ['id' => 'aeropress', 'name' => 'AeroPress & Accessories', 'url' => '/shop?category=manual-brew', 'icon' => 'dripper', 'is_active' => true],
                    ['id' => 'syphon-brewer', 'name' => 'Syphon & Vacuum Brewer', 'url' => '/shop?category=manual-brew', 'icon' => 'specialty-ferment', 'is_active' => true],
                    ['id' => 'chemex-woodneck', 'name' => 'Chemex & Woodneck Carafe', 'url' => '/shop?category=server', 'icon' => 'server', 'is_active' => true],
                    ['id' => 'moka-pot', 'name' => 'Moka Pot & Stovetop Espresso', 'url' => '/shop?category=manual-brew', 'icon' => 'espresso-home', 'is_active' => true],
                    ['id' => 'cold-brew-maker', 'name' => 'Cold Brew Bottle & Maker', 'url' => '/shop?category=cold-brew', 'icon' => 'cold-brew', 'is_active' => true],
                    ['id' => 'vietnamese-phin', 'name' => 'Vietnamese Coffee Phin Drip', 'url' => '/shop?category=dripper', 'icon' => 'dripper', 'is_active' => true],
                ],
            ],
            [
                'id' => 'coffee-tools',
                'name' => 'Coffee Tools',
                'slug' => 'coffee-tools',
                'url' => '/shop?category=coffee-tools',
                'is_active' => true,
                'subcategories' => [
                    ['id' => 'digital-scale', 'name' => 'Digital Coffee Scale & Timer', 'url' => '/shop?category=scale', 'icon' => 'scale', 'is_active' => true],
                    ['id' => 'gooseneck-kettle', 'name' => 'Variable Gooseneck Kettle', 'url' => '/shop?category=kettle', 'icon' => 'kettle', 'is_active' => true],
                    ['id' => 'coffee-server', 'name' => 'Coffee Glass Server & Carafe', 'url' => '/shop?category=server', 'icon' => 'server', 'is_active' => true],
                    ['id' => 'paper-filter-cone', 'name' => 'Paper & Cloth Coffee Filters', 'url' => '/shop?category=paper-filter', 'icon' => 'paper-filter', 'is_active' => true],
                    ['id' => 'cupping-gear', 'name' => 'SCA Cupping Bowls & Spoons', 'url' => '/shop?category=barista-tools', 'icon' => 'barista-tools', 'is_active' => true],
                    ['id' => 'coffee-canister', 'name' => 'Vacuum Storage Coffee Canister', 'url' => '/shop?category=tumbler', 'icon' => 'tumbler', 'is_active' => true],
                    ['id' => 'thermometer-tds', 'name' => 'Digital Thermometer & TDS Meter', 'url' => '/shop?category=scale', 'icon' => 'scale', 'is_active' => true],
                    ['id' => 'flow-monitor', 'name' => 'Flow Rate Monitor & Stand', 'url' => '/shop?category=scale', 'icon' => 'scale', 'is_active' => true],
                ],
            ],
            [
                'id' => 'barista-tools',
                'name' => 'Barista Tools',
                'slug' => 'barista-tools',
                'url' => '/shop?category=barista-tools',
                'is_active' => true,
                'subcategories' => [
                    ['id' => 'tamper-palm', 'name' => 'Precision Tamper & Palm Tamper', 'url' => '/shop?category=barista-tools', 'icon' => 'barista-tools', 'is_active' => true],
                    ['id' => 'coffee-distributor', 'name' => 'Distribution & Leveler Tool', 'url' => '/shop?category=barista-tools', 'icon' => 'barista-tools', 'is_active' => true],
                    ['id' => 'wdt-needle', 'name' => 'WDT Needle Distribution Tool', 'url' => '/shop?category=barista-tools', 'icon' => 'barista-tools', 'is_active' => true],
                    ['id' => 'bottomless-portafilter', 'name' => 'Bottomless Naked Portafilter', 'url' => '/shop?category=barista-tools', 'icon' => 'barista-tools', 'is_active' => true],
                    ['id' => 'milk-pitcher', 'name' => 'Latte Art Milk Pitcher / Jug', 'url' => '/shop?category=server', 'icon' => 'server', 'is_active' => true],
                    ['id' => 'tamping-mat', 'name' => 'Silicone Tamping Mat & Station', 'url' => '/shop?category=barista-tools', 'icon' => 'barista-tools', 'is_active' => true],
                    ['id' => 'knockbox-tube', 'name' => 'Espresso Knockbox & Tube', 'url' => '/shop?category=barista-tools', 'icon' => 'barista-tools', 'is_active' => true],
                    ['id' => 'puck-screen', 'name' => 'Precision Puck Screen Mesh', 'url' => '/shop?category=paper-filter', 'icon' => 'paper-filter', 'is_active' => true],
                ],
            ],
            [
                'id' => 'syrups-powders',
                'name' => 'Syrups & Powders',
                'slug' => 'syrups-powders',
                'url' => '/shop?category=ingredients',
                'is_active' => true,
                'subcategories' => [
                    ['id' => 'gourmet-syrups', 'name' => 'Artisan Gourmet Coffee Syrups', 'url' => '/shop?category=syrups', 'icon' => 'syrups', 'is_active' => true],
                    ['id' => 'sauce-drizzle', 'name' => 'Caramel & Dark Chocolate Sauce', 'url' => '/shop?category=syrups', 'icon' => 'syrups', 'is_active' => true],
                    ['id' => 'frappe-base', 'name' => 'Frappe & Non-Dairy Creamer', 'url' => '/shop?category=powder', 'icon' => 'powder', 'is_active' => true],
                    ['id' => 'flavored-powders', 'name' => 'Taro, Red Velvet & Chai Powder', 'url' => '/shop?category=powder', 'icon' => 'powder', 'is_active' => true],
                    ['id' => 'liquid-cane-sugar', 'name' => 'Liquid Cane Sugar & Sweetener', 'url' => '/shop?category=syrups', 'icon' => 'syrups', 'is_active' => true],
                    ['id' => 'plant-based-dairy', 'name' => 'Oat Milk & Barista Almond Dairy', 'url' => '/shop?category=dairy', 'icon' => 'milk', 'is_active' => true],
                    ['id' => 'fresh-milk', 'name' => 'Fresh Milk & Heavy Cream', 'url' => '/shop?category=dairy', 'icon' => 'milk', 'is_active' => true],
                    ['id' => 'cocktail-purees', 'name' => 'Mocktail & Fruit Purees', 'url' => '/shop?category=syrups', 'icon' => 'syrups', 'is_active' => true],
                ],
            ],
            [
                'id' => 'roastery-supplies',
                'name' => 'Roastery Supplies',
                'slug' => 'roastery-supplies',
                'url' => '/shop?category=roastery-supplies',
                'is_active' => true,
                'subcategories' => [
                    ['id' => 'green-coffee-sacks', 'name' => 'Jute & GrainPro Coffee Sacks', 'url' => '/shop?category=green-bean', 'icon' => 'green-bean', 'is_active' => true],
                    ['id' => 'degassing-bags', 'name' => 'Degassing Valve Coffee Bags', 'url' => '/shop?category=merchandise', 'icon' => 'gift', 'is_active' => true],
                    ['id' => 'kraft-pouch', 'name' => 'Eco Kraft Pouch & Tin Tie', 'url' => '/shop?category=merchandise', 'icon' => 'gift', 'is_active' => true],
                    ['id' => 'nitrogen-flusher', 'name' => 'Nitrogen Flusher & Packaging', 'url' => '/shop?category=barista-tools', 'icon' => 'barista-tools', 'is_active' => true],
                    ['id' => 'sample-roaster', 'name' => 'Mini Electric Sample Roaster', 'url' => '/shop?category=espresso-machines', 'icon' => 'espresso-commercial', 'is_active' => true],
                    ['id' => 'cupping-trays', 'name' => 'Green Bean Sample Cupping Trays', 'url' => '/shop?category=barista-tools', 'icon' => 'barista-tools', 'is_active' => true],
                    ['id' => 'moisture-meter', 'name' => 'Coffee Moisture & Density Meter', 'url' => '/shop?category=scale', 'icon' => 'scale', 'is_active' => true],
                    ['id' => 'bag-sealer', 'name' => 'Continuous Band Heat Sealer', 'url' => '/shop?category=barista-tools', 'icon' => 'barista-tools', 'is_active' => true],
                ],
            ],
        ];
    }

    public static function getIconOptions(): array
    {
        return [
            'coffee-beans' => 'Biji Kopi (Coffee Beans)',
            'coffee-capsule' => 'Kapsul Kopi (Capsule)',
            'drip-bag' => 'Drip Bag / Filter Kopi',
            'cold-brew' => 'Cold Brew / Botol Kopi',
            'green-bean' => 'Biji Kopi Mentah (Green Bean)',
            'specialty-ferment' => 'Labu Fermentasi / Eksperimental',
            'dripper' => 'Dripper Pour Over / V60',
            'paper-filter' => 'Kertas Filter / Puck Screen',
            'kettle' => 'Ketel Gooseneck (Kettle)',
            'manual-grinder' => 'Gilingan Manual (Hand Grinder)',
            'scale' => 'Timbangan Digital (Scale / Timer)',
            'server' => 'Server Kaca / Milk Pitcher',
            'espresso-home' => 'Mesin Espresso Rumahan',
            'espresso-commercial' => 'Mesin Espresso Komersial',
            'electric-grinder' => 'Grinder Listrik Otomatis',
            'barista-tools' => 'Alat Barista (Tamper / WDT / Knockbox)',
            'syrups' => 'Sirup / Perasa Kopi',
            'powder' => 'Bubuk Minuman (Matcha / Cokelat / Powder)',
            'tea' => 'Teh Artisan / Tisane',
            'milk' => 'Susu Segar / Oat Milk Barista',
            'apparel' => 'Kaos & Pakaian Kopi',
            'apron' => 'Celemek Barista (Apron)',
            'tumbler' => 'Tumbler / Canister Kedap Udara',
            'gift' => 'Gift Set / Kemasan Roastery',
        ];
    }

    public static function getPresetUrlOptions(): array
    {
        return [];
    }

    public function mount(): void
    {
        $existing = Setting::get('desktop_mega_menu_categories');

        $categories = ! empty($existing) && is_array($existing) ? $existing : static::getDefaultCategories();

        foreach ($categories as &$cat) {
            if (! empty($cat['subcategories']) && is_array($cat['subcategories'])) {
                foreach ($cat['subcategories'] as &$sub) {
                    if (empty($sub['visual_type'])) {
                        $sub['visual_type'] = ! empty($sub['image']) ? 'image' : 'icon';
                    }

                    if (! empty($sub['image']) && is_string($sub['image'])) {
                        $sub['image'] = [$sub['image'] => $sub['image']];
                    }

                    $existingUrl = $sub['custom_url'] ?? $sub['url'] ?? $sub['preset_url'] ?? '/shop';
                    $sub['link_type'] = 'custom';
                    $sub['custom_url'] = ! empty($existingUrl) ? $existingUrl : '/shop';
                    $sub['preset_url'] = null;
                    $sub['url'] = $sub['custom_url'];
                }
                unset($sub);
            }
        }
        unset($cat);

        $this->form->fill([
            'desktop_mega_menu_categories' => $categories,
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
                Section::make('Kategori Navigasi Utama & Subkategori (Desktop, Tablet & Mobile)')
                    ->description('Kelola daftar kategori dan subkategori untuk semua perangkat (Desktop, Tablet, dan Mobile) yang tampil pada halaman & laci Kategori.')
                    ->schema([
                        Repeater::make('desktop_mega_menu_categories')
                            ->label('Daftar Kategori Utama Navigasi')
                            ->itemLabel(fn (array $state): ?string => ($state['name'] ?? 'Kategori Utama') . (! empty($state['subcategories']) ? ' (' . count($state['subcategories']) . ' Subkategori)' : ''))
                            ->collapsible()
                            ->collapsed(false)
                            ->reorderable()
                            ->cloneable()
                            ->addActionLabel('Tambah Kategori Utama')
                            ->schema([
                                Grid::make(3)->schema([
                                    TextInput::make('name')
                                        ->label('Nama Kategori Utama')
                                        ->placeholder('Misal: Coffee, Grinders, Tea...')
                                        ->required()
                                        ->live(onBlur: true)
                                        ->afterStateUpdated(function ($state, callable $set, callable $get) {
                                            if (! empty($state)) {
                                                $slug = Str::slug($state);
                                                if (empty($get('slug'))) {
                                                    $set('slug', $slug);
                                                }
                                                if (empty($get('url')) || $get('url') === '/shop') {
                                                    $set('url', '/shop?category=' . $slug);
                                                }
                                            }
                                        }),

                                    TextInput::make('slug')
                                        ->label('Slug / ID Kunci')
                                        ->placeholder('Misal: coffee, grinders')
                                        ->required(),

                                    TextInput::make('url')
                                        ->label('Tautan "Lihat Semua" (URL)')
                                        ->placeholder('Misal: /shop?category=coffee')
                                        ->required(),
                                ]),

                                Grid::make(1)->schema([
                                    Toggle::make('is_active')
                                        ->label('Tampilkan Kategori Ini di Navigasi Website')
                                        ->default(true),
                                ]),

                                Section::make('Subkategori (Panel Kanan - Grid 4 Kolom)')
                                    ->description('Daftar subkategori beserta ilustrasi visual dan tautan tujuan.')
                                    ->schema([
                                        Repeater::make('subcategories')
                                            ->label('Daftar Subkategori')
                                            ->itemLabel(fn (array $state): ?string => $state['name'] ?? 'Subkategori Baru')
                                            ->collapsible()
                                            ->collapsed(true)
                                            ->reorderable()
                                            ->cloneable()
                                            ->addActionLabel('Tambah Subkategori')
                                            ->grid(2)
                                            ->schema([
                                                TextInput::make('name')
                                                    ->label('Nama Subkategori')
                                                    ->placeholder('Misal: Coffee Beans')
                                                    ->required()
                                                    ->live(onBlur: true)
                                                    ->afterStateUpdated(function ($state, callable $set, callable $get) {
                                                        if (! empty($state)) {
                                                            $slug = Str::slug($state);
                                                            if (empty($get('id'))) {
                                                                $set('id', $slug);
                                                            }
                                                            if (empty($get('custom_url')) || $get('custom_url') === '/shop') {
                                                                $set('custom_url', '/shop?category=' . $slug);
                                                            }
                                                        }
                                                    }),

                                                TextInput::make('id')
                                                    ->label('ID Subkategori')
                                                    ->placeholder('Misal: coffee-beans')
                                                    ->required(),

                                                Grid::make(1)->schema([
                                                    TextInput::make('custom_url')
                                                        ->label('Tautan Tujuan (URL)')
                                                        ->placeholder('Misal: /shop atau https://...')
                                                        ->helperText('Bisa berupa URL internal website (/shop) atau tautan eksternal (https://...)')
                                                        ->default('/shop')
                                                        ->required(),

                                                    Hidden::make('url'),
                                                ])->columnSpanFull(),

                                                Select::make('visual_type')
                                                    ->label('Tipe Tampilan Ikon / Gambar')
                                                    ->options([
                                                        'icon' => 'Ikon Ilustrasi Vektor (Bawaan)',
                                                        'image' => 'Upload Gambar / Foto Sendiri',
                                                    ])
                                                    ->default('icon')
                                                    ->live(),

                                                Select::make('icon')
                                                    ->label('Pilih Ikon Ilustrasi Visual')
                                                    ->options(static::getIconOptions())
                                                    ->searchable()
                                                    ->default('coffee-beans')
                                                    ->visible(fn ($get) => ($get('visual_type') ?? 'icon') === 'icon')
                                                    ->required(fn ($get) => ($get('visual_type') ?? 'icon') === 'icon'),

                                                FileUpload::make('image')
                                                    ->label('Upload Gambar Subkategori')
                                                    ->visible(fn ($get) => ($get('visual_type') ?? 'icon') === 'image')
                                                    ->disk('public')
                                                    ->directory('mega-menu/subcategories')
                                                    ->image()
                                                    ->imageResizeMode('cover')
                                                    ->imageCropAspectRatio('1:1')
                                                    ->maxSize(2048)
                                                    ->helperText('Format PNG/JPG/WEBP (persegi 1:1, maks 2MB).')
                                                    ->openable()
                                                    ->downloadable(),

                                                Toggle::make('is_active')
                                                    ->label('Aktif')
                                                    ->default(true),
                                            ]),
                                    ]),
                            ]),
                    ]),
            ]);
    }

    public function resetToDefault(): void
    {
        $defaults = static::getDefaultCategories();

        foreach ($defaults as &$cat) {
            if (! empty($cat['subcategories']) && is_array($cat['subcategories'])) {
                foreach ($cat['subcategories'] as &$sub) {
                    $existingUrl = $sub['url'] ?? '/shop';
                    $sub['link_type'] = 'custom';
                    $sub['preset_url'] = null;
                    $sub['custom_url'] = $existingUrl;
                }
                unset($sub);
            }
        }
        unset($cat);

        $this->form->fill([
            'desktop_mega_menu_categories' => $defaults,
        ]);

        Notification::make()
            ->title('Berhasil Dimuat Ulang')
            ->body('Data kategori default berhasil dimuat kembali ke formulir. Jangan lupa klik "Simpan Perubahan Navigasi".')
            ->info()
            ->send();
    }

    public function save(): void
    {
        $data = $this->form->getState();
        $categories = $data['desktop_mega_menu_categories'] ?? [];

        $savedCategories = [];
        foreach ($categories as $index => $cat) {
            $catId = ! empty($cat['slug']) ? Str::slug($cat['slug']) : ('cat-' . ($index + 1));
            $subcategories = [];

            if (! empty($cat['subcategories']) && is_array($cat['subcategories'])) {
                foreach ($cat['subcategories'] as $sIndex => $sub) {
                    $imagePath = null;
                    if (! empty($sub['image'])) {
                        $imagePath = is_array($sub['image']) ? array_values($sub['image'])[0] : $sub['image'];
                    }

                    $resolvedUrl = $sub['custom_url'] ?? $sub['url'] ?? $sub['preset_url'] ?? '/shop';

                    $subcategories[] = [
                        'id' => ! empty($sub['id']) ? Str::slug($sub['id']) : ('sub-' . ($sIndex + 1)),
                        'name' => trim($sub['name'] ?? ''),
                        'url' => trim($resolvedUrl),
                        'link_type' => 'custom',
                        'preset_url' => null,
                        'custom_url' => trim($resolvedUrl),
                        'visual_type' => $sub['visual_type'] ?? (! empty($imagePath) ? 'image' : 'icon'),
                        'icon' => $sub['icon'] ?? 'coffee-beans',
                        'image' => $imagePath,
                        'is_active' => (bool) ($sub['is_active'] ?? true),
                    ];
                }
            }

            $savedCategories[] = [
                'id' => $catId,
                'name' => trim($cat['name'] ?? ''),
                'slug' => $catId,
                'url' => trim($cat['url'] ?? '/shop'),
                'is_active' => (bool) ($cat['is_active'] ?? true),
                'subcategories' => $subcategories,
            ];
        }

        Setting::set('desktop_mega_menu_categories', $savedCategories);
        Cache::forget('sanubari_settings');

        Notification::make()
            ->title('Kategori Navigasi Berhasil Disimpan!')
            ->body('Daftar kategori navigasi website telah berhasil diperbarui.')
            ->success()
            ->send();
    }

    protected function getFormActions(): array
    {
        return [
            Action::make('save')
                ->label('Simpan Perubahan Navigasi')
                ->submit('save'),
            Action::make('reset')
                ->label('Kembalikan ke Kategori Default')
                ->color('gray')
                ->requiresConfirmation()
                ->modalHeading('Muat Ulang Kategori Default?')
                ->modalDescription('Tindakan ini akan mengembalikan semua kategori dan subkategori ke data bawaan Alat Kopi Malang (Otten Style). Data yang belum disimpan akan digantikan.')
                ->action('resetToDefault'),
        ];
    }
}

