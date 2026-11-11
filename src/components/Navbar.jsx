import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import { CATEGORIES, STORE_INFO } from '../data/products';

// Data Mega Menu yang selaras persis dengan website Sanubari Roastery
export const MEGA_MENU_CATEGORIES = [
  {
    id: 'filter-beans',
    name: 'Filter Beans',
    slug: 'filter-beans',
    categoryTarget: 'manual-brew',
    allLabel: 'Lihat Semua di Filter Beans',
    allUrl: '/?category=manual-brew',
    subcategories: [
      { id: 'classic-process', name: 'Classic Process', iconType: 'beans-classic', desc: 'Washed & Natural Profile Kawi', targetCategory: 'manual-brew' },
      { id: 'experimental-process', name: 'Experimantal Process', iconType: 'beans-exp', desc: 'Anaerobic & Yeast Inoculation', targetCategory: 'manual-brew' },
      { id: 'co-ferment', name: 'Co-Ferment Process', iconType: 'beans-coferment', desc: 'Nanas Madu & Sweet Plum', targetCategory: 'manual-brew' },
      { id: 'paket-box-hampers', name: 'Paket Box Hampers', iconType: 'gift', desc: 'Specialty Gift Box Roastery', targetCategory: 'bundles' }
    ]
  },
  {
    id: 'espresso-beans',
    name: 'Espresso Beans',
    slug: 'espresso-beans',
    categoryTarget: 'espresso-tools',
    allLabel: 'Lihat Semua di Espresso Beans',
    allUrl: '/?category=espresso-tools',
    subcategories: [
      { id: 'fine-robusta', name: 'Fine Robusta', iconType: 'robusta', desc: 'Dampit & Malang Grade 1', targetCategory: 'espresso-tools' },
      { id: 'full-arabica', name: 'Full Arabica', iconType: 'arabica', desc: '100% Arabika Gunung Kawi', targetCategory: 'espresso-tools' },
      { id: 'houseblend', name: 'Houseblend', iconType: 'houseblend', desc: 'Formula Kopi Susu & Espresso', targetCategory: 'espresso-tools' }
    ]
  },
  {
    id: 'alat-kopi',
    name: 'Peralatan Seduh (Alat Kopi)',
    slug: 'alat-kopi',
    categoryTarget: 'all',
    allLabel: 'Lihat Semua Peralatan Kopi',
    allUrl: '/?category=all',
    subcategories: [
      { id: 'manual-brew-gear', name: 'Manual Brew & Dripper', iconType: 'dripper', desc: 'Hario Kasuya, Origami, Aeropress', targetCategory: 'manual-brew' },
      { id: 'hand-grinder', name: 'Hand Grinder Presisi', iconType: 'grinder', desc: 'Timemore C3S & Kingrinder K6', targetCategory: 'grinder' },
      { id: 'espresso-gear', name: 'Espresso & Lever Tools', iconType: 'flair', desc: 'Flair 58, Portafilter 58mm, WDT', targetCategory: 'espresso-tools' },
      { id: 'kettle-gear', name: 'Kettle Gooseneck', iconType: 'kettle', desc: 'Fellow Stagg & Timemore Fish', targetCategory: 'kettle' },
      { id: 'scale-gear', name: 'Scale & Timer Digital', iconType: 'scale', desc: 'Timemore Black Mirror Basic 2', targetCategory: 'scale' },
      { id: 'starter-kit', name: 'Paket Starter Kit (5-in-1)', iconType: 'bundle', desc: 'Set Lengkap Barista Rumah', targetCategory: 'bundles' }
    ]
  },
  {
    id: 'fitur-penawaran',
    name: 'Fitur dan Penawaran',
    slug: 'fitur-penawaran',
    allLabel: 'Lihat Seluruh Fitur & Panduan',
    allUrl: '/panduan-seduh',
    subcategories: [
      { id: 'kalkulator-seduh', name: 'Kalkulator Rasio Seduh', iconType: 'calc', desc: 'Hitung gramasi kopi & air presisi', action: 'calc' },
      { id: 'tabel-grinder', name: 'Tabel Kalibrasi Klik Grinder', iconType: 'cog', desc: 'Panduan klik gilingan barista', action: 'grinder-chart' },
      { id: 'panduan-resep', name: 'Resep & Panduan Seduh', iconType: 'guide', desc: 'Ekstraksi resmi Slow Bar Sanubari', internalUrl: '/panduan-seduh' },
      { id: 'wholesale-partner', name: 'Kemitraan Kedai (Wholesale)', iconType: 'wholesale', desc: 'Pengadaan bar kopi & supply biji', internalUrl: '/wholesale' }
    ]
  },
  {
    id: 'market-place',
    name: 'Market Place',
    slug: 'market-place',
    allLabel: 'Kunjungi Marketplace Official',
    allUrl: 'https://tokopedia.com',
    isExternal: true,
    subcategories: [
      { id: 'tokopedia', name: 'Tokopedia Official Store', iconType: 'tokopedia', desc: 'Bebas Ongkir & Cicilan Resmi', externalUrl: STORE_INFO.tokopediaStoreUrl },
      { id: 'shopee', name: 'Shopee Official Mall', iconType: 'shopee', desc: 'Voucher diskon & Flash Sale', externalUrl: STORE_INFO.shopeeStoreUrl },
      { id: 'tiktok', name: 'TikTok Shop Sanubari', iconType: 'tiktok', desc: 'Belanja langsung saat Live', externalUrl: 'https://tiktok.com' }
    ]
  },
  {
    id: 'our-social-media',
    name: 'Our Social Media',
    slug: 'our-social-media',
    allLabel: 'Ikuti Komunitas Sanubari',
    allUrl: STORE_INFO.instagram,
    isExternal: true,
    subcategories: [
      { id: 'ig', name: 'Instagram @sanubari.roastery.mlg', iconType: 'instagram', desc: 'Update sangrai mingguan & event', externalUrl: STORE_INFO.instagram },
      { id: 'wa', name: 'WhatsApp Barista Consult', iconType: 'whatsapp', desc: 'Konsultasi gratis alat & biji kopi', externalUrl: `https://wa.me/${STORE_INFO.whatsappNumber}` },
      { id: 'maps', name: 'Slow Bar & Showroom Malang', iconType: 'maps', desc: 'Ruko Tlogomas Square Kav. 34', externalUrl: STORE_INFO.googleMapsUrl }
    ]
  }
];

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
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  
  const navbarRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setMegaMenuOpen(false);
        setUserDropdownOpen(false);
        setNotificationOpen(false);
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
        setUserDropdownOpen(false);
        setNotificationOpen(false);
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
    } else if (sub.externalUrl) {
      window.open(sub.externalUrl, '_blank');
    } else if (sub.targetCategory) {
      onSelectCategory(sub.targetCategory);
    }
    setMegaMenuOpen(false);
  };

  // Helper render circular icon badge persis gambar screenshot
  const renderIconBadge = (type) => {
    switch (type) {
      case 'robusta':
        return (
          <div className="w-12 h-12 rounded-full bg-[#fbf6f0] border border-[#ecdccb] flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
            <svg className="w-6 h-6 text-[#8c5d31]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <ellipse cx="12" cy="12" rx="4.5" ry="7" transform="rotate(25 12 12)" fill="#ecdccb" stroke="#8c5d31"/>
              <path d="M10 8c1 2 3 5 4 8" stroke="#8c5d31" strokeWidth="1.6"/>
              <path d="M4 14c0 3 3 6 8 6s8-3 8-6" stroke="#c2a676" strokeWidth="1.2" strokeDasharray="1 2"/>
            </svg>
          </div>
        );
      case 'arabica':
        return (
          <div className="w-12 h-12 rounded-full bg-[#fbf6f0] border border-[#ecdccb] flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
            <svg className="w-6 h-6 text-[#8c5d31]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="9" stroke="#c2a676" strokeWidth="1.5" strokeDasharray="2 2"/>
              <ellipse cx="12" cy="12" rx="4" ry="7" fill="#ecdccb" stroke="#8c5d31"/>
              <path d="M10.5 7.5c1 2 2 6 3 9" stroke="#8c5d31" strokeWidth="1.6"/>
            </svg>
          </div>
        );
      case 'houseblend':
        return (
          <div className="w-12 h-12 rounded-full bg-[#fbf6f0] border border-[#ecdccb] flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
            <svg className="w-6 h-6 text-[#8c5d31]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M3 10l9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10z" fill="#f4efe9" stroke="#c2a676"/>
              <path d="M9 15h6v6H9z" fill="#8c5d31" stroke="#8c5d31"/>
              <path d="M10 11a2 2 0 1 0 4 0" stroke="#8c5d31"/>
            </svg>
          </div>
        );
      case 'dripper':
        return (
          <div className="w-12 h-12 rounded-full bg-[#fbf6f0] border border-[#ecdccb] flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
            <Coffee className="w-6 h-6 text-[#8c5d31]" />
          </div>
        );
      case 'grinder':
        return (
          <div className="w-12 h-12 rounded-full bg-[#fbf6f0] border border-[#ecdccb] flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
            <Cog className="w-6 h-6 text-[#8c5d31]" />
          </div>
        );
      case 'flair':
        return (
          <div className="w-12 h-12 rounded-full bg-[#fbf6f0] border border-[#ecdccb] flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
            <Flame className="w-6 h-6 text-[#8c5d31]" />
          </div>
        );
      case 'kettle':
        return (
          <div className="w-12 h-12 rounded-full bg-[#fbf6f0] border border-[#ecdccb] flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
            <Coffee className="w-6 h-6 text-[#8c5d31]" />
          </div>
        );
      case 'scale':
        return (
          <div className="w-12 h-12 rounded-full bg-[#fbf6f0] border border-[#ecdccb] flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
            <Timer className="w-6 h-6 text-[#8c5d31]" />
          </div>
        );
      case 'calc':
        return (
          <div className="w-12 h-12 rounded-full bg-[#fbf6f0] border border-[#ecdccb] flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
            <Sparkles className="w-6 h-6 text-[#8c5d31]" />
          </div>
        );
      case 'cog':
        return (
          <div className="w-12 h-12 rounded-full bg-[#fbf6f0] border border-[#ecdccb] flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
            <SlidersHorizontal className="w-6 h-6 text-[#8c5d31]" />
          </div>
        );
      case 'guide':
        return (
          <div className="w-12 h-12 rounded-full bg-[#fbf6f0] border border-[#ecdccb] flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
            <BookOpen className="w-6 h-6 text-[#8c5d31]" />
          </div>
        );
      default:
        return (
          <div className="w-12 h-12 rounded-full bg-[#fbf6f0] border border-[#ecdccb] flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
            <Store className="w-6 h-6 text-[#8c5d31]" />
          </div>
        );
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#182224] border-b border-[#243336] shadow-lg transition-all" ref={navbarRef}>
      
      {/* Top Navbar Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20 gap-3 sm:gap-4">
          
          {/* LEFT: Brand Logo + Name + Kategori Pill */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Brand Logo & Name */}
            <Link 
              to="/" 
              onClick={() => setMegaMenuOpen(false)}
              className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none"
            >
              {/* Circular Sanubari Logo Badge */}
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden bg-[#243336] border border-[#33464a] group-hover:border-[#c2a676] transition-colors shrink-0 flex items-center justify-center shadow-md">
                <img
                  src="/sanubari-logo.png"
                  alt="Sanubari Roastery"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<span class="text-xs font-black text-[#c2a676]">SNB</span>';
                  }}
                />
              </div>

              {/* Brand Typography */}
              <div className="flex flex-col leading-tight">
                <span className="font-extrabold text-base sm:text-lg text-white tracking-tight group-hover:text-[#c2a676] transition-colors font-sans">
                  Sanubari
                </span>
                <span className="text-[11px] sm:text-xs text-[#8f9fa2] font-medium tracking-normal">
                  Roastery Malang
                </span>
              </div>
            </Link>

            {/* Kategori Button dengan Efek Aktif Cokelat Gold & Chevron Up/Down */}
            <button
              onClick={() => setMegaMenuOpen(!megaMenuOpen)}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md ${
                megaMenuOpen
                  ? 'bg-[#946538] text-white shadow-[#946538]/30 scale-[1.02]'
                  : 'bg-[#233033] hover:bg-[#2b3c40] border border-[#2f4044] text-[#f5f5f4]'
              }`}
            >
              {/* 4-square category icon */}
              <LayoutGrid className={`w-4 h-4 ${megaMenuOpen ? 'text-white' : 'text-[#c2a676]'}`} />
              <span className="font-semibold tracking-wide">Kategori</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${megaMenuOpen ? 'rotate-180 text-white' : 'text-[#8f9fa2]'}`} />
            </button>
          </div>

          {/* CENTER: Wide Search Bar */}
          <div className="flex-1 max-w-xl mx-2 sm:mx-6">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Cari biji kopi, varietas, tasting notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#131d1f] border border-[#243336] focus:border-[#384e52] text-xs sm:text-sm text-[#f5f5f4] placeholder-[#6b7c80] rounded-xl py-2.5 sm:py-3 pl-10 sm:pl-11 pr-4 focus:outline-none transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-[#6b7c80] absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#6b7c80] hover:text-white bg-[#243336] px-1.5 py-0.5 rounded"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* RIGHT: Notifications Bell (4) + Cart Bag (2) + User Pill "Winda" */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="relative p-2.5 text-[#a2b2b5] hover:text-white rounded-xl hover:bg-[#233033] transition-colors"
                title="Notifikasi"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 bg-[#e11d48] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                  4
                </span>
              </button>

              {notificationOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-[#1c272a] rounded-2xl border border-[#2f4044] shadow-2xl p-4 z-50 animate-fade-in space-y-3">
                  <div className="flex items-center justify-between border-b border-[#243336] pb-2">
                    <span className="text-xs font-bold text-white">Notifikasi</span>
                    <span className="text-[10px] text-[#c2a676]">4 Baru</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2 rounded-xl bg-[#233033]/60 border border-[#29383c]">
                      <p className="font-semibold text-white">Promo Buka Showroom ☕</p>
                      <p className="text-[11px] text-[#8f9fa2]">Gunakan kupon SANUBARI10 untuk diskon 10%.</p>
                    </div>
                    <div className="p-2 rounded-xl bg-[#233033]/60 border border-[#29383c]">
                      <p className="font-semibold text-white">Paket Baru: Flair 58 Ready!</p>
                      <p className="text-[11px] text-[#8f9fa2]">Unit Flair 58 Lever kini ready stock di Tlogomas.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Shopping Bag */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 text-[#a2b2b5] hover:text-white rounded-xl hover:bg-[#233033] transition-colors"
              title="Keranjang Belanja"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 bg-[#e11d48] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                {cartCount > 0 ? cartCount : 2}
              </span>
            </button>

            {/* User Pill: "Winda" */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-[#233033] hover:bg-[#2b3c40] border border-[#2f4044] text-[#f5f5f4] text-xs sm:text-sm font-semibold transition-all shadow-sm"
              >
                <User className="w-4 h-4 text-[#a2b2b5]" />
                <span className="font-semibold text-white">Winda</span>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-[#1c272a] rounded-2xl border border-[#2f4044] shadow-2xl py-2 z-50 animate-fade-in divide-y divide-[#243336]">
                  <div className="px-4 py-2">
                    <p className="text-xs font-bold text-white">Winda</p>
                    <p className="text-[11px] text-[#8f9fa2]">Member Sanubari Club</p>
                  </div>
                  <div className="py-1 text-xs">
                    <button
                      onClick={() => {
                        navigate('/lacak-pesanan');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-[#dbe3e5] hover:bg-[#233033] hover:text-white flex items-center gap-2"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#c2a676]" />
                      <span>Lacak Pesanan Saya</span>
                    </button>
                    <button
                      onClick={() => {
                        onOpenWishlist();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-[#dbe3e5] hover:bg-[#233033] hover:text-white flex items-center gap-2"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-[#c2a676]" />
                      <span>Wishlist ({wishlistCount})</span>
                    </button>
                  </div>
                  <div className="p-1">
                    <button
                      onClick={() => setUserDropdownOpen(false)}
                      className="w-full text-left px-3 py-1.5 text-[11px] text-[#ef4444] hover:bg-[#233033] rounded-lg flex items-center gap-2"
                    >
                      <LogOut className="w-3 h-3" />
                      <span>Keluar Akun</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* MEGA MENU FLOATING OVERLAY PANEL (Persis Desain Screenshot Sanubari)     */}
      {/* ========================================================================= */}
      {megaMenuOpen && (
        <>
          {/* Subtle Dim Backdrop for Floating / Elevating Effect */}
          <div 
            className="fixed inset-0 top-[72px] sm:top-[80px] bg-black/45 backdrop-blur-[2px] z-40 transition-opacity animate-fade-in"
            onClick={() => setMegaMenuOpen(false)}
          />

          {/* Full-width Floating Panel */}
          <div className="absolute top-full left-0 right-0 z-50 bg-white text-stone-900 border-b border-stone-200 shadow-2xl shadow-black/25 animate-fade-in overflow-hidden">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row min-h-[380px] sm:min-h-[420px]">
              
              {/* LEFT COLUMN: Parent Category List with Chevrons */}
              <div className="w-full md:w-72 bg-[#fafaf9] md:border-r border-stone-200 py-6 px-4 shrink-0">
                <div className="space-y-1.5">
                  {MEGA_MENU_CATEGORIES.map((cat) => {
                    const isActive = activeParentCategoryId === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onMouseEnter={() => setActiveParentCategoryId(cat.id)}
                        onClick={() => setActiveParentCategoryId(cat.id)}
                        className={`w-full text-left px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold flex items-center justify-between transition-all duration-200 ${
                          isActive
                            ? 'bg-stone-200/70 text-[#946538] font-bold shadow-xs'
                            : 'text-stone-700 hover:text-stone-900 hover:bg-stone-100'
                        }`}
                      >
                        <span className="tracking-wide">{cat.name}</span>
                        <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${isActive ? 'text-[#946538] translate-x-1' : 'text-stone-400'}`} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* RIGHT AREA: Subcategories Header & "Efek Melayang" Card Grid */}
              <div className="flex-1 p-6 sm:p-8 bg-white flex flex-col justify-between">
                
                <div>
                  {/* Category Header Row */}
                  <div className="flex items-center justify-between pb-5 border-b border-stone-100 mb-6">
                    <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight font-sans">
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
                        className="text-xs sm:text-sm font-bold text-[#946538] hover:text-[#7a512b] hover:underline flex items-center gap-1 transition-colors"
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
                        className="group p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/90 hover:border-[#946538]/50 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 ease-out cursor-pointer flex items-center gap-3.5 relative"
                      >
                        {/* Circular Emblem Icon */}
                        {renderIconBadge(sub.iconType)}

                        {/* Title & Desc */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-stone-900 group-hover:text-[#946538] transition-colors truncate">
                            {sub.name}
                          </h4>
                          {sub.desc && (
                            <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5 font-normal">
                              {sub.desc}
                            </p>
                          )}
                        </div>

                        {/* Subtle Chevron indicator on hover */}
                        <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-[#946538] group-hover:translate-x-1 transition-all opacity-0 group-hover:opacity-100 shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Helpful Micro Bar */}
                <div className="pt-6 mt-6 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>Showroom &amp; Slow Bar Sanubari Tlogomas Buka Setiap Hari (09.00 - 23.00 WIB)</span>
                  </div>
                  <span className="text-[11px] text-stone-400">Tekan ESC untuk menutup menu</span>
                </div>

              </div>

            </div>
          </div>
        </>
      )}

    </header>
  );
}
