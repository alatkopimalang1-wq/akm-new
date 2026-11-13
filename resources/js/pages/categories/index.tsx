import React, { useState, useRef, useMemo } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Search,
    ChevronLeft,
    ChevronRight,
    Home,
    LayoutGrid,
    ShoppingBag,
    User,
} from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { SearchModal } from '@/components/search-modal';
import { CATEGORIES_DATA, CategoryGroup } from '@/data/categories';
import { SubcategoryIcon } from '@/components/category-illustrations';
import { SharedData } from '@/types';

interface NavSubcategory {
    id: string;
    name: string;
    url: string;
    icon?: string;
    image?: string | null;
    is_active?: boolean;
}

interface NavCategory {
    id: string;
    name: string;
    slug?: string;
    url: string;
    is_active?: boolean;
    subcategories?: NavSubcategory[];
}

interface AllCategoriesPageProps {
    navCategories?: NavCategory[];
}

export default function AllCategoriesPage({ navCategories }: AllCategoriesPageProps) {
    const pageProps = usePage<SharedData>().props as any;
    const { itemCount, setIsCartOpen } = useCart();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [activeChip, setActiveChip] = useState<string>('Semua');
    const chipScrollRef = useRef<HTMLDivElement>(null);

    const rawCategories: NavCategory[] = 
        navCategories || 
        pageProps.navbarCategories || 
        pageProps.desktopMegaMenuCategories || 
        [];

    // Parse and normalize category list from admin settings (with fallback to default CATEGORIES_DATA)
    const activeCategories: CategoryGroup[] = useMemo(() => {
        if (!rawCategories || !rawCategories.length) {
            return CATEGORIES_DATA;
        }

        const filtered = rawCategories
            .filter((cat) => cat.is_active !== false)
            .map((cat) => {
                const catId = cat.id || cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-');
                const validSubs = (cat.subcategories || [])
                    .filter((sub) => sub.is_active !== false)
                    .map((sub) => ({
                        id: sub.id || sub.name.toLowerCase().replace(/\s+/g, '-'),
                        name: sub.name,
                        slug: sub.id,
                        url: sub.url || `/shop?category=${sub.id}`,
                        icon: sub.icon || 'coffee-beans',
                        image: sub.image || null,
                    }));

                return {
                    id: catId,
                    chip: cat.name,
                    name: cat.name,
                    slug: cat.slug || catId,
                    viewAllUrl: cat.url || `/shop?category=${cat.slug || catId}`,
                    subcategories: validSubs,
                };
            })
            .filter((cat) => cat.subcategories.length > 0);

        return filtered.length > 0 ? filtered : CATEGORIES_DATA;
    }, [rawCategories]);

    const chips = useMemo(() => {
        return ['Semua', ...activeCategories.map((c) => c.chip)];
    }, [activeCategories]);

    const handleChipClick = (chip: string) => {
        setActiveChip(chip);

        if (chip === 'Semua') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        // Find category group associated with the chip
        const targetCategory = activeCategories.find((c) => c.chip.toLowerCase() === chip.toLowerCase());
        if (targetCategory) {
            const el = document.getElementById(`cat-section-${targetCategory.id}`);
            if (el) {
                const headerOffset = 110;
                const elementPosition = el.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth',
                });
            }
        }
    };

    return (
        <div className="min-h-screen bg-sand-200/50 flex justify-center text-brand-950 font-sans antialiased selection:bg-brand-900 selection:text-white">
            <Head title="Semua Kategori - Alat Kopi Malang" />

            {/* Global Search Modal */}
            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

            {/* Mobile-first Container (max-w-md centered on desktop) */}
            <div className="w-full max-w-md bg-white min-h-screen relative flex flex-col shadow-2xl sm:border-x sm:border-sand-200">
                {/* Fixed / Sticky Top Header */}
                <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-sand-200/90">
                    {/* Top Bar */}
                    <div className="h-14 px-4 flex items-center justify-between relative">
                        <Link
                            href="/"
                            className="w-10 h-10 flex items-center justify-center -ml-2 text-brand-700 hover:text-brand-950 rounded-full active:bg-sand-200/60 transition-colors"
                            aria-label="Kembali ke Beranda"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </Link>

                        <h1 className="text-base font-bold text-brand-950 tracking-tight">
                            Semua Kategori
                        </h1>

                        <button
                            type="button"
                            onClick={() => setIsSearchOpen(true)}
                            className="w-10 h-10 flex items-center justify-center -mr-2 text-brand-700 hover:text-brand-950 rounded-full active:bg-sand-200/60 transition-colors cursor-pointer"
                            aria-label="Cari Produk atau Kategori"
                        >
                            <Search className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Horizontal Scrollable Filter Tabs (Chips) */}
                    <div
                        ref={chipScrollRef}
                        className="flex items-center gap-2 px-4 pb-3 overflow-x-auto no-scrollbar scroll-smooth"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {chips.map((chip) => {
                            const isActive = activeChip === chip;
                            return (
                                <button
                                    key={chip}
                                    type="button"
                                    onClick={() => handleChipClick(chip)}
                                    className={`px-4 py-1.5 rounded-full text-xs transition-all duration-200 shrink-0 cursor-pointer ${
                                        isActive
                                            ? 'bg-brand-900 text-white font-bold shadow-xs ring-1 ring-brand-900'
                                            : 'bg-cream-100/90 border border-sand-200 text-brand-700 hover:border-brand-300 hover:bg-sand-200/60 font-semibold active:scale-95'
                                    }`}
                                >
                                    {chip}
                                </button>
                            );
                        })}
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 px-4 py-5 space-y-7 pb-28">
                    {activeCategories.map((group: CategoryGroup) => (
                        <section
                            key={group.id}
                            id={`cat-section-${group.id}`}
                            className="scroll-mt-32 space-y-3"
                        >
                            {/* Section Header Row */}
                            <div className="flex items-center justify-between">
                                <h2 className="text-[15px] font-extrabold text-brand-950 tracking-tight">
                                    {group.name}
                                </h2>
                                <Link
                                    href={group.viewAllUrl}
                                    className="text-xs font-bold text-accent-copper hover:text-accent-copper-hover flex items-center gap-0.5 transition-colors group"
                                >
                                    <span>Lihat Semua</span>
                                    <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                                </Link>
                            </div>

                            {/* 2-Column Grid */}
                            <div className="grid grid-cols-2 gap-3">
                                {group.subcategories.map((sub: any) => {
                                    const isExternal = sub.url?.startsWith('http://') || sub.url?.startsWith('https://');
                                    const content = (
                                        <>
                                            {/* Thumbnail asset icon or uploaded image */}
                                            <div className="w-14 h-14 shrink-0 rounded-xl bg-white border border-sand-200/60 flex items-center justify-center p-1.5 shadow-[inset_0_1px_2px_rgba(18,30,33,0.02)] overflow-hidden">
                                                {sub.image ? (
                                                    <img
                                                        src={
                                                            sub.image.startsWith('http://') || sub.image.startsWith('https://')
                                                                ? sub.image
                                                                : `/storage/${sub.image.replace(/^\/?(public\/|storage\/)?/, '')}`
                                                        }
                                                        alt={sub.name}
                                                        className="w-full h-full object-cover rounded-md transition-transform group-hover:scale-105 duration-200"
                                                    />
                                                ) : (
                                                    <SubcategoryIcon
                                                        name={sub.icon || 'coffee-beans'}
                                                        className="w-10 h-10 object-contain transition-transform group-hover:scale-105 duration-200"
                                                    />
                                                )}
                                            </div>

                                            {/* Subcategory title */}
                                            <span className="text-xs font-semibold text-brand-950 leading-snug line-clamp-2">
                                                {sub.name}
                                            </span>
                                        </>
                                    );

                                    const linkClass = "group bg-cream-100/70 hover:bg-sand-200/70 border border-sand-200/80 rounded-2xl p-2.5 flex items-center gap-2.5 active:scale-[0.98] transition-all duration-150 text-left shadow-[0_1px_2px_rgba(18,30,33,0.02)]";

                                    return isExternal ? (
                                        <a
                                            key={sub.id}
                                            href={sub.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={linkClass}
                                        >
                                            {content}
                                        </a>
                                    ) : (
                                        <Link
                                            key={sub.id}
                                            href={sub.url}
                                            className={linkClass}
                                        >
                                            {content}
                                        </Link>
                                    );
                                })}
                            </div>
                        </section>
                    ))}
                </main>

                {/* Fixed Bottom Navigation Bar */}
                <nav
                    className="fixed bottom-0 inset-x-0 max-w-md mx-auto bg-white/95 backdrop-blur-md border-t border-sand-200/90 z-50 px-3 py-2.5 pb-[max(0.6rem,env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgba(18,30,33,0.06)] font-sans"
                    aria-label="Navigasi Utama"
                >
                    <div className="grid grid-cols-4 items-center">
                        {/* 1. Home */}
                        <Link
                            href="/"
                            className="flex flex-col items-center justify-center py-1 text-brand-600/70 hover:text-brand-950 font-medium active:scale-95 transition-all duration-150"
                        >
                            <Home className="w-6 h-6 mb-1.5 stroke-[1.8]" />
                            <span className="text-[11.5px] font-semibold leading-none tracking-tight">Home</span>
                        </Link>

                        {/* 2. Kategori (ACTIVE) */}
                        <Link
                            href="/kategori"
                            className="flex flex-col items-center justify-center py-1 text-accent-copper font-bold active:scale-95 transition-all duration-150"
                        >
                            <div className="relative">
                                <LayoutGrid className="w-6 h-6 mb-1.5 stroke-[2.2]" />
                            </div>
                            <span className="text-[11.5px] font-semibold leading-none tracking-tight">Kategori</span>
                        </Link>

                        {/* 3. Keranjang */}
                        <button
                            type="button"
                            onClick={() => setIsCartOpen(true)}
                            className="flex flex-col items-center justify-center py-1 text-brand-600/70 hover:text-brand-950 font-medium active:scale-95 transition-all duration-150 relative cursor-pointer"
                        >
                            <div className="relative">
                                <ShoppingBag className="w-6 h-6 mb-1.5 stroke-[1.8]" />
                                {itemCount > 0 && (
                                    <span className="absolute -top-1.5 -right-2.5 bg-accent-copper text-white text-[10px] font-black min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center shadow-xs border-2 border-white">
                                        {itemCount > 99 ? '99+' : itemCount}
                                    </span>
                                )}
                            </div>
                            <span className="text-[11.5px] font-semibold leading-none tracking-tight">Keranjang</span>
                        </button>

                        {/* 4. Akun */}
                        <Link
                            href="/login"
                            className="flex flex-col items-center justify-center py-1 text-brand-600/70 hover:text-brand-950 font-medium active:scale-95 transition-all duration-150"
                        >
                            <User className="w-6 h-6 mb-1.5 stroke-[1.8]" />
                            <span className="text-[11.5px] font-semibold leading-none tracking-tight">Akun</span>
                        </Link>
                    </div>
                </nav>
            </div>
        </div>
    );
}
