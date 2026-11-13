import React, { useState } from 'react';
import { Product } from '../types';
import { X, ShoppingBag, ShieldCheck, Truck, Check, Share2, ExternalLink } from 'lucide-react';

interface ProductModalProps {
    product: Product | null;
    onClose: () => void;
    onAddToCart: (product: Product, quantity: number) => void;
    whatsappNumber?: string;
}

export default function ProductModal({
    product,
    onClose,
    onAddToCart,
    whatsappNumber = '6281234567890',
}: ProductModalProps) {
    if (!product) return null;

    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState<string>(
        product.primary_image_url || (product.images && product.images[0]?.path) || ''
    );
    const [copied, setCopied] = useState(false);

    const isOutOfStock = product.stock <= 0 || product.stock_status === 'out_of_stock';
    const discount = product.discount_percent || 0;

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.origin + `/product/${product.slug}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleConsultBarista = () => {
        const text = encodeURIComponent(
            `Halo Barista AKM, saya ingin konsultasi mengenai alat kopi: *${product.name}* (Rp ${product.price.toLocaleString('id-ID')}). Apakah unit display testing tersedia di showroom Malang?`
        );
        window.open(`https://wa.me/${whatsappNumber}?text=${text}`, '_blank');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-4xl bg-[#151821] border border-[#232838] rounded-3xl shadow-2xl overflow-hidden text-stone-200">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-[#0e1015]/80 hover:bg-[#0e1015] text-stone-400 hover:text-white flex items-center justify-center border border-[#232838] transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* Left: Gallery */}
                    <div className="p-6 md:p-8 bg-[#0e1015]/50 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#232838]">
                        <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#0e1015] border border-[#232838] mb-4 flex items-center justify-center">
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
                                <div className="absolute top-4 left-4 px-3 py-1 rounded-md text-xs font-black bg-amber-500 text-black shadow-lg">
                                    HEMAT {discount}%
                                </div>
                            )}
                        </div>

                        {/* Gallery Thumbnails */}
                        {product.images && product.images.length > 1 && (
                            <div className="flex items-center gap-2 overflow-x-auto py-1">
                                {product.images.map((img) => (
                                    <button
                                        key={img.id}
                                        onClick={() => setSelectedImage(img.path)}
                                        className={`w-14 h-14 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
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

                    {/* Right: Info & Actions */}
                    <div className="p-6 md:p-8 flex flex-col justify-between max-h-[80vh] overflow-y-auto">
                        <div>
                            {product.brand && (
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                                        {product.brand}
                                    </span>
                                    <button
                                        onClick={handleShare}
                                        className="text-xs text-stone-400 hover:text-white flex items-center gap-1"
                                    >
                                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                                        {copied ? 'Tersalin' : 'Bagikan'}
                                    </button>
                                </div>
                            )}

                            <h2 className="text-xl md:text-2xl font-extrabold text-white leading-snug mb-2">
                                {product.name}
                            </h2>

                            {product.tagline && (
                                <p className="text-xs text-stone-400 italic mb-4">{product.tagline}</p>
                            )}

                            {/* Pricing */}
                            <div className="flex items-baseline gap-3 mb-6 p-3.5 rounded-xl bg-[#0e1015] border border-[#232838]">
                                <span className="text-2xl font-black text-amber-400">
                                    Rp {product.price.toLocaleString('id-ID')}
                                </span>
                                {product.original_price && product.original_price > product.price && (
                                    <span className="text-sm text-stone-500 line-through">
                                        Rp {product.original_price.toLocaleString('id-ID')}
                                    </span>
                                )}
                            </div>

                            {/* Description */}
                            <div className="text-sm text-stone-300 leading-relaxed mb-6 space-y-2">
                                <p>{product.short_description || product.description || 'Peralatan kopi kurasi resmi Sanubari Roastery Malang.'}</p>
                            </div>

                            {/* Specifications */}
                            {product.specifications && Object.keys(product.specifications).length > 0 && (
                                <div className="mb-6 border-t border-[#232838] pt-4">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2.5">
                                        Spesifikasi Teknis
                                    </h4>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        {Object.entries(product.specifications).map(([key, val]) => (
                                            <div key={key} className="bg-[#0e1015] p-2 rounded-lg border border-[#232838]/60">
                                                <span className="text-stone-500 block text-[10px] uppercase font-bold">{key}</span>
                                                <span className="text-white font-medium">{val}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Order Actions */}
                        <div className="border-t border-[#232838] pt-6 space-y-3">
                            <div className="flex items-center gap-3">
                                {/* Quantity counter */}
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

                                {/* Add to Bag Button */}
                                <button
                                    disabled={isOutOfStock}
                                    onClick={() => {
                                        onAddToCart(product, quantity);
                                        onClose();
                                    }}
                                    className={`flex-1 py-3 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                                        isOutOfStock
                                            ? 'bg-[#1f2433] text-stone-600 cursor-not-allowed'
                                            : 'bg-[#e69c24] hover:bg-[#d98a18] text-black shadow-lg shadow-amber-500/20 active:scale-95'
                                    }`}
                                >
                                    <ShoppingBag className="w-4 h-4" />
                                    {isOutOfStock ? 'Stok Habis' : 'Masukkan ke Keranjang'}
                                </button>
                            </div>

                            {/* Consult Barista WhatsApp */}
                            <button
                                onClick={handleConsultBarista}
                                className="w-full py-2.5 px-4 rounded-xl border border-[#232838] hover:border-amber-500/40 bg-[#0e1015] hover:bg-[#12151e] text-xs font-semibold text-stone-300 hover:text-white transition-all flex items-center justify-center gap-2"
                            >
                                Tanya Barista AKM via WhatsApp &rarr;
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

