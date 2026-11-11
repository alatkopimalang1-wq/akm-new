import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  ShoppingBag, 
  Check, 
  ChevronRight 
} from 'lucide-react';
import { formatRupiah } from '../utils/format';

export default function ProductCard({ 
  product, 
  onQuickView, 
  onAddToCart, 
  isWishlisted, 
  onToggleWishlist 
}) {
  const displayImage = product.images && product.images.length > 0 
    ? product.images[0] 
    : '';

  const productUrl = `/product/${product.slug}`;
  const hasVariants = product.variants && product.variants.length > 1;

  return (
    <div 
      className="group relative bg-white rounded-2xl border border-slate-200/90 hover:border-[#0e1f36]/40 transition-all duration-300 flex flex-col overflow-hidden shadow-xs hover:shadow-lg hover:-translate-y-0.5"
    >
      {/* Product Image Area with smooth zoom effect on hover */}
      <Link to={productUrl} className="relative aspect-square overflow-hidden bg-slate-50 block">
        <img
          src={displayImage}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          loading="lazy"
        />

        {/* Top-Left Badge: TERBARU */}
        <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#0e1f36] text-white shadow-xs">
            {product.badge || 'TERBARU'}
          </span>
        </div>

        {/* Top-Right Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-2.5 right-2.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/95 backdrop-blur-xs border border-slate-200/80 flex items-center justify-center transition-all z-20 shadow-xs hover:scale-105 active:scale-95 ${
            isWishlisted 
              ? 'text-red-500 fill-red-500 border-red-200' 
              : 'text-slate-400 hover:text-red-500 hover:border-slate-300'
          }`}
          title={isWishlisted ? 'Hapus dari Keinginan' : 'Simpan ke Keinginan'}
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>
      </Link>

      {/* Content Area */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand Name */}
          <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            {product.brand}
          </span>

          {/* Title */}
          <Link to={productUrl} className="block group-hover:text-[#0e1f36] transition-colors min-h-[3rem] sm:min-h-[2.6rem]">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-3 sm:line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Price Section */}
          <div className="mt-2">
            <span className="text-sm sm:text-base font-extrabold text-[#0e1f36] block leading-tight">
              {formatRupiah(product.price)}
            </span>
            {product.originalPrice ? (
              <span className="text-[10px] sm:text-[11px] text-slate-400 line-through block mt-0.5">
                {formatRupiah(product.originalPrice)}
              </span>
            ) : (
              <span className="text-[10px] sm:text-[11px] text-transparent block mt-0.5 select-none">
                -
              </span>
            )}
          </div>
        </div>

        {/* Bottom Status & Action Row */}
        <div className="mt-3 pt-2.5 flex items-center justify-between gap-2 border-t border-slate-100">
          {/* Status: ✓ Tersedia */}
          <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-600">
            <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[2.5]" />
            <span>Tersedia</span>
          </div>

          {/* Action Button: Pilih > or ShoppingBag Circle */}
          {hasVariants ? (
            <Link
              to={productUrl}
              className="inline-flex items-center gap-0.5 px-3 py-1.5 rounded-full bg-[#0e1f36] hover:bg-[#152e50] text-white text-xs font-bold transition-all shadow-xs hover:shadow-md active:scale-95"
            >
              <span>Pilih</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onAddToCart(product);
              }}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#0e1f36] hover:bg-[#152e50] text-white flex items-center justify-center transition-all shadow-xs hover:shadow-md active:scale-95"
              title="Tambah ke Keranjang"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
