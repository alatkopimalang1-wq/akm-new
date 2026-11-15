<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BrandController extends Controller
{
    public function index(Request $request): Response
    {
        $brands = Brand::where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get()
            ->map(function ($brand) {
                // Calculate product count safely
                $count = Product::active()
                    ->where(function ($q) use ($brand) {
                        $q->where('producer', 'like', "%{$brand->name}%")
                          ->orWhere('series', 'like', "%{$brand->name}%");
                    })
                    ->count();

                return [
                    'id' => $brand->id,
                    'name' => $brand->name,
                    'slug' => $brand->slug,
                    'origin' => $brand->origin,
                    'logo' => $brand->logo,
                    'description' => $brand->description,
                    'sort_order' => $brand->sort_order,
                    'products_count' => $count,
                ];
            });

        return Inertia::render('brands/index', [
            'brands' => $brands,
        ]);
    }
}
