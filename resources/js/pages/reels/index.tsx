import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import { ExternalLink } from 'lucide-react';
import { PublicLayout } from '@/layouts/public-layout';
import { DEFAULT_REELS, InstagramIcon, resolveReelThumbnail, type VideoReel } from '@/components/video-reels-slider';
import type { SanubariSharedProps } from '@/types/sanubari';

// Extended collection of high quality reels for Alat Kopi Malang & Alat Kopi Malang
const ALL_REELS: VideoReel[] = [
    ...DEFAULT_REELS,
    {
        id: 'reel-7',
        badge: 'DRILLER VS FLAT BOTTOM',
        headline: 'Dripper V60 vs Flat Bottom: Mana yang Lebih Cocok Buat Kopi Manis?',
        caption: 'Uji komparasi seduhan pour-over: flow rate konikal vs flow flat bed untuk ekstraksi rasa manis maksimal buah kopi...',
        productCount: 2,
        thumbnail: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.instagram.com/alatkopimalang/',
        products: [
            {
                id: 12,
                name: 'Hario V60 Ceramic Cyan Dripper 02',
                price: 'Rp 159.000',
                image: '/storage/flashsale/v60_cyan.jpg',
                url: '/shop/hario-v60-ceramic-cyan',
            },
            {
                id: 13,
                name: 'Otten Vietnam Drip XL Stainless',
                price: 'Rp 189.000',
                image: '/storage/flashsale/otten_vietnam_drip.jpg',
                url: '/shop/otten-vietnam-drip-xl',
            },
        ],
    },
    {
        id: 'reel-8',
        badge: 'BARISTA TIPS',
        headline: 'Cara Kalibrasi Grinder Espresso Rumahan Anti Pahit & Clumping',
        caption: 'Biar hasil seduhan espresso di rumah nggak asem encer atau pahit gosong, ikuti 3 kunci kalibrasi burr grinder ini...',
        productCount: 2,
        thumbnail: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.instagram.com/alatkopimalang/',
        products: [
            {
                id: 14,
                name: 'Fellow Rocky Lowball Tumblers (Matte)',
                price: 'Rp 395.000',
                image: '/storage/flashsale/fellow_rocky_tumbler.jpg',
                url: '/shop/fellow-rocky-lowball-tumblers',
            },
            {
                id: 15,
                name: 'Hario V60 Station Olive Wood VSS-1-OV',
                price: 'Rp 1.850.000',
                image: '/storage/flashsale/v60_wood_station.jpg',
                url: '/shop/hario-v60-station-olive-wood',
            },
        ],
    },
];

interface ReelsIndexProps {
    reels?: VideoReel[];
}

export default function ReelsIndex({ reels = [] }: ReelsIndexProps) {
    const { settings } = usePage<SanubariSharedProps>().props;
    const activeReels = reels.length > 0 ? reels : ALL_REELS;

    const pageTitle = settings?.reels_page_title || settings?.home_reels_title || 'Alat Kopi Malang Reels Videos';
    const pageDescription =
        settings?.reels_page_description ||
        settings?.home_reels_subtitle ||
        'Klik salah satu video untuk langsung menonton tayangan resmi di aplikasi Instagram. Temukan tips barista, review mesin espresso, hingga tutorial seduh kopi manual.';
    const igUrl = settings?.home_reels_instagram_url || settings?.instagram || 'https://www.instagram.com/alatkopimalang/';

    const igHandle = (() => {
        try {
            const clean = igUrl.replace(/^https?:\/\/(www\.)?instagram\.com\/?/, '').replace(/\/.*$/, '').replace(/^@/, '');
            if (clean && !['reel', 'p', 'stories', 'explore'].includes(clean)) {
                return `@${clean}`;
            }
        } catch {
            // fallback
        }
        return '@alatkopimalang';
    })();

    return (
        <PublicLayout title={`${pageTitle} — Alat Kopi Malang`}>
            <Head>
                <meta name="description" content={pageDescription} />
            </Head>

            <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
                {/* Hero Header Banner */}
                <section className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-br from-brand-950 via-brand-900 to-brand-850 p-6 sm:p-8 text-white shadow-xl overflow-hidden border border-brand-700/40">
                    {/* Decorative Ambient Glows */}
                    <div className="absolute -top-24 -left-24 w-80 h-80 bg-accent-copper/15 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-2">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-sand-200">
                                <InstagramIcon className="w-3.5 h-3.5 text-accent-copper-light" />
                                <span>Official Instagram Reels {igHandle}</span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight text-white">
                                {pageTitle}
                            </h1>
                            <p className="text-xs sm:text-sm text-sand-200 max-w-2xl leading-relaxed whitespace-pre-line">
                                {pageDescription}
                            </p>
                        </div>
                        <a
                            href={igUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white text-xs sm:text-sm font-bold shadow-lg hover:opacity-95 transition-all self-start md:self-auto cursor-pointer"
                        >
                            <InstagramIcon className="w-4 h-4 text-white" />
                            <span>Follow {igHandle}</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                    </div>
                </section>

                {/* Video Reels Grid: 2 columns on mobile, 4 columns on desktop */}
                <section aria-label="Daftar Video Reels">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                        {activeReels.map((reel) => {
                            const targetUrl = reel.videoUrl || reel.video_url || 'https://www.instagram.com/alatkopimalang/';

                            return (
                                <a
                                    key={reel.id}
                                    href={targetUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={`Buka di Instagram: ${reel.headline}`}
                                    className="group relative aspect-[9/16] rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 bg-brand-950 border border-brand-800/40 hover:-translate-y-1.5 block focus:outline-none focus:ring-2 focus:ring-accent-copper"
                                >
                                    {/* Thumbnail Image */}
                                    <img
                                        src={resolveReelThumbnail(reel.thumbnail)}
                                        alt={reel.headline}
                                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                        loading="lazy"
                                    />

                                    {/* Subtle Gradient Overlays */}
                                    <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />
                                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

                                    {/* Top Left: Instagram Icon */}
                                    <div className="absolute top-2.5 left-2.5 sm:top-3.5 sm:left-3.5 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
                                        <InstagramIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                                    </div>

                                    {/* Top Right: Badge or Reels Pill */}
                                    <div className="absolute top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 z-10 flex items-center gap-1.5">
                                        {reel.badge ? (
                                            <span className="inline-block px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-accent-copper/50 text-accent-copper-light text-[9px] sm:text-[10px] font-black uppercase tracking-wider shadow-xs line-clamp-1 max-w-[110px]">
                                                {reel.badge}
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-[9px] sm:text-[10px] font-medium shadow-xs">
                                                <span>Reels</span>
                                                <ExternalLink className="w-2.5 h-2.5 text-sand-300" />
                                            </span>
                                        )}
                                    </div>

                                    {/* Bottom Content Area */}
                                    <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 z-10">
                                        <div className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-accent-copper-light drop-shadow-md group-hover:text-white transition-colors">
                                            <span>Tonton di Instagram</span>
                                            <ExternalLink className="w-2.5 h-2.5" />
                                        </div>
                                    </div>
                                </a>
                            );
                        })}
                    </div>
                </section>
            </main>
        </PublicLayout>
    );
}
