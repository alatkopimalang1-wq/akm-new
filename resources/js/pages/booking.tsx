import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Building2,
    Calendar,
    Clock,
    MapPin,
    MessageCircle,
    Mic,
    Phone,
    Sparkles,
    Wifi,
    Zap,
} from 'lucide-react';
import { PublicLayout } from '@/layouts/public-layout';
import { DynamicCategoryIcon } from '@/components/dynamic-category-icon';

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

interface BookingBenefit {
    title: string;
    badge?: string;
    description: string;
    icon?: string;
    is_highlight?: boolean;
}

interface FacilityItem {
    title: string;
    description: string;
    icon?: string;
}

interface GalleryImageItem {
    image: string;
    caption?: string;
}

interface BookingPageProps {
    page?: {
        hero_badge?: string;
        hero_title?: string;
        hero_description?: string;
        hero_image?: string;
        benefits?: BookingBenefit[];
        facilities?: FacilityItem[];
        event_types?: string[];
        gallery_title?: string;
        gallery_subtitle?: string;
        grid_desktop?: number | string;
        grid_tablet?: number | string;
        grid_mobile?: number | string;
        image_aspect?: string;
        gallery_images?: GalleryImageItem[];
        whatsapp_number?: string;
        address?: string;
        hours?: string;
        maps_url?: string;
        form_title?: string;
        form_subtitle?: string;
        minimum_spent_info?: string;
    };
}

export default function BookingPage({ page }: BookingPageProps) {
    const { locale } = usePage().props as { locale?: string };
    const isEn = locale === 'en';

    // Form state
    const [picName, setPicName] = useState('');
    const [organizationName, setOrganizationName] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [eventTime, setEventTime] = useState('');
    const [attendeeCount, setAttendeeCount] = useState('35 – 50 orang');
    const [eventType, setEventType] = useState('Gathering Komunitas & Reuni');
    const [needProjector, setNeedProjector] = useState(true);
    const [needSoundSystem, setNeedSoundSystem] = useState(true);
    const [notes, setNotes] = useState('');

    const heroBadge = page?.hero_badge || (isEn ? 'Venue & Space Booking' : 'Reservasi & Sewa Tempat di Sanubari');
    const heroTitle = page?.hero_title || (isEn ? 'Space Booking for Events & Communities at Sanubari Roastery' : 'Booking Tempat Nyaman untuk Acara & Komunitas di Sanubari Roastery');
    const heroDesc = page?.hero_description || (isEn
        ? 'A cozy, aesthetic, and welcoming space in Malang for workshops, meetings, gatherings, or private events. No venue rental fee — simply enjoy our coffee and menu with a friendly minimum spend.'
        : 'Ruang berkumpul yang hangat, estetis, dan santai untuk workshop, meeting, gathering komunitas, atau acara spesial Anda di Malang. Tanpa biaya sewa ruangan terpisah — cukup dengan minimum spent ngopi & menu lezat di Sanubari Roastery.');

    const heroImage = page?.hero_image
        ? resolveImageUrl(page.hero_image)
        : 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80';

    const whatsappNumber = page?.whatsapp_number || '6285121930454';
    const cleanWhatsapp = whatsappNumber.replace(/[^0-9]/g, '');

    const address = page?.address || 'Ruko Tlogomas Square Kav. 34, Jl. Raya Tlogomas, Lowokwaru, Kota Malang, Jawa Timur 65144';
    const hours = page?.hours || 'Setiap Hari: 09.00 – 23.00 WIB';
    const mapsUrl = page?.maps_url || 'https://maps.app.goo.gl/PMuxaEtsbEvC4APy7';

    const formTitle = page?.form_title || 'Konsultasi Jadwal & Reservasi Tempat';
    const formSubtitle = page?.form_subtitle || 'Isi detail rencana acara Anda di bawah ini untuk langsung terhubung ke WhatsApp reservasi Sanubari Roastery.';

    // The 4 Core Benefits Requested by the User
    const defaultBenefits: BookingBenefit[] = [
        {
            title: isEn ? 'Accommodates Over 50 People' : 'Muat Hingga Lebih dari 50 Orang',
            badge: isEn ? 'Spacious Capacity' : 'Kapasitas Luas',
            description: isEn
                ? 'Flexible and comfortable seating layouts (theater, classroom, round discussion, or open gathering) accommodating 50+ participants.'
                : 'Kapasitas luas dan leluasa menampung lebih dari 50 orang dengan pilihan tata letak kursi yang fleksibel (theater, kelas, diskusi melingkar, atau santai).',
            icon: 'users',
            is_highlight: false,
        },
        {
            title: isEn ? 'Free Projector & Screen' : 'Free Proyektor',
            badge: isEn ? 'Complimentary' : 'Fasilitas Gratis',
            description: isEn
                ? 'High-definition projector and projection screen ready for presentations, workshops, slide shows, or movie screenings without rental fees.'
                : 'Fasilitas proyektor jernih dan layar screen siap pakai untuk presentasi kerja, materi workshop, tayangan video, maupun nobar tanpa biaya sewa tambahan.',
            icon: 'projector',
            is_highlight: false,
        },
        {
            title: isEn ? 'Free Sound System' : 'Free Sound System',
            badge: isEn ? 'Complimentary' : 'Fasilitas Gratis',
            description: isEn
                ? 'Crisp audio setup complete with wireless microphones, bluetooth connectivity, and background music to keep your event lively.'
                : 'Sound system audio jernih dilengkapi microphone wireless gratis dan koneksi bluetooth untuk mendukung kelancaran pemandu acara maupun musik pengiring.',
            icon: 'sound',
            is_highlight: false,
        },
        {
            title: isEn ? 'Simple Minimum Spend Only' : 'Cukup dengan Minimum Spent Ngopi di Sanubari',
            badge: isEn ? 'Zero Venue Fee' : 'Bebas Sewa Ruang',
            description: isEn
                ? 'Zero room rental charge. Your entire event budget goes directly toward handcrafted specialty coffees, fresh beverages, and delicious foods.'
                : 'Tanpa biaya sewa tempat terpisah (Rp 0 room fee)! Seluruh anggaran acara Anda dialokasikan langsung untuk menikmati pesanan kopi artisan, minuman segar, dan makanan di Sanubari.',
            icon: 'coffee',
            is_highlight: true,
        },
    ];

    const benefits = (page?.benefits && page.benefits.length > 0) ? page.benefits : defaultBenefits;

    const defaultFacilities: FacilityItem[] = [
        {
            title: isEn ? 'Air-Conditioned Comfort' : 'Ruangan Ber-AC & Sejuk',
            description: isEn ? 'Cool and pleasant room temperature ensuring comfort throughout your session.' : 'Ruangan sejuk dan nyaman untuk memastikan seluruh tamu betah selama acara.',
            icon: 'zap',
        },
        {
            title: isEn ? 'High-Speed Wi-Fi' : 'Koneksi Wi-Fi Cepat',
            description: isEn ? 'Reliable internet for online conferencing, live streams, and presentations.' : 'Internet stabil untuk presentasi daring, meeting Zoom, hingga live streaming.',
            icon: 'wifi',
        },
        {
            title: isEn ? 'Abundant Power Outlets' : 'Banyak Colokan Listrik',
            description: isEn ? 'Power sockets conveniently placed across seating areas for laptops and phones.' : 'Stopkontak melimpah di setiap sudut tempat duduk untuk laptop dan gawai peserta.',
            icon: 'plug',
        },
        {
            title: isEn ? 'Ample Parking Area' : 'Parkir Luas & Aman',
            description: isEn ? 'Conveniently located at Ruko Tlogomas Square with secure car and motorcycle parking.' : 'Akses strategis di Ruko Tlogomas Square dengan area parkir mobil dan motor yang aman.',
            icon: 'building-2',
        },
    ];

    const facilities = (page?.facilities && page.facilities.length > 0) ? page.facilities : defaultFacilities;

    const galleryTitle = page?.gallery_title || (isEn ? 'Space & Event Documentation' : 'Dokumentasi Suasana Ruangan & Acara');
    const gallerySubtitle = page?.gallery_subtitle || (isEn ? 'Cozy moments of workshops, meetings, and community gatherings at Sanubari Roastery Malang.' : 'Momen kehangatan workshop, meeting, dan gathering komunitas di Sanubari Roastery Malang.');
    const gridDesktop = page?.grid_desktop ?? '3';
    const gridTablet = page?.grid_tablet ?? '2';
    const gridMobile = page?.grid_mobile ?? '1';
    const imageAspect = page?.image_aspect || 'aspect-4/3';
    const galleryImages = (page?.gallery_images && page.gallery_images.length > 0) ? page.gallery_images : [
        {
            image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
            caption: 'Suasana Ruangan Luas & Meja Diskusi Komunitas',
        },
        {
            image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
            caption: 'Presentasi & Workshop dengan Proyektor Layar Lebar',
        },
        {
            image: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&q=80',
            caption: 'Sound System & Mic Wireless Jernih untuk Gathering',
        },
        {
            image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
            caption: 'Kopi Artisan & Fresh Brew Disajikan Langsung dari Slow Bar',
        },
        {
            image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
            caption: 'Kenyamanan Berkumpul dengan Ruangan Ber-AC & Stopkontak Melimpah',
        },
        {
            image: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=800&q=80',
            caption: 'Kapasitas Nyaman untuk Lebih dari 50 Tamu Undangan',
        },
    ];

    const eventTypes = (page?.event_types && page.event_types.length > 0) ? page.event_types : [
        'Workshop & Kelas Pelatihan',
        'Meeting Kerja & Seminar Kantor',
        'Gathering Komunitas & Reuni',
        'Ulang Tahun & Acara Keluarga',
        'Bedah Buku, Talkshow, & Mini Showcase',
        'Nonton Bareng & Diskusi Kreatif',
        'Acara Lainnya',
    ];

    const handleWhatsAppSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const msg =
            `Halo Tim Sanubari Roastery!\n` +
            `Saya tertarik untuk booking tempat acara:\n\n` +
            `• Nama PIC: ${picName || '-'}\n` +
            (organizationName ? `• Komunitas / Brand: ${organizationName}\n` : '') +
            `• No. WhatsApp: ${contactPhone}\n` +
            `• Tanggal Rencana: ${eventDate || 'Menyesuaikan jadwal kosong'}\n` +
            (eventTime ? `• Waktu / Jam: ${eventTime}\n` : '') +
            `• Estimasi Peserta: ${attendeeCount}\n` +
            `• Jenis Acara: ${eventType}\n` +
            `• Kebutuhan Proyektor: ${needProjector ? 'Ya (Free)' : 'Tidak'}\n` +
            `• Kebutuhan Sound System: ${needSoundSystem ? 'Ya (Free)' : 'Tidak'}\n` +
            (notes ? `• Catatan / Permintaan: ${notes}\n\n` : `\n`) +
            `Mohon info ketersediaan tanggal dan rekomendasi menu minimum spent di Sanubari. Terima kasih!`;

        window.open(`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
    };

    return (
        <PublicLayout title={isEn ? 'Venue & Space Booking — Sanubari Roastery' : 'Booking Tempat Acara & Komunitas | Sanubari Roastery'}>
            <Head>
                <title>{isEn ? 'Venue & Space Booking — Sanubari Roastery' : 'Booking Tempat Acara & Komunitas — Sanubari Roastery'}</title>
                <meta
                    name="description"
                    content={
                        isEn
                            ? 'Book event space at Sanubari Roastery Malang. Capacity 50+ people, free projector, free sound system, with minimum spend only.'
                            : 'Booking tempat acara di Sanubari Roastery Malang. Muat hingga lebih dari 50 orang, Free Proyektor, Free Sound System, cukup dengan minimum spent ngopi di Sanubari.'
                    }
                />
            </Head>

            {/* Header Hero Section (Full Width, Matching Barista Training & Roasting Pages) */}
            <div className="relative bg-brand-950 text-white py-12 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-brand-900/60 overflow-hidden text-center">
                {heroImage && (
                    <div className="absolute inset-0 opacity-15 pointer-events-none">
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
                {/* Section 1: The 4 Core Benefits */}
                <div id="manfaat" className="space-y-6 sm:space-y-8 scroll-mt-20">
                    <div className="text-center max-w-2xl mx-auto space-y-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-accent-copper">
                            Fasilitas & Keuntungan
                        </span>
                        <h2 className="text-xl sm:text-3xl font-extrabold text-brand-950 tracking-tight">
                            Semua Kebutuhan Acara Anda Siap Tersedia
                        </h2>
                        <p className="text-xs sm:text-sm text-brand-600 leading-relaxed">
                            Nikmati kemudahan mengadakan acara tanpa biaya sewa ruang terpisah dan tanpa repot menyewa alat audio-visual.
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

                {/* Section 2: Fasilitas Pendukung Lainnya (Posisikan di Tengah) */}
                <div className="space-y-6 max-w-5xl mx-auto">
                    <div className="text-center max-w-xl mx-auto space-y-1">
                        <h3 className="text-lg sm:text-2xl font-extrabold text-brand-950">
                            Fasilitas Pendukung Lengkap
                        </h3>
                        <p className="text-xs text-brand-600">
                            Didukung sarana modern agar acara Anda berjalan lancar dari awal hingga akhir.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 justify-center">
                        {facilities.map((fac, idx) => (
                            <div
                                key={idx}
                                className="p-5 sm:p-6 rounded-2xl bg-white border border-brand-200/70 text-center space-y-2.5 hover:border-brand-300 transition-colors shadow-2xs flex flex-col items-center justify-center"
                            >
                                <div className="w-10 h-10 mx-auto rounded-xl bg-brand-100 flex items-center justify-center text-brand-800">
                                    <DynamicCategoryIcon
                                        name={fac.icon || (idx === 0 ? 'zap' : idx === 1 ? 'wifi' : idx === 2 ? 'plug' : 'building-2')}
                                        className="w-5 h-5 text-accent-copper"
                                    />
                                </div>
                                <h4 className="text-xs sm:text-sm font-bold text-brand-950">{fac.title}</h4>
                                <p className="text-[11px] sm:text-xs text-brand-600 leading-relaxed">{fac.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Section 4: Galeri Suasana Ruangan & Acara */}
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

                        <div
                            className={`grid ${getMobileGridClass(gridMobile)} ${getTabletGridClass(
                                gridTablet
                            )} ${getDesktopGridClass(gridDesktop)} gap-4 sm:gap-6`}
                        >
                            {galleryImages.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="group relative rounded-xl sm:rounded-2xl overflow-hidden bg-sand-200/50 border border-brand-100/60 shadow-2xs"
                                >
                                    <div className={`${getAspectClass(imageAspect)} w-full overflow-hidden`}>
                                        <img
                                            src={resolveImageUrl(item.image)}
                                            alt={item.caption || `Galeri Sanubari Roastery ${idx + 1}`}
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

                {/* Section 5: Form Reservasi WhatsApp Interaktif (Identical Style to Other Pages) */}
                <div
                    id="reservasi"
                    className="max-w-2xl mx-auto bg-sand-200/30 rounded-xl sm:rounded-3xl p-3.5 sm:p-8 space-y-3.5 sm:space-y-6 border border-brand-100/60 scroll-mt-20"
                >
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
                                    value={picName}
                                    onChange={(e) => setPicName(e.target.value)}
                                    placeholder="Contoh: Dimas Aditya"
                                    className="w-full h-8.5 sm:h-10 px-2.5 sm:px-3 rounded-lg sm:rounded-xl border border-brand-200 bg-white text-xs sm:text-sm text-brand-950 focus:border-brand-800 outline-none"
                                />
                            </div>

                            <div className="space-y-0.5 sm:space-y-1">
                                <label className="block text-[11px] sm:text-xs font-semibold text-brand-900">
                                    Nama Komunitas / Brand / Kantor
                                </label>
                                <input
                                    type="text"
                                    value={organizationName}
                                    onChange={(e) => setOrganizationName(e.target.value)}
                                    placeholder="Contoh: Komunitas Barista Malang"
                                    className="w-full h-8.5 sm:h-10 px-2.5 sm:px-3 rounded-lg sm:rounded-xl border border-brand-200 bg-white text-xs sm:text-sm text-brand-950 focus:border-brand-800 outline-none"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
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
                                    Rencana Tanggal Acara
                                </label>
                                <input
                                    type="date"
                                    value={eventDate}
                                    onChange={(e) => setEventDate(e.target.value)}
                                    className="w-full h-8.5 sm:h-10 px-2.5 sm:px-3 rounded-lg sm:rounded-xl border border-brand-200 bg-white text-xs sm:text-sm text-brand-950 focus:border-brand-800 outline-none"
                                />
                            </div>

                            <div className="space-y-0.5 sm:space-y-1">
                                <label className="block text-[11px] sm:text-xs font-semibold text-brand-900">
                                    Waktu / Jam
                                </label>
                                <input
                                    type="text"
                                    value={eventTime}
                                    onChange={(e) => setEventTime(e.target.value)}
                                    placeholder="Contoh: 14.00 - 18.00 WIB"
                                    className="w-full h-8.5 sm:h-10 px-2.5 sm:px-3 rounded-lg sm:rounded-xl border border-brand-200 bg-white text-xs sm:text-sm text-brand-950 focus:border-brand-800 outline-none"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                            <div className="space-y-0.5 sm:space-y-1">
                                <label className="block text-[11px] sm:text-xs font-semibold text-brand-900">
                                    Estimasi Peserta (Kapasitas 50+ Orang)
                                </label>
                                <select
                                    value={attendeeCount}
                                    onChange={(e) => setAttendeeCount(e.target.value)}
                                    className="w-full h-8.5 sm:h-10 px-2.5 sm:px-3 rounded-lg sm:rounded-xl border border-brand-200 bg-white text-xs sm:text-sm text-brand-950 focus:border-brand-800 outline-none"
                                >
                                    <option value="10 – 20 orang">10 – 20 orang (Intimate Gathering)</option>
                                    <option value="20 – 35 orang">20 – 35 orang (Workshop / Meeting)</option>
                                    <option value="35 – 50 orang">35 – 50 orang (Gathering / Seminar)</option>
                                    <option value="> 50 orang (Kapasitas Maksimal)">&gt; 50 orang (Kapasitas Maksimal)</option>
                                </select>
                            </div>

                            <div className="space-y-0.5 sm:space-y-1">
                                <label className="block text-[11px] sm:text-xs font-semibold text-brand-900">
                                    Jenis / Format Acara
                                </label>
                                <select
                                    value={eventType}
                                    onChange={(e) => setEventType(e.target.value)}
                                    className="w-full h-8.5 sm:h-10 px-2.5 sm:px-3 rounded-lg sm:rounded-xl border border-brand-200 bg-white text-xs sm:text-sm text-brand-950 focus:border-brand-800 outline-none"
                                >
                                    {eventTypes.map((type, idx) => (
                                        <option key={idx} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Pilihan Fasilitas Gratis */}
                        <div className="p-3 sm:p-3.5 rounded-xl bg-white border border-brand-200/80 space-y-1.5">
                            <span className="block text-[11px] sm:text-xs font-semibold text-brand-900">
                                Fasilitas Gratis yang Ingin Digunakan:
                            </span>
                            <div className="flex flex-wrap items-center gap-4 text-xs text-brand-800">
                                <label className="inline-flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={needProjector}
                                        onChange={(e) => setNeedProjector(e.target.checked)}
                                        className="w-4 h-4 rounded text-accent-copper border-brand-300 focus:ring-accent-copper"
                                    />
                                    <span>Free Proyektor & Layar</span>
                                </label>
                                <label className="inline-flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={needSoundSystem}
                                        onChange={(e) => setNeedSoundSystem(e.target.checked)}
                                        className="w-4 h-4 rounded text-accent-copper border-brand-300 focus:ring-accent-copper"
                                    />
                                    <span>Free Sound System & Mic Wireless</span>
                                </label>
                            </div>
                        </div>

                        <div className="space-y-0.5 sm:space-y-1">
                            <label className="block text-[11px] sm:text-xs font-semibold text-brand-900">
                                Catatan Khusus / Permintaan Tata Ruang
                            </label>
                            <textarea
                                rows={3}
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Contoh: Butuh susunan kursi model theater untuk 45 peserta, acara butuh proyektor mulai jam 15.00 WIB."
                                className="w-full p-2.5 sm:p-3 rounded-lg sm:rounded-xl border border-brand-200 bg-white text-xs sm:text-sm text-brand-950 focus:border-brand-800 outline-none"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-2.5 sm:py-3 px-4 rounded-xl bg-[#128C7E] hover:bg-[#075E54] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                        >
                            <MessageCircle className="w-4 h-4" />
                            <span>Kirim Reservasi ke WhatsApp Sanubari</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>

                        <p className="text-[10px] sm:text-[11px] text-center text-brand-500">
                            Pesan WhatsApp terformat otomatis akan langsung terhubung ke admin Sanubari Roastery.
                        </p>
                    </form>
                </div>

                {/* Section 6: Lokasi & Showroom Card (Identical Style) */}
                <div className="rounded-2xl sm:rounded-3xl bg-brand-950 text-white p-6 sm:p-10 border border-brand-900/60 shadow-lg">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="space-y-3 text-center md:text-left">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-900 text-accent-copper text-xs font-semibold">
                                <MapPin className="w-3.5 h-3.5" />
                                <span>Lokasi Kami di Malang</span>
                            </div>
                            <h3 className="text-xl sm:text-2xl font-black text-white">
                                Sanubari Roastery Malang
                            </h3>
                            <p className="text-xs sm:text-sm text-brand-300 max-w-lg leading-relaxed">
                                {address}
                            </p>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-brand-300">
                                <span className="inline-flex items-center gap-1.5">
                                    <Clock className="w-4 h-4 text-accent-copper" />
                                    <span>{hours}</span>
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                    <Phone className="w-4 h-4 text-emerald-400" />
                                    <span>+{cleanWhatsapp}</span>
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                            <a
                                href={mapsUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-brand-950 hover:bg-brand-50 text-xs sm:text-sm font-bold shadow-md transition-colors"
                            >
                                <MapPin className="w-4 h-4 text-accent-copper" />
                                <span>Buka Google Maps</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
