<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StorefrontTest extends TestCase
{
    use RefreshDatabase;

    public function test_homepage_loads_successfully_with_inertia(): void
    {
        $response = $this->get('/');
        $response->assertStatus(200);
    }

    public function test_filament_admin_login_is_accessible(): void
    {
        $response = $this->get('/admin/login');
        $response->assertStatus(200);
    }

    public function test_api_live_search_returns_products(): void
    {
        $response = $this->getJson('/api/search?q=Timemore');
        $response->assertStatus(200);
        $response->assertJsonStructure(['products']);
    }
}
