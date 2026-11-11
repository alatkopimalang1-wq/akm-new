import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Coffee, 
  MapPin, 
  Clock, 
  PhoneCall, 
  ExternalLink,
  ShieldCheck,
  ShoppingBag
} from 'lucide-react';
import { STORE_INFO } from '../data/products';

export default function Footer({ onSelectCategory, onScrollToCalculator, onScrollToShowroom }) {
  return (
    <footer className="bg-[#0b1e36] text-slate-300 border-t border-[#183459] text-xs">
      
      {/* Top Value Banner (Deep Sapphire Blue) */}
      <div className="border-b border-[#183459] py-8 bg-[#071426]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0e274b] border border-[#1e4274] flex items-center justify-center shrink-0 shadow-sm">
              <ShieldCheck className="w-5 h-5 text-[#38bdf8]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Garansi Resmi Distributor</h4>
              <p className="text-[11px] text-slate-400">Semua alat dijamin 100% original bergaransi resmi.</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0e274b] border border-[#1e4274] flex items-center justify-center shrink-0 shadow-sm">
              <Coffee className="w-5 h-5 text-[#38bdf8]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Uji Coba di Slow Bar Malang</h4>
              <p className="text-[11px] text-slate-400">Test drive grinder &amp; espresso lever langsung sebelum membeli.</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0e274b] border border-[#1e4274] flex items-center justify-center shrink-0 shadow-sm">
              <ShoppingBag className="w-5 h-5 text-[#38bdf8]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Gratis Ongkir se-Jawa</h4>
              <p className="text-[11px] text-slate-400">Untuk pesanan alat kopi dan bundle di atas Rp 500.000.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0e274b] border border-[#1e4274] flex items-center justify-center shadow-sm">
                <Coffee className="w-5 h-5 text-[#38bdf8]" />
              </div>
              <div>
                <span className="font-extrabold text-lg text-white tracking-wide block uppercase">
                  Alat Kopi Malang
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[#38bdf8] font-bold">
                  Partner of Sanubari Roastery
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Didirikan di Malang sebagai wujud dedikasi kami dalam menghadirkan pengalaman kopi terbaik. Menyediakan peralatan seduh kopi specialty bermutu tinggi, presisi, dan teruji langsung di meja seduh Sanubari Roastery.
            </p>

            <div className="p-3.5 rounded-xl bg-[#0e274b] border border-[#1e4274] space-y-1 shadow-sm">
              <p className="text-[11px] font-bold text-[#38bdf8]">Roastery &amp; Showroom:</p>
              <p className="text-xs text-white font-semibold">Sanubari x Alat Kopi Malang</p>
              <p className="text-[11px] text-slate-300">{STORE_INFO.address}</p>
            </div>
          </div>

          {/* Column 2: Categories */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
              Kategori Perlengkapan
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/kategori/manual-brew" className="hover:text-[#38bdf8] transition-colors block text-slate-300">
                  Manual Brew (V60, Origami, Aeropress)
                </Link>
              </li>
              <li>
                <Link to="/kategori/grinder" className="hover:text-[#38bdf8] transition-colors block text-slate-300">
                  Hand Grinder Presisi (Timemore, Kingrinder)
                </Link>
              </li>
              <li>
                <Link to="/kategori/espresso-tools" className="hover:text-[#38bdf8] transition-colors block text-slate-300">
                  Espresso Manual &amp; Lever (Flair 58, WDT)
                </Link>
              </li>
              <li>
                <Link to="/kategori/kettle" className="hover:text-[#38bdf8] transition-colors block text-slate-300">
                  Electric Kettle Gooseneck (Fellow, Timemore)
                </Link>
              </li>
              <li>
                <Link to="/kategori/scale" className="hover:text-[#38bdf8] transition-colors block text-slate-300">
                  Timbangan Digital Smart Flow-Rate
                </Link>
              </li>
              <li>
                <Link to="/kategori/bundles" className="hover:text-[#38bdf8] transition-colors block text-slate-300">
                  Paket Hemat Starter Kit Home Barista
                </Link>
              </li>
              <li>
                <Link to="/kategori/filter-beans" className="hover:text-[#38bdf8] transition-colors block text-slate-300">
                  Filter Roast Coffee Beans
                </Link>
              </li>
              <li>
                <Link to="/kategori/espresso-beans" className="hover:text-[#38bdf8] transition-colors block text-slate-300">
                  Espresso Roast Coffee Beans
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Features & Support */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
              Fitur &amp; Layanan
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={onScrollToCalculator} className="hover:text-[#38bdf8] transition-colors text-slate-300 text-left">
                  Kalkulator Rasio Seduh
                </button>
              </li>
              <li>
                <button onClick={onScrollToShowroom} className="hover:text-[#38bdf8] transition-colors text-slate-300 text-left">
                  Test-Drive di Showroom
                </button>
              </li>
              <li>
                <a 
                  href="https://sanubariroastery.co.id" 
                  target="_blank" 
                  rel="noreferrer"
                  className="hover:text-[#38bdf8] transition-colors flex items-center gap-1 text-slate-300"
                >
                  <span>Biji Kopi Sanubari</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
              <li>
                <Link 
                  to="/wholesale"
                  className="hover:text-[#38bdf8] transition-colors block text-slate-300"
                >
                  Pengadaan Alat Kedai (B2B)
                </Link>
              </li>
              <li>
                <Link 
                  to="/panduan-seduh"
                  className="hover:text-[#38bdf8] transition-colors block text-slate-300"
                >
                  Panduan &amp; Resep Seduh
                </Link>
              </li>
              <li>
                <Link 
                  to="/lacak-pesanan"
                  className="hover:text-[#38bdf8] transition-colors block text-slate-300"
                >
                  Lacak Pesanan Online
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Operational Hours */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
              Jam Buka &amp; Kontak
            </h4>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#38bdf8]" />
                <span>{STORE_INFO.operationalHours}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#38bdf8]" />
                <span>Kota Malang, Jawa Timur</span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-[#38bdf8]" />
                <span>{STORE_INFO.whatsappDisplay}</span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={`https://wa.me/${STORE_INFO.whatsappNumber}?text=Halo%20Alat%20Kopi%20Malang%20x%20Sanubari!%20Saya%20ingin%20bertanya%20produk`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0070f3] to-[#0052cc] hover:brightness-110 text-xs font-bold text-white border border-[#0070f3]/40 transition-all shadow-md shadow-[#0070f3]/25"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Konsultasi via WhatsApp</span>
              </a>
            </div>

            <div className="pt-2">
              <p className="text-[11px] font-bold text-white mb-2">Ikuti Update &amp; Tutorial Seduh:</p>
              <div className="flex items-center gap-3">
                <a
                  href={STORE_INFO.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg bg-[#0e274b] hover:bg-[#153460] text-slate-300 hover:text-[#38bdf8] border border-[#1e4274] transition-colors shadow-sm"
                  title="Instagram"
                >
                  <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                  </svg>
                </a>
                <a
                  href={STORE_INFO.tokopediaStoreUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 text-[11px] font-semibold text-emerald-400 border border-emerald-800/80"
                >
                  Tokopedia
                </a>
                <a
                  href={STORE_INFO.shopeeStoreUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1.5 rounded-lg bg-orange-950/60 hover:bg-orange-900/60 text-[11px] font-semibold text-orange-400 border border-orange-800/80"
                >
                  Shopee
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright & Legal Links */}
        <div className="mt-12 pt-8 border-t border-[#183459] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>
            © {new Date().getFullYear()} Alat Kopi Malang. Bagian dari ekosistem Sanubari Roastery. Hak Cipta Dilindungi.
          </p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-200 cursor-pointer">Kebijakan Privasi</span>
            <span>•</span>
            <span className="hover:text-slate-200 cursor-pointer">Syarat &amp; Ketentuan</span>
            <span>•</span>
            <span className="hover:text-slate-200 cursor-pointer">Kebijakan Garansi &amp; Retur</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
