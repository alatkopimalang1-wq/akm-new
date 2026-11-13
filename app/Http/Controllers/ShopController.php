<?php

namespace App\Http\Controllers;

use App\Filament\Pages\ManageDesktopMegaMenu;
use App\Models\Category;
use App\Models\Product;
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
        $query = Product::active()->with(['variants', 'images', 'categories']);

        // Search
        if ($search = $request->input('q')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
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

        $categories = Category::withCount('products')
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

    public function byob(Request $request): Response
    {
        $settings = Setting::all()->pluck('value', 'key')->toArray();
        $byobSettings = $settings['byob_settings'] ?? null;

        // Ensure base BYOB product exists in DB for cart checkout & variant ID validation
        $byobProduct = Product::firstOrCreate(
            ['slug' => 'byob'],
            [
                'name' => $byobSettings['hero_title'] ?? 'C.Y.B.R - Custom Your Blend Ratio',
                'series' => 'custom-blend',
                'tagline' => 'Racik profil sangrai dan paduan biji kopi favorit Anda sendiri',
                'description' => $byobSettings['hero_description'] ?? 'Layanan racik blend kustom Alat Kopi Malang. Pilih 2 hingga 3 komponen biji kopi pilihan dengan rasio presisi sesuai selera seduh Anda.',
                'tasting_notes' => 'Custom Tasting Profile',
                'origin' => 'Malang & Nusantara',
                'process' => 'Custom Blend Process',
                'roast_level' => 'Medium Roast',
                'min_price' => 65000,
                'max_price' => 275000,
                'is_featured' => true,
                'status' => 'published',
                'released_at' => now(),
            ]
        );

        // Ensure packaging variants exist and match admin dashboard settings
        if (!empty($byobSettings['byob_variants']) && is_array($byobSettings['byob_variants'])) {
            foreach ($byobSettings['byob_variants'] as $v) {
                $weight = (int) ($v['weight_grams'] ?? 200);
                $byobProduct->variants()->updateOrCreate(
                    ['weight_grams' => $weight],
                    [
                        'label' => $v['label'] ?? ($weight . 'g'),
                        'price' => 0,
                        'sku' => 'BYOB-' . $weight,
                        'stock_status' => 'in_stock',
                    ]
                );
            }
        } else {
            // Standard packaging variants: 200g, 500g, 1 kg
            $standardVariants = [
                ['label' => '200g', 'weight_grams' => 200, 'price' => 65000],
                ['label' => '500g', 'weight_grams' => 500, 'price' => 150000],
                ['label' => '1 kg', 'weight_grams' => 1000, 'price' => 275000],
            ];

            foreach ($standardVariants as $v) {
                $byobProduct->variants()->updateOrCreate(
                    ['weight_grams' => $v['weight_grams']],
                    [
                        'label' => $v['label'],
                        'price' => $v['price'],
                        'sku' => 'BYOB-' . $v['weight_grams'],
                        'stock_status' => 'in_stock',
                    ]
                );
            }
        }

        $byobProduct->load('variants');

        // Strictly order variants according to the order set in admin dashboard
        if (!empty($byobSettings['byob_variants']) && is_array($byobSettings['byob_variants'])) {
            $orderMap = [];
            foreach (array_values($byobSettings['byob_variants']) as $idx => $v) {
                $w = (int) ($v['weight_grams'] ?? 0);
                $orderMap[$w] = $idx;
            }

            $sortedVariants = $byobProduct->variants->sortBy(function ($variant) use ($orderMap) {
                return $orderMap[$variant->weight_grams] ?? 999;
            })->values();

            $byobProduct->setRelation('variants', $sortedVariants);
        }

        // Coffee beans suitable for custom blending:
        // If admin customized byob_beans, use the active custom beans
        if (!empty($byobSettings['byob_beans']) && is_array($byobSettings['byob_beans'])) {
            $beans = collect($byobSettings['byob_beans'])
                ->where('is_active', true)
                ->values()
                ->map(function ($b, $index) {
                    return [
                        'id' => $b['product_id'] ?? ($index + 1),
                        'name' => $b['name'],
                        'origin' => $b['origin'] ?? '',
                        'process' => $b['process'] ?? '',
                        'price_per_10g' => (float) ($b['price_per_10g'] ?? 3500),
                        'tasting_notes' => $b['tasting_notes'] ?? '',
                        'images' => [],
                        'variants' => [],
                    ];
                })
                ->all();
        } else {
            $beans = Product::active()
                ->where('slug', '!=', 'byob')
                ->where(function ($q) {
                    $q->whereNull('series')
                      ->orWhere('series', '!=', 'equipment');
                })
                ->with(['variants', 'images'])
                ->orderBy('name')
                ->get();
        }

        return Inertia::render('shop/byob', [
            'beans' => $beans,
            'byobProduct' => $byobProduct,
            'byobSettings' => $byobSettings,
        ]);
    }

    public function show(string $slug): Response
    {
        $product = Product::active()
            ->where('slug', $slug)
            ->with(['variants', 'images', 'categories'])
            ->firstOrFail();

        $relatedProducts = Product::active()
            ->where('id', '!=', $product->id)
            ->where('series', $product->series)
            ->with(['variants', 'images'])
            ->take(4)
            ->get();

        return Inertia::render('shop/show', [
            'product' => $product,
            'relatedProducts' => $relatedProducts,
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
                ->where('is_featured', true)
                ->with(['variants', 'images'])
                ->take(4)
                ->get();

            return response()->json([
                'trending' => [
                    'Gunung Kawi Anaerobic',
                    'Espresso Houseblend',
                    'Gayo Wine Natural',
                    'Flores Bajawa',
                    'C.Y.B.R Custom Blend',
                    'V60 Pour Over',
                    'Drip Bag Kawi',
                ],
                'recommended' => $recommended,
                'products' => [],
                'guides' => [],
            ]);
        }

        $products = Product::active()
            ->where(function ($query) use ($q) {
                $query->where('name', 'like', "%{$q}%")
                      ->orWhere('tasting_notes', 'like', "%{$q}%")
                      ->orWhere('origin', 'like', "%{$q}%")
                      ->orWhere('process', 'like', "%{$q}%")
                      ->orWhere('series', 'like', "%{$q}%");
            })
            ->with(['variants', 'images'])
            ->take(8)
            ->get();

        $guides = \App\Models\BrewGuide::where('title', 'like', "%{$q}%")
            ->orWhere('brew_method', 'like', "%{$q}%")
            ->take(3)
            ->get();

        return response()->json([
            'query' => $q,
            'products' => $products,
            'guides' => $guides,
        ]);
    }
}
