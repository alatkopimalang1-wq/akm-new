<?php

use App\Filament\Pages\HalamanAwal\ManageReelsSettings;
use App\Filament\Resources\VideoReels\Pages\ListVideoReels;
use App\Models\Setting;
use App\Models\User;
use Livewire\Livewire;

test('admin can access video reels list page and open settings action', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/admin/video-reels')
        ->assertSuccessful()
        ->assertSee('Video Reels');
});

test('admin can save video reels title and description via header action in list page', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    Livewire::test(ListVideoReels::class)
        ->assertActionVisible('settings')
        ->callAction('settings', [
            'home_reels_title' => 'Video Reels Edukasi Sanubari',
            'home_reels_subtitle' => 'Pelajari kalibrasi grinder, ekstraksi espresso, dan resep pour over harian.',
            'home_reels_view_all_text' => 'Buka Semua Video',
            'home_reels_view_all_url' => '/video',
        ])
        ->assertHasNoActionErrors();

    expect(Setting::get('home_reels_title'))->toBe('Video Reels Edukasi Sanubari');
    expect(Setting::get('home_reels_subtitle'))->toBe('Pelajari kalibrasi grinder, ekstraksi espresso, dan resep pour over harian.');
    expect(Setting::get('home_reels_view_all_text'))->toBe('Buka Semua Video');
});

test('admin can manage reels settings via dedicated manage reels settings page', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $this->get('/admin/manage-reels-settings')
        ->assertSuccessful()
        ->assertSee('Pengaturan Judul & Deskripsi Video Reels');

    Livewire::test(ManageReelsSettings::class)
        ->assertSuccessful()
        ->fillForm([
            'home_reels_title' => 'Sorotan Video Barista Sanubari',
            'home_reels_subtitle' => 'Eksplorasi teknik seduh dan bedah mesin kopi artisan Malang.',
            'home_reels_view_all_text' => 'Lihat Video',
            'home_reels_view_all_url' => '/video',
            'reels_page_title' => 'Galeri Video Reels Sanubari',
            'reels_page_description' => 'Koleksi video tutorial dan ulasan kopi resmi Sanubari Roastery di Instagram.',
        ])
        ->call('save')
        ->assertHasNoFormErrors();

    expect(Setting::get('home_reels_title'))->toBe('Sorotan Video Barista Sanubari');
    expect(Setting::get('home_reels_subtitle'))->toBe('Eksplorasi teknik seduh dan bedah mesin kopi artisan Malang.');
    expect(Setting::get('reels_page_title'))->toBe('Galeri Video Reels Sanubari');
});

test('home page and video reels page render custom configured title and description', function () {
    Setting::set('home_reels_title', 'Video Reels Sangrai & Seduh');
    Setting::set('home_reels_subtitle', 'Tonton ulasan mesin komersial dan teknik ekstraksi manual brew.');
    Setting::set('home_reels_view_all_text', 'Buka Semua Tayangan');
    Setting::set('reels_page_title', 'Semua Video Reels Sanubari');
    Setting::set('reels_page_description', 'Koleksi lengkap panduan seduh dan video kopi Sanubari.');

    // Check Home page
    $responseHome = $this->get('/');
    $responseHome->assertSuccessful();
    $responseHome->assertSee('Video Reels Sangrai & Seduh', escape: false);
    $responseHome->assertSee('Tonton ulasan mesin komersial dan teknik ekstraksi manual brew.', escape: false);
    $responseHome->assertSee('Buka Semua Tayangan', escape: false);

    // Check /video page
    $responseVideo = $this->get('/video');
    $responseVideo->assertSuccessful();
    $responseVideo->assertSee('Semua Video Reels Sanubari', escape: false);
    $responseVideo->assertSee('Koleksi lengkap panduan seduh dan video kopi Sanubari.', escape: false);
});

