import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Clock,
    Coffee,
    Droplet,
    Flame,
    Heart,
    Info,
    MapPin,
    Minus,
    Mountain,
    Package,
    Plus,
    Share2,
    ShoppingBag,
    Star,
    Truck,
} from 'lucide-react';
import { PublicLayout } from '@/layouts/public-layout';
import type { Product, ProductVariant } from '@/types/sanubari';
import { formatRupiah } from '@/lib/trans';
import { useCart } from '@/context/cart-context';
import { ProductCard } from '@/components/product-card';
import { getProductContentId, trackViewContent } from '@/lib/meta-pixel';
import { ImageZoom } from '@animate-ui/react/primitives/effects/image-zoom';
import { SlidingNumber } from '@animate-ui/react/primitives/texts/sliding-number';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface ProductShowProps {
    product: Product;
    relatedProducts: Product[];
    marketplaceDefaults?: {
        tokopedia?: string;
        shopee?: string;
    };
}

function TokopediaIcon({ className = 'w-5 h-5' }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
            <path
                d="M5 8.5C5 7.67 5.67 7 6.5 7h11c.83 0 1.5.67 1.5 1.5V18c0 1.66-1.34 3-3 3H8c-1.66 0-3-1.34-3-3V8.5z"
                fill="#03AC0E"
            />
            <path
                d="M9 7V5.5C9 3.84 10.34 2.5 12 2.5s3 1.34 3 2.5V7"
                stroke="#03AC0E"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <circle cx="9.5" cy="13" r="2.2" fill="white" />
            <circle cx="9.5" cy="13" r="1.1" fill="#03AC0E" />
            <circle cx="14.5" cy="13" r="2.2" fill="white" />
            <circle cx="14.5" cy="13" r="1.1" fill="#03AC0E" />
            <path
                d="M10.8 16.2c.7.4 1.7.4 2.4 0"
                stroke="white"
                strokeWidth="1.2"
                strokeLinecap="round"
            />
        </svg>
    );
}

function ShopeeIcon({ className = 'w-5 h-5' }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
            <path
                d="M5 8.5C5 7.67 5.67 7 6.5 7h11c.83 0 1.5.67 1.5 1.5V18c0 1.66-1.34 3-3 3H8c-1.66 0-3-1.34-3-3V8.5z"
                fill="#EE4D2D"
            />
            <path
                d="M9 7V5.5C9 3.84 10.34 2.5 12 2.5s3 1.34 3 2.5V7"
                stroke="#EE4D2D"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <path
                d="M13.6 11.2c-.2-.4-.6-.7-1.3-.8-.8-.1-1.4.2-1.4.7 0 .4.4.6 1 .8l.5.2c1.1.3 1.6.8 1.6 1.7 0 1.1-.9 1.9-2.3 1.9-1.3 0-2.1-.7-2.3-1.6l1.2-.3c.1.5.5.8 1.1.8.6 0 1-.3 1-.7 0-.3-.3-.6-.9-.7l-.5-.2c-1-.3-1.5-.8-1.5-1.6 0-1.1.9-1.8 2.1-1.8 1.1 0 1.8.5 2.1 1.3l-1.1.4z"
                fill="white"
            />
        </svg>
    );
}

const resolveImageUrl = (path: string | undefined | null) => {
    if (!path) return '/brand/logo-circle.png';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    const clean = path.replace(/^\/?(public\/|storage\/)?/, '');
    return `/storage/${clean}`;
};

export default function ProductShow({
    product,
    relatedProducts = [],
    marketplaceDefaults,
}: ProductShowProps) {
    const { addItem } = useCart();

    const variants = product.variants && product.variants.length > 0
        ? product.variants
        : [
              {
                  id: product.id,
                  product_id: product.id,
                  label: '200 gr',
                  weight_grams: 200,
                  price: product.min_price || 45000,
                  stock_status: 'in_stock' as const,
              },
          ];

    const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(variants[0]);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [grindOption, setGrindOption] = useState('Biji Utuh (Whole Bean)');

    // Track Meta Pixel ViewContent
    useEffect(() => {
        try {
            const contentId = getProductContentId(product, selectedVariant);
            trackViewContent({
                content_ids: [contentId],
                content_type: 'product',
                value: Number(selectedVariant?.price || product.min_price || 0),
                currency: 'IDR',
                content_name: product.name,
                content_category: product.series || 'Coffee',
            });
        } catch (e) {
            console.error('Meta Pixel ViewContent error', e);
        }
    }, [product.id, selectedVariant.id]);

    // Combined unified gallery: Product images + all Variant packaging images
    const combinedImages = useMemo(() => {
        const list: {
            url: string;
            alt: string;
            isVariant: boolean;
            variantId?: number;
            variantLabel?: string;
        }[] = [];
        const seen = new Set<string>();

        // 1. Add product gallery images
        if (product.images && product.images.length > 0) {
            for (const img of product.images) {
                const resolved = resolveImageUrl(img.path);
                if (!seen.has(resolved)) {
                    seen.add(resolved);
                    list.push({
                        url: resolved,
                        alt: img.alt || product.name,
                        isVariant: false,
                    });
                }
            }
        }

        // 2. Combine all variant packaging photos
        if (variants && variants.length > 0) {
            for (const v of variants) {
                const vUrl = v.image_url || (v.image ? resolveImageUrl(v.image) : null);
                if (vUrl && !seen.has(vUrl)) {
                    seen.add(vUrl);
                    list.push({
                        url: vUrl,
                        alt: `Kemasan ${v.label} - ${product.name}`,
                        isVariant: true,
                        variantId: v.id,
                        variantLabel: v.label,
                    });
                }
            }
        }

        if (list.length === 0) {
            list.push({
                url: '/brand/logo-circle.png',
                alt: product.name,
                isVariant: false,
            });
        }

        return list;
    }, [product.images, product.name, variants]);

    const activeImageItem = combinedImages[selectedImage] || combinedImages[0];

    const mobileScrollRef = useRef<HTMLDivElement>(null);

    const scrollToMobileImage = (idx: number) => {
        setSelectedImage(idx);
        if (mobileScrollRef.current) {
            const container = mobileScrollRef.current;
            container.scrollTo({
                left: idx * container.clientWidth,
                behavior: 'smooth',
            });
        }
    };

    const handleMobileScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.currentTarget;
        if (target.clientWidth > 0) {
            const index = Math.round(target.scrollLeft / target.clientWidth);
            if (index !== selectedImage && index >= 0 && index < combinedImages.length) {
                setSelectedImage(index);
                const img = combinedImages[index];
                if (img?.isVariant && img.variantId) {
                    const match = variants.find((v) => v.id === img.variantId);
                    if (match) setSelectedVariant(match);
                }
            }
        }
    };

    const nextMobileImage = () => {
        const nextIdx = (selectedImage + 1) % combinedImages.length;
        scrollToMobileImage(nextIdx);
    };

    const prevMobileImage = () => {
        const prevIdx = (selectedImage - 1 + combinedImages.length) % combinedImages.length;
        scrollToMobileImage(prevIdx);
    };

    const grindOptions = [
        'Biji Utuh (Whole Bean)',
        'Giling Kasar (Cold Brew, French Press)',
        'Giling Sedang (V60, Kalita, Aeropress)',
        'Giling Halus (Espresso, Moka Pot)',
        'Giling Sangat Halus (Tubruk Tradisional)',
    ];

    const isDiscounted = !!selectedVariant.original_price && selectedVariant.original_price > selectedVariant.price;
    const discountPercent = isDiscounted
        ? Math.round(((selectedVariant.original_price! - selectedVariant.price) / selectedVariant.original_price!) * 100)
        : null;

    const [isAdded, setIsAdded] = useState(false);

    const isProductOutOfStock = Boolean(
        product.is_out_of_stock ||
        product.stock_status === 'out_of_stock' ||
        (variants.length > 0 && variants.every((v) => v.stock_status === 'out_of_stock'))
    );
    const isCurrentVariantOutOfStock = isProductOutOfStock || selectedVariant.stock_status === 'out_of_stock';

    const handleAddToCart = () => {
        if (isCurrentVariantOutOfStock) return;
        addItem(product, selectedVariant, quantity, grindOption);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 1400);
    };

    const waDirectUrl = isCurrentVariantOutOfStock
        ? `https://wa.me/6285121930454?text=${encodeURIComponent(
            `Halo Alat Kopi Malang! Saya ingin menanyakan ketersediaan restock produk:\n*${product.name}*\nUkuran: ${selectedVariant.label}\n\nMohon info estimasi ready stock kembali. Terima kasih!`
        )}`
        : `https://wa.me/6285121930454?text=${encodeURIComponent(
            `Halo Alat Kopi Malang! Saya ingin memesan langsung:\n*${product.name}*\nUkuran: ${selectedVariant.label}\nGilingan: ${grindOption}\nJumlah: ${quantity}x (${formatRupiah(selectedVariant.price * quantity)})\n\nMohon info ketersediaan stok & ongkir ke alamat saya. Terima kasih!`
        )}`;

    const tokopediaUrl =
        product.tokopedia_url ||
        marketplaceDefaults?.tokopedia ||
        'https://www.tokopedia.com/alatkopimalang';
    const shopeeUrl =
        product.shopee_url ||
        marketplaceDefaults?.shopee ||
        'https://shopee.co.id/alatkopimalang';

    return (
        <PublicLayout title={product.name}>
            <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6 sm:space-y-8">
                {/* Back Link */}
                <div className="hidden sm:block">
                    <Link href="/shop" className="inline-flex items-center gap-1.5 text-xs text-brand-500 hover:text-brand-900 transition-colors">
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Kembali ke Katalog</span>
                    </Link>
                </div>

                {/* Main Product Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* Left Column: Image Gallery (5 cols) */}
                    <div className="lg:col-span-6 space-y-4">
                        {/* Mobile Image Slider (< sm) */}
                        <div className="sm:hidden relative w-full aspect-square rounded-2xl overflow-hidden bg-white border border-sand-200 shadow-sm">
                            <div
                                ref={mobileScrollRef}
                                onScroll={handleMobileScroll}
                                className="flex w-full h-full overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth"
                            >
                                {combinedImages.map((imgItem, idx) => (
                                    <div
                                        key={idx}
                                        className="w-full h-full flex-shrink-0 snap-center relative"
                                    >
                                        <img
                                            src={imgItem.url}
                                            alt={imgItem.alt || product.name}
                                            className={`w-full h-full object-cover ${isProductOutOfStock ? 'filter grayscale contrast-125 brightness-50' : ''}`}
                                        />
                                        {isProductOutOfStock && (
                                            <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex flex-col items-center justify-center p-3 z-10 pointer-events-none">
                                                <span className="px-4 py-1.5 bg-black/90 text-white font-black text-sm tracking-widest uppercase rounded-lg border border-white/40 shadow-xl">
                                                    SOLD OUT
                                                </span>
                                                <span className="text-xs text-white/80 font-medium mt-1">
                                                    Stok Habis
                                                </span>
                                            </div>
                                        )}
                                        {imgItem.isVariant && (
                                            <span className="absolute bottom-4 left-4 px-3 py-1 bg-brand-950/80 backdrop-blur-md text-white text-[11px] font-semibold rounded-lg shadow-sm flex items-center gap-1.5 pointer-events-none">
                                                <Package className="w-3.5 h-3.5 text-accent-copper" />
                                                Kemasan {imgItem.variantLabel || selectedVariant.label}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Flash Sale / Discount / SOLD OUT Badge */}
                            {isProductOutOfStock ? (
                                <span className="absolute top-4 left-4 z-20 px-3 py-1 bg-black text-white text-xs font-black rounded-lg uppercase tracking-wider shadow-sm border border-white/20 pointer-events-none">
                                    SOLD OUT
                                </span>
                            ) : product.is_flash_sale ? (
                                <span className="absolute top-4 left-4 px-3 py-1 bg-[#e03131] text-white text-xs font-bold rounded-lg uppercase tracking-wider shadow-sm pointer-events-none">
                                    Flash Sale
                                </span>
                            ) : discountPercent ? (
                                <span className="absolute top-4 left-4 px-3 py-1 bg-accent-copper text-white text-xs font-bold rounded-lg uppercase tracking-wider shadow-sm pointer-events-none">
                                    Hemat {discountPercent}%
                                </span>
                            ) : null}

                            {/* Floating Prev/Next Buttons for Mobile */}
                            {combinedImages.length > 1 && (
                                <>
                                    <button
                                        type="button"
                                        onClick={prevMobileImage}
                                        aria-label="Gambar sebelumnya"
                                        className="absolute left-2.5 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/90 text-brand-950 shadow-md backdrop-blur-xs flex items-center justify-center transition active:scale-90"
                                    >
                                        <ChevronLeft className="w-4 h-4 text-brand-900" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={nextMobileImage}
                                        aria-label="Gambar berikutnya"
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/90 text-brand-950 shadow-md backdrop-blur-xs flex items-center justify-center transition active:scale-90"
                                    >
                                        <ChevronRight className="w-4 h-4 text-brand-900" />
                                    </button>

                                    {/* Slide Counter Pill */}
                                    <div className="absolute bottom-3 right-3 z-10 px-2.5 py-1 rounded-full bg-brand-950/75 backdrop-blur-md text-white text-[11px] font-semibold tabular-nums pointer-events-none shadow-xs">
                                        {selectedImage + 1} / {combinedImages.length}
                                    </div>

                                    {/* Dot Indicators */}
                                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 pointer-events-none">
                                        {combinedImages.map((_, idx) => (
                                            <span
                                                key={idx}
                                                className={`h-1.5 rounded-full transition-all duration-300 ${
                                                    selectedImage === idx
                                                        ? 'w-5 bg-accent-copper'
                                                        : 'w-1.5 bg-white/70 shadow-xs'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Desktop Image View (>= sm) */}
                        <div className="hidden sm:block space-y-4">
                            {/* Main Image with Animate UI ImageZoom */}
                            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white border border-sand-200 shadow-sm">
                                <ImageZoom zoomScale={1.6} zoomOnHover className="w-full h-full">
                                    <img
                                        src={activeImageItem.url}
                                        alt={activeImageItem.alt || product.name}
                                        className={`w-full h-full object-cover ${isProductOutOfStock ? 'filter grayscale contrast-125 brightness-50' : ''}`}
                                    />
                                </ImageZoom>
                                {isProductOutOfStock && (
                                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex flex-col items-center justify-center p-4 z-10 pointer-events-none">
                                        <span className="px-5 py-2 bg-black/90 text-white font-black text-base tracking-widest uppercase rounded-lg border border-white/40 shadow-xl">
                                            SOLD OUT
                                        </span>
                                        <span className="text-xs sm:text-sm text-white/80 font-medium mt-1.5">
                                            Stok Habis
                                        </span>
                                    </div>
                                )}
                                {isProductOutOfStock ? (
                                    <span className="absolute top-4 left-4 z-20 px-3 py-1 bg-black text-white text-xs font-black rounded-lg uppercase tracking-wider shadow-sm border border-white/20 pointer-events-none">
                                        SOLD OUT
                                    </span>
                                ) : product.is_flash_sale ? (
                                    <span className="absolute top-4 left-4 px-3 py-1 bg-[#e03131] text-white text-xs font-bold rounded-lg uppercase tracking-wider shadow-sm pointer-events-none">
                                        Flash Sale
                                    </span>
                                ) : discountPercent ? (
                                    <span className="absolute top-4 left-4 px-3 py-1 bg-accent-copper text-white text-xs font-bold rounded-lg uppercase tracking-wider shadow-sm pointer-events-none">
                                        Hemat {discountPercent}%
                                    </span>
                                ) : null}
                                {activeImageItem.isVariant && (
                                    <span className="absolute bottom-4 left-4 px-3 py-1 bg-brand-950/80 backdrop-blur-md text-white text-[11px] font-semibold rounded-lg shadow-sm flex items-center gap-1.5 pointer-events-none">
                                        <Package className="w-3.5 h-3.5 text-accent-copper" />
                                        Kemasan {activeImageItem.variantLabel || selectedVariant.label}
                                    </span>
                                )}
                            </div>

                            {/* Thumbnails (Desktop Only) */}
                            {combinedImages.length > 1 && (
                                <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
                                    {combinedImages.map((imgItem, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => {
                                                setSelectedImage(idx);
                                                if (imgItem.isVariant && imgItem.variantId) {
                                                    const match = variants.find((v) => v.id === imgItem.variantId);
                                                    if (match) setSelectedVariant(match);
                                                }
                                            }}
                                            className={`relative w-18 h-18 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all cursor-pointer ${
                                                selectedImage === idx
                                                    ? 'border-brand-700 shadow-md scale-102 ring-2 ring-brand-700/30'
                                                    : 'border-sand-200/80 hover:border-brand-400 opacity-70 hover:opacity-100'
                                            }`}
                                        >
                                            <img src={imgItem.url} alt={imgItem.alt} className="w-full h-full object-cover" />
                                            {imgItem.isVariant && (
                                                <span className="absolute bottom-0 inset-x-0 bg-brand-950/80 text-[9px] text-white font-medium text-center py-0.5 truncate px-1">
                                                    {imgItem.variantLabel}
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Product Info & Purchase Options (7 cols) */}
                    <div className="lg:col-span-6 space-y-6">
                        <div>
                            {/* Brand & Stock Status Badges (Side by Side on Mobile, Tablet, and Desktop) */}
                            {((product.producer || product.series_label || product.series) || isProductOutOfStock || product.is_preorder || product.stock_status === 'pre_order') && (
                                <div className="mb-2.5 flex flex-wrap items-center gap-2">
                                    {(product.producer || product.series_label || product.series) && (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-accent-copper/10 border border-accent-copper/25 text-accent-copper text-xs font-extrabold uppercase tracking-wider">
                                            {product.producer || product.series_label || product.series}
                                        </span>
                                    )}

                                    {isProductOutOfStock ? (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-black text-white rounded-full text-xs font-black uppercase tracking-widest border border-white/20 shadow-xs">
                                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                            <span>STOK HABIS (SOLD OUT)</span>
                                        </span>
                                    ) : (product.is_preorder || product.stock_status === 'pre_order') ? (
                                        <Link
                                            href="/syarat-ketentuan-pre-order"
                                            title="Lihat Syarat & Ketentuan Pre-Order"
                                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-full text-xs font-black uppercase tracking-widest shadow-xs transition-colors"
                                        >
                                            <span className="w-2 h-2 rounded-full bg-amber-200 animate-pulse" />
                                            <span>PRE-ORDER</span>
                                        </Link>
                                    ) : null}
                                </div>
                            )}
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-950 tracking-tight leading-tight">
                                {product.name}
                            </h1>
                        </div>

                        {/* Price Display */}
                        <div className="space-y-1">
                            {isDiscounted && (
                                <span className="block text-sm sm:text-sm md:text-base text-gray-400 line-through font-medium">
                                    {formatRupiah(selectedVariant.original_price!)}
                                </span>
                            )}
                            <div className="flex items-baseline gap-2">
                                <span className={`text-3xl sm:text-3xl md:text-4xl font-black tracking-tight ${
                                    isCurrentVariantOutOfStock ? 'text-neutral-500' : 'text-brand-950'
                                }`}>
                                    {formatRupiah(selectedVariant.price)}
                                </span>
                            </div>
                        </div>

                        {/* Variant Selection */}
                        <div className="space-y-2">
                            <label className="block text-sm sm:text-sm md:text-base font-bold uppercase tracking-wider text-brand-800">
                                Pilih Warna / Ukuran:
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {variants.map((v) => {
                                    const active = selectedVariant.id === v.id;
                                    const vOutOfStock = isProductOutOfStock || v.stock_status === 'out_of_stock';
                                    const vImage = v.image_url || (v.image ? resolveImageUrl(v.image) : null);
                                    return (
                                        <button
                                            key={v.id}
                                            type="button"
                                            onClick={() => {
                                                setSelectedVariant(v);
                                                const targetIdx = combinedImages.findIndex(
                                                    (img) => img.isVariant && img.variantId === v.id
                                                );
                                                if (targetIdx !== -1) {
                                                    scrollToMobileImage(targetIdx);
                                                }
                                            }}
                                            className={`inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm sm:text-sm md:text-base font-bold transition-all cursor-pointer ${
                                                active
                                                    ? 'bg-brand-700 text-white shadow-sm ring-2 ring-brand-700'
                                                    : 'bg-white hover:bg-cream-100 text-brand-800 border border-sand-200'
                                            } ${vOutOfStock ? 'opacity-60 line-through decoration-neutral-500' : ''}`}
                                        >
                                            {vImage && (
                                                <img
                                                    src={vImage}
                                                    alt={v.label}
                                                    className="w-5 h-5 rounded-md object-cover border border-sand-300 flex-shrink-0"
                                                />
                                            )}
                                            <span>{v.label} {vOutOfStock ? '(Habis)' : ''}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Grind Size Selection (Only if roast_level is specified) */}
                        {product.roast_level && (
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="block text-sm sm:text-sm md:text-base font-bold uppercase tracking-wider text-brand-800">
                                        Pilihan Gilingan:
                                    </label>
                                    <span className="text-xs sm:text-xs md:text-sm text-accent-copper font-medium">
                                        Gratis giling sesuai metode seduh
                                    </span>
                                </div>
                                <Select value={grindOption} onValueChange={setGrindOption}>
                                    <SelectTrigger className="w-full py-2.5 px-3.5 h-auto rounded-xl bg-white border border-sand-200 text-sm sm:text-sm md:text-base font-semibold text-brand-950 focus:outline-hidden focus:border-brand-700 shadow-xs flex justify-between items-center cursor-pointer">
                                        <SelectValue placeholder="Pilih tingkat gilingan" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white border border-sand-200 rounded-xl shadow-xl z-50 p-1.5">
                                        {grindOptions.map((opt) => (
                                            <SelectItem
                                                key={opt}
                                                value={opt}
                                                className="text-sm sm:text-sm md:text-base font-medium py-2.5 px-3 rounded-lg cursor-pointer bg-transparent hover:bg-transparent focus:bg-transparent data-[highlighted]:bg-transparent text-brand-900 hover:text-accent-copper focus:text-accent-copper data-[highlighted]:text-accent-copper data-[state=checked]:font-bold data-[state=checked]:text-brand-950 transition-colors"
                                            >
                                                {opt}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {/* Quantity Stepper & Add to Cart */}
                        <div className="space-y-3 pt-2">
                            <div className="flex items-center gap-2.5 sm:gap-3">
                                {/* Stepper */}
                                <div className={`flex items-center border border-sand-200 rounded-xl bg-white p-1 h-12 sm:h-auto ${
                                    isCurrentVariantOutOfStock ? 'opacity-50 pointer-events-none' : ''
                                }`}>
                                    <button
                                        type="button"
                                        disabled={isCurrentVariantOutOfStock}
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-9 h-full sm:w-8 sm:h-8 flex items-center justify-center rounded-lg hover:bg-sand-100 text-brand-800 transition-colors disabled:cursor-not-allowed"
                                    >
                                        <Minus className="w-3.5 h-3.5" />
                                    </button>
                                    <span className="w-9 sm:w-10 text-center font-bold text-sm text-brand-950 flex items-center justify-center">
                                        <SlidingNumber number={quantity} />
                                    </span>
                                    <button
                                        type="button"
                                        disabled={isCurrentVariantOutOfStock}
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-9 h-full sm:w-8 sm:h-8 flex items-center justify-center rounded-lg hover:bg-sand-100 text-brand-800 transition-colors disabled:cursor-not-allowed"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                    </button>
                                </div>

                                {/* Add to Cart with Animate UI Status Button pattern */}
                                {isCurrentVariantOutOfStock ? (
                                    <button
                                        type="button"
                                        disabled
                                        className="flex-1 h-12 sm:h-auto flex items-center justify-center gap-1.5 sm:gap-2 py-3 px-4 sm:py-3 sm:px-6 rounded-xl font-bold text-xs uppercase tracking-wider bg-neutral-800 text-neutral-400 cursor-not-allowed opacity-90 shadow-none"
                                    >
                                        <ShoppingBag className="w-4 h-4 opacity-50" />
                                        <span>Stok Habis (Sold Out)</span>
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleAddToCart}
                                        className={`flex-1 h-12 sm:h-auto flex items-center justify-center gap-1.5 sm:gap-2 py-3 px-4 sm:py-3 sm:px-6 rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm transition-all duration-150 active:scale-[0.98] ${
                                            isAdded
                                                ? 'bg-emerald-700 text-white'
                                                : 'bg-brand-700 hover:bg-brand-800 active:bg-brand-900 text-white'
                                        }`}
                                    >
                                        {isAdded ? (
                                            <>
                                                <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                                                <span>Berhasil Ditambahkan!</span>
                                            </>
                                        ) : (
                                            <>
                                                <ShoppingBag className="w-4 h-4" />
                                                <span className="text-xs font-extrabold whitespace-nowrap tracking-wide">
                                                    Tambah ke Keranjang
                                                </span>
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>

                            {/* Direct WhatsApp Instant Buy / Restock Inquiry */}
                            <a
                                href={waDirectUrl}
                                target="_blank"
                                rel="noreferrer"
                                className={`w-full h-12 sm:h-auto flex items-center justify-center gap-2 py-3 px-4 sm:py-3 sm:px-6 rounded-xl border font-bold text-xs uppercase tracking-wider transition-all ${
                                    isCurrentVariantOutOfStock
                                        ? 'bg-sand-100 hover:bg-sand-200 border-sand-300 text-brand-800'
                                        : 'bg-white hover:bg-cream-100 border-brand-700 text-brand-700'
                                }`}
                            >
                                <span>{isCurrentVariantOutOfStock ? 'Tanyakan Restock via WhatsApp' : 'Pesan Langsung via WhatsApp'}</span>
                            </a>
                        </div>

                        {/* Description Text */}
                        {product.description && (
                            <div className="pt-5 border-t border-sand-200 space-y-2.5">
                                <h3 className="text-sm sm:text-sm md:text-base font-bold uppercase tracking-wider text-accent-copper">
                                    Deskripsi & Spesifikasi Produk
                                </h3>
                                <p className="text-sm sm:text-base md:text-base text-brand-800 leading-relaxed sm:leading-7 md:leading-relaxed whitespace-pre-line font-normal">
                                    {typeof product.description === 'string'
                                        ? product.description
                                        : (product.description as any)?.id || ''}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Products Section */}
                {relatedProducts.length > 0 && (
                    <div className="pt-16 border-t border-sand-200 space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-extrabold text-brand-950">
                                    Produk Terkait Lainnya
                                </h2>
                                <p className="text-xs text-brand-500">
                                    Eksplorasi produk pilihan lainnya dari katalog Alat Kopi Malang
                                </p>
                            </div>
                            <Link href="/shop" className="text-xs font-bold text-accent-copper hover:underline">
                                Lihat Semua
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-6">
                            {relatedProducts.map((p) => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
