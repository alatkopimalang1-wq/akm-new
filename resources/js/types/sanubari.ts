export interface Category {
    id: number;
    name: Record<string, string> | string;
    slug: string;
    parent_id?: number | null;
    type: 'filter' | 'espresso' | 'brand' | 'merch';
    description?: Record<string, string> | string | null;
    icon?: string | null;
    sort_order: number;
    children?: Category[];
    products_count?: number;
}

export interface ProductVariant {
    id: number;
    product_id: number;
    label: string;
    weight_grams: number;
    price: number;
    original_price?: number | null;
    stock_status: 'in_stock' | 'out_of_stock' | 'pre_order';
    sku?: string | null;
    image?: string | null;
    image_url?: string | null;
}

export interface ProductImage {
    id: number;
    product_id: number;
    path: string;
    alt?: string | null;
    sort_order: number;
    is_primary: boolean;
    url?: string;
}

export interface Product {
    id: number;
    name: string;
    slug: string;
    series: string;
    series_label?: string | null;
    tagline?: Record<string, string> | string | null;
    description?: Record<string, string> | string | null;
    short_description?: string | null;
    tasting_notes?: string | null;
    origin?: string | null;
    region?: string | null;
    farm?: string | null;
    producer?: string | null;
    varietal?: string | null;
    process?: string | null;
    altitude?: string | null;
    roast_level?: string | null;
    brew_methods?: string[] | null;
    freshness_days: number;
    min_price: number;
    max_price: number;
    price_per_10g?: number | null;
    is_featured: boolean;
    is_new: boolean;
    is_flash_sale?: boolean;
    tokopedia_url?: string | null;
    shopee_url?: string | null;
    tiktok_shop_url?: string | null;
    status: string;
    stock_status?: 'in_stock' | 'out_of_stock' | 'pre_order' | string;
    is_out_of_stock?: boolean;
    released_at?: string | null;
    variants?: ProductVariant[];
    images?: ProductImage[];
    all_images?: {
        path: string;
        alt?: string | null;
        is_primary?: boolean;
        is_variant?: boolean;
        variant_id?: number | null;
        variant_label?: string | null;
    }[];
    categories?: Category[];
}

export interface Post {
    id: number;
    title: Record<string, string> | string;
    slug: string;
    category: string;
    excerpt?: Record<string, string> | string | null;
    body: Record<string, string> | string;
    cover_image?: string | null;
    author_name: string;
    read_time_minutes: number;
    published_at: string;
    is_published?: boolean;
    meta?: Record<string, any> | null;
}

export interface BrewGuide {
    id: number;
    slug: string;
    title: Record<string, string> | string;
    method: string;
    difficulty: string;
    brew_time: string;
    ratio: string;
    grind_size: string;
    water_temp: string;
    description?: Record<string, string> | string | null;
    steps: Array<{ step: number; time?: string; text: string; water_amount?: string }>;
    cover_image?: string | null;
    sort_order: number;
}

export interface Event {
    id: number;
    title: Record<string, string> | string;
    slug: string;
    description: Record<string, string> | string;
    location: string;
    address?: string | null;
    fee: number;
    capacity?: number | null;
    starts_at: string;
    ends_at?: string | null;
    formatted_date?: string | null;
    formatted_time?: string | null;
    formatted_schedule?: string | null;
    status: 'open' | 'full' | 'completed';
    whatsapp_register_text?: string | null;
    cover_image?: string | null;
}

export interface CartItem {
    variant: ProductVariant;
    product: Product;
    quantity: number;
    grindOption: string;
    customNotes?: string;
}

export interface MegaMenuItem {
    id: number;
    mega_menu_id: number;
    section_title: string;
    title: string;
    description?: string | null;
    url: string;
    icon?: string | null;
    badge?: string | null;
    sort_order: number;
    is_active: boolean;
}

export interface MegaMenu {
    id: number;
    name: string;
    slug: 'shop' | 'b2b' | 'explore' | string;
    sort_order: number;
    is_active: boolean;
    featured_badge?: string | null;
    featured_title?: string | null;
    featured_subtitle?: string | null;
    featured_image?: string | null;
    featured_url?: string | null;
    featured_button_text?: string | null;
    items?: MegaMenuItem[];
}

export interface FlashSaleVariant {
    id: number | string;
    label: string;
    price: number;
    original_price?: number | null;
    stock_status?: string;
    weight_grams?: number;
}

export interface FlashSaleProduct {
    id: string | number;
    name: string;
    slug?: string;
    category?: string | null;
    price: number;
    original_price?: number | null;
    discount_percentage?: number | null;
    image: string;
    badge?: string | null;
    stock_status?: string;
    is_low_stock?: boolean;
    is_coffee?: boolean;
    variants?: FlashSaleVariant[];
    sold_percentage?: number | null;
    sold_count?: number | null;
    description?: string | null;
}

export interface NewReleaseItem {
    id: string | number;
    product_id?: string | number | null;
    name: string;
    slug?: string;
    category?: string | null;
    price: number;
    original_price?: number | null;
    image: string;
    badge?: string | null;
    stock_status?: string;
    description?: string | null;
}

export interface BackInStockItem {
    id: string | number;
    product_id?: string | number | null;
    name: string;
    slug?: string;
    category?: string | null;
    price: number;
    original_price?: number | null;
    image: string;
    badge?: string | null;
    stock_status?: string;
    description?: string | null;
}

export interface OrderItemData {
    id: number;
    product_id?: number | null;
    variant_id?: number | null;
    sku?: string | null;
    product_name: string;
    variant_label: string;
    grind_option?: string | null;
    custom_notes?: string | null;
    price: number;
    quantity: number;
    subtotal: number;
    image?: string | null;
}

export interface OrderData {
    id: number;
    order_number: string;
    customer_name: string;
    customer_phone: string;
    customer_email?: string | null;
    customer_address: string;
    customer_notes?: string | null;
    payment_method: string;
    payment_method_label: string;
    payment_channel?: string | null;
    payment_status: 'pending' | 'verifying' | 'paid' | 'cancelled';
    payment_status_label: string;
    status: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';
    status_label: string;
    subtotal: number;
    shipping_cost: number;
    shipping_courier?: string | null;
    shipping_service?: string | null;
    shipping_etd?: string | null;
    shipping_city?: string | null;
    shipping_province?: string | null;
    total_weight_grams?: number;
    tracking_number?: string | null;
    unique_code: number;
    total_amount: number;
    is_newly_placed?: boolean;
    payment_proof?: string | null;
    payment_details?: any;
    created_at: string;
    paid_at?: string | null;
    items: OrderItemData[];
}

export interface SanubariSharedProps {
    [key: string]: unknown;
    name: string;
    locale: 'id' | 'en';
    settings: {
        brand_name?: string;
        tagline?: Record<string, string> | string;
        description?: Record<string, string> | string;
        whatsapp?: string;
        maps_url?: string;
        address?: string;
        opening_hours?: string;
        instagram?: string;
        email?: string;
        free_shipping_min?: number;
        home_rec_title?: string;
        home_rec_subtitle?: string;
        home_hero_show_text?: boolean;
        home_hero_slides?: any[];
        home_video_show_tag?: boolean;
        home_video_tag?: string;
        home_video_show_title?: boolean;
        home_video_title?: string;
        home_video_subtitle?: string;
        home_video_url?: string;
        home_place_title?: string;
        home_place_subtitle?: string;
        home_place_items?: any[];
        home_laris_title?: string;
        home_laris_subtitle?: string;
        home_laris_1_title?: string;
        home_laris_1_href?: string;
        home_laris_1_image?: string;
        home_laris_2_title?: string;
        home_laris_2_subtitle?: string;
        home_laris_2_href?: string;
        home_laris_2_image?: string;
        home_laris_3_title?: string;
        home_laris_3_href?: string;
        home_laris_3_image?: string;
        home_editorial_title?: string;
        home_editorial_subtitle?: string;
        home_koleksi_title?: string;
        home_koleksi_subtitle?: string;
        home_flavor_title?: string;
        home_flavor_subtitle?: string;
        home_flavor_items?: any[];
        announcement_enabled?: boolean;
        announcement_text_id?: string;
        announcement_text_en?: string;
        announcement_link?: string;
        [key: string]: any;
    };
    navCategories: Category[];
    desktopMegaMenuCategories?: any[];
    auth: {
        user?: {
            id: number;
            name: string;
            email: string;
        } | null;
    };
}
