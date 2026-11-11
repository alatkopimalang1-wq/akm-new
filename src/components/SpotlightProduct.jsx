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
    <section className="py-16 sm:py-20 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="relative rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 shadow-xl shadow-blue-500/5 overflow-hidden">
          
          {/* Ambient Azure Corner Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left: Product Imagery with floating badges */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 group shadow-sm">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-blue-200 text-xs font-extrabold text-[#0070f3] flex items-center gap-2 shadow-xs">
                  <Flame className="w-3.5 h-3.5 text-[#0070f3]" />
                  <span>FLAGSHIP OF THE MONTH</span>
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-[11px] uppercase tracking-widest text-cyan-300 font-bold">Standard Komersial Slow Bar</span>
                  <p className="text-sm font-bold text-white drop-shadow">Garansi Resmi 1 Tahun Flair Indonesia</p>
                </div>
              </div>
            </div>

            {/* Right: Rich Feature Breakdown */}
            <div className="lg:col-span-7 space-y-6">
              
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs text-[#0070f3] font-bold tracking-wider uppercase mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-[#0070f3]" />
                  <span>PILIHAN UTAMA BARISTA SANUBARI</span>
                </div>

                <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  {product.name}
                </h3>

                <p className="text-sm text-slate-600 mt-2 font-normal leading-relaxed">
                  Mesin espresso manual tuas tanpa listrik pompa berstandar industri. Menggunakan ukuran portafilter 58mm standar mesin komersial kafe, memungkinkan kamu melakukan eksperimen profil tekanan variabel (flow profiling) untuk menghasilkan body espresso yang luar biasa pekat dan kaya rasa.
                </p>
              </div>

              {/* Key Bullet Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <Check className="w-4 h-4 text-[#0070f3] shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-slate-900 block">Portafilter Komersial 58mm</strong>
                    <span className="text-slate-500">Kompatibel dengan basket VST / IMS</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <Check className="w-4 h-4 text-[#0070f3] shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-slate-900 block">Electric Preheating System</strong>
                    <span className="text-slate-500">3 Pilihan suhu ekstraksi stabil (85-95°C)</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <Check className="w-4 h-4 text-[#0070f3] shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-slate-900 block">Analog Pressure Gauge</strong>
                    <span className="text-slate-500">Kontrol real-time tekanan 1 - 10 bar</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <Check className="w-4 h-4 text-[#0070f3] shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-slate-900 block">Rangka Solid Cast Aluminium</strong>
                    <span className="text-slate-500">Kokoh dan tahan pemakaian jangka panjang</span>
                  </div>
                </div>
              </div>

              {/* Pricing & CTA */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-slate-500 block font-medium">Harga Spesial Showroom:</span>
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#0070f3]">
                      {formatRupiah(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-slate-400 line-through">
                        {formatRupiah(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    to={`/product/${product.slug}`}
                    className="px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-xs font-bold text-slate-800 border border-slate-200 hover:border-[#0070f3] transition-all flex items-center gap-1.5 shadow-xs"
                  >
                    <span>Buka Halaman Produk</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#0070f3]" />
                  </Link>

                  <button
                    onClick={() => onAddToCart(product)}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#0070f3] to-[#0052cc] text-white text-xs font-bold uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-md shadow-blue-500/25 flex items-center gap-2"
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
