import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Building2,
    Calendar,
    Clock,
    Heart,
    MapPin,
    MessageCircle,
    Phone,
    Users,
    Wrench,
    Zap,
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
        case '3':
        default: return 'lg:grid-cols-3';
    }
};

const getTabletGridClass = (cols: string | number) => {
    switch (String(cols)) {
        case '1': return 'md:grid-cols-1';
        case '3': return 'md:grid-cols-3';
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

interface CateringBenefit {
    title: string;
    badge?: string;
    description: string;
    is_highlight?: boolean;
}

interface CateringOccasion {
    name: string;
    tagline?: string;
    description?: string;
}

interface MenuCategoryItem {
    title: string;
    items: string[];
}

interface GalleryImageItem {
    image: string;
    caption?: string;
}

interface CoffeeCateringPageProps {
    page?: {
        hero_badge?: string;
        hero_title?: string;
        hero_description?: string;
        hero_image?: string;
        minimum_order_cups?: number | string;
        benefits?: CateringBenefit[];
        occasions?: CateringOccasion[];
        menu_categories?: MenuCategoryItem[];
        gallery_title?: string;
        gallery_subtitle?: string;
        grid_desktop?: number | string;
        grid_tablet?: number | string;
        grid_mobile?: number | string;
        image_aspect?: string;
        gallery_images?: GalleryImageItem[];
        whatsapp_number?: string;
        form_title?: string;
        form_subtitle?: string;
        terms_note?: string;
        address?: string;
        hours?: string;
        maps_url?: string;
    };
}

export default function CoffeeCateringPage({ page }: CoffeeCateringPageProps) {
    const { locale } = usePage().props as { locale?: string };
    const isEn = locale === 'en';

    // Form state for instant WhatsApp inquiry
    const [picName, setPicName] = useState('');
    const [organizationName, setOrganizationName] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [eventTime, setEventTime] = useState('');
    const [cupCount, setCupCount] = useState('200 – 300 cup');
    const [eventType, setEventType] = useState('Wedding & Resepsi Pernikahan');
    const [eventLocation, setEventLocation] = useState('');
    const [notes, setNotes] = useState('');

    const heroBadge = page?.hero_badge || (isEn ? 'On-Site Specialty Coffee Catering' : 'Layanan Coffee Catering On-Site');
    const heroTitle = page?.hero_title || (isEn ? 'Sanubari Coffee Catering for Your Special Moments' : 'Sanubari Coffee Catering untuk Segala Momen Spesial Anda');
    const heroDesc = page?.hero_description || (isEn
        ? 'Bring an authentic specialty coffee bar experience directly to your venue in Malang & East Java. Tailored for Weddings, Corporate Gatherings, Seminars, and Family Celebrations with minimum order of 200 cups and professional on-site barista service.'
        : 'Hadirkan pengalaman live specialty coffee bar autentik langsung di lokasi acara Anda di Malang & sekitarnya. Cocok untuk Wedding, Acara Kantor, Acara Seminar, maupun Acara Keluarga dengan minimum order 200 cup dan racikan barista profesional Sanubari.');

    const heroImage = page?.hero_image
        ? resolveImageUrl(page.hero_image)
        : 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1200&q=80';

    const whatsappNumber = page?.whatsapp_number || '6285121930454';
    const cleanWhatsapp = whatsappNumber.replace(/[^0-9]/g, '');

    const address = page?.address || 'Ruko Tlogomas Square Kav. 34, Jl. Raya Tlogomas, Lowokwaru, Kota Malang, Jawa Timur 65144';
    const hours = page?.hours || 'Setiap Hari: 09.00 – 23.00 WIB';
    const mapsUrl = page?.maps_url || 'https://maps.app.goo.gl/PMuxaEtsbEvC4APy7';

    const formTitle = page?.form_title || 'Konsultasi Jadwal & Pemesanan Coffee Catering';
    const formSubtitle = page?.form_subtitle || 'Isi formulir singkat di bawah ini untuk mendapatkan penawaran harga & paket coffee catering Sanubari via WhatsApp.';
    const termsNote = page?.terms_note || '*Minimum pemesanan 200 cup. Pemesanan disarankan minimal H-7 acara untuk persiapan jadwal tim barista dan ketersediaan mesin.';

    // 4 Core Highlights
    const defaultBenefits: CateringBenefit[] = [
        {
            title: isEn ? 'Minimum Order 200 Cups' : 'Minimum Order 200 Cup',
            badge: isEn ? 'Flexible Scale' : 'Kapasitas Fleksibel',
            description: isEn
                ? 'Starting from 200 cups of freshly brewed coffee, ideal for intimate family gatherings to grand wedding banquets.'
                : 'Mulai dari 200 cup fresh coffee, sangat ideal untuk intimate party keluarga, acara kantor, hingga resepsi pernikahan akbar.',
            is_highlight: false,
        },
        {
            title: isEn ? 'On-Site Live Coffee Bar' : 'Pelayanan Langsung di Tempat Acara',
            badge: isEn ? 'Live Brewing' : 'Live Espresso Bar',
            description: isEn
                ? 'Our professional baristas arrive at your venue with complete commercial equipment, brewing drinks live in front of your guests.'
                : 'Tim barista profesional Sanubari hadir langsung di lokasi acara dengan setup mobile coffee bar lengkap, menyajikan kopi segar di hadapan tamu.',
            is_highlight: false,
        },
        {
            title: isEn ? 'Commercial Espresso Setup' : 'Peralatan Espresso Komersial',
            badge: isEn ? 'Professional Rig' : 'Peralatan Lengkap',
            description: isEn
                ? 'Full professional espresso machines, high-precision grinders, ice stations, and aesthetic bar decor ready to elevate your event ambience.'
                : 'Mesin espresso standar specialty coffee, grinder presisi, cooling ice station, dan booth bar estetis yang siap mempercantik dekorasi acara Anda.',
            is_highlight: false,
        },
        {
            title: isEn ? 'Specialty Fresh Roasted Beans' : 'Biji Kopi Fresh Roast Khas Sanubari',
            badge: isEn ? 'Specialty Grade 1' : 'Racikan Khas Roastery',
            description: isEn
                ? 'Exclusive houseblends and single origins roasted in Malang. Rich, sweet, balanced, and gentle on the stomach for all your guests.'
                : 'Pilihan espresso blend dan single origin artisan khas Sanubari Roastery. Cita rasa kaya, manis seimbang, dan ramah di lambung para tamu undangan.',
            is_highlight: true,
        },
    ];

    const benefits = (page?.benefits && page.benefits.length > 0) ? page.benefits : defaultBenefits;

    // The 4 Core Occasions Requested by the User
    const defaultOccasions: CateringOccasion[] = [
        {
            name: isEn ? 'Wedding & Reception' : 'Wedding & Resepsi Pernikahan',
        },
        {
            name: isEn ? 'Corporate Event & Gathering' : 'Acara Kantor & Corporate Gathering',
        },
        {
            name: isEn ? 'Seminar & Workshop' : 'Acara Seminar & Konferensi',
        },
        {
            name: isEn ? 'Family Gathering & Private Party' : 'Acara Keluarga & Private Party',
        },
    ];

    const occasions = (page?.occasions && page.occasions.length > 0) ? page.occasions : defaultOccasions;

    // Gallery configuration
    const galleryTitle = page?.gallery_title || (isEn ? 'On-Site Live Coffee Bar Documentation' : 'Dokumentasi Live Coffee Bar & Catering Acara');
    const gallerySubtitle = page?.gallery_subtitle || (isEn ? 'Joyful moments of guests enjoying Sanubari craft coffee across weddings, offices, and seminars.' : 'Momen kebahagiaan para tamu menikmati racikan segar Sanubari di berbagai pesta pernikahan, kantor, dan seminar.');
    const gridDesktop = page?.grid_desktop ?? '3';
    const gridTablet = page?.grid_tablet ?? '2';
    const gridMobile = page?.grid_mobile ?? '1';
    const imageAspect = page?.image_aspect || 'aspect-4/3';
    const galleryImages = (page?.gallery_images && page.gallery_images.length > 0) ? page.gallery_images : [
        {
            image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=80',
            caption: 'Live Espresso Bar & Barista Standby di Lokasi Pernikahan',
        },
        {
            image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
            caption: 'Coffee Break Cepat & Tertib untuk Seminar Ratusan Peserta',
        },
        {
            image: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=800&q=80',
            caption: 'Booth Estetis Menghangatkan Suasana Corporate Gathering Kantor',
        },
        {
            image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
            caption: 'Fresh Pour Over & Manual Brew Disajikan Langsung untuk Pecinta Kopi',
        },
        {
            image: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&q=80',
            caption: 'Pilihan Es Kopi Susu Gula Aren & Minuman Non-Coffee Favorit Keluarga',
        },
        {
            image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
            caption: 'Peralatan Higienis, Rapi, dan Menunjang Estetika Dekorasi Acara',
        },
    ];

    const handleWhatsAppSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const message = [
            'Halo Sanubari Roastery! 👋',
            'Saya ingin konsultasi & reservasi layanan *Coffee Catering On-Site*:',
            '',
            `👤 *Nama PIC / Penyelenggara*: ${picName || '-'}`,
            `🏢 *Perusahaan / Keluarga*: ${organizationName || '-'}`,
            `📱 *Nomor HP/WA*: ${contactPhone || '-'}`,
            `🎉 *Jenis Acara*: ${eventType}`,
            `☕ *Perkiraan Jumlah Pesanan*: ${cupCount}`,
            `📅 *Rencana Tanggal*: ${eventDate || '-'}`,
            `⏰ *Jam Mulai Acara*: ${eventTime || '-'}`,
            `📍 *Lokasi Acara (Kota/Venue)*: ${eventLocation || '-'}`,
            notes ? `📝 *Catatan / Request Khusus*: ${notes}` : '',
            '',
            'Mohon informasi paket harga, ketersediaan jadwal tim barista, serta pilihan menu yang tersedia. Terima kasih!',
        ].filter(Boolean).join('\n');

        const waUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(message)}`;
        window.open(waUrl, '_blank');
    };

    return (
        <PublicLayout>
            <Head>
                <title>{isEn ? 'Coffee Catering for Weddings, Corporate & Seminars — Sanubari Roastery' : 'Coffee Catering On-Site Wedding, Kantor & Seminar — Sanubari Roastery'}</title>
                <meta
                    name="description"
                    content={
                        isEn
                            ? 'Book live coffee catering by Sanubari Roastery Malang. Minimum order 200 cups with on-site professional barista service for weddings, corporate events, seminars, and family parties.'
                            : 'Layanan live espresso bar & coffee catering on-site oleh Sanubari Roastery Malang. Minimum order 200 cup dengan pelayanan langsung di tempat acara untuk wedding, acara kantor, seminar, dan acara keluarga.'
                    }
                />
            </Head>

            {/* Header Hero Section (Full Width, Matching Booking & Barista Pages) */}
            <div className="relative bg-brand-950 text-white py-12 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-brand-900/60 overflow-hidden text-center">
                {heroImage && (
                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                        <img src={heroImage} alt="" className="w-full h-full object-cover" />
                    </div>
                )}
                <div className="relative max-w-4xl mx-auto space-y-3 sm:space-y-4">
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

            {/* Content Container (Consistent max-w-7xl Layout) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-14 sm:space-y-20">
                {/* Section 1: 4 Keunggulan Utama Catering */}
                <div id="keunggulan" className="space-y-6 sm:space-y-8 scroll-mt-20">
                    <div className="text-center max-w-2xl mx-auto space-y-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-accent-copper">
                            Keunggulan Layanan
                        </span>
                        <h2 className="text-xl sm:text-3xl font-extrabold text-brand-950 tracking-tight">
                            Solusi Kopi Spesialis untuk Acara Spesial Anda
                        </h2>
                        <p className="text-xs sm:text-sm text-brand-600 leading-relaxed">
                            Kami hadirkan standar slow bar Sanubari langsung ke venue Anda lengkap dengan mesin komersial, bahan baku segar, dan tim barista terampil.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch justify-center">
                        {benefits.map((b, idx) => {
                            const isHighlight = b.is_highlight || idx === 3;

                            return (
                                <div
                                    key={idx}
                                    className={`relative rounded-2xl sm:rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 text-center ${
                                        isHighlight
                                            ? 'bg-brand-950 text-white shadow-xl ring-2 ring-accent-copper lg:-translate-y-2'
                                            : 'bg-white text-brand-950 shadow-xs border border-brand-100 hover:shadow-md'
                                    }`}
                                >
                                    {b.badge && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                            <span
                                                className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase shadow-2xs whitespace-nowrap ${
                                                    isHighlight
                                                        ? 'bg-accent-copper text-brand-950'
                                                        : 'bg-sand-200 text-brand-900'
                                                }`}
                                            >
                                                {b.badge}
                                            </span>
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <h3 className="text-base sm:text-lg font-extrabold leading-snug">
                                            {b.title}
                                        </h3>
                                        <p
                                            className={`text-xs leading-relaxed ${
                                                isHighlight ? 'text-brand-200/90' : 'text-brand-600'
                                            }`}
                                        >
                                            {b.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Section 2: Pilihan Acara yang Dilayani (Wedding, Kantor, Seminar, Keluarga) */}
                <div id="acara" className="space-y-6 sm:space-y-8 scroll-mt-20">
                    <div className="text-center max-w-2xl mx-auto space-y-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-accent-copper">
                            Fungsi & Ragam Acara
                        </span>
                        <h2 className="text-xl sm:text-3xl font-extrabold text-brand-950 tracking-tight">
                            Siap Mendukung Beragam Momen Berharga
                        </h2>
                        <p className="text-xs sm:text-sm text-brand-600 leading-relaxed">
                            Mulai dari pernikahan sakral hingga seminar berskala besar, setup mobile bar kami dirancang fleksibel menyesuaikan tema dan kebutuhan ruang acara Anda.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                        {occasions.map((occ, idx) => (
                            <div
                                key={idx}
                                className="p-3.5 sm:p-6 rounded-xl sm:rounded-2xl bg-white border border-brand-200/80 shadow-2xs hover:shadow-md hover:border-brand-300 transition-all text-center flex items-center justify-center min-h-[72px] sm:min-h-[90px]"
                            >
                                <h3 className="text-xs sm:text-base lg:text-lg font-extrabold text-brand-950 leading-snug">
                                    {occ.name}
                                </h3>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Section 4: Galeri Dokumentasi Foto On-site Catering */}
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
                                <div
                                    key={idx}
                                    className="group relative rounded-2xl overflow-hidden bg-brand-900 border border-brand-200/70 shadow-2xs hover:shadow-md transition-all duration-300"
                                >
                                    <div className={`${getAspectClass(imageAspect)} w-full overflow-hidden`}>
                                        <img
                                            src={resolveImageUrl(item.image)}
                                            alt={item.caption || `Galeri Sanubari Coffee Catering ${idx + 1}`}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                                            loading="lazy"
                                        />
                                    </div>
                                    {item.caption && (
                                        <div className="p-3.5 sm:p-4 bg-white border-t border-brand-100">
                                            <p className="text-xs sm:text-sm font-semibold text-brand-900 line-clamp-2">
                                                {item.caption}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Section 5: Fast Inquiry Form to WhatsApp */}
                <div id="reservasi" className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-brand-200 shadow-md space-y-8 scroll-mt-20">
                    <div className="text-center space-y-2 max-w-xl mx-auto">
                        <span className="text-xs font-bold uppercase tracking-wider text-accent-copper">
                            Hubungi Kami
                        </span>
                        <h2 className="text-xl sm:text-3xl font-extrabold text-brand-950 tracking-tight">
                            {formTitle}
                        </h2>
                        <p className="text-xs sm:text-sm text-brand-600 leading-relaxed">
                            {formSubtitle}
                        </p>
                    </div>

                    <form onSubmit={handleWhatsAppSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                            {/* Nama PIC */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-brand-900 uppercase tracking-wider">
                                    Nama Anda / PIC Penyelenggara <span className="text-accent-copper">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={picName}
                                    onChange={(e) => setPicName(e.target.value)}
                                    placeholder="Contoh: Bpk. Aditya Pratama"
                                    className="w-full px-4 py-2.5 rounded-xl border border-brand-200 focus:border-accent-copper focus:ring-1 focus:ring-accent-copper outline-none text-xs sm:text-sm transition-all"
                                />
                            </div>

                            {/* Nama Perusahaan / Keluarga */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-brand-900 uppercase tracking-wider">
                                    Nama Pasangan / Instansi / Keluarga
                                </label>
                                <input
                                    type="text"
                                    value={organizationName}
                                    onChange={(e) => setOrganizationName(e.target.value)}
                                    placeholder="Contoh: Aditya & Rania Wedding / PT Maju Sejahtera"
                                    className="w-full px-4 py-2.5 rounded-xl border border-brand-200 focus:border-accent-copper focus:ring-1 focus:ring-accent-copper outline-none text-xs sm:text-sm transition-all"
                                />
                            </div>

                            {/* Nomor WhatsApp */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-brand-900 uppercase tracking-wider">
                                    Nomor Telepon / WhatsApp <span className="text-accent-copper">*</span>
                                </label>
                                <input
                                    type="tel"
                                    required
                                    value={contactPhone}
                                    onChange={(e) => setContactPhone(e.target.value)}
                                    placeholder="Contoh: 081234567890"
                                    className="w-full px-4 py-2.5 rounded-xl border border-brand-200 focus:border-accent-copper focus:ring-1 focus:ring-accent-copper outline-none text-xs sm:text-sm transition-all"
                                />
                            </div>

                            {/* Jenis Acara */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-brand-900 uppercase tracking-wider">
                                    Jenis Acara <span className="text-accent-copper">*</span>
                                </label>
                                <select
                                    value={eventType}
                                    onChange={(e) => setEventType(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-brand-200 focus:border-accent-copper focus:ring-1 focus:ring-accent-copper outline-none text-xs sm:text-sm transition-all bg-white"
                                >
                                    <option value="Wedding & Resepsi Pernikahan">Wedding & Resepsi Pernikahan</option>
                                    <option value="Acara Kantor & Corporate Gathering">Acara Kantor & Corporate Gathering</option>
                                    <option value="Acara Seminar & Workshop">Acara Seminar & Workshop</option>
                                    <option value="Acara Keluarga & Private Party">Acara Keluarga & Private Party</option>
                                    <option value="Pameran, Festival & Acara Lainnya">Pameran, Festival & Acara Lainnya</option>
                                </select>
                            </div>

                            {/* Jumlah Cup (Min 200) */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-brand-900 uppercase tracking-wider">
                                    Perkiraan Jumlah Cup (Min. 200 Cup) <span className="text-accent-copper">*</span>
                                </label>
                                <select
                                    value={cupCount}
                                    onChange={(e) => setCupCount(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-brand-200 focus:border-accent-copper focus:ring-1 focus:ring-accent-copper outline-none text-xs sm:text-sm transition-all bg-white font-semibold text-brand-900"
                                >
                                    <option value="200 cup (Paket Minimum)">200 cup (Paket Minimum)</option>
                                    <option value="300 – 400 cup">300 – 400 cup</option>
                                    <option value="500 – 700 cup">500 – 700 cup</option>
                                    <option value="1.000+ cup (Acara Besar)">1.000+ cup (Acara Besar)</option>
                                    <option value="Kustom / Jumlah Lainnya">Kustom / Jumlah Lainnya</option>
                                </select>
                            </div>

                            {/* Tanggal Acara */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-brand-900 uppercase tracking-wider">
                                    Rencana Tanggal Acara <span className="text-accent-copper">*</span>
                                </label>
                                <input
                                    type="date"
                                    required
                                    value={eventDate}
                                    onChange={(e) => setEventDate(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-brand-200 focus:border-accent-copper focus:ring-1 focus:ring-accent-copper outline-none text-xs sm:text-sm transition-all bg-white"
                                />
                            </div>

                            {/* Waktu / Jam Acara */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-brand-900 uppercase tracking-wider">
                                    Waktu / Jam Acara
                                </label>
                                <input
                                    type="text"
                                    value={eventTime}
                                    onChange={(e) => setEventTime(e.target.value)}
                                    placeholder="Contoh: 10.00 – 14.00 WIB"
                                    className="w-full px-4 py-2.5 rounded-xl border border-brand-200 focus:border-accent-copper focus:ring-1 focus:ring-accent-copper outline-none text-xs sm:text-sm transition-all"
                                />
                            </div>

                            {/* Lokasi Acara / Venue */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-brand-900 uppercase tracking-wider">
                                    Lokasi Acara / Gedung / Kota <span className="text-accent-copper">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={eventLocation}
                                    onChange={(e) => setEventLocation(e.target.value)}
                                    placeholder="Contoh: Hotel Santika Malang / Rumah Kediaman"
                                    className="w-full px-4 py-2.5 rounded-xl border border-brand-200 focus:border-accent-copper focus:ring-1 focus:ring-accent-copper outline-none text-xs sm:text-sm transition-all"
                                />
                            </div>
                        </div>

                        {/* Catatan / Permintaan Khusus */}
                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-brand-900 uppercase tracking-wider">
                                Catatan Tambahan / Preferensi Menu & Request Khusus (Opsional)
                            </label>
                            <textarea
                                rows={3}
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Contoh: Ingin custom cup berlogo pernikahan, mayoritas tamu menyukai es kopi susu gula aren dan cokelat non-kopi."
                                className="w-full px-4 py-2.5 rounded-xl border border-brand-200 focus:border-accent-copper focus:ring-1 focus:ring-accent-copper outline-none text-xs sm:text-sm transition-all"
                            />
                        </div>

                        <div className="bg-sand-50 p-4 rounded-xl border border-sand-200 text-xs text-brand-700 leading-relaxed">
                            {termsNote}
                        </div>

                        {/* Submit Button */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                            <div className="flex items-center gap-2 text-xs text-brand-600">
                                <Clock className="w-4 h-4 text-accent-copper" />
                                <span>Konfirmasi Cepat & Konsultasi Langsung dengan Tim Sanubari</span>
                            </div>
                            <button
                                type="submit"
                                className="w-full sm:w-auto px-6 sm:px-8 py-3.5 bg-brand-900 hover:bg-brand-800 text-white font-bold text-sm rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <MessageCircle className="w-4 h-4 shrink-0" />
                                <span>
                                    Kirim Form ke WhatsApp<span className="hidden sm:inline"> Reservasi</span>
                                </span>
                                <ArrowRight className="w-4 h-4 hidden sm:block shrink-0" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </PublicLayout>
    );
}

