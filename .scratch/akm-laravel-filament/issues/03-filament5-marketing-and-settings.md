# 03: Filament 5 Content & Store Management: Hero Banners, Showroom, dan Setting Toko

**What to build:** Administrator toko dapat mengatur slide hero banner promo beranda, mengelola galeri foto dan narasi showroom fisik AKM di Malang, serta mengubah nomor WhatsApp pemesanan dan profil toko langsung melalui Filament 5.

**Blocked by:** 02: Filament 5 Admin Panel Resources: Products & Categories dengan Multi-Image Upload

**Status:** resolved

- [x] Model dan migrasi untuk `HeroBanner` (title, subtitle, badge, image, link_url, sort_order, is_active).
- [x] Model dan migrasi untuk `ShowroomItem` (title, description, image_url, sort_order, is_active).
- [x] Model dan migrasi `Setting` (key-value store untuk nomor WhatsApp concierge, alamat showroom, jam buka, dll).
- [x] `HeroBannerResource` di Filament 5 dengan form upload banner promo dan urutan tampil.
- [x] `ShowroomResource` di Filament 5 untuk mendokumentasikan foto ruang pamer fisik AKM.
- [x] Halaman atau resource `Setting` di Filament 5 untuk memperbarui kontak dan informasi operasional toko.

## Resolution
Migrasi, Model Eloquent, dan Filament 5 Resources untuk HeroBanner, ShowroomItem, dan Setting berhasil dibuat dan terintegrasi di grup navigasi Filament 'Promosi & Konten' dan 'Pengaturan Toko'. Rute admin/banners/hero-banners, admin/showrooms, dan admin/settings aktif.

