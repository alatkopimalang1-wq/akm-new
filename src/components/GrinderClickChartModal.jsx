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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div 
        className="w-full max-w-3xl bg-white text-slate-900 rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-900 bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-xs font-bold text-[#0070f3] border border-blue-200 tracking-wider uppercase mb-2">
            <Cog className="w-3.5 h-3.5 text-[#0070f3]" />
            <span>BARISTA CALIBRATION REFERENCE</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">
            Tabel Kalibrasi Klik Grinder Kopi
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Panduan setelan klik gilingan resmi dari barista Slow Bar Sanubari Roastery Malang.
          </p>
        </div>

        {/* Grinder selector tabs */}
        <div className="flex gap-2 mb-6 border-b border-slate-100 pb-3 overflow-x-auto no-scrollbar">
          {GRINDER_GUIDES.map((g, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedGrinderIndex(idx)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                selectedGrinderIndex === idx
                  ? 'bg-blue-50 text-[#0070f3] border-blue-400 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {g.brand}
            </button>
          ))}
        </div>

        {/* Note Box */}
        <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 flex items-start gap-3 mb-6 text-xs text-slate-600">
          <HelpCircle className="w-5 h-5 text-[#0070f3] shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-900 block">Cara Kalibrasi Awal:</strong>
            {currentGuide.rotationsNote}
          </div>
        </div>

        {/* Clicks Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-[#0070f3] uppercase font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Metode Seduh</th>
                <th className="py-3 px-4">Rekomendasi Clicks</th>
                <th className="py-3 px-4 hidden sm:table-cell">Catatan Barista</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentGuide.settings.map((s, idx) => (
                <tr key={idx} className="hover:bg-blue-50/40 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900 flex items-center gap-2">
                    <Coffee className="w-3.5 h-3.5 text-[#0070f3]" />
                    <span>{s.method}</span>
                  </td>
                  <td className="py-3 px-4 font-bold text-[#0070f3] font-mono whitespace-nowrap">
                    {s.clicks}
                  </td>
                  <td className="py-3 px-4 text-slate-500 hidden sm:table-cell">
                    {s.note}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="mt-6 flex items-center justify-between text-xs text-slate-400">
          <span>*Setelan dapat bervariasi bergantung roast profile dan kepadatan bean.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold border border-slate-200"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
