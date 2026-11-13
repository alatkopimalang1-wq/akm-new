import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Product, CartItem } from '../types';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import CartDrawer from '../components/CartDrawer';
import Footer from '../components/Footer';
import { ArrowLeft, ShoppingBag, ShieldCheck, Check, Share2, Sparkles } from 'lucide-react';

interface ProductDetailProps {
    product: Product;
    relatedProducts?: Product[];
}

export default function ProductDetail({
    product,
    relatedProducts = [],
}: ProductDetailProps) {
    const [selectedImage, setSelectedImage] = useState<string>(
        product.primary_image_url || (product.images && product.images[0]?.path) || ''
    );
    const [quantity, setQuantity] = useState(1);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [modalProduct, setModalProduct] = useState<Product | null>(null);

    const isOutOfStock = product.stock <= 0 || product.stock_status === 'out_of_stock';
    const discount = product.discount_percent || 0;

    const handleAddToCart = (itemProduct: Product, q: number = 1) => {
        setCartItems((prev) => {
            const idx = prev.findIndex((i) => i.product.id === itemProduct.id);
            if (idx > -1) {
                const updated = [...prev];
                updated[idx].quantity += q;
                return updated;
            }
            return [...prev, { product: itemProduct, quantity: q }];
        });
        setIsCartOpen(true);
    };

    return (
        <div className="min-h-screen bg-[#0e1015] text-[#f1f3f7] flex flex-col justify-between selection:bg-[#e69c24] selection:text-black">
            <Head title={`${product.name} — Alat Kopi Malang`} />

            <Navbar
                cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                onOpenCart={() => setIsCartOpen(true)}
            />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
                {/* Back Link */}
                <a
                    href="/"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-stone-400 hover:text-white mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Kembali ke Katalog
                </a>

                {/* Product Detail Main Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-[#151821] border border-[#232838] rounded-3xl p-6 sm:p-10 shadow-2xl mb-16">
                    {/* Left: Photos */}
                    <div className="flex flex-col gap-4">
                        <div className="aspect-square w-full rounded-2xl overflow-hidden bg-[#0e1015] border border-[#232838] relative flex items-center justify-center">
                            {selectedImage ? (
                                <img
                                    src={selectedImage}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="text-stone-600 text-sm">Foto Produk Tersedia di Showroom</div>
                            )}

                            {discount > 0 && (
                                <span className="absolute top-4 left-4 px-3 py-1 rounded-md text-xs font-black bg-amber-500 text-black shadow-lg">
                                    HEMAT {discount}%
                                </span>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {product.images && product.images.length > 1 && (
                            <div className="flex items-center gap-2 overflow-x-auto py-1">
                                {product.images.map((img) => (
                                    <button
                                        key={img.id}
                                        onClick={() => setSelectedImage(img.path)}
                                        className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                                            selectedImage === img.path
                                                ? 'border-amber-500 scale-105'
                                                : 'border-[#232838] opacity-70 hover:opacity-100'
                                        }`}
                                    >
                                        <img src={img.path} alt="thumb" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Info & Purchase */}
                    <div className="flex flex-col justify-between">
                        <div>
                            {product.brand && (
                                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 block">
                                    {product.brand}
                                </span>
                            )}
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight mb-3">
                                {product.name}
                            </h1>

                            {product.tagline && (
                                <p className="text-sm text-stone-400 italic mb-6">{product.tagline}</p>
                            )}

                            {/* Price */}
                            <div className="p-4 rounded-2xl bg-[#0e1015] border border-[#232838] mb-6 flex items-baseline gap-3">
                                <span className="text-2xl sm:text-3xl font-black text-amber-400">
                                    Rp {product.price.toLocaleString('id-ID')}
                                </span>
                                {product.original_price && product.original_price > product.price && (
                                    <span className="text-sm text-stone-500 line-through">
                                        Rp {product.original_price.toLocaleString('id-ID')}
                                    </span>
                                )}
                            </div>

                            {/* Description */}
                            <div className="text-sm text-stone-300 leading-relaxed mb-8 space-y-3">
                                <p>{product.description || product.short_description || 'Peralatan seduh kurasi resmi Sanubari Roastery Malang.'}</p>
                            </div>

                            {/* Specifications */}
                            {product.specifications && Object.keys(product.specifications).length > 0 && (
                                <div className="border-t border-[#232838] pt-6 mb-8">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">
                                        Spesifikasi Teknis
                                    </h3>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        {Object.entries(product.specifications).map(([key, val]) => (
                                            <div key={key} className="bg-[#0e1015] p-2.5 rounded-xl border border-[#232838]/60">
                                                <span className="text-stone-500 block text-[10px] uppercase font-bold">{key}</span>
                                                <span className="text-white font-medium">{val}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="border-t border-[#232838] pt-6 space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center border border-[#232838] rounded-xl bg-[#0e1015] px-2 py-1">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-8 h-8 rounded-lg text-stone-300 hover:text-white flex items-center justify-center font-bold"
                                    >
                                        -
                                    </button>
                                    <span className="w-10 text-center font-extrabold text-sm">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                                        className="w-8 h-8 rounded-lg text-stone-300 hover:text-white flex items-center justify-center font-bold"
                                    >
                                        +
                                    </button>
                                </div>

                                <button
                                    disabled={isOutOfStock}
                                    onClick={() => handleAddToCart(product, quantity)}
                                    className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                                        isOutOfStock
                                            ? 'bg-[#1f2433] text-stone-600 cursor-not-allowed'
                                            : 'bg-[#e69c24] hover:bg-[#d98a18] text-black shadow-lg shadow-amber-500/20 active:scale-95'
                                    }`}
                                >
                                    <ShoppingBag className="w-4 h-4" />
                                    {isOutOfStock ? 'Stok Habis' : 'Masukkan ke Keranjang'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div>
                        <h3 className="text-xl font-extrabold text-white mb-6">Peralatan Terkait Lainnya</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                            {relatedProducts.map((p) => (
                                <ProductCard
                                    key={p.id}
                                    product={p}
                                    onSelectProduct={(sel) => setModalProduct(sel)}
                                    onAddToCart={(add) => handleAddToCart(add, 1)}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </main>

            <Footer />

            <ProductModal
                product={modalProduct}
                onClose={() => setModalProduct(null)}
                onAddToCart={(p, q) => handleAddToCart(p, q)}
            />

            <CartDrawer
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                cartItems={cartItems}
                onUpdateQuantity={(id, delta) => {
                    setCartItems((prev) =>
                        prev
                            .map((item) =>
                                item.product.id === id ? { ...item, quantity: item.quantity + delta } : item
                            )
                            .filter((i) => i.quantity > 0)
                    );
                }}
                onRemoveItem={(id) => setCartItems((prev) => prev.filter((i) => i.product.id !== id))}
                onClearCart={() => setCartItems([])}
            />
        </div>
    );
}

