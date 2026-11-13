import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface HeroSlide {
    id: string;
    title?: string;
    image?: string;
    bgImage?: string;
    url?: string | null;
    ctaHref?: string;
    open_in_new_tab?: boolean;
    openInNewTab?: boolean;
    // Legacy properties for backward compatibility
    badge?: string;
    badgeIcon?: string;
    subtitle?: string;
    ctaText?: string;
    accentTag?: string;
    themeGradient?: string;
}

const DEFAULT_SLIDES: HeroSlide[] = [
    {
        id: 'kawi-terroir',
        title: 'Roastery Kopi Spesialti Asli Malang',
        image: 'banners/slide-1.jpg',
        bgImage: '/storage/banners/slide-1.jpg',
        url: '/shop',
        ctaHref: '/shop',
    },
    {
        id: 'byob-custom',
        title: 'C.Y.B.R: Custom Coffee Blend Studio',
        image: 'banners/slide-2.jpg',
        bgImage: '/storage/banners/slide-2.jpg',
        url: '/cybr',
        ctaHref: '/cybr',
    },
    {
        id: 'wholesale-b2b',
        title: 'Pasokan Biji Grosir & Alat Kopi Malang',
        image: 'banners/slide-3.jpg',
        bgImage: '/storage/banners/slide-3.jpg',
        url: '/wholesale',
        ctaHref: '/wholesale',
    },
    {
        id: 'co-ferment',
        title: 'CO-Ferment & Fruit Infused',
        image: 'banners/slide-4.jpg',
        bgImage: '/storage/banners/slide-4.jpg',
        url: '/shop?series=co-ferment',
        ctaHref: '/shop?series=co-ferment',
    },
];

interface HeroSliderProps {
    slides?: HeroSlide[];
    showText?: boolean;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({
    slides = DEFAULT_SLIDES,
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
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

    // Autoplay with pause on hover
    useEffect(() => {
        if (isHovered || total <= 1) {
            if (autoPlayRef.current) clearInterval(autoPlayRef.current);
            return;
        }

        autoPlayRef.current = setInterval(() => {
            nextSlide();
        }, 5000);

        return () => {
            if (autoPlayRef.current) clearInterval(autoPlayRef.current);
        };
    }, [isHovered, nextSlide, total]);

    // Touch swipe handlers
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.targetTouches[0].clientX;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.targetTouches[0].clientX;
    };

    const handleTouchEnd = () => {
        const diff = touchStartX.current - touchEndX.current;
        if (Math.abs(diff) > 35) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    };

    // Calculate circular relative offset (-1, 0, 1, etc.)
    const getSlidePosition = (idx: number) => {
        let diff = (idx - currentIndex) % total;
        if (diff > total / 2) diff -= total;
        if (diff < -total / 2) diff += total;
        return diff;
    };

    const resolveImage = (slide: HeroSlide) => {
        let src = slide.bgImage || slide.image || '';
        if (!src) return '';
        if (src.startsWith('http://') && (src.includes('sanubari.test') || src.includes('localhost'))) {
            src = src.replace(/^http:\/\/[^/]+/, '');
        } else if (src.startsWith('http://')) {
            src = src.replace(/^http:\/\//, 'https://');
        } else if (!src.startsWith('/') && !src.startsWith('https://')) {
            src = `/storage/${src.replace(/^storage\//, '')}`;
        }
        return src;
    };

    if (total === 0) return null;

    return (
        <section
            data-ui="hero-slider"
            className="relative w-full overflow-hidden select-none py-3 sm:py-5 lg:py-6"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* 3D-Deck Carousel Container (Full 1800:680 Aspect Ratio on Mobile, Tablet & Desktop so no image is cropped) */}
                <div
                    className="relative w-full aspect-[1800/680]"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    {/* Slides Deck */}
                    {slides.map((slide, idx) => {
                        const pos = getSlidePosition(idx);

                        // Visible range: active (0), immediate right (1), immediate left (-1)
                        let style: React.CSSProperties = {
                            zIndex: 0,
                            opacity: 0,
                            transform: 'scale(0.8)',
                            pointerEvents: 'none',
                            transition: 'all 450ms cubic-bezier(0.25, 1, 0.5, 1)',
                        };

                        if (pos === 0) {
                            // Active Center Slide
                            style = {
                                zIndex: 10,
                                opacity: 1,
                                transform: 'none',
                                pointerEvents: 'auto',
                                transition: 'all 450ms cubic-bezier(0.25, 1, 0.5, 1)',
                            };
                        } else if (pos === 1) {
                            // Right Peeking Slide (Artatix formula: translateX(8.5%) scale(0.92))
                            style = {
                                zIndex: 9,
                                opacity: 0.8,
                                transform: 'translateX(8.5%) translateY(2px) scale(0.92)',
                                pointerEvents: 'auto',
                                cursor: 'pointer',
                                transition: 'all 450ms cubic-bezier(0.25, 1, 0.5, 1)',
                            };
                        } else if (pos === -1) {
                            // Left Peeking Slide (Artatix formula: translateX(-8.5%) scale(0.92))
                            style = {
                                zIndex: 9,
                                opacity: 0.8,
                                transform: 'translateX(-8.5%) translateY(2px) scale(0.92)',
                                pointerEvents: 'auto',
                                cursor: 'pointer',
                                transition: 'all 450ms cubic-bezier(0.25, 1, 0.5, 1)',
                            };
                        }

                        const imgSrc = resolveImage(slide);
                        const targetUrl = slide.url ?? slide.ctaHref;
                        const hasLink = Boolean(targetUrl && targetUrl !== '#' && targetUrl !== '');
                        const isExternal = Boolean(
                            slide.open_in_new_tab ||
                            slide.openInNewTab ||
                            (targetUrl && (targetUrl.startsWith('http://') || targetUrl.startsWith('https://')))
                        );

                        const slideImage = (
                            <img
                                src={imgSrc}
                                alt={slide.title || `Slide ${idx + 1}`}
                                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                loading={idx === 0 ? 'eager' : 'lazy'}
                                fetchPriority={idx === 0 ? 'high' : 'low'}
                            />
                        );

                        return (
                            <div
                                key={slide.id || `slide-${idx}`}
                                className="absolute inset-0 flex items-center justify-center"
                                style={style}
                                onClick={() => {
                                    if (pos === 1) nextSlide();
                                    if (pos === -1) prevSlide();
                                }}
                            >
                                <div className="group relative h-full w-full overflow-hidden rounded-xl sm:rounded-2xl lg:rounded-3xl bg-brand-950 shadow-md">
                                    {pos === 0 && hasLink && targetUrl ? (
                                        isExternal ? (
                                            <a
                                                href={targetUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block w-full h-full cursor-pointer"
                                                aria-label={slide.title || `Slide ${idx + 1}`}
                                            >
                                                {slideImage}
                                            </a>
                                        ) : (
                                            <Link
                                                href={targetUrl}
                                                className="block w-full h-full cursor-pointer"
                                                aria-label={slide.title || `Slide ${idx + 1}`}
                                            >
                                                {slideImage}
                                            </Link>
                                        )
                                    ) : (
                                        slideImage
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {/* Navigation Buttons (Artatix Formula: Left/Right Edges with White Pill Backdrop) */}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            prevSlide();
                        }}
                        aria-label="Previous slide"
                        className="absolute left-1 sm:left-3 top-1/2 z-20 flex w-7 h-7 sm:w-10 sm:h-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-brand-950 shadow-md backdrop-blur-xs transition hover:bg-white hover:scale-105 active:scale-95 cursor-pointer"
                    >
                        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-brand-900" />
                    </button>

                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            nextSlide();
                        }}
                        aria-label="Next slide"
                        className="absolute right-1 sm:right-3 top-1/2 z-20 flex w-7 h-7 sm:w-10 sm:h-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-brand-950 shadow-md backdrop-blur-xs transition hover:bg-white hover:scale-105 active:scale-95 cursor-pointer"
                    >
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-brand-900" />
                    </button>
                </div>

                {/* Bottom Pagination Indicators (Artatix 1:1 Pill + Dots) */}
                <div className="flex items-center justify-center gap-2 mt-3 sm:mt-4">
                    {slides.map((slide, idx) => {
                        const isActive = idx === currentIndex;
                        return (
                            <button
                                key={slide.id || `dot-${idx}`}
                                type="button"
                                onClick={() => setCurrentIndex(idx)}
                                aria-label={`Pindah ke slide ${idx + 1}`}
                                className={`rounded-full transition-all duration-300 cursor-pointer ${
                                    isActive
                                        ? 'w-7 sm:w-9 h-2 sm:h-2.5 bg-brand-800'
                                        : 'w-2 sm:w-2.5 h-2 sm:h-2.5 bg-sand-300 hover:bg-sand-400'
                                }`}
                            />
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
