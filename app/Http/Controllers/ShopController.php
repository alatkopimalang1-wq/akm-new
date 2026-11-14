<?php

namespace App\Http\Controllers;

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

        $bundleSlots = $product->is_custom_bundle ? $this->resolveProductBundleSlots($product) : [];

        return Inertia::render('shop/show', [
            'product' => $product,
            'relatedProducts' => $relatedProducts,
            'preorderTerms' => $preorderTerms,
            'bundleSlots' => $bundleSlots,
            'whatsappNumber' => Setting::get('whatsapp', '6285121930454'),
            'marketplaceDefaults' => [
                'tokopedia' => Setting::get('tokopedia', 'https://www.tokopedia.com/alatkopimalang'),
                'shopee' => Setting::get('shopee', 'https://shopee.co.id/alatkopimalang'),
            ],
        ]);
    }

    protected function resolveProductBundleSlots(Product $product): array
    {
        $config = is_array($product->bundle_config) ? $product->bundle_config : [];
        $slotsConfig = is_array($config['slots'] ?? null) ? $config['slots'] : [];

        $formatImageUrl = function (?Product $prod): string {
            if (! $prod) {
                return '/brand/logo-akm.png?v=20261113b';
            }
            $primary = $prod->images->firstWhere('is_primary', true) ?: $prod->images->first();
            $path = $primary?->path;
            if (! $path) {
                return '/brand/logo-akm.png?v=20261113b';
            }
            if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
                return $path;
            }

            return '/storage/' . preg_replace('/^\/?(public\/|storage\/)?/', '', $path);
        };

        $resolved = [];

        foreach (array_values($slotsConfig) as $idx => $slot) {
            $slotType = $slot['slot_type'] ?? 'required';
            $slotLabel = $slot['slot_label'] ?? 'Please select a product!';

            if ($slotType === 'free') {
                $freeId = (int) ($slot['free_product_id'] ?? 0);
                $freeProd = $freeId > 0
                    ? Product::with(['variants', 'images'])->find($freeId)
                    : null;

                $freeData = null;
                if ($freeProd) {
                    $defVar = $freeProd->variants->first();
                    $normalPrice = (float) ($defVar?->original_price > $defVar?->price ? $defVar->original_price : ($defVar?->price ?? $freeProd->min_price ?? 100000));
                    $freeData = [
                        'id' => $freeProd->id,
                        'variant_id' => $defVar?->id ?? $freeProd->id,
                        'name' => $freeProd->name,
                        'slug' => $freeProd->slug,
                        'producer' => $freeProd->producer,
                        'image_url' => $formatImageUrl($freeProd),
                        'normal_price' => $normalPrice,
                        'bundle_price' => 0,
                        'weight_grams' => (int) ($defVar?->weight_grams ?? 250),
                        'is_out_of_stock' => false,
                    ];
                }

                $resolved[] = [
                    'index' => $idx,
                    'slot_type' => 'free',
                    'slot_label' => 'GRATIS',
                    'free_product' => $freeData,
                    'candidates' => [],
                ];

                continue;
            }

            // Required or Optional slot: discount is configured per-slot
            $discountMode = $slot['discount_mode'] ?? 'percentage';
            if ($discountMode === 'inherit') {
                $discountMode = 'percentage';
            }

            $effDiscountType = $discountMode === 'fixed' ? 'fixed' : 'percentage';
            $effDiscountValue = $discountMode === 'none' ? 0.0 : (float) ($slot['discount_value'] ?? 0);

            $catIds = array_values(array_filter(array_map('intval', (array) ($slot['category_ids'] ?? []))));
            $prodIds = array_values(array_filter(array_map('intval', (array) ($slot['product_ids'] ?? []))));

            $allCatIds = [];
            if (! empty($catIds)) {
                $allCatIds = Category::whereIn('id', $catIds)
                    ->orWhereIn('parent_id', $catIds)
                    ->pluck('id')
                    ->toArray();
            }

            $candQuery = Product::active()
                ->where('slug', '!=', 'byob')
                ->where('id', '!=', $product->id)
                ->where('is_custom_bundle', false)
                ->with(['variants', 'images']);

            if (! empty($prodIds) || ! empty($allCatIds)) {
                $candQuery->where(function ($q) use ($prodIds, $allCatIds) {
                    if (! empty($prodIds)) {
                        $q->whereIn('products.id', $prodIds);
                    }
                    if (! empty($allCatIds)) {
                        $q->orWhereHas('categories', function ($cq) use ($allCatIds) {
                            $cq->whereIn('categories.id', $allCatIds);
                        });
                    }
                });
            } else {
                $candQuery->limit(12);
            }

            $candidates = $candQuery->get()->map(function (Product $cand) use ($effDiscountType, $effDiscountValue, $formatImageUrl) {
                $defVar = $cand->variants->first();
                $basePrice = (float) ($defVar?->price ?? $cand->min_price ?? 0);
                $origPrice = (float) ($defVar?->original_price > $basePrice ? $defVar->original_price : $basePrice);

                $bundlePrice = $basePrice;
                if ($effDiscountValue > 0 && $basePrice > 0) {
                    if ($effDiscountType === 'percentage') {
                        $bundlePrice = round($basePrice * (1 - ($effDiscountValue / 100)));
                    } else {
                        $bundlePrice = max(0, $basePrice - $effDiscountValue);
                    }
                }

                // Ensure normal_price is at least basePrice so strikethrough works when discounted
                $normalPrice = max($origPrice, $basePrice);

                return [
                    'id' => $cand->id,
                    'variant_id' => $defVar?->id ?? $cand->id,
                    'name' => $cand->name,
                    'slug' => $cand->slug,
                    'producer' => $cand->producer,
                    'image_url' => $formatImageUrl($cand),
                    'normal_price' => $normalPrice,
                    'bundle_price' => $bundlePrice,
                    'weight_grams' => (int) ($defVar?->weight_grams ?? 500),
                    'is_out_of_stock' => (bool) $cand->is_out_of_stock,
                ];
            })->values()->toArray();

            $resolved[] = [
                'index' => $idx,
                'slot_type' => $slotType === 'optional' ? 'optional' : 'required',
                'slot_label' => $slotLabel,
                'free_product' => null,
                'candidates' => $candidates,
            ];
        }

        return $resolved;
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
