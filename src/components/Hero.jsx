import React from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Award, 
  Store, 
  ArrowRight, 
  Coffee, 
  Flame, 
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { CATEGORIES } from '../data/products';

export default function Hero({ onSelectCategory, onScrollToCatalog, onScrollToCalculator, onScrollToShowroom }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/60 via-white to-white border-b border-slate-200">
      {/* Background Soft Blue Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-br from-blue-200/30 via-indigo-100/20 to-transparent blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-20 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Hero Typography */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Heritage Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs text-[#0070f3] font-semibold tracking-wide shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0070f3] animate-pulse"></span>
              <span>PARTNER SHOWROOM RESMI SANUBARI ROASTERY</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              PRESISI DI SETIAP <br />
              <span className="bg-gradient-to-r from-slate-950 via-[#0070f3] to-[#0052cc] bg-clip-text text-transparent">
                SEDUHAN KOPI ANDA.
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Koleksi perlengkapan kopi specialty terkurasi: dari hand grinder presisi, dripper manual brew Jepang, hingga mesin lever espresso komersial. Telah diuji dan digunakan harian di Slow Bar Sanubari Roastery Malang.
            </p>

            {/* Call to Actions */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onScrollToCatalog}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#0070f3] to-[#0052cc] text-white font-bold text-sm tracking-wider uppercase hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-blue-500/25"
              >
                <span>Jelajahi Koleksi Alat</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onScrollToCalculator}
                className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold border border-slate-200 hover:border-[#0070f3]/50 transition-all shadow-xs"
              >
                <Sparkles className="w-4 h-4 text-[#0070f3]" />
                <span>Kalkulator Rasio Seduh</span>
              </button>

              <button
                onClick={onScrollToShowroom}
                className="flex items-center gap-2 px-4 py-3.5 text-xs text-slate-600 hover:text-[#0070f3] transition-colors"
              >
                <Store className="w-4 h-4 text-[#0070f3]" />
                <span className="underline underline-offset-4">Coba Alat di Showroom</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-200 text-left">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-[#0070f3] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">100% Original</h4>
                  <p className="text-[11px] text-slate-500">Garansi Resmi Distributor</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Award className="w-5 h-5 text-[#0070f3] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Barista Tested</h4>
                  <p className="text-[11px] text-slate-500">Standar Kedai Sanubari</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Store className="w-5 h-5 text-[#0070f3] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Showroom Malang</h4>
                  <p className="text-[11px] text-slate-500">Test Drive Sebelum Beli</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Coffee className="w-5 h-5 text-[#0070f3] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Free Konsultasi</h4>
                  <p className="text-[11px] text-slate-500">Rekomendasi Seduh Ahli</p>
                </div>
              </div>
            </div>

          </div>

          {/* Hero Featured Card / Visual */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md rounded-3xl bg-white p-2 border border-slate-200 shadow-2xl shadow-blue-900/10 overflow-hidden group">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=80"
                  alt="Alat Seduh Kopi Sanubari"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full border border-slate-200 text-[11px] font-bold text-[#0070f3] flex items-center gap-1.5 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-[#0070f3] animate-pulse"></span>
                  <span>STARTER PACK FAVORIT</span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-left">
                  <span className="text-[10px] uppercase tracking-widest text-cyan-300 font-bold">AKM x Sanubari Special Set</span>
                  <h3 className="text-lg font-bold text-white drop-shadow-md">Home Barista Pour Over Master Kit</h3>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm font-extrabold text-white">Rp 1.490.000</span>
                    <span className="text-xs text-slate-300 line-through">Rp 1.850.000</span>
                  </div>
                </div>
              </div>

              {/* Mini Card Footer */}
              <div className="p-4 bg-slate-50 rounded-b-2xl flex items-center justify-between">
                <div className="text-xs text-slate-600">
                  <p className="text-slate-900 font-semibold">Termasuk Biji Kopi Sanubari 100g</p>
                  <p className="text-[11px] text-slate-500">Garansi Part 1 Tahun</p>
                </div>
                <button
                  onClick={() => onSelectCategory('bundles')}
                  className="flex items-center gap-1 text-xs font-bold text-[#0070f3] hover:text-[#0052cc] transition-colors"
                >
                  <span>Lihat Paket</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Quick Category Chips */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Kategori Perlengkapan
            </h3>
            <span className="text-xs text-slate-400">Pilih kategori untuk filter cepat</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {CATEGORIES.filter(c => c.id !== 'all').map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  onScrollToCatalog();
                }}
                className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white hover:bg-blue-50/50 border border-slate-200 hover:border-[#0070f3] transition-all text-center group active:scale-95 shadow-xs"
              >
                <div className="w-9 h-9 rounded-xl bg-blue-50 group-hover:bg-blue-100/70 flex items-center justify-center mb-2 transition-colors">
                  <Coffee className="w-4 h-4 text-[#0070f3]" />
                </div>
                <span className="text-xs font-semibold text-slate-800 group-hover:text-[#0070f3] transition-colors line-clamp-1">
                  {cat.name}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  {cat.count} Produk
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
