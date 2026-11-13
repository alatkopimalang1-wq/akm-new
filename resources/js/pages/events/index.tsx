import React from 'react';
import { Calendar, Clock, MapPin, MessageCircle, Ticket, Users } from 'lucide-react';
import { PublicLayout } from '@/layouts/public-layout';
import type { Event } from '@/types/sanubari';
import { formatRupiah } from '@/lib/trans';

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

const parseEventDate = (dateStr: string | null | undefined): Date => {
    if (!dateStr) return new Date();
    const clean = dateStr.replace(/Z$/, '').replace(/([+-]\d{2}:\d{2})$/, '');
    return new Date(clean);
};

const formatEventSchedule = (event: Event): string => {
    if (event.formatted_schedule) {
        return event.formatted_schedule;
    }
    const startDate = parseEventDate(event.starts_at);
    const baseDate = startDate.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
    if (event.ends_at) {
        const endDate = parseEventDate(event.ends_at);
        const endHour = endDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        return `${baseDate} - ${endHour} WIB`;
    }
    return `${baseDate} WIB`;
};

interface EventsIndexProps {
    upcoming: Event[];
    past: Event[];
    page?: {
        hero_badge?: string;
        hero_title?: string;
        hero_description?: string;
        hero_image?: string;
        upcoming_title?: string;
        empty_message?: string;
        show_past?: boolean;
        past_title?: string;
        whatsapp_number?: string;
        cta_button_text?: string;
        cta_note?: string;
        gallery_title?: string;
        gallery_subtitle?: string;
        grid_desktop?: number | string;
        grid_tablet?: number | string;
        grid_mobile?: number | string;
        image_aspect?: string;
        gallery_images?: Array<{ image: string; caption?: string }>;
    };
}

export default function EventsIndex({ upcoming = [], past = [], page }: EventsIndexProps) {
    const heroBadge = page?.hero_badge || 'Komunitas & Edukasi';
    const heroTitle = page?.hero_title || 'Workshop & Sesi Cupping Terbuka';
    const heroDesc = page?.hero_description || 'Bergabung bersama komunitas pecinta kopi di Malang dalam sesi cupping kalibrasi rasa, kelas manual brew, dan bincang santai bersama roaster Sanubari.';
    const heroImage = page?.hero_image ? resolveImageUrl(page.hero_image) : null;

    const upcomingTitle = page?.upcoming_title || 'Acara Mendatang';
    const emptyMessage = page?.empty_message || 'Belum ada jadwal acara baru saat ini. Ikuti Instagram kami di @sanubari.roastery.mlg untuk kabar workshop terdekat!';
    const showPast = page?.show_past ?? true;
    const pastTitle = page?.past_title || 'Arsip & Riwayat Acara Sebelumnya';
    const waNumber = page?.whatsapp_number || '6285121930454';
    const ctaButtonText = page?.cta_button_text || 'Daftar via WhatsApp';
    const ctaNote = page?.cta_note || 'Slot terbatas • Konfirmasi instan';

    const galleryTitle = page?.gallery_title || 'Dokumentasi Acara & Workshop Sanubari';
    const gallerySubtitle = page?.gallery_subtitle || 'Momen kebersamaan komunitas, sesi sensory cupping, dan workshop seduh di Malang.';
    const gridDesktop = page?.grid_desktop ?? '3';
    const gridTablet = page?.grid_tablet ?? '2';
    const gridMobile = page?.grid_mobile ?? '1';
    const imageAspect = page?.image_aspect || 'aspect-4/3';
    const galleryImages = page?.gallery_images && page.gallery_images.length > 0 ? page.gallery_images : [];

    return (
        <PublicLayout title="Acara & Workshop Cupping Kopi | Sanubari Roastery">
            {/* Header Hero Section */}
            <div className="relative bg-brand-950 text-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-brand-900 text-center space-y-3 overflow-hidden">
                {heroImage && (
                    <div className="absolute inset-0 opacity-15 pointer-events-none">
                        <img src={heroImage} alt="" className="w-full h-full object-cover" />
                    </div>
                )}
                <div className="relative max-w-3xl mx-auto space-y-3">
                    <span className="text-xs font-bold uppercase tracking-widest text-accent-copper block">
                        {heroBadge}
                    </span>
                    <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                        {heroTitle}
                    </h1>
                    <p className="text-xs sm:text-sm text-brand-300 max-w-xl mx-auto leading-relaxed">
                        {heroDesc}
                    </p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12 sm:space-y-16">
                {/* Upcoming Events */}
                <div className="space-y-6">
                    <h2 className="text-xl sm:text-2xl font-extrabold text-brand-950 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-accent-copper" />
                        <span>{upcomingTitle}</span>
                    </h2>

                    {upcoming.length === 0 ? (
                        <div className="p-8 sm:p-12 bg-white rounded-2xl border border-sand-200 text-center text-xs sm:text-sm text-brand-600 shadow-2xs">
                            {emptyMessage}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {upcoming.map((ev) => {
                                const title = typeof ev.title === 'string' ? ev.title : (ev.title as any)?.id || '';
                                const desc = typeof ev.description === 'string' ? ev.description : (ev.description as any)?.id || '';
                                const coverImg = ev.cover_image ? resolveImageUrl(ev.cover_image) : null;
                                const isWalkIn = ev.meta?.entry_type === 'walk_in' || ['Live Music', 'Live DJ', 'Stand Sanubari'].includes(ev.category || '');
                                const isFull = !isWalkIn && ev.status === 'full';
                                const walkInBadge = ev.meta?.walk_in_badge || 'Bebas Masuk • Langsung Datang';
                                const actionButtonText = ev.meta?.action_button_text || (isWalkIn ? 'Buka Petunjuk Arah' : ctaButtonText);
                                const mapsUrl = ev.meta?.maps_url || (ev.address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${ev.location || 'Sanubari Roastery'} ${ev.address}`)}` : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ev.location || 'Sanubari Roastery Malang')}`);

                                const dateFormatted = formatEventSchedule(ev);
                                const defaultMsg = isWalkIn
                                    ? `Halo Sanubari Roastery! Saya ingin bertanya info mengenai acara: *${title}* (${dateFormatted}). Terima kasih!`
                                    : `Halo Sanubari Roastery! Saya ingin mendaftar untuk acara: *${title}* (${dateFormatted}). Mohon info ketersediaan slot. Terima kasih!`;
                                const waMsg = ev.whatsapp_register_text && ev.whatsapp_register_text.trim().length > 0
                                    ? ev.whatsapp_register_text
                                    : defaultMsg;

                                return (
                                    <div
                                        key={ev.id}
                                        className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-sand-200 shadow-sm hover:shadow-md transition-shadow grid grid-cols-1 md:grid-cols-12 items-stretch"
                                    >
                                        {coverImg && (
                                            <div className="md:col-span-4 bg-sand-100 relative min-h-[200px] md:min-h-full">
                                                <img
                                                    src={coverImg}
                                                    alt={title}
                                                    className="w-full h-full object-cover"
                                                    loading="lazy"
                                                />
                                                {isWalkIn ? (
                                                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-700 text-white shadow-xs">
                                                        {walkInBadge}
                                                    </span>
                                                ) : isFull ? (
                                                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-red-600 text-white shadow-xs">
                                                        Kuota Penuh
                                                    </span>
                                                ) : null}
                                            </div>
                                        )}

                                        <div className={`${coverImg ? 'md:col-span-5' : 'md:col-span-8'} p-6 sm:p-8 space-y-3 flex flex-col justify-center`}>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <div className="flex items-center gap-2 text-xs text-accent-copper font-bold uppercase tracking-wider">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>{dateFormatted}</span>
                                                </div>
                                                {isWalkIn && (
                                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                                                        {walkInBadge}
                                                    </span>
                                                )}
                                                {ev.category && (
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-sand-100 text-brand-800 border border-sand-200">
                                                        {ev.category}
                                                    </span>
                                                )}
                                                {isFull && !coverImg && (
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-700 border border-red-200">
                                                        Kuota Penuh
                                                    </span>
                                                )}
                                            </div>

                                            <h3 className="text-lg sm:text-xl font-extrabold text-brand-950">
                                                {title}
                                            </h3>

                                            {desc && (
                                                <p className="text-xs sm:text-sm text-brand-600 leading-relaxed line-clamp-3">
                                                    {desc}
                                                </p>
                                            )}

                                            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-brand-700">
                                                {ev.location && (
                                                    <div className="flex items-center gap-1.5">
                                                        <MapPin className="w-4 h-4 text-accent-copper shrink-0" />
                                                        <span>{ev.location}</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-1.5">
                                                    <Users className="w-4 h-4 text-accent-copper shrink-0" />
                                                    <span>
                                                        {ev.capacity
                                                            ? `Kapasitas: ${ev.capacity} Peserta`
                                                            : isWalkIn
                                                            ? 'Akses Terbuka untuk Umum'
                                                            : 'Kapasitas Fleksibel'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Ticket className="w-4 h-4 text-accent-copper shrink-0" />
                                                    <span className="font-bold text-brand-900">
                                                        {ev.fee > 0
                                                            ? formatRupiah(ev.fee)
                                                            : isWalkIn
                                                            ? 'Gratis / Free Entry'
                                                            : 'Gratis / Open Session'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={`${coverImg ? 'md:col-span-3' : 'md:col-span-4'} p-6 sm:p-8 flex flex-col justify-center items-stretch md:items-end border-t md:border-t-0 md:border-l border-sand-200 bg-sand-50/50`}>
                                            {isWalkIn ? (
                                                <>
                                                    <a
                                                        href={mapsUrl}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="w-full text-center px-5 py-3.5 bg-brand-900 hover:bg-brand-950 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm hover:shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2"
                                                    >
                                                        <MapPin className="w-4 h-4 text-accent-copper" />
                                                        <span>{actionButtonText}</span>
                                                    </a>
                                                    <a
                                                        href={`https://wa.me/${waNumber}?text=${encodeURIComponent(waMsg)}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="w-full text-center px-4 py-2.5 text-brand-700 hover:text-brand-950 font-bold text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 mt-2 bg-white rounded-xl border border-sand-200 hover:border-sand-300"
                                                    >
                                                        <MessageCircle className="w-3.5 h-3.5 text-[#128C7E]" />
                                                        <span>Tanya Info via WA</span>
                                                    </a>
                                                    <span className="text-[11px] text-brand-400 text-center mt-2 block">
                                                        Tanpa Pendaftaran • Langsung Hadir
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <a
                                                        href={`https://wa.me/${waNumber}?text=${encodeURIComponent(waMsg)}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className={`w-full text-center px-5 py-3.5 ${
                                                            isFull
                                                                ? 'bg-brand-800 hover:bg-brand-900 text-white'
                                                                : 'bg-[#128C7E] hover:bg-[#0e7467] text-white'
                                                        } font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm hover:shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2`}
                                                    >
                                                        <MessageCircle className="w-4 h-4" />
                                                        <span>{isFull ? 'Waiting List via WA' : ctaButtonText}</span>
                                                    </a>
                                                    {ctaNote && (
                                                        <span className="text-[11px] text-brand-400 text-center mt-2 block">
                                                            {isFull ? 'Slot utama penuh, daftar antrean' : ctaNote}
                                                        </span>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Past Events Section (if any & enabled) */}
                {showPast && past.length > 0 && (
                    <div className="space-y-6 pt-6 border-t border-brand-100">
                        <h2 className="text-lg sm:text-xl font-extrabold text-brand-900 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-brand-500" />
                            <span>{pastTitle}</span>
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {past.map((ev) => {
                                const title = typeof ev.title === 'string' ? ev.title : (ev.title as any)?.id || '';
                                const desc = typeof ev.description === 'string' ? ev.description : (ev.description as any)?.id || '';
                                const coverImg = ev.cover_image ? resolveImageUrl(ev.cover_image) : null;
                                const dateFormatted = ev.formatted_date || parseEventDate(ev.starts_at).toLocaleDateString('id-ID', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                });

                                return (
                                    <div
                                        key={ev.id}
                                        className="bg-white rounded-2xl overflow-hidden border border-brand-100 shadow-2xs hover:shadow-xs transition-all flex flex-col sm:flex-row opacity-90 hover:opacity-100"
                                    >
                                        {coverImg && (
                                            <div className="sm:w-36 h-32 sm:h-auto shrink-0 bg-sand-100">
                                                <img
                                                    src={coverImg}
                                                    alt={title}
                                                    className="w-full h-full object-cover"
                                                    loading="lazy"
                                                />
                                            </div>
                                        )}
                                        <div className="p-5 space-y-2 flex-1">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-brand-500 font-semibold">{dateFormatted}</span>
                                                <span className="px-2 py-0.5 rounded-full bg-sand-200 text-brand-700 text-[10px] font-bold uppercase">
                                                    Selesai
                                                </span>
                                            </div>
                                            <h3 className="text-sm font-bold text-brand-950 leading-snug">
                                                {title}
                                            </h3>
                                            {desc && (
                                                <p className="text-xs text-brand-600 line-clamp-2 leading-relaxed">
                                                    {desc}
                                                </p>
                                            )}
                                            {ev.location && (
                                                <div className="text-[11px] text-brand-500 flex items-center gap-1 pt-1">
                                                    <MapPin className="w-3 h-3 text-accent-copper" />
                                                    <span>{ev.location}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Gallery Section */}
                {galleryImages.length > 0 && (
                    <div className="space-y-6 sm:space-y-8 pt-6 border-t border-brand-100">
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
                                            alt={item.caption || `Dokumentasi Acara ${idx + 1}`}
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
            </div>
        </PublicLayout>
    );
}
