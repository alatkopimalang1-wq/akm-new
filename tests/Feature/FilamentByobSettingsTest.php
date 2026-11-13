<?php

use App\Filament\Pages\ManageByobSettings;
use App\Models\Product;
use App\Models\Setting;
use App\Models\User;
use Livewire\Livewire;

test('admin can access manage byob settings page', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/admin/manage-byob-settings')
        ->assertSuccessful();
});

test('manage byob settings livewire component mounts and saves successfully', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $catalogCoffee = Product::create([
        'name' => 'Kawi Natural Specialty',
        'slug' => 'kawi-natural-specialty',
        'series' => 'kawi',
        'price_per_10g' => 3000,
        'min_price' => 75000,
        'max_price' => 75000,
        'status' => 'active',
    ]);

    Livewire::test(ManageByobSettings::class)
        ->assertSuccessful()
        ->set('data.hero_title', 'Studio Racik Blend Spesialti Sanubari')
        ->set('data.studio_title', 'Racik Rasio Kopi Kustom')
        ->set('data.default_ratio', 60)
        ->set('data.byob_beans', [
            [
                'product_id' => $catalogCoffee->id,
                'name' => 'Kawi Natural Specialty',
                'origin' => 'Gunung Kawi, Malang',
                'process' => 'Natural Anaerob',
                'price_per_10g' => 4500,
                'tasting_notes' => 'Strawberry, Brown Sugar, Chocolate',
                'is_active' => true,
            ],
            [
                'product_id' => null,
                'name' => 'Robusta Dampit Fine Grade',
                'origin' => 'Dampit, Malang',
                'process' => 'Full Washed',
                'price_per_10g' => 2200,
                'tasting_notes' => 'Dark Chocolate, Bold Body',
                'is_active' => true,
            ],
        ])
        ->set('data.byob_variants', [
            ['label' => '250g', 'weight_grams' => 250, 'discount_type' => 'percentage', 'discount_value' => 0, 'is_default' => true],
            ['label' => '500g', 'weight_grams' => 500, 'discount_type' => 'percentage', 'discount_value' => 7, 'is_default' => false],
            ['label' => '1 kg', 'weight_grams' => 1000, 'discount_type' => 'fixed', 'discount_value' => 25000, 'is_default' => false],
        ])
        ->call('save')
        ->assertHasNoErrors();

    // Verify settings persisted
    $saved = Setting::get('byob_settings');
    expect($saved)->toBeArray();
    expect($saved['hero_title'])->toBe('Studio Racik Blend Spesialti Sanubari');
    expect($saved['default_ratio'])->toBe(60);
    expect(count($saved['byob_beans']))->toBe(2);
    expect($saved['byob_variants'][1]['discount_value'])->toBe(7);
    expect($saved['byob_variants'][2]['discount_type'])->toBe('fixed');
    expect($saved['byob_variants'][2]['discount_value'])->toBe(25000);

    // Verify linked product price_per_10g was updated
    expect((float) $catalogCoffee->fresh()->price_per_10g)->toBe(4500.0);

    // Verify variants synced to base byob product
    $byobProduct = Product::where('slug', 'byob')->first();
    expect($byobProduct)->not->toBeNull();
    expect($byobProduct->variants()->where('weight_grams', 250)->exists())->toBeTrue();
});

test('public /shop/byob reflects admin customized byob settings and beans', function () {
    Setting::set('byob_settings', [
        'hero_title' => 'Judul Kustom Admin BYOB',
        'hero_description' => 'Deskripsi Kustom Admin BYOB',
        'default_ratio' => 80,
        'byob_beans' => [
            [
                'product_id' => null,
                'name' => 'Custom Bean Alpha',
                'origin' => 'Lereng Kawi',
                'process' => 'Honey',
                'price_per_10g' => 3800,
                'tasting_notes' => 'Honey, Citrus',
                'is_active' => true,
            ],
            [
                'product_id' => null,
                'name' => 'Custom Bean Beta',
                'origin' => 'Ijen Highland',
                'process' => 'Natural',
                'price_per_10g' => 2800,
                'tasting_notes' => 'Spices, Cocoa',
                'is_active' => true,
            ],
        ],
        'byob_variants' => [
            ['label' => '200g', 'weight_grams' => 200, 'is_default' => true],
        ],
    ]);

    $response = $this->get('/shop/byob');
    $response->assertSuccessful();

    // Verify Inertia props contain customized beans and settings
    $response->assertInertia(fn ($page) =>
        $page->component('shop/byob')
            ->where('byobSettings.hero_title', 'Judul Kustom Admin BYOB')
            ->where('byobSettings.default_ratio', 80)
            ->where('beans.0.name', 'Custom Bean Alpha')
            ->where('beans.0.price_per_10g', 3800)
    );
});

test('public /shop/byob orders packaging variants strictly matching admin dashboard order', function () {
    Setting::set('byob_settings', [
        'hero_title' => 'BYOB Custom Ordering Test',
        'byob_variants' => [
            ['label' => '1 kg Pouch', 'weight_grams' => 1000, 'is_default' => false],
            ['label' => '250g Pouch', 'weight_grams' => 250, 'is_default' => true],
            ['label' => '500g Pouch', 'weight_grams' => 500, 'is_default' => false],
        ],
    ]);

    $response = $this->get('/shop/byob');
    $response->assertSuccessful();

    $response->assertInertia(fn ($page) =>
        $page->component('shop/byob')
            ->where('byobProduct.variants.0.weight_grams', 1000)
            ->where('byobProduct.variants.0.label', '1 kg Pouch')
            ->where('byobProduct.variants.1.weight_grams', 250)
            ->where('byobProduct.variants.1.label', '250g Pouch')
            ->where('byobProduct.variants.2.weight_grams', 500)
            ->where('byobProduct.variants.2.label', '500g Pouch')
    );
});
