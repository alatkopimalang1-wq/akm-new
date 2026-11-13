import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { ShoppingBag, Heart, Plus } from 'lucide-react';
import type { Product } from '@/types/sanubari';
import { formatRupiah } from '@/lib/trans';
import { CoffeeBeanIcon } from '@/components/coffee-bean-icon';

interface ProductCardProps {
    product: Product;
    variant?: 'mobile' | 'desktop' | 'auto';
    className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
    product,
    variant = 'auto',
    className = '',
}) => {
    const primaryVariant = product.variants?.[0] || {
        id: product.id,
        product_id: product.id,
        label: '200 gr',
        weight_grams: 200,
        price: product.min_price || 15000,
        stock_status: 'in_stock' as const,
    };

    const rawImg = product.images?.[0]?.path || primaryVariant?.image_url || primaryVariant?.image;
    const imageUrl = rawImg
        ? (rawImg.startsWith('http://') || rawImg.startsWith('https://')
            ? rawImg
            : `/storage/${rawImg.replace(/^\/?(public\/|storage\/)?/, '')}`)
        : '/brand/logo-akm.png?v=20261113b';
    const isDiscounted = !!primaryVariant.original_price && primaryVariant.original_price > primaryVariant.price;
    const discountPercent = isDiscounted
        ? Math.round(((primaryVariant.original_price! - primaryVariant.price) / primaryVariant.original_price!) * 100)
        : null;

    const isOutOfStock = Boolean(
        product.is_out_of_stock ||
        product.stock_status === 'out_of_stock' ||
        (product.variants && product.variants.length > 0 && product.variants.every((v) => v.stock_status === 'out_of_stock'))
    );

    // Full-Width Mobile Shape matching Otten Coffee reference (Image 2)
    const renderMobileShape = () => (
        <div className={`flex flex-col justify-between rounded-xl overflow-hidden h-full border transition-all duration-200 ${
            isOutOfStock
                ? 'bg-neutral-900/5 border-neutral-300 shadow-xs'
                : 'bg-white border-sand-200/80 shadow-xs hover:shadow-md'
        }`}>
            {/* Top Full-Width Image Container (Edge-to-Edge) */}
            <Link href={`/shop/${product.slug}`} className="block relative aspect-square w-full bg-sand-200/30 overflow-hidden group">
                <img
                    src={imageUrl}
                    alt={product.name}
                    loading="lazy"
                    className={`w-full h-full object-cover transition-transform duration-300 ${
                        isOutOfStock ? 'filter grayscale contrast-125 brightness-50' : 'group-hover:scale-105'
                    }`}
                />

                {/* Dark Overlay with Centered SOLD OUT Label */}
                {isOutOfStock && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex flex-col items-center justify-center p-2 z-10">
                        <span className="px-3 py-1 bg-black/90 text-white font-black text-xs tracking-widest uppercase rounded-md border border-white/30 shadow-md">
                            SOLD OUT
                        </span>
                        <span className="text-[10px] text-white/80 font-medium mt-1">
                            Stok Habis
                        </span>
                    </div>
                )}

                {/* Top-Left Badge (SOLD OUT / Pre-Order / Discount / Flash Sale / Best Seller) */}
                {isOutOfStock ? (
                    <span className="absolute top-2 left-2 z-20 px-2 py-0.5 text-[10px] font-black bg-black text-white rounded-md shadow-xs border border-white/20 tracking-wider">
                        SOLD OUT
                    </span>
                ) : (product.is_preorder || product.stock_status === 'pre_order') ? (
                    <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold bg-amber-600 text-white rounded-md shadow-xs uppercase tracking-wider">
                        Pre-Order
                    </span>
                ) : product.is_flash_sale ? (
                    <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold bg-[#e03131] text-white rounded-md shadow-xs">
                        Flash Sale
                    </span>
                ) : discountPercent ? (
                    <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold bg-[#d97706] text-white rounded-md shadow-xs">
                        Hemat {discountPercent}%
                    </span>
                ) : product.is_new ? (
                    <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-semibold bg-brand-700 text-white rounded-md">
                        Baru
                    </span>
                ) : product.is_featured ? (
                    <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-semibold bg-brand-900 text-white rounded-md">
                        Best Seller
                    </span>
                ) : null}

                {/* Top-Right Heart Wishlist Pill */}
                <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/85 backdrop-blur-xs flex items-center justify-center text-brand-400 shadow-xs z-20">
                    <Heart className="w-3.5 h-3.5 text-brand-400" />
                </div>
            </Link>

            {/* Content Body with Compact Padding */}
            <div className="p-2.5 sm:p-3 flex flex-col flex-1 justify-between">
                <Link href={`/shop/${product.slug}`} className="block">
                    {/* Brand / Series */}
                    <span className={`block text-[11px] font-bold uppercase tracking-wider truncate mb-1 ${
                        isOutOfStock ? 'text-neutral-500' : 'text-accent-copper'
                    }`}>
                        {product.producer || product.series_label || (product.series ? product.series.replace('-', ' ') : 'Alat Kopi Malang')}
                    </span>

                    {/* Product Name (2 Lines Max) */}
                    <h3 className={`text-sm sm:text-base font-bold line-clamp-2 leading-snug min-h-[2.4rem] transition-colors ${
                        isOutOfStock ? 'text-neutral-600 line-through decoration-neutral-400' : 'text-brand-950 group-hover:text-brand-700'
                    }`}>
                        {product.name}
                    </h3>

                    {/* Price Area: Strikethrough + Selling Price */}
                    <div className="mt-1.5 space-y-0.5">
                        {isDiscounted && primaryVariant.original_price && (
                            <span className="block text-[11px] sm:text-xs text-brand-400 line-through leading-none">
                                {formatRupiah(primaryVariant.original_price)}
                            </span>
                        )}
                        <div className={`text-[15px] sm:text-base font-black ${
                            isOutOfStock ? 'text-neutral-500' : 'text-brand-950'
                        }`}>
                            {formatRupiah(primaryVariant.price)}
                        </div>
                    </div>
                </Link>

                {/* Bottom Action: Full-Width + Keranjang Button (or Disabled Sold Out) */}
                <div className="pt-2.5 mt-auto">
                    {isOutOfStock ? (
                        <button
                            type="button"
                            disabled
                            className="w-full py-2 px-3 rounded-lg bg-neutral-800 text-neutral-400 font-bold text-[12.5px] sm:text-xs flex items-center justify-center gap-1.5 cursor-not-allowed opacity-90 shadow-none"
                        >
                            <span className="text-white/70 uppercase tracking-wide text-[11px]">Stok Habis</span>
                        </button>
                    ) : (
                        <Link
                            href={`/shop/${product.slug}`}
                            className="w-full py-2 px-3 rounded-lg bg-brand-700 hover:bg-brand-800 active:bg-brand-900 text-white font-bold text-[12.5px] sm:text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                        >
                            <ShoppingBag className="w-4 h-4 stroke-[2.2]" />
                            <span>+ Keranjang</span>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );

    // Desktop Editorial Shape (No slop, no rest shadows, clean typography)
    const renderDesktopShape = () => (
        <div className={`flex flex-col justify-between rounded-2xl p-5 transition-colors duration-200 h-full ${
            isOutOfStock ? 'bg-neutral-900/5' : 'bg-white hover:bg-sand-200/30'
        }`}>
            <Link href={`/shop/${product.slug}`} className="block">
                <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-sand-200/40 mb-4">
                    <img
                        src={imageUrl}
                        alt={product.name}
                        loading="lazy"
                        className={`w-full h-full object-cover transition-transform duration-300 ${
                            isOutOfStock ? 'filter grayscale contrast-125 brightness-50' : 'group-hover:scale-103'
                        }`}
                    />

                    {/* Dark Overlay with Centered SOLD OUT Label */}
                    {isOutOfStock && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex flex-col items-center justify-center p-3 z-10">
                            <span className="px-4 py-1.5 bg-black/90 text-white font-black text-sm tracking-widest uppercase rounded-lg border border-white/30 shadow-xl">
                                SOLD OUT
                            </span>
                            <span className="text-xs text-white/80 font-medium mt-1">
                                Stok Habis
                            </span>
                        </div>
                    )}

                    {isOutOfStock ? (
                        <span className="absolute top-3 left-3 z-20 px-3 py-1 text-[12px] font-black bg-black text-white rounded-full shadow-xs border border-white/20 tracking-wider">
                            SOLD OUT
                        </span>
                    ) : (product.is_preorder || product.stock_status === 'pre_order') ? (
                        <span className="absolute top-3 left-3 px-3 py-1 text-[12px] font-bold bg-amber-600 text-white rounded-full shadow-xs uppercase tracking-wider">
                            Pre-Order
                        </span>
                    ) : product.is_flash_sale ? (
                        <span className="absolute top-3 left-3 px-3 py-1 text-[13px] font-bold bg-[#e03131] text-white rounded-full shadow-xs">
                            Flash Sale
                        </span>
                    ) : product.is_featured ? (
                        <span className="absolute top-3 left-3 px-3 py-1 text-[13px] font-semibold bg-brand-900 text-white rounded-full">
                            Best Seller
                        </span>
                    ) : null}
                </div>

                <div className={`text-[12px] font-bold uppercase tracking-wider mb-1.5 ${
                    isOutOfStock ? 'text-neutral-500' : 'text-accent-copper'
                }`}>
                    <span>{product.producer || product.series_label || product.series?.replace('-', ' ') || 'Alat Kopi Malang'}</span>
                </div>

                <h3 className={`text-base font-bold line-clamp-2 leading-snug mb-2 transition-colors ${
                    isOutOfStock ? 'text-neutral-600 line-through decoration-neutral-400' : 'text-brand-950 group-hover:text-brand-700'
                }`}>
                    {product.name}
                </h3>
            </Link>

            <div className="pt-3 flex items-center justify-between mt-auto">
                <div>
                    <span className={`block text-[13px] ${isOutOfStock ? 'text-neutral-400' : 'text-brand-700'}`}>Mulai</span>
                    <span className={`text-base font-bold ${isOutOfStock ? 'text-neutral-500' : 'text-brand-950'}`}>
                        {formatRupiah(primaryVariant.price)}
                    </span>
                </div>

                {isOutOfStock ? (
                    <button
                        type="button"
                        disabled
                        className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-neutral-800 text-neutral-400 text-[13px] font-semibold cursor-not-allowed opacity-90 shadow-none"
                    >
                        <span className="text-white/70">Habis</span>
                    </button>
                ) : (
                    <Link
                        href={`/shop/${product.slug}`}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand-900 hover:bg-brand-950 text-white text-[13px] font-semibold transition-colors active:scale-95"
                    >
                        <ShoppingBag className="w-4 h-4" />
                        <span>Pilih</span>
                    </Link>
                )}
            </div>
        </div>
    );

    if (variant === 'mobile') {
        return <div className={`group h-full ${className}`}>{renderMobileShape()}</div>;
    }
    if (variant === 'desktop') {
        return <div className={`group h-full ${className}`}>{renderDesktopShape()}</div>;
    }

    return (
        <div className={`group h-full ${className}`}>
            <div className="md:hidden h-full">{renderMobileShape()}</div>
            <div className="hidden md:block h-full">{renderDesktopShape()}</div>
        </div>
    );
};
