import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Search, 
  Check, 
  ShieldCheck, 
  ExternalLink, 
  ArrowRight, 
  Coffee,
  Sparkles,
  Award
} from 'lucide-react';
import { OFFICIAL_BRANDS_DATA, PRODUCTS } from '../data/products';

export default function BrandsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrigin, setSelectedOrigin] = useState('Semua');
  const navigate = useNavigate();

  // Calculate product count per brand
  const brandsWithCount = useMemo(() => {
    return OFFICIAL_BRANDS_DATA.map((brand) => {
      const count = PRODUCTS.filter((p) => 
        p.brand?.toLowerCase() === brand.name.toLowerCase() ||
        (brand.id === 'akm' && p.brand === 'AKM Signature') ||
        (brand.id === 'flair' && p.brand === 'Flair Espresso') ||
        (brand.id === 'sanubari' && p.brand === 'Sanubari Roastery')
      ).length;
      return { ...brand, count };
    });
  }, []);

  // Filtered brands by search and country origin
  const filteredBrands = useMemo(() => {
    return brandsWithCount.filter((b) => {
      const matchSearch = 
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.origin.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchOrigin = 
        selectedOrigin === 'Semua' || 
        b.origin.toLowerCase().includes(selectedOrigin.toLowerCase());

      return matchSearch && matchOrigin;
    });
  }, [brandsWithCount, searchQuery, selectedOrigin]);

  // Helper render Brand Logo Emblem
  const renderBrandEmblem = (brand, size = 'large') => {
    const dim = size === 'large' ? 'w-18 h-18 sm:w-20 sm:h-20 text-base sm:text-lg' : 'w-14 h-14 text-xs sm:text-sm';
    return (
      <div className="relative">
        <div 
          className={`${dim} rounded-full flex items-center justify-center font-black tracking-wider uppercase transition-transform group-hover:scale-105 shadow-xs`}
          style={{ 
            backgroundColor: brand.bg, 
            borderColor: brand.border,
            borderWidth: '2.5px',
            color: brand.text
          }}
        >
          {brand.logoType === 'akm' ? (
            <div className="flex flex-col items-center leading-none text-center p-1">
              <Coffee className="w-5 h-5 mb-0.5 text-[#6b21a8]" />
              <span className="text-[9px] font-black tracking-tighter">ALAT KOPI</span>
              <span className="text-[7px] font-bold tracking-widest text-[#9333ea]">MALANG</span>
            </div>
          ) : brand.logoType === 'sanubari' ? (
            <div className="flex flex-col items-center leading-none text-center p-1">
              <span className="text-[10px] font-black tracking-tight text-[#0369a1]">SANUBARI</span>
              <span className="text-[7px] font-semibold text-[#0284c7]">ROASTERY</span>
            </div>
          ) : (
            <span className="font-extrabold px-1 tracking-tight truncate max-w-full">
              {brand.shortName}
            </span>
          )}
        </div>

        {/* Verified Badge Checkmark */}
        <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-[#0070f3] border-2 border-white flex items-center justify-center text-white shadow-xs">
          <Check className="w-3 h-3 stroke-[3]" />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 pb-24">
      
      {/* Top Breadcrumb Bar */}
      <div className="bg-slate-50/80 backdrop-blur-sm py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2 flex-wrap">
            <Link to="/" className="hover:text-[#0070f3] transition-colors flex items-center gap-1 font-medium">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Beranda</span>
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-[#0070f3] font-bold">Brand Pilihan Resmi</span>
          </div>

          <span className="text-[11px] text-slate-400">
            {brandsWithCount.length} Brand Partner Terverifikasi
          </span>
        </div>
      </div>

      {/* Main Header Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-8 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-[#0070f3] tracking-wider uppercase mb-3">
              <Award className="w-3.5 h-3.5 text-[#0070f3]" />
              <span>OFFICIAL BRAND PARTNERS</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
              Koleksi Brand Pilihan
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
              Jajaran merek peralatan seduh kopi specialty, hand grinder presisi, mesin espresso lever, dan artisan roastery terkemuka dunia dengan jaminan 100% original dan bergaransi resmi.
            </p>
          </div>

          {/* Search Input in Page */}
          <div className="w-full sm:w-72 relative shrink-0">
            <input
              type="text"
              placeholder="Cari nama brand atau negara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#0070f3] transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-slate-700 bg-slate-200 px-1.5 py-0.5 rounded"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Origin Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-6 text-xs">
          <span className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider shrink-0 mr-1">
            Asal Negara:
          </span>
          {['Semua', 'Indonesia', 'Jepang', 'Jerman', 'USA', 'Taiwan'].map((origin) => (
            <button
              key={origin}
              onClick={() => setSelectedOrigin(origin)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedOrigin === origin
                  ? 'bg-blue-50 text-[#0070f3] border-blue-300 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {origin}
            </button>
          ))}
          {selectedOrigin !== 'Semua' && (
            <button
              onClick={() => setSelectedOrigin('Semua')}
              className="text-[11px] text-red-500 hover:text-red-700 font-medium px-2 py-1 ml-auto"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Grid of Brand Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        {filteredBrands.length === 0 ? (
          <div className="text-center py-20 rounded-3xl bg-slate-50 border border-slate-200 p-8 space-y-4">
            <Coffee className="w-12 h-12 text-slate-400 mx-auto opacity-70" />
            <h3 className="text-lg font-bold text-slate-900">Brand Tidak Ditemukan</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Tidak ada brand partner yang cocok dengan kata kunci "{searchQuery}".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedOrigin('Semua');
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0070f3] to-[#0052cc] text-white font-bold text-xs shadow-md shadow-blue-500/20 hover:brightness-110"
            >
              Tampilkan Semua Brand
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBrands.map((brand) => (
              <div
                key={brand.id}
                onClick={() => navigate(`/kategori/all?brand=${encodeURIComponent(brand.name)}`)}
                className="group p-6 rounded-3xl bg-white border border-slate-200/90 hover:border-[#0070f3] shadow-xs hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 flex flex-col justify-between cursor-pointer relative"
              >
                <div>
                  
                  {/* Top Row: Emblem & Flag Badge */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    {renderBrandEmblem(brand, 'large')}
                    
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-[11px] font-semibold text-slate-700">
                      <span>{brand.flag}</span>
                      <span>{brand.origin.split(',')[0]}</span>
                    </span>
                  </div>

                  {/* Brand Typography */}
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#0070f3] transition-colors">
                    {brand.name}
                  </h3>
                  
                  <p className="text-[11px] text-[#0070f3] font-semibold mt-0.5 line-clamp-1">
                    {brand.tagline}
                  </p>

                  <p className="text-xs text-slate-600 mt-2.5 leading-relaxed line-clamp-2">
                    {brand.desc}
                  </p>

                </div>

                {/* Footer Action Row */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-semibold text-slate-500">
                    {brand.count > 0 ? `${brand.count} Produk Tersedia` : 'Official Partner'}
                  </span>
                  
                  <span className="inline-flex items-center gap-1 font-bold text-[#0070f3] group-hover:translate-x-1 transition-transform">
                    <span>Lihat Produk</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Trust & Distributor Guarantee Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-50 border border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-[#0070f3]" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">Garansi Keaslian 100% Distributor Resmi</h4>
              <p className="text-xs text-slate-600 mt-0.5 max-w-xl">
                Semua brand yang bermitra dengan Alat Kopi Malang didatangkan melalui jalur distributor resmi. Setiap produk elektrik dan hand grinder dilengkapi kartu garansi resmi.
              </p>
            </div>
          </div>

          <Link
            to="/"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#0070f3] to-[#0052cc] text-white font-bold text-xs shadow-md shadow-blue-500/20 hover:brightness-110 shrink-0"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>

    </div>
  );
}
