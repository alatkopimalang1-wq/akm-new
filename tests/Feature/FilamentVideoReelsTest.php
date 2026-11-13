<?php

use App\Filament\Resources\VideoReels\Pages\CreateVideoReel;
use App\Filament\Resources\VideoReels\Pages\EditVideoReel;
use App\Filament\Resources\VideoReels\Pages\ListVideoReels;
use App\Models\User;
use App\Models\VideoReel;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Livewire\Livewire;

test('filament video reels list page renders without errors', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/admin/video-reels')
        ->assertSuccessful();
});

test('filament video reels create page renders without errors', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/admin/video-reels/create')
        ->assertSuccessful();
});

test('filament video reels edit page renders without errors', function () {
    $user = User::factory()->create();
    $reel = VideoReel::create([
        'headline' => 'Test Reel Judul',
        'caption' => 'Test Reel Deskripsi',
        'thumbnail' => 'https://example.com/thumb.jpg',
        'video_url' => 'https://example.com/video.mp4',
    ]);

    $this->actingAs($user)
        ->get("/admin/video-reels/{$reel->id}/edit")
        ->assertSuccessful();
});

test('filament can create video reel via livewire create page', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    Storage::fake('public');
    $file = UploadedFile::fake()->image('thumb.jpg', 600, 1067);

    Livewire::test(CreateVideoReel::class)
        ->fillForm([
            'headline' => 'Judul Baru dari Filament',
            'caption' => 'Deskripsi konten video dari admin filament...',
            'badge' => 'SPECIAL',
            'thumbnail_upload' => $file,
            'video_url' => 'https://example.com/video2.mp4',
            'sort_order' => 1,
            'is_active' => true,
        ])
        ->call('create')
        ->assertHasNoFormErrors();

    expect(VideoReel::where('headline', 'Judul Baru dari Filament')->exists())->toBeTrue();
});

test('filament can edit video reel via livewire edit page', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $reel = VideoReel::create([
        'headline' => 'Judul Awal',
        'caption' => 'Deskripsi Awal',
        'thumbnail' => 'https://example.com/thumb.jpg',
        'video_url' => 'https://example.com/video.mp4',
    ]);

    Livewire::test(EditVideoReel::class, ['record' => $reel->getRouteKey()])
        ->fillForm([
            'headline' => 'Judul Setelah Diedit di Filament',
            'caption' => 'Deskripsi telah diperbarui...',
            'thumbnail' => 'https://example.com/thumb-updated.jpg',
            'video_url' => 'https://example.com/video-updated.mp4',
        ])
        ->call('save')
        ->assertHasNoFormErrors();

    $reel->refresh();
    expect($reel->headline)->toBe('Judul Setelah Diedit di Filament');
    expect($reel->caption)->toBe('Deskripsi telah diperbarui...');
});
