<?php

use App\Filament\Resources\Products\Pages\ListProducts;
use App\Filament\Resources\Products\ProductResource;
use App\Models\Product;
use App\Models\User;
use Livewire\Livewire;

test('product resource eloquent query excludes byob product', function () {
    $regularProduct = Product::create([
        'name' => 'Kawi Fullwash Test',
        'slug' => 'kawi-fullwash-test',
        'series' => 'kawi',
        'status' => 'active',
        'min_price' => 85000,
        'max_price' => 110000,
    ]);

    $byobProduct = Product::create([
        'name' => 'C.Y.B.R: Customize Your Blend Ratio',
        'slug' => 'byob',
        'series' => 'custom-blend',
        'status' => 'published',
        'min_price' => 0,
        'max_price' => 0,
    ]);

    $queriedIds = ProductResource::getEloquentQuery()->pluck('id')->all();

    expect($queriedIds)->toContain($regularProduct->id);
    expect($queriedIds)->not->toContain($byobProduct->id);
});

test('admin products list table never displays byob system product', function () {
    $user = User::factory()->create();

    $regularProduct = Product::create([
        'name' => 'Arabika Island of God Test',
        'slug' => 'arabika-island-of-god-test',
        'series' => 'kawi',
        'status' => 'active',
        'min_price' => 95000,
        'max_price' => 130000,
    ]);

    $byobProduct = Product::create([
        'name' => 'C.Y.B.R: Customize Your Blend Ratio',
        'slug' => 'byob',
        'series' => 'custom-blend',
        'status' => 'published',
        'min_price' => 0,
        'max_price' => 0,
    ]);

    Livewire::actingAs($user)
        ->test(ListProducts::class)
        ->assertCanSeeTableRecords([$regularProduct])
        ->assertCanNotSeeTableRecords([$byobProduct]);
});
