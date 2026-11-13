import React from 'react';
import { ShowroomItem } from '../types';
import { MapPin, Clock, Coffee, ShieldCheck } from 'lucide-react';

interface ShowroomSectionProps {
    showroomItems?: ShowroomItem[];
    address?: string;
    hours?: string;
}

export default function ShowroomSection({
    showroomItems = [],
    address = 'Jl. Terusan Dieng No. 42, Malang, Jawa Timur',
    hours = 'Senin - Minggu: 09.00 - 21.00 WIB',
}: ShowroomSectionProps) {
    const items = showroomItems.length > 0 ? showroomItems : [
        {
            id: 1,
            title: 'Espresso Machine Tasting Bar',
            description: 'Uji langsung stabilitas suhu & tekanan mesin espresso komersial dan prosumer sebelum memutuskan membeli.',
            image_url: '/images/article_showroom.jpg',
            sort_order: 1,
        },
        {
            id: 2,
            title: 'Manual Brew & Grinder Calibration Lounge',
            description: 'Bandingkan distribusi ukuran partikel gilingan dari berbagai burrs stainless steel bersama tim roaster kami.',
            image_url: '/images/article_slowbar.jpg',
            sort_order: 2,
        },
    ];

    return (
        <section id="showroom" className="py-16 md:py-24 bg-[#0e1015] border-t border-[#232838]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full mb-3 inline-block">
                        EXPERIENCE SHOWROOM
                    </span>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-4">
                        Kunjungi Showroom & Testing Station di Malang
                    </h2>
                    <p className="text-stone-400 text-sm md:text-base leading-relaxed">
                        Kami percaya memilih alat kopi memerlukan sentuhan dan uji coba langsung. Coba dan rasakan performa grinder, dripper, dan mesin espresso favorit Anda didampingi barista profesional kami.
                    </p>
                </div>

                {/* Showroom Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="group relative rounded-3xl overflow-hidden bg-[#151821] border border-[#232838] shadow-xl flex flex-col"
                        >
                            <div className="relative aspect-video w-full overflow-hidden bg-[#0e1015]">
                                <img
                                    src={item.image_url}
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#151821] via-transparent to-transparent"></div>
                            </div>
                            <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                                    <p className="text-sm text-stone-400 leading-relaxed">{item.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Store Info Banner */}
                <div className="p-6 md:p-8 rounded-2xl bg-[#151821] border border-[#232838] flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                            <MapPin className="w-7 h-7" />
                        </div>
                        <div>
                            <h4 className="font-bold text-base text-white mb-1">Lokasi & Jam Buka Showroom</h4>
                            <p className="text-xs text-stone-400 mb-0.5">{address}</p>
                            <p className="text-xs text-amber-400 font-semibold">{hours}</p>
                        </div>
                    </div>

                    <a
                        href="https://maps.google.com"
                        target="_blank"
                        rel="noreferrer"
                        className="px-6 py-3 rounded-xl bg-[#0e1015] hover:bg-black text-stone-200 hover:text-white border border-[#232838] text-xs font-bold transition-all shrink-0"
                    >
                        Buka Google Maps &rarr;
                    </a>
                </div>
            </div>
        </section>
    );
}

