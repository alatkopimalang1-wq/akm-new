import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  ArrowLeft, 
  CheckCircle2, 
  PhoneCall, 
  ShieldCheck, 
  Coffee, 
  PackageCheck,
  Store,
  Sparkles 
} from 'lucide-react';
import { STORE_INFO } from '../data/products';

export default function WholesalePage() {
  return (
    <div className="min-h-screen bg-[#141211] text-[#f5f5f4] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Back Link */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#a8a29e] hover:text-[#c2a676] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Katalog Alat Kopi</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#292524] text-xs font-bold text-[#c2a676] tracking-wider uppercase mb-3">
            <Building2 className="w-3.5 h-3.5" />
            <span>KEMITRAAN KEDAI &amp; ROASTERY</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#f5f5f4] tracking-tight">
            Pengadaan Alat Kopi &amp; Kemitraan Kedai
          </h1>
          <p className="text-xs sm:text-base text-[#a8a29e] mt-3 max-w-2xl mx-auto leading-relaxed font-normal">
            Solusi pengadaan perlengkapan seduh manual, grinder komersial, dan pendampingan bar kopi untuk coffee shop, kafe, dan roastery di seluruh Indonesia.
          </p>
        </div>

        {/* Value Proposition Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 rounded-3xl bg-[#1c1917] border border-[#292524] space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#c2a676]/10 flex items-center justify-center text-[#c2a676]">
              <PackageCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#f5f5f4]">Harga Khusus Wholesale</h3>
            <p className="text-xs text-[#78716c] leading-relaxed">
              Dapatkan potongan harga khusus volume untuk pembelian kuantitas kedai (filter paper grosir, kettle barista, grinder kedai).
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#1c1917] border border-[#292524] space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#c2a676]/10 flex items-center justify-center text-[#c2a676]">
              <Coffee className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#f5f5f4]">Supply Biji Kopi Sanubari</h3>
            <p className="text-xs text-[#78716c] leading-relaxed">
              Paket bundling alat sekaligus supply roasted beans houseblend atau single origin Gunung Kawi secara konsisten tiap minggu.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#1c1917] border border-[#292524] space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#c2a676]/10 flex items-center justify-center text-[#c2a676]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#f5f5f4]">Garansi &amp; Layanan Servis</h3>
            <p className="text-xs text-[#78716c] leading-relaxed">
              Dukungan suku cadang pengganti (spare parts) dan kalibrasi rutin langsung oleh tim teknis kami di Malang.
            </p>
          </div>
        </div>

        {/* Partnership Form / Call to action */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#24201d] via-[#1c1917] to-[#141211] border border-[#c2a676]/40 shadow-2xl text-center space-y-6">
          <div className="max-w-xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#f5f5f4]">
              Mulai Konsultasi Pengadaan Bar Kopi Anda
            </h2>
            <p className="text-xs sm:text-sm text-[#a8a29e] leading-relaxed font-normal">
              Diskusikan kebutuhan setup bar, estimasi budget, dan kurasi alat yang paling efisien untuk workflow kedai kopi Anda bersama head barista kami.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href={`https://wa.me/${STORE_INFO.whatsappNumber}?text=Halo%20tim%20Sanubari%20x%20AKM,%20saya%20tertarik%20konsultasi%20pengadaan%20alat%20kopi%20wholesale%20untuk%20kedai`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#c2a676] to-[#b45309] text-[#141211] font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-[#c2a676]/20"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Chat Tim Kemitraan via WhatsApp</span>
            </a>

            <a
              href={STORE_INFO.googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-[#292524] hover:bg-[#38332f] text-[#f5f5f4] text-xs font-semibold border border-[#38332f] hover:border-[#c2a676] transition-all"
            >
              <Store className="w-4 h-4 text-[#c2a676]" />
              <span>Kunjungi Showroom Tlogomas Malang</span>
            </a>
          </div>

          <div className="pt-4 border-t border-[#292524]/60 text-xs text-[#78716c]">
            <span>Showroom &amp; Roastery: </span>
            <strong className="text-[#f5f5f4]">Ruko Tlogomas Square Kav. 34 Lowokwaru, Kota Malang</strong>
          </div>
        </div>

      </div>
    </div>
  );
}
