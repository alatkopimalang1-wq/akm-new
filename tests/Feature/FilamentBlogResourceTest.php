<?php

use App\Filament\Pages\ManageContentPages;
use App\Filament\Resources\Posts\Pages\CreatePost;
use App\Filament\Resources\Posts\Pages\EditPost;
use App\Filament\Resources\Posts\Pages\ListPosts;
use App\Filament\Resources\Posts\PostResource;
use App\Models\Post;
use App\Models\Setting;
use App\Models\User;
use Livewire\Livewire;

test('admin can view the blog and article management resource list page', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/admin/posts')
        ->assertSuccessful()
        ->assertSee('Blog & Artikel');
});

test('admin can access create article page', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/admin/posts/create')
        ->assertSuccessful()
        ->assertSee('Tulis Artikel Blog Baru');
});

test('admin can create a new blog article with rich content and publication date', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    Livewire::test(CreatePost::class)
        ->fillForm([
            'title' => ['id' => 'Cerita Sang Roaster: Menemukan Cita Rasa Kawi'],
            'slug' => 'cerita-sang-roaster-kawi',
            'category' => 'Journal',
            'author_name' => 'Sanubari Roastery',
            'read_time_minutes' => 4,
            'excerpt' => ['id' => 'Perjalanan kami mengeksplorasi kopi lereng gunung Kawi.'],
            'body' => ['id' => '<h2>Awal Mula</h2><p>Di kaki gunung Kawi, kami menemukan ceri kopi matang pohon sempurna.</p>'],
            'published_at' => now(),
            'meta' => [
                'icon' => 'coffee',
                'is_featured' => true,
                'cover_caption' => 'Pemetikan ceri matang di Kawi',
                'gallery_columns' => '3',
                'content_image_layout' => 'split_right',
                'content_grid_cols_desktop' => '2',
                'content_mobile_mode' => 'carousel_swipe',
                'tags' => ['kawi', 'single-origin'],
            ],
        ])
        ->call('create')
        ->assertHasNoFormErrors();

    $post = Post::where('slug', 'cerita-sang-roaster-kawi')->first();
    expect($post)->not->toBeNull();
    expect($post->type)->toBe('article');
    expect($post->category)->toBe('Journal');
    expect($post->author_name)->toBe('Sanubari Roastery');
    expect($post->is_published)->toBeTrue();
    expect($post->body['id'])->toContain('<h2>Awal Mula</h2>');
    expect($post->meta['icon'])->toBe('coffee');
    expect($post->meta['is_featured'])->toBeTrue();
    expect($post->meta['gallery_columns'])->toEqual(3);
    expect($post->meta['content_image_layout'])->toBe('split_right');
    expect($post->meta['content_mobile_mode'])->toBe('carousel_swipe');
});

test('admin can configure table, icon callout, image grid and text blocks with responsive layouts in article', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $post = Post::create([
        'type' => 'article',
        'title' => ['id' => 'Eksplorasi Kafein & Profil Sangrai'],
        'slug' => 'eksplorasi-kafein-profil-sangrai',
        'category' => 'Edukasi',
        'body' => ['id' => '<p>Pengantar panduan kadar kafein dalam kopi.</p>'],
        'published_at' => now(),
        'meta' => [
            'icon' => 'sparkles',
            'content_blocks' => [
                [
                    'type' => 'table',
                    'data' => [
                        'title' => 'Tabel Perbandingan Kafein',
                        'subtitle' => 'Hasil uji laboratorium 2026',
                        'headers' => ['Jenis Kopi', 'Kadar Kafein', 'Rasa Dominan'],
                        'rows' => [
                            ['cells' => ['Robusta Malang', '220 mg', 'Bold, Dark Cacao']],
                            ['cells' => ['Arabika Kawi', '120 mg', 'Floral, Sweet Plum']],
                        ],
                        'layout_desktop' => 'striped',
                        'layout_tablet' => 'responsive',
                        'layout_mobile' => 'cards',
                    ],
                ],
                [
                    'type' => 'icon_callout',
                    'data' => [
                        'icon' => 'flame',
                        'title' => 'Fakta Roasting',
                        'color' => 'copper',
                        'text' => 'Tingkat sangrai mempengaruhi profil rasa dan persepsi kepahitan kopi.',
                        'layout_desktop' => 'banner',
                        'layout_tablet' => 'full',
                        'layout_mobile' => 'stacked',
                    ],
                ],
                [
                    'type' => 'image_grid',
                    'data' => [
                        'images' => ['posts/content_images/sample1.jpg', 'posts/content_images/sample2.jpg'],
                        'caption' => 'Visual proses sangrai di laboratorium Sanubari',
                        'layout_desktop' => '2',
                        'layout_tablet' => '2',
                        'layout_mobile' => 'swipe',
                        'aspect_ratio' => 'aspect-16/9',
                    ],
                ],
            ],
        ],
    ]);

    expect($post->meta['content_blocks'])->toHaveCount(3);
    expect($post->meta['content_blocks'][0]['type'])->toBe('table');
    expect($post->meta['content_blocks'][0]['data']['layout_mobile'])->toBe('cards');
    expect($post->meta['content_blocks'][1]['type'])->toBe('icon_callout');
    expect($post->meta['content_blocks'][1]['data']['icon'])->toBe('flame');
    expect($post->meta['content_blocks'][2]['type'])->toBe('image_grid');
    expect($post->meta['content_blocks'][2]['data']['layout_mobile'])->toBe('swipe');

    // Verify it renders successfully on the public blog show page
    $response = $this->get('/blog/' . $post->slug);
    $response->assertSuccessful();
    $response->assertSee('Eksplorasi Kafein', escape: false);
    $response->assertSee('Tabel Perbandingan Kafein', escape: false);
    $response->assertSee('Robusta Malang', escape: false);
    $response->assertSee('Fakta Roasting', escape: false);
    $response->assertSee('Visual proses sangrai', escape: false);
});

test('admin can edit an existing blog article and update publication status', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $post = Post::create([
        'type' => 'article',
        'title' => ['id' => 'Artikel Awal'],
        'slug' => 'artikel-awal',
        'category' => 'Edukasi',
        'body' => ['id' => '<p>Konten awal</p>'],
        'published_at' => null, // Draft
    ]);

    expect($post->is_published)->toBeFalse();

    Livewire::test(EditPost::class, ['record' => $post->id])
        ->assertSuccessful()
        ->fillForm([
            'title' => ['id' => 'Artikel Diperbarui'],
            'published_at' => now(),
            'meta' => [
                'icon' => 'flame',
                'is_featured' => true,
            ],
        ])
        ->call('save')
        ->assertHasNoFormErrors();

    $post->refresh();
    expect($post->title['id'])->toBe('Artikel Diperbarui');
    expect($post->is_published)->toBeTrue();
    expect($post->meta['icon'])->toBe('flame');
});

test('admin can delete a blog article', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $post = Post::create([
        'type' => 'article',
        'title' => ['id' => 'Artikel Dihapus'],
        'slug' => 'artikel-akan-dihapus',
        'category' => 'Roasting',
        'body' => ['id' => '<p>Konten hapus</p>'],
    ]);

    Livewire::test(EditPost::class, ['record' => $post->id])
        ->callAction('delete')
        ->assertHasNoErrors();

    expect(Post::where('id', $post->id)->exists())->toBeFalse();
});

test('published articles appear on website while draft articles are hidden', function () {
    $publishedPost = Post::create([
        'type' => 'article',
        'title' => ['id' => 'Artikel Publikasi Online'],
        'slug' => 'artikel-publikasi-online',
        'category' => 'Journal',
        'excerpt' => ['id' => 'Ini artikel online'],
        'body' => ['id' => '<p>Isi artikel online</p>'],
        'published_at' => now()->subHour(),
        'meta' => [
            'icon' => 'book-open',
            'is_featured' => true,
        ],
    ]);

    $draftPost = Post::create([
        'type' => 'article',
        'title' => ['id' => 'Artikel Draf Rahasia'],
        'slug' => 'artikel-draf-rahasia',
        'category' => 'Journal',
        'excerpt' => ['id' => 'Ini draf rahasia'],
        'body' => ['id' => '<p>Isi draf rahasia</p>'],
        'published_at' => null, // Draft
    ]);

    // Public /blog list
    $response = $this->get('/blog');
    $response->assertSuccessful();
    $response->assertSee('Artikel Publikasi Online');
    $response->assertDontSee('Artikel Draf Rahasia');

    // Public /blog/{slug} detail
    $this->get('/blog/' . $publishedPost->slug)->assertSuccessful();
    $this->get('/blog/' . $draftPost->slug)->assertNotFound();
});

test('toggle publish action in table toggles between published and draft', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $post = Post::create([
        'type' => 'article',
        'title' => ['id' => 'Artikel Toggle Test'],
        'slug' => 'artikel-toggle-test',
        'category' => 'Journal',
        'body' => ['id' => '<p>Konten toggle</p>'],
        'published_at' => now(),
    ]);

    expect($post->is_published)->toBeTrue();

    Livewire::test(ListPosts::class)
        ->callTableAction('togglePublish', $post);

    $post->refresh();
    expect($post->published_at)->toBeNull();
    expect($post->is_published)->toBeFalse();

    Livewire::test(ListPosts::class)
        ->callTableAction('togglePublish', $post);

    $post->refresh();
    expect($post->published_at)->not->toBeNull();
    expect($post->is_published)->toBeTrue();
});

test('admin can configure blog grid columns, image aspect, and icons in manage content pages', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    Livewire::test(ManageContentPages::class)
        ->assertSuccessful()
        ->set('data.blog_grid_columns', '2')
        ->set('data.blog_image_aspect', 'aspect-16/9')
        ->set('data.blog_hero_icon', 'coffee')
        ->set('data.blog_show_icons', true)
        ->set('data.blog_show_read_time', true)
        ->call('save')
        ->assertHasNoErrors();

    $pageBlog = Setting::get('page_blog');
    expect($pageBlog)->toBeArray();
    expect($pageBlog['grid_columns'])->toBe(2);
    expect($pageBlog['image_aspect'])->toBe('aspect-16/9');
    expect($pageBlog['hero_icon'])->toBe('coffee');
});
