import type { InertiaLinkProps } from '@inertiajs/react';
import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function toUrl(url: NonNullable<InertiaLinkProps['href']>): string {
    return typeof url === 'string' ? url : url.url;
}

export interface ParsedCustomNoteLine {
    tag: string | null;
    text: string;
    normalPrice?: string | null;
    discountPrice?: string | null;
    normalPriceNum?: number;
    discountPriceNum?: number;
    isPreOrder?: boolean;
}

function parseRupiahToNumber(str?: string | null): number {
    if (!str) return 0;
    const digits = str.replace(/[^\d]/g, '');
    return digits ? parseInt(digits, 10) : 0;
}

export function isBundleOrderItem(item: {
    variantLabel?: string | null;
    grindOption?: string | null;
    customNotes?: string | null;
    isCustomBundle?: boolean | null;
    hasVariants?: boolean | null;
}): boolean {
    if (item.isCustomBundle) return true;
    if (item.hasVariants === false) return true;
    const v = (item.variantLabel || '').trim().toLowerCase();
    const g = (item.grindOption || '').trim().toLowerCase();
    const n = (item.customNotes || '').toLowerCase();
    if (!v || v === 'standar' || v === 'tanpa varian' || v.includes('paket custom') || g.includes('paket custom')) {
        return true;
    }
    if (/\[(?:slot|item)\s*\d+|\[(?:item\s+)?(?:gratis|opsional|optional)\]/i.test(n)) return true;
    return false;
}

export function parseCustomNotes(notes?: string | null): ParsedCustomNoteLine[] {
    if (!notes) return [];

    return String(notes)
        .split(/\n|\s*\|\s*|(?=\[(?:(?:Slot|Item)\s*\d+|(?:Item\s+)?(?:GRATIS|OPSIONAL|OPTIONAL))\])/i)
        .map((rawLine) => rawLine.trim())
        .filter(Boolean)
        .map((line) => {
            const match = line.match(
                /^\[(?:(?:Slot|Item)\s*(\d+)|(?:Item\s+)?(GRATIS|OPSIONAL|OPTIONAL))\]\s*(?:1x\s+)*(\d+x\s+)?(.*)$/i,
            );
            if (!match) {
                return { tag: null, text: line, normalPrice: null, discountPrice: null, normalPriceNum: 0, discountPriceNum: 0 };
            }

            const [, slotNum, specialKind, qty, rest] = match;
            let tag = '[Item]';
            if (slotNum) {
                tag = `[Item ${slotNum}]`;
            } else if (specialKind && specialKind.toUpperCase() === 'GRATIS') {
                tag = '[Item Gratis]';
            } else {
                tag = '[Item Opsional]';
            }

            const normalizedQty = (qty || '1x ').trim();
            const fullRest = `${normalizedQty} ${rest.trim()}`.trim();

            // Check for "(Rp Normal -> Rp Diskon)" at end of line
            const dualPriceMatch = fullRest.match(
                /^(.*?)\s*\(\s*(Rp[\s\u00a0]*[\d.]+)\s*(?:->|→)\s*(Rp[\s\u00a0]*[\d.]+)\s*\)\s*$/i,
            );
            if (dualPriceMatch) {
                const rawItemText = dualPriceMatch[1].trim();
                const isPreOrder = /\[pre-?order\]/i.test(rawItemText) || /pre-?order/i.test(tag);
                const itemText = rawItemText.replace(/\s*\[pre-?order\]\s*/gi, ' ').trim();
                const normStr = dualPriceMatch[2].replace(/\u00a0/g, ' ').trim();
                const discStr = dualPriceMatch[3].replace(/\u00a0/g, ' ').trim();
                const normNum = parseRupiahToNumber(normStr);
                const discNum = parseRupiahToNumber(discStr);
                return {
                    tag,
                    text: itemText,
                    normalPrice: normStr,
                    discountPrice: discStr,
                    normalPriceNum: Math.max(normNum, discNum),
                    discountPriceNum: discNum,
                    isPreOrder,
                };
            }

            // Check for single "(Rp Diskon)" at end of line
            const singlePriceMatch = fullRest.match(/^(.*?)\s*\(\s*(Rp[\s\u00a0]*[\d.]+)\s*\)\s*$/i);
            if (singlePriceMatch) {
                const rawItemText = singlePriceMatch[1].trim();
                const isPreOrder = /\[pre-?order\]/i.test(rawItemText) || /pre-?order/i.test(tag);
                const itemText = rawItemText.replace(/\s*\[pre-?order\]\s*/gi, ' ').trim();
                const discStr = singlePriceMatch[2].replace(/\u00a0/g, ' ').trim();
                const discNum = parseRupiahToNumber(discStr);
                return {
                    tag,
                    text: itemText,
                    normalPrice: null,
                    discountPrice: discStr,
                    normalPriceNum: discNum,
                    discountPriceNum: discNum,
                    isPreOrder,
                };
            }

            const isPreOrderFallback = /\[pre-?order\]/i.test(fullRest) || /pre-?order/i.test(tag);
            return {
                tag,
                text: fullRest.replace(/\s*\[pre-?order\]\s*/gi, ' ').trim(),
                normalPrice: null,
                discountPrice: null,
                normalPriceNum: 0,
                discountPriceNum: 0,
                isPreOrder: isPreOrderFallback,
            };
        });
}

export function getBundlePricingSummary(params: {
    customNotes?: string | null;
    unitPrice: number;
    quantity: number;
    originalUnitPrice?: number | null;
}) {
    const lines = parseCustomNotes(params.customNotes);
    const notesNormalSum = lines.reduce((sum, l) => sum + (l.normalPriceNum || l.discountPriceNum || 0), 0);
    const unitDiscountPrice = Number(params.unitPrice) || 0;
    const unitNormalPrice = Math.max(
        Number(params.originalUnitPrice) || 0,
        notesNormalSum,
        unitDiscountPrice,
    );
    const qty = Math.max(1, Number(params.quantity) || 1);
    const totalNormalPrice = unitNormalPrice * qty;
    const totalDiscountPrice = unitDiscountPrice * qty;

    const unitPreOrderPrice = Math.min(
        unitDiscountPrice,
        lines.reduce((sum, l) => (l.isPreOrder ? sum + (l.discountPriceNum || 0) : sum), 0),
    );
    const unitNonPreOrderPrice = Math.max(0, unitDiscountPrice - unitPreOrderPrice);
    const totalPreOrderPrice = unitPreOrderPrice * qty;
    const totalNonPreOrderPrice = unitNonPreOrderPrice * qty;

    return {
        lines,
        unitNormalPrice,
        unitDiscountPrice,
        totalNormalPrice,
        totalDiscountPrice,
        hasDiscount: totalNormalPrice > totalDiscountPrice,
        hasPreOrderSubItem: unitPreOrderPrice > 0,
        unitPreOrderPrice,
        unitNonPreOrderPrice,
        totalPreOrderPrice,
        totalNonPreOrderPrice,
    };
}
