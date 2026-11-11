import React, { useState } from 'react';
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
    e.stopPropagation();
    const item = {
      ...product,
      quantity: 1,
      selectedVariant: selectedVariant
    };
    const waUrl = `https://wa.me/${STORE_INFO.whatsappNumber}?text=${generateWhatsAppMessage([item], 'Order Cepat Langsung via Web')}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div 
      className="group relative bg-[#1c1917] rounded-2xl border border-[#292524] hover:border-[#c2a676]/40 transition-all duration-300 flex flex-col overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-[#c2a676]/5"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Area */}
      <div className="relative aspect-square overflow-hidden bg-[#24201d] cursor-pointer" onClick={() => onQuickView(product)}>
        <img
          src={displayImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-95"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {product.badge && (
            <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-[#141211]/90 text-[#c2a676] border border-[#c2a676]/30 backdrop-blur-sm">
              {product.badge}
            </span>
          )}
          {product.discountPercent > 0 && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#b91c1c] text-white">
              HEMAT {product.discountPercent}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors z-10 ${
            isWishlisted 
              ? 'bg-[#ef4444] text-white' 
              : 'bg-[#141211]/70 text-[#a8a29e] hover:text-[#f5f5f4] hover:bg-[#141211]'
          }`}
          title={isWishlisted ? 'Hapus dari Keinginan' : 'Simpan ke Keinginan'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Button on Hover */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:flex items-center justify-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="w-full py-2 px-3 rounded-xl bg-[#141211]/90 hover:bg-[#141211] text-[#f5f5f4] text-xs font-semibold backdrop-blur-md border border-[#38332f] flex items-center justify-center gap-1.5 transition-all shadow-lg"
          >
            <Eye className="w-3.5 h-3.5 text-[#c2a676]" />
            <span>Lihat Detail &amp; Spesifikasi</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Rating */}
          <div className="flex items-center justify-between text-xs text-[#78716c] mb-1.5">
            <span className="uppercase tracking-wider font-semibold text-[#c2a676]">
              {product.brand}
            </span>
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="font-bold text-[#f5f5f4]">{product.rating}</span>
              <span className="text-[10px]">({product.reviewCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3 
            onClick={() => onQuickView(product)}
            className="text-sm font-bold text-[#f5f5f4] group-hover:text-[#c2a676] transition-colors line-clamp-2 cursor-pointer leading-snug"
          >
            {product.name}
          </h3>

          {/* Tagline / Subtitle */}
          <p className="text-xs text-[#a8a29e] line-clamp-1 mt-1 font-normal">
            {product.tagline}
          </p>

          {/* Variant Selector Pills */}
          {product.variants && product.variants.length > 1 && (
            <div className="mt-3 pt-2.5 border-t border-[#292524] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <span className="text-[10px] text-[#78716c] shrink-0 font-medium">Varian:</span>
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedVariant(v);
                  }}
                  className={`text-[10px] px-2 py-0.5 rounded-md whitespace-nowrap transition-all border ${
                    selectedVariant?.id === v.id
                      ? 'bg-[#c2a676]/20 border-[#c2a676] text-[#c2a676] font-bold'
                      : 'bg-[#292524]/60 border-transparent text-[#a8a29e] hover:border-[#38332f]'
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Price & Action Row */}
        <div className="mt-4 pt-3 border-t border-[#292524]">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-base sm:text-lg font-extrabold text-[#f5f5f4]">
                {formatRupiah(product.price)}
              </span>
              {product.originalPrice && (
                <span className="block text-[11px] text-[#78716c] line-through">
                  {formatRupiah(product.originalPrice)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded">
              Ready Stock
            </span>
          </div>

          {/* Buttons: Add to Cart & Buy via WA */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onAddToCart(product, selectedVariant)}
              className="w-full py-2.5 px-3 rounded-xl bg-[#292524] hover:bg-[#38332f] text-[#f5f5f4] text-xs font-bold border border-[#38332f] hover:border-[#c2a676]/50 flex items-center justify-center gap-1.5 active:scale-95 transition-all"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#c2a676]" />
              <span>+ Keranjang</span>
            </button>

            <button
              onClick={handleDirectWhatsApp}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#c2a676] to-[#b45309] hover:brightness-110 text-[#141211] text-xs font-bold flex items-center justify-center gap-1 active:scale-95 transition-all shadow-sm"
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

