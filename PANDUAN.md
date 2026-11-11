# PANDUAN PENGGUNAAN & PENGELOLAAN WEBSITE ALAT KOPI MALANG (AKM)
*Partner Showroom Resmi Sanubari Roastery*

Dokumentasi ini menjelaskan cara menjalankan, mengelola produk, mengganti kontak/alamat, serta mengunggah website ke internet (hosting).

---

## 1. Cara Menjalankan Website di Komputer

### Cara Paling Mudah (Sekali Klik):
1. Buka folder `E:\AKM NEW` di Windows File Explorer.
2. Klik ganda (double-click) file **`JALANKAN_WEB.bat`**.
3. Browser akan otomatis terbuka ke alamat `http://localhost:5173` dan server langsung aktif.
*(Jangan tutup jendela terminal hitam selama website sedang dibuka).*

### Cara Lewat Terminal / PowerShell:
```powershell
cd "e:\AKM NEW"
npm.cmd run dev
```
Lalu buka browser ke: **`http://localhost:5173`**

---

## 2. Struktur File & Lokasi Pengaturan

| Lokasi File | Fungsi |
| :--- | :--- |
| **`src/data/products.js`** | **Pusat Data:** Tambah/edit produk, kategori, harga, foto, stok, kontak WhatsApp, alamat toko, dan link sosmed. |
| **`src/pages/CategoryPage.jsx`** | Halaman khusus terpisah untuk setiap kategori (`/kategori/:slug`). |
| **`src/pages/ProductDetailPage.jsx`** | Halaman khusus terpisah untuk setiap produk (`/product/:slug`). |
| **`src/pages/OrderTrackingPage.jsx`** | Halaman lacak status pengiriman pesanan (`/lacak-pesanan`). |
| **`src/pages/BrewGuidesPage.jsx`** | Halaman resep & panduan seduh resmi barista Sanubari (`/panduan-seduh`). |
| **`src/pages/WholesalePage.jsx`** | Halaman kemitraan kedai & pengadaan grosir (`/wholesale`). |
| **`src/data/brewGuides.js`** | Data rumus kalkulator seduh (V60, AeroPress, Kalita, Lever Espresso, French Press). |
| **`src/components/Navbar.jsx`** | Header navigasi, logo Sanubari Roastery, Kategori mega menu, live search bar, lonceng notifikasi (4), keranjang (2), & profil "Winda". |
| **`src/components/Hero.jsx`** | Banner utama atas, tagline, trust badge, dan tombol pintasan kategori terpisah. |
| **`src/components/SpotlightProduct.jsx`** | Banner sorotan produk unggulan bulan ini (Flair 58). |
| **`src/components/BrewCalculator.jsx`** | Fitur interaktif kalkulator rasio kopi & rekomendasi alat seduh. |
| **`src/components/GrinderClickChartModal.jsx`** | Tabel referensi setelan klik grinder (Timemore & Kingrinder). |
| **`src/components/CartDrawer.jsx`** | Keranjang belanja, voucher promo (`SANUBARI10`), & checkout WhatsApp / online. |
| **`src/components/ShowroomSection.jsx`** | Informasi kunjungan showroom Slow Bar di Ruko Tlogomas Square Malang. |
| **`src/components/FAQSection.jsx`** | Pertanyaan & jawaban seputar garansi, packing, dan servis. |
| **`src/components/Footer.jsx`** | Footer website yang disamakan dengan layout Sanubari Roastery. |

---

## 3. Daftar Halaman & Tautan Penting (Direct Links)

Website ini sudah dilengkapi sistem routing lengkap:

1. **Halaman Kategori Produk:**
   - Manual Brew: `/kategori/manual-brew`
   - Grinder Kopi: `/kategori/grinder`
   - Espresso & Lever: `/kategori/espresso-tools`
   - Kettle Leher Angsa: `/kategori/kettle`
   - Timbangan Digital: `/kategori/scale`
   - Aksesoris & Filter: `/kategori/accessories`
   - Paket Starter Kit: `/kategori/bundles`
   - Filter Beans: `/kategori/filter-beans`
   - Espresso Beans: `/kategori/espresso-beans`
   - Semua Alat: `/kategori/all`

2. **Halaman Detail Produk:**
   - Contoh: `/product/flair-58-plus`
   - Contoh: `/product/timemore-chestnut-c3s-pro`
   - Setiap produk memiliki tombol *"Bagikan Link"* untuk copy URL instan.

3. **Halaman Khusus Lainnya:**
   - Lacak Pesanan: `/lacak-pesanan`
   - Panduan Seduh Barista: `/panduan-seduh`
   - Kemitraan Kedai (Wholesale): `/wholesale`

---

## 3. Cara Mengubah Informasi Toko & WhatsApp

Buka file `src/data/products.js`, cari bagian paling bawah `STORE_INFO`:

```javascript
export const STORE_INFO = {
  brandName: 'Alat Kopi Malang',
  shortName: 'AKM',
  heritage: 'Official Coffee Equipment Store & Showroom Partner of Sanubari Roastery',
  address: 'Ruko Tlogomas Square Kav. 34, Jl. Raya Tlogomas, Lowokwaru, Kota Malang, Jawa Timur 65144',
  whatsappNumber: '6285121930454', // Ganti dengan nomor WhatsApp toko Anda (tanpa tanda + atau spasi)
  whatsappDisplay: '+62 851-2193-0454',
  instagram: 'https://www.instagram.com/sanubari.roastery.mlg/',
  operationalHours: '09.00 – 23.00 WIB (Buka Setiap Hari)',
  freeShippingThreshold: 500000, // Minimal belanja untuk gratis ongkir (Rp 500.000)
  tokopediaStoreUrl: 'https://www.tokopedia.com',
  shopeeStoreUrl: 'https://shopee.co.id',
  googleMapsUrl: 'https://maps.app.goo.gl/PMuxaEtsbEvC4APy7'
};
```

---

## 4. Cara Menambah / Mengedit Produk

Buka file `src/data/products.js`. Setiap produk berbentuk objek seperti contoh berikut:

```javascript
{
  id: 'akm-grinder-c3s',
  name: 'Timemore Chestnut C3S Pro Manual Coffee Grinder',
  brand: 'Timemore',
  category: 'grinder', // Pilihan: 'manual-brew', 'grinder', 'espresso-tools', 'kettle', 'scale', 'accessories', 'bundles'
  badge: 'Best Seller', // Opsional: 'Barista Choice', 'Premium Gear', 'Paket Hemat', dll
  rating: 4.9,
  reviewCount: 142,
  price: 875000, // Harga jual sekarang
  originalPrice: 990000, // Harga coret sebelum diskon (opsional)
  discountPercent: 12, // Persentase diskon
  images: [
    'https://link-gambar-1.jpg',
    'https://link-gambar-2.jpg'
  ],
  tagline: 'Ringkasan singkat keunggulan produk',
  description: 'Deskripsi lengkap produk...',
  specs: {
    'Tipe Burr': '420 Stainless Steel S2C660 38mm',
    'Kapasitas': '25 gram',
    'Material': 'Aluminium Alloy unibody',
    'Garansi': '1 Tahun Garansi Resmi'
  },
  variants: [
    { id: 'v-black', label: 'Matte Black', inStock: true },
    { id: 'v-silver', label: 'Space Gray', inStock: true }
  ],
  stock: 14
}
```

---

## 5. Cara Deploy / Mengonlinekan Website ke Internet

Agar website bisa diakses dari HP pembeli atau publik tanpa menyalakan komputer lokal:

### Langkah 1: Build File Produksi
Jalankan perintah ini di PowerShell:
```powershell
cd "e:\AKM NEW"
npm.cmd run build
```
Perintah ini akan membuat folder **`dist`** yang berisi file HTML, CSS, dan JavaScript yang sudah dioptimasi dan super cepat.

### Langkah 2: Pilihan Hosting
1. **Vercel / Netlify (Paling Mudah & Gratis):**
   - Buat akun gratis di [vercel.com](https://vercel.com) atau [netlify.com](https://netlify.com).
   - Drag & drop folder `dist` atau hubungkan repositori Git.
   - Hubungkan domain custom Anda (misal `alatkopimalang.co.id` atau subdomain `alatkopi.sanubariroastery.co.id`).
2. **cPanel / Hosting Biasa:**
   - Masuk ke cPanel file manager pada folder `public_html`.
   - Unggah seluruh isi file yang ada di dalam folder `E:\AKM NEW\dist`.

