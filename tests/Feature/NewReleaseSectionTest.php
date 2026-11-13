<?php

use App\Filament\Pages\HalamanAwal\ManageNewRelease;
use App\Models\Product;
use App\Models\Setting;
use App\Models\User;
use Livewire\Livewire;

test('admin can access manage new release page', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/admin/manage-new-release')
        ->assertSuccessful();
});

test('admin can configure new release settings via livewire', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $items = [
        [
            'id' => 'nr-test-1',
            'name' => 'Kopi Test New Release 1',
            'slug' => 'kopi-test-new-release-1',
            'price' => 125000,
            'original_price' => 150000,
            'image' => '/storage/test1.jpg',
            'badge' => 'NEW RELEASE',
            'stock_status' => 'Tersedia',
        ],
        [
            'id' => 'nr-test-2',
            'name' => 'Kopi Test New Release 2',
            'slug' => 'kopi-test-new-release-2',
            'price' => 110000,
            'original_price' => null,
            'image' => '/storage/test2.jpg',
            'badge' => 'NEW RELEASE',
            'stock_status' => 'Tersedia',
        ],
    ];

    Livewire::test(ManageNewRelease::class)
        ->assertSuccessful()
        ->set('data.home_new_release_is_active', true)
        ->set('data.home_new_release_badge', 'KOLEKSI TERBARU')
        ->set('data.home_new_release_title', 'New Release')
        ->set('data.home_new_release_subtitle', 'Koleksi rilisan terbaru dari Sanubari Roastery')
        ->set('data.home_new_release_button_text', 'Lihat Semua')
        ->set('data.home_new_release_button_url', '/new-release')
        ->set('data.home_new_release_items', $items)
        ->call('save')
        ->assertHasNoErrors();

    expect(Setting::get('home_new_release_title'))->toBe('New Release');
    expect(Setting::get('home_new_release_badge'))->toBe('KOLEKSI TERBARU');
    expect(count(Setting::get('home_new_release_items')))->toBe(2);
});

test('home page passes new release products to inertia', function () {
    Product::create([
        'name' => 'Test Coffee New Release A',
        'slug' => 'test-coffee-new-release-a',
        'series' => 'kawi',
        'min_price' => 95000,
        'max_price' => 95000,
        'status' => 'active',
    ]);

    $response = $this->get('/');
    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('welcome')
        ->has('newReleaseProducts')
    );
});

test('dedicated new release page displays only products selected in admin', function () {
    $product1 = Product::create([
        'name' => 'Selected Coffee 1',
        'slug' => 'selected-coffee-1',
        'series' => 'kawi',
        'min_price' => 110000,
        'max_price' => 110000,
        'status' => 'active',
    ]);

    $product2 = Product::create([
        'name' => 'Other Coffee Not Selected',
        'slug' => 'other-coffee-not-selected',
        'series' => 'kawi',
        'min_price' => 80000,
        'max_price' => 80000,
        'status' => 'active',
    ]);

    Setting::set('home_new_release_items', [
        [
            'id' => 'nr-test-1',
            'product_id' => $product1->id,
            'name' => 'Selected Coffee 1',
            'slug' => 'selected-coffee-1',
            'price' => 110000,
            'image' => '/storage/test1.jpg',
            'badge' => 'NEW RELEASE',
        ],
    ]);

    $response = $this->get('/new-release');
    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('new-release/index')
        ->has('products', 1)
        ->where('products.0.name', 'Selected Coffee 1')
    );
});

test('new-releases alias redirects to new-release', function () {
    $this->get('/new-releases')
        ->assertRedirect('/new-release');
});

