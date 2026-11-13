<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\VideoReel;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VideoReelController extends Controller
{
    public function index(): Response
    {
        $reels = VideoReel::orderBy('id', 'desc')->get();

        return Inertia::render('dashboard/reels', [
            'reels' => $reels,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'headline' => ['required', 'string', 'max:255'],
            'caption' => ['required', 'string'],
            'badge' => ['nullable', 'string', 'max:100'],
            'thumbnail' => ['nullable', 'string'],
            'video_url' => ['nullable', 'string'],
            'thumbnail_file' => ['nullable', 'image', 'max:5120'],
            'video_file' => ['nullable', 'file', 'mimes:mp4,mov,webm', 'max:51200'],
            'sort_order' => ['nullable', 'integer'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        if ($request->hasFile('thumbnail_file')) {
            $path = $request->file('thumbnail_file')->store('reels/thumbnails', 'public');
            $validated['thumbnail'] = '/storage/' . $path;
        }

        if ($request->hasFile('video_file')) {
            $path = $request->file('video_file')->store('reels/videos', 'public');
            $validated['video_url'] = '/storage/' . $path;
        }

        if (empty($validated['thumbnail'])) {
            $validated['thumbnail'] = 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=800&q=80';
        }

        if (empty($validated['video_url'])) {
            $validated['video_url'] = 'https://assets.mixkit.co/videos/preview/mixkit-barista-making-a-latte-in-a-coffee-shop-40149-large.mp4';
        }

        $validated['is_active'] = $request->boolean('is_active', true);
        $validated['sort_order'] = (int) ($request->input('sort_order', 0));

        VideoReel::create($validated);

        return redirect()->back()->with('success', 'Video Reel berhasil ditambahkan.');
    }

    public function update(Request $request, VideoReel $reel): RedirectResponse
    {
        $validated = $request->validate([
            'headline' => ['required', 'string', 'max:255'],
            'caption' => ['required', 'string'],
            'badge' => ['nullable', 'string', 'max:100'],
            'thumbnail' => ['nullable', 'string'],
            'video_url' => ['nullable', 'string'],
            'thumbnail_file' => ['nullable', 'image', 'max:5120'],
            'video_file' => ['nullable', 'file', 'mimes:mp4,mov,webm', 'max:51200'],
            'sort_order' => ['nullable', 'integer'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        if ($request->hasFile('thumbnail_file')) {
            $path = $request->file('thumbnail_file')->store('reels/thumbnails', 'public');
            $validated['thumbnail'] = '/storage/' . $path;
        }

        if ($request->hasFile('video_file')) {
            $path = $request->file('video_file')->store('reels/videos', 'public');
            $validated['video_url'] = '/storage/' . $path;
        }

        if ($request->has('is_active')) {
            $validated['is_active'] = $request->boolean('is_active');
        }

        $reel->update($validated);

        return redirect()->back()->with('success', 'Video Reel berhasil diperbarui.');
    }

    public function destroy(VideoReel $reel): RedirectResponse
    {
        $reel->delete();

        return redirect()->back()->with('success', 'Video Reel berhasil dihapus.');
    }
}

