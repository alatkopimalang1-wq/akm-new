<?php

namespace Tests\Feature;

use App\Filament\Pages\HalamanAwal\ManageCateringBanner;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use Tests\TestCase;

class CateringBannerTest extends TestCase
{
    use RefreshDatabase;

    public function test_welcome_page_renders_catering_banner(): void
    {
        Setting::set('home_catering_banner_title', 'Live Coffee Catering Sanubari Istimewa');
        Setting::set('home_catering_banner_href', '/coffee-catering');

        $response = $this->get('/');
        $response->assertStatus(200);
        $response->assertSee('Live Coffee Catering Sanubari Istimewa');
    }

    public function test_filament_manage_catering_banner_page_can_be_rendered_and_saved(): void
    {
        $admin = User::factory()->create();

        $this->actingAs($admin);

        Livewire::test(ManageCateringBanner::class)
            ->assertSuccessful()
            ->set('data.home_catering_banner_title', 'Catering Kopi Eksklusif Malang')
            ->set('data.home_catering_banner_badge', 'Live Coffee Bar')
            ->set('data.home_catering_banner_href', '/coffee-catering')
            ->call('save')
            ->assertHasNoErrors();

        $this->assertEquals('Catering Kopi Eksklusif Malang', Setting::get('home_catering_banner_title'));
        $this->assertEquals('Live Coffee Bar', Setting::get('home_catering_banner_badge'));
        $this->assertEquals('/coffee-catering', Setting::get('home_catering_banner_href'));
    }
}

