import React from 'react';
import { Coffee, ShieldCheck, Truck, Phone, Award } from 'lucide-react';

interface FooterProps {
    whatsappNumber?: string;
    address?: string;
}

export default function Footer({
    whatsappNumber = '6281234567890',
    address = 'Malang, Jawa Timur, Indonesia',
}: FooterProps) {
    return (
        <footer className="bg-[#0b0d11] border-t border-[#232838] text-stone-400">
            {/* Value Pillars */}
            <div className="border-b border-[#232838]/60 py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-[#151821] border border-[#232838] flex items-center justify-center text-amber-400 shrink-0">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-white">100% Original & Garansi</h4>
                            <p className="text-[11px] text-stone-500">Distributor resmi brand ternama</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-[#151821] border border-[#232838] flex items-center justify-center text-amber-400 shrink-0">
                            <Coffee className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-white">Kurasi Barista Malang</h4>
                            <p className="text-[11px] text-stone-500">Telah lolos uji seduh Sanubari</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-[#151821] border border-[#232838] flex items-center justify-center text-amber-400 shrink-0">
                            <Truck className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-white">Pengiriman Aman Seluruh RI</h4>
                            <p className="text-[11px] text-stone-500">Bubble wrap tebal & kayu</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-[#151821] border border-[#232838] flex items-center justify-center text-amber-400 shrink-0">
                            <Award className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-white">Konsultasi Setup Bar</h4>
                            <p className="text-[11px] text-stone-500">Pendampingan pemilihan mesin</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Footer Info */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                <div className="max-w-md">
                    <div className="flex items-center justify-center md:justify-start gap-2.5 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-[#e69c24] flex items-center justify-center font-bold text-black text-sm">
                            AKM
                        </div>
                        <span className="font-extrabold text-base text-white tracking-tight">ALAT KOPI MALANG</span>
                    </div>
                    <p className="text-xs text-stone-500 leading-relaxed">
                        Spesialis peralatan manual brew, grinder elektrik & manual, mesin espresso, serta aksesoris barista profesional di Kota Malang. Partner kurasi peralatan Sanubari Roastery.
                    </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold">
                    <a href="#catalog" className="text-stone-400 hover:text-white transition-colors">Katalog Alat</a>
                    <a href="#showroom" className="text-stone-400 hover:text-white transition-colors">Showroom Malang</a>
                    <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer" className="text-amber-400 hover:text-amber-300 transition-colors">
                        Konsultasi WhatsApp
                    </a>
                    <a href="/admin" className="text-stone-500 hover:text-stone-300 transition-colors">
                        Admin Portal
                    </a>
                </div>
            </div>

            <div className="border-t border-[#232838]/60 py-6 text-center text-xs text-stone-600">
                &copy; {new Date().getFullYear()} Alat Kopi Malang (AKM). All rights reserved.
            </div>
        </footer>
    );
}

