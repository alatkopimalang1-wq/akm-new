import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Flame, 
  Award, 
  ShieldCheck, 
  ShoppingBag, 
  PhoneCall, 
  Check, 
  SlidersHorizontal,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { formatRupiah, generateWhatsAppMessage } from '../utils/format';
import { STORE_INFO } from '../data/products';

export default function SpotlightProduct({ onQuickView, onAddToCart, product }) {
  if (!product) return null;

  const handleBuyWhatsApp = () => {
    const item = { ...product, quantity: 1, selectedVariant: product.variants?.[0] };
    const waUrl = `https://wa.me/${STORE_INFO.whatsappNumber}?text=${generateWhatsAppMessage([item], 'Pemesanan Spotlight Product: ' + product.name)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-[#181615] to-[#141211] border-b border-[#292524] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="relative rounded-3xl bg-gradient-to-br from-[#24201d] via-[#1c1917] to-[#141211] border border-[#c2a676]/30 p-8 sm:p-12 shadow-2xl overflow-hidden">
          
          {/* Ambient Corner Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#c2a676]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left: Product Imagery with floating badges */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#181615] border border-[#38332f] group">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                
                <div className="absolute top-4 left-4 bg-[#141211]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#c2a676]/50 text-xs font-extrabold text-[#c2a676] flex items-center gap-2">
                  <Flame className="w-3.5 h-3.5" />
                  <span>FLAGSHIP OF THE MONTH</span>
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-[11px] uppercase tracking-widest text-[#c2a676] font-bold">Standard Komersial Slow Bar</span>
                  <p className="text-sm font-bold text-white drop-shadow">Garansi Resmi 1 Tahun Flair Indonesia</p>
                </div>
              </div>
            </div>

            {/* Right: Rich Feature Breakdown */}
            <div className="lg:col-span-7 space-y-6">
              
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#292524] border border-[#c2a676]/30 text-xs text-[#c2a676] font-bold tracking-wider uppercase mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>PILIHAN UTAMA BARISTA SANUBARI</span>
                </div>

                <h3 className="text-2xl sm:text-4xl font-extrabold text-[#f5f5f4] tracking-tight leading-tight">
                  {product.name}
                </h3>

                <p className="text-sm text-[#a8a29e] mt-2 font-normal leading-relaxed">
                  Mesin espresso manual tuas tanpa listrik pompa berstandar industri. Menggunakan ukuran portafilter 58mm standar mesin komersial kafe, memungkinkan kamu melakukan eksperimen profil tekanan variabel (flow profiling) untuk menghasilkan body espresso yang luar biasa pekat dan kaya rasa.
                </p>
              </div>

              {/* Key Bullet Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#1c1917] border border-[#292524]">
                  <Check className="w-4 h-4 text-[#c2a676] shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-[#f5f5f4] block">Portafilter Komersial 58mm</strong>
                    <span className="text-[#78716c]">Kompatibel dengan basket VST / IMS</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#1c1917] border border-[#292524]">
                  <Check className="w-4 h-4 text-[#c2a676] shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-[#f5f5f4] block">Electric Preheating System</strong>
                    <span className="text-[#78716c]">3 Pilihan suhu ekstraksi stabil (85-95°C)</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#1c1917] border border-[#292524]">
                  <Check className="w-4 h-4 text-[#c2a676] shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-[#f5f5f4] block">Analog Pressure Gauge</strong>
                    <span className="text-[#78716c]">Kontrol real-time tekanan 1 - 10 bar</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#1c1917] border border-[#292524]">
                  <Check className="w-4 h-4 text-[#c2a676] shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-[#f5f5f4] block">Rangka Solid Cast Aluminium</strong>
                    <span className="text-[#78716c]">Kokoh dan tahan pemakaian jangka panjang</span>
                  </div>
                </div>
              </div>

              {/* Pricing & CTA */}
              <div className="pt-4 border-t border-[#292524] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-[#78716c] block">Harga Spesial Showroom:</span>
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#c2a676]">
                      {formatRupiah(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-[#78716c] line-through">
                        {formatRupiah(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    to={`/product/${product.slug}`}
                    className="px-5 py-3 rounded-xl bg-[#292524] hover:bg-[#38332f] text-xs font-bold text-[#f5f5f4] border border-[#38332f] hover:border-[#c2a676] transition-all flex items-center gap-1.5"
                  >
                    <span>Buka Halaman Produk</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#c2a676]" />
                  </Link>

                  <button
                    onClick={() => onAddToCart(product)}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#c2a676] to-[#b45309] text-[#141211] text-xs font-bold uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-[#c2a676]/20 flex items-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Beli Sekarang</span>
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

