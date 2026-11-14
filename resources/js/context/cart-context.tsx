import React, { createContext, useContext, useEffect, useState } from 'react';
import type { CartItem, Product, ProductVariant } from '@/types/sanubari';
import { getProductContentId, trackAddToCart } from '@/lib/meta-pixel';
import { getBundlePricingSummary } from '@/lib/utils';
import { DpPercentage, normalizeDpPercentage, normalizeMinDpPercentage } from '@/components/preorder-dp-slider';

export type { CartItem, Product, ProductVariant };

export function isCartItemPreOrder(item: CartItem): boolean {
    if (typeof item.unitPreOrderPrice === 'number') {
        return item.unitPreOrderPrice > 0;
    }
    const pricing = getBundlePricingSummary({
        customNotes: item.customNotes,
        unitPrice: item.variant.price,
        quantity: item.quantity,
        originalUnitPrice: item.variant.original_price,
    });
    if (pricing.lines.length > 0) {
        return pricing.hasPreOrderSubItem;
    }
    return Boolean(
        item.isPreOrder ||
        item.product?.is_preorder ||
        item.product?.stock_status === 'pre_order' ||
        item.variant?.stock_status === 'pre_order',
    );
}

export function getCartItemPreOrderBreakdown(item: CartItem): {
    preOrderSubtotal: number;
    nonPreOrderSubtotal: number;
} {
    const qty = Math.max(1, Number(item.quantity) || 1);
    const lineTotal = (Number(item.variant.price) || 0) * qty;

    const pricing = getBundlePricingSummary({
        customNotes: item.customNotes,
        unitPrice: item.variant.price,
        quantity: qty,
        originalUnitPrice: item.variant.original_price,
    });

    if (pricing.lines.length > 0 && pricing.hasPreOrderSubItem) {
        return {
            preOrderSubtotal: pricing.totalPreOrderPrice,
            nonPreOrderSubtotal: pricing.totalNonPreOrderPrice,
        };
    }

    if (typeof item.unitPreOrderPrice === 'number') {
        const poSub = Math.min(lineTotal, Math.max(0, item.unitPreOrderPrice * qty));
        return {
            preOrderSubtotal: poSub,
            nonPreOrderSubtotal: Math.max(0, lineTotal - poSub),
        };
    }

    if (pricing.lines.length === 0 && isCartItemPreOrder(item)) {
        return {
            preOrderSubtotal: lineTotal,
            nonPreOrderSubtotal: 0,
        };
    }

    return {
        preOrderSubtotal: 0,
        nonPreOrderSubtotal: lineTotal,
    };
}

export function getCartItemMinDp(item: CartItem): DpPercentage {
    if (!isCartItemPreOrder(item)) return 30;
    return normalizeMinDpPercentage(
        item.minDpPercentage ??
        item.product?.min_dp_percentage ??
        (item.product?.bundle_config as any)?.min_dp_percentage ??
        30,
    );
}

interface CartContextType {
    items: CartItem[];
    addItem: (
        product: Product,
        variant: ProductVariant,
        quantity?: number,
        grindOption?: string,
        customNotes?: string,
        options?: {
            isPreOrder?: boolean;
            dpPercentage?: DpPercentage;
            minDpPercentage?: DpPercentage;
            unitPreOrderPrice?: number;
        }
    ) => void;
    removeItem: (variantId: number, grindOption: string, customNotes?: string) => void;
    updateQuantity: (
        variantId: number,
        grindOption: string,
        quantity: number,
        customNotes?: string
    ) => void;
    clearCart: () => void;
    itemCount: number;
    subtotal: number;
    preOrderSubtotal: number;
    nonPreOrderSubtotal: number;
    hasPreOrderItems: boolean;
    minDpPercentage: DpPercentage;
    dpPercentage: DpPercentage;
    setDpPercentage: (pct: DpPercentage) => void;
    isCartOpen: boolean;
    setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'sanubari_cart_v1';
const DP_STORAGE_KEY = 'sanubari_cart_dp_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>(() => {
        if (typeof window === 'undefined') return [];
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    });

    const [dpPercentage, setDpPercentageState] = useState<DpPercentage>(() => {
        if (typeof window === 'undefined') return 100;
        try {
            const raw = localStorage.getItem(DP_STORAGE_KEY);
            return raw ? normalizeDpPercentage(Number(raw)) : 100;
        } catch {
            return 100;
        }
    });

    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        } catch (e) {
            console.error('Failed to save cart to localStorage', e);
        }
    }, [items]);

    useEffect(() => {
        try {
            localStorage.setItem(DP_STORAGE_KEY, String(dpPercentage));
        } catch (e) {
            console.error('Failed to save DP percentage to localStorage', e);
        }
    }, [dpPercentage]);

    const setDpPercentage = (pct: DpPercentage) => {
        setDpPercentageState(normalizeDpPercentage(pct));
    };

    const addItem = (
        product: Product,
        variant: ProductVariant,
        quantity: number = 1,
        grindOption: string = 'Biji Utuh (Whole Bean)',
        customNotes?: string,
        options?: {
            isPreOrder?: boolean;
            dpPercentage?: DpPercentage;
            minDpPercentage?: DpPercentage;
            unitPreOrderPrice?: number;
        }
    ) => {
        const itemIsPreOrder = Boolean(
            options?.isPreOrder !== undefined
                ? options.isPreOrder
                : product.is_preorder ||
                  product.stock_status === 'pre_order' ||
                  variant.stock_status === 'pre_order'
        );

        const itemMinDp = normalizeMinDpPercentage(
            options?.minDpPercentage ??
            product.min_dp_percentage ??
            (product.bundle_config as any)?.min_dp_percentage ??
            30,
        );

        if (itemIsPreOrder && options?.dpPercentage) {
            setDpPercentageState(normalizeDpPercentage(options.dpPercentage, itemMinDp));
        }

        setItems((prev) => {
            const existingIndex = prev.findIndex(
                (i) =>
                    i.variant.id === variant.id &&
                    i.grindOption === grindOption &&
                    (i.customNotes || '') === (customNotes || '')
            );
            if (existingIndex > -1) {
                const next = [...prev];
                next[existingIndex] = {
                    ...next[existingIndex],
                    quantity: next[existingIndex].quantity + quantity,
                    isPreOrder: next[existingIndex].isPreOrder || itemIsPreOrder,
                    minDpPercentage: Math.max(next[existingIndex].minDpPercentage || 30, itemMinDp),
                    unitPreOrderPrice:
                        options?.unitPreOrderPrice !== undefined
                            ? options.unitPreOrderPrice
                            : next[existingIndex].unitPreOrderPrice,
                };
                return next;
            }
            return [
                ...prev,
                {
                    product,
                    variant,
                    quantity,
                    grindOption,
                    customNotes,
                    isPreOrder: itemIsPreOrder,
                    minDpPercentage: itemMinDp,
                    unitPreOrderPrice: options?.unitPreOrderPrice,
                },
            ];
        });
        setIsCartOpen(true);

        // Track Meta Pixel AddToCart
        try {
            const contentId = getProductContentId(product, variant);
            trackAddToCart({
                content_ids: [contentId],
                content_type: 'product',
                value: Number((variant.price || 0) * (quantity || 1)),
                currency: 'IDR',
                content_name: product.name,
                quantity: quantity || 1,
            });
        } catch (e) {
            console.error('Meta Pixel AddToCart error', e);
        }
    };

    const removeItem = (variantId: number, grindOption: string, customNotes?: string) => {
        setItems((prev) =>
            prev.filter(
                (i) =>
                    !(
                        i.variant.id === variantId &&
                        i.grindOption === grindOption &&
                        (i.customNotes || '') === (customNotes || '')
                    )
            )
        );
    };

    const updateQuantity = (
        variantId: number,
        grindOption: string,
        quantity: number,
        customNotes?: string
    ) => {
        if (quantity <= 0) {
            removeItem(variantId, grindOption, customNotes);
            return;
        }
        setItems((prev) =>
            prev.map((i) => {
                if (
                    i.variant.id === variantId &&
                    i.grindOption === grindOption &&
                    (i.customNotes || '') === (customNotes || '')
                ) {
                    return { ...i, quantity };
                }
                return i;
            })
        );
    };

    const clearCart = () => setItems([]);

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.variant.price * item.quantity, 0);
    const preOrderSubtotal = items.reduce(
        (sum, item) => sum + getCartItemPreOrderBreakdown(item).preOrderSubtotal,
        0,
    );
    const nonPreOrderSubtotal = Math.max(0, subtotal - preOrderSubtotal);
    const hasPreOrderItems = preOrderSubtotal > 0 || items.some(isCartItemPreOrder);
    const minDpPercentage = normalizeMinDpPercentage(
        items.reduce((maxMin, item) => (isCartItemPreOrder(item) ? Math.max(maxMin, getCartItemMinDp(item)) : maxMin), 30),
    );
    const effectiveDpPercentage = normalizeDpPercentage(dpPercentage, minDpPercentage);

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                itemCount,
                subtotal,
                preOrderSubtotal,
                nonPreOrderSubtotal,
                hasPreOrderItems,
                minDpPercentage,
                dpPercentage: effectiveDpPercentage,
                setDpPercentage: (pct: DpPercentage) =>
                    setDpPercentageState(normalizeDpPercentage(pct, minDpPercentage)),
                isCartOpen,
                setIsCartOpen,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
