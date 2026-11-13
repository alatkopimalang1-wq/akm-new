import React, { createContext, useContext, useEffect, useState } from 'react';
import type { CartItem, Product, ProductVariant } from '@/types/sanubari';
import { getProductContentId, trackAddToCart } from '@/lib/meta-pixel';

interface CartContextType {
    items: CartItem[];
    addItem: (
        product: Product,
        variant: ProductVariant,
        quantity?: number,
        grindOption?: string,
        customNotes?: string
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
    isCartOpen: boolean;
    setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'sanubari_cart_v1';

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

    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        } catch (e) {
            console.error('Failed to save cart to localStorage', e);
        }
    }, [items]);

    const addItem = (
        product: Product,
        variant: ProductVariant,
        quantity: number = 1,
        grindOption: string = 'Biji Utuh (Whole Bean)',
        customNotes?: string
    ) => {
        setItems((prev) => {
            const existingIndex = prev.findIndex(
                (i) =>
                    i.variant.id === variant.id &&
                    i.grindOption === grindOption &&
                    (i.customNotes || '') === (customNotes || '')
            );
            if (existingIndex > -1) {
                const next = [...prev];
                next[existingIndex].quantity += quantity;
                return next;
            }
            return [...prev, { product, variant, quantity, grindOption, customNotes }];
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
