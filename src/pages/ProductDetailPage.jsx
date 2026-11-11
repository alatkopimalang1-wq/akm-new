import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ShoppingBag, 
  PhoneCall, 
  Star, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Check, 
  Heart, 
  Share2, 
  Copy, 
  CheckCircle2, 
  Info, 
  Coffee, 
  SlidersHorizontal,
  ExternalLink 
} from 'lucide-react';
import { PRODUCTS, CATEGORIES, STORE_INFO } from '../data/products';
import { formatRupiah, generateWhatsAppMessage } from '../utils/format';
import ProductCard from '../components/ProductCard';

export default function ProductDetailPage({ 
  onAddToCart, 
  wishlist, 
  onToggleWishlist, 
  showToast 
}) {
  const { slug } = useParams();
  const navigate = useNavigate();

  // Find product by slug or id
  const product = PRODUCTS.find((p) => p.slug === slug || p.id === slug);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [copied, setCopied] = useState(false);

  // Set default variant on product change & scroll to top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (product && product.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
    } else {
      setSelectedVariant(null);
    }
    setActiveImageIndex(0);
    setQuantity(1);
  }, [slug, product]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <Coffee className="w-16 h-16 text-[#64748b] mx-auto opacity-50 mb-4" />
        <h2 className="text-2xl font-bold text-[#f1f5f9]">Produk Tidak Ditemukan</h2>
        <p className="text-xs text-[#94a3b8] mt-2 mb-6">
          Maaf, produk dengan link "{slug}" tidak tersedia atau telah dipindahkan.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#0070f3] to-[#0052cc] text-white font-bold text-xs hover:brightness-110 transition-all shadow-lg shadow-[#0070f3]/25"
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

  const handleBuyWhatsApp = () => {
    const item = {
      ...product,
      quantity,
      selectedVariant
    };
    const waUrl = `https://wa.me/${STORE_INFO.whatsappNumber}?text=${generateWhatsAppMessage([item], `Pemesanan dari Link Produk: ${window.location.href}`)}`;
    window.open(waUrl, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    showToast('Link produk berhasil disalin ke clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#070e1b] text-[#f1f5f9] pb-24">
      
      {/* Top Breadcrumb Bar */}
      <div className="border-b border-[#172b47] bg-[#091322]/80 backdrop-blur-sm py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-[#94a3b8]">
          <div className="flex items-center gap-2 flex-wrap">
            <Link to="/" className="hover:text-[#38bdf8] transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Katalog Alat</span>
            </Link>
            <span className="text-[#1e3a5f]">/</span>
            <span className="text-[#94a3b8]">{categoryObj?.name || 'Alat Kopi'}</span>
            <span className="text-[#1e3a5f]">/</span>
            <span className="text-[#38bdf8] font-medium truncate max-w-xs">{product.name}</span>
          </div>

          {/* Share Button */}
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0b172a] hover:bg-[#112240] text-[#38bdf8] text-xs font-semibold border border-[#172b47] transition-all"
            title="Salin Link Produk Ini"
          >
            {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Tersalin!' : 'Bagikan Link'}</span>
          </button>
        </div>
      </div>

      {/* Main Product Hero Details Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Product Photos & Guarantees */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Primary Big Photo */}
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-[#0b172a] border border-[#172b47] shadow-2xl">
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />

              {/* Floating Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                {product.badge && (
                  <span className="px-3.5 py-1.5 rounded-lg text-xs font-extrabold uppercase tracking-wider bg-[#070e1b]/90 text-[#38bdf8] border border-[#0070f3]/40 backdrop-blur-md">
                    {product.badge}
                  </span>
                )}
                {product.discountPercent > 0 && (
                  <span className="px-3 py-1 rounded-lg text-xs font-extrabold bg-[#ef4444] text-white shadow-md">
                    HEMAT {product.discountPercent}%
                  </span>
                )}
              </div>

              {/* Wishlist toggle */}
              <button
                onClick={() => onToggleWishlist(product)}
                className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-all shadow-lg ${
                  isWishlisted
                    ? 'bg-[#ef4444] text-white'
                    : 'bg-[#070e1b]/80 text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#0b172a] border border-[#172b47]'
                }`}
                title={isWishlisted ? 'Hapus dari Keinginan' : 'Simpan ke Wishlist'}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Thumbnail Selectors */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                      activeImageIndex === idx
                        ? 'border-[#0084ff] scale-105 shadow-lg shadow-[#0070f3]/20'
                        : 'border-[#172b47] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Guarantees Box */}
            <div className="p-5 rounded-2xl bg-[#0b172a] border border-[#172b47] space-y-3 text-xs text-[#94a3b8]">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-[#38bdf8] shrink-0" />
                <div>
                  <strong className="text-[#f1f5f9] block">100% Produk Original &amp; Bergaransi Resmi</strong>
                  <span className="text-[11px] text-[#64748b]">Bukan produk OEM atau rekondisi, jaminan mutu distributor</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-[#38bdf8] shrink-0" />
                <div>
                  <strong className="text-[#f1f5f9] block">Gratis Ongkir se-Jawa (Min. Rp 500rb)</strong>
                  <span className="text-[11px] text-[#64748b]">Pengiriman cepat ekspedisi atau GoSend Instant area Malang</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <RotateCcw className="w-5 h-5 text-[#38bdf8] shrink-0" />
                <div>
                  <strong className="text-[#f1f5f9] block">Garansi Tukar Baru 7 Hari</strong>
                  <span className="text-[11px] text-[#64748b]">Jika terdapat kendala pabrik saat unboxing paket</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Title, Price, Variants & Buying Actions */}
          <div className="lg:col-span-6 space-y-6">
            
            <div>
              {/* Brand & Rating */}
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="uppercase tracking-widest font-extrabold text-[#38bdf8] text-sm">
                  {product.brand}
                </span>
                <div className="flex items-center gap-1.5 bg-[#0b172a] px-3 py-1 rounded-full border border-[#172b47]">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="font-extrabold text-[#f1f5f9]">{product.rating}</span>
                  <span className="text-[#64748b]">({product.reviewCount} ulasan barista)</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#f1f5f9] tracking-tight leading-tight">
                {product.name}
              </h1>

              {/* Tagline */}
              <p className="text-sm text-[#38bdf8] font-medium mt-2 leading-relaxed">
                {product.tagline}
              </p>

              {/* Direct Link Share Pill */}
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0b172a] border border-[#172b47] text-[11px] text-[#94a3b8]">
                <span>Tautan Produk:</span>
                <code className="text-[#38bdf8] font-mono">/product/{product.slug}</code>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="p-5 rounded-2xl bg-[#0b172a] border border-[#172b47] space-y-1">
              <span className="text-xs text-[#64748b] block uppercase font-bold tracking-wider">
                Harga Resmi AKM:
              </span>
              <div className="flex items-baseline gap-4">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#38bdf8]">
                  {formatRupiah(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-base text-[#64748b] line-through">
                    {formatRupiah(product.originalPrice)}
                  </span>
                )}
              </div>
              <div className="pt-2 flex items-center gap-2 text-xs text-emerald-400 font-medium">
                <Check className="w-4 h-4" />
                <span>Ready Stock di Showroom Ruko Tlogomas Square Malang</span>
              </div>
            </div>

            {/* Variants Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-2.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#94a3b8]">
                  Pilih Varian / Warna:
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      disabled={!v.inStock}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                        selectedVariant?.id === v.id
                          ? 'bg-[#0070f3] text-white border-[#0084ff] shadow-md shadow-[#0070f3]/25'
                          : v.inStock
                            ? 'bg-[#0b172a] text-[#f1f5f9] border-[#172b47] hover:border-[#0070f3]/60'
                            : 'bg-[#070e1b] text-[#475569] border-[#172b47] line-through cursor-not-allowed'
                      }`}
                    >
                      {v.label} {!v.inStock && '(Habis)'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector & Order Actions */}
            <div className="p-5 rounded-2xl bg-[#0b172a] border border-[#172b47] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#94a3b8]">
                  Jumlah Pembelian:
                </span>
                <div className="flex items-center border border-[#1e3a5f] rounded-xl bg-[#070e1b]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 text-sm text-[#94a3b8] hover:text-[#f1f5f9] transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-sm font-bold text-[#f1f5f9]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 text-sm text-[#94a3b8] hover:text-[#f1f5f9] transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#112240] hover:bg-[#1e3a5f] text-[#f1f5f9] text-xs font-bold border border-[#1e3a5f] hover:border-[#0084ff] flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md"
                >
                  <ShoppingBag className="w-4 h-4 text-[#38bdf8]" />
                  <span>Tambah ke Keranjang</span>
                </button>

                <button
                  onClick={handleBuyWhatsApp}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#0070f3] to-[#0052cc] hover:brightness-110 text-white text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-[#0070f3]/25"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Pesan via WhatsApp</span>
                </button>
              </div>

              {/* Marketplace Links */}
              <div className="pt-2 text-center text-xs text-[#64748b] flex items-center justify-center gap-4">
                <span>Atau order via official marketplace:</span>
                <a
                  href={STORE_INFO.tokopediaStoreUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-400 hover:underline font-bold inline-flex items-center gap-1"
                >
                  <span>Tokopedia</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href={STORE_INFO.shopeeStoreUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-orange-400 hover:underline font-bold inline-flex items-center gap-1"
                >
                  <span>Shopee</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Description Paragraph */}
            <div className="space-y-2 text-xs sm:text-sm text-[#94a3b8] leading-relaxed">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#f1f5f9]">
                Tentang Produk:
              </h3>
              <p>{product.description}</p>
            </div>

            {/* Technical Specifications */}
            {product.specs && (
              <div className="p-5 rounded-2xl bg-[#0b172a] border border-[#172b47] space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#38bdf8] flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  <span>Spesifikasi Teknis Lengkap</span>
                </h3>
                <div className="divide-y divide-[#172b47] text-xs">
                  {Object.entries(product.specs).map(([k, v]) => (
                    <div key={k} className="py-2.5 flex justify-between gap-4">
                      <span className="text-[#64748b]">{k}</span>
                      <strong className="text-[#f1f5f9] text-right font-medium">{v}</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-[#172b47]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#38bdf8]">
                  REKOMENDASI ALAT SERUPA
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#f1f5f9] mt-1">
                  Pilihan Lain di Kategori {categoryObj?.name}
                </h3>
              </div>
              <Link
                to="/"
                className="text-xs font-bold text-[#38bdf8] hover:underline"
              >
                Lihat Semua Alat →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
