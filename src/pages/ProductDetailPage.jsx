import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ShoppingBag, 
  ShieldCheck, 
  Heart, 
  Award, 
  CreditCard, 
  MessageCircle, 
  Coffee 
} from 'lucide-react';
import { PRODUCTS, CATEGORIES, STORE_INFO } from '../data/products';
import { formatRupiah, generateWhatsAppMessage } from '../utils/format';
import ProductCard from '../components/ProductCard';

export default function ProductDetailPage({ 
  onAddToCart, 
  wishlist = [], 
  onToggleWishlist, 
  showToast,
  onOpenCart
}) {
  const { slug } = useParams();
  const navigate = useNavigate();

  // Find product by slug or id
  const product = PRODUCTS.find((p) => p.slug === slug || p.id === slug);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [mobileImageIndex, setMobileImageIndex] = useState(0);
  const mobileSliderRef = useRef(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setZoomPos({ x, y });
  };

  const handleMobileScroll = (e) => {
    const width = e.currentTarget.clientWidth;
    if (width > 0) {
      const idx = Math.round(e.currentTarget.scrollLeft / width);
      setMobileImageIndex(idx);
    }
  };

  // Set default variant on product change & scroll to top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (product && product.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
    } else {
      setSelectedVariant(null);
    }
    setActiveImageIndex(0);
    setMobileImageIndex(0);
    if (mobileSliderRef.current) {
      mobileSliderRef.current.scrollLeft = 0;
    }
    setQuantity(1);
  }, [slug, product]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <Coffee className="w-16 h-16 text-slate-300 mx-auto opacity-70 mb-4" />
        <h2 className="text-2xl font-bold text-slate-900">Produk Tidak Ditemukan</h2>
        <p className="text-xs text-slate-500 mt-2 mb-6">
          Maaf, produk dengan link "{slug}" tidak tersedia atau telah dipindahkan.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#0070f3] to-[#0052cc] text-white font-bold text-xs hover:brightness-110 transition-all shadow-lg shadow-blue-500/25"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Katalog Alat</span>
        </Link>
      </div>
    );
  }

  const isWishlisted = wishlist.some((w) => w.id === product.id);
  const categoryObj = CATEGORIES.find((c) => c.id === product.category);

  // Related products
  const relatedProducts = PRODUCTS.filter(
    (p) => p.id !== product.id && p.category === product.category
  ).slice(0, 4);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      onAddToCart(product, selectedVariant);
    }
    showToast(`"${product.name}" (${quantity}x) berhasil dimasukkan ke keranjang!`);
  };

  const handleCheckoutDirect = () => {
    handleAddToCart();
    if (onOpenCart) {
      onOpenCart();
    }
  };

  const handleBuyWhatsApp = () => {
    const item = {
      ...product,
      quantity,
      selectedVariant
    };
    const waUrl = `https://wa.me/${STORE_INFO.whatsappNumber}?text=${generateWhatsAppMessage([item], `Halo Admin Sanubari x Alat Kopi Malang, saya mau order:\nProduk: ${product.name}${selectedVariant ? ` (${selectedVariant.label})` : ''}\nJumlah: ${quantity} pcs\nLink: ${window.location.href}`)}`;
    window.open(waUrl, '_blank');
  };

  const discountPercent = product.discountPercent || (product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : null);
  const stockCount = product.stock || 20;

  return (
    <div className="min-h-screen bg-slate-50/40 text-slate-900 py-6 sm:py-10 px-4 sm:px-6 lg:px-8 pb-24">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Main Product Card Container (Persis Screenshot) */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-7 lg:gap-10 items-start">
            
            {/* Left Column: Product Photo (Mobile Swipeable Slider & Desktop Zoom Photo) */}
            <div className="md:col-span-5">
              
              {/* MOBILE VERSION (md:hidden): Swipeable Slide Carousel, NO small thumbnails below */}
              <div className="md:hidden relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-100 shadow-xs">
                {product.images && product.images.length > 1 ? (
                  <div 
                    ref={mobileSliderRef}
                    onScroll={handleMobileScroll}
                    className="w-full h-full flex overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth"
                  >
                    {product.images.map((img, idx) => (
                      <div key={idx} className="w-full h-full shrink-0 snap-center relative">
                        <img
                          src={img}
                          alt={`${product.name} ${idx + 1}`}
                          className="w-full h-full object-cover"
                          loading={idx === 0 ? "eager" : "lazy"}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                )}

                {/* Top-Left Discount Badge on Mobile */}
                {(discountPercent || product.badge) && (
                  <div className="absolute top-3 left-3 z-10 pointer-events-none">
                    <span className="px-2.5 py-1 rounded-lg text-[11px] font-extrabold uppercase tracking-wider bg-[#ef4444] text-white shadow-xs">
                      {discountPercent ? `HEMAT ${discountPercent}%` : product.badge}
                    </span>
                  </div>
                )}

                {/* Top-Right Wishlist Toggle on Mobile */}
                <button
                  type="button"
                  onClick={() => onToggleWishlist(product)}
                  className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-white/95 backdrop-blur-xs border border-slate-200/80 flex items-center justify-center transition-all z-20 shadow-xs active:scale-95 ${
                    isWishlisted 
                      ? 'text-red-500 fill-red-500 border-red-200' 
                      : 'text-slate-400 hover:text-red-500'
                  }`}
                  title={isWishlisted ? 'Hapus dari Keinginan' : 'Simpan ke Keinginan'}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>

                {/* Mobile Image Counter Indicator (e.g. 1/3) */}
                {product.images && product.images.length > 1 && (
                  <div className="absolute bottom-3 right-3 z-10 bg-slate-900/75 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs pointer-events-none">
                    {mobileImageIndex + 1}/{product.images.length}
                  </div>
                )}
              </div>

              {/* DESKTOP VERSION (hidden md:block): Cursor tracking zoom + small thumbnails below */}
              <div className="hidden md:block space-y-3">
                {/* Main Desktop Photo with Cursor Tracking Zoom */}
                <div 
                  className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-100 shadow-xs cursor-zoom-in group/photo"
                  onMouseEnter={() => setIsZoomed(true)}
                  onMouseLeave={() => {
                    setIsZoomed(false);
                    setZoomPos({ x: 50, y: 50 });
                  }}
                  onMouseMove={handleMouseMove}
                >
                  <img
                    src={product.images[activeImageIndex] || product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-200 ease-out pointer-events-none select-none"
                    style={{
                      transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                      transform: isZoomed ? 'scale(1.8)' : 'scale(1)'
                    }}
                  />

                  {/* Top-Left Discount Badge on Desktop */}
                  {(discountPercent || product.badge) && (
                    <div className="absolute top-3 left-3 z-10 pointer-events-none">
                      <span className="px-2.5 py-1 rounded-lg text-[11px] font-extrabold uppercase tracking-wider bg-[#ef4444] text-white shadow-xs">
                        {discountPercent ? `HEMAT ${discountPercent}%` : product.badge}
                      </span>
                    </div>
                  )}

                  {/* Top-Right Wishlist Toggle on Desktop */}
                  <button
                    type="button"
                    onClick={() => onToggleWishlist(product)}
                    className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-white/95 backdrop-blur-xs border border-slate-200/80 flex items-center justify-center transition-all z-20 shadow-xs hover:scale-105 active:scale-95 ${
                      isWishlisted 
                        ? 'text-red-500 fill-red-500 border-red-200' 
                        : 'text-slate-400 hover:text-red-500'
                    }`}
                    title={isWishlisted ? 'Hapus dari Keinginan' : 'Simpan ke Keinginan'}
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Desktop Thumbnail Selector below */}
                {product.images && product.images.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
                    {product.images.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImageIndex(idx)}
                        className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                          activeImageIndex === idx
                            ? 'border-[#4f46e5] shadow-xs'
                            : 'border-slate-200 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Right Column: Product Info & Actions */}
            <div className="md:col-span-7 flex flex-col justify-between">
              <div>
                {/* Product Title */}
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight tracking-tight">
                  {product.name}
                </h1>

                {/* Brand & Guarantee Pill Bar */}
                <div className="mt-3 flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#4f46e5] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block leading-none">
                        MERK / BRAND RESMI
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-slate-900 leading-tight block mt-0.5">
                        {product.brand}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>100% Original</span>
                  </div>
                </div>

                {/* Price Row */}
                <div className="mt-4 flex items-baseline gap-3">
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#4f46e5]">
                    {formatRupiah(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm sm:text-base font-semibold text-slate-400 line-through">
                      {formatRupiah(product.originalPrice)}
                    </span>
                  )}
                </div>

                {/* Variasi Selector */}
                {product.variants && product.variants.length > 0 && (
                  <div className="mt-4">
                    <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 mb-2">
                      <span>🎨</span>
                      <span>Pilih Variasi Warna:</span>
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {product.variants.map((v) => (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => setSelectedVariant(v)}
                          disabled={!v.inStock}
                          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                            selectedVariant?.id === v.id
                              ? 'bg-white border-2 border-slate-900 text-slate-900 shadow-xs'
                              : v.inStock
                                ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white hover:border-slate-300'
                                : 'bg-slate-100 text-slate-400 border-slate-200 line-through cursor-not-allowed'
                          }`}
                        >
                          {v.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Description & Specifications Box */}
                <div className="mt-4 p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-1.5">
                    Deskripsi &amp; Spesifikasi Produk:
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Quantity Stepper */}
                <div className="mt-4 flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-700">Jumlah:</span>
                  <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden shadow-xs">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors text-sm font-bold"
                    >
                      -
                    </button>
                    <span className="w-10 text-center text-xs font-bold text-slate-900">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(stockCount, quantity + 1))}
                      className="w-8 h-8 flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors text-sm font-bold"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Maks. {stockCount} pcs
                  </span>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="mt-5 space-y-2.5">
                <div className="flex items-center gap-2.5">
                  {/* + Tambah Keranjang */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="flex-1 py-3 px-4 rounded-xl sm:rounded-2xl bg-white hover:bg-indigo-50/60 text-[#4f46e5] border-2 border-[#4f46e5] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xs active:scale-98"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#4f46e5]" />
                    <span>+ Tambah Keranjang</span>
                  </button>

                  {/* Checkout */}
                  <button
                    type="button"
                    onClick={handleCheckoutDirect}
                    className="flex-1 py-3 px-4 rounded-xl sm:rounded-2xl bg-[#4f46e5] hover:bg-[#4338ca] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-500/20 active:scale-98"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Checkout</span>
                  </button>
                </div>

                {/* Order Via WhatsApp */}
                <button
                  type="button"
                  onClick={handleBuyWhatsApp}
                  className="w-full py-3.5 px-4 rounded-xl sm:rounded-2xl bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-green-500/20 transition-all active:scale-98"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Order Via WhatsApp</span>
                </button>
              </div>

            </div>

          </div>
        </div>

        {/* Related Products Section (Clean & Simple) */}
        {relatedProducts.length > 0 && (
          <div className="pt-4">
            <div className="flex items-center justify-between mb-5">
              <div>
                <span className="text-xs font-bold text-[#4f46e5] uppercase tracking-wider block">
                  REKOMENDASI TERKAIT
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-0.5">
                  Pilihan Lain di Kategori {categoryObj?.name}
                </h3>
              </div>
              <Link
                to={`/kategori/${categoryObj?.slug || product.category}`}
                className="text-xs font-bold text-[#4f46e5] hover:underline"
              >
                Lihat Semua →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
              {relatedProducts.map((item) => (
                <ProductCard
                  key={item.id}
                  product={item}
                  onQuickView={(p) => navigate(`/product/${p.slug}`)}
                  onAddToCart={onAddToCart}
                  isWishlisted={wishlist.some((w) => w.id === item.id)}
                  onToggleWishlist={onToggleWishlist}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
