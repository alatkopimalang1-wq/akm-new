import React, { useEffect, useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Clock,
    Heart,
    ShoppingBag,
    Zap,
} from 'lucide-react';
import { PublicLayout } from '@/layouts/public-layout';
import type { FlashSaleProduct, SanubariSharedProps } from '@/types/sanubari';

interface FlashSaleIndexProps {
    heroItems?: FlashSaleProduct[];
    products: FlashSaleProduct[];
    endTime?: string | null;
    startTime?: string | null;
    title?: string;
    subtitle?: string;
    isActive?: boolean;
}

export default function FlashSaleIndex({
    products = [],
    endTime,
    title,
    subtitle,
    isActive = true,
}: FlashSaleIndexProps) {
    const { settings } = usePage<SanubariSharedProps>().props;
    const effectiveEndTime = endTime || settings?.home_flash_sale_end_time;
    const effectiveTitle = title || settings?.home_flash_sale_title || 'FLASH SALE';

    const calculateRemainingSeconds = () => {
        if (!effectiveEndTime) return 0;
        try {
            const formatted = effectiveEndTime.includes('T')
                ? effectiveEndTime
                : effectiveEndTime.replace(' ', 'T');
            const target = new Date(formatted).getTime();
            const now = new Date().getTime();
            if (isNaN(target)) return 0;
            return Math.max(0, Math.floor((target - now) / 1000));
        } catch {
            return 0;
        }
    };

    // Live countdown timer state connected to Admin Dashboard setting
    const [secondsLeft, setSecondsLeft] = useState<number>(calculateRemainingSeconds);
    const [wishlist, setWishlist] = useState<Record<string | number, boolean>>({});

    useEffect(() => {
        setSecondsLeft(calculateRemainingSeconds());
        const interval = setInterval(() => {
            setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, [effectiveEndTime]);

    const days = Math.floor(secondsLeft / 86400);
    const hours = String(Math.floor((secondsLeft % 86400) / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((secondsLeft % 3600) / 60)).padStart(2, '0');
    const seconds = String(secondsLeft % 60).padStart(2, '0');
    const isExpired = secondsLeft <= 0;

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
        <PublicLayout title="Flash Sale Kopi Hari Ini — Alat Kopi Malang">
            <Head>
                <meta
                    name="description"
                    content="Flash Sale Kopi Hari Ini pilihan Alat Kopi Malang. Diskon spesial terbatas untuk biji kopi pilihan dan peralatan seduh manual."
                />
            </Head>

            <main className="w-full max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-8">
                {/* Top Simple Hero Banner matching uploaded design */}
                <section
                    className="w-full bg-gradient-to-r from-brand-950 via-brand-900 to-brand-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl shadow-brand-950/20 border border-brand-700/40 relative overflow-hidden text-white"
                    aria-label="Flash Sale Kopi Hari Ini Banner"
                >
                    {/* Subtle warm ambient glows */}
                    <div className="absolute -top-24 -left-24 w-80 h-80 bg-accent-copper/15 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
                        {/* Left: Heading */}
                        <div className="text-center md:text-left">
                            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight leading-tight uppercase">
                                FLASH{' '}
                                <span className="bg-gradient-to-r from-[#fcd34d] via-[#f59e0b] to-[#d97706] bg-clip-text text-transparent">
                                    SALE
                                </span>{' '}
                                KOPI HARI INI
                            </h1>
                        </div>

                        {/* Right: Timer Section */}
                        <div className="flex flex-col items-center md:items-end gap-2 text-center md:text-right">
                            <div className="flex items-center gap-1.5 text-white/95 text-xs sm:text-sm font-extrabold uppercase tracking-wider">
                                <Clock className="w-4 h-4 text-accent-copper-light" />
                                <span>{isExpired ? 'PROMO TELAH BERAKHIR' : 'PROMO BERAKHIR DALAM:'}</span>
                            </div>

                            {/* Timer Blocks */}
                            <div className="flex items-center gap-1.5 sm:gap-2">
                                {days > 0 && (
                                    <>
                                        <div className="flex flex-col items-center justify-center bg-[#dd4b39] text-white rounded-xl px-2.5 sm:px-3 py-1.5 min-w-[50px] sm:min-w-[56px] shadow-sm border border-red-400/30">
                                            <span className="text-xl sm:text-2xl font-black leading-none">{String(days).padStart(2, '0')}</span>
                                            <span className="text-[9px] font-extrabold tracking-wider mt-0.5 text-white/90">HARI</span>
                                        </div>
                                        <span className="text-white font-black text-lg sm:text-xl pb-3">:</span>
                                    </>
                                )}
                                <div className="flex flex-col items-center justify-center bg-[#dd4b39] text-white rounded-xl px-2.5 sm:px-3 py-1.5 min-w-[50px] sm:min-w-[56px] shadow-sm border border-red-400/30">
                                    <span className="text-xl sm:text-2xl font-black leading-none">{hours}</span>
                                    <span className="text-[9px] font-extrabold tracking-wider mt-0.5 text-white/90">JAM</span>
                                </div>
                                <span className="text-white font-black text-lg sm:text-xl pb-3">:</span>
                                <div className="flex flex-col items-center justify-center bg-[#dd4b39] text-white rounded-xl px-2.5 sm:px-3 py-1.5 min-w-[50px] sm:min-w-[56px] shadow-sm border border-red-400/30">
                                    <span className="text-xl sm:text-2xl font-black leading-none">{minutes}</span>
                                    <span className="text-[9px] font-extrabold tracking-wider mt-0.5 text-white/90">MENIT</span>
                                </div>
                                <span className="text-white font-black text-lg sm:text-xl pb-3">:</span>
                                <div className="flex flex-col items-center justify-center bg-[#dd4b39] text-white rounded-xl px-2.5 sm:px-3 py-1.5 min-w-[50px] sm:min-w-[56px] shadow-sm border border-red-400/30">
                                    <span className="text-xl sm:text-2xl font-black leading-none">{seconds}</span>
                                    <span className="text-[9px] font-extrabold tracking-wider mt-0.5 text-white/90">DETIK</span>
                                </div>
                            </div>

                            <p className="text-[11px] sm:text-xs font-semibold text-amber-300 flex items-center gap-1">
                                <Zap className="w-3 h-3 fill-amber-300 text-amber-300" />
                                <span>{isExpired ? 'Promo flash sale periode ini telah selesai.' : 'Harga kembali normal saat timer mencapai 00:00:00!'}</span>
                            </p>
                        </div>
                    </div>
                </section>

                {/* Products Grid - 2 columns on mobile, 4 columns on desktop */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6 mt-4 sm:mt-8">
                    {products.map((item) => {
                        const linkHref = item.slug ? `/shop/${item.slug}` : `/shop?search=${encodeURIComponent(item.name)}`;
                        const isLiked = !!wishlist[item.id];

                        return (
                            <div key={item.id} className="h-full">
                                {/* Mobile Card: matches shop page mobile 1:1 */}
                                <div className="flex md:hidden flex-col justify-between bg-white rounded-xl overflow-hidden h-full border border-sand-200/80 shadow-xs hover:shadow-md transition-all duration-200">
                                    {/* Top Full-Width Image Container (Edge-to-Edge) */}
                                    <Link href={linkHref} className="block relative aspect-square w-full bg-sand-200/30 overflow-hidden group">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            loading="lazy"
                                            decoding="async"
                                            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                                        />

                                        {/* Top-Left Flash Sale Badge */}
                                        <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold bg-[#e03131] text-white rounded-md shadow-xs">
                                            {item.badge || 'Flash Sale'}
                                        </span>

                                        {/* Top-Right Heart Wishlist Pill */}
                                        <button
                                            type="button"
                                            onClick={(e) => toggleWishlist(item.id, e)}
                                            aria-label={`Tambah ${item.name} ke favorit`}
                                            className={`absolute top-2 right-2 w-7 h-7 rounded-full bg-white/85 backdrop-blur-xs flex items-center justify-center shadow-xs transition-colors cursor-pointer ${
                                                isLiked ? 'text-[#e03131]' : 'text-brand-400'
                                            }`}
                                        >
                                            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-[#e03131] text-[#e03131]' : 'text-brand-400'}`} />
                                        </button>
                                    </Link>

                                    {/* Content Body */}
                                    <div className="p-2.5 sm:p-3 flex flex-col flex-1 justify-between">
                                        <Link href={linkHref} className="block">
                                            {/* Series / Category */}
                                            <span className="block text-[11px] font-semibold text-accent-copper uppercase tracking-wider truncate mb-1">
                                                {item.category || 'Specialty'}
                                            </span>

                                            {/* Product Name (2 Lines Max) */}
                                            <h3 className="text-sm font-bold text-brand-950 line-clamp-2 leading-snug min-h-[2.4rem] group-hover:text-brand-700 transition-colors">
                                                {item.name}
                                            </h3>

                                            {/* Price Area: Strikethrough + Selling Price */}
                                            <div className="mt-1.5 space-y-0.5">
                                                {item.original_price && item.original_price > item.price && (
                                                    <span className="block text-[11px] text-brand-400 line-through leading-none">
                                                        Rp {formatPrice(item.original_price)}
                                                    </span>
                                                )}
                                                <div className="text-[15px] font-black text-brand-950">
                                                    Rp {formatPrice(item.price)}
                                                </div>
                                            </div>
                                        </Link>

                                        {/* Bottom Action: Full-Width + Keranjang Button */}
                                        <div className="pt-2.5 mt-auto">
                                            <Link
                                                href={linkHref}
                                                className="w-full py-2 px-3 rounded-lg bg-brand-700 hover:bg-brand-800 active:bg-brand-900 text-white font-bold text-[12.5px] flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                                            >
                                                <ShoppingBag className="w-4 h-4 stroke-[2.2]" />
                                                <span>+ Keranjang</span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                {/* Desktop Card: Editorial clean layout */}
                                <div className="hidden md:flex flex-col justify-between bg-white rounded-2xl p-5 hover:bg-sand-200/30 transition-colors duration-200 h-full border border-sand-200/80 shadow-xs group">
                                    <Link href={linkHref} className="block">
                                        <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-sand-200/40 mb-4">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                loading="lazy"
                                                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-103"
                                            />
                                            <span className="absolute top-3 left-3 px-3 py-1 text-[13px] font-bold bg-[#e03131] text-white rounded-full shadow-xs">
                                                {item.badge || 'Flash Sale'}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={(e) => toggleWishlist(item.id, e)}
                                                aria-label={`Tambah ${item.name} ke favorit`}
                                                className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-xs transition-colors cursor-pointer ${
                                                    isLiked ? 'text-[#e03131]' : 'text-brand-400 hover:text-[#e03131]'
                                                }`}
                                            >
                                                <Heart className={`w-4 h-4 ${isLiked ? 'fill-[#e03131]' : ''}`} />
                                            </button>
                                        </div>

                                        <div className="space-y-1 mb-4">
                                            <span className="text-xs font-semibold text-accent-copper uppercase tracking-wider">
                                                {item.category || 'Specialty'}
                                            </span>
                                            <h3 className="text-base font-bold text-brand-950 line-clamp-2 group-hover:text-brand-700 transition-colors leading-snug">
                                                {item.name}
                                            </h3>
                                        </div>
                                    </Link>

                                    <div className="flex items-end justify-between pt-3 border-t border-sand-200/80 mt-auto">
                                        <div>
                                            {item.original_price && item.original_price > item.price && (
                                                <span className="block text-xs text-brand-400 line-through">
                                                    Rp {formatPrice(item.original_price)}
                                                </span>
                                            )}
                                            <span className="text-base font-bold text-brand-950">
                                                Rp {formatPrice(item.price)}
                                            </span>
                                        </div>

                                        <Link
                                            href={linkHref}
                                            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand-900 hover:bg-brand-950 text-white text-[13px] font-semibold transition-colors active:scale-95"
                                        >
                                            <ShoppingBag className="w-4 h-4" />
                                            <span>Pilih</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </main>
        </PublicLayout>
    );
}
