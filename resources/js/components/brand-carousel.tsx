import React, { useRef, useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BrandAvatar, BrandData } from '@/components/brand-avatar';

interface BrandCarouselProps {
    brands?: BrandData[];
    title?: string;
    viewAllHref?: string;
    viewAllLabel?: string;
}

export function BrandCarousel({
    brands = [],
    title = 'Brand Pilihan',
    viewAllHref = '/brands',
    viewAllLabel = 'Semua Brand',
}: BrandCarouselProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScroll = () => {
        const el = scrollContainerRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 10);
        setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
    };

    useEffect(() => {
        checkScroll();
        const el = scrollContainerRef.current;
        if (el) {
            el.addEventListener('scroll', checkScroll, { passive: true });
            window.addEventListener('resize', checkScroll);
        }
        return () => {
            if (el) {
                el.removeEventListener('scroll', checkScroll);
            }
            window.removeEventListener('resize', checkScroll);
        };
    }, [brands]);

    const scroll = (direction: 'left' | 'right') => {
        const el = scrollContainerRef.current;
        if (!el) return;
        const scrollAmount = Math.max(260, el.clientWidth * 0.65);
        el.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth',
        });
    };

    if (!brands || brands.length === 0) {
        return null;
    }

    return (
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            {/* Header: Title and View All */}
            <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    {title}
                </h2>
                <Link
                    href={viewAllHref}
                    className="group inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                    <span>{viewAllLabel}</span>
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
            </div>

            {/* Slider with Navigation Controls */}
            <div className="relative group/slider">
                {/* Left Arrow Button */}
                {canScrollLeft && (
                    <button
                        type="button"
                        onClick={() => scroll('left')}
                        className="absolute -left-3 sm:-left-4 top-8 sm:top-9 -translate-y-1/2 z-10 w-9 h-9 sm:w-10 sm:h-10 bg-white border border-slate-200/90 rounded-full flex items-center justify-center text-slate-700 shadow-md hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                )}

                {/* Right Arrow Button */}
                {canScrollRight && (
                    <button
                        type="button"
                        onClick={() => scroll('right')}
                        className="absolute -right-3 sm:-right-4 top-8 sm:top-9 -translate-y-1/2 z-10 w-9 h-9 sm:w-10 sm:h-10 bg-white border border-slate-200/90 rounded-full flex items-center justify-center text-slate-700 shadow-md hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer"
                        aria-label="Scroll right"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                )}

                {/* Scrollable Container */}
                <div
                    ref={scrollContainerRef}
                    className="flex items-start gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth py-2 px-1 select-none"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {brands.map((brand) => (
                        <Link
                            key={brand.id || brand.slug}
                            href={`/shop?brand=${encodeURIComponent(brand.slug)}`}
                            className="group flex flex-col items-center shrink-0 w-20 sm:w-24 text-center cursor-pointer transition-transform duration-150 active:scale-95"
                            title={brand.name}
                        >
                            <div className="transition-transform duration-200 group-hover:scale-105">
                                <BrandAvatar
                                    brand={brand}
                                    size="md"
                                    showVerified={true}
                                />
                            </div>
                            <span className="mt-2 text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors truncate w-full px-0.5">
                                {brand.name}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
