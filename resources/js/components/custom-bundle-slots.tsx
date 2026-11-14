import React, { useMemo, useState } from 'react';
import { Link } from '@inertiajs/react';
import { ArrowLeft, Check, CheckCircle2, Layers, Minus, Plus, ShoppingBag, X } from 'lucide-react';
import { SlidingNumber } from '@animate-ui/react/primitives/texts/sliding-number';
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
    // Map of slotIndex -> chosen quantity of items in that slot (default 1)
    const [slotQuantities, setSlotQuantities] = useState<Record<number, number>>({});
    const [activeModalSlotIndex, setActiveModalSlotIndex] = useState<number | null>(null);

    // State for mandatory variant & quantity selection step inside the modal
    const [pendingCandidate, setPendingCandidate] = useState<BundleCandidateProduct | null>(null);
    const [pendingVariantId, setPendingVariantId] = useState<number | null>(null);
    const [pendingSlotQty, setPendingSlotQty] = useState<number>(1);
    const [variantError, setVariantError] = useState<string | null>(null);

    const [quantity, setQuantity] = useState<number>(1);
    const [validationMessage, setValidationMessage] = useState<string | null>(null);
    const [isAdded, setIsAdded] = useState(false);

    const getSlotQty = (slotIndex: number): number => Math.max(1, slotQuantities[slotIndex] || 1);

    const updateSlotQuantity = (slotIndex: number, nextQty: number) => {
        const clamped = Math.max(1, Math.min(99, nextQty || 1));
        setSlotQuantities((prev) => ({
            ...prev,
            [slotIndex]: clamped,
        }));
    };

    const activeModalSlot = useMemo(
        () => (activeModalSlotIndex !== null ? slots.find((s) => s.index === activeModalSlotIndex) || null : null),
        [activeModalSlotIndex, slots],
    );

    const openSlotModal = (slotIndex: number) => {
        const targetSlot = slots.find((s) => s.index === slotIndex);
        setActiveModalSlotIndex(slotIndex);
        setVariantError(null);
        setPendingSlotQty(getSlotQty(slotIndex));

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
                        const sQty = Math.max(1, slotQuantities[slot.index] || 1);
                        normalSum += (Number(chosen.normal_price) || 0) * sQty;
                        bundleSum += (Number(chosen.bundle_price) || 0) * sQty;
                        weightSum += (Number(chosen.weight_grams) || 500) * sQty;
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
        }, [slots, selectedBySlot, slotQuantities]);

    React.useEffect(() => {
        if (onTotalChange) {
            onTotalChange(totalBundlePrice, totalNormalPrice);
        }
    }, [totalBundlePrice, totalNormalPrice, onTotalChange]);

    // When clicking a candidate product in the modal: open variant (if multi-variant) + quantity selector step
    const handleCandidateClick = (slotIndex: number, candidate: BundleCandidateProduct) => {
        if (candidate.is_out_of_stock) return;

        setPendingCandidate(candidate);
        const currentInSlot = selectedBySlot[slotIndex];
        setPendingSlotQty(currentInSlot && currentInSlot.id === candidate.id ? getSlotQty(slotIndex) : 1);
        setVariantError(null);

        if (hasMultipleVariants(candidate)) {
            setPendingVariantId(
                currentInSlot && currentInSlot.id === candidate.id ? currentInSlot.variant_id : null,
            );
        } else {
            // Single-variant product: pre-select its single variant so user can directly set quantity & confirm
            const singleVar = candidate.variants?.[0];
            setPendingVariantId(singleVar ? singleVar.id : candidate.variant_id);
        }
    };

    // Confirm variant & quantity selection for slot product
    const handleConfirmVariant = () => {
        if (activeModalSlotIndex === null || !pendingCandidate) return;

        const multiVar = hasMultipleVariants(pendingCandidate);
        if (multiVar && pendingVariantId === null) {
            setVariantError('Silakan pilih salah satu variasi produk terlebih dahulu.');
            return;
        }

        const chosenVar =
            pendingCandidate.variants?.find((v) => v.id === pendingVariantId) ||
            (!multiVar ? pendingCandidate.variants?.[0] : undefined);

        if (multiVar && (!chosenVar || chosenVar.is_out_of_stock)) {
            setVariantError('Variasi yang dipilih tidak tersedia.');
            return;
        }

        const finalizedProduct: BundleCandidateProduct = chosenVar
            ? {
                  ...pendingCandidate,
                  variant_id: chosenVar.id,
                  variant_label: chosenVar.label,
                  normal_price: chosenVar.normal_price,
                  bundle_price: chosenVar.bundle_price,
                  weight_grams: chosenVar.weight_grams,
                  image_url: chosenVar.image_url || pendingCandidate.image_url,
              }
            : pendingCandidate;

        const finalSlotQty = activeModalSlot?.slot_type === 'free' ? 1 : Math.max(1, Math.min(99, pendingSlotQty || 1));

        setSelectedBySlot((prev) => ({
            ...prev,
            [activeModalSlotIndex]: finalizedProduct,
        }));
        setSlotQuantities((prev) => ({
            ...prev,
            [activeModalSlotIndex]: finalSlotQty,
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
        setSlotQuantities((prev) => {
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
                    parts.push(`[GRATIS] 1x ${freeProd.name}${varInfo} (Rp 0)`);
                }
            } else {
                const chosen = selectedBySlot[slot.index];
                if (chosen) {
                    const sQty = getSlotQty(slot.index);
                    const tag = slot.slot_type === 'optional' ? '[OPSIONAL]' : `[Slot ${idx + 1}]`;
                    const varInfo =
                        hasMultipleVariants(chosen) && chosen.variant_label
                            ? ` - Variasi: ${chosen.variant_label}`
                            : '';
                    parts.push(`${tag} ${sQty}x ${chosen.name}${varInfo} (${formatRupiah(chosen.bundle_price * sQty)})`);
                }
            }
        });
        return parts.join('\n');
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
                    msg += `${i + 1}. [GRATIS] 1x ${freeProd.name}${varText} — ~~${formatRupiah(freeProd.normal_price)}~~ *Rp 0*\n`;
                }
            } else {
                const chosen = selectedBySlot[slot.index];
                if (chosen) {
                    const sQty = getSlotQty(slot.index);
                    const label = slot.slot_type === 'optional' ? ' [OPTIONAL]' : '';
                    const varText =
                        hasMultipleVariants(chosen) && chosen.variant_label ? ` (${chosen.variant_label})` : '';
                    msg += `${i + 1}.${label} ${sQty}x ${chosen.name}${varText} — ~~${formatRupiah(chosen.normal_price * sQty)}~~ *${formatRupiah(chosen.bundle_price * sQty)}*\n`;
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
                    const slotQty = getSlotQty(slot.index);

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

                            {/* Slot Quantity Badge in Top-Right Corner when chosen */}
                            {chosen && (
                                <span className="absolute top-1.5 right-1.5 z-10 px-1.5 py-0.5 rounded-md bg-brand-700 text-white text-[10px] font-extrabold shadow-2xs">
                                    ×{slotQty}
                                </span>
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
                                                    {formatRupiah(chosen.normal_price * slotQty)}
                                                </p>
                                            )}
                                            <p className="text-[11px] sm:text-xs font-extrabold text-neutral-950 leading-none">
                                                {formatRupiah(chosen.bundle_price * slotQty)}
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
                                className="py-3 flex items-center justify-between gap-2 sm:gap-3"
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
                                <div className="w-20 sm:w-24 text-center text-neutral-600 font-medium">1</div>
                                <div className="w-32 sm:w-40 text-right flex items-center justify-end gap-2">
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
                    const slotQty = getSlotQty(slot.index);

                    if (!chosen) {
                        return (
                            <div
                                key={`row-${slot.index}`}
                                onClick={() => openSlotModal(slot.index)}
                                className="py-3 flex items-center justify-between gap-2 sm:gap-3 cursor-pointer hover:bg-neutral-50 transition-colors"
                            >
                                <div className="flex-1 min-w-0 flex flex-wrap items-center gap-1.5">
                                    <span className="text-neutral-700">Please select your product!</span>
                                    {isOptional && (
                                        <span className="px-1.5 py-0.5 rounded bg-[#ff4d6d] text-white text-[9px] font-extrabold uppercase">
                                            OPTIONAL
                                        </span>
                                    )}
                                </div>
                                <div className="w-20 sm:w-24 text-center text-neutral-900 text-base">☛</div>
                                <div className="w-32 sm:w-40 text-right flex items-center justify-end gap-4 text-neutral-500 font-mono">
                                    <span>-----</span>
                                    <span>-----</span>
                                </div>
                            </div>
                        );
                    }

                    return (
                        <div
                            key={`row-${slot.index}`}
                            className="py-3 flex items-center justify-between gap-2 sm:gap-3"
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

                            {/* Per-Slot Quantity Stepper & Input */}
                            <div className="w-20 sm:w-24 flex items-center justify-center">
                                <div className="inline-flex items-center border border-sand-200 rounded-lg bg-white p-0.5">
                                    <button
                                        type="button"
                                        onClick={() => updateSlotQuantity(slot.index, slotQty - 1)}
                                        className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-sand-100 text-brand-800 transition-colors cursor-pointer"
                                        aria-label="Kurangi jumlah barang slot"
                                    >
                                        <Minus className="w-3 h-3" />
                                    </button>
                                    <input
                                        type="number"
                                        min={1}
                                        max={99}
                                        value={slotQty}
                                        onChange={(e) =>
                                            updateSlotQuantity(slot.index, parseInt(e.target.value, 10) || 1)
                                        }
                                        className="w-7 sm:w-8 text-center font-bold text-xs text-brand-950 bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => updateSlotQuantity(slot.index, slotQty + 1)}
                                        className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-sand-100 text-brand-800 transition-colors cursor-pointer"
                                        aria-label="Tambah jumlah barang slot"
                                    >
                                        <Plus className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>

                            <div className="w-32 sm:w-40 text-right">
                                {chosen.normal_price > chosen.bundle_price && (
                                    <span className="block text-red-600 line-through font-semibold text-xs">
                                        {formatRupiah(chosen.normal_price * slotQty)}
                                    </span>
                                )}
                                <span className="block font-extrabold text-neutral-900">
                                    {formatRupiah(chosen.bundle_price * slotQty)}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Bottom Total Order, Quantity Stepper & Action Buttons (After Daftar Pesanan) */}
            <div className="pt-3 border-t border-neutral-200 space-y-3">
                {totalBundlePrice > 0 && (
                    <div className="flex items-center justify-between gap-3">
                        <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-brand-800">
                            Total Pesanan
                        </span>
                        <div className="text-right">
                            {totalNormalPrice > totalBundlePrice && (
                                <span className="block text-xs font-bold text-red-600 line-through">
                                    {formatRupiah(totalNormalPrice * quantity)}
                                </span>
                            )}
                            <span className="text-lg sm:text-xl font-black text-brand-950">
                                {formatRupiah(totalBundlePrice * quantity)}
                            </span>
                        </div>
                    </div>
                )}

                {validationMessage && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-700">
                        {validationMessage}
                    </div>
                )}

                <div className="flex items-center gap-2.5 sm:gap-3">
                    {/* Stepper */}
                    <div className="flex items-center border border-sand-200 rounded-xl bg-white p-1 h-12 sm:h-auto">
                        <button
                            type="button"
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-9 h-full sm:w-8 sm:h-8 flex items-center justify-center rounded-lg hover:bg-sand-100 text-brand-800 transition-colors cursor-pointer"
                        >
                            <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-9 sm:w-10 text-center font-bold text-sm text-brand-950 flex items-center justify-center">
                            <SlidingNumber number={quantity} />
                        </span>
                        <button
                            type="button"
                            onClick={() => setQuantity(Math.min(50, quantity + 1))}
                            className="w-9 h-full sm:w-8 sm:h-8 flex items-center justify-center rounded-lg hover:bg-sand-100 text-brand-800 transition-colors cursor-pointer"
                        >
                            <Plus className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                        type="button"
                        onClick={handleBuyNow}
                        className={`flex-1 h-12 sm:h-auto flex items-center justify-center gap-1.5 sm:gap-2 py-3 px-4 sm:py-3 sm:px-6 rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm transition-all duration-150 cursor-pointer active:scale-[0.98] ${
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
                </div>

                {/* Direct WhatsApp Instant Buy */}
                <button
                    type="button"
                    onClick={handleBuyViaWhatsApp}
                    className="w-full h-12 sm:h-auto flex items-center justify-center gap-2 py-3 px-4 sm:py-3 sm:px-6 rounded-xl border bg-white hover:bg-cream-100 border-brand-700 text-brand-700 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                    <span>Pesan Langsung via WhatsApp</span>
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
                                {pendingCandidate
                                    ? hasMultipleVariants(pendingCandidate)
                                        ? 'Pilih Variasi & Jumlah Produk'
                                        : 'Atur Jumlah Produk'
                                    : 'Please Select Your Product'}
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

                        {/* VIEW A: Variant & Quantity Picker for Chosen Product */}
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
                                            {hasMultipleVariants(pendingCandidate)
                                                ? 'Pilih variasi dan jumlah barang yang ingin dimasukkan:'
                                                : 'Tentukan jumlah barang yang ingin dimasukkan ke dalam slot paket ini:'}
                                        </p>
                                    </div>
                                </div>

                                {hasMultipleVariants(pendingCandidate) && (
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
                                )}

                                {/* Quantity Selector for Slot (Shown for Required & Optional Slots) */}
                                {activeModalSlot.slot_type !== 'free' && (
                                    <div className="p-3.5 rounded-xl bg-sand-50/70 border border-sand-200 flex items-center justify-between gap-3">
                                        <div>
                                            <p className="text-xs font-extrabold uppercase tracking-wider text-brand-900">
                                                Jumlah Barang
                                            </p>
                                            <p className="text-[11px] text-neutral-500">
                                                Masukkan jumlah unit untuk slot ini
                                            </p>
                                        </div>
                                        <div className="flex items-center border border-sand-300 rounded-xl bg-white p-1">
                                            <button
                                                type="button"
                                                onClick={() => setPendingSlotQty(Math.max(1, pendingSlotQty - 1))}
                                                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-sand-100 text-brand-800 transition-colors cursor-pointer"
                                            >
                                                <Minus className="w-3.5 h-3.5" />
                                            </button>
                                            <input
                                                type="number"
                                                min={1}
                                                max={99}
                                                value={pendingSlotQty}
                                                onChange={(e) =>
                                                    setPendingSlotQty(
                                                        Math.max(1, Math.min(99, parseInt(e.target.value, 10) || 1)),
                                                    )
                                                }
                                                className="w-10 text-center font-bold text-sm text-brand-950 bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setPendingSlotQty(Math.min(99, pendingSlotQty + 1))}
                                                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-sand-100 text-brand-800 transition-colors cursor-pointer"
                                            >
                                                <Plus className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {variantError && (
                                    <p className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                                        {variantError}
                                    </p>
                                )}

                                <button
                                    type="button"
                                    disabled={hasMultipleVariants(pendingCandidate) && pendingVariantId === null}
                                    onClick={handleConfirmVariant}
                                    className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wider transition-all ${
                                        !hasMultipleVariants(pendingCandidate) || pendingVariantId !== null
                                            ? 'bg-brand-700 hover:bg-brand-800 text-white shadow-md cursor-pointer active:scale-[0.99]'
                                            : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                                    }`}
                                >
                                    {!hasMultipleVariants(pendingCandidate) || pendingVariantId !== null
                                        ? `Masukkan ke Paket (${activeModalSlot.slot_type === 'free' ? 1 : pendingSlotQty} Unit)`
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
