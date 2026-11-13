<?php

use App\Filament\Pages\HalamanAwal\ManageBackInStock;
use App\Models\Product;
use App\Models\Setting;
use App\Models\User;
use Livewire\Livewire;

test('admin can access manage back in stock page', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/admin/manage-back-in-stock')
        ->assertSuccessful();
});

test('admin can configure back in stock settings via livewire', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $items = [
        [
            'id' => 'bis-test-1',
            'name' => 'Kopi Restock Test 1',
            'slug' => 'kopi-restock-test-1',
            'price' => 125000,
            'original_price' => 150000,
            'image' => '/storage/test1.jpg',
            'badge' => 'BACK IN STOCK',
            'stock_status' => 'Tersedia',
        ],
    ];

    Livewire::test(ManageBackInStock::class)
        ->assertSuccessful()
        ->set('data.home_back_in_stock_is_active', true)
        ->set('data.home_back_in_stock_badge', 'KEMBALI TERSEDIA')
        ->set('data.home_back_in_stock_title', 'Back in Stock')
        ->set('data.home_back_in_stock_subtitle', 'Koleksi produk favorit kembali restock')
        ->set('data.home_back_in_stock_button_text', 'Lihat Semua')
        ->set('data.home_back_in_stock_button_url', '/back-in-stock')
        ->set('data.home_back_in_stock_items', $items)
        ->call('save')
        ->assertHasNoErrors();

    expect(Setting::get('home_back_in_stock_title'))->toBe('Back in Stock');
    expect(Setting::get('home_back_in_stock_badge'))->toBe('KEMBALI TERSEDIA');
    expect(count(Setting::get('home_back_in_stock_items')))->toBe(1);
});

test('home page passes back in stock products to inertia', function () {
    $product = Product::create([
        'name' => 'Test Coffee Back in Stock',
        'slug' => 'test-coffee-back-in-stock',
        'series' => 'kawi',
        'min_price' => 95000,
        'max_price' => 95000,
        'status' => 'active',
    ]);

    Setting::set('home_back_in_stock_items', [
        [
            'id' => 'bis-1',
            'product_id' => $product->id,
            'name' => 'Test Coffee Back in Stock',
            'slug' => 'test-coffee-back-in-stock',
            'price' => 95000,
            'image' => '/test.jpg',
        ],
    ]);

    $response = $this->get('/');
    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('welcome')
        ->has('backInStockProducts')
    );
});

test('dedicated back in stock page displays only products selected in admin', function () {
    $product1 = Product::create([
        'name' => 'Selected Restock Coffee 1',
        'slug' => 'selected-restock-coffee-1',
        'series' => 'kawi',
        'min_price' => 110000,
        'max_price' => 110000,
        'status' => 'active',
    ]);

    Product::create([
        'name' => 'Other Coffee Not in Restock',
        'slug' => 'other-coffee-not-in-restock',
        'series' => 'kawi',
        'min_price' => 80000,
        'max_price' => 80000,
        'status' => 'active',
    ]);

    Setting::set('home_back_in_stock_items', [
        [
            'id' => 'bis-test-1',
            'product_id' => $product1->id,
            'name' => 'Selected Restock Coffee 1',
            'slug' => 'selected-restock-coffee-1',
            'price' => 110000,
            'image' => '/storage/test1.jpg',
            'badge' => 'BACK IN STOCK',
        ],
    ]);

    $response = $this->get('/back-in-stock');
    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('back-in-stock/index')
        ->has('products', 1)
        ->where('products.0.name', 'Selected Restock Coffee 1')
    );
});

