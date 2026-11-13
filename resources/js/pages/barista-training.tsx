import React, { useState } from 'react';
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

const getPackageContainerClass = (count: number) => {
    if (count <= 1) return 'max-w-md mx-auto grid grid-cols-1 gap-6 items-stretch justify-center';
    if (count === 2) return 'max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch justify-center';
    if (count === 3) return 'max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch justify-center';
    return 'max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch justify-center';
};

interface BaristaTrainingPageProps {
    page?: {
        hero_badge?: string;
        hero_title?: string;
        hero_description?: string;
        hero_image?: string;
        packages?: Array<{
            name: string;
            duration?: string;
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

export default function BaristaTrainingPage({ page }: BaristaTrainingPageProps) {
    const heroBadge = page?.hero_badge || 'Kelas Barista Profesional & Sertifikasi';
    const heroTitle = page?.hero_title || 'Training Barista Bersertifikat & Edukasi Seduh Spesialis';
    const heroDesc = page?.hero_description || 'Tingkatkan keahlian seduh kopi Anda dari dasar hingga siap kerja atau buka kedai. Dibimbing langsung oleh trainer dan roaster berpengalaman dengan mesin komersial standar industri di Sanubari Malang.';
    const heroImage = page?.hero_image
        ? resolveImageUrl(page.hero_image)
        : 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80';

    const packages = (page?.packages && page.packages.length > 0) ? page.packages : [
        {
            name: 'Kelas Basic',
            duration: '2 Hari (4-5 Jam / hari)',
            price: 'Rp 1.500.000 / 2 Orang',
            badge: 'PEMULA',
            is_popular: false,
            description: 'Kelas dasar komprehensif bagi pemula atau calon barista untuk menguasai kalibrasi espresso dan teknik susu yang sempurna.',
            features: [
                'Teori dasar biji kopi',
                'Mengenal dasar manual brew dan espresso based',
                'Teknik pouring, ratio, ekstraksi kopi manual brew',
                'Latte art pola dasar',
                'SOP kebersihan mesin & daily maintenance',
                'Sertifikat Resmi Alat Kopi Malang',
                'Bisa diisi untuk 2 Orang',
                'Jam bisa menyesuaikan',
            ],
        },
        {
            name: 'Kelas Advance',
            duration: '3 Hari (4-5 jam / hari)',
            price: 'Rp 1.900.000 / 2 orang',
            badge: 'ADVANCE',
            is_popular: true,
            description: 'Kelas dasar komprehensif bagi pemula atau calon barista untuk menguasai kalibrasi espresso dan membuat menu milk based, mocktail dan menu kekinian.',
            features: [
                'Teori dasar biji kopi',
                'Mengenal dasar manual brew dan espresso based',
                'Teknik pouring, ratio, ekstraksi kopi manual brew',
                'Latte art pola dasar',
                'SOP kebersihan mesin kopi dan maintenance',
                'Meracik minuman dingin seperti mocktail, milk based, es kopi susu',
                'Sertifikat resmi Alat Kopi Malang',
                'Bisa diisi untuk 2 orang',
                'Jadwal bisa menyesuaikan',
            ],
        },
    ];

    const galleryTitle = page?.gallery_title || 'Dokumentasi & Suasana Kelas Barista';
    const gallerySubtitle = page?.gallery_subtitle || 'Momen praktik peserta mengasah teknik espresso, latte art, dan manual brew di Sanubari Roastery Malang.';
    const gridDesktop = page?.grid_desktop ?? '3';
    const gridTablet = page?.grid_tablet ?? '2';
    const gridMobile = page?.grid_mobile ?? '1';
    const imageAspect = page?.image_aspect || 'aspect-4/3';
    const galleryImages = page?.gallery_images && page.gallery_images.length > 0 ? page.gallery_images : [
        {
            image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
            caption: 'Praktik Kalibrasi Grinder dan Ekstraksi Espresso Mesin Komersial',
        },
        {
            image: 'https://images.unsplash.com/photo-1534040385115-33dcb3acba5b?auto=format&fit=crop&w=800&q=80',
            caption: 'Latihan Teknik Milk Steaming dan Pouring Latte Art Presisi',
        },
        {
            image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
            caption: 'Teknik Manual Brew Pour Over V60 Memperhatikan Flow Rate',
        },
        {
            image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
            caption: 'Sesi Cupping Sensory Mengidentifikasi Tasting Notes Kopi',
        },
        {
            image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80',
            caption: 'Simulasi Alur Kerja Barista Saat Menghadapi Rush Hour Kedai',
        },
        {
            image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=800&q=80',
            caption: 'Suasana Belajar Nyaman di Sanubari Roastery Showroom Malang',
        },
    ];

    const waNumber = page?.whatsapp_number || '6285121930454';
    const formTitle = page?.form_title || 'Formulir Pendaftaran & Konsultasi Kelas Barista';
    const formSubtitle = page?.form_subtitle || 'Daftarkan diri Anda atau konsultasikan jadwal kelas privat langsung dengan tim trainer kami via WhatsApp.';

    // Interactive Form States
    const [fullName, setFullName] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [selectedPackage, setSelectedPackage] = useState('Kelas Basic');
    const [participantCount, setParticipantCount] = useState('1 Orang');
    const [experienceLevel, setExperienceLevel] = useState('Pemula Total (Belum Pernah)');
    const [preferredSchedule, setPreferredSchedule] = useState('Akhir Pekan (Sabtu / Minggu)');
    const [notes, setNotes] = useState('');

    const handleWhatsAppSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const msg = `Halo Tim Barista Academy Sanubari!\nSaya ingin mendaftar / konsultasi Kelas Barista:\n\n` +
            `• Nama Peserta / PIC: ${fullName}\n` +
            `• No. WhatsApp: ${contactPhone}\n` +
            `• Pilihan Program: ${selectedPackage}\n` +
            `• Jumlah Peserta: ${participantCount}\n` +
            `• Tingkat Pengalaman: ${experienceLevel}\n` +
            `• Preferensi Jadwal: ${preferredSchedule}\n` +
            (notes ? `• Catatan / Pertanyaan Khusus: ${notes}\n\n` : `\n`) +
            `Mohon informasi ketersediaan jadwal terdekat dan konfirmasi pendaftarannya. Terima kasih!`;
        window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`, '_blank');
    };

    return (
        <PublicLayout title="Training Barista Profesional & Sertifikasi | Sanubari Roastery">
            {/* Header Hero Section */}
            <div className="relative bg-brand-950 text-white py-12 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-brand-900/60 overflow-hidden">
                {heroImage && (
                    <div className="absolute inset-0 opacity-15 pointer-events-none">
                        <img src={heroImage} alt="" className="w-full h-full object-cover" />
                    </div>
                )}
                <div className="relative max-w-4xl mx-auto space-y-3 sm:space-y-4 text-center">
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
                {/* Section: Pilihan Program & Paket Pelatihan */}
                <div id="paket-kelas" className="space-y-6 sm:space-y-8 scroll-mt-20">
                    <div className="text-center max-w-2xl mx-auto space-y-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-accent-copper">
                            Investasi Keterampilan & Karir
                        </span>
                        <h2 className="text-xl sm:text-3xl font-extrabold text-brand-950 tracking-tight">
                            Pilihan Program Training Barista
                        </h2>
                        <p className="text-xs sm:text-sm text-brand-600 leading-relaxed">
                            Pilih program yang sesuai dengan tujuan Anda: memulai hobi seduh di rumah, melamar kerja barista, atau membuka kedai kopi mandiri.
                        </p>
                    </div>

                    <div className={getPackageContainerClass(packages.length)}>
                        {packages.map((pkg, idx) => {
                            const featureList = Array.isArray(pkg.features)
                                ? pkg.features
                                : typeof pkg.features === 'string'
                                ? pkg.features.split('\n').filter(Boolean)
                                : [];

                            return (
                                <div
                                    key={idx}
                                    className={`relative rounded-2xl sm:rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 ${
                                        pkg.is_popular
                                            ? 'bg-brand-950 text-white shadow-xl ring-2 ring-accent-copper lg:-translate-y-2'
                                            : 'bg-white text-brand-950 shadow-sm border border-brand-100 hover:shadow-md'
                                    }`}
                                >
                                    {pkg.badge && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                            <span className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase shadow-2xs whitespace-nowrap ${
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
                                            <h3 className="text-base sm:text-lg font-extrabold leading-snug">{pkg.name}</h3>
                                            {pkg.duration && (
                                                <p className={`text-xs font-semibold ${pkg.is_popular ? 'text-brand-300' : 'text-brand-500'}`}>
                                                    ⏱ Durasi: {pkg.duration}
                                                </p>
                                            )}
                                        </div>

                                        <div className="pt-2 border-t border-brand-800/40">
                                            <span className="text-xl sm:text-2xl font-black tracking-tight">
                                                {pkg.price || 'Hubungi Kami'}
                                            </span>
                                        </div>

                                        {pkg.description && (
                                            <p className={`text-xs leading-relaxed ${pkg.is_popular ? 'text-brand-200/90' : 'text-brand-600'}`}>
                                                {pkg.description}
                                            </p>
                                        )}

                                        {featureList.length > 0 && (
                                            <ul className="space-y-2 pt-2">
                                                {featureList.map((f, fIdx) => (
                                                    <li key={fIdx} className="flex items-start gap-2 text-xs">
                                                        <Check className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${pkg.is_popular ? 'text-accent-copper' : 'text-emerald-600'}`} />
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
                                            href="#daftar"
                                            onClick={() => setSelectedPackage(pkg.name.toLowerCase().includes('advance') ? 'Kelas Advance' : 'Kelas Basic')}
                                            className={`w-full py-3 px-4 rounded-xl font-bold text-xs text-center inline-flex items-center justify-center gap-2 transition-colors ${
                                                pkg.is_popular
                                                    ? 'bg-accent-copper hover:bg-accent-copper/90 text-brand-950 shadow-sm'
                                                    : 'bg-brand-950 hover:bg-brand-800 text-white'
                                            }`}
                                        >
                                            <span>Daftar Kelas Ini</span>
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </a>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Section: Galeri Foto Suasana Belajar & Praktik */}
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
                                            alt={item.caption || `Galeri Training Barista ${idx + 1}`}
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

                {/* Section: Form Pendaftaran WhatsApp Interaktif */}
                <div id="daftar" className="max-w-2xl mx-auto bg-sand-200/30 rounded-xl sm:rounded-3xl p-3.5 sm:p-8 space-y-3.5 sm:space-y-6 border border-brand-100/60 scroll-mt-20">
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
                                    Nama Lengkap Peserta / PIC *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Contoh: Rian Pratama"
                                    className="w-full h-8.5 sm:h-10 px-2.5 sm:px-3 rounded-lg sm:rounded-xl border border-brand-200 bg-white text-xs sm:text-sm text-brand-950 focus:border-brand-800 outline-none"
                                />
                            </div>
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
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                            <div className="space-y-0.5 sm:space-y-1">
                                <label className="block text-[11px] sm:text-xs font-semibold text-brand-900">
                                    Pilihan Program Kelas *
                                </label>
                                <select
                                    value={selectedPackage}
                                    onChange={(e) => setSelectedPackage(e.target.value)}
                                    className="w-full h-8.5 sm:h-10 px-2.5 sm:px-3 rounded-lg sm:rounded-xl border border-brand-200 bg-white text-xs sm:text-sm text-brand-950 focus:border-brand-800 outline-none"
                                >
                                    <option value="Kelas Basic">Kelas Basic</option>
                                    <option value="Kelas Advance">Kelas Advance</option>
                                </select>
                            </div>
                            <div className="space-y-0.5 sm:space-y-1">
                                <label className="block text-[11px] sm:text-xs font-semibold text-brand-900">
                                    Jumlah Peserta
                                </label>
                                <select
                                    value={participantCount}
                                    onChange={(e) => setParticipantCount(e.target.value)}
                                    className="w-full h-8.5 sm:h-10 px-2.5 sm:px-3 rounded-lg sm:rounded-xl border border-brand-200 bg-white text-xs sm:text-sm text-brand-950 focus:border-brand-800 outline-none"
                                >
                                    <option value="1 Orang">1 Orang</option>
                                    <option value="2 Orang">2 Orang</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                            <div className="space-y-0.5 sm:space-y-1">
                                <label className="block text-[11px] sm:text-xs font-semibold text-brand-900">
                                    Tingkat Pengalaman Saat Ini
                                </label>
                                <select
                                    value={experienceLevel}
                                    onChange={(e) => setExperienceLevel(e.target.value)}
                                    className="w-full h-8.5 sm:h-10 px-2.5 sm:px-3 rounded-lg sm:rounded-xl border border-brand-200 bg-white text-xs sm:text-sm text-brand-950 focus:border-brand-800 outline-none"
                                >
                                    <option value="Pemula Total (Belum Pernah)">Pemula Total (Belum Pernah)</option>
                                    <option value="Hobi Seduh Manual di Rumah">Hobi Seduh Manual di Rumah</option>
                                    <option value="Pernah Bekerja Sebagai Barista">Pernah Bekerja Sebagai Barista</option>
                                    <option value="Calon Pemilik / Owner Kedai Kopi">Calon Pemilik / Owner Kedai Kopi</option>
                                </select>
                            </div>
                            <div className="space-y-0.5 sm:space-y-1">
                                <label className="block text-[11px] sm:text-xs font-semibold text-brand-900">
                                    Preferensi Jadwal Kelas
                                </label>
                                <select
                                    value={preferredSchedule}
                                    onChange={(e) => setPreferredSchedule(e.target.value)}
                                    className="w-full h-8.5 sm:h-10 px-2.5 sm:px-3 rounded-lg sm:rounded-xl border border-brand-200 bg-white text-xs sm:text-sm text-brand-950 focus:border-brand-800 outline-none"
                                >
                                    <option value="Akhir Pekan (Sabtu / Minggu)">Akhir Pekan (Sabtu / Minggu)</option>
                                    <option value="Hari Kerja (Senin – Jumat)">Hari Kerja (Senin – Jumat)</option>
                                    <option value="Jadwal Fleksibel (Private Class)">Jadwal Fleksibel (Private Class)</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-0.5 sm:space-y-1">
                            <label className="block text-[11px] sm:text-xs font-semibold text-brand-900">
                                Catatan / Pertanyaan Tambahan (Opsional)
                            </label>
                            <textarea
                                rows={2}
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Tuliskan jika ada tanggal target, rencana buka kedai, atau permintaan materi khusus."
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

