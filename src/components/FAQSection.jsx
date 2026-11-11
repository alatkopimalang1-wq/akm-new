import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQS = [
  {
    q: 'Apakah semua alat kopi di AKM dijamin 100% original dan bergaransi resmi?',
    a: 'Ya, tentu! Semua alat kopi di Alat Kopi Malang (AKM) didatangkan melalui distributor resmi bergaransi (seperti Timemore Indonesia, Hario Japan, Flair Indonesia, Fellow). Setiap produk elektrik atau grinder disertai kartu garansi resmi dengan masa garansi 1 hingga 2 tahun.'
  },
  {
    q: 'Apakah saya bisa mencoba (test-drive) alat seduh atau grinder sebelum membeli?',
    a: 'Bisa sekali! Kami memiliki Showroom & Slow Bar di Ruko Tlogomas Square Kav. 34 Malang. Kamu bisa mencoba langsung mesin manual lever Flair 58, kalibrasi grinder Timemore/Kingrinder, atau membandingkan dripper keramik vs resin di meja seduh kami.'
  },
  {
    q: 'Bagaimana keamanan packing untuk pengiriman ke luar kota / luar pulau Jawa?',
    a: 'Setiap pengiriman menggunakan bubble wrap tebal berlapis dan kardus double-wall. Untuk produk kaca seperti server atau dripper keramik, kami menyediakan proteksi foam tebal dan stiker Fragile. Kami juga melayani permintaan packing kayu untuk ekspedisi kargo.'
  },
  {
    q: 'Apakah setiap pembelian paket starter kit mendapatkan biji kopi gratis?',
    a: 'Betul! Setiap pembelian paket starter kit (seperti Home Barista Pour Over Master Kit) sudah mendapatkan bonus 100g Freshly Roasted Coffee Beans dari Sanubari Roastery seri Gunung Kawi yang siap diseduh.'
  },
  {
    q: 'Bagaimana jika pesanan yang saya terima mengalami kerusakan saat transit?',
    a: 'Kami memberikan jaminan garansi penggantian unit baru 100% (Garansi Tukar Baru 7 Hari). Cukup rekam video unboxing saat membuka paket dan hubungi CS WhatsApp kami di +62 851-2193-0454, tim kami akan langsung memproses penggantian.'
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="py-16 sm:py-20 bg-[#181615] border-b border-[#292524]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#292524] text-xs font-bold text-[#c2a676] tracking-wider uppercase mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#f5f5f4]">
            Pertanyaan Seputar Alat Kopi &amp; Pemesanan
          </h2>
          <p className="text-xs sm:text-sm text-[#78716c] mt-1">
            Jawaban lengkap seputar garansi, pengiriman, kalibrasi, dan showroom.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl bg-[#1c1917] border border-[#292524] overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-[#f5f5f4] hover:text-[#c2a676] transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-[#c2a676] shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 text-xs text-[#a8a29e] leading-relaxed border-t border-[#292524]/60 pt-3 animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

