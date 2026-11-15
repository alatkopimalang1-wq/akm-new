import React, { useState, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import { PublicLayout } from '@/layouts/public-layout';
import { BrandAvatar, BrandData } from '@/components/brand-avatar';
import { Search, Sparkles } from 'lucide-react';

interface BrandsIndexProps {
    brands: BrandData[];
}

export default function BrandsIndex({ brands = [] }: BrandsIndexProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredBrands = useMemo(() => {
        if (!searchQuery.trim()) return brands;
        const q = searchQuery.toLowerCase().trim();
        return brands.filter(
            (b) =>
                b.name.toLowerCase().includes(q) ||
                (b.origin && b.origin.toLowerCase().includes(q)) ||
                (b.description && b.description.toLowerCase().includes(q))
        );
    }, [brands, searchQuery]);

    return (
        <PublicLayout title="Semua Brand Resmi | Alat Kopi Malang">
            <Head>
                <title>Semua Brand Resmi — Alat Kopi Malang</title>
                <meta
                    name="description"
                    content="Koleksi lengkap brand resmi peralatan kopi spesialti, mesin espresso, grinder, dan aksesoris barista di Alat Kopi Malang."
                />
            </Head>

            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                {/* Page Title & Subtitle matching Image 2 */}
                <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                        Semua Brand
                    </h1>
                    <p className="text-slate-500 text-sm sm:text-base mt-2 font-medium">
                        Klik logo brand untuk melihat produk
                    </p>

                    {/* Quick Search */}
                    {brands.length > 8 && (
                        <div className="mt-6 max-w-md mx-auto relative">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari nama brand..."
                                className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-full shadow-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full w-5 h-5 flex items-center justify-center transition-colors"
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Grid of Brand Cards matching Image 2 */}
                {filteredBrands.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                        {filteredBrands.map((brand) => (
                            <Link
                                key={brand.id || brand.slug}
                                href={`/shop?brand=${encodeURIComponent(brand.slug)}`}
                                className="group bg-white border border-slate-100 hover:border-indigo-100 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center shadow-xs hover:shadow-lg transition-all duration-200 cursor-pointer"
                                title={`Lihat produk dari ${brand.name}`}
                            >
                                <div className="transition-transform duration-200 group-hover:scale-105">
                                    <BrandAvatar
                                        brand={brand}
                                        size="lg"
                                        showVerified={false}
                                    />
                                </div>

                                <h3 className="mt-4 font-bold text-slate-900 text-sm sm:text-base group-hover:text-indigo-600 transition-colors">
                                    {brand.name}
                                </h3>

                                {brand.origin && (
                                    <span className="text-[11px] sm:text-xs text-slate-400 mt-0.5 line-clamp-1">
                                        {brand.origin}
                                    </span>
                                )}
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <Sparkles className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                        <h3 className="text-base font-bold text-slate-800">
                            Brand &ldquo;{searchQuery}&rdquo; tidak ditemukan
                        </h3>
                        <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                            Coba periksa ejaan atau hapus kata kunci pencarian untuk melihat semua brand.
                        </p>
                        <button
                            type="button"
                            onClick={() => setSearchQuery('')}
                            className="mt-4 inline-flex items-center text-xs font-semibold text-indigo-600 hover:text-indigo-800 underline"
                        >
                            Reset Pencarian
                        </button>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
