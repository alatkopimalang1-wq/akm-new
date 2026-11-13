<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $settings = \App\Models\Setting::all()->pluck('value', 'key')->toArray();

        $navCategories = \App\Models\Category::whereNull('parent_id')
            ->with(['children' => fn ($q) => $q->orderBy('sort_order')])
            ->orderBy('sort_order')
            ->get();

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'locale' => app()->getLocale(),
            'settings' => $settings,
            'navCategories' => $navCategories,
            'desktopMegaMenuCategories' => $settings['desktop_mega_menu_categories'] ?? \App\Filament\Pages\ManageDesktopMegaMenu::getDefaultCategories(),
            'navbarCategories' => $settings['desktop_mega_menu_categories'] ?? \App\Filament\Pages\ManageDesktopMegaMenu::getDefaultCategories(),
            'footerSettings' => $settings['footer_settings'] ?? \App\Filament\Pages\ManageFooterSettings::defaultFooterSettings(),
            'auth' => [
                'user' => $request->user(),
            ],
            'metaPixelId' => config('services.meta_pixel.id'),
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }
}
