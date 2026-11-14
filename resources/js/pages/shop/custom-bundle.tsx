import React, { useMemo, useState } from 'react';
import { Link } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeft,
    Check,
    CheckCircle2,
    Gift,
    Layers,
    MessageCircle,
    Minus,
    PackageCheck,
    Plus,
    Search,
    ShoppingBag,
    Sparkles,
    Tag,
    Trash2,
} from 'lucide-react';
import { PublicLayout } from '@/layouts/public-layout';
import { Product, ProductVariant, useCart } from '@/context/cart-context';
import { formatRupiah } from '@/lib/trans';

interface CategoryItem {
    id: number;
    name: string;
    slug: string;
    icon?: string | null;
}

interface DiscountTier {
    min_items: number | string;
    discount_type: 'percentage' | 'fixed';
    discount_value: number | string;
    label: string;
}

interface BundleSettings {
    is_active: boolean;
    badge_text: string;
    title: string;
    subtitle: string;
    whatsapp_number: string;
    required_section_title: string;
    required_section_desc: string;
    min_required_items: number | string;
    required_category_ids: (number | string)[];
    required_product_ids: (number | string)[];
    optional_section_title: string;
    optional_section_desc: string;
    optional_category_ids: (number | string)[];
    optional_product_ids: (number | string)[];
    discount_tiers: DiscountTier[];
}

interface ExtendedProduct extends Product {
    categories?: {
        id: number;
        name: string | Record<string, string>;
        slug: string;
        parent_id?: number | null;
    }[];
}

interface SelectedBundleItem {
    product: ExtendedProduct;
    variant: ProductVariant;
    quantity: number;
    role: 'required' | 'optional';
}

interface CustomBundlePageProps {
    bundleSettings: BundleSettings;
    products: ExtendedProduct[];
    categories: CategoryItem[];
    byobProduct: Product;
    byobVariant: ProductVariant;
    bundleProducts?: ExtendedProduct[];
}

function getProductImageUrl(product: ExtendedProduct, variant?: ProductVariant): string {
    const raw =
        variant?.image_url ||
        variant?.image ||
        product.images?.find((img) => img.is_primary)?.path ||
        product.images?.[0]?.path;

    if (!raw) {
        return '/brand/logo-akm.png?v=20261113b';
    }
    if (raw.startsWith('http://') || raw.startsWith('https://')) {
        return raw;
    }
    return `/storage/${raw.replace(/^\/?(public\/|storage\/)?/, '')}`;
}

export default function CustomBundlePage({
    bundleSettings,
    products,
    categories,
    byobProduct,
    byobVariant,
    bundleProducts = [],
}: CustomBundlePageProps) {
    const { addItem } = useCart();

    const [selectedItems, setSelectedItems] = useState<Record<string, SelectedBundleItem>>({});
    const [selectedVariants, setSelectedVariants] = useState<Record<number, number>>({});
    const [activeRequiredCategory, setActiveRequiredCategory] = useState<number | 'all'>('all');
    const [activeOptionalCategory, setActiveOptionalCategory] = useState<number | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const minRequiredItems = Math.max(0, Number(bundleSettings.min_required_items ?? 1));

    // Normalize discount tiers sorted by min_items ascending
    const sortedTiers = useMemo(() => {
        const tiers = Array.isArray(bundleSettings.discount_tiers) ? bundleSettings.discount_tiers : [];
        return [...tiers]
            .map((t) => ({
                min_items: Number(t.min_items) || 1,
                discount_type: t.discount_type || 'percentage',
                discount_value: Number(t.discount_value) || 0,
                label: t.label || `Diskon Min. ${t.min_items} Produk`,
            }))
            .sort((a, b) => a.min_items - b.min_items);
    }, [bundleSettings.discount_tiers]);

    // Determine Required Products pool
    const requiredProducts = useMemo(() => {
        const reqProdIds = (bundleSettings.required_product_ids || []).map((id) => Number(id));
        const reqCatIds = (bundleSettings.required_category_ids || []).map((id) => Number(id));

        if (reqProdIds.length === 0 && reqCatIds.length === 0) {
            // Default: featured products or first 8 catalog products
            const featured = products.filter((p) => p.is_featured);
            return featured.length > 0 ? featured : products.slice(0, 8);
        }

        return products.filter((p) => {
            const matchProd = reqProdIds.includes(Number(p.id));
            const matchCat =
                reqCatIds.length > 0 &&
                p.categories?.some(
                    (c) => reqCatIds.includes(Number(c.id)) || (c.parent_id && reqCatIds.includes(Number(c.parent_id))),
                );
            return matchProd || matchCat;
        });
    }, [products, bundleSettings.required_product_ids, bundleSettings.required_category_ids]);

    // Categories available in Required section
    const requiredCategories = useMemo(() => {
        const catIdsInReq = new Set<number>();
        requiredProducts.forEach((p) => {
            p.categories?.forEach((c) => {
                catIdsInReq.add(Number(c.parent_id || c.id));
            });
        });
        return categories.filter((c) => catIdsInReq.has(Number(c.id)));
    }, [requiredProducts, categories]);

    const filteredRequiredProducts = useMemo(() => {
        if (activeRequiredCategory === 'all') return requiredProducts;
        return requiredProducts.filter((p) =>
            p.categories?.some(
                (c) => Number(c.id) === activeRequiredCategory || Number(c.parent_id) === activeRequiredCategory,
            ),
        );
    }, [requiredProducts, activeRequiredCategory]);

    // Determine Optional Products pool & Categories
    const optionalCategories = useMemo(() => {
        const optCatIds = (bundleSettings.optional_category_ids || []).map((id) => Number(id));
        if (optCatIds.length === 0) {
            return categories;
        }
        return categories.filter((c) => optCatIds.includes(Number(c.id)));
    }, [categories, bundleSettings.optional_category_ids]);

    const optionalProducts = useMemo(() => {
        const optProdIds = (bundleSettings.optional_product_ids || []).map((id) => Number(id));
        const optCatIds = (bundleSettings.optional_category_ids || []).map((id) => Number(id));

        return products.filter((p) => {
            if (optProdIds.length > 0 && !optProdIds.includes(Number(p.id))) {
                return false;
            }
            if (optCatIds.length > 0) {
                const inAllowedCat = p.categories?.some(
                    (c) => optCatIds.includes(Number(c.id)) || (c.parent_id && optCatIds.includes(Number(c.parent_id))),
                );
                if (!inAllowedCat) return false;
            }
            if (activeOptionalCategory !== 'all') {
                const inSelectedCat = p.categories?.some(
                    (c) => Number(c.id) === activeOptionalCategory || Number(c.parent_id) === activeOptionalCategory,
                );
                if (!inSelectedCat) return false;
            }
            if (searchQuery.trim() !== '') {
                const q = searchQuery.toLowerCase();
                const matchName = p.name.toLowerCase().includes(q);
                const matchProducer = (p.producer || '').toLowerCase().includes(q);
                if (!matchName && !matchProducer) return false;
            }
            return true;
        });
    }, [
        products,
        bundleSettings.optional_product_ids,
        bundleSettings.optional_category_ids,
        activeOptionalCategory,
        searchQuery,
    ]);

    const getActiveVariant = (product: ExtendedProduct): ProductVariant | undefined => {
        const chosenId = selectedVariants[product.id];
        if (chosenId) {
            const found = product.variants?.find((v) => v.id === chosenId);
            if (found) return found;
        }
        return product.variants?.find((v) => v.is_default) || product.variants?.[0];
    };

    const handleSelectVariant = (productId: number, variantId: number) => {
        setSelectedVariants((prev) => ({ ...prev, [productId]: variantId }));
    };

    const getBundleKey = (role: 'required' | 'optional', variantId: number) => `${role}_${variantId}`;

    const handleAddToBundle = (product: ExtendedProduct, role: 'required' | 'optional') => {
        const variant = getActiveVariant(product);
        if (!variant) return;

        const key = getBundleKey(role, variant.id);
        setSelectedItems((prev) => {
            const existing = prev[key];
            return {
                ...prev,
                [key]: {
                    product,
                    variant,
                    quantity: existing ? existing.quantity + 1 : 1,
                    role,
                },
            };
        });
    };

    const handleUpdateQty = (key: string, delta: number) => {
        setSelectedItems((prev) => {
            const existing = prev[key];
            if (!existing) return prev;
            const nextQty = existing.quantity + delta;
            if (nextQty <= 0) {
                const clone = { ...prev };
                delete clone[key];
                return clone;
            }
            return {
                ...prev,
                [key]: {
                    ...existing,
                    quantity: nextQty,
                },
            };
        });
    };

    const handleRemoveKey = (key: string) => {
        setSelectedItems((prev) => {
            const clone = { ...prev };
            delete clone[key];
            return clone;
        });
    };

    // Bundle calculations
    const selectedList = useMemo(() => Object.entries(selectedItems), [selectedItems]);

    const requiredSelectedList = useMemo(
        () => selectedList.filter(([, item]) => item.role === 'required'),
        [selectedList],
    );
    const optionalSelectedList = useMemo(
        () => selectedList.filter(([, item]) => item.role === 'optional'),
        [selectedList],
    );

    const totalRequiredQty = useMemo(
        () => requiredSelectedList.reduce((acc, [, item]) => acc + item.quantity, 0),
        [requiredSelectedList],
    );

    const totalOptionalQty = useMemo(
        () => optionalSelectedList.reduce((acc, [, item]) => acc + item.quantity, 0),
        [optionalSelectedList],
    );

    const totalBundleItems = totalRequiredQty + totalOptionalQty;

    const normalSubtotal = useMemo(
        () => selectedList.reduce((acc, [, item]) => acc + Number(item.variant.price) * item.quantity, 0),
        [selectedList],
    );

    const totalWeightGrams = useMemo(
        () => selectedList.reduce((acc, [, item]) => acc + (Number(item.variant.weight_grams) || 500) * item.quantity, 0),
        [selectedList],
    );

    // Determine active discount tier & next discount tier
    const activeTier = useMemo(() => {
        let matched: (typeof sortedTiers)[0] | null = null;
        for (const tier of sortedTiers) {
            if (totalBundleItems >= tier.min_items) {
                matched = tier;
            }
        }
        return matched;
    }, [sortedTiers, totalBundleItems]);

    const nextTier = useMemo(() => {
        for (const tier of sortedTiers) {
            if (totalBundleItems < tier.min_items) {
                return tier;
            }
        }
        return null;
    }, [sortedTiers, totalBundleItems]);

    const discountAmount = useMemo(() => {
        if (!activeTier || normalSubtotal <= 0) return 0;
        if (activeTier.discount_type === 'percentage') {
            return Math.round((normalSubtotal * activeTier.discount_value) / 100);
        }
        return Math.min(normalSubtotal, activeTier.discount_value);
    }, [activeTier, normalSubtotal]);

    const finalBundlePrice = Math.max(0, normalSubtotal - discountAmount);

    const isRequiredFulfilled = totalRequiredQty >= minRequiredItems;
    const canCheckoutBundle = totalBundleItems > 0 && isRequiredFulfilled;

    // Build human-readable summary string for Cart & Checkout
    const buildBundleNotes = (): string => {
        const reqParts = requiredSelectedList.map(
            ([, item]) => `${item.quantity}x ${item.product.name} (${item.variant.label})`,
        );
        const optParts = optionalSelectedList.map(
            ([, item]) => `${item.quantity}x ${item.product.name} (${item.variant.label})`,
        );

        const sections: string[] = [];
        if (reqParts.length > 0) {
            sections.push(`Produk Wajib: ${reqParts.join(', ')}`);
        }
        if (optParts.length > 0) {
            sections.push(`Produk Opsional: ${optParts.join(', ')}`);
        }
        if (activeTier && discountAmount > 0) {
            sections.push(
                `Promo: ${activeTier.label} (Hemat ${formatRupiah(discountAmount)} dari ${formatRupiah(normalSubtotal)})`,
            );
        }
        return sections.join(' | ');
    };

    const handleAddBundleToCart = () => {
        if (!canCheckoutBundle) return;

        const firstChosenItem = selectedList[0]?.[1];
        const previewImg = firstChosenItem
            ? getProductImageUrl(firstChosenItem.product, firstChosenItem.variant)
            : undefined;

        const customVariant: ProductVariant = {
            ...byobVariant,
            label: `${totalBundleItems} Produk Pilihan${activeTier ? ` • ${activeTier.label}` : ''}`,
            price: finalBundlePrice,
            weight_grams: Math.max(200, totalWeightGrams),
            image_url: previewImg || byobVariant.image_url,
        };

        const customProduct: Product = {
            ...byobProduct,
            name: bundleSettings.title || 'Paket Custom Alat Kopi Malang',
            min_price: finalBundlePrice,
        };

        addItem(customProduct, customVariant, 1, 'Paket Custom', buildBundleNotes());
    };

    const handleOrderViaWhatsApp = () => {
        if (!canCheckoutBundle) return;
        const waNumber = (bundleSettings.whatsapp_number || '6285121930454').replace(/[^0-9]/g, '');

        let msg = `Halo Alat Kopi Malang! Saya ingin memesan *${bundleSettings.title || 'Paket Custom'}*:\n\n`;

        if (requiredSelectedList.length > 0) {
            msg += `*PRODUK WAJIB:*\n`;
            requiredSelectedList.forEach(([, item], i) => {
                msg += `${i + 1}. ${item.product.name} (${item.variant.label}) x${item.quantity} — ${formatRupiah(
                    item.variant.price * item.quantity,
                )}\n`;
            });
            msg += `\n`;
        }

        if (optionalSelectedList.length > 0) {
            msg += `*PRODUK OPSIONAL:*\n`;
            optionalSelectedList.forEach(([, item], i) => {
                msg += `${i + 1}. ${item.product.name} (${item.variant.label}) x${item.quantity} — ${formatRupiah(
                    item.variant.price * item.quantity,
                )}\n`;
            });
            msg += `\n`;
        }

        msg += `*RINGKASAN HARGA PAKET:*\n`;
        msg += `• Total Produk: ${totalBundleItems} item\n`;
        msg += `• Harga Normal: ${formatRupiah(normalSubtotal)}\n`;
        if (activeTier && discountAmount > 0) {
            msg += `• Diskon Paket (${activeTier.label}): -${formatRupiah(discountAmount)}\n`;
        }
        msg += `• *Total Harga Paket: ${formatRupiah(finalBundlePrice)}*\n\n`;
        msg += `Mohon informasi ketersediaan stok dan proses pemesanannya. Terima kasih!`;

        window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
    };

    const renderProductCard = (product: ExtendedProduct, role: 'required' | 'optional') => {
        const activeVariant = getActiveVariant(product);
        if (!activeVariant) return null;

        const key = getBundleKey(role, activeVariant.id);
        const selectedEntry = selectedItems[key];
        const qtyInBundle = selectedEntry?.quantity || 0;
        const imgUrl = getProductImageUrl(product, activeVariant);
        const isPreorder = Boolean(product.is_preorder) || product.stock_status === 'preorder';

        return (
            <div
                key={`${role}-${product.id}`}
                className={`group relative bg-white rounded-2xl border transition-all duration-200 flex flex-col overflow-hidden ${
                    qtyInBundle > 0
                        ? 'border-accent-copper ring-2 ring-accent-copper/20 shadow-md'
                        : 'border-sand-200/80 hover:border-brand-300 shadow-xs hover:shadow-md'
                }`}
            >
                {/* Image Header */}
                <div className="relative aspect-square bg-cream-50 overflow-hidden">
                    <img
                        src={imgUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                    />

                    {/* Top Left Badges */}
                    <div className="absolute top-2.5 left-2.5 flex flex-wrap items-center gap-1.5">
                        {role === 'required' ? (
                            <span className="px-2.5 py-1 rounded-full bg-brand-900/90 backdrop-blur-xs text-white text-[10px] font-extrabold uppercase tracking-wider shadow-xs">
                                Produk Wajib
                            </span>
                        ) : (
                            <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs text-brand-800 border border-sand-200 text-[10px] font-bold uppercase tracking-wider shadow-xs">
                                Opsional
                            </span>
                        )}
                        {isPreorder && (
                            <span className="px-2.5 py-1 rounded-full bg-amber-600 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-xs">
                                Pre-Order
                            </span>
                        )}
                    </div>

                    {/* Selected Counter Badge */}
                    {qtyInBundle > 0 && (
                        <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-accent-copper text-white text-xs font-extrabold flex items-center justify-center shadow-md">
                            {qtyInBundle}
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5">
                        {product.producer && (
                            <p className="text-[10px] font-extrabold uppercase tracking-widest text-accent-copper truncate">
                                {product.producer}
                            </p>
                        )}
                        <Link
                            href={`/shop/${product.slug}`}
                            className="block text-sm font-bold text-brand-950 hover:text-accent-copper transition-colors line-clamp-2 leading-snug"
                        >
                            {product.name}
                        </Link>

                        {/* Category Pills */}
                        {product.categories && product.categories.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-0.5">
                                {product.categories.slice(0, 2).map((cat) => {
                                    const catName =
                                        typeof cat.name === 'object'
                                            ? cat.name.id || Object.values(cat.name)[0]
                                            : cat.name;
                                    return (
                                        <span
                                            key={cat.id}
                                            className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-cream-100 text-brand-700"
                                        >
                                            {catName}
                                        </span>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="space-y-3 pt-2 border-t border-sand-100">
                        {/* Variant Selector if multiple variants */}
                        {product.variants && product.variants.length > 1 && (
                            <div className="space-y-1">
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-brand-500">
                                    Pilih Varian:
                                </label>
                                <select
                                    value={activeVariant.id}
                                    onChange={(e) => handleSelectVariant(product.id, Number(e.target.value))}
                                    className="w-full text-xs font-semibold text-brand-900 bg-cream-50 border border-sand-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-accent-copper"
                                >
                                    {product.variants.map((v) => (
                                        <option key={v.id} value={v.id}>
                                            {v.label} — {formatRupiah(v.price)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Price & Add Button */}
                        <div className="flex items-center justify-between gap-2">
                            <div>
                                <span className="block text-[10px] text-brand-400 font-medium">Harga Satuan</span>
                                <span className="text-sm font-extrabold text-brand-950">
                                    {formatRupiah(activeVariant.price)}
                                </span>
                            </div>

                            {qtyInBundle > 0 ? (
                                <div className="flex items-center border-2 border-accent-copper rounded-xl bg-accent-copper/10 overflow-hidden">
                                    <button
                                        type="button"
                                        onClick={() => handleUpdateQty(key, -1)}
                                        className="p-2 text-accent-copper hover:bg-accent-copper hover:text-white transition-colors cursor-pointer"
                                        aria-label="Kurangi"
                                    >
                                        <Minus className="w-3.5 h-3.5" />
                                    </button>
                                    <span className="px-2.5 text-xs font-extrabold text-brand-950">{qtyInBundle}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleUpdateQty(key, 1)}
                                        className="p-2 text-accent-copper hover:bg-accent-copper hover:text-white transition-colors cursor-pointer"
                                        aria-label="Tambah"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => handleAddToBundle(product, role)}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-900 hover:bg-accent-copper text-white text-xs font-bold transition-colors shadow-xs cursor-pointer active:scale-95"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>Pilih</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <PublicLayout title={bundleSettings.title || 'Paket Custom Alat Kopi Malang'}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-36 lg:pb-20 space-y-8">
                {/* Back Link */}
                <div>
                    <Link
                        href="/shop"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-950 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Kembali ke Katalog Produk</span>
                    </Link>
                </div>

                {/* Hero Banner & Tiered Discount Progress */}
                <div className="relative rounded-3xl bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 text-white p-6 sm:p-8 lg:p-10 shadow-xl overflow-hidden">
                    <div className="relative z-10 max-w-3xl space-y-3">
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-accent-copper/20 border border-accent-copper/40 text-amber-300 text-xs font-bold uppercase tracking-wider">
                            <Gift className="w-3.5 h-3.5" />
                            <span>{bundleSettings.badge_text || 'Custom Bundle & Diskon Bertingkat'}</span>
                        </span>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
                            {bundleSettings.title || 'Buat Paket Alat Kopi Custom Anda'}
                        </h1>
                        <p className="text-sm sm:text-base text-sand-200 leading-relaxed">
                            {bundleSettings.subtitle}
                        </p>
                    </div>

                    {/* Discount Tiers Milestone Bar */}
                    {sortedTiers.length > 0 && (
                        <div className="relative z-10 mt-8 pt-6 border-t border-white/15 space-y-4">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-amber-400" />
                                    <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-300">
                                        Tingkatan Diskon Paket Otomatis
                                    </span>
                                </div>
                                <div className="text-xs sm:text-sm font-semibold text-sand-100">
                                    {nextTier ? (
                                        <span>
                                            Tambah{' '}
                                            <strong className="text-amber-300">
                                                {nextTier.min_items - totalBundleItems} produk lagi
                                            </strong>{' '}
                                            untuk membuka promo <strong>{nextTier.label}</strong>!
                                        </span>
                                    ) : activeTier ? (
                                        <span className="text-emerald-300 font-bold">
                                            🎉 Selamat! Anda telah membuka diskon tertinggi ({activeTier.label})!
                                        </span>
                                    ) : null}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {sortedTiers.map((tier, idx) => {
                                    const unlocked = totalBundleItems >= tier.min_items;
                                    const isCurrent = activeTier?.min_items === tier.min_items;
                                    return (
                                        <div
                                            key={idx}
                                            className={`rounded-2xl p-4 border transition-all flex items-center gap-3.5 ${
                                                isCurrent
                                                    ? 'bg-accent-copper/25 border-amber-400 shadow-lg'
                                                    : unlocked
                                                      ? 'bg-emerald-950/50 border-emerald-500/50'
                                                      : 'bg-white/5 border-white/10 opacity-80'
                                            }`}
                                        >
                                            <div
                                                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-extrabold text-sm ${
                                                    unlocked
                                                        ? 'bg-emerald-500 text-white'
                                                        : 'bg-white/10 text-sand-200'
                                                }`}
                                            >
                                                {unlocked ? <Check className="w-5 h-5" /> : `${tier.min_items}+`}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs font-bold uppercase tracking-wider text-sand-300">
                                                    Minimal {tier.min_items} Produk
                                                </p>
                                                <p className="text-sm sm:text-base font-extrabold text-white truncate">
                                                    {tier.label}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Pilihan Produk Paket Usaha Custom Bundling (Slot-Based Bundles) */}
                {bundleProducts.length > 0 && (
                    <section className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-200/90 shadow-xs space-y-6">
                        <div className="space-y-1 pb-4 border-b border-sand-200">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-accent-copper text-white text-[10px] font-extrabold uppercase tracking-wider">
                                Pilihan Paket Usaha Siap Kustomisasi
                            </span>
                            <h2 className="text-xl sm:text-2xl font-extrabold text-brand-950">
                                Pilih Paket Usaha Kedai Kopi &amp; Cafe (Custom Bundling)
                            </h2>
                            <p className="text-xs sm:text-sm text-brand-600">
                                Klik salah satu paket di bawah ini untuk memilih sendiri Mesin Espresso, Grinder, dan Alat Barista pada setiap slot (+) dilengkapi bonus item GRATIS (Rp 0) dan slot OPTIONAL.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {bundleProducts.map((bp) => {
                                const bpImg = getProductImageUrl(bp, bp.variants?.[0]);
                                const slotCount = Array.isArray(bp.bundle_config?.slots) ? bp.bundle_config.slots.length : 0;
                                return (
                                    <Link
                                        key={bp.id}
                                        href={`/shop/${bp.slug}`}
                                        className="group bg-white rounded-2xl border border-sand-200/90 hover:border-accent-copper shadow-xs hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between"
                                    >
                                        <div>
                                            <div className="relative aspect-square bg-cream-50 overflow-hidden">
                                                <img
                                                    src={bpImg}
                                                    alt={bp.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-brand-950/90 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
                                                    Custom Bundling ({slotCount} Slot)
                                                </span>
                                            </div>
                                            <div className="p-4 space-y-1.5">
                                                <h3 className="text-base font-extrabold text-brand-950 group-hover:text-accent-copper transition-colors">
                                                    {bp.name}
                                                </h3>
                                                {bp.short_description && (
                                                    <p className="text-xs text-brand-600 line-clamp-2 leading-relaxed">
                                                        {bp.short_description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="px-4 pb-4 pt-2 border-t border-sand-100 flex items-center justify-between">
                                            <span className="text-xs font-extrabold text-accent-copper uppercase tracking-wider">
                                                Pilih Komponen Paket →
                                            </span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* Main Grid: Left Builder (8 cols) + Right Sticky Summary (4 cols) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Column: Step 1 (Produk Wajib) & Step 2 (Produk Opsional) */}
                    <div className="lg:col-span-8 space-y-10">
                        {/* STEP 1: PRODUK WAJIB */}
                        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-200/90 shadow-xs space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sand-200">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="px-2.5 py-0.5 rounded-md bg-brand-900 text-white text-[10px] font-extrabold uppercase tracking-wider">
                                            Langkah 1 • Wajib
                                        </span>
                                        {minRequiredItems > 0 && (
                                            <span
                                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                                    isRequiredFulfilled
                                                        ? 'bg-emerald-100 text-emerald-800'
                                                        : 'bg-amber-100 text-amber-800'
                                                }`}
                                            >
                                                {isRequiredFulfilled ? (
                                                    <>
                                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                                        <span>
                                                            Terpenuhi ({totalRequiredQty}/{minRequiredItems} Produk Wajib)
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                                                        <span>
                                                            Pilih Minimal {minRequiredItems} Produk Wajib ({totalRequiredQty}/
                                                            {minRequiredItems})
                                                        </span>
                                                    </>
                                                )}
                                            </span>
                                        )}
                                    </div>
                                    <h2 className="text-xl sm:text-2xl font-extrabold text-brand-950">
                                        {bundleSettings.required_section_title || '1. Pilih Produk Wajib (Utama)'}
                                    </h2>
                                    <p className="text-xs sm:text-sm text-brand-600">
                                        {bundleSettings.required_section_desc}
                                    </p>
                                </div>
                            </div>

                            {/* Category Filter for Required Products (if multiple categories exist) */}
                            {requiredCategories.length > 1 && (
                                <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                                    <button
                                        type="button"
                                        onClick={() => setActiveRequiredCategory('all')}
                                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                                            activeRequiredCategory === 'all'
                                                ? 'bg-brand-900 text-white shadow-xs'
                                                : 'bg-cream-100 text-brand-700 hover:bg-sand-200'
                                        }`}
                                    >
                                        Semua Produk Wajib ({requiredProducts.length})
                                    </button>
                                    {requiredCategories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            type="button"
                                            onClick={() => setActiveRequiredCategory(cat.id)}
                                            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                                                activeRequiredCategory === cat.id
                                                    ? 'bg-brand-900 text-white shadow-xs'
                                                    : 'bg-cream-100 text-brand-700 hover:bg-sand-200'
                                            }`}
                                        >
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Required Products Grid */}
                            {filteredRequiredProducts.length === 0 ? (
                                <div className="text-center py-8 text-sm text-brand-500">
                                    Tidak ada produk wajib pada kategori ini.
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {filteredRequiredProducts.map((product) => renderProductCard(product, 'required'))}
                                </div>
                            )}
                        </section>

                        {/* STEP 2: PRODUK OPSIONAL BERDASARKAN KATEGORI */}
                        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-200/90 shadow-xs space-y-6">
                            <div className="space-y-2 pb-4 border-b border-sand-200">
                                <div className="flex items-center gap-2">
                                    <span className="px-2.5 py-0.5 rounded-md bg-accent-copper text-white text-[10px] font-extrabold uppercase tracking-wider">
                                        Langkah 2 • Opsional (Berdasarkan Kategori)
                                    </span>
                                    <span className="text-xs font-semibold text-brand-600">
                                        ({totalOptionalQty} produk opsional dipilih)
                                    </span>
                                </div>
                                <h2 className="text-xl sm:text-2xl font-extrabold text-brand-950">
                                    {bundleSettings.optional_section_title ||
                                        '2. Pilih Produk Opsional (Berdasarkan Kategori)'}
                                </h2>
                                <p className="text-xs sm:text-sm text-brand-600">
                                    {bundleSettings.optional_section_desc}
                                </p>
                            </div>

                            {/* Search & Category Filter Tabs */}
                            <div className="space-y-4">
                                <div className="relative">
                                    <Search className="w-4 h-4 text-brand-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Cari nama alat kopi atau brand pada produk opsional..."
                                        className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-cream-50 border border-sand-200 rounded-xl focus:outline-none focus:border-accent-copper text-brand-950"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-500">
                                        <Layers className="w-3.5 h-3.5 text-accent-copper" />
                                        <span>Filter Kategori Katalog:</span>
                                    </div>
                                    <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                                        <button
                                            type="button"
                                            onClick={() => setActiveOptionalCategory('all')}
                                            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                                                activeOptionalCategory === 'all'
                                                    ? 'bg-accent-copper text-white shadow-xs'
                                                    : 'bg-cream-100 text-brand-800 hover:bg-sand-200'
                                            }`}
                                        >
                                            Semua Kategori
                                        </button>
                                        {optionalCategories.map((cat) => (
                                            <button
                                                key={cat.id}
                                                type="button"
                                                onClick={() => setActiveOptionalCategory(cat.id)}
                                                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                                                    activeOptionalCategory === cat.id
                                                        ? 'bg-accent-copper text-white shadow-xs'
                                                        : 'bg-cream-100 text-brand-800 hover:bg-sand-200'
                                                }`}
                                            >
                                                {cat.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Optional Products Grid */}
                            {optionalProducts.length === 0 ? (
                                <div className="text-center py-12 bg-cream-50 rounded-2xl border border-dashed border-sand-200 space-y-2">
                                    <p className="text-sm font-bold text-brand-800">
                                        Tidak ada produk pada filter kategori ini.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setActiveOptionalCategory('all');
                                            setSearchQuery('');
                                        }}
                                        className="text-xs font-bold text-accent-copper hover:underline cursor-pointer"
                                    >
                                        Tampilkan Semua Kategori
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {optionalProducts.map((product) => renderProductCard(product, 'optional'))}
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Right Column: Sticky Bundle Summary & Discount Calculation (4 cols) */}
                    <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
                        <div className="bg-white rounded-3xl p-6 border border-sand-200/90 shadow-lg space-y-5">
                            <div className="flex items-center justify-between pb-4 border-b border-sand-200">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-9 h-9 rounded-xl bg-brand-900 text-white flex items-center justify-center">
                                        <PackageCheck className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-extrabold text-brand-950">Ringkasan Paket Anda</h3>
                                        <p className="text-xs text-brand-500">
                                            Total <strong>{totalBundleItems} produk</strong> dipilih
                                        </p>
                                    </div>
                                </div>
                                {selectedList.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => setSelectedItems({})}
                                        className="text-xs font-semibold text-red-500 hover:text-red-700 cursor-pointer"
                                    >
                                        Reset
                                    </button>
                                )}
                            </div>

                            {/* Requirement Check Banner */}
                            {minRequiredItems > 0 && !isRequiredFulfilled && (
                                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
                                    <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-bold">Syarat Produk Wajib Belum Terpenuhi</p>
                                        <p className="text-amber-800 mt-0.5">
                                            Silakan pilih minimal <strong>{minRequiredItems} Produk Wajib</strong> pada
                                            Langkah 1 untuk mengaktifkan pemesanan paket.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Selected Items List */}
                            {selectedList.length === 0 ? (
                                <div className="py-10 text-center space-y-2">
                                    <ShoppingBag className="w-10 h-10 text-sand-300 mx-auto" />
                                    <p className="text-sm font-bold text-brand-800">Paket Masih Kosong</p>
                                    <p className="text-xs text-brand-500 max-w-xs mx-auto">
                                        Pilih produk wajib dan produk opsional di samping untuk mulai merakit paket dan
                                        mendapatkan diskon otomatis.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4 max-h-80 overflow-y-auto pr-1 divide-y divide-sand-100">
                                    {/* Group 1: Produk Wajib */}
                                    {requiredSelectedList.length > 0 && (
                                        <div className="space-y-2.5 pb-2">
                                            <p className="text-[10px] font-extrabold uppercase tracking-wider text-brand-700">
                                                Produk Wajib ({totalRequiredQty})
                                            </p>
                                            {requiredSelectedList.map(([key, item]) => (
                                                <div key={key} className="flex items-start justify-between gap-2 text-xs">
                                                    <div className="min-w-0 flex-1">
                                                        <p className="font-bold text-brand-950 truncate">
                                                            {item.product.name}
                                                        </p>
                                                        <p className="text-[11px] text-brand-500">
                                                            {item.variant.label} • {item.quantity}x{' '}
                                                            {formatRupiah(item.variant.price)}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="font-bold text-brand-900">
                                                            {formatRupiah(item.variant.price * item.quantity)}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveKey(key)}
                                                            className="text-gray-400 hover:text-red-500 p-1 cursor-pointer"
                                                            aria-label="Hapus item"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Group 2: Produk Opsional */}
                                    {optionalSelectedList.length > 0 && (
                                        <div className="space-y-2.5 pt-3">
                                            <p className="text-[10px] font-extrabold uppercase tracking-wider text-accent-copper">
                                                Produk Opsional ({totalOptionalQty})
                                            </p>
                                            {optionalSelectedList.map(([key, item]) => (
                                                <div key={key} className="flex items-start justify-between gap-2 text-xs">
                                                    <div className="min-w-0 flex-1">
                                                        <p className="font-bold text-brand-950 truncate">
                                                            {item.product.name}
                                                        </p>
                                                        <p className="text-[11px] text-brand-500">
                                                            {item.variant.label} • {item.quantity}x{' '}
                                                            {formatRupiah(item.variant.price)}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="font-bold text-brand-900">
                                                            {formatRupiah(item.variant.price * item.quantity)}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveKey(key)}
                                                            className="text-gray-400 hover:text-red-500 p-1 cursor-pointer"
                                                            aria-label="Hapus item"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Price & Discount Breakdown */}
                            <div className="pt-4 border-t border-sand-200 space-y-2.5 text-sm">
                                <div className="flex items-center justify-between text-brand-600">
                                    <span>Harga Normal ({totalBundleItems} item)</span>
                                    <span className="font-semibold">{formatRupiah(normalSubtotal)}</span>
                                </div>

                                {activeTier && discountAmount > 0 ? (
                                    <div className="flex items-center justify-between text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
                                        <span className="inline-flex items-center gap-1.5 text-xs font-bold">
                                            <Tag className="w-3.5 h-3.5" />
                                            <span>{activeTier.label}</span>
                                        </span>
                                        <span className="font-extrabold">- {formatRupiah(discountAmount)}</span>
                                    </div>
                                ) : nextTier ? (
                                    <div className="text-[11px] text-accent-copper bg-amber-50/80 border border-amber-200/70 px-3 py-2 rounded-xl font-medium">
                                        Tambah <strong>{nextTier.min_items - totalBundleItems} produk</strong> lagi untuk
                                        mendapatkan <strong>{nextTier.label}</strong>!
                                    </div>
                                ) : null}

                                <div className="flex items-center justify-between pt-2 border-t border-sand-200">
                                    <span className="text-base font-extrabold text-brand-950">Total Harga Paket</span>
                                    <div className="text-right">
                                        {discountAmount > 0 && (
                                            <span className="block text-xs text-brand-400 line-through">
                                                {formatRupiah(normalSubtotal)}
                                            </span>
                                        )}
                                        <span className="text-xl font-extrabold text-accent-copper">
                                            {formatRupiah(finalBundlePrice)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-2.5 pt-2">
                                <button
                                    type="button"
                                    disabled={!canCheckoutBundle}
                                    onClick={handleAddBundleToCart}
                                    className={`w-full py-3.5 px-5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                                        canCheckoutBundle
                                            ? 'bg-brand-900 hover:bg-brand-800 text-white cursor-pointer active:scale-[0.99]'
                                            : 'bg-sand-200 text-brand-400 cursor-not-allowed'
                                    }`}
                                >
                                    <ShoppingBag className="w-4 h-4" />
                                    <span>Masukkan Paket ke Keranjang</span>
                                </button>

                                <button
                                    type="button"
                                    disabled={!canCheckoutBundle}
                                    onClick={handleOrderViaWhatsApp}
                                    className={`w-full py-3 px-5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
                                        canCheckoutBundle
                                            ? 'border-emerald-600 text-emerald-700 hover:bg-emerald-50 cursor-pointer'
                                            : 'border-sand-200 text-brand-300 cursor-not-allowed'
                                    }`}
                                >
                                    <MessageCircle className="w-4 h-4" />
                                    <span>Pesan Paket Ini via WhatsApp</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Bottom Summary Bar */}
            {totalBundleItems > 0 && (
                <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-white border-t border-sand-200 px-4 py-3 shadow-2xl">
                    <div className="max-w-lg mx-auto flex items-center justify-between gap-3">
                        <div>
                            <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-brand-700">{totalBundleItems} Produk</span>
                                {activeTier && discountAmount > 0 && (
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                                        Hemat {formatRupiah(discountAmount)}
                                    </span>
                                )}
                            </div>
                            <p className="text-base font-extrabold text-brand-950">{formatRupiah(finalBundlePrice)}</p>
                        </div>
                        <button
                            type="button"
                            disabled={!canCheckoutBundle}
                            onClick={handleAddBundleToCart}
                            className={`px-5 py-3 rounded-xl font-bold text-xs flex items-center gap-2 shadow-md ${
                                canCheckoutBundle
                                    ? 'bg-brand-900 text-white active:scale-95'
                                    : 'bg-sand-200 text-brand-400'
                            }`}
                        >
                            <ShoppingBag className="w-4 h-4" />
                            <span>{isRequiredFulfilled ? 'Tambah Paket' : `Pilih ${minRequiredItems} Wajib`}</span>
                        </button>
                    </div>
                </div>
            )}
        </PublicLayout>
    );
}

