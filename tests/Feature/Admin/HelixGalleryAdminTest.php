<?php

use App\Models\Setting;
use App\Models\User;

test('unauthenticated users cannot access helix gallery dashboard', function () {
    $response = $this->get('/dashboard/helix-gallery');
    $response->assertRedirect('/login');
});

test('authenticated users can view helix gallery dashboard', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get('/dashboard/helix-gallery');
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('dashboard/helix-gallery'));
});

test('admin can update helix gallery rotation and grid settings', function () {
    $user = User::factory()->create();

    $payload = [
        'auto_rotate' => true,
        'auto_rotate_speed' => 0.35,
        'visible_columns' => 6,
        'tiers_count' => 2,
        'show_header' => false,
        'badge' => 'Galeri Kawi 3D',
        'title' => 'Galeri Biji Sangrai Kawi',
        'subtitle' => 'Pilihan kurasi kopi Gunung Kawi.',
    ];

    $response = $this->actingAs($user)->post('/dashboard/helix-gallery/settings', $payload);
    $response->assertRedirect();

    expect((int) Setting::get('home_helix_visible_columns'))->toBe(6);
    expect((float) Setting::get('home_helix_auto_rotate_speed'))->toBe(0.35);
    expect((bool) Setting::get('home_helix_auto_rotate'))->toBeTrue();
    expect((bool) Setting::get('home_helix_show_header'))->toBeFalse();
});

test('admin can add an image to helix gallery', function () {
    $user = User::factory()->create();

    $payload = [
        'image' => 'https://example.com/gallery-photo-1.jpg',
        'sort_order' => 1,
        'is_active' => true,
    ];

    $response = $this->actingAs($user)->post('/dashboard/helix-gallery/items', $payload);
    $response->assertRedirect();

    $items = Setting::get('home_helix_gallery_items', []);
    expect($items)->toBeArray();
    $lastItem = end($items);
    expect($lastItem['image'])->toBe('https://example.com/gallery-photo-1.jpg');
    expect($lastItem['is_active'])->toBeTrue();
});

test('admin can edit an item in helix gallery', function () {
    $user = User::factory()->create();

    // Seed an item
    Setting::set('home_helix_gallery_items', [
        [
            'id' => 'test-item-1',
            'image' => 'https://example.com/old-image.jpg',
            'is_active' => true,
            'sort_order' => 1,
        ],
    ]);

    $updatePayload = [
        'image' => 'https://example.com/new-image.jpg',
        'is_active' => true,
        'sort_order' => 2,
    ];

    $response = $this->actingAs($user)->put('/dashboard/helix-gallery/items/test-item-1', $updatePayload);
    $response->assertRedirect();

    $items = Setting::get('home_helix_gallery_items', []);
    expect($items[0]['image'])->toBe('https://example.com/new-image.jpg');
    expect($items[0]['sort_order'])->toBe(2);
});

test('admin can delete an item from helix gallery', function () {
    $user = User::factory()->create();

    // Seed 2 items
    Setting::set('home_helix_gallery_items', [
        [
            'id' => 'item-to-keep',
            'title' => 'Produk Tetap Ada',
        ],
        [
            'id' => 'item-to-delete',
            'title' => 'Produk Akan Dihapus',
        ],
    ]);

    $response = $this->actingAs($user)->delete('/dashboard/helix-gallery/items/item-to-delete');
    $response->assertRedirect();

    $items = Setting::get('home_helix_gallery_items', []);
    expect(count($items))->toBe(1);
    expect($items[0]['id'])->toBe('item-to-keep');
});

test('admin can reset helix gallery items to default 20 items', function () {
    $user = User::factory()->create();

    // Set 1 custom item
    Setting::set('home_helix_gallery_items', [
        ['id' => 'only-one', 'title' => 'Satu Saja'],
    ]);

    $response = $this->actingAs($user)->post('/dashboard/helix-gallery/reset');
    $response->assertRedirect();

    $items = Setting::get('home_helix_gallery_items', []);
    expect(count($items))->toBe(20);
});

test('admin can access filament helix gallery page', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get('/admin/manage-helix-gallery');
    $response->assertOk();
});

test('filament helix gallery page populates image_file from stored storage paths', function () {
    \Illuminate\Support\Facades\Storage::fake('public');
    \Illuminate\Support\Facades\Storage::disk('public')->put('helix-gallery/sample-photo.jpg', 'fake-image-content');

    $user = User::factory()->create();

    Setting::set('home_helix_gallery_items', [
        [
            'id' => 'item-1',
            'image' => '/storage/helix-gallery/sample-photo.jpg',
            'sort_order' => 1,
            'is_active' => true,
        ],
        [
            'id' => 'item-2',
            'image' => 'https://external-domain.com/photo.jpg',
            'sort_order' => 2,
            'is_active' => true,
        ],
    ]);

    $testable = \Livewire\Livewire::actingAs($user)
        ->test(\App\Filament\Pages\HalamanAwal\ManageHelixGallery::class)
        ->assertOk();

    $items = array_values($testable->get('data.home_helix_gallery_items'));
    expect($items)->toBeArray();
    expect($items[0]['image_file'])->not->toBeEmpty();
    expect($items[0]['image'])->toBeNull();
    expect($items[1]['image_file'])->toBeEmpty();
    expect($items[1]['image'])->toBe('https://external-domain.com/photo.jpg');
});

test('filament helix gallery page saves image_file back to storage path', function () {
    \Illuminate\Support\Facades\Storage::fake('public');
    \Illuminate\Support\Facades\Storage::disk('public')->put('helix-gallery/uploaded-photo.jpg', 'fake-image-content');

    $user = User::factory()->create();

    \Livewire\Livewire::actingAs($user)
        ->test(\App\Filament\Pages\HalamanAwal\ManageHelixGallery::class)
        ->fillForm([
            'home_helix_gallery_items' => [
                [
                    'id' => 'item-new',
                    'image_file' => ['test-uuid' => 'helix-gallery/uploaded-photo.jpg'],
                    'image' => null,
                    'sort_order' => 1,
                    'is_active' => true,
                ],
            ],
        ])
        ->call('save')
        ->assertHasNoFormErrors();

    $saved = Setting::get('home_helix_gallery_items');
    expect($saved)->toBeArray();
    expect($saved[0]['image'])->toBe('/storage/helix-gallery/uploaded-photo.jpg');
});


