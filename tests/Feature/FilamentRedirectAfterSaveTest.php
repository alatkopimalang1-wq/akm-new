<?php

use App\Filament\Resources\Products\Pages\EditProduct;
use App\Filament\Resources\Products\ProductResource;
use App\Models\Product;
use App\Models\User;
use Livewire\Livewire;

test('edit product page redirects to previous dashboard url after clicking save changes', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $product = Product::create([
        'name' => 'Kopi Redirect Test',
        'slug' => 'kopi-redirect-test',
        'status' => 'active',
        'stock_status' => 'in_stock',
        'min_price' => 50000,
        'max_price' => 50000,
    ]);

    $previousUrl = url('/admin/products?tableSearch=kopi');

    $this->from($previousUrl);

    Livewire::withQueryParams([])
        ->test(EditProduct::class, ['record' => $product->getKey()])
        ->fillForm([
            'name' => 'Kopi Redirect Test Updated',
        ])
        ->call('save')
        ->assertHasNoFormErrors()
        ->assertRedirect($previousUrl);

    expect($product->fresh()->name)->toBe('Kopi Redirect Test Updated');
});

test('edit product page falls back to products index when previous url is current or empty', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $product = Product::create([
        'name' => 'Kopi Fallback Test',
        'slug' => 'kopi-fallback-test',
        'status' => 'active',
        'stock_status' => 'in_stock',
        'min_price' => 60000,
        'max_price' => 60000,
    ]);

    $editUrl = ProductResource::getUrl('edit', ['record' => $product]);
    $this->from($editUrl);

    $expectedIndexUrl = ProductResource::getUrl('index');

    Livewire::withQueryParams([])
        ->test(EditProduct::class, ['record' => $product->getKey()])
        ->fillForm([
            'name' => 'Kopi Fallback Test Updated',
        ])
        ->call('save')
        ->assertHasNoFormErrors()
        ->assertRedirect($expectedIndexUrl);

    expect($product->fresh()->name)->toBe('Kopi Fallback Test Updated');
});

test('edit category page redirects to previous dashboard url after clicking save changes', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $category = \App\Models\Category::create([
        'name' => 'Kategori Redirect Test',
        'slug' => 'kategori-redirect-test',
        'is_active' => true,
    ]);

    $previousUrl = url('/admin/categories');
    $this->from($previousUrl);

    Livewire::withQueryParams([])
        ->test(\App\Filament\Resources\Categories\Pages\EditCategory::class, ['record' => $category->getKey()])
        ->fillForm([
            'name' => [
                'id' => 'Kategori Redirect Test Updated',
            ],
        ])
        ->call('save')
        ->assertHasNoFormErrors()
        ->assertRedirect($previousUrl);

    expect($category->fresh()->name['id'])->toBe('Kategori Redirect Test Updated');
});

