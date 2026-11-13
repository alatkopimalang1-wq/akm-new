import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Check, CheckCircle2, Clock, Coffee, Droplet, Flame, Lightbulb, Scale, Thermometer } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PublicLayout } from '@/layouts/public-layout';
import type { BrewGuide } from '@/types/sanubari';

interface BrewGuideShowProps {
    guide: BrewGuide;
    otherGuides: BrewGuide[];
}

export default function BrewGuideShow({ guide, otherGuides = [] }: BrewGuideShowProps) {
    const title = typeof guide.title === 'string' ? guide.title : (guide.title as any)?.id || '';
    const desc = typeof guide.description === 'string' ? guide.description : (guide.description as any)?.id || '';
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);

    const toggleStep = (idx: number) => {
        setCompletedSteps((prev) =>
            prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
        );
    };

    return (
        <PublicLayout title={title}>
            {/* Header */}
            <div className="bg-brand-950 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-brand-900">
                <div className="max-w-4xl mx-auto space-y-4">
                    <Link
                        href="/panduan-seduh"
                        className="inline-flex items-center gap-1.5 text-xs text-brand-300 hover:text-white"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Semua Panduan Seduh</span>
                    </Link>

                    <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-accent-copper text-white">
                            Metode {guide.method}
                        </span>
                        <span className="text-xs text-brand-300">Tingkat: {guide.difficulty}</span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                        {title}
                    </h1>

                    {desc && <p className="text-xs sm:text-sm text-brand-200 leading-relaxed">{desc}</p>}
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
                {/* Parameters Matrix */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-2xl border border-sand-200 text-center">
                        <Scale className="w-5 h-5 text-accent-copper mx-auto mb-1" />
                        <span className="block text-[10px] text-brand-400 uppercase tracking-wider">Rasio Kopi : Air</span>
                        <span className="text-sm font-extrabold text-brand-950">{guide.ratio}</span>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-sand-200 text-center">
                        <Coffee className="w-5 h-5 text-accent-copper mx-auto mb-1" />
                        <span className="block text-[10px] text-brand-400 uppercase tracking-wider">Ukuran Gilingan</span>
                        <span className="text-sm font-extrabold text-brand-950">{guide.grind_size}</span>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-sand-200 text-center">
                        <Thermometer className="w-5 h-5 text-accent-copper mx-auto mb-1" />
                        <span className="block text-[10px] text-brand-400 uppercase tracking-wider">Suhu Air</span>
                        <span className="text-sm font-extrabold text-brand-950">{guide.water_temp}</span>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-sand-200 text-center">
                        <Clock className="w-5 h-5 text-accent-copper mx-auto mb-1" />
                        <span className="block text-[10px] text-brand-400 uppercase tracking-wider">Target Waktu</span>
                        <span className="text-sm font-extrabold text-brand-950">{guide.brew_time}</span>
                    </div>
                </div>

                {/* Step by Step Timeline */}
                <div className="bg-white rounded-3xl p-6 sm:p-10 border border-sand-200 shadow-xs space-y-8">
                    <h2 className="text-xl font-bold text-brand-950 pb-4 border-b border-sand-200">
                        Langkah-Langkah Seduhan Presisi
                    </h2>

                    <div className="space-y-3">
                        {guide.steps.map((st, idx) => {
                            const isDone = completedSteps.includes(idx);
                            return (
                                <motion.div
                                    key={idx}
                                    layout
                                    onClick={() => toggleStep(idx)}
                                    className={`flex items-start gap-4 sm:gap-6 p-3.5 sm:p-4 rounded-2xl cursor-pointer transition-colors duration-150 select-none ${
                                        isDone
                                            ? 'bg-sand-100/60 border border-sand-200'
                                            : 'hover:bg-sand-50/80 border border-transparent'
                                    }`}
                                >
                                    <motion.div
                                        whileTap={{ scale: 0.92 }}
                                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full font-extrabold flex items-center justify-center flex-shrink-0 text-xs sm:text-sm shadow-xs transition-colors duration-150 ${
                                            isDone
                                                ? 'bg-accent-copper text-white'
                                                : 'bg-brand-700 text-white'
                                        }`}
                                    >
                                        {isDone ? (
                                            <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                                        ) : (
                                            st.step || idx + 1
                                        )}
                                    </motion.div>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center gap-2">
                                            {st.time && (
                                                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-cream-100 text-accent-copper">
                                                    Waktu: {st.time}
                                                </span>
                                            )}
                                            {isDone && (
                                                <span className="text-[11px] font-semibold text-accent-copper">
                                                    Selesai
                                                </span>
                                            )}
                                        </div>
                                        <p
                                            className={`text-xs sm:text-sm leading-relaxed font-medium transition-colors duration-150 ${
                                                isDone
                                                    ? 'text-brand-500 line-through'
                                                    : 'text-brand-800'
                                            }`}
                                        >
                                            {st.text}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Tips Box */}
                <div className="p-6 rounded-2xl bg-sand-200/60 border border-sand-200 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-accent-copper">
                        <Lightbulb className="w-4 h-4" />
                        <span>Tips Roaster Sanubari</span>
                    </div>
                    <p className="text-xs text-brand-700 leading-relaxed">
                        Gunakan air mineral dengan total dissolved solids (TDS) antara 80 - 150 ppm untuk ekstraksi rasa manis maksimal. Jangan lupa bilas kertas filter dengan air panas sebelum memasukkan bubuk kopi.
                    </p>
                </div>

                {/* Recommended Beans CTA */}
                <div className="p-8 rounded-3xl bg-brand-900 text-white text-center space-y-4">
                    <h3 className="text-xl font-bold">
                        Siap Menyeduh Sekarang?
                    </h3>
                    <p className="text-xs text-brand-300 max-w-md mx-auto">
                        Pilih biji kopi filter single origin Gunung Kawi atau seri co-fermentasi kami yang cocok untuk metode {guide.method}.
                    </p>
                    <Link
                        href="/shop"
                        className="inline-block px-6 py-3 rounded-full bg-accent-copper hover:bg-accent-copper-hover text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all"
                    >
                        Pilih Biji Kopi di Katalog
                    </Link>
                </div>
            </div>
        </PublicLayout>
    );
}
