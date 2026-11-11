import React from 'react';
import { 
  MapPin, 
  Clock, 
  PhoneCall, 
  Coffee, 
  Store, 
  ExternalLink,
  Sparkles,
  Award
} from 'lucide-react';
import { STORE_INFO } from '../data/products';

export default function ShowroomSection() {
  return (
    <section id="showroom-section" className="py-16 sm:py-24 bg-gradient-to-b from-[#070e1b] via-[#091527] to-[#070e1b] border-b border-[#172b47] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Photos Collage */}
          <div className="lg:col-span-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-3xl overflow-hidden aspect-[4/5] bg-[#070e1b] border border-[#172b47] shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=800&q=80"
                  alt="Slow Bar Sanubari x Alat Kopi Malang"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="space-y-4">
                <div className="rounded-3xl overflow-hidden aspect-square bg-[#070e1b] border border-[#172b47] shadow-xl">
                  <img
                    src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80"
                    alt="Espresso Lever Testing Showroom"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="rounded-3xl overflow-hidden aspect-square bg-[#070e1b] border border-[#172b47] shadow-xl">
                  <img
                    src="https://images.unsplash.com/photo-1518057111178-44a106bad636?auto=format&fit=crop&w=800&q=80"
                    alt="Manual Brew Table Showroom"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>

            {/* Quote badge */}
            <div className="p-4 rounded-2xl bg-[#0f213d]/60 border border-[#1e3a5f] flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0070f3]/15 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-[#38bdf8]" />
              </div>
              <p className="text-xs text-[#94a3b8] italic leading-relaxed">
                "Kami percaya alat kopi terbaik adalah yang pas di tangan dan sesuai dengan karakter rasa kopi yang kamu sukai. Datang dan buktikan langsung di slow bar kami."
              </p>
            </div>
          </div>

          {/* Showroom Details & Experience */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#10223b] border border-[#0084ff]/40 text-xs text-[#38bdf8] font-bold tracking-wider uppercase">
              <Store className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span>ROASTERY &amp; SHOWROOM EXPERIENTIAL</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Kunjungi Showroom &amp; Slow Bar <br />
              <span className="text-[#38bdf8]">Sanubari x Alat Kopi Malang</span>
            </h2>

            <p className="text-sm sm:text-base text-[#94a3b8] leading-relaxed">
              Bukan sekadar toko alat kopi online biasa. Di Showroom Tlogomas Malang, kamu bisa <strong>Test-Drive</strong> langsung grinder, mencoba pull shot espresso manual dengan Flair 58, mencicipi kalibrasi dripper V60 Kasuya, sekaligus konsultasi biji kopi artisan bersama tim Sanubari Roastery.
            </p>

            {/* Feature bullets */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#0b172a] border border-[#172b47]">
                <Coffee className="w-5 h-5 text-[#38bdf8] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">Free Test-Drive &amp; Kalibrasi</h4>
                  <p className="text-xs text-[#64748b]">Bawa biji kopi favoritmu atau coba langsung dengan biji kopi Sanubari Kawi Series kami.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#0b172a] border border-[#172b47]">
                <Award className="w-5 h-5 text-[#38bdf8] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">Garansi &amp; Layanan Service Resmi</h4>
                  <p className="text-xs text-[#64748b]">Jaminan purna jual, suku cadang original, dan perbaikan grinder langsung di Malang.</p>
                </div>
              </div>
            </div>

            {/* Address & Hours Box */}
            <div className="p-5 rounded-2xl bg-[#0b172a] border border-[#1e3a5f] space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#38bdf8] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-white block font-bold">Alamat Showroom:</strong>
                  <span className="text-[#94a3b8]">{STORE_INFO.address}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#38bdf8] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-white block font-bold">Jam Buka:</strong>
                  <span className="text-[#94a3b8]">{STORE_INFO.operationalHours}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={STORE_INFO.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-[#10223b] hover:bg-[#162e50] text-white text-xs font-bold border border-[#1e3a5f] hover:border-[#0084ff] transition-all"
              >
                <MapPin className="w-4 h-4 text-[#38bdf8]" />
                <span>Buka Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#64748b]" />
              </a>

              <a
                href={`https://wa.me/${STORE_INFO.whatsappNumber}?text=Halo%20tim%20Sanubari%20x%20Alat%20Kopi%20Malang,%20saya%20mau%20mampir%20ke%20showroom%20untuk%20melihat%20alat`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-gradient-to-r from-[#0070f3] to-[#0052cc] text-white text-xs font-bold hover:brightness-110 transition-all shadow-lg shadow-[#0070f3]/25"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Jadwalkan Kunjungan via WA</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
