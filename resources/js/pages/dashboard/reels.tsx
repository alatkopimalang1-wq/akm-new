import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import {
    Film,
    Plus,
    Search,
    Edit2,
    Trash2,
    Play,
    X,
    ExternalLink,
    CheckCircle2,
    AlertCircle,
    Eye,
    SlidersHorizontal,
} from 'lucide-react';
import { toast } from 'sonner';

interface VideoReel {
    id: number | string;
    headline: string;
    caption: string;
    badge?: string | null;
    thumbnail: string;
    video_url: string;
    videoUrl?: string;
    product_count: number;
    productCount?: number;
    sort_order: number;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}

interface ReelsPageProps {
    reels: VideoReel[];
}

export default function DashboardReels({ reels = [] }: ReelsPageProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingReel, setEditingReel] = useState<VideoReel | null>(null);
    const [deletingReel, setDeletingReel] = useState<VideoReel | null>(null);
    const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);

    // Create Form
    const createForm = useForm({
        headline: '',
        caption: '',
        badge: '',
        thumbnail: '',
        video_url: '',
        sort_order: 0,
        is_active: true,
    });

    // Edit Form
    const editForm = useForm({
        headline: '',
        caption: '',
        badge: '',
        thumbnail: '',
        video_url: '',
        sort_order: 0,
        is_active: true,
    });

    const openEditModal = (reel: VideoReel) => {
        setEditingReel(reel);
        editForm.setData({
            headline: reel.headline,
            caption: reel.caption,
            badge: reel.badge || '',
            thumbnail: reel.thumbnail,
            video_url: reel.video_url || reel.videoUrl || '',
            sort_order: reel.sort_order || 0,
            is_active: reel.is_active ?? true,
        });
    };

    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post('/dashboard/reels', {
            preserveScroll: true,
            onSuccess: () => {
                setIsCreateOpen(false);
                createForm.reset();
                toast.success('Video Reel baru berhasil ditambahkan!');
            },
            onError: (errors) => {
                const firstError = Object.values(errors)[0];
                toast.error(firstError || 'Gagal menambahkan video reel.');
            },
        });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingReel) return;

        editForm.put(`/dashboard/reels/${editingReel.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setEditingReel(null);
                toast.success('Video Reel berhasil diperbarui!');
            },
            onError: (errors) => {
                const firstError = Object.values(errors)[0];
                toast.error(firstError || 'Gagal memperbarui video reel.');
            },
        });
    };

    const handleDelete = () => {
        if (!deletingReel) return;

        router.delete(`/dashboard/reels/${deletingReel.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setDeletingReel(null);
                toast.success('Video Reel berhasil dihapus.');
            },
            onError: () => {
                toast.error('Gagal menghapus video reel.');
            },
        });
    };

    const filteredReels = reels.filter((r) => {
        const q = searchTerm.toLowerCase();
        return (
            r.headline.toLowerCase().includes(q) ||
            r.caption.toLowerCase().includes(q) ||
            (r.badge && r.badge.toLowerCase().includes(q))
        );
    });

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: dashboard() },
                { title: 'Pengaturan Video Reels', href: '/dashboard/reels' },
            ]}
        >
            <Head title="Pengaturan Video Reels - Dashboard Admin" />

            <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sidebar-border">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <div className="w-10 h-10 rounded-xl bg-accent-copper/15 flex items-center justify-center text-accent-copper">
                                <Film className="w-5 h-5" />
                            </div>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
                                    Pengaturan Video Reels
                                </h1>
                                <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                                    Kelola video reels, judul, deskripsi, dan thumbnail yang tayang di halaman publik
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <a
                            href="/video"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition-colors"
                        >
                            <span>Lihat Halaman Publik</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                        </a>

                        <button
                            type="button"
                            onClick={() => setIsCreateOpen(true)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-white text-white dark:text-neutral-900 text-xs sm:text-sm font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Tambah Video Reel</span>
                        </button>
                    </div>
                </div>

                {/* Filter & Summary Bar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div className="relative flex-1 max-w-md">
                        <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Cari berdasarkan judul atau deskripsi..."
                            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-accent-copper/40"
                        />
                    </div>

                    <div className="flex items-center gap-3 text-xs text-neutral-600 dark:text-neutral-400">
                        <span className="px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 font-semibold">
                            Total: <strong className="text-neutral-900 dark:text-neutral-100">{reels.length}</strong> Video
                        </span>
                        <span className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-semibold">
                            Aktif: {reels.filter((r) => r.is_active).length}
                        </span>
                    </div>
                </div>

                {/* Reels Grid */}
                {filteredReels.length === 0 ? (
                    <div className="bg-white dark:bg-neutral-900 rounded-2xl p-12 text-center border border-neutral-200 dark:border-neutral-800 space-y-3">
                        <Film className="w-12 h-12 text-neutral-400 mx-auto opacity-50" />
                        <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                            Tidak ada video reel yang ditemukan
                        </p>
                        <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                            {searchTerm
                                ? 'Coba ganti kata kunci pencarian Anda.'
                                : 'Mulai tambahkan video reel baru untuk ditampilkan di Beranda dan Halaman Video.'}
                        </p>
                        <button
                            type="button"
                            onClick={() => setIsCreateOpen(true)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent-copper hover:bg-accent-copper-hover text-white text-xs font-bold transition-colors cursor-pointer"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Tambah Sekarang</span>
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                        {filteredReels.map((reel) => {
                            const videoUrl = reel.video_url || reel.videoUrl || '';
                            return (
                                <div
                                    key={reel.id}
                                    className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col"
                                >
                                    {/* Video / Thumbnail Aspect 9:16 Preview */}
                                    <div className="relative aspect-[9/13] bg-neutral-950 overflow-hidden group">
                                        <img
                                            src={reel.thumbnail}
                                            alt={reel.headline}
                                            className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
                                        />

                                        {/* Play Overlay Button */}
                                        {videoUrl && (
                                            <button
                                                type="button"
                                                onClick={() => setPreviewVideoUrl(videoUrl)}
                                                className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-black/60 hover:bg-accent-copper text-white flex items-center justify-center transition-all cursor-pointer group-hover:scale-110 shadow-lg"
                                                title="Putar Video Preview"
                                            >
                                                <Play className="w-5 h-5 ml-0.5 fill-white" />
                                            </button>
                                        )}

                                        {/* Badge Tag */}
                                        {reel.badge && (
                                            <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-accent-copper text-white shadow-xs">
                                                {reel.badge}
                                            </span>
                                        )}

                                        {/* Status Pill */}
                                        <span
                                            className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                                reel.is_active
                                                    ? 'bg-emerald-500/90 text-white'
                                                    : 'bg-neutral-600/90 text-neutral-200'
                                            }`}
                                        >
                                            {reel.is_active ? 'Aktif' : 'Draft'}
                                        </span>

                                        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] text-white/90 bg-black/40 backdrop-blur-xs px-2 py-1 rounded-md">
                                            <span>Urutan: #{reel.sort_order || 0}</span>
                                            <span>{reel.product_count || reel.productCount || 0} Produk</span>
                                        </div>
                                    </div>

                                    {/* Card Content */}
                                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                                        <div className="space-y-1.5">
                                            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 line-clamp-2 leading-snug">
                                                {reel.headline}
                                            </h3>
                                            <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-3 leading-relaxed">
                                                {reel.caption}
                                            </p>
                                        </div>

                                        {/* Action Buttons: Edit & Delete */}
                                        <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-2">
                                            <button
                                                type="button"
                                                onClick={() => openEditModal(reel)}
                                                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-bold transition-colors cursor-pointer"
                                            >
                                                <Edit2 className="w-3.5 h-3.5" />
                                                <span>Edit</span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => setDeletingReel(reel)}
                                                className="inline-flex items-center justify-center p-2 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 transition-colors cursor-pointer"
                                                title="Hapus Video Reel"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ======================================================== */}
            {/* Modal: Tambah Video Reel Baru                            */}
            {/* ======================================================== */}
            {isCreateOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
                    <div className="bg-white dark:bg-neutral-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200 dark:border-neutral-800 my-8 space-y-5 animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
                            <div className="flex items-center gap-2">
                                <Plus className="w-5 h-5 text-accent-copper" />
                                <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                                    Tambah Video Reel Baru
                                </h2>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsCreateOpen(false)}
                                className="w-8 h-8 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 flex items-center justify-center cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateSubmit} className="space-y-4">
                            {/* Judul / Headline */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                                    Judul Video Reel *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={createForm.data.headline}
                                    onChange={(e) => createForm.setData('headline', e.target.value)}
                                    placeholder="Contoh: Kalo Mesin Espresso Diperkecil, Maka Jadi Segini.."
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-accent-copper/40"
                                />
                                {createForm.errors.headline && (
                                    <p className="text-[11px] text-red-500">{createForm.errors.headline}</p>
                                )}
                            </div>

                            {/* Deskripsi / Caption */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                                    Deskripsi / Caption *
                                </label>
                                <textarea
                                    required
                                    rows={3}
                                    value={createForm.data.caption}
                                    onChange={(e) => createForm.setData('caption', e.target.value)}
                                    placeholder="Tuliskan ulasan ringkas mengenai konten video ini..."
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-accent-copper/40 resize-none"
                                />
                                {createForm.errors.caption && (
                                    <p className="text-[11px] text-red-500">{createForm.errors.caption}</p>
                                )}
                            </div>

                            {/* Badge Label (Opsional) */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                                    Badge Highlight (Opsional)
                                </label>
                                <input
                                    type="text"
                                    value={createForm.data.badge}
                                    onChange={(e) => createForm.setData('badge', e.target.value)}
                                    placeholder="Contoh: BARISTA APPROVED! ☕🔥 atau TIPS SEDUH"
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-accent-copper/40"
                                />
                            </div>

                            {/* Thumbnail URL */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                                    URL Gambar Thumbnail (Portrait 9:16 disarankan)
                                </label>
                                <input
                                    type="text"
                                    value={createForm.data.thumbnail}
                                    onChange={(e) => createForm.setData('thumbnail', e.target.value)}
                                    placeholder="https://images.unsplash.com/... atau /storage/..."
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-accent-copper/40"
                                />
                            </div>

                            {/* Video URL */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                                    URL Video MP4
                                </label>
                                <input
                                    type="text"
                                    value={createForm.data.video_url}
                                    onChange={(e) => createForm.setData('video_url', e.target.value)}
                                    placeholder="https://.../video.mp4"
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-accent-copper/40"
                                />
                            </div>

                            {/* Urutan & Status */}
                            <div className="grid grid-cols-2 gap-3 pt-1">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                                        Urutan Tampilan
                                    </label>
                                    <input
                                        type="number"
                                        value={createForm.data.sort_order}
                                        onChange={(e) => createForm.setData('sort_order', parseInt(e.target.value) || 0)}
                                        className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs text-neutral-900 dark:text-neutral-100"
                                    />
                                </div>

                                <div className="flex items-center gap-2 pt-5">
                                    <input
                                        type="checkbox"
                                        id="create-active"
                                        checked={createForm.data.is_active}
                                        onChange={(e) => createForm.setData('is_active', e.target.checked)}
                                        className="w-4 h-4 rounded text-accent-copper focus:ring-accent-copper"
                                    />
                                    <label htmlFor="create-active" className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 cursor-pointer">
                                        Aktifkan Sekarang
                                    </label>
                                </div>
                            </div>

                            <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-neutral-100 dark:border-neutral-800">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateOpen(false)}
                                    className="px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-bold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={createForm.processing}
                                    className="px-5 py-2.5 rounded-xl bg-accent-copper hover:bg-accent-copper-hover text-white text-xs font-bold shadow-sm transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                                >
                                    {createForm.processing ? 'Menyimpan...' : 'Simpan Video Reel'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ======================================================== */}
            {/* Modal: Edit Judul & Deskripsi Video Reel                 */}
            {/* ======================================================== */}
            {editingReel && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
                    <div className="bg-white dark:bg-neutral-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200 dark:border-neutral-800 my-8 space-y-5 animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
                            <div className="flex items-center gap-2">
                                <Edit2 className="w-5 h-5 text-accent-copper" />
                                <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                                    Edit Video Reel
                                </h2>
                            </div>
                            <button
                                type="button"
                                onClick={() => setEditingReel(null)}
                                className="w-8 h-8 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 flex items-center justify-center cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            {/* Judul / Headline */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                                    Judul Video Reel *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={editForm.data.headline}
                                    onChange={(e) => editForm.setData('headline', e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-accent-copper/40"
                                />
                                {editForm.errors.headline && (
                                    <p className="text-[11px] text-red-500">{editForm.errors.headline}</p>
                                )}
                            </div>

                            {/* Deskripsi / Caption */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                                    Deskripsi / Caption *
                                </label>
                                <textarea
                                    required
                                    rows={3}
                                    value={editForm.data.caption}
                                    onChange={(e) => editForm.setData('caption', e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-accent-copper/40 resize-none"
                                />
                                {editForm.errors.caption && (
                                    <p className="text-[11px] text-red-500">{editForm.errors.caption}</p>
                                )}
                            </div>

                            {/* Badge Label (Opsional) */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                                    Badge Highlight (Opsional)
                                </label>
                                <input
                                    type="text"
                                    value={editForm.data.badge}
                                    onChange={(e) => editForm.setData('badge', e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-accent-copper/40"
                                />
                            </div>

                            {/* Thumbnail URL */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                                    URL Gambar Thumbnail
                                </label>
                                <input
                                    type="text"
                                    value={editForm.data.thumbnail}
                                    onChange={(e) => editForm.setData('thumbnail', e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-accent-copper/40"
                                />
                            </div>

                            {/* Video URL */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                                    URL Video MP4
                                </label>
                                <input
                                    type="text"
                                    value={editForm.data.video_url}
                                    onChange={(e) => editForm.setData('video_url', e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-accent-copper/40"
                                />
                            </div>

                            {/* Urutan & Status */}
                            <div className="grid grid-cols-2 gap-3 pt-1">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                                        Urutan Tampilan
                                    </label>
                                    <input
                                        type="number"
                                        value={editForm.data.sort_order}
                                        onChange={(e) => editForm.setData('sort_order', parseInt(e.target.value) || 0)}
                                        className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs text-neutral-900 dark:text-neutral-100"
                                    />
                                </div>

                                <div className="flex items-center gap-2 pt-5">
                                    <input
                                        type="checkbox"
                                        id="edit-active"
                                        checked={editForm.data.is_active}
                                        onChange={(e) => editForm.setData('is_active', e.target.checked)}
                                        className="w-4 h-4 rounded text-accent-copper focus:ring-accent-copper"
                                    />
                                    <label htmlFor="edit-active" className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 cursor-pointer">
                                        Aktifkan Video
                                    </label>
                                </div>
                            </div>

                            <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-neutral-100 dark:border-neutral-800">
                                <button
                                    type="button"
                                    onClick={() => setEditingReel(null)}
                                    className="px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-bold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={editForm.processing}
                                    className="px-5 py-2.5 rounded-xl bg-accent-copper hover:bg-accent-copper-hover text-white text-xs font-bold shadow-sm transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                                >
                                    {editForm.processing ? 'Menyimpan...' : 'Perbarui Video Reel'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ======================================================== */}
            {/* Modal: Konfirmasi Hapus Video Reel                       */}
            {/* ======================================================== */}
            {deletingReel && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
                    <div className="bg-white dark:bg-neutral-900 rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-neutral-200 dark:border-neutral-800 space-y-4 animate-in fade-in zoom-in-95 duration-150">
                        <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
                            <Trash2 className="w-6 h-6" />
                        </div>

                        <div className="text-center space-y-1.5">
                            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                                Hapus Video Reel?
                            </h3>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                                Apakah Anda yakin ingin menghapus reel <strong className="text-neutral-800 dark:text-neutral-200 font-semibold">"{deletingReel.headline}"</strong>? Tindakan ini tidak dapat dibatalkan.
                            </p>
                        </div>

                        <div className="pt-2 flex items-center gap-2.5">
                            <button
                                type="button"
                                onClick={() => setDeletingReel(null)}
                                className="flex-1 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-bold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
                            >
                                Ya, Hapus Reel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ======================================================== */}
            {/* Modal: Quick Video Player Preview                        */}
            {/* ======================================================== */}
            {previewVideoUrl && (
                <div
                    onClick={() => setPreviewVideoUrl(null)}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative max-w-sm w-full aspect-[9/16] rounded-3xl overflow-hidden bg-black shadow-2xl border border-neutral-800"
                    >
                        <button
                            type="button"
                            onClick={() => setPreviewVideoUrl(null)}
                            className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center cursor-pointer shadow-md"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        <video
                            src={previewVideoUrl}
                            autoPlay
                            controls
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            )}
        </AppLayout>
    );
}

