/**
 * Meta Pixel (Facebook Pixel) Helper
 * Facebook Commerce Standard Implementation
 */

declare global {
    interface Window {
        fbq?: (...args: any[]) => void;
        _fbq?: any;
    }
}

/**
 * Format numeric amount safely (guarantees float/numeric without currency symbols or thousand dots).
 */
export function formatMetaPixelValue(value: number | string | null | undefined): number {
    if (value === null || value === undefined) return 0;
    if (typeof value === 'number') {
        return isNaN(value) ? 0 : Number(value.toFixed(2));
    }
    const cleaned = String(value).replace(/[^0-9.-]+/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : Number(parsed.toFixed(2));
}

/**
 * Extract canonical content ID for Meta Commerce feed synchronization.
 * Uses Variant SKU if present, falling back to Product SKU or Product ID string.
 */
export function getProductContentId(
    product?: { id?: number | string; sku?: string | null } | null,
    variant?: { id?: number | string; sku?: string | null } | null
): string {
    if (variant?.sku && String(variant.sku).trim() !== '') {
        return String(variant.sku).trim();
    }
    if (product?.sku && String(product.sku).trim() !== '') {
        return String(product.sku).trim();
    }
    if (variant?.id) {
        return String(variant.id);
    }
    if (product?.id) {
        return String(product.id);
    }
    return '';
}

/**
 * Track PageView event
 */
export function trackPageView(): void {
    if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
        window.fbq('track', 'PageView');
    }
}

export interface ViewContentParams {
    content_ids: string[];
    content_type: 'product';
    value: number;
    currency: string;
    content_name?: string;
    content_category?: string;
}

/**
 * Track ViewContent event (Product Detail Page)
 */
export function trackViewContent(params: ViewContentParams): void {
    if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
        window.fbq('track', 'ViewContent', {
            content_ids: params.content_ids.map(String),
            content_type: 'product',
            value: formatMetaPixelValue(params.value),
            currency: params.currency || 'IDR',
            ...(params.content_name ? { content_name: params.content_name } : {}),
            ...(params.content_category ? { content_category: params.content_category } : {}),
        });
    }
}

export interface AddToCartParams {
    content_ids: string[];
    content_type: 'product';
    value: number;
    currency: string;
    content_name?: string;
    quantity?: number;
}

/**
 * Track AddToCart event (Cart addition)
 */
export function trackAddToCart(params: AddToCartParams): void {
    if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
        window.fbq('track', 'AddToCart', {
            content_ids: params.content_ids.map(String),
            content_type: 'product',
            value: formatMetaPixelValue(params.value),
            currency: params.currency || 'IDR',
            ...(params.content_name ? { content_name: params.content_name } : {}),
            ...(params.quantity ? { num_items: params.quantity } : {}),
        });
    }
}

export interface InitiateCheckoutParams {
    content_ids: string[];
    content_type: 'product';
    value: number;
    currency: string;
    num_items?: number;
}

/**
 * Track InitiateCheckout event (Checkout Page loaded or started)
 */
export function trackInitiateCheckout(params: InitiateCheckoutParams): void {
    if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
        window.fbq('track', 'InitiateCheckout', {
            content_ids: params.content_ids.map(String),
            content_type: 'product',
            value: formatMetaPixelValue(params.value),
            currency: params.currency || 'IDR',
            ...(params.num_items ? { num_items: params.num_items } : {}),
        });
    }
}

export interface PurchaseParams {
    content_ids: string[];
    content_type: 'product';
    value: number;
    currency: string;
    num_items?: number;
}

/**
 * Track Purchase event (Order Success confirmation) with deduplication support
 */
export function trackPurchase(params: PurchaseParams, orderIdentifier?: string | number): boolean {
    if (typeof window === 'undefined' || typeof window.fbq !== 'function') {
        return false;
    }

    if (orderIdentifier) {
        const dedupeKey = `meta_pixel_purchase_${orderIdentifier}`;
        try {
            if (sessionStorage.getItem(dedupeKey)) {
                // Already tracked in this session/refresh, prevent duplicate
                return false;
            }
            sessionStorage.setItem(dedupeKey, '1');
            localStorage.setItem(dedupeKey, Date.now().toString());
        } catch {
            // Ignore storage quota or access errors
        }

        window.fbq(
            'track',
            'Purchase',
            {
                content_ids: params.content_ids.map(String),
                content_type: 'product',
                value: formatMetaPixelValue(params.value),
                currency: params.currency || 'IDR',
                ...(params.num_items ? { num_items: params.num_items } : {}),
            },
            { eventID: String(orderIdentifier) }
        );
        return true;
    }

    window.fbq('track', 'Purchase', {
        content_ids: params.content_ids.map(String),
        content_type: 'product',
        value: formatMetaPixelValue(params.value),
        currency: params.currency || 'IDR',
        ...(params.num_items ? { num_items: params.num_items } : {}),
    });
    return true;
}

