<?php

use App\Models\Setting;
use App\Models\User;
use Livewire\Livewire;
use App\Filament\Pages\ManageContentPages;

test('public coffee catering page returns successful response with inertia component', function () {
    $response = $this->get('/coffee-catering');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('coffee-catering')
        ->has('page')
        ->where('page.hero_badge', 'Live Espresso Bar & Coffee Catering')
    );
});

test('public coffee catering aliases work correctly', function () {
    $this->get('/catering')
        ->assertStatus(200)
        ->assertInertia(fn ($page) => $page->component('coffee-catering'));

    $this->get('/catering-kopi')
        ->assertStatus(200)
        ->assertInertia(fn ($page) => $page->component('coffee-catering'));
});

test('english coffee catering page returns 200 with en locale', function () {
    $response = $this->get('/en/coffee-catering');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('coffee-catering')
        ->where('locale', 'en')
    );

    $this->get('/en/catering')
        ->assertStatus(200)
        ->assertInertia(fn ($page) => $page->component('coffee-catering'));
});

test('coffee catering page contains minimum order 200 cup and on-site service', function () {
    $response = $this->get('/coffee-catering');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('coffee-catering')
        ->where('page.minimum_order_cups', '200')
        ->has('page.benefits', 4)
        ->where('page.benefits.0.title', 'Minimum Order 200 Cup')
        ->where('page.benefits.1.title', 'Pelayanan Langsung di Tempat Acara')
    );
});

test('coffee catering page contains all 4 requested occasions (wedding, kantor, seminar, keluarga)', function () {
    $response = $this->get('/coffee-catering');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('coffee-catering')
        ->has('page.occasions', 4)
        ->where('page.occasions.0.name', 'Wedding & Resepsi Pernikahan')
        ->where('page.occasions.1.name', 'Acara Kantor & Corporate Gathering')
        ->where('page.occasions.2.name', 'Acara Seminar & Konferensi')
        ->where('page.occasions.3.name', 'Acara Keluarga & Private Party')
    );
});

test('coffee catering page supports custom settings saved by admin', function () {
    Setting::set('page_coffee_catering', [
        'hero_title' => 'Custom Specialty Coffee Catering Sanubari Test',
        'whatsapp_number' => '6287776665554',
    ]);

    $response = $this->get('/coffee-catering');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('coffee-catering')
        ->where('page.hero_title', 'Custom Specialty Coffee Catering Sanubari Test')
        ->where('page.whatsapp_number', '6287776665554')
    );
});

test('admin can manage coffee catering settings via filament ManageContentPages', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    Livewire::test(ManageContentPages::class)
        ->assertSuccessful()
        ->set('data.catering_hero_title', 'Live Coffee Bar Sanubari Malang')
        ->set('data.catering_hero_badge', 'Specialty Coffee On-Site')
        ->set('data.catering_whatsapp_number', '6281234567899')
        ->set('data.catering_minimum_order_cups', '250')
        ->set('data.catering_benefits', [
            [
                'title' => 'Min. Order 200 Cup',
                'badge' => 'Skala Acara',
                'description' => 'Fleksibel untuk berbagai ukuran acara.',
                'is_highlight' => false,
            ],
            [
                'title' => 'Barista On-Site',
                'badge' => 'Live Serving',
                'description' => 'Disajikan segar di tempat.',
                'is_highlight' => true,
            ],
        ])
        ->set('data.catering_occasions', [
            [
                'name' => 'Wedding & Resepsi',
            ],
            [
                'name' => 'Acara Kantor & Seminar',
            ],
        ])
        ->set('data.catering_gallery_images', [
            ['image_upload' => null, 'image_url' => 'https://images.unsplash.com/photo-catering-test', 'caption' => 'Live Espresso Bar Wedding'],
        ])
        ->call('save')
        ->assertHasNoErrors();

    $saved = Setting::get('page_coffee_catering');
    expect($saved)->toBeArray();
    expect($saved['hero_title'])->toBe('Live Coffee Bar Sanubari Malang');
    expect($saved['hero_badge'])->toBe('Specialty Coffee On-Site');
    expect($saved['whatsapp_number'])->toBe('6281234567899');
    expect($saved['minimum_order_cups'])->toBe('250');
    expect($saved['benefits'])->toHaveCount(2);
    expect($saved['occasions'])->toHaveCount(2);
    expect($saved['gallery_images'])->toHaveCount(1);

    // Verify public page reflects these updates
    $response = $this->get('/coffee-catering');
    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('coffee-catering')
        ->where('page.hero_title', 'Live Coffee Bar Sanubari Malang')
        ->where('page.whatsapp_number', '6281234567899')
        ->has('page.benefits', 2)
        ->has('page.occasions', 2)
    );
});

