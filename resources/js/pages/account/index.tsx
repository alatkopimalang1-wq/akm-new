import React, { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { PublicLayout } from '@/layouts/public-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PasswordInput from '@/components/password-input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import {
    Package,
    MapPin,
    User as UserIcon,
    Shield,
    KeyRound,
    LogOut,
    ExternalLink,
    Printer,
    ShoppingBag,
    CheckCircle2,
    Clock,
    Truck,
    Store,
    AlertCircle,
    ArrowRight,
    MessageCircle,
    Phone,
    Mail,
    Lock,
    Info,
} from 'lucide-react';

interface OrderItem {
    product_name: string;
    variant_label: string;
    grind_option?: string;
    custom_notes?: string;
    quantity: number;
    price: number;
    subtotal: number;
}

interface OrderSummary {
    id: number;
    order_number: string;
    created_at: string;
    total_amount: number;
    subtotal: number;
    shipping_cost: number;
    payment_status: string;
    status: string;
    payment_method: string;
    shipping_courier?: string;
    shipping_service?: string;
    tracking_number?: string;
    customer_name: string;
    customer_address?: string;
    items_count: number;
    items: OrderItem[];
}

interface UserProfile {
    id: number;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    province?: string;
    city?: string;
    district?: string;
    postal_code?: string;
    is_wa_account: boolean;
    has_password?: boolean;
    has_google?: boolean;
}

interface Props {
    user: UserProfile;
    orders: OrderSummary[];
    status?: string;
    defaultTab?: 'orders' | 'address' | 'profile' | 'security';
}

export default function CustomerAccount({ user, orders, status, defaultTab }: Props) {
    const [activeTab, setActiveTab] = useState<'orders' | 'address' | 'profile' | 'security'>(defaultTab || 'orders');
    const [logoutConfirm, setLogoutConfirm] = useState(false);

    // Profile form
    const profileForm = useForm({
        name: user.name || '',
        phone: user.phone || '',
        email: user.email || '',
    });

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        profileForm.post('/akun/profile', {
            preserveScroll: true,
        });
    };

    // Address form
    const addressForm = useForm({
        address: user.address || '',
        province: user.province || '',
        city: user.city || '',
        district: user.district || '',
        postal_code: user.postal_code || '',
    });

    const handleAddressSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addressForm.post('/akun/address', {
            preserveScroll: true,
        });
    };

    // Password form
    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        passwordForm.post('/akun/password', {
            preserveScroll: true,
            onSuccess: () => passwordForm.reset(),
        });
    };

    const handleLogout = () => {
        router.post('/logout');
    };

    const formatRupiah = (val: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(val);
    };

    const getPaymentBadge = (status: string) => {
        switch (status) {
            case 'paid':
                return { label: 'Lunas', color: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800' };
            case 'verifying':
                return { label: 'Cek Verifikasi Bukti', color: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800' };
            case 'cancelled':
                return { label: 'Dibatalkan', color: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800' };
            default:
                return { label: 'Menunggu Pembayaran', color: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800' };
        }
    };

    const getOrderStatusBadge = (status: string, courier?: string) => {
        const isPickup = courier && courier.toLowerCase().includes('ambil');
        switch (status) {
            case 'completed':
                return { label: isPickup ? 'Sudah Diambil di Toko' : 'Pesanan Selesai', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
            case 'ready_for_pickup':
                return { label: 'Siap Diambil di Roastery', color: 'bg-blue-50 text-blue-700 border-blue-200' };
            case 'shipped':
                return { label: isPickup ? 'Siap Diambil' : 'Dalam Pengiriman Kurir', color: 'bg-sky-50 text-sky-700 border-sky-200' };
            case 'processing':
                return { label: 'Sedang Disiapkan / Roasting', color: 'bg-amber-50 text-amber-700 border-amber-200' };
            case 'cancelled':
                return { label: 'Pesanan Dibatalkan', color: 'bg-red-50 text-red-700 border-red-200' };
            default:
                return { label: 'Menunggu Konfirmasi', color: 'bg-stone-50 text-stone-700 border-stone-200' };
        }
    };

    return (
        <PublicLayout title="Akun Saya">
            <Head title="Akun Saya — Alat Kopi Malang" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                {/* Header Sambutan Pelanggan */}
                <div className="bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-8 relative overflow-hidden">
                    <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-accent-copper/20 to-transparent pointer-events-none" />
                    
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-4 sm:gap-5">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-brand-800/80 border border-brand-700/80 flex items-center justify-center text-accent-copper shadow-inner text-2xl font-black shrink-0">
                                {user.name ? user.name.charAt(0).toUpperCase() : 'S'}
                            </div>
                            <div>
                                <div className="flex items-center gap-2.5 flex-wrap">
                                    <h1 className="text-xl sm:text-2xl font-bold font-serif tracking-tight text-white">
                                        Halo, {user.name || 'Pelanggan Alat Kopi Malang'}!
                                    </h1>
                                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-accent-copper/20 border border-accent-copper/40 text-accent-copper-light">
                                        Pelanggan Setia
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 mt-1.5 text-xs text-brand-300 flex-wrap">
                                    {user.phone && (
                                        <span className="flex items-center gap-1.5">
                                            <Phone className="w-3.5 h-3.5 text-accent-copper" />
                                            +{user.phone}
                                        </span>
                                    )}
                                    {user.email && !user.is_wa_account && (
                                        <span className="flex items-center gap-1.5">
                                            <Mail className="w-3.5 h-3.5 text-accent-copper" />
                                            {user.email}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                            <button
                                type="button"
                                onClick={() => setActiveTab('security')}
                                className={`inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all active:scale-95 cursor-pointer ${
                                    activeTab === 'security'
                                        ? 'bg-accent-copper border-accent-copper text-white shadow-sm'
                                        : 'bg-brand-800 hover:bg-brand-700 border-brand-700/60 text-brand-200 hover:text-white'
                                }`}
                                title="Ubah Kata Sandi"
                            >
                                <KeyRound className="w-4 h-4 text-accent-copper-light" />
                                <span>Ubah Kata Sandi</span>
                            </button>
                            <Link
                                href="/shop"
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent-copper hover:bg-accent-copper/90 text-white text-xs font-bold transition-all shadow-sm active:scale-95"
                            >
                                <ShoppingBag className="w-4 h-4" />
                                Belanja Kopi Lagi
                            </Link>
                            <button
                                type="button"
                                onClick={() => setLogoutConfirm(true)}
                                className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-brand-800 hover:bg-brand-700 border border-brand-700/60 text-brand-200 hover:text-white text-xs font-semibold transition-all active:scale-95 cursor-pointer"
                                title="Keluar Akun"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="hidden sm:inline">Keluar</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Notifikasi Status / Pesan Sukses */}
                {status && (
                    <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 text-sm font-medium">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        <span>{status}</span>
                    </div>
                )}

                {/* Navigasi Tab Menu Akun */}
                <div className="flex items-center gap-2 border-b border-sand-300 mb-8 overflow-x-auto pb-1 scrollbar-none">
                    <button
                        type="button"
                        onClick={() => setActiveTab('orders')}
                        className={`flex items-center gap-2 px-4 py-3 rounded-t-xl text-sm font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                            activeTab === 'orders'
                                ? 'border-accent-copper text-brand-950 bg-white shadow-xs'
                                : 'border-transparent text-brand-600/70 hover:text-brand-950'
                        }`}
                    >
                        <Package className="w-4 h-4 text-accent-copper" />
                        Riwayat Pesanan
                        <span className="ml-1 px-2 py-0.5 rounded-full text-[11px] bg-sand-200 text-brand-900 font-extrabold">
                            {orders.length}
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('address')}
                        className={`flex items-center gap-2 px-4 py-3 rounded-t-xl text-sm font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                            activeTab === 'address'
                                ? 'border-accent-copper text-brand-950 bg-white shadow-xs'
                                : 'border-transparent text-brand-600/70 hover:text-brand-950'
                        }`}
                    >
                        <MapPin className="w-4 h-4 text-accent-copper" />
                        Alamat Pengiriman
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('profile')}
                        className={`flex items-center gap-2 px-4 py-3 rounded-t-xl text-sm font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                            activeTab === 'profile'
                                ? 'border-accent-copper text-brand-950 bg-white shadow-xs'
                                : 'border-transparent text-brand-600/70 hover:text-brand-950'
                        }`}
                    >
                        <UserIcon className="w-4 h-4 text-accent-copper" />
                        Profil & Kontak
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('security')}
                        className={`flex items-center gap-2 px-4 py-3 rounded-t-xl text-sm font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                            activeTab === 'security'
                            ? 'border-accent-copper text-brand-950 bg-white shadow-xs'
                            : 'border-transparent text-brand-600/70 hover:text-brand-950'
                        }`}
                    >
                        <KeyRound className="w-4 h-4 text-accent-copper" />
                        Ubah Kata Sandi
                    </button>
                </div>

                {/* Konten Tab: 1. Riwayat Pesanan */}
                {activeTab === 'orders' && (
                    <div className="space-y-6">
                        {orders.length === 0 ? (
                            <div className="text-center py-16 px-4 bg-white rounded-3xl border border-sand-300 shadow-sm max-w-xl mx-auto">
                                <div className="w-20 h-20 rounded-full bg-cream-100 border border-sand-200 flex items-center justify-center mx-auto mb-4 text-brand-500">
                                    <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
                                </div>
                                <h3 className="text-lg font-bold text-brand-950 mb-2 font-serif">
                                    Belum Ada Riwayat Pesanan
                                </h3>
                                <p className="text-sm text-brand-600/80 mb-6 max-w-sm mx-auto leading-relaxed">
                                    Anda belum memiliki transaksi pesanan di Alat Kopi Malang. Temukan kopi segar sangrai pilihan kami sekarang.
                                </p>
                                <Link
                                    href="/shop"
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-950 hover:bg-brand-900 text-white font-bold text-sm transition-all shadow-md active:scale-95"
                                >
                                    <span>Mulai Belanja Kopi</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        ) : (
                            orders.map((order) => {
                                const payBadge = getPaymentBadge(order.payment_status);
                                const statusBadge = getOrderStatusBadge(order.status, order.shipping_courier);
                                const isPickup = order.shipping_courier && order.shipping_courier.toLowerCase().includes('ambil');

                                return (
                                    <div
                                        key={order.id}
                                        className="bg-white rounded-2xl border border-sand-300 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                                    >
                                        {/* Header Pesanan */}
                                        <div className="p-4 sm:p-5 bg-sand-50/60 border-b border-sand-200 flex flex-wrap items-center justify-between gap-3">
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-brand-500 font-medium">No. Pesanan:</span>
                                                    <span className="font-mono font-bold text-sm text-brand-950">
                                                        #{order.order_number}
                                                    </span>
                                                </div>
                                                <span className="text-brand-300 text-xs hidden sm:inline">•</span>
                                                <div className="flex items-center gap-1.5 text-xs text-brand-600">
                                                    <Clock className="w-3.5 h-3.5 text-brand-400" />
                                                    <span>{order.created_at}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${payBadge.color}`}>
                                                    {payBadge.label}
                                                </span>
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${statusBadge.color}`}>
                                                    {statusBadge.label}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Body Pesanan: Daftar Item */}
                                        <div className="p-4 sm:p-5 divide-y divide-sand-100">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-start justify-between gap-4">
                                                    <div className="space-y-1">
                                                        <h4 className="font-bold text-sm text-brand-950 leading-snug">
                                                            {item.quantity}x {item.product_name}
                                                        </h4>
                                                        <div className="flex items-center gap-2 text-xs text-brand-600 flex-wrap">
                                                            <span className="px-2 py-0.5 rounded-md bg-sand-100 font-medium text-[11px]">
                                                                {item.variant_label}
                                                            </span>
                                                            {item.grind_option && (
                                                                <span className="px-2 py-0.5 rounded-md bg-cream-100 text-brand-800 font-medium text-[11px]">
                                                                    {item.grind_option}
                                                                </span>
                                                            )}
                                                        </div>
                                                        {item.custom_notes && (
                                                            <div className="text-xs text-brand-900 font-medium bg-sand-50 p-2 rounded-lg border border-sand-200 mt-1 space-y-1">
                                                                {String(item.custom_notes)
                                                                    .split(/\n|\s*\|\s*|(?=\[(?:Slot\s*\d+|GRATIS|OPSIONAL|OPTIONAL)\])/i)
                                                                    .map((line) =>
                                                                        line
                                                                            .replace(/\s*\(Rp\s*[\d.,]+\)\s*$/i, '')
                                                                            .replace(
                                                                                /^(\[(?:Slot\s*\d+|GRATIS|OPSIONAL|OPTIONAL)\])\s*(?!\d+x\b)/i,
                                                                                '$1 1x ',
                                                                            )
                                                                            .trim(),
                                                                    )
                                                                    .filter(Boolean)
                                                                    .map((line, lineIdx) => (
                                                                        <p key={lineIdx}>{line}</p>
                                                                    ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="text-right shrink-0">
                                                        <span className="text-sm font-bold text-brand-950">
                                                            {formatRupiah(item.subtotal)}
                                                        </span>
                                                        <p className="text-[11px] text-brand-400">
                                                            @{formatRupiah(item.price)}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Footer Pesanan: Pengiriman & Aksi */}
                                        <div className="p-4 sm:p-5 bg-sand-50/30 border-t border-sand-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div className="text-xs text-brand-600 space-y-0.5">
                                                <div className="flex items-center gap-1.5 font-medium">
                                                    {isPickup ? (
                                                        <>
                                                            <Store className="w-3.5 h-3.5 text-accent-copper" />
                                                            <span>Pengambilan: Ambil di Toko (Bebas Ongkir)</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Truck className="w-3.5 h-3.5 text-accent-copper" />
                                                            <span>
                                                                Kurir: {order.shipping_courier || 'Ekspedisi'}{' '}
                                                                {order.shipping_service ? `(${order.shipping_service})` : ''}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                                {order.tracking_number && (
                                                    <p className="text-xs text-brand-800 font-mono font-bold">
                                                        No. Resi: {order.tracking_number}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                                                <div className="text-right sm:mr-3">
                                                    <span className="text-[11px] text-brand-500 block leading-tight">Total Tagihan</span>
                                                    <span className="text-base font-black text-brand-950 font-serif">
                                                        {formatRupiah(order.total_amount)}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <Link
                                                        href={`/pesanan/${order.order_number}`}
                                                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-900 hover:bg-brand-800 text-white text-xs font-bold transition-all shadow-xs active:scale-95"
                                                    >
                                                        <span>Detail & Status</span>
                                                        <ExternalLink className="w-3.5 h-3.5" />
                                                    </Link>

                                                    <Link
                                                        href={`/pesanan/${order.order_number}/invoice`}
                                                        target="_blank"
                                                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-sand-100 border border-sand-300 text-brand-800 text-xs font-semibold transition-all shadow-xs active:scale-95"
                                                        title="Cetak / Download Invoice PDF"
                                                    >
                                                        <Printer className="w-3.5 h-3.5" />
                                                        <span className="hidden sm:inline">Invoice</span>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}

                {/* Konten Tab: 2. Alamat Pengiriman */}
                {activeTab === 'address' && (
                    <div className="bg-white rounded-3xl border border-sand-300 p-6 sm:p-8 shadow-sm max-w-2xl">
                        <div className="flex items-center gap-3 pb-4 border-b border-sand-200 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-brand-50 text-accent-copper flex items-center justify-center shrink-0">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-brand-950">Alamat Pengiriman Utama</h3>
                                <p className="text-xs text-brand-600">
                                    Alamat ini akan otomatis terisi saat Anda melakukan checkout pesanan berikutnya.
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleAddressSubmit} className="space-y-5">
                            <div>
                                <Label htmlFor="address" className="text-xs font-bold text-brand-900 mb-1.5 block">
                                    Alamat Lengkap (Jalan, No. Rumah, RT/RW, Patokan) *
                                </Label>
                                <textarea
                                    id="address"
                                    rows={3}
                                    value={addressForm.data.address}
                                    onChange={(e) => addressForm.setData('address', e.target.value)}
                                    placeholder="Contoh: Jl. Ijen No. 12, RT 02/RW 04, Belakang Taman Slamet"
                                    className="w-full p-3.5 rounded-xl border border-sand-300 text-sm text-brand-950 focus:border-accent-copper focus:ring-1 focus:ring-accent-copper outline-none transition-all placeholder:text-brand-300"
                                    required
                                />
                                {addressForm.errors.address && (
                                    <p className="text-xs text-red-600 mt-1">{addressForm.errors.address}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="province" className="text-xs font-bold text-brand-900 mb-1.5 block">
                                        Provinsi
                                    </Label>
                                    <Input
                                        id="province"
                                        value={addressForm.data.province}
                                        onChange={(e) => addressForm.setData('province', e.target.value)}
                                        placeholder="Contoh: Jawa Timur"
                                        className="rounded-xl border-sand-300"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="city" className="text-xs font-bold text-brand-900 mb-1.5 block">
                                        Kota / Kabupaten
                                    </Label>
                                    <Input
                                        id="city"
                                        value={addressForm.data.city}
                                        onChange={(e) => addressForm.setData('city', e.target.value)}
                                        placeholder="Contoh: Kota Malang"
                                        className="rounded-xl border-sand-300"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="district" className="text-xs font-bold text-brand-900 mb-1.5 block">
                                        Kecamatan
                                    </Label>
                                    <Input
                                        id="district"
                                        value={addressForm.data.district}
                                        onChange={(e) => addressForm.setData('district', e.target.value)}
                                        placeholder="Contoh: Lowokwaru"
                                        className="rounded-xl border-sand-300"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="postal_code" className="text-xs font-bold text-brand-900 mb-1.5 block">
                                        Kode Pos
                                    </Label>
                                    <Input
                                        id="postal_code"
                                        value={addressForm.data.postal_code}
                                        onChange={(e) => addressForm.setData('postal_code', e.target.value)}
                                        placeholder="Contoh: 65116"
                                        className="rounded-xl border-sand-300"
                                    />
                                </div>
                            </div>

                            <div className="pt-3">
                                <Button
                                    type="submit"
                                    disabled={addressForm.processing}
                                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-brand-950 hover:bg-brand-900 text-white font-bold text-sm shadow-md"
                                >
                                    {addressForm.processing ? <Spinner className="w-4 h-4 mr-2" /> : null}
                                    Simpan Alamat Pengiriman
                                </Button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Konten Tab: 3. Profil & Kontak */}
                {activeTab === 'profile' && (
                    <div className="bg-white rounded-3xl border border-sand-300 p-6 sm:p-8 shadow-sm max-w-2xl">
                        <div className="flex items-center gap-3 pb-4 border-b border-sand-200 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-brand-50 text-accent-copper flex items-center justify-center shrink-0">
                                <UserIcon className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-brand-950">Informasi Profil Akun</h3>
                                <p className="text-xs text-brand-600">
                                    Perbarui nama lengkap dan kontak untuk kemudahan komunikasi pesanan.
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleProfileSubmit} className="space-y-5">
                            <div>
                                <Label htmlFor="name" className="text-xs font-bold text-brand-900 mb-1.5 block">
                                    Nama Lengkap *
                                </Label>
                                <Input
                                    id="name"
                                    value={profileForm.data.name}
                                    onChange={(e) => profileForm.setData('name', e.target.value)}
                                    placeholder="Masukkan nama lengkap Anda"
                                    className="rounded-xl border-sand-300"
                                    required
                                />
                                {profileForm.errors.name && (
                                    <p className="text-xs text-red-600 mt-1">{profileForm.errors.name}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="phone" className="text-xs font-bold text-brand-900 mb-1.5 block">
                                    Nomor WhatsApp / HP
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="phone"
                                        value={profileForm.data.phone}
                                        onChange={(e) => profileForm.setData('phone', e.target.value)}
                                        placeholder="Contoh: 081234567890"
                                        className="rounded-xl border-sand-300 pl-9"
                                    />
                                    <Phone className="w-4 h-4 text-brand-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>
                                <p className="text-[11px] text-brand-500 mt-1">
                                    Nomor ini digunakan oleh roastery & kurir untuk mengonfirmasi status kiriman kopi.
                                </p>
                            </div>

                            <div>
                                <Label htmlFor="email" className="text-xs font-bold text-brand-900 mb-1.5 block">
                                    Alamat Email *
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="email"
                                        type="email"
                                        value={profileForm.data.email}
                                        onChange={(e) => profileForm.setData('email', e.target.value)}
                                        placeholder="nama@email.com"
                                        className="rounded-xl border-sand-300 pl-9"
                                        required
                                    />
                                    <Mail className="w-4 h-4 text-brand-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>
                                {profileForm.errors.email && (
                                    <p className="text-xs text-red-600 mt-1">{profileForm.errors.email}</p>
                                )}
                            </div>

                            <div className="pt-3">
                                <Button
                                    type="submit"
                                    disabled={profileForm.processing}
                                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-brand-950 hover:bg-brand-900 text-white font-bold text-sm shadow-md cursor-pointer"
                                >
                                    {profileForm.processing ? <Spinner className="w-4 h-4 mr-2" /> : null}
                                    Simpan Perubahan Profil
                                </Button>
                            </div>
                        </form>

                        {/* Pintasan Ubah Kata Sandi di Halaman Profil */}
                        <div className="mt-8 pt-6 border-t border-sand-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-sand-50/80 p-5 rounded-2xl border border-sand-200">
                            <div className="flex items-center gap-3.5">
                                <div className="w-10 h-10 rounded-xl bg-accent-copper/10 text-accent-copper flex items-center justify-center shrink-0">
                                    <KeyRound className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-brand-950">Keamanan & Kata Sandi Akun</h4>
                                    <p className="text-xs text-brand-600 mt-0.5">
                                        Perbarui kata sandi akun Anda secara berkala agar akun belanja tetap terlindungi.
                                    </p>
                                </div>
                            </div>
                            <Button
                                type="button"
                                onClick={() => setActiveTab('security')}
                                className="w-full sm:w-auto text-xs font-bold rounded-xl bg-brand-950 hover:bg-brand-900 text-white shadow-xs shrink-0 cursor-pointer"
                            >
                                Ubah Kata Sandi
                            </Button>
                        </div>
                    </div>
                )}

                {/* Konten Tab: 4. Ubah Kata Sandi (Security) */}
                {activeTab === 'security' && (
                    <div className="bg-white rounded-3xl border border-sand-300 p-6 sm:p-8 shadow-sm max-w-2xl">
                        <div className="flex items-center gap-3 pb-4 border-b border-sand-200 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-accent-copper/10 text-accent-copper flex items-center justify-center shrink-0">
                                <KeyRound className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-brand-950">Ubah Kata Sandi Akun</h3>
                                <p className="text-xs text-brand-600">
                                    Pastikan kata sandi Anda kuat dan tidak mudah ditebak untuk menjaga keamanan akun Alat Kopi Malang Anda.
                                </p>
                            </div>
                        </div>

                        {user.is_wa_account ? (
                            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900">
                                <div className="flex items-start gap-3">
                                    <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="text-sm font-bold text-amber-950">Akun Terdaftar melalui WhatsApp</h4>
                                        <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                                            Akun Anda saat ini terhubung langsung dengan nomor WhatsApp ({user.phone || 'Nomor WhatsApp'}). Jika Anda ingin login menggunakan email & kata sandi, silakan perbarui email valid Anda di tab Profil & Kontak terlebih dahulu.
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab('profile')}
                                            className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 hover:text-amber-950 underline underline-offset-4 cursor-pointer"
                                        >
                                            Buka Pengaturan Profil
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                {user.has_google && (
                                    <div className="mb-6 p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 flex items-start gap-3">
                                        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                                        <div className="text-xs leading-relaxed">
                                            <p className="font-bold text-blue-950 mb-0.5">Akun Terhubung dengan Google</p>
                                            <p className="text-blue-800">
                                                Akun Anda terhubung dengan akun Google ({user.email}). Anda dapat membuat kata sandi baru di bawah ini agar dapat login langsung menggunakan email dan kata sandi tanpa Google.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <form onSubmit={handlePasswordSubmit} className="space-y-5">
                                    {user.has_password !== false && (
                                        <div>
                                            <Label htmlFor="current_password" className="text-xs font-bold text-brand-900 mb-1.5 block">
                                                Kata Sandi Saat Ini *
                                            </Label>
                                            <PasswordInput
                                                id="current_password"
                                                value={passwordForm.data.current_password}
                                                onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                                placeholder="Masukkan kata sandi saat ini"
                                                className="rounded-xl border-sand-300"
                                                required
                                            />
                                            {passwordForm.errors.current_password && (
                                                <p className="text-xs text-red-600 mt-1">{passwordForm.errors.current_password}</p>
                                            )}
                                        </div>
                                    )}

                                    <div>
                                        <Label htmlFor="new_password" className="text-xs font-bold text-brand-900 mb-1.5 block">
                                            Kata Sandi Baru *
                                        </Label>
                                        <PasswordInput
                                            id="new_password"
                                            value={passwordForm.data.password}
                                            onChange={(e) => passwordForm.setData('password', e.target.value)}
                                            placeholder="Minimal 8 karakter"
                                            className="rounded-xl border-sand-300"
                                            required
                                        />
                                        {passwordForm.errors.password && (
                                            <p className="text-xs text-red-600 mt-1">{passwordForm.errors.password}</p>
                                        )}
                                        <p className="text-[11px] text-brand-500 mt-1">
                                            Gunakan minimal 8 karakter dengan kombinasi huruf, angka, atau simbol.
                                        </p>
                                    </div>

                                    <div>
                                        <Label htmlFor="password_confirmation" className="text-xs font-bold text-brand-900 mb-1.5 block">
                                            Konfirmasi Kata Sandi Baru *
                                        </Label>
                                        <PasswordInput
                                            id="password_confirmation"
                                            value={passwordForm.data.password_confirmation}
                                            onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                            placeholder="Ketik ulang kata sandi baru Anda"
                                            className="rounded-xl border-sand-300"
                                            required
                                        />
                                        {passwordForm.errors.password_confirmation && (
                                            <p className="text-xs text-red-600 mt-1">{passwordForm.errors.password_confirmation}</p>
                                        )}
                                    </div>

                                    <div className="pt-3">
                                        <Button
                                            type="submit"
                                            disabled={passwordForm.processing}
                                            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-brand-950 hover:bg-brand-900 text-white font-bold text-sm shadow-md cursor-pointer"
                                        >
                                            {passwordForm.processing ? <Spinner className="w-4 h-4 mr-2" /> : null}
                                            Simpan Perubahan Kata Sandi
                                        </Button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Modal Konfirmasi Logout */}
            {logoutConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
                    <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full shadow-2xl border border-sand-200">
                        <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
                            <LogOut className="w-6 h-6" />
                        </div>
                        <h4 className="text-base font-bold text-brand-950 text-center mb-1.5">
                            Konfirmasi Keluar Akun
                        </h4>
                        <p className="text-xs text-brand-600 text-center mb-6 leading-relaxed">
                            Apakah Anda yakin ingin keluar dari akun Alat Kopi Malang Anda?
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setLogoutConfirm(false)}
                                className="rounded-xl text-xs font-semibold py-2.5 text-white hover:text-white bg-neutral-900 hover:bg-neutral-800 border-neutral-800"
                            >
                                Batal
                            </Button>
                            <Button
                                type="button"
                                onClick={handleLogout}
                                className="rounded-xl text-xs font-bold py-2.5 bg-red-600 hover:bg-red-700 text-white shadow-sm"
                            >
                                Ya, Keluar
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </PublicLayout>
    );
}
