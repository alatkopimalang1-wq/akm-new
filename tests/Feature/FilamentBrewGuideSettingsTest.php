<?php

use App\Filament\Pages\ManageBrewGuideSettings;
use App\Models\Setting;
use App\Models\User;
use Livewire\Livewire;

test('admin can access manage brew guide settings page', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/admin/manage-brew-guide-settings')
        ->assertSuccessful();
});

test('manage brew guide settings livewire component mounts and saves successfully', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    Livewire::test(ManageBrewGuideSettings::class)
        ->assertSuccessful()
        ->set('data.hero_badge', 'SANUBARI BREW LAB TEST')
        ->set('data.hero_title', 'Judul Kustom Panduan Seduh')
        ->set('data.hero_subtitle', 'Subjudul Kustom Panduan Seduh')
        ->set('data.v60_default_grams', 18)
        ->set('data.v60_default_ratio', 16)
        ->set('data.v60_timer_title', 'Stopwatch V60 Spesial')
        ->call('save')
        ->assertHasNoErrors();

    $saved = Setting::get('brew_guide_settings');
    expect($saved)->not->toBeNull();
    expect($saved['hero_badge'])->toBe('SANUBARI BREW LAB TEST');
    expect($saved['hero_title'])->toBe('Judul Kustom Panduan Seduh');
    expect($saved['v60_default_grams'])->toBe(18);
    expect($saved['v60_default_ratio'])->toBe(16);
    expect($saved['v60_timer_title'])->toBe('Stopwatch V60 Spesial');
});

test('public /panduan-seduh reflects admin brew guide settings', function () {
    Setting::set('brew_guide_settings', [
        'hero_badge' => 'SPECIALTY ROASTERY LAB',
        'hero_title' => 'Panduan Seduh Edisi Terbatas',
        'hero_subtitle' => 'Eksperimen ekstraksi rasa terbaik kopi Gunung Kawi.',
        'v60_default_grams' => 20,
        'v60_default_ratio' => 15.5,
        'v60_timer_title' => 'Timer V60 Eksklusif',
    ]);

    $response = $this->get('/panduan-seduh');
    $response->assertSuccessful();

    $response->assertInertia(function ($page) {
        $page->component('brew-guide/index')
            ->where('brewSettings.hero_badge', 'SPECIALTY ROASTERY LAB')
            ->where('brewSettings.hero_title', 'Panduan Seduh Edisi Terbatas')
            ->where('brewSettings.v60_default_grams', 20)
            ->where('brewSettings.v60_default_ratio', 15.5)
            ->where('brewSettings.v60_timer_title', 'Timer V60 Eksklusif');
    });
});
