import React, { useMemo, useState } from 'react';
import { Link } from '@inertiajs/react';
import { ArrowLeft, Check, CheckCircle2, Layers, MessageCircle, ShoppingBag, X } from 'lucide-react';
import { Product, ProductVariant, useCart } from '@/context/cart-context';
import { formatRupiah } from '@/lib/trans';

export interface BundleCandidateVariant {
    id: number;
    label: string;
    normal_price: number;
    bundle_price: number;
    weight_grams: number;
    image_url: string;
    is_out_of_stock: boolean;
}

export interface BundleCandidateProduct {
    id: number;
    variant_id: number;
    variant_label?: string | null;
    name: string;
    slug: string;
    producer?: string | null;
    image_url: string;
    normal_price: number;
    bundle_price: number;
    weight_grams: number;
    is_out_of_stock: boolean;
    variants?: BundleCandidateVariant[];
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

function hasMultipleVariants(cand?: BundleCandidateProduct | null): boolean {
    return Boolean(cand?.variants && cand.variants.length > 1);
}

export const CustomBundleSlots: React.FC<CustomBundleSlotsProps> = ({
    product,
    defaultVariant,
    slots,
    whatsappNumber = '6285121930454',
    onTotalChange,
}) => {
    const { addItem } = useCart();

    // Map of slotIndex -> selected BundleCandidateProduct (with chosen variant applied)
    const [selectedBySlot, setSelectedBySlot] = useState<Record<number, BundleCandidateProduct>>({});
    const [activeModalSlotIndex, setActiveModalSlotIndex] = useState<number | null>(null);

    // State for mandatory variant selection step inside the modal
    const [pendingCandidate, setPendingCandidate] = useState<BundleCandidateProduct | null>(null);
    const [pendingVariantId, setPendingVariantId] = useState<number | null>(null);
    const [variantError, setVariantError] = useState<string | null>(null);

    const [quantity, setQuantity] = useState<number>(1);
    const [validationMessage, setValidationMessage] = useState<string | null>(null);
    const [isAdded, setIsAdded] = useState(false);

    const activeModalSlot = useMemo(
        () => (activeModalSlotIndex !== null ? slots.find((s) => s.index === activeModalSlotIndex) || null : null),
        [activeModalSlotIndex, slots],
    );

    const openSlotModal = (slotIndex: number) => {
        const targetSlot = slots.find((s) => s.index === slotIndex);
        setActiveModalSlotIndex(slotIndex);
        setVariantError(null);

        // If opening a free slot that has multiple variants, go straight to variant selection for that free product
        if (targetSlot?.slot_type === 'free' && targetSlot.free_product && hasMultipleVariants(targetSlot.free_product)) {
            setPendingCandidate(targetSlot.free_product);
            const alreadyChosen = selectedBySlot[slotIndex];
            setPendingVariantId(alreadyChosen ? alreadyChosen.variant_id : null);
        } else {
            setPendingCandidate(null);
            setPendingVariantId(null);
        }
    };

    const closeSlotModal = () => {
        setActiveModalSlotIndex(null);
        setPendingCandidate(null);
        setPendingVariantId(null);
        setVariantError(null);
    };

    // Calculate totals across all selected required/optional slots + free slots
    const { totalNormalPrice, totalBundlePrice, totalWeightGrams, unfulfilledRequiredIndices, unfulfilledFreeVariantIndices } =
        useMemo(() => {
            let normalSum = 0;
            let bundleSum = 0;
            let weightSum = 0;
            const missingReq: number[] = [];
            const missingFreeVar: number[] = [];

            for (const slot of slots) {
                if (slot.slot_type === 'free') {
                    const freeProd = selectedBySlot[slot.index] || slot.free_product;
                    if (freeProd) {
                        normalSum += Number(freeProd.normal_price) || 0;
                        weightSum += Number(freeProd.weight_grams) || 200;
                        if (hasMultipleVariants(slot.free_product) && !selectedBySlot[slot.index]) {
                            missingFreeVar.push(slot.index);
                        }
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

            return {
                totalNormalPrice: normalSum,
                totalBundlePrice: bundleSum,
                totalWeightGrams: Math.max(500, weightSum),
                unfulfilledRequiredIndices: missingReq,
                unfulfilledFreeVariantIndices: missingFreeVar,
            };
        }, [slots, selectedBySlot]);

    React.useEffect(() => {
        if (onTotalChange) {
            onTotalChange(totalBundlePrice, totalNormalPrice);
        }
    }, [totalBundlePrice, totalNormalPrice, onTotalChange]);

    // When clicking a candidate product in the modal
    const handleCandidateClick = (slotIndex: number, candidate: BundleCandidateProduct) => {
        if (candidate.is_out_of_stock) return;

        // If the product has multiple variants, require the customer to pick a variant first!
        if (hasMultipleVariants(candidate)) {
            setPendingCandidate(candidate);
            const currentInSlot = selectedBySlot[slotIndex];
            setPendingVariantId(
                currentInSlot && currentInSlot.id === candidate.id ? currentInSlot.variant_id : null,
            );
            setVariantError(null);
            return;
        }

        // Single-variant product: select immediately
        const singleVar = candidate.variants?.[0];
        const finalCandidate: BundleCandidateProduct = singleVar
            ? {
                  ...candidate,
                  variant_id: singleVar.id,
                  variant_label: singleVar.label,
                  normal_price: singleVar.normal_price,
                  bundle_price: singleVar.bundle_price,
                  weight_grams: singleVar.weight_grams,
                  image_url: singleVar.image_url || candidate.image_url,
              }
            : candidate;

        setSelectedBySlot((prev) => ({
            ...prev,
            [slotIndex]: finalCandidate,
        }));
        setValidationMessage(null);
        closeSlotModal();
    };

    // Confirm variant selection for multi-variant product
    const handleConfirmVariant = () => {
        if (activeModalSlotIndex === null || !pendingCandidate) return;

        if (pendingVariantId === null) {
            setVariantError('Silakan pilih salah satu variasi produk terlebih dahulu.');
            return;
        }

        const chosenVar = pendingCandidate.variants?.find((v) => v.id === pendingVariantId);
        if (!chosenVar || chosenVar.is_out_of_stock) {
            setVariantError('Variasi yang dipilih tidak tersedia.');
            return;
        }

        const finalizedProduct: BundleCandidateProduct = {
            ...pendingCandidate,
            variant_id: chosenVar.id,
            variant_label: chosenVar.label,
            normal_price: chosenVar.normal_price,
            bundle_price: chosenVar.bundle_price,
            weight_grams: chosenVar.weight_grams,
            image_url: chosenVar.image_url || pendingCandidate.image_url,
        };

        setSelectedBySlot((prev) => ({
            ...prev,
            [activeModalSlotIndex]: finalizedProduct,
        }));
        setValidationMessage(null);
        closeSlotModal();
    };

    const handleClearSlot = (slotIndex: number) => {
        setSelectedBySlot((prev) => {
            const next = { ...prev };
            delete next[slotIndex];
            return next;
        });
        closeSlotModal();
    };

    const ensureAllRequiredSelected = (): boolean => {
        if (unfulfilledRequiredIndices.length > 0) {
            const firstMissingIdx = unfulfilledRequiredIndices[0];
            setValidationMessage('Silakan pilih produk pada semua kotak slot wajib (+) terlebih dahulu.');
            openSlotModal(firstMissingIdx);
            return false;
        }
        if (unfulfilledFreeVariantIndices.length > 0) {
            const firstMissingFreeIdx = unfulfilledFreeVariantIndices[0];
            setValidationMessage('Silakan pilih variasi untuk produk bonus GRATIS terlebih dahulu.');
            openSlotModal(firstMissingFreeIdx);
            return false;
        }
        setValidationMessage(null);
        return true;
    };

    const buildCustomNotes = (): string => {
        const parts: string[] = [];
        slots.forEach((slot, idx) => {
            if (slot.slot_type === 'free') {
                const freeProd = selectedBySlot[slot.index] || slot.free_product;
                if (freeProd) {
                    const varInfo =
                        hasMultipleVariants(slot.free_product) && freeProd.variant_label
                            ? ` - Variasi: ${freeProd.variant_label}`
                            : '';
                    parts.push(`[GRATIS] ${freeProd.name}${varInfo} (Rp 0)`);
                }
            } else {
                const chosen = selectedBySlot[slot.index];
                if (chosen) {
                    const tag = slot.slot_type === 'optional' ? '[OPSIONAL]' : `[Slot ${idx + 1}]`;
                    const varInfo =
                        hasMultipleVariants(chosen) && chosen.variant_label
                            ? ` - Variasi: ${chosen.variant_label}`
                            : '';
                    parts.push(`${tag} ${chosen.name}${varInfo} (${formatRupiah(chosen.bundle_price)})`);
                }
            }
        });
        return parts.join(' | ');
    };

    const handleBuyNow = () => {
        if (!ensureAllRequiredSelected()) return;

        const finalUnitPrice =
            totalBundlePrice > 0 ? totalBundlePrice : Number(defaultVariant.price || product.min_price || 0);

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

        const finalUnitPrice =
            totalBundlePrice > 0 ? totalBundlePrice : Number(defaultVariant.price || product.min_price || 0);
        const cleanWa = whatsappNumber.replace(/[^0-9]/g, '') || '6285121930454';

        let msg = `Halo Alat Kopi Malang! Saya ingin memesan paket:\n*${product.name}* (Qty: ${quantity} Paket)\n\n*RINCIAN ISI PAKET:*\n`;

        slots.forEach((slot, i) => {
            if (slot.slot_type === 'free') {
                const freeProd = selectedBySlot[slot.index] || slot.free_product;
                if (freeProd) {
                    const varText =
                        hasMultipleVariants(slot.free_product) && freeProd.variant_label
                            ? ` (${freeProd.variant_label})`
                            : '';
                    msg += `${i + 1}. [GRATIS] ${freeProd.name}${varText} — ~~${formatRupiah(freeProd.normal_price)}~~ *Rp 0*\n`;
                }
            } else {
                const chosen = selectedBySlot[slot.index];
                if (chosen) {
                    const label = slot.slot_type === 'optional' ? ' [OPTIONAL]' : '';
                    const varText =
                        hasMultipleVariants(chosen) && chosen.variant_label ? ` (${chosen.variant_label})` : '';
                    msg += `${i + 1}.${label} ${chosen.name}${varText} — ~~${formatRupiah(chosen.normal_price)}~~ *${formatRupiah(chosen.bundle_price)}*\n`;
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
            {/* 3-Column Grid of Slot Boxes (Matching Video 00:01 - 00:26) */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5 pt-2">
                {slots.map((slot) => {
                    // Case 1: FREE Slot (GRATIS Rp0)
                    if (slot.slot_type === 'free') {
                        const baseFree = slot.free_product;
                        const chosenFree = selectedBySlot[slot.index] || baseFree;
                        if (!chosenFree) return null;
                        const freeMultiVar = hasMultipleVariants(baseFree);
                        const hasPickedFreeVar = Boolean(selectedBySlot[slot.index]);

                        return (
                            <div
                                key={slot.index}
                                onClick={() => freeMultiVar && openSlotModal(slot.index)}
                                className={`relative bg-white border border-neutral-300 rounded-xl p-2.5 sm:p-3 flex flex-col items-center justify-between text-center shadow-2xs ${
                                    freeMultiVar ? 'cursor-pointer hover:border-brand-700' : ''
                                }`}
                            >
                                <div className="w-full aspect-square rounded-lg overflow-hidden bg-white flex items-center justify-center p-1">
                                    <img
                                        src={chosenFree.image_url}
                                        alt={chosenFree.name}
                                        className="w-full h-full object-contain"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="mt-2 space-y-0.5 w-full">
                                    <p className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wide text-neutral-800">
                                        GRATIS
                                    </p>
                                    {freeMultiVar && (
                                        <p className="text-[10px] font-bold text-accent-copper truncate">
                                            {hasPickedFreeVar
                                                ? `Variasi: ${chosenFree.variant_label}`
                                                : 'Klik Pilih Variasi'}
                                        </p>
                                    )}
                                    <div className="flex flex-wrap items-center justify-center gap-1 text-[10px] sm:text-xs leading-tight">
                                        <span className="text-red-600 line-through font-semibold">
                                            {formatRupiah(chosenFree.normal_price)}
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
                            onClick={() => openSlotModal(slot.index)}
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
                                        {hasMultipleVariants(chosen) && chosen.variant_label && (
                                            <span className="inline-block px-1.5 py-0.5 rounded bg-accent-copper/10 text-accent-copper text-[10px] font-bold">
                                                {chosen.variant_label}
                                            </span>
                                        )}
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
                        const baseFree = slot.free_product;
                        const freeProd = selectedBySlot[slot.index] || baseFree;
                        if (!freeProd) return null;
                        const freeMultiVar = hasMultipleVariants(baseFree);
                        const hasPickedFreeVar = Boolean(selectedBySlot[slot.index]);

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
                                    {freeMultiVar && (
                                        <button
                                            type="button"
                                            onClick={() => openSlotModal(slot.index)}
                                            className="mt-0.5 text-[11px] font-bold text-accent-copper hover:underline cursor-pointer"
                                        >
                                            {hasPickedFreeVar
                                                ? `Variasi: ${freeProd.variant_label} (Ubah)`
                                                : 'Pilih Variasi Produk Gratis →'}
                                        </button>
                                    )}
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
                                onClick={() => openSlotModal(slot.index)}
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
                                {hasMultipleVariants(chosen) && chosen.variant_label && (
                                    <span className="block text-[11px] font-bold text-accent-copper mt-0.5">
                                        Variasi: {chosen.variant_label}
                                    </span>
                                )}
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

            {/* Bottom Total Order, Quantity Input & Action Buttons (After Daftar Pesanan) */}
            <div className="pt-3 border-t border-neutral-200 space-y-2.5">
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

            {/* Pop-up Modal: "Please Select Your Product" & Mandatory Variant Selector */}
            {activeModalSlot && (
                <div
                    className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-[1px] flex items-center justify-center p-3 sm:p-4"
                    onClick={closeSlotModal}
                >
                    <div
                        className="bg-white rounded-xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-neutral-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="px-4 py-3.5 border-b border-neutral-200 flex items-center justify-between relative">
                            {pendingCandidate && activeModalSlot.slot_type !== 'free' && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setPendingCandidate(null);
                                        setPendingVariantId(null);
                                        setVariantError(null);
                                    }}
                                    className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 hover:text-brand-950 cursor-pointer z-10"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    <span>Kembali</span>
                                </button>
                            )}
                            <h3 className="text-sm sm:text-base font-bold text-neutral-900 text-center w-full">
                                {pendingCandidate ? 'Pilih Variasi Produk' : 'Please Select Your Product'}
                            </h3>
                            <button
                                type="button"
                                onClick={closeSlotModal}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-neutral-700 hover:text-black cursor-pointer"
                                aria-label="Tutup modal"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* VIEW A: Mandatory Variant Picker for Multi-Variant Product */}
                        {pendingCandidate ? (
                            <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
                                <div className="flex items-center gap-3.5 pb-3.5 border-b border-neutral-200">
                                    <img
                                        src={
                                            pendingCandidate.variants?.find((v) => v.id === pendingVariantId)
                                                ?.image_url || pendingCandidate.image_url
                                        }
                                        alt={pendingCandidate.name}
                                        className="w-20 h-20 rounded-xl object-contain border border-neutral-200 bg-white p-1 flex-shrink-0"
                                    />
                                    <div className="min-w-0">
                                        {pendingCandidate.producer && (
                                            <p className="text-[10px] font-extrabold uppercase tracking-wider text-accent-copper">
                                                {pendingCandidate.producer}
                                            </p>
                                        )}
                                        <h4 className="text-sm sm:text-base font-extrabold text-brand-950 leading-snug">
                                            {pendingCandidate.name}
                                        </h4>
                                        <p className="text-xs text-neutral-500 mt-0.5">
                                            Produk ini memiliki beberapa variasi. Silakan pilih variasi terlebih dahulu:
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-xs font-extrabold uppercase tracking-wider text-brand-900">
                                        Pilih Warna / Ukuran / Variasi (Wajib):
                                    </label>
                                    <div className="grid grid-cols-1 gap-2">
                                        {(pendingCandidate.variants || []).map((v) => {
                                            const isSelected = pendingVariantId === v.id;
                                            return (
                                                <button
                                                    key={v.id}
                                                    type="button"
                                                    disabled={v.is_out_of_stock}
                                                    onClick={() => {
                                                        setPendingVariantId(v.id);
                                                        setVariantError(null);
                                                    }}
                                                    className={`w-full p-3 rounded-xl border-2 text-left flex items-center justify-between gap-3 transition-all ${
                                                        v.is_out_of_stock
                                                            ? 'border-neutral-200 bg-neutral-100 opacity-60 cursor-not-allowed'
                                                            : isSelected
                                                              ? 'border-accent-copper bg-accent-copper/10 ring-2 ring-accent-copper/20 cursor-pointer'
                                                              : 'border-neutral-200 hover:border-brand-400 bg-white cursor-pointer'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-2.5 min-w-0">
                                                        <div
                                                            className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${
                                                                isSelected
                                                                    ? 'border-accent-copper bg-accent-copper text-white'
                                                                    : 'border-neutral-300 bg-white'
                                                            }`}
                                                        >
                                                            {isSelected && <Check className="w-3 h-3" />}
                                                        </div>
                                                        <span className="text-xs sm:text-sm font-bold text-brand-950 truncate">
                                                            {v.label}{' '}
                                                            {v.is_out_of_stock ? '(Stok Habis)' : ''}
                                                        </span>
                                                    </div>

                                                    <div className="text-right flex-shrink-0">
                                                        {activeModalSlot.slot_type === 'free' ? (
                                                            <div className="flex items-center gap-1.5 text-xs">
                                                                <span className="text-red-600 line-through font-semibold">
                                                                    {formatRupiah(v.normal_price)}
                                                                </span>
                                                                <span className="font-extrabold text-brand-950">
                                                                    Rp0
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-1.5 text-xs">
                                                                {v.normal_price > v.bundle_price && (
                                                                    <span className="text-red-600 line-through font-semibold">
                                                                        {formatRupiah(v.normal_price)}
                                                                    </span>
                                                                )}
                                                                <span className="font-extrabold text-brand-950">
                                                                    {formatRupiah(v.bundle_price)}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {variantError && (
                                    <p className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                                        {variantError}
                                    </p>
                                )}

                                <button
                                    type="button"
                                    disabled={pendingVariantId === null}
                                    onClick={handleConfirmVariant}
                                    className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wider transition-all ${
                                        pendingVariantId !== null
                                            ? 'bg-brand-900 hover:bg-brand-800 text-white shadow-md cursor-pointer active:scale-[0.99]'
                                            : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                                    }`}
                                >
                                    {pendingVariantId !== null
                                        ? 'Konfirmasi & Masukkan Variasi Ini'
                                        : 'Pilih Variasi Terlebih Dahulu'}
                                </button>
                            </div>
                        ) : (
                            <>
                                {/* VIEW B: 2-Column Product Grid */}
                                {activeModalSlot.slot_type === 'optional' &&
                                    selectedBySlot[activeModalSlot.index] && (
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

                                <div className="p-3.5 sm:p-4 overflow-y-auto grid grid-cols-2 gap-3">
                                    {activeModalSlot.candidates.length === 0 ? (
                                        <div className="col-span-2 py-10 text-center text-xs text-neutral-500">
                                            Belum ada produk yang diatur untuk slot ini.
                                        </div>
                                    ) : (
                                        activeModalSlot.candidates.map((cand) => {
                                            const isSelected = selectedBySlot[activeModalSlot.index]?.id === cand.id;
                                            const multiVar = hasMultipleVariants(cand);
                                            return (
                                                <button
                                                    key={cand.id}
                                                    type="button"
                                                    disabled={cand.is_out_of_stock}
                                                    onClick={() =>
                                                        handleCandidateClick(activeModalSlot.index, cand)
                                                    }
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

                                                    {/* Title, Variant Count Badge & Strikethrough Discount Price */}
                                                    <div className="mt-2.5 space-y-1.5 w-full">
                                                        <p className="text-xs font-medium text-neutral-800 line-clamp-2 leading-snug">
                                                            {cand.name}
                                                        </p>
                                                        {multiVar && (
                                                            <span className="inline-block px-2 py-0.5 rounded-full bg-accent-copper/10 border border-accent-copper/30 text-accent-copper text-[10px] font-bold">
                                                                Pilih Variasi ({cand.variants?.length} Pilihan)
                                                            </span>
                                                        )}
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
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
