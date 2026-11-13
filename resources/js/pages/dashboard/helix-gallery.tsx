import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {
    Layers,
    Plus,
    Search,
    Edit2,
    Trash2,
    X,
    ExternalLink,
    SlidersHorizontal,
    RotateCcw,
    Sparkles,
    Eye,
    EyeOff,
    Upload,
    ArrowUpDown,
    Check,
} from 'lucide-react';
import { toast } from 'sonner';

export interface HelixGalleryItem {
    id: string | number;
    title?: string;
    subtitle?: string | null;
    image?: string | null;
    sort_order?: number;
    is_active?: boolean;
}

export interface HelixSettings {
    auto_rotate: boolean;
    auto_rotate_speed: number;
    visible_columns: number;
    tiers_count: number;
    show_header: boolean;
    badge: string;
    title: string;
    subtitle: string;
}

interface HelixGalleryPageProps {
    settings: HelixSettings;
    items: HelixGalleryItem[];
}

export default function DashboardHelixGallery({
    settings: initialSettings,
    items: initialItems = [],
}: HelixGalleryPageProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<HelixGalleryItem | null>(null);
    const [deletingItem, setDeletingItem] = useState<HelixGalleryItem | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    // Settings Form
    const settingsForm = useForm({
        auto_rotate: initialSettings.auto_rotate,
        auto_rotate_speed: initialSettings.auto_rotate_speed,
        visible_columns: initialSettings.visible_columns,
        tiers_count: initialSettings.tiers_count,
        show_header: initialSettings.show_header,
        badge: initialSettings.badge,
        title: initialSettings.title,
        subtitle: initialSettings.subtitle,
    });

    // Create Item Form (Strictly image upload, sort order, and active status)
    const createForm = useForm<{
        image: string;
        image_file: File | null;
        sort_order: number;
        is_active: boolean;
    }>({
        image: '',
        image_file: null,
        sort_order: (initialItems.length || 0) + 1,
        is_active: true,
    });

    // Edit Item Form
    const editForm = useForm<{
        image: string;
        image_file: File | null;
        sort_order: number;
        is_active: boolean;
    }>({
        image: '',
        image_file: null,
        sort_order: 0,
        is_active: true,
    });

    const openEditModal = (item: HelixGalleryItem) => {
        setEditingItem(item);
        editForm.setData({
            image: item.image || '',
            image_file: null,
            sort_order: item.sort_order ?? 0,
            is_active: item.is_active ?? true,
        });
    };

    const handleSaveSettings = (e: React.FormEvent) => {
        e.preventDefault();
        settingsForm.post('/dashboard/helix-gallery/settings', {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Pengaturan rotasi dan grid helix 3D berhasil disimpan!');
            },
            onError: (err) => {
                toast.error('Gagal menyimpan pengaturan: ' + Object.values(err)[0]);
            },
        });
    };

    const handleCreateItem = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post('/dashboard/helix-gallery/items', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Gambar baru berhasil ditambahkan ke galeri 3D!');
                setIsCreateOpen(false);
                createForm.reset();
            },
            onError: (err) => {
                toast.error('Gagal menambah gambar: ' + Object.values(err)[0]);
            },
        });
    };

    const handleUpdateItem = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingItem) return;

        editForm.post(`/dashboard/helix-gallery/items/${editingItem.id}`, {
            forceFormData: true,
            preserveScroll: true,
            headers: {
                'X-HTTP-Method-Override': 'PUT',
            },
            onSuccess: () => {
                toast.success('Gambar galeri berhasil diperbarui!');
                setEditingItem(null);
            },
            onError: (err) => {
                toast.error('Gagal memperbarui gambar: ' + Object.values(err)[0]);
            },
        });
    };

    const handleDeleteItem = () => {
        if (!deletingItem) return;

        router.delete(`/dashboard/helix-gallery/items/${deletingItem.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Gambar galeri berhasil dihapus.');
                setDeletingItem(null);
            },
            onError: () => {
                toast.error('Gagal menghapus gambar galeri.');
            },
        });
    };

    const handleResetDefaults = () => {
        if (!confirm('Apakah Anda yakin ingin mereset daftar gambar galeri ke konfigurasi default?')) {
            return;
        }

        router.post(
            '/dashboard/helix-gallery/reset',
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Daftar gambar galeri berhasil direset.');
                },
            }
        );
    };

    const filteredItems = initialItems.filter((item, index) => {
        if (!searchTerm) return true;
        const query = searchTerm.toLowerCase();
        const label = `gambar ${index + 1}`.toLowerCase();
        const imgName = (item.image || '').toLowerCase();
        return label.includes(query) || imgName.includes(query);
    });

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'Galeri 3D Helix', href: '/dashboard/helix-gallery' },
            ]}
        >
            <Head title="Pengaturan Galeri 3D Helix - Sanubari Admin" />

            <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-7xl mx-auto w-full">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-accent-copper/15 flex items-center justify-center text-accent-copper">
                                <Layers className="w-4 h-4" />
                            </div>
                            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                                Pengaturan Galeri 3D Helix
                            </h1>
                        </div>
                        <p className="text-xs sm:text-sm text-neutral-500 max-w-2xl">
                            Kelola formasi grid gambar menyamping, kecepatan rotasi otomatis 360°, serta unggah foto gambar pada pita spiral 3D di halaman beranda.
                        </p>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <a
                            href="/#helix-showcase"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 transition-colors"
                        >
                            <ExternalLink className="w-3.5 h-3.5 text-accent-copper" />
                            <span>Lihat di Halaman Utama</span>
                        </a>

                        <button
                            type="button"
                            onClick={() => setIsCreateOpen(true)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-accent-copper hover:bg-accent-copper/90 text-white shadow-sm transition-all active:scale-95"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Upload Gambar Baru</span>
                        </button>
                    </div>
                </div>

                {/* Form Pengaturan 3D Helix (Rotasi & Grid) */}
                <form
                    onSubmit={handleSaveSettings}
                    className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 sm:p-6 space-y-5 shadow-xs"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 dark:border-neutral-800 pb-4">
                        <div className="flex items-center gap-2.5">
                            <div className="p-2 rounded-xl bg-accent-copper/10 text-accent-copper">
                                <SlidersHorizontal className="w-4 h-4" />
                            </div>
                            <div>
                                <h2 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-neutral-100">
                                    Aturan Grid & Rotasi 3D Helix
                                </h2>
                                <p className="text-xs text-neutral-500">
                                    Kontrol visual bentuk pita spiral, rotasi otomatis, dan kepadatan gambar.
                                </p>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={settingsForm.processing}
                            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-neutral-200 text-white dark:text-neutral-950 shadow-sm transition-all active:scale-95 disabled:opacity-50"
                        >
                            <Check className="w-3.5 h-3.5" />
                            <span>{settingsForm.processing ? 'Menyimpan...' : 'Simpan Aturan Grid'}</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Auto-Rotate Toggle */}
                        <div className="space-y-1.5 p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800">
                            <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200 flex items-center justify-between cursor-pointer">
                                <span>Rotasi Otomatis 360°</span>
                                <input
                                    type="checkbox"
                                    checked={settingsForm.data.auto_rotate}
                                    onChange={(e) => settingsForm.setData('auto_rotate', e.target.checked)}
                                    className="w-4 h-4 accent-accent-copper rounded"
                                />
                            </label>
                            <p className="text-[11px] text-neutral-500">
                                Helix berputar lambat saat tidak disentuh pengguna.
                            </p>
                        </div>

                        {/* Rotation Speed */}
                        <div className="space-y-1.5 p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800">
                            <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200 block">
                                Kecepatan Rotasi
                            </label>
                            <select
                                value={String(settingsForm.data.auto_rotate_speed)}
                                onChange={(e) => settingsForm.setData('auto_rotate_speed', parseFloat(e.target.value))}
                                className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100"
                            >
                                <option value="0.08">Sangat Lambat (0.08)</option>
                                <option value="0.15">Lambat Rileks (0.15)</option>
                                <option value="0.20">Standar Rekomendasi (0.20)</option>
                                <option value="0.30">Sedang Dinamis (0.30)</option>
                                <option value="0.45">Cepat (0.45)</option>
                            </select>
                            <p className="text-[11px] text-neutral-500">
                                Kecepatan putaran saat mode auto-rotate aktif.
                            </p>
                        </div>

                        {/* Visible Columns Grid */}
                        <div className="space-y-1.5 p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800">
                            <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200 block">
                                Gambar Menyamping (Kolom)
                            </label>
                            <select
                                value={String(settingsForm.data.visible_columns)}
                                onChange={(e) => settingsForm.setData('visible_columns', parseInt(e.target.value, 10))}
                                className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100"
                            >
                                <option value="3">3 Gambar Menyamping (Besar)</option>
                                <option value="4">4 Gambar Menyamping (Sedang)</option>
                                <option value="5">5 Gambar Menyamping (Standar Ramping)</option>
                                <option value="6">6 Gambar Menyamping (Padat)</option>
                            </select>
                            <p className="text-[11px] text-neutral-500">
                                Formasi jumlah foto di sisi depan 3D.
                            </p>
                        </div>

                        {/* Tiers Count */}
                        <div className="space-y-1.5 p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-800">
                            <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200 block">
                                Formasi Baris Bertingkat
                            </label>
                            <select
                                value={String(settingsForm.data.tiers_count)}
                                onChange={(e) => settingsForm.setData('tiers_count', parseInt(e.target.value, 10))}
                                className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100"
                            >
                                <option value="1">1 Baris Tunggal</option>
                                <option value="2">2 Baris Bertingkat (Rekomendasi)</option>
                                <option value="3">3 Baris Bertingkat</option>
                            </select>
                            <p className="text-[11px] text-neutral-500">
                                Jumlah susunan baris spiral ke bawah.
                            </p>
                        </div>
                    </div>

                    {/* Header Display Toggle */}
                    <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-sand-50 dark:bg-neutral-800/30 p-3.5 rounded-xl border border-sand-200/70 dark:border-neutral-800">
                        <div className="flex items-center gap-2">
                            <input
                                id="toggle_show_header"
                                type="checkbox"
                                checked={settingsForm.data.show_header}
                                onChange={(e) => settingsForm.setData('show_header', e.target.checked)}
                                className="w-4 h-4 accent-accent-copper rounded"
                            />
                            <label htmlFor="toggle_show_header" className="font-semibold text-neutral-800 dark:text-neutral-200 cursor-pointer">
                                Tampilkan Teks Header (Judul & Badge) di Atas Galeri
                            </label>
                        </div>
                        <span className="text-[11px] text-neutral-500">
                            {settingsForm.data.show_header
                                ? 'Status: Header ditampilkan'
                                : 'Status: Header disembunyikan (tampilan gambar melayang bersih)'}
                        </span>
                    </div>
                </form>

                {/* Table of Images */}
                <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-xs">
                    {/* Action Bar */}
                    <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200 dark:border-neutral-800">
                        <div className="flex items-center gap-3">
                            <h2 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-neutral-100">
                                Daftar Gambar Galeri ({filteredItems.length} Gambar)
                            </h2>
                            <button
                                type="button"
                                onClick={handleResetDefaults}
                                className="text-xs text-neutral-500 hover:text-accent-copper flex items-center gap-1 font-medium underline"
                                title="Reset kembali ke susunan gambar default"
                            >
                                <RotateCcw className="w-3 h-3" />
                                <span>Reset Default</span>
                            </button>
                        </div>

                        <div className="relative w-full sm:w-72">
                            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Cari nomor gambar atau URL..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400"
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-neutral-50 dark:bg-neutral-800/60 text-neutral-600 dark:text-neutral-400 font-semibold border-b border-neutral-200 dark:border-neutral-800">
                                <tr>
                                    <th className="py-3 px-4 w-14 text-center">No</th>
                                    <th className="py-3 px-4 w-28">Preview Gambar</th>
                                    <th className="py-3 px-4">Tipe Gambar</th>
                                    <th className="py-3 px-4 w-24 text-center">Urutan</th>
                                    <th className="py-3 px-4 w-24 text-center">Status</th>
                                    <th className="py-3 px-4 w-28 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                {filteredItems.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-10 text-neutral-400">
                                            Tidak ada gambar yang cocok dengan pencarian.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredItems.map((item, index) => (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/30 transition-colors"
                                        >
                                            <td className="py-3 px-4 text-center text-neutral-400 font-mono">
                                                {index + 1}
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="w-16 h-12 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center relative shadow-xs">
                                                    {item.image ? (
                                                        <img
                                                            src={item.image}
                                                            alt="Foto Galeri"
                                                            className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                                                            onClick={() => setPreviewImage(item.image || null)}
                                                        />
                                                    ) : (
                                                        <span className="text-[9px] text-accent-copper font-bold uppercase tracking-wider text-center p-1 leading-tight">
                                                            Procedural Art
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                {item.image ? (
                                                    <div className="space-y-0.5">
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-accent-copper/15 text-accent-copper border border-accent-copper/20">
                                                            Foto Terunggah
                                                        </span>
                                                        <div className="text-[11px] text-neutral-500 font-mono truncate max-w-xs">
                                                            {item.image}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-neutral-500 text-[11px]">
                                                        Procedural Landscape (Default Three.js)
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4 text-center font-mono text-neutral-700 dark:text-neutral-300">
                                                {item.sort_order ?? index + 1}
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                <span
                                                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                                        item.is_active !== false
                                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
                                                            : 'bg-neutral-100 text-neutral-500 border border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400'
                                                    }`}
                                                >
                                                    {item.is_active !== false ? 'Aktif' : 'Nonaktif'}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                <div className="flex items-center justify-center gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => openEditModal(item)}
                                                        className="p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors"
                                                        title="Edit Gambar"
                                                    >
                                                        <Edit2 className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setDeletingItem(item)}
                                                        className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/30 dark:hover:bg-red-950/60 dark:text-red-400 transition-colors"
                                                        title="Hapus Gambar"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Upload Gambar Baru */}
            {isCreateOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
                    <div className="relative w-full max-w-lg bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-neutral-800">
                            <div>
                                <h3 className="font-bold text-sm sm:text-base text-neutral-900 dark:text-neutral-100">
                                    Upload Gambar ke Galeri 3D Helix
                                </h3>
                                <p className="text-[11px] text-neutral-500">
                                    Unggah foto rasio 4:3 untuk ditampilkan di lintasan spiral 3D.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsCreateOpen(false)}
                                className="p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateItem} className="p-6 overflow-y-auto space-y-4 text-xs">
                            <div>
                                <label className="font-bold block mb-1">Unggah Foto / Gambar (Rasio 4:3)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => createForm.setData('image_file', e.target.files?.[0] || null)}
                                    className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 file:mr-3 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-accent-copper file:text-white"
                                />
                                <span className="text-[10px] text-neutral-400 mt-1 block">
                                    Format JPG, PNG, atau WebP. Maksimal 5MB.
                                </span>
                            </div>

                            <div>
                                <label className="font-bold block mb-1">Atau Masukkan URL Gambar (Opsional)</label>
                                <input
                                    type="text"
                                    placeholder="https://... atau kosongkan jika mengunggah file di atas"
                                    value={createForm.data.image}
                                    onChange={(e) => createForm.setData('image', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                <div>
                                    <label className="font-bold block mb-1">Urutan Tampil</label>
                                    <input
                                        type="number"
                                        value={createForm.data.sort_order}
                                        onChange={(e) => createForm.setData('sort_order', parseInt(e.target.value, 10) || 0)}
                                        className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700"
                                    />
                                </div>
                                <div className="flex items-center pt-5">
                                    <label className="flex items-center gap-2 cursor-pointer font-semibold">
                                        <input
                                            type="checkbox"
                                            checked={createForm.data.is_active}
                                            onChange={(e) => createForm.setData('is_active', e.target.checked)}
                                            className="w-4 h-4 accent-accent-copper rounded"
                                        />
                                        <span>Tampilkan di Galeri</span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateOpen(false)}
                                    className="px-4 py-2 rounded-xl font-semibold bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={createForm.processing}
                                    className="px-5 py-2 rounded-xl font-bold bg-accent-copper hover:bg-accent-copper/90 text-white shadow-sm disabled:opacity-50"
                                >
                                    {createForm.processing ? 'Menyimpan...' : 'Upload & Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Edit Gambar */}
            {editingItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
                    <div className="relative w-full max-w-lg bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-neutral-800">
                            <div>
                                <h3 className="font-bold text-sm sm:text-base text-neutral-900 dark:text-neutral-100">
                                    Edit Gambar Galeri 3D
                                </h3>
                                <p className="text-[11px] text-neutral-500">
                                    Ganti foto atau perbarui urutan tampil pada formasi helix.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setEditingItem(null)}
                                className="p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleUpdateItem} className="p-6 overflow-y-auto space-y-4 text-xs">
                            {editingItem.image && (
                                <div>
                                    <label className="font-bold block mb-1">Foto Saat Ini</label>
                                    <div className="w-28 h-20 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800">
                                        <img src={editingItem.image} alt="Foto saat ini" className="w-full h-full object-cover" />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="font-bold block mb-1">Ganti Foto / Gambar (Rasio 4:3)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => editForm.setData('image_file', e.target.files?.[0] || null)}
                                    className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 file:mr-3 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-accent-copper file:text-white"
                                />
                            </div>

                            <div>
                                <label className="font-bold block mb-1">Atau URL Gambar Eksternal</label>
                                <input
                                    type="text"
                                    value={editForm.data.image}
                                    onChange={(e) => editForm.setData('image', e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                <div>
                                    <label className="font-bold block mb-1">Urutan Tampil</label>
                                    <input
                                        type="number"
                                        value={editForm.data.sort_order}
                                        onChange={(e) => editForm.setData('sort_order', parseInt(e.target.value, 10) || 0)}
                                        className="w-full px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700"
                                    />
                                </div>
                                <div className="flex items-center pt-5">
                                    <label className="flex items-center gap-2 cursor-pointer font-semibold">
                                        <input
                                            type="checkbox"
                                            checked={editForm.data.is_active}
                                            onChange={(e) => editForm.setData('is_active', e.target.checked)}
                                            className="w-4 h-4 accent-accent-copper rounded"
                                        />
                                        <span>Tampilkan di Galeri</span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                                <button
                                    type="button"
                                    onClick={() => setEditingItem(null)}
                                    className="px-4 py-2 rounded-xl font-semibold bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={editForm.processing}
                                    className="px-5 py-2 rounded-xl font-bold bg-accent-copper hover:bg-accent-copper/90 text-white shadow-sm disabled:opacity-50"
                                >
                                    {editForm.processing ? 'Menyimpan...' : 'Perbarui Gambar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Hapus Gambar */}
            {deletingItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
                    <div className="relative w-full max-w-md bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6 space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/50 flex items-center justify-center text-red-600 dark:text-red-400 mx-auto">
                            <Trash2 className="w-6 h-6" />
                        </div>
                        <div className="text-center space-y-1.5">
                            <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100">
                                Hapus Gambar dari Galeri?
                            </h3>
                            <p className="text-xs text-neutral-500 leading-relaxed">
                                Apakah Anda yakin ingin menghapus gambar ini dari galeri 3D helix?
                            </p>
                        </div>
                        <div className="flex items-center gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setDeletingItem(null)}
                                className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleDeleteItem}
                                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-sm transition-all"
                            >
                                Ya, Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Preview Gambar */}
            {previewImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md cursor-pointer"
                    onClick={() => setPreviewImage(null)}
                >
                    <div className="relative max-w-3xl max-h-[85vh] rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
                        <img src={previewImage} alt="Preview" className="w-full h-full object-contain" />
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
