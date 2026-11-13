import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

export interface PartnerSlide {
    id: string;
    title: string;
    city: string;
    image: string;
    href?: string;
    url?: string;
    open_in_new_tab?: boolean;
}

export const DEFAULT_PARTNER_SLIDES: PartnerSlide[] = [
    {
        id: 'gartenhaus',
        title: 'Gartenhaus Malang',
        city: 'MALANG',
        image: 'https://images.unsplash.com/photo-1497636577773-f1231844b336?auto=format&fit=crop&w=800&q=80',
        href: 'https://www.instagram.com/gartenhaus_co/',
        open_in_new_tab: true,
    },
    {
        id: 'Alat Kopi Malang-roastery',
        title: 'Alat Kopi Malang Roasting Studio',
        city: 'MALANG',
        image: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=800&q=80',
        href: '/kunjungi',
        open_in_new_tab: false,
    },
    {
        id: 'bataputih',
        title: 'Bataputih Coffee',
        city: 'MALANG',
        image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
        href: 'https://www.instagram.com/bataputihkopi/',
        open_in_new_tab: true,
    },
    {
        id: 'lafayette',
        title: 'Lafayette Coffee & Eatery',
        city: 'MALANG',
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
        href: 'https://www.instagram.com/lafayettecoffee/',
        open_in_new_tab: true,
    },
    {
        id: 'coffee-heritage',
        title: 'Coffee Heritage',
        city: 'MALANG',
        image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=800&q=80',
        href: 'https://www.instagram.com/coffeeheritagemlg/',
        open_in_new_tab: true,
    },
    {
        id: 'fee-space',
        title: 'Oura Fee & Space',
        city: 'MALANG',
        image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
        href: 'https://www.instagram.com/ourafeesinema/',
        open_in_new_tab: true,
    },
    {
        id: 'dialoog',
        title: 'Dialoog Coffee',
        city: 'MALANG',
        image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
        href: 'https://www.instagram.com/dialoog.coffee/',
        open_in_new_tab: true,
    },
];

interface CoverflowSliderProps {
    slides?: PartnerSlide[];
    title?: string;
    subtitle?: string;
    className?: string;
}

export const CoverflowSlider: React.FC<CoverflowSliderProps> = ({
    slides = DEFAULT_PARTNER_SLIDES,
    title = 'Disajikan di Kedai Pilihan',
    subtitle = 'Temukan seduhan biji kopi sangrai Alat Kopi Malang di berbagai kedai kopi dan coffee space terkurasi di Malang',
    className = '',
}) => {
    // Start centered on Lafayette (index 3 of 7)
    const [currentIndex, setCurrentIndex] = useState(3);
    const [isHovered, setIsHovered] = useState(false);
    const touchStartX = useRef<number>(0);
    const touchEndX = useRef<number>(0);
    const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

    const total = slides.length;

    const nextSlide = useCallback(() => {
        if (total === 0) return;
        setCurrentIndex((prev) => (prev + 1) % total);
    }, [total]);

    const prevSlide = useCallback(() => {
        if (total === 0) return;
        setCurrentIndex((prev) => (prev - 1 + total) % total);
    }, [total]);

    // Autoplay interval with pause on hover
    useEffect(() => {
        if (isHovered || total <= 1) {
            if (autoPlayRef.current) clearInterval(autoPlayRef.current);
            return;
        }

        autoPlayRef.current = setInterval(() => {
            nextSlide();
        }, 4000);

        return () => {
            if (autoPlayRef.current) clearInterval(autoPlayRef.current);
        };
    }, [isHovered, nextSlide, total]);

    // Touch swipe support
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.targetTouches[0].clientX;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.targetTouches[0].clientX;
    };

    const handleTouchEnd = () => {
        const diff = touchStartX.current - touchEndX.current;
        if (Math.abs(diff) > 40) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    };

    // Calculate circular relative distance (-3, -2, -1, 0, 1, 2, 3)
    const getSlidePosition = (idx: number) => {
        let diff = (idx - currentIndex) % total;
        if (diff > total / 2) diff -= total;
        if (diff < -total / 2) diff += total;
        return diff;
    };

    if (total === 0) return null;

    return (
        <section
            data-ui="partner-coverflow-slider"
            className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 select-none overflow-hidden ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 sm:mb-8">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-brand-950">
                        {title}
                    </h2>
                    <p className="text-xs sm:text-sm text-brand-700 mt-0.5 max-w-2xl">
                        {subtitle}
                    </p>
                </div>

                {/* Mobile / Header arrows */}
                <div className="hidden sm:flex items-center gap-2 self-end sm:self-auto">
                    <button
                        type="button"
                        onClick={prevSlide}
                        aria-label="Geser ke kiri"
                        className="w-9 h-9 rounded-full bg-sand-200/70 hover:bg-sand-200 text-brand-900 flex items-center justify-center transition-transform active:scale-95 cursor-pointer shadow-xs"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        type="button"
                        onClick={nextSlide}
                        aria-label="Geser ke kanan"
                        className="w-9 h-9 rounded-full bg-sand-200/70 hover:bg-sand-200 text-brand-900 flex items-center justify-center transition-transform active:scale-95 cursor-pointer shadow-xs"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* 3D Coverflow Container */}
            <div
                className="relative w-full h-[340px] sm:h-[420px] md:h-[460px] flex items-center justify-center perspective-[1200px]"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {/* Floating Navigation Controls on Sides */}
                <button
                    type="button"
                    onClick={prevSlide}
                    aria-label="Sebelumnya"
                    className="absolute left-1 sm:left-4 z-40 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-brand-950/80 hover:bg-brand-900 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-xl"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                    type="button"
                    onClick={nextSlide}
                    aria-label="Selanjutnya"
                    className="absolute right-1 sm:right-4 z-40 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-brand-950/80 hover:bg-brand-900 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-xl"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>

                {/* Slides Track */}
                <div className="relative w-full h-full flex items-center justify-center">
                    {slides.map((slide, idx) => {
                        const pos = getSlidePosition(idx);
                        const isCenter = pos === 0;

                        // Responsive translation step percentages
                        // pos: 0 (center), ±1, ±2, ±3
                        let translateX = '0%';
                        let scale = 1;
                        let zIndex = 30;
                        let opacity = 1;
                        let brightness = 1;

                        if (pos === 0) {
                            translateX = '0%';
                            scale = 1.05;
                            zIndex = 30;
                            opacity = 1;
                            brightness = 1;
                        } else if (pos === 1) {
                            translateX = '62%';
                            scale = 0.88;
                            zIndex = 20;
                            opacity = 0.9;
                            brightness = 0.8;
                        } else if (pos === -1) {
                            translateX = '-62%';
                            scale = 0.88;
                            zIndex = 20;
                            opacity = 0.9;
                            brightness = 0.8;
                        } else if (pos === 2) {
                            translateX = '116%';
                            scale = 0.76;
                            zIndex = 10;
                            opacity = 0.65;
                            brightness = 0.65;
                        } else if (pos === -2) {
                            translateX = '-116%';
                            scale = 0.76;
                            zIndex = 10;
                            opacity = 0.65;
                            brightness = 0.65;
                        } else if (pos === 3) {
                            translateX = '165%';
                            scale = 0.65;
                            zIndex = 5;
                            opacity = 0.35;
                            brightness = 0.5;
                        } else if (pos === -3) {
                            translateX = '-165%';
                            scale = 0.65;
                            zIndex = 5;
                            opacity = 0.35;
                            brightness = 0.5;
                        } else {
                            translateX = pos > 0 ? '200%' : '-200%';
                            scale = 0.5;
                            zIndex = 0;
                            opacity = 0;
                            brightness = 0.3;
                        }

                        const slideUrl = slide.href || slide.url;

                        const handleCardClick = () => {
                            if (isCenter && slideUrl) {
                                if (slideUrl.startsWith('http')) {
                                    window.open(
                                        slideUrl,
                                        slide.open_in_new_tab !== false ? '_blank' : '_self',
                                        'noopener,noreferrer'
                                    );
                                } else {
                                    window.location.href = slideUrl;
                                }
                            } else {
                                setCurrentIndex(idx);
                            }
                        };

                        return (
                            <div
                                key={slide.id}
                                onClick={handleCardClick}
                                style={{
                                    transform: `translateX(${translateX}) scale(${scale})`,
                                    zIndex,
                                    opacity,
                                    transition: 'all 500ms cubic-bezier(0.25, 1, 0.5, 1)',
                                }}
                                className={`absolute w-[180px] sm:w-[220px] md:w-[260px] aspect-[9/14] rounded-[24px] sm:rounded-[30px] overflow-hidden cursor-pointer select-none ${
                                    isCenter
                                        ? 'ring-2 ring-accent-copper/90 shadow-[0_15px_40px_rgba(0,0,0,0.5),0_0_30px_rgba(184,121,74,0.35)]'
                                        : 'shadow-xl hover:opacity-100'
                                }`}
                            >
                                {/* Background Image */}
                                <img
                                    src={slide.image}
                                    alt={slide.title}
                                    className="w-full h-full object-cover transition-transform duration-700 ease-out"
                                    style={{
                                        filter: `brightness(${brightness})`,
                                    }}
                                    loading={Math.abs(pos) <= 1 ? 'eager' : 'lazy'}
                                />

                                {/* Subtle Dark Vignette & Bottom Gradient for Typography */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent pointer-events-none" />

                                {/* Center Card: External Link Badge if link exists */}
                                {isCenter && slideUrl && (
                                    <div className="absolute top-3.5 right-3.5 z-20 pointer-events-auto">
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 hover:bg-accent-copper backdrop-blur-md text-white text-[10px] font-bold shadow-md border border-white/20 transition-all hover:scale-105">
                                            <span>Kunjungi</span>
                                            <ExternalLink className="w-3 h-3" />
                                        </span>
                                    </div>
                                )}

                                {/* Card Text Content (Bottom) */}
                                <div className="absolute inset-x-0 bottom-0 p-3 sm:p-5 text-center flex flex-col items-center justify-end pointer-events-none">
                                    <h3 className="text-sm sm:text-base md:text-lg font-bold text-white tracking-tight drop-shadow-md leading-tight line-clamp-2">
                                        {slide.title}
                                    </h3>
                                    <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-accent-copper mt-1 drop-shadow-xs">
                                        {slide.city}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

