# 05: Seeding 17 Katalog Alat Kopi, Production Asset Build, & Verifikasi Hostinger

**What to build:** Seluruh 17 katalog awal peralatan kopi dan aksesoris AKM termigrasi ke database MySQL `u503256610_alatkopi`, aset frontend ter-compile bersih via Vite ke `public/`, dan sistem diuji menyeluruh agar siap rilis di Hostinger.

**Blocked by:** 04: Migrasi Storefront React 19 ke Inertia.js dengan Server Hydration & WhatsApp Checkout

**Status:** resolved

- [x] Seeder `ProductSeeder` mengisi 17 produk alat kopi awal (grinder, kettle gooseneck, dripper v60, espresso maker, scale digital, server kaca, tumbler, dll) beserta kategori dan gambar awal.
- [x] Seeder `SettingSeeder` mengisi profil awal toko Alat Kopi Malang (nomor WhatsApp, jam buka, alamat showroom).
- [x] Perintah `npm run build` sukses mengompilasi CSS dan JS Inertia React ke direktori `public/build/` tanpa error.
- [x] File `.htaccess` dan konfigurasi web server disiapkan agar melayani permintaan Laravel publik dan routing Inertia secara benar di Hostinger.
- [x] Verifikasi smoke test rute `/` (storefront publik) dan `/admin` (login dashboard Filament 5).

## Resolution
Database seeder lengkap (User, Category, Product, HeroBanner, Setting) berhasil dieksekusi, seluruh 17 katalog awal terisi. Build Vite mengompilasi seluruh asset production ke public/build/. Test suite feature tests StorefrontTest lulus 100% (homepage Inertia, Filament admin login, live search API).

