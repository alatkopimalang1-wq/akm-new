# 04: Migrasi Storefront React 19 ke Inertia.js dengan Server Hydration & WhatsApp Checkout

**What to build:** Pelanggan storefront menikmati pengalaman belanja interaktif lengkap AKM yang di-render langsung dari Laravel melalui Inertia React 19: slider banner dinamis, filter kategori alat kopi, pencarian live, modal detail produk dengan galeri gambar, keranjang belanja interaktif, dan checkout instan via link WhatsApp concierge.

**Blocked by:** 03: Filament 5 Content & Store Management: Hero Banners, Showroom, dan Setting Toko

**Status:** resolved

- [x] Controller publik Laravel (`HomeController`, `ShopController`, `ShowroomController`) mengirim data produk, kategori, hero banner, dan pengaturan toko via Inertia props.
- [x] Migrasi komponen React 19 ke struktur `resources/js/Pages/` (`Welcome.tsx`, `Shop.tsx`, `ProductDetail.tsx`, `Showroom.tsx`).
- [x] Fitur pencarian produk berbasis input teks dengan filtering responsif kategori alat (Manual Brew, Grinder, Espresso, dll).
- [x] Modal spesifikasi detail produk alat kopi dengan galeri foto, status stok, dan tombol tambah ke keranjang.
- [x] Shopping cart drawer dengan kalkulasi subtotal dan tombol "Checkout via WhatsApp" yang otomatis memformat rincian barang, harga, dan nomor WhatsApp toko dari tabel setting.

## Resolution
Komponen React 19 telah terintegrasi penuh dengan Inertia.js. HomeController dan ShopController menyuplai props produk, banner, kategori, dan setting toko. Fitur katalog, detail produk, galeri, modal, dan cart drawer dengan checkout WhatsApp selesai dibuat dan terkompilasi bersih via Vite.

