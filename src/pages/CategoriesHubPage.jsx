import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Search, 
  ChevronRight, 
  Coffee, 
  Sparkles, 
  Award,
  Filter
} from 'lucide-react';
import { STORE_INFO } from '../data/products';
import { CATEGORY_NAVIGATION_DATA } from '../data/categoryNavigation';

export default function CategoriesHubPage() {
  const navigate = useNavigate();
  const [selectedChip, setSelectedChip] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchBarOpen, setSearchBarOpen] = useState(false);

  // List of Parent Category Filter Chips matching screenshot
  const categoryChips = [
    { id: 'Semua', label: 'Semua' },
    { id: 'filter-beans', label: 'Filter Beans' },
    { id: 'espresso-beans', label: 'Espresso Beans' },
    { id: 'alat-kopi', label: 'Peralatan Seduh' },
    { id: 'fitur-penawaran', label: 'Fitur dan Penawaran' },
    { id: 'brands', label: 'Semua Brand' }
  ];

  // Helper render rich illustrated SVG icon matching screenshot
  const renderSubcategoryIllustration = (iconType) => {
    switch (iconType) {
      case 'beans-classic':
        // Classic Process: Coffee branch with cherries & sun
        return (
          <svg className="w-8 h-8" viewBox="0 0 36 36" fill="none">
            <circle cx="10" cy="10" r="3.5" fill="#f59e0b" />
            <path d="M10 4v2M10 14v2M4 10h2M14 10h2" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M7 26c6-4 14-6 22-8" stroke="#57534e" strokeWidth="2" strokeLinecap="round" />
            <path d="M14 19c-3-4-2-7 0-9 4 1 5 4 4 7" fill="#4ade80" stroke="#16a34a" strokeWidth="1.2" />
            <path d="M21 16c2-4 5-5 7-4-1 4-3 6-6 6" fill="#22c55e" stroke="#16a34a" strokeWidth="1.2" />
            <circle cx="18" cy="22" r="3.5" fill="#ef4444" stroke="#991b1b" strokeWidth="1.2" />
            <circle cx="23" cy="20" r="3.2" fill="#dc2626" stroke="#991b1b" strokeWidth="1.2" />
            <path d="M8 29c4 1 7-1 11 0" stroke="#0284c7" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M10 32c3 1 6-1 9 0" stroke="#0ea5e9" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        );

      case 'beans-exp':
        // Experimantal Process: Lab glassware & bubbling test tubes
        return (
          <svg className="w-8 h-8" viewBox="0 0 36 36" fill="none">
            <path d="M10 8h6M13 8v8l-6 11a2 2 0 0 0 1.7 3h10.6a2 2 0 0 0 1.7-3L15 16V8" fill="#fef3c7" stroke="#78350f" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9.5 24h9l-1.5 4H11z" fill="#d97706" opacity="0.8" />
            <circle cx="13" cy="20" r="1.5" fill="#f59e0b" />
            <circle cx="15" cy="25" r="1" fill="#fff" />
            <path d="M22 13h5M24.5 13v9l-3 5.5a1.5 1.5 0 0 0 1.3 2.2h5.4a1.5 1.5 0 0 0 1.3-2.2L26 22v-9" fill="#e0f2fe" stroke="#0369a1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M22.5 26h4" stroke="#0284c7" strokeWidth="1.5" />
          </svg>
        );

      case 'beans-coferment':
        // Co-Ferment: Wooden aging barrel with sweet fruit
        return (
          <svg className="w-8 h-8" viewBox="0 0 36 36" fill="none">
            <ellipse cx="17" cy="11" rx="8" ry="2.5" fill="#fef3c7" stroke="#854d0e" strokeWidth="1.6" />
            <path d="M9 11c-2 5-2 11 0 15 2 1.5 14 1.5 16 0 2-4 2-10 0-15" fill="#fde047" fillOpacity="0.3" stroke="#854d0e" strokeWidth="1.6" />
            <ellipse cx="17" cy="26" rx="8" ry="2" fill="#ca8a04" stroke="#854d0e" strokeWidth="1.6" />
            <path d="M8.5 17c5 1 12 1 17 0M8.5 21c5 1 12 1 17 0" stroke="#713f12" strokeWidth="1.5" />
            <circle cx="27" cy="27" r="2.5" fill="#dc2626" stroke="#991b1b" strokeWidth="1" />
            <circle cx="29" cy="24" r="2" fill="#ea580c" stroke="#991b1b" strokeWidth="1" />
            <circle cx="25" cy="24" r="2" fill="#e11d48" stroke="#991b1b" strokeWidth="1" />
          </svg>
        );

      case 'gift':
        // Gift Box Hampers: Gift basket with bow ribbon
        return (
          <svg className="w-8 h-8" viewBox="0 0 36 36" fill="none">
            <path d="M8 18h20l-2.5 11h-15z" fill="#fef3c7" stroke="#92400e" strokeWidth="1.6" strokeLinejoin="round" />
            <path d="M12 18l3 11M24 18l-3 11M18 18v11" stroke="#b45309" strokeWidth="1.2" strokeLinecap="round" />
            <rect x="13" y="11" width="10" height="7" rx="1.5" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.4" />
            <path d="M18 11v7M13 14.5h10" stroke="#0284c7" strokeWidth="1.2" />
            <path d="M15 8c-3 0-3 3 0 3h6c3 0 3-3 0-3-2 0-3 2-3 2s-1-2-3-2z" fill="#ef4444" stroke="#991b1b" strokeWidth="1.2" />
          </svg>
        );

      case 'robusta':
        // Fine Robusta: Coffee bean with diamond / golden laurel wreath
        return (
          <svg className="w-8 h-8" viewBox="0 0 36 36" fill="none">
            <path d="M18 10c-4 0-7 3.5-7 8s3 8 7 8 7-3.5 7-8-3-8-7-8z" fill="#78350f" stroke="#451a03" strokeWidth="1.6" />
            <path d="M18 11c-1 3 0 6 1 7s-1 4-1 6" stroke="#fef3c7" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M9 22c-2-3-2-7 0-10M27 22c2-3 2-7 0-10" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M10 14l2 1M8 18l2 1M26 14l-2 1M28 18l-2 1" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" />
            <polygon points="18,27 22,31 18,34 14,31" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.2" />
          </svg>
        );

      case 'arabica':
        // Full Arabica: Golden circular crest with single bean
        return (
          <svg className="w-8 h-8" viewBox="0 0 36 36" fill="none">
            <circle cx="18" cy="18" r="11" fill="#fef3c7" stroke="#b45309" strokeWidth="2" />
            <circle cx="18" cy="18" r="8.5" stroke="#d97706" strokeWidth="1.2" strokeDasharray="2 2" />
            <path d="M18 12c-2.5 0-4.5 2.5-4.5 6s2 6 4.5 6 4.5-2.5 4.5-6-2-6-4.5-6z" fill="#92400e" stroke="#451a03" strokeWidth="1.2" />
            <path d="M18 13c-.8 2 0 4 .8 5s-.8 3-.8 4" stroke="#fef3c7" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        );

      case 'houseblend':
        // Houseblend: Cozy house outline with coffee heart
        return (
          <svg className="w-8 h-8" viewBox="0 0 36 36" fill="none">
            <path d="M8 18l10-8 10 8" stroke="#78350f" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="11" y="17" width="14" height="12" rx="1.5" fill="#fef3c7" stroke="#78350f" strokeWidth="1.6" />
            <path d="M18 20c-1.5 0-3 1.5-3 3.5s1.5 3.5 3 3.5 3-1.5 3-3.5-1.5-3.5-3-3.5z" fill="#b45309" stroke="#78350f" strokeWidth="1" />
            <path d="M17.8 21.5c-.3 1 0 2 .4 2.5" stroke="#fef3c7" strokeWidth="0.9" strokeLinecap="round" />
          </svg>
        );

      case 'cybr':
        // C.Y.B.R: Funnel dripper
        return (
          <svg className="w-8 h-8" viewBox="0 0 36 36" fill="none">
            <path d="M10 8h16l-5 9v8l-6 2v-10z" fill="#fef3c7" stroke="#78350f" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <text x="18" y="15" textAnchor="middle" fill="#78350f" fontSize="7" fontWeight="900" fontFamily="sans-serif">CY</text>
            <text x="18" y="22" textAnchor="middle" fill="#78350f" fontSize="6" fontWeight="900" fontFamily="sans-serif">BR</text>
          </svg>
        );

      case 'acara':
        // Acara: Coffee bean ticket / badge
        return (
          <svg className="w-8 h-8" viewBox="0 0 36 36" fill="none">
            <circle cx="18" cy="18" r="10" fill="#fef3c7" stroke="#b45309" strokeWidth="1.8" />
            <path d="M15 13c-2 2-3 5-1 9s5 3 7 1" stroke="#78350f" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M21 13c2 2 3 5 1 9s-5 3-7 1" stroke="#78350f" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        );

      case 'dripper':
        // Manual Brew: V60 dripper cone with server
        return (
          <svg className="w-8 h-8" viewBox="0 0 36 36" fill="none">
            <path d="M8 8h20l-6 10H14z" fill="#fef3c7" stroke="#b45309" strokeWidth="1.8" strokeLinejoin="round" />
            <path d="M6 8h24" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
            <path d="M13 18h10l3 9a2 2 0 0 1-2 2H12a2 2 0 0 1-2-2z" fill="#e0f2fe" stroke="#0369a1" strokeWidth="1.8" />
            <path d="M26 21a4 4 0 0 1 0 6h-2" stroke="#0369a1" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        );

      case 'grinder':
        // Hand Grinder: Precision manual coffee grinder
        return (
          <svg className="w-8 h-8" viewBox="0 0 36 36" fill="none">
            <rect x="12" y="11" width="12" height="18" rx="2" fill="#f1f5f9" stroke="#334155" strokeWidth="1.8" />
            <path d="M18 11V6l7-1.5" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="26" cy="4.5" r="2.5" fill="#b45309" stroke="#78350f" strokeWidth="1.2" />
            <path d="M12 18h12M12 23h12" stroke="#cbd5e1" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        );

      case 'flair':
        // Espresso & Lever Tools: Flair lever machine
        return (
          <svg className="w-8 h-8" viewBox="0 0 36 36" fill="none">
            <path d="M10 28h16M18 28V11M12 7l6 4 6-4" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="18" cy="15" r="4.5" fill="#fef3c7" stroke="#b45309" strokeWidth="1.5" />
            <path d="M15 22h6v4h-6z" fill="#334155" stroke="#0f172a" strokeWidth="1.2" />
          </svg>
        );

      case 'kettle':
        // Gooseneck Kettle: Fellow Stagg style
        return (
          <svg className="w-8 h-8" viewBox="0 0 36 36" fill="none">
            <path d="M10 14h14v12a2 2 0 0 1-2 2H12a2 2 0 0 1-2-2V14z" fill="#1e293b" stroke="#0f172a" strokeWidth="1.8" />
            <path d="M24 18c4-1 6-6 3-10M10 20c-5-2-5-9-1-12" stroke="#0f172a" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M14 9h6M17 9v5" stroke="#0f172a" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        );

      case 'scale':
        // Digital Scale: Smart flow rate timer
        return (
          <svg className="w-8 h-8" viewBox="0 0 36 36" fill="none">
            <rect x="7" y="10" width="22" height="17" rx="3" fill="#0f172a" stroke="#334155" strokeWidth="1.8" />
            <rect x="11" y="14" width="14" height="6" rx="1.5" fill="#1e293b" stroke="#475569" strokeWidth="1" />
            <circle cx="18" cy="23" r="1.5" fill="#22c55e" />
            <text x="18" y="18.5" textAnchor="middle" fill="#38bdf8" fontSize="4.5" fontWeight="bold" fontFamily="monospace">15.0g</text>
          </svg>
        );

      case 'bundle':
        // Starter Kit: Barista Complete Box Set
        return (
          <svg className="w-8 h-8" viewBox="0 0 36 36" fill="none">
            <rect x="7" y="12" width="22" height="16" rx="2.5" fill="#fef3c7" stroke="#b45309" strokeWidth="1.8" />
            <path d="M7 17h22M18 12v16" stroke="#b45309" strokeWidth="1.5" />
            <circle cx="18" cy="9.5" r="2.5" fill="#ef4444" stroke="#991b1b" strokeWidth="1" />
          </svg>
        );

      default:
        return (
          <svg className="w-8 h-8" viewBox="0 0 36 36" fill="none">
            <circle cx="18" cy="18" r="10" fill="#f1f5f9" stroke="#64748b" strokeWidth="1.8" />
            <Coffee className="w-4 h-4 text-[#8B5A2B] mx-auto" />
          </svg>
        );
    }
  };

  // Pre-configured category sections (100% selaras dengan desktop Mega Menu)
  const categorySections = CATEGORY_NAVIGATION_DATA;

  // Filter sections by chip and search
  const visibleSections = useMemo(() => {
    let result = categorySections;

    if (selectedChip !== 'Semua') {
      if (selectedChip === 'brands') {
        // Redirect or show brands
        navigate('/brands');
        return [];
      }
      result = result.filter((sec) => sec.id === selectedChip);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.map((sec) => {
        const filteredItems = sec.items.filter((it) => 
          it.name.toLowerCase().includes(q) || sec.title.toLowerCase().includes(q)
        );
        return { ...sec, items: filteredItems };
      }).filter((sec) => sec.items.length > 0);
    }

    return result;
  }, [selectedChip, searchQuery]);

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-900 pb-24 font-sans select-none">
      
      {/* ========================================================================= */}
      {/* TOP BAR HEADER (Persis Tangkapan Layar: < Semua Kategori 🔍) */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-100 shadow-2xs">
        <div className="max-w-md sm:max-w-xl mx-auto px-4 h-14 flex items-center justify-between">
          
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="p-1 -ml-1 text-slate-800 hover:text-[#8B5A2B] transition-colors focus:outline-none cursor-pointer"
            title="Kembali"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.2]" />
          </button>

          {/* Title */}
          <h1 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight font-sans">
            Semua Kategori
          </h1>

          {/* Search Toggle Icon */}
          <button
            onClick={() => setSearchBarOpen(!searchBarOpen)}
            className="p-1 -mr-1 text-slate-800 hover:text-[#8B5A2B] transition-colors focus:outline-none cursor-pointer"
            title="Cari Kategori"
          >
            <Search className="w-5 h-5 stroke-[2.2]" />
          </button>

        </div>

        {/* Collapsible Search Input if toggled */}
        {searchBarOpen && (
          <div className="px-4 pb-3 max-w-md sm:max-w-xl mx-auto animate-fade-in">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari nama kategori..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-xs text-slate-900 focus:outline-none focus:border-[#8B5A2B] transition-colors"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-slate-700 bg-slate-200 px-1.5 py-0.5 rounded font-medium"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* HORIZONTAL CATEGORY FILTER CHIPS (Persis Screenshot) */}
        {/* ========================================================================= */}
        <div className="border-t border-slate-100/80 bg-white py-2.5 px-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 max-w-md sm:max-w-xl mx-auto">
            {categoryChips.map((chip) => {
              const isActive = selectedChip === chip.id;
              return (
                <button
                  key={chip.id}
                  onClick={() => setSelectedChip(chip.id)}
                  className={`px-4 py-1.5 rounded-full text-xs whitespace-nowrap transition-all duration-200 cursor-pointer focus:outline-none ${
                    isActive
                      ? 'bg-[#182230] text-white font-bold shadow-xs scale-[1.02]'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 font-medium'
                  }`}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>
        </div>

      </header>

      {/* ========================================================================= */}
      {/* MAIN CATEGORIES LIST (Persis Layout 2 Kolom per Kategori di Screenshot) */}
      {/* ========================================================================= */}
      <main className="max-w-md sm:max-w-xl mx-auto px-4 pt-4 sm:pt-6">
        
        {visibleSections.length === 0 ? (
          <div className="text-center py-12">
            <Coffee className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">Kategori Tidak Ditemukan</p>
            <p className="text-xs text-slate-400 mt-1">Coba gunakan kata kunci lain</p>
          </div>
        ) : (
          visibleSections.map((section) => (
            <section key={section.id} className="mb-6">
              
              {/* Section Header: Title left, "Lihat Semua >" right */}
              <div className="flex items-center justify-between mb-3 px-1">
                <h2 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight font-sans">
                  {section.title}
                </h2>
                <Link
                  to={section.allUrl}
                  className="text-xs sm:text-sm font-semibold text-[#8B5A2B] hover:text-[#704214] flex items-center gap-0.5 transition-colors focus:outline-none"
                >
                  <span>Lihat Semua</span>
                  <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </Link>
              </div>

              {/* 2-Column Grid of Subcategory Cards */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                {section.items.map((item) => (
                  <Link
                    key={item.id}
                    to={item.link}
                    className="bg-white rounded-2xl border border-slate-100 shadow-xs hover:border-slate-300 hover:shadow-sm p-3 sm:p-3.5 flex items-center gap-2.5 sm:gap-3 transition-all duration-200 group focus:outline-none"
                    title={item.name}
                  >
                    
                    {/* Illustration Icon Container */}
                    <div className="w-12 h-12 rounded-xl bg-slate-50/80 border border-slate-100/80 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      {renderSubcategoryIllustration(item.iconType)}
                    </div>

                    {/* Subcategory Label Name */}
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-bold text-slate-900 group-hover:text-[#8B5A2B] transition-colors leading-tight line-clamp-2">
                        {item.name}
                      </span>
                    </div>

                  </Link>
                ))}
              </div>

            </section>
          ))
        )}

      </main>

    </div>
  );
}
