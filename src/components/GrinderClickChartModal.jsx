import React, { useState } from 'react';
import { X, Cog, Coffee, HelpCircle, CheckCircle2 } from 'lucide-react';

export const GRINDER_GUIDES = [
  {
    brand: 'Timemore Chestnut C2 / C3 / C3S (S2C Burr)',
    rotationsNote: 'Mulai dari titik 0 (burr terkunci rapat searah jarum jam, lalu putar berlawanan arah)',
    settings: [
      { method: 'Espresso (Manual Flair / Nanopresso)', clicks: '7 – 8 Clicks', note: 'Sangat halus, gunakan pelan' },
      { method: 'Moka Pot / Bialetti', clicks: '9 – 11 Clicks', note: 'Halus berserat' },
      { method: 'AeroPress (Inverted / Standar)', clicks: '11 – 13 Clicks', note: 'Medium-Fine' },
      { method: 'V60 Pour Over / Kalita Wave', clicks: '13 – 16 Clicks', note: 'Rekomendasi Utama (Medium)' },
      { method: 'Origami / Flat Bed Filter', clicks: '14 – 17 Clicks', note: 'Medium' },
      { method: 'Chemex', clicks: '17 – 19 Clicks', note: 'Medium-Coarse' },
      { method: 'French Press', clicks: '18 – 20 Clicks', note: 'Kasar (Coarse)' },
      { method: 'Cold Brew / Tubruk Kasar', clicks: '21 – 24 Clicks', note: 'Extra Coarse' }
    ]
  },
  {
    brand: 'KINGrinder K6 (48mm Heptagonal Burr)',
    rotationsNote: '1 Rotasi = 60 Clicks (16 μm per click). Penyesuaian eksternal di luar bodi',
    settings: [
      { method: 'Turkish Coffee', clicks: '20 – 30 Clicks', note: 'Super halus seperti tepung' },
      { method: 'Espresso Standar (Flair 58 / Mesin 9-Bar)', clicks: '35 – 50 Clicks', note: 'Dial in per 1-2 klik' },
      { method: 'Moka Pot', clicks: '55 – 65 Clicks', note: 'Fine' },
      { method: 'AeroPress', clicks: '65 – 80 Clicks', note: 'Medium-Fine' },
      { method: 'V60 Pour Over / Hario Kasuya', clicks: '85 – 105 Clicks', note: 'Sweet spot ekstraksi bersih' },
      { method: 'Kalita Wave / Flat Bed', clicks: '90 – 110 Clicks', note: 'Medium' },
      { method: 'French Press', clicks: '120 – 140 Clicks', note: 'Coarse' },
      { method: 'Cold Brew', clicks: '140 – 160 Clicks', note: 'Extra Coarse' }
    ]
  }
];

export default function GrinderClickChartModal({ isOpen, onClose }) {
  const [selectedGrinderIndex, setSelectedGrinderIndex] = useState(0);

  if (!isOpen) return null;

  const currentGuide = GRINDER_GUIDES[selectedGrinderIndex];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div 
        className="w-full max-w-3xl bg-[#1c1917] rounded-3xl border border-[#38332f] shadow-2xl p-6 sm:p-8 relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[#a8a29e] hover:text-[#f5f5f4] bg-[#292524] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#292524] text-xs font-bold text-[#c2a676] tracking-wider uppercase mb-2">
            <Cog className="w-3.5 h-3.5" />
            <span>BARISTA CALIBRATION REFERENCE</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#f5f5f4]">
            Tabel Kalibrasi Klik Grinder (Grind Size Chart)
          </h3>
          <p className="text-xs text-[#78716c] mt-1">
            Panduan setelan klik gilingan terkalibrasi langsung dari uji coba slow bar Sanubari Roastery Malang.
          </p>
        </div>

        {/* Grinder Model Switcher */}
        <div className="flex gap-2 mb-5 overflow-x-auto no-scrollbar pb-1">
          {GRINDER_GUIDES.map((g, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedGrinderIndex(idx)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                selectedGrinderIndex === idx
                  ? 'bg-[#c2a676] text-[#141211] border-[#c2a676]'
                  : 'bg-[#292524] text-[#a8a29e] border-[#38332f] hover:text-[#f5f5f4]'
              }`}
            >
              {g.brand.split('(')[0]}
            </button>
          ))}
        </div>

        {/* Note on zero point */}
        <div className="p-3.5 rounded-xl bg-[#292524]/50 border border-[#38332f] text-xs text-[#a8a29e] mb-4 flex items-start gap-2.5">
          <HelpCircle className="w-4 h-4 text-[#c2a676] shrink-0 mt-0.5" />
          <span>{currentGuide.rotationsNote}</span>
        </div>

        {/* Click Table */}
        <div className="overflow-hidden rounded-2xl border border-[#292524] bg-[#141211]">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#24201d] text-[#c2a676] uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Metode Seduh</th>
                <th className="py-3 px-4">Rekomendasi Klik</th>
                <th className="py-3 px-4">Karakter Bubuk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#292524] text-[#a8a29e]">
              {currentGuide.settings.map((item, index) => (
                <tr key={index} className="hover:bg-[#1c1917] transition-colors">
                  <td className="py-3 px-4 font-semibold text-[#f5f5f4] flex items-center gap-2">
                    <Coffee className="w-3.5 h-3.5 text-[#c2a676]" />
                    <span>{item.method}</span>
                  </td>
                  <td className="py-3 px-4 font-extrabold text-[#c2a676]">
                    {item.clicks}
                  </td>
                  <td className="py-3 px-4 text-[#78716c]">
                    {item.note}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="mt-5 pt-4 border-t border-[#292524] flex items-center justify-between text-xs text-[#78716c]">
          <span>*Catatan: Setiap batch biji kopi &amp; tingkat sangrai dapat memerlukan mikro-adjust 1-2 klik.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#292524] hover:bg-[#38332f] text-[#f5f5f4] font-bold"
          >
            Tutup Panduan
          </button>
        </div>

      </div>
    </div>
  );
}

