import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
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
      destination: 'Kota Malang, Jawa Timur',
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
    <div className="min-h-screen bg-white text-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-xs font-bold text-[#0e1f36] border border-slate-200 tracking-wider uppercase mb-3">
            <Truck className="w-3.5 h-3.5 text-[#0e1f36]" />
            <span>REAL-TIME TRACKING</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Lacak Pesanan &amp; Status Pengiriman
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-lg mx-auto leading-relaxed">
            Masukkan Nomor Invoice pesanan Anda (contoh: <strong>INV-AKM-849201</strong>) atau nomor WhatsApp yang digunakan saat memesan.
          </p>
        </div>

        {/* Tracking Input Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-xl mb-8">
          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Masukkan Nomor Invoice (misal: INV-AKM-849201)"
                value={invoiceQuery}
                onChange={(e) => setInvoiceQuery(e.target.value)}
                required
                className="w-full bg-white border border-slate-200 focus:border-[#0e1f36] text-sm text-slate-900 placeholder-slate-400 rounded-2xl py-3.5 pl-11 pr-4 focus:outline-none transition-all uppercase shadow-xs"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <button
              type="submit"
              className="py-3.5 px-6 rounded-2xl bg-[#0e1f36] hover:bg-[#162f52] text-white font-bold text-xs uppercase tracking-wider active:scale-95 transition-all shadow-md shrink-0 flex items-center justify-center gap-2"
            >
              <span>Lacak Paket</span>
            </button>
          </form>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span>Contoh pencarian cepat:</span>
            {['INV-AKM-8821', 'INV-AKM-7402', 'INV-AKM-9914'].map((sample) => (
              <button
                key={sample}
                type="button"
                onClick={() => setInvoiceQuery(sample)}
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-[#0e1f36] border border-slate-200 font-mono text-[11px] transition-colors shadow-xs"
              >
                {sample}
              </button>
            ))}
          </div>
        </div>

        {/* Tracking Result View */}
        {hasSearched && trackedOrder && (
          <div className="space-y-6 animate-fade-in">
            {/* Status Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-6">
                <div>
                  <span className="text-xs text-slate-400 font-medium block">Nomor Invoice</span>
                  <strong className="text-lg sm:text-xl font-mono text-[#0e1f36]">
                    {trackedOrder.invoiceNumber}
                  </strong>
                </div>

                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>Sedang Dikirim Kurir</span>
                </div>
              </div>

              {/* Order Meta details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6 border-b border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 block mb-1">Kurir &amp; Resi:</span>
                  <strong className="text-slate-800">{trackedOrder.courier}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Destinasi:</span>
                  <strong className="text-slate-800 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#0e1f36]" />
                    <span>{trackedOrder.destination}</span>
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Estimasi Tiba:</span>
                  <strong className="text-emerald-600 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{trackedOrder.estimatedDelivery}</span>
                  </strong>
                </div>
              </div>

              {/* Delivery Timeline */}
              <div className="pt-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0e1f36] mb-4">
                  Riwayat Perjalanan Paket
                </h4>
                <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {trackedOrder.timeline.map((step, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-[27px] top-0 w-3.5 h-3.5 rounded-full bg-[#0e1f36] border-2 border-white shadow-xs" />
                      <div className="text-xs text-slate-400">{step.time}</div>
                      <div className="text-sm font-bold text-slate-900 mt-0.5">{step.title}</div>
                      <div className="text-xs text-slate-600 mt-0.5">{step.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Items List */}
              <div className="pt-6 mt-6 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                  Barang yang Dikirim:
                </h4>
                <div className="space-y-2">
                  {trackedOrder.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div>
                        <div className="font-semibold text-slate-900">{it.name}</div>
                        <div className="text-[11px] text-slate-500">Jumlah: {it.qty} unit</div>
                      </div>
                      <div className="font-bold text-[#0e1f36]">{formatRupiah(it.price * it.qty)}</div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Need Help Box */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
              <div>
                <strong className="text-slate-900 block text-sm">Ada pertanyaan terkait kiriman paket Anda?</strong>
                <span>Tim ekspedisi &amp; customer care Sanubari siap membantu cek posisi langsung ke kurir.</span>
              </div>
              <a
                href={`https://wa.me/${STORE_INFO.whatsappNumber}?text=Halo%20Admin%20AKM%2C%20mau%20konfirmasi%20resi%20invoice%20${trackedOrder.invoiceNumber}`}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0e1f36] font-bold border border-slate-300 hover:border-[#0e1f36] transition-all flex items-center gap-2 shrink-0 shadow-xs"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Chat Admin Ekspedisi</span>
              </a>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
