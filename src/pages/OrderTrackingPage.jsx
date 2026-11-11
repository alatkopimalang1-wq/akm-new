import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ArrowLeft, 
  PhoneCall, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { STORE_INFO } from '../data/products';
import { formatRupiah } from '../utils/format';

export default function OrderTrackingPage() {
  const [invoiceQuery, setInvoiceQuery] = useState('');
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleTrack = (e) => {
    e.preventDefault();
    if (!invoiceQuery.trim()) return;

    setHasSearched(true);
    // Simulate real order tracking data
    const query = invoiceQuery.trim().toUpperCase();
    
    // Sample simulated order
    setTrackedOrder({
      invoiceNumber: query.startsWith('INV-') ? query : `INV-AKM-${query}`,
      date: '11 November 2026',
      customerName: 'Pelanggan Alat Kopi Malang',
      courier: 'JNE Reguler (Resi: JNE88291049102)',
      destination: 'Kota Surabaya, Jawa Timur',
      status: 'dikirim', // diproses, dikirim, selesai
      estimatedDelivery: '12 - 13 November 2026',
      items: [
        { name: 'Timemore Chestnut C3S Pro Manual Coffee Grinder (Matte Black)', qty: 1, price: 875000 },
        { name: 'Cafec Abaca Filter Paper V60 02 (100 Sheets)', qty: 1, price: 68000 }
      ],
      subtotal: 943000,
      shipping: 0,
      total: 943000,
      timeline: [
        { time: '11 Nov 2026 - 10:15 WIB', title: 'Pesanan Dikonfirmasi', desc: 'Pembayaran telah diverifikasi oleh tim admin AKM' },
        { time: '11 Nov 2026 - 12:40 WIB', title: 'Quality Check & Packing Aman', desc: 'Alat dicek fungsi burr dan dibungkus bubble wrap tebal' },
        { time: '11 Nov 2026 - 14:20 WIB', title: 'Diserahkan ke Kurir Ekspedisi', desc: 'Paket telah di-pickup oleh kurir JNE Malang' }
      ]
    });
  };

  return (
    <div className="min-h-screen bg-[#141211] text-[#f5f5f4] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Back Link */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#a8a29e] hover:text-[#c2a676] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Katalog Alat Kopi</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#292524] text-xs font-bold text-[#c2a676] tracking-wider uppercase mb-3">
            <Truck className="w-3.5 h-3.5" />
            <span>REAL-TIME TRACKING</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#f5f5f4] tracking-tight">
            Lacak Pesanan &amp; Status Pengiriman
          </h1>
          <p className="text-xs sm:text-sm text-[#78716c] mt-2 max-w-lg mx-auto leading-relaxed">
            Masukkan Nomor Invoice pesanan Anda (contoh: <strong>INV-AKM-849201</strong>) atau nomor WhatsApp yang digunakan saat memesan.
          </p>
        </div>

        {/* Tracking Input Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#1c1917] border border-[#292524] shadow-2xl mb-8">
          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Masukkan Nomor Invoice (misal: INV-AKM-849201)"
                value={invoiceQuery}
                onChange={(e) => setInvoiceQuery(e.target.value)}
                required
                className="w-full bg-[#292524] border border-[#38332f] focus:border-[#c2a676] text-sm text-[#f5f5f4] placeholder-[#78716c] rounded-2xl py-3.5 pl-11 pr-4 focus:outline-none transition-all uppercase"
              />
              <Search className="w-4 h-4 text-[#78716c] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <button
              type="submit"
              className="py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#c2a676] to-[#b45309] text-[#141211] font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-md shrink-0 flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Lacak Pesanan</span>
            </button>
          </form>

          <div className="mt-4 flex items-center justify-between text-[11px] text-[#78716c]">
            <span>Format invoice otomatis terbit saat checkout</span>
            <a
              href={`https://wa.me/${STORE_INFO.whatsappNumber}?text=Halo%20admin,%20saya%20ingin%20cek%20status%20pesanan%20saya`}
              target="_blank"
              rel="noreferrer"
              className="text-[#c2a676] hover:underline"
            >
              Lupa No. Invoice? Hubungi CS WA ↗
            </a>
          </div>
        </div>

        {/* Result Area */}
        {hasSearched && trackedOrder && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#1c1917] border border-[#38332f] shadow-2xl space-y-6 animate-fade-in">
            
            {/* Top Status Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#292524] gap-4">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#78716c] font-semibold">Nomor Invoice</span>
                <h3 className="text-xl font-extrabold text-[#f5f5f4]">{trackedOrder.invoiceNumber}</h3>
                <span className="text-xs text-[#a8a29e] mt-0.5 block">Tanggal Order: {trackedOrder.date}</span>
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-xs font-bold text-emerald-400 self-start sm:self-auto">
                <Truck className="w-4 h-4" />
                <span className="uppercase tracking-wider">Sedang Dalam Pengiriman</span>
              </div>
            </div>

            {/* Courier & Destination Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-[#292524]/50 border border-[#292524]">
                <span className="text-[#78716c] block mb-1">Kurir &amp; No. Resi:</span>
                <strong className="text-[#f5f5f4] font-bold text-sm block">{trackedOrder.courier}</strong>
                <span className="text-[#a8a29e] text-[11px]">Estimasi Tiba: {trackedOrder.estimatedDelivery}</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#292524]/50 border border-[#292524]">
                <span className="text-[#78716c] block mb-1">Alamat Tujuan:</span>
                <strong className="text-[#f5f5f4] font-bold text-sm block">{trackedOrder.destination}</strong>
                <span className="text-[#a8a29e] text-[11px]">Penerima: {trackedOrder.customerName}</span>
              </div>
            </div>

            {/* Tracking Timeline */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#c2a676] mb-4 flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>Riwayat Perjalanan Paket</span>
              </h4>
              <div className="space-y-4 relative pl-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#38332f]">
                {trackedOrder.timeline.map((step, idx) => (
                  <div key={idx} className="relative">
                    <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-[#c2a676] border-2 border-[#1c1917]" />
                    <span className="text-[10px] text-[#78716c] font-mono">{step.time}</span>
                    <h5 className="text-xs font-bold text-[#f5f5f4]">{step.title}</h5>
                    <p className="text-xs text-[#a8a29e]">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Item Summary */}
            <div className="pt-4 border-t border-[#292524]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#a8a29e] mb-3 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#c2a676]" />
                <span>Rincian Barang yang Dipesan</span>
              </h4>
              <div className="space-y-2 text-xs divide-y divide-[#292524]">
                {trackedOrder.items.map((item, i) => (
                  <div key={i} className="pt-2 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-[#f5f5f4]">{item.name}</p>
                      <span className="text-[11px] text-[#78716c]">{item.qty} pcs x {formatRupiah(item.price)}</span>
                    </div>
                    <strong className="text-[#c2a676]">{formatRupiah(item.qty * item.price)}</strong>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-[#292524] flex justify-between items-center text-sm font-extrabold">
                <span className="text-[#f5f5f4]">Total Pembayaran:</span>
                <span className="text-[#c2a676] text-base">{formatRupiah(trackedOrder.total)}</span>
              </div>
            </div>

            {/* Help Call to action */}
            <div className="p-4 rounded-2xl bg-[#292524]/60 border border-[#38332f] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="text-[#a8a29e]">Ada pertanyaan terkait pengiriman atau packing?</span>
              <a
                href={`https://wa.me/${STORE_INFO.whatsappNumber}?text=Halo%20CS%20AKM,%20saya%20mau%20tanya%20paket%20dengan%20no%20invoice%20${trackedOrder.invoiceNumber}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#c2a676] text-[#141211] font-bold hover:brightness-110 transition-all shrink-0"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Hubungi CS Pengiriman</span>
              </a>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
