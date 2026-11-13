<?php

use App\Models\Product;
use App\Models\ProductVariant;

test('public home page returns a successful response', function () {
    $response = $this->get('/');
    $response->assertStatus(200);
});

test('public english home page returns a successful response with en locale', function () {
    $response = $this->get('/en');
    $response->assertStatus(200);
});

test('public shop catalog returns a successful response', function () {
    $response = $this->get('/shop');
    $response->assertStatus(200);
});

test('public shop search with query parameter filters products', function () {
    $response = $this->get('/shop?q=kawi');
    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('shop/index')
        ->has('filters.q')
        ->where('filters.q', 'kawi')
    );
});

test('public product detail page returns 200 for existing product and 404 for missing', function () {
    $product = Product::first();
    if ($product) {
        $response = $this->get("/shop/{$product->slug}");
        $response->assertStatus(200);
    }

    $missing = $this->get('/shop/definitely-non-existent-product-slug');
    $missing->assertStatus(404);
});

test('public all categories page returns successful inertia response', function () {
    $this->get('/kategori')
        ->assertStatus(200)
        ->assertInertia(fn ($page) => $page->component('categories/index'));

    $this->get('/categories')
        ->assertStatus(200)
        ->assertInertia(fn ($page) => $page->component('categories/index'));

    $this->get('/en/categories')
        ->assertStatus(200)
        ->assertInertia(fn ($page) => $page->component('categories/index'));
});

test('public content pages return successful responses', function () {
    $routes = ['/flash-sale', '/en/flash-sale', '/tentang', '/wholesale', '/kunjungi', '/panduan-seduh', '/blog', '/acara', '/keranjang', '/legal/privacy'];
    foreach ($routes as $route) {
        $response = $this->get($route);
        $response->assertStatus(200);
    }
});

test('public flash sale page returns successful inertia response with only configured items', function () {
    \App\Models\Setting::set('home_flash_sale_is_active', true);
    \App\Models\Setting::set('home_flash_sale_items', [
        [
            'id' => 'fs-custom-1',
            'name' => 'Custom Flash Sale Coffee',
            'slug' => 'custom-flash-sale-coffee',
            'price' => 75000,
            'original_price' => 100000,
            'image' => '/storage/test.jpg',
            'badge' => 'FLASH SALE',
            'stock_status' => 'Tersedia',
            'sold_percentage' => 80,
        ],
    ]);
    \App\Models\Product::clearActiveFlashSaleCache();

    $response = $this->get('/flash-sale');
    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('flash-sale/index')
        ->has('products', 1)
        ->where('products.0.name', 'Custom Flash Sale Coffee')
        ->has('heroItems', 1)
        ->has('categories')
    );
});

test('product model computes is_flash_sale attribute based on active flash sale settings', function () {
    \App\Models\Setting::set('home_flash_sale_is_active', true);
    \App\Models\Setting::set('home_flash_sale_items', [
        [
            'id' => 'fs-promo',
            'name' => 'Kawi Honey Promo',
            'slug' => 'kawi-honey-flash',
            'price' => 85000,
            'original_price' => 110000,
        ],
    ]);
    \App\Models\Product::clearActiveFlashSaleCache();

    $promoProduct = new \App\Models\Product(['name' => 'Kawi Honey Promo', 'slug' => 'kawi-honey-flash']);
    $normalProduct = new \App\Models\Product(['name' => 'Normal Coffee', 'slug' => 'normal-coffee']);

    expect($promoProduct->is_flash_sale)->toBeTrue();
    expect($normalProduct->is_flash_sale)->toBeFalse();
});

test('product model saves and returns marketplace urls and show page passes marketplace defaults', function () {
    $this->seed();
    $product = \App\Models\Product::first();
    if (! $product) {
        $this->markTestSkipped('No product in database');
    }

    $product->update([
        'tokopedia_url' => 'https://www.tokopedia.com/sanubari/product-test',
        'shopee_url' => 'https://shopee.co.id/sanubari/product-test',
        'tiktok_shop_url' => 'https://shop.tiktok.com/view/product-test',
    ]);

    $freshProduct = $product->fresh();
    expect($freshProduct->tokopedia_url)->toBe('https://www.tokopedia.com/sanubari/product-test');
    expect($freshProduct->shopee_url)->toBe('https://shopee.co.id/sanubari/product-test');
    expect($freshProduct->tiktok_shop_url)->toBe('https://shop.tiktok.com/view/product-test');

    $response = $this->get('/shop/' . $product->slug);
    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('shop/show')
        ->has('product')
        ->where('product.tokopedia_url', 'https://www.tokopedia.com/sanubari/product-test')
        ->where('product.shopee_url', 'https://shopee.co.id/sanubari/product-test')
        ->where('product.tiktok_shop_url', 'https://shop.tiktok.com/view/product-test')
        ->has('marketplaceDefaults')
    );
});

test('xml sitemap returns valid xml response', function () {
    $response = $this->get('/sitemap.xml');
    $response->assertStatus(200);
    $response->assertHeader('Content-Type', 'application/xml');
    expect($response->getContent())->toContain('<urlset');
});

test('cart quote endpoint generates whatsapp redirect link', function () {
    $this->seed();
    $variant = ProductVariant::first();
    if (! $variant) {
        $this->markTestSkipped('No product variants in database');
    }

    $payload = [
        'items' => [
            [
                'variant_id' => $variant->id,
                'quantity' => 2,
                'grind_option' => 'Medium (V60)',
            ],
        ],
        'customer' => [
            'name' => 'Budi Santoso',
            'phone' => '08123456789',
            'address' => 'Jl. Ijen No. 10, Malang',
            'notes' => 'Tolong kirim sebelum jam 12',
        ],
    ];

    $response = $this->postJson('/cart/quote', $payload);
    $response->assertStatus(200)
        ->assertJsonStructure(['success', 'wa_url', 'subtotal', 'items'])
        ->assertJson(['success' => true]);

    expect($response->json('wa_url'))->toContain('wa.me');
});

test('public byob and cybr pages return successful response for both id and en routes', function () {
    $this->seed();
    $responseCybr = $this->get('/cybr');
    $responseCybr->assertStatus(200);

    $responseShopCybr = $this->get('/shop/cybr');
    $responseShopCybr->assertStatus(200);

    $responseId = $this->get('/shop/byob');
    $responseId->assertStatus(200);

    $responseByobAlias = $this->get('/byob');
    $responseByobAlias->assertStatus(200);

    $responseEnCybr = $this->get('/en/cybr');
    $responseEnCybr->assertStatus(200);

    $responseEn = $this->get('/en/shop/byob');
    $responseEn->assertStatus(200);
});

test('cart quote endpoint processes custom blend notes in whatsapp message', function () {
    $this->seed();
    $variant = ProductVariant::first();
    if (! $variant) {
        $this->markTestSkipped('No product variants in database');
    }

    $payload = [
        'items' => [
            [
                'variant_id' => $variant->id,
                'quantity' => 1,
                'grind_option' => 'Biji Utuh (Whole Bean)',
                'custom_notes' => 'BYOB: 70% Arabika Kawi Honey + 30% Fine Robusta Dampit',
            ],
        ],
        'customer' => [
            'name' => 'Citra Roaster',
            'phone' => '081234567890',
            'address' => 'Jl. Kawi No. 25, Malang',
            'notes' => 'Label custom blend tolong ditulis rapi',
        ],
    ];

    $response = $this->postJson('/cart/quote', $payload);
    $response->assertStatus(200)
        ->assertJsonStructure(['success', 'wa_url', 'subtotal', 'items'])
        ->assertJson(['success' => true]);

    $waUrl = urldecode($response->json('wa_url'));
    expect($waUrl)->toContain('BYOB: 70% Arabika Kawi Honey + 30% Fine Robusta Dampit');
});

test('live search api returns trending and live results', function () {
    $this->seed();

    // 1. Zero state
    $zeroState = $this->getJson('/api/search');
    $zeroState->assertStatus(200)
        ->assertJsonStructure(['trending', 'recommended', 'products', 'guides']);
    expect(count($zeroState->json('trending')))->toBeGreaterThan(0);

    // 2. Query state
    $queryState = $this->getJson('/api/search?q=kawi');
    $queryState->assertStatus(200)
        ->assertJsonStructure(['query', 'products', 'guides']);
    expect($queryState->json('query'))->toBe('kawi');
});

