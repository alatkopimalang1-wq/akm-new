<?php

use App\Filament\Resources\Categories\Pages\CreateCategory;
use App\Filament\Resources\Categories\Pages\EditCategory;
use App\Filament\Resources\Categories\Pages\ListCategories;
use App\Models\Category;
use App\Models\User;
use App\Support\IconCatalog;
use Filament\Support\Icons\Heroicon;
use Livewire\Livewire;

test('icon catalog returns curated options and heroicon enums', function () {
    $options = IconCatalog::options();

    expect($options)->toBeArray()->not->toBeEmpty();
    expect($options)->toHaveKey('Kopi & Minuman');
    expect($options['Kopi & Minuman'])->toHaveKey('coffee');
    expect($options['Kopi & Minuman'])->toHaveKey('droplet');

    expect(IconCatalog::getPrefixIcon('coffee'))->toBeInstanceOf(Heroicon::class);
    expect(IconCatalog::getPrefixIcon('flame'))->toBe(Heroicon::Fire);
    expect(IconCatalog::getPrefixIcon('mountain'))->toBe(Heroicon::GlobeAsiaAustralia);
    expect(IconCatalog::getPrefixIcon(null))->toBe(Heroicon::Tag);
    expect(IconCatalog::getPrefixIcon('unknown-custom-key'))->toBe(Heroicon::Tag);
});

test('category resource pages render with icon selector and icon table column', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $category = Category::create([
        'name' => ['id' => 'Espresso Beans', 'en' => 'Espresso Beans'],
        'slug' => 'espresso-beans-test',
        'type' => 'espresso',
        'icon' => 'flame',
        'sort_order' => 1,
    ]);

    // List categories
    Livewire::test(ListCategories::class)
        ->assertSuccessful()
        ->assertCanSeeTableRecords([$category]);

    // Create category page
    Livewire::test(CreateCategory::class)
        ->assertSuccessful()
        ->assertFormFieldExists('icon');

    // Edit category page
    Livewire::test(EditCategory::class, ['record' => $category->getKey()])
        ->assertSuccessful()
        ->assertFormFieldExists('icon');
});

test('category icon can be saved and updated through livewire', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $category = Category::create([
        'name' => ['id' => 'Filter Roastery', 'en' => 'Filter Roastery'],
        'slug' => 'filter-roastery',
        'type' => 'filter',
        'icon' => 'droplet',
        'sort_order' => 2,
    ]);

    Livewire::test(EditCategory::class, ['record' => $category->getKey()])
        ->set('data.icon', 'mountain')
        ->call('save')
        ->assertHasNoErrors();

    $category->refresh();
    expect($category->icon)->toBe('mountain');
});

test('welcome page receives categories with their configured icons', function () {
    Category::create([
        'name' => ['id' => 'Koleksi Kawi', 'en' => 'Kawi Collection'],
        'slug' => 'kawi-collection',
        'type' => 'brand',
        'icon' => 'mountain',
        'sort_order' => 1,
    ]);

    $response = $this->get('/');
    $response->assertSuccessful();

    $response->assertInertia(fn ($page) => $page
        ->component('welcome')
        ->has('categories')
    );
});
