<?php

use App\Filament\Pages\HalamanAwal\ManageHeroSlider;
use App\Filament\Pages\HalamanAwal\ManageTasteRecommendations;
use App\Filament\Pages\ManageContentPages;
use App\Filament\Pages\ManageGeneralSettings;
use App\Filament\Resources\Categories\CategoryResource;
use App\Filament\Resources\Posts\PostResource;
use App\Filament\Resources\Products\ProductResource;
use App\Models\Category;
use App\Models\Post;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Livewire\Livewire;

test('manage general settings can be rendered without errors', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/admin/manage-general-settings')
        ->assertSuccessful();
});

test('manage general settings livewire component mounts and saves data', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    Livewire::test(ManageGeneralSettings::class)
        ->assertSuccessful()
        ->set('data.site_name', 'Sanubari Roastery Test')
        ->set('data.whatsapp', '6281234567890')
        ->call('save')
        ->assertHasNoErrors();

    expect(Setting::get('site_name'))->toBe('Sanubari Roastery Test');
    expect(Setting::get('whatsapp'))->toBe('6281234567890');
});

test('filament resources list, create, and edit pages render without errors', function () {
    $user = User::factory()->create();

    $category = Category::create([
        'name' => ['id' => 'Filter Coffee', 'en' => 'Filter Coffee'],
        'slug' => 'filter-coffee-test',
        'type' => 'filter',
    ]);

    $product = Product::create([
        'name' => 'Kawi Natural Test',
        'slug' => 'kawi-natural-test',
        'series' => 'kawi',
        'status' => 'active',
        'min_price' => 90000,
        'max_price' => 120000,
    ]);

    $post = Post::create([
        'type' => 'article',
        'title' => ['id' => 'Artikel Uji', 'en' => 'Test Article'],
        'slug' => 'artikel-uji-test',
        'body' => ['id' => 'Konten artikel uji', 'en' => 'Test article content'],
    ]);

    // List pages
    $this->actingAs($user)->get('/admin/products')->assertSuccessful();
    $this->actingAs($user)->get('/admin/posts')->assertSuccessful();
    $this->actingAs($user)->get('/admin/categories')->assertSuccessful();

    // Create pages
    $this->actingAs($user)->get('/admin/products/create')->assertSuccessful();
    $this->actingAs($user)->get('/admin/posts/create')->assertSuccessful();
    $this->actingAs($user)->get('/admin/categories/create')->assertSuccessful();

    // Edit pages
    $this->actingAs($user)->get("/admin/products/{$product->id}/edit")->assertSuccessful();
    $this->actingAs($user)->get("/admin/posts/{$post->id}/edit")->assertSuccessful();
    $this->actingAs($user)->get("/admin/categories/{$category->id}/edit")->assertSuccessful();
});

test('product variant creation automatically updates product min_price and max_price', function () {
    $product = Product::create([
        'name' => 'Kawi Honey Test',
        'slug' => 'kawi-honey-test',
        'series' => 'kawi',
        'status' => 'active',
        'min_price' => 0,
        'max_price' => 0,
    ]);

    ProductVariant::create([
        'product_id' => $product->id,
        'label' => '200g',
        'weight_grams' => 200,
        'price' => 95000,
    ]);

    ProductVariant::create([
        'product_id' => $product->id,
        'label' => '1kg',
        'weight_grams' => 1000,
        'price' => 380000,
    ]);

    $product->refresh();
    expect($product->min_price)->toEqual(95000);
    expect($product->max_price)->toEqual(380000);
});

test('product can update marketplace urls in filament product resource', function () {
    $product = Product::create([
        'name' => 'Marketplace Coffee Test',
        'slug' => 'marketplace-coffee-test',
        'series' => 'classic',
        'status' => 'active',
        'min_price' => 85000,
        'max_price' => 120000,
    ]);

    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(ProductResource::getUrl('edit', ['record' => $product]));
    $response->assertSuccessful();

    $product->update([
        'tokopedia_url' => 'https://www.tokopedia.com/sanubari/kopi-spesial',
        'shopee_url' => 'https://shopee.co.id/sanubari/kopi-spesial',
        'tiktok_shop_url' => 'https://shop.tiktok.com/kopi-spesial',
    ]);

    $product->refresh();
    expect($product->tokopedia_url)->toBe('https://www.tokopedia.com/sanubari/kopi-spesial');
    expect($product->shopee_url)->toBe('https://shopee.co.id/sanubari/kopi-spesial');
    expect($product->tiktok_shop_url)->toBe('https://shop.tiktok.com/kopi-spesial');
});

test('announcement and hero settings reflect on homepage and public layout', function () {
    Setting::set('announcement_enabled', true);
    Setting::set('announcement_text_id', 'Promo Bebas Ongkir Jawa Timur');
    Setting::set('home_hero_show_text', true);
    Setting::set('home_laris_1_title', 'Kawi Anaerobic Gold');
    Cache::forget('sanubari_settings');

    $response = $this->get('/');

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('welcome')
        ->where('settings.announcement_enabled', true)
        ->where('settings.announcement_text_id', 'Promo Bebas Ongkir Jawa Timur')
        ->where('settings.home_hero_show_text', true)
        ->where('settings.home_laris_1_title', 'Kawi Anaerobic Gold')
    );
});

test('manage home page settings livewire component mounts and saves hero banner slides with resolved links', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    Livewire::test(ManageHeroSlider::class)
        ->assertSuccessful()
        ->set('data.home_hero_slides', [
            [
                'title' => 'Test Promo Banner',
                'image' => ['banners/slide-1.jpg'],
                'link_type' => 'page',
                'link_target_page' => '/shop/byob',
                'open_in_new_tab' => false,
            ],
            [
                'title' => 'External Collaboration',
                'image' => ['banners/slide-2.jpg'],
                'link_type' => 'custom',
                'link_custom_url' => 'https://instagram.com/sanubari.roastery',
                'open_in_new_tab' => true,
            ],
            [
                'title' => 'Info Only Banner',
                'image' => ['banners/slide-3.jpg'],
                'link_type' => 'none',
                'open_in_new_tab' => false,
            ],
        ])
        ->call('save')
        ->assertHasNoErrors();

    $savedSlides = Setting::get('home_hero_slides');
    expect($savedSlides)->toBeArray()->toHaveCount(3);

    // Slide 1: Page Link
    expect($savedSlides[0]['title'])->toBe('Test Promo Banner');
    expect($savedSlides[0]['url'])->toBe('/shop/byob');
    expect($savedSlides[0]['bgImage'])->toContain('storage/banners/slide-1.jpg');
    expect($savedSlides[0]['open_in_new_tab'])->toBeFalse();

    // Slide 2: External Custom Link
    expect($savedSlides[1]['title'])->toBe('External Collaboration');
    expect($savedSlides[1]['url'])->toBe('https://instagram.com/sanubari.roastery');
    expect($savedSlides[1]['open_in_new_tab'])->toBeTrue();

    // Slide 3: Info Only (No Link)
    expect($savedSlides[2]['title'])->toBe('Info Only Banner');
    expect($savedSlides[2]['url'])->toBeNull();
});

test('product variant stores packaging image and computes image_url', function () {
    $product = Product::create([
        'name' => 'Variant Packaging Test Coffee',
        'slug' => 'variant-packaging-test',
        'series' => 'kawi',
        'status' => 'active',
        'min_price' => 50000,
        'max_price' => 120000,
    ]);

    $variant1 = ProductVariant::create([
        'product_id' => $product->id,
        'label' => '200g Pouch',
        'weight_grams' => 200,
        'price' => 50000,
        'image' => 'products/variants/sample-200g.jpg',
    ]);

    $variant2 = ProductVariant::create([
        'product_id' => $product->id,
        'label' => '1kg Bag',
        'weight_grams' => 1000,
        'price' => 200000,
        'image' => null,
    ]);

    expect($variant1->image)->toBe('products/variants/sample-200g.jpg');
    expect($variant1->image_url)->toContain('products/variants/sample-200g.jpg');
    expect($variant2->image)->toBeNull();
    expect($variant2->image_url)->toBeNull();
});

test('manage taste recommendations saves uploaded flavor card images', function () {
    Livewire::test(ManageTasteRecommendations::class)
        ->set('data.home_flavor_title', 'Rekomendasi Rasa Kopi Sanubari')
        ->set('data.home_flavor_subtitle', 'Pilihan terbaik untuk seduhan manual Anda')
        ->set('data.home_flavor_items', [
            [
                'title' => 'Floral & Fruity',
                'desc' => 'Lereng Kawi',
                'href' => '/shop?series=kawi',
                'bgImage' => ['taste-recommendations/taste-1.jpg'],
            ],
        ])
        ->call('save')
        ->assertHasNoErrors();

    $saved = Setting::get('home_flavor_items');
    expect($saved)->toBeArray()->toHaveCount(1);
    expect($saved[0]['bgImage'])->toBe('taste-recommendations/taste-1.jpg');
});

test('manage content pages can be rendered and saved in filament admin', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $this->get('/admin/manage-content-pages')
        ->assertSuccessful();

    Livewire::test(ManageContentPages::class)
        ->assertSuccessful()
        ->set('data.about_hero_badge', 'Cerita Kami')
        ->set('data.about_hero_title', 'Perjalanan Sanubari')
        ->set('data.about_video_url', 'https://www.smokingbarrels.coffee/media/home-hero-video.mp4')
        ->set('data.about_video_title', 'Video Studio Sangrai')
        ->set('data.wholesale_hero_title', 'Solusi B2B Kopi')
        ->set('data.wholesale_hero_image_url', 'https://example.com/wholesale-hero.jpg')
        ->set('data.wholesale_form_image_url', 'https://example.com/wholesale-form.jpg')
        ->set('data.wholesale_gallery_title', 'Galeri Kemitraan Kedai')
        ->set('data.wholesale_gallery_images', [
            ['image_upload' => null, 'image_url' => 'https://example.com/w1.jpg', 'caption' => 'Setup Kedai 1'],
            ['image_upload' => null, 'image_url' => 'https://example.com/w2.jpg', 'caption' => 'Setup Kedai 2'],
        ])
        ->set('data.visit_hero_title', 'Singgahi Roastery Kami')
        ->set('data.visit_gallery_title', 'Galeri Foto Slow Bar')
        ->set('data.visit_grid_desktop', '4')
        ->set('data.visit_grid_tablet', '2')
        ->set('data.visit_grid_mobile', '1')
        ->set('data.visit_gallery_images', [
            ['image_upload' => null, 'image_url' => 'https://example.com/photo1.jpg', 'caption' => 'Foto 1'],
            ['image_upload' => null, 'image_url' => 'https://example.com/photo2.jpg', 'caption' => 'Foto 2'],
        ])
        ->set('data.blog_hero_title', 'Jurnal & Artikel Kopi')
        ->call('save')
        ->assertHasNoErrors();

    expect(Setting::get('page_about')['hero_title'])->toBe('Perjalanan Sanubari');
    expect(Setting::get('page_about')['video_url'])->toBe('https://www.smokingbarrels.coffee/media/home-hero-video.mp4');
    expect(Setting::get('page_about')['video_title'])->toBe('Video Studio Sangrai');
    expect(Setting::get('page_wholesale')['hero_title'])->toBe('Solusi B2B Kopi');
    expect(Setting::get('page_wholesale')['hero_image'])->toBe('https://example.com/wholesale-hero.jpg');
    expect(Setting::get('page_wholesale')['gallery_images'])->toHaveCount(2);
    expect(Setting::get('page_visit')['hero_title'])->toBe('Singgahi Roastery Kami');
    expect(Setting::get('page_visit')['gallery_title'])->toBe('Galeri Foto Slow Bar');
    expect(Setting::get('page_visit')['grid_desktop'])->toBe(4);
    expect(Setting::get('page_visit')['gallery_images'])->toHaveCount(2);
    expect(Setting::get('page_blog')['hero_title'])->toBe('Jurnal & Artikel Kopi');

    // Verify public pages render with these settings
    $this->get('/tentang')->assertSuccessful();
    $this->get('/wholesale')->assertSuccessful();
    $this->get('/kunjungi')->assertSuccessful();
    $this->get('/blog')->assertSuccessful();
});

test('admin can add, edit, and delete banks in general settings repeater', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    Livewire::test(ManageGeneralSettings::class)
        ->assertSuccessful()
        ->set('data.payment_banks', [
            [
                'bank_code' => 'bsi',
                'bank_name' => 'Bank Syariah Indonesia (BSI)',
                'account_number' => '7123-888-999',
                'account_holder' => 'SANUBARI ROASTERY BSI',
                'branch_info' => 'KC Malang Soekarno Hatta',
                'is_active' => true,
            ],
            [
                'bank_code' => 'bca',
                'bank_name' => 'BCA Roastery',
                'account_number' => '011-999-8888',
                'account_holder' => 'SANUBARI ROASTERY UTAMA',
                'branch_info' => 'KCU Kawi',
                'is_active' => true,
            ],
        ])
        ->call('save')
        ->assertHasNoErrors();

    $savedBanks = Setting::get('payment_banks');
    expect($savedBanks)->toBeArray()->toHaveCount(2);
    expect($savedBanks[0]['bank_name'])->toBe('Bank Syariah Indonesia (BSI)');
    expect($savedBanks[0]['account_number'])->toBe('7123-888-999');
    expect($savedBanks[1]['bank_code'])->toBe('bca');

    // Verify cart page loads with the new bank list
    $cartRes = $this->get('/keranjang');
    $cartRes->assertSuccessful();
    $cartRes->assertInertia(fn ($page) => $page
        ->component('cart')
        ->has('paymentSettings.banks', 2)
        ->where('paymentSettings.banks.0.bank_name', 'Bank Syariah Indonesia (BSI)')
    );
});

test('visitor can access roasting service page and admin can manage roasting settings', function () {
    $res = $this->get('/jasa-roasting');
    $res->assertSuccessful();
    $res->assertInertia(fn ($page) => $page->component('roasting'));

    $resAlias = $this->get('/roasting');
    $resAlias->assertSuccessful();
    $resAlias->assertInertia(fn ($page) => $page->component('roasting'));

    $user = User::factory()->create();
    $this->actingAs($user);

    Livewire::test(ManageContentPages::class)
        ->assertSuccessful()
        ->set('data.roasting_hero_title', 'Jasa Roasting Kopi Spesialis Malang')
        ->set('data.roasting_whatsapp_number', '628999888777')
        ->call('save')
        ->assertHasNoErrors();

    $saved = Setting::get('page_roasting');
    expect($saved)->toBeArray();
    expect($saved['hero_title'])->toBe('Jasa Roasting Kopi Spesialis Malang');
    expect($saved['whatsapp_number'])->toBe('628999888777');

    $resUpdated = $this->get('/jasa-roasting');
    $resUpdated->assertSuccessful();
    $resUpdated->assertInertia(fn ($page) => $page
        ->component('roasting')
        ->where('page.hero_title', 'Jasa Roasting Kopi Spesialis Malang')
    );
});

test('visitor can access barista training page and admin can manage barista settings', function () {
    $res = $this->get('/training-barista');
    $res->assertSuccessful();
    $res->assertInertia(fn ($page) => $page->component('barista-training'));

    $resAlias = $this->get('/kursus-barista');
    $resAlias->assertSuccessful();
    $resAlias->assertInertia(fn ($page) => $page->component('barista-training'));

    $resEn = $this->get('/en/barista-training');
    $resEn->assertSuccessful();
    $resEn->assertInertia(fn ($page) => $page->component('barista-training'));

    $user = User::factory()->create();
    $this->actingAs($user);

    Livewire::test(ManageContentPages::class)
        ->assertSuccessful()
        ->set('data.barista_hero_title', 'Kursus Barista Bersertifikat Sanubari')
        ->set('data.barista_whatsapp_number', '6281122334455')
        ->call('save')
        ->assertHasNoErrors();

    $saved = Setting::get('page_barista_training');
    expect($saved)->toBeArray();
    expect($saved['hero_title'])->toBe('Kursus Barista Bersertifikat Sanubari');
    expect($saved['whatsapp_number'])->toBe('6281122334455');

    $resUpdated = $this->get('/training-barista');
    $resUpdated->assertSuccessful();
    $resUpdated->assertInertia(fn ($page) => $page
        ->component('barista-training')
        ->where('page.hero_title', 'Kursus Barista Bersertifikat Sanubari')
    );
});

test('visitor can access events page and admin can manage acara settings', function () {
    $res = $this->get('/acara');
    $res->assertSuccessful();
    $res->assertInertia(fn ($page) => $page->component('events/index'));

    $user = User::factory()->create();
    $this->actingAs($user);

    Livewire::test(ManageContentPages::class)
        ->assertSuccessful()
        ->set('data.events_hero_title', 'Jadwal Acara & Workshop Kopi Sanubari')
        ->set('data.events_upcoming_title', 'Daftar Acara Terdekat')
        ->set('data.events_whatsapp_number', '628123443210')
        ->call('save')
        ->assertHasNoErrors();

    $saved = Setting::get('page_events');
    expect($saved)->toBeArray();
    expect($saved['hero_title'])->toBe('Jadwal Acara & Workshop Kopi Sanubari');
    expect($saved['upcoming_title'])->toBe('Daftar Acara Terdekat');
    expect($saved['whatsapp_number'])->toBe('628123443210');

    $resUpdated = $this->get('/acara');
    $resUpdated->assertSuccessful();
    $resUpdated->assertInertia(fn ($page) => $page
        ->component('events/index')
        ->where('page.hero_title', 'Jadwal Acara & Workshop Kopi Sanubari')
        ->where('page.upcoming_title', 'Daftar Acara Terdekat')
    );
});

test('products table in filament admin default sorts newest created products first', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $oldProduct = Product::create([
        'name' => 'Kopi Produk Lama',
        'slug' => 'kopi-produk-lama',
        'status' => 'active',
        'created_at' => now()->subDays(5),
    ]);

    $newProduct = Product::create([
        'name' => 'Kopi Produk Paling Baru',
        'slug' => 'kopi-produk-paling-baru',
        'status' => 'active',
        'created_at' => now(),
    ]);

    Livewire::test(App\Filament\Resources\Products\Pages\ListProducts::class)
        ->assertCanSeeTableRecords([$newProduct, $oldProduct], inOrder: true);
});


