import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Coffee, 
  ArrowLeft, 
  Thermometer, 
  Timer, 
  Droplets, 
  Sliders, 
  BookOpen, 
  CheckCircle2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { BREW_METHODS } from '../data/brewGuides';
import { PRODUCTS } from '../data/products';
import { formatRupiah } from '../utils/format';

export default function BrewGuidesPage() {
  const [selectedMethodId, setSelectedMethodId] = useState(BREW_METHODS[0].id);

  const currentMethod = BREW_METHODS.find((m) => m.id === selectedMethodId) || BREW_METHODS[0];
  const recommendedProducts = PRODUCTS.filter((p) => currentMethod.recommendedGearIds.includes(p.id));

  return (
    <div className="min-h-screen bg-[#141211] text-[#f5f5f4] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Back Link */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#a8a29e] hover:text-[#c2a676] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Katalog Alat Kopi</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#292524] text-xs font-bold text-[#c2a676] tracking-wider uppercase mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>SANUBARI ROASTERY BREWING LAB</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#f5f5f4] tracking-tight">
            Resep &amp; Panduan Seduh Kopi
          </h1>
          <p className="text-xs sm:text-base text-[#a8a29e] mt-3 max-w-2xl mx-auto leading-relaxed font-normal">
            Kumpulan resep dan standar ekstraksi seduh manual yang dipraktikkan langsung oleh para barista di Slow Bar Sanubari Roastery Malang.
          </p>
        </div>

        {/* Method Selector Tabs */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-10">
          {BREW_METHODS.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMethodId(m.id)}
              className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all border ${
                selectedMethodId === m.id
                  ? 'bg-gradient-to-r from-[#c2a676] to-[#b45309] text-[#141211] border-[#c2a676] shadow-lg shadow-[#c2a676]/20'
                  : 'bg-[#1c1917] text-[#a8a29e] border-[#292524] hover:text-[#f5f5f4] hover:bg-[#292524]'
              }`}
            >
              {m.name}
            </button>
          ))}
        </div>

        {/* Recipe Content Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Recipe Details */}
          <div className="lg:col-span-7 bg-[#1c1917] rounded-3xl border border-[#292524] p-6 sm:p-8 space-y-6 shadow-2xl">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#c2a676]">Metode Seduh Resmi</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#f5f5f4] mt-1">{currentMethod.name}</h2>
              <p className="text-xs sm:text-sm text-[#a8a29e] mt-1 leading-relaxed">
                Karakter Seduhan: <strong className="text-[#f5f5f4]">{currentMethod.tastingNote}</strong>
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-[#292524]/60 border border-[#38332f] text-center">
                <Coffee className="w-5 h-5 text-[#c2a676] mx-auto mb-1" />
                <span className="text-[10px] uppercase text-[#78716c] block">Kopi (Dose)</span>
                <strong className="text-sm font-bold text-[#f5f5f4]">{currentMethod.defaultDose}g</strong>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#292524]/60 border border-[#38332f] text-center">
                <Droplets className="w-5 h-5 text-[#c2a676] mx-auto mb-1" />
                <span className="text-[10px] uppercase text-[#78716c] block">Rasio Air</span>
                <strong className="text-sm font-bold text-[#f5f5f4]">1 : {currentMethod.defaultRatio}</strong>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#292524]/60 border border-[#38332f] text-center">
                <Thermometer className="w-5 h-5 text-[#c2a676] mx-auto mb-1" />
                <span className="text-[10px] uppercase text-[#78716c] block">Suhu Air</span>
                <strong className="text-sm font-bold text-[#f5f5f4]">{currentMethod.temp}</strong>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#292524]/60 border border-[#38332f] text-center">
                <Timer className="w-5 h-5 text-[#c2a676] mx-auto mb-1" />
                <span className="text-[10px] uppercase text-[#78716c] block">Waktu</span>
                <strong className="text-sm font-bold text-[#f5f5f4]">{currentMethod.time}</strong>
              </div>
            </div>

            {/* Grind Size Advice */}
            <div className="p-4 rounded-2xl bg-[#292524]/40 border border-[#38332f] text-xs">
              <span className="text-[#78716c] block mb-0.5 font-semibold">Tingkat Kehalusan (Grind Size):</span>
              <strong className="text-[#c2a676] font-bold text-sm">{currentMethod.grindSize}</strong>
            </div>

            {/* Step by step pouring instructions */}
            <div className="pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#c2a676] mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Instruksi Langkah Demi Langkah:</span>
              </h3>
              <ol className="space-y-3 text-xs leading-relaxed">
                {currentMethod.steps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-[#24201d] border border-[#292524]">
                    <span className="w-6 h-6 rounded-lg bg-[#292524] text-[#c2a676] font-extrabold flex items-center justify-center shrink-0 text-xs">
                      {idx + 1}
                    </span>
                    <span className="text-[#f5f5f4] pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Right: Recommended Tools for this recipe */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#1c1917] rounded-3xl border border-[#292524] p-6 sm:p-8 space-y-4 shadow-2xl">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#c2a676]">Peralatan yang Digunakan</span>
                <h3 className="text-lg font-bold text-[#f5f5f4] mt-0.5">Alat Rekomendasi Barista</h3>
              </div>

              <div className="space-y-3">
                {recommendedProducts.map((item) => (
                  <Link
                    key={item.id}
                    to={`/product/${item.slug}`}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-[#292524]/60 border border-[#38332f] hover:border-[#c2a676]/60 transition-all group"
                  >
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] uppercase font-bold text-[#c2a676]">{item.brand}</span>
                      <h4 className="text-xs font-bold text-[#f5f5f4] group-hover:text-[#c2a676] truncate transition-colors">
                        {item.name}
                      </h4>
                      <span className="text-xs font-extrabold text-[#f5f5f4] block mt-0.5">
                        {formatRupiah(item.price)}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#78716c] group-hover:text-[#c2a676] group-hover:translate-x-1 transition-all shrink-0" />
                  </Link>
                ))}
              </div>

              <div className="pt-2">
                <Link
                  to="/"
                  className="block w-full py-3 rounded-xl bg-[#292524] hover:bg-[#38332f] text-center text-xs font-bold text-[#c2a676] border border-[#38332f] transition-colors"
                >
                  Jelajahi Semua Koleksi Alat Seduh
                </Link>
              </div>
            </div>

            {/* Coffee beans companion */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-[#292524] to-[#1c1917] border border-[#c2a676]/30 text-xs space-y-3">
              <span className="text-[10px] font-bold uppercase text-[#c2a676] tracking-wider block">Biji Kopi Pasangan Terbaik</span>
              <h4 className="text-sm font-bold text-[#f5f5f4]">Biji Kopi Gunung Kawi Series — Sanubari Roastery</h4>
              <p className="text-[#a8a29e] leading-relaxed">
                Gunakan biji kopi single origin dengan profil sangrai Light to Medium untuk mengekstraksi aroma floral dan rasa buah yang optimal.
              </p>
              <a
                href="https://sanubariroastery.co.id"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#c2a676] hover:underline"
              >
                <span>Lihat Koleksi Biji Kopi Sanubari</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
