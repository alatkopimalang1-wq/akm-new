<?php

use App\Models\Setting;
use App\Models\User;
use Livewire\Livewire;

test('public booking tempat page returns successful response with inertia component', function () {
    $response = $this->get('/booking-tempat');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('booking')
        ->has('page')
        ->where('page.hero_badge', 'Reservasi & Sewa Tempat di Sanubari Roastery')
    );
});

test('public booking aliases work correctly', function () {
    $this->get('/booking')
        ->assertStatus(200)
        ->assertInertia(fn ($page) => $page->component('booking'));

    $this->get('/sewa-tempat')
        ->assertStatus(200)
        ->assertInertia(fn ($page) => $page->component('booking'));
});

test('english space booking page returns 200 with en locale', function () {
    $response = $this->get('/en/booking');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('booking')
        ->where('locale', 'en')
    );
});

test('booking page contains all 4 requested core benefits', function () {
    $response = $this->get('/booking-tempat');

    $response->assertStatus(200);

    // Verify the 4 mandatory benefits requested by the user
    $response->assertInertia(fn ($page) => $page
        ->component('booking')
        ->has('page.benefits', 4)
        ->where('page.benefits.0.title', 'Muat Hingga Lebih dari 50 Orang')
        ->where('page.benefits.1.title', 'Free Proyektor')
        ->where('page.benefits.2.title', 'Free Sound System')
        ->where('page.benefits.3.title', 'Cukup dengan Minimum Spent Ngopi di Sanubari')
    );
});

test('booking page supports custom settings saved by admin', function () {
    Setting::set('page_booking_tempat', [
        'hero_title' => 'Custom Sewa Tempat Sanubari Test',
        'whatsapp_number' => '6289999999999',
    ]);

    $response = $this->get('/booking-tempat');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('booking')
        ->where('page.hero_title', 'Custom Sewa Tempat Sanubari Test')
        ->where('page.whatsapp_number', '6289999999999')
    );
});

test('admin can manage booking tempat page settings via filament ManageContentPages', function () {
    $user = \App\Models\User::factory()->create();
    $this->actingAs($user);

    \Livewire\Livewire::test(\App\Filament\Pages\ManageContentPages::class)
        ->assertSuccessful()
        ->set('data.booking_hero_title', 'Sewa Tempat Komunitas Spesial Malang')
        ->set('data.booking_hero_badge', 'Pesan Tempat Eksklusif')
        ->set('data.booking_whatsapp_number', '6281199887766')
        ->set('data.booking_benefits', [
            [
                'title' => 'Muat Hingga 60 Orang',
                'badge' => 'Kapasitas Super Luas',
                'description' => 'Bisa untuk gathering besar dan seminar.',
                'is_highlight' => false,
            ],
            [
                'title' => 'Free Proyektor HD',
                'badge' => 'Fasilitas Gratis',
                'description' => 'Proyektor definisi tinggi siap pakai.',
                'is_highlight' => false,
            ],
        ])
        ->set('data.booking_facilities', [
            ['icon' => 'wind', 'title' => 'Full AC & Dingin', 'description' => 'Suhu sejuk maksimal.'],
            ['icon' => 'wifi', 'title' => 'Wi-Fi 100 Mbps', 'description' => 'Koneksi kencang.'],
        ])
        ->set('data.booking_gallery_images', [
            ['image_upload' => null, 'image_url' => 'https://images.unsplash.com/photo-test-1', 'caption' => 'Ruang Utama'],
        ])
        ->set('data.booking_event_types', [
            ['name' => 'Workshop & Pelatihan'],
            ['name' => 'Nobar Film'],
        ])
        ->call('save')
        ->assertHasNoErrors();

    $saved = Setting::get('page_booking_tempat');
    expect($saved)->toBeArray();
    expect($saved['hero_title'])->toBe('Sewa Tempat Komunitas Spesial Malang');
    expect($saved['hero_badge'])->toBe('Pesan Tempat Eksklusif');
    expect($saved['whatsapp_number'])->toBe('6281199887766');
    expect($saved['benefits'])->toHaveCount(2);
    expect($saved['facilities'])->toHaveCount(2);
    expect($saved['facilities'][0]['icon'])->toBe('wind');
    expect($saved['facilities'][1]['icon'])->toBe('wifi');
    expect($saved['gallery_images'])->toHaveCount(1);
    expect($saved['event_types'])->toContain('Workshop & Pelatihan', 'Nobar Film');

    // Verify public page reflects these changes
    $response = $this->get('/booking-tempat');
    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('booking')
        ->where('page.hero_title', 'Sewa Tempat Komunitas Spesial Malang')
        ->where('page.whatsapp_number', '6281199887766')
        ->has('page.benefits', 2)
        ->has('page.facilities', 2)
    );
});

test('admin can manage home booking banner settings via filament ManageBookingBanner', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    Livewire::test(\App\Filament\Pages\HalamanAwal\ManageBookingBanner::class)
        ->assertSuccessful()
        ->set('data.home_booking_banner_enable', true)
        ->set('data.home_booking_banner_badge', 'Venue Reservasi')
        ->set('data.home_booking_banner_title', 'Sewa Tempat Komunitas di Sanubari')
        ->set('data.home_booking_banner_desc', 'Fasilitas lengkap untuk segala kebutuhan acara.')
        ->set('data.home_booking_banner_button', 'Pesan Sekarang')
        ->set('data.home_booking_banner_image_url', 'https://images.unsplash.com/photo-custom')
        ->set('data.home_booking_banner_href', '/booking-tempat')
        ->call('save')
        ->assertHasNoErrors();

    expect(Setting::get('home_booking_banner_badge'))->toBe('Venue Reservasi');
    expect(Setting::get('home_booking_banner_title'))->toBe('Sewa Tempat Komunitas di Sanubari');
    expect(Setting::get('home_booking_banner_desc'))->toBe('Fasilitas lengkap untuk segala kebutuhan acara.');
    expect(Setting::get('home_booking_banner_button'))->toBe('Pesan Sekarang');
    expect(Setting::get('home_booking_banner_image'))->toBe('https://images.unsplash.com/photo-custom');
});

