<?php

namespace App\Http\Controllers;

use App\Models\BrewGuide;
use App\Models\Category;
use App\Models\Event;
use App\Models\Post;
use App\Models\Product;
use App\Models\Setting;
use App\Models\VideoReel;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(Request $request): Response
    {
        $recProductIds = Setting::get('home_rec_product_ids');
        if (!empty($recProductIds) && is_array($recProductIds)) {
            $recommendedProducts = Product::active()
                ->whereIn('id', $recProductIds)
                ->with(['variants', 'images', 'categories'])
                ->get()
                ->sortBy(fn ($product) => array_search($product->id, $recProductIds))
                ->values();
        } else {
            $recommendedProducts = Product::active()
                ->bySeries('kawi')
                ->with(['variants', 'images', 'categories'])
                ->take(8)
                ->get();

            if ($recommendedProducts->isEmpty()) {
                $recommendedProducts = Product::active()
                    ->where('is_featured', true)
                    ->with(['variants', 'images', 'categories'])
                    ->take(8)
                    ->get();
            }
        }

        $categories = Category::whereNull('parent_id')
            ->with(['children'])
            ->orderBy('sort_order')
            ->get();

        $brewGuides = BrewGuide::orderBy('sort_order')->take(4)->get();
        $latestPosts = Post::articles()->published()->latest('published_at')->take(6)->get();

        // Flash Sale items (Configured in admin or default seed)
        $flashSaleIsActive = Setting::get('home_flash_sale_is_active', true);
        $configuredFlashSale = Setting::get('home_flash_sale_items');

        if (! empty($configuredFlashSale) && is_array($configuredFlashSale)) {
            $flashSaleProducts = $configuredFlashSale;
        } else {
            $flashSaleProducts = [
                [
                    'id' => 'fs-1',
                    'name' => 'Otten - Vietnam Drip XL',
                    'slug' => 'otten-vietnam-drip-xl',
                    'price' => 189000,
                    'original_price' => 249000,
                    'image' => '/storage/flashsale/vietnam_drip.jpg',
                    'badge' => null,
                    'stock_status' => 'Tersedia',
                ],
                [
                    'id' => 'fs-2',
                    'name' => 'Hario - Alat Seduh Saringan Kopi V60 Ceramic Cyan',
                    'slug' => 'hario-v60-ceramic-cyan',
                    'price' => 159000,
                    'original_price' => 200000,
                    'image' => '/storage/flashsale/v60_dripper.jpg',
                    'badge' => 'FLASH SALE',
                    'stock_status' => 'Tersedia',
                ],
                [
                    'id' => 'fs-3',
                    'name' => 'Fellow - Rocky Lowball Tumblers (Matte White / Black)',
                    'slug' => 'fellow-rocky-lowball-tumblers',
                    'price' => 395000,
                    'original_price' => 495000,
                    'image' => '/storage/flashsale/fellow_tumbler.jpg',
                    'badge' => null,
                    'stock_status' => 'Tersedia',
                ],
                [
                    'id' => 'fs-4',
                    'name' => 'Hario V60 Station VSS-1-OV Olive Wood',
                    'slug' => 'hario-v60-station-olive-wood',
                    'price' => 1850000,
                    'original_price' => 2310000,
                    'image' => '/storage/flashsale/v60_wood_station.jpg',
                    'badge' => 'FLASH SALE',
                    'stock_status' => 'Tersedia',
                ],
            ];
        }

        if (! $flashSaleIsActive) {
            $flashSaleProducts = [];
        }

        // New Release items (Up to 4 products configured in admin)
        $newReleaseIsActive = (bool) Setting::get('home_new_release_is_active', true);
        $configuredNewRelease = Setting::get('home_new_release_items');

        if (! empty($configuredNewRelease) && is_array($configuredNewRelease)) {
            $newReleaseProducts = array_slice($configuredNewRelease, 0, 4);
        } else {
            $newReleaseProducts = [];
        }

        if (! $newReleaseIsActive) {
            $newReleaseProducts = [];
        }

        // Back in Stock items (Up to 4 products configured in admin)
        $backInStockIsActive = (bool) Setting::get('home_back_in_stock_is_active', true);
        $configuredBackInStock = Setting::get('home_back_in_stock_items');

        if (! empty($configuredBackInStock) && is_array($configuredBackInStock)) {
            $backInStockProducts = array_slice($configuredBackInStock, 0, 4);
        } else {
            $backInStockProducts = [];
        }

        if (! $backInStockIsActive) {
            $backInStockProducts = [];
        }

        return Inertia::render('welcome', [
            'featuredProducts' => [],
            'newArrivals' => [],
            'latestProducts' => [],
            'kawiProducts' => [],
            'recommendedProducts' => $recommendedProducts,
            'flashSaleProducts' => $flashSaleProducts,
            'newReleaseProducts' => $newReleaseProducts,
            'backInStockProducts' => $backInStockProducts,
            'categories' => $categories,
            'brewGuides' => $brewGuides,
            'latestPosts' => $latestPosts,
            'upcomingEvents' => [],
            'spotlightProduct' => null,
            'videoReels' => VideoReel::active()->ordered()->get(),
        ]);
    }
}
