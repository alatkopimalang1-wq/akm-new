import React, { useEffect, useRef, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    ArrowUpRight,
    Award,
    BookOpen,
    ChevronLeft,
    ChevronRight,
    Clock,
    Coffee,
    Flame,
    FlaskConical,
    Loader2,
    MapPin,
    Mountain,
    Pause,
    Play,
    SlidersHorizontal,
    Star,
    Store,
    Truck,
    Volume2,
    VolumeX,
} from 'lucide-react';
import { PublicLayout } from '@/layouts/public-layout';
import type { BackInStockItem, BrewGuide, Category, Event, FlashSaleProduct, NewReleaseItem, Post, Product, SanubariSharedProps } from '@/types/sanubari';
import { HeroSlider } from '@/components/hero-slider';
import { ProductCard } from '@/components/product-card';
import { DynamicCategoryIcon } from '@/components/dynamic-category-icon';
import { FlashSaleSection } from '@/components/flash-sale-section';
import { NewReleaseSection } from '@/components/new-release-section';
import { BackInStockSection } from '@/components/back-in-stock-section';
import { CountingNumber } from '@animate-ui/react/primitives/texts/counting-number';

const CoverflowSlider = React.lazy(() =>
    import('@/components/coverflow-slider').then((m) => ({ default: m.CoverflowSlider }))
);

const VideoReelsSlider = React.lazy(() =>
    import('@/components/video-reels-slider').then((m) => ({ default: m.VideoReelsSlider }))
);

function LazyCoverflowSlider(props: any) {
    const [inView, setInView] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (inView) return;
        const el = containerRef.current;
        if (!el || typeof IntersectionObserver === 'undefined') {
            setInView(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '400px 0px' }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [inView]);

    return (
        <div ref={containerRef} className="min-h-[300px] w-full">
            {inView ? (
                <React.Suspense fallback={<div className="h-[300px] w-full animate-pulse bg-brand-950/10 rounded-3xl" />}>
                    <CoverflowSlider {...props} />
                </React.Suspense>
            ) : (
                <div className="h-[300px] w-full rounded-3xl bg-brand-950/5" />
            )}
        </div>
    );
}

function LazyVideoReelsSlider(props: any) {
    const [inView, setInView] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (inView) return;
        const el = containerRef.current;
        if (!el || typeof IntersectionObserver === 'undefined') {
            setInView(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '400px 0px' }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [inView]);

    return (
        <div ref={containerRef} className="min-h-[380px] w-full">
            {inView ? (
                <React.Suspense fallback={<div className="h-[380px] w-full animate-pulse bg-brand-950/10 rounded-3xl" />}>
                    <VideoReelsSlider {...props} />
                </React.Suspense>
            ) : (
                <div className="h-[380px] w-full rounded-3xl bg-brand-950/5" />
            )}
        </div>
    );
}

interface WelcomeProps {
    featuredProducts: Product[];
    newArrivals: Product[];
    latestProducts?: Product[];
    kawiProducts: Product[];
    recommendedProducts?: Product[];
    flashSaleProducts?: FlashSaleProduct[];
    newReleaseProducts?: NewReleaseItem[];
    backInStockProducts?: BackInStockItem[];
    categories: Category[];
    brewGuides: BrewGuide[];
    latestPosts: Post[];
    upcomingEvents: Event[];
    spotlightProduct?: Product;
    videoReels?: any[];
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

const resolveVideoUrl = (
    upload: unknown,
    url: unknown,
    fallback = '/storage/videos/BotsXqCoDHV1eo691EE9HpktTYWD1qLIWVUpieq4.mp4'
): string => {
    const uploadedPath = resolveImageUrl(upload);
    if (uploadedPath && uploadedPath !== '/' && uploadedPath !== '/storage/') {
        return uploadedPath;
    }
    if (typeof url === 'string') {
        const trimmed = url.trim();
        if (
            trimmed !== '' &&
            trimmed !== '/' &&
            (trimmed.startsWith('http://') ||
                trimmed.startsWith('https://') ||
                trimmed.endsWith('.mp4') ||
                trimmed.endsWith('.webm') ||
                trimmed.startsWith('/storage/'))
        ) {
            return trimmed;
        }
    }
    return fallback;
};

const resolveCategoryImageUrl = resolveImageUrl;

export default function Welcome({
    featuredProducts = [],
    newArrivals = [],
    latestProducts = [],
    kawiProducts = [],
    recommendedProducts = [],
    flashSaleProducts = [],
    newReleaseProducts = [],
    backInStockProducts = [],
    categories = [],
    brewGuides = [],
    latestPosts = [],
    spotlightProduct,
    videoReels = [],
}: WelcomeProps) {
    const { props } = usePage<SanubariSharedProps>();
    const settings = props.settings;
    const recScrollRef = useRef<HTMLDivElement>(null);
    const larisScrollRef = useRef<HTMLDivElement>(null);
    const charScrollRef = useRef<HTMLDivElement>(null);
    const articleScrollRef = useRef<HTMLDivElement>(null);
    const placeScrollRef = useRef<HTMLDivElement>(null);

    // Scroll helpers for carousels
    const scrollRec = (direction: 'left' | 'right') => {
        if (!recScrollRef.current) return;
        const offset = direction === 'left' ? -340 : 340;
        recScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    };

    const scrollArticles = (direction: 'left' | 'right') => {
        if (!articleScrollRef.current) return;
        const offset = direction === 'left' ? -340 : 340;
        articleScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    };

    const scrollPlace = (direction: 'left' | 'right') => {
        if (!placeScrollRef.current) return;
        const offset = direction === 'left' ? -340 : 340;
        placeScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    };

    const scrollChar = (direction: 'left' | 'right') => {
        if (!charScrollRef.current) return;
        const containerWidth = charScrollRef.current.clientWidth;
        const offset = direction === 'left' ? -containerWidth : containerWidth;
        charScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    };

    // Video controls state & ref
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [isVideoMuted, setIsVideoMuted] = useState(true);
    const [isVideoBuffering, setIsVideoBuffering] = useState(false);
    const [hasVideoError, setHasVideoError] = useState(false);

    const resolvedVideoSrc = resolveVideoUrl(
        settings?.home_video_upload,
        settings?.home_video_url
    );

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        video.defaultMuted = true;
        video.muted = true;
        video.setAttribute('muted', '');
        video.setAttribute('playsinline', '');
        video.setAttribute('webkit-playsinline', '');
        setIsVideoMuted(true);

        const tryPlay = () => {
            if (!videoRef.current) return;
            const playPromise = videoRef.current.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        setIsVideoPlaying(true);
                        setIsVideoBuffering(false);
                    })
                    .catch(() => {
                        setIsVideoPlaying(false);
                    });
            }
        };

        // iOS Safari: Trigger autoplay when the video enters the viewport
        let observer: IntersectionObserver | null = null;
        if (typeof IntersectionObserver !== 'undefined') {
            observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        tryPlay();
                    } else if (videoRef.current && !videoRef.current.paused) {
                        videoRef.current.pause();
                        setIsVideoPlaying(false);
                    }
                },
                { threshold: 0.15 }
            );
            observer.observe(video);
        } else {
            tryPlay();
        }

        // iOS Low Power Mode / Gesture requirement fallback: play on first user scroll or touch
        const handleInteraction = () => {
            if (videoRef.current && videoRef.current.paused) {
                tryPlay();
            }
            window.removeEventListener('touchstart', handleInteraction);
            window.removeEventListener('scroll', handleInteraction);
        };
        window.addEventListener('touchstart', handleInteraction, { passive: true, once: true });
        window.addEventListener('scroll', handleInteraction, { passive: true, once: true });

        return () => {
            if (observer) observer.disconnect();
            window.removeEventListener('touchstart', handleInteraction);
            window.removeEventListener('scroll', handleInteraction);
        };
    }, [resolvedVideoSrc]);

    const toggleVideoPlay = () => {
        if (!videoRef.current) return;
        if (videoRef.current.paused) {
            const playPromise = videoRef.current.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => setIsVideoPlaying(true))
                    .catch(() => setIsVideoPlaying(false));
            }
        } else {
            videoRef.current.pause();
            setIsVideoPlaying(false);
        }
    };

    const toggleVideoMute = () => {
        if (!videoRef.current) return;
        const nextMuted = !videoRef.current.muted;
        videoRef.current.muted = nextMuted;
        setIsVideoMuted(nextMuted);
    };

    interface EditorialItem {
        id: string;
        type: 'article' | 'guide';
        badge: string;
        subBadge?: string;
        title: string;
        excerpt: string;
        href: string;
        coverImage: string;
        actionText: string;
    }

    // Combine latestPosts and brewGuides into an unified editorial items list
    const postItems: EditorialItem[] = latestPosts.map((post) => {
        const title = typeof post.title === 'string' ? post.title : (post.title as any)?.id || '';
        const excerpt = typeof post.excerpt === 'string' ? post.excerpt : (post.excerpt as any)?.id || '';
        const meta = (post.meta as Record<string, any>) || {};
        const badgeLabel = meta.badge_label && meta.badge_label.toLowerCase() !== 'catatan roaster' ? meta.badge_label : null;
        return {
            id: `post-${post.id}`,
            type: 'article',
            badge: badgeLabel,
            title,
            excerpt,
            href: `/blog/${post.slug}`,
            coverImage: post.cover_image || 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
            actionText: 'Baca Artikel',
        };
    });

    const guideItems: EditorialItem[] = brewGuides.map((guide) => {
        const title = typeof guide.title === 'string' ? guide.title : (guide.title as any)?.id || '';
        const excerpt =
            typeof guide.description === 'string'
                ? guide.description
                : (guide.description as any)?.id ||
                `Metode seduh ${guide.method} rasio ${guide.ratio} dengan tingkat kesulitan ${guide.difficulty}.`;
        return {
            id: `guide-${guide.id}`,
            type: 'guide',
            badge: 'Panduan Seduh',
            subBadge: guide.brew_time || guide.method,
            title,
            excerpt,
            href: `/panduan-seduh/${guide.slug}`,
            coverImage:
                guide.cover_image ||
                'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
            actionText: 'Lihat Panduan',
        };
    });

    // Interleave posts and brew guides for dynamic editorial flow
    const combinedEditorialItems: EditorialItem[] = [];
    const maxEditorialLen = Math.max(postItems.length, guideItems.length);
    for (let i = 0; i < maxEditorialLen; i++) {
        if (i < postItems.length) combinedEditorialItems.push(postItems[i]);
        if (i < guideItems.length) combinedEditorialItems.push(guideItems[i]);
    }

    const resolvedEditorialItems: EditorialItem[] = React.useMemo(() => {
        const isManual = settings?.home_editorial_source === 'manual';
        const hasCustom = Array.isArray(settings?.home_editorial_items) && settings.home_editorial_items.length > 0;

        if ((isManual || (!settings?.home_editorial_source && hasCustom)) && hasCustom) {
            return settings.home_editorial_items.map((item: any, idx: number) => ({
                id: item.id || `custom-editorial-${idx}`,
                type: (item.badge && item.badge.toLowerCase().includes('panduan')) ? 'guide' : 'article',
                badge: (item.badge && item.badge.toLowerCase() !== 'catatan roaster') ? item.badge : null,
                subBadge: item.subBadge || undefined,
                title: item.title || '',
                excerpt: item.excerpt || '',
                href: item.href || item.url || '/blog',
                coverImage: item.coverImage || item.cover_url || item.image || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
                actionText: item.actionText || 'Baca Artikel',
            }));
        }

        return combinedEditorialItems;
    }, [settings?.home_editorial_source, settings?.home_editorial_items, combinedEditorialItems]);

    // 7 Option Category & Shortcut Menu: Directly customizable with icon/image, label, URL, and optional badge
    const defaultCategoryMenuItems = React.useMemo(() => [
        { id: 'cat-1', label: 'Filter Beans', iconKey: 'droplet', image: null as string | null, href: '/shop?category=filter-beans', badge: null as string | null },
        { id: 'cat-2', label: 'Espresso Beans', iconKey: 'flame', image: null as string | null, href: '/shop?category=espresso-beans', badge: null as string | null },
        { id: 'cat-3', label: 'Koleksi Kawi', iconKey: 'mountain', image: null as string | null, href: '/shop?series=kawi', badge: null as string | null },
        { id: 'cat-4', label: 'C.Y.B.R', iconKey: 'sliders-horizontal', image: null as string | null, href: '/cybr', badge: 'Baru' as string | null },
        { id: 'cat-5', label: 'Panduan Seduh', iconKey: 'book-open', image: null as string | null, href: '/panduan-seduh', badge: null as string | null },
        { id: 'cat-6', label: 'Grosir B2B', iconKey: 'truck', image: null as string | null, href: '/wholesale', badge: null as string | null },
        { id: 'cat-7', label: 'Showroom', iconKey: 'map-pin', image: null as string | null, href: '/kunjungi', badge: null as string | null },
    ], []);

    const resolvedCategoryItems = React.useMemo(() => {
        if (Array.isArray(settings?.home_category_menu_items) && settings.home_category_menu_items.length > 0) {
            return settings.home_category_menu_items.map((item: any, idx: number) => ({
                id: item.id || `cat-item-${idx}`,
                label: item.label || `Menu ${idx + 1}`,
                iconKey: item.icon || 'coffee',
                image: item.image || null,
                href: item.url || item.preset_url || item.custom_url || '#',
                badge: item.badge && String(item.badge).trim() !== '' ? String(item.badge).trim() : null,
            }));
        }

        return defaultCategoryMenuItems;
    }, [settings?.home_category_menu_items, defaultCategoryMenuItems]);

    // Alat Kopi Malang Place / Space Experiences (Showroom, Slow Bar, Roastery, Cupping)
    const defaultPlaceItems = [
        {
            id: 'place-slowbar',
            badge: 'Slow Bar & Tasting',
            subBadge: '09.00 – 23.00 WIB',
            title: 'Slow Bar & Manual Brew Experience',
            desc: 'Cicipi kalibrasi seduhan manual filter V60, Aeropress, dan Kalita Wave langsung di hadapan barista dari biji kopi sangrai minggu ini.',
            href: '/kunjungi',
            coverImage:
                'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
            actionText: 'Kunjungi Slow Bar',
        },
        {
            id: 'place-showroom',
            badge: 'Alat Kopi Malang',
            subBadge: 'Gedung Alat Kopi Malang Lt. 1',
            title: 'Equipment & Commercial Espresso Showroom',
            desc: 'Kolaborasi dengan Alat Kopi Malang: coba langsung mesin espresso komersial, grinder Mahlkönig/Eureka, dripper, dan timbangan digital.',
            href: '/kunjungi',
            coverImage:
                'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
            actionText: 'Eksplorasi Showroom',
        },
        {
            id: 'place-roastery',
            badge: 'Roasting Room',
            subBadge: 'Live Roasting',
            title: 'Laboratorium Roastery & Kurva Digital',
            desc: 'Pusat sangrai presisi biji kopi lereng Gunung Kawi dengan mesin sangrai berteknologi kurva digital untuk konsistensi profil rasa terbaik.',
            href: '/tentang',
            coverImage:
                'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=800&q=80',
            actionText: 'Tentang Roastery',
        },
        {
            id: 'place-cupping',
            badge: 'Sensory Lab',
            subBadge: 'Public Cupping',
            title: 'Sensory Room & Weekly Public Cupping',
            desc: 'Ruang kalibrasi rasa standar SCA untuk uji sensorik batch baru, cupping bersama roaster, dan workshop seduh terbuka.',
            href: '/acara',
            coverImage:
                'https://images.unsplash.com/photo-1518832553480-cd0e625ed3e6?auto=format&fit=crop&w=800&q=80',
            actionText: 'Jadwal Acara & Cupping',
        },
        {
            id: 'place-beans-bar',
            badge: 'Beans Dispensary',
            subBadge: 'Fresh Roast On-Demand',
            title: 'Beans Bar & Gilingan Presisi Sesuai Alat',
            desc: 'Pilih biji kopi langsung dari toples sangrai segar, konsultasikan profil rasa, dan dapatkan gilingan pas untuk alat seduh di rumah Anda.',
            href: '/shop',
            coverImage:
                'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=800&q=80',
            actionText: 'Beli Biji Kopi',
        },
        {
            id: 'place-b2b',
            badge: 'B2B & Wholesale',
            subBadge: 'Konsultasi Kedai',
            title: 'Lounge Kemitraan & Custom Blending C.Y.B.R',
            desc: 'Ruang diskusi hangat untuk pemilik kedai kopi dan horeka untuk mencicipi racikan houseblend kustom serta negosiasi pasokan grosir.',
            href: '/wholesale',
            coverImage:
                'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
            actionText: 'Konsultasi Kemitraan',
        },
    ];

    const placeItems = settings?.home_place_items && settings.home_place_items.length > 0
        ? settings.home_place_items
        : defaultPlaceItems;

    // Character / Origin collections (Artatix 1:1 "Temukan Event Menarik di Kotamu!" pattern)
    const defaultFlavorProfiles = [
        {
            id: 'manis-floral',
            title: 'Manis & Floral',
            desc: 'Single Origin Lereng Gunung Kawi',
            href: '/shop?series=kawi',
            bgImage:
                'https://images.unsplash.com/photo-1518832553480-cd0e625ed3e6?auto=format&fit=crop&w=600&q=80',
        },
        {
            id: 'fruity-juicy',
            title: 'Fruity & Juicy',
            desc: 'Inovasi CO-Ferment Buah Alami',
            href: '/shop?series=co-ferment',
            bgImage:
                'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80',
        },
        {
            id: 'bold-cokelat',
            title: 'Bold & Cokelat',
            desc: 'Espresso Roast & Robusta Dampit',
            href: '/shop?category=espresso-beans',
            bgImage:
                'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=600&q=80',
        },
        {
            id: 'clean-washed',
            title: 'Clean & Asam Cerah',
            desc: 'Washed Classic Terroir Kawi',
            href: '/shop?category=classic-process',
            bgImage:
                'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
        },
        {
            id: 'home-brewer',
            title: 'Paket Seduh Rumah',
            desc: 'Starter Pack Biji Kopi Pemula',
            href: '/shop',
            bgImage:
                'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=600&q=80',
        },
        {
            id: 'coffee-shop-b2b',
            title: 'Pasokan Kedai B2B',
            desc: 'Wholesale Grosir & Mesin Espresso',
            href: '/wholesale',
            bgImage:
                'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80',
        },
    ];

    const flavorProfiles = settings?.home_flavor_items && settings.home_flavor_items.length > 0
        ? settings.home_flavor_items
        : defaultFlavorProfiles;

    return (
        <PublicLayout title="Your Trusted Coffee Business Partner">
            <div className="space-y-10 sm:space-y-16 pb-4 sm:pb-16 w-full max-w-full overflow-x-hidden">
                {/* ============================================================== */}
                {/* 1. HERO SLIDER / CAROUSEL (Artatix 1:1 Pattern)                */}
                {/* ============================================================== */}
                <HeroSlider
                    slides={settings?.home_hero_slides && settings.home_hero_slides.length > 0 ? settings.home_hero_slides : undefined}
                />

                {/* Roastery Terroir & Impact Metrics (Animate UI CountingNumber) */}
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

                {/* ============================================================== */}
                {/* 1.5 KATEGORI PILIHAN (Category Selector below Hero Slider)     */}
                {/* 8 Circular Icon Badges with Direct Navigation to Catalog/Page  */}
                {/* ============================================================== */}
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
                                            src={resolveCategoryImageUrl(cat.image)}
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

                {/* ============================================================== */}
                {/* 1.8 FLASH SALE PROMO SECTION (Match Reference Design)          */}
                {/* ============================================================== */}
                <FlashSaleSection
                    products={flashSaleProducts}
                    endTime={settings?.home_flash_sale_end_time}
                    title={settings?.home_flash_sale_title}
                    subtitle={settings?.home_flash_sale_subtitle}
                    isActive={settings?.home_flash_sale_is_active !== false && settings?.home_flash_sale_is_active !== '0' && settings?.home_flash_sale_is_active !== 0}
                />

                {/* ============================================================== */}
                {/* 2. REKOMENDASI BIJI KOPI (Artatix 1:1 "Rekomendasi Event")      */}
                {/* Horizontal card carousel with Left/Right arrow controls        */}
                {/* ============================================================== */}
                <section className="w-full max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 overflow-hidden">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-brand-950">
                                {settings?.home_rec_title || 'Rekomendasi Biji Kopi'}
                            </h2>
                            <p className="text-xs sm:text-sm text-brand-700 mt-0.5">
                                {settings?.home_rec_subtitle || 'Kurasi sangrai segar lereng Gunung Kawi dan Nusantara pekan ini'}
                            </p>
                        </div>

                        {/* Navigation Arrows (Artatix Style) */}
                        <div className="hidden sm:flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => scrollRec('left')}
                                aria-label="Geser ke kiri"
                                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-sand-200/60 hover:bg-sand-200 text-brand-900 flex items-center justify-center transition-transform active:scale-95"
                            >
                                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                            <button
                                type="button"
                                onClick={() => scrollRec('right')}
                                aria-label="Geser ke kanan"
                                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-sand-200/60 hover:bg-sand-200 text-brand-900 flex items-center justify-center transition-transform active:scale-95"
                            >
                                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Horizontal Scrolling Track */}
                    <div
                        ref={recScrollRef}
                        className="flex gap-2 sm:gap-6 overflow-x-auto pb-4 pt-1 scroll-smooth snap-x snap-mandatory no-scrollbar"
                    >
                        {(recommendedProducts.length > 0
                            ? recommendedProducts
                            : kawiProducts.length > 0
                                ? kawiProducts
                                : featuredProducts
                        ).slice(0, 8).map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                className="flex-shrink-0 w-[165px] sm:w-[280px] snap-start"
                            />
                        ))}
                    </div>
                </section>

                {/* ============================================================== */}
                {/* 2.5 RUANG & PENGALAMAN ALAT KOPI MALANG (Place Slider above Laris Manis)*/}
                {/* Editorial cards showcasing Roastery, Showroom, Slow Bar, etc.  */}
                {/* ============================================================== */}
                <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-accent-copper/15 text-accent-copper">
                                    Ruang & Suasana
                                </span>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold text-brand-950">
                                {settings?.home_place_title || 'Roastery & Showroom Alat Kopi Malang'}
                            </h2>
                            <p className="text-xs sm:text-sm text-brand-700 mt-0.5">
                                {settings?.home_place_subtitle || 'Kunjungi slow bar, uji coba mesin espresso, dan rasakan atmosfer sangrai lereng Kawi di Kota Malang'}
                            </p>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3">
                            <Link
                                href="/kunjungi"
                                className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-brand-800 hover:text-accent-copper transition-colors"
                            >
                                <span>Kunjungi Showroom</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>

                            {/* Navigation Arrows */}
                            <div className="hidden sm:flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => scrollPlace('left')}
                                    aria-label="Geser ruang ke kiri"
                                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-sand-200/60 hover:bg-sand-200 text-brand-900 flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
                                >
                                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => scrollPlace('right')}
                                    aria-label="Geser ruang ke kanan"
                                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-sand-200/60 hover:bg-sand-200 text-brand-900 flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
                                >
                                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Horizontal Scrolling Track */}
                    <div
                        ref={placeScrollRef}
                        className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 pt-1 scroll-smooth snap-x snap-mandatory no-scrollbar"
                    >
                        {placeItems.map((item) => (
                            <Link
                                key={item.id}
                                href={item.href}
                                className="flex-shrink-0 w-[270px] sm:w-[320px] snap-start group flex flex-col justify-between bg-white rounded-2xl sm:rounded-3xl border border-sand-200 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden"
                            >
                                <div>
                                    <div className="relative aspect-16/10 bg-cream-50 overflow-hidden">
                                        <img
                                            src={resolveImageUrl(item.coverImage)}
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            loading="lazy"
                                        />
                                        <div className="absolute top-3 left-3">
                                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-xs bg-brand-950 text-white">
                                                {item.badge}
                                            </span>
                                        </div>
                                        <div className="absolute top-3 right-3">
                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-brand-950/70 text-sand-100 backdrop-blur-xs flex items-center gap-1">
                                                <MapPin className="w-3 h-3 text-accent-copper" />
                                                {item.subBadge}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-4 sm:p-5 space-y-2">
                                        <h3 className="text-sm sm:text-base font-bold text-brand-950 group-hover:text-accent-copper transition-colors line-clamp-2 leading-snug">
                                            {item.title}
                                        </h3>
                                        <p className="text-xs text-brand-600 line-clamp-2 leading-relaxed">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>

                                <div className="px-4 sm:px-5 py-3 bg-cream-50/80 border-t border-sand-100 flex items-center justify-between text-xs font-bold text-brand-800 group-hover:text-accent-copper transition-colors">
                                    <span>{item.actionText}</span>
                                    <div className="w-6 h-6 rounded-full bg-sand-200/70 group-hover:bg-accent-copper group-hover:text-white flex items-center justify-center transition-colors">
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Mobile "Kunjungi Showroom" Link */}
                    <div className="flex sm:hidden justify-center pt-3">
                        <Link
                            href="/kunjungi"
                            className="inline-flex items-center gap-1 text-xs font-bold text-brand-800 hover:text-accent-copper transition-colors"
                        >
                            <span>Eksplorasi Roastery & Showroom Malang</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </section>

                {/* ============================================================== */}
                {/* 2.7 NEW RELEASE SECTION (Max 4 Products, di atas Coffee Catering) */}
                {/* ============================================================== */}
                <NewReleaseSection
                    products={newReleaseProducts}
                    title={settings?.home_new_release_title}
                    subtitle={settings?.home_new_release_subtitle}
                    badge={settings?.home_new_release_badge}
                    buttonText={settings?.home_new_release_button_text}
                    buttonUrl={settings?.home_new_release_button_url}
                    isActive={settings?.home_new_release_is_active !== false && settings?.home_new_release_is_active !== '0' && settings?.home_new_release_is_active !== 0}
                />

                {/* ============================================================== */}
                {/* 2.8 PROMO BANNER ANIMASI: ALAT KOPI MALANG COFFEE CATERING (DI ATAS LARIS MANIS) */}
                {/* Gambar animasi dengan judul & deskripsi floating mengarah ke   */}
                {/* halaman coffee catering (/coffee-catering)                     */}
                {/* ============================================================== */}
                {(settings?.home_catering_banner_enable ?? true) && (
                    <section className="w-full max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
                        <Link
                            href={settings?.home_catering_banner_href || '/coffee-catering'}
                            className="group relative block w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-brand-200/60"
                        >
                            {/* Background Container with Animated Zooming Image */}
                            <div className="relative aspect-[21/9] w-full overflow-hidden bg-brand-950">
                                <img
                                    src={
                                        resolveCategoryImageUrl(settings?.home_catering_banner_image) ||
                                        settings?.home_catering_banner_image ||
                                        'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1600&q=80'
                                    }
                                    alt={settings?.home_catering_banner_title || 'Alat Kopi Malang Coffee Catering'}
                                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                                    loading="lazy"
                                    onError={(e) => {
                                        const target = e.currentTarget;
                                        const fallback = 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1600&q=80';
                                        if (target.src !== fallback) {
                                            target.src = fallback;
                                        }
                                    }}
                                />
                            </div>
                        </Link>
                    </section>
                )}

                {/* ============================================================== */}
                {/* 3. LARIS MANIS (Artatix 1:1 "Laris Manis" Curated Banners)       */}
                {/* Centered Heading + 3-Card Banner Display with Bottom Title Pill  */}
                {/* ============================================================== */}
                <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
                    <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8 space-y-1">
                        <h2 className="text-xl sm:text-3xl font-extrabold text-brand-950">
                            {settings?.home_laris_title || 'Laris Manis'}
                        </h2>
                        <p className="text-sm text-brand-700">
                            {settings?.home_laris_subtitle || 'Koleksi biji kopi paling laris dan sering diseduh di Alat Kopi Malang yang mungkin kamu sukai'}
                        </p>
                    </div>

                    {/* Artatix 1:1 Responsive Layout: Horizontal Scroll Track on Mobile, 3-Card 1:1 Square Grid on Desktop */}
                    <div
                        ref={larisScrollRef}
                        className="flex md:grid md:grid-cols-3 gap-4 sm:gap-6 items-stretch overflow-x-auto md:overflow-visible pb-3 md:pb-0 snap-x snap-mandatory no-scrollbar"
                    >
                        {/* Banner 1: Left (1:1 Aspect Ratio) */}
                        <Link
                            href={settings?.home_laris_1_href || '/shop?series=kawi'}
                            className="w-[78vw] sm:w-[320px] md:w-auto flex-shrink-0 snap-center relative rounded-2xl sm:rounded-3xl overflow-hidden aspect-square md:aspect-square bg-brand-900 group shadow-md hover:shadow-xl transition-all duration-300"
                        >
                            <img
                                src={resolveCategoryImageUrl(settings?.home_laris_1_image) || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80'}
                                alt={settings?.home_laris_1_title || 'Gunung Kawi Honey'}
                                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-brand-950/85 via-brand-950/30 to-transparent flex flex-col justify-end items-center p-4 sm:p-6 text-center">
                                <span className="px-4 py-2.5 rounded-xl bg-white text-brand-950 text-xs sm:text-sm font-bold text-center shadow-md group-hover:bg-accent-copper group-hover:text-white transition-colors">
                                    {settings?.home_laris_1_title || 'Gunung Kawi Honey Anaerobic'}
                                </span>
                                {settings?.home_laris_1_subtitle && (
                                    <span className="text-sand-200 text-xs mt-1.5 font-medium line-clamp-1">
                                        {settings.home_laris_1_subtitle}
                                    </span>
                                )}
                            </div>
                        </Link>

                        {/* Banner 2: Center (1:1 Aspect Ratio) */}
                        <Link
                            href={settings?.home_laris_2_href || '/shop?category=espresso-beans'}
                            className="w-[78vw] sm:w-[320px] md:w-auto flex-shrink-0 snap-center relative rounded-2xl sm:rounded-3xl overflow-hidden aspect-square md:aspect-square bg-brand-950 group shadow-md hover:shadow-xl transition-all duration-300"
                        >
                            <img
                                src={resolveCategoryImageUrl(settings?.home_laris_2_image) || 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1200&q=80'}
                                alt={settings?.home_laris_2_title || 'Alat Kopi Malang Signature Houseblend'}
                                className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-brand-950/85 via-brand-950/30 to-transparent flex flex-col justify-end items-center p-4 sm:p-6 text-center">
                                <span className="px-4 py-2.5 rounded-xl bg-white text-brand-950 text-xs sm:text-sm font-extrabold shadow-md group-hover:bg-accent-copper group-hover:text-white transition-colors">
                                    {settings?.home_laris_2_title || 'Alat Kopi Malang Signature Houseblend Espresso'}
                                </span>
                                {settings?.home_laris_2_subtitle && (
                                    <span className="text-sand-200 text-xs mt-1.5 font-medium line-clamp-1">
                                        {settings.home_laris_2_subtitle}
                                    </span>
                                )}
                            </div>
                        </Link>

                        {/* Banner 3: Right (1:1 Aspect Ratio) */}
                        <Link
                            href={settings?.home_laris_3_href || '/cybr'}
                            className="w-[78vw] sm:w-[320px] md:w-auto flex-shrink-0 snap-center relative rounded-2xl sm:rounded-3xl overflow-hidden aspect-square md:aspect-square bg-brand-900 group shadow-md hover:shadow-xl transition-all duration-300"
                        >
                            <img
                                src={resolveCategoryImageUrl(settings?.home_laris_3_image) || 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80'}
                                alt={settings?.home_laris_3_title || 'C.Y.B.R Custom Blending'}
                                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-brand-950/85 via-brand-950/30 to-transparent flex flex-col justify-end items-center p-4 sm:p-6 text-center">
                                <span className="px-4 py-2.5 rounded-xl bg-white text-brand-950 text-xs sm:text-sm font-bold text-center shadow-md group-hover:bg-accent-copper group-hover:text-white transition-colors">
                                    {settings?.home_laris_3_title || 'C.Y.B.R Blend Sendiri'}
                                </span>
                                {settings?.home_laris_3_subtitle && (
                                    <span className="text-sand-200 text-xs mt-1.5 font-medium line-clamp-1">
                                        {settings.home_laris_3_subtitle}
                                    </span>
                                )}
                            </div>
                        </Link>
                    </div>
                </section>

                {/* ============================================================== */}
                {/* 3.5 JEJAK RASA & EDUKASI SEDUH (Articles & Brew Guides Slider)  */}
                {/* Editorial magazine cards with horizontal scroll & smooth snap   */}
                {/* ============================================================== */}
                {resolvedEditorialItems.length > 0 && (
                    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-accent-copper/15 text-accent-copper">
                                        {settings?.home_editorial_badge || 'Edukasi & Cerita'}
                                    </span>
                                </div>
                                <h2 className="text-xl sm:text-2xl font-bold text-brand-950">
                                    {settings?.home_editorial_title || 'Jejak Rasa & Edukasi Seduh'}
                                </h2>
                                <p className="text-xs sm:text-sm text-brand-700 mt-0.5">
                                    {settings?.home_editorial_subtitle || 'Eksplorasi catatan roaster, cerita terroir Gunung Kawi, dan resep seduh presisi'}
                                </p>
                            </div>

                            <div className="flex items-center gap-2 sm:gap-3">
                                <Link
                                    href={settings?.home_editorial_view_all_url || '/blog'}
                                    className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-brand-800 hover:text-accent-copper transition-colors"
                                >
                                    <span>{settings?.home_editorial_view_all_text || 'Lihat Semua'}</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Link>

                                {/* Navigation Arrows */}
                                <div className="hidden sm:flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => scrollArticles('left')}
                                        aria-label="Geser artikel ke kiri"
                                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-sand-200/60 hover:bg-sand-200 text-brand-900 flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
                                    >
                                        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => scrollArticles('right')}
                                        aria-label="Geser artikel ke kanan"
                                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-sand-200/60 hover:bg-sand-200 text-brand-900 flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
                                    >
                                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Horizontal Scrolling Track */}
                        <div
                            ref={articleScrollRef}
                            className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 pt-1 scroll-smooth snap-x snap-mandatory no-scrollbar"
                        >
                            {resolvedEditorialItems.map((item) => (
                                <Link
                                    key={item.id}
                                    href={item.href}
                                    className="flex-shrink-0 w-[270px] sm:w-[320px] snap-start group flex flex-col justify-between bg-white rounded-2xl sm:rounded-3xl border border-sand-200 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden"
                                >
                                    <div>
                                        <div className="relative aspect-16/10 bg-cream-50 overflow-hidden">
                                            <img
                                                src={resolveImageUrl(item.coverImage)}
                                                alt={item.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                loading="lazy"
                                            />
                                            {item.badge && item.badge.trim() !== '' && item.badge.toLowerCase() !== 'catatan roaster' && (
                                                <div className="absolute top-3 left-3">
                                                    <span
                                                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-xs ${item.type === 'guide'
                                                            ? 'bg-accent-copper text-white'
                                                            : 'bg-brand-950 text-white'
                                                            }`}
                                                    >
                                                        {item.badge}
                                                    </span>
                                                </div>
                                            )}
                                            {item.subBadge && (
                                                <div className="absolute top-3 right-3">
                                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-brand-950/70 text-sand-100 backdrop-blur-xs flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {item.subBadge}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-4 sm:p-5 space-y-2">
                                            <h3 className="text-sm sm:text-base font-bold text-brand-950 group-hover:text-accent-copper transition-colors line-clamp-2 leading-snug">
                                                {item.title}
                                            </h3>
                                            {item.excerpt && (
                                                <p className="text-xs text-brand-600 line-clamp-2 leading-relaxed">
                                                    {item.excerpt}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="px-4 sm:px-5 py-3 bg-cream-50/80 border-t border-sand-100 flex items-center justify-between text-xs font-bold text-brand-800 group-hover:text-accent-copper transition-colors">
                                        <span>{item.actionText}</span>
                                        <div className="w-6 h-6 rounded-full bg-sand-200/70 group-hover:bg-accent-copper group-hover:text-white flex items-center justify-center transition-colors">
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Mobile "Lihat Semua" Link */}
                        <div className="flex sm:hidden justify-center pt-3">
                            <Link
                                href={settings?.home_editorial_view_all_url || '/blog'}
                                className="inline-flex items-center gap-1 text-xs font-bold text-brand-800 hover:text-accent-copper transition-colors"
                            >
                                <span>{settings?.home_editorial_view_all_text ? `${settings.home_editorial_view_all_text} Artikel & Panduan` : 'Lihat Semua Artikel & Panduan'}</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </section>
                )}

                {/* ============================================================== */}
                {/* 4.5 PROMO BANNER ANIMASI: BOOKING TEMPAT ACARA & KOMUNITAS     */}
                {/* Gambar animasi dengan judul & deskripsi floating mengarah ke   */}
                {/* halaman booking tempat (/booking-tempat)                       */}
                {/* ============================================================== */}
                {(settings?.home_booking_banner_enable ?? true) && (
                    <section className="w-full max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
                        <Link
                            href={settings?.home_booking_banner_href || '/booking-tempat'}
                            className="group relative block w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-brand-200/60"
                        >
                            {/* Background Container with Animated Zooming Image */}
                            <div className="relative aspect-[21/9] w-full overflow-hidden bg-brand-950">
                                <img
                                    src={
                                        resolveCategoryImageUrl(settings?.home_booking_banner_image) ||
                                        settings?.home_booking_banner_image ||
                                        'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1600&q=80'
                                    }
                                    alt={settings?.home_booking_banner_title || 'Booking Tempat di Alat Kopi Malang'}
                                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                                    loading="lazy"
                                    onError={(e) => {
                                        const target = e.currentTarget;
                                        const fallback = 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1600&q=80';
                                        if (target.src !== fallback) {
                                            target.src = fallback;
                                        }
                                    }}
                                />
                            </div>
                        </Link>
                    </section>
                )}

                {/* ============================================================== */}
                {/* 4.6 BACK IN STOCK SECTION (Max 4 Products, below Booking Tempat) */}
                {/* ============================================================== */}
                <BackInStockSection
                    products={backInStockProducts}
                    title={settings?.home_back_in_stock_title}
                    subtitle={settings?.home_back_in_stock_subtitle}
                    badge={settings?.home_back_in_stock_badge}
                    buttonText={settings?.home_back_in_stock_button_text}
                    buttonUrl={settings?.home_back_in_stock_button_url}
                    isActive={settings?.home_back_in_stock_is_active !== false && settings?.home_back_in_stock_is_active !== '0' && settings?.home_back_in_stock_is_active !== 0}
                />

                {/* ============================================================== */}
                {/* 5.05 PROMO BANNER ANIMASI: RESEP & PANDUAN SEDUH KOPI          */}
                {/* Banner animasi dengan judul & deskripsi floating mengarah ke   */}
                {/* halaman resep seduh (/panduan-seduh atau /resep-seduh)         */}
                {/* ============================================================== */}
                {(settings?.home_brew_banner_enable ?? true) && (
                    <section className="w-full max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
                        <Link
                            href={settings?.home_brew_banner_href || '/panduan-seduh'}
                            className="group relative block w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-brand-200/60"
                        >
                            {/* Background Container with Animated Zooming Image */}
                            <div className="relative aspect-[21/9] w-full overflow-hidden bg-brand-950">
                                <img
                                    src={
                                        resolveCategoryImageUrl(settings?.home_brew_banner_image) ||
                                        settings?.home_brew_banner_image ||
                                        'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1600&q=80'
                                    }
                                    alt={settings?.home_brew_banner_title || 'Resep Seduh Kopi Alat Kopi Malang'}
                                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                                    loading="lazy"
                                    onError={(e) => {
                                        const target = e.currentTarget;
                                        const fallback = 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1600&q=80';
                                        if (target.src !== fallback) {
                                            target.src = fallback;
                                        }
                                    }}
                                />
                            </div>
                        </Link>
                    </section>
                )}

                {/* ============================================================== */}
                {/* 5.1 COVERFLOW SLIDER: MITRA KEDAI & RUANG KOPI (MALANG)        */}
                {/* 3D coverflow card carousel inspired by partner coffee shops   */}
                {/* ============================================================== */}
                <LazyCoverflowSlider
                    title={settings?.home_partners_title || 'Disajikan di Kedai Pilihan'}
                    subtitle={settings?.home_partners_subtitle || 'Temukan seduhan biji kopi sangrai Alat Kopi Malang di berbagai kedai kopi dan coffee space terkurasi di Malang'}
                    slides={Array.isArray(settings?.home_partners_slides) && settings.home_partners_slides.length > 0 ? settings.home_partners_slides : undefined}
                />

                {/* ============================================================== */}
                {/* 5.2 VIDEO REELS: ALAT KOPI MALANG REELS VIDEOS                         */}
                {/* Vertical video reels card slider with tagged products & modal   */}
                {/* ============================================================== */}
                <LazyVideoReelsSlider
                    title={settings?.home_reels_title || 'Alat Kopi Malang Reels Videos'}
                    subtitle={settings?.home_reels_subtitle || 'Tonton tutorial seduh, bedah mesin & tips kopi langsung di Instagram Reels'}
                    viewAllText={settings?.home_reels_view_all_text || 'Lihat Semua'}
                    viewAllHref={settings?.home_reels_view_all_url || '/video'}
                    reels={videoReels.length > 0 ? videoReels : undefined}
                />

                {/* ============================================================== */}
                {/* 6. TEMUKAN KOPI BERDASARKAN KARAKTER RASA (Artatix "Kotamu!")   */}
                {/* Region / Flavor Profile Cards with Arrow Pill Button            */}
                {/* ============================================================== */}
                <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
                    <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6">
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-brand-950">
                                {settings?.home_flavor_title || 'Temukan Kopi Sesuai Karakter Seduhan Anda!'}
                            </h2>
                            <p className="text-xs sm:text-sm text-brand-700 mt-0.5">
                                {settings?.home_flavor_subtitle || 'Pilih biji kopi berdasarkan preferensi aroma, metode seduh, atau kebutuhan bisnis'}
                            </p>
                        </div>
                        <div className="flex sm:hidden items-center gap-1.5 shrink-0">
                            <button
                                type="button"
                                onClick={() => scrollChar('left')}
                                aria-label="Geser ke kiri"
                                className="w-8 h-8 rounded-full bg-sand-200/60 hover:bg-sand-200 text-brand-900 flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => scrollChar('right')}
                                aria-label="Geser ke kanan"
                                className="w-8 h-8 rounded-full bg-sand-200/60 hover:bg-sand-200 text-brand-900 flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Responsive Grid / Horizontal Scroll for 6 Flavor Profiles */}
                    <div
                        ref={charScrollRef}
                        className="flex sm:grid sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 overflow-x-auto sm:overflow-visible pb-3 sm:pb-0 scroll-smooth snap-x snap-mandatory no-scrollbar"
                    >
                        {flavorProfiles.map((item) => (
                            <Link
                                key={item.id}
                                href={item.href}
                                className="group relative rounded-2xl overflow-hidden aspect-3/4 bg-brand-900 flex flex-col justify-between p-3.5 sm:p-4 text-white shrink-0 w-[calc(50%-6px)] sm:w-auto snap-start"
                            >
                                {/* Background Image */}
                                <img
                                    src={resolveCategoryImageUrl(item.bgImage) || item.bgImage}
                                    alt={item.title}
                                    className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-300"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-brand-950/70" />

                                {/* Top Badge / Spacer */}
                                <div className="relative z-10" />

                                {/* Bottom Content & Artatix Blue/Brand Arrow Pill */}
                                <div className="relative z-10 space-y-2">
                                    <span className="text-xs text-brand-200 leading-tight block">
                                        {item.desc}
                                    </span>
                                    <div className="w-full py-2 px-3 rounded-xl bg-brand-700 hover:bg-brand-600 text-white text-xs font-bold flex items-center justify-between transition-colors">
                                        <span className="truncate">{item.title}</span>
                                        <ArrowUpRight className="w-3.5 h-3.5 flex-shrink-0 ml-1" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* ============================================================== */}
                {/* CINEMATIC ROASTERY VIDEO (Above Footer)                        */}
                {/* Atmospheric loop video with sound/pause controls & brand info   */}
                {/* ============================================================== */}
                <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div
                        onClick={toggleVideoPlay}
                        className="relative rounded-3xl overflow-hidden aspect-16/9 sm:aspect-21/9 bg-brand-950 shadow-xl border border-brand-900/60 group cursor-pointer"
                    >
                        <video
                            ref={videoRef}
                            src={resolvedVideoSrc}
                            autoPlay
                            loop
                            muted
                            playsInline
                            {...({ 'webkit-playsinline': 'true' } as any)}
                            preload="metadata"
                            className="w-full h-full object-cover"
                            onWaiting={() => setIsVideoBuffering(true)}
                            onPlaying={() => {
                                setIsVideoBuffering(false);
                                setIsVideoPlaying(true);
                            }}
                            onPlay={() => setIsVideoPlaying(true)}
                            onPause={() => setIsVideoPlaying(false)}
                            onError={() => {
                                setHasVideoError(true);
                                setIsVideoBuffering(false);
                            }}
                        >
                            Browser Anda tidak mendukung pemutaran video.
                        </video>

                        {/* Cinematic Vignette Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-950/70 via-transparent to-transparent pointer-events-none" />

                        {/* Center Buffering Spinner */}
                        {isVideoBuffering && !hasVideoError && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                                <div className="p-3.5 rounded-full bg-brand-950/75 backdrop-blur-md border border-white/20 text-accent-copper shadow-xl animate-spin">
                                    <Loader2 className="w-6 h-6" />
                                </div>
                            </div>
                        )}

                        {/* Center Play Button Overlay when paused */}
                        {!isVideoPlaying && !isVideoBuffering && !hasVideoError && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-brand-950/80 hover:bg-brand-900 text-white backdrop-blur-md border border-accent-copper/60 flex items-center justify-center shadow-2xl transition-transform transform group-hover:scale-110">
                                    <Play className="w-7 h-7 sm:w-8 sm:h-8 ml-1 text-accent-copper" />
                                </div>
                            </div>
                        )}

                        {/* Video Control Buttons (Bottom-Right) */}
                        <div className="absolute inset-x-0 bottom-0 flex items-center justify-end p-4 sm:p-6 pointer-events-none z-20">
                            <div className="flex items-center gap-2 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                                <button
                                    type="button"
                                    onClick={toggleVideoPlay}
                                    aria-label={isVideoPlaying ? 'Jeda video' : 'Putar video'}
                                    className="w-10 h-10 rounded-full bg-brand-950/80 hover:bg-brand-900 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-transform active:scale-90 cursor-pointer shadow-md"
                                >
                                    {isVideoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                                </button>
                                <button
                                    type="button"
                                    onClick={toggleVideoMute}
                                    aria-label={isVideoMuted ? 'Bunyikan suara' : 'Bisukan suara'}
                                    className="w-10 h-10 rounded-full bg-brand-950/80 hover:bg-brand-900 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-transform active:scale-90 cursor-pointer shadow-md"
                                >
                                    {isVideoMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </PublicLayout>
    );
}
