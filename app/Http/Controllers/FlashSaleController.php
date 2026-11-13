<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FlashSaleController extends Controller
{
    public function index(Request $request): Response
    {
        // 1. Fetch products configured in Flash Sale settings
        $configuredHero = Setting::get('home_flash_sale_items');

        if (! empty($configuredHero) && is_array($configuredHero)) {
            $productIds = collect($configuredHero)->pluck('product_id')->filter()->unique()->all();
            $productSlugs = collect($configuredHero)->pluck('slug')->filter()->unique()->all();

            $productsById = ! empty($productIds)
                ? Product::with(['variants', 'images', 'categories'])->whereIn('id', $productIds)->get()->keyBy('id')
                : collect();

            $productsBySlug = ! empty($productSlugs)
                ? Product::with(['variants', 'images', 'categories'])->whereIn('slug', $productSlugs)->get()->keyBy('slug')
                : collect();

            $allFlashSaleItems = array_map(function ($item) use ($productsById, $productsBySlug) {
                $product = (! empty($item['product_id']) ? $productsById->get($item['product_id']) : null)
                    ?? (! empty($item['slug']) ? $productsBySlug->get($item['slug']) : null);

                $origPrice = ! empty($item['original_price'])
                    ? (int) $item['original_price']
                    : ($product?->min_price ? (int) round($product->min_price * 1.25) : (int) round(($item['price'] ?? 100000) * 1.25));

                $price = (int) ($item['price'] ?? ($product?->min_price ?? 0));
                $discountPct = ($origPrice > $price) ? round((($origPrice - $price) / $origPrice) * 100) : 20;

                $isCoffee = $product ? ($product->series !== 'equipment') : true;
                $catName = $product?->categories->first()?->name;
                if (is_array($catName)) {
                    $catName = $catName['id'] ?? reset($catName);
                }

                $category = $catName ?: ($isCoffee ? 'Biji Kopi Specialty' : 'Alat Seduh');

                $variants = [];
                if ($product && $product->variants->isNotEmpty()) {
                    $variants = $product->variants->map(function ($v) {
                        return [
                            'id' => $v->id,
                            'label' => $v->label,
                            'price' => $v->price,
                            'original_price' => $v->original_price,
                            'stock_status' => $v->stock_status,
                            'weight_grams' => $v->weight_grams,
                        ];
                    })->values()->all();
                }

                $image = ! empty($item['image']) ? $item['image'] : null;
                if (! $image && $product) {
                    $img = $product->images->firstWhere('is_primary', true) ?? $product->images->first();
                    if ($img) {
                        $image = str_starts_with($img->path, 'http') || str_starts_with($img->path, '/') ? $img->path : '/storage/' . $img->path;
                    }
                }

                return [
                    'id' => $item['id'] ?? ('fs-' . uniqid()),
                    'name' => $item['name'] ?? ($product?->name ?? ''),
                    'slug' => $item['slug'] ?? ($product?->slug ?? ''),
                    'category' => $category,
                    'price' => $price,
                    'original_price' => $origPrice,
                    'discount_percentage' => $discountPct,
                    'image' => $image ?: '/brand/logo-circle.png',
                    'badge' => $item['badge'] ?? 'FLASH SALE',
                    'stock_status' => $item['stock_status'] ?? 'Tersedia',
                    'is_low_stock' => false,
                    'is_coffee' => $isCoffee,
                    'variants' => $variants,
                    'sold_percentage' => $item['sold_percentage'] ?? 75,
                    'sold_count' => 20,
                    'description' => $product?->short_description ?? ($product?->tasting_notes ? 'Notes: ' . $product->tasting_notes : 'Penawaran flash sale eksklusif untuk seduhan istimewa.'),
                ];
            }, $configuredHero);
        } else {
            $allFlashSaleItems = [];
        }

        // Category filter
        $filterCategory = $request->query('category', 'all');
        if ($filterCategory === 'equipment') {
            $filteredItems = array_values(array_filter($allFlashSaleItems, function ($item) {
                $cat = strtolower($item['category'] ?? '');
                return str_contains($cat, 'alat') || str_contains($cat, 'aksesoris') || str_contains($cat, 'equipment');
            }));
        } elseif ($filterCategory === 'coffee') {
            $filteredItems = array_values(array_filter($allFlashSaleItems, function ($item) {
                $cat = strtolower($item['category'] ?? '');
                return !str_contains($cat, 'alat') && !str_contains($cat, 'aksesoris') && !str_contains($cat, 'equipment');
            }));
        } else {
            $filteredItems = $allFlashSaleItems;
        }

        // Sorting
        $sort = $request->query('sort', 'featured');
        if ($sort === 'discount') {
            usort($filteredItems, fn($a, $b) => ($b['discount_percentage'] ?? 0) <=> ($a['discount_percentage'] ?? 0));
        } elseif ($sort === 'price_asc') {
            usort($filteredItems, fn($a, $b) => $a['price'] <=> $b['price']);
        } elseif ($sort === 'price_desc') {
            usort($filteredItems, fn($a, $b) => $b['price'] <=> $a['price']);
        }

        return Inertia::render('flash-sale/index', [
            'heroItems' => $allFlashSaleItems,
            'products' => $filteredItems,
            'endTime' => Setting::get('home_flash_sale_end_time'),
            'startTime' => Setting::get('home_flash_sale_start_time'),
            'title' => Setting::get('home_flash_sale_title', 'FLASH SALE'),
            'subtitle' => Setting::get('home_flash_sale_subtitle', 'Penawaran terbatas harga terbaik hari ini'),
            'isActive' => (bool) Setting::get('home_flash_sale_is_active', true),
            'categories' => [
                ['id' => 'all', 'label' => 'Semua Promo', 'count' => count($allFlashSaleItems)],
                [
                    'id' => 'equipment',
                    'label' => 'Alat & Perlengkapan Seduh',
                    'count' => count(array_filter($allFlashSaleItems, fn($item) => str_contains(strtolower($item['category'] ?? ''), 'alat') || str_contains(strtolower($item['category'] ?? ''), 'aksesoris') || str_contains(strtolower($item['category'] ?? ''), 'equipment'))),
                ],
                [
                    'id' => 'coffee',
                    'label' => 'Biji Kopi Specialty',
                    'count' => count(array_filter($allFlashSaleItems, fn($item) => !str_contains(strtolower($item['category'] ?? ''), 'alat') && !str_contains(strtolower($item['category'] ?? ''), 'aksesoris') && !str_contains(strtolower($item['category'] ?? ''), 'equipment'))),
                ],
            ],
            'currentCategory' => $filterCategory,
            'currentSort' => $sort,
        ]);
    }
}
