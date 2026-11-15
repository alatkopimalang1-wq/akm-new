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
import { getBundlePricingSummary, isBundleOrderItem, parseCustomNotes } from '@/lib/utils';

interface InvoiceItem {
    id: number;
    product_name: string;
    variant_label: string;
    grind_option?: string | null;
    custom_notes?: string | null;
    original_price?: number;
    price: number;
    quantity: number;
    original_subtotal?: number;
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
    original_subtotal?: number;
    subtotal: number;
    shipping_cost: number;
    unique_code: number;
    total_amount: number;
    shipping_courier?: string | null;
    shipping_service?: string | null;
    shipping_etd?: string | null;
    tracking_number?: string | null;
    total_weight_grams?: number;
    has_preorder?: boolean;
    payment_details?: {
        has_preorder?: boolean;
        is_preorder_dp?: boolean;
        dp_percentage?: number;
        full_total_amount?: number;
        dp_amount?: number;
        remaining_balance?: number;
    } | null;
    created_at: string;
    paid_at?: string | null;
    items: InvoiceItem[];
}

interface InvoiceProps {
    order: InvoiceOrder;
    settings: {
        site_name: string;
        tagline?: string;
        logo?: string | null;
        address: string;
        phone: string;
        email: string;
        website?: string;
        title_label?: string;
        prefix?: string;
        paper_size?: string;
        show_paid_stamp?: boolean;
        stamp_text?: string;
        show_discount_breakdown?: boolean;
        bank_info?: string;
        footer_notes?: string;
        terms?: string;
        enable_signature?: boolean;
        signature_city?: string;
        signer_name?: string;
        signer_title?: string;
        signature_image?: string | null;
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

    const logoSrc = settings.logo
        ? (settings.logo.startsWith('http') ? settings.logo : `/storage/${settings.logo.replace(/^\/?(public\/|storage\/)?/, '')}`)
        : '/brand/logo-circle.png';

    const signatureSrc = settings.signature_image
        ? (settings.signature_image.startsWith('http') ? settings.signature_image : `/storage/${settings.signature_image.replace(/^\/?(public\/|storage\/)?/, '')}`)
        : null;

    const cleanOrderNumber = (order.order_number || '').replace(/^SNB-?/i, 'AKM-');

    // Hapus kode default SNB jika ada, ganti dengan AKM, dan sesuaikan dengan prefix (#AKM / #)
    const displayOrderNumber = (() => {
        let num = cleanOrderNumber;
        const prefix = (settings.prefix || '#AKM').trim();

        if (prefix.toUpperCase().includes('AKM') && num.toUpperCase().startsWith('AKM-')) {
            const suffix = num.substring(4);
            return prefix.endsWith('-') ? `${prefix}${suffix}` : `${prefix}-${suffix}`;
        }

        if (!num.toUpperCase().startsWith('AKM-')) {
            num = `AKM-${num}`;
        }

        return `${prefix}${num}`;
    })();

    const pageTitle = isPaid
        ? `Invoice-LUNAS-${cleanOrderNumber}-${settings.site_name || 'Alat Kopi Malang'}`
        : `Invoice-${cleanOrderNumber}-${settings.site_name || 'Alat Kopi Malang'}`;

    return (
        <div className="min-h-screen bg-sand-100/60 py-6 sm:py-10 px-4 sm:px-6 print:bg-white print:p-0 print:m-0 font-sans text-brand-950 selection:bg-brand-700 selection:text-white">
            <Head title={pageTitle}>
                <style>{`
                    @media print {
                        @page {
                            size: ${settings.paper_size === 'Letter' ? 'letter' : 'A4'} portrait;
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
                            src={logoSrc}
                            alt={`${settings.site_name || 'Alat Kopi Malang'} Logo`}
                            className="w-12 h-12 rounded-full object-cover shrink-0 mt-0.5 border border-sand-200"
                        />
                        <div className="space-y-0.5">
                            <h1 className="text-xl font-extrabold tracking-tight text-brand-950">
                                {settings.site_name || 'Alat Kopi Malang'}
                            </h1>
                            <p className="text-xs text-brand-600 font-medium">
                                {settings.tagline || 'Specialty Coffee Roaster Malang · Close to Every Brew'}
                            </p>
                            <p className="text-[11px] text-brand-500 pt-1 leading-relaxed max-w-sm">
                                {settings.address}
                                <br />
                                WhatsApp: {settings.phone} · Email: {settings.email}
                                {settings.website && (
                                    <>
                                        {' '}· Web: {settings.website.replace(/^https?:\/\//, '')}
                                    </>
                                )}
                            </p>
                        </div>
                    </div>

                    <div className="sm:text-right space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-accent-copper block">
                            {settings.title_label || 'FAKTUR PEMBELIAN / INVOICE'}
                        </span>
                        <div className="text-base sm:text-lg font-mono font-extrabold text-brand-950">
                            {displayOrderNumber}
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
                        {settings.show_paid_stamp !== false && (
                            <div className="border-2 sm:border-3 border-emerald-700 bg-white/70 text-emerald-700 px-4 py-1.5 rounded-xl font-black text-xs sm:text-sm tracking-widest uppercase rotate-[-3deg] shadow-xs select-none shrink-0 text-center self-start sm:self-auto">
                                <div className="text-[9px] tracking-normal font-bold">{settings.site_name || 'ALAT KOPI MALANG'}</div>
                                <div className="text-base font-black text-emerald-700 leading-none my-0.5">{settings.stamp_text || '★ LUNAS ★'}</div>
                                <div className="text-[8px] font-mono tracking-tighter">PAID · {order.paid_at || order.created_at}</div>
                            </div>
                        )}
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
                    <h3 className="text-xs font-bold uppercase tracking-wider text-brand-700">
                        Produk yang dipesan
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
                                {order.items.map((item, idx) => {
                                    const pricing = getBundlePricingSummary({
                                        customNotes: item.custom_notes,
                                        unitPrice: item.price,
                                        quantity: item.quantity,
                                        originalUnitPrice: item.original_price,
                                    });

                                    return (
                                        <tr key={item.id || idx} className="align-top">
                                            <td className="py-3.5 pr-2 text-brand-400 font-medium">
                                                {idx + 1}
                                            </td>
                                            <td className="py-3.5 px-3 space-y-1">
                                                <div className="font-bold text-sm text-brand-950">
                                                    {item.product_name}
                                                </div>
                                                {!isBundleOrderItem({
                                                    variantLabel: item.variant_label,
                                                    grindOption: item.grind_option,
                                                    customNotes: item.custom_notes,
                                                }) && item.variant_label && (
                                                    <div className="text-[11px] text-accent-copper font-semibold">
                                                        Varian: {item.variant_label}
                                                    </div>
                                                )}

                                                {/* Custom Bundle / Notes Display */}
                                                {item.custom_notes && (
                                                    <div className="mt-1.5 p-2.5 rounded-lg bg-sand-50 border border-sand-200 text-xs text-brand-800 leading-snug space-y-1">
                                                        {pricing.lines.map((line, lineIdx) => (
                                                            <div key={lineIdx} className="font-normal text-brand-800">
                                                                {line.tag && (
                                                                    <strong className="font-extrabold text-brand-950">
                                                                        {line.tag}{' '}
                                                                    </strong>
                                                                )}
                                                                <span>{line.text}</span>
                                                                {line.discountPrice && (
                                                                    <span>
                                                                        {' ('}
                                                                        {line.normalPrice && (line.normalPriceNum || 0) > (line.discountPriceNum || 0) && (
                                                                            <>
                                                                                <span className="text-red-600 line-through font-medium whitespace-nowrap">
                                                                                    {line.normalPrice}
                                                                                </span>{' '}
                                                                            </>
                                                                        )}
                                                                        <span className="font-bold text-brand-950 whitespace-nowrap">
                                                                            {line.discountPrice}
                                                                        </span>
                                                                        {')'}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        ))}
                                                        <div className="pt-2 mt-1.5 border-t border-sand-200 space-y-0.5 text-xs">
                                                            {pricing.hasDiscount && (
                                                                <div className="flex items-center justify-between">
                                                                    <span className="text-brand-600 font-medium">Total Harga Normal:</span>
                                                                    <span className="text-red-600 line-through font-bold whitespace-nowrap">
                                                                        {formatRupiah(pricing.totalNormalPrice)}
                                                                    </span>
                                                                </div>
                                                            )}
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-brand-800 font-bold">Total Harga Diskon:</span>
                                                                <span className="font-extrabold text-emerald-700 whitespace-nowrap">
                                                                    {formatRupiah(pricing.totalDiscountPrice)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="py-3.5 px-3 text-center font-bold text-brand-950">
                                                {item.quantity}
                                            </td>
                                            <td className="py-3.5 px-3 text-right font-medium text-brand-700 space-y-0.5">
                                                {pricing.hasDiscount && (
                                                    <div className="text-[11px] text-red-600 line-through">
                                                        {formatRupiah(pricing.unitNormalPrice)}
                                                    </div>
                                                )}
                                                <div className="font-bold text-brand-950">
                                                    {formatRupiah(item.price)}
                                                </div>
                                            </td>
                                            <td className="py-3.5 pl-3 text-right font-extrabold text-brand-950 space-y-0.5">
                                                {pricing.hasDiscount && (
                                                    <div className="text-[11px] text-red-600 line-through font-semibold">
                                                        {formatRupiah(pricing.totalNormalPrice)}
                                                    </div>
                                                )}
                                                <div>{formatRupiah(item.subtotal)}</div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Calculation Summary */}
                {(() => {
                    const calcNormalSubtotal = order.items.reduce((sum, item) => {
                        const p = getBundlePricingSummary({
                            customNotes: item.custom_notes,
                            unitPrice: item.price,
                            quantity: item.quantity,
                            originalUnitPrice: item.original_price,
                        });
                        return sum + p.totalNormalPrice;
                    }, 0);
                    const orderNormalSubtotal = Math.max(
                        Number(order.original_subtotal || 0),
                        calcNormalSubtotal,
                        order.subtotal,
                    );
                    const hasOrderDiscount = orderNormalSubtotal > order.subtotal;
                    const showDiscountBreakdown = settings.show_discount_breakdown !== false;

                    return (
                        <div className="pt-4 border-t-2 border-sand-200 flex flex-col sm:flex-row justify-end">
                            <div className="w-full sm:w-80 space-y-2 text-xs">
                                {showDiscountBreakdown && hasOrderDiscount && (
                                    <>
                                        <div className="flex justify-between text-brand-600">
                                            <span>Total Harga Normal</span>
                                            <span className="font-semibold text-red-600 line-through">
                                                {formatRupiah(orderNormalSubtotal)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-emerald-700">
                                            <span>Hemat / Diskon Bundling</span>
                                            <span className="font-bold">
                                                -{formatRupiah(orderNormalSubtotal - order.subtotal)}
                                            </span>
                                        </div>
                                    </>
                                )}
                                <div className="flex justify-between text-brand-600">
                                    <span>{showDiscountBreakdown && hasOrderDiscount ? 'Total Harga Diskon (Subtotal)' : 'Subtotal Produk'}</span>
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
                                {order.payment_details?.is_preorder_dp && Number(order.payment_details.remaining_balance || 0) > 0 && (
                                    <>
                                        {Number((order.payment_details as any)?.non_preorder_subtotal || 0) > 0 && (
                                            <>
                                                <div className="flex justify-between text-amber-800 pt-1 border-t border-sand-200">
                                                    <span>Akumulasi Produk Pre-Order (Berlaku DP)</span>
                                                    <span className="font-bold">
                                                        {formatRupiah(Number((order.payment_details as any).preorder_subtotal || 0))}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-brand-700">
                                                    <span>Akumulasi Produk Non Pre-Order (Lunas 100%)</span>
                                                    <span className="font-bold text-brand-950">
                                                        {formatRupiah(Number((order.payment_details as any).non_preorder_subtotal || 0))}
                                                    </span>
                                                </div>
                                            </>
                                        )}
                                        <div className="flex justify-between text-brand-700 pt-1.5 border-t border-sand-200">
                                            <span>Total Tagihan Penuh (100%)</span>
                                            <span className="font-semibold text-brand-900">
                                                {formatRupiah(Number(order.payment_details.full_total_amount || (order.subtotal + order.shipping_cost)) + order.unique_code)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-amber-800">
                                            <span>Dikurangi Sisa Pelunasan ({100 - Number(order.payment_details.dp_percentage || 100)}%)</span>
                                            <span className="font-bold">
                                                -{formatRupiah(Number(order.payment_details.remaining_balance || 0))}
                                            </span>
                                        </div>
                                    </>
                                )}
                                <div className="flex justify-between text-sm sm:text-base font-extrabold text-brand-950 pt-2.5 border-t border-sand-200">
                                    <span>
                                        {order.payment_details?.is_preorder_dp && Number(order.payment_details.dp_percentage || 100) < 100
                                            ? `Total Pembayaran (DP ${order.payment_details.dp_percentage}%)`
                                            : 'Total Pembayaran'}
                                    </span>
                                    <span className="text-brand-800 text-base sm:text-lg">{formatRupiah(order.total_amount)}</span>
                                </div>
                                {order.payment_details?.is_preorder_dp && Number(order.payment_details.remaining_balance || 0) > 0 && (
                                    <div className="p-2 rounded-lg bg-amber-50 text-amber-900 text-[11px] font-semibold border border-amber-200 flex justify-between items-center">
                                        <span>Sisa Pelunasan Saat Barang Siap:</span>
                                        <span className="font-extrabold">{formatRupiah(Number(order.payment_details.remaining_balance || 0))}</span>
                                    </div>
                                )}
                                {isPaid && (
                                    <div className="p-2 rounded-lg bg-emerald-50 text-center font-extrabold text-emerald-800 text-xs tracking-wider border border-emerald-200">
                                        ★ STATUS: LUNAS DIBAYAR ★
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })()}

                {/* Informasi Pembayaran Bank / Pre-Order Pelunasan */}
                {settings.bank_info && (
                    <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                        <span className="font-bold text-slate-800 block mb-1">
                            Informasi Rekening Resmi Pembayaran:
                        </span>
                        <p className="whitespace-pre-line text-slate-600 font-mono text-[11px] leading-relaxed">
                            {settings.bank_info}
                        </p>
                    </div>
                )}

                {/* Syarat Ketentuan & Garansi */}
                {settings.terms && (
                    <div className="mt-4 p-4 rounded-xl bg-amber-50/60 border border-amber-200/70 text-xs text-amber-950">
                        <span className="font-bold block mb-1">Ketentuan Garansi & Pengiriman:</span>
                        <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-900/90 leading-relaxed">
                            {settings.terms
                                .split('\n')
                                .filter((t) => t.trim() !== '')
                                .map((term, idx) => (
                                    <li key={idx}>{term.replace(/^[0-9]+\.\s*/, '')}</li>
                                ))}
                        </ul>
                    </div>
                )}

                {/* Footer Notes & Tanda Tangan Pengesahan */}
                <div className="mt-8 pt-6 border-t border-sand-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-xs">
                    <div className="max-w-md space-y-1">
                        {settings.footer_notes && (
                            <p className="text-brand-700 italic text-[11px] leading-relaxed">
                                &ldquo;{settings.footer_notes}&rdquo;
                            </p>
                        )}
                        <p className="text-[10px] text-brand-400">
                            Faktur ini sah dan diproses otomatis oleh sistem komputerisasi {settings.site_name || 'Alat Kopi Malang'}.
                        </p>
                    </div>

                    {settings.enable_signature !== false && (
                        <div className="text-center sm:text-right shrink-0 min-w-[180px] self-end sm:self-auto">
                            <span className="text-[11px] text-brand-600 block">
                                {settings.signature_city || 'Malang'}, {order.created_at.split(',')[0]}
                            </span>
                            <span className="text-[10px] font-bold text-brand-400 uppercase tracking-wider block mt-0.5">
                                {settings.signer_title || 'Alat Kopi Malang Official'}
                            </span>

                            <div className="h-16 flex items-center justify-center sm:justify-end my-1">
                                {signatureSrc ? (
                                    <img
                                        src={signatureSrc}
                                        alt="Stempel & Tanda Tangan"
                                        className="h-14 object-contain"
                                    />
                                ) : (
                                    <div className="text-[10px] font-mono text-emerald-700 border border-emerald-300 rounded px-2 py-1 bg-emerald-50/50">
                                        [ Divalidasi Sistem ]
                                    </div>
                                )}
                            </div>

                            <span className="font-bold text-brand-950 underline decoration-brand-400 decoration-1 underline-offset-4 block text-xs">
                                {settings.signer_name || 'Finance & Sales Roastery'}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
