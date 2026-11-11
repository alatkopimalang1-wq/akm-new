import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, 
  ShoppingBag, 
  Bell, 
  User, 
  ChevronDown, 
  ChevronRight,
  LayoutGrid, 
  Coffee, 
  Cog, 
  Flame, 
  Timer, 
  PackageCheck, 
  Filter, 
  X,
  SlidersHorizontal,
  CheckCircle2,
  FileText,
  LogOut,
  Sparkles,
  Store,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { PRODUCTS, CATEGORIES, STORE_INFO } from '../data/products';
import { MEGA_MENU_CATEGORIES } from '../data/categoryNavigation';
import { formatRupiah } from '../utils/format';

export default function Navbar({ 
  cartCount, 
  wishlistCount, 
  onOpenCart, 
  onOpenWishlist, 
  onOpenGrinderChart,
  searchQuery, 
  setSearchQuery,
  selectedCategory,
  onSelectCategory,
  onScrollToCalculator,
  onScrollToShowroom
}) {
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [activeParentCategoryId, setActiveParentCategoryId] = useState(MEGA_MENU_CATEGORIES[1].id); // Default: Espresso Beans as in screenshot!
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  
  const navbarRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Search results for live dropdown preview
  const allMatchingProducts = searchQuery.trim().length > 1
    ? PRODUCTS.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tagline?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const searchResults = allMatchingProducts.slice(0, 5);
  const totalMatchesCount = allMatchingProducts.length;

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    const query = searchQuery.trim();
    setSearchFocused(false);
    if (query) {
      navigate(`/kategori/all?q=${encodeURIComponent(query)}`);
    } else {
      navigate('/kategori/all');
    }
  };

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setMegaMenuOpen(false);
        setNotificationOpen(false);
        setSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle ESC key to close mega menu
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setMegaMenuOpen(false);
        setNotificationOpen(false);
        setSearchFocused(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const activeParent = MEGA_MENU_CATEGORIES.find(c => c.id === activeParentCategoryId) || MEGA_MENU_CATEGORIES[0];

  const handleSubcategoryClick = (sub) => {
    if (sub.action === 'calc') {
      onScrollToCalculator();
    } else if (sub.action === 'grinder-chart') {
      onOpenGrinderChart();
    } else if (sub.internalUrl) {
      navigate(sub.internalUrl);
    } else if (sub.link) {
      navigate(sub.link);
    } else if (sub.externalUrl) {
      window.open(sub.externalUrl, '_blank');
    } else if (sub.targetCategory) {
      navigate(`/kategori/${sub.targetCategory}`);
    }
    setMegaMenuOpen(false);
  };

  // Helper render circular icon badge dengan aksen biru & ilustrasi selaras mobile
  const renderIconBadge = (type) => {
    switch (type) {
      case 'beans-classic':
        return (
          <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
            <svg className="w-7 h-7" viewBox="0 0 36 36" fill="none">
              <circle cx="10" cy="10" r="3.5" fill="#f59e0b" />
              <path d="M10 4v2M10 14v2M4 10h2M14 10h2" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M7 26c6-4 14-6 22-8" stroke="#57534e" strokeWidth="2" strokeLinecap="round" />
              <path d="M14 19c-3-4-2-7 0-9 4 1 5 4 4 7" fill="#4ade80" stroke="#16a34a" strokeWidth="1.2" />
              <path d="M21 16c2-4 5-5 7-4-1 4-3 6-6 6" fill="#22c55e" stroke="#16a34a" strokeWidth="1.2" />
              <circle cx="18" cy="22" r="3.5" fill="#ef4444" stroke="#991b1b" strokeWidth="1.2" />
              <circle cx="23" cy="20" r="3.2" fill="#dc2626" stroke="#991b1b" strokeWidth="1.2" />
            </svg>
          </div>
        );
      case 'beans-exp':
        return (
          <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
            <svg className="w-7 h-7" viewBox="0 0 36 36" fill="none">
              <path d="M10 8h6M13 8v8l-6 11a2 2 0 0 0 1.7 3h10.6a2 2 0 0 0 1.7-3L15 16V8" fill="#fef3c7" stroke="#78350f" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M9.5 24h9l-1.5 4H11z" fill="#d97706" opacity="0.8" />
              <circle cx="13" cy="20" r="1.5" fill="#f59e0b" />
              <circle cx="15" cy="25" r="1" fill="#fff" />
            </svg>
          </div>
        );
      case 'beans-coferment':
        return (
          <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
            <svg className="w-7 h-7" viewBox="0 0 36 36" fill="none">
              <ellipse cx="17" cy="11" rx="8" ry="2.5" fill="#fef3c7" stroke="#854d0e" strokeWidth="1.6" />
              <path d="M9 11c-2 5-2 11 0 15 2 1.5 14 1.5 16 0 2-4 2-10 0-15" fill="#fde047" fillOpacity="0.3" stroke="#854d0e" strokeWidth="1.6" />
              <ellipse cx="17" cy="26" rx="8" ry="2" fill="#ca8a04" stroke="#854d0e" strokeWidth="1.6" />
              <circle cx="27" cy="27" r="2.5" fill="#dc2626" stroke="#991b1b" strokeWidth="1" />
            </svg>
          </div>
        );
      case 'gift':
        return (
          <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
            <svg className="w-7 h-7" viewBox="0 0 36 36" fill="none">
              <path d="M8 18h20l-2.5 11h-15z" fill="#fef3c7" stroke="#92400e" strokeWidth="1.6" strokeLinejoin="round" />
              <rect x="13" y="11" width="10" height="7" rx="1.5" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.4" />
              <path d="M18 11v7M13 14.5h10" stroke="#0284c7" strokeWidth="1.2" />
              <path d="M15 8c-3 0-3 3 0 3h6c3 0 3-3 0-3-2 0-3 2-3 2s-1-2-3-2z" fill="#ef4444" stroke="#991b1b" strokeWidth="1.2" />
            </svg>
          </div>
        );
      case 'cybr':
        return (
          <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
            <svg className="w-7 h-7" viewBox="0 0 36 36" fill="none">
              <path d="M10 8h16l-5 9v8l-6 2v-10z" fill="#fef3c7" stroke="#78350f" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <text x="18" y="15" textAnchor="middle" fill="#78350f" fontSize="7" fontWeight="900" fontFamily="sans-serif">CY</text>
              <text x="18" y="22" textAnchor="middle" fill="#78350f" fontSize="6" fontWeight="900" fontFamily="sans-serif">BR</text>
            </svg>
          </div>
        );
      case 'acara':
        return (
          <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
            <svg className="w-7 h-7" viewBox="0 0 36 36" fill="none">
              <circle cx="18" cy="18" r="10" fill="#fef3c7" stroke="#b45309" strokeWidth="1.8" />
              <path d="M15 13c-2 2-3 5-1 9s5 3 7 1" stroke="#78350f" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M21 13c2 2 3 5 1 9s-5 3-7 1" stroke="#78350f" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </div>
        );
      case 'bundle':
        return (
          <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
            <svg className="w-7 h-7" viewBox="0 0 36 36" fill="none">
              <rect x="7" y="12" width="22" height="16" rx="2.5" fill="#fef3c7" stroke="#b45309" strokeWidth="1.8" />
              <path d="M7 17h22M18 12v16" stroke="#b45309" strokeWidth="1.5" />
              <circle cx="18" cy="9.5" r="2.5" fill="#ef4444" stroke="#991b1b" strokeWidth="1" />
            </svg>
          </div>
        );
      case 'robusta':
        return (
          <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
            <svg className="w-6 h-6 text-[#0070f3]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <ellipse cx="12" cy="12" rx="4.5" ry="7" transform="rotate(25 12 12)" fill="#dbeafe" stroke="#0070f3"/>
              <path d="M10 8c1 2 3 5 4 8" stroke="#0070f3" strokeWidth="1.6"/>
              <path d="M4 14c0 3 3 6 8 6s8-3 8-6" stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="1 2"/>
            </svg>
          </div>
        );
      case 'arabica':
        return (
          <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
            <svg className="w-6 h-6 text-[#0070f3]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="9" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="2 2"/>
              <ellipse cx="12" cy="12" rx="4" ry="7" fill="#dbeafe" stroke="#0070f3"/>
              <path d="M10.5 7.5c1 2 2 6 3 9" stroke="#0070f3" strokeWidth="1.6"/>
            </svg>
          </div>
        );
      case 'houseblend':
        return (
          <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
            <svg className="w-6 h-6 text-[#0070f3]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M3 10l9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10z" fill="#eff6ff" stroke="#38bdf8"/>
              <path d="M9 15h6v6H9z" fill="#0070f3" stroke="#0070f3"/>
              <path d="M10 11a2 2 0 1 0 4 0" stroke="#0070f3"/>
            </svg>
          </div>
        );
      case 'dripper':
        return (
          <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
            <Coffee className="w-6 h-6 text-[#0070f3]" />
          </div>
        );
      case 'grinder':
        return (
          <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
            <Cog className="w-6 h-6 text-[#0070f3]" />
          </div>
        );
      case 'flair':
        return (
          <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
            <Flame className="w-6 h-6 text-[#0070f3]" />
          </div>
        );
      case 'kettle':
        return (
          <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
            <Coffee className="w-6 h-6 text-[#0070f3]" />
          </div>
        );
      case 'scale':
        return (
          <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
            <Timer className="w-6 h-6 text-[#0070f3]" />
          </div>
        );
      case 'calc':
        return (
          <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
            <Sparkles className="w-6 h-6 text-[#0070f3]" />
          </div>
        );
      case 'cog':
        return (
          <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
            <SlidersHorizontal className="w-6 h-6 text-[#0070f3]" />
          </div>
        );
      case 'guide':
        return (
          <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
            <BookOpen className="w-6 h-6 text-[#0070f3]" />
          </div>
        );
      default:
        return (
          <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
            <Store className="w-6 h-6 text-[#0070f3]" />
          </div>
        );
    }
  };

  const handleLogoHomeClick = (e) => {
    setMegaMenuOpen(false);
    setNotificationOpen(false);
    setSearchFocused(false);
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0b1e36]/98 backdrop-blur-md shadow-md border-b border-[#142944] transition-all" ref={navbarRef}>
      
      {/* Top Navbar Row */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          
          {/* LEFT: Brand Logo + Name + Kategori Pill */}
          <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
            {/* Brand Logo & Name (Tombol Kembali ke Homepage) */}
            <Link 
              to="/" 
              onClick={handleLogoHomeClick}
              title="Kembali ke Beranda (Homepage)"
              className="flex items-center gap-2 sm:gap-3 group focus:outline-none cursor-pointer select-none"
            >
              {/* Circular Sanubari Logo Badge */}
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full overflow-hidden bg-[#10223b] border border-[#1e3a5f] group-hover:border-[#0084ff] group-hover:scale-105 transition-all shrink-0 flex items-center justify-center shadow-md">
                <img
                  src="/sanubari-logo.png"
                  alt="Sanubari Roastery"
                  className="w-full h-full object-cover group-hover:brightness-110 transition-all"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<span class="text-xs font-black text-[#0084ff]">SNB</span>';
                  }}
                />
              </div>

              {/* Brand Typography */}
              <div className="flex flex-col leading-tight">
                <span className="font-extrabold text-sm sm:text-lg text-white tracking-tight group-hover:text-[#38bdf8] transition-colors font-sans">
                  Sanubari
                </span>
                <span className="text-[10px] sm:text-xs text-[#94a3b8] group-hover:text-slate-300 font-medium tracking-normal transition-colors">
                  Roastery Malang
                </span>
              </div>
            </Link>

            {/* Kategori Button (Hidden di versi mobile, tampil di desktop) */}
            <button
              onClick={() => setMegaMenuOpen(!megaMenuOpen)}
              className={`hidden md:flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md outline-none focus:outline-none focus:ring-0 ${
                megaMenuOpen
                  ? 'bg-gradient-to-r from-[#0070f3] to-[#0052cc] text-white shadow-lg shadow-[#0070f3]/30 scale-[1.02]'
                  : 'bg-[#10223b] hover:bg-[#162e50] border border-[#1d3b66] text-[#f1f5f9]'
              }`}
            >
              <LayoutGrid className={`w-4 h-4 ${megaMenuOpen ? 'text-white' : 'text-[#38bdf8]'}`} />
              <span className="font-semibold tracking-wide">Kategori</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${megaMenuOpen ? 'rotate-180 text-white' : 'text-[#94a3b8]'}`} />
            </button>
          </div>

          {/* CENTER: Wide Search Bar with Instant Suggestions */}
          <div className="flex-1 max-w-xl mx-1.5 sm:mx-6 relative">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="Cari biji kopi, alat seduh..."
                value={searchQuery}
                onFocus={() => setSearchFocused(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearchSubmit(e);
                  }
                }}
                className="w-full bg-[#060e1a] focus:bg-[#0a1526] border border-[#172b47] focus:border-[#0084ff] text-sm text-white placeholder-[#64748b] rounded-xl py-2.5 sm:py-3 pl-10 sm:pl-11 pr-4 focus:outline-none transition-all shadow-inner focus:shadow-md"
              />
              <button
                type="submit"
                className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-white transition-colors"
                title="Cari Produk"
              >
                <Search className="w-4 h-4" />
              </button>
              {searchQuery && (
                <button 
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#94a3b8] hover:text-white bg-[#172b47] px-2 py-0.5 rounded font-medium"
                >
                  Clear
                </button>
              )}
            </form>

            {/* Instant Search Results Dropdown */}
            {searchFocused && searchQuery.trim().length > 1 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white text-slate-900 rounded-2xl border border-slate-200 shadow-2xl overflow-hidden z-50 animate-fade-in divide-y divide-slate-100">
                <div className="p-3 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">Hasil Pencarian Produk</span>
                  <span>{totalMatchesCount} ditemukan</span>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {searchResults.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-500">
                      Tidak ada produk dengan kata kunci "{searchQuery}"
                    </div>
                  ) : (
                    searchResults.map((p) => (
                      <Link
                        key={p.id}
                        to={`/product/${p.slug}`}
                        onClick={() => {
                          setSearchFocused(false);
                          setSearchQuery('');
                        }}
                        className="p-3 hover:bg-slate-50 flex items-center gap-3 transition-colors group"
                      >
                        <img src={p.images[0]} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-[#0e1f36] uppercase">{p.brand}</p>
                          <h5 className="text-sm font-bold text-slate-900 truncate group-hover:text-[#0e1f36]">{p.name}</h5>
                          <span className="text-sm font-extrabold text-slate-900">{formatRupiah(p.price)}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#0e1f36] group-hover:translate-x-0.5 transition-all shrink-0" />
                      </Link>
                    ))
                  )}
                </div>
                {totalMatchesCount > 0 && (
                  <button
                    type="button"
                    onClick={handleSearchSubmit}
                    className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 text-[#0e1f36] text-xs sm:text-sm font-bold text-center block transition-colors border-t border-slate-100"
                  >
                    Lihat Semua Hasil untuk "{searchQuery}" ({totalMatchesCount} produk) →
                  </button>
                )}
              </div>
            )}
          </div>

          {/* RIGHT: Notifications Bell (4) + Cart Bag (2) + User Pill "Winda" */}
          <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
            
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="relative p-2.5 text-[#94a3b8] hover:text-white rounded-xl hover:bg-[#10223b] transition-colors"
                title="Notifikasi"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 bg-[#ef4444] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                  4
                </span>
              </button>

              {notificationOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 max-w-[calc(100vw-1.5rem)] bg-[#0c192d] rounded-2xl border border-[#1e3a5f] shadow-2xl p-4 z-50 animate-fade-in space-y-3 text-left">
                  <div className="flex items-center justify-between border-b border-[#172b47] pb-2">
                    <span className="text-xs font-bold text-white">Notifikasi</span>
                    <span className="text-[10px] text-[#38bdf8] bg-[#10223b] px-2 py-0.5 rounded-full border border-[#1e3a5f]">4 Baru</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-[#10223b] border border-[#1a365d]">
                      <p className="font-semibold text-white">Promo Buka Showroom ☕</p>
                      <p className="text-[11px] text-[#94a3b8]">Gunakan kupon SANUBARI10 untuk diskon 10%.</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#10223b] border border-[#1a365d]">
                      <p className="font-semibold text-white">Paket Baru: Flair 58 Ready!</p>
                      <p className="text-[11px] text-[#94a3b8]">Unit Flair 58 Lever kini ready stock di Tlogomas.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Shopping Bag (Hidden di mobile, tampil di desktop) */}
            <button
              onClick={onOpenCart}
              className="hidden md:flex relative p-2.5 text-[#94a3b8] hover:text-white rounded-xl hover:bg-[#10223b] transition-colors"
              title="Keranjang Belanja"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 bg-[#ef4444] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                {cartCount > 0 ? cartCount : 2}
              </span>
            </button>

            {/* User Pill: "Winda" (Langsung ke Halaman Akun saat diklik) */}
            <div className="hidden md:block">
              <Link
                to="/akun"
                className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-[#10223b] hover:bg-[#162e50] border border-[#1d3b66] text-[#f1f5f9] text-xs sm:text-sm font-semibold transition-all shadow-sm hover:border-[#38bdf8]/40 active:scale-95 cursor-pointer"
                title="Buka Halaman Akun Saya"
              >
                <User className="w-4 h-4 text-[#38bdf8]" />
                <span className="font-semibold text-white">Winda</span>
              </Link>
            </div>

          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* MEGA MENU FLOATING OVERLAY PANEL (Persis Desain Screenshot dengan Aksen Biru) */}
      {/* ========================================================================= */}
      {megaMenuOpen && (
        <>
          {/* Subtle Dim Backdrop */}
          <div 
            className="fixed inset-0 top-[72px] sm:top-[80px] bg-black/60 backdrop-blur-[2px] z-40 transition-opacity animate-fade-in"
            onClick={() => setMegaMenuOpen(false)}
          />

          {/* Full-width Floating Panel */}
          <div className="absolute top-full left-0 right-0 z-50 bg-white text-slate-900 shadow-2xl shadow-blue-950/30 animate-fade-in overflow-hidden">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row min-h-[380px] sm:min-h-[420px]">
              
              {/* LEFT COLUMN: Parent Category List with Chevrons */}
              <div className="w-full md:w-72 bg-[#f8fafc] py-6 px-4 shrink-0">
                <div className="space-y-1.5">
                  {MEGA_MENU_CATEGORIES.map((cat) => {
                    const isActive = activeParentCategoryId === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onMouseEnter={() => setActiveParentCategoryId(cat.id)}
                        onClick={() => setActiveParentCategoryId(cat.id)}
                        className={`w-full text-left px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold flex items-center justify-between transition-all duration-200 outline-none focus:outline-none focus:ring-0 ${
                          isActive
                            ? 'bg-blue-50 text-[#0070f3] font-bold shadow-xs'
                            : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                      >
                        <span className="tracking-wide">{cat.name}</span>
                        <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${isActive ? 'text-[#0070f3] translate-x-1' : 'text-slate-400'}`} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* RIGHT AREA: Subcategories Header & "Efek Melayang" Card Grid */}
              <div className="flex-1 p-6 sm:p-8 bg-white flex flex-col justify-between">
                
                <div>
                  {/* Category Header Row */}
                  <div className="flex items-center justify-between pb-4 mb-4">
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-sans">
                      {activeParent.name}
                    </h3>

                    {activeParent.allUrl && (
                      <button
                        onClick={() => {
                          if (activeParent.isExternal) {
                            window.open(activeParent.allUrl, '_blank');
                          } else {
                            navigate(activeParent.allUrl);
                          }
                          setMegaMenuOpen(false);
                        }}
                        className="text-xs sm:text-sm font-bold text-[#0070f3] hover:text-[#0052cc] hover:underline flex items-center gap-1 transition-colors outline-none focus:outline-none focus:ring-0"
                      >
                        <span>{activeParent.allLabel || `Lihat Semua di ${activeParent.name}`}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Subcategory Cards with "Efek Melayang" (Hover elevation & soft shadow) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                    {activeParent.subcategories.map((sub) => (
                      <div
                        key={sub.id}
                        onClick={() => handleSubcategoryClick(sub)}
                        className="group p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-[#0070f3] shadow-xs hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1.5 transition-all duration-300 ease-out cursor-pointer flex items-center gap-3.5 relative"
                      >
                        {/* Circular Emblem Icon */}
                        {renderIconBadge(sub.iconType)}

                        {/* Title & Desc */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#0070f3] transition-colors truncate">
                            {sub.name}
                          </h4>
                          {sub.desc && (
                            <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 font-normal">
                              {sub.desc}
                            </p>
                          )}
                        </div>

                        {/* Subtle Chevron indicator on hover */}
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#0070f3] group-hover:translate-x-1 transition-all opacity-0 group-hover:opacity-100 shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Helpful Micro Bar */}
                <div className="pt-6 mt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                    <span>Showroom &amp; Slow Bar Sanubari Tlogomas Buka Setiap Hari (09.00 - 23.00 WIB)</span>
                  </div>
                  <span className="text-[11px] text-slate-400">Tekan ESC untuk menutup menu</span>
                </div>

              </div>

            </div>
          </div>
        </>
      )}

    </header>
  );
}
