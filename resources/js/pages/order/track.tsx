import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Clock,
    HelpCircle,
    Package,
    Search,
    ShieldCheck,
    Truck,
} from 'lucide-react';
import { PublicLayout } from '@/layouts/public-layout';

interface TrackPageProps {
    error?: string;
}

export default function OrderTrackPage({ error }: TrackPageProps) {
    const [activeTab, setActiveTab] = useState<'order' | 'waybill'>('order');
    const [orderNumber, setOrderNumber] = useState('');

    // Waybill Tracking State
    const [waybill, setWaybill] = useState('');
    const [courier, setCourier] = useState('jnt');
    const [phone, setPhone] = useState('');
    const [trackingLoading, setTrackingLoading] = useState(false);
    const [trackingResult, setTrackingResult] = useState<any>(null);

    const handleOrderSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (orderNumber.trim()) {
            window.location.href = `/pesanan/${orderNumber.trim().toUpperCase()}`;
        }
    };

    const handleWaybillSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!waybill.trim()) return;

        setTrackingLoading(true);
        setTrackingResult(null);

        try {
            const res = await fetch('/api/shipping/track', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
                body: JSON.stringify({
                    waybill: waybill.trim(),
                    courier: courier,
                    last_phone: phone.trim() || null,
                }),
            });
            const data = await res.json();
            setTrackingResult(data);
        } catch (err) {
            console.error('Tracking error:', err);
            setTrackingResult({
                success: false,
                message: 'Gagal terhubung ke server tracking RajaOngkir. Silakan coba sesaat lagi.',
            });
        } finally {
            setTrackingLoading(false);
        }
    };

    return (
        <PublicLayout title="Lacak Pesanan & Cek Resi Ekspedisi — Sanubari Roastery">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-32 md:pb-20 space-y-8">
                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="w-16 h-16 rounded-2xl bg-cream-100 border border-sand-200 flex items-center justify-center text-brand-700 mx-auto shadow-xs">
                        <Truck className="w-8 h-8 text-accent-copper" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-brand-950">
                        Lacak Pesanan & Cek Resi
                    </h1>
                    <p className="text-xs sm:text-sm text-brand-600 max-w-md mx-auto">
                        Pantau status pesanan kopi Anda atau cek nomor resi ekspedisi secara real-time via gateway RajaOngkir Enterprise.
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex rounded-2xl bg-sand-200/60 p-1.5 max-w-md mx-auto">
                    <button
                        type="button"
                        onClick={() => setActiveTab('order')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            activeTab === 'order'
                                ? 'bg-white text-brand-950 shadow-xs'
                                : 'text-brand-600 hover:text-brand-950'
                        }`}
                    >
                        <Package className="w-4 h-4" />
                        <span>No. Pesanan (SNB)</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('waybill')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            activeTab === 'waybill'
                                ? 'bg-white text-brand-950 shadow-xs'
                                : 'text-brand-600 hover:text-brand-950'
                        }`}
                    >
                        <Truck className="w-4 h-4" />
                        <span>Cek Resi Kurir (Live)</span>
                    </button>
                </div>

                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-200/80 shadow-xs space-y-5">
                    {error && (
                        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
                            {error}
                        </div>
                    )}

                    {activeTab === 'order' ? (
                        /* TAB 1: TRACK BY ORDER NUMBER */
                        <form onSubmit={handleOrderSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold uppercase tracking-wider text-brand-900">
                                    Nomor Pesanan (Invoice)
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        required
                                        value={orderNumber}
                                        onChange={(e) => setOrderNumber(e.target.value)}
                                        placeholder="Contoh: SNB-261030-9A8B"
                                        className="w-full px-4 py-3 rounded-xl bg-cream-50 border border-sand-200 text-sm font-mono font-bold text-brand-950 uppercase tracking-wider focus:outline-hidden focus:border-brand-700 focus:bg-white transition-colors"
                                    />
                                    <Search className="w-4 h-4 text-brand-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>
                                <p className="text-[11px] text-brand-500">
                                    * Nomor pesanan tertera pada invoice saat checkout dan pesan WhatsApp konfirmasi.
                                </p>
                            </div>

                            <button
                                type="submit"
                                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer active:scale-[0.99]"
                            >
                                <Search className="w-4 h-4" />
                                <span>Cek Status & Pembayaran</span>
                            </button>
                        </form>
                    ) : (
                        /* TAB 2: TRACK BY AWB / RESI (LIVE RAJAONGKIR) */
                        <form onSubmit={handleWaybillSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold uppercase tracking-wider text-brand-900">
                                    Nomor Resi Pengiriman (Air Waybill)
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        required
                                        value={waybill}
                                        onChange={(e) => setWaybill(e.target.value)}
                                        placeholder="Contoh: JP1234567890 / JNE-123456"
                                        className="w-full px-4 py-3 rounded-xl bg-cream-50 border border-sand-200 text-sm font-mono font-bold text-brand-950 uppercase tracking-wider focus:outline-hidden focus:border-brand-700 focus:bg-white transition-colors"
                                    />
                                    <Truck className="w-4 h-4 text-brand-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-brand-900">
                                        Pilih Ekspedisi
                                    </label>
                                    <select
                                        value={courier}
                                        onChange={(e) => setCourier(e.target.value)}
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 border border-sand-200 text-xs font-bold text-brand-950 focus:outline-hidden focus:border-brand-700 focus:bg-white"
                                    >
                                        <option value="jnt">J&T Express</option>
                                        <option value="jne">JNE Express</option>
                                        <option value="sicepat">SiCepat Ekspres</option>
                                        <option value="anteraja">Anteraja</option>
                                        <option value="pos">POS Indonesia</option>
                                        <option value="tiki">TIKI</option>
                                        <option value="gosend">GoSend Instant</option>
                                        <option value="ninja">Ninja Xpress</option>
                                        <option value="wahana">Wahana</option>
                                        <option value="lion">Lion Parcel</option>
                                        <option value="ide">ID Express</option>
                                        <option value="spx">SPX / Shopee Express</option>
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-brand-900">
                                        No. HP Penerima (Opsional)
                                    </label>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="5 digit terakhir no. HP (opsional)"
                                        className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 border border-sand-200 text-xs text-brand-950 focus:outline-hidden focus:border-brand-700 focus:bg-white"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={trackingLoading}
                                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer active:scale-[0.99] disabled:opacity-60"
                            >
                                {trackingLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        <span>Menghubungi Server Ekspedisi...</span>
                                    </>
                                ) : (
                                    <>
                                        <Search className="w-4 h-4" />
                                        <span>Lacak Resi Sekarang</span>
                                    </>
                                )}
                            </button>
                        </form>
                    )}

                    {/* LIVE TRACKING RESULT (ON THE SPOT) */}
                    {activeTab === 'waybill' && trackingResult && (
                        <div className="pt-4 border-t border-sand-200 space-y-4 animate-in fade-in duration-200">
                            {trackingResult.success ? (
                                <div className="space-y-4">
                                    {/* Summary Card */}
                                    <div className="p-4 rounded-2xl bg-cream-50 border border-sand-200 space-y-2">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-brand-600">Ekspedisi:</span>
                                            <span className="font-bold text-brand-950">{trackingResult.courier_name}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-brand-600">Nomor Resi:</span>
                                            <span className="font-mono font-bold text-accent-copper">{trackingResult.waybill}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-brand-600">Status Terkini:</span>
                                            <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${trackingResult.delivered ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                                                {trackingResult.status}
                                            </span>
                                        </div>
                                        {trackingResult.status_label && (
                                            <p className="text-[11px] text-brand-700 pt-1 border-t border-sand-200">
                                                {trackingResult.status_label}
                                            </p>
                                        )}
                                    </div>

                                    {/* Timeline Manifest */}
                                    <div className="space-y-3">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-brand-900">
                                            Riwayat Perjalanan Paket
                                        </h4>
                                        {trackingResult.history && trackingResult.history.length > 0 ? (
                                            <div className="relative border-l-2 border-brand-200 pl-4 space-y-4 ml-2">
                                                {trackingResult.history.map((event: any, idx: number) => (
                                                    <div key={idx} className="relative">
                                                        <span className={`absolute -left-[23px] top-1.5 w-3 h-3 rounded-full border-2 border-white ${idx === 0 ? 'bg-brand-700 ring-2 ring-brand-300' : 'bg-sand-400'}`} />
                                                        <span className="text-[10px] font-bold text-brand-400 block">{event.date}</span>
                                                        <p className="text-xs font-semibold text-brand-900 leading-snug">{event.desc}</p>
                                                        {event.location && (
                                                            <span className="text-[10px] text-accent-copper font-medium block mt-0.5">📍 {event.location}</span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-brand-500 italic">Belum ada pemindaian manifest dari kurir.</p>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
                                    {trackingResult.message || 'Nomor resi tidak ditemukan atau belum aktif di sistem kurir.'}
                                </div>
                            )}
                        </div>
                    )}

                    <div className="pt-4 border-t border-sand-200 flex items-center justify-between text-xs text-brand-600">
                        <Link href="/shop" className="hover:underline flex items-center gap-1 text-brand-700 font-semibold">
                            <ArrowLeft className="w-3.5 h-3.5" />
                            <span>Kembali ke Katalog Kopi</span>
                        </Link>
                        <Link href="/keranjang" className="hover:underline text-brand-700 font-semibold">
                            Lihat Keranjang
                        </Link>
                    </div>
                </div>

                <div className="p-5 rounded-2xl bg-sand-100/60 border border-sand-200/80 space-y-2 text-xs text-brand-700">
                    <div className="flex items-center gap-2 font-bold text-brand-950">
                        <HelpCircle className="w-4 h-4 text-accent-copper" />
                        <span>Butuh bantuan terkait pesanan atau resi?</span>
                    </div>
                    <p className="leading-relaxed">
                        Jika Anda lupa nomor pesanan atau resi belum ter-update, silakan hubungi Customer Service kami via WhatsApp resmi di <strong>+62 851-2193-0454</strong>.
                    </p>
                </div>
            </div>
        </PublicLayout>
    );
}
