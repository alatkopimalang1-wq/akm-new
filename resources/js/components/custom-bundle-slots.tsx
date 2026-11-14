import React, { useMemo, useState } from 'react';
import { Link } from '@inertiajs/react';
import { CheckCircle2, Layers, MessageCircle, ShoppingBag, X } from 'lucide-react';
import { Product, ProductVariant, useCart } from '@/context/cart-context';
import { formatRupiah } from '@/lib/trans';

export interface BundleCandidateProduct {
    id: number;
    variant_id: number;
    name: string;
    slug: string;
    producer?: string | null;
    image_url: string;
    normal_price: number;
    bundle_price: number;
    weight_grams: number;
    is_out_of_stock: boolean;
}

export interface ResolvedBundleSlot {
    index: number;
    slot_type: 'required' | 'optional' | 'free';
    slot_label: string;
    free_product?: BundleCandidateProduct | null;
    candidates: BundleCandidateProduct[];
}

interface CustomBundleSlotsProps {
    product: Product;
    defaultVariant: ProductVariant;
    slots: ResolvedBundleSlot[];
    whatsappNumber?: string;
    onTotalChange?: (bundleTotal: number, normalTotal: number) => void;
}

export const CustomBundleSlots: React.FC<CustomBundleSlotsProps> = ({
    product,
    defaultVariant,
    slots,
    whatsappNumber = '6285121930454',
    onTotalChange,
}) => {
    const { addItem } = useCart();

    // Map of slotIndex -> selected BundleCandidateProduct
    const [selectedBySlot, setSelectedBySlot] = useState<Record<number, BundleCandidateProduct>>({});
    const [activeModalSlotIndex, setActiveModalSlotIndex] = useState<number | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [validationMessage, setValidationMessage] = useState<string | null>(null);
    const [isAdded, setIsAdded] = useState(false);

    const activeModalSlot = useMemo(
        () => (activeModalSlotIndex !== null ? slots.find((s) => s.index === activeModalSlotIndex) || null : null),
        [activeModalSlotIndex, slots],
    );

    // Calculate totals across all selected required/optional slots + free slots
    const { totalNormalPrice, totalBundlePrice, totalWeightGrams, unfulfilledRequiredIndices } = useMemo(() => {
        let normalSum = 0;
        let bundleSum = 0;
        let weightSum = 0;
        const missingReq: number[] = [];

        for (const slot of slots) {
            if (slot.slot_type === 'free') {
                if (slot.free_product) {
                    normalSum += Number(slot.free_product.normal_price) || 0;
                    // bundle_price is 0 for free items
                    weightSum += Number(slot.free_product.weight_grams) || 200;
                }
            } else {
                const chosen = selectedBySlot[slot.index];
                if (chosen) {
                    normalSum += Number(chosen.normal_price) || 0;
                    bundleSum += Number(chosen.bundle_price) || 0;
                    weightSum += Number(chosen.weight_grams) || 500;
                } else if (slot.slot_type === 'required') {
                    missingReq.push(slot.index);
                }
            }
        }

        // If no slot has been selected yet, fallback display price to product's base variant price
        return {
            totalNormalPrice: normalSum,
            totalBundlePrice: bundleSum,
            totalWeightGrams: Math.max(500, weightSum),
            unfulfilledRequiredIndices: missingReq,
        };
    }, [slots, selectedBySlot]);

    React.useEffect(() => {
        if (onTotalChange) {
            onTotalChange(totalBundlePrice, totalNormalPrice);
        }
    }, [totalBundlePrice, totalNormalPrice, onTotalChange]);

    const handleSelectCandidate = (slotIndex: number, candidate: BundleCandidateProduct) => {
        if (candidate.is_out_of_stock) return;
        setSelectedBySlot((prev) => ({
            ...prev,
            [slotIndex]: candidate,
        }));
        setValidationMessage(null);
        setActiveModalSlotIndex(null);
    };

    const handleClearSlot = (slotIndex: number) => {
        setSelectedBySlot((prev) => {
            const next = { ...prev };
            delete next[slotIndex];
            return next;
        });
        setActiveModalSlotIndex(null);
    };

    const ensureAllRequiredSelected = (): boolean => {
        if (unfulfilledRequiredIndices.length > 0) {
            const firstMissingIdx = unfulfilledRequiredIndices[0];
            setValidationMessage('Silakan pilih produk pada semua kotak slot wajib (+) terlebih dahulu.');
            setActiveModalSlotIndex(firstMissingIdx);
            return false;
        }
        setValidationMessage(null);
        return true;
    };

    const buildCustomNotes = (): string => {
        const parts: string[] = [];
        slots.forEach((slot, idx) => {
            if (slot.slot_type === 'free' && slot.free_product) {
                parts.push(`[GRATIS] ${slot.free_product.name} (Rp 0)`);
            } else {
                const chosen = selectedBySlot[slot.index];
                if (chosen) {
                    const tag = slot.slot_type === 'optional' ? '[OPSIONAL]' : `[Slot ${idx + 1}]`;
                    parts.push(`${tag} ${chosen.name} (${formatRupiah(chosen.bundle_price)})`);
                }
            }
        });
        return parts.join(' | ');
    };

    const handleBuyNow = () => {
        if (!ensureAllRequiredSelected()) return;

        const finalUnitPrice = totalBundlePrice > 0 ? totalBundlePrice : Number(defaultVariant.price || product.min_price || 0);

        const customVariant: ProductVariant = {
            ...defaultVariant,
            label: 'Paket Custom Lengkap',
            price: finalUnitPrice,
            original_price: totalNormalPrice > finalUnitPrice ? totalNormalPrice : undefined,
            weight_grams: totalWeightGrams,
        };

        addItem(product, customVariant, Math.max(1, quantity), 'Paket Custom', buildCustomNotes());
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 1500);
    };

    const handleBuyViaWhatsApp = () => {
        if (!ensureAllRequiredSelected()) return;

        const finalUnitPrice = totalBundlePrice > 0 ? totalBundlePrice : Number(defaultVariant.price || product.min_price || 0);
        const cleanWa = whatsappNumber.replace(/[^0-9]/g, '') || '6285121930454';

        let msg = `Halo Alat Kopi Malang! Saya ingin memesan paket:\n*${product.name}* (Qty: ${quantity} Paket)\n\n*RINCIAN ISI PAKET:*\n`;

        slots.forEach((slot, i) => {
            if (slot.slot_type === 'free' && slot.free_product) {
                msg += `${i + 1}. [GRATIS] ${slot.free_product.name} — ~~${formatRupiah(slot.free_product.normal_price)}~~ *Rp 0*\n`;
            } else {
                const chosen = selectedBySlot[slot.index];
                if (chosen) {
                    const label = slot.slot_type === 'optional' ? ' [OPTIONAL]' : '';
                    msg += `${i + 1}.${label} ${chosen.name} — ~~${formatRupiah(chosen.normal_price)}~~ *${formatRupiah(chosen.bundle_price)}*\n`;
                }
            }
        });

        msg += `\n*TOTAL HARGA PAKET:*\n`;
        if (totalNormalPrice > finalUnitPrice) {
            msg += `• Harga Normal: ~~${formatRupiah(totalNormalPrice * quantity)}~~\n`;
            msg += `• Hemat: ${formatRupiah((totalNormalPrice - finalUnitPrice) * quantity)}\n`;
        }
        msg += `• *Total Bayar: ${formatRupiah(finalUnitPrice * quantity)}*\n\nMohon konfirmasi ketersediaan stok & pengiriman. Terima kasih!`;

        window.open(`https://wa.me/${cleanWa}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="space-y-5">
            {/* Top Quantity Input & Action Buttons (Matching Video 00:00) */}
            <div className="space-y-2.5">
                <div className="flex items-center gap-3">
                    <input
                        type="number"
                        min={1}
                        max={50}
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                        className="w-28 py-2.5 px-3 text-center text-sm font-bold text-brand-950 bg-white border border-sand-300 rounded-lg focus:outline-none focus:border-brand-700"
                    />
                    {totalBundlePrice > 0 && (
                        <div className="text-right flex-1">
                            {totalNormalPrice > totalBundlePrice && (
                                <span className="block text-xs font-bold text-red-600 line-through">
                                    {formatRupiah(totalNormalPrice * quantity)}
                                </span>
                            )}
                            <span className="text-lg sm:text-xl font-black text-brand-950">
                                {formatRupiah(totalBundlePrice * quantity)}
                            </span>
                        </div>
                    )}
                </div>

                {validationMessage && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-700">
                        {validationMessage}
                    </div>
                )}

                <button
                    type="button"
                    onClick={handleBuyNow}
                    className={`w-full py-3.5 px-5 rounded-lg font-bold text-sm text-white shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] ${
                        isAdded ? 'bg-emerald-700' : 'bg-[#2b7a91] hover:bg-[#236477]'
                    }`}
                >
                    {isAdded ? (
                        <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Paket Berhasil Masuk Keranjang!</span>
                        </>
                    ) : (
                        <>
                            <ShoppingBag className="w-4 h-4" />
                            <span>Beli sekarang</span>
                        </>
                    )}
                </button>

                <button
                    type="button"
                    onClick={handleBuyViaWhatsApp}
                    className="w-full py-3.5 px-5 rounded-lg font-bold text-sm text-white bg-[#28a745] hover:bg-[#218838] shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                >
                    <MessageCircle className="w-4 h-4" />
                    <span>Beli Lewat WhatsApp</span>
                </button>
            </div>

            {/* 3-Column Grid of Slot Boxes (Matching Video 00:01 - 00:26) */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5 pt-2">
                {slots.map((slot) => {
                    // Case 1: FREE Slot (GRATIS Rp0)
                    if (slot.slot_type === 'free') {
                        const freeProd = slot.free_product;
                        if (!freeProd) return null;
                        return (
                            <div
                                key={slot.index}
                                className="relative bg-white border border-neutral-300 rounded-xl p-2.5 sm:p-3 flex flex-col items-center justify-between text-center shadow-2xs"
                            >
                                <div className="w-full aspect-square rounded-lg overflow-hidden bg-white flex items-center justify-center p-1">
                                    <img
                                        src={freeProd.image_url}
                                        alt={freeProd.name}
                                        className="w-full h-full object-contain"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="mt-2 space-y-0.5 w-full">
                                    <p className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wide text-neutral-800">
                                        GRATIS
                                    </p>
                                    <div className="flex flex-wrap items-center justify-center gap-1 text-[10px] sm:text-xs leading-tight">
                                        <span className="text-red-600 line-through font-semibold">
                                            {formatRupiah(freeProd.normal_price)}
                                        </span>
                                        <span className="font-extrabold text-neutral-950">Rp0</span>
                                    </div>
                                </div>
                            </div>
                        );
                    }

                    // Case 2: REQUIRED or OPTIONAL Interactive Slot
                    const chosen = selectedBySlot[slot.index];
                    const isOptional = slot.slot_type === 'optional';

                    return (
                        <button
                            key={slot.index}
                            type="button"
                            onClick={() => setActiveModalSlotIndex(slot.index)}
                            className={`group relative bg-white border rounded-xl p-2 sm:p-3 flex flex-col items-center justify-between text-center transition-all cursor-pointer overflow-hidden min-h-[155px] sm:min-h-[195px] ${
                                chosen
                                    ? 'border-brand-700 ring-1 ring-brand-700/20 shadow-xs'
                                    : 'border-neutral-300 hover:border-neutral-500 shadow-2xs'
                            }`}
                        >
                            {/* Diagonal OPTIONAL Ribbon in Top-Left Corner (Matching Video 00:05) */}
                            {isOptional && (
                                <div className="absolute top-0 left-0 w-20 h-20 overflow-hidden pointer-events-none z-10">
                                    <span className="absolute top-3 -left-6 w-24 py-0.5 bg-[#ff4d6d] text-white text-[9px] font-extrabold uppercase tracking-wider text-center -rotate-45 shadow-xs">
                                        OPTIONAL
                                    </span>
                                </div>
                            )}

                            {chosen ? (
                                <>
                                    <div className="w-full aspect-square rounded-lg overflow-hidden bg-white flex items-center justify-center p-1">
                                        <img
                                            src={chosen.image_url}
                                            alt={chosen.name}
                                            className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                                        />
                                    </div>
                                    <div className="mt-2 space-y-1 w-full">
                                        <p className="text-[11px] sm:text-xs font-medium text-neutral-800 line-clamp-2 leading-snug">
                                            {chosen.name}
                                        </p>
                                        <div className="space-y-0.5">
                                            {chosen.normal_price > chosen.bundle_price && (
                                                <p className="text-[10px] sm:text-xs font-semibold text-red-600 line-through leading-none">
                                                    {formatRupiah(chosen.normal_price)}
                                                </p>
                                            )}
                                            <p className="text-[11px] sm:text-xs font-extrabold text-neutral-950 leading-none">
                                                {formatRupiah(chosen.bundle_price)}
                                            </p>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="w-full aspect-square rounded-lg bg-neutral-100 group-hover:bg-neutral-200/70 transition-colors flex items-center justify-center">
                                        <span className="text-2xl sm:text-3xl font-light text-neutral-800">+</span>
                                    </div>
                                    <p className="mt-2 text-[11px] sm:text-xs font-bold text-neutral-900 leading-tight px-1">
                                        {slot.slot_label || 'Please select a product!'}
                                    </p>
                                </>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Line-by-Line Slot Summary Table Below Grid (Matching Video 00:06 - 00:08 & 00:25) */}
            <div className="border-t border-neutral-200 divide-y divide-neutral-200/80 text-xs sm:text-sm">
                {slots.map((slot) => {
                    if (slot.slot_type === 'free') {
                        const freeProd = slot.free_product;
                        if (!freeProd) return null;
                        return (
                            <div
                                key={`row-${slot.index}`}
                                className="py-3 flex items-center justify-between gap-3"
                            >
                                <div className="flex-1 min-w-0">
                                    <Link
                                        href={`/shop/${freeProd.slug}`}
                                        className="text-neutral-700 underline hover:text-brand-900 truncate block"
                                    >
                                        {freeProd.name}
                                    </Link>
                                </div>
                                <div className="w-10 text-center text-neutral-600 font-medium">1</div>
                                <div className="w-36 sm:w-44 text-right flex items-center justify-end gap-2">
                                    <span className="text-red-600 line-through font-semibold">
                                        {formatRupiah(freeProd.normal_price)}
                                    </span>
                                    <span className="font-extrabold text-neutral-900">Rp0</span>
                                </div>
                            </div>
                        );
                    }

                    const chosen = selectedBySlot[slot.index];
                    const isOptional = slot.slot_type === 'optional';

                    if (!chosen) {
                        return (
                            <div
                                key={`row-${slot.index}`}
                                onClick={() => setActiveModalSlotIndex(slot.index)}
                                className="py-3 flex items-center justify-between gap-3 cursor-pointer hover:bg-neutral-50 transition-colors"
                            >
                                <div className="flex-1 min-w-0 flex flex-wrap items-center gap-1.5">
                                    <span className="text-neutral-700">Please select your product!</span>
                                    {isOptional && (
                                        <span className="px-1.5 py-0.5 rounded bg-[#ff4d6d] text-white text-[9px] font-extrabold uppercase">
                                            OPTIONAL
                                        </span>
                                    )}
                                </div>
                                <div className="w-10 text-center text-neutral-900 text-base">☛</div>
                                <div className="w-36 sm:w-44 text-right flex items-center justify-end gap-4 text-neutral-500 font-mono">
                                    <span>-----</span>
                                    <span>-----</span>
                                </div>
                            </div>
                        );
                    }

                    return (
                        <div
                            key={`row-${slot.index}`}
                            className="py-3 flex items-center justify-between gap-3"
                        >
                            <div className="flex-1 min-w-0">
                                <Link
                                    href={`/shop/${chosen.slug}`}
                                    className="text-neutral-700 underline hover:text-brand-900 line-clamp-2"
                                >
                                    {chosen.name}
                                </Link>
                            </div>
                            <div className="w-10 text-center text-neutral-600 font-medium">1</div>
                            <div className="w-36 sm:w-44 text-right">
                                {chosen.normal_price > chosen.bundle_price && (
                                    <span className="block text-red-600 line-through font-semibold text-xs">
                                        {formatRupiah(chosen.normal_price)}
                                    </span>
                                )}
                                <span className="block font-extrabold text-neutral-900">
                                    {formatRupiah(chosen.bundle_price)}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Pop-up Modal: "Please Select Your Product" (Matching Video 00:10 - 00:32) */}
            {activeModalSlot && (
                <div
                    className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-[1px] flex items-center justify-center p-3 sm:p-4"
                    onClick={() => setActiveModalSlotIndex(null)}
                >
                    <div
                        className="bg-white rounded-xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-neutral-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="px-4 py-3.5 border-b border-neutral-200 flex items-center justify-between relative">
                            <h3 className="text-sm sm:text-base font-bold text-neutral-900 text-center w-full">
                                Please Select Your Product
                            </h3>
                            <button
                                type="button"
                                onClick={() => setActiveModalSlotIndex(null)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-neutral-700 hover:text-black cursor-pointer"
                                aria-label="Tutup modal"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Optional Slot Clear Button if already selected */}
                        {activeModalSlot.slot_type === 'optional' && selectedBySlot[activeModalSlot.index] && (
                            <div className="px-4 pt-3">
                                <button
                                    type="button"
                                    onClick={() => handleClearSlot(activeModalSlot.index)}
                                    className="w-full py-2 px-3 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold border border-red-200 transition-colors cursor-pointer"
                                >
                                    Kosongkan Pilihan Slot Opsional Ini
                                </button>
                            </div>
                        )}

                        {/* Modal 2-Column Product Grid */}
                        <div className="p-3.5 sm:p-4 overflow-y-auto grid grid-cols-2 gap-3">
                            {activeModalSlot.candidates.length === 0 ? (
                                <div className="col-span-2 py-10 text-center text-xs text-neutral-500">
                                    Belum ada produk yang diatur untuk slot ini.
                                </div>
                            ) : (
                                activeModalSlot.candidates.map((cand) => {
                                    const isSelected = selectedBySlot[activeModalSlot.index]?.id === cand.id;
                                    return (
                                        <button
                                            key={cand.id}
                                            type="button"
                                            disabled={cand.is_out_of_stock}
                                            onClick={() => handleSelectCandidate(activeModalSlot.index, cand)}
                                            className={`group relative bg-white rounded-xl border p-2.5 flex flex-col justify-between text-center transition-all ${
                                                cand.is_out_of_stock
                                                    ? 'border-neutral-200 opacity-85 cursor-not-allowed'
                                                    : isSelected
                                                      ? 'border-brand-700 ring-2 ring-brand-700/25 shadow-md cursor-pointer'
                                                      : 'border-neutral-300 hover:border-brand-700 hover:shadow-md cursor-pointer'
                                            }`}
                                        >
                                            {/* Top Right Gallery / Stack Icon (Matching Video 00:11) */}
                                            <span className="absolute top-2 right-2 z-10 w-6 h-6 rounded-md bg-neutral-900/80 text-white flex items-center justify-center">
                                                <Layers className="w-3.5 h-3.5" />
                                            </span>

                                            {/* Product Thumbnail */}
                                            <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-white flex items-center justify-center p-1">
                                                <img
                                                    src={cand.image_url}
                                                    alt={cand.name}
                                                    className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                                                    loading="lazy"
                                                />

                                                {/* OUT OF STOCK Stamp (Matching Video 00:18) */}
                                                {cand.is_out_of_stock && (
                                                    <div className="absolute inset-0 bg-white/50 flex items-center justify-center p-2">
                                                        <span className="px-2.5 py-1 border-2 border-red-600 text-red-600 bg-white/95 font-black text-xs uppercase tracking-wider -rotate-12 shadow-sm">
                                                            OUT OF STOCK
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Title & Strikethrough Discount Price */}
                                            <div className="mt-2.5 space-y-1.5 w-full">
                                                <p className="text-xs font-medium text-neutral-800 line-clamp-2 leading-snug">
                                                    {cand.name}
                                                </p>
                                                <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs pt-0.5">
                                                    {cand.normal_price > cand.bundle_price && (
                                                        <span className="text-red-600 line-through font-semibold">
                                                            {formatRupiah(cand.normal_price)}
                                                        </span>
                                                    )}
                                                    <span className="font-extrabold text-neutral-950">
                                                        {formatRupiah(cand.bundle_price)}
                                                    </span>
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
