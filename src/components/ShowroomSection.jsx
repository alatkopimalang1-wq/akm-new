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
    <section id="showroom-section" className="py-16 sm:py-24 bg-gradient-to-b from-[#141211] via-[#1c1917] to-[#141211] border-b border-[#292524] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Photos Collage */}
          <div className="lg:col-span-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl overflow-hidden aspect-[4/5] bg-[#24201d] border border-[#292524] shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=800&q=80"
                  alt="Slow Bar Sanubari x Alat Kopi Malang"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden aspect-square bg-[#24201d] border border-[#292524] shadow-xl">
                  <img
                    src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80"
                    alt="Espresso Lever Testing Showroom"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden aspect-square bg-[#24201d] border border-[#292524] shadow-xl">
                  <img
                    src="https://images.unsplash.com/photo-1518057111178-44a106bad636?auto=format&fit=crop&w=800&q=80"
                    alt="Manual Brew Table Showroom"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>

            {/* Quote badge */}
            <div className="p-4 rounded-2xl bg-[#292524]/60 border border-[#38332f] flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#c2a676]/10 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-[#c2a676]" />
              </div>
              <p className="text-xs text-[#a8a29e] italic leading-relaxed">
                "Kami percaya alat kopi terbaik adalah yang pas di tangan dan sesuai dengan karakter rasa kopi yang kamu sukai. Datang dan buktikan langsung di slow bar kami."
              </p>
            </div>
          </div>

          {/* Showroom Details & Experience */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#292524] border border-[#c2a676]/30 text-xs text-[#c2a676] font-bold tracking-wider uppercase">
              <Store className="w-3.5 h-3.5" />
              <span>ROASTERY &amp; SHOWROOM EXPERIENTIAL</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#f5f5f4] tracking-tight">
              Kunjungi Showroom &amp; Slow Bar <br />
              <span className="text-[#c2a676]">Sanubari x Alat Kopi Malang</span>
            </h2>

            <p className="text-sm sm:text-base text-[#a8a29e] leading-relaxed">
              Bukan sekadar toko alat kopi online biasa. Di Showroom Tlogomas Malang, kamu bisa <strong>Test-Drive</strong> langsung grinder, mencoba pull shot espresso manual dengan Flair 58, mencicipi kalibrasi dripper V60 Kasuya, sekaligus konsultasi biji kopi artisan bersama tim Sanubari Roastery.
            </p>

            {/* Feature bullets */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#1c1917] border border-[#292524]">
                <Coffee className="w-5 h-5 text-[#c2a676] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#f5f5f4]">Free Test-Drive &amp; Kalibrasi</h4>
                  <p className="text-xs text-[#78716c]">Bawa biji kopi favoritmu atau coba langsung dengan biji kopi Sanubari Kawi Series kami.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#1c1917] border border-[#292524]">
                <Award className="w-5 h-5 text-[#c2a676] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#f5f5f4]">Garansi &amp; Layanan Service Resmi</h4>
                  <p className="text-xs text-[#78716c]">Jaminan purna jual, suku cadang original, dan perbaikan grinder langsung di Malang.</p>
                </div>
              </div>
            </div>

            {/* Address & Hours Box */}
            <div className="p-5 rounded-2xl bg-[#1c1917] border border-[#38332f] space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#c2a676] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-[#f5f5f4] block font-bold">Alamat Showroom:</strong>
                  <span className="text-[#a8a29e]">{STORE_INFO.address}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#c2a676] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-[#f5f5f4] block font-bold">Jam Buka:</strong>
                  <span className="text-[#a8a29e]">{STORE_INFO.operationalHours}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={STORE_INFO.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#292524] hover:bg-[#38332f] text-[#f5f5f4] text-xs font-bold border border-[#38332f] hover:border-[#c2a676] transition-all"
              >
                <MapPin className="w-4 h-4 text-[#c2a676]" />
                <span>Buka Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#78716c]" />
              </a>

              <a
                href={`https://wa.me/${STORE_INFO.whatsappNumber}?text=Halo%20tim%20Sanubari%20x%20Alat%20Kopi%20Malang,%20saya%20mau%20mampir%20ke%20showroom%20untuk%20melihat%20alat`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#c2a676] to-[#b45309] text-[#141211] text-xs font-bold hover:brightness-110 transition-all shadow-md"
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

