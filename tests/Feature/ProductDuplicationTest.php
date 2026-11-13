<?php

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use App\Models\User;
use Livewire\Livewire;
use App\Filament\Resources\Products\Pages\ListProducts;
use App\Filament\Resources\Products\Pages\EditProduct;

test('product can be duplicated with all variants, images, and categories', function () {
    $product = Product::create([
        'name' => 'Original Coffee Blend',
        'slug' => 'original-coffee-blend',
        'series' => 'kawi',
        'stock_status' => 'in_stock',
        'status' => 'active',
        'min_price' => 95000,
        'max_price' => 380000,
    ]);

    $category = Category::create(['name' => 'Filter Beans', 'slug' => 'filter-beans']);
    $product->categories()->attach($category->id);

    $v1 = ProductVariant::create([
        'product_id' => $product->id,
        'label' => '200g',
        'weight_grams' => 200,
        'price' => 95000,
        'sku' => 'ORIG-200G',
    ]);

    $v2 = ProductVariant::create([
        'product_id' => $product->id,
        'label' => '1kg',
        'weight_grams' => 1000,
        'price' => 380000,
        'sku' => 'ORIG-1KG',
    ]);

    $img = ProductImage::create([
        'product_id' => $product->id,
        'path' => 'products/gallery/sample.jpg',
        'is_primary' => true,
        'sort_order' => 1,
    ]);

    $product->syncPricesFromVariants();

    $newProduct = $product->duplicate('Original Coffee Blend (Salinan)');

    expect($newProduct->id)->not->toBe($product->id)
        ->and($newProduct->name)->toBe('Original Coffee Blend (Salinan)')
        ->and($newProduct->slug)->toBe('original-coffee-blend-salinan')
        ->and($newProduct->series)->toBe('kawi')
        ->and($newProduct->is_new)->toBeTrue()
        ->and($newProduct->stock_status)->toBe('in_stock')
        ->and($newProduct->categories)->toHaveCount(1)
        ->and($newProduct->categories->first()->id)->toBe($category->id)
        ->and($newProduct->variants)->toHaveCount(2)
        ->and($newProduct->images)->toHaveCount(1)
        ->and($newProduct->min_price)->toBe(95000.0)
        ->and($newProduct->max_price)->toBe(380000.0);
});

test('admin can duplicate product via list products table action', function () {
    $admin = User::factory()->create();
    $product = Product::create([
        'name' => 'Toraja Sapan Washed',
        'slug' => 'toraja-sapan-washed',
        'series' => 'kawi',
        'stock_status' => 'in_stock',
        'status' => 'active',
    ]);

    $this->actingAs($admin);

    Livewire::test(ListProducts::class)
        ->callTableAction('duplicate', $product, data: [
            'name' => 'Toraja Sapan Washed (Batch Baru)',
            'slug' => 'toraja-sapan-washed-batch-baru',
        ])
        ->assertHasNoTableActionErrors();

    expect(Product::where('slug', 'toraja-sapan-washed-batch-baru')->exists())->toBeTrue();
});

test('admin can duplicate product via edit product header action', function () {
    $admin = User::factory()->create();
    $product = Product::create([
        'name' => 'Aceh Gayo Wine',
        'slug' => 'aceh-gayo-wine',
        'series' => 'kawi',
        'stock_status' => 'in_stock',
        'status' => 'active',
    ]);

    $this->actingAs($admin);

    Livewire::test(EditProduct::class, ['record' => $product->id])
        ->callAction('duplicate', data: [
            'name' => 'Aceh Gayo Wine (Duplikat)',
            'slug' => 'aceh-gayo-wine-duplikat',
        ])
        ->assertHasNoActionErrors();

    expect(Product::where('slug', 'aceh-gayo-wine-duplikat')->exists())->toBeTrue();
});
