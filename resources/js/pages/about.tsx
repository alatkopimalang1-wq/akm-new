import React, { useRef, useState } from 'react';
import { Head } from '@inertiajs/react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { PublicLayout } from '@/layouts/public-layout';
import { SectionHeading } from '@/components/ui/section-heading';

const resolveImageUrl = (img?: string | null, fallback = '') => {
    if (!img) return fallback;
    if (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('blob:')) return img;
    const clean = img.startsWith('/') ? img : `/${img}`;
    if (clean.startsWith('/storage/')) return clean;
    return `/storage${clean}`;
};

function getEmbedUrl(url: string): string | null {
    if (!url) return null;
    const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([\w-]{11})/);
    if (ytMatch) {
        return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=0&rel=0`;
    }
    const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (vimeoMatch) {
        return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }
    return null;
}

interface AboutPageProps {
    page?: {
        hero_badge?: string;
        hero_title?: string;
        hero_description?: string;
        story_title?: string;
        story_subtitle?: string;
        story_p1?: string;
        story_p2?: string;
        story_image?: string;
        video_upload?: string;
        video_url?: string;
        video_title?: string;
        video_subtitle?: string;
        video_poster?: string;
        video_position?: 'section' | 'story' | 'both';
        values_title?: string;
        values_subtitle?: string;
        pillars?: Array<{ title: string; description: string }>;
    };
}

export default function AboutPage({ page }: AboutPageProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(true);
    const [isVideoMuted, setIsVideoMuted] = useState<boolean>(true);

    const toggleVideoPlay = () => {
        if (!videoRef.current) return;
        if (videoRef.current.paused) {
            videoRef.current.play();
            setIsVideoPlaying(true);
        } else {
            videoRef.current.pause();
            setIsVideoPlaying(false);
        }
    };

    const toggleVideoMute = () => {
        if (!videoRef.current) return;
        videoRef.current.muted = !videoRef.current.muted;
        setIsVideoMuted(videoRef.current.muted);
    };

    const heroBadge = page?.hero_badge || 'Didirikan di Malang sejak 2017';
    const heroTitle = page?.hero_title || 'Dedikasi pada Setiap Cangkir Kopi';
    const heroDesc = page?.hero_description || 'Sanubari Roastery berfokus mengangkat karakter biji kopi lereng Gunung Kawi ke cangkir Anda, melalui pemetikan selektif, kurva sangrai digital, dan pengujian rasa yang jujur.';

    const storyTitle = page?.story_title || 'Mengapa Nama Kami Sanubari';
    const storySubtitle = page?.story_subtitle || 'Menghubungkan jerih payah petani lereng Gunung Kawi langsung dengan cangkir kopi Anda.';
    const storyP1 = page?.story_p1 || 'Bagi kami, setiap biji kopi membawa cerita perjalanan panjang: dari tanah vulkanis lereng Gunung Kawi pada ketinggian 1.200–1.600 meter, kabut sore yang memperlambat pematangan buah, ketelitian tangan petani saat memetik buah merah, hingga kalibrasi kurva sangrai di roastery kami di Kota Malang.';
    const storyP2 = page?.story_p2 || 'Kami menjaga kemitraan langsung dengan petani lokal tanpa perantara spekulan, sehingga petani mendapatkan harga yang adil dan Anda mendapatkan biji kopi segar dengan jejak asal-usul yang jelas.';
    const storyImage = page?.story_image || 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1200&q=80';

    const videoSource = page?.video_upload ? resolveImageUrl(page.video_upload) : (page?.video_url ? resolveImageUrl(page.video_url) : '');
    const hasVideo = Boolean(videoSource);
    const videoPoster = page?.video_poster ? resolveImageUrl(page.video_poster) : '';
    const videoTitle = page?.video_title || 'Suasana Studio Roastery & Dedikasi Rasa';
    const videoSubtitle = page?.video_subtitle || 'Dokumentasi proses sangrai digital presisi dan jejak terroir lereng Gunung Kawi.';
    const videoPosition = page?.video_position || 'section';
    const embedUrl = getEmbedUrl(videoSource);

    const valuesTitle = page?.values_title || 'Tiga Pilar Utama Sanubari';
    const valuesSubtitle = page?.values_subtitle || 'Prinsip nyata yang kami jalankan di setiap batch kopi yang kami sangrai.';
    const pillars = (page?.pillars && page.pillars.length > 0) ? page.pillars : [
        {
            title: 'Terroir Gunung Kawi',
            description: 'Ketinggian 1.200–1.600 mdpl dengan tanah andosol vulkanis menghasilkan cangkir kopi manis madu alami dan keasaman seimbang yang ramah di lambung.',
        },
        {
            title: 'Direct & Fair Trade',
            description: 'Membeli hasil panen langsung dari petani mitra di lereng Kawi dengan harga di atas pasar komoditas untuk mendukung keberlanjutan kebun lokal.',
        },
        {
            title: 'Fresh Roast Precision',
            description: 'Menggunakan kurva roasting digital presisi dan pengujian sensorik cupping pada setiap batch sebelum dikemas dan dikirimkan ke pelanggan.',
        },
    ];

    return (
        <PublicLayout title="Tentang Sanubari Roastery">
            {/* Hero Header */}
            <div className="bg-brand-950 text-white py-12 sm:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4 text-center relative z-10">
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

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12 sm:space-y-20">
                {/* 1. Philosophy & Origin */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
                    <div className="space-y-4 sm:space-y-6">
                        <SectionHeading
                            title={storyTitle}
                            subtitle={storySubtitle}
                        />
                        <p className="text-sm sm:text-base text-brand-700 leading-relaxed">
                            {storyP1}
                        </p>
                        <p className="text-sm sm:text-base text-brand-700 leading-relaxed">
                            {storyP2}
                        </p>
                    </div>

                    <div className="rounded-2xl overflow-hidden aspect-4/3 bg-brand-900 relative shadow-md">
                        {hasVideo && (videoPosition === 'story' || videoPosition === 'both') ? (
                            embedUrl ? (
                                <iframe
                                    src={embedUrl}
                                    title={videoTitle}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="w-full h-full border-0"
                                />
                            ) : (
                                <video
                                    poster={videoPoster || storyImage}
                                    controls
                                    playsInline
                                    className="w-full h-full object-cover"
                                >
                                    <source src={videoSource} type="video/mp4" />
                                    Browser Anda tidak mendukung pemutaran video.
                                </video>
                            )
                        ) : (
                            <img
                                src={storyImage}
                                alt="Proses Sangrai Biji Kopi di Sanubari Roastery Malang"
                                className="w-full h-full object-cover"
                            />
                        )}
                    </div>
                </div>

                {/* 1.5. Dedicated Cinematic Video Showcase */}
                {hasVideo && (videoPosition === 'section' || videoPosition === 'both') && (
                    <div className="space-y-4 sm:space-y-6">
                        <SectionHeading
                            align="center"
                            title={videoTitle}
                            subtitle={videoSubtitle}
                        />
                        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden aspect-16/9 sm:aspect-21/9 bg-brand-950 shadow-xl border border-brand-900/60 group">
                            {embedUrl ? (
                                <iframe
                                    src={embedUrl}
                                    title={videoTitle}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="w-full h-full border-0"
                                />
                            ) : (
                                <>
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        loop
                                        muted={isVideoMuted}
                                        playsInline
                                        poster={videoPoster || undefined}
                                        className="w-full h-full object-cover"
                                        onPlay={() => setIsVideoPlaying(true)}
                                        onPause={() => setIsVideoPlaying(false)}
                                    >
                                        <source src={videoSource} type="video/mp4" />
                                        Browser Anda tidak mendukung pemutaran video.
                                    </video>
                                    <div className="absolute inset-0 bg-gradient-to-t from-brand-950/70 via-transparent to-transparent pointer-events-none" />
                                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-end p-4 sm:p-6 pointer-events-none">
                                        <div className="flex items-center gap-2 pointer-events-auto">
                                            <button
                                                type="button"
                                                onClick={toggleVideoPlay}
                                                aria-label={isVideoPlaying ? 'Jeda video' : 'Putar video'}
                                                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-brand-950/80 hover:bg-brand-900 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-transform active:scale-90 cursor-pointer shadow-md"
                                            >
                                                {isVideoPlaying ? <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-0.5" />}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={toggleVideoMute}
                                                aria-label={isVideoMuted ? 'Bunyikan suara' : 'Bisukan suara'}
                                                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-brand-950/80 hover:bg-brand-900 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-transform active:scale-90 cursor-pointer shadow-md"
                                            >
                                                {isVideoMuted ? <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* 2. Values Grid */}
                <div className="space-y-6 sm:space-y-8">
                    <SectionHeading
                        align="center"
                        title={valuesTitle}
                        subtitle={valuesSubtitle}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                        {pillars.map((pillar, idx) => (
                            <div key={idx} className="bg-sand-200/40 p-5 sm:p-8 rounded-xl sm:rounded-2xl space-y-2 sm:space-y-3">
                                <h3 className="text-base sm:text-xl font-bold text-brand-950">{pillar.title}</h3>
                                <p className="text-sm sm:text-base text-brand-700 leading-relaxed">
                                    {pillar.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
