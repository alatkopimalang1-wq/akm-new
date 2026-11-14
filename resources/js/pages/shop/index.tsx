import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Filter, Search, SlidersHorizontal, X, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { PublicLayout } from '@/layouts/public-layout';
import type { Category, Product } from '@/types/sanubari';
import { ProductCard } from '@/components/product-card';
import { CoffeeBeanIcon } from '@/components/coffee-bean-icon';
import { SectionHeading } from '@/components/ui/section-heading';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface ShopIndexProps {
    products: {
        data: Product[];
        current_page: number;
        last_page: number;
        total: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    categories: Category[];
    filters: {
        q?: string;
        category?: string;
        series?: string;
        sort?: string;
    };
}

export default function ShopIndex({ products, categories = [], filters }: ShopIndexProps) {
    const [searchTerm, setSearchTerm] = useState(filters.q || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || '');
    const [selectedSeries, setSelectedSeries] = useState(filters.series || '');
    const [selectedSort, setSelectedSort] = useState(filters.sort || 'featured');

    const [allProducts, setAllProducts] = useState<Product[]>(products.data);
    const [currentPage, setCurrentPage] = useState(products.current_page);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const loadMoreSentinelRef = useRef<HTMLDivElement>(null);
    const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);

    // Horizontal scroll navigation for category filter pills
    const pillsContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const checkPillsScroll = useCallback(() => {
        const el = pillsContainerRef.current;
        if (el) {
            setCanScrollLeft(el.scrollLeft > 6);
            setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 6);
        }
    }, []);

    useEffect(() => {
        checkPillsScroll();
        const el = pillsContainerRef.current;
        if (!el) return;
        const resizeObserver = new ResizeObserver(() => checkPillsScroll());
        resizeObserver.observe(el);
        window.addEventListener('resize', checkPillsScroll);
        return () => {
            resizeObserver.disconnect();
            window.removeEventListener('resize', checkPillsScroll);
        };
    }, [checkPillsScroll, categories]);

    const scrollPills = (direction: 'left' | 'right') => {
        if (pillsContainerRef.current) {
            const scrollAmount = direction === 'left' ? -240 : 240;
            pillsContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    // Sync state when props filters change from server/navigation
    useEffect(() => {
        setSearchTerm(filters.q || '');
        setSelectedCategory(filters.category || '');
        setSelectedSeries(filters.series || '');
        setSelectedSort(filters.sort || 'featured');
    }, [filters.q, filters.category, filters.series, filters.sort]);

    // Sync when filters change or products update from server
    useEffect(() => {
        if (products.current_page === 1) {
            setAllProducts(products.data);
            setCurrentPage(1);
        } else {
            setAllProducts((prev) => {
                const existing = new Set(prev.map((p) => p.id));
                const newItems = products.data.filter((p) => !existing.has(p.id));
                return [...prev, ...newItems];
            });
            setCurrentPage(products.current_page);
        }
    }, [products]);

    const hasMore = currentPage < products.last_page;

    const loadMoreProducts = useCallback(() => {
        if (isLoadingMore || !hasMore) return;
        setIsLoadingMore(true);
        const nextPage = currentPage + 1;

        router.get(
            '/shop',
            {
                q: searchTerm,
                category: selectedCategory,
                series: selectedSeries,
                sort: selectedSort,
                page: nextPage,
            },
            {
                preserveState: true,
                preserveScroll: true,
                only: ['products'],
                onFinish: () => setIsLoadingMore(false),
            }
        );
    }, [isLoadingMore, hasMore, currentPage, searchTerm, selectedCategory, selectedSeries, selectedSort]);

    // IntersectionObserver for automatic lazy loading when scrolling
    useEffect(() => {
        if (!hasMore || isLoadingMore) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadMoreProducts();
                }
            },
            { rootMargin: '300px' }
        );

        const currentRef = loadMoreSentinelRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) observer.unobserve(currentRef);
        };
    }, [hasMore, isLoadingMore, loadMoreProducts]);

    const handleSearchChange = (val: string) => {
        setSearchTerm(val);
        if (searchDebounceRef.current) {
            clearTimeout(searchDebounceRef.current);
        }
        searchDebounceRef.current = setTimeout(() => {
            applyFilters({ q: val });
        }, 350);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchDebounceRef.current) {
            clearTimeout(searchDebounceRef.current);
        }
        applyFilters({ q: searchTerm });
    };

    const applyFilters = (newFilters: Partial<typeof filters>) => {
        router.get(
            '/shop',
            {
                q: newFilters.q !== undefined ? newFilters.q : searchTerm,
                category: newFilters.category !== undefined ? newFilters.category : selectedCategory,
                series: newFilters.series !== undefined ? newFilters.series : selectedSeries,
                sort: newFilters.sort !== undefined ? newFilters.sort : selectedSort,
            },
            { preserveState: true, preserveScroll: true }
        );
    };

    return (
        <PublicLayout title="Katalog Produk Alat Kopi Malang">
            {/* Header Banner */}
            <div className="bg-brand-950 text-white py-10 px-4 sm:px-6 lg:px-8 border-b border-brand-900">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                        Katalog Produk Alat Kopi Malang
                    </h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-4 sm:space-y-6">
                {/* Filter Bar */}
                <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-sand-200/80 shadow-xs">
                    {/* Filter Pills from Admin Dashboard Categories with Navigation Arrows */}
                    <div className="relative">
                        {/* Left Scroll Arrow (Desktop only, hidden on mobile) */}
                        {canScrollLeft && (
                            <div className="hidden sm:flex absolute left-0 top-0 bottom-0 z-10 items-center pr-3 pl-0.5 bg-gradient-to-r from-white via-white/95 to-transparent pointer-events-none">
                                <button
                                    type="button"
                                    onClick={() => scrollPills('left')}
                                    aria-label="Geser kategori ke kiri"
                                    className="pointer-events-auto w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white hover:bg-sand-50 text-brand-800 shadow-md border border-sand-200/90 flex items-center justify-center transition-all cursor-pointer active:scale-95"
                                >
                                    <ChevronLeft className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                                </button>
                            </div>
                        )}

                        <div
                            ref={pillsContainerRef}
                            onScroll={checkPillsScroll}
                            className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden scroll-smooth"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            {/* All Products */}
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedCategory('');
                                    setSelectedSeries('');
                                    applyFilters({ category: '', series: '' });
                                }}
                                className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                                    !selectedCategory && !selectedSeries
                                        ? 'bg-brand-700 text-white shadow-xs'
                                        : 'bg-cream-100/80 hover:bg-cream-100 text-brand-700 border border-sand-200/80'
                                }`}
                            >
                                Semua Produk
                            </button>

                            {/* Dynamic Parent Categories from Admin Dashboard */}
                            {categories
                                .filter((cat) => !cat.parent_id)
                                .map((cat) => {
                                const catName = typeof cat.name === 'string'
                                    ? cat.name
                                    : (cat.name?.id || cat.name?.en || Object.values(cat.name || {})[0] || cat.slug);
                                const isActive = selectedCategory === cat.slug || (!selectedCategory && selectedSeries === cat.slug);

                                return (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => {
                                            setSelectedCategory(cat.slug);
                                            setSelectedSeries('');
                                            applyFilters({ category: cat.slug, series: '' });
                                        }}
                                        className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                                            isActive
                                                ? 'bg-brand-700 text-white shadow-xs'
                                                : 'bg-cream-100/80 hover:bg-cream-100 text-brand-700 border border-sand-200/80'
                                        }`}
                                    >
                                        {catName}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Right Scroll Arrow (Desktop only, hidden on mobile) */}
                        {canScrollRight && (
                            <div className="hidden sm:flex absolute right-0 top-0 bottom-0 z-10 items-center pl-3 pr-0.5 bg-gradient-to-l from-white via-white/95 to-transparent pointer-events-none">
                                <button
                                    type="button"
                                    onClick={() => scrollPills('right')}
                                    aria-label="Geser kategori ke kanan"
                                    className="pointer-events-auto w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white hover:bg-sand-50 text-brand-800 shadow-md border border-sand-200/90 flex items-center justify-center transition-all cursor-pointer active:scale-95"
                                >
                                    <ChevronRight className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Result Status */}
                <div className="flex items-center justify-between text-xs text-brand-500 px-1">
                    <span>
                        Menampilkan <strong className="text-brand-900">{products.data.length}</strong> dari{' '}
                        <strong className="text-brand-900">{products.total}</strong> produk
                    </span>
                    {(filters.q || filters.series || filters.category) && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedSeries('');
                                setSelectedCategory('');
                                router.get('/shop');
                            }}
                            className="text-accent-copper hover:underline font-semibold"
                        >
                            Reset Filter
                        </button>
                    )}
                </div>

                {/* Products Grid */}
                {allProducts.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center border border-sand-200 space-y-3">
                        <p className="text-base font-bold text-brand-900">
                            Tidak ada produk yang cocok dengan pencarian Anda
                        </p>
                        <p className="text-xs text-brand-500 max-w-sm mx-auto">
                            Coba ubah kata kunci pencarian atau reset filter untuk melihat seluruh koleksi produk Alat Kopi Malang.
                        </p>
                        <button
                            type="button"
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedSeries('');
                                setSelectedCategory('');
                                router.get('/shop');
                            }}
                            className="px-5 py-2.5 rounded-full bg-brand-700 text-white text-xs font-semibold cursor-pointer"
                        >
                            Tampilkan Semua Produk
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6">
                            {allProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}

                            {/* Lazy load skeleton placeholder cards */}
                            {isLoadingMore && (
                                <>
                                    {[1, 2, 3, 4].map((i) => (
                                        <div
                                            key={`lazy-skeleton-${i}`}
                                            className="bg-white rounded-2xl p-4 sm:p-5 border border-sand-200/60 animate-pulse space-y-3"
                                        >
                                            <div className="aspect-square w-full rounded-xl bg-sand-200/50 flex items-center justify-center">
                                                <CoffeeBeanIcon className="w-8 h-8 text-accent-copper/60 animate-bounce" />
                                            </div>
                                            <div className="h-4 bg-sand-200/60 rounded w-2/3" />
                                            <div className="h-5 bg-sand-200/70 rounded w-full" />
                                            <div className="h-4 bg-sand-200/40 rounded w-1/2" />
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>

                        {/* Lazy load intersection sentinel */}
                        <div ref={loadMoreSentinelRef} className="h-4" />

                        {/* Lazy load button & status */}
                        {hasMore ? (
                            <div className="pt-6 flex flex-col items-center justify-center gap-2.5">
                                <button
                                    type="button"
                                    onClick={loadMoreProducts}
                                    disabled={isLoadingMore}
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-900 hover:bg-brand-800 text-white text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
                                >
                                    {isLoadingMore ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin text-accent-copper" />
                                            <span>Memuat Produk...</span>
                                        </>
                                    ) : (
                                        <span>Muat Lebih Banyak Produk</span>
                                    )}
                                </button>
                                <span className="text-[11px] text-brand-600 font-medium">
                                    Menampilkan {allProducts.length} dari {products.total} produk
                                </span>
                            </div>
                        ) : (
                            <div className="pt-8 text-center text-xs text-brand-500 font-medium">
                                Seluruh produk ({allProducts.length}) telah ditampilkan
                            </div>
                        )}
                    </>
                )}
            </div>
        </PublicLayout>
    );
}
