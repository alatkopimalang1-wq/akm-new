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
        className="w-full max-w-3xl bg-[#0b172a] rounded-3xl border border-[#172b47] shadow-2xl p-6 sm:p-8 relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[#94a3b8] hover:text-[#f1f5f9] bg-[#070e1b] border border-[#172b47] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#070e1b] text-xs font-bold text-[#38bdf8] border border-[#172b47] tracking-wider uppercase mb-2">
            <Cog className="w-3.5 h-3.5 text-[#0084ff]" />
            <span>BARISTA CALIBRATION REFERENCE</span>
          </div>
          <h3 className="text-2xl font-bold text-[#f1f5f9]">
            Tabel Kalibrasi Klik Grinder Kopi
          </h3>
          <p className="text-xs text-[#94a3b8] mt-1">
            Panduan setelan klik gilingan resmi dari barista Slow Bar Sanubari Roastery Malang.
          </p>
        </div>

        {/* Grinder selector tabs */}
        <div className="flex gap-2 mb-6 border-b border-[#172b47] pb-3 overflow-x-auto no-scrollbar">
          {GRINDER_GUIDES.map((g, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedGrinderIndex(idx)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                selectedGrinderIndex === idx
                  ? 'bg-[#0070f3] text-white border-[#0084ff] shadow-md shadow-[#0070f3]/25'
                  : 'bg-[#070e1b] text-[#94a3b8] border-[#172b47] hover:border-[#0070f3]/40'
              }`}
            >
              {g.brand}
            </button>
          ))}
        </div>

        {/* Note Box */}
        <div className="p-4 rounded-xl bg-[#070e1b] border border-[#172b47] flex items-start gap-3 mb-6 text-xs text-[#94a3b8]">
          <HelpCircle className="w-5 h-5 text-[#38bdf8] shrink-0 mt-0.5" />
          <div>
            <strong className="text-[#f1f5f9] block">Cara Kalibrasi Awal:</strong>
            {currentGuide.rotationsNote}
          </div>
        </div>

        {/* Clicks Table */}
        <div className="overflow-hidden rounded-2xl border border-[#172b47] bg-[#070e1b]">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#112240] text-[#38bdf8] uppercase font-bold border-b border-[#172b47]">
              <tr>
                <th className="py-3 px-4">Metode Seduh</th>
                <th className="py-3 px-4">Rekomendasi Clicks</th>
                <th className="py-3 px-4 hidden sm:table-cell">Catatan Barista</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#172b47]">
              {currentGuide.settings.map((s, idx) => (
                <tr key={idx} className="hover:bg-[#112240]/40 transition-colors">
                  <td className="py-3 px-4 font-semibold text-[#f1f5f9] flex items-center gap-2">
                    <Coffee className="w-3.5 h-3.5 text-[#38bdf8]" />
                    <span>{s.method}</span>
                  </td>
                  <td className="py-3 px-4 font-bold text-[#38bdf8] font-mono whitespace-nowrap">
                    {s.clicks}
                  </td>
                  <td className="py-3 px-4 text-[#94a3b8] hidden sm:table-cell">
                    {s.note}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="mt-6 flex items-center justify-between text-xs text-[#64748b]">
          <span>*Setelan dapat bervariasi bergantung roast profile dan kepadatan bean.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#112240] hover:bg-[#1e3a5f] text-[#38bdf8] font-bold border border-[#1e3a5f]"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
