import React, { useState, useEffect } from 'react';
import { HeroBanner } from '../types';
import { ChevronLeft, ChevronRight, ShieldCheck, Sparkles, Award } from 'lucide-react';

interface HeroSliderProps {
    banners?: HeroBanner[];
}

export default function HeroSlider({ banners = [] }: HeroSliderProps) {
    const [current, setCurrent] = useState(0);

    const slides = banners.length > 0 ? banners : [
        {
            id: 1,
            title: 'Sanubari Roastery Official Gear Partner',
            subtitle: 'Pusat Kurasi Peralatan Seduh, Grinder Presisi & Mesin Espresso Terbaik di Malang.',
            badge: 'OFFICIAL PARTNER',
            image: '/slides/dirty-latte-banner.jpg',
            link_url: '#catalog',
            sort_order: 1,
        },
    ];

    useEffect(() => {
        if (slides.length <= 1) return;
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [slides.length]);

    const activeSlide = slides[current];

    return (
        <section className="relative overflow-hidden bg-[#0e1015] border-b border-[#232838]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#151821] to-[#12151e] border border-[#232838] shadow-2xl min-h-[380px] md:min-h-[460px] flex items-center">
                    {/* Background Visual Layer */}
                    <div className="absolute inset-0 z-0 opacity-25 mix-blend-luminosity">
                        {activeSlide.image && (
                            <img
                                src={activeSlide.image}
                                alt={activeSlide.title}
                                className="w-full h-full object-cover transform scale-105 transition-transform duration-1000"
                            />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#0e1015] via-[#0e1015]/80 to-transparent"></div>
                    </div>

                    {/* Content Layer */}
                    <div className="relative z-10 max-w-2xl px-6 md:px-12 py-10">
                        {activeSlide.badge && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-4">
                                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                {activeSlide.badge}
                            </span>
                        )}

                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.15] mb-4">
                            {activeSlide.title}
                        </h2>

                        {activeSlide.subtitle && (
                            <p className="text-base sm:text-lg text-stone-300 leading-relaxed mb-8">
                                {activeSlide.subtitle}
                            </p>
                        )}

                        <div className="flex flex-wrap items-center gap-4">
                            <a
                                href={activeSlide.link_url || '#catalog'}
                                className="px-6 py-3.5 rounded-xl bg-[#e69c24] hover:bg-[#d98a18] text-black font-bold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
                            >
                                Jelajahi Katalog Alat &rarr;
                            </a>
                            <div className="hidden sm:flex items-center gap-3 text-xs text-stone-400 border-l border-[#232838] pl-4">
                                <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
                                <span>Garansi Resmi & Testing Unit Tersedia di Malang</span>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Arrows if multi slide */}
                    {slides.length > 1 && (
                        <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2">
                            <button
                                onClick={() => setCurrent((prev) => (prev - 1 + slides.length) % slides.length)}
                                className="w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center border border-white/10 transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="text-xs font-medium text-stone-400 px-1">
                                {current + 1} / {slides.length}
                            </span>
                            <button
                                onClick={() => setCurrent((prev) => (prev + 1) % slides.length)}
                                className="w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center border border-white/10 transition-colors"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

