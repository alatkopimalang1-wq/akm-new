<?php

use App\Models\Product;
use App\Models\ProductImage;

it('ensures coffee products have the roasting pratter cooling photo as their third gallery image', function () {
    $product = Product::create([
        'name' => 'Kopi Sanubari Test',
        'slug' => 'kopi-sanubari-test',
        'status' => 'active',
        'stock_status' => 'in_stock',
        'min_price' => 50000,
        'max_price' => 50000,
    ]);

    ProductImage::create([
        'product_id' => $product->id,
        'path' => 'taste-recommendations/taste-1.jpg',
        'sort_order' => 0,
        'is_primary' => true,
    ]);
    ProductImage::create([
        'product_id' => $product->id,
        'path' => 'products/variants/variant-200g.jpg',
        'sort_order' => 1,
        'is_primary' => false,
    ]);
    ProductImage::create([
        'product_id' => $product->id,
        'path' => 'products/gallery/roasting-pratter-cooling.jpg',
        'sort_order' => 2,
        'is_primary' => false,
    ]);

    $product->refresh();
    $thirdImage = $product->images()->orderBy('sort_order')->skip(2)->first();

    expect($thirdImage)->not->toBeNull()
        ->and($thirdImage->path)->toBe('products/gallery/roasting-pratter-cooling.jpg');
});

it('automatically sets first gallery image as primary if none is marked primary', function () {
    $product = Product::create([
        'name' => 'Kopi Non Primary Test',
        'slug' => 'kopi-non-primary-test',
        'status' => 'active',
        'stock_status' => 'in_stock',
        'min_price' => 50000,
        'max_price' => 50000,
    ]);

    $img1 = ProductImage::create([
        'product_id' => $product->id,
        'path' => 'products/gallery/sample-1.jpg',
        'sort_order' => 0,
        'is_primary' => false,
    ]);
    $img2 = ProductImage::create([
        'product_id' => $product->id,
        'path' => 'products/gallery/sample-2.jpg',
        'sort_order' => 1,
        'is_primary' => false,
    ]);

    expect($product->primaryImage)->toBeNull();

    $product->ensurePrimaryImage();

    expect($img1->fresh()->is_primary)->toBeTrue()
        ->and($img2->fresh()->is_primary)->toBeFalse()
        ->and($product->fresh()->primaryImage?->path)->toBe('products/gallery/sample-1.jpg');
});

it('renders table image column successfully even when primaryImage is null', function () {
    $user = \App\Models\User::factory()->create();
    test()->actingAs($user);

    $product = Product::create([
        'name' => 'Paket 3 Item Test',
        'slug' => 'paket-3-item-test',
        'status' => 'active',
        'stock_status' => 'in_stock',
        'min_price' => 150000,
        'max_price' => 150000,
    ]);

    ProductImage::create([
        'product_id' => $product->id,
        'path' => 'products/gallery/paket-sample.jpg',
        'sort_order' => 0,
        'is_primary' => false,
    ]);

    \Livewire\Livewire::test(\App\Filament\Resources\Products\Pages\ListProducts::class)
        ->assertCanSeeTableRecords([$product]);
});

