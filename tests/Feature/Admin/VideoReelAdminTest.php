<?php

use App\Models\User;
use App\Models\VideoReel;

test('unauthenticated users cannot access video reels dashboard', function () {
    $response = $this->get('/dashboard/reels');
    $response->assertRedirect('/login');
});

test('authenticated users can view video reels dashboard', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get('/dashboard/reels');
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page->component('dashboard/reels'));
});

test('admin can create a new video reel', function () {
    $user = User::factory()->create();

    $payload = [
        'headline' => 'Uji Coba Gilingan Kopi Presisi',
        'caption' => 'Kalibrasi burr grinder 64mm untuk rasa buah yang manis dan bersih...',
        'badge' => 'TESTING',
        'thumbnail' => 'https://example.com/thumb.jpg',
        'video_url' => 'https://example.com/video.mp4',
        'sort_order' => 10,
        'is_active' => true,
    ];

    $response = $this->actingAs($user)->post('/dashboard/reels', $payload);
    $response->assertRedirect();

    $this->assertDatabaseHas('video_reels', [
        'headline' => 'Uji Coba Gilingan Kopi Presisi',
        'badge' => 'TESTING',
    ]);
});

test('admin can update video reel headline and caption', function () {
    $user = User::factory()->create();
    $reel = VideoReel::create([
        'headline' => 'Judul Lama',
        'caption' => 'Deskripsi lama...',
        'thumbnail' => 'https://example.com/thumb.jpg',
        'video_url' => 'https://example.com/video.mp4',
    ]);

    $response = $this->actingAs($user)->put("/dashboard/reels/{$reel->id}", [
        'headline' => 'Judul Baru yang Diperbarui',
        'caption' => 'Deskripsi baru yang sudah diedit...',
        'thumbnail' => 'https://example.com/thumb.jpg',
        'video_url' => 'https://example.com/video.mp4',
        'sort_order' => 5,
        'is_active' => true,
    ]);

    $response->assertRedirect();

    $this->assertDatabaseHas('video_reels', [
        'id' => $reel->id,
        'headline' => 'Judul Baru yang Diperbarui',
        'caption' => 'Deskripsi baru yang sudah diedit...',
    ]);
});

test('admin can delete a video reel', function () {
    $user = User::factory()->create();
    $reel = VideoReel::create([
        'headline' => 'Reel yang Akan Dihapus',
        'caption' => 'Deskripsi...',
        'thumbnail' => 'https://example.com/thumb.jpg',
        'video_url' => 'https://example.com/video.mp4',
    ]);

    $response = $this->actingAs($user)->delete("/dashboard/reels/{$reel->id}");
    $response->assertRedirect();

    $this->assertDatabaseMissing('video_reels', [
        'id' => $reel->id,
    ]);
});

