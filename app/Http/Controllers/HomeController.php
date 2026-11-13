<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\HeroBanner;
use App\Models\Product;
use App\Models\Setting;
use App\Models\ShowroomItem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(Request $request): Response
    {
        $banners = HeroBanner::active()->get();
        if ($banners->isEmpty()) {
            $banners = collect([
                [
                    'id' => 1,
                    'title' => 'Sanubari Roastery Official Gear Partner',
                    'subtitle' => 'Pusat Kurasi Peralatan Seduh, Grinder Presisi & Mesin Espresso Terbaik di Malang.',
                    'badge' => 'OFFICIAL PARTNER',
                    'image' => '/slides/dirty-latte-banner.jpg',
                    'link_url' => '#catalog',
                ],
            ]);
        }

        $categories = Category::where('is_active', true)
            ->withCount('products')
            ->orderBy('sort_order')
            ->get();

        $products = Product::active()
            ->with(['categories', 'images'])
            ->orderBy('is_featured', 'desc')
            ->orderBy('id', 'desc')
            ->get();

        $showroom = ShowroomItem::active()->get();

        $settings = Setting::pluck('value', 'key')->all();

        return Inertia::render('welcome', [
            'banners' => $banners,
            'categories' => $categories,
            'products' => $products,
            'showroom' => $showroom,
            'settings' => $settings,
        ]);
    }
}

