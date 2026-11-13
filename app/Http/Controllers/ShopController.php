<?php

namespace App\Http\Controllers;

use App\Filament\Pages\ManageCustomBundleSettings;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShopController extends Controller
{
    public function categories(): Response
    {
        $settings = Setting::all()->pluck('value', 'key')->toArray();
        $navCategories = $settings['desktop_mega_menu_categories']
            ?? \App\Filament\Pages\ManageDesktopMegaMenu::getDefaultCategories();

        return Inertia::render('categories/index', [
            'navCategories' => $navCategories,
        ]);
    }

    public function index(Request $request): Response
    {
        $query = Product::active()->where('slug', '!=', 'byob')->with(['variants', 'images', 'categories']);

        // Search
        if ($search = $request->input('q')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('producer', 'like', "%{$search}%")
                  ->orWhere('series', 'like', "%{$search}%")
                  ->orWhere('tasting_notes', 'like', "%{$search}%")
                  ->orWhere('origin', 'like', "%{$search}%");
            });
        }

        // Filter by category slug (support hierarchy: parent includes children)
        if ($catSlug = $request->input('category')) {
            $category = Category::where('slug', $catSlug)->first();
            if ($category) {
                $categoryIds = Category::where('id', $category->id)
                    ->orWhere('parent_id', $category->id)
                    ->pluck('id');

                $query->whereHas('categories', function ($q) use ($categoryIds) {
                    $q->whereIn('categories.id', $categoryIds);
                });
            } else {
                $query->whereHas('categories', function ($q) use ($catSlug) {
                    $q->where('slug', $catSlug);
                });
            }
        }

        // Filter by series
        if ($series = $request->input('series')) {
            $query->where(function ($q) use ($series) {
                $q->where('series', $series)
                  ->orWhereHas('categories', function ($cq) use ($series) {
                      $cq->where('slug', $series);
                  });
            });
        }

        // Filter by process
        if ($process = $request->input('process')) {
            $query->where('process', 'like', "%{$process}%");
        }

        // Sort
        $sort = $request->input('sort', 'featured');
        match ($sort) {
            'price_asc' => $query->orderBy('min_price', 'asc'),
            'price_desc' => $query->orderBy('min_price', 'desc'),
            'newest' => $query->orderBy('released_at', 'desc'),
            'name' => $query->orderBy('name', 'asc'),
            default => $query->orderBy('is_featured', 'desc')->orderBy('id', 'desc'),
        };

        $products = $query->paginate(24)->withQueryString();

        $categories = Category::whereNull('parent_id')
            ->withCount('products')
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get()
            ->map(function ($cat) {
                return [
                    'id' => $cat->id,
                    'name' => $cat->getTranslation('name') ?: (is_array($cat->name) ? ($cat->name['id'] ?? reset($cat->name)) : $cat->name),
                    'slug' => $cat->slug,
                    'parent_id' => $cat->parent_id,
                    'type' => $cat->type,
                    'icon' => $cat->icon,
                    'sort_order' => $cat->sort_order,
                    'products_count' => $cat->products_count,
                ];
            });

        return Inertia::render('shop/index', [
            'products' => $products,
            'categories' => $categories,
            'filters' => [
                'q' => $request->input('q', ''),
                'category' => $request->input('category', ''),
                'series' => $request->input('series', ''),
                'sort' => $sort,
            ],
        ]);
    }

    public function customBundle(): Response
    {
        $savedSettings = Setting::get('custom_bundle_settings', []);
        $defaults = ManageCustomBundleSettings::defaultBundleSettings();
        $bundleSettings = array_merge($defaults, is_array($savedSettings) ? $savedSettings : []);
        if (empty($bundleSettings['discount_tiers']) || ! is_array($bundleSettings['discount_tiers'])) {
            $bundleSettings['discount_tiers'] = $defaults['discount_tiers'];
        }

        // Ensure virtual BYOB bundle product & variant exist so customers can add custom bundles to cart
        $byobProduct = Product::firstOrCreate(
            ['slug' => 'byob'],
            [
                'name' => 'Paket Custom Alat Kopi Malang',
                'producer' => 'ALAT KOPI MALANG',
                'series' => 'Custom Bundle',
                'stock_status' => 'in_stock',
                'is_active' => true,
                'is_featured' => false,
                'min_price' => 0,
            ]
        );

        $byobVariant = ProductVariant::firstOrCreate(
            [
                'product_id' => $byobProduct->id,
                'label' => 'Paket Custom',
            ],
            [
                'weight_grams' => 1000,
                'price' => 0,
                'stock_status' => 'in_stock',
                'is_default' => true,
            ]
        );

        $byobProduct->load(['variants', 'images', 'categories']);

        $products = Product::active()
            ->where('slug', '!=', 'byob')
            ->with(['variants', 'images', 'categories'])
            ->orderBy('is_featured', 'desc')
            ->orderBy('id', 'desc')
            ->get();

        $categories = Category::whereNull('parent_id')
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get()
            ->map(function ($cat) {
                return [
                    'id' => $cat->id,
                    'name' => $cat->getTranslation('name') ?: (is_array($cat->name) ? ($cat->name['id'] ?? reset($cat->name)) : $cat->name),
                    'slug' => $cat->slug,
                    'icon' => $cat->icon,
                ];
            })
            ->values();

        return Inertia::render('shop/custom-bundle', [
            'bundleSettings' => $bundleSettings,
            'products' => $products,
            'categories' => $categories,
            'byobProduct' => $byobProduct,
            'byobVariant' => $byobVariant,
        ]);
    }

    public function show(string $slug): Response
    {
        $product = Product::active()
            ->where('slug', $slug)
            ->with(['variants', 'images', 'categories'])
            ->firstOrFail();

        $relatedProducts = Product::active()
            ->where('slug', '!=', 'byob')
            ->where('id', '!=', $product->id)
            ->where(function ($q) use ($product) {
                $q->where('series', $product->series);
                if ($product->categories->isNotEmpty()) {
                    $q->orWhereHas('categories', function ($cq) use ($product) {
                        $cq->whereIn('categories.id', $product->categories->pluck('id'));
                    });
                }
            })
            ->with(['variants', 'images', 'categories'])
            ->take(4)
            ->get();

        $savedPreorderTerms = Setting::get('page_preorder_terms', []);
        $preorderTerms = array_merge(
            \App\Filament\Pages\ManagePreOrderTerms::defaultPreOrderTerms(),
            is_array($savedPreorderTerms) ? $savedPreorderTerms : []
        );

        return Inertia::render('shop/show', [
            'product' => $product,
            'relatedProducts' => $relatedProducts,
            'preorderTerms' => $preorderTerms,
            'marketplaceDefaults' => [
                'tokopedia' => Setting::get('tokopedia', 'https://www.tokopedia.com/alatkopimalang'),
                'shopee' => Setting::get('shopee', 'https://shopee.co.id/alatkopimalang'),
            ],
        ]);
    }

    public function liveSearch(Request $request): \Illuminate\Http\JsonResponse
    {
        $q = trim($request->input('q', ''));

        if (empty($q)) {
            $recommended = Product::active()
                ->where('slug', '!=', 'byob')
                ->where('is_featured', true)
                ->with(['variants', 'images'])
                ->take(4)
                ->get();

            return response()->json([
                'trending' => [],
                'recommended' => $recommended,
                'products' => [],
                'guides' => [],
            ]);
        }

        $products = Product::active()
            ->where('slug', '!=', 'byob')
            ->where(function ($query) use ($q) {
                $query->where('name', 'like', "%{$q}%")
                      ->orWhere('producer', 'like', "%{$q}%")
                      ->orWhere('tasting_notes', 'like', "%{$q}%")
                      ->orWhere('origin', 'like', "%{$q}%")
                      ->orWhere('process', 'like', "%{$q}%")
                      ->orWhere('series', 'like', "%{$q}%");
            })
            ->with(['variants', 'images'])
            ->take(8)
            ->get();

        return response()->json([
            'query' => $q,
            'products' => $products,
            'guides' => [],
        ]);
    }
}
