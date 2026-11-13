<?php

use App\Filament\Pages\ManageDesktopMegaMenu;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Livewire\Livewire;

test('admin can view desktop mega menu settings page', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/admin/manage-desktop-mega-menu')
        ->assertSuccessful();
});

test('desktop mega menu settings livewire component mounts with default categories', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $component = Livewire::test(ManageDesktopMegaMenu::class);
    $component->assertSuccessful();

    $categories = array_values($component->get('data.desktop_mega_menu_categories'));
    expect($categories)->toBeArray()
        ->and(count($categories))->toBeGreaterThanOrEqual(8)
        ->and($categories[0]['name'])->toBe('Coffee');
});

test('admin can update desktop mega menu categories and changes are saved to setting', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $testData = [
        [
            'name' => 'Signature Coffee & Beans',
            'slug' => 'coffee',
            'url' => '/shop?category=coffee',
            'is_active' => true,
            'subcategories' => [
                [
                    'name' => 'Kopi Biji Spesialti',
                    'id' => 'coffee-beans',
                    'url' => '/shop?category=filter-beans',
                    'icon' => 'coffee-beans',
                    'is_active' => true,
                ],
            ],
        ],
    ];

    Livewire::test(ManageDesktopMegaMenu::class)
        ->set('data.desktop_mega_menu_categories', $testData)
        ->call('save')
        ->assertHasNoErrors();

    $saved = Setting::get('desktop_mega_menu_categories');
    expect($saved)->toBeArray()
        ->and($saved[0]['name'])->toBe('Signature Coffee & Beans')
        ->and($saved[0]['subcategories'][0]['name'])->toBe('Kopi Biji Spesialti');

    Cache::forget('sanubari_settings');

    $response = $this->get('/');
    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->where('desktopMegaMenuCategories.0.name', 'Signature Coffee & Beans')
        ->where('desktopMegaMenuCategories.0.subcategories.0.name', 'Kopi Biji Spesialti')
    );
});

test('admin can save subcategory with custom uploaded image', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $testData = [
        [
            'name' => 'Signature Coffee & Beans',
            'slug' => 'coffee',
            'url' => '/shop?category=coffee',
            'is_active' => true,
            'subcategories' => [
                [
                    'name' => 'Custom Cold Brew Special',
                    'id' => 'custom-cold-brew',
                    'url' => '/shop?category=cold-brew',
                    'visual_type' => 'image',
                    'image' => ['mega-menu/subcategories/sample-thumb.jpg'],
                    'icon' => 'cold-brew',
                    'is_active' => true,
                ],
            ],
        ],
    ];

    Livewire::test(ManageDesktopMegaMenu::class)
        ->set('data.desktop_mega_menu_categories', $testData)
        ->call('save')
        ->assertHasNoErrors();

    $saved = Setting::get('desktop_mega_menu_categories');
    expect($saved)->toBeArray()
        ->and($saved[0]['subcategories'][0]['visual_type'])->toBe('image')
        ->and($saved[0]['subcategories'][0]['image'])->toBe('mega-menu/subcategories/sample-thumb.jpg');

    Cache::forget('sanubari_settings');

    $response = $this->get('/');
    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->where('desktopMegaMenuCategories.0.subcategories.0.visual_type', 'image')
        ->where('desktopMegaMenuCategories.0.subcategories.0.image', 'mega-menu/subcategories/sample-thumb.jpg')
    );
});

test('desktop mega menu mounts existing saved categories with string image and can re-save', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    Setting::set('desktop_mega_menu_categories', [
        [
            'id' => 'coffee',
            'name' => 'Signature Coffee & Beans',
            'slug' => 'coffee',
            'url' => '/shop?category=coffee',
            'is_active' => true,
            'subcategories' => [
                [
                    'id' => 'custom-cold-brew',
                    'name' => 'Custom Cold Brew Special',
                    'url' => '/shop?category=cold-brew',
                    'visual_type' => 'image',
                    'image' => 'mega-menu/subcategories/sample-thumb.jpg',
                    'icon' => 'cold-brew',
                    'is_active' => true,
                ],
            ],
        ],
    ]);

    Storage::fake('public');
    Storage::disk('public')->put('mega-menu/subcategories/sample-thumb.jpg', 'fake-image-content');

    $comp = Livewire::test(ManageDesktopMegaMenu::class);
    $comp->assertSuccessful()
        ->call('save')
        ->assertHasNoErrors();

    $saved = Setting::get('desktop_mega_menu_categories');
    expect($saved[0]['subcategories'][0]['image'])->toBe('mega-menu/subcategories/sample-thumb.jpg');
});

test('admin can reset desktop mega menu categories to defaults', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $component = Livewire::test(ManageDesktopMegaMenu::class)
        ->call('resetToDefault')
        ->assertHasNoErrors();

    $categories = array_values($component->get('data.desktop_mega_menu_categories'));
    expect($categories)->toBeArray()
        ->and(count($categories))->toBe(9);
});

test('mobile categories page receives synchronized categories from navigation settings', function () {
    Setting::set('desktop_mega_menu_categories', [
        [
            'id' => 'special-coffee',
            'name' => 'Kopi Pilihan Kurasi',
            'slug' => 'special-coffee',
            'url' => '/shop?category=special-coffee',
            'is_active' => true,
            'subcategories' => [
                [
                    'id' => 'kawi-special',
                    'name' => 'Kawi Micro Ferment',
                    'url' => '/shop?category=kawi',
                    'icon' => 'coffee-beans',
                    'is_active' => true,
                ],
            ],
        ],
    ]);

    $response = $this->get('/kategori');
    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('categories/index')
        ->where('navCategories.0.name', 'Kopi Pilihan Kurasi')
        ->where('navCategories.0.subcategories.0.name', 'Kawi Micro Ferment')
    );
});

test('admin can set custom url on subcategories in desktop mega menu', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $testData = [
        [
            'name' => 'Signature Coffee',
            'slug' => 'signature-coffee',
            'url' => '/shop?category=coffee',
            'is_active' => true,
            'subcategories' => [
                [
                    'name' => 'Classic Process Custom Link',
                    'id' => 'classic-process',
                    'link_type' => 'custom',
                    'custom_url' => '/shop?category=classic-process&filter=specialty',
                    'icon' => 'coffee-beans',
                    'visual_type' => 'icon',
                    'is_active' => true,
                ],
                [
                    'name' => 'Preset Link Acara',
                    'id' => 'acara-workshop',
                    'link_type' => 'preset',
                    'preset_url' => '/acara',
                    'icon' => 'tea',
                    'visual_type' => 'icon',
                    'is_active' => true,
                ],
            ],
        ],
    ];

    Livewire::test(ManageDesktopMegaMenu::class)
        ->set('data.desktop_mega_menu_categories', $testData)
        ->call('save')
        ->assertHasNoErrors();

    $saved = Setting::get('desktop_mega_menu_categories');
    expect($saved)->toBeArray()
        ->and($saved[0]['subcategories'][0]['url'])->toBe('/shop?category=classic-process&filter=specialty')
        ->and($saved[0]['subcategories'][0]['link_type'])->toBe('custom')
        ->and($saved[0]['subcategories'][0]['custom_url'])->toBe('/shop?category=classic-process&filter=specialty')
        ->and($saved[0]['subcategories'][1]['url'])->toBe('/acara')
        ->and($saved[0]['subcategories'][1]['link_type'])->toBe('preset')
        ->and($saved[0]['subcategories'][1]['preset_url'])->toBe('/acara');
});
