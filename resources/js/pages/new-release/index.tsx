import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Heart,
    ShoppingBag,
    Sparkles,
} from 'lucide-react';
import { PublicLayout } from '@/layouts/public-layout';
import type { NewReleaseItem, SanubariSharedProps } from '@/types/sanubari';

interface NewReleaseIndexProps {
    featuredItems?: NewReleaseItem[];
    products: NewReleaseItem[];
    title?: string;
    subtitle?: string;
    badge?: string;
    isActive?: boolean;
}

export default function NewReleaseIndex({
    products = [],
    title = 'New Release',
    subtitle = 'Koleksi biji kopi dan racikan terbaru dari Sanubari Roastery',
    badge = 'NEW RELEASE',
}: NewReleaseIndexProps) {
    const { settings } = usePage<SanubariSharedProps>().props;
    const effectiveTitle = title || settings?.home_new_release_title || 'New Release';
    const effectiveSubtitle = subtitle || settings?.home_new_release_subtitle || 'Koleksi biji kopi dan racikan terbaru dari Sanubari Roastery';
    const effectiveBadge = badge || settings?.home_new_release_badge || 'NEW RELEASE';

    const [wishlist, setWishlist] = useState<Record<string | number, boolean>>({});

    const formatPrice = (val?: number | null) => {
        if (!val) return '0';
        return new Intl.NumberFormat('id-ID').format(val);
    };

    const toggleWishlist = (id: string | number, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setWishlist((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    return (
        <PublicLayout title={`${effectiveTitle} — Koleksi Terbaru Sanubari Roastery`}>
            <Head>
                <meta
                    name="description"
                    content={`${effectiveTitle}: ${effectiveSubtitle}. Pilihan biji kopi single origin, house blend, dan racikan kopi terbaru langsung dari sangrai Sanubari Roastery.`}
                />
            </Head>

            <main className="w-full max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 sm:space-y-8">
                {/* Hero Banner Header */}
                <section
                    className="w-full bg-gradient-to-br from-brand-950 via-brand-900 to-brand-850 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl shadow-brand-950/20 border border-brand-700/40 relative overflow-hidden text-white"
                    aria-label="New Release Banner"
                >
                    {/* Ambient Glows */}
                    <div className="absolute -top-24 -left-24 w-80 h-80 bg-accent-copper/20 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 max-w-3xl space-y-3 sm:space-y-4">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-copper/20 backdrop-blur-md border border-accent-copper/40 text-accent-copper-light text-xs font-black tracking-wider uppercase">
                            <Sparkles className="w-3.5 h-3.5 fill-accent-copper-light text-accent-copper-light" />
                            <span>{effectiveBadge}</span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white">
                            {effectiveTitle}
                        </h1>

                        <p className="text-sm sm:text-base text-brand-200 leading-relaxed font-medium">
                            {effectiveSubtitle}
                        </p>
                    </div>
                </section>

                {/* Products Grid */}
                {products.length === 0 ? (
                    <div className="text-center py-16 bg-sand-50 rounded-2xl border border-brand-200/60 p-6 space-y-3">
                        <h3 className="text-base font-bold text-brand-900">Belum ada produk New Release</h3>
                        <p className="text-xs text-brand-600">Silakan kunjungi katalog toko untuk melihat seluruh koleksi kami.</p>
                        <Link
                            href="/shop"
                            className="inline-block mt-2 px-4 py-2 rounded-lg bg-brand-800 text-white font-bold text-xs hover:bg-brand-900"
                        >
                            Ke Toko Kopi
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
                        {products.map((item) => {
                            const linkHref = item.slug ? `/shop/${item.slug}` : `/shop?search=${encodeURIComponent(item.name)}`;
                            return (
                                <Link
                                    key={item.id}
                                    href={linkHref}
                                    className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group border border-brand-200/80 hover:border-accent-copper/40"
                                >
                                    {/* Image Container with 1:1 Aspect Ratio */}
                                    <div className="relative aspect-square w-full bg-sand-200/40 overflow-hidden flex items-center justify-center">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            loading="lazy"
                                        />
                                        <span className="absolute top-2 left-2 bg-[#b43425] text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs pointer-events-none uppercase tracking-wider">
                                            {item.badge || 'NEW RELEASE'}
                                        </span>

                                        {/* Wishlist Button */}
                                        <button
                                            type="button"
                                            aria-label="Simpan ke favorit"
                                            onClick={(e) => toggleWishlist(item.id, e)}
                                            className="absolute top-2 right-2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-brand-600 hover:text-red-600 transition-colors shadow-xs"
                                        >
                                            <Heart
                                                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                                                    wishlist[item.id] ? 'fill-red-600 text-red-600' : ''
                                                }`}
                                            />
                                        </button>
                                    </div>

                                    {/* Card Details */}
                                    <div className="p-3 sm:p-4 flex flex-col flex-1">
                                        {item.category && (
                                            <span className="text-[10px] sm:text-[11px] font-bold text-accent-copper uppercase tracking-wider mb-1 line-clamp-1">
                                                {item.category}
                                            </span>
                                        )}

                                        <h3 className="text-xs sm:text-sm font-bold text-brand-950 line-clamp-2 min-h-[34px] sm:min-h-[40px] leading-snug mb-1.5 group-hover:text-accent-copper transition-colors">
                                            {item.name}
                                        </h3>

                                        {item.description && (
                                            <p className="text-[11px] text-brand-500 line-clamp-2 mb-2">
                                                {item.description}
                                            </p>
                                        )}

                                        <div className="mt-auto space-y-0.5 pt-2">
                                            {item.original_price && item.original_price > item.price && (
                                                <div className="text-[10px] sm:text-[11px] text-brand-400 line-through font-medium leading-none">
                                                    Rp {formatPrice(item.original_price)}
                                                </div>
                                            )}
                                            <div className="text-sm sm:text-base font-extrabold text-[#b43425] sm:text-accent-copper leading-tight">
                                                Rp {formatPrice(item.price)}
                                            </div>
                                        </div>

                                        {/* Button */}
                                        <div className="pt-3 mt-auto">
                                            <div className="w-full py-2 px-3 rounded-lg bg-brand-700 group-hover:bg-brand-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs">
                                                <ShoppingBag className="w-3.5 h-3.5 stroke-[2.2]" />
                                                <span>+ Keranjang</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </main>
        </PublicLayout>
    );
}
