{{-- Otten Coffee Model Desktop Mega Menu Component (Tailwind CSS + Vanilla JS) --}}
@php
    $categories = [
        [
            'id' => 'coffee',
            'name' => 'Coffee',
            'url' => '/shop?category=coffee',
            'subcategories' => [
                ['name' => 'Coffee Beans', 'url' => '/shop?category=filter-beans'],
                ['name' => 'Capsules', 'url' => '/shop?category=capsule'],
                ['name' => 'Drip Coffee', 'url' => '/shop?category=drip-bag'],
                ['name' => 'Cold Brew', 'url' => '/shop?category=cold-brew'],
                ['name' => 'Ready to Drink', 'url' => '/shop?category=cold-brew'],
                ['name' => 'Kopi Luwak', 'url' => '/shop?category=co-ferment'],
                ['name' => 'Green Bean', 'url' => '/shop?category=green-bean'],
                ['name' => 'Specialty Micro-lot', 'url' => '/shop?category=experimental'],
            ]
        ],
        [
            'id' => 'tea-beverages',
            'name' => 'Tea & Beverages',
            'url' => '/shop?category=tea',
            'subcategories' => [
                ['name' => 'Specialty Artisan Tea', 'url' => '/shop?category=tea'],
                ['name' => 'Matcha & Green Tea', 'url' => '/shop?category=powder'],
                ['name' => 'Cascara Coffee Cherry Tea', 'url' => '/shop?category=tea'],
                ['name' => 'Artisan Chocolate & Cocoa', 'url' => '/shop?category=powder'],
                ['name' => 'Chai & Spiced Tea', 'url' => '/shop?category=tea'],
                ['name' => 'Herbal & Floral Tisane', 'url' => '/shop?category=tea'],
                ['name' => 'Fruit Infusions', 'url' => '/shop?category=tea'],
                ['name' => 'Kombucha Culture & Brew', 'url' => '/shop?category=cold-brew'],
            ]
        ],
        [
            'id' => 'grinders',
            'name' => 'Grinders',
            'url' => '/shop?category=grinders',
            'subcategories' => [
                ['name' => 'Manual Hand Grinder', 'url' => '/shop?category=hand-grinder'],
                ['name' => 'Electric Flat Burr Grinder', 'url' => '/shop?category=electric-grinder'],
                ['name' => 'Conical Burr Grinder', 'url' => '/shop?category=conical-grinder'],
                ['name' => 'Commercial Espresso Grinder', 'url' => '/shop?category=espresso-grinder'],
                ['name' => 'Single Dose Grinder', 'url' => '/shop?category=electric-grinder'],
                ['name' => 'Burr Replacement & Upgrade', 'url' => '/shop?category=grinder-tools'],
                ['name' => 'Grinder Cleaner & Brush', 'url' => '/shop?category=grinder-tools'],
                ['name' => 'Anti-Popcorn Bellows & Hoppers', 'url' => '/shop?category=grinder-tools'],
            ]
        ],
        [
            'id' => 'coffee-machines',
            'name' => 'Coffee Machines',
            'url' => '/shop?category=espresso-machines',
            'subcategories' => [
                ['name' => 'Home Espresso Machine', 'url' => '/shop?category=home-espresso'],
                ['name' => 'Commercial Espresso Machine', 'url' => '/shop?category=commercial-espresso'],
                ['name' => 'Lever Espresso Machine', 'url' => '/shop?category=home-espresso'],
                ['name' => 'Automatic Bean to Cup', 'url' => '/shop?category=home-espresso'],
                ['name' => 'Capsule Espresso Machine', 'url' => '/shop?category=home-espresso'],
                ['name' => 'Cold Brew Drip Tower', 'url' => '/shop?category=cold-brew'],
                ['name' => 'Dedicated Milk Steamer Unit', 'url' => '/shop?category=espresso-machines'],
                ['name' => 'Machine Care & Descaler', 'url' => '/shop?category=barista-tools'],
            ]
        ],
        [
            'id' => 'manual-brewers',
            'name' => 'Manual Brewers',
            'url' => '/shop?category=manual-brew',
            'subcategories' => [
                ['name' => 'Dripper & Pour Over (V60)', 'url' => '/shop?category=dripper'],
                ['name' => 'French Press & Immersion', 'url' => '/shop?category=server'],
                ['name' => 'AeroPress & Accessories', 'url' => '/shop?category=manual-brew'],
                ['name' => 'Syphon & Vacuum Brewer', 'url' => '/shop?category=manual-brew'],
                ['name' => 'Chemex & Woodneck Carafe', 'url' => '/shop?category=server'],
                ['name' => 'Moka Pot & Stovetop Espresso', 'url' => '/shop?category=manual-brew'],
                ['name' => 'Cold Brew Bottle & Maker', 'url' => '/shop?category=cold-brew'],
                ['name' => 'Vietnamese Coffee Phin Drip', 'url' => '/shop?category=dripper'],
            ]
        ],
        [
            'id' => 'coffee-tools',
            'name' => 'Coffee Tools',
            'url' => '/shop?category=coffee-tools',
            'subcategories' => [
                ['name' => 'Digital Coffee Scale & Timer', 'url' => '/shop?category=scale'],
                ['name' => 'Variable Gooseneck Kettle', 'url' => '/shop?category=kettle'],
                ['name' => 'Coffee Glass Server & Carafe', 'url' => '/shop?category=server'],
                ['name' => 'Paper & Cloth Coffee Filters', 'url' => '/shop?category=paper-filter'],
                ['name' => 'SCA Cupping Bowls & Spoons', 'url' => '/shop?category=barista-tools'],
                ['name' => 'Vacuum Storage Coffee Canister', 'url' => '/shop?category=tumbler'],
                ['name' => 'Digital Thermometer & TDS Meter', 'url' => '/shop?category=scale'],
                ['name' => 'Flow Rate Monitor & Stand', 'url' => '/shop?category=scale'],
            ]
        ],
        [
            'id' => 'barista-tools',
            'name' => 'Barista Tools',
            'url' => '/shop?category=barista-tools',
            'subcategories' => [
                ['name' => 'Precision Tamper & Palm Tamper', 'url' => '/shop?category=barista-tools'],
                ['name' => 'Distribution & Leveler Tool', 'url' => '/shop?category=barista-tools'],
                ['name' => 'WDT Needle Distribution Tool', 'url' => '/shop?category=barista-tools'],
                ['name' => 'Bottomless Naked Portafilter', 'url' => '/shop?category=barista-tools'],
                ['name' => 'Latte Art Milk Pitcher / Jug', 'url' => '/shop?category=server'],
                ['name' => 'Silicone Tamping Mat & Station', 'url' => '/shop?category=barista-tools'],
                ['name' => 'Espresso Knockbox & Tube', 'url' => '/shop?category=barista-tools'],
                ['name' => 'Precision Puck Screen Mesh', 'url' => '/shop?category=paper-filter'],
            ]
        ],
        [
            'id' => 'syrups-powders',
            'name' => 'Syrups & Powders',
            'url' => '/shop?category=ingredients',
            'subcategories' => [
                ['name' => 'Artisan Gourmet Coffee Syrups', 'url' => '/shop?category=syrups'],
                ['name' => 'Caramel & Dark Chocolate Sauce', 'url' => '/shop?category=syrups'],
                ['name' => 'Frappe & Non-Dairy Creamer', 'url' => '/shop?category=powder'],
                ['name' => 'Taro, Red Velvet & Chai Powder', 'url' => '/shop?category=powder'],
                ['name' => 'Liquid Cane Sugar & Sweetener', 'url' => '/shop?category=syrups'],
                ['name' => 'Oat Milk & Barista Almond Dairy', 'url' => '/shop?category=dairy'],
                ['name' => 'Fresh Milk & Heavy Cream', 'url' => '/shop?category=dairy'],
                ['name' => 'Mocktail & Fruit Purees', 'url' => '/shop?category=syrups'],
            ]
        ],
        [
            'id' => 'roastery-supplies',
            'name' => 'Roastery Supplies',
            'url' => '/shop?category=roastery-supplies',
            'subcategories' => [
                ['name' => 'Jute & GrainPro Coffee Sacks', 'url' => '/shop?category=green-bean'],
                ['name' => 'Degassing Valve Coffee Bags', 'url' => '/shop?category=merchandise'],
                ['name' => 'Eco Kraft Pouch & Tin Tie', 'url' => '/shop?category=merchandise'],
                ['name' => 'Nitrogen Flusher & Packaging', 'url' => '/shop?category=barista-tools'],
                ['name' => 'Mini Electric Sample Roaster', 'url' => '/shop?category=espresso-machines'],
                ['name' => 'Green Bean Sample Cupping Trays', 'url' => '/shop?category=barista-tools'],
                ['name' => 'Coffee Moisture & Density Meter', 'url' => '/shop?category=scale'],
                ['name' => 'Continuous Band Heat Sealer', 'url' => '/shop?category=barista-tools'],
            ]
        ],
    ];
@endphp

<!-- Desktop Mega Menu Dropdown Container -->
<div id="desktop-mega-menu-container" class="hidden absolute top-[72px] inset-x-0 bg-white border-b border-sand-200 shadow-2xl z-50 text-brand-950 font-sans">
    <div class="max-w-7xl mx-auto flex items-stretch min-h-[440px]">
        <!-- Left Sidebar: Main Categories -->
        <aside class="w-[270px] shrink-0 border-r border-sand-200 bg-cream-50/70 p-3 overflow-y-auto max-h-[480px]">
            <div class="space-y-1" id="mega-sidebar-list">
                @foreach ($categories as $index => $cat)
                    <button
                        type="button"
                        onmouseenter="activateMegaCategory('{{ $cat['id'] }}', this)"
                        onclick="activateMegaCategory('{{ $cat['id'] }}', this)"
                        data-category-id="{{ $cat['id'] }}"
                        class="mega-category-btn w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 text-left cursor-pointer {{ $index === 0 ? 'bg-sand-200/90 text-accent-copper font-bold shadow-xs' : 'text-brand-800 hover:text-brand-950 hover:bg-cream-100/90' }}"
                    >
                        <span>{{ $cat['name'] }}</span>
                        <svg class="w-4 h-4 {{ $index === 0 ? 'text-accent-copper translate-x-0.5' : 'text-brand-300' }}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                @endforeach
            </div>
        </aside>

        <!-- Right Content Area: 4-Column Subcategory Grid -->
        <main class="flex-1 p-6 lg:p-8 bg-white max-h-[480px] overflow-y-auto" id="mega-content-area">
            @foreach ($categories as $index => $cat)
                <div id="mega-panel-{{ $cat['id'] }}" class="mega-category-panel {{ $index === 0 ? 'block' : 'hidden' }}">
                    <div class="flex items-center justify-between pb-4 mb-4 border-b border-sand-200/60">
                        <h3 class="text-base font-extrabold text-brand-950 tracking-tight">{{ $cat['name'] }}</h3>
                        <a href="{{ $cat['url'] }}" class="text-xs font-bold text-accent-copper hover:underline flex items-center gap-1 group">
                            <span>Lihat Semua di {{ $cat['name'] }}</span>
                            <svg class="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                        </a>
                    </div>

                    <div class="grid grid-cols-4 gap-3.5">
                        @foreach ($cat['subcategories'] as $sub)
                            <a href="{{ $sub['url'] }}" class="group border border-sand-200/90 hover:border-brand-300 rounded-xl p-2.5 flex items-center gap-3 bg-white hover:bg-cream-50/80 transition-all duration-150 shadow-[0_1px_2px_rgba(18,30,33,0.02)] active:scale-[0.98]">
                                <div class="w-12 h-12 shrink-0 rounded-lg bg-sand-100 border border-sand-200/60 flex items-center justify-center p-1.5 shadow-[inset_0_1px_2px_rgba(18,30,33,0.02)]">
                                    <svg class="w-7 h-7 text-accent-copper" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>
                                <span class="text-xs sm:text-sm font-semibold text-brand-900 group-hover:text-accent-copper leading-snug line-clamp-2 transition-colors">
                                    {{ $sub['name'] }}
                                </span>
                            </a>
                        @endforeach
                    </div>
                </div>
            @endforeach
        </main>
    </div>
</div>

<script>
    function activateMegaCategory(categoryId, targetBtn) {
        // Toggle sidebar button styles
        document.querySelectorAll('.mega-category-btn').forEach(btn => {
            btn.className = 'mega-category-btn w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 text-left cursor-pointer text-brand-800 hover:text-brand-950 hover:bg-cream-100/90';
            const icon = btn.querySelector('svg');
            if (icon) icon.className = 'w-4 h-4 text-brand-300';
        });

        targetBtn.className = 'mega-category-btn w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 text-left cursor-pointer bg-sand-200/90 text-accent-copper font-bold shadow-xs';
        const targetIcon = targetBtn.querySelector('svg');
        if (targetIcon) targetIcon.className = 'w-4 h-4 text-accent-copper translate-x-0.5';

        // Toggle right panel content
        document.querySelectorAll('.mega-category-panel').forEach(panel => {
            panel.classList.add('hidden');
            panel.classList.remove('block');
        });

        const activePanel = document.getElementById('mega-panel-' + categoryId);
        if (activePanel) {
            activePanel.classList.remove('hidden');
            activePanel.classList.add('block');
        }
    }
</script>

