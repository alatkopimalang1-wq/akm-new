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
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0b172a] via-[#070e1b] to-[#070e1b] border-b border-[#172b47]">
      {/* Background Azure Blue Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-br from-[#0084ff]/25 via-[#0052cc]/15 to-transparent blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-20 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Hero Typography */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Heritage Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0d1e38] border border-[#0084ff]/40 text-xs text-[#38bdf8] font-medium tracking-wide shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0084ff] animate-pulse"></span>
              <span>PARTNER SHOWROOM RESMI SANUBARI ROASTERY</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#f8fafc] tracking-tight leading-[1.15]">
              PRESISI DI SETIAP <br />
              <span className="bg-gradient-to-r from-[#ffffff] via-[#38bdf8] to-[#0084ff] bg-clip-text text-transparent">
                SEDUHAN KOPI ANDA.
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-[#94a3b8] max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Koleksi perlengkapan kopi specialty terkurasi: dari hand grinder presisi, dripper manual brew Jepang, hingga mesin lever espresso komersial. Telah diuji dan digunakan harian di Slow Bar Sanubari Roastery Malang.
            </p>

            {/* Call to Actions */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onScrollToCatalog}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#0070f3] to-[#0052cc] text-white font-bold text-sm tracking-wider uppercase hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-[#0070f3]/25"
              >
                <span>Jelajahi Koleksi Alat</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onScrollToCalculator}
                className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-[#0f213d] hover:bg-[#162e54] text-[#f8fafc] text-sm font-semibold border border-[#1e3a5f] hover:border-[#0084ff]/50 transition-all"
              >
                <Sparkles className="w-4 h-4 text-[#38bdf8]" />
                <span>Kalkulator Rasio Seduh</span>
              </button>

              <button
                onClick={onScrollToShowroom}
                className="flex items-center gap-2 px-4 py-3.5 text-xs text-[#94a3b8] hover:text-[#38bdf8] transition-colors"
              >
                <Store className="w-4 h-4 text-[#38bdf8]" />
                <span className="underline underline-offset-4">Coba Alat di Showroom</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-[#172b47] text-left">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-[#38bdf8] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#f8fafc]">100% Original</h4>
                  <p className="text-[11px] text-[#64748b]">Garansi Resmi Distributor</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Award className="w-5 h-5 text-[#38bdf8] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#f8fafc]">Barista Tested</h4>
                  <p className="text-[11px] text-[#64748b]">Standar Kedai Sanubari</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Store className="w-5 h-5 text-[#38bdf8] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#f8fafc]">Showroom Malang</h4>
                  <p className="text-[11px] text-[#64748b]">Test Drive Sebelum Beli</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Coffee className="w-5 h-5 text-[#38bdf8] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#f8fafc]">Free Konsultasi</h4>
                  <p className="text-[11px] text-[#64748b]">Rekomendasi Seduh Ahli</p>
                </div>
              </div>
            </div>

          </div>

          {/* Hero Featured Card / Visual */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md rounded-3xl bg-gradient-to-b from-[#0f213d] to-[#091322] p-2 border border-[#1e3a5f] shadow-2xl shadow-blue-950/40 overflow-hidden group">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
                <img
                  src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=80"
                  alt="Alat Seduh Kopi Sanubari"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070e1b] via-transparent to-transparent" />
                <div className="absolute top-3 left-3 bg-[#070e1b]/90 backdrop-blur-md px-3 py-1 rounded-full border border-[#0084ff]/40 text-[11px] font-bold text-[#38bdf8] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#0084ff] animate-pulse"></span>
                  <span>STARTER PACK FAVORIT</span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-left">
                  <span className="text-[10px] uppercase tracking-widest text-[#38bdf8] font-bold">AKM x Sanubari Special Set</span>
                  <h3 className="text-lg font-bold text-white drop-shadow-md">Home Barista Pour Over Master Kit</h3>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm font-extrabold text-[#38bdf8]">Rp 1.490.000</span>
                    <span className="text-xs text-[#94a3b8] line-through">Rp 1.850.000</span>
                  </div>
                </div>
              </div>

              {/* Mini Card Footer */}
              <div className="p-4 bg-[#091322] rounded-b-2xl flex items-center justify-between">
                <div className="text-xs text-[#94a3b8]">
                  <p className="text-white font-medium">Termasuk Biji Kopi Sanubari 100g</p>
                  <p className="text-[11px] text-[#64748b]">Garansi Part 1 Tahun</p>
                </div>
                <button
                  onClick={() => onSelectCategory('bundles')}
                  className="flex items-center gap-1 text-xs font-bold text-[#38bdf8] hover:text-white transition-colors"
                >
                  <span>Lihat Paket</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Quick Category Chips */}
        <div className="mt-12 pt-8 border-t border-[#172b47]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#94a3b8]">
              Kategori Perlengkapan
            </h3>
            <span className="text-xs text-[#64748b]">Pilih kategori untuk filter cepat</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {CATEGORIES.filter(c => c.id !== 'all').map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  onScrollToCatalog();
                }}
                className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-[#0a1526] hover:bg-[#10223b] border border-[#172b47] hover:border-[#0084ff]/50 transition-all text-center group active:scale-95 shadow-sm"
              >
                <div className="w-9 h-9 rounded-xl bg-[#10223b] group-hover:bg-[#0070f3]/20 flex items-center justify-center mb-2 transition-colors">
                  <Coffee className="w-4 h-4 text-[#38bdf8]" />
                </div>
                <span className="text-xs font-semibold text-[#f1f5f9] group-hover:text-[#38bdf8] transition-colors line-clamp-1">
                  {cat.name}
                </span>
                <span className="text-[10px] text-[#64748b] mt-0.5">
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
