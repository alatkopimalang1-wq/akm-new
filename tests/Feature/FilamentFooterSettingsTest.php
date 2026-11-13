<?php

use App\Filament\Pages\ManageFooterSettings;
use App\Models\Setting;
use App\Models\User;
use Livewire\Livewire;

test('admin can access footer settings management page in dashboard', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/admin/manage-footer-settings')
        ->assertSuccessful()
        ->assertSee('Pengaturan Footer');
});

test('admin can save custom footer settings and persist to database', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    Livewire::test(ManageFooterSettings::class)
        ->assertSuccessful()
        ->fillForm([
            'brand_title' => 'Sanubari Roastery Kawi',
            'brand_tagline' => 'Artisan Coffee Roaster of Mount Kawi',
            'brand_description' => 'Roastery artisan kopi spesialti dengan dedikasi tinggi pada mutu seduhan dan petani lokal Malang.',
            'showroom_label' => 'Laboratorium & Slow Bar:',
            'showroom_name' => 'Sanubari Experience Hub Malang',
            'showroom_address' => 'Jl. Kawi No. 99, Klojen, Kota Malang',
            'column_2_title' => 'Navigasi Pilihan',
            'column_2_links' => [
                [
                    'label' => 'Tentang Kami',
                    'url' => '/tentang',
                    'is_external' => false,
                    'is_active' => true,
                ],
                [
                    'label' => 'Katalog Lengkap',
                    'url' => '/shop',
                    'is_external' => false,
                    'is_active' => true,
                ],
            ],
            'column_3_title' => 'Layanan & Edukasi',
            'column_3_links' => [
                [
                    'label' => 'Panduan Seduh Kopi',
                    'url' => '/panduan-seduh',
                    'is_external' => false,
                    'is_active' => true,
                ],
            ],
            'column_4_title' => 'Jam Buka & Layanan',
            'hours' => 'Buka Setiap Hari: 08.00 - 22.00 WIB',
            'phone' => '+6281234567890',
            'whatsapp' => '6281234567890',
            'city' => 'Kota Malang, Jawa Timur',
            'whatsapp_cta_text' => 'Konsultasi Roaster Sekarang',
            'whatsapp_message' => 'Halo Sanubari Roastery! Mau konsultasi biji kopi.',
            'social_title' => 'Ikuti Perjalanan Seduh Kami',
            'instagram' => 'https://instagram.com/sanubarikawi',
            'facebook' => 'https://facebook.com/sanubarikawi',
            'x_url' => 'https://x.com/sanubarikawi',
            'tiktok' => 'https://tiktok.com/@sanubarikawi',
            'youtube' => 'https://youtube.com/@sanubarikawi',
            'copyright_text' => '© {year} Sanubari Kawi Malang. Seluruh hak cipta dilindungi.',
            'legal_links' => [
                [
                    'label' => 'Kebijakan Privasi Resmi',
                    'url' => '/legal/privacy',
                    'is_active' => true,
                ],
            ],
        ])
        ->call('save')
        ->assertHasNoFormErrors();

    $footerSettings = Setting::get('footer_settings');
    expect($footerSettings)->toBeArray();
    expect($footerSettings['brand_title'])->toBe('Sanubari Roastery Kawi');
    expect($footerSettings['showroom_name'])->toBe('Sanubari Experience Hub Malang');
    expect($footerSettings['hours'])->toBe('Buka Setiap Hari: 08.00 - 22.00 WIB');
    expect($footerSettings['whatsapp'])->toBe('6281234567890');
    expect($footerSettings['youtube'])->toBe('https://youtube.com/@sanubarikawi');

    // Also verify standard keys are synced
    expect(Setting::get('whatsapp'))->toBe('6281234567890');
    expect(Setting::get('address'))->toBe('Jl. Kawi No. 99, Klojen, Kota Malang');
    expect(Setting::get('hours'))->toBe('Buka Setiap Hari: 08.00 - 22.00 WIB');
    expect(Setting::get('instagram'))->toBe('https://instagram.com/sanubarikawi');
});

test('public pages render custom configured footer content', function () {
    Setting::set('footer_settings', [
        'brand_title' => 'Sanubari Roastery Spesial',
        'brand_tagline' => 'Dekat dengan Setiap Seduhan',
        'brand_description' => 'Eksplorasi kopi artisan Gunung Kawi.',
        'showroom_label' => 'Roastery & Workshop:',
        'showroom_name' => 'Sanubari Roastery Hub',
        'showroom_address' => 'Jl. Terusan Kawi No. 88, Malang',
        'column_2_title' => 'Eksplorasi Brand',
        'column_2_links' => [
            ['label' => 'Tentang Kami Sanubari', 'url' => '/tentang', 'is_active' => true],
        ],
        'column_3_title' => 'Resep & Seduhan',
        'column_3_links' => [
            ['label' => 'Panduan Manual Brew', 'url' => '/panduan-seduh', 'is_active' => true],
        ],
        'column_4_title' => 'Kontak Roaster',
        'hours' => 'Buka Setiap Hari: 09.00 - 21.00 WIB',
        'phone' => '+62899999999',
        'whatsapp' => '62899999999',
        'city' => 'Kota Malang, Jawa Timur',
        'whatsapp_cta_text' => 'Hubungi Roaster Sanubari',
        'whatsapp_message' => 'Halo Sanubari!',
        'social_title' => 'Komunitas Kopi Sanubari',
        'instagram' => 'https://instagram.com/sanubarispesial',
        'facebook' => 'https://facebook.com/sanubarispesial',
        'x_url' => 'https://x.com/sanubarispesial',
        'tiktok' => 'https://tiktok.com/@sanubarispesial',
        'youtube' => 'https://youtube.com/@sanubarispesial',
        'copyright_text' => '© {year} Sanubari Kopi Spesial. Hak Cipta Dilindungi.',
        'legal_links' => [
            ['label' => 'Syarat Layanan', 'url' => '/legal/terms', 'is_active' => true],
        ],
    ]);

    $response = $this->get('/');
    $response->assertSuccessful();

    // Verify Inertia page contains configured footer settings
    $response->assertSee('Sanubari Roastery Spesial', escape: false);
    $response->assertSee('Dekat dengan Setiap Seduhan', escape: false);
    $response->assertSee('Sanubari Roastery Hub', escape: false);
    $response->assertSee('Hubungi Roaster Sanubari', escape: false);
    $response->assertSee('Komunitas Kopi Sanubari', escape: false);
    $response->assertSee('Sanubari Kopi Spesial', escape: false);
});

