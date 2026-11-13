import React, { useState } from 'react';
import { Camera, CheckCircle2, Coffee, MessageCircle, Settings, Sparkles, Truck } from 'lucide-react';
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
        case 'aspect-3/2': return 'aspect-3/2';
        case 'aspect-4/3':
        default: return 'aspect-4/3';
    }
};

interface WholesaleBenefit {
    title: string;
    description: string;
    image?: string | null;
}

interface WholesalePageProps {
    page?: {
        hero_badge?: string;
        hero_title?: string;
        hero_description?: string;
        hero_image?: string;
        benefits?: WholesaleBenefit[];
        whatsapp_number?: string;
        form_image?: string;
        form_badge?: string;
        form_title?: string;
        form_subtitle?: string;
        gallery_title?: string;
        gallery_subtitle?: string;
        grid_desktop?: number | string;
        grid_tablet?: number | string;
        grid_mobile?: number | string;
        image_aspect?: string;
        gallery_images?: Array<{ image: string; caption?: string }>;
    };
}

export default function WholesalePage({ page }: WholesalePageProps) {
    const heroBadge = page?.hero_badge || 'Kemitraan B2B & Pasokan Kedai';
    const heroTitle = page?.hero_title || 'Pasokan Biji Kopi Grosir & Setup Kedai';
    const heroDesc = page?.hero_description || 'Konsistensi rasa dari batch ke batch, profil sangrai kustom untuk signature drink, dan bundling mesin espresso komersial bersama Alat Kopi Malang.';
    const heroImage = page?.hero_image ? resolveImageUrl(page.hero_image) : null;

    const benefits: WholesaleBenefit[] = (page?.benefits && page.benefits.length > 0) ? page.benefits : [
        {
            title: 'Harga Grosir Bertingkat',
            description: 'Potongan harga berjenjang mulai dari order 5 kg, 10 kg, hingga kontrak pasokan bulanan rutin dengan jaminan ketersediaan stok panen.',
            image: null,
        },
        {
            title: 'Custom Roast Profile',
            description: 'Kembangkan profil sangrai eksklusif (signature houseblend) khusus untuk karakter menu coffee shop Anda bersama head roaster kami.',
            image: null,
        },
        {
            title: 'Paket Mesin & Barista Training',
            description: 'Bundling mesin espresso komersial, grinder, dan kalibrasi seduh berkala bersama tim teknisi Alat Kopi Malang.',
            image: null,
        },
    ];

    const waNumber = page?.whatsapp_number || '6285121930454';
    const formImage = page?.form_image ? resolveImageUrl(page.form_image) : null;
    const formBadge = page?.form_badge || 'Partner Terpercaya 50+ Kedai Kopi';
    const formTitle = page?.form_title || 'Formulir Kemitraan Langsung WhatsApp';
    const formSubtitle = page?.form_subtitle || 'Isi detail singkat usaha Anda untuk langsung berkonsultasi dengan tim kemitraan kami.';

    const galleryTitle = page?.gallery_title || 'Dokumentasi Kemitraan & Pasokan Kedai';
    const gallerySubtitle = page?.gallery_subtitle || 'Setup mesin espresso komersial, kalibrasi rasa, dan pasokan rutin biji kopi di berbagai coffee shop mitra kami.';
    const gridDesktop = page?.grid_desktop ?? '3';
    const gridTablet = page?.grid_tablet ?? '2';
    const gridMobile = page?.grid_mobile ?? '1';
    const imageAspect = page?.image_aspect || 'aspect-4/3';
    const galleryImages = page?.gallery_images && page.gallery_images.length > 0 ? page.gallery_images : [];

    const [cafeName, setCafeName] = useState('');
    const [city, setCity] = useState('');
    const [contactName, setContactName] = useState('');
    const [phone, setPhone] = useState('');
    const [volume, setVolume] = useState('10 - 30 kg/bulan');

    const handleWhatsAppSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const msg = `Halo Tim Sanubari Roastery!\nSaya tertarik bermitra wholesale/B2B:\n\nNama Kedai/Usaha: ${cafeName}\nKota: ${city}\nNama PIC: ${contactName}\nWhatsApp: ${phone}\nEstimasi Kebutuhan: ${volume}\n\nMohon informasi pricelist grosir dan katalog varietas kopi. Terima kasih!`;
        window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`, '_blank');
    };

    return (
        <PublicLayout title="Wholesale & Kemitraan Kedai Kopi (B2B) | Sanubari Roastery">
            {/* Header Hero Banner */}
            <div className="relative bg-brand-950 text-white py-14 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden text-center">
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

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16 sm:space-y-20">
                {/* Benefits Grid */}
                <div className="space-y-6">
                    <div className="text-center max-w-2xl mx-auto space-y-2">
                        <h2 className="text-xl sm:text-3xl font-extrabold text-brand-950">
                            Keuntungan Bermitra dengan Sanubari
                        </h2>
                        <p className="text-xs sm:text-sm text-brand-600">
                            Dukungan menyeluruh dari biji kopi berkualitas prima hingga setup operasional bar mesin.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {benefits.map((b, idx) => {
                            const bImg = b.image ? resolveImageUrl(b.image) : null;

                            return (
                                <div
                                    key={idx}
                                    className="bg-white rounded-2xl border border-sand-200 shadow-2xs hover:shadow-md transition-shadow overflow-hidden flex flex-col"
                                >
                                    {bImg ? (
                                        <div className="w-full h-44 bg-sand-100 overflow-hidden">
                                            <img
                                                src={bImg}
                                                alt={b.title}
                                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                                loading="lazy"
                                            />
                                        </div>
                                    ) : null}

                                    <div className="p-6 sm:p-7 space-y-3 flex-1 flex flex-col">
                                        {!bImg && (
                                            <div className="w-12 h-12 rounded-xl bg-sand-100 flex items-center justify-center text-brand-800 shadow-2xs">
                                                {idx === 0 ? <Truck className="w-6 h-6" /> : idx === 1 ? <Settings className="w-6 h-6" /> : <Coffee className="w-6 h-6" />}
                                            </div>
                                        )}
                                        <h3 className="text-base sm:text-lg font-bold text-brand-950">
                                            {b.title}
                                        </h3>
                                        <p className="text-xs sm:text-sm text-brand-700 leading-relaxed flex-1">
                                            {b.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Form & Consultation Showcase Section */}
                <div className="bg-sand-100/70 rounded-3xl p-6 sm:p-10 lg:p-12 border border-sand-200">
                    <div className={`grid grid-cols-1 ${formImage ? 'lg:grid-cols-12 gap-8 lg:gap-12' : 'max-w-2xl mx-auto'} items-center`}>
                        {formImage && (
                            <div className="lg:col-span-5 space-y-6">
                                <div className="relative rounded-2xl overflow-hidden shadow-md aspect-4/3 sm:aspect-16/10 lg:aspect-4/3 bg-sand-200">
                                    <img
                                        src={formImage}
                                        alt={formTitle}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                    {formBadge && (
                                        <div className="absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-black/75 backdrop-blur-xs text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                                            <Sparkles className="w-3.5 h-3.5 text-accent-copper" />
                                            <span>{formBadge}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-3">
                                    <h4 className="text-lg font-extrabold text-brand-950">
                                        Kenapa Memilih Pasokan Sanubari?
                                    </h4>
                                    <ul className="space-y-2 text-xs sm:text-sm text-brand-700">
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-[#128C7E] shrink-0" />
                                            <span>Biji kopi lereng Gunung Kawi segar terjamin panen baru</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-[#128C7E] shrink-0" />
                                            <span>Pricelist transparan potongan berjenjang tanpa biaya tersembunyi</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-[#128C7E] shrink-0" />
                                            <span>Dukungan teknisi mesin espresso & kalibrasi barista berkala</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        )}

                        <div className={`${formImage ? 'lg:col-span-7' : 'w-full'} bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-sm border border-sand-200 space-y-6`}>
                            <div className="space-y-1.5">
                                <h3 className="text-xl sm:text-2xl font-extrabold text-brand-950 flex items-center gap-2">
                                    <MessageCircle className="w-6 h-6 text-[#128C7E]" />
                                    <span>{formTitle}</span>
                                </h3>
                                <p className="text-xs sm:text-sm text-brand-600">
                                    {formSubtitle}
                                </p>
                            </div>

                            <form onSubmit={handleWhatsAppSubmit} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="block text-xs sm:text-sm font-semibold text-brand-900">Nama Coffee Shop / Usaha *</label>
                                    <input
                                        type="text"
                                        required
                                        value={cafeName}
                                        onChange={(e) => setCafeName(e.target.value)}
                                        placeholder="Contoh: Kopi Senja Malang"
                                        className="w-full px-4 py-3 rounded-xl bg-sand-50 border border-sand-200 text-sm text-brand-950 focus:outline-hidden focus:border-brand-500 transition-colors"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <label className="block text-xs sm:text-sm font-semibold text-brand-900">Nama PIC / Kontak *</label>
                                        <input
                                            type="text"
                                            required
                                            value={contactName}
                                            onChange={(e) => setContactName(e.target.value)}
                                            placeholder="Contoh: Budi Santoso"
                                            className="w-full px-4 py-3 rounded-xl bg-sand-50 border border-sand-200 text-sm text-brand-950 focus:outline-hidden focus:border-brand-500 transition-colors"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="block text-xs sm:text-sm font-semibold text-brand-900">Kota Lokasi Kedai *</label>
                                        <input
                                            type="text"
                                            required
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                            placeholder="Contoh: Malang"
                                            className="w-full px-4 py-3 rounded-xl bg-sand-50 border border-sand-200 text-sm text-brand-950 focus:outline-hidden focus:border-brand-500 transition-colors"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <label className="block text-xs sm:text-sm font-semibold text-brand-900">Nomor WhatsApp Aktif *</label>
                                        <input
                                            type="tel"
                                            required
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="Contoh: 08123456789"
                                            className="w-full px-4 py-3 rounded-xl bg-sand-50 border border-sand-200 text-sm text-brand-950 focus:outline-hidden focus:border-brand-500 transition-colors"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="block text-xs sm:text-sm font-semibold text-brand-900">Estimasi Kebutuhan Bulanan</label>
                                        <select
                                            value={volume}
                                            onChange={(e) => setVolume(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl bg-sand-50 border border-sand-200 text-sm text-brand-950 focus:outline-hidden focus:border-brand-500 transition-colors"
                                        >
                                            <option value="5 - 10 kg/bulan">5 – 10 kg/bulan</option>
                                            <option value="10 - 30 kg/bulan">10 – 30 kg/bulan</option>
                                            <option value="30 - 100 kg/bulan">30 – 100 kg/bulan</option>
                                            <option value="> 100 kg/bulan">&gt; 100 kg/bulan</option>
                                        </select>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3.5 rounded-xl bg-[#128C7E] hover:bg-[#075E54] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md active:scale-[0.99] cursor-pointer"
                                >
                                    <MessageCircle className="w-5 h-5 fill-white" />
                                    <span>Kirim Formulir ke WhatsApp</span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Documentation & Partner Showcase Gallery */}
                {galleryImages.length > 0 && (
                    <div className="space-y-8 pt-4 border-t border-brand-100">
                        <div className="text-center max-w-2xl mx-auto space-y-2">
                            <span className="text-xs font-bold uppercase tracking-widest text-accent-copper block flex items-center justify-center gap-1.5">
                                <Camera className="w-4 h-4" />
                                <span>Galeri Kemitraan</span>
                            </span>
                            <h2 className="text-xl sm:text-3xl font-extrabold text-brand-950">
                                {galleryTitle}
                            </h2>
                            {gallerySubtitle && (
                                <p className="text-xs sm:text-sm text-brand-600 leading-relaxed">
                                    {gallerySubtitle}
                                </p>
                            )}
                        </div>

                        <div className={`grid ${getMobileGridClass(gridMobile)} ${getTabletGridClass(gridTablet)} ${getDesktopGridClass(gridDesktop)} gap-4 sm:gap-6`}>
                            {galleryImages.map((item, index) => {
                                const resolvedImg = resolveImageUrl(item.image);

                                return (
                                    <div
                                        key={index}
                                        className="group relative bg-white rounded-2xl overflow-hidden border border-sand-200 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col"
                                    >
                                        <div className={`w-full ${getAspectClass(imageAspect)} overflow-hidden bg-sand-100 relative`}>
                                            <img
                                                src={resolvedImg}
                                                alt={item.caption || `Dokumentasi Wholesale ${index + 1}`}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                loading="lazy"
                                            />
                                        </div>

                                        {item.caption && (
                                            <div className="p-3.5 sm:p-4 bg-white border-t border-sand-100">
                                                <p className="text-xs text-brand-700 leading-snug font-medium line-clamp-2">
                                                    {item.caption}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
