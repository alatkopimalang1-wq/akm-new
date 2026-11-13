<?php

namespace App\Http\Middleware;

use App\Models\WebsiteVisit;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class TrackWebsiteVisitor
{
    public function handle(Request $request, Closure $next): Response
    {
        // Only track GET requests
        if (! $request->isMethod('GET')) {
            return $next($request);
        }

        // Ignore admin, livewire, api, static assets, and health checks
        if ($this->shouldIgnore($request)) {
            return $next($request);
        }

        $visitorId = $request->cookie('sb_vid') ?? (string) Str::uuid();

        // Detect device, browser, and platform
        $userAgent = (string) $request->userAgent();
        $device = $this->detectDevice($userAgent);
        $browser = $this->detectBrowser($userAgent);
        $platform = $this->detectPlatform($userAgent);

        // Record visit asynchronously or safely in DB
        try {
            $path = '/' . ltrim($request->path(), '/');
            if ($path === '//') {
                $path = '/';
            }

            WebsiteVisit::create([
                'visitor_id' => $visitorId,
                'ip_address' => $request->ip(),
                'url' => Str::limit($path, 250),
                'route_name' => $request->route()?->getName(),
                'device' => $device,
                'browser' => $browser,
                'platform' => $platform,
                'referer' => Str::limit($request->header('referer'), 250),
                'last_activity_at' => now(),
            ]);

            // Cache key for ultra-fast online visitor count
            Cache::put("sb_online_{$visitorId}", [
                'path' => $path,
                'device' => $device,
                'time' => now()->timestamp,
            ], now()->addMinutes(5));
        } catch (\Throwable $e) {
            // Silently ignore tracking errors so they never disrupt user browsing
        }

        /** @var Response $response */
        $response = $next($request);

        // Attach cookie if not already set
        if (! $request->hasCookie('sb_vid')) {
            $response->headers->setCookie(
                cookie()->forever('sb_vid', $visitorId, httpOnly: false, sameSite: 'lax')
            );
        }

        return $response;
    }

    protected function shouldIgnore(Request $request): bool
    {
        $path = $request->path();

        $ignoredPatterns = [
            'admin*',
            'livewire*',
            'filament*',
            'api/*',
            'up',
            'build/*',
            'storage/*',
            'brand/*',
            'favicon*',
            'robots.txt',
            'sitemap*',
            '_ignition*',
            'sanctum/*',
        ];

        foreach ($ignoredPatterns as $pattern) {
            if ($request->is($pattern)) {
                return true;
            }
        }

        // Ignore bots/crawlers
        $userAgent = strtolower((string) $request->userAgent());
        if (str_contains($userAgent, 'bot') || str_contains($userAgent, 'crawler') || str_contains($userAgent, 'spider')) {
            return true;
        }

        return false;
    }

    protected function detectDevice(string $ua): string
    {
        if (preg_match('/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i', $ua)) {
            return 'tablet';
        }

        if (preg_match('/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer/i', $ua)) {
            return 'mobile';
        }

        return 'desktop';
    }

    protected function detectBrowser(string $ua): string
    {
        if (str_contains($ua, 'Edg')) return 'Edge';
        if (str_contains($ua, 'Chrome')) return 'Chrome';
        if (str_contains($ua, 'Safari') && !str_contains($ua, 'Chrome')) return 'Safari';
        if (str_contains($ua, 'Firefox')) return 'Firefox';
        if (str_contains($ua, 'Opera') || str_contains($ua, 'OPR')) return 'Opera';

        return 'Other';
    }

    protected function detectPlatform(string $ua): string
    {
        if (str_contains($ua, 'Android')) return 'Android';
        if (str_contains($ua, 'iPhone') || str_contains($ua, 'iPad') || str_contains($ua, 'iPod')) return 'iOS';
        if (str_contains($ua, 'Windows')) return 'Windows';
        if (str_contains($ua, 'Macintosh') || str_contains($ua, 'Mac OS X')) return 'macOS';
        if (str_contains($ua, 'Linux')) return 'Linux';

        return 'Other';
    }
}
