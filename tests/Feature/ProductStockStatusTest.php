<?php

use App\Models\Product;
use App\Models\ProductVariant;

test('product is marked as out of stock when stock_status is set to out_of_stock', function () {
    $product = Product::create([
        'name' => 'Kopi Test Stok',
        'slug' => 'kopi-test-stok',
        'status' => 'active',
        'stock_status' => 'out_of_stock',
        'min_price' => 50000,
        'max_price' => 50000,
    ]);

    expect($product->is_out_of_stock)->toBeTrue();
});

test('product is marked as out of stock when all variants are out of stock', function () {
    $product = Product::create([
        'name' => 'Kopi Test Variant Stok',
        'slug' => 'kopi-test-variant-stok',
        'status' => 'active',
        'stock_status' => 'in_stock',
        'min_price' => 50000,
        'max_price' => 50000,
    ]);

    $variant = ProductVariant::create([
        'product_id' => $product->id,
        'label' => '200g',
        'weight_grams' => 200,
        'price' => 50000,
        'stock_status' => 'out_of_stock',
    ]);

    $product->load('variants');
    expect($product->is_out_of_stock)->toBeTrue();
});

test('checkout fails when ordering out of stock product', function () {
    $product = Product::create([
        'name' => 'Kopi Habis',
        'slug' => 'kopi-habis',
        'status' => 'active',
        'stock_status' => 'out_of_stock',
        'min_price' => 50000,
        'max_price' => 50000,
    ]);

    $variant = ProductVariant::create([
        'product_id' => $product->id,
        'label' => '200g',
        'weight_grams' => 200,
        'price' => 50000,
        'stock_status' => 'out_of_stock',
    ]);

    $response = $this->postJson(route('checkout.process'), [
        'customer' => [
            'name' => 'Budi Sanubari',
            'phone' => '081234567890',
        ],
        'fulfillment_type' => 'pickup',
        'payment_method' => 'qris',
        'items' => [
            [
                'variant_id' => $variant->id,
                'quantity' => 1,
            ],
        ],
    ]);

    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['items']);
});

test('editing product variant weight and price in admin persists weight_grams without reverting and syncs label and product prices', function () {
    $admin = \App\Models\User::factory()->create([
        'email' => 'admin@sanubari.id',
    ]);
    $this->actingAs($admin);

    $product = Product::create([
        'name' => 'Kopi Test Berat',
        'slug' => 'kopi-test-berat',
        'series' => 'filter',
        'status' => 'active',
        'stock_status' => 'in_stock',
        'min_price' => 15000,
        'max_price' => 155000,
        'freshness_days' => 30,
    ]);

    $v1 = ProductVariant::create([
        'product_id' => $product->id,
        'label' => '15 gr',
        'weight_grams' => 15,
        'price' => 15000,
        'stock_status' => 'in_stock',
    ]);
    $v2 = ProductVariant::create([
        'product_id' => $product->id,
        'label' => '100 gr',
        'weight_grams' => 100,
        'price' => 75000,
        'stock_status' => 'in_stock',
    ]);
    $v3 = ProductVariant::create([
        'product_id' => $product->id,
        'label' => '200 gr',
        'weight_grams' => 200,
        'price' => 155000,
        'stock_status' => 'in_stock',
    ]);

    // Update 3rd variant weight_grams to 250 and price to 180000
    $v3->weight_grams = 250;
    $v3->price = 180000;
    $v3->save();

    $v3->refresh();
    $product->refresh();

    expect($v3->weight_grams)->toBe(250);
    expect($v3->label)->toBe('250 gr');
    expect((float) $product->max_price)->toBe(180000.0);

    // Also test Filament EditProduct Livewire component save directly
    $livewire = \Livewire\Livewire::test(\App\Filament\Resources\Products\Pages\EditProduct::class, [
        'record' => $product->getRouteKey(),
    ]);

    $variantsState = $livewire->get('data.variants');
    $lastKey = array_key_last($variantsState);
    $variantsState[$lastKey]['weight_grams'] = 500;
    $variantsState[$lastKey]['price'] = 290000;

    $livewire
        ->set('data.variants', $variantsState)
        ->call('save')
        ->assertHasNoFormErrors();

    $v3->refresh();
    $product->refresh();

    expect($v3->weight_grams)->toBe(500);
    expect($v3->label)->toBe('500 gr');
    expect((float) $product->max_price)->toBe(290000.0);
});

test('editing blog post 3d flipbook slider settings in admin persists flipbook pages and configuration', function () {
    $admin = \App\Models\User::factory()->create([
        'email' => 'editor@sanubari.id',
    ]);
    $this->actingAs($admin);

    $post = \App\Models\Post::create([
        'type' => 'article',
        'title' => ['id' => 'Artikel Kopi 3D Book'],
        'slug' => 'artikel-kopi-3d-book',
        'category' => 'Journal',
        'author_name' => 'Sanubari Roastery',
        'read_time_minutes' => 4,
        'body' => ['id' => '<p>Isi artikel lengkap tentang kopi Gunung Kawi.</p>'],
        'published_at' => now()->subMinute(),
    ]);

    $livewire = \Livewire\Livewire::test(\App\Filament\Resources\Posts\Pages\EditPost::class, [
        'record' => $post->getRouteKey(),
    ]);

    $livewire
        ->set('data.meta.flipbook_enabled', true)
        ->set('data.meta.flipbook_position', 'after_cover')
        ->call('save')
        ->assertHasNoFormErrors();

    $post->refresh();
    expect($post->meta['flipbook_enabled'])->toBeTrue();
    expect($post->meta['flipbook_position'])->toBe('after_cover');
    expect($post->meta['flipbook_pages'])->toBeArray()->not->toBeEmpty();
});
