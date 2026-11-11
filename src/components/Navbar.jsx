import React, { useState } from 'react';
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  Menu, 
  X, 
  PhoneCall, 
  MapPin, 
  Coffee, 
  Sparkles,
  SlidersHorizontal
} from 'lucide-react';
import { STORE_INFO } from '../data/products';

export default function Navbar({ 
  cartCount, 
  wishlistCount, 
  onOpenCart, 
  onOpenWishlist, 
  searchQuery, 
  setSearchQuery,
  selectedCategory,
  onSelectCategory,
  onScrollToCalculator,
  onScrollToShowroom,
  onOpenGrinderChart
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#141211]/95 backdrop-blur-md border-b border-[#292524] transition-all">
      {/* Top Announcement Bar */}
      <div className="bg-[#1c1917] border-b border-[#292524]/60 text-xs text-[#a8a29e] py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#c2a676] animate-pulse"></span>
            <p>
              <strong className="text-[#f5f5f4] font-medium">Showroom &amp; Slow Bar:</strong> Ruko Tlogomas Square Kav. 34 Malang | Buka 09.00 - 23.00 WIB
            </p>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-[#c2a676] font-medium">Gratis Ongkir se-Jawa min. Rp 500rb</span>
            <span className="hidden md:inline text-[#57534e]">|</span>
            <a 
              href={`https://wa.me/${STORE_INFO.whatsappNumber}?text=Halo%20Alat%20Kopi%20Malang,%20saya%20ingin%20konsultasi%20alat%20kopi`}
              target="_blank" 
              rel="noreferrer"
              className="hidden md:flex items-center gap-1 hover:text-[#c2a676] transition-colors"
            >
              <PhoneCall className="w-3 h-3 text-[#c2a676]" />
              <span>Konsultasi Barista</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onSelectCategory('all')} 
              className="text-left group flex items-center gap-3 focus:outline-none"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#292524] to-[#1c1917] border border-[#c2a676]/30 flex items-center justify-center shadow-lg group-hover:border-[#c2a676] transition-colors">
                <Coffee className="w-6 h-6 text-[#c2a676]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold tracking-wider text-xl sm:text-2xl text-[#f5f5f4] uppercase">
                    ALAT KOPI MALANG
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] tracking-widest uppercase text-[#c2a676] font-semibold">
                  <span>Part of Sanubari Roastery</span>
                  <span className="text-[#78716c]">•</span>
                  <span className="text-[#a8a29e]">Malang</span>
                </div>
              </div>
            </button>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Cari grinder, dripper V60, kettle, scale..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1c1917] border border-[#292524] focus:border-[#c2a676] text-sm text-[#f5f5f4] placeholder-[#78716c] rounded-full py-2.5 pl-11 pr-4 transition-all focus:outline-none focus:ring-1 focus:ring-[#c2a676]"
              />
              <Search className="w-4 h-4 text-[#78716c] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#78716c] hover:text-[#f5f5f4] bg-[#292524] px-1.5 py-0.5 rounded"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Navigation Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="lg:hidden p-2 text-[#a8a29e] hover:text-[#f5f5f4] rounded-lg hover:bg-[#1c1917] transition-colors"
              title="Cari Produk"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Quick Action: Grinder Chart & Brew Ratio Tool */}
            <button
              onClick={onOpenGrinderChart}
              className="hidden lg:flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full bg-[#1c1917] hover:bg-[#292524] text-[#a8a29e] hover:text-[#f5f5f4] border border-[#292524] transition-all"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#c2a676]" />
              <span>Tabel Klik Grinder</span>
            </button>

            <button
              onClick={onScrollToCalculator}
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-full bg-[#292524]/70 hover:bg-[#292524] text-[#c2a676] border border-[#c2a676]/20 hover:border-[#c2a676] transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Kalkulator Rasio</span>
            </button>

            {/* Wishlist Button */}
            <button
              onClick={onOpenWishlist}
              className="relative p-2.5 text-[#a8a29e] hover:text-[#f5f5f4] rounded-xl hover:bg-[#1c1917] border border-transparent hover:border-[#292524] transition-colors"
              title="Daftar Keinginan"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#ef4444] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#c2a676] to-[#b45309] text-[#141211] font-bold hover:brightness-110 active:scale-95 transition-all shadow-md shadow-[#c2a676]/20"
              title="Keranjang Belanja"
            >
              <ShoppingBag className="w-5 h-5 text-[#141211]" />
              <span className="hidden sm:inline text-xs uppercase tracking-wider">Keranjang</span>
              <span className="bg-[#141211] text-[#c2a676] text-xs font-extrabold px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
            </button>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#a8a29e] hover:text-[#f5f5f4] rounded-lg hover:bg-[#1c1917]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Input Bar */}
        {searchOpen && (
          <div className="lg:hidden pb-4 pt-1">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Cari grinder, V60, kettle, scale..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full bg-[#1c1917] border border-[#292524] focus:border-[#c2a676] text-sm text-[#f5f5f4] placeholder-[#78716c] rounded-full py-2.5 pl-10 pr-4 focus:outline-none"
              />
              <Search className="w-4 h-4 text-[#78716c] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        )}

        {/* Navigation Link Categories (Desktop) */}
        <nav className="hidden md:flex items-center gap-1 py-2.5 border-t border-[#292524]/60 text-xs font-medium text-[#a8a29e] overflow-x-auto no-scrollbar">
          <button
            onClick={() => onSelectCategory('all')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-[#c2a676]/20 text-[#c2a676] font-semibold border border-[#c2a676]/30'
                : 'hover:text-[#f5f5f4] hover:bg-[#1c1917]'
            }`}
          >
            Koleksi Lengkap
          </button>
          <button
            onClick={() => onSelectCategory('manual-brew')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              selectedCategory === 'manual-brew'
                ? 'bg-[#c2a676]/20 text-[#c2a676] font-semibold border border-[#c2a676]/30'
                : 'hover:text-[#f5f5f4] hover:bg-[#1c1917]'
            }`}
          >
            Manual Brew &amp; Dripper
          </button>
          <button
            onClick={() => onSelectCategory('grinder')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              selectedCategory === 'grinder'
                ? 'bg-[#c2a676]/20 text-[#c2a676] font-semibold border border-[#c2a676]/30'
                : 'hover:text-[#f5f5f4] hover:bg-[#1c1917]'
            }`}
          >
            Hand Grinder Presisi
          </button>
          <button
            onClick={() => onSelectCategory('espresso-tools')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              selectedCategory === 'espresso-tools'
                ? 'bg-[#c2a676]/20 text-[#c2a676] font-semibold border border-[#c2a676]/30'
                : 'hover:text-[#f5f5f4] hover:bg-[#1c1917]'
            }`}
          >
            Espresso &amp; Lever
          </button>
          <button
            onClick={() => onSelectCategory('kettle')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              selectedCategory === 'kettle'
                ? 'bg-[#c2a676]/20 text-[#c2a676] font-semibold border border-[#c2a676]/30'
                : 'hover:text-[#f5f5f4] hover:bg-[#1c1917]'
            }`}
          >
            Kettle Gooseneck
          </button>
          <button
            onClick={() => onSelectCategory('scale')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              selectedCategory === 'scale'
                ? 'bg-[#c2a676]/20 text-[#c2a676] font-semibold border border-[#c2a676]/30'
                : 'hover:text-[#f5f5f4] hover:bg-[#1c1917]'
            }`}
          >
            Timbangan Kopi Digital
          </button>
          <button
            onClick={() => onSelectCategory('bundles')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              selectedCategory === 'bundles'
                ? 'bg-[#c2a676]/20 text-[#c2a676] font-semibold border border-[#c2a676]/30'
                : 'hover:text-[#f5f5f4] hover:bg-[#1c1917]'
            }`}
          >
            Paket Starter Kit
          </button>
          <div className="ml-auto flex items-center gap-2 pl-4">
            <button
              onClick={onScrollToShowroom}
              className="flex items-center gap-1.5 text-xs text-[#a8a29e] hover:text-[#c2a676] whitespace-nowrap transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-[#c2a676]" />
              <span>Lokasi Showroom Malang</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#1c1917] border-b border-[#292524] px-4 py-4 space-y-2 animate-fade-in">
          <p className="text-xs uppercase font-bold tracking-wider text-[#78716c] px-2 mb-2">Kategori Alat</p>
          <button
            onClick={() => { onSelectCategory('all'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 text-sm text-[#f5f5f4] hover:bg-[#292524] rounded-lg"
          >
            Semua Produk Alat Kopi
          </button>
          <button
            onClick={() => { onSelectCategory('manual-brew'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 text-sm text-[#f5f5f4] hover:bg-[#292524] rounded-lg"
          >
            Manual Brew &amp; Dripper
          </button>
          <button
            onClick={() => { onSelectCategory('grinder'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 text-sm text-[#f5f5f4] hover:bg-[#292524] rounded-lg"
          >
            Hand Grinder Presisi
          </button>
          <button
            onClick={() => { onSelectCategory('espresso-tools'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 text-sm text-[#f5f5f4] hover:bg-[#292524] rounded-lg"
          >
            Espresso &amp; Lever Tools
          </button>
          <button
            onClick={() => { onSelectCategory('kettle'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 text-sm text-[#f5f5f4] hover:bg-[#292524] rounded-lg"
          >
            Kettle Gooseneck
          </button>
          <button
            onClick={() => { onSelectCategory('scale'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 text-sm text-[#f5f5f4] hover:bg-[#292524] rounded-lg"
          >
            Scale &amp; Timer Digital
          </button>
          <button
            onClick={() => { onSelectCategory('bundles'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 text-sm text-[#f5f5f4] hover:bg-[#292524] rounded-lg"
          >
            Paket Starter Kit Barista
          </button>
          <div className="pt-2 border-t border-[#292524] space-y-2">
            <button
              onClick={() => { onScrollToCalculator(); setMobileMenuOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#c2a676] bg-[#292524]/60 rounded-lg"
            >
              <Sparkles className="w-4 h-4" />
              <span>Kalkulator Rasio Seduh</span>
            </button>
            <button
              onClick={() => { onScrollToShowroom(); setMobileMenuOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#f5f5f4] hover:bg-[#292524] rounded-lg"
            >
              <MapPin className="w-4 h-4 text-[#c2a676]" />
              <span>Kunjungi Showroom Tlogomas Square</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

