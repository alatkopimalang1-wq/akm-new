import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowLeft, CheckCircle2, Clock, FileCheck2, MessageCircle, ShieldCheck } from 'lucide-react';
import { PublicLayout } from '@/layouts/public-layout';

interface PreOrderTermsSection {
    title: string;
    content: string;
}

interface PreOrderTermsPageProps {
    page?: {
        hero_badge?: string;
        hero_title?: string;
        hero_subtitle?: string;
        intro_text?: string;
        sections?: PreOrderTermsSection[];
        cta_title?: string;
        cta_description?: string;
        cta_button_text?: string;
        whatsapp_number?: string;
        last_updated?: string;
    };
}

const defaultSections: PreOrderTermsSection[] = [
    {
        title: '1. Mekanisme & Konfirmasi Pemesanan',
        content:
            '• Setiap pesanan produk berstatus Pre-Order akan dikonfirmasi langsung oleh tim Alat Kopi Malang melalui WhatsApp atau kontak resmi yang terdaftar saat checkout.\n• Spesifikasi unit (warna, tegangan listrik, tipe burr, atau varian ukuran) akan diverifikasi kembali bersama pembeli sebelum pesanan diproses ke distributor resmi.\n• Kuota Pre-Order bersifat terbatas mengikuti ketersediaan batch pengiriman berjalan.',
    },
    {
        title: '2. Ketentuan Pembayaran & Down Payment (DP)',
        content:
            '• Untuk produk Pre-Order kategori aksesoris dan alat seduh manual, pembayaran dilakukan secara penuh (100%) saat pemesanan.\n• Untuk mesin espresso komersial dan grinder skala kafe, pembeli dapat melakukan pembayaran penuh atau Down Payment (DP) minimal 50% sesuai kesepakatan tertulis melalui invoice resmi Alat Kopi Malang.\n• Pelunasan sisa pembayaran dilakukan setelah unit tiba di gudang/showroom Alat Kopi Malang dan siap dikirimkan ke alamat pembeli.',
    },
    {
        title: '3. Estimasi Waktu Kedatangan & Pengiriman',
        content:
            '• Estimasi waktu tunggu (lead time) produk Pre-Order berkisar antara 7 hingga 30 hari kerja tergantung ketersediaan stok pada prinsipal brand dan jalur logistik/kepabeanan.\n• Tim Alat Kopi Malang akan memberikan pembaruan status pesanan secara berkala hingga unit tiba di Malang.\n• Sebelum dikirim ke alamat tujuan, setiap unit mesin dan peralatan elektronik akan melalui tahap Quality Control (QC) dan uji fungsi oleh teknisi kami.',
    },
    {
        title: '4. Kebijakan Pembatalan & Perubahan Pesanan',
        content:
            '• Pesanan Pre-Order yang telah dikonfirmasi dan diproses ke distributor tidak dapat dibatalkan atau diubah sepihak oleh pembeli.\n• Apabila terjadi kendala ketersediaan stok dari pihak prinsipal/distributor yang menyebabkan pesanan tidak dapat dipenuhi melebihi batas waktu yang disepakati, maka seluruh dana yang telah dibayarkan akan dikembalikan 100% (Full Refund) kepada pembeli.',
    },
    {
        title: '5. Jaminan Keaslian & Garansi Resmi',
        content:
            '• Seluruh produk Pre-Order di Alat Kopi Malang dijamin 100% Original dan bergaransi resmi sesuai ketentuan masing-masing brand.\n• Pembeli berhak mendapatkan dukungan instalasi, konsultasi teknis penggunaan alat, serta layanan purna jual (after-sales service) melalui teknisi Alat Kopi Malang.',
    },
];

export default function PreorderTermsPage({ page }: PreOrderTermsPageProps) {
    const heroBadge = page?.hero_badge || 'Kebijakan & Informasi Resmi';
    const heroTitle = page?.hero_title || 'Syarat & Ketentuan Pre-Order';
    const heroSubtitle =
        page?.hero_subtitle ||
        'Panduan lengkap mengenai mekanisme pemesanan, estimasi waktu kedatangan, pembayaran, serta jaminan garansi resmi untuk produk berstatus Pre-Order di Alat Kopi Malang.';
    const introText =
        page?.intro_text ||
        'Produk dengan label Pre-Order merupakan unit peralatan kopi, mesin espresso komersial, grinder, atau suku cadang khusus yang dipesan secara khusus (indent) dari distributor resmi maupun prinsipal brand terkait untuk menjamin keaslian dan kondisi unit terbaru.';
    const sections = page?.sections && page.sections.length > 0 ? page.sections : defaultSections;
    const ctaTitle = page?.cta_title || 'Butuh Konsultasi Sebelum Pre-Order?';
    const ctaDescription =
        page?.cta_description ||
        'Tim spesialis peralatan kopi kami siap membantu Anda memastikan spesifikasi mesin, daya listrik, dan estimasi jadwal pengiriman terbaik untuk kebutuhan kedai maupun rumah Anda.';
    const ctaButtonText = page?.cta_button_text || 'Konsultasi via WhatsApp';
    const whatsappNumber = (page?.whatsapp_number || '6285121930454').replace(/[^0-9]/g, '');
    const lastUpdated = page?.last_updated || 'Diperbarui oleh Manajemen Alat Kopi Malang';

    const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        'Halo Alat Kopi Malang! Saya ingin berkonsultasi mengenai Syarat & Ketentuan Pre-Order produk.'
    )}`;

    return (
        <PublicLayout title={heroTitle}>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 space-y-8 sm:space-y-10">
                {/* Back Navigation */}
                <div>
                    <Link
                        href="/shop"
                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-brand-600 hover:text-brand-950 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Kembali ke Katalog Produk</span>
                    </Link>
                </div>

                {/* Hero Banner */}
                <div className="rounded-3xl bg-brand-950 text-white p-6 sm:p-10 shadow-md relative overflow-hidden">
                    <div className="relative z-10 space-y-3 sm:space-y-4">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-extrabold uppercase tracking-wider">
                                <FileCheck2 className="w-3.5 h-3.5" />
                                <span>{heroBadge}</span>
                            </span>
                            {lastUpdated && (
                                <span className="text-xs text-white/60 font-medium">
                                    • {lastUpdated}
                                </span>
                            )}
                        </div>

                        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white">
                            {heroTitle}
                        </h1>

                        <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-3xl">
                            {heroSubtitle}
                        </p>
                    </div>
                </div>

                {/* Key Highlights Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    <div className="p-4 rounded-2xl bg-white border border-sand-200/90 shadow-2xs flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-xs sm:text-sm font-extrabold text-brand-950 uppercase tracking-wide">
                                100% Original Resmi
                            </h3>
                            <p className="text-xs text-brand-600 mt-0.5 leading-relaxed">
                                Jaminan unit asli langsung dari prinsipal & distributor resmi.
                            </p>
                        </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white border border-sand-200/90 shadow-2xs flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-brand-700/10 text-brand-700 flex items-center justify-center shrink-0">
                            <Clock className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-xs sm:text-sm font-extrabold text-brand-950 uppercase tracking-wide">
                                Update Berkala
                            </h3>
                            <p className="text-xs text-brand-600 mt-0.5 leading-relaxed">
                                Informasi jadwal pengiriman transparan hingga unit tiba.
                            </p>
                        </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white border border-sand-200/90 shadow-2xs flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-600/10 text-emerald-700 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-xs sm:text-sm font-extrabold text-brand-950 uppercase tracking-wide">
                                QC & Garansi Penuh
                            </h3>
                            <p className="text-xs text-brand-600 mt-0.5 leading-relaxed">
                                Melalui proses uji fungsi & kalibrasi teknisi sebelum dikirim.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Intro Highlight Box */}
                {introText && (
                    <div className="rounded-2xl bg-amber-50/80 border border-amber-200/80 p-4 sm:p-6 text-sm sm:text-base text-brand-900 leading-relaxed">
                        {introText}
                    </div>
                )}

                {/* Terms & Conditions Sections */}
                <div className="space-y-4 sm:space-y-5">
                    {sections.map((sec, idx) => (
                        <div
                            key={idx}
                            className="rounded-2xl bg-white border border-sand-200/90 p-5 sm:p-7 shadow-2xs space-y-3"
                        >
                            <h2 className="text-base sm:text-lg font-extrabold text-brand-950 tracking-tight">
                                {sec.title}
                            </h2>
                            <div className="text-sm sm:text-base text-brand-800 leading-relaxed whitespace-pre-line">
                                {sec.content}
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA Consultation Box */}
                <div className="rounded-3xl bg-sand-200/60 border border-sand-300/80 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                    <div className="space-y-1.5 max-w-xl">
                        <h3 className="text-lg sm:text-xl font-extrabold text-brand-950">
                            {ctaTitle}
                        </h3>
                        <p className="text-xs sm:text-sm text-brand-700 leading-relaxed">
                            {ctaDescription}
                        </p>
                    </div>
                    <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand-700 hover:bg-brand-800 active:bg-brand-900 text-white text-xs sm:text-sm font-bold uppercase tracking-wider shadow-xs transition-all shrink-0 w-full sm:w-auto"
                    >
                        <MessageCircle className="w-4 h-4" />
                        <span>{ctaButtonText}</span>
                    </a>
                </div>
            </div>
        </PublicLayout>
    );
}
