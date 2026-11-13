import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    Compass,
    Expand,
    Layers,
    Maximize2,
    X,
} from 'lucide-react';

export interface GalleryMomentItem {
    id: string;
    title: string;
    location: string;
    category: string;
    image: string;
    aspectHint?: 'landscape' | 'portrait' | 'square';
}

export type GalleryColumnType =
    | { type: 'single'; item: GalleryMomentItem; widthClass: string }
    | { type: 'stacked'; topItem: GalleryMomentItem; bottomItem: GalleryMomentItem; widthClass: string };

export const MOMENT_COLUMNS: GalleryColumnType[] = [
    // Kolom 1: 1 Card besar lanskap (4:3 / square besar) - Pegunungan bersalju dan padang rumput emas
    {
        type: 'single',
        widthClass: 'w-[360px] sm:w-[460px]',
        item: {
            id: 'moment-1',
            title: 'Mount Rainier & Golden Meadow',
            location: 'Alpine Ridge, Washington',
            category: 'Alpine Wilds',
            image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=85',
            aspectHint: 'landscape',
        },
    },
    // Kolom 2: 2 Card bertumpuk vertikal (atas: sunset pantai berpasir; bawah: jalan setapak hutan berkabut)
    {
        type: 'stacked',
        widthClass: 'w-[280px] sm:w-[320px]',
        topItem: {
            id: 'moment-2',
            title: 'Golden Hour Coastline',
            location: 'Tropical Shoreline, Hawaii',
            category: 'Ocean Shore',
            image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85',
            aspectHint: 'landscape',
        },
        bottomItem: {
            id: 'moment-3',
            title: 'Misty Pine Woodlands',
            location: 'Black Forest Trail, Germany',
            category: 'Ancient Woods',
            image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=85',
            aspectHint: 'landscape',
        },
    },
    // Kolom 3: 1 Card vertikal tinggi/portrait (rasio 9:16) - Bukit gurun pasir
    {
        type: 'single',
        widthClass: 'w-[260px] sm:w-[300px]',
        item: {
            id: 'moment-4',
            title: 'Sahara Winds & Golden Dunes',
            location: 'Erg Chebbi, Morocco',
            category: 'Desert Solitude',
            image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=85',
            aspectHint: 'portrait',
        },
    },
    // Kolom 4: 2 Card bertumpuk vertikal (atas: lampu malam skyline; bawah: danau berkabut gelap)
    {
        type: 'stacked',
        widthClass: 'w-[280px] sm:w-[320px]',
        topItem: {
            id: 'moment-5',
            title: 'Neon Metropolis Skyline',
            location: 'Tokyo Central, Japan',
            category: 'Urban Lights',
            image: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=85',
            aspectHint: 'landscape',
        },
        bottomItem: {
            id: 'moment-6',
            title: 'Mirror Mist Lake',
            location: 'Yosemite Valley, California',
            category: 'Still Waters',
            image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85',
            aspectHint: 'landscape',
        },
    },
    // Kolom 5: 1 Card besar lanskap aurora malam
    {
        type: 'single',
        widthClass: 'w-[360px] sm:w-[440px]',
        item: {
            id: 'moment-7',
            title: 'Celestial Aurora Borealis',
            location: 'Tromsø Fjord, Norway',
            category: 'Night Skies',
            image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=1600&q=85',
            aspectHint: 'landscape',
        },
    },
    // Kolom 6: 2 Card bertumpuk vertikal (kebun lereng hijau & air terjun ngarai)
    {
        type: 'stacked',
        widthClass: 'w-[280px] sm:w-[320px]',
        topItem: {
            id: 'moment-8',
            title: 'Verdant Highland Slopes',
            location: 'Mount Kawi Foothills, East Java',
            category: 'Terroir Kawi',
            image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=1200&q=85',
            aspectHint: 'landscape',
        },
        bottomItem: {
            id: 'moment-9',
            title: 'Emerald Cascades & Canyon',
            location: 'Tumpak Sewu Ravine, Indonesia',
            category: 'Cascading Waters',
            image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=85',
            aspectHint: 'landscape',
        },
    },
    // Kolom 7: 1 Card vertikal portrait - Crimson Red Rock Canyon
    {
        type: 'single',
        widthClass: 'w-[260px] sm:w-[300px]',
        item: {
            id: 'moment-10',
            title: 'Crimson Red Rock Canyon',
            location: 'Sedona Valley, Arizona',
            category: 'Canyon Formations',
            image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=85',
            aspectHint: 'portrait',
        },
    },
];

// Flatten all items for seamless lightbox index browsing
export const ALL_GALLERY_ITEMS: GalleryMomentItem[] = MOMENT_COLUMNS.flatMap((col) =>
    col.type === 'single' ? [col.item] : [col.topItem, col.bottomItem],
);

interface BentoCardProps {
    item: GalleryMomentItem;
    className?: string;
    onSelect: (item: GalleryMomentItem) => void;
}

function BentoCard({ item, className = '', onSelect }: BentoCardProps) {
    return (
        <div
            onClick={() => onSelect(item)}
            className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/60 shadow-lg cursor-pointer transition-all duration-500 hover:border-white/30 hover:shadow-[0_12px_40px_rgba(0,0,0,0.8)] select-none ${className}`}
        >
            {/* Background Image with Zoom on Hover */}
            <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                draggable={false}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 pointer-events-none"
            />

            {/* Gradient Overlays for Readability & Cinematic Look */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors pointer-events-none" />

            {/* Top Category Badge & Expand Icon */}
            <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/55 backdrop-blur-md border border-white/15 text-[11px] font-semibold uppercase tracking-wider text-zinc-200 shadow-sm">
                    <Compass className="w-3 h-3 text-amber-400" />
                    {item.category}
                </span>

                <div className="w-8 h-8 rounded-full bg-black/55 backdrop-blur-md border border-white/15 flex items-center justify-center text-white/80 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 shadow-md">
                    <Maximize2 className="w-3.5 h-3.5" />
                </div>
            </div>

            {/* Bottom Captions */}
            <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 pointer-events-none transition-transform duration-300 group-hover:-translate-y-0.5">
                <h4 className="text-sm sm:text-base font-bold text-white leading-snug drop-shadow-sm group-hover:text-amber-200 transition-colors">
                    {item.title}
                </h4>
                <p className="text-xs text-zinc-300/90 font-medium mt-1 flex items-center gap-1.5 drop-shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400/80 inline-block" />
                    {item.location}
                </p>
            </div>
        </div>
    );
}

export function CuratedMomentsGallery() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [selectedItem, setSelectedItem] = useState<GalleryMomentItem | null>(null);

    // Drag-to-scroll state
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollStartLeft, setScrollStartLeft] = useState(0);
    const [hasDragged, setHasDragged] = useState(false);

    // Scroll buttons state
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const updateScrollButtons = useCallback(() => {
        const el = scrollContainerRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 20);
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 20);
    }, []);

    useEffect(() => {
        const el = scrollContainerRef.current;
        if (!el) return;
        updateScrollButtons();
        el.addEventListener('scroll', updateScrollButtons, { passive: true });
        window.addEventListener('resize', updateScrollButtons);
        return () => {
            el.removeEventListener('scroll', updateScrollButtons);
            window.removeEventListener('resize', updateScrollButtons);
        };
    }, [updateScrollButtons]);

    // Handle Smooth Scroll Navigation
    const handleScroll = (direction: 'left' | 'right') => {
        const el = scrollContainerRef.current;
        if (!el) return;
        const scrollDistance = el.clientWidth * 0.75;
        el.scrollBy({
            left: direction === 'left' ? -scrollDistance : scrollDistance,
            behavior: 'smooth',
        });
    };

    // Drag-to-scroll handlers
    const onMouseDown = (e: React.MouseEvent) => {
        const el = scrollContainerRef.current;
        if (!el) return;
        setIsMouseDown(true);
        setHasDragged(false);
        setStartX(e.pageX - el.offsetLeft);
        setScrollStartLeft(el.scrollLeft);
    };

    const onMouseMove = (e: React.MouseEvent) => {
        if (!isMouseDown) return;
        const el = scrollContainerRef.current;
        if (!el) return;
        e.preventDefault();
        const x = e.pageX - el.offsetLeft;
        const walk = (x - startX) * 1.35;
        if (Math.abs(walk) > 6) {
            setHasDragged(true);
        }
        el.scrollLeft = scrollStartLeft - walk;
    };

    const onMouseUp = () => {
        setIsMouseDown(false);
    };

    const handleCardSelect = (item: GalleryMomentItem) => {
        // Prevent opening modal if user was dragging
        if (hasDragged) return;
        setSelectedItem(item);
    };

    // Lightbox keyboard navigation
    const currentIndex = selectedItem
        ? ALL_GALLERY_ITEMS.findIndex((it) => it.id === selectedItem.id)
        : -1;

    const showPrev = useCallback(() => {
        if (currentIndex > 0) {
            setSelectedItem(ALL_GALLERY_ITEMS[currentIndex - 1]);
        } else {
            setSelectedItem(ALL_GALLERY_ITEMS[ALL_GALLERY_ITEMS.length - 1]);
        }
    }, [currentIndex]);

    const showNext = useCallback(() => {
        if (currentIndex < ALL_GALLERY_ITEMS.length - 1) {
            setSelectedItem(ALL_GALLERY_ITEMS[currentIndex + 1]);
        } else {
            setSelectedItem(ALL_GALLERY_ITEMS[0]);
        }
    }, [currentIndex]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!selectedItem) return;
            if (e.key === 'Escape') setSelectedItem(null);
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'ArrowRight') showNext();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedItem, showPrev, showNext]);

    // Lock body scroll when modal is active
    useEffect(() => {
        if (selectedItem) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [selectedItem]);

    return (
        <section className="w-full max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 my-8 sm:my-14">
            {/* Outer Bento Container with Dark Ultra-Sleek Theme */}
            <div className="relative rounded-3xl sm:rounded-[36px] bg-[#0a0a0c] border border-white/10 p-5 sm:p-8 lg:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden">
                {/* Subtle Ambient Radial Glows */}
                <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

                {/* Header Section */}
                <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 sm:mb-8">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold uppercase tracking-widest text-amber-300 mb-2.5">
                            <Layers className="w-3.5 h-3.5 text-amber-400" />
                            <span>Visual Expedition</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight drop-shadow-[0_0_24px_rgba(255,255,255,0.22)]">
                            Curated Moments
                        </h2>
                        <p className="text-xs sm:text-sm text-zinc-400 mt-1.5 max-w-xl font-normal leading-relaxed">
                            A collection of stunning landscapes. Drag to explore, click to expand.
                        </p>
                    </div>

                    {/* Navigation Buttons (Desktop Floating Controls) */}
                    <div className="flex items-center gap-2.5 self-start md:self-end">
                        <span className="text-[11px] text-zinc-500 font-medium hidden sm:inline mr-2">
                            Drag or swipe horizontally
                        </span>
                        <button
                            type="button"
                            onClick={() => handleScroll('left')}
                            disabled={!canScrollLeft}
                            aria-label="Previous Moments"
                            className="w-10 h-10 rounded-2xl bg-white/5 hover:bg-white/15 disabled:opacity-30 disabled:cursor-not-allowed border border-white/10 text-white flex items-center justify-center backdrop-blur-md transition-all active:scale-95 shadow-md"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            type="button"
                            onClick={() => handleScroll('right')}
                            disabled={!canScrollRight}
                            aria-label="Next Moments"
                            className="w-10 h-10 rounded-2xl bg-white/5 hover:bg-white/15 disabled:opacity-30 disabled:cursor-not-allowed border border-white/10 text-white flex items-center justify-center backdrop-blur-md transition-all active:scale-95 shadow-md"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Horizontal Bento Masonry Track (Drag-to-Scroll) */}
                <div
                    ref={scrollContainerRef}
                    onMouseDown={onMouseDown}
                    onMouseMove={onMouseMove}
                    onMouseUp={onMouseUp}
                    onMouseLeave={onMouseUp}
                    className={`relative z-10 flex items-stretch gap-4 sm:gap-5 overflow-x-auto no-scrollbar scroll-smooth py-1 select-none ${
                        isMouseDown ? 'cursor-grabbing' : 'cursor-grab'
                    }`}
                    style={{ WebkitOverflowScrolling: 'touch' }}
                >
                    {MOMENT_COLUMNS.map((column, idx) => {
                        if (column.type === 'single') {
                            return (
                                <div
                                    key={column.item.id}
                                    className={`shrink-0 ${column.widthClass} h-[460px] sm:h-[480px]`}
                                >
                                    <BentoCard
                                        item={column.item}
                                        onSelect={handleCardSelect}
                                        className="w-full h-full"
                                    />
                                </div>
                            );
                        }

                        // Stacked: 2 cards stacked vertically with proportional heights
                        return (
                            <div
                                key={`col-${idx}`}
                                className={`shrink-0 ${column.widthClass} h-[460px] sm:h-[480px] flex flex-col gap-4 sm:gap-5`}
                            >
                                <BentoCard
                                    item={column.topItem}
                                    onSelect={handleCardSelect}
                                    className="w-full flex-1"
                                />
                                <BentoCard
                                    item={column.bottomItem}
                                    onSelect={handleCardSelect}
                                    className="w-full flex-1"
                                />
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Fullscreen Lightbox Modal (Click to Expand) */}
            {selectedItem && (
                <div
                    role="dialog"
                    aria-modal="true"
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-6 md:p-10 animate-in fade-in duration-300"
                    onClick={() => setSelectedItem(null)}
                >
                    {/* Top Bar Controls */}
                    <div
                        className="absolute top-4 inset-x-4 sm:inset-x-8 flex items-center justify-between text-white z-50 pointer-events-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold uppercase tracking-wider text-amber-300 backdrop-blur-sm">
                                {selectedItem.category}
                            </span>
                            <span className="text-xs text-zinc-400 font-medium hidden sm:inline">
                                {currentIndex + 1} of {ALL_GALLERY_ITEMS.length}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setSelectedItem(null)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 text-xs font-semibold text-white backdrop-blur-sm transition-all"
                            >
                                <X className="w-4 h-4" />
                                <span>Tutup (ESC)</span>
                            </button>
                        </div>
                    </div>

                    {/* Left & Right In-Modal Navigation Arrows */}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            showPrev();
                        }}
                        aria-label="Previous photo"
                        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-50 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-transform hover:scale-110 active:scale-95 shadow-2xl"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>

                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            showNext();
                        }}
                        aria-label="Next photo"
                        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-50 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-transform hover:scale-110 active:scale-95 shadow-2xl"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    {/* Main Image Container */}
                    <div
                        className="relative max-w-5xl max-h-[82vh] w-full flex flex-col items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={selectedItem.image}
                            alt={selectedItem.title}
                            className="max-h-[72vh] max-w-full w-auto h-auto object-contain rounded-2xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.95)]"
                        />

                        {/* Caption under Lightbox */}
                        <div className="mt-4 text-center max-w-2xl px-4">
                            <h3 className="text-lg sm:text-2xl font-bold text-white tracking-tight">
                                {selectedItem.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-zinc-400 mt-1 flex items-center justify-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                                {selectedItem.location}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

export default CuratedMomentsGallery;
