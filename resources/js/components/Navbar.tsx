import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Sparkles, X, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import { Category, Product } from '../types';

interface NavbarProps {
    categories?: Category[];
    cartCount: number;
    onOpenCart: () => void;
    onSelectCategory?: (slug: string) => void;
    selectedCategory?: string;
}

export default function Navbar({
    categories = [],
    cartCount,
    onOpenCart,
    onSelectCategory,
    selectedCategory = '',
}: NavbarProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }

        const timer = setTimeout(async () => {
            setIsSearching(true);
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
                const data = await res.json();
                setSearchResults(data.products || []);
            } catch (err) {
                console.error('Search failed', err);
            } finally {
                setIsSearching(false);
            }
        }, 250);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    return (
        <header className="sticky top-0 z-40 bg-[#0e1015]/90 backdrop-blur-md border-b border-[#232838]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Brand */}
                    <a href="/" className="flex items-center gap-3 group">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#e69c24] to-[#f59e0b] flex items-center justify-center font-extrabold text-black text-lg shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
                            AKM
                        </div>
                        <div>
                            <div className="flex items-center gap-1.5">
                                <span className="font-extrabold text-lg tracking-tight text-white">ALAT KOPI MALANG</span>
                                <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                    PRO
                                </span>
                            </div>
                            <p className="text-xs text-stone-400 tracking-wide">Curated Coffee Equipment & Barista Tools</p>
                        </div>
                    </a>

                    {/* Search Bar (Desktop) */}
                    <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
                        <div className="relative w-full">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari grinder, dripper, espresso machine..."
                                className="w-full bg-[#151821] border border-[#232838] focus:border-amber-500/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-stone-200 placeholder-stone-500 focus:outline-none transition-colors"
                            />
                            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-3 text-stone-400 hover:text-white"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {/* Search Dropdown */}
                        {searchQuery && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-[#151821] border border-[#232838] rounded-xl shadow-2xl overflow-hidden z-50 p-2">
                                {isSearching ? (
                                    <div className="p-4 text-center text-sm text-stone-400">Mencari alat kopi...</div>
                                ) : searchResults.length > 0 ? (
                                    <div className="divide-y divide-[#232838]/60">
                                        {searchResults.map((p) => (
                                            <a
                                                key={p.id}
                                                href={`/product/${p.slug}`}
                                                className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-[#1f2433] transition-colors"
                                            >
                                                <div className="w-10 h-10 rounded-lg bg-[#0e1015] border border-[#232838] overflow-hidden flex items-center justify-center shrink-0">
                                                    {p.primary_image_url ? (
                                                        <img src={p.primary_image_url} alt={p.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Sparkles className="w-4 h-4 text-amber-400" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0 text-left">
                                                    <p className="text-sm font-medium text-white truncate">{p.name}</p>
                                                    <p className="text-xs text-amber-400 font-semibold">
                                                        Rp {p.price.toLocaleString('id-ID')}
                                                    </p>
                                                </div>
                                                <ArrowRight className="w-4 h-4 text-stone-500" />
                                            </a>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-4 text-center text-sm text-stone-400">
                                        Tidak ada produk dengan kata kunci "{searchQuery}"
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onOpenCart}
                            className="relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#151821] hover:bg-[#1f2433] border border-[#232838] hover:border-amber-500/30 transition-all font-semibold text-sm text-white"
                        >
                            <ShoppingBag className="w-4 h-4 text-amber-400" />
                            <span className="hidden sm:inline">Keranjang</span>
                            {cartCount > 0 && (
                                <span className="w-5 h-5 rounded-full bg-[#e69c24] text-black text-xs font-extrabold flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        <a
                            href="/admin"
                            className="px-3.5 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-black border border-amber-500/20 text-xs font-bold transition-all"
                            title="Masuk Backoffice Admin Filament 5"
                        >
                            /ADMIN
                        </a>
                    </div>
                </div>

                {/* Category Pills Navigation */}
                {categories.length > 0 && (
                    <div className="flex items-center gap-2 overflow-x-auto py-2.5 border-t border-[#232838]/60 no-scrollbar">
                        <button
                            onClick={() => onSelectCategory && onSelectCategory('')}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
                                selectedCategory === ''
                                    ? 'bg-[#e69c24] text-black shadow-md shadow-amber-500/20'
                                    : 'bg-[#151821] text-stone-300 hover:bg-[#1f2433] border border-[#232838]'
                            }`}
                        >
                            Semua Koleksi
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => onSelectCategory && onSelectCategory(cat.slug)}
                                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
                                    selectedCategory === cat.slug
                                        ? 'bg-[#e69c24] text-black shadow-md shadow-amber-500/20'
                                        : 'bg-[#151821] text-stone-300 hover:bg-[#1f2433] border border-[#232838]'
                                }`}
                            >
                                {cat.name} {cat.products_count ? `(${cat.products_count})` : ''}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </header>
    );
}

