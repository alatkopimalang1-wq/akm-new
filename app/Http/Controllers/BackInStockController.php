<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BackInStockController extends Controller
{
    public function index(Request $request): Response
    {
        $settings = Setting::all()->pluck('value', 'key')->toArray();

        $isActive = (bool) ($settings['home_back_in_stock_is_active'] ?? true);
        $title = $settings['home_back_in_stock_title'] ?? 'Back in Stock';
        $subtitle = $settings['home_back_in_stock_subtitle'] ?? 'Koleksi biji kopi dan produk favorit yang kini kembali tersedia';
        $badge = $settings['home_back_in_stock_badge'] ?? 'BACK IN STOCK';

        $configuredItems = $settings['home_back_in_stock_items'] ?? [];

        $allProducts = [];
        if (! empty($configuredItems) && is_array($configuredItems)) {
            $productIds = collect($configuredItems)->pluck('product_id')->filter()->unique()->all();
            $productSlugs = collect($configuredItems)->pluck('slug')->filter()->unique()->all();

            $productsById = ! empty($productIds)
                ? Product::with(['variants', 'images', 'categories'])->whereIn('id', $productIds)->get()->keyBy('id')
                : collect();

            $productsBySlug = ! empty($productSlugs)
                ? Product::with(['variants', 'images', 'categories'])->whereIn('slug', $productSlugs)->get()->keyBy('slug')
                : collect();

            $allProducts = array_map(function ($item) use ($productsById, $productsBySlug) {
                $product = (! empty($item['product_id']) ? $productsById->get($item['product_id']) : null)
                    ?? (! empty($item['slug']) ? $productsBySlug->get($item['slug']) : null);

                $origPrice = ! empty($item['original_price'])
                    ? (int) $item['original_price']
                    : ($product?->min_price && $product->min_price > ($item['price'] ?? 0) ? (int) $product->min_price : null);

                $price = (int) ($item['price'] ?? ($product?->min_price ?? 0));

                $isCoffee = $product ? ($product->series !== 'equipment') : true;
                $catName = $product?->categories->first()?->name;
                if (is_array($catName)) {
                    $catName = $catName['id'] ?? reset($catName);
                }

                $category = $catName ?: ($isCoffee ? 'Biji Kopi Specialty' : 'Alat Seduh');

                $image = ! empty($item['image']) ? $item['image'] : null;
                if (! $image && $product) {
                    $img = $product->images->firstWhere('is_primary', true) ?? $product->images->first();
                    if ($img) {
                        $image = str_starts_with($img->path, 'http') || str_starts_with($img->path, '/') ? $img->path : '/storage/' . $img->path;
                    }
                }

                return [
                    'id' => $item['id'] ?? ('bis-' . uniqid()),
                    'product_id' => $product?->id ?? ($item['product_id'] ?? null),
                    'name' => $item['name'] ?? ($product?->name ?? ''),
                    'slug' => $item['slug'] ?? ($product?->slug ?? ''),
                    'category' => $category,
                    'price' => $price,
                    'original_price' => $origPrice,
                    'image' => $image ?: '/brand/logo-circle.png',
                    'badge' => $item['badge'] ?? 'BACK IN STOCK',
                    'stock_status' => $item['stock_status'] ?? 'Tersedia',
                    'description' => $product?->short_description ?? ($product?->tasting_notes ? 'Notes: ' . $product->tasting_notes : 'Koleksi produk favorit kembali tersedia di Sanubari Roastery.'),
                ];
            }, $configuredItems);
        }

        return Inertia::render('back-in-stock/index', [
            'featuredItems' => array_slice($allProducts, 0, 4),
            'products' => array_values($allProducts),
            'title' => $title,
            'subtitle' => $subtitle,
            'badge' => $badge,
            'isActive' => $isActive,
        ]);
    }
}

