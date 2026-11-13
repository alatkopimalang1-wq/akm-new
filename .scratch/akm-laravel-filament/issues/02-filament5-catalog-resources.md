# 02: Filament 5 Admin Panel Resources: Products & Categories dengan Multi-Image Upload

**What to build:** Administrator toko dapat login ke Filament 5 di `/admin` dan mengelola penuh katalog peralatan kopi (grinder, mesin espresso, manual brew, aksesoris barista) dan kategori alat, lengkap dengan upload galeri foto produk ke storage publik.

**Blocked by:** 01: Fondasi Laravel Terbaru + Filament 5 & Inertia React 19 Foundation

**Status:** resolved

- [x] Model dan migrasi database untuk `Category`, `Product`, dan `ProductImage`.
- [x] Relasi Eloquent: `Product` belongsToMany `Category`, dan `Product` hasMany `ProductImage`.
- [x] `ProductResource` di Filament 5 dengan form input lengkap (nama alat, slug, brand, harga, harga coret/diskon, stok, spesifikasi teknis, toggle flash sale, toggle featured, dan multi-image upload).
- [x] `CategoryResource` di Filament 5 untuk mengelola kategori alat seduh dan barista tools.
- [x] Tabel data Filament 5 mendukung pencarian instan, filter kategori, badge stok, dan preview thumbnail gambar.
- [x] Disk storage dikonfigurasi (`storage:link`) sehingga gambar yang diunggah dapat diakses publik.

## Resolution
Migrasi, Model Eloquent, dan Filament 5 Resource untuk Product dan Category berhasil dibuat. Rute admin/products dan admin/categories aktif di Filament 5 dengan dukungan repeater multi-image upload dan storage link publik terhubung.

