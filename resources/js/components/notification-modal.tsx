import React, { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';
import { AnimatePresence, motion } from 'motion/react';
import {
    ArrowRight,
    Bell,
    Check,
    CheckCheck,
    Clock,
    Coffee,
    ExternalLink,
    Flame,
    Package,
    Search,
    ShieldCheck,
    Sparkles,
    Tag,
    Truck,
    X,
    Zap,
} from 'lucide-react';
import { formatRupiah } from '@/lib/trans';

export interface NotificationItem {
    id: string;
    type: 'order' | 'promo' | 'broadcast' | 'event';
    title: string;
    message: string;
    timestamp: string;
    isRead: boolean;
    href?: string;
    badge?: string;
    badgeColor?: 'emerald' | 'amber' | 'blue' | 'purple' | 'red';
    metadata?: {
        orderNumber?: string;
        orderStatus?: string;
        courier?: string;
        trackingNumber?: string;
        discount?: string;
    };
}

interface NotificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    announcementText?: string;
    announcementLink?: string;
}

const STORAGE_READ_KEY = 'sanubari_read_notifications_v1';
const STORAGE_ORDERS_KEY = 'Alat Kopi Malang_recent_orders';

export const NotificationModal: React.FC<NotificationModalProps> = ({
    isOpen,
    onClose,
    announcementText,
    announcementLink,
}) => {
    const [activeTab, setActiveTab] = useState<'all' | 'order' | 'promo' | 'news'>('all');
    const [readIds, setReadIds] = useState<string[]>(() => {
        if (typeof window === 'undefined') return [];
        try {
            const raw = localStorage.getItem(STORAGE_READ_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    });

    const [recentOrders, setRecentOrders] = useState<any[]>(() => {
        if (typeof window === 'undefined') return [];
        try {
            const raw = localStorage.getItem(STORAGE_ORDERS_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    });

    // Save read states
    const markAsRead = (id: string) => {
        setReadIds((prev) => {
            if (prev.includes(id)) return prev;
            const updated = [...prev, id];
            try {
                localStorage.setItem(STORAGE_READ_KEY, JSON.stringify(updated));
            } catch (e) {
                console.error(e);
            }
            return updated;
        });
    };

    const markAllAsRead = () => {
        const allIds = notificationsList.map((n) => n.id);
        setReadIds(allIds);
        try {
            localStorage.setItem(STORAGE_READ_KEY, JSON.stringify(allIds));
        } catch (e) {
            console.error(e);
        }
    };

    // Lock body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Build notification list (Real Announcements & Orders only)
    const notificationsList: NotificationItem[] = [
        // 1. Announcements from Admin if available
        ...(announcementText
            ? [
                  {
                      id: 'admin-broadcast-banner',
                      type: 'broadcast' as const,
                      title: '📢 Pengumuman Resmi Alat Kopi Malang',
                      message: announcementText,
                      timestamp: 'Informasi Terkini',
                      isRead: readIds.includes('admin-broadcast-banner'),
                      href: announcementLink || '/shop',
                      badge: 'Info Toko',
                      badgeColor: 'amber' as const,
                  },
              ]
            : []),

        // 2. Order Status Notifications (Real from localStorage)
        ...(recentOrders.length > 0
            ? recentOrders.map((ord: any) => ({
                  id: `order-status-${ord.order_number}`,
                  type: 'order' as const,
                  title: `Pesanan #${ord.order_number}`,
                  message: `Status: ${ord.status_label || 'Sedang Diproses'}. Metode bayar: ${ord.payment_method_label || 'QRIS Toko'}. Klik untuk memantau resi atau bayar.`,
                  timestamp: ord.created_at || 'Hari ini',
                  isRead: readIds.includes(`order-status-${ord.order_number}`),
                  href: `/pesanan/${ord.order_number}`,
                  badge: ord.payment_status === 'paid' ? 'Lunas' : 'Menunggu Bayar',
                  badgeColor: ord.payment_status === 'paid' ? ('emerald' as const) : ('amber' as const),
                  metadata: {
                      orderNumber: ord.order_number,
                      orderStatus: ord.status,
                      courier: ord.shipping_courier,
                  },
              }))
            : []),
    ];

    // Filter by Tab
    const filteredList = notificationsList.filter((item) => {
        if (activeTab === 'order') return item.type === 'order';
        if (activeTab === 'promo') return item.type === 'promo' || item.type === 'broadcast';
        if (activeTab === 'news') return item.type === 'event';
        return true;
    });

    const unreadCount = notificationsList.filter((n) => !n.isRead).length;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[80] flex justify-end">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-brand-950/60 backdrop-blur-xs"
                        onClick={onClose}
                    />

                    {/* Slide-over panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{
                            type: 'spring',
                            damping: 30,
                            stiffness: 300,
                            mass: 0.8,
                        }}
                        className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10"
                    >
                        {/* Header */}
                        <div className="px-5 py-4 border-b border-sand-200 bg-cream-50 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-xl bg-brand-700 text-white flex items-center justify-center">
                                    <Bell className="w-4 h-4" />
                                </div>
                                <div>
                                    <h2 className="text-base font-bold text-brand-950 flex items-center gap-1.5">
                                        <span>Pusat Notifikasi</span>
                                        {unreadCount > 0 && (
                                            <span className="bg-red-500 text-white text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
                                                {unreadCount}
                                            </span>
                                        )}
                                    </h2>
                                    <p className="text-[11px] text-brand-600">
                                        Status pesanan, broadcast promo &amp; info roastery
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-1">
                                {unreadCount > 0 && (
                                    <button
                                        type="button"
                                        onClick={markAllAsRead}
                                        className="text-[11px] text-brand-700 hover:text-brand-950 font-semibold p-1 hover:bg-sand-200/60 rounded-lg cursor-pointer flex items-center gap-1 transition-colors"
                                        title="Tandai semua sudah dibaca"
                                    >
                                        <CheckCheck className="w-3.5 h-3.5 text-brand-600" />
                                        <span className="hidden sm:inline">Tandai Dibaca</span>
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="p-1.5 rounded-full hover:bg-sand-200 text-brand-600 hover:text-brand-950 transition-colors cursor-pointer"
                                    aria-label="Tutup notifikasi"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Filter Tabs */}
                        <div className="px-4 py-2.5 bg-sand-100/60 border-b border-sand-200 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                            {[
                                { id: 'all', label: 'Semua' },
                                { id: 'order', label: 'Pesanan' },
                                { id: 'promo', label: 'Promo & Diskon' },
                                { id: 'news', label: 'Kabar Roastery' },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                                        activeTab === tab.id
                                            ? 'bg-brand-700 text-white shadow-xs'
                                            : 'bg-white text-brand-700 hover:bg-sand-200/80 border border-sand-200/80'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Notifications List */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {filteredList.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center py-12 text-brand-500">
                                    <Bell className="w-10 h-10 stroke-1 text-brand-300 mb-2" />
                                    <p className="text-xs font-semibold">Tidak ada notifikasi dalam kategori ini</p>
                                </div>
                            ) : (
                                filteredList.map((item) => {
                                    const badgeClasses =
                                        item.badgeColor === 'red'
                                            ? 'bg-red-100 text-red-800'
                                            : item.badgeColor === 'emerald'
                                                ? 'bg-emerald-100 text-emerald-800'
                                                : item.badgeColor === 'purple'
                                                    ? 'bg-purple-100 text-purple-800'
                                                    : item.badgeColor === 'blue'
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : 'bg-amber-100 text-amber-800';

                                    return (
                                        <div
                                            key={item.id}
                                            onClick={() => markAsRead(item.id)}
                                            className={`p-3.5 rounded-2xl border transition-all relative ${
                                                item.isRead
                                                    ? 'bg-white border-sand-200 hover:border-sand-300'
                                                    : 'bg-cream-50/80 border-brand-200/80 shadow-xs'
                                            }`}
                                        >
                                            {/* Unread indicator dot */}
                                            {!item.isRead && (
                                                <span className="absolute top-3.5 right-3.5 w-2 h-2 rounded-full bg-brand-700 ring-2 ring-brand-100" />
                                            )}

                                            <div className="space-y-1.5 pr-4">
                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                    {item.badge && (
                                                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${badgeClasses}`}>
                                                            {item.badge}
                                                        </span>
                                                    )}
                                                    <span className="text-[10px] text-brand-400 font-medium">
                                                        {item.timestamp}
                                                    </span>
                                                </div>

                                                <h3 className="text-xs sm:text-sm font-bold text-brand-950 leading-snug">
                                                    {item.title}
                                                </h3>

                                                <p className="text-[11px] text-brand-600 leading-relaxed">
                                                    {item.message}
                                                </p>

                                                {/* Action Link Button */}
                                                {item.href && (
                                                    <div className="pt-1.5">
                                                        <Link
                                                            href={item.href}
                                                            onClick={() => {
                                                                markAsRead(item.id);
                                                                onClose();
                                                            }}
                                                            className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-700 hover:text-brand-950 hover:underline"
                                                        >
                                                            <span>
                                                                {item.type === 'order'
                                                                    ? 'Buka Rincian Pesanan'
                                                                    : item.type === 'promo'
                                                                        ? 'Lihat Penawaran'
                                                                        : 'Pelajari Selengkapnya'}
                                                            </span>
                                                            <ArrowRight className="w-3 h-3" />
                                                        </Link>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Footer Quick Action: Lacak Pesanan Langsung */}
                        <div className="p-4 border-t border-sand-200 bg-cream-50 space-y-2">
                            <div className="flex items-center justify-between text-xs text-brand-600">
                                <span className="font-medium">Punya nomor invoice pesanan?</span>
                                <Link
                                    href="/lacak-pesanan"
                                    onClick={onClose}
                                    className="font-bold text-brand-700 hover:text-brand-950 hover:underline flex items-center gap-1"
                                >
                                    <Search className="w-3.5 h-3.5" />
                                    <span>Lacak Pesanan</span>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

