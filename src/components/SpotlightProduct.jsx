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
    <section className="py-16 sm:py-20 bg-gradient-to-b from-[#091527] to-[#070e1b] border-b border-[#172b47] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="relative rounded-3xl bg-gradient-to-br from-[#0e2242] via-[#09172e] to-[#060d1a] border border-[#0084ff]/40 p-8 sm:p-12 shadow-2xl shadow-blue-950/40 overflow-hidden">
          
          {/* Ambient Azure Corner Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#0084ff]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left: Product Imagery with floating badges */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#060e1a] border border-[#1e3a5f] group">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                
                <div className="absolute top-4 left-4 bg-[#070e1b]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#0084ff]/50 text-xs font-extrabold text-[#38bdf8] flex items-center gap-2">
                  <Flame className="w-3.5 h-3.5 text-[#38bdf8]" />
                  <span>FLAGSHIP OF THE MONTH</span>
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-[11px] uppercase tracking-widest text-[#38bdf8] font-bold">Standard Komersial Slow Bar</span>
                  <p className="text-sm font-bold text-white drop-shadow">Garansi Resmi 1 Tahun Flair Indonesia</p>
                </div>
              </div>
            </div>

            {/* Right: Rich Feature Breakdown */}
            <div className="lg:col-span-7 space-y-6">
              
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#10223b] border border-[#0084ff]/40 text-xs text-[#38bdf8] font-bold tracking-wider uppercase mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-[#38bdf8]" />
                  <span>PILIHAN UTAMA BARISTA SANUBARI</span>
                </div>

                <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  {product.name}
                </h3>

                <p className="text-sm text-[#94a3b8] mt-2 font-normal leading-relaxed">
                  Mesin espresso manual tuas tanpa listrik pompa berstandar industri. Menggunakan ukuran portafilter 58mm standar mesin komersial kafe, memungkinkan kamu melakukan eksperimen profil tekanan variabel (flow profiling) untuk menghasilkan body espresso yang luar biasa pekat dan kaya rasa.
                </p>
              </div>

              {/* Key Bullet Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#091527] border border-[#172b47]">
                  <Check className="w-4 h-4 text-[#38bdf8] shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-white block">Portafilter Komersial 58mm</strong>
                    <span className="text-[#64748b]">Kompatibel dengan basket VST / IMS</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#091527] border border-[#172b47]">
                  <Check className="w-4 h-4 text-[#38bdf8] shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-white block">Electric Preheating System</strong>
                    <span className="text-[#64748b]">3 Pilihan suhu ekstraksi stabil (85-95°C)</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#091527] border border-[#172b47]">
                  <Check className="w-4 h-4 text-[#38bdf8] shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-white block">Analog Pressure Gauge</strong>
                    <span className="text-[#64748b]">Kontrol real-time tekanan 1 - 10 bar</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#091527] border border-[#172b47]">
                  <Check className="w-4 h-4 text-[#38bdf8] shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-white block">Rangka Solid Cast Aluminium</strong>
                    <span className="text-[#64748b]">Kokoh dan tahan pemakaian jangka panjang</span>
                  </div>
                </div>
              </div>

              {/* Pricing & CTA */}
              <div className="pt-4 border-t border-[#172b47] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-[#64748b] block">Harga Spesial Showroom:</span>
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#38bdf8]">
                      {formatRupiah(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-[#64748b] line-through">
                        {formatRupiah(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    to={`/product/${product.slug}`}
                    className="px-5 py-3 rounded-xl bg-[#10223b] hover:bg-[#162e50] text-xs font-bold text-white border border-[#1e3a5f] hover:border-[#0084ff] transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Buka Halaman Produk</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#38bdf8]" />
                  </Link>

                  <button
                    onClick={() => onAddToCart(product)}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#0070f3] to-[#0052cc] text-white text-xs font-bold uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-[#0070f3]/30 flex items-center gap-2"
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
