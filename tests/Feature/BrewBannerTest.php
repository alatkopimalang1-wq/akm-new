<?php

namespace Tests\Feature;

use App\Filament\Pages\HalamanAwal\ManageBrewBanner;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use Tests\TestCase;

class BrewBannerTest extends TestCase
{
    use RefreshDatabase;

    public function test_resep_seduh_alias_route_works(): void
    {
        $response = $this->get('/resep-seduh');
        $response->assertStatus(200);
    }

    public function test_welcome_page_renders_brew_banner(): void
    {
        Setting::set('home_brew_banner_title', 'Resep Seduh Kopi Sanubari Teruji');
        Setting::set('home_brew_banner_href', '/panduan-seduh');

        $response = $this->get('/');
        $response->assertStatus(200);
        $response->assertSee('Resep Seduh Kopi Sanubari Teruji');
    }

    public function test_filament_manage_brew_banner_page_can_be_rendered_and_saved(): void
    {
        $admin = User::factory()->create();

        $this->actingAs($admin);

        Livewire::test(ManageBrewBanner::class)
            ->assertSuccessful()
            ->set('data.home_brew_banner_title', 'Panduan Seduh Barista Pilihan')
            ->set('data.home_brew_banner_badge', 'Resep Seduh')
            ->set('data.home_brew_banner_href', '/resep-seduh')
            ->call('save')
            ->assertHasNoErrors();

        $this->assertEquals('Panduan Seduh Barista Pilihan', Setting::get('home_brew_banner_title'));
        $this->assertEquals('Resep Seduh', Setting::get('home_brew_banner_badge'));
        $this->assertEquals('/resep-seduh', Setting::get('home_brew_banner_href'));
    }
}
