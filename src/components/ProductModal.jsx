import React, { useState } from 'react';
import { 
  X, 
  ShoppingBag, 
  PhoneCall, 
  Star, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Check, 
  Heart,
  ExternalLink,
  Info
} from 'lucide-react';
import { formatRupiah, generateWhatsAppMessage } from '../utils/format';
import { STORE_INFO } from '../data/products';

export default function ProductModal({ 
  product, 
  onClose, 
  onAddToCart, 
  isWishlisted, 
  onToggleWishlist 
}) {
  if (!product) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants && product.variants.length > 0 ? product.variants[0] : null
  );
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      onAddToCart(product, selectedVariant);
    }
    onClose();
  };

  const handleBuyWhatsApp = () => {
    const item = {
      ...product,
      quantity,
      selectedVariant
    };
    const waUrl = `https://wa.me/${STORE_INFO.whatsappNumber}?text=${generateWhatsAppMessage([item], 'Pemesanan Langsung via Modal Web AKM')}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div 
        className="relative w-full max-w-4xl bg-white text-slate-900 rounded-3xl border border-slate-200 shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 border border-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 sm:p-8">
          
          {/* Images Section */}
          <div className="md:col-span-6 space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.badge && (
                <span className="absolute top-3 left-3 px-3 py-1 rounded-md text-xs font-extrabold uppercase bg-white/90 text-[#0070f3] border border-blue-200 shadow-xs">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Thumbnail selector */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImageIndex === idx 
                        ? 'border-[#0070f3] scale-105 shadow-sm' 
                        : 'border-slate-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Guarantees */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#0070f3]" />
                <span>100% Produk Original &amp; Garansi Resmi Distributor</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#0070f3]" />
                <span>Pengiriman Cepat se-Indonesia &amp; Instant GoSend Area Malang</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#0070f3]" />
                <span>Garansi Tukar Baru 7 Hari jika terdapat cacat pabrik</span>
              </div>
            </div>
          </div>

          {/* Details & Specifications */}
          <div className="md:col-span-6 flex flex-col justify-between space-y-5">
            <div>
              {/* Brand & Category */}
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="uppercase tracking-widest font-bold text-[#0070f3]">
                  {product.brand}
                </span>
                <div className="flex items-center gap-1 text-slate-800">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="font-bold">{product.rating}</span>
                  <span className="text-slate-400">({product.reviewCount} ulasan)</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                {product.name}
              </h2>

              <p className="text-xs text-slate-600 font-medium mt-1">
                {product.tagline}
              </p>

              {/* Price */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#0070f3]">
                  {formatRupiah(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-slate-400 line-through">
                    {formatRupiah(product.originalPrice)}
                  </span>
                )}
                {product.discountPercent > 0 && (
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-600 text-white shadow-xs">
                    Hemat {product.discountPercent}%
                  </span>
                )}
              </div>

              {/* Variants */}
              {product.variants && product.variants.length > 0 && (
                <div className="mt-5">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    Pilih Varian / Warna:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        disabled={!v.inStock}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
                          selectedVariant?.id === v.id
                            ? 'bg-blue-50 text-[#0070f3] border-blue-400 font-bold shadow-xs'
                            : v.inStock
                              ? 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                              : 'bg-slate-100 text-slate-400 border-slate-200 line-through cursor-not-allowed'
                        }`}
                      >
                        {v.label} {!v.inStock && '(Habis)'}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="mt-4 text-xs text-slate-600 leading-relaxed">
                <p>{product.description}</p>
              </div>

              {/* Technical Specifications Table */}
              {product.specs && (
                <div className="mt-4 border-t border-slate-100 pt-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#0070f3] mb-2.5 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5" />
                    <span>Spesifikasi Teknis</span>
                  </h4>
                  <div className="space-y-1.5 text-xs">
                    {Object.entries(product.specs).map(([key, val]) => (
                      <div key={key} className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-400">{key}</span>
                        <span className="text-slate-900 font-medium text-right max-w-[60%]">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions Row */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              {/* Quantity Selector & Wishlist */}
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-sm text-slate-700 hover:bg-slate-200 rounded-l-xl"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-xs font-bold text-slate-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-sm text-slate-700 hover:bg-slate-200 rounded-r-xl"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => onToggleWishlist(product)}
                  className={`p-2.5 rounded-xl border transition-colors ${
                    isWishlisted 
                      ? 'bg-red-500 text-white border-red-500' 
                      : 'border-slate-200 text-slate-500 hover:text-slate-900 bg-white'
                  }`}
                  title="Simpan ke Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>

                <div className="text-xs text-slate-500">
                  Total: <strong className="text-slate-900">{formatRupiah(product.price * quantity)}</strong>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  className="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200 hover:border-slate-300 flex items-center justify-center gap-2 active:scale-95 transition-all shadow-xs"
                >
                  <ShoppingBag className="w-4 h-4 text-[#0070f3]" />
                  <span>Tambah ke Keranjang</span>
                </button>

                <button
                  onClick={handleBuyWhatsApp}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#0070f3] to-[#0052cc] hover:brightness-110 text-white text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md shadow-blue-500/25"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Beli via WhatsApp</span>
                </button>
              </div>

              {/* Marketplace Alternatives */}
              <div className="pt-2 text-center">
                <span className="text-[11px] text-slate-400 mr-2">Atau pesan lewat marketplace:</span>
                <a
                  href={STORE_INFO.tokopediaStoreUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-emerald-600 hover:underline mr-3 font-semibold"
                >
                  Tokopedia ↗
                </a>
                <a
                  href={STORE_INFO.shopeeStoreUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-orange-600 hover:underline font-semibold"
                >
                  Shopee ↗
                </a>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
