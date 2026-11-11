import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  ShoppingBag, 
  Eye, 
  Star, 
  Check, 
  PhoneCall, 
  ExternalLink 
} from 'lucide-react';
import { formatRupiah, generateWhatsAppMessage } from '../utils/format';
import { STORE_INFO } from '../data/products';

export default function ProductCard({ 
  product, 
  onQuickView, 
  onAddToCart, 
  isWishlisted, 
  onToggleWishlist 
}) {
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants && product.variants.length > 0 ? product.variants[0] : null
  );
  const [isHovered, setIsHovered] = useState(false);

  const displayImage = isHovered && product.images.length > 1 
    ? product.images[1] 
    : product.images[0];

  const handleDirectWhatsApp = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const item = {
      ...product,
      quantity: 1,
      selectedVariant: selectedVariant
    };
    const waUrl = `https://wa.me/${STORE_INFO.whatsappNumber}?text=${generateWhatsAppMessage([item], `Order Cepat Produk: ${product.name}`)}`;
    window.open(waUrl, '_blank');
  };

  const productUrl = `/product/${product.slug}`;

  return (
    <div 
      className="group relative bg-white rounded-3xl border border-slate-200 hover:border-[#0070f3] transition-all duration-300 flex flex-col overflow-hidden shadow-xs hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Area with Link */}
      <Link to={productUrl} className="relative aspect-square overflow-hidden bg-slate-100 block">
        <img
          src={displayImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10 pointer-events-none">
          {product.badge && (
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider bg-white/95 text-[#0070f3] border border-blue-200 shadow-xs backdrop-blur-sm">
              {product.badge}
            </span>
          )}
          {product.discountPercent > 0 && (
            <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-red-600 text-white shadow-xs">
              HEMAT {product.discountPercent}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors z-20 shadow-xs ${
            isWishlisted 
              ? 'bg-red-500 text-white' 
              : 'bg-white/80 text-slate-500 hover:text-slate-900 hover:bg-white'
          }`}
          title={isWishlisted ? 'Hapus dari Keinginan' : 'Simpan ke Keinginan'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Button on Hover */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:flex items-center justify-center gap-2 z-10">
          <span className="w-full py-2.5 px-3 rounded-xl bg-white/95 hover:bg-white text-slate-900 text-xs font-semibold backdrop-blur-md border border-slate-200 flex items-center justify-center gap-1.5 transition-all shadow-lg">
            <Eye className="w-3.5 h-3.5 text-[#0070f3]" />
            <span>Buka Link Produk</span>
          </span>
        </div>
      </Link>

      {/* Content Area */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Rating */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="uppercase tracking-wider font-bold text-[#0070f3]">
              {product.brand}
            </span>
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="font-bold text-slate-800">{product.rating}</span>
              <span className="text-[10px] text-slate-400">({product.reviewCount})</span>
            </div>
          </div>

          {/* Title with Link */}
          <Link to={productUrl} className="block group-hover:text-[#0070f3] transition-colors">
            <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Tagline / Subtitle */}
          <p className="text-xs text-slate-500 line-clamp-1 mt-1 font-normal">
            {product.tagline}
          </p>

          {/* Variant Selector Pills */}
          {product.variants && product.variants.length > 1 && (
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <span className="text-[10px] text-slate-400 shrink-0 font-medium">Varian:</span>
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedVariant(v);
                  }}
                  className={`text-[10px] px-2 py-0.5 rounded-lg whitespace-nowrap transition-all border ${
                    selectedVariant?.id === v.id
                      ? 'bg-blue-50 border-blue-400 text-[#0070f3] font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Price & Action Row */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-base sm:text-lg font-extrabold text-slate-900">
                {formatRupiah(product.price)}
              </span>
              {product.originalPrice && (
                <span className="block text-[11px] text-slate-400 line-through">
                  {formatRupiah(product.originalPrice)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg">
              Ready Stock
            </span>
          </div>

          {/* Buttons: Add to Cart & Buy via WA */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onAddToCart(product, selectedVariant)}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-xs font-bold border border-slate-200 hover:border-slate-300 flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-xs"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#0070f3]" />
              <span>+ Keranjang</span>
            </button>

            <button
              onClick={handleDirectWhatsApp}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#0070f3] to-[#0052cc] hover:brightness-110 text-white text-xs font-bold flex items-center justify-center gap-1 active:scale-95 transition-all shadow-md shadow-blue-500/25"
              title="Pesan via WhatsApp Sanubari"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Beli via WA</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
