import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Coffee, 
  Droplets, 
  Thermometer, 
  Timer, 
  Sliders, 
  ArrowRight,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { BREW_METHODS } from '../data/brewGuides';
import { PRODUCTS } from '../data/products';
import { formatRupiah } from '../utils/format';

export default function BrewCalculator({ onQuickView, onAddToCart }) {
  const [selectedMethodId, setSelectedMethodId] = useState('v60');
  const [dose, setDose] = useState(15);
  const [customRatio, setCustomRatio] = useState(15);

  const currentMethod = BREW_METHODS.find(m => m.id === selectedMethodId) || BREW_METHODS[0];

  const handleSelectMethod = (method) => {
    setSelectedMethodId(method.id);
    setDose(method.defaultDose);
    setCustomRatio(method.defaultRatio);
  };

  const totalWater = Math.round(dose * customRatio);
  const recommendedGear = PRODUCTS.filter(p => currentMethod.recommendedGearIds.includes(p.id));

  return (
    <section id="kalkulator-seduh" className="py-16 sm:py-24 bg-[#070e1b] border-b border-[#172b47] relative overflow-hidden">
      {/* Background Azure Glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#0084ff]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#10223b] border border-[#0084ff]/40 text-xs text-[#38bdf8] font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span>INTERACTIVE BREWING TOOL</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Kalkulator Rasio Seduh &amp; Rekomendasi Alat
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#94a3b8]">
            Hitung takaran gramasi kopi dan air secara presisi, lalu temukan alat seduh yang paling tepat sesuai karakter seduhan favoritmu.
          </p>
        </div>

        {/* Method Selector Tabs */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-8">
          {BREW_METHODS.map((method) => (
            <button
              key={method.id}
              onClick={() => handleSelectMethod(method)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all border ${
                selectedMethodId === method.id
                  ? 'bg-gradient-to-r from-[#0070f3] to-[#0052cc] text-white border-[#0084ff] shadow-lg shadow-[#0070f3]/25'
                  : 'bg-[#0b172a] text-[#94a3b8] border-[#172b47] hover:text-white hover:bg-[#10223b]'
              }`}
            >
              {method.name}
            </button>
          ))}
        </div>

        {/* Main Interactive Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Inputs & Calculation Results */}
          <div className="lg:col-span-7 bg-[#0b172a] rounded-3xl border border-[#172b47] p-6 sm:p-8 space-y-6 shadow-2xl shadow-blue-950/20">
            
            {/* Dose Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#94a3b8] flex items-center gap-1.5">
                  <Coffee className="w-4 h-4 text-[#38bdf8]" />
                  <span>Gramasi Kopi (Dose):</span>
                </label>
                <span className="text-lg font-extrabold text-[#38bdf8]">
                  {dose} gram
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="40"
                step="1"
                value={dose}
                onChange={(e) => setDose(Number(e.target.value))}
                className="w-full h-2 bg-[#172b47] rounded-lg appearance-none cursor-pointer accent-[#0084ff]"
              />
              <div className="flex justify-between text-[10px] text-[#64748b] mt-1">
                <span>10g (Single cup)</span>
                <span>20g (Standard)</span>
                <span>40g (Sharing / Server)</span>
              </div>
            </div>

            {/* Ratio Selector Buttons */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#94a3b8] flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-[#38bdf8]" />
                  <span>Pilihan Rasio Air (Kopi : Air):</span>
                </label>
                <span className="text-sm font-bold text-white">
                  1 : {customRatio}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {currentMethod.ratioOptions.map((r) => (
                  <button
                    key={r}
                    onClick={() => setCustomRatio(r)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      customRatio === r
                        ? 'bg-[#0070f3]/25 border-[#0084ff] text-[#38bdf8]'
                        : 'bg-[#10223b]/60 border-[#172b47] text-[#94a3b8] hover:border-[#1d3b66]'
                    }`}
                  >
                    1 : {r} {r === currentMethod.defaultRatio && '(Rekomendasi)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Big Results Output Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#172b47]">
              <div className="p-3.5 rounded-2xl bg-[#0f213d] border border-[#1e3a5f] text-center">
                <Droplets className="w-5 h-5 text-[#38bdf8] mx-auto mb-1" />
                <span className="text-[10px] uppercase tracking-wider text-[#64748b]">Total Air</span>
                <p className="text-xl font-extrabold text-white mt-0.5">{totalWater} ml</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#0f213d] border border-[#1e3a5f] text-center">
                <Thermometer className="w-5 h-5 text-[#38bdf8] mx-auto mb-1" />
                <span className="text-[10px] uppercase tracking-wider text-[#64748b]">Suhu Air</span>
                <p className="text-sm font-bold text-white mt-1">{currentMethod.temp}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#0f213d] border border-[#1e3a5f] text-center">
                <Timer className="w-5 h-5 text-[#38bdf8] mx-auto mb-1" />
                <span className="text-[10px] uppercase tracking-wider text-[#64748b]">Target Waktu</span>
                <p className="text-sm font-bold text-white mt-1">{currentMethod.time}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#0f213d] border border-[#1e3a5f] text-center">
                <Coffee className="w-5 h-5 text-[#38bdf8] mx-auto mb-1" />
                <span className="text-[10px] uppercase tracking-wider text-[#64748b]">Grind Size</span>
                <p className="text-xs font-bold text-[#38bdf8] mt-1">{currentMethod.grindSize.split('(')[0]}</p>
              </div>
            </div>

            {/* Brewing Steps */}
            <div className="pt-4 border-t border-[#172b47]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#38bdf8]" />
                <span>Langkah Seduh Barista Sanubari:</span>
              </h4>
              <ol className="space-y-2 text-xs text-[#94a3b8] list-decimal list-inside leading-relaxed">
                {currentMethod.steps.map((step, idx) => (
                  <li key={idx} className="pl-1">
                    <span className="text-[#f1f5f9]">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

          </div>

          {/* Recommended Gear */}
          <div className="lg:col-span-5 bg-[#0b172a] rounded-3xl border border-[#172b47] p-6 sm:p-8 space-y-5 shadow-2xl shadow-blue-950/20">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#38bdf8] uppercase tracking-wider mb-1">
                <span>REKOMENDASI ALAT KOPI</span>
              </div>
              <h3 className="text-xl font-bold text-white">
                Gear Pilihan untuk {currentMethod.name}
              </h3>
              <p className="text-xs text-[#64748b] mt-1">
                Alat yang terbukti menghasilkan rasa terbaik untuk metode ini:
              </p>
            </div>

            <div className="space-y-3">
              {recommendedGear.map((item) => (
                <Link
                  key={item.id}
                  to={`/product/${item.slug}`}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-[#0f213d]/60 border border-[#1e3a5f] hover:border-[#0084ff]/60 transition-all cursor-pointer group"
                >
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] uppercase font-bold text-[#38bdf8]">{item.brand}</span>
                    <h4 className="text-xs font-bold text-white group-hover:text-[#38bdf8] truncate transition-colors">
                      {item.name}
                    </h4>
                    <span className="text-xs font-extrabold text-white block mt-0.5">
                      {formatRupiah(item.price)}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onAddToCart(item);
                    }}
                    className="p-2 rounded-xl bg-gradient-to-r from-[#0070f3] to-[#0052cc] text-white hover:brightness-110 active:scale-95 transition-all shrink-0 shadow-md shadow-[#0070f3]/25"
                    title="Tambah ke Keranjang"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-[#0f213d]/40 border border-[#1e3a5f] text-xs text-[#94a3b8] flex items-start gap-3">
              <HelpCircle className="w-5 h-5 text-[#38bdf8] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Bingung memilih ukuran gilingan?</p>
                <p className="text-[11px] text-[#64748b] mt-0.5">
                  Kunjungi Slow Bar kami di Ruko Tlogomas Square Malang untuk kalibrasi grinder bersama barista kami secara gratis.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
