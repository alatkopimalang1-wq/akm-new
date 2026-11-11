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
    <div className="min-h-screen bg-[#070e1b] text-[#f1f5f9] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Back Link */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#94a3b8] hover:text-[#38bdf8] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Katalog Alat Kopi</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0b172a] text-xs font-bold text-[#38bdf8] border border-[#172b47] tracking-wider uppercase mb-3">
            <BookOpen className="w-3.5 h-3.5 text-[#0084ff]" />
            <span>SANUBARI ROASTERY BREWING LAB</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#f1f5f9] tracking-tight">
            Resep &amp; Panduan Seduh Kopi
          </h1>
          <p className="text-xs sm:text-base text-[#94a3b8] mt-3 max-w-2xl mx-auto leading-relaxed font-normal">
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
                  ? 'bg-gradient-to-r from-[#0070f3] to-[#0052cc] text-white border-[#0084ff] shadow-lg shadow-[#0070f3]/25'
                  : 'bg-[#0b172a] text-[#94a3b8] border-[#172b47] hover:border-[#0070f3]/50 hover:text-[#f1f5f9]'
              }`}
            >
              {m.name}
            </button>
          ))}
        </div>

        {/* Active Method Detail Card */}
        <div className="rounded-3xl bg-[#0b172a] border border-[#172b47] shadow-2xl p-6 sm:p-10 mb-12">
          
          <div className="border-b border-[#172b47] pb-8 mb-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#38bdf8]">
                  Metode Ekstraksi
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#f1f5f9] mt-1">
                  {currentMethod.name}
                </h2>
                <p className="text-xs sm:text-sm text-[#94a3b8] mt-2 max-w-xl">
                  {currentMethod.tagline}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#070e1b] border border-[#172b47] flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-[#38bdf8]" />
                <div className="text-xs">
                  <div className="text-[#64748b]">Karakter Rasa:</div>
                  <strong className="text-[#f1f5f9]">{currentMethod.flavorProfile}</strong>
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
              <div className="p-4 rounded-2xl bg-[#070e1b] border border-[#172b47]">
                <div className="flex items-center gap-2 text-xs text-[#64748b] mb-1">
                  <Coffee className="w-4 h-4 text-[#38bdf8]" />
                  <span>Dosis &amp; Rasio</span>
                </div>
                <div className="text-lg font-bold text-[#f1f5f9]">{currentMethod.ratio}</div>
                <div className="text-[11px] text-[#94a3b8]">{currentMethod.dose} Kopi / {currentMethod.water} Air</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#070e1b] border border-[#172b47]">
                <div className="flex items-center gap-2 text-xs text-[#64748b] mb-1">
                  <Thermometer className="w-4 h-4 text-rose-400" />
                  <span>Suhu Air</span>
                </div>
                <div className="text-lg font-bold text-[#f1f5f9]">{currentMethod.temperature}</div>
                <div className="text-[11px] text-[#94a3b8]">Rekomendasi Kettle Leher Angsa</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#070e1b] border border-[#172b47]">
                <div className="flex items-center gap-2 text-xs text-[#64748b] mb-1">
                  <Timer className="w-4 h-4 text-emerald-400" />
                  <span>Waktu Seduh</span>
                </div>
                <div className="text-lg font-bold text-[#f1f5f9]">{currentMethod.time}</div>
                <div className="text-[11px] text-[#94a3b8]">Termasuk fase blooming</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#070e1b] border border-[#172b47]">
                <div className="flex items-center gap-2 text-xs text-[#64748b] mb-1">
                  <Sliders className="w-4 h-4 text-[#38bdf8]" />
                  <span>Gilingan (Grind)</span>
                </div>
                <div className="text-lg font-bold text-[#f1f5f9]">{currentMethod.grindSize}</div>
                <div className="text-[11px] text-[#94a3b8]">Burr kalibrasi manual</div>
              </div>
            </div>
          </div>

          {/* Step-by-Step Instructions */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#38bdf8]">
              Langkah Demi Langkah Seduh Sempurna:
            </h3>

            <div className="space-y-4">
              {currentMethod.steps.map((step, idx) => (
                <div 
                  key={idx} 
                  className="flex items-start gap-4 p-4 rounded-2xl bg-[#070e1b] border border-[#172b47] hover:border-[#0070f3]/40 transition-colors"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0070f3] to-[#0052cc] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-md">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <h4 className="text-sm font-bold text-[#f1f5f9]">{step.title}</h4>
                      {step.timing && (
                        <span className="text-[11px] font-mono text-[#38bdf8] bg-[#112240] px-2 py-0.5 rounded-md border border-[#1e3a5f]">
                          {step.timing}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#94a3b8] mt-1 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Recommended Gear For This Method */}
        {recommendedProducts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#38bdf8]">
                  PERALATAN YANG DIREKOMENDASIKAN
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#f1f5f9] mt-1">
                  Gear Resmi untuk Seduh {currentMethod.name}
                </h3>
              </div>
              <Link to="/" className="text-xs font-bold text-[#38bdf8] hover:underline flex items-center gap-1">
                <span>Lihat Semua</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedProducts.map((p) => (
                <Link
                  key={p.id}
                  to={`/product/${p.slug}`}
                  className="p-4 rounded-2xl bg-[#0b172a] border border-[#172b47] hover:border-[#0070f3] transition-all group flex gap-4 items-center"
                >
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#070e1b] shrink-0 border border-[#172b47]">
                    <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-extrabold text-[#38bdf8] uppercase tracking-wider block">{p.brand}</span>
                    <h4 className="text-xs font-bold text-[#f1f5f9] truncate mt-0.5 group-hover:text-[#38bdf8] transition-colors">{p.name}</h4>
                    <div className="text-xs font-extrabold text-[#38bdf8] mt-1.5">{formatRupiah(p.price)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
