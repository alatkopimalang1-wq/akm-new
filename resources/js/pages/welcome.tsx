import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { PublicLayout } from '@/layouts/public-layout';
import type { Category, SanubariSharedProps } from '@/types/sanubari';
import { HeroSlider } from '@/components/hero-slider';
import { DynamicCategoryIcon } from '@/components/dynamic-category-icon';
import { CountingNumber } from '@animate-ui/react/primitives/texts/counting-number';

interface WelcomeProps {
    categories?: Category[];
}

const resolveImageUrl = (img: unknown, fallback = ''): string => {
    if (!img) return fallback;
    let path = img;
    if (Array.isArray(img)) {
        path = img[0] ?? '';
    } else if (typeof img === 'object' && img !== null) {
        const vals = Object.values(img);
        path = vals[0] ?? '';
    }
    if (typeof path !== 'string' || path.trim() === '' || path === '/') {
        return fallback;
    }
    const trimmed = path.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
        return trimmed;
    }
    const clean = trimmed.replace(/^\/?(public\/|storage\/)?/, '');
    return `/storage/${clean}`;
};

export default function Welcome(_props: WelcomeProps) {
    const { props } = usePage<SanubariSharedProps>();
    const settings = props.settings;

    const defaultCategoryMenuItems = React.useMemo(() => [
        { id: 'cat-1', label: 'Semua Produk', iconKey: 'coffee', image: null as string | null, href: '/shop', badge: null as string | null },
        { id: 'cat-2', label: 'Kategori Alat', iconKey: 'sliders-horizontal', image: null as string | null, href: '/kategori', badge: null as string | null },
        { id: 'cat-3', label: 'Mesin Espresso', iconKey: 'flame', image: null as string | null, href: '/shop?category=coffee-machines', badge: null as string | null },
        { id: 'cat-4', label: 'Grinder Kopi', iconKey: 'zap', image: null as string | null, href: '/shop?category=grinders', badge: null as string | null },
        { id: 'cat-5', label: 'Manual Brewers', iconKey: 'droplet', image: null as string | null, href: '/shop?category=manual-brewers', badge: null as string | null },
        { id: 'cat-6', label: 'Tentang Kami', iconKey: 'award', image: null as string | null, href: '/tentang', badge: null as string | null },
        { id: 'cat-7', label: 'Showroom', iconKey: 'map-pin', image: null as string | null, href: '/kunjungi', badge: null as string | null },
    ], []);

    const resolvedCategoryItems = React.useMemo(() => {
        if (Array.isArray(settings?.home_category_menu_items) && settings.home_category_menu_items.length > 0) {
            return settings.home_category_menu_items.map((item: any, idx: number) => ({
                id: item.id || `cat-item-${idx}`,
                label: item.label || `Menu ${idx + 1}`,
                iconKey: item.icon || 'coffee',
                image: item.image || null,
                href: item.url || item.preset_url || item.custom_url || '/shop',
                badge: item.badge && String(item.badge).trim() !== '' ? String(item.badge).trim() : null,
            }));
        }

        return defaultCategoryMenuItems;
    }, [settings?.home_category_menu_items, defaultCategoryMenuItems]);

    return (
        <PublicLayout title="Your Trusted Coffee Business Partner">
            <div className="space-y-10 sm:space-y-16 pb-8 sm:pb-16 w-full max-w-full overflow-x-hidden">
                {/* 1. HERO SLIDER / CAROUSEL */}
                <HeroSlider
                    slides={settings?.home_hero_slides && settings.home_hero_slides.length > 0 ? settings.home_hero_slides : undefined}
                />

                {/* 2. STATISTIK ANGKA (CountingNumber) */}
                <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-sand-200/50 border border-sand-300/60 rounded-3xl p-6 sm:p-8 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                        <div className="space-y-1">
                            <div className="flex items-baseline justify-center">
                                <CountingNumber
                                    number={Number(settings?.home_stat_1_number) || 1450}
                                    fromNumber={Math.max(1, (Number(settings?.home_stat_1_number) || 1450) - 250)}
                                    thousandSeparator="."
                                    inView
                                    inViewOnce
                                    className="tabular-nums font-extrabold text-2xl sm:text-3xl lg:text-4xl text-brand-950"
                                />
                                <span className="text-xs sm:text-sm font-bold text-accent-copper ml-1">
                                    {settings?.home_stat_1_unit || 'mdpl'}
                                </span>
                            </div>
                            <span className="text-xs sm:text-sm font-semibold text-brand-800 block">
                                {settings?.home_stat_1_label || 'Ketinggian Lereng Kawi'}
                            </span>
                            <span className="text-[11px] text-brand-600 hidden sm:block">
                                {settings?.home_stat_1_desc || 'Tanah andosol vulkanis kaya mineral'}
                            </span>
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-baseline justify-center">
                                <CountingNumber
                                    number={Number(settings?.home_stat_2_number) || 100}
                                    fromNumber={Math.max(1, (Number(settings?.home_stat_2_number) || 100) - 25)}
                                    inView
                                    inViewOnce
                                    className="tabular-nums font-extrabold text-2xl sm:text-3xl lg:text-4xl text-brand-950"
                                />
                                <span className="text-xs sm:text-sm font-bold text-accent-copper ml-1">
                                    {settings?.home_stat_2_unit || '%'}
                                </span>
                            </div>
                            <span className="text-xs sm:text-sm font-semibold text-brand-800 block">
                                {settings?.home_stat_2_label || 'Spesialti Terlacak'}
                            </span>
                            <span className="text-[11px] text-brand-600 hidden sm:block">
                                {settings?.home_stat_2_desc || 'Jejak panen & petani transparan'}
                            </span>
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-baseline justify-center">
                                <CountingNumber
                                    number={Number(settings?.home_stat_3_number) || 18}
                                    fromNumber={1}
                                    inView
                                    inViewOnce
                                    className="tabular-nums font-extrabold text-2xl sm:text-3xl lg:text-4xl text-brand-950"
                                />
                                <span className="text-xs sm:text-sm font-bold text-accent-copper ml-1">
                                    {settings?.home_stat_3_unit || '+'}
                                </span>
                            </div>
                            <span className="text-xs sm:text-sm font-semibold text-brand-800 block">
                                {settings?.home_stat_3_label || 'Mitra Petani Kawi'}
                            </span>
                            <span className="text-[11px] text-brand-600 hidden sm:block">
                                {settings?.home_stat_3_desc || 'Direct trade harga adil berkelanjutan'}
                            </span>
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-baseline justify-center">
                                <CountingNumber
                                    number={Number(settings?.home_stat_4_number) || 48}
                                    fromNumber={Math.max(1, (Number(settings?.home_stat_4_number) || 48) - 36)}
                                    inView
                                    inViewOnce
                                    className="tabular-nums font-extrabold text-2xl sm:text-3xl lg:text-4xl text-brand-950"
                                />
                                <span className="text-xs sm:text-sm font-bold text-accent-copper ml-1">
                                    {settings?.home_stat_4_unit || 'Jam'}
                                </span>
                            </div>
                            <span className="text-xs sm:text-sm font-semibold text-brand-800 block">
                                {settings?.home_stat_4_label || 'Jaminan Fresh Roast'}
                            </span>
                            <span className="text-[11px] text-brand-600 hidden sm:block">
                                {settings?.home_stat_4_desc || 'Maksimal jeda sangrai ke pengiriman'}
                            </span>
                        </div>
                    </div>
                </section>

                {/* 3. KATEGORI PILIHAN (Category Selector below Hero Slider) */}
                <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-xl text-center mb-6 sm:mb-8 sm:text-2xl font-bold text-brand-950">
                        Kategori Pilihan
                    </h2>
                    <div className="flex sm:grid sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-5 overflow-x-auto pb-3 pt-1 no-scrollbar justify-start sm:justify-between scroll-smooth snap-x snap-mandatory">
                        {resolvedCategoryItems.map((cat) => (
                            <Link
                                key={cat.id}
                                href={cat.href}
                                className="group flex flex-col items-center gap-2.5 w-[calc((100vw-48px)/3.2)] min-w-[100px] max-w-[124px] sm:w-auto flex-shrink-0 cursor-pointer snap-start"
                            >
                                <div className="w-[70px] h-[70px] sm:w-16 sm:h-16 rounded-full bg-sand-200/70 group-hover:bg-sand-300 text-brand-900 flex items-center justify-center transition-all duration-150 group-hover:scale-105 active:scale-95 relative shadow-xs overflow-visible">
                                    {cat.image ? (
                                        <img
                                            src={resolveImageUrl(cat.image)}
                                            alt={cat.label}
                                            className="w-12 h-12 sm:w-10 sm:h-10 object-cover rounded-full"
                                        />
                                    ) : (
                                        <DynamicCategoryIcon name={cat.iconKey} className="w-8 h-8 sm:w-7 sm:h-7 text-brand-900" />
                                    )}
                                    {cat.badge && (
                                        <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-accent-copper text-white text-[10px] font-extrabold uppercase shadow-xs">
                                            {cat.badge}
                                        </span>
                                    )}
                                </div>

                                <span className="w-full text-[13px] sm:text-xs font-bold text-center text-brand-950 group-hover:text-accent-copper transition-colors leading-snug line-clamp-2 px-0.5 min-h-[34px] flex items-start justify-center">
                                    {cat.label}
                                </span>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </PublicLayout>
    );
}
