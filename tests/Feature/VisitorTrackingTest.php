<?php

namespace Tests\Feature;

use App\Filament\Widgets\ActivePagesRealtimeWidget;
use App\Filament\Widgets\RealtimeVisitorOverview;
use App\Filament\Widgets\VisitorTrafficChart;
use App\Models\User;
use App\Models\WebsiteVisit;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use Tests\TestCase;

class VisitorTrackingTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_visiting_home_page_is_tracked(): void
    {
        $this->get('/');

        $this->assertDatabaseHas('website_visits', [
            'url' => '/',
        ]);

        $visit = WebsiteVisit::first();
        $this->assertNotNull($visit);
        $this->assertNotNull($visit->visitor_id);
        $this->assertNotNull($visit->device);
    }

    public function test_admin_routes_are_not_tracked_as_visitor(): void
    {
        $this->get('/admin/login');

        $this->assertDatabaseMissing('website_visits', [
            'url' => '/admin/login',
        ]);
    }

    public function test_realtime_visitor_overview_widget_renders(): void
    {
        $admin = User::factory()->create();
        $this->actingAs($admin);

        // Seed some visits
        WebsiteVisit::create([
            'visitor_id' => 'vis-1',
            'ip_address' => '127.0.0.1',
            'url' => '/',
            'device' => 'mobile',
            'last_activity_at' => Carbon::now(),
        ]);

        WebsiteVisit::create([
            'visitor_id' => 'vis-2',
            'ip_address' => '127.0.0.1',
            'url' => '/shop',
            'device' => 'desktop',
            'last_activity_at' => Carbon::now(),
        ]);

        Livewire::test(RealtimeVisitorOverview::class)
            ->assertSuccessful();

        $this->assertEquals(2, WebsiteVisit::getOnlineVisitorsCount(5));
        $this->assertEquals(2, WebsiteVisit::getTodayUniqueVisitorsCount());
    }

    public function test_visitor_traffic_chart_widget_renders(): void
    {
        $admin = User::factory()->create();
        $this->actingAs($admin);

        Livewire::test(VisitorTrafficChart::class)
            ->assertSuccessful();
    }

    public function test_active_pages_realtime_widget_renders(): void
    {
        $admin = User::factory()->create();
        $this->actingAs($admin);

        WebsiteVisit::create([
            'visitor_id' => 'vis-1',
            'ip_address' => '127.0.0.1',
            'url' => '/coffee-catering',
            'device' => 'mobile',
            'last_activity_at' => Carbon::now(),
        ]);

        Livewire::test(ActivePagesRealtimeWidget::class)
            ->assertSuccessful();
    }
}
