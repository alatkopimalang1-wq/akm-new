import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  LayoutGrid, 
  ShoppingBag, 
  User, 
  X, 
  ChevronRight, 
  FileText, 
  Heart, 
  Award, 
  BookOpen, 
  PhoneCall,
  Coffee,
  Sparkles
} from 'lucide-react';
import { CATEGORIES, OFFICIAL_BRANDS_DATA, STORE_INFO } from '../data/products';

export default function MobileBottomNav({ 
  cartCount = 0, 
  wishlistCount = 0, 
  onOpenCart, 
  onOpenWishlist 
}) {
  const location = useLocation();
  const navigate = useNavigate();

  const [categorySheetOpen, setCategorySheetOpen] = useState(false);
  const [accountSheetOpen, setAccountSheetOpen] = useState(false);

  // Check active state
  const isHomeActive = location.pathname === '/' && !categorySheetOpen && !accountSheetOpen;
  const isCategoryActive = (location.pathname.startsWith('/kategori') || categorySheetOpen) && !accountSheetOpen;
  const isAccountActive = accountSheetOpen;

  // Colors matching user screenshot: active is warm coffee/bronze (#8B5A2B), inactive is slate (#596b82)
  const activeColor = '#8B5A2B';
  const inactiveColor = '#596b82';

  const handleHomeClick = () => {
    setCategorySheetOpen(false);
    setAccountSheetOpen(false);
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  const handleCategoryClick = () => {
    setAccountSheetOpen(false);
    setCategorySheetOpen(!categorySheetOpen);
  };

  const handleCartClick = () => {
    setCategorySheetOpen(false);
    setAccountSheetOpen(false);
    if (onOpenCart) onOpenCart();
  };

  const handleAccountClick = () => {
    setCategorySheetOpen(false);
    setAccountSheetOpen(!accountSheetOpen);
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* FIXED MOBILE BOTTOM NAVIGATION BAR (md:hidden, constrained to mobile width) */}
      {/* ========================================================================= */}
      <div className="fixed bottom-0 inset-x-0 z-40 md:hidden flex justify-center pointer-events-none">
        <nav 
          className="w-full max-w-md sm:max-w-lg bg-white border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pointer-events-auto select-none pb-[max(env(safe-area-inset-bottom,0px),0.25rem)]"
          aria-label="Mobile Navigation"
        >
          <div className="grid grid-cols-4 items-center h-16 px-1">
            
            {/* TAB 1: HOME */}
            <button
              onClick={handleHomeClick}
              className="flex flex-col items-center justify-center gap-1 py-1 focus:outline-none transition-transform active:scale-95 cursor-pointer"
              style={{ color: isHomeActive ? activeColor : inactiveColor }}
            >
              <div className="relative">
                <Home 
                  className="w-5 h-5 sm:w-6 sm:h-6 transition-colors" 
                  strokeWidth={isHomeActive ? 2.3 : 1.8} 
                />
              </div>
              <span 
                className={`text-[11px] leading-none transition-colors ${
                  isHomeActive ? 'font-bold' : 'font-medium'
                }`}
              >
                Home
              </span>
            </button>

            {/* TAB 2: KATEGORI */}
            <button
              onClick={handleCategoryClick}
              className="flex flex-col items-center justify-center gap-1 py-1 focus:outline-none transition-transform active:scale-95 cursor-pointer"
              style={{ color: isCategoryActive ? activeColor : inactiveColor }}
            >
              <div className="relative">
                <LayoutGrid 
                  className="w-5 h-5 sm:w-6 sm:h-6 transition-colors" 
                  strokeWidth={isCategoryActive ? 2.3 : 1.8} 
                />
              </div>
              <span 
                className={`text-[11px] leading-none transition-colors ${
                  isCategoryActive ? 'font-bold' : 'font-medium'
                }`}
              >
                Kategori
              </span>
            </button>

            {/* TAB 3: KERANJANG */}
            <button
              onClick={handleCartClick}
              className="flex flex-col items-center justify-center gap-1 py-1 focus:outline-none transition-transform active:scale-95 cursor-pointer relative"
              style={{ color: inactiveColor }}
            >
              <div className="relative">
                <ShoppingBag 
                  className="w-5 h-5 sm:w-6 sm:h-6 transition-colors" 
                  strokeWidth={1.8} 
                />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 px-1.5 py-0.5 min-w-[18px] text-[10px] font-black leading-none bg-[#ef4444] text-white rounded-full flex items-center justify-center shadow-xs animate-scale-in">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-medium leading-none transition-colors">
                Keranjang
              </span>
            </button>

            {/* TAB 4: WINDA (PROFIL / AKUN) */}
            <button
              onClick={handleAccountClick}
              className="flex flex-col items-center justify-center gap-1 py-1 focus:outline-none transition-transform active:scale-95 cursor-pointer"
              style={{ color: isAccountActive ? activeColor : inactiveColor }}
            >
              <div className="relative">
                <User 
                  className="w-5 h-5 sm:w-6 sm:h-6 transition-colors" 
                  strokeWidth={isAccountActive ? 2.3 : 1.8} 
                />
              </div>
              <span 
                className={`text-[11px] leading-none transition-colors ${
                  isAccountActive ? 'font-bold' : 'font-medium'
                }`}
              >
                Winda
              </span>
            </button>

          </div>
        </nav>
      </div>

      {/* ========================================================================= */}
      {/* MOBILE CATEGORY BOTTOM SHEET MODAL */}
      {/* ========================================================================= */}
      {categorySheetOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 md:hidden animate-fade-in"
            onClick={() => setCategorySheetOpen(false)}
          />

          <div className="fixed bottom-0 inset-x-0 z-50 flex justify-center pointer-events-none md:hidden">
            <div className="w-full max-w-md sm:max-w-lg bg-white rounded-t-3xl shadow-2xl max-h-[80vh] flex flex-col pointer-events-auto pb-6 animate-slide-up">
              
              {/* Sheet Handle & Header */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Kategori Pilihan</h3>
                  <p className="text-xs text-slate-500">Pilih kategori alat seduh atau biji kopi</p>
                </div>
                <button 
                  onClick={() => setCategorySheetOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Category Items List */}
              <div className="overflow-y-auto p-4 space-y-2 no-scrollbar">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      navigate(`/kategori/${cat.id}`);
                      setCategorySheetOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50 text-left transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[#8B5A2B] group-hover:text-[#0070f3] group-hover:border-[#0070f3]/40 shadow-2xs">
                        <Coffee className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 group-hover:text-[#0070f3]">{cat.name}</p>
                        <p className="text-[10px] text-slate-500 line-clamp-1">{cat.tagline || `${cat.count} Produk`}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#0070f3] group-hover:translate-x-0.5 transition-transform" />
                  </button>
                ))}

                {/* Shortcut to Brand Collection */}
                <button
                  onClick={() => {
                    navigate('/brands');
                    setCategorySheetOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-amber-50/70 hover:bg-amber-100/70 text-left transition-all group mt-2 border border-amber-200/60"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white border border-amber-300 flex items-center justify-center text-[#8B5A2B] shadow-2xs">
                      <Award className="w-4 h-4 text-[#8B5A2B]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#8B5A2B]">Koleksi Brand Pilihan</p>
                      <p className="text-[10px] text-amber-700/80">15+ Brand Partner Resmi Terverifikasi</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#8B5A2B] group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

            </div>
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* MOBILE ACCOUNT SHEET MODAL (WINDA) */}
      {/* ========================================================================= */}
      {accountSheetOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 md:hidden animate-fade-in"
            onClick={() => setAccountSheetOpen(false)}
          />

          <div className="fixed bottom-0 inset-x-0 z-50 flex justify-center pointer-events-none md:hidden">
            <div className="w-full max-w-md sm:max-w-lg bg-white rounded-t-3xl shadow-2xl flex flex-col pointer-events-auto pb-6 animate-slide-up">
              
              {/* User Profile Header */}
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 rounded-t-3xl">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-full bg-[#0b1e36] text-white flex items-center justify-center font-bold text-lg shadow-sm border-2 border-white">
                    W
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900 leading-tight">Winda</h4>
                    <p className="text-xs text-[#8B5A2B] font-semibold mt-0.5">Member Sanubari Club</p>
                  </div>
                </div>

                <button 
                  onClick={() => setAccountSheetOpen(false)}
                  className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-600 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Menu Options */}
              <div className="p-4 space-y-2">
                <button
                  onClick={() => {
                    navigate('/lacak-pesanan');
                    setAccountSheetOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-left transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-[#0070f3]" />
                    <span className="text-xs font-bold text-slate-800">Lacak Pesanan Saya</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  onClick={() => {
                    setAccountSheetOpen(false);
                    if (onOpenWishlist) onOpenWishlist();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-left transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Heart className="w-4 h-4 text-rose-500" />
                    <span className="text-xs font-bold text-slate-800">Wishlist Saya</span>
                  </div>
                  <span className="text-xs font-bold text-slate-400">{wishlistCount} item</span>
                </button>

                <button
                  onClick={() => {
                    navigate('/panduan-seduh');
                    setAccountSheetOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-left transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-bold text-slate-800">Panduan & Resep Seduh</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  onClick={() => {
                    window.open(`https://wa.me/${STORE_INFO.whatsapp}?text=Halo%20Sanubari%20x%20Alat%20Kopi%20Malang%2C%20saya%20Winda%20ingin%20konsultasi%20alat%20kopi`, '_blank');
                    setAccountSheetOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-left transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <PhoneCall className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-slate-800">Konsultasi via WhatsApp</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>

            </div>
          </div>
        </>
      )}
    </>
  );
}
