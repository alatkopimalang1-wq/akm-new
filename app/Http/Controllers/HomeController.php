<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(Request $request): Response
    {
        $categories = Category::whereNull('parent_id')
            ->with(['children'])
            ->orderBy('sort_order')
            ->get();

        $brands = Brand::where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get(['id', 'name', 'slug', 'origin', 'logo', 'description', 'sort_order']);

        return Inertia::render('welcome', [
            'categories' => $categories,
            'brands' => $brands,
        ]);
    }
}
