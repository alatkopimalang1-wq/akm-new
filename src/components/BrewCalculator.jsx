import React, { useState } from 'react';
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

  // Recommended products for this method
  const recommendedGear = PRODUCTS.filter(p => currentMethod.recommendedGearIds.includes(p.id));

  return (
    <section id="kalkulator-seduh" className="py-16 sm:py-24 bg-[#141211] border-b border-[#292524] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#c2a676]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#292524] border border-[#c2a676]/30 text-xs text-[#c2a676] font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>INTERACTIVE BREWING TOOL</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#f5f5f4] tracking-tight">
            Kalkulator Rasio Seduh &amp; Rekomendasi Alat
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#a8a29e]">
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
                  ? 'bg-gradient-to-r from-[#c2a676] to-[#b45309] text-[#141211] border-[#c2a676] shadow-lg shadow-[#c2a676]/20'
                  : 'bg-[#1c1917] text-[#a8a29e] border-[#292524] hover:text-[#f5f5f4] hover:bg-[#292524]'
              }`}
            >
              {method.name}
            </button>
          ))}
        </div>

        {/* Main Interactive Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Inputs & Calculation Results */}
          <div className="lg:col-span-7 bg-[#1c1917] rounded-3xl border border-[#292524] p-6 sm:p-8 space-y-6 shadow-xl">
            
            {/* Dose Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#a8a29e] flex items-center gap-1.5">
                  <Coffee className="w-4 h-4 text-[#c2a676]" />
                  <span>Gramasi Kopi (Dose):</span>
                </label>
                <span className="text-lg font-extrabold text-[#c2a676]">
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
                className="w-full h-2 bg-[#292524] rounded-lg appearance-none cursor-pointer accent-[#c2a676]"
              />
              <div className="flex justify-between text-[10px] text-[#78716c] mt-1">
                <span>10g (Single cup)</span>
                <span>20g (Standard)</span>
                <span>40g (Sharing / Server)</span>
              </div>
            </div>

            {/* Ratio Selector Buttons */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#a8a29e] flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-[#c2a676]" />
                  <span>Pilihan Rasio Air (Kopi : Air):</span>
                </label>
                <span className="text-sm font-bold text-[#f5f5f4]">
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
                        ? 'bg-[#c2a676]/20 border-[#c2a676] text-[#c2a676]'
                        : 'bg-[#292524]/60 border-[#292524] text-[#a8a29e] hover:border-[#38332f]'
                    }`}
                  >
                    1 : {r} {r === currentMethod.defaultRatio && '(Rekomendasi)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Big Results Output Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#292524]">
              <div className="p-3.5 rounded-2xl bg-[#292524]/70 border border-[#38332f] text-center">
                <Droplets className="w-5 h-5 text-[#c2a676] mx-auto mb-1" />
                <span className="text-[10px] uppercase tracking-wider text-[#78716c]">Total Air</span>
                <p className="text-xl font-extrabold text-[#f5f5f4] mt-0.5">{totalWater} ml</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#292524]/70 border border-[#38332f] text-center">
                <Thermometer className="w-5 h-5 text-[#c2a676] mx-auto mb-1" />
                <span className="text-[10px] uppercase tracking-wider text-[#78716c]">Suhu Air</span>
                <p className="text-sm font-bold text-[#f5f5f4] mt-1">{currentMethod.temp}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#292524]/70 border border-[#38332f] text-center">
                <Timer className="w-5 h-5 text-[#c2a676] mx-auto mb-1" />
                <span className="text-[10px] uppercase tracking-wider text-[#78716c]">Target Waktu</span>
                <p className="text-sm font-bold text-[#f5f5f4] mt-1">{currentMethod.time}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#292524]/70 border border-[#38332f] text-center">
                <Coffee className="w-5 h-5 text-[#c2a676] mx-auto mb-1" />
                <span className="text-[10px] uppercase tracking-wider text-[#78716c]">Grind Size</span>
                <p className="text-xs font-bold text-[#c2a676] mt-1">{currentMethod.grindSize.split('(')[0]}</p>
              </div>
            </div>

            {/* Brewing Steps */}
            <div className="pt-4 border-t border-[#292524]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#f5f5f4] mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#c2a676]" />
                <span>Langkah Seduh Barista Sanubari:</span>
              </h4>
              <ol className="space-y-2 text-xs text-[#a8a29e] list-decimal list-inside leading-relaxed">
                {currentMethod.steps.map((step, idx) => (
                  <li key={idx} className="pl-1">
                    <span className="text-[#f5f5f4]">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

          </div>

          {/* Recommended Gear for this method */}
          <div className="lg:col-span-5 bg-[#1c1917] rounded-3xl border border-[#292524] p-6 sm:p-8 space-y-5 shadow-xl">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#c2a676] uppercase tracking-wider mb-1">
                <span>REKOMENDASI ALAT KOPI</span>
              </div>
              <h3 className="text-xl font-bold text-[#f5f5f4]">
                Gear Pilihan untuk {currentMethod.name}
              </h3>
              <p className="text-xs text-[#78716c] mt-1">
                Alat yang terbukti menghasilkan rasa terbaik untuk metode ini:
              </p>
            </div>

            <div className="space-y-3">
              {recommendedGear.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onQuickView(item)}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-[#292524]/60 border border-[#38332f] hover:border-[#c2a676]/50 transition-all cursor-pointer group"
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
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(item);
                    }}
                    className="p-2 rounded-xl bg-[#c2a676] text-[#141211] hover:brightness-110 active:scale-95 transition-all shrink-0"
                    title="Tambah ke Keranjang"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-[#292524]/30 border border-[#38332f] text-xs text-[#a8a29e] flex items-start gap-3">
              <HelpCircle className="w-5 h-5 text-[#c2a676] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-[#f5f5f4]">Bingung memilih ukuran gilingan?</p>
                <p className="text-[11px] text-[#78716c] mt-0.5">
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

