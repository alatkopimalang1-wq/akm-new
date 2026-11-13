<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Support\HelixGalleryDefaults;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class HelixGalleryController extends Controller
{
    public function index(): Response
    {
        $settings = Setting::all()->pluck('value', 'key')->toArray();

        $items = $settings['home_helix_gallery_items'] ?? HelixGalleryDefaults::getDefaultItems();
        if (!is_array($items) || empty($items)) {
            $items = HelixGalleryDefaults::getDefaultItems();
        }

        return Inertia::render('dashboard/helix-gallery', [
            'settings' => [
                'auto_rotate' => (bool) ($settings['home_helix_auto_rotate'] ?? true),
                'auto_rotate_speed' => (float) ($settings['home_helix_auto_rotate_speed'] ?? 0.20),
                'visible_columns' => (int) ($settings['home_helix_visible_columns'] ?? 5),
                'tiers_count' => (int) ($settings['home_helix_tiers_count'] ?? 2),
                'show_header' => (bool) ($settings['home_helix_show_header'] ?? false),
                'badge' => $settings['home_helix_badge'] ?? 'Galeri 3D Interaktif • Three.js',
                'title' => $settings['home_helix_title'] ?? 'Helical Ribbon Showcase — Jejak Rasa Sanubari',
                'subtitle' => $settings['home_helix_subtitle'] ?? 'Putar dan jelajahi arsip visual lereng Gunung Kawi, proses kurasi sangrai, dan suasana roastery dalam pita spiral 3D interaktif.',
            ],
            'items' => array_values($items),
        ]);
    }

    public function updateSettings(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'auto_rotate' => ['required', 'boolean'],
            'auto_rotate_speed' => ['required', 'numeric', 'min:0.01', 'max:1.0'],
            'visible_columns' => ['required', 'integer', 'min:3', 'max:8'],
            'tiers_count' => ['required', 'integer', 'min:1', 'max:4'],
            'show_header' => ['required', 'boolean'],
            'badge' => ['nullable', 'string', 'max:150'],
            'title' => ['nullable', 'string', 'max:255'],
            'subtitle' => ['nullable', 'string'],
        ]);

        Setting::set('home_helix_auto_rotate', (bool) $validated['auto_rotate']);
        Setting::set('home_helix_auto_rotate_speed', (float) $validated['auto_rotate_speed']);
        Setting::set('home_helix_visible_columns', (int) $validated['visible_columns']);
        Setting::set('home_helix_tiers_count', (int) $validated['tiers_count']);
        Setting::set('home_helix_show_header', (bool) $validated['show_header']);
        Setting::set('home_helix_badge', $validated['badge'] ?? 'Galeri 3D Interaktif • Three.js');
        Setting::set('home_helix_title', $validated['title'] ?? 'Helical Ribbon Showcase — Jejak Rasa Sanubari');
        Setting::set('home_helix_subtitle', $validated['subtitle'] ?? '');

        Cache::forget('sanubari_settings');

        return redirect()->back()->with('success', 'Aturan rotasi dan grid galeri 3D berhasil disimpan.');
    }

    public function storeItem(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['nullable', 'string', 'max:255'],
            'image' => ['nullable', 'string'],
            'image_file' => ['nullable', 'image', 'max:5120'],
            'sort_order' => ['nullable', 'integer'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $imagePath = $validated['image'] ?? null;
        if ($request->hasFile('image_file')) {
            $path = $request->file('image_file')->store('helix-gallery', 'public');
            $imagePath = '/storage/' . $path;
        }

        $items = Setting::get('home_helix_gallery_items', HelixGalleryDefaults::getDefaultItems());
        if (!is_array($items)) {
            $items = HelixGalleryDefaults::getDefaultItems();
        }

        $newItem = [
            'id' => 'helix-img-' . Str::random(8),
            'title' => '',
            'subtitle' => null,
            'badge' => null,
            'category' => null,
            'description' => null,
            'image' => $imagePath,
            'link_url' => null,
            'link_label' => null,
            'sort_order' => (int) ($validated['sort_order'] ?? (count($items) + 1)),
            'is_active' => $request->boolean('is_active', true),
        ];

        $items[] = $newItem;

        Setting::set('home_helix_gallery_items', array_values($items));
        Cache::forget('sanubari_settings');

        return redirect()->back()->with('success', 'Gambar galeri 3D berhasil ditambahkan.');
    }

    public function updateItem(Request $request, string $id): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['nullable', 'string', 'max:255'],
            'image' => ['nullable', 'string'],
            'image_file' => ['nullable', 'image', 'max:5120'],
            'sort_order' => ['nullable', 'integer'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $items = Setting::get('home_helix_gallery_items', HelixGalleryDefaults::getDefaultItems());
        if (!is_array($items)) {
            $items = HelixGalleryDefaults::getDefaultItems();
        }

        $found = false;
        foreach ($items as &$item) {
            if (($item['id'] ?? null) == $id) {
                $imagePath = $item['image'] ?? null;
                if ($request->hasFile('image_file')) {
                    $path = $request->file('image_file')->store('helix-gallery', 'public');
                    $imagePath = '/storage/' . $path;
                } elseif ($request->filled('image')) {
                    $imagePath = $request->input('image');
                }

                $item['title'] = '';
                $item['subtitle'] = null;
                $item['badge'] = null;
                $item['category'] = null;
                $item['description'] = null;
                $item['image'] = $imagePath;
                $item['link_url'] = null;
                $item['link_label'] = null;
                $item['sort_order'] = (int) ($validated['sort_order'] ?? ($item['sort_order'] ?? 0));
                $item['is_active'] = $request->boolean('is_active', true);

                $found = true;
                break;
            }
        }

        if ($found) {
            Setting::set('home_helix_gallery_items', array_values($items));
            Cache::forget('sanubari_settings');
        }

        return redirect()->back()->with('success', 'Gambar galeri 3D berhasil diperbarui.');
    }

    public function destroyItem(Request $request, string $id): RedirectResponse
    {
        $items = Setting::get('home_helix_gallery_items', HelixGalleryDefaults::getDefaultItems());
        if (!is_array($items)) {
            $items = HelixGalleryDefaults::getDefaultItems();
        }

        $filtered = array_filter($items, fn ($item) => ($item['id'] ?? null) != $id);

        Setting::set('home_helix_gallery_items', array_values($filtered));
        Cache::forget('sanubari_settings');

        return redirect()->back()->with('success', 'Gambar galeri 3D berhasil dihapus.');
    }

    public function resetDefaults(): RedirectResponse
    {
        Setting::set('home_helix_gallery_items', HelixGalleryDefaults::getDefaultItems());
        Cache::forget('sanubari_settings');

        return redirect()->back()->with('success', 'Daftar gambar galeri berhasil direset ke susunan default.');
    }
}

