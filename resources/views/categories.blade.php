<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Semua Kategori - Alat Kopi Malang</title>
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=20261105c">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=20261105c">
    <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png?v=20261105c">
    <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png?v=20261105c">
    <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png?v=20261105c">
    <link rel="icon" type="image/svg+xml" href="/favicon.svg?v=20261105c">
    <link rel="icon" type="image/x-icon" sizes="any" href="/favicon.ico?v=20261105c">
    <link rel="shortcut icon" href="/favicon.ico?v=20261105c" type="image/x-icon">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=20261105">
    <link rel="apple-touch-icon-precomposed" sizes="180x180" href="/apple-touch-icon-precomposed.png?v=20261105">
    <link rel="manifest" href="/site.webmanifest?v=20261105">
    <!-- Fonts: Raleway (Alat Kopi Malang Signature Font) -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Raleway:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <!-- Tailwind CSS CDN for Standalone View -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['"Raleway"', 'system-ui', 'sans-serif'],
                    },
                    colors: {
                        brand: {
                            950: '#121e21',
                            900: '#1b2b2f',
                            800: '#24393f',
                            700: '#2e474e',
                            600: '#3b5a63',
                        },
                        sand: {
                            100: '#f4f6f7',
                            200: '#eef0f2',
                            300: '#e2e5e8',
                        },
                        cream: {
                            50: '#ffffff',
                            100: '#f8f9fa',
                        },
                        accent: {
                            copper: '#a06f32',
                            'copper-hover': '#865a24',
                        }
                    }
                }
            }
        }
    </script>
    <style>
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        body { font-family: 'Raleway', system-ui, sans-serif; -webkit-tap-highlight-color: transparent; }
    </style>
</head>
<body class="bg-sand-200/50 text-brand-950 min-h-screen flex justify-center font-sans">

    @php
        $settingsCategories = \App\Models\Setting::get('desktop_mega_menu_categories');
        $rawCategories = !empty($settingsCategories) && is_array($settingsCategories)
            ? $settingsCategories
            : (file_exists(resource_path('js/data/categories.json')) 
                ? json_decode(file_get_contents(resource_path('js/data/categories.json')), true) 
                : []);

        $categoriesJson = array_values(array_filter($rawCategories, fn($c) => ($c['is_active'] ?? true) !== false));
        foreach ($categoriesJson as &$cat) {
            $cat['viewAllUrl'] = $cat['url'] ?? ($cat['viewAllUrl'] ?? ('/shop?category=' . ($cat['slug'] ?? $cat['id'])));
            $cat['subcategories'] = array_values(array_filter($cat['subcategories'] ?? [], fn($s) => ($s['is_active'] ?? true) !== false));
        }
        unset($cat);
        $chips = array_merge(['Semua'], array_map(fn($c) => $c['name'], $categoriesJson));
    @endphp

    <!-- Mobile Viewport Container (Centered max-w-md on desktop) -->
    <div class="w-full max-w-md bg-white min-h-screen relative flex flex-col shadow-2xl sm:border-x sm:border-sand-200">
        
        <!-- Header Mobile & Filter Tabs -->
        <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-sand-200/90">
            <!-- Header bar -->
            <div class="h-14 px-4 flex items-center justify-between">
                <a href="/" class="w-10 h-10 flex items-center justify-center -ml-2 text-brand-700 hover:text-brand-950 rounded-full active:bg-sand-200/60 transition-colors" aria-label="Kembali">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
                </a>
                <h1 class="text-base font-bold text-brand-950 tracking-tight">Semua Kategori</h1>
                <a href="/shop" class="w-10 h-10 flex items-center justify-center -mr-2 text-brand-700 hover:text-brand-950 rounded-full active:bg-sand-200/60 transition-colors" aria-label="Cari">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </a>
            </div>

            <!-- Scrollable Chips -->
            <div class="flex items-center gap-2 px-4 pb-3 overflow-x-auto no-scrollbar scroll-smooth" id="chips-container">
                @foreach ($chips as $idx => $chip)
                    <button 
                        type="button" 
                        onclick="onChipClick('{{ $chip }}', this)" 
                        class="chip-btn px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 shrink-0 {{ $idx === 0 ? 'bg-brand-900 text-white font-bold shadow-xs ring-1 ring-brand-900' : 'bg-cream-100/90 border border-sand-200 text-brand-700 hover:border-brand-300 hover:bg-sand-200/60 active:scale-95' }}"
                        data-chip="{{ $chip }}">
                        {{ $chip }}
                    </button>
                @endforeach
            </div>
        </header>

        <!-- Main Content: Category Sections & 2-Col Grids -->
        <main class="flex-1 px-4 py-5 space-y-7 pb-28">
            @foreach ($categoriesJson as $cat)
                <section id="cat-section-{{ $cat['id'] }}" class="scroll-mt-32 space-y-3">
                    <div class="flex items-center justify-between">
                        <h2 class="text-[15px] font-extrabold text-brand-950 tracking-tight">{{ $cat['name'] }}</h2>
                        <a href="{{ $cat['viewAllUrl'] }}" class="text-xs font-bold text-accent-copper hover:text-accent-copper-hover flex items-center gap-0.5 group">
                            <span>Lihat Semua</span>
                            <svg class="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                        </a>
                    </div>

                    <!-- 2-Col Grid -->
                    <div class="grid grid-cols-2 gap-3">
                        @foreach ($cat['subcategories'] as $sub)
                            <a href="{{ $sub['url'] }}" class="group bg-cream-100/70 hover:bg-sand-200/70 border border-sand-200/80 rounded-2xl p-2.5 flex items-center gap-2.5 active:scale-[0.98] transition-all duration-150 text-left shadow-[0_1px_2px_rgba(18,30,33,0.02)]">
                                <div class="w-14 h-14 shrink-0 rounded-xl bg-white border border-sand-200/60 flex items-center justify-center p-2 shadow-[inset_0_1px_2px_rgba(18,30,33,0.02)]">
                                    <svg class="w-8 h-8 text-accent-copper" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>
                                <span class="text-xs font-semibold text-brand-950 leading-snug line-clamp-2">{{ $sub['name'] }}</span>
                            </a>
                        @endforeach
                    </div>
                </section>
            @endforeach
        </main>

        <!-- Fixed Bottom Navigation Bar -->
        <nav class="fixed bottom-0 inset-x-0 max-w-md mx-auto bg-white/95 backdrop-blur-md border-t border-sand-200/90 z-50 px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgba(18,30,33,0.06)] font-sans" aria-label="Navigasi">
            <div class="grid grid-cols-5 items-center">
                <!-- 1. Home -->
                <a href="/" class="flex flex-col items-center justify-center py-1 text-brand-600/70 hover:text-brand-950 font-medium active:scale-95 transition-all">
                    <svg class="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                    <span class="text-[10px] leading-none tracking-tight">Home</span>
                </a>

                <!-- 2. Kategori (ACTIVE) -->
                <a href="/kategori" class="flex flex-col items-center justify-center py-1 text-accent-copper font-bold active:scale-95 transition-all">
                    <svg class="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                    <span class="text-[10px] leading-none tracking-tight">Kategori</span>
                </a>

                <!-- 3. Journal / Cerita -->
                <a href="/blog" class="flex flex-col items-center justify-center py-1 text-brand-600/70 hover:text-brand-950 font-medium active:scale-95 transition-all">
                    <svg class="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                    <span class="text-[10px] leading-none tracking-tight">Journal</span>
                </a>

                <!-- 4. Keranjang -->
                <a href="/keranjang" class="flex flex-col items-center justify-center py-1 text-brand-600/70 hover:text-brand-950 font-medium active:scale-95 transition-all relative">
                    <div class="relative">
                        <svg class="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                        <span class="absolute -top-1 -right-2 bg-accent-copper text-white text-[9px] font-extrabold min-w-4 h-4 px-1 rounded-full flex items-center justify-center shadow-xs">2</span>
                    </div>
                    <span class="text-[10px] leading-none tracking-tight">Keranjang</span>
                </a>

                <!-- 5. Akun -->
                <a href="/login" class="flex flex-col items-center justify-center py-1 text-brand-600/70 hover:text-brand-950 font-medium active:scale-95 transition-all">
                    <svg class="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    <span class="text-[10px] leading-none tracking-tight">Akun</span>
                </a>
            </div>
        </nav>
    </div>

    <script>
        function onChipClick(chipName, btn) {
            document.querySelectorAll('.chip-btn').forEach(b => {
                b.className = 'chip-btn px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 shrink-0 bg-cream-100/90 border border-sand-200 text-brand-700 hover:border-brand-300 hover:bg-sand-200/60 active:scale-95';
            });
            btn.className = 'chip-btn px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 shrink-0 bg-brand-900 text-white shadow-xs ring-1 ring-brand-900';

            if (chipName === 'Semua') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }

            const map = {
                'Coffee': 'cat-section-coffee',
                'Brewing Gear': 'cat-section-brewing-gear',
                'Grinders': 'cat-section-grinders',
                'Espresso & Machines': 'cat-section-espresso-machines',
                'Ingredients': 'cat-section-ingredients',
                'Merchandise': 'cat-section-merchandise'
            };

            const targetId = map[chipName];
            if (targetId) {
                const el = document.getElementById(targetId);
                if (el) {
                    const headerOffset = 110;
                    const pos = el.getBoundingClientRect().top + window.pageYOffset - headerOffset;
                    window.scrollTo({ top: pos, behavior: 'smooth' });
                }
            }
        }
    </script>
</body>
</html>
