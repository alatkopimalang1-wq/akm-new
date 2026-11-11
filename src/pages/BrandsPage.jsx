import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Coffee } from 'lucide-react';
import { OFFICIAL_BRANDS_DATA } from '../data/products';

export default function BrandsPage() {
  // Always scroll to top on page load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 py-8 sm:py-14 px-4 sm:px-6 lg:px-8">
      
      {/* Container matching screenshot max-width */}
      <div className="max-w-6xl mx-auto">
        
        {/* Discreet Back to Home link */}
        <div className="mb-6 sm:mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-[#0070f3] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>

        {/* Section Header: Centered Title & Subtitle */}
        <div className="text-center mb-10 sm:mb-14">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Semua Brand
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1.5 sm:mt-2">
            Klik logo brand untuk melihat produk
          </p>
        </div>

        {/* Simple Brand Grid (Persis Tangkapan Layar Pengguna) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {OFFICIAL_BRANDS_DATA.map((brand) => (
            <Link
              key={brand.id}
              to={`/kategori/all?brand=${encodeURIComponent(brand.name)}`}
              className="bg-white rounded-2xl sm:rounded-3xl border border-slate-100/90 shadow-xs hover:shadow-md hover:border-[#0070f3]/40 transition-all duration-300 py-8 px-4 flex flex-col items-center justify-center text-center cursor-pointer group focus:outline-none"
              title={`Buka koleksi ${brand.name}`}
            >
              
              {/* Circular Logo Emblem */}
              <div
                className="w-18 h-18 sm:w-20 sm:h-20 rounded-full flex items-center justify-center font-black tracking-wider uppercase mb-3.5 sm:mb-4 transition-transform duration-300 group-hover:scale-105 shadow-xs"
                style={{
                  backgroundColor: brand.bg,
                  borderColor: brand.border,
                  borderWidth: '2.5px',
                  color: brand.text
                }}
              >
                {brand.logoType === 'akm' ? (
                  <div className="flex flex-col items-center leading-none text-center p-1">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 mb-0.5 text-[#6b21a8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
                      <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" fill="currentColor" fillOpacity="0.15" />
                      <path d="M6 2v2M10 2v2M14 2v2" strokeLinecap="round" />
                    </svg>
                    <span className="text-[8px] sm:text-[9px] font-black tracking-tighter">ALAT KOPI</span>
                    <span className="text-[6px] sm:text-[7px] font-bold tracking-widest text-[#9333ea]">MALANG</span>
                  </div>
                ) : brand.logoType === 'sanubari' ? (
                  <div className="flex flex-col items-center leading-none text-center p-1">
                    <span className="text-[9px] sm:text-[10px] font-black tracking-tight text-[#0369a1]">SANUBARI</span>
                    <span className="text-[6px] sm:text-[7px] font-semibold text-[#0284c7]">ROASTERY</span>
                  </div>
                ) : (
                  <span className="text-xs sm:text-sm font-black px-1 tracking-tight truncate max-w-full">
                    {brand.shortName}
                  </span>
                )}
              </div>

              {/* Brand Name Text */}
              <span className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#0070f3] transition-colors leading-tight line-clamp-1">
                {brand.name}
              </span>

            </Link>
          ))}
        </div>

      </div>

    </div>
  );
}
