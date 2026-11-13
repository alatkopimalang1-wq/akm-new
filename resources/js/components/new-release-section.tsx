import React from 'react';
import { Link } from '@inertiajs/react';
import { ChevronRight, ShoppingBag, Sparkles } from 'lucide-react';
import type { NewReleaseItem } from '@/types/sanubari';

interface NewReleaseSectionProps {
    products?: NewReleaseItem[];
    title?: string;
    subtitle?: string;
    badge?: string;
    buttonText?: string;
    buttonUrl?: string;
    isActive?: boolean;
}

export function NewReleaseSection({
    products = [],
    title = 'New Release',
    subtitle = 'Koleksi biji kopi dan racikan terbaru dari Alat Kopi Malang',
    badge = 'NEW RELEASE',
    buttonText = 'Lihat Semua',
    buttonUrl = '/new-release',
    isActive = true,
}: NewReleaseSectionProps) {
    if (!isActive || !products || products.length === 0) {
        return null;
    }

    // Enforce maximum 4 products
    const displayProducts = products.slice(0, 4);

    const formatPrice = (val?: number | null) => {
        if (!val) return '0';
        return new Intl.NumberFormat('id-ID').format(val);
    };

    return (
        <section className="w-full max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8" aria-label="Menu New Release">
            <div className="w-full bg-gradient-to-br from-brand-950 via-brand-900 to-brand-850 rounded-2xl sm:rounded-3xl p-3 sm:p-6 lg:p-7 shadow-xl shadow-brand-950/20 border border-brand-700/40 flex flex-col md:flex-row items-stretch md:items-center gap-3.5 sm:gap-6 relative overflow-hidden">
                {/* Decorative Subtle Background Glow */}
                <div className="absolute -top-24 -left-24 w-72 h-72 bg-accent-copper/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />

                {/* Left Column: Brand Hero Title (Desktop Only) */}
                <div className="hidden md:flex flex-col justify-center items-start md:w-52 lg:w-60 flex-shrink-0 text-white relative z-10">
                    <div className="space-y-2 sm:space-y-3">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-copper/20 backdrop-blur-md border border-accent-copper/40 text-accent-copper-light text-[11px] sm:text-xs font-black tracking-wider uppercase">
                            <Sparkles className="w-3.5 h-3.5 fill-accent-copper-light text-accent-copper-light" />
                            <span>{badge}</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-black tracking-tight leading-[0.92] text-white">
                            {title.includes(' ') ? (
                                <>
                                    {title.split(' ')[0]}<br />
                                    <span className="text-accent-copper-light bg-gradient-to-b from-[#f3c28b] via-[#e6a765] to-[#a06f32] bg-clip-text text-transparent">
                                        {title.split(' ').slice(1).join(' ')}
                                    </span>
                                </>
                            ) : (
                                <span className="text-accent-copper-light bg-gradient-to-b from-[#f3c28b] via-[#e6a765] to-[#a06f32] bg-clip-text text-transparent">
                                    {title}
                                </span>
                            )}
                        </h2>
                        <p className="text-xs sm:text-sm text-brand-200 leading-snug font-medium max-w-[210px]">
                            {subtitle}
                        </p>
                    </div>
                </div>

                {/* Main Content Area: Mobile Header + Products Grid / Carousel */}
                <div className="flex-1 min-w-0 flex flex-col justify-center gap-2.5 sm:gap-4 relative z-10 w-full">
                    {/* Mobile Header: Pill Badge + Lihat Semua Link */}
                    <div className="flex md:hidden items-center justify-between gap-1.5 w-full">
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-950/90 border border-accent-copper/50 text-accent-copper-light text-[11px] font-black tracking-wider uppercase shadow-xs">
                            <Sparkles className="w-3 h-3 fill-accent-copper text-accent-copper" />
                            <span>{badge}</span>
                        </div>

                        <Link
                            href={buttonUrl}
                            className="inline-flex items-center gap-1 text-white hover:text-accent-copper-light text-xs font-bold transition-colors"
                        >
                            <span>{buttonText}</span>
                            <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
                        </Link>
                    </div>

                    {/* Top Info Bar (Desktop / Tablet) */}
                    <div className="hidden md:flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                            <span className="text-brand-300 text-xs sm:text-sm font-semibold">
                                Koleksi Eksklusif & Sangrai Terbaru
                            </span>
                        </div>

                        <Link
                            href={buttonUrl}
                            className="inline-flex items-center gap-1 text-white hover:text-accent-copper-light font-bold text-xs sm:text-sm transition-all hover:translate-x-1 ml-auto"
                        >
                            <span>{buttonText}</span>
                            <ChevronRight className="w-4 h-4 text-white stroke-[2.5]" />
                        </Link>
                    </div>

                    {/* Cards Carousel / Grid: Up to 4 products */}
                    <div className="flex lg:grid lg:grid-cols-4 gap-2.5 sm:gap-3.5 overflow-x-auto pb-1 no-scrollbar snap-x snap-mandatory">
                        {displayProducts.map((item) => {
                            const linkHref = item.slug ? `/shop/${item.slug}` : `/shop?search=${encodeURIComponent(item.name)}`;
                            return (
                                <Link
                                    key={item.id}
                                    href={linkHref}
                                    className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col group flex-shrink-0 w-[155px] sm:w-48 lg:w-auto snap-start cursor-pointer border border-brand-700/20"
                                >
                                    {/* Image Container with 1:1 Aspect Ratio */}
                                    <div className="relative aspect-square w-full bg-sand-200/40 overflow-hidden flex items-center justify-center">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            loading="lazy"
                                        />
                                        <span className="absolute top-2 left-2 bg-[#b43425] text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs pointer-events-none uppercase tracking-wider">
                                            {item.badge || 'NEW RELEASE'}
                                        </span>
                                    </div>

                                    {/* Card Info */}
                                    <div className="p-2.5 sm:p-3.5 flex flex-col flex-1">
                                        <h4 className="text-xs sm:text-[13px] font-semibold text-brand-950 line-clamp-2 min-h-[32px] sm:min-h-[34px] leading-snug mb-1.5 group-hover:text-accent-copper transition-colors">
                                            {item.name}
                                        </h4>

                                        <div className="mt-auto space-y-0.5">
                                            {item.original_price && item.original_price > item.price && (
                                                <div className="text-[10px] sm:text-[11px] text-brand-400 line-through font-medium leading-none">
                                                    Rp {formatPrice(item.original_price)}
                                                </div>
                                            )}
                                            <div className="text-sm sm:text-base font-extrabold text-[#b43425] sm:text-accent-copper leading-tight">
                                                Rp {formatPrice(item.price)}
                                            </div>
                                        </div>

                                        {/* Bottom Action Button matching design */}
                                        <div className="pt-2 mt-auto">
                                            <div className="w-full py-1.5 sm:py-2 px-2.5 rounded-lg bg-brand-700 group-hover:bg-brand-800 text-white font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs">
                                                <ShoppingBag className="w-3.5 h-3.5 stroke-[2.2]" />
                                                <span>+ Keranjang</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}

