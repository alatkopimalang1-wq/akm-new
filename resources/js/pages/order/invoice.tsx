import React, { useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    CheckCircle2,
    Clock,
    Download,
    Printer,
    SlidersHorizontal,
    Store,
    Truck,
} from 'lucide-react';
import { formatRupiah } from '@/lib/trans';

interface InvoiceItem {
    id: number;
    product_name: string;
    variant_label: string;
    grind_option?: string | null;
    custom_notes?: string | null;
    price: number;
    quantity: number;
    subtotal: number;
}

interface InvoiceOrder {
    id: number;
    order_number: string;
    customer_name: string;
    customer_phone: string;
    customer_email?: string | null;
    customer_address: string;
    customer_notes?: string | null;
    payment_method: string;
    payment_method_label: string;
    payment_channel?: string | null;
    payment_status: 'pending' | 'verifying' | 'paid' | 'cancelled';
    payment_status_label: string;
    status: string;
    status_label: string;
    subtotal: number;
    shipping_cost: number;
    unique_code: number;
    total_amount: number;
    shipping_courier?: string | null;
    shipping_service?: string | null;
    shipping_etd?: string | null;
    tracking_number?: string | null;
    total_weight_grams?: number;
    created_at: string;
    paid_at?: string | null;
    items: InvoiceItem[];
}

interface InvoiceProps {
    order: InvoiceOrder;
    settings: {
        site_name: string;
        address: string;
        phone: string;
        email: string;
        pickup_store_name?: string;
        pickup_store_address?: string;
        pickup_store_hours?: string;
    };
}

export default function OrderInvoicePage({ order, settings }: InvoiceProps) {
    const isPaid = order.payment_status === 'paid';

    const handlePrint = () => {
        if (typeof window !== 'undefined') {
            window.print();
        }
    };

    // Auto-trigger print to save as PDF if ?download=1 is in URL
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            if (params.get('download') === '1') {
                const timer = setTimeout(() => {
                    window.print();
                }, 400);
                return () => clearTimeout(timer);
            }
        }
    }, []);

    const isPickup =
        order.shipping_courier === 'Ambil di Toko' ||
        order.shipping_service === 'Self Pick Up' ||
        order.customer_address.toLowerCase().includes('ambil di toko');

    const pageTitle = isPaid
        ? `Invoice-LUNAS-${order.order_number}-Alat Kopi Malang-Roastery`
        : `Invoice-${order.order_number}-Alat Kopi Malang-Roastery`;

    return (
        <div className="min-h-screen bg-sand-100/60 py-6 sm:py-10 px-4 sm:px-6 print:bg-white print:p-0 print:m-0 font-sans text-brand-950 selection:bg-brand-700 selection:text-white">
            <Head title={pageTitle}>
                <style>{`
                    @media print {
                        @page {
                            size: A4 portrait;
                            margin: 10mm;
                        }
                        body {
                            background-color: #ffffff !important;
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                        }
                    }
                `}</style>
            </Head>

            {/* Action Bar (Screen Only, Hidden in Print) */}
            <div className="max-w-4xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
                <Link
                    href={`/pesanan/${order.order_number}`}
                    className="inline-flex items-center gap-2 text-xs font-bold text-brand-700 hover:text-brand-950 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Kembali ke Halaman Pesanan</span>
                </Link>

                <div className="flex items-center gap-2.5">
                    <button
                        type="button"
                        onClick={handlePrint}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                    >
                        <Download className="w-4 h-4" />
                        <span>Download Invoice PDF {isPaid ? '(Lunas)' : ''}</span>
                    </button>

                    <button
                        type="button"
                        onClick={handlePrint}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-900 hover:bg-brand-950 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                    >
                        <Printer className="w-4 h-4" />
                        <span>Cetak Faktur</span>
                    </button>
                </div>
            </div>

            {/* Invoice Sheet Container */}
            <div className="max-w-4xl mx-auto bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-sand-200/90 p-6 sm:p-10 print:shadow-none print:border-none print:p-0">
                {/* Header: Brand & Invoice Meta */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-sand-200">
                    <div className="flex items-start gap-3.5">
                        <img
                            src="/brand/logo-circle.png"
                            alt="Alat Kopi Malang Logo"
                            className="w-12 h-12 rounded-full object-cover shrink-0 mt-0.5 border border-sand-200"
                        />
                        <div className="space-y-0.5">
                            <h1 className="text-xl font-extrabold tracking-tight text-brand-950">
                                {settings.site_name || 'Alat Kopi Malang'}
                            </h1>
                            <p className="text-xs text-brand-600 font-medium">
                                Specialty Coffee Roaster Malang · Close to Every Brew
                            </p>
                            <p className="text-[11px] text-brand-500 pt-1 leading-relaxed max-w-sm">
                                {settings.address}
                                <br />
                                WhatsApp: {settings.phone} · Email: {settings.email}
                            </p>
                        </div>
                    </div>

                    <div className="sm:text-right space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-accent-copper block">
                            FAKTUR PEMBELIAN / INVOICE
                        </span>
                        <div className="text-base sm:text-lg font-mono font-extrabold text-brand-950">
                            #{order.order_number}
                        </div>
                        <div className="text-xs text-brand-600 font-medium">
                            Tanggal Order: {order.created_at} WIB
                        </div>
                        <div className="pt-1.5 flex items-center sm:justify-end gap-2">
                            <span
                                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                                    isPaid
                                        ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-400'
                                        : 'bg-amber-100 text-amber-800 border-2 border-amber-300'
                                }`}
                            >
                                {isPaid ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Clock className="w-3.5 h-3.5 text-amber-600" />}
                                <span>{isPaid ? 'LUNAS / PAID' : order.payment_status_label}</span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* BANNER STATUS LUNAS DENGAN STEMPEL RESMI */}
                {isPaid && (
                    <div className="my-5 p-4 rounded-2xl bg-emerald-50/90 border-2 border-emerald-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 overflow-hidden">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                                <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
                            </div>
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 block">
                                    BUKTI TRANSAKSI SAH · SUDAH DIKONFIRMASI
                                </span>
                                <h3 className="text-sm font-extrabold text-emerald-950">
                                    Pembayaran Telah Diterima & Lunas
                                </h3>
                                <p className="text-[11px] text-emerald-800 mt-0.5">
                                    Dikonfirmasi pada {order.paid_at || order.created_at} WIB via {order.payment_method_label}.
                                </p>
                            </div>
                        </div>

                        {/* Stempel Fisik LUNAS Model Roastery */}
                        <div className="border-2 sm:border-3 border-emerald-700 bg-white/70 text-emerald-700 px-4 py-1.5 rounded-xl font-black text-xs sm:text-sm tracking-widest uppercase rotate-[-3deg] shadow-xs select-none shrink-0 text-center self-start sm:self-auto">
                            <div className="text-[9px] tracking-normal font-bold">ALAT KOPI MALANG</div>
                            <div className="text-base font-black text-emerald-700 leading-none my-0.5">★ LUNAS ★</div>
                            <div className="text-[8px] font-mono tracking-tighter">PAID · {order.paid_at || order.created_at}</div>
                        </div>
                    </div>
                )}

                {/* Customer & Fulfillment Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-sand-200 text-xs">
                    {/* Buyer Details */}
                    <div className="space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400 block">
                            Informasi Pelanggan
                        </span>
                        <h4 className="text-sm font-bold text-brand-950">{order.customer_name}</h4>
                        <p className="text-brand-700">Nomor WhatsApp: {order.customer_phone}</p>
                        {order.customer_email && <p className="text-brand-700">Email: {order.customer_email}</p>}
                        <div className="pt-1 text-brand-600">
                            <span className="font-semibold text-brand-800 block">Metode Pembayaran:</span>
                            <span>{order.payment_method_label}</span>
                            {order.paid_at && (
                                <span className="block text-[11px] text-emerald-700 font-bold mt-0.5">
                                    Status: Lunas ({order.paid_at} WIB)
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Shipping / Pickup Destination */}
                    <div className="space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400 block">
                            {isPickup ? 'Metode Pengambilan' : 'Alamat Pengiriman'}
                        </span>
                        {isPickup ? (
                            <div className="p-3 rounded-xl bg-sand-50 border border-sand-200 space-y-1">
                                <div className="flex items-center gap-1.5 font-bold text-brand-950">
                                    <Store className="w-3.5 h-3.5 text-accent-copper" />
                                    <span>Ambil di Toko (Self Pick Up)</span>
                                </div>
                                <p className="text-brand-700 leading-snug">
                                    {settings.pickup_store_name || 'Alat Kopi Malang (Tlogomas, Malang)'}
                                    <br />
                                    {settings.pickup_store_address || order.customer_address}
                                </p>
                                <p className="text-[10px] text-brand-500 font-medium">
                                    {settings.pickup_store_hours || 'Buka setiap hari: 09.00 - 23.00 WIB'}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                <p className="text-brand-800 leading-relaxed font-medium">
                                    {order.customer_address}
                                </p>
                                <div className="flex items-center gap-1.5 text-brand-700 font-semibold pt-1">
                                    <Truck className="w-3.5 h-3.5 text-accent-copper" />
                                    <span>
                                        Ekspedisi: {order.shipping_courier} ({order.shipping_service})
                                        {order.total_weight_grams ? ` · ${order.total_weight_grams}g` : ''}
                                    </span>
                                </div>
                                {order.tracking_number && (
                                    <p className="text-brand-600 font-mono text-[11px]">
                                        No. Resi Pengiriman: <span className="font-bold text-brand-950">{order.tracking_number}</span>
                                    </p>
                                )}
                            </div>
                        )}
                        {order.customer_notes && (
                            <p className="text-[11px] text-brand-500 italic pt-1">
                                Catatan: "{order.customer_notes}"
                            </p>
                        )}
                    </div>
                </div>

                {/* Items Table */}
                <div className="py-6 space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-brand-400">
                        Rincian Biji Kopi & Produk yang Dipesan
                    </h3>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                            <thead>
                                <tr className="border-b-2 border-brand-950 text-brand-950 font-bold uppercase tracking-wider text-[11px]">
                                    <th className="py-2.5 pr-2 w-8">No</th>
                                    <th className="py-2.5 px-3">Keterangan Produk</th>
                                    <th className="py-2.5 px-3 text-center w-16">Qty</th>
                                    <th className="py-2.5 px-3 text-right w-28">Harga Satuan</th>
                                    <th className="py-2.5 pl-3 text-right w-28">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-sand-200">
                                {order.items.map((item, idx) => (
                                    <tr key={item.id || idx} className="align-top">
                                        <td className="py-3.5 pr-2 text-brand-400 font-medium">
                                            {idx + 1}
                                        </td>
                                        <td className="py-3.5 px-3 space-y-1">
                                            <div className="font-bold text-sm text-brand-950">
                                                {item.product_name}
                                            </div>
                                            <div className="text-[11px] text-accent-copper font-medium">
                                                Kemasan: {item.variant_label} · Gilingan: {item.grind_option || 'Biji Utuh (Whole Bean)'}
                                            </div>

                                            {/* Custom Bundle / Notes Display */}
                                            {item.custom_notes && (
                                                <div className="mt-1.5 p-2.5 rounded-lg bg-sand-50 border border-sand-200 text-xs text-brand-950 leading-snug space-y-1">
                                                    {String(item.custom_notes)
                                                        .split(/\n|\s*\|\s*|(?=\[(?:Slot\s*\d+|GRATIS|OPSIONAL|OPTIONAL)\])/i)
                                                        .map((line) =>
                                                            line
                                                                .replace(/\s*\(Rp\s*[\d.,]+\)\s*$/i, '')
                                                                .replace(
                                                                    /^(\[(?:Slot\s*\d+|GRATIS|OPSIONAL|OPTIONAL)\])\s*1x\s+/i,
                                                                    '$1 ',
                                                                )
                                                                .trim(),
                                                        )
                                                        .filter(Boolean)
                                                        .map((line, lineIdx) => (
                                                            <div key={lineIdx} className="font-medium text-brand-900">
                                                                {line}
                                                            </div>
                                                        ))}
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-3.5 px-3 text-center font-bold text-brand-950">
                                            {item.quantity}
                                        </td>
                                        <td className="py-3.5 px-3 text-right font-medium text-brand-700">
                                            {formatRupiah(item.price)}
                                        </td>
                                        <td className="py-3.5 pl-3 text-right font-extrabold text-brand-950">
                                            {formatRupiah(item.subtotal)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Calculation Summary */}
                <div className="pt-4 border-t-2 border-sand-200 flex flex-col sm:flex-row justify-end">
                    <div className="w-full sm:w-80 space-y-2 text-xs">
                        <div className="flex justify-between text-brand-600">
                            <span>Subtotal Produk</span>
                            <span className="font-semibold text-brand-950">{formatRupiah(order.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-brand-600">
                            <span>
                                {isPickup ? 'Metode Pengambilan' : `Ongkos Kirim (${order.shipping_courier || 'Kurir'})`}
                            </span>
                            <span className={order.shipping_cost === 0 ? 'text-emerald-700 font-bold' : 'font-semibold text-brand-950'}>
                                {order.shipping_cost === 0 ? (isPickup ? 'GRATIS (Ambil Toko)' : 'GRATIS') : formatRupiah(order.shipping_cost)}
                            </span>
                        </div>
                        {order.unique_code > 0 && (
                            <div className="flex justify-between text-brand-600">
                                <span>Kode Unik Verifikasi</span>
                                <span className="font-semibold text-brand-950">+{order.unique_code}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-sm sm:text-base font-extrabold text-brand-950 pt-2.5 border-t border-sand-200">
                            <span>Total Pembayaran</span>
                            <span className="text-brand-800 text-base sm:text-lg">{formatRupiah(order.total_amount)}</span>
                        </div>
                        {isPaid && (
                            <div className="p-2 rounded-lg bg-emerald-50 text-center font-extrabold text-emerald-800 text-xs tracking-wider border border-emerald-200">
                                ★ STATUS: LUNAS DIBAYAR ★
                            </div>
                        )}
                    </div>
                </div>

                {/* Invoice Footer Notes */}
                <div className="mt-10 pt-6 border-t border-sand-200/80 text-[11px] text-brand-500 space-y-1">
                    <p className="font-semibold text-brand-800">
                        Catatan Resmi Alat Kopi Malang:
                    </p>
                    <p>
                        • Biji kopi diroasting secara berkala untuk menjaga kesegaran rasa (*peak flavor* 7–21 hari setelah roasting).
                    </p>
                    <p>
                        • Dokumen ini merupakan bukti transaksi sah yang diterbitkan oleh sistem resmi Alat Kopi Malang.
                    </p>
                    <p>
                        • Jika ada pertanyaan seputar pesanan atau membutuhkan bantuan panduan seduh, hubungi kami via WhatsApp: {settings.phone}.
                    </p>
                    <p className="pt-2 text-center text-brand-400 font-medium">
                        Terima kasih telah memilih seduhan Alat Kopi Malang — Close to Every Brew.
                    </p>
                </div>
            </div>
        </div>
    );
}
