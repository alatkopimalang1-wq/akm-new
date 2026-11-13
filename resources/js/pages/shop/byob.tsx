import React, { useEffect, useMemo, useState } from 'react';
import { Head } from '@inertiajs/react';
import {
    ArrowUpDown,
    Check,
    Minus,
    Plus,
    RotateCcw,
    ShoppingBag,
    SlidersHorizontal,
} from 'lucide-react';
import { PublicLayout } from '@/layouts/public-layout';
import type { Product, ProductVariant } from '@/types/sanubari';
import { formatRupiah } from '@/lib/trans';
import { useCart } from '@/context/cart-context';
import { SlidingNumber } from '@animate-ui/react/primitives/texts/sliding-number';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface ByobBeanSetting {
    product_id?: number | null;
    name: string;
    origin?: string;
    process?: string;
    price_per_10g: number;
    tasting_notes?: string;
    is_active?: boolean;
}

interface ByobVariantSetting {
    label: string;
    weight_grams: number;
    discount_type?: 'percentage' | 'fixed';
    discount_value?: number;
    discount_percentage?: number;
    is_default?: boolean;
}

interface ByobGrindSetting {
    name: string;
}

export interface ByobSettings {
    hero_title?: string;
    hero_description?: string;
    hero_image?: string | null;
    packshot_image?: string | null;
    studio_title?: string;
    studio_subtitle?: string;
    default_ratio?: number;
    possible_notes_title?: string;
    byob_beans?: ByobBeanSetting[];
    byob_variants?: ByobVariantSetting[];
    byob_grind_options?: ByobGrindSetting[];
}

interface ByobProps {
    beans: Product[];
    byobProduct: Product;
    byobSettings?: ByobSettings | null;
}

const resolveImageUrl = (path?: string | null) => {
    if (!path) return null;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    const clean = path.replace(/^\/?(storage\/)?/, '');
    return `/storage/${clean}`;
};

export default function ByobPage({ beans = [], byobProduct, byobSettings }: ByobProps) {
    const { addItem } = useCart();

    // Packaging variants strictly ordered by byobSettings.byob_variants configured in Admin Dashboard
    const variants: ProductVariant[] = useMemo(() => {
        const adminVariants = byobSettings?.byob_variants;
        const dbVariants = byobProduct?.variants || [];

        if (adminVariants && Array.isArray(adminVariants) && adminVariants.length > 0) {
            const list: ProductVariant[] = [];
            adminVariants.forEach((adminVar, index) => {
                const weight = Number(adminVar.weight_grams);
                const matchingDbVar = dbVariants.find((v) => Number(v.weight_grams) === weight);

                list.push({
                    id: matchingDbVar?.id ?? ((byobProduct?.id || 9999) + index),
                    product_id: byobProduct?.id || 9999,
                    label: adminVar.label || matchingDbVar?.label || `${weight}g`,
                    weight_grams: weight,
                    price: matchingDbVar?.price || 0,
                    stock_status: matchingDbVar?.stock_status || 'in_stock',
                });
            });

            // Include any variants from DB that were not in the admin setting array
            dbVariants.forEach((dbVar) => {
                if (!list.some((item) => Number(item.weight_grams) === Number(dbVar.weight_grams))) {
                    list.push(dbVar);
                }
            });

            if (list.length > 0) {
                return list;
            }
        }

        if (dbVariants.length > 0) {
            return dbVariants;
        }

        return [
            {
                id: byobProduct?.id || 9999,
                product_id: byobProduct?.id || 9999,
                label: '200g',
                weight_grams: 200,
                price: 65000,
                stock_status: 'in_stock',
            },
            {
                id: (byobProduct?.id || 9999) + 1,
                product_id: byobProduct?.id || 9999,
                label: '500g',
                weight_grams: 500,
                price: 150000,
                stock_status: 'in_stock',
            },
            {
                id: (byobProduct?.id || 9999) + 2,
                product_id: byobProduct?.id || 9999,
                label: '1 kg',
                weight_grams: 1000,
                price: 275000,
                stock_status: 'in_stock',
            },
        ];
    }, [byobProduct, byobSettings]);

    // Initial bean choices
    const defaultBeanA = useMemo(() => {
        return (
            beans.find((b) => b.slug?.includes('kawi') && b.slug?.includes('honey')) ||
            beans[0] ||
            null
        );
    }, [beans]);

    const defaultBeanB = useMemo(() => {
        return (
            beans.find(
                (b) =>
                    (b.slug?.includes('dampit') || b.slug?.includes('robusta')) &&
                    b.id !== defaultBeanA?.id
            ) ||
            beans.find((b) => b.id !== defaultBeanA?.id) ||
            (beans.length > 1 ? beans[1] : null) ||
            null
        );
    }, [beans, defaultBeanA]);

    const [beanAId, setBeanAId] = useState<number>(defaultBeanA?.id ?? 0);
    const [beanBId, setBeanBId] = useState<number>(defaultBeanB?.id ?? 0);

    // Auto-correct if both beans ever match
    useEffect(() => {
        if (beanAId && beanBId && beanAId === beanBId) {
            const alternative = beans.find((b) => b.id !== beanAId);
            if (alternative) {
                setBeanBId(alternative.id);
            }
        }
    }, [beanAId, beanBId, beans]);

    // Swap beans positions between A and B
    const handleSwapBeans = () => {
        const currentA = beanAId;
        const currentB = beanBId;
        setBeanAId(currentB);
        setBeanBId(currentA);
    };

    // Single unified blend ratio: percentage of Bean A (10% to 90%, step 10%)
    // Bean B percentage is automatically (100 - blendRatio)%
    const [blendRatio, setBlendRatio] = useState<number>(byobSettings?.default_ratio ?? 70);

    const initialVariant = useMemo(() => {
        const defaultVarSetting = byobSettings?.byob_variants?.find((v) => v.is_default);
        if (defaultVarSetting) {
            const found = variants.find((v) => Number(v.weight_grams) === Number(defaultVarSetting.weight_grams));
            if (found) return found;
        }
        return variants[0];
    }, [variants, byobSettings]);

    const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(initialVariant);

    // Keep selectedVariant valid if variants array changes/reorders
    useEffect(() => {
        if (!selectedVariant || !variants.some((v) => Number(v.weight_grams) === Number(selectedVariant.weight_grams))) {
            setSelectedVariant(initialVariant);
        }
    }, [initialVariant, variants, selectedVariant]);
    const [grindOption, setGrindOption] = useState<string>('Whole Bean (Biji Utuh)');
    const [customBlendName, setCustomBlendName] = useState<string>('');
    const [quantity, setQuantity] = useState<number>(1);
    const [addedSuccess, setAddedSuccess] = useState<boolean>(false);

    // Selected Bean Objects
    const beanA = useMemo(() => beans.find((b) => b.id === beanAId) || beans[0], [beans, beanAId]);
    const beanB = useMemo(
        () => beans.find((b) => b.id === beanBId) || beans.find((b) => b.id !== beanA?.id) || beans[1] || beans[0],
        [beans, beanBId, beanA]
    );

    const ratioA = blendRatio;
    const ratioB = 100 - blendRatio;

    // Price per 10g for Component A & B
    const pricePer10gA = useMemo(() => {
        if (beanA?.price_per_10g && beanA.price_per_10g > 0) return beanA.price_per_10g;
        if (beanA?.variants && beanA.variants.length > 0) {
            const v = beanA.variants.find((v) => v.weight_grams >= 100 && v.weight_grams <= 250) || beanA.variants[0];
            if (v && v.weight_grams > 0 && v.price > 0) return Math.round((v.price / v.weight_grams) * 10);
        }
        return beanA?.min_price ? Math.round((beanA.min_price / 200) * 10) : 3500;
    }, [beanA]);

    const pricePer10gB = useMemo(() => {
        if (beanB?.price_per_10g && beanB.price_per_10g > 0) return beanB.price_per_10g;
        if (beanB?.variants && beanB.variants.length > 0) {
            const v = beanB.variants.find((v) => v.weight_grams >= 100 && v.weight_grams <= 250) || beanB.variants[0];
            if (v && v.weight_grams > 0 && v.price > 0) return Math.round((v.price / v.weight_grams) * 10);
        }
        return beanB?.min_price ? Math.round((beanB.min_price / 200) * 10) : 2000;
    }, [beanB]);

    // Total grams from selected packaging size (e.g. 200g, 500g, 1000g)
    const packageWeightGrams = selectedVariant?.weight_grams || 200;

    // Weight in grams per component according to ratio
    const weightGramsA = Math.round((packageWeightGrams * ratioA) / 100);
    const weightGramsB = packageWeightGrams - weightGramsA;

    // Cost accumulation per component based on rate per 10 grams
    const costComponentA = Math.round((weightGramsA / 10) * pricePer10gA);
    const costComponentB = Math.round((weightGramsB / 10) * pricePer10gB);

    // Blended rate per 10g for reference
    const blendedRatePer10g = Math.round((ratioA * pricePer10gA + ratioB * pricePer10gB) / 100);

    // Normal base price before packaging discount
    const basePricePerBag = costComponentA + costComponentB;

    // Check discount percentage or fixed nominal for selected variant
    const variantSetting = useMemo(() => {
        return byobSettings?.byob_variants?.find(
            (v) => v.weight_grams === packageWeightGrams
        );
    }, [byobSettings, packageWeightGrams]);

    const { discountAmountPerBag, discountBadge, discountLabel, hasDiscount } = useMemo(() => {
        const type = variantSetting?.discount_type ?? 'percentage';
        const val =
            typeof variantSetting?.discount_value === 'number'
                ? variantSetting.discount_value
                : typeof variantSetting?.discount_percentage === 'number'
                  ? variantSetting.discount_percentage
                  : packageWeightGrams === 500
                    ? 5
                    : packageWeightGrams === 1000
                      ? 10
                      : 0;

        if (val <= 0) {
            return {
                discountAmountPerBag: 0,
                discountBadge: null,
                discountLabel: '',
                hasDiscount: false,
            };
        }

        if (type === 'fixed') {
            const amount = Math.min(val, basePricePerBag);
            return {
                discountAmountPerBag: amount,
                discountBadge: `Hemat ${formatRupiah(amount)}`,
                discountLabel: `Potongan ${formatRupiah(amount)}`,
                hasDiscount: true,
            };
        }

        const amount = Math.round((basePricePerBag * val) / 100);
        return {
            discountAmountPerBag: amount,
            discountBadge: `Diskon ${val}%`,
            discountLabel: `Diskon ${val}%`,
            hasDiscount: true,
        };
    }, [variantSetting, packageWeightGrams, basePricePerBag]);

    // Final price per bag after discount
    const pricePerBag = Math.max(0, basePricePerBag - discountAmountPerBag);

    // Total order price
    const totalPrice = pricePerBag * quantity;
    const baseTotalPrice = basePricePerBag * quantity;

    // Combined Tasting Notes
    const combinedNotes = useMemo(() => {
        const set = new Set<string>();
        const extract = (notesStr?: string | null) => {
            if (!notesStr) return;
            notesStr
                .split(/[,•/]/)
                .map((n) => n.trim())
                .filter(Boolean)
                .forEach((n) => set.add(n));
        };

        if (beanA) extract(beanA.tasting_notes);
        if (beanB) extract(beanB.tasting_notes);

        return Array.from(set).slice(0, 7);
    }, [beanA, beanB]);

    // Grind Options
    const grindOptions = useMemo(() => {
        if (byobSettings?.byob_grind_options && byobSettings.byob_grind_options.length > 0) {
            return byobSettings.byob_grind_options.map((g) => g.name);
        }
        return [
            'Whole Bean (Biji Utuh)',
            'Giling Kasar (Cold Brew, French Press)',
            'Giling Medium (V60, Kalita, Filter)',
            'Giling Halus (Mokapot, Aeropress)',
            'Espresso / Tubruk Halus',
        ];
    }, [byobSettings]);

    // Formula string
    const recipeString = useMemo(() => {
        const nameA = beanA?.name || 'Component A';
        const nameB = beanB?.name || 'Component B';
        return `${ratioA}% ${nameA} + ${ratioB}% ${nameB}`;
    }, [beanA, beanB, ratioA, ratioB]);

    const effectiveBlendTitle = customBlendName.trim()
        ? customBlendName.trim()
        : `Custom Blend (${recipeString})`;

    // Check if both selected beans are identical
    const isSameBean = Boolean(beanA && beanB && beanA.id === beanB.id);

    // Add to Cart handler with dynamic accumulated pricing & packaging discount
    const handleAddToCart = () => {
        if (isSameBean) {
            return;
        }
        const dynamicVariant: ProductVariant = {
            ...selectedVariant,
            price: pricePerBag,
        };
        const fullNotes = customBlendName.trim()
            ? `Blend: "${customBlendName.trim()}" | Rasio: ${recipeString}`
            : `Rasio Blend: ${recipeString}`;
        addItem(byobProduct, dynamicVariant, quantity, grindOption, fullNotes);
        setAddedSuccess(true);
        setTimeout(() => setAddedSuccess(false), 2500);
    };

    const renderPackageSizeSelector = (wrapperClassName = '') => (
        <div className={`space-y-1.5 sm:space-y-2.5 ${wrapperClassName}`}>
            <span className="block text-xs sm:text-sm font-semibold text-brand-800">
                Pilih Ukuran Kemasan:
            </span>
            <div className={`grid gap-2 sm:gap-2.5 ${
                variants.length === 1
                    ? 'grid-cols-1'
                    : variants.length === 2
                    ? 'grid-cols-2'
                    : variants.length === 4
                    ? 'grid-cols-2 sm:grid-cols-4'
                    : 'grid-cols-3'
            }`}>
                {variants.map((v) => {
                    const isSelected = selectedVariant?.weight_grams === v.weight_grams || selectedVariant?.id === v.id;
                    const variantSetting = byobSettings?.byob_variants?.find(
                        (s) => Number(s.weight_grams) === Number(v.weight_grams)
                    );
                    const discountVal = Number(variantSetting?.discount_value || variantSetting?.discount_percentage || 0);
                    const discountType = variantSetting?.discount_type || 'percentage';

                    return (
                        <button
                            key={`${v.id}-${v.weight_grams}`}
                            type="button"
                            onClick={() => setSelectedVariant(v)}
                            className={`py-2 px-2 sm:py-3 sm:px-2 rounded-lg sm:rounded-xl text-center transition-colors cursor-pointer ${
                                isSelected
                                    ? 'bg-brand-900 text-white font-bold shadow-xs'
                                    : 'bg-white hover:bg-sand-100 text-brand-900 border border-sand-200/60'
                            }`}
                        >
                            <span className="block text-xs sm:text-base font-extrabold">{v.label}</span>
                            {discountVal > 0 && (
                                <span className={`hidden sm:block text-[10px] font-medium mt-0.5 ${
                                    isSelected ? 'text-accent-copper-light' : 'text-emerald-700'
                                }`}>
                                    {discountType === 'fixed'
                                        ? `Hemat Rp ${(discountVal / 1000).toFixed(0)}k`
                                        : `Hemat ${discountVal}%`}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );

    return (
        <PublicLayout title={`${byobSettings?.hero_title || 'C.Y.B.R: Custom Your Blend Ratio'} | Sanubari Roastery`}>
            <Head>
                <meta
                    name="description"
                    content={
                        byobSettings?.hero_description ||
                        'Layanan C.Y.B.R (Custom Your Blend Ratio) Kopi Sanubari Roastery Malang. Padukan single origin lereng Gunung Kawi dan Nusantara dengan satu slider rasio persentase presisi.'
                    }
                />
            </Head>

            {/* Hero Section */}
            <div className="relative bg-brand-950 text-white overflow-hidden byob-enter">
                <div className="absolute inset-0 z-0">
                    <img
                        src={
                            resolveImageUrl(byobSettings?.hero_image) ||
                            'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=2000&q=85'
                        }
                        alt="Gunung Kawi Coffee Plantation"
                        className="w-full h-full object-cover opacity-25"
                    />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight byob-enter">
                        {byobSettings?.hero_title || 'C.Y.B.R: Custom Your Blend Ratio'}
                    </h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
                    {/* Left Column: Interactive Blending Studio */}
                    <div className="lg:col-span-8 space-y-6 sm:space-y-8">
                        {/* Section 1: Coffee Blend Studio */}
                        <div className="bg-cream-50 p-3.5 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl space-y-5 sm:space-y-8 byob-enter">
                            {/* Studio Header */}
                            <div className="flex items-center justify-between pb-2 border-b border-sand-200">
                                <div>
                                    <h2 className="text-lg sm:text-xl font-bold text-brand-950">
                                        {byobSettings?.studio_title || 'Custom Blend Studio'}
                                    </h2>
                                    <p className="text-xs sm:text-sm text-brand-700">
                                        {byobSettings?.studio_subtitle ||
                                            'Pilih 2 biji kopi dan tentukan proporsi rasio dengan 1 slider persentase.'}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setBlendRatio(byobSettings?.default_ratio ?? 70)}
                                    className="text-[11px] sm:text-sm text-brand-700 hover:text-brand-950 flex items-center gap-1 font-semibold transition-colors shrink-0"
                                    title="Reset rasio ke standar"
                                >
                                    <RotateCcw className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                    <span>Reset Rasio</span>
                                </button>
                            </div>

                            {/* Beans Selection: Inline Row on Mobile & Desktop */}
                            <div className="space-y-2 sm:space-y-3 bg-white p-2.5 sm:p-5 rounded-xl sm:rounded-2xl border border-sand-200/90 shadow-xs">
                                {/* Component A Row */}
                                <div className="flex items-center gap-2 sm:gap-3.5">
                                    <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#fca5a5] text-[#991b1b] font-bold text-xs sm:text-sm flex items-center justify-center shrink-0 shadow-2xs">
                                        A
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <Select
                                            value={String(beanAId)}
                                            onValueChange={(val: string) => {
                                                const selectedId = Number(val);
                                                if (selectedId !== beanBId) {
                                                    setBeanAId(selectedId);
                                                }
                                            }}
                                        >
                                            <SelectTrigger
                                                id="bean-a-select"
                                                className="w-full h-9 sm:h-11 px-3 sm:px-3.5 rounded-full sm:rounded-xl bg-white border border-stone-200 hover:border-stone-300 text-xs sm:text-sm font-medium text-stone-900 focus:outline-hidden shadow-2xs flex justify-between items-center cursor-pointer transition-colors"
                                            >
                                                <SelectValue placeholder="Pilih Biji Kopi A">
                                                    <span className="truncate block">{beanA?.name}</span>
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent className="bg-white border border-stone-200 rounded-xl shadow-xl z-50 max-h-72 w-(--radix-select-trigger-width) min-w-[260px] sm:min-w-[320px]">
                                                {beans.map((b) => {
                                                    const isSelectedInB = b.id === beanBId;
                                                    return (
                                                        <SelectItem
                                                            key={`a-${b.id}`}
                                                            value={String(b.id)}
                                                            textValue={b.name}
                                                            disabled={isSelectedInB}
                                                            className={`text-xs sm:text-sm py-2 sm:py-2.5 px-2.5 sm:px-3 rounded-lg pr-3 [&_[data-slot=select-item-indicator]]:hidden ${
                                                                isSelectedInB
                                                                    ? 'opacity-40 cursor-not-allowed bg-stone-50 select-none'
                                                                    : 'cursor-pointer hover:bg-stone-50 data-[highlighted]:bg-[#fee2e2] data-[highlighted]:text-[#991b1b] data-[state=checked]:bg-[#fee2e2] data-[state=checked]:text-[#991b1b] data-[state=checked]:font-semibold'
                                                            }`}
                                                        >
                                                            <div className="flex items-center justify-between w-full gap-2 sm:gap-4">
                                                                <span className={`truncate ${isSelectedInB ? 'text-stone-400' : ''}`}>
                                                                    {b.name}
                                                                </span>
                                                                <span className="text-[11px] sm:text-xs shrink-0 text-right">
                                                                    {isSelectedInB ? (
                                                                        <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full text-[10px] font-semibold border border-amber-200">
                                                                            Dipilih di B
                                                                        </span>
                                                                    ) : (
                                                                        <span className="text-stone-400 font-normal">
                                                                            {b.origin || b.process || 'Kawi'}
                                                                        </span>
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </SelectItem>
                                                    );
                                                })}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <span className="text-xs sm:text-base font-extrabold text-stone-900 shrink-0 min-w-8 sm:min-w-12 text-right tabular-nums">
                                        {blendRatio}<span className="text-stone-400 font-semibold ml-0.5">%</span>
                                    </span>
                                </div>

                                {/* Component B Row */}
                                <div className="flex items-center gap-2 sm:gap-3.5">
                                    <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#fde047] text-[#854d0e] font-bold text-xs sm:text-sm flex items-center justify-center shrink-0 shadow-2xs">
                                        B
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <Select
                                            value={String(beanBId)}
                                            onValueChange={(val: string) => {
                                                const selectedId = Number(val);
                                                if (selectedId !== beanAId) {
                                                    setBeanBId(selectedId);
                                                }
                                            }}
                                        >
                                            <SelectTrigger
                                                id="bean-b-select"
                                                className="w-full h-9 sm:h-11 px-3 sm:px-3.5 rounded-full sm:rounded-xl bg-white border border-stone-200 hover:border-stone-300 text-xs sm:text-sm font-medium text-stone-900 focus:outline-hidden shadow-2xs flex justify-between items-center cursor-pointer transition-colors"
                                            >
                                                <SelectValue placeholder="Pilih Biji Kopi B">
                                                    <span className="truncate block">{beanB?.name}</span>
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent className="bg-white border border-stone-200 rounded-xl shadow-xl z-50 max-h-72 w-(--radix-select-trigger-width) min-w-[260px] sm:min-w-[320px]">
                                                {beans.map((b) => {
                                                    const isSelectedInA = b.id === beanAId;
                                                    return (
                                                        <SelectItem
                                                            key={`b-${b.id}`}
                                                            value={String(b.id)}
                                                            textValue={b.name}
                                                            disabled={isSelectedInA}
                                                            className={`text-xs sm:text-sm py-2 sm:py-2.5 px-2.5 sm:px-3 rounded-lg pr-3 [&_[data-slot=select-item-indicator]]:hidden ${
                                                                isSelectedInA
                                                                    ? 'opacity-40 cursor-not-allowed bg-stone-50 select-none'
                                                                    : 'cursor-pointer hover:bg-stone-50 data-[highlighted]:bg-[#fef9c3] data-[highlighted]:text-[#854d0e] data-[state=checked]:bg-[#fef9c3] data-[state=checked]:text-[#854d0e] data-[state=checked]:font-semibold'
                                                            }`}
                                                        >
                                                            <div className="flex items-center justify-between w-full gap-2 sm:gap-4">
                                                                <span className={`truncate ${isSelectedInA ? 'text-stone-400' : ''}`}>
                                                                    {b.name}
                                                                </span>
                                                                <span className="text-[11px] sm:text-xs shrink-0 text-right">
                                                                    {isSelectedInA ? (
                                                                        <span className="text-red-700 bg-red-50 px-2 py-0.5 rounded-full text-[10px] font-semibold border border-red-200">
                                                                            Dipilih di A
                                                                        </span>
                                                                    ) : (
                                                                        <span className="text-stone-400 font-normal">
                                                                            {b.origin || b.process || 'Nusantara'}
                                                                        </span>
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </SelectItem>
                                                    );
                                                })}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <span className="text-xs sm:text-base font-extrabold text-stone-900 shrink-0 min-w-8 sm:min-w-12 text-right tabular-nums">
                                        {100 - blendRatio}<span className="text-stone-400 font-semibold ml-0.5">%</span>
                                    </span>
                                </div>
                            </div>

                            {/* Single Unified Percentage Slider with Dual-Color Proportions */}
                            <div className="space-y-4 pt-2 byob-enter">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                    <div>
                                        <h3 className="text-lg font-bold text-brand-950 flex items-center gap-2">
                                            <SlidersHorizontal className="w-5 h-5 text-accent-copper" />
                                            <span>Blend Ratio</span>
                                        </h3>
                                        <p className="text-sm text-brand-700">
                                            Geser slider di bawah untuk mengatur persentase rasio secara real-time.
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-950 text-white text-xs font-bold shadow-xs">
                                            <span className="w-2 h-2 rounded-full bg-sand-300" />
                                            <span>A: </span><SlidingNumber number={blendRatio} /><span>%</span>
                                        </span>
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#9a3412] text-white text-xs font-bold shadow-xs">
                                            <span className="w-2 h-2 rounded-full bg-white" />
                                            <span>B: </span><SlidingNumber number={100 - blendRatio} /><span>%</span>
                                        </span>
                                    </div>
                                </div>

                                {/* Dual-Colored Track Percentage Slider */}
                                <div className="relative py-3 select-none">
                                    {/* Visual Dual-Colored Track Bar */}
                                    <div className="relative w-full h-9 rounded-full overflow-hidden shadow-inner bg-sand-200 flex">
                                        {/* Component A Segment */}
                                        <div
                                            style={{ width: `${blendRatio}%` }}
                                            className="h-full bg-brand-950 text-white flex items-center justify-start pl-4 text-xs sm:text-sm font-extrabold tracking-wide transition-all duration-75 overflow-hidden whitespace-nowrap"
                                            title={`Component A: ${blendRatio}%`}
                                        >
                                            {blendRatio >= 22 ? `${blendRatio}% ${beanA?.name?.split(' ')[0] || 'Component A'}` : `${blendRatio}%`}
                                        </div>

                                        {/* Component B Segment */}
                                        <div
                                            style={{ width: `${100 - blendRatio}%` }}
                                            className="h-full bg-[#9a3412] text-white flex items-center justify-end pr-4 text-xs sm:text-sm font-extrabold tracking-wide transition-all duration-75 overflow-hidden whitespace-nowrap"
                                            title={`Component B: ${100 - blendRatio}%`}
                                        >
                                            {100 - blendRatio >= 22 ? `${beanB?.name?.split(' ')[0] || 'Component B'} ${100 - blendRatio}%` : `${100 - blendRatio}%`}
                                        </div>
                                    </div>

                                    {/* Draggable Divider Knob Indicator */}
                                    <div
                                        style={{ left: `${blendRatio}%` }}
                                        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow-lg border-2 border-brand-950 flex items-center justify-center pointer-events-none z-10 transition-all duration-75"
                                    >
                                        <div className="flex gap-0.5">
                                            <div className="w-0.5 h-3 bg-brand-800 rounded-full" />
                                            <div className="w-0.5 h-3 bg-brand-800 rounded-full" />
                                        </div>
                                    </div>

                                    {/* Range Input Layered Over */}
                                    <input
                                        type="range"
                                        min="10"
                                        max="90"
                                        step="10"
                                        value={blendRatio}
                                        onChange={(e) => setBlendRatio(Number(e.target.value))}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                                        aria-label="Blend Ratio Percentage"
                                    />
                                </div>

                                {/* Mobile-only: Package Size Variant above Formula Blend */}
                                {renderPackageSizeSelector('block lg:hidden')}

                                {/* Live Formula Banner */}
                                <div className="bg-sand-100/90 border border-sand-200/80 rounded-xl p-4 sm:p-5 space-y-3">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-2.5 border-b border-sand-200/80">
                                        <span className="text-sm font-medium text-brand-800">
                                            Formula Blend:
                                        </span>
                                        <strong className="text-base text-brand-950 font-extrabold">
                                            {recipeString}
                                        </strong>
                                    </div>

                                    {/* Total Price Display */}
                                    <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                        <div className="flex items-baseline flex-wrap gap-2">
                                            <span className="text-sm font-semibold text-brand-800">
                                                Total Harga ({selectedVariant?.label || 'Kemasan'}):
                                            </span>
                                            {hasDiscount && (
                                                <del className="text-sm font-medium text-stone-400">
                                                    {formatRupiah(basePricePerBag)}
                                                </del>
                                            )}
                                            <strong className="text-xl font-black text-brand-950">
                                                {formatRupiah(pricePerBag)}
                                            </strong>
                                            {hasDiscount && (
                                                <span className="text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 tracking-wide">
                                                    {discountBadge}
                                                </span>
                                            )}
                                        </div>
                                        {quantity > 1 && (
                                            <div className="flex items-baseline gap-2 text-right">
                                                <span className="text-xs text-brand-600">
                                                    Total ({quantity} kemasan):
                                                </span>
                                                <strong className="text-xl font-black text-accent-copper">
                                                    {formatRupiah(totalPrice)}
                                                </strong>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Possible Notes */}
                        <div className="bg-cream-50 p-5 sm:p-6 rounded-2xl space-y-3 byob-enter">
                            <span className="block text-sm font-bold text-brand-800">
                                {byobSettings?.possible_notes_title || 'Possible Notes:'}
                            </span>
                            <div className="flex flex-wrap gap-2">
                                {combinedNotes.length > 0 ? (
                                    combinedNotes.map((note) => (
                                        <span
                                            key={note}
                                            className="px-3 py-1 rounded-full bg-sand-200/90 text-brand-950 text-xs sm:text-sm font-medium"
                                        >
                                            {note}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-xs sm:text-sm text-brand-600 italic">
                                        Profil rasa seimbang dan manis alami.
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Packaging, Grind Size, Summary & Add to Cart */}
                    <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
                        <div className="bg-cream-50 p-6 sm:p-8 rounded-2xl space-y-6 byob-enter">
                            {/* Pack Shot Real Image */}
                            <div className="aspect-16/10 rounded-xl overflow-hidden bg-sand-100">
                                <img
                                    src={
                                        resolveImageUrl(byobSettings?.packshot_image) ||
                                        'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=600&q=80'
                                    }
                                    alt="Sanubari Coffee Packaging"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Custom Blend Name (Optional) */}
                            <div className="space-y-2">
                                <label htmlFor="blend-name-input" className="block text-sm font-semibold text-brand-800">
                                    Name Your Blend (Opsional):
                                </label>
                                <input
                                    id="blend-name-input"
                                    type="text"
                                    value={customBlendName}
                                    onChange={(e) => setCustomBlendName(e.target.value)}
                                    placeholder="Contoh: Morning Espresso House Blend"
                                    className="w-full px-4 py-3 rounded-xl bg-white text-base text-brand-950 focus:outline-hidden"
                                />
                            </div>

                            {/* Package Size Variant (Desktop) */}
                            {renderPackageSizeSelector('hidden lg:block')}

                            {/* Grind Option */}
                            <div className="space-y-2 sm:space-y-2.5">
                                <span className="block text-sm sm:text-base font-semibold text-brand-800">
                                    Grind Size (Pilihan Gilingan):
                                </span>
                                <div className="space-y-2">
                                    {grindOptions.map((opt) => (
                                        <label
                                            key={opt}
                                            className={`flex items-center gap-2.5 py-2.5 px-3.5 rounded-xl cursor-pointer transition-colors text-[13.5px] sm:text-sm ${
                                                grindOption === opt
                                                    ? 'bg-brand-900 text-white font-semibold shadow-xs'
                                                    : 'bg-white hover:bg-sand-100 text-brand-900 border border-sand-200/60'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="grind"
                                                checked={grindOption === opt}
                                                onChange={() => setGrindOption(opt)}
                                                className="accent-accent-copper w-4 h-4 shrink-0 cursor-pointer"
                                            />
                                            <span className="leading-snug">{opt}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Quantity Selector */}
                            <div className="flex items-center justify-between pt-2">
                                <span className="text-sm font-semibold text-brand-800">Jumlah Kemasan:</span>
                                <div data-ui="stepper" className="flex items-center rounded-xl bg-white overflow-hidden">
                                    <button
                                        type="button"
                                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                        className="p-2.5 hover:bg-sand-100 text-brand-700"
                                        aria-label="Kurangi jumlah"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="px-5 text-base font-bold text-brand-950">{quantity}</span>
                                    <button
                                        type="button"
                                        onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                                        className="p-2.5 hover:bg-sand-100 text-brand-700"
                                        aria-label="Tambah jumlah"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Price Summary */}
                            <div className="bg-sand-100/80 p-5 rounded-xl space-y-2.5">
                                <div className="flex items-center justify-between text-sm text-brand-700">
                                    <span>Harga per kemasan ({selectedVariant?.label || 'Kemasan'}):</span>
                                    <div className="flex items-baseline gap-2">
                                        {hasDiscount && (
                                            <del className="text-xs text-stone-400">
                                                {formatRupiah(basePricePerBag)}
                                            </del>
                                        )}
                                        <span className="font-bold text-brand-950">
                                            {formatRupiah(pricePerBag)}
                                        </span>
                                    </div>
                                </div>
                                {hasDiscount && (
                                    <div className="flex items-center justify-between text-xs text-emerald-800 font-semibold bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-100">
                                        <span>Potongan Diskon Kemasan:</span>
                                        <span>
                                            - {formatRupiah(discountAmountPerBag * quantity)} ({discountLabel})
                                        </span>
                                    </div>
                                )}
                                <div className="flex items-center justify-between text-base font-extrabold text-brand-950 pt-2 border-t border-sand-200/60">
                                    <span>Total Pembelian ({quantity}x):</span>
                                    <span className="text-lg text-accent-copper font-black">
                                        {formatRupiah(totalPrice)}
                                    </span>
                                </div>
                            </div>

                            {/* Same bean warning if ever occurs */}
                            {isSameBean && (
                                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium flex items-center gap-2">
                                    <span>⚠️ Biji kopi A dan B tidak boleh sama. Silakan pilih 2 biji kopi yang berbeda untuk racikan Anda.</span>
                                </div>
                            )}

                            {/* Add To Cart Button - Exact wording requested by user */}
                            <button
                                type="button"
                                onClick={handleAddToCart}
                                disabled={isSameBean}
                                className={`w-full py-4 px-5 rounded-xl text-white font-bold text-base transition-all duration-150 active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm ${
                                    isSameBean
                                        ? 'bg-stone-300 text-stone-500 cursor-not-allowed shadow-none'
                                        : addedSuccess
                                          ? 'bg-emerald-700'
                                          : 'bg-brand-700 hover:bg-brand-800'
                                }`}
                            >
                                {isSameBean ? (
                                    <span>Pilih 2 Biji Kopi yang Berbeda</span>
                                ) : addedSuccess ? (
                                    <>
                                        <Check className="w-5 h-5 text-emerald-200" />
                                        <span>Berhasil Ditambahkan ke Keranjang</span>
                                    </>
                                ) : (
                                    <>
                                        <ShoppingBag className="w-5 h-5" />
                                        <span>Tambahkan ke keranjang</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
