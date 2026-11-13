<?php

use App\Filament\Pages\ManageSeriesSettings;
use App\Models\Product;
use App\Models\Setting;
use App\Models\User;
use Livewire\Livewire;

test('admin can access manage series settings page', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/admin/manage-series-settings')
        ->assertSuccessful();
});

test('series settings livewire component mounts and loads default series', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    Livewire::test(ManageSeriesSettings::class)
        ->assertSuccessful()
        ->assertSee('Gunung Kawi Terroir')
        ->assertSee('kawi');
});

test('admin can save custom series and Product model reflects new series options', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $customSeries = [
        [
            'name' => 'Signature Blend Roastery',
            'slug' => 'signature-blend',
            'description' => 'Blend khas racikan roaster Sanubari.',
            'badge_color' => 'indigo',
            'is_active' => true,
        ],
        [
            'name' => 'Single Origin Sumatra',
            'slug' => 'sumatra',
            'description' => 'Koleksi single origin dari daratan Sumatra.',
            'badge_color' => 'teal',
            'is_active' => true,
        ],
    ];

    Livewire::test(ManageSeriesSettings::class)
        ->assertSuccessful()
        ->set('data.series_list', $customSeries)
        ->call('save')
        ->assertHasNoErrors();

    $saved = Setting::get('product_series');
    expect($saved)->toBeArray();
    expect($saved[0]['slug'])->toBe('signature-blend');
    expect($saved[1]['slug'])->toBe('sumatra');

    // Verify Product::getSeriesOptions()
    $options = Product::getSeriesOptions();
    expect($options)->toHaveKey('signature-blend');
    expect($options['signature-blend'])->toBe('Signature Blend Roastery');
    expect($options)->toHaveKey('sumatra');
    expect($options['sumatra'])->toBe('Single Origin Sumatra');

    // Verify getSeriesLabel and getSeriesBadgeColor
    expect(Product::getSeriesLabel('signature-blend'))->toBe('Signature Blend Roastery');
    expect(Product::getSeriesBadgeColor('signature-blend'))->toBe('indigo');
});

test('inactive series are strictly excluded from product form options', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $customSeries = [
        [
            'name' => 'Filter Beans',
            'slug' => 'filter',
            'description' => 'Koleksi filter beans.',
            'badge_color' => 'amber',
            'is_active' => true,
        ],
        [
            'name' => 'Espresso Beans',
            'slug' => 'espresso',
            'description' => 'Koleksi espresso beans.',
            'badge_color' => 'emerald',
            'is_active' => true,
        ],
        [
            'name' => 'Robusta',
            'slug' => 'robusta',
            'description' => 'Koleksi robusta.',
            'badge_color' => 'purple',
            'is_active' => true,
        ],
        [
            'name' => 'Classic Series',
            'slug' => 'classic',
            'description' => 'Classic kopi.',
            'badge_color' => 'gray',
            'is_active' => false,
        ],
        [
            'name' => 'Gunung Kawi Terroir',
            'slug' => 'kawi',
            'description' => 'Kawi kopi.',
            'badge_color' => 'amber',
            'is_active' => false,
        ],
    ];

    Setting::set('product_series', $customSeries);

    $activeOptions = Product::getSeriesOptions(onlyActive: true, includeExistingValues: false);

    expect(array_keys($activeOptions))->toBe(['filter', 'espresso', 'robusta']);
    expect($activeOptions['filter'])->toBe('Filter Beans');
    expect($activeOptions['espresso'])->toBe('Espresso Beans');
    expect($activeOptions['robusta'])->toBe('Robusta');
    expect($activeOptions)->not->toHaveKey('classic');
    expect($activeOptions)->not->toHaveKey('kawi');
});

