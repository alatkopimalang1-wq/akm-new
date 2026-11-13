import React, { useEffect, useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeft,
    Building2,
    Check,
    CheckCircle2,
    Clock,
    Copy,
    Download,
    ExternalLink,
    FileText,
    HelpCircle,
    MapPin,
    MessageCircle,
    Printer,
    QrCode,
    RefreshCw,
    Search,
    ShieldCheck,
    SlidersHorizontal,
    Store,
    Truck,
    Upload,
    X,
} from 'lucide-react';
import { PublicLayout } from '@/layouts/public-layout';
import { formatRupiah } from '@/lib/trans';
import { OrderData } from '@/types/sanubari';
import { trackPurchase } from '@/lib/meta-pixel';

interface OrderShowProps {
    order: OrderData;
    paymentConfig: {
        qris_image_url: string;
        qris_merchant: string;
        qris_nmid: string;
        whatsapp_url: string;
        banks: any;
    };
    pickupConfig?: {
        store_name: string;
        store_address: string;
        store_hours: string;
        notes: string;
        maps_url: string;
    };
}

export default function OrderShowPage({
    order,
    paymentConfig,
    pickupConfig = {
        store_name: 'Alat Kopi Malang (Tlogomas, Malang)',
        store_address: 'Ruko Tlogomas Square Kav. 34, Jl. Raya Tlogomas, Lowokwaru, Kota Malang, Jawa Timur 65144',
        store_hours: 'Buka setiap hari: 09.00 - 23.00 WIB',
        notes: 'Pesanan dapat diambil langsung di kasir Alat Kopi Malang dengan menunjukkan Nomor Pesanan setelah status pesanan Siap.',
        maps_url: 'https://maps.app.goo.gl/PMuxaEtsbEvC4APy7',
    },
}: OrderShowProps) {
    const { flash } = usePage().props as any;

    // Track Meta Pixel Purchase event with deduplication protection against page refreshes
    useEffect(() => {
        if (!order || !order.order_number) return;

        // Valid triggers: Order was just placed in this flow, or payment is already confirmed/paid, or flash message present
        const isEligible = Boolean(order.is_newly_placed || order.payment_status === 'paid' || flash?.success);

        if (isEligible) {
            try {
                const contentIds = order.items && order.items.length > 0
                    ? order.items.map((i) => String(i.sku || i.product_id || i.id)).filter(Boolean)
                    : [];

                const totalValue = Number(order.total_amount || 0);

                trackPurchase(
                    {
                        content_ids: contentIds,
                        content_type: 'product',
                        value: totalValue,
                        currency: 'IDR',
                        num_items: order.items?.reduce((acc, i) => acc + (i.quantity || 1), 0) || 1,
                    },
                    order.order_number
                );
            } catch (e) {
                console.error('Meta Pixel Purchase error', e);
            }
        }
    }, [order.order_number, order.is_newly_placed, order.payment_status]);

    const [copiedField, setCopiedField] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
    const [trackingLoading, setTrackingLoading] = useState(false);
    const [trackingData, setTrackingData] = useState<any>(null);

    const handleFetchTracking = async () => {
        if (!order.tracking_number) return;
        setIsTrackingModalOpen(true);
        if (trackingData) return;

        setTrackingLoading(true);
        try {
            const res = await fetch('/api/shipping/track', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
                body: JSON.stringify({
                    waybill: order.tracking_number,
                    courier: order.shipping_courier,
                    last_phone: order.customer_phone,
                }),
            });
            const data = await res.json();
            setTrackingData(data);
        } catch (err) {
            console.error('Failed to track waybill:', err);
        } finally {
            setTrackingLoading(false);
        }
    };

    const handleCopy = (text: string, fieldName: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(fieldName);
        setTimeout(() => setCopiedField(null), 2500);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const rawBank =
        order.payment_details?.bank_info ||
        (Array.isArray(paymentConfig.banks)
            ? paymentConfig.banks.find((b: any) => b.bank_code?.toLowerCase() === order.payment_channel?.toLowerCase()) || paymentConfig.banks[0]
            : (paymentConfig.banks?.[order.payment_channel || 'bca'] || paymentConfig.banks?.bca)) ||
        {};

    const bankDetails = {
        name: rawBank.bank_name || rawBank.bank || rawBank.name || 'Bank BCA',
        number: rawBank.account_number || rawBank.number || '011-829-9102',
        holder: rawBank.account_holder || rawBank.holder || 'ALAT KOPI MALANG',
    };

    const isPickup =
        order.shipping_courier === 'Ambil di Toko' ||
        order.shipping_courier?.toLowerCase().includes('ambil') ||
        order.shipping_courier?.toLowerCase().includes('pickup');

    return (
        <PublicLayout title={`Instruksi Pembayaran #${order.order_number}`}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32 md:pb-16 space-y-6">
                {/* Back Link */}
                <div className="flex items-center justify-between">
                    <Link
                        href="/shop"
                        className="inline-flex items-center gap-1.5 text-xs text-brand-600 hover:text-brand-950 font-medium transition-colors"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Katalog Kopi</span>
                    </Link>
                    <Link
                        href="/lacak-pesanan"
                        className="text-xs text-brand-600 hover:underline"
                    >
                        Cari Pesanan Lain
                    </Link>
                </div>

                {/* Flash Message Banner */}
                {flash?.success && (
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-800 font-medium flex items-center gap-3 shadow-xs">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        <span>{flash.success}</span>
                    </div>
                )}

                {/* ORDER STATUS HERO CARD */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-200/80 shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sand-200">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-brand-500 font-medium">Nomor Pesanan</span>
                                <button
                                    type="button"
                                    onClick={() => handleCopy(order.order_number, 'order_number')}
                                    className="inline-flex items-center gap-1 text-[11px] text-brand-600 hover:text-brand-900 bg-sand-100 px-2 py-0.5 rounded cursor-pointer"
                                >
                                    <span>#{order.order_number}</span>
                                    {copiedField === 'order_number' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                                </button>
                            </div>
                            <h1 className="text-xl sm:text-2xl font-black text-brand-950 mt-1">
                                {order.payment_status === 'paid'
                                    ? 'Pembayaran Berhasil Diterima'
                                    : order.payment_status === 'verifying'
                                        ? 'Menunggu Verifikasi Pembayaran'
                                        : 'Selesaikan Pembayaran Anda'}
                            </h1>
                            <p className="text-xs text-brand-500 mt-0.5">
                                Dibuat pada: {order.created_at} WIB
                            </p>
                        </div>

                        {/* Status Badges */}
                        <div className="flex flex-wrap items-center gap-2">
                            <span
                                className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                                    order.payment_status === 'paid'
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : order.payment_status === 'verifying'
                                            ? 'bg-blue-100 text-blue-800'
                                            : 'bg-amber-100 text-amber-900'
                                }`}
                            >
                                {order.payment_status === 'paid' ? (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                                )}
                                <span>{order.payment_status_label}</span>
                            </span>

                            <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-sand-100 text-brand-800">
                                {order.status_label}
                            </span>
                        </div>
                    </div>

                    {/* Total Amount Highlight */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-cream-50 border border-sand-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                            <span className="text-xs text-brand-600 font-medium">Total yang Harus Dibayar</span>
                            <div className="text-2xl sm:text-3xl font-black text-brand-950 mt-0.5">
                                {formatRupiah(order.total_amount)}
                            </div>
                            {order.unique_code > 0 && (
                                <p className="text-[11px] text-amber-800 mt-1">
                                    * Termasuk 3 digit kode unik <strong>(+{order.unique_code})</strong> untuk identifikasi mutasi otomatis.
                                </p>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={() => handleCopy(order.total_amount.toString(), 'total')}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-sand-50 border border-sand-300 text-xs font-bold text-brand-900 shadow-xs cursor-pointer transition-all active:scale-95"
                        >
                            {copiedField === 'total' ? (
                                <>
                                    <Check className="w-4 h-4 text-emerald-600" />
                                    <span>Nominal Tersalin!</span>
                                </>
                            ) : (
                                <>
                                    <Copy className="w-4 h-4 text-brand-600" />
                                    <span>Salin Total Nominal</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* INVOICE LUNAS DOWNLOAD BANNER (JIKA SUDAH LUNAS / DIKONFIRMASI) */}
                {order.payment_status === 'paid' && (
                    <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-50 via-white to-sand-50 border-2 border-emerald-300 shadow-sm space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                                    <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
                                </div>
                                <div className="space-y-1">
                                    <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                                        <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                                        Pesanan Dikonfirmasi · Lunas
                                    </div>
                                    <h2 className="text-lg sm:text-xl font-extrabold text-brand-950">
                                        Invoice Pembayaran Resmi Siap Diunduh
                                    </h2>
                                    <p className="text-xs text-brand-600 leading-relaxed max-w-xl">
                                        Pembayaran pesanan Anda sebesar <strong>{formatRupiah(order.total_amount)}</strong> telah lunas diverifikasi {order.paid_at ? `pada ${order.paid_at} WIB` : ''}. Anda dapat langsung mengunduh invoice resmi bertanda <strong>LUNAS</strong> dalam format PDF.
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
                                <a
                                    href={`/pesanan/${order.order_number}/invoice?download=1`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer"
                                >
                                    <Download className="w-4 h-4" />
                                    <span>Download Invoice PDF (Lunas)</span>
                                </a>

                                <a
                                    href={`/pesanan/${order.order_number}/invoice`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-sand-300 bg-white hover:bg-sand-50 text-brand-900 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                                >
                                    <Printer className="w-4 h-4 text-accent-copper" />
                                    <span>Cetak Faktur</span>
                                </a>
                            </div>
                        </div>
                    </div>
                )}

                {/* PAYMENT METHOD DETAILS */}
                {order.payment_method === 'qris' ? (
                    /* ================= QRIS INSTRUCTIONS ================= */
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-200/80 shadow-xs space-y-6">
                        <div className="flex items-center gap-3 pb-3 border-b border-sand-200">
                            <div className="w-10 h-10 rounded-xl bg-brand-700 text-white flex items-center justify-center">
                                <QrCode className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-brand-950">
                                    Instruksi Pembayaran QRIS Toko Resmi
                                </h2>
                                <p className="text-xs text-brand-500">
                                    Merchant: <strong>{paymentConfig.qris_merchant}</strong> · NMID: {paymentConfig.qris_nmid}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                            {/* QRIS Code Box */}
                            <div className="md:col-span-6 flex flex-col items-center justify-center space-y-4">
                                <div className="p-3 bg-white rounded-2xl border-2 border-sand-200 shadow-sm max-w-[280px] sm:max-w-[320px] w-full">
                                    <img
                                        src={paymentConfig.qris_image_url}
                                        alt="QRIS Alat Kopi Malang"
                                        className="w-full h-auto rounded-xl object-contain"
                                    />
                                </div>
                                <a
                                    href={paymentConfig.qris_image_url}
                                    download="QRIS-Alat Kopi Malang-Roastery.svg"
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sand-100 hover:bg-sand-200 text-xs font-semibold text-brand-900 transition-colors"
                                >
                                    <Download className="w-3.5 h-3.5" />
                                    <span>Unduh Gambar QRIS</span>
                                </a>
                            </div>

                            {/* Step by Step Guide */}
                            <div className="md:col-span-6 space-y-4 text-xs text-brand-800">
                                <h3 className="font-bold text-sm text-brand-950 uppercase tracking-wider">
                                    Cara Pembayaran Melalui QRIS:
                                </h3>
                                <ol className="space-y-3 list-decimal list-inside leading-relaxed text-brand-700">
                                    <li>
                                        Buka aplikasi <strong>m-Banking</strong> (BCA, Mandiri, BRI, BNI) atau <strong>e-Wallet</strong> (GoPay, OVO, DANA, ShopeePay, LinkAja).
                                    </li>
                                    <li>
                                        Pilih menu <strong>Scan / Bayar via QRIS</strong>.
                                    </li>
                                    <li>
                                        Arahkan kamera smartphone ke kode QRIS di samping atau pilih gambar dari galeri Anda.
                                    </li>
                                    <li>
                                        Pastikan nama merchant penerima tertera: <strong className="text-brand-950">{paymentConfig.qris_merchant}</strong>.
                                    </li>
                                    <li>
                                        Masukkan nominal tepat <strong>{formatRupiah(order.total_amount)}</strong> lalu konfirmasi PIN transaksi Anda.
                                    </li>
                                    <li>
                                        Simpan tangkapan layar / bukti struk pembayaran untuk diunggah di bawah ini.
                                    </li>
                                </ol>
                            </div>
                        </div>
                    </div>
                ) : order.payment_method === 'bank_transfer' ? (
                    /* ================= BANK TRANSFER INSTRUCTIONS ================= */
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-200/80 shadow-xs space-y-6">
                        <div className="flex items-center gap-3 pb-3 border-b border-sand-200">
                            <div className="w-10 h-10 rounded-xl bg-brand-700 text-white flex items-center justify-center">
                                <Building2 className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-brand-950">
                                    Instruksi Transfer Bank ({bankDetails.name})
                                </h2>
                                <p className="text-xs text-brand-500">
                                    Transfer manual ke rekening resmi toko Alat Kopi Malang.
                                </p>
                            </div>
                        </div>

                        {/* Account Box */}
                        <div className="p-6 rounded-2xl bg-cream-50 border border-sand-200 space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div>
                                    <span className="text-xs text-brand-600 font-semibold">{bankDetails.name}</span>
                                    <div className="text-2xl sm:text-3xl font-mono font-black text-brand-950 tracking-wider">
                                        {bankDetails.number}
                                    </div>
                                    <div className="text-xs text-brand-700 font-medium mt-1">
                                        Atas Nama: <strong>{bankDetails.holder}</strong>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => handleCopy(bankDetails.number.replace(/\D/g, ''), 'bank_acc')}
                                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand-700 hover:bg-brand-800 text-white text-xs font-bold shadow-xs cursor-pointer transition-all active:scale-95"
                                >
                                    {copiedField === 'bank_acc' ? (
                                        <>
                                            <Check className="w-4 h-4 text-emerald-300" />
                                            <span>Nomor Rekening Tersalin!</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-4 h-4" />
                                            <span>Salin Nomor Rekening</span>
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
                                <strong>Penting:</strong> Pastikan Anda mentransfer tepat sejumlah <strong>{formatRupiah(order.total_amount)}</strong> (termasuk kode unik) agar pembayaran dapat diverifikasi secara instan.
                            </div>
                        </div>

                        {/* Transfer Steps */}
                        <div className="space-y-3 text-xs text-brand-700">
                            <h3 className="font-bold text-sm text-brand-950 uppercase tracking-wider">
                                Petunjuk Transfer via Mobile Banking:
                            </h3>
                            <ol className="space-y-2 list-decimal list-inside leading-relaxed">
                                <li>Buka aplikasi m-Banking Anda, pilih menu <strong>Transfer Antar Bank / Sesama Bank</strong>.</li>
                                <li>Pilih tujuan <strong>{bankDetails.name}</strong> dan masukkan nomor rekening di atas.</li>
                                <li>Ketikkan nominal transfer tepat <strong>{formatRupiah(order.total_amount)}</strong>.</li>
                                <li>Pada berita transfer (jika tersedia), cantumkan nomor pesanan: <strong>{order.order_number}</strong>.</li>
                                <li>Simpan struk / bukti transfer berhasil untuk diunggah di formulir konfirmasi di bawah.</li>
                            </ol>
                        </div>
                    </div>
                ) : (
                    /* ================= WHATSAPP ORDER INSTRUCTIONS ================= */
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-200/80 shadow-xs space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#25D366] text-white flex items-center justify-center">
                                <MessageCircle className="w-5 h-5 fill-white" />
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-brand-950">Pesanan WhatsApp Resmi</h2>
                                <p className="text-xs text-brand-500">
                                    Pesanan Anda siap diteruskan ke WhatsApp Alat Kopi Malang.
                                </p>
                            </div>
                        </div>
                        <p className="text-xs text-brand-700 leading-relaxed">
                            Admin kami akan langsung memverifikasi ketersediaan stok biji kopi segar dan opsi pengiriman Anda.
                        </p>
                    </div>
                )}

                {/* UPLOAD PAYMENT PROOF SECTION */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-200/80 shadow-xs space-y-5">
                    <div className="flex items-center justify-between pb-3 border-b border-sand-200">
                        <div>
                            <h2 className="text-base font-bold text-brand-950 flex items-center gap-2">
                                <Upload className="w-4 h-4 text-brand-700" />
                                <span>Konfirmasi & Bukti Pembayaran</span>
                            </h2>
                            <p className="text-xs text-brand-500">
                                Upload struk transfer atau tangkapan layar pembayaran untuk mempercepat pengiriman kopi Anda.
                            </p>
                        </div>

                        {order.payment_proof && (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                                Bukti Terunggah
                            </span>
                        )}
                    </div>

                    {order.payment_proof && (
                        <div className="p-4 rounded-2xl bg-cream-50 border border-sand-200 flex items-center gap-4">
                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-sand-200 border border-sand-300 flex-shrink-0">
                                <img
                                    src={order.payment_proof}
                                    alt="Bukti Transfer"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="text-xs text-brand-800 flex-1">
                                <p className="font-bold text-brand-950">Bukti Pembayaran Tersimpan</p>
                                <p className="text-brand-600 mt-0.5">
                                    Status saat ini: <strong>{order.payment_status_label}</strong>. Roaster kami sedang memverifikasi struk Anda.
                                </p>
                            </div>
                            <a
                                href={order.payment_proof}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs text-brand-700 hover:underline flex items-center gap-1 font-semibold"
                            >
                                <span>Buka</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                        </div>
                    )}

                    {/* Upload Form */}
                    <form
                        action={`/pesanan/${order.order_number}/upload-bukti`}
                        method="POST"
                        encType="multipart/form-data"
                        className="space-y-4"
                    >
                        <input
                            type="hidden"
                            name="_token"
                            value={(document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || ''}
                        />

                        <div className="space-y-2">
                            <label className="block text-xs font-semibold text-brand-900">
                                Pilih File Bukti Transfer (JPG, PNG, atau WEBP, Maks. 5MB)
                            </label>
                            <input
                                type="file"
                                name="payment_proof"
                                accept="image/jpeg,image/png,image/jpg,image/webp"
                                required
                                onChange={handleFileChange}
                                className="w-full text-xs text-brand-800 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-brand-700 file:text-white hover:file:bg-brand-800 cursor-pointer"
                            />
                        </div>

                        {previewUrl && (
                            <div className="p-3 rounded-xl bg-sand-50 border border-sand-200 max-w-xs">
                                <p className="text-[11px] text-brand-600 font-semibold mb-2">Pratinjau File:</p>
                                <img src={previewUrl} alt="Preview" className="w-full max-h-48 object-contain rounded-lg" />
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={!selectedFile || isUploading}
                                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer disabled:opacity-50"
                            >
                                <Upload className="w-4 h-4" />
                                <span>{order.payment_proof ? 'Ganti Bukti Transfer' : 'Kirim Bukti Pembayaran'}</span>
                            </button>

                            {/* WhatsApp Fast Confirmation Button */}
                            <a
                                href={paymentConfig.whatsapp_url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer"
                            >
                                <MessageCircle className="w-4 h-4 fill-white" />
                                <span>Konfirmasi Cepat via WhatsApp</span>
                            </a>
                        </div>
                    </form>
                </div>

                {/* ORDER DETAILS & SHIPPING SUMMARY */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-200/80 shadow-xs space-y-6">
                    <div className="flex items-center justify-between pb-3 border-b border-sand-200">
                        <h2 className="text-base font-bold text-brand-950">
                            Rincian Barang yang Dipesan
                        </h2>
                        <div className="flex items-center gap-2">
                            <a
                                href={`/pesanan/${order.order_number}/invoice?download=1`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                            >
                                <Download className="w-3.5 h-3.5" />
                                <span>Download PDF {order.payment_status === 'paid' ? '(Lunas)' : ''}</span>
                            </a>
                            <a
                                href={`/pesanan/${order.order_number}/invoice`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-sand-200 bg-sand-50 hover:bg-sand-100 text-brand-800 text-xs font-bold transition-colors cursor-pointer"
                            >
                                <FileText className="w-3.5 h-3.5 text-accent-copper" />
                                <span>Lihat Invoice</span>
                            </a>
                        </div>
                    </div>

                    <div className="divide-y divide-sand-200/60">
                        {order.items.map((item) => (
                            <div key={item.id} className="py-3.5 flex items-start justify-between gap-4">
                                <div className="space-y-1 flex-1 min-w-0">
                                    <h3 className="text-sm font-bold text-brand-950">
                                        {item.product_name}
                                    </h3>
                                    <p className="text-xs text-accent-copper font-medium">
                                        Kemasan: {item.variant_label} · Gilingan: {item.grind_option || 'Biji Utuh'}
                                    </p>
                                    {(item.custom_notes || (item as any).customNotes) && (
                                        <div className="mt-1.5 p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/70 text-xs text-brand-900 leading-snug">
                                            <div className="flex items-center gap-1.5 font-bold text-accent-copper text-[11px] uppercase tracking-wider">
                                                <SlidersHorizontal className="w-3.5 h-3.5" />
                                                <span>Rasio & Komposisi Kopi (C.Y.B.R):</span>
                                            </div>
                                            <p className="font-semibold text-brand-950 mt-1">
                                                {item.custom_notes || (item as any).customNotes}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="text-right flex-shrink-0">
                                    <span className="text-xs text-brand-500 font-medium">
                                        {item.quantity}x @ {formatRupiah(item.price)}
                                    </span>
                                    <div className="text-sm font-extrabold text-brand-950">
                                        {formatRupiah(item.subtotal)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Breakdown */}
                    <div className="pt-4 border-t border-sand-200 space-y-2 text-xs">
                        <div className="flex items-center justify-between text-brand-600">
                            <span>Subtotal Produk</span>
                            <span className="font-semibold text-brand-950">{formatRupiah(order.subtotal)}</span>
                        </div>
                        <div className="flex items-center justify-between text-brand-600">
                            <span>
                                {isPickup ? 'Metode Pengambilan' : `Biaya Pengiriman ${order.shipping_courier ? `(${order.shipping_courier} ${order.shipping_service || ''})` : ''}`}
                            </span>
                            <span className={order.shipping_cost === 0 ? 'text-emerald-700 font-bold' : 'font-semibold text-brand-950'}>
                                {order.shipping_cost === 0 ? (isPickup ? 'GRATIS (Ambil di Toko)' : 'GRATIS') : formatRupiah(order.shipping_cost)}
                            </span>
                        </div>
                        {order.shipping_etd && (
                            <div className="flex items-center justify-between text-brand-500 text-[11px]">
                                <span>{isPickup ? 'Waktu Pengambilan' : 'Estimasi Waktu Pengiriman'}</span>
                                <span>{isPickup ? 'Bisa diambil saat status pesanan Siap' : order.shipping_etd}</span>
                            </div>
                        )}
                        {order.unique_code > 0 && (
                            <div className="flex items-center justify-between text-brand-600">
                                <span>Kode Unik Verifikasi</span>
                                <span className="font-semibold text-brand-950">+{order.unique_code}</span>
                            </div>
                        )}
                        <div className="flex items-center justify-between text-base font-extrabold text-brand-950 pt-2 border-t border-sand-200">
                            <span>Total Pembayaran</span>
                            <span className="text-brand-700 text-lg">{formatRupiah(order.total_amount)}</span>
                        </div>
                    </div>

                    {/* Customer & Address / Pickup Details */}
                    <div className="pt-4 border-t border-sand-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        {isPickup ? (
                            <div className="space-y-2 p-3.5 rounded-xl bg-sand-100/70 border border-sand-200">
                                <div className="flex items-center gap-1.5 text-brand-950 font-bold uppercase tracking-wider text-[11px]">
                                    <Store className="w-4 h-4 text-brand-700" />
                                    <span>Lokasi Pengambilan Toko (Self Pick Up)</span>
                                </div>
                                <div>
                                    <h4 className="font-extrabold text-brand-950 text-xs">
                                        {pickupConfig?.store_name || 'Alat Kopi Malang (Tlogomas, Malang)'}
                                    </h4>
                                    <p className="text-brand-700 leading-relaxed mt-0.5">
                                        {pickupConfig?.store_address || order.customer_address}
                                    </p>
                                    <p className="text-[11px] text-brand-600 font-medium mt-1">
                                        🕒 {pickupConfig?.store_hours || 'Buka setiap hari: 09.00 - 23.00 WIB'}
                                    </p>
                                </div>
                                <div className="p-2.5 rounded-lg bg-white border border-sand-200 text-[11px] text-brand-700 space-y-1">
                                    <span className="font-bold text-brand-900 block">💡 Petunjuk Pengambilan:</span>
                                    <span>
                                        {pickupConfig?.notes || 'Tunjukkan Nomor Pesanan kepada barista/kasir saat mengambil pesanan setelah status Siap.'}
                                    </span>
                                </div>
                                {pickupConfig?.maps_url && (
                                    <a
                                        href={pickupConfig.maps_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 text-xs font-bold text-accent-copper hover:underline pt-0.5"
                                    >
                                        <MapPin className="w-3.5 h-3.5" />
                                        <span>Buka di Google Maps</span>
                                        <ExternalLink className="w-3 h-3" />
                                    </a>
                                )}
                                {order.customer_notes && (
                                    <p className="text-brand-600 italic text-[11px] pt-1 border-t border-sand-200/60">
                                        Catatan Anda: "{order.customer_notes}"
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-1">
                                <span className="font-bold text-brand-950 uppercase tracking-wider text-[11px]">
                                    Alamat Pengiriman
                                </span>
                                <p className="text-brand-700 leading-relaxed">
                                    {order.customer_address}
                                    {order.shipping_city && `, ${order.shipping_city}`}
                                    {order.shipping_province && `, ${order.shipping_province}`}
                                </p>
                                {order.shipping_courier && (
                                    <p className="text-brand-800 font-semibold mt-1 flex items-center gap-1.5">
                                        <Truck className="w-3.5 h-3.5 text-accent-copper" />
                                        <span>Kurir: {order.shipping_courier} ({order.shipping_service}) · {order.total_weight_grams}g</span>
                                    </p>
                                )}
                                {order.tracking_number ? (
                                    <div className="mt-3 p-3.5 rounded-2xl bg-sand-100/90 border border-sand-300 space-y-2.5">
                                        <div className="flex items-center justify-between gap-2">
                                            <div>
                                                <span className="text-[10px] text-brand-500 font-bold uppercase tracking-wider block">No. Resi Pengiriman (AWB)</span>
                                                <span className="text-sm font-mono font-black text-brand-950 tracking-wide">{order.tracking_number}</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleCopy(order.tracking_number!, 'tracking_number')}
                                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white hover:bg-sand-50 border border-sand-300 text-brand-900 text-[11px] font-bold shadow-2xs transition-colors cursor-pointer"
                                            >
                                                {copiedField === 'tracking_number' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                                <span>{copiedField === 'tracking_number' ? 'Tersalin' : 'Salin'}</span>
                                            </button>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-sand-200">
                                            <button
                                                type="button"
                                                onClick={handleFetchTracking}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-800 hover:bg-brand-900 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                                            >
                                                <Search className="w-3.5 h-3.5" />
                                                <span>Lacak Paket Live (RajaOngkir)</span>
                                            </button>

                                            <a
                                                href={`/pesanan/${order.order_number}/shipping-label`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-sand-50 border border-sand-300 text-brand-800 text-xs font-bold transition-all"
                                            >
                                                <Printer className="w-3.5 h-3.5 text-accent-copper" />
                                                <span>Label AWB (100x150)</span>
                                            </a>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mt-2.5 flex items-center gap-2">
                                        <a
                                            href={`/pesanan/${order.order_number}/shipping-label`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sand-100 hover:bg-sand-200 text-brand-800 text-xs font-bold transition-colors"
                                        >
                                            <Printer className="w-3.5 h-3.5 text-accent-copper" />
                                            <span>Lihat Label Pengiriman</span>
                                        </a>
                                    </div>
                                )}
                                {order.customer_notes && (
                                    <p className="text-brand-500 italic mt-1">
                                        Catatan: {order.customer_notes}
                                    </p>
                                )}
                            </div>
                        )}

                        <div className="space-y-1">
                            <span className="font-bold text-brand-950 uppercase tracking-wider text-[11px]">
                                {isPickup ? 'Data Pengambil Pesanan' : 'Penerima / Kontak'}
                            </span>
                            <p className="text-brand-900 font-bold">
                                {order.customer_name}
                            </p>
                            <p className="text-brand-700">
                                WhatsApp: {order.customer_phone}
                            </p>
                            {order.customer_email && (
                                <p className="text-brand-700">
                                    Email: {order.customer_email}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* LIVE TRACKING MODAL */}
            {isTrackingModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
                    <div className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-sand-200 overflow-hidden flex flex-col max-h-[85vh]">
                        {/* Modal Header */}
                        <div className="px-6 py-4 bg-brand-950 text-white flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <Truck className="w-5 h-5 text-accent-copper" />
                                <div>
                                    <h3 className="text-sm font-extrabold tracking-wide">Status Pengiriman Real-Time</h3>
                                    <p className="text-[11px] text-brand-300">RajaOngkir Enterprise Pro Tracking</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsTrackingModalOpen(false)}
                                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto space-y-4">
                            {trackingLoading ? (
                                <div className="py-12 text-center space-y-3">
                                    <div className="w-10 h-10 border-3 border-brand-700 border-t-transparent rounded-full animate-spin mx-auto" />
                                    <p className="text-xs text-brand-600 font-medium">Menghubungkan ke API RajaOngkir & server ekspedisi...</p>
                                </div>
                            ) : trackingData?.success ? (
                                <div className="space-y-4">
                                    {/* Summary Card */}
                                    <div className="p-4 rounded-2xl bg-cream-50 border border-sand-200 space-y-2">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-brand-600">Ekspedisi:</span>
                                            <span className="font-bold text-brand-950">{trackingData.courier_name}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-brand-600">Nomor Resi:</span>
                                            <span className="font-mono font-bold text-accent-copper">{trackingData.waybill}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-brand-600">Status Terkini:</span>
                                            <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${trackingData.delivered ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                                                {trackingData.status}
                                            </span>
                                        </div>
                                        {trackingData.status_label && (
                                            <p className="text-[11px] text-brand-700 pt-1 border-t border-sand-200">
                                                {trackingData.status_label}
                                            </p>
                                        )}
                                    </div>

                                    {/* Timeline Manifest */}
                                    <div className="space-y-3">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-brand-900">
                                            Riwayat Perjalanan Paket
                                        </h4>
                                        {trackingData.history && trackingData.history.length > 0 ? (
                                            <div className="relative border-l-2 border-brand-200 pl-4 space-y-4 ml-2">
                                                {trackingData.history.map((event: any, idx: number) => (
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
                                    {trackingData?.message || 'Data pelacakan belum tersedia dari server ekspedisi.'}
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-3 bg-sand-50 border-t border-sand-200 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setIsTrackingModalOpen(false)}
                                className="px-4 py-2 rounded-xl bg-brand-900 hover:bg-brand-950 text-white text-xs font-bold transition-colors cursor-pointer"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </PublicLayout>
    );
}

