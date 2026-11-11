import React from 'react';
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
    <footer className="bg-[#050a14] text-[#94a3b8] border-t border-[#13233a] text-xs">
      
      {/* Top Value Banner */}
      <div className="border-b border-[#13233a] py-8 bg-[#08101d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0070f3]/15 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#38bdf8]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Garansi Resmi Distributor</h4>
              <p className="text-[11px] text-[#64748b]">Semua alat dijamin 100% original bergaransi resmi.</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0070f3]/15 flex items-center justify-center shrink-0">
              <Coffee className="w-5 h-5 text-[#38bdf8]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Uji Coba di Slow Bar Malang</h4>
              <p className="text-[11px] text-[#64748b]">Test drive grinder &amp; espresso lever langsung sebelum membeli.</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0070f3]/15 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-5 h-5 text-[#38bdf8]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Gratis Ongkir se-Jawa</h4>
              <p className="text-[11px] text-[#64748b]">Untuk pesanan alat kopi dan bundle di atas Rp 500.000.</p>
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
              <div className="w-10 h-10 rounded-xl bg-[#10223b] border border-[#1e3a5f] flex items-center justify-center shadow-md">
                <Coffee className="w-5 h-5 text-[#38bdf8]" />
              </div>
              <div>
                <span className="font-extrabold text-lg text-white tracking-wide block uppercase">
                  Alat Kopi Malang
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[#38bdf8] font-semibold">
                  Partner of Sanubari Roastery
                </span>
              </div>
            </div>

            <p className="text-xs text-[#94a3b8] leading-relaxed">
              Didirikan di Malang sebagai wujud dedikasi kami dalam menghadirkan pengalaman kopi terbaik. Menyediakan peralatan seduh kopi specialty bermutu tinggi, presisi, dan teruji langsung di meja seduh Sanubari Roastery.
            </p>

            <div className="p-3.5 rounded-xl bg-[#091322] border border-[#172b47] space-y-1">
              <p className="text-[11px] font-bold text-[#38bdf8]">Roastery &amp; Showroom:</p>
              <p className="text-xs text-white font-medium">Sanubari x Alat Kopi Malang</p>
              <p className="text-[11px] text-[#64748b]">{STORE_INFO.address}</p>
            </div>
          </div>

          {/* Column 2: Categories */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
              Kategori Perlengkapan
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onSelectCategory('manual-brew')} className="hover:text-[#38bdf8] transition-colors">
                  Manual Brew (V60, Origami, Aeropress)
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('grinder')} className="hover:text-[#38bdf8] transition-colors">
                  Hand Grinder Presisi (Timemore, Kingrinder)
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('espresso-tools')} className="hover:text-[#38bdf8] transition-colors">
                  Espresso Manual &amp; Lever (Flair 58, WDT)
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('kettle')} className="hover:text-[#38bdf8] transition-colors">
                  Electric Kettle Gooseneck (Fellow, Timemore)
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('scale')} className="hover:text-[#38bdf8] transition-colors">
                  Timbangan Digital Smart Flow-Rate
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('bundles')} className="hover:text-[#38bdf8] transition-colors">
                  Paket Hemat Starter Kit Home Barista
                </button>
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
                <button onClick={onScrollToCalculator} className="hover:text-[#38bdf8] transition-colors">
                  Kalkulator Rasio Seduh
                </button>
              </li>
              <li>
                <button onClick={onScrollToShowroom} className="hover:text-[#38bdf8] transition-colors">
                  Test-Drive di Showroom
                </button>
              </li>
              <li>
                <a 
                  href="https://sanubariroastery.co.id" 
                  target="_blank" 
                  rel="noreferrer"
                  className="hover:text-[#38bdf8] transition-colors flex items-center gap-1"
                >
                  <span>Biji Kopi Sanubari</span>
                  <ExternalLink className="w-3 h-3 text-[#64748b]" />
                </a>
              </li>
              <li>
                <a 
                  href={`https://wa.me/${STORE_INFO.whatsappNumber}?text=Halo%20saya%20tertarik%20kemitraan%20pengadaan%20alat%20kopi%20untuk%20kedai`}
                  target="_blank" 
                  rel="noreferrer"
                  className="hover:text-[#38bdf8] transition-colors"
                >
                  Pengadaan Alat Kedai
                </a>
              </li>
              <li>
                <a 
                  href={`https://wa.me/${STORE_INFO.whatsappNumber}?text=Halo%20saya%20ingin%20klaim%20garansi%20alat`}
                  target="_blank" 
                  rel="noreferrer"
                  className="hover:text-[#38bdf8] transition-colors"
                >
                  Layanan Garansi &amp; Servis
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Operational Hours */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
              Jam Buka &amp; Kontak
            </h4>
            <div className="space-y-2 text-xs">
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
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#10223b] hover:bg-[#162e50] text-xs font-bold text-[#38bdf8] border border-[#1e3a5f] hover:border-[#0084ff] transition-all"
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
                  className="p-2 rounded-lg bg-[#091322] hover:bg-[#10223b] text-[#94a3b8] hover:text-[#38bdf8] border border-[#172b47] transition-colors"
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
                  className="px-2.5 py-1.5 rounded-lg bg-[#091322] hover:bg-[#10223b] text-[11px] font-semibold text-emerald-400 border border-[#172b47]"
                >
                  Tokopedia
                </a>
                <a
                  href={STORE_INFO.shopeeStoreUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1.5 rounded-lg bg-[#091322] hover:bg-[#10223b] text-[11px] font-semibold text-orange-400 border border-[#172b47]"
                >
                  Shopee
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright & Legal Links */}
        <div className="mt-12 pt-8 border-t border-[#13233a] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#64748b]">
          <p>
            © {new Date().getFullYear()} Alat Kopi Malang. Bagian dari ekosistem Sanubari Roastery. Hak Cipta Dilindungi.
          </p>
          <div className="flex items-center gap-4">
            <span className="hover:text-[#94a3b8] cursor-pointer">Kebijakan Privasi</span>
            <span>•</span>
            <span className="hover:text-[#94a3b8] cursor-pointer">Syarat &amp; Ketentuan</span>
            <span>•</span>
            <span className="hover:text-[#94a3b8] cursor-pointer">Kebijakan Garansi &amp; Retur</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
