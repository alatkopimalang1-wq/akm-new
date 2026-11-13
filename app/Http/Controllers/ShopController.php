<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShopController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Product::active()->with(['categories', 'images']);

        if ($search = trim($request->input('q', ''))) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('brand', 'like', "%{$search}%")
                  ->orWhere('short_description', 'like', "%{$search}%");
            });
        }

        if ($cat = $request->input('category')) {
            $query->whereHas('categories', function ($q) use ($cat) {
                $q->where('slug', $cat);
            });
        }

        if ($brand = $request->input('brand')) {
            $query->where('brand', $brand);
        }

        $sort = $request->input('sort', 'featured');
        match ($sort) {
            'price_asc' => $query->orderBy('price', 'asc'),
            'price_desc' => $query->orderBy('price', 'desc'),
            'newest' => $query->orderBy('id', 'desc'),
            'name' => $query->orderBy('name', 'asc'),
            default => $query->orderBy('is_featured', 'desc')->orderBy('id', 'desc'),
        };

        $products = $query->paginate(24)->withQueryString();
        $categories = Category::where('is_active', true)->withCount('products')->orderBy('sort_order')->get();

        return Inertia::render('shop', [
            'products' => $products,
            'categories' => $categories,
            'filters' => [
                'q' => $request->input('q', ''),
                'category' => $request->input('category', ''),
                'brand' => $request->input('brand', ''),
                'sort' => $sort,
            ],
        ]);
    }

    public function show(string $slug): Response
    {
        $product = Product::active()
            ->where('slug', $slug)
            ->with(['categories', 'images'])
            ->firstOrFail();

        $relatedProducts = Product::active()
            ->where('id', '!=', $product->id)
            ->whereHas('categories', function ($q) use ($product) {
                $q->whereIn('categories.id', $product->categories->pluck('id'));
            })
            ->with(['categories', 'images'])
            ->take(4)
            ->get();

        return Inertia::render('product-detail', [
            'product' => $product,
            'relatedProducts' => $relatedProducts,
        ]);
    }

    public function liveSearch(Request $request): JsonResponse
    {
        $q = trim($request->input('q', ''));
        if (empty($q)) {
            return response()->json(['products' => []]);
        }

        $products = Product::active()
            ->where(function ($query) use ($q) {
                $query->where('name', 'like', "%{$q}%")
                      ->orWhere('brand', 'like', "%{$q}%");
            })
            ->with(['categories', 'images'])
            ->take(8)
            ->get();

        return response()->json(['products' => $products]);
    }
}

