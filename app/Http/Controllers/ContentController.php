<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Inertia\Inertia;
use Inertia\Response;

class ContentController extends Controller
{
    public function about(): Response
    {
        return Inertia::render('about', [
            'page' => Setting::get('page_about', []),
        ]);
    }

    public function visit(): Response
    {
        return Inertia::render('visit', [
            'page' => Setting::get('page_visit', []),
        ]);
    }

    public function preorderTerms(): Response
    {
        $saved = Setting::get('page_preorder_terms', []);
        $defaults = \App\Filament\Pages\ManagePreOrderTerms::defaultPreOrderTerms();

        return Inertia::render('preorder-terms', [
            'page' => array_merge($defaults, is_array($saved) ? $saved : []),
        ]);
    }

    public function customVisit(string $slug): Response
    {
        $customPages = Setting::get('custom_visit_pages', []);
        $cleanSlug = trim(strtolower($slug), '/');

        $page = collect($customPages)->first(function ($item) use ($cleanSlug) {
            $itemSlug = trim(strtolower($item['slug'] ?? ''), '/');
            return $itemSlug === $cleanSlug && ($item['is_active'] ?? true);
        });

        if (! $page) {
            abort(404);
        }

        return Inertia::render('visit', [
            'page' => $page,
        ]);
    }
}
