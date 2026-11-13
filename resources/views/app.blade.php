<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: oklch(1 0 0);
            }

            html.dark {
                background-color: oklch(0.145 0 0);
            }
        </style>

        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=20261113b">
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=20261113b">
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png?v=20261113b">
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png?v=20261113b">
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png?v=20261113b">
        <link rel="icon" type="image/png" sizes="512x512" href="/favicon-512x512.png?v=20261113b">
        <link rel="icon" type="image/x-icon" sizes="any" href="/favicon.ico?v=20261113b">
        <link rel="shortcut icon" href="/favicon.ico?v=20261113b" type="image/x-icon">
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=20261113b">
        <link rel="apple-touch-icon-precomposed" sizes="180x180" href="/apple-touch-icon-precomposed.png?v=20261113b">
        <link rel="manifest" href="/site.webmanifest?v=20261113b">

        <meta name="apple-mobile-web-app-title" content="Alat Kopi Malang">
        <meta name="application-name" content="Alat Kopi Malang">
        <meta name="theme-color" content="#0b1528">
        <meta name="msapplication-TileColor" content="#0b1528">
        <meta name="msapplication-TileImage" content="/favicon-192x192.png?v=20261113b">
        <meta property="og:image" content="/brand/logo-akm.png?v=20261113b">
        <meta property="og:image:width" content="512">
        <meta property="og:image:height" content="512">
        <meta name="twitter:image" content="/brand/logo-akm.png?v=20261113b">

        {{-- Preload self-hosted primary font --}}
        <link rel="preload" href="/fonts/raleway/raleway-latin-variable.woff2" as="font" type="font/woff2" crossorigin>

        {{-- Preload mobile LCP Hero Banner if on homepage --}}
        @if(($page['component'] ?? '') === 'welcome')
        <link rel="preload" as="image" href="/storage/banners/slide-1.jpg" fetchpriority="high">
        @endif

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        <x-inertia::head>
            <title>Your Trusted Coffee Business Partner — Alat Kopi Malang</title>
        </x-inertia::head>

        {{-- Meta Pixel (Facebook Pixel) Base Code --}}
        @include('partials.meta-pixel')
    </head>
    <body class="font-sans antialiased">
        <x-inertia::app />
    </body>
</html>
