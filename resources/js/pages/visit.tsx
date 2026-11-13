import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Clock, Coffee, Compass, ExternalLink, MapPin, MessageCircle, Phone, Store } from 'lucide-react';
import { PublicLayout } from '@/layouts/public-layout';
import { SectionHeading } from '@/components/ui/section-heading';

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

interface VisitPageProps {
    page?: {
        hero_badge?: string;
        hero_title?: string;
        hero_description?: string;
        welcome_title?: string;
        address?: string;
        hours?: string;
        phone?: string;
        maps_url?: string;
        facilities?: Array<{ title: string; description: string }>;
        main_image?: string;
        gallery_title?: string;
        gallery_subtitle?: string;
        grid_desktop?: number | string;
        grid_tablet?: number | string;
        grid_mobile?: number | string;
        image_aspect?: string;
        gallery_images?: Array<{ image: string; caption?: string }>;
    };
}

export default function VisitPage({ page }: VisitPageProps) {
    const heroBadge = page?.hero_badge || 'Roastery & Showroom Malang';
    const heroTitle = page?.hero_title || 'Sanubari Roastery x Alat Kopi Malang';
    const heroDesc = page?.hero_description || 'Cicipi beans fresh roast langsung di slow bar kami, coba mesin espresso komersial, dan konsultasikan kebutuhan seduh Anda bersama roaster dan barista kami.';

    const welcomeTitle = page?.welcome_title || 'Selamat Datang di Malang';
    const address = page?.address || 'Jl. Terusan Kawi No. 12, Klojen, Kota Malang, Jawa Timur 65116 (Gedung Sanubari x Alat Kopi Malang)';
    const hours = page?.hours || 'Buka Setiap Hari: 09.00–23.00 WIB (Layanan Seduh di Tempat & Pembelian Beans)';
    const phone = page?.phone || '+62 851-2193-0454';
    const mapsUrl = page?.maps_url || 'https://maps.app.goo.gl/PMuxaEtsbEvC4APy7';

    const mainImage = page?.main_image
        ? resolveImageUrl(page.main_image)
        : 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80';

    const galleryTitle = page?.gallery_title || 'Galeri Suasana Roastery & Showroom';
    const gallerySubtitle = page?.gallery_subtitle || 'Dokumentasi ruang seduh, mesin espresso komersial, dan kehangatan slow bar kami di Malang.';
    const gridDesktop = page?.grid_desktop ?? '3';
    const gridTablet = page?.grid_tablet ?? '2';
    const gridMobile = page?.grid_mobile ?? '1';
    const imageAspect = page?.image_aspect || 'aspect-4/3';
    const galleryImages = page?.gallery_images || [];

    const facilities = (page?.facilities && page.facilities.length > 0) ? page.facilities : [
        {
            title: 'Slow Bar & Cupping',
            description: 'Cicipi kalibrasi seduhan manual filter V60, Aeropress, atau espresso dari biji kopi sangrai minggu ini.',
        },
        {
            title: 'Equipment Showroom',
            description: 'Coba langsung berbagai grinder, mesin espresso komersial, kettle leher angsa, dripper, dan timbangan digital.',
        },
    ];

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const waLink = cleanPhone ? `https://wa.me/${cleanPhone}` : 'https://wa.me/6285121930454';

    return (
        <PublicLayout title="Kunjungi Roastery & Showroom Malang">
            <div className="bg-brand-950 text-white py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4 text-center">
                    <span className="inline-block text-sm font-semibold tracking-wider uppercase text-accent-copper">
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

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10 sm:space-y-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
                    {/* Left: Info & Hours (5 cols) */}
                    <div className="lg:col-span-5 bg-sand-200/40 rounded-2xl sm:rounded-3xl p-5 sm:p-8 space-y-4 sm:space-y-6">
                        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-brand-950">
                            {welcomeTitle}
                        </h2>

                        <div className="space-y-3.5 sm:space-y-4 text-sm sm:text-base text-brand-800">
                            <div className="flex items-start gap-2.5 sm:gap-3">
                                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-accent-copper flex-shrink-0 mt-0.5" />
                                <div>
                                    <strong className="block text-sm sm:text-base font-bold text-brand-950">Alamat Roastery & Store:</strong>
                                    <p className="text-brand-700 mt-0.5 sm:mt-1 leading-relaxed text-sm sm:text-base">
                                        {address}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-2.5 sm:gap-3">
                                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-accent-copper flex-shrink-0 mt-0.5" />
                                <div>
                                    <strong className="block text-sm sm:text-base font-bold text-brand-950">Jam Operasional:</strong>
                                    <p className="text-brand-700 mt-0.5 sm:mt-1 leading-relaxed text-sm sm:text-base">
                                        {hours}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-2.5 sm:gap-3">
                                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-accent-copper flex-shrink-0 mt-0.5" />
                                <div>
                                    <strong className="block text-sm sm:text-base font-bold text-brand-950">Kontak WhatsApp:</strong>
                                    <a
                                        href={waLink}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-accent-copper font-bold hover:underline text-sm sm:text-base"
                                    >
                                        {phone}
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="pt-2 sm:pt-4 space-y-3">
                            <a
                                href={mapsUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="w-full flex items-center justify-center gap-1.5 sm:gap-2 py-3 sm:py-3.5 bg-brand-700 hover:bg-brand-800 text-white font-semibold text-sm sm:text-base rounded-xl transition-colors shadow-2xs"
                            >
                                <ExternalLink className="w-4 h-4" />
                                <span>Buka Rute di Google Maps</span>
                            </a>
                        </div>
                    </div>

                    {/* Right: Experience Cards & Atmosphere (7 cols) */}
                    <div className="lg:col-span-7 space-y-4 sm:space-y-6">
                        <div className="rounded-2xl sm:rounded-3xl overflow-hidden aspect-16/9 bg-brand-900 shadow-md">
                            <img
                                src={mainImage}
                                alt="Suasana Slow Bar Sanubari Roastery Malang"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            {facilities.map((fac, idx) => (
                                <div key={idx} className="bg-sand-200/40 p-4 sm:p-6 rounded-xl sm:rounded-2xl">
                                    {idx % 2 === 0 ? (
                                        <Coffee className="hidden sm:block w-5 h-5 sm:w-6 sm:h-6 text-accent-copper mb-1.5 sm:mb-2" />
                                    ) : (
                                        <Store className="hidden sm:block w-5 h-5 sm:w-6 sm:h-6 text-accent-copper mb-1.5 sm:mb-2" />
                                    )}
                                    <h4 className="text-base sm:text-lg font-bold text-brand-950 mb-0.5 sm:mb-1">{fac.title}</h4>
                                    <p className="text-sm sm:text-base text-brand-700 leading-relaxed">
                                        {fac.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 2. Photo Gallery Section with Responsive Custom Grid */}
                {galleryImages.length > 0 && (
                    <div className="space-y-6 sm:space-y-8 pt-6 sm:pt-8 border-t border-sand-200">
                        <div className="max-w-2xl text-center mx-auto">
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight text-brand-950">
                                {galleryTitle}
                            </h2>
                            {gallerySubtitle && (
                                <p className="mt-2 text-sm sm:text-base text-brand-600 leading-relaxed">
                                    {gallerySubtitle}
                                </p>
                            )}
                        </div>

                        <div
                            className={`grid ${getMobileGridClass(gridMobile)} ${getTabletGridClass(gridTablet)} ${getDesktopGridClass(gridDesktop)} gap-3 sm:gap-6`}
                        >
                            {galleryImages.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="group relative rounded-xl sm:rounded-2xl overflow-hidden bg-sand-200/40 border border-sand-200 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col"
                                >
                                    <div className={`w-full overflow-hidden bg-brand-900 ${getAspectClass(imageAspect)}`}>
                                        <img
                                            src={resolveImageUrl(item.image)}
                                            alt={item.caption || `Foto Suasana Roastery Sanubari ${idx + 1}`}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            loading="lazy"
                                        />
                                    </div>
                                    {item.caption && (
                                        <div className="p-2.5 sm:p-3.5 bg-white/95 backdrop-blur-xs border-t border-sand-200 flex-1 flex items-center">
                                            <p className="text-sm font-medium text-brand-900 line-clamp-2">
                                                {item.caption}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
