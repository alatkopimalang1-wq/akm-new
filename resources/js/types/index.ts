export interface ProductImage {
    id: number;
    path: string;
    alt?: string;
    is_primary: boolean;
    sort_order: number;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    icon?: string;
    description?: string;
    products_count?: number;
}

export interface Product {
    id: number;
    name: string;
    slug: string;
    brand?: string;
    sku?: string;
    tagline?: string;
    short_description?: string;
    description?: string;
    price: number;
    original_price?: number;
    stock: number;
    rating: number;
    reviews_count: number;
    specifications?: Record<string, string>;
    tokopedia_url?: string;
    shopee_url?: string;
    is_featured: boolean;
    is_flash_sale: boolean;
    status: string;
    stock_status: string;
    primary_image_url?: string;
    discount_percent?: number;
    categories?: Category[];
    images?: ProductImage[];
}

export interface HeroBanner {
    id: number;
    title: string;
    subtitle?: string;
    badge?: string;
    image: string;
    link_url?: string;
    sort_order: number;
}

export interface ShowroomItem {
    id: number;
    title: string;
    description?: string;
    image_url: string;
    sort_order: number;
}

export interface CartItem {
    product: Product;
    quantity: number;
}

