<?php

use App\Filament\Pages\HalamanAwal\ManageCategoryMenu;
use App\Filament\Pages\HalamanAwal\ManageEditorialSection;
use App\Filament\Pages\HalamanAwal\ManageFeaturedMenu;
use App\Filament\Pages\HalamanAwal\ManageFlashSale;
use App\Filament\Pages\HalamanAwal\ManageHeroSlider;
use App\Filament\Pages\HalamanAwal\ManagePartnerCafes;
use App\Filament\Pages\HalamanAwal\ManageRecommendedProducts;
use App\Filament\Pages\HalamanAwal\ManageSanubariPlaces;
use App\Filament\Pages\HalamanAwal\ManageTasteRecommendations;
use App\Filament\Pages\HalamanAwal\ManageVideoStats;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Livewire\Livewire;

test('all 10 halaman awal settings pages can be rendered without errors', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->get('/admin/manage-hero-slider')->assertSuccessful();
    $this->actingAs($user)->get('/admin/manage-category-menu')->assertSuccessful();
    $this->actingAs($user)->get('/admin/manage-recommended-products')->assertSuccessful();
    $this->actingAs($user)->get('/admin/manage-video-stats')->assertSuccessful();
    $this->actingAs($user)->get('/admin/manage-sanubari-places')->assertSuccessful();
    $this->actingAs($user)->get('/admin/manage-featured-menu')->assertSuccessful();
    $this->actingAs($user)->get('/admin/manage-editorial-section')->assertSuccessful();
    $this->actingAs($user)->get('/admin/manage-taste-recommendations')->assertSuccessful();
    $this->actingAs($user)->get('/admin/manage-partner-cafes')->assertSuccessful();
    $this->actingAs($user)->get('/admin/manage-flash-sale')->assertSuccessful();
});

test('all 10 halaman awal livewire components mount properly', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    Livewire::test(ManageHeroSlider::class)->assertSuccessful();
    Livewire::test(ManageCategoryMenu::class)->assertSuccessful();
    Livewire::test(ManageRecommendedProducts::class)->assertSuccessful();
    Livewire::test(ManageVideoStats::class)->assertSuccessful();
    Livewire::test(ManageSanubariPlaces::class)->assertSuccessful();
    Livewire::test(ManageFeaturedMenu::class)->assertSuccessful();
    Livewire::test(ManageEditorialSection::class)->assertSuccessful();
    Livewire::test(ManageTasteRecommendations::class)->assertSuccessful();
    Livewire::test(ManagePartnerCafes::class)->assertSuccessful();
    Livewire::test(ManageFlashSale::class)->assertSuccessful();
});

test('recommendation and video settings reflect on home page', function () {
    Setting::set('home_rec_title', 'Kurasi Kopi Eksklusif');
    Setting::set('home_rec_subtitle', 'Pilihan terbaik barista bulan ini');
    Setting::set('home_stat_1_number', 1600);
    Setting::set('home_stat_1_unit', 'mdpl');
    Cache::forget('sanubari_settings');

    $response = $this->get('/');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('welcome')
        ->where('settings.home_rec_title', 'Kurasi Kopi Eksklusif')
        ->where('settings.home_rec_subtitle', 'Pilihan terbaik barista bulan ini')
        ->where('settings.home_stat_1_number', 1600)
        ->has('recommendedProducts')
    );
});

test('manage category menu saves 7 menu items with icons and badges that reflect on home page', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    Livewire::test(ManageCategoryMenu::class)
        ->assertSuccessful()
        ->set('data.home_category_menu_items', [
            [
                'label' => 'Filter V60',
                'visual_type' => 'icon',
                'icon' => 'lucide-droplet',
                'image' => null,
                'link_type' => 'preset',
                'preset_url' => '/shop?category=filter-beans',
                'badge' => null,
            ],
            [
                'label' => 'BYOB Custom',
                'visual_type' => 'icon',
                'icon' => 'lucide-sliders-horizontal',
                'image' => null,
                'link_type' => 'preset',
                'preset_url' => '/shop/byob',
                'badge' => 'Studio',
            ],
        ])
        ->call('save')
        ->assertHasNoErrors();

    $saved = Setting::get('home_category_menu_items');
    expect($saved)->toBeArray()->toHaveCount(2);
    expect($saved[0]['label'])->toBe('Filter V60');
    expect($saved[0]['badge'])->toBeNull();
    expect($saved[1]['label'])->toBe('BYOB Custom');
    expect($saved[1]['badge'])->toBe('Studio');

    $response = $this->get('/');
    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('welcome')
        ->where('settings.home_category_menu_items.0.label', 'Filter V60')
        ->where('settings.home_category_menu_items.1.badge', 'Studio')
    );
});

test('manage partner cafes saves slides with link urls that reflect on home page', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    Livewire::test(ManagePartnerCafes::class)
        ->assertSuccessful()
        ->set('data.home_partners_title', 'Kedai Pilihan Terbaik')
        ->set('data.home_partners_subtitle', 'Seduhan Sanubari di Malang')
        ->set('data.home_partners_slides', [
            [
                'id' => 'partner-custom-1',
                'title' => 'Gartenhaus Malang',
                'city' => 'MALANG',
                'image' => 'https://images.unsplash.com/photo-1497636577773-f1231844b336?auto=format&fit=crop&w=800&q=80',
                'image_upload' => null,
                'href' => 'https://instagram.com/gartenhaus_co',
                'open_in_new_tab' => true,
            ],
            [
                'id' => 'partner-custom-2',
                'title' => 'Sanubari Roasting Studio',
                'city' => 'MALANG',
                'image' => 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=800&q=80',
                'image_upload' => null,
                'href' => '/kunjungi',
                'open_in_new_tab' => false,
            ],
        ])
        ->call('save')
        ->assertHasNoErrors();

    $saved = Setting::get('home_partners_slides');
    expect($saved)->toBeArray()->toHaveCount(2);
    expect($saved[0]['title'])->toBe('Gartenhaus Malang');
    expect($saved[0]['href'])->toBe('https://instagram.com/gartenhaus_co');
    expect($saved[1]['title'])->toBe('Sanubari Roasting Studio');
    expect($saved[1]['href'])->toBe('/kunjungi');

    $response = $this->get('/');
    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('welcome')
        ->where('settings.home_partners_title', 'Kedai Pilihan Terbaik')
        ->where('settings.home_partners_subtitle', 'Seduhan Sanubari di Malang')
        ->where('settings.home_partners_slides.0.title', 'Gartenhaus Malang')
        ->where('settings.home_partners_slides.0.href', 'https://instagram.com/gartenhaus_co')
    );
});

test('manage flash sale saves schedule and products categorized that reflect on home page', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $endTime = '2026-11-05 23:59';
    $startTime = '2026-11-01 08:00';

    Livewire::test(ManageFlashSale::class)
        ->assertSuccessful()
        ->set('data.home_flash_sale_is_active', true)
        ->set('data.home_flash_sale_title', 'FLASH SALE WEEKEND')
        ->set('data.home_flash_sale_subtitle', 'Diskon Spesial Alat Kopi Pilihan')
        ->set('data.home_flash_sale_start_time', $startTime)
        ->set('data.home_flash_sale_end_time', $endTime)
        ->set('data.home_flash_sale_items', [
            [
                'id' => 'fs-custom-1',
                'name' => 'Hario V60 Cyan Custom',
                'slug' => 'hario-v60-cyan-custom',
                'price' => 125000,
                'original_price' => 175000,
                'badge' => 'DISKON 30%',
                'stock_status' => 'Sisa 2 unit',
                'image' => '/storage/flashsale/v60_dripper.jpg',
                'image_upload' => null,
                'sold_percentage' => 88,
            ],
        ])
        ->call('save')
        ->assertHasNoErrors();

    $saved = Setting::get('home_flash_sale_items');
    expect($saved)->toBeArray()->toHaveCount(1);
    expect($saved[0]['name'])->toBe('Hario V60 Cyan Custom');
    expect($saved[0]['price'])->toBe(125000);
    expect($saved[0]['original_price'])->toBe(175000);

    expect(Setting::get('home_flash_sale_title'))->toBe('FLASH SALE WEEKEND');
    expect(Setting::get('home_flash_sale_end_time'))->toBe($endTime);

    $response = $this->get('/');
    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('welcome')
        ->where('settings.home_flash_sale_title', 'FLASH SALE WEEKEND')
        ->where('settings.home_flash_sale_end_time', $endTime)
        ->where('flashSaleProducts.0.name', 'Hario V60 Cyan Custom')
        ->where('flashSaleProducts.0.price', 125000)
    );
});

test('manage editorial section saves custom cards and reflects on home page', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    Livewire::test(ManageEditorialSection::class)
        ->assertSuccessful()
        ->set('data.home_editorial_badge', 'CERITA & RISET')
        ->set('data.home_editorial_title', 'Jejak Rasa Kopi Kawi')
        ->set('data.home_editorial_subtitle', 'Catatan roastery dan sains ekstraksi kopi')
        ->set('data.home_editorial_view_all_text', 'Eksplorasi Semua')
        ->set('data.home_editorial_view_all_url', '/blog')
        ->set('data.home_editorial_source', 'manual')
        ->set('data.home_editorial_items', [
            [
                'badge' => 'CATATAN ROASTER',
                'subBadge' => null,
                'title' => 'Mengenal Dirty Latte Kawi',
                'excerpt' => 'Espresso kental di atas susu dingin.',
                'cover_url' => 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd',
                'coverImage' => null,
                'href' => '/blog/dirty-latte',
                'actionText' => 'Baca Artikel',
            ],
            [
                'badge' => 'PANDUAN SEDUH',
                'subBadge' => '3:00 menit',
                'title' => 'V60 Pour Over Sanubari',
                'excerpt' => 'Resep seduh filter clean.',
                'cover_url' => 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb',
                'coverImage' => null,
                'href' => '/panduan-seduh',
                'actionText' => 'Lihat Panduan',
            ],
        ])
        ->call('save')
        ->assertHasNoErrors();

    expect(Setting::get('home_editorial_badge'))->toBe('CERITA & RISET');
    expect(Setting::get('home_editorial_title'))->toBe('Jejak Rasa Kopi Kawi');
    expect(Setting::get('home_editorial_source'))->toBe('manual');
    $items = Setting::get('home_editorial_items');
    expect($items)->toBeArray()->toHaveCount(2);
    expect($items[0]['title'])->toBe('Mengenal Dirty Latte Kawi');

    $response = $this->get('/');
    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('welcome')
        ->where('settings.home_editorial_badge', 'CERITA & RISET')
        ->where('settings.home_editorial_title', 'Jejak Rasa Kopi Kawi')
        ->where('settings.home_editorial_items.0.title', 'Mengenal Dirty Latte Kawi')
    );
});

test('manage featured menu saves subtitles for all three banners and reflects on home page', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    Livewire::test(ManageFeaturedMenu::class)
        ->assertSuccessful()
        ->set('data.home_laris_title', 'Menu Unggulan')
        ->set('data.home_laris_subtitle', 'Koleksi pilihan')
        ->set('data.home_laris_1_title', 'Gunung Kawi Honey')
        ->set('data.home_laris_1_subtitle', 'Subjudul Kiri Aksen')
        ->set('data.home_laris_1_href', '/shop?series=kawi')
        ->set('data.home_laris_2_title', 'Houseblend Espresso')
        ->set('data.home_laris_2_subtitle', 'Subjudul Tengah Aksen')
        ->set('data.home_laris_2_href', '/shop?category=espresso-beans')
        ->set('data.home_laris_3_title', 'CYBR Custom')
        ->set('data.home_laris_3_subtitle', 'Subjudul Kanan Aksen')
        ->set('data.home_laris_3_href', '/cybr')
        ->call('save')
        ->assertHasNoErrors();

    expect(Setting::get('home_laris_1_subtitle'))->toBe('Subjudul Kiri Aksen');
    expect(Setting::get('home_laris_2_subtitle'))->toBe('Subjudul Tengah Aksen');
    expect(Setting::get('home_laris_3_subtitle'))->toBe('Subjudul Kanan Aksen');

    $response = $this->get('/');
    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('welcome')
        ->where('settings.home_laris_1_subtitle', 'Subjudul Kiri Aksen')
        ->where('settings.home_laris_2_subtitle', 'Subjudul Tengah Aksen')
        ->where('settings.home_laris_3_subtitle', 'Subjudul Kanan Aksen')
    );
});

test('admin can choose jasa roasting as target page in category menu and hero slider', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    Livewire::test(ManageCategoryMenu::class)
        ->assertSuccessful()
        ->set('data.home_category_menu_items', [
            [
                'label' => 'Jasa Roasting',
                'visual_type' => 'icon',
                'icon' => 'lucide-flame',
                'image' => null,
                'link_type' => 'preset',
                'preset_url' => '/jasa-roasting',
                'custom_url' => null,
                'badge' => 'Populer',
            ],
        ])
        ->call('save')
        ->assertHasNoErrors();

    $savedCategoryItems = Setting::get('home_category_menu_items');
    expect($savedCategoryItems[0]['preset_url'])->toBe('/jasa-roasting');
    expect($savedCategoryItems[0]['label'])->toBe('Jasa Roasting');

    Livewire::test(ManageHeroSlider::class)
        ->assertSuccessful()
        ->set('data.home_hero_slides', [
            [
                'id' => 'slide-roasting',
                'title' => 'Layanan Roasting Kopi',
                'subtitle' => 'Profil kustom untuk bisnis Anda',
                'image' => ['banners/roasting.jpg'],
                'link_type' => 'page',
                'link_target_page' => '/jasa-roasting',
                'ctaText' => 'Lihat Layanan',
                'open_in_new_tab' => false,
            ],
        ])
        ->call('save')
        ->assertHasNoErrors();

    $savedHeroSlides = Setting::get('home_hero_slides');
    expect($savedHeroSlides[0]['url'])->toBe('/jasa-roasting');
});

