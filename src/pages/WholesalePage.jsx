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
    <div className="min-h-screen bg-[#070e1b] text-[#f1f5f9] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Back Link */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#94a3b8] hover:text-[#38bdf8] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Katalog Alat Kopi</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0b172a] text-xs font-bold text-[#38bdf8] border border-[#172b47] tracking-wider uppercase mb-3">
            <Building2 className="w-3.5 h-3.5 text-[#0084ff]" />
            <span>KEMITRAAN KEDAI &amp; ROASTERY</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#f1f5f9] tracking-tight">
            Pengadaan Alat Kopi &amp; Kemitraan Kedai
          </h1>
          <p className="text-xs sm:text-base text-[#94a3b8] mt-3 max-w-2xl mx-auto leading-relaxed font-normal">
            Solusi pengadaan perlengkapan seduh manual, grinder komersial, dan pendampingan bar kopi untuk coffee shop, kafe, dan roastery di seluruh Indonesia.
          </p>
        </div>

        {/* Value Proposition Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 rounded-3xl bg-[#0b172a] border border-[#172b47] space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0070f3]/15 flex items-center justify-center text-[#38bdf8]">
              <PackageCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#f1f5f9]">Harga Khusus Wholesale</h3>
            <p className="text-xs text-[#94a3b8] leading-relaxed">
              Dapatkan potongan harga khusus volume untuk pembelian kuantitas kedai (filter paper grosir, kettle barista, grinder kedai).
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#0b172a] border border-[#172b47] space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0070f3]/15 flex items-center justify-center text-[#38bdf8]">
              <Coffee className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#f1f5f9]">Supply Biji Kopi Sanubari</h3>
            <p className="text-xs text-[#94a3b8] leading-relaxed">
              Penyediaan biji kopi sangrai fresh (Commercial Espresso Blend, Fine Robusta Dampit, atau Single Origin Arabica) untuk house blend kedai Anda.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#0b172a] border border-[#172b47] space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0070f3]/15 flex items-center justify-center text-[#38bdf8]">
              <Store className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#f1f5f9]">Konsultasi Bar Setup</h3>
            <p className="text-xs text-[#94a3b8] leading-relaxed">
              Kunjungi showroom kami di Ruko Tlogomas Square Kav. 34 Malang untuk uji coba alat, kalibrasi rasio, dan konsultasi alur kerja bar.
            </p>
          </div>
        </div>

        {/* Partnership Form / CTA Box */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#0b172a] via-[#091322] to-[#070e1b] border border-[#172b47] shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-[#38bdf8]">
              B2B &amp; COFFEE SHOP PARTNER
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#f1f5f9] mt-2 leading-tight">
              Siap Memulai atau Meng-upgrade Bar Kopi Anda?
            </h2>
            <p className="text-xs sm:text-sm text-[#94a3b8] mt-3 leading-relaxed">
              Diskusikan kebutuhan kedai kopi Anda langsung dengan tim konsultan Alat Kopi Malang &amp; Sanubari Roastery. Kami menyediakan faktur pajak resmi, garansi distributor, serta layanan purna jual lengkap.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <a
                href={`https://wa.me/${STORE_INFO.whatsappNumber}?text=Halo%20Admin%20AKM%2C%20saya%20tertarik%20dengan%20kemitraan%20kedai%20kopi%20dan%20pengadaan%20alat%20kopi%20grosir.`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#0070f3] to-[#0052cc] text-white font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-[#0070f3]/25"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Hubungi Sales Wholesale AKM</span>
              </a>

              <a
                href={`mailto:${STORE_INFO.email}?subject=Permohonan%20Katalog%20Wholesale%20Alat%20Kopi%20Malang`}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-[#070e1b] hover:bg-[#112240] text-[#f1f5f9] font-bold text-xs uppercase tracking-wider border border-[#172b47] hover:border-[#0084ff] transition-all"
              >
                <span>Minta Katalog &amp; Price List (PDF)</span>
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
