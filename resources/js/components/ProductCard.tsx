import React from 'react';
import { Product } from '../types';
import { ShoppingBag, Star, Eye, Zap } from 'lucide-react';

interface ProductCardProps {
    product: Product;
    onSelectProduct: (product: Product) => void;
    onAddToCart: (product: Product) => void;
}

export default function ProductCard({
    product,
    onSelectProduct,
    onAddToCart,
}: ProductCardProps) {
    const isOutOfStock = product.stock <= 0 || product.stock_status === 'out_of_stock';
    const discount = product.discount_percent || 0;

    return (
        <div className="group relative bg-[#151821] hover:bg-[#1a1f2b] border border-[#232838] hover:border-amber-500/40 rounded-2xl p-4 transition-all duration-300 flex flex-col justify-between shadow-lg hover:shadow-amber-500/5">
            {/* Badges */}
            <div className="absolute top-6 left-6 z-10 flex flex-col gap-1.5 pointer-events-none">
                {product.is_flash_sale && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-black bg-rose-600 text-white shadow-md">
                        <Zap className="w-3 h-3 fill-white" /> FLASH SALE
                    </span>
                )}
                {discount > 0 && (
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-500 text-black">
                        HEMAT {discount}%
                    </span>
                )}
                {product.is_featured && !product.is_flash_sale && (
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        PILIHAN BARISTA
                    </span>
                )}
            </div>

            {/* Product Image */}
            <div
                onClick={() => onSelectProduct(product)}
                className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#0e1015] mb-4 cursor-pointer flex items-center justify-center border border-[#232838]/60"
            >
                {product.primary_image_url ? (
                    <img
                        src={product.primary_image_url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="text-stone-600 text-xs text-center p-4">Foto Produk Tersedia di Showroom</div>
                )}

                {/* Hover overlay quick view button */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onSelectProduct(product);
                        }}
                        className="p-2.5 rounded-xl bg-white/90 text-black hover:bg-white text-xs font-semibold shadow-xl flex items-center gap-1.5"
                    >
                        <Eye className="w-3.5 h-3.5" /> Detail Alat
                    </button>
                </div>
            </div>

            {/* Product Information */}
            <div className="flex-1 flex flex-col justify-between">
                <div>
                    {product.brand && (
                        <p className="text-[11px] font-bold uppercase tracking-wider text-amber-400/90 mb-1">
                            {product.brand}
                        </p>
                    )}
                    <h3
                        onClick={() => onSelectProduct(product)}
                        className="font-bold text-sm text-stone-100 hover:text-amber-400 cursor-pointer line-clamp-2 transition-colors mb-2"
                        title={product.name}
                    >
                        {product.name}
                    </h3>
                </div>

                <div className="pt-2 border-t border-[#232838]/60 mt-2">
                    <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-base font-extrabold text-white">
                            Rp {product.price.toLocaleString('id-ID')}
                        </span>
                        {product.original_price && product.original_price > product.price && (
                            <span className="text-xs text-stone-500 line-through">
                                Rp {product.original_price.toLocaleString('id-ID')}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center justify-between gap-2">
                        <span
                            className={`text-[11px] font-semibold ${
                                isOutOfStock ? 'text-rose-400' : 'text-emerald-400'
                            }`}
                        >
                            {isOutOfStock ? 'Stok Habis' : `Tersedia (${product.stock})`}
                        </span>

                        <button
                            disabled={isOutOfStock}
                            onClick={() => onAddToCart(product)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                                isOutOfStock
                                    ? 'bg-[#1f2433] text-stone-600 cursor-not-allowed'
                                    : 'bg-[#e69c24] hover:bg-[#d98a18] text-black shadow-md shadow-amber-500/10 active:scale-95'
                            }`}
                        >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            + Beli
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

