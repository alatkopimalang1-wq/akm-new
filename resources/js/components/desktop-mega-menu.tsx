import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { DESKTOP_MEGA_MENU_CATEGORIES, MegaMainCategory } from '@/data/desktop-mega-menu';
import { SubcategoryIcon } from '@/components/category-illustrations';
import { SanubariSharedProps } from '@/types/sanubari';

interface DesktopMegaMenuProps {
    isOpen: boolean;
    onClose: () => void;
    categories?: MegaMainCategory[];
}

export const DesktopMegaMenu: React.FC<DesktopMegaMenuProps> = ({ isOpen, onClose, categories: propCategories }) => {
    const pageProps = usePage<SanubariSharedProps>().props;

    const dynamicFromProps =
        propCategories ||
        (pageProps.desktopMegaMenuCategories as MegaMainCategory[] | undefined) ||
        (pageProps.settings?.desktop_mega_menu_categories as MegaMainCategory[] | undefined);

    const rawCategories: MegaMainCategory[] =
        Array.isArray(dynamicFromProps) && dynamicFromProps.length > 0
            ? dynamicFromProps
            : DESKTOP_MEGA_MENU_CATEGORIES;

    // Filter active categories
    const categoriesList = rawCategories.filter((cat) => (cat as any).is_active !== false);
    const finalCategories = categoriesList.length > 0 ? categoriesList : DESKTOP_MEGA_MENU_CATEGORIES;

    const [selectedCategoryId, setSelectedCategoryId] = useState<string>(finalCategories[0]?.id || 'coffee');

    // Ensure selected category is valid
    const currentSelectedId = finalCategories.some((cat) => cat.id === selectedCategoryId)
        ? selectedCategoryId
        : finalCategories[0]?.id || 'coffee';

    const activeCategory: MegaMainCategory =
        finalCategories.find((cat) => cat.id === currentSelectedId) ||
        finalCategories[0];

    const rawSubcategories = activeCategory?.subcategories || [];
    const activeSubcategories = rawSubcategories.filter((sub) => (sub as any).is_active !== false);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        onClick={onClose}
                        className="hidden md:block fixed inset-0 bg-black/50 backdrop-blur-xs z-30"
                    />

                    {/* Mega Menu Container */}
                    <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="hidden md:block absolute top-full inset-x-0 bg-white border-b border-sand-300 shadow-2xl z-40 text-brand-950 font-sans"
                    >
                        <div className="max-w-7xl mx-auto flex items-stretch min-h-[440px]">
                            {/* Left Sidebar: Main Categories */}
                            <aside className="w-[220px] lg:w-[270px] shrink-0 border-r border-sand-200 bg-cream-50/70 p-3 overflow-y-auto max-h-[480px] scrollbar-thin">
                                <div className="space-y-1">
                                    {finalCategories.map((cat) => {
                                        const isActive = cat.id === currentSelectedId;
                                        return (
                                            <button
                                                key={cat.id}
                                                type="button"
                                                onMouseEnter={() => setSelectedCategoryId(cat.id)}
                                                onClick={() => setSelectedCategoryId(cat.id)}
                                                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 text-left cursor-pointer ${
                                                    isActive
                                                        ? 'bg-blue-50 text-blue-700 font-bold shadow-xs border border-blue-200/80'
                                                        : 'text-brand-800 hover:text-brand-950 hover:bg-cream-100/90'
                                                }`}
                                            >
                                                <span>{cat.name}</span>
                                                <ChevronRight
                                                    className={`w-4 h-4 transition-transform ${
                                                        isActive
                                                            ? 'text-blue-600 translate-x-0.5'
                                                            : 'text-brand-300'
                                                    }`}
                                                />
                                            </button>
                                        );
                                    })}
                                </div>
                            </aside>

                            {/* Right Content Area: Subcategory Grid */}
                            <main className="flex-1 p-5 lg:p-8 bg-white max-h-[480px] overflow-y-auto">
                                <div className="flex items-center justify-between pb-4 mb-4 border-b border-sand-200/60">
                                    <h3 className="text-base font-extrabold text-brand-950 tracking-tight">
                                        {activeCategory.name}
                                    </h3>
                                    <Link
                                        href={activeCategory.url || '/shop'}
                                        onClick={onClose}
                                        className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group transition-colors"
                                    >
                                        <span>Lihat Semua di {activeCategory.name}</span>
                                        <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                                    </Link>
                                </div>

                                <motion.div
                                    key={activeCategory.id}
                                    initial={{ opacity: 0, y: 4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.18, ease: 'easeOut' }}
                                    className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-3.5"
                                >
                                    {activeSubcategories.map((sub) => {
                                        const isExternal = sub.url?.startsWith('http://') || sub.url?.startsWith('https://');
                                        const content = (
                                            <>
                                                {/* Thumbnail illustration / image */}
                                                <div className="w-12 h-12 shrink-0 rounded-lg bg-sand-100 border border-sand-200/60 flex items-center justify-center p-1.5 shadow-[inset_0_1px_2px_rgba(18,30,33,0.02)] overflow-hidden">
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
                                                            name={sub.icon}
                                                            className="w-8 h-8 object-contain transition-transform group-hover:scale-105 duration-200"
                                                        />
                                                    )}
                                                </div>

                                                {/* Subcategory title */}
                                                <span className="text-xs sm:text-sm font-semibold text-brand-900 group-hover:text-accent-copper leading-snug line-clamp-2 transition-colors">
                                                    {sub.name}
                                                </span>
                                            </>
                                        );

                                        const linkClass = "group border border-sand-200/90 hover:border-brand-300 rounded-xl p-2.5 flex items-center gap-3 bg-white hover:bg-cream-50/80 transition-all duration-150 shadow-[0_1px_2px_rgba(18,30,33,0.02)] hover:shadow-xs active:scale-[0.98]";

                                        return isExternal ? (
                                            <a
                                                key={sub.id}
                                                href={sub.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={onClose}
                                                className={linkClass}
                                            >
                                                {content}
                                            </a>
                                        ) : (
                                            <Link
                                                key={sub.id}
                                                href={sub.url}
                                                onClick={onClose}
                                                className={linkClass}
                                            >
                                                {content}
                                            </Link>
                                        );
                                    })}
                                </motion.div>
                            </main>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
