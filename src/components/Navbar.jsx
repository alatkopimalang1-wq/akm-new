import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  ShoppingBag, 
  Bell, 
  User, 
  ChevronDown, 
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
  LogOut
} from 'lucide-react';
import { CATEGORIES, STORE_INFO } from '../data/products';

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
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setCategoryDropdownOpen(false);
        setUserDropdownOpen(false);
        setNotificationOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCategoryClick = (catId) => {
    onSelectCategory(catId);
    setCategoryDropdownOpen(false);
  };

  const getCategoryIcon = (id) => {
    switch (id) {
      case 'manual-brew': return <Coffee className="w-4 h-4 text-[#c2a676]" />;
      case 'grinder': return <Cog className="w-4 h-4 text-[#c2a676]" />;
      case 'espresso-tools': return <Flame className="w-4 h-4 text-[#c2a676]" />;
      case 'scale': return <Timer className="w-4 h-4 text-[#c2a676]" />;
      case 'bundles': return <PackageCheck className="w-4 h-4 text-[#c2a676]" />;
      default: return <Coffee className="w-4 h-4 text-[#c2a676]" />;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#182224] border-b border-[#243336] shadow-lg transition-all" ref={dropdownRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20 gap-3 sm:gap-4">
          
          {/* LEFT: Brand Logo + Name + Kategori Pill */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Brand Logo & Name */}
            <Link 
              to="/" 
              className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none"
            >
              {/* Circular Sanubari Logo Badge */}
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden bg-[#243336] border border-[#33464a] group-hover:border-[#c2a676] transition-colors shrink-0 flex items-center justify-center shadow-md">
                <img
                  src="/sanubari-logo.png"
                  alt="Sanubari Roastery"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback if image fails
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

            {/* Kategori Dropdown Pill Button */}
            <div className="relative">
              <button
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border ${
                  categoryDropdownOpen
                    ? 'bg-[#28383c] border-[#c2a676] text-white'
                    : 'bg-[#233033] hover:bg-[#2b3c40] border-[#2f4044] text-[#f5f5f4]'
                }`}
              >
                {/* 4-square category icon matching user image */}
                <LayoutGrid className="w-4 h-4 text-[#c2a676]" />
                <span className="font-medium">Kategori</span>
                <ChevronDown className={`w-3.5 h-3.5 text-[#8f9fa2] transition-transform duration-200 ${categoryDropdownOpen ? 'rotate-180 text-[#c2a676]' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {categoryDropdownOpen && (
                <div className="absolute left-0 top-full mt-2 w-80 bg-[#1c272a] rounded-2xl border border-[#2f4044] shadow-2xl p-3 z-50 animate-fade-in divide-y divide-[#243336]">
                  <div className="pb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#788a8d] block px-2 mb-1.5">
                      Koleksi Perlengkapan Kopi
                    </span>
                    <div className="grid grid-cols-1 gap-1">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => handleCategoryClick(cat.id)}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                            selectedCategory === cat.id
                              ? 'bg-[#28383c] text-[#c2a676] font-bold border border-[#c2a676]/30'
                              : 'text-[#dbe3e5] hover:bg-[#233033] hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            {getCategoryIcon(cat.id)}
                            <span>{cat.name}</span>
                          </div>
                          <span className="text-[10px] text-[#788a8d] bg-[#141d1f] px-2 py-0.5 rounded-full">{cat.count}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 space-y-1">
                    <button
                      onClick={() => {
                        onOpenGrinderChart();
                        setCategoryDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-[#c2a676] hover:bg-[#233033] rounded-xl flex items-center gap-2 transition-colors"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      <span>Tabel Kalibrasi Klik Grinder</span>
                    </button>
                    <Link
                      to="/panduan-seduh"
                      onClick={() => setCategoryDropdownOpen(false)}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-[#dbe3e5] hover:text-white hover:bg-[#233033] rounded-xl flex items-center gap-2 transition-colors"
                    >
                      <Coffee className="w-3.5 h-3.5 text-[#c2a676]" />
                      <span>Resep &amp; Panduan Seduh Sanubari</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* CENTER: Wide Search Bar with matching placeholder */}
          <div className="flex-1 max-w-xl mx-2 sm:mx-6">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Cari biji kopi, varietas, tasting notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#131d1f] border border-[#243336] focus:border-[#384e52] text-xs sm:text-sm text-[#f5f5f4] placeholder-[#6b7c80] rounded-xl py-2.5 sm:py-3 pl-10 sm:pl-11 pr-4 focus:outline-none transition-all"
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

          {/* RIGHT: Notifications (Bell with 4) + Cart Bag (with 2) + User Pill "Winda" */}
          <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
            
            {/* Notification Bell Icon with Red Counter Badge */}
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

              {/* Notification Popover */}
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

            {/* Shopping Bag Icon with Red Counter Badge */}
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

            {/* User Pill Button: "Winda" */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-[#233033] hover:bg-[#2b3c40] border border-[#2f4044] text-[#f5f5f4] text-xs sm:text-sm font-semibold transition-all shadow-sm"
              >
                <User className="w-4 h-4 text-[#a2b2b5]" />
                <span className="font-semibold text-white">Winda</span>
              </button>

              {/* User Dropdown */}
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
    </header>
  );
}
