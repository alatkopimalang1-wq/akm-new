<?php

namespace App\Http\Controllers;

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

        return Inertia::render('welcome', [
            'categories' => $categories,
        ]);
    }
}
