<?php

use App\Filament\Resources\Events\Pages\CreateEvent;
use App\Filament\Resources\Events\Pages\EditEvent;
use App\Filament\Resources\Events\Pages\ListEvents;
use App\Filament\Resources\Events\EventResource;
use App\Models\Event;
use App\Models\User;
use Livewire\Livewire;

test('admin can view the event management list page in admin panel', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/admin/events')
        ->assertSuccessful()
        ->assertSee('Acara & Workshop');
});

test('admin can access create event page', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/admin/events/create')
        ->assertSuccessful()
        ->assertSee('Informasi Utama Acara & Workshop');
});

test('admin can create a new event and see it on public acara page', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $startsAt = now()->addDays(5)->setTime(14, 0)->format('Y-m-d H:i:s');
    $endsAt = now()->addDays(5)->setTime(16, 30)->format('Y-m-d H:i:s');

    Livewire::test(CreateEvent::class)
        ->fillForm([
            'title' => ['id' => 'Workshop Sensory Cupping & Kalibrasi Roaster'],
            'slug' => 'workshop-sensory-cupping-malang',
            'category' => 'Cupping Session',
            'status' => 'open',
            'description' => ['id' => 'Sesi kalibrasi sensori cita rasa kopi Jawa Timur bersama Head Roaster Sanubari.'],
            'starts_at' => $startsAt,
            'ends_at' => $endsAt,
            'location' => 'Sanubari Roastery Lab, Malang',
            'address' => 'Jl. Terusan Kawi No. 12, Klojen, Malang',
            'fee' => 75000,
            'capacity' => 12,
            'whatsapp_register_text' => 'Halo Sanubari, saya mau daftar Sensory Cupping Malang.',
        ])
        ->call('create')
        ->assertHasNoFormErrors();

    $event = Event::where('slug', 'workshop-sensory-cupping-malang')->first();
    expect($event)->not->toBeNull();
    expect($event->type)->toBe('event');
    expect($event->fee)->toBe(75000.0);
    expect($event->capacity)->toBe(12);
    expect($event->location)->toBe('Sanubari Roastery Lab, Malang');

    // Public /acara page test
    $response = $this->get('/acara');
    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('events/index')
        ->where('upcoming', fn ($list) => collect($list)->pluck('slug')->contains('workshop-sensory-cupping-malang'))
    );
});

test('admin can update an event and mark as full or completed', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $event = Event::create([
        'title' => ['id' => 'Latte Art Mastery Class'],
        'slug' => 'latte-art-mastery-test',
        'category' => 'Workshop Seduh',
        'status' => 'open',
        'description' => ['id' => 'Kelas intensif teknik steaming dan pouring latte art.'],
        'starts_at' => now()->addDays(3)->setTime(10, 0),
        'ends_at' => now()->addDays(3)->setTime(13, 0),
        'location' => 'Sanubari Studio',
        'fee' => 150000,
        'capacity' => 8,
    ]);

    Livewire::test(EditEvent::class, ['record' => $event->getKey()])
        ->fillForm([
            'status' => 'full',
            'fee' => 175000,
        ])
        ->call('save')
        ->assertHasNoFormErrors();

    $event->refresh();
    expect($event->status)->toBe('full');
    expect($event->fee)->toBe(175000.0);

    // Verify on public page
    $response = $this->get('/acara');
    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('events/index')
        ->where('upcoming.0.status', 'full')
    );
});

test('past events appear in past events archive section on public acara page', function () {
    $pastEvent = Event::create([
        'title' => ['id' => 'Kawi Harvest Cupping 2025'],
        'slug' => 'kawi-harvest-cupping-past',
        'category' => 'Cupping Session',
        'status' => 'completed',
        'description' => ['id' => 'Cupping hasil panen perdana musim lalu.'],
        'starts_at' => now()->subDays(10)->setTime(15, 0),
        'ends_at' => now()->subDays(10)->setTime(17, 0),
        'location' => 'Sanubari Roastery Lab',
        'fee' => 0,
        'capacity' => 20,
    ]);

    $response = $this->get('/acara');
    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page
        ->component('events/index')
        ->where('past', fn ($list) => collect($list)->pluck('slug')->contains('kawi-harvest-cupping-past'))
    );
});

test('admin can create walk-in events without registration like live music, live dj, and stand sanubari', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $startsAt = now()->addDays(2)->setTime(19, 0)->format('Y-m-d H:i:s');
    $endsAt = now()->addDays(2)->setTime(22, 0)->format('Y-m-d H:i:s');

    Livewire::test(CreateEvent::class)
        ->fillForm([
            'title' => ['id' => 'Saturday Acoustic Night: Coffee & Songs'],
            'slug' => 'saturday-acoustic-night',
            'category' => 'Live Music',
            'meta' => [
                'entry_type' => 'walk_in',
                'walk_in_badge' => 'Bebas Masuk • Langsung Datang',
                'action_button_text' => 'Buka Petunjuk Arah',
                'maps_url' => 'https://maps.app.goo.gl/example',
            ],
            'status' => 'open',
            'description' => ['id' => 'Malam minggu santai ditemani alunan musik akustik dan racikan filter coffee andalan.'],
            'starts_at' => $startsAt,
            'ends_at' => $endsAt,
            'location' => 'Sanubari Slow Bar, Malang',
            'address' => 'Jl. Terusan Kawi No. 12, Klojen, Malang',
            'fee' => 0,
        ])
        ->call('create')
        ->assertHasNoFormErrors();

    $event = Event::where('slug', 'saturday-acoustic-night')->first();
    expect($event)->not->toBeNull();
    expect($event->category)->toBe('Live Music');
    expect($event->meta['entry_type'])->toBe('walk_in');

    $res = $this->get('/acara');
    $res->assertSuccessful();
    $res->assertInertia(fn ($page) => $page
        ->component('events/index')
        ->where('upcoming', function ($list) {
            $matched = collect($list)->firstWhere('slug', 'saturday-acoustic-night');
            return $matched && $matched['category'] === 'Live Music' && $matched['meta']['entry_type'] === 'walk_in';
        })
    );
});

