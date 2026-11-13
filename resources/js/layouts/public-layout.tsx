import React, { useEffect, useRef, useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'motion/react';
import { SlidingNumber } from '@animate-ui/react/primitives/texts/sliding-number';
import {
    Bell,
    BookOpen,
    ChevronDown,
    ChevronRight,
    Compass,
    Grid,
    Home,
    LayoutGrid,
    MapPin,
    Menu,
    MessageCircle,
    Phone,
    Search,
    ShoppingBag,
    User,
    X,
} from 'lucide-react';
import type { SanubariSharedProps } from '@/types/sanubari';
import { CartProvider, useCart } from '@/context/cart-context';
import { CartDrawer } from '@/components/cart-drawer';
import { SearchModal } from '@/components/search-modal';
import { NotificationModal } from '@/components/notification-modal';

const DesktopMegaMenu = React.lazy(() =>
    import('@/components/desktop-mega-menu').then((m) => ({ default: m.DesktopMegaMenu }))
);

interface PublicLayoutProps {
    title?: string;
    children: React.ReactNode;
}

function InstagramIcon({ className = 'w-5 h-5' }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
    );
}

function FacebookIcon({ className = 'w-5 h-5' }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
    );
}

function XSocialIcon({ className = 'w-5 h-5' }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    );
}

function TikTokIcon({ className = 'w-5 h-5' }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.86 4.43c.12-.12.23-.25.33-.38V12a8.27 8.27 0 0 0 5.4 2.05v-3.45a4.83 4.83 0 0 1-3.77-3.91z" />
        </svg>
    );
}

function YouTubeIcon({ className = 'w-5 h-5' }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
    );
}

const resolveImageUrl = (img?: string | null) => {
    if (!img) return null;
    if (img.startsWith('http://') || img.startsWith('https://')) return img;
    const clean = img.replace(/^\/?(public\/|storage\/)?/, '');
    return `/storage/${clean}`;
};

export const PublicLayout: React.FC<PublicLayoutProps> = ({ title, children }) => {
    const { props, url } = usePage<SanubariSharedProps>();
    const { settings, locale = 'id', navCategories = [], auth } = props;
    const { itemCount, setIsCartOpen, isCartOpen } = useCart();

    const accountHref = auth?.user ? '/akun' : '/login';
    const isAccountActive =
        url.startsWith('/akun') ||
        url.startsWith('/account') ||
        url.startsWith('/dashboard') ||
        url.startsWith('/login') ||
        url.startsWith('/register') ||
        url.startsWith('/settings');

    const isHomeActive = url === '/' || url === '/en';
    const isCategoryActive =
        url.startsWith('/kategori') ||
        url.startsWith('/categories') ||
        url.startsWith('/shop');
    const isJournalActive =
        url.startsWith('/blog') ||
        url.startsWith('/en/blog') ||
        url.startsWith('/panduan-seduh') ||
        url.startsWith('/en/brew-guide');
    const isCartActive = isCartOpen || url.startsWith('/keranjang') || url.startsWith('/cart');

    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
    const [announcementVisible, setAnnouncementVisible] = useState(true);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [unreadNotificationCount, setUnreadNotificationCount] = useState<number>(3);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 640);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        try {
            const readIds: string[] = JSON.parse(localStorage.getItem('sanubari_read_notifications_v1') || '[]');
            const totalNotifs = 5;
            const remaining = Math.max(0, totalNotifs - readIds.length);
            setUnreadNotificationCount(remaining);
        } catch {
            setUnreadNotificationCount(3);
        }
    }, [isNotificationOpen]);

    const [headerSearch, setHeaderSearch] = useState(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            return params.get('q') || '';
        }
        return '';
    });
    const headerSearchDebounceRef = useRef<NodeJS.Timeout | null>(null);

    // Sync headerSearch with url query changes
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const q = params.get('q') || '';
            setHeaderSearch(q);
        }
    }, [url]);

    const handleHeaderSearchChange = (val: string) => {
        setHeaderSearch(val);

        if (headerSearchDebounceRef.current) {
            clearTimeout(headerSearchDebounceRef.current);
        }

        const trimmed = val.trim();
        // Redirect or filter product list when typing
        headerSearchDebounceRef.current = setTimeout(() => {
            if (trimmed) {
                router.get(
                    '/shop',
                    { q: trimmed },
                    {
                        preserveState: true,
                        preserveScroll: true,
                        replace: true,
                    }
                );
            } else if (url.startsWith('/shop')) {
                router.get(
                    '/shop',
                    {},
                    {
                        preserveState: true,
                        preserveScroll: true,
                        replace: true,
                    }
                );
            }
        }, 350);
    };

    const handleHeaderSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (headerSearchDebounceRef.current) {
            clearTimeout(headerSearchDebounceRef.current);
        }
        const trimmed = headerSearch.trim();
        if (trimmed) {
            router.get(
                '/shop',
                { q: trimmed },
                {
                    preserveState: true,
                    preserveScroll: true,
                }
            );
        } else {
            router.get(
                '/shop',
                {},
                {
                    preserveState: true,
                    preserveScroll: true,
                }
            );
        }
    };

    useEffect(() => {
        setMobileMenuOpen(false);
        setIsMegaMenuOpen(false);
    }, [url]);

    const waNumber = settings?.whatsapp || '6285121930454';
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent('Halo Sanubari Roastery! Saya ingin bertanya tentang produk kopi.')}`;

    const instagramUrl = settings?.instagram || 'https://instagram.com/sanubari.roastery.mlg';
    const facebookUrl = settings?.facebook || 'https://facebook.com/sanubariroastery';
    const xUrl = settings?.x_url || settings?.twitter || 'https://x.com/sanubariroastery';
    const tiktokUrl = settings?.tiktok || 'https://tiktok.com/@sanubariroastery';

    // Global keyboard shortcut (Cmd+K for search, ESC for search / mega menu dismiss)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (isMegaMenuOpen) {
                    e.preventDefault();
                    setIsMegaMenuOpen(false);
                    return;
                }
                if (isSearchOpen) {
                    e.preventDefault();
                    setIsSearchOpen(false);
                    return;
                }
            }
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                setIsSearchOpen((prev) => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isMegaMenuOpen, isSearchOpen]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 15);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Body scroll locking when mobile menu drawer is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileMenuOpen]);

    const isEn = locale === 'en' || url.startsWith('/en');

    return (
        <div className="min-h-svh flex flex-col bg-cream-50 text-brand-950 font-sans antialiased selection:bg-brand-700 selection:text-white [overflow-x:clip] w-full max-w-full">
            <Head title={title ? `${title} — Sanubari Roastery` : 'Sanubari Roastery — Close to Every Brew'}>
                <link head-key="favicon-32" rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=20261105c" />
                <link head-key="favicon-16" rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=20261105c" />
                <link head-key="favicon-48" rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png?v=20261105c" />
                <link head-key="favicon-96" rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png?v=20261105c" />
                <link head-key="favicon-192" rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png?v=20261105c" />
                <link head-key="favicon-512" rel="icon" type="image/png" sizes="512x512" href="/favicon-512x512.png?v=20261105c" />
                <link head-key="favicon-svg" rel="icon" type="image/svg+xml" href="/favicon.svg?v=20261105c" />
                <link head-key="favicon-ico" rel="icon" type="image/x-icon" sizes="any" href="/favicon.ico?v=20261105c" />
                <link head-key="shortcut-icon" rel="shortcut icon" href="/favicon.ico?v=20261105c" type="image/x-icon" />
                <link head-key="apple-touch-icon" rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=20261105c" />
                <link head-key="apple-touch-icon-precomposed" rel="apple-touch-icon-precomposed" sizes="180x180" href="/apple-touch-icon-precomposed.png?v=20261105c" />
                <link head-key="manifest" rel="manifest" href="/site.webmanifest?v=20261105c" />
                <meta head-key="og-image" property="og:image" content="/brand/logo-circle.png?v=20261105c" />
            </Head>

            {/* Artatix Top Utility Bar (Desktop) */}
            <div className="w-full hidden md:block bg-brand-950 text-white px-4 sm:px-6 lg:px-8 py-2.5 border-b border-brand-900/60 relative z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                    {/* Left: Roastery Hours */}
                    <div className="flex-1 min-w-0 flex items-center gap-2 text-xs text-brand-300">
                        <span className="w-2 h-2 rounded-full bg-accent-copper flex-shrink-0" />
                        <span className="truncate">
                            {isEn
                                ? 'Roastery & Showroom: Daily 09.00 – 23.00 WIB'
                                : 'Roastery & Showroom: Buka Setiap Hari 09.00 – 23.00 WIB'}
                        </span>
                    </div>

                    {/* Center: Utility Navigation Links (Artatix Pattern) */}
                    <div className="flex items-center gap-6 text-xs font-semibold text-brand-200">
                        <Link href="/tentang" className="hover:text-white transition-colors">
                            {isEn ? 'Our Story' : 'Cerita Kami'}
                        </Link>
                        <Link href="/wholesale" className="hover:text-white transition-colors">
                            {isEn ? 'Wholesale B2B' : 'Kemitraan Kedai'}
                        </Link>
                        <Link href="/kunjungi" className="hover:text-white transition-colors">
                            {isEn ? 'Showroom Malang' : 'Showroom Malang'}
                        </Link>
                        <Link href={isEn ? '/en/booking' : '/booking-tempat'} className="hover:text-white transition-colors">
                            {isEn ? 'Space Booking' : 'Booking Tempat'}
                        </Link>
                        <Link href={isEn ? '/en/coffee-catering' : '/coffee-catering'} className="hover:text-white transition-colors">
                            {isEn ? 'Coffee Catering' : 'Coffee Catering'}
                        </Link>
                        <Link href="/panduan-seduh" className="hover:text-white transition-colors">
                            {isEn ? 'Brew Guides & FAQ' : 'Panduan & FAQ'}
                        </Link>
                    </div>

                    {/* Right: Location Link */}
                    <div className="flex-1 flex items-center justify-end">
                        <a
                            href={settings?.maps_url || 'https://maps.app.goo.gl/PMuxaEtsbEvC4APy7'}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs text-brand-300 hover:text-white transition-colors font-medium"
                        >
                            <MapPin className="w-3.5 h-3.5 text-accent-copper" />
                            <span>Malang, Jawa Timur</span>
                        </a>
                    </div>
                </div>
            </div>

            {/* Announcement Ticker Bar */}
            {announcementVisible && settings?.announcement_enabled && (settings?.announcement_text_id || settings?.announcement_text_en) && (
                <div className="bg-accent-copper text-white px-4 py-2 text-xs font-semibold flex items-center justify-between text-center relative z-50 shadow-xs">
                    <div className="flex-1 text-center">
                        {settings?.announcement_link ? (
                            <Link href={settings.announcement_link} className="hover:underline inline-flex items-center gap-1.5 justify-center">
                                <span>{isEn ? (settings.announcement_text_en || settings.announcement_text_id) : settings.announcement_text_id}</span>
                            </Link>
                        ) : (
                            <span>{isEn ? (settings.announcement_text_en || settings.announcement_text_id) : settings.announcement_text_id}</span>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={() => setAnnouncementVisible(false)}
                        aria-label="Tutup Pengumuman"
                        className="text-white/80 hover:text-white p-1 rounded-full transition-colors cursor-pointer"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            )}

            {/* Navigation Header - Otten Coffee Style Desktop Mega Menu Navbar (Sanubari Theme Green) */}
            <header className="sticky top-0 z-50 bg-brand-900 text-white border-b border-brand-800/80 shadow-md transition-shadow [view-transition-name:app-header] font-sans">
                <div className="relative z-50 max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between gap-3 sm:gap-4">
                    {/* Sisi Kiri: Brand Logo & Tombol Menu Kategori */}
                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                        {/* Brand Logo & Name */}
                        <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group">
                            <img
                                src="/brand/logo-akm.jpg?v=20261113"
                                alt="Alat Kopi Malang Logo"
                                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover group-hover:scale-105 transition-transform shadow-xs bg-white"
                            />
                            <div className="flex flex-col">
                                <span className="font-extrabold text-sm sm:text-base tracking-tight text-white group-hover:text-accent-copper transition-colors whitespace-nowrap">
                                    Alat Kopi
                                </span>
                                <span className="text-[9px] sm:text-[10px] text-brand-300 font-semibold tracking-normal -mt-0.5 whitespace-nowrap">
                                    Malang • Est. 2017
                                </span>
                            </div>
                        </Link>

                        {/* Tombol Menu "Kategori Navigasi" (Desktop & Tablet) */}
                        <button
                            type="button"
                            onClick={() => setIsMegaMenuOpen((prev) => !prev)}
                            className={`hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold border transition-all cursor-pointer select-none ${
                                isMegaMenuOpen
                                    ? 'bg-blue-600 text-white border-blue-500 shadow-sm ring-2 ring-blue-400/40'
                                    : 'bg-brand-800/90 hover:bg-brand-800 text-white border-brand-700/60 hover:border-blue-500/50'
                            }`}
                            aria-expanded={isMegaMenuOpen}
                            aria-label="Kategori Navigasi"
                            title="Menu Kategori Produk (Desktop & Tablet)"
                        >
                            <LayoutGrid className={`w-4 h-4 transition-colors ${isMegaMenuOpen ? 'text-white' : 'text-blue-400'}`} />
                            <span>{isEn ? 'Categories' : 'Kategori'}</span>
                            <ChevronDown
                                className={`w-3.5 h-3.5 text-brand-300 transition-transform duration-200 ${
                                    isMegaMenuOpen ? 'rotate-180 text-white' : ''
                                }`}
                            />
                        </button>
                    </div>

                    {/* Bagian Tengah: Search Bar Memanjang (Mobile & Desktop) */}
                    <div className="flex-1 max-w-xl mx-2 sm:mx-4 relative">
                        <form onSubmit={handleHeaderSearchSubmit} className="relative w-full flex items-center">
                            <Search className="w-4 h-4 text-brand-300 absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                                type="search"
                                value={headerSearch}
                                onChange={(e) => handleHeaderSearchChange(e.target.value)}
                                placeholder={isMobile ? '' : 'Cari biji kopi, varietas, tasting notes...'}
                                className="w-full h-10 sm:h-10.5 pl-9 sm:pl-10 pr-8 bg-brand-800/90 hover:bg-brand-800 focus:bg-brand-800 border border-brand-700/70 focus:border-accent-copper rounded-xl text-[16px] sm:text-sm text-white placeholder-transparent sm:placeholder-brand-300/80 outline-none transition-colors shadow-inner"
                                aria-label="Cari produk kopi"
                            />
                            {headerSearch && (
                                <button
                                    type="button"
                                    onClick={() => handleHeaderSearchChange('')}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-brand-300 hover:text-white transition-colors cursor-pointer"
                                    aria-label="Hapus kata kunci"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </form>
                    </div>

                    {/* Sisi Kanan: Lonceng Notifikasi, Keranjang & Akun (Desktop) */}
                    <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
                        {/* Icon Notifikasi (Lonceng) dengan badge pesan / promo / pesanan */}
                        <button
                            type="button"
                            onClick={() => setIsNotificationOpen(true)}
                            className="relative p-2 rounded-xl text-brand-200 hover:text-white hover:bg-brand-800 transition-colors cursor-pointer"
                            aria-label="Notifikasi & Informasi Pesanan"
                            title="Pusat Notifikasi & Promo"
                        >
                            <Bell className="w-5 h-5" />
                            {unreadNotificationCount > 0 && (
                                <span className="absolute top-1 right-1 bg-red-500 text-white text-[9px] font-extrabold min-w-4 h-4 px-1 rounded-full flex items-center justify-center shadow-xs animate-pulse">
                                    {unreadNotificationCount}
                                </span>
                            )}
                        </button>

                        {/* Icon Keranjang Belanja dengan badge counter - Desktop only (Mobile ada di Bottom Nav) */}
                        <button
                            type="button"
                            onClick={() => setIsCartOpen(true)}
                            className="hidden lg:flex relative p-2 rounded-xl text-brand-200 hover:text-white hover:bg-brand-800 transition-colors cursor-pointer"
                            aria-label="Keranjang Belanja"
                            title="Keranjang Belanja"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            {itemCount > 0 ? (
                                <span className="absolute top-1 right-1 bg-red-500 text-white text-[9px] font-extrabold min-w-4 h-4 px-1 rounded-full flex items-center justify-center shadow-xs">
                                    {itemCount > 99 ? '99+' : itemCount}
                                </span>
                            ) : (
                                <span className="absolute top-1 right-1 bg-red-500 text-white text-[9px] font-extrabold min-w-4 h-4 px-1 rounded-full flex items-center justify-center shadow-xs">
                                    2
                                </span>
                            )}
                        </button>

                        {/* Masuk / Akun CTA Button */}
                        <Link
                            href={accountHref}
                            className="hidden md:inline-flex items-center justify-center h-9 px-3.5 rounded-xl bg-brand-800 hover:bg-brand-700 border border-brand-700/60 text-white text-xs font-bold transition-all active:scale-95 gap-1.5 shadow-xs"
                        >
                            <User className="w-3.5 h-3.5 text-brand-300" />
                            <span>
                                {auth?.user
                                    ? (auth.user.name?.split(' ')[0] || (isEn ? 'Account' : 'Akun'))
                                    : (isEn ? 'Sign In' : 'Masuk')}
                            </span>
                        </Link>
                    </div>
                </div>

                {/* Mobile Drawer Navigation (Organized by 3 Root Categories) */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="lg:hidden fixed inset-x-0 top-[72px] bottom-0 bg-white text-brand-950 z-50 p-6 overflow-y-auto border-t border-brand-800"
                        >
                        <div className="space-y-6 pb-20">
                            <div className="flex items-center justify-between pb-3 border-b border-sand-200">
                                <span className="text-sm font-bold text-accent-copper">
                                    Menu Navigasi Sanubari
                                </span>
                            </div>

                            {/* Section 1: Katalog Kopi */}
                            <div className="space-y-2">
                                <span className="text-xs uppercase font-extrabold tracking-wider text-brand-600 block">
                                    1. {isEn ? 'Coffee Catalog' : 'Katalog Kopi'}
                                </span>
                                <div className="space-y-1 pl-2">
                                    <Link
                                        href="/shop"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block py-1.5 text-base font-bold text-brand-950"
                                    >
                                        {isEn ? 'All Coffees' : 'Semua Katalog Kopi'}
                                    </Link>
                                    <Link
                                        href="/shop?series=kawi"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block py-1 text-sm font-medium text-brand-800"
                                    >
                                        Koleksi Gunung Kawi
                                    </Link>
                                    <Link
                                        href="/shop?category=filter-beans"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block py-1 text-sm font-medium text-brand-800"
                                    >
                                        Filter Beans (Classic & Experimental)
                                    </Link>
                                    <Link
                                        href="/shop?category=espresso-beans"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block py-1 text-sm font-medium text-brand-800"
                                    >
                                        Espresso Beans & Houseblend
                                    </Link>
                                    <Link
                                        href="/cybr"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center justify-between py-1.5 text-sm font-bold text-accent-copper"
                                    >
                                        <span>C.Y.B.R (Custom Blend)</span>
                                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-accent-copper text-white uppercase font-extrabold">Baru</span>
                                    </Link>
                                </div>
                            </div>

                            {/* Section 2: Kemitraan & Bisnis */}
                            <div className="space-y-2">
                                <span className="text-xs uppercase font-extrabold tracking-wider text-brand-600 block">
                                    2. {isEn ? 'Partnership & B2B' : 'Kemitraan & Bisnis'}
                                </span>
                                <div className="space-y-1 pl-2">
                                    <Link
                                        href="/wholesale"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block py-1.5 text-base font-bold text-brand-950"
                                    >
                                        Wholesale Biji Kopi Grosir
                                    </Link>
                                    <Link
                                        href="/wholesale"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block py-1 text-sm font-medium text-brand-800"
                                    >
                                        Minta Sample Tester Kedai (Gratis)
                                    </Link>
                                    <Link
                                        href="/kunjungi"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block py-1 text-sm font-medium text-brand-800"
                                    >
                                        Showroom Mesin Alat Kopi Malang
                                    </Link>
                                    <Link
                                        href="/booking-tempat"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block py-1 text-sm font-bold text-accent-copper"
                                    >
                                        Booking Tempat Acara (50+ Orang)
                                    </Link>
                                    <Link
                                        href="/coffee-catering"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block py-1 text-sm font-bold text-accent-copper"
                                    >
                                        Coffee Catering (Min. 200 Cup)
                                    </Link>
                                </div>
                            </div>

                            {/* Section 3: Cerita & Panduan */}
                            <div className="space-y-2">
                                <span className="text-xs uppercase font-extrabold tracking-wider text-brand-600 block">
                                    3. {isEn ? 'Story & Brew Guides' : 'Cerita & Panduan'}
                                </span>
                                <div className="space-y-1 pl-2">
                                    <Link
                                        href="/panduan-seduh"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block py-1.5 text-base font-bold text-brand-950"
                                    >
                                        Panduan Resep Seduh (V60, Espresso, Cold Brew)
                                    </Link>
                                    <Link
                                        href="/tentang"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block py-1 text-sm font-medium text-brand-800"
                                    >
                                        Tentang Sanubari Roastery
                                    </Link>
                                    <Link
                                        href="/blog"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block py-1 text-sm font-medium text-brand-800"
                                    >
                                        Jejak Rasa Journal
                                    </Link>
                                    <Link
                                        href="/kunjungi"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block py-1 text-sm font-medium text-brand-800"
                                    >
                                        Kunjungi Roastery Malang
                                    </Link>
                                </div>
                            </div>

                            <div className="pt-2 border-t border-sand-200">
                                <Link
                                    href={accountHref}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-brand-900 hover:bg-brand-800 text-white font-bold rounded-xl text-sm transition-colors"
                                >
                                    <User className="w-4 h-4" />
                                    <span>
                                        {auth?.user
                                            ? (isEn ? 'My Account (Profile)' : 'Akun Saya (Profil)')
                                            : (isEn ? 'Sign In / Register' : 'Masuk / Daftar Akun')}
                                    </span>
                                </Link>
                            </div>

                            <div className="pt-2">
                                <a
                                    href={waUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-full flex items-center justify-center gap-2 py-3 bg-[#128C7E] hover:bg-[#075E54] text-white font-bold rounded-xl text-sm transition-colors"
                                >
                                    <MessageCircle className="w-4 h-4 fill-white" />
                                    <span>Konsultasi via WhatsApp</span>
                                </a>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Desktop & Tablet Mega Menu Dropdown */}
            {isMegaMenuOpen && (
                <React.Suspense fallback={null}>
                    <DesktopMegaMenu
                        isOpen={isMegaMenuOpen}
                        onClose={() => setIsMegaMenuOpen(false)}
                        categories={props.desktopMegaMenuCategories}
                    />
                </React.Suspense>
            )}
            </header>


            {/* Main Content Body */}
            <main className="flex-1 pb-24 md:pb-0 overflow-x-hidden w-full max-w-full">{children}</main>

            {/* Cart Drawer */}
            <CartDrawer />

            {/* Instant Search Modal (Artatix Pattern + Emil Kowalski Polish) */}
            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

            {/* Notification Center Modal (Status Pesanan, Broadcast Promo & Roastery Updates) */}
            <NotificationModal
                isOpen={isNotificationOpen}
                onClose={() => setIsNotificationOpen(false)}
                announcementText={settings?.announcement_text_id}
                announcementLink={settings?.announcement_link}
            />

            {/* Floating WhatsApp Action Button (Desktop & Tablet only, Mobile uses Bottom Nav) */}
            <a
                href={waUrl}
                target="_blank"
                rel="noreferrer"
                className="hidden md:flex fixed bottom-8 right-8 z-30 items-center gap-2 px-5 py-3 rounded-full bg-[#0f766e] text-white hover:bg-[#115e59] active:scale-95 transition-colors group shadow-lg"
                aria-label="Chat WhatsApp Sanubari"
            >
                <MessageCircle className="w-5 h-5 fill-white" />
                <span className="hidden md:inline font-semibold text-sm">
                    Tanya Roaster
                </span>
            </a>

            {/* Fixed Mobile Bottom Navigation Bar (Screens < 768px) */}
            {!isCartOpen && (
                <nav
                    aria-label="Navigasi Bawah"
                    className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-sand-200/90 md:hidden px-3 py-2.5 pb-[max(0.6rem,env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgba(18,30,33,0.06)] font-sans"
                >
                    <div className="grid grid-cols-4 items-center max-w-md mx-auto">
                        {/* 1. Home */}
                        <Link
                            href={isEn ? '/en' : '/'}
                            className={`flex flex-col items-center justify-center py-1 transition-all duration-150 active:scale-95 ${
                                isHomeActive
                                    ? 'text-accent-copper font-bold'
                                    : 'text-brand-600/70 hover:text-brand-950 font-medium'
                            }`}
                        >
                            <Home className={`w-6 h-6 mb-1.5 ${isHomeActive ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
                            <span className="text-[11.5px] font-semibold leading-none tracking-tight">{isEn ? 'Home' : 'Home'}</span>
                        </Link>

                        {/* 2. Kategori */}
                        <Link
                            href={isEn ? '/en/categories' : '/kategori'}
                            className={`flex flex-col items-center justify-center py-1 transition-all duration-150 active:scale-95 ${
                                isCategoryActive
                                    ? 'text-accent-copper font-bold'
                                    : 'text-brand-600/70 hover:text-brand-950 font-medium'
                            }`}
                        >
                            <div className="relative">
                                <LayoutGrid className={`w-6 h-6 mb-1.5 ${isCategoryActive ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
                            </div>
                            <span className="text-[11.5px] font-semibold leading-none tracking-tight">{isEn ? 'Categories' : 'Kategori'}</span>
                        </Link>

                        {/* 3. Keranjang */}
                        <button
                            type="button"
                            onClick={() => setIsCartOpen(true)}
                            className={`flex flex-col items-center justify-center py-1 transition-all duration-150 active:scale-95 relative cursor-pointer ${
                                isCartActive
                                    ? 'text-accent-copper font-bold'
                                    : 'text-brand-600/70 hover:text-brand-950 font-medium'
                            }`}
                            aria-label={isEn ? 'View Cart' : 'Lihat Keranjang'}
                        >
                            <div className="relative">
                                <ShoppingBag className={`w-6 h-6 mb-1.5 ${isCartActive ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
                                {itemCount > 0 && (
                                    <span className="absolute -top-1.5 -right-2.5 bg-accent-copper text-white text-[10px] font-black min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center shadow-xs border-2 border-white">
                                        {itemCount > 99 ? '99+' : itemCount}
                                    </span>
                                )}
                            </div>
                            <span className="text-[11.5px] font-semibold leading-none tracking-tight">{isEn ? 'Cart' : 'Keranjang'}</span>
                        </button>

                        {/* 4. Akun */}
                        <Link
                            href={accountHref}
                            className={`flex flex-col items-center justify-center py-1 transition-all duration-150 active:scale-95 ${
                                isAccountActive
                                    ? 'text-accent-copper font-bold'
                                    : 'text-brand-600/70 hover:text-brand-950 font-medium'
                            }`}
                        >
                            <User className={`w-6 h-6 mb-1.5 ${isAccountActive ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
                            <span className="text-[11.5px] font-semibold leading-none tracking-tight">
                                {auth?.user
                                    ? (auth.user.name?.split(' ')[0] || (isEn ? 'Account' : 'Akun'))
                                    : (isEn ? 'Account' : 'Akun')}
                            </span>
                        </Link>
                    </div>
                </nav>
            )}

            {/* Desktop NiR Coffee 4-Column Footer (Configurable via Admin Dashboard) */}
            {(() => {
                const footerSettings = (props.footerSettings || (settings as any)?.footer_settings || {}) as Record<string, any>;

                const defaultCol2Links = [
                    { label: isEn ? 'About Us' : 'Tentang Kami', url: isEn ? '/en/about' : '/tentang', is_external: false, is_active: true },
                    { label: isEn ? 'Wholesale Partnership' : 'Kemitraan Kedai', url: isEn ? '/en/wholesale' : '/wholesale', is_external: false, is_active: true },
                    { label: isEn ? 'Sanubari Articles' : 'Artikel Sanubari', url: isEn ? '/en/blog' : '/blog', is_external: false, is_active: true },
                    { label: isEn ? 'Track Order & Payment' : 'Lacak Pesanan & Pembayaran', url: isEn ? '/en/track-order' : '/lacak-pesanan', is_external: false, is_active: true },
                ];

                const defaultCol3Links = [
                    { label: 'Resep & Panduan Seduh', url: isEn ? '/en/brew-guide' : '/panduan-seduh', is_external: false, is_active: true },
                    { label: 'C.Y.B.R Custom Blend', url: '/cybr', is_external: false, is_active: true },
                    { label: 'Flash Sale Kopi Pilihan', url: isEn ? '/en/flash-sale' : '/flash-sale', is_external: false, is_active: true },
                    { label: 'Public Cupping & Workshop', url: isEn ? '/en/events' : '/acara', is_external: false, is_active: true },
                    { label: isEn ? 'Space & Venue Booking' : 'Booking Tempat Acara (50+ Orang)', url: isEn ? '/en/booking' : '/booking-tempat', is_external: false, is_active: true },
                    { label: isEn ? 'Coffee Catering (Min. 200 Cups)' : 'Coffee Catering (Min. 200 Cup)', url: isEn ? '/en/coffee-catering' : '/coffee-catering', is_external: false, is_active: true },
                    { label: 'Kunjungi Slow Bar & Roastery', url: isEn ? '/en/visit' : '/kunjungi', is_external: false, is_active: true },
                ];

                const defaultLegalLinks = [
                    { label: 'Kebijakan Privasi', url: '/legal/privacy', is_active: true },
                    { label: 'Syarat & Ketentuan', url: '/legal/terms', is_active: true },
                    { label: 'Kebijakan Retur', url: '/legal/refund', is_active: true },
                ];

                const brandTitle = footerSettings.brand_title || settings?.brand_name || 'Alat Kopi Malang';
                const brandTagline = footerSettings.brand_tagline || 'Curated Coffee Equipment & Barista Tools';
                const brandDescription = footerSettings.brand_description || 'Pusat perlengkapan kopi, alat seduh manual, grinder, dan mesin espresso terlengkap di Malang sejak 2017.';
                const brandLogoSrc = footerSettings.brand_logo ? (resolveImageUrl(footerSettings.brand_logo) || '/brand/logo-akm.jpg?v=20261113') : '/brand/logo-akm.jpg?v=20261113';
                const showroomLabel = footerSettings.showroom_label || 'Showroom Alat Kopi:';
                const showroomName = footerSettings.showroom_name || 'Alat Kopi Malang';
                const showroomAddress = footerSettings.showroom_address || settings?.address || 'Jl. Terusan Kawi No. 12, Klojen, Malang';

                const col2Title = footerSettings.column_2_title || 'Sanubari Roastery';
                const col2Links = (Array.isArray(footerSettings.column_2_links) && footerSettings.column_2_links.length > 0)
                    ? footerSettings.column_2_links.filter((l: any) => l.is_active !== false)
                    : defaultCol2Links;

                const col3Title = footerSettings.column_3_title || 'Eksplorasi & Seduh';
                const col3Links = (Array.isArray(footerSettings.column_3_links) && footerSettings.column_3_links.length > 0)
                    ? footerSettings.column_3_links.filter((l: any) => l.is_active !== false)
                    : defaultCol3Links;

                const col4Title = footerSettings.column_4_title || 'Jam Operasional & Kontak';
                const col4Hours = footerSettings.hours || settings?.hours || 'Buka setiap hari: 09.00 – 23.00 WIB';
                const col4Phone = footerSettings.phone || settings?.phone || '+6285121930454';
                const col4Wa = footerSettings.whatsapp || settings?.whatsapp || '6285121930454';
                const col4City = footerSettings.city || 'Kota Malang, Jawa Timur';
                const col4WaCta = footerSettings.whatsapp_cta_text || 'Pesan via WhatsApp';
                const col4WaMessage = footerSettings.whatsapp_message || 'Halo Sanubari Roastery! Saya ingin bertanya tentang produk kopi.';
                const col4WaUrl = `https://wa.me/${col4Wa}?text=${encodeURIComponent(col4WaMessage)}`;

                const socialTitle = footerSettings.social_title || 'Dapatkan Update Seputar Kopi';
                const footerInstagram = footerSettings.instagram || settings?.instagram || 'https://instagram.com/sanubari.roastery.mlg';
                const footerFacebook = footerSettings.facebook || settings?.facebook || 'https://facebook.com/sanubariroastery';
                const footerX = footerSettings.x_url || settings?.x_url || settings?.twitter || 'https://x.com/sanubariroastery';
                const footerTiktok = footerSettings.tiktok || settings?.tiktok || 'https://tiktok.com/@sanubariroastery';
                const footerYoutube = footerSettings.youtube || '';

                const rawCopyright = footerSettings.copyright_text || '© {year} Sanubari Roastery. Hak Cipta Dilindungi.';
                const copyrightText = rawCopyright.replace('{year}', String(new Date().getFullYear()));
                const legalLinks = (Array.isArray(footerSettings.legal_links) && footerSettings.legal_links.length > 0)
                    ? footerSettings.legal_links.filter((l: any) => l.is_active !== false)
                    : defaultLegalLinks;

                const renderLink = (linkItem: any, idx: number) => {
                    const isExternal = Boolean(linkItem.is_external || linkItem.url?.startsWith('http://') || linkItem.url?.startsWith('https://'));
                    if (isExternal) {
                        return (
                            <li key={idx}>
                                <a
                                    href={linkItem.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-white transition-colors"
                                >
                                    {linkItem.label}
                                </a>
                            </li>
                        );
                    }
                    return (
                        <li key={idx}>
                            <Link href={linkItem.url} className="hover:text-white transition-colors">
                                {linkItem.label}
                            </Link>
                        </li>
                    );
                };

                return (
                    <footer className="bg-brand-950 text-white pt-10 sm:pt-20 pb-24 md:pb-16 mt-auto">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16">
                                {/* Col 1: Brand Info */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={brandLogoSrc}
                                            alt={brandTitle}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                        <div>
                                            <h3 className="font-extrabold text-base tracking-wide uppercase text-white">
                                                {brandTitle}
                                            </h3>
                                            {brandTagline && (
                                                <p className="text-sm text-sand-200 font-medium">
                                                    {brandTagline}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-sm text-brand-200 leading-relaxed whitespace-pre-line">
                                        {brandDescription}
                                    </p>
                                    {(showroomName || showroomAddress) && (
                                        <div className="pt-2">
                                            {showroomLabel && (
                                                <span className="text-sm font-semibold text-white block mb-1">
                                                    {showroomLabel}
                                                </span>
                                            )}
                                            <p className="text-sm text-brand-200 leading-relaxed">
                                                {showroomName && <>{showroomName}<br /></>}
                                                {showroomAddress}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Col 2: Sanubari Roastery Links */}
                                <div className="space-y-3">
                                    <h4 className="text-sm font-bold text-white">
                                        {col2Title}
                                    </h4>
                                    <ul className="space-y-2.5 text-sm text-brand-200">
                                        {col2Links.map((link: any, idx: number) => renderLink(link, idx))}
                                    </ul>
                                </div>

                                {/* Col 3: Edukasi & Layanan Links */}
                                <div className="space-y-3">
                                    <h4 className="text-sm font-bold text-white">
                                        {col3Title}
                                    </h4>
                                    <ul className="space-y-2.5 text-sm text-brand-200">
                                        {col3Links.map((link: any, idx: number) => renderLink(link, idx))}
                                    </ul>
                                </div>

                                {/* Col 4: Jam Buka & Hubungi Kami */}
                                <div className="space-y-3">
                                    <h4 className="text-sm font-bold text-white">
                                        {col4Title}
                                    </h4>
                                    {col4Hours && (
                                        <p className="text-sm text-brand-200">
                                            {col4Hours}
                                        </p>
                                    )}
                                    <div className="space-y-2 pt-2">
                                        {col4Phone && (
                                            <a
                                                href={`tel:${col4Phone}`}
                                                className="inline-flex items-center gap-2 text-sm text-brand-200 hover:text-white transition-colors"
                                            >
                                                <Phone className="w-4 h-4 text-accent-copper" />
                                                <span>{col4Phone}</span>
                                            </a>
                                        )}
                                        {col4City && (
                                            <div className="flex items-center gap-2 text-sm text-brand-200">
                                                <MapPin className="w-4 h-4 text-accent-copper" />
                                                <span>{col4City}</span>
                                            </div>
                                        )}
                                    </div>
                                    {col4Wa && (
                                        <div className="pt-3">
                                            <a
                                                href={col4WaUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-brand-700 hover:bg-brand-600 text-white text-sm font-semibold rounded-full transition-colors w-full"
                                            >
                                                <MessageCircle className="w-4 h-4" />
                                                <span>{col4WaCta}</span>
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Social Media Section: Dapatkan Update Seputar Kopi */}
                            <div className="pt-8 pb-8 border-t border-brand-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="text-center sm:text-left">
                                    <h4 className="text-sm sm:text-base font-bold text-white tracking-wide">
                                        {socialTitle}
                                    </h4>
                                </div>
                                <div className="flex items-center gap-3">
                                    {/* Instagram */}
                                    {footerInstagram && (
                                        <a
                                            href={footerInstagram}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label="Instagram Sanubari Roastery"
                                            title="Instagram Sanubari Roastery"
                                            className="w-10 h-10 rounded-full bg-brand-900/90 hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] text-sand-200 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 border border-brand-800 hover:border-transparent shadow-xs"
                                        >
                                            <InstagramIcon className="w-5 h-5" />
                                        </a>
                                    )}

                                    {/* Facebook */}
                                    {footerFacebook && (
                                        <a
                                            href={footerFacebook}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label="Facebook Sanubari Roastery"
                                            title="Facebook Sanubari Roastery"
                                            className="w-10 h-10 rounded-full bg-brand-900/90 hover:bg-[#1877F2] text-sand-200 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 border border-brand-800 hover:border-transparent shadow-xs"
                                        >
                                            <FacebookIcon className="w-5 h-5" />
                                        </a>
                                    )}

                                    {/* X (Twitter) */}
                                    {footerX && (
                                        <a
                                            href={footerX}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label="X Sanubari Roastery"
                                            title="X (Twitter) Sanubari Roastery"
                                            className="w-10 h-10 rounded-full bg-brand-900/90 hover:bg-black text-sand-200 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 border border-brand-800 hover:border-white/30 shadow-xs"
                                        >
                                            <XSocialIcon className="w-4 h-4" />
                                        </a>
                                    )}

                                    {/* TikTok */}
                                    {footerTiktok && (
                                        <a
                                            href={footerTiktok}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label="TikTok Sanubari Roastery"
                                            title="TikTok Sanubari Roastery"
                                            className="w-10 h-10 rounded-full bg-brand-900/90 hover:bg-black text-sand-200 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 border border-brand-800 hover:border-white/30 shadow-xs"
                                        >
                                            <TikTokIcon className="w-4.5 h-4.5" />
                                        </a>
                                    )}

                                    {/* YouTube */}
                                    {footerYoutube && (
                                        <a
                                            href={footerYoutube}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label="YouTube Sanubari Roastery"
                                            title="YouTube Sanubari Roastery"
                                            className="w-10 h-10 rounded-full bg-brand-900/90 hover:bg-[#FF0000] text-sand-200 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 border border-brand-800 hover:border-transparent shadow-xs"
                                        >
                                            <YouTubeIcon className="w-5 h-5" />
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Bottom Copyright & Legal */}
                            <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-brand-300">
                                <p>{copyrightText}</p>
                                <div className="flex items-center gap-6 text-sm">
                                    {legalLinks.map((link: any, idx: number) => {
                                        const isExternal = Boolean(link.is_external || link.url?.startsWith('http://') || link.url?.startsWith('https://'));
                                        if (isExternal) {
                                            return (
                                                <a
                                                    key={idx}
                                                    href={link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="hover:text-white transition-colors"
                                                >
                                                    {link.label}
                                                </a>
                                            );
                                        }
                                        return (
                                            <Link key={idx} href={link.url} className="hover:text-white transition-colors">
                                                {link.label}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </footer>
                );
            })()}
        </div>
    );
};
