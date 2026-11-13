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

    public function legal(string $type = 'privacy'): Response
    {
        $titles = [
            'privacy' => 'Kebijakan Privasi / Privacy Policy',
            'terms' => 'Syarat & Ketentuan / Terms & Conditions',
            'refund' => 'Kebijakan Pengembalian & Garansi Kesegaran',
        ];

        return Inertia::render('legal', [
            'type' => $type,
            'title' => $titles[$type] ?? 'Informasi Legal',
        ]);
    }
}
