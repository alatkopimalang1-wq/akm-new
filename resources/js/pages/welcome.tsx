import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Product, Category, HeroBanner, ShowroomItem, CartItem } from '../types';
import Navbar from '../components/Navbar';
import HeroSlider from '../components/HeroSlider';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import CartDrawer from '../components/CartDrawer';
import ShowroomSection from '../components/ShowroomSection';
import Footer from '../components/Footer';
import { Sparkles, Filter, SlidersHorizontal } from 'lucide-react';

interface WelcomeProps {
    banners?: HeroBanner[];
    categories?: Category[];
    products?: Product[];
    showroom?: ShowroomItem[];
    settings?: Record<string, string>;
}

export default function Welcome({
    banners = [],
    categories = [],
    products = [],
    showroom = [],
    settings = {},
}: WelcomeProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    const whatsappNumber = settings.store_whatsapp || '6281234567890';
    const storeAddress = settings.store_address || 'Jl. Terusan Dieng No. 42, Malang, Jawa Timur';
    const storeHours = settings.store_hours || 'Setiap Hari: 09.00 - 21.00 WIB';

    // Filter products based on selected category pill
    const filteredProducts = selectedCategory
        ? products.filter((p) => p.categories?.some((c) => c.slug === selectedCategory))
        : products;

    // Cart management
    const handleAddToCart = (product: Product, quantity: number = 1) => {
        setCartItems((prev) => {
            const existingIndex = prev.findIndex((item) => item.product.id === product.id);
            if (existingIndex > -1) {
                const updated = [...prev];
                updated[existingIndex].quantity += quantity;
                return updated;
            }
            return [...prev, { product, quantity }];
        });
        setIsCartOpen(true);
    };

    const handleUpdateQuantity = (productId: number, delta: number) => {
        setCartItems((prev) =>
            prev
                .map((item) => {
                    if (item.product.id === productId) {
                        const newQ = item.quantity + delta;
                        return newQ > 0 ? { ...item, quantity: newQ } : null;
                    }
                    return item;
                })
                .filter(Boolean) as CartItem[]
        );
    };

    const handleRemoveItem = (productId: number) => {
        setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
    };

    const handleClearCart = () => {
        setCartItems([]);
    };

    const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="min-h-screen bg-[#0e1015] text-[#f1f3f7] flex flex-col justify-between selection:bg-[#e69c24] selection:text-black">
            <Head title="Alat Kopi Malang — Curated Coffee Equipment & Barista Tools" />

            {/* Navbar */}
            <Navbar
                categories={categories}
                cartCount={totalCartCount}
                onOpenCart={() => setIsCartOpen(true)}
                selectedCategory={selectedCategory}
                onSelectCategory={(slug) => setSelectedCategory(slug)}
            />

            {/* Hero Slider */}
            <HeroSlider banners={banners} />

            {/* Catalog Section */}
            <section id="catalog" className="py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                {/* Catalog Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-1.5">
                            <Sparkles className="w-4 h-4 text-amber-400" />
                            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                                KOLEKSI TERSEDIA
                            </span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-extrabold text-white">
                            Peralatan Seduh & Mesin Kopi
                        </h2>
                    </div>

                    <div className="text-xs text-stone-400 font-medium">
                        Menampilkan <span className="font-bold text-white">{filteredProducts.length}</span> alat kopi
                    </div>
                </div>

                {/* Product Grid */}
                {filteredProducts.length === 0 ? (
                    <div className="p-16 rounded-3xl bg-[#151821] border border-[#232838] text-center text-stone-500">
                        <p className="text-base font-bold text-stone-400 mb-2">Belum ada produk untuk kategori ini</p>
                        <p className="text-xs text-stone-500 mb-6">Pilih kategori lain atau tambahkan produk baru di /admin.</p>
                        <button
                            onClick={() => setSelectedCategory('')}
                            className="px-4 py-2 rounded-xl bg-[#e69c24] text-black font-bold text-xs"
                        >
                            Tampilkan Semua Koleksi
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                        {filteredProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onSelectProduct={(p) => setSelectedProduct(p)}
                                onAddToCart={(p) => handleAddToCart(p, 1)}
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* Showroom Physical Experience Section */}
            <ShowroomSection
                showroomItems={showroom}
                address={storeAddress}
                hours={storeHours}
            />

            {/* Footer */}
            <Footer whatsappNumber={whatsappNumber} address={storeAddress} />

            {/* Modals & Drawers */}
            <ProductModal
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
                onAddToCart={(p, q) => handleAddToCart(p, q)}
                whatsappNumber={whatsappNumber}
            />

            <CartDrawer
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                cartItems={cartItems}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onClearCart={handleClearCart}
                whatsappNumber={whatsappNumber}
            />
        </div>
    );
}
