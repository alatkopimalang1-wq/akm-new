import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import {
    ArrowRight,
    Check,
    MessageCircle,
} from 'lucide-react';
import { PublicLayout } from '@/layouts/public-layout';

const resolveImageUrl = (img?: string | null, fallback = '') => {
    if (!img) return fallback;
    if (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('blob:')) return img;
    const clean = img.startsWith('/') ? img : `/${img}`;
    if (clean.startsWith('/storage/')) return clean;
    return `/storage${clean}`;
};

const getDesktopGridClass = (cols: string | number) => {
    switch (String(cols)) {
        case '1': return 'lg:grid-cols-1';
        case '2': return 'lg:grid-cols-2';
        case '4': return 'lg:grid-cols-4';
        case '5': return 'lg:grid-cols-5';
        case '6': return 'lg:grid-cols-6';
        case '3':
        default: return 'lg:grid-cols-3';
    }
};

const getTabletGridClass = (cols: string | number) => {
    switch (String(cols)) {
        case '1': return 'md:grid-cols-1';
        case '3': return 'md:grid-cols-3';
        case '4': return 'md:grid-cols-4';
        case '2':
        default: return 'md:grid-cols-2';
    }
};

const getMobileGridClass = (cols: string | number) => {
    switch (String(cols)) {
        case '2': return 'grid-cols-2';
        case '1':
        default: return 'grid-cols-1';
    }
};

const getAspectClass = (aspect?: string) => {
    switch (aspect) {
        case 'aspect-16/9': return 'aspect-16/9';
        case 'aspect-square': return 'aspect-square';
        case 'aspect-auto': return 'aspect-auto';
        case 'aspect-4/3':
        default: return 'aspect-4/3';
    }
};

interface RoastingPageProps {
    page?: {
        hero_badge?: string;
        hero_title?: string;
        hero_description?: string;
        hero_image?: string;
        packages?: Array<{
            name: string;
            capacity?: string;
            price?: string;
            badge?: string;
            is_popular?: boolean;
            description?: string;
            features?: string | string[];
        }>;
        gallery_title?: string;
        gallery_subtitle?: string;
        grid_desktop?: number | string;
        grid_tablet?: number | string;
        grid_mobile?: number | string;
        image_aspect?: string;
        gallery_images?: Array<{ image: string; caption?: string }>;
        whatsapp_number?: string;
        form_title?: string;
        form_subtitle?: string;
    };
}

export default function RoastingPage({ page }: RoastingPageProps) {
    const heroBadge = page?.hero_badge || 'Layanan Roasting Kopi Profesional';
    const heroTitle = page?.hero_title || 'Jasa Roasting Biji Kopi Presisi & Profil Kustom';
    const heroDesc = page?.hero_description || 'Percayakan biji kopi mentah (green bean) pilihan Anda kepada roaster berpengalaman kami. Didukung mesin roasting modern bersistem airflow digital, pemantauan kurva artisan, dan quality control sensorik cupping.';
    const heroImage = page?.hero_image
        ? resolveImageUrl(page.hero_image)
        : 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1200&q=80';

    const packages = (page?.packages && page.packages.length > 0) ? page.packages : [
        {
            name: 'Sample & R&D Profile',
            capacity: '1 – 3 kg',
            price: 'Rp 45.000 / kg',
            badge: 'Riset Resep',
            is_popular: false,
            description: 'Ideal untuk riset profil rasa baru atau pengujian sampel green bean sebelum komitmen skala besar.',
            features: [
                'Perekaman kurva Artisan',
                'Uji cupping & sensorik notes',
                'Opsi profil Filter & Espresso',
                'Kemasan sample standing pouch',
            ],
        },
        {
            name: 'Batch Komersial (Kedai Kopi)',
            capacity: '5 – 30 kg',
            price: 'Rp 28.000 / kg',
            badge: 'Paling Populer',
            is_popular: true,
            description: 'Pilihan utama kedai kopi dan brand independen yang membutuhkan pasokan houseblend atau single origin rutin mingguan.',
            features: [
                'Profil sangrai eksklusif tersimpan',
                'Jaminan konsistensi antar-batch',
                'Proses destoner pembersih kerikil',
                'Pengemasan standing pouch dengan valve',
                'Diskon volume untuk kontrak bulanan',
            ],
        },
        {
            name: 'Batch Skala Besar & Maklon',
            capacity: '> 50 kg',
            price: 'Rp 22.000 / kg',
            badge: 'Harga Grosir',
            is_popular: false,
            description: 'Layanan maklon sangrai volume besar untuk roastery partner, distributor, dan pengadaan oleh-oleh / korporat.',
            features: [
                'Kapasitas sangrai terjadwal prioritas',
                'Layanan labeling & sablon kemasan',
                'Laporan quality control lengkap',
                'Pengiriman via kargo darat/udara murah',
            ],
        },
    ];

    const galleryTitle = page?.gallery_title || 'Galeri Fasilitas & Proses Sangrai';
    const gallerySubtitle = page?.gallery_subtitle || 'Dokumentasi studio sangrai, mesin roasting, dan quality control cupping di Sanubari Roastery Malang.';
    const gridDesktop = page?.grid_desktop ?? '3';
    const gridTablet = page?.grid_tablet ?? '2';
    const gridMobile = page?.grid_mobile ?? '1';
    const imageAspect = page?.image_aspect || 'aspect-4/3';
    const galleryImages = page?.gallery_images && page.gallery_images.length > 0 ? page.gallery_images : [
        {
            image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=800&q=80',
            caption: 'Proses Sangrai Biji Kopi Menggunakan Mesin Roasting Presisi',
        },
        {
            image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
            caption: 'Pendinginan Cepat (Cooling Bin) Biji Kopi Sangrai Segar',
        },
        {
            image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
            caption: 'Cupping Session Sensorik Bersama Head Roaster',
        },
        {
            image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
            caption: 'Pemeriksaan Visual Warna Sangrai Agtron Scale',
        },
        {
            image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=80',
            caption: 'Pengemasan Biji Kopi Fresh Roast dengan Valve Food Grade',
        },
        {
            image: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=800&q=80',
            caption: 'Green Bean Pilihan Terkurasi Siap Masuk Drum Sangrai',
        },
    ];

    const waNumber = page?.whatsapp_number || '6285121930454';
    const formTitle = page?.form_title || 'Formulir Konsultasi Jasa Roasting';
    const formSubtitle = page?.form_subtitle || 'Isi detail biji kopi dan kebutuhan sangrai Anda untuk langsung terhubung dengan head roaster kami.';

    // Interactive Form States
    const [clientName, setClientName] = useState('');
    const [brandName, setBrandName] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [coffeeOrigin, setCoffeeOrigin] = useState('');
    const [estimatedVolume, setEstimatedVolume] = useState('5 – 10 kg (Batch Mingguan)');
    const [roastLevel, setRoastLevel] = useState('Medium Roast (Omniroast)');
    const [notes, setNotes] = useState('');

    const handleWhatsAppSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const msg = `Halo Tim Roaster Sanubari!\nSaya tertarik dengan Layanan Jasa Roasting Kopi:\n\n` +
            `• Nama PIC: ${clientName}\n` +
            `• Nama Brand/Kedai: ${brandName || '-'}\n` +
            `• No. WhatsApp: ${contactPhone}\n` +
            `• Origin / Jenis Biji Kopi: ${coffeeOrigin || 'Belum ditentukan'}\n` +
            `• Estimasi Volume: ${estimatedVolume}\n` +
            `• Target Profil Sangrai: ${roastLevel}\n` +
            (notes ? `• Catatan / Permintaan: ${notes}\n\n` : `\n`) +
            `Mohon informasi ketersediaan jadwal roasting dan estimasi biayanya. Terima kasih!`;
        window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`, '_blank');
    };

    return (
        <PublicLayout title="Jasa Roasting Kopi Presisi & Maklon | Sanubari Roastery">
            {/* Header Hero Section */}
            <div className="bg-brand-950 text-white py-12 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-brand-900/60">
                <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4 text-center">
                    <span className="inline-block text-xs sm:text-sm font-semibold tracking-wider uppercase text-accent-copper">
                        {heroBadge}
                    </span>
                    <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight max-w-3xl mx-auto">
                        {heroTitle}
                    </h1>
                    <p className="text-sm sm:text-base text-brand-200/90 max-w-2xl mx-auto leading-relaxed">
                        {heroDesc}
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-14 sm:space-y-20">
                {/* Section: Pilihan Paket & Biaya Sangrai */}
                <div id="paket-harga" className="space-y-6 sm:space-y-8 scroll-mt-20">
                    <div className="text-center max-w-2xl mx-auto space-y-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-accent-copper">
                            Estimasi Kapasitas & Biaya
                        </span>
                        <h2 className="text-xl sm:text-3xl font-extrabold text-brand-950 tracking-tight">
                            Pilihan Paket Layanan Roasting
                        </h2>
                        <p className="text-xs sm:text-sm text-brand-600 leading-relaxed">
                            Pilih kuota batch yang paling sesuai dengan ritme konsumsi kedai atau rencana peluncuran produk Anda.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                        {packages.map((pkg, idx) => {
                            const featureList = Array.isArray(pkg.features)
                                ? pkg.features
                                : typeof pkg.features === 'string'
                                ? pkg.features.split('\n').filter(Boolean)
                                : [];

                            return (
                                <div
                                    key={idx}
                                    className={`relative rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                                        pkg.is_popular
                                            ? 'bg-brand-950 text-white shadow-xl ring-2 ring-accent-copper lg:-translate-y-2'
                                            : 'bg-white text-brand-950 shadow-sm border border-brand-100 hover:shadow-md'
                                    }`}
                                >
                                    {pkg.badge && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase shadow-2xs ${
                                                pkg.is_popular
                                                    ? 'bg-accent-copper text-brand-950'
                                                    : 'bg-sand-200 text-brand-900'
                                            }`}>
                                                {pkg.badge}
                                            </span>
                                        </div>
                                    )}

                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <h3 className="text-lg sm:text-xl font-extrabold">{pkg.name}</h3>
                                            {pkg.capacity && (
                                                <p className={`text-xs sm:text-sm font-medium ${pkg.is_popular ? 'text-brand-300' : 'text-brand-500'}`}>
                                                    Kapasitas: {pkg.capacity}
                                                </p>
                                            )}
                                        </div>

                                        <div className="pt-2 border-t border-brand-800/40">
                                            <span className="text-2xl sm:text-3xl font-black tracking-tight">
                                                {pkg.price || 'Hubungi Kami'}
                                            </span>
                                        </div>

                                        {pkg.description && (
                                            <p className={`text-xs sm:text-sm leading-relaxed ${pkg.is_popular ? 'text-brand-200/90' : 'text-brand-600'}`}>
                                                {pkg.description}
                                            </p>
                                        )}

                                        {featureList.length > 0 && (
                                            <ul className="space-y-2.5 pt-2">
                                                {featureList.map((f, fIdx) => (
                                                    <li key={fIdx} className="flex items-start gap-2 text-xs sm:text-sm">
                                                        <Check className={`w-4 h-4 shrink-0 mt-0.5 ${pkg.is_popular ? 'text-accent-copper' : 'text-emerald-600'}`} />
                                                        <span className={pkg.is_popular ? 'text-brand-100' : 'text-brand-800'}>
                                                            {f}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>

                                    <div className="pt-6">
                                        <a
                                            href="#konsultasi"
                                            className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-center inline-flex items-center justify-center gap-2 transition-colors ${
                                                pkg.is_popular
                                                    ? 'bg-accent-copper hover:bg-accent-copper/90 text-brand-950 shadow-sm'
                                                    : 'bg-brand-950 hover:bg-brand-800 text-white'
                                            }`}
                                        >
                                            <span>Pilih Paket Ini</span>
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </a>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Section: Galeri Foto Suasana Roastery */}
                {galleryImages.length > 0 && (
                    <div className="space-y-6 sm:space-y-8">
                        <div className="text-center max-w-2xl mx-auto space-y-2">
                            <h2 className="text-xl sm:text-3xl font-extrabold text-brand-950 tracking-tight">
                                {galleryTitle}
                            </h2>
                            {gallerySubtitle && (
                                <p className="text-xs sm:text-sm text-brand-600 leading-relaxed">
                                    {gallerySubtitle}
                                </p>
                            )}
                        </div>

                        <div className={`grid ${getMobileGridClass(gridMobile)} ${getTabletGridClass(gridTablet)} ${getDesktopGridClass(gridDesktop)} gap-4 sm:gap-6`}>
                            {galleryImages.map((item, idx) => (
                                <div key={idx} className="group relative rounded-xl sm:rounded-2xl overflow-hidden bg-sand-200/50 border border-brand-100/60 shadow-2xs">
                                    <div className={`${getAspectClass(imageAspect)} w-full overflow-hidden`}>
                                        <img
                                            src={resolveImageUrl(item.image)}
                                            alt={item.caption || `Galeri Roasting ${idx + 1}`}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                                            loading="lazy"
                                        />
                                    </div>
                                    {item.caption && (
                                        <div className="p-3 sm:p-4 bg-white/95 border-t border-brand-100/40">
                                            <p className="text-xs sm:text-sm font-medium text-brand-800 leading-snug line-clamp-2">
                                                {item.caption}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Section: Form & Konsultasi WhatsApp Langsung */}
                <div id="konsultasi" className="max-w-2xl mx-auto bg-sand-200/30 rounded-xl sm:rounded-3xl p-3.5 sm:p-8 space-y-3.5 sm:space-y-6 border border-brand-100/60 scroll-mt-20">
                    <div className="text-center space-y-1">
                        <h3 className="text-base sm:text-2xl font-extrabold text-brand-950 flex items-center justify-center gap-1.5 sm:gap-2">
                            <MessageCircle className="w-4 h-4 sm:w-6 sm:h-6 text-[#128C7E]" />
                            <span>{formTitle}</span>
                        </h3>
                        <p className="text-[11px] sm:text-xs text-brand-600">
                            {formSubtitle}
                        </p>
                    </div>

                    <form onSubmit={handleWhatsAppSubmit} className="space-y-2.5 sm:space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                            <div className="space-y-0.5 sm:space-y-1">
                                <label className="block text-[11px] sm:text-xs font-semibold text-brand-900">
                                    Nama Lengkap / PIC *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={clientName}
                                    onChange={(e) => setClientName(e.target.value)}
                                    placeholder="Contoh: Dimas Aditya"
                                    className="w-full h-8.5 sm:h-10 px-2.5 sm:px-3 rounded-lg sm:rounded-xl border border-brand-200 bg-white text-xs sm:text-sm text-brand-950 focus:border-brand-800 outline-none"
                                />
                            </div>
                            <div className="space-y-0.5 sm:space-y-1">
                                <label className="block text-[11px] sm:text-xs font-semibold text-brand-900">
                                    Nama Brand / Kedai Kopi
                                </label>
                                <input
                                    type="text"
                                    value={brandName}
                                    onChange={(e) => setBrandName(e.target.value)}
                                    placeholder="Contoh: Titik Koma Kopi"
                                    className="w-full h-8.5 sm:h-10 px-2.5 sm:px-3 rounded-lg sm:rounded-xl border border-brand-200 bg-white text-xs sm:text-sm text-brand-950 focus:border-brand-800 outline-none"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                            <div className="space-y-0.5 sm:space-y-1">
                                <label className="block text-[11px] sm:text-xs font-semibold text-brand-900">
                                    Nomor WhatsApp Aktif *
                                </label>
                                <input
                                    type="tel"
                                    required
                                    value={contactPhone}
                                    onChange={(e) => setContactPhone(e.target.value)}
                                    placeholder="Contoh: 08123456789"
                                    className="w-full h-8.5 sm:h-10 px-2.5 sm:px-3 rounded-lg sm:rounded-xl border border-brand-200 bg-white text-xs sm:text-sm text-brand-950 focus:border-brand-800 outline-none"
                                />
                            </div>
                            <div className="space-y-0.5 sm:space-y-1">
                                <label className="block text-[11px] sm:text-xs font-semibold text-brand-900">
                                    Estimasi Kebutuhan Batch *
                                </label>
                                <select
                                    value={estimatedVolume}
                                    onChange={(e) => setEstimatedVolume(e.target.value)}
                                    className="w-full h-8.5 sm:h-10 px-2.5 sm:px-3 rounded-lg sm:rounded-xl border border-brand-200 bg-white text-xs sm:text-sm text-brand-950 focus:border-brand-800 outline-none"
                                >
                                    <option value="Sample 1 – 3 kg (Uji Profil)">Sample 1 – 3 kg (Uji Profil)</option>
                                    <option value="5 – 10 kg (Batch Mingguan)">5 – 10 kg (Batch Mingguan)</option>
                                    <option value="10 – 30 kg / batch">10 – 30 kg / batch</option>
                                    <option value="> 50 kg (Maklon Besar)">&gt; 50 kg (Maklon Besar)</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-0.5 sm:space-y-1">
                            <label className="block text-[11px] sm:text-xs font-semibold text-brand-900">
                                Asal / Origin Biji Kopi Hijau (Green Bean)
                            </label>
                            <input
                                type="text"
                                value={coffeeOrigin}
                                onChange={(e) => setCoffeeOrigin(e.target.value)}
                                placeholder="Contoh: Biji Sendiri / Pasokan Sanubari"
                                className="w-full h-8.5 sm:h-10 px-2.5 sm:px-3 rounded-lg sm:rounded-xl border border-brand-200 bg-white text-xs sm:text-sm text-brand-950 focus:border-brand-800 outline-none"
                            />
                        </div>

                        <div className="space-y-0.5 sm:space-y-1">
                            <label className="block text-[11px] sm:text-xs font-semibold text-brand-900">
                                Preferensi Profil Sangrai
                            </label>
                            <select
                                value={roastLevel}
                                onChange={(e) => setRoastLevel(e.target.value)}
                                className="w-full h-8.5 sm:h-10 px-2.5 sm:px-3 rounded-lg sm:rounded-xl border border-brand-200 bg-white text-xs sm:text-sm text-brand-950 focus:border-brand-800 outline-none"
                            >
                                <option value="Light to Medium (Filter)">Light to Medium (Filter)</option>
                                <option value="Medium Roast (Omniroast)">Medium Roast (Omniroast)</option>
                                <option value="Medium to Dark (Espresso)">Medium to Dark (Espresso)</option>
                                <option value="Konsultasi Bersama Roaster">Konsultasi Bersama Roaster</option>
                            </select>
                        </div>

                        <div className="space-y-0.5 sm:space-y-1">
                            <label className="block text-[11px] sm:text-xs font-semibold text-brand-900">
                                Catatan / Pertanyaan Tambahan (Opsional)
                            </label>
                            <textarea
                                rows={2}
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Catatan tasting notes, jadwal kirim, dll."
                                className="w-full p-2.5 rounded-lg sm:rounded-xl border border-brand-200 bg-white text-xs sm:text-sm text-brand-950 focus:border-brand-800 outline-none resize-none"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3.5 sm:py-4 px-5 rounded-xl sm:rounded-2xl bg-[#128C7E] hover:bg-[#0e7467] text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-[0.99]"
                        >
                            <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
                            <span>Kirim ke WhatsApp</span>
                        </button>
                    </form>
                </div>
            </div>
        </PublicLayout>
    );
}
