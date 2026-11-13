import React, { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';
import { ChevronRight, ShoppingBag, Zap } from 'lucide-react';

export interface FlashSaleItem {
    id: string | number;
    name: string;
    slug?: string;
    price: number;
    original_price?: number | null;
    image: string;
    badge?: string | null;
    stock_status?: string;
}

interface FlashSaleSectionProps {
    products?: FlashSaleItem[];
    endTime?: string | null;
    title?: string;
    subtitle?: string;
    isActive?: boolean;
}

export function FlashSaleSection({
    products = [],
    endTime,
    title = 'FLASH SALE',
    subtitle = 'Penawaran terbatas harga terbaik hari ini',
    isActive = true,
}: FlashSaleSectionProps) {
    const calculateRemainingSeconds = () => {
        if (!endTime) return 0;
        try {
            const formatted = endTime.includes('T') ? endTime : endTime.replace(' ', 'T');
            const target = new Date(formatted).getTime();
            const now = new Date().getTime();
            if (isNaN(target)) return 0;
            return Math.max(0, Math.floor((target - now) / 1000));
        } catch {
            return 0;
        }
    };

    // Live countdown timer state
    const [secondsLeft, setSecondsLeft] = useState<number>(calculateRemainingSeconds);

    useEffect(() => {
        setSecondsLeft(calculateRemainingSeconds());
        const interval = setInterval(() => {
            setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, [endTime]);

    const days = Math.floor(secondsLeft / 86400);
    const hours = String(Math.floor((secondsLeft % 86400) / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((secondsLeft % 3600) / 60)).padStart(2, '0');
    const seconds = String(secondsLeft % 60).padStart(2, '0');

    const formatPrice = (val?: number | null) => {
        if (!val) return '0';
        return new Intl.NumberFormat('id-ID').format(val);
    };

    if (!isActive || !products || products.length === 0) {
        return null;
    }

    return (
        <section className="w-full max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8" aria-label="Promo Flash Sale">
            <div className="w-full bg-gradient-to-br from-brand-950 via-brand-900 to-brand-850 rounded-2xl sm:rounded-3xl p-2.5 sm:p-6 lg:p-7 shadow-xl shadow-brand-950/20 border border-brand-700/40 flex flex-col md:flex-row items-stretch md:items-center gap-3 sm:gap-6 relative overflow-hidden">
                {/* Decorative Subtle Background Glow */}
                <div className="absolute -top-24 -left-24 w-72 h-72 bg-accent-copper/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* Left Column: Brand Hero Banner (Desktop Only) */}
                <div className="hidden md:flex flex-col justify-center items-start md:w-52 lg:w-60 flex-shrink-0 text-white relative z-10">
                    <div className="space-y-2 sm:space-y-3">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-copper/20 backdrop-blur-md border border-accent-copper/40 text-accent-copper-light text-[11px] sm:text-xs font-black tracking-wider uppercase">
                            <Zap className="w-3.5 h-3.5 fill-accent-copper-light text-accent-copper-light" />
                            <span>PROMO SPESIAL</span>
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
                        <p className="text-xs sm:text-sm text-brand-200 leading-snug font-medium max-w-[200px]">
                            {subtitle}
                        </p>
                    </div>
                </div>

                {/* Main Content Area: Mobile Header + Products Grid / Carousel */}
                <div className="flex-1 min-w-0 flex flex-col justify-center gap-2.5 sm:gap-4 relative z-10 w-full">
                    {/* Mobile Header (matches reference screenshot): Pill Badge + Countdown + Arrow Button */}
                    <div className="flex md:hidden items-center justify-between gap-1.5 w-full">
                        {/* 1. Left Pill: FLASH SALE with bolt icon */}
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-950/90 border border-accent-copper/50 text-accent-copper-light text-[11px] font-black tracking-wider uppercase shadow-xs">
                            <Zap className="w-3 h-3 fill-accent-copper text-accent-copper" />
                            <span>FLASH SALE</span>
                        </div>

                        {/* 2. Center: Berakhir dalam + countdown boxes */}
                        <div className="inline-flex items-center gap-1.5">
                            <span className="text-sand-200 text-[11px] font-bold whitespace-nowrap">
                                Berakhir dalam
                            </span>
                            <div className="inline-flex items-center gap-1">
                                {days > 0 && (
                                    <span className="bg-[#b43425] text-white font-black text-xs px-1.5 py-0.5 rounded-md min-w-[22px] text-center shadow-xs">
                                        {days}h
                                    </span>
                                )}
                                <span className="bg-[#b43425] text-white font-black text-xs px-1.5 py-0.5 rounded-md min-w-[22px] text-center shadow-xs">
                                    {hours}
                                </span>
                                <span className="bg-[#b43425] text-white font-black text-xs px-1.5 py-0.5 rounded-md min-w-[22px] text-center shadow-xs">
                                    {minutes}
                                </span>
                                <span className="bg-[#b43425] text-white font-black text-xs px-1.5 py-0.5 rounded-md min-w-[22px] text-center shadow-xs">
                                    {seconds}
                                </span>
                            </div>
                        </div>

                        {/* 3. Right: Circular arrow button to /flash-sale */}
                        <Link
                            href="/flash-sale"
                            aria-label="Lihat Semua Flash Sale"
                            className="w-7 h-7 rounded-full bg-brand-800/90 hover:bg-accent-copper text-white flex items-center justify-center transition-colors border border-brand-700/60 shadow-xs flex-shrink-0"
                        >
                            <ChevronRight className="w-4 h-4 text-white stroke-[2.5]" />
                        </Link>
                    </div>

                    {/* Top Info Bar (Desktop / Tablet) */}
                    <div className="hidden md:flex items-center justify-between w-full">
                        <div className="flex items-center gap-2.5">
                            <span className="text-white font-bold text-sm lg:text-base">Berakhir dalam</span>
                            <div className="inline-flex items-center gap-1.5">
                                {days > 0 && (
                                    <span className="bg-accent-copper text-white font-black text-xs sm:text-sm px-2.5 py-1 rounded-md min-w-[30px] text-center shadow-xs tracking-wider border border-accent-copper-hover">
                                        {days} hari
                                    </span>
                                )}
                                <span className="bg-accent-copper text-white font-black text-xs sm:text-sm px-2.5 py-1 rounded-md min-w-[30px] text-center shadow-xs tracking-wider border border-accent-copper-hover">
                                    {hours}
                                </span>
                                <span className="bg-accent-copper text-white font-black text-xs sm:text-sm px-2.5 py-1 rounded-md min-w-[30px] text-center shadow-xs tracking-wider border border-accent-copper-hover">
                                    {minutes}
                                </span>
                                <span className="bg-accent-copper text-white font-black text-xs sm:text-sm px-2.5 py-1 rounded-md min-w-[30px] text-center shadow-xs tracking-wider border border-accent-copper-hover">
                                    {seconds}
                                </span>
                            </div>
                        </div>

                        <Link
                            href="/flash-sale"
                            className="inline-flex items-center gap-1 text-white hover:text-accent-copper-light font-bold text-xs sm:text-sm transition-all hover:translate-x-1 ml-auto"
                        >
                            <span>Lihat Semua</span>
                            <ChevronRight className="w-4 h-4 text-white stroke-[2.5]" />
                        </Link>
                    </div>

                    {/* Cards Carousel: ~2 cards visible + 3rd peeking on mobile, 4 columns on desktop */}
                    <div className="flex lg:grid lg:grid-cols-4 gap-2 sm:gap-3.5 overflow-x-auto pb-1 no-scrollbar snap-x snap-mandatory">
                        {products.map((item) => {
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
                                        <span className="absolute top-2 left-2 bg-[#e03131] text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs pointer-events-none">
                                            {item.badge || 'Flash Sale'}
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

                                        {/* Bottom Action Button matching shop page */}
                                        <div className="pt-2 mt-auto">
                                            <div className="w-full py-1.5 sm:py-2 px-2.5 rounded-lg bg-brand-700 hover:bg-brand-800 text-white font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs">
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
