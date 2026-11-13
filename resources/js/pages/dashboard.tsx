import { Head, Link } from '@inertiajs/react';
import { Film, ShoppingBag, Eye, ArrowUpRight } from 'lucide-react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { dashboard } from '@/routes';

export default function Dashboard() {
    return (
        <>
            <Head title="Dashboard - Alat Kopi Malang Admin" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {/* Video Reels Card */}
                    <div className="relative overflow-hidden rounded-2xl border border-sidebar-border bg-white dark:bg-neutral-900 p-5 shadow-xs flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                            <div className="w-10 h-10 rounded-xl bg-accent-copper/15 flex items-center justify-center text-accent-copper">
                                <Film className="w-5 h-5" />
                            </div>
                            <Link
                                href="/dashboard/reels"
                                className="w-8 h-8 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 flex items-center justify-center text-neutral-700 dark:text-neutral-300 transition-colors"
                            >
                                <ArrowUpRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="mt-4 space-y-1">
                            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                                Video Reels
                            </h3>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                Kelola judul, deskripsi, video, dan thumbnail reels yang tampil di Beranda.
                            </p>
                        </div>
                        <div className="pt-4 mt-2 border-t border-neutral-100 dark:border-neutral-800">
                            <Link
                                href="/dashboard/reels"
                                className="text-xs font-bold text-accent-copper hover:underline flex items-center gap-1"
                            >
                                <span>Buka Pengaturan Reels</span>
                                <ArrowUpRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </div>

                    {/* Halaman Publik Card */}
                    <div className="relative overflow-hidden rounded-2xl border border-sidebar-border bg-white dark:bg-neutral-900 p-5 shadow-xs flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-600">
                                <Eye className="w-5 h-5" />
                            </div>
                            <a
                                href="/"
                                target="_blank"
                                rel="noreferrer"
                                className="w-8 h-8 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 flex items-center justify-center text-neutral-700 dark:text-neutral-300 transition-colors"
                            >
                                <ArrowUpRight className="w-4 h-4" />
                            </a>
                        </div>
                        <div className="mt-4 space-y-1">
                            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                                Website Publik
                            </h3>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                Kunjungi tampilan website publik Alat Kopi Malang secara langsung.
                            </p>
                        </div>
                        <div className="pt-4 mt-2 border-t border-neutral-100 dark:border-neutral-800">
                            <a
                                href="/"
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1"
                            >
                                <span>Lihat Beranda Publik</span>
                                <ArrowUpRight className="w-3.5 h-3.5" />
                            </a>
                        </div>
                    </div>

                    {/* Katalog Produk Card */}
                    <div className="relative overflow-hidden rounded-2xl border border-sidebar-border bg-white dark:bg-neutral-900 p-5 shadow-xs flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                            <div className="w-10 h-10 rounded-xl bg-brand-800/15 flex items-center justify-center text-brand-800 dark:text-brand-300">
                                <ShoppingBag className="w-5 h-5" />
                            </div>
                            <a
                                href="/shop"
                                target="_blank"
                                rel="noreferrer"
                                className="w-8 h-8 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 flex items-center justify-center text-neutral-700 dark:text-neutral-300 transition-colors"
                            >
                                <ArrowUpRight className="w-4 h-4" />
                            </a>
                        </div>
                        <div className="mt-4 space-y-1">
                            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                                Katalog Biji Kopi
                            </h3>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                Seluruh lini biji kopi lereng Kawi, filter beans, dan espresso houseblend.
                            </p>
                        </div>
                        <div className="pt-4 mt-2 border-t border-neutral-100 dark:border-neutral-800">
                            <a
                                href="/shop"
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs font-bold text-brand-800 dark:text-brand-300 hover:underline flex items-center gap-1"
                            >
                                <span>Buka Katalog Kopi</span>
                                <ArrowUpRight className="w-3.5 h-3.5" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="relative min-h-[50vh] flex-1 overflow-hidden rounded-2xl border border-sidebar-border/70 p-6 bg-white dark:bg-neutral-900 flex flex-col justify-between">
                    <div className="space-y-2">
                        <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                            Selamat Datang di Panel Admin Alat Kopi Malang
                        </h2>
                        <p className="text-xs sm:text-sm text-neutral-500 max-w-xl leading-relaxed">
                            Gunakan menu di sidebar kiri atau kartu pintasan di atas untuk mengelola konten website seperti Video Reels (menambah, mengubah judul & deskripsi, serta menghapus video).
                        </p>
                    </div>
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/10 dark:stroke-neutral-100/10 pointer-events-none" />
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
