import React, { useEffect, useRef, useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { AnimatePresence, motion } from 'motion/react';
import {
    ArrowRight,
    ArrowUpRight,
    BookOpen,
    Coffee,
    Loader2,
    Search,
    SlidersHorizontal,
    TrendingUp,
    X,
} from 'lucide-react';
import type { BrewGuide, Product } from '@/types/sanubari';
import { formatRupiah, t } from '@/lib/trans';

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const resolveProductImageUrl = (p: Product) => {
    const raw = p.images?.[0]?.path || p.variants?.[0]?.image_url || p.variants?.[0]?.image;
    if (!raw) return '/brand/logo-circle.png';
    if (raw.startsWith('http://') || raw.startsWith('https://')) return raw;
    const clean = raw.replace(/^\/?(public\/|storage\/)?/, '');
    return `/storage/${clean}`;
};

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [trending, setTrending] = useState<string[]>([]);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 640);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);
    const [recommended, setRecommended] = useState<Product[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [guides, setGuides] = useState<BrewGuide[]>([]);

    const inputRef = useRef<HTMLInputElement>(null);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    // Initial load for trending & recommended
    useEffect(() => {
        if (!isOpen) return;

        // Auto-focus input on open (Emil Kowalski: immediate keyboard readiness)
        const timer = setTimeout(() => {
            inputRef.current?.focus();
        }, 50);

        // Fetch zero-state data if empty
        if (trending.length === 0) {
            fetch('/api/search')
                .then((res) => res.json())
                .then((data) => {
                    if (data.trending) setTrending(data.trending);
                    if (data.recommended) setRecommended(data.recommended);
                })
                .catch(() => {});
        }

        return () => clearTimeout(timer);
    }, [isOpen]);

    // Handle ESC key to close immediately (Emil Kowalski: never delay keyboard-initiated dismiss)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                e.preventDefault();
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    // Query fetch with snappy debounce (150ms)
    useEffect(() => {
        if (!isOpen) return;

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        const trimmed = query.trim();
        if (!trimmed) {
            setProducts([]);
            setGuides([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        debounceRef.current = setTimeout(() => {
            fetch(`/api/search?q=${encodeURIComponent(trimmed)}`)
                .then((res) => res.json())
                .then((data) => {
                    setProducts(data.products || []);
                    setGuides(data.guides || []);
                    setLoading(false);
                })
                .catch(() => {
                    setLoading(false);
                });
        }, 150);

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [query, isOpen]);

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleSelectTag = (tag: string) => {
        onClose();
        router.get('/shop', { q: tag }, { preserveState: false });
    };

    const handleModalSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = query.trim();
        if (trimmed) {
            onClose();
            router.get('/shop', { q: trimmed }, { preserveState: false });
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    role="dialog"
                    aria-modal="true"
                    aria-label="Pencarian Kopi Sanubari"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    onClick={handleBackdropClick}
                    className="fixed inset-0 z-[70] flex items-start justify-center p-3 sm:p-4 md:p-6 bg-brand-950/70 backdrop-blur-xs"
                >
                    {/* Modal Card with Animate UI spring & scale */}
                    <motion.div
                        data-ui="modal"
                        initial={{ opacity: 0, scale: 0.97, y: -8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.97, y: -6 }}
                        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                        className="w-full max-w-2xl bg-white rounded-2xl mt-12 sm:mt-16 flex flex-col overflow-hidden max-h-[85vh] ring-1 ring-sand-300 shadow-2xl"
                    >
                {/* Search Bar Input Row */}
                <form
                    onSubmit={handleModalSubmit}
                    data-ui="search-header"
                    className="p-3 sm:p-4 flex items-center gap-3 bg-cream-50 border-b border-sand-200/80"
                >
                    <Search className="w-5 h-5 text-brand-600 flex-shrink-0" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={isMobile ? '' : 'Cari kopi, tasting notes, proses, atau metode seduh...'}
                        className="flex-1 bg-transparent border-0 text-brand-950 placeholder-transparent sm:placeholder-brand-500 text-[16px] sm:text-base font-medium focus:ring-0 focus:outline-none"
                    />

                    {loading && (
                        <Loader2 className="w-4 h-4 text-accent-copper animate-spin flex-shrink-0" />
                    )}

                    {query && !loading && (
                        <button
                            type="button"
                            onClick={() => {
                                setQuery('');
                                inputRef.current?.focus();
                            }}
                            className="p-1 rounded-full text-brand-400 hover:text-brand-800 hover:bg-sand-200/60 transition-colors active:scale-95"
                            aria-label="Hapus pencarian"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}

                    <button
                        type="submit"
                        className="px-3 py-1.5 rounded-lg bg-accent-copper hover:bg-accent-copper-hover text-white text-xs font-bold transition-colors shadow-xs cursor-pointer"
                    >
                        Cari
                    </button>

                    <div className="hidden sm:flex items-center pl-1 text-[11px] font-semibold text-brand-500">
                        <kbd className="px-1.5 py-0.5 rounded-sm bg-sand-200/60 text-brand-600 font-mono">
                            ESC
                        </kbd>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="sm:hidden p-1.5 rounded-full text-brand-700 hover:bg-sand-200/60 transition-colors"
                        aria-label="Tutup"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </form>

                {/* Modal Scrollable Content Area */}
                <div className="overflow-y-auto p-4 sm:p-6 space-y-6 flex-1 overscroll-contain">
                    {/* ------------------------------------------------------------- */}
                    {/* ZERO STATE: Trending Tags & Recommended Roasts                */}
                    {/* ------------------------------------------------------------- */}
                    {!query.trim() && (
                        <>
                            {/* Trending Search Tags (Artatix Pattern) */}
                            <div>
                                <div className="flex items-center gap-2 mb-3 text-xs font-bold text-brand-700">
                                    <TrendingUp className="w-4 h-4 text-accent-copper" />
                                    <span>Pencarian Populer</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {trending.map((item) => (
                                        <button
                                            key={item}
                                            type="button"
                                            onClick={() => handleSelectTag(item)}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sand-100 hover:bg-sand-200 text-brand-900 text-xs sm:text-sm font-medium transition-transform duration-100 active:scale-[0.97]"
                                        >
                                            <ArrowUpRight className="w-3.5 h-3.5 text-accent-copper flex-shrink-0" />
                                            <span>{item}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Rekomendasi Kopi (Artatix 'Rekomendasi Event' Pattern) */}
                            {recommended.length > 0 && (
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="text-xs font-bold text-brand-700">
                                            <span>Rekomendasi Roaster Pekan Ini</span>
                                        </div>
                                        <Link
                                            href="/shop"
                                            onClick={onClose}
                                            className="text-xs font-semibold text-accent-copper hover:underline"
                                        >
                                            Lihat Semua Katalog
                                        </Link>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {recommended.map((product) => (
                                            <Link
                                                key={product.id}
                                                href={`/shop/${product.slug}`}
                                                onClick={onClose}
                                                className="group flex items-center gap-3 p-2.5 rounded-xl bg-sand-50/70 hover:bg-sand-100 transition-colors duration-150 active:scale-[0.98]"
                                            >
                                                <div className="w-14 h-14 rounded-lg overflow-hidden bg-sand-200 flex-shrink-0">
                                                    <img
                                                        src={resolveProductImageUrl(product)}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                                    />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <h4 className="text-sm font-bold text-brand-950 truncate group-hover:text-accent-copper transition-colors">
                                                        {product.name}
                                                    </h4>
                                                    <p className="text-xs text-brand-700 truncate">
                                                        {product.tasting_notes || product.origin}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className="text-xs font-extrabold text-brand-900">
                                                            {formatRupiah(product.min_price)}
                                                        </span>
                                                        {product.roast_level && (
                                                            <span className="text-[10px] px-1.5 py-0.2 rounded-sm bg-sand-200 text-brand-700">
                                                                {product.roast_level}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quick Shortcut to BYOB (Build Your Own Blend) */}
                            <div className="p-3.5 rounded-xl bg-sand-100 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-full bg-accent-copper text-white flex items-center justify-center flex-shrink-0">
                                        <SlidersHorizontal className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-brand-950">Ingin custom blend kopi sendiri?</p>
                                        <p className="text-[11px] text-brand-700">C.Y.B.R Studio: Padukan 2 biji kopi dengan slider persentase.</p>
                                    </div>
                                </div>
                                <Link
                                    href="/cybr"
                                    onClick={onClose}
                                    className="px-3 py-1.5 rounded-full bg-brand-900 hover:bg-brand-800 text-white text-xs font-bold transition-transform duration-100 active:scale-95 flex-shrink-0"
                                >
                                    C.Y.B.R Studio
                                </Link>
                            </div>
                        </>
                    )}

                    {/* ------------------------------------------------------------- */}
                    {/* LIVE QUERY STATE: Filtered Products & Guides                  */}
                    {/* ------------------------------------------------------------- */}
                    {query.trim() && (
                        <div className="space-y-6">
                            {/* Direct shortcut to catalog with keyword */}
                            <button
                                type="button"
                                onClick={() => {
                                    onClose();
                                    router.get('/shop', { q: query.trim() }, { preserveState: false });
                                }}
                                className="w-full flex items-center justify-between p-3 rounded-xl bg-accent-copper/10 hover:bg-accent-copper/20 border border-accent-copper/30 text-accent-copper font-bold text-xs sm:text-sm transition-all cursor-pointer text-left shadow-xs"
                            >
                                <span className="flex items-center gap-2">
                                    <Search className="w-4 h-4 text-accent-copper shrink-0" />
                                    <span>Buka semua daftar produk untuk "{query}" →</span>
                                </span>
                                <ArrowRight className="w-4 h-4 shrink-0" />
                            </button>
                            {/* Coffee Beans Matches */}
                            {products.length > 0 && (
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-xs font-bold text-brand-700">
                                            Koleksi Biji Kopi ({products.length})
                                        </span>
                                    </div>
                                    <div className="space-y-2">
                                        {products.map((product) => (
                                            <Link
                                                key={product.id}
                                                href={`/shop/${product.slug}`}
                                                onClick={onClose}
                                                className="group flex items-center gap-3 p-3 rounded-xl hover:bg-sand-100 transition-colors duration-150 active:scale-[0.98]"
                                            >
                                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-sand-200 flex-shrink-0">
                                                    <img
                                                        src={resolveProductImageUrl(product)}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                                    />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="text-sm font-bold text-brand-950 truncate group-hover:text-accent-copper transition-colors">
                                                            {product.name}
                                                        </h4>
                                                        {product.series && (
                                                            <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-sand-200 text-brand-800 flex-shrink-0">
                                                                {product.series}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-brand-700 truncate mt-0.5">
                                                        {product.tasting_notes} • {product.process}
                                                    </p>
                                                </div>
                                                <div className="text-right flex-shrink-0">
                                                    <span className="text-xs sm:text-sm font-extrabold text-brand-950">
                                                        {formatRupiah(product.min_price)}
                                                    </span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Brew Guides Matches */}
                            {guides.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2 mb-2 text-xs font-bold text-brand-700">
                                        <BookOpen className="w-4 h-4 text-accent-copper" />
                                        <span>Panduan Seduh Terkait</span>
                                    </div>
                                    <div className="space-y-2">
                                        {guides.map((guide) => (
                                            <Link
                                                key={guide.id}
                                                href={`/panduan-seduh/${guide.slug}`}
                                                onClick={onClose}
                                                className="group flex items-center justify-between p-2.5 rounded-xl hover:bg-sand-100 transition-colors duration-150 active:scale-[0.98]"
                                            >
                                                <div className="flex items-center gap-2.5">
                                                    <Coffee className="w-4 h-4 text-accent-copper" />
                                                    <span className="text-sm font-semibold text-brand-950 group-hover:text-accent-copper transition-colors">
                                                        {t(guide.title)}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-brand-600 font-medium">
                                                    {guide.method}
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* No Results Fallback */}
                            {!loading && products.length === 0 && guides.length === 0 && (
                                <div className="py-10 text-center space-y-3">
                                    <div className="w-12 h-12 rounded-full bg-sand-200/60 text-brand-600 flex items-center justify-center mx-auto">
                                        <Search className="w-6 h-6" />
                                    </div>
                                    <h4 className="text-base font-bold text-brand-900">
                                        Biji kopi atau panduan seduh tidak ditemukan
                                    </h4>
                                    <p className="text-xs sm:text-sm text-brand-700 max-w-sm mx-auto">
                                        Tidak ada hasil untuk kata kunci "{query}". Coba cari "Kawi", "Espresso", "Filter", atau konsultasikan langsung ke roaster kami.
                                    </p>
                                    <div className="pt-2 flex justify-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setQuery('')}
                                            className="px-4 py-2 rounded-full bg-sand-200 hover:bg-sand-300 text-brand-950 text-xs font-bold transition-transform duration-100 active:scale-95"
                                        >
                                            Reset Pencarian
                                        </button>
                                        <a
                                            href="https://wa.me/6285121930454?text=Halo%20Sanubari%20Roastery%2C%20saya%20mencari%20kopi%20spesifik"
                                            target="_blank"
                                            rel="noreferrer"
                                            className="px-4 py-2 rounded-full bg-brand-900 hover:bg-brand-800 text-white text-xs font-bold transition-transform duration-100 active:scale-95"
                                        >
                                            Tanya Roaster di WhatsApp
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer Quick Tip */}
                <div data-ui="search-footer" className="p-3 bg-cream-100 px-4 sm:px-6 flex items-center justify-between text-xs text-brand-600">
                    <span className="truncate">
                        Ketik nama origin, metode seduh, atau tasting notes favorit Anda.
                    </span>
                        <Link
                            href="/shop"
                            onClick={onClose}
                            className="font-bold text-brand-900 hover:text-accent-copper flex-shrink-0 hover:underline"
                        >
                            Buka Katalog Penuh →
                        </Link>
                    </div>
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
);
};
