import React, { useRef, useState } from 'react';
import { Link } from '@inertiajs/react';
import {
    ChevronLeft,
    ChevronRight,
    ExternalLink,
} from 'lucide-react';

export function InstagramIcon({ className = 'w-4 h-4' }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
    );
}

export interface ReelProduct {
    id: number | string;
    name: string;
    price: string;
    image: string;
    url?: string;
}

export interface VideoReel {
    id: string | number;
    headline: string;
    caption: string;
    badge?: string | null;
    productCount?: number;
    thumbnail: string;
    videoUrl?: string;
    video_url?: string;
    products?: ReelProduct[];
}

export function resolveReelThumbnail(thumbnail?: string | null): string {
    if (!thumbnail) {
        return 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=800&q=80';
    }
    const trimmed = thumbnail.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:')) {
        return trimmed;
    }
    const clean = trimmed.replace(/^\/?(?:(?:storage|public)\/)+/, '').replace(/^\/+/, '');
    return clean ? `/storage/${clean}` : 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=800&q=80';
}

export const DEFAULT_REELS: VideoReel[] = [
    {
        id: 'reel-1',
        badge: 'BARISTA APPROVED! ☕🔥',
        headline: 'Kalo Mesin Espresso Diperkecil, Maka Jadi Segini..',
        caption: 'Kalau mesin espresso bisa diperkecil, maka akan jadi portabel dan praktis dibawa seduh di mana saja...',
        productCount: 2,
        thumbnail: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.instagram.com/sanubari.roastery.mlg/',
        products: [
            {
                id: 1,
                name: 'Portable Mini Espresso Maker',
                price: 'Rp 680.000',
                image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80',
                url: '/shop?category=espresso-beans',
            },
            {
                id: 2,
                name: 'Sanubari Signature Houseblend Espresso 200gr',
                price: 'Rp 85.000',
                image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=400&q=80',
                url: '/shop?category=espresso-beans',
            },
        ],
    },
    {
        id: 'reel-2',
        headline: 'Sekarang jadi ngerti alasan kenapa orang yang kesurupan selalu minta kopi',
        caption: 'Sekarang mulai paham alasan kenapa yang kesurupan selalu minta kopi hitam pekat dengan aroma tajam...',
        productCount: 2,
        thumbnail: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.instagram.com/sanubari.roastery.mlg/',
        products: [
            {
                id: 3,
                name: 'Kopi Tubruk Lereng Kawi Tradisional 250gr',
                price: 'Rp 45.000',
                image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=400&q=80',
                url: '/shop?series=kawi',
            },
            {
                id: 4,
                name: 'Robusta Dampit Malang Dark Roast 200gr',
                price: 'Rp 48.000',
                image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=400&q=80',
                url: '/shop',
            },
        ],
    },
    {
        id: 'reel-3',
        headline: 'Review tombol yang ada di mesin kopi Kees Van Der!',
        caption: 'Review tombol-tombol yg ada di mesinnya orang have. Kees Van Der Weston Spirit & Mirage commercial grade...',
        productCount: 1,
        thumbnail: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.instagram.com/sanubari.roastery.mlg/',
        products: [
            {
                id: 5,
                name: 'Konsultasi Mesin Komersial & Showroom Alat Kopi',
                price: 'Hubungi Admin',
                image: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=400&q=80',
                url: '/kunjungi',
            },
        ],
    },
    {
        id: 'reel-4',
        headline: 'Campur 2 Single Origin Sendiri Buat Espresso, Rasanya Aneh Nggak?',
        caption: 'Campur 2 Single Origin Buat Espresso, Rasanya Enak dan unik banget pakai fitur C.Y.B.R Sanubari...',
        productCount: 2,
        thumbnail: 'https://images.unsplash.com/photo-1589396575653-c09c794ff6a6?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.instagram.com/sanubari.roastery.mlg/',
        products: [
            {
                id: 6,
                name: 'C.Y.B.R: Custom Coffee Blend Studio',
                price: 'Mulai Rp 65.000',
                image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=400&q=80',
                url: '/cybr',
            },
            {
                id: 7,
                name: 'Arabika Gunung Kawi Honey Anaerobic 200gr',
                price: 'Rp 95.000',
                image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80',
                url: '/shop?series=kawi',
            },
        ],
    },
    {
        id: 'reel-5',
        badge: 'HOME ESPRESSO JOURNEY',
        headline: 'Home Espresso Naik Level Kalo Pakai Mesin Ini',
        caption: 'Home espresso naik level pakai ini. Grinder presisi + kalibrasi extraction konsisten setiap pagi...',
        productCount: 2,
        thumbnail: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.instagram.com/sanubari.roastery.mlg/',
        products: [
            {
                id: 8,
                name: 'Precision Single Dose Coffee Grinder 64mm',
                price: 'Rp 2.850.000',
                image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80',
                url: '/kunjungi',
            },
            {
                id: 9,
                name: 'Sanubari Espresso Roast Master Batch 500gr',
                price: 'Rp 145.000',
                image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=400&q=80',
                url: '/shop?category=espresso-beans',
            },
        ],
    },
    {
        id: 'reel-6',
        headline: 'Robusta Buat Espresso Cobain yang Ini, crema tebal!',
        caption: 'Kalau lo suka espresso bold & crema tebal, wajib banget cobain Robusta Fine Dampit Malang ini...',
        productCount: 2,
        thumbnail: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.instagram.com/sanubari.roastery.mlg/',
        products: [
            {
                id: 10,
                name: 'Fine Robusta Kawi Natural 200gr',
                price: 'Rp 55.000',
                image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=400&q=80',
                url: '/shop?series=kawi',
            },
            {
                id: 11,
                name: 'Crema Master Blend 70:30 Espresso 200gr',
                price: 'Rp 65.000',
                image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=400&q=80',
                url: '/shop?category=espresso-beans',
            },
        ],
    },
];

interface VideoReelsSliderProps {
    title?: string;
    subtitle?: string;
    viewAllHref?: string;
    viewAllText?: string;
    reels?: VideoReel[];
    className?: string;
}

export const VideoReelsSlider: React.FC<VideoReelsSliderProps> = ({
    title = 'Sanubari Reels Videos',
    subtitle = 'Tonton tutorial seduh, bedah mesin & tips kopi langsung di Instagram Reels',
    viewAllHref = '/video',
    viewAllText = 'Lihat Semua',
    reels = DEFAULT_REELS,
    className = '',
}) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const updateScrollButtons = () => {
        if (!scrollContainerRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        setCanScrollLeft(scrollLeft > 10);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    };

    const handleScroll = (direction: 'left' | 'right') => {
        if (!scrollContainerRef.current) return;
        const offset = direction === 'left' ? -320 : 320;
        scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    };

    return (
        <section
            data-ui="video-reels-slider"
            className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 ${className}`}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white shadow-sm shrink-0">
                        <InstagramIcon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl sm:text-2xl font-extrabold text-brand-950 tracking-tight">
                            {title}
                        </h2>
                        {subtitle && (
                            <p className="text-xs text-brand-700 block mt-0.5">
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>
                <Link
                    href={viewAllHref}
                    className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-brand-700 hover:text-accent-copper transition-colors"
                >
                    <span>{viewAllText}</span>
                    <ChevronRight className="w-4 h-4" />
                </Link>
            </div>

            {/* Horizontal Reels Track with floating navigation buttons */}
            <div className="relative group">
                {/* Floating Left Button */}
                {canScrollLeft && (
                    <button
                        type="button"
                        onClick={() => handleScroll('left')}
                        aria-label="Geser ke kiri"
                        className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 text-brand-950 shadow-lg border border-sand-200 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                )}

                {/* Floating Right Button */}
                {canScrollRight && (
                    <button
                        type="button"
                        onClick={() => handleScroll('right')}
                        aria-label="Geser ke kanan"
                        className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 text-brand-950 shadow-lg border border-sand-200 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                )}

                {/* Scrollable Track */}
                <div
                    ref={scrollContainerRef}
                    onScroll={updateScrollButtons}
                    className="flex gap-3.5 sm:gap-4 overflow-x-auto pb-4 pt-1 scroll-smooth snap-x snap-mandatory no-scrollbar"
                >
                    {reels.map((reel) => {
                        const targetUrl = reel.videoUrl || reel.video_url || 'https://www.instagram.com/sanubari.roastery.mlg/';

                        return (
                            <a
                                key={reel.id}
                                href={targetUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Buka di Instagram: ${reel.headline}`}
                                className="flex-shrink-0 w-[180px] sm:w-[210px] md:w-[220px] aspect-[9/16] rounded-2xl sm:rounded-3xl overflow-hidden relative select-none snap-start bg-brand-950 group/card shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 block focus:outline-none focus:ring-2 focus:ring-accent-copper cursor-pointer"
                            >
                                {/* Background Image / Thumbnail */}
                                <img
                                    src={resolveReelThumbnail(reel.thumbnail)}
                                    alt={reel.headline}
                                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-105"
                                    loading="lazy"
                                />

                                {/* Subtle Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50 pointer-events-none" />

                                {/* Top Left: Instagram Icon in Gradient Circle */}
                                <div className="absolute top-3 left-3 z-10 w-8 h-8 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white shadow-md group-hover/card:scale-110 transition-transform">
                                    <InstagramIcon className="w-4 h-4 text-white" />
                                </div>

                                {/* Top Right: Reels badge with external link icon */}
                                <div className="absolute top-3 right-3 z-10 px-2 py-0.5 rounded-full bg-black/55 backdrop-blur-xs border border-white/20 flex items-center gap-1 text-[10px] font-medium text-white shadow-xs group-hover/card:bg-black/80 transition-colors">
                                    <span>Reels</span>
                                    <ExternalLink className="w-2.5 h-2.5 text-sand-300" />
                                </div>

                                {/* Bottom Content: Open in Instagram Button */}
                                <div className="absolute inset-x-0 bottom-0 p-3 z-10">
                                    <div className="inline-flex items-center gap-1 text-[10px] font-bold text-accent-copper-light drop-shadow-md group-hover/card:text-white transition-colors">
                                        <span>Buka di Instagram</span>
                                        <ExternalLink className="w-2.5 h-2.5" />
                                    </div>
                                </div>
                            </a>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
