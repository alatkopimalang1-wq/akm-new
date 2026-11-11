// Katalog Produk Alat Kopi Malang (AKM) — Curated Specialty Coffee Equipment
// Partner Resmi Showroom Sanubari Roastery, Malang

export const CATEGORIES = [
  { 
    id: 'all', 
    name: 'Semua Produk', 
    slug: 'all',
    icon: 'Sparkles', 
    count: 30,
    tagline: 'Koleksi Lengkap Alat Seduh & Biji Kopi',
    description: 'Seluruh perlengkapan seduh kopi specialty, grinder presisi, mesin lever espresso, serta biji kopi sangrai fresh dari Sanubari Roastery Malang.'
  },
  { 
    id: 'filter-beans', 
    name: 'Filter Beans', 
    slug: 'filter-beans',
    icon: 'Coffee', 
    count: 4,
    tagline: 'Biji Kopi Sangrai Profil Seduh Manual (Filter Roast)',
    description: 'Koleksi biji kopi specialty pilihan Sanubari Roastery dengan profil roasting ringan hingga medium, menonjolkan keasaman buah (acidity) cerah, aroma floral, dan rasa manis alami.'
  },
  { 
    id: 'espresso-beans', 
    name: 'Espresso Beans', 
    slug: 'espresso-beans',
    icon: 'Flame', 
    count: 3,
    tagline: 'Biji Kopi Sangrai Profil Mesin Espresso & Susu',
    description: 'Biji kopi dengan bodi tebal, krema pekat, dan aftertaste cokelat karamel yang seimbang sempurna untuk espresso murni maupun minuman kopi susu (latte, cappuccino).'
  },
  { 
    id: 'manual-brew', 
    name: 'Manual Brew', 
    slug: 'manual-brew',
    icon: 'Coffee', 
    count: 7,
    tagline: 'Dripper Pour Over, Server Kaca & Alat Seduh Lambat',
    description: 'Peralatan seduh seduh manual terkurasi: dari Hario V60 Kasuya Edition, Origami Dripper buatan Jepang, Aeropress Original, hingga server kaca tahan panas.'
  },
  { 
    id: 'grinder', 
    name: 'Grinder Kopi', 
    slug: 'grinder',
    icon: 'Cog', 
    count: 6,
    tagline: 'Hand Grinder Presisi Tinggi dengan Mata Burr CNC',
    description: 'Penggiling kopi manual dengan mata burr baja presisi (Timemore S2C Burr, Kingrinder Heptagonal Burr) untuk partikel gilingan seragam dari espresso hingga cold brew.'
  },
  { 
    id: 'espresso-tools', 
    name: 'Espresso & Lever', 
    slug: 'espresso-tools',
    icon: 'Flame', 
    count: 5,
    tagline: 'Mesin Manual Lever 9-Bar & Aksesoris Barista 58mm',
    description: 'Mesin lever espresso komersial Flair 58, portafilter 58mm bottomless, WDT distribution tool, dan precision tamper untuk hasil ekstraksi espresso terbaik.'
  },
  { 
    id: 'kettle', 
    name: 'Kettle Gooseneck', 
    slug: 'kettle',
    icon: 'Pipette', 
    count: 4,
    tagline: 'Teko Leher Angsa Pengontrol Aliran Air Presisi',
    description: 'Kettle elektrik cerdas dengan kontrol suhu digital dan spout leher angsa ergonomis untuk kecepatan tuangan air yang stabil saat menyeduh pour over.'
  },
  { 
    id: 'scale', 
    name: 'Scale & Timer', 
    slug: 'scale',
    icon: 'Timer', 
    count: 4,
    tagline: 'Timbangan Digital Cerdas dengan Auto-Timer & Flow-Rate',
    description: 'Timbangan barista akurasi 0.1 gram dengan sensor respon cepat, mode auto-tare, dan indikator laju aliran air untuk hasil seduhan konsisten setiap hari.'
  },
  { 
    id: 'accessories', 
    name: 'Aksesoris & Filter', 
    slug: 'accessories',
    icon: 'Filter', 
    count: 5,
    tagline: 'Kertas Filter Berkualitas Tinggi & Perlengkapan Perawatan',
    description: 'Kertas filter Cafec Abaca, Hario Misarashi, brush pembersih burr, bellows silikon, dan dosing cup pelengkap rutinitas seduh kopi harianmu.'
  },
  { 
    id: 'bundles', 
    name: 'Paket Starter Kit', 
    slug: 'bundles',
    icon: 'PackageCheck', 
    count: 4,
    tagline: 'Set Lengkap Barista Rumah Siap Seduh (+ Bonus Biji Kopi)',
    description: 'Paket hemat starter pack perlengkapan seduh lengkap dengan harga khusus, sudah termasuk bonus 100g Freshly Roasted Coffee Beans dari Sanubari Roastery.'
  }
];

export const BRANDS = [
  'Semua Brand',
  'Sanubari Roastery',
  'Timemore',
  'Hario',
  'Fellow',
  'Kingrinder',
  'Flair Espresso',
  'Cafec',
  'Acaia',
  'AKM Signature'
];

export const PRODUCTS = [
  {
    id: 'akm-grinder-c3s',
    name: 'Timemore Chestnut C3S Pro Manual Coffee Grinder',
    brand: 'Timemore',
    category: 'grinder',
    slug: 'timemore-chestnut-c3s-pro',
    badge: 'Best Seller',
    rating: 4.9,
    reviewCount: 142,
    price: 875000,
    originalPrice: 990000,
    discountPercent: 12,
    images: [
      'https://images.unsplash.com/photo-1589396575653-c09c794ff6a6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80'
    ],
    tagline: 'S2C 660 Stainless Steel Conical Burr dengan Foldable Crank Handle',
    description: 'Grinder manual generasi terbaru dengan mata burr Spike to Cut (S2C 660) berbahan SUS420 stainless steel yang menghasilkan gilingan seragam dengan fines minimal. Dilengkapi handle lipat paten Timemore yang kokoh dan mudah dibawa bepergian.',
    specs: {
      'Tipe Burr': '420 Stainless Steel S2C660 38mm Conical Burr',
      'Kapasitas': '20 - 25 gram biji kopi',
      'Material Body': 'Aluminium Alloy unibody dengan grip silikon',
      'Handle': 'All-metal Foldable Handle',
      'Penyesuaian': 'Stepped adjustment dial (Cocok Pour Over, Aeropress, French Press, Moka Pot)',
      'Berat': '530 gram',
      'Garansi': '1 Tahun Garansi Resmi'
    },
    variants: [
      { id: 'v-c3s-black', label: 'Matte Black', inStock: true },
      { id: 'v-c3s-silver', label: 'Space Gray', inStock: true },
      { id: 'v-c3s-green', label: 'Forest Green', inStock: false }
    ],
    isFeatured: true,
    isNew: false,
    stock: 14,
    tokopediaUrl: 'https://tokopedia.com',
    shopeeUrl: 'https://shopee.co.id'
  },
  {
    id: 'akm-dripper-v60-ceramic',
    name: 'Hario V60 Ceramic Dripper 02 Kasuya Model',
    brand: 'Hario',
    category: 'manual-brew',
    slug: 'hario-v60-kasuya-ceramic',
    badge: 'Barista Choice',
    rating: 5.0,
    reviewCount: 98,
    price: 365000,
    originalPrice: 420000,
    discountPercent: 13,
    images: [
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80'
    ],
    tagline: 'Desain Khas Tetsu Kasuya (World Brewers Cup 2016 Champion)',
    description: 'Kolaborasi Hario dengan juara dunia seduh manual Tetsu Kasuya. Didesain dengan alur spiral modifikasi yang memperlambat ekstraksi air kopi untuk metode 4:6 yang legendaris, menghasilkan ekstraksi body lebih tebal dan aroma maksimal.',
    specs: {
      'Material': 'Arita-yaki Ceramic Made in Japan',
      'Kapasitas': '1 - 4 Cups (Ukuran 02)',
      'Warna': 'Matte Black Ceramic Special Kasuya Edition',
      'Kompatibilitas Filter': 'Kertas Filter V60 Ukuran 02',
      'Perawatan': 'Aman dishwasher & suhu air hingga 120°C',
      'Garansi': 'Asli 100% Impor Jepang'
    },
    variants: [
      { id: 'v-kasuya-02', label: 'Size 02 Matte Black', inStock: true }
    ],
    isFeatured: true,
    isNew: false,
    stock: 22,
    tokopediaUrl: 'https://tokopedia.com',
    shopeeUrl: 'https://shopee.co.id'
  },
  {
    id: 'akm-kettle-fellow-stagg',
    name: 'Fellow Stagg EKG Electric Gooseneck Kettle 0.9L',
    brand: 'Fellow',
    category: 'kettle',
    slug: 'fellow-stagg-ekg-electric-kettle',
    badge: 'Premium Gear',
    rating: 4.9,
    reviewCount: 76,
    price: 2950000,
    originalPrice: 3200000,
    discountPercent: 8,
    images: [
      'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80'
    ],
    tagline: 'Variable Temperature Control Kettle dengan LCD Screen & PID Controller',
    description: 'Kettle pour-over standar kompetisi internasional. Spout presisi gooseneck yang memberikan kontrol aliran air seimbang tanpa tumpah. Dilengkapi fitur penahan suhu (Hold Mode) selama 60 menit dan stopwatch seduh terintegrasi.',
    specs: {
      'Kapasitas': '0.9 Liter (30 oz)',
      'Daya Listrik': '1200 Watt fast heating',
      'Rentang Suhu': '40°C - 100°C (104°F - 212°F)',
      'Kontrol Suhu': 'PID Controller presisi per 1 derajat Celsius',
      'Display': 'High resolution LCD screen display',
      'Material': '304 Stainless Steel Body, Ergonomic Counterbalanced Handle',
      'Garansi': '1 Tahun Garansi Resmi Distributor'
    },
    variants: [
      { id: 'v-fellow-black', label: 'Matte Black', inStock: true },
      { id: 'v-fellow-white', label: 'Matte White', inStock: true },
      { id: 'v-fellow-copper', label: 'Polished Copper (Wood Edition)', inStock: true }
    ],
    isFeatured: true,
    isNew: true,
    stock: 6,
    tokopediaUrl: 'https://tokopedia.com',
    shopeeUrl: 'https://shopee.co.id'
  },
  {
    id: 'akm-scale-timemore-blackmirror',
    name: 'Timemore Black Mirror Basic 2 Smart Coffee Scale',
    brand: 'Timemore',
    category: 'scale',
    slug: 'timemore-black-mirror-basic-2',
    badge: 'Terpopuler',
    rating: 4.9,
    reviewCount: 210,
    price: 585000,
    originalPrice: 650000,
    discountPercent: 10,
    images: [
      'https://images.unsplash.com/photo-1518057111178-44a106bad636?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509785307050-d4066910ec1e?auto=format&fit=crop&w=800&q=80'
    ],
    tagline: 'Timbangan Kopi Digital Presisi 0.1g dengan Indikator Flow Rate Air Real-time',
    description: 'Timbangan seduh kopi paling diandalkan barista. Memiliki sensor super responsif, auto-timer saat air mulai dituangkan, dan fitur teranyar Flow-Rate Indicator (kecepatan tuang g/s) untuk menyempurnakan konsistensi pour over.',
    specs: {
      'Akurasi': '0.1 gram (Rentang ukur 0.5g - 2000g)',
      'Fitur Utama': 'Real-time Flow Rate Display, Auto Timer, Auto Tare',
      'Baterai': 'Lithium Rechargeable 1600mAh (Type-C Charging)',
      'Ketahanan': 'Water-resistant surface + Silicone heat pad protector',
      'Dimensi': '152 mm x 130 mm x 26 mm',
      'Garansi': '1 Tahun Garansi Resmi'
    },
    variants: [
      { id: 'v-bm2-black', label: 'Stealth Black', inStock: true },
      { id: 'v-bm2-white', label: 'Pure White', inStock: true }
    ],
    isFeatured: true,
    isNew: false,
    stock: 18,
    tokopediaUrl: 'https://tokopedia.com',
    shopeeUrl: 'https://shopee.co.id'
  },
  {
    id: 'akm-flair-58',
    name: 'Flair 58 Lever Espresso Maker with Preheated Brew Head',
    brand: 'Flair Espresso',
    category: 'espresso-tools',
    slug: 'flair-58-lever-espresso-maker',
    badge: 'Barista Grade',
    rating: 5.0,
    reviewCount: 38,
    price: 8900000,
    originalPrice: 9500000,
    discountPercent: 6,
    images: [
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=800&q=80'
    ],
    tagline: 'Mesin Espresso Manual Standar Komersial 58mm Portafilter dengan Electric Preheating',
    description: 'Puncak mesin espresso manual rumahan dan kedai slow bar. Menggunakan portafilter komersial ukuran 58mm, tuas ergonomis panjang untuk profil tekanan 9-bar konsisten, dan pemanas elektrik brew head 3-tingkat suhu.',
    specs: {
      'Ukuran Portafilter': 'Standar Komersial 58mm (Wood handle naked included)',
      'Tekanan': 'Hingga 12 Bar (Dilengkapi Pressure Gauge Analog)',
      'Preheating': 'Electric Preheat Controller (Low 85°C, Med 90°C, High 95°C)',
      'Material': 'Cast Aluminum & Stainless Steel Frame',
      'Kapasitas Air': '90 ml Cylinder Chamber',
      'Garansi': '1 Tahun Garansi Resmi Flair Indonesia'
    },
    variants: [
      { id: 'v-flair58-base', label: 'Flair 58 Standard Edition', inStock: true },
      { id: 'v-flair58-plus', label: 'Flair 58+ Walnut Edition', inStock: true }
    ],
    isFeatured: true,
    isNew: true,
    stock: 4,
    tokopediaUrl: 'https://tokopedia.com',
    shopeeUrl: 'https://shopee.co.id'
  },
  {
    id: 'akm-dripper-origami-air',
    name: 'ORIGAMI Dripper Air S Series & Resin Base Set',
    brand: 'AKM Signature',
    category: 'manual-brew',
    slug: 'origami-dripper-air-s-set',
    badge: 'Best Design',
    rating: 4.8,
    reviewCount: 89,
    price: 295000,
    originalPrice: 340000,
    discountPercent: 13,
    images: [
      'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80'
    ],
    tagline: '20-Ribbed AS Resin Dripper, Kompatibel Kertas Kerucut (Conical) & Wave',
    description: 'Dripper berdesain origami lipatan kertas asal Jepang berbahan AS Resin food-grade yang tahan benturan dan menjaga retensi suhu air seduh lebih stabil dibanding keramik. Bisa memakai filter V60 maupun Kalita Wave.',
    specs: {
      'Material': 'AS Resin Food Grade (BPA Free)',
      'Kapasitas': '1 - 2 Cups (Ukuran S)',
      'Kelengkapan': 'Dripper + Wooden / Resin Ring Base Holder',
      'Fitur': '20 sirip simetris untuk aliran aerasi dan ekstraksi merata',
      'Asal': 'Made in Japan'
    },
    variants: [
      { id: 'v-ori-matte-black', label: 'Matte Charcoal', inStock: true },
      { id: 'v-ori-amber', label: 'Warm Amber', inStock: true },
      { id: 'v-ori-clear', label: 'Crystal Clear', inStock: true }
    ],
    isFeatured: true,
    isNew: false,
    stock: 25,
    tokopediaUrl: 'https://tokopedia.com',
    shopeeUrl: 'https://shopee.co.id'
  },
  {
    id: 'akm-grinder-kingrinder-k6',
    name: 'KINGrinder K6 Hand Coffee Grinder 48mm Hexagonal Burr',
    brand: 'Kingrinder',
    category: 'grinder',
    slug: 'kingrinder-k6-hand-grinder',
    badge: 'Espresso Ready',
    rating: 4.9,
    reviewCount: 64,
    price: 1450000,
    originalPrice: 1650000,
    discountPercent: 12,
    images: [
      'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1589396575653-c09c794ff6a6?auto=format&fit=crop&w=800&q=80'
    ],
    tagline: 'All-Rounder Grinder dengan 48mm Heptagonal Burr & External Adjustment (16um/click)',
    description: 'Juara gilingan all-rounder di kelasnya! Menggunakan burr baja stainless heptagonal 48mm dengan dial pengaturan klik di luar bodi (external adjustment ring) memudahkan perpindahan grind size dari Turkish, Espresso, hingga French Press.',
    specs: {
      'Tipe Burr': '48mm Heptagonal Stainless Steel Burr (K-Burr profile)',
      'Micro-Adjustment': '16 mikron per klik (60 klik per rotasi)',
      'Kapasitas': '30 - 35 gram biji kopi',
      'Kompatibilitas Bor': 'Dapat dipasangi bor listrik tanpa adapter tambahan',
      'Berat': '645 gram'
    },
    variants: [
      { id: 'v-k6-gray', label: 'Titanium Gray', inStock: true }
    ],
    isFeatured: false,
    isNew: true,
    stock: 9,
    tokopediaUrl: 'https://tokopedia.com',
    shopeeUrl: 'https://shopee.co.id'
  },
  {
    id: 'akm-bundle-starter-pourover',
    name: 'AKM Home Barista Pour Over Master Kit (5-in-1)',
    brand: 'AKM Signature',
    category: 'bundles',
    slug: 'akm-starter-kit-pourover',
    badge: 'Paket Hemat',
    rating: 5.0,
    reviewCount: 115,
    price: 1490000,
    originalPrice: 1850000,
    discountPercent: 19,
    images: [
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80'
    ],
    tagline: 'Set Lengkap Seduh V60: Grinder C3S + Dripper + Server + Timbangan + Filter Paper',
    description: 'Paket terlengkap untuk kamu yang ingin mulai menyeduh kopi specialty di rumah layaknya barista Sanubari Roastery. Sudah termasuk biji kopi pilihan Sanubari Kawi Series 100g gratis!',
    specs: {
      'Isi Paket': '1x Timemore C3S Grinder, 1x Hario V60 02 Dripper, 1x Heatproof Glass Server 600ml, 1x Digital Timer Scale 0.1g, 1x Cafec Abaca 02 Filter (100 sheets), 1x Bonus Sanubari Roastery Coffee Beans 100g',
      'Garansi': '1 Tahun Garansi Part Grinder & Scale',
      'Packaging': 'Premium AKM Kraft Gift Box with Foam Protection'
    },
    variants: [
      { id: 'v-bundle-black', label: 'All Matte Black Set', inStock: true },
      { id: 'v-bundle-clear', label: 'Modern Clear Glass Set', inStock: true }
    ],
    isFeatured: true,
    isNew: false,
    stock: 12,
    tokopediaUrl: 'https://tokopedia.com',
    shopeeUrl: 'https://shopee.co.id'
  },
  {
    id: 'akm-kettle-timemore-fish',
    name: 'Timemore Fish Smart Electric Kettle 800ml',
    brand: 'Timemore',
    category: 'kettle',
    slug: 'timemore-fish-smart-electric-kettle',
    badge: 'Popular Choice',
    rating: 4.8,
    reviewCount: 94,
    price: 1280000,
    originalPrice: 1450000,
    discountPercent: 11,
    images: [
      'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1589396575653-c09c794ff6a6?auto=format&fit=crop&w=800&q=80'
    ],
    tagline: '90-degree Vertical Water Flow dengan Touch Slide Temp Controller',
    description: 'Kettle pemanas air pintar dengan cerat gooseneck berpaten yang menghasilkan kucuran air 90 derajat stabil tegak lurus. Pengaturan suhu responsif dengan mengusap jari (slide touch) pada alas kettle.',
    specs: {
      'Kapasitas': '800 ml',
      'Daya': '1000 Watt',
      'Kontrol': 'Slide touch temperature adjust',
      'Material': '304 Food Grade Stainless Steel & Tebal 3 Lapis',
      'Fitur': 'Dry-boil protection, Keep Warm Mode 1 Jam'
    },
    variants: [
      { id: 'v-fish-black', label: 'Matte Black', inStock: true },
      { id: 'v-fish-white', label: 'Matte White', inStock: true }
    ],
    isFeatured: false,
    isNew: false,
    stock: 11,
    tokopediaUrl: 'https://tokopedia.com',
    shopeeUrl: 'https://shopee.co.id'
  },
  {
    id: 'akm-filter-cafec-abaca',
    name: 'Cafec Abaca Filter Paper V60 Cone Shaped 100 Sheets',
    brand: 'Cafec',
    category: 'accessories',
    slug: 'cafec-abaca-filter-paper-v60',
    badge: 'Must Have',
    rating: 5.0,
    reviewCount: 312,
    price: 68000,
    originalPrice: 75000,
    discountPercent: 9,
    images: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80'
    ],
    tagline: 'Kertas Saring Ramah Lingkungan Berbahan Serat Pohon Pisang Manila (Abaca)',
    description: 'Filter paper favorit roaster dan barista dunia karena daya saring pori-pori yang sangat konsisten, bebas bau kayu/klorin, dan menghasilkan clean cup dengan rasa manis yang menonjol.',
    specs: {
      'Material': 'Non-wood Manila Hemp (Abaca) & Wood Pulp',
      'Isi': '100 lembar per pack',
      'Ukuran': '02 (Cocok untuk dripper 1-4 cups V60 / Origami / Kono)',
      'Produksi': 'Made in Oita, Japan'
    },
    variants: [
      { id: 'v-cafec-01', label: 'Ukuran 01 (1-2 Cups)', inStock: true },
      { id: 'v-cafec-02', label: 'Ukuran 02 (2-4 Cups)', inStock: true }
    ],
    isFeatured: false,
    isNew: false,
    stock: 80,
    tokopediaUrl: 'https://tokopedia.com',
    shopeeUrl: 'https://shopee.co.id'
  },
  {
    id: 'akm-wdt-distribution-tool',
    name: 'AKM Precision WDT Tool 0.35mm Needle with Stand',
    brand: 'AKM Signature',
    category: 'espresso-tools',
    slug: 'akm-precision-wdt-tool',
    badge: 'Essential',
    rating: 4.9,
    reviewCount: 168,
    price: 95000,
    originalPrice: 120000,
    discountPercent: 20,
    images: [
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1518057111178-44a106bad636?auto=format&fit=crop&w=800&q=80'
    ],
    tagline: 'Alat Pengurai Gumpalan Bubuk Kopi Espresso untuk Mencegah Channeling',
    description: 'Weiss Distribution Technique (WDT) tool dengan 8 jarum stainless steel bedah berdiameter 0.35mm. Sangat efektif meratakan bubuk kopi di portafilter sehingga ekstraksi espresso merata tanpa semburan channeling.',
    specs: {
      'Jarum': '8 Jarum Medis 304 Stainless Steel (0.35mm round tip)',
      'Handle': 'Solid Anodized Aluminium dengan magnetic stand base',
      'Kelengkapan': 'WDT Tool, Stand Holder, 4x Extra Replacement Needles'
    },
    variants: [
      { id: 'v-wdt-black', label: 'Anodized Black', inStock: true },
      { id: 'v-wdt-walnut', label: 'Walnut Wood Handle', inStock: true }
    ],
    isFeatured: false,
    isNew: false,
    stock: 45,
    tokopediaUrl: 'https://tokopedia.com',
    shopeeUrl: 'https://shopee.co.id'
  },
  {
    id: 'akm-aeropress-original',
    name: 'AeroPress Original Coffee & Espresso Maker Set',
    brand: 'AKM Signature',
    category: 'manual-brew',
    slug: 'aeropress-original-coffee-maker',
    badge: 'Travel Friendly',
    rating: 4.9,
    reviewCount: 180,
    price: 685000,
    originalPrice: 750000,
    discountPercent: 8,
    images: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=800&q=80'
    ],
    tagline: 'Alat Seduh Tekanan Udara Paling Populer di Dunia, Cepat, Ringkas, & Kaya Rasa',
    description: 'AeroPress memadukan perendaman total (immersion) dengan tekanan lembut udara untuk menghasilkan kopi yang pekat tanpa rasa pahit berlebih dalam waktu kurang dari 2 menit. Favorit para traveler dan barista kompetisi.',
    specs: {
      'Material': 'BPA & Phthalates Free Polypropylene Made in USA',
      'Kapasitas': '250 ml (1-3 cups espresso style / americano)',
      'Kelengkapan': 'Chamber, Plunger, Filter Cap, Stirrer, Scoop, 350 pcs Micro-filters'
    },
    variants: [
      { id: 'v-ap-smoke', label: 'Tinted Smoke Grey', inStock: true },
      { id: 'v-ap-clear', label: 'Clear Tritan', inStock: true }
    ],
    isFeatured: false,
    isNew: false,
    stock: 15,
    tokopediaUrl: 'https://tokopedia.com',
    shopeeUrl: 'https://shopee.co.id'
  },
  {
    id: 'snb-nanas-madu',
    name: 'Arabika Nanas Madu Wethulled Co-Ferment 100g',
    brand: 'Sanubari Roastery',
    category: 'filter-beans',
    slug: 'arabika-nanas-madu-wethulled-co-ferment',
    badge: 'Co-Ferment',
    rating: 5.0,
    reviewCount: 88,
    price: 85000,
    originalPrice: 95000,
    discountPercent: 11,
    images: [
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80'
    ],
    tagline: 'Pineapple, Sweet Honey, Lime Acidity, Ginger, Tropical Fruit, Long Sweet',
    description: 'Biji kopi artisan unggulan Sanubari Roastery dari Papandayan Jawa Barat dengan proses inovatif Co-Fermentation bersama sari nanas madu segar. Menghasilkan rasa manis madu yang lembut, keasaman buah tropis cerah, dan aftertaste manis berkepanjangan.',
    specs: {
      'Origin': 'Papandayan, Jawa Barat',
      'Varietal': 'Catimor & Typica',
      'Process': 'Wethulled Co-Ferment',
      'Altitude': '1500 Masl',
      'Roast Level': 'Light to Medium (Filter Roast)',
      'Tasting Notes': 'Pineapple, Sweet Honey, Lime Acidity, Ginger, Brown Sugar'
    },
    variants: [
      { id: 'v-nm-100', label: '100 Gram Biji', inStock: true },
      { id: 'v-nm-200', label: '200 Gram Biji', inStock: true },
      { id: 'v-nm-v60', label: '100g Giling V60', inStock: true }
    ],
    isFeatured: true,
    isNew: true,
    stock: 30,
    tokopediaUrl: 'https://tokopedia.com',
    shopeeUrl: 'https://shopee.co.id'
  },
  {
    id: 'snb-sindoro-plum',
    name: 'Arabika Sindoro Sweet Plum Honey Brew Yeast 100g',
    brand: 'Sanubari Roastery',
    category: 'filter-beans',
    slug: 'arabika-sindoro-sweet-plum-honey-brew-yeast',
    badge: 'Experimental',
    rating: 4.9,
    reviewCount: 62,
    price: 77500,
    originalPrice: 85000,
    discountPercent: 9,
    images: [
      'https://images.unsplash.com/photo-1610632380989-680fe40816c6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80'
    ],
    tagline: 'Purple Plum, Wild Honey, Jasmine Floral, Crisp Apple',
    description: 'Biji kopi eksperimental proses inokulasi ragi (yeast brewing fermentation) dari lereng Gunung Sindoro. Aroma floral melati semerbak berpadu dengan keasaman plum ungu yang menyegarkan.',
    specs: {
      'Origin': 'Gunung Sindoro, Jawa Tengah',
      'Varietal': 'Kartika & Lini S',
      'Process': 'Yeast Inoculation Honey',
      'Altitude': '1600 Masl',
      'Roast Level': 'Light Roast (Filter Special)',
      'Tasting Notes': 'Sweet Plum, Wildflower Honey, Jasmine, Crisp Red Apple'
    },
    variants: [
      { id: 'v-sp-100', label: '100 Gram Biji', inStock: true },
      { id: 'v-sp-200', label: '200 Gram Biji', inStock: true }
    ],
    isFeatured: true,
    isNew: false,
    stock: 25,
    tokopediaUrl: 'https://tokopedia.com',
    shopeeUrl: 'https://shopee.co.id'
  },
  {
    id: 'snb-fine-robusta',
    name: 'Fine Robusta Dampit Malang 250g (Espresso Series)',
    brand: 'Sanubari Roastery',
    category: 'espresso-beans',
    slug: 'fine-robusta-dampit-malang',
    badge: 'Espresso Blend',
    rating: 4.9,
    reviewCount: 195,
    price: 52000,
    originalPrice: 60000,
    discountPercent: 13,
    images: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80'
    ],
    tagline: 'Dark Chocolate, Roasted Hazelnut, Brown Sugar, Ultra Thick Crema',
    description: 'Robusta petik merah kualitas Fine dari perkebunan Dampit, Kabupaten Malang. Diproses dengan sortir ketat zero-defect, menghasilkan crema espresso yang sangat tebal, gurih, dan minim rasa pahit tajam. Sangat digemari untuk bahan dasar Es Kopi Susu kekinian.',
    specs: {
      'Origin': 'Dampit, Malang, Jawa Timur',
      'Process': 'Natural Full Washed',
      'Altitude': '800 - 900 Masl',
      'Roast Level': 'Medium Dark (Espresso Profile)',
      'Cocok Untuk': 'Mesin Espresso, Moka Pot, Vietnam Drip, Es Kopi Susu'
    },
    variants: [
      { id: 'v-fr-250', label: '250 Gram Biji', inStock: true },
      { id: 'v-fr-500', label: '500 Gram Biji', inStock: true },
      { id: 'v-fr-1kg', label: '1 Kilogram (Hemat)', inStock: true }
    ],
    isFeatured: false,
    isNew: false,
    stock: 50,
    tokopediaUrl: 'https://tokopedia.com',
    shopeeUrl: 'https://shopee.co.id'
  },
  {
    id: 'snb-full-arabica-kawi',
    name: 'Full Arabica Gunung Kawi Natural 200g',
    brand: 'Sanubari Roastery',
    category: 'espresso-beans',
    slug: 'full-arabica-gunung-kawi-natural',
    badge: 'Kawi Series',
    rating: 5.0,
    reviewCount: 134,
    price: 75000,
    originalPrice: 85000,
    discountPercent: 12,
    images: [
      'https://images.unsplash.com/photo-1610632380989-680fe40816c6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80'
    ],
    tagline: 'Ripe Strawberry, Brown Sugar, Orange Citrus, Sweet Aftertaste',
    description: 'Koleksi kebanggaan Sanubari Roastery: Jejak Rasa di Gunung Kawi Malang. 100% Arabika proses natural dengan tingkat kematangan optimal. Memberikan aroma stroberi matang, keasaman jeruk manis, dan rasa manis karamel cokelat.',
    specs: {
      'Origin': 'Lereng Gunung Kawi, Malang',
      'Varietal': 'Kartika & USDA',
      'Process': 'Slow Dry Natural',
      'Altitude': '1400 - 1600 Masl',
      'Roast Level': 'Medium (Omni-Roast: Filter & Espresso)'
    },
    variants: [
      { id: 'v-kawi-200', label: '200 Gram Biji', inStock: true },
      { id: 'v-kawi-500', label: '500 Gram Biji', inStock: true }
    ],
    isFeatured: true,
    isNew: false,
    stock: 40,
    tokopediaUrl: 'https://tokopedia.com',
    shopeeUrl: 'https://shopee.co.id'
  },
  {
    id: 'snb-signature-houseblend',
    name: 'Sanubari Signature Houseblend 70:30 (500g)',
    brand: 'Sanubari Roastery',
    category: 'espresso-beans',
    slug: 'sanubari-signature-houseblend-70-30',
    badge: 'Kedai Best Seller',
    rating: 5.0,
    reviewCount: 240,
    price: 115000,
    originalPrice: 130000,
    discountPercent: 11,
    images: [
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80'
    ],
    tagline: '70% Arabika Kawi + 30% Fine Robusta Dampit — Formula Kopi Susu Mantap',
    description: 'Houseblend signature yang dipakai setiap hari di slow bar Sanubari Roastery Malang. Perpaduan body tebal dan crema pekat dari Robusta Dampit dengan rasa manis buah dan aroma floral dari Arabika Kawi.',
    specs: {
      'Komposisi': '70% Arabika Gunung Kawi + 30% Fine Robusta Dampit',
      'Roast Level': 'Medium Dark Roasted',
      'Karakter': 'Bold Body, Low Acidity, Sweet Caramel, Rich Crema',
      'Berat': '500 gram (Kemasan One-Way Valve dengan Ziplock)'
    },
    variants: [
      { id: 'v-hb-500', label: '500 Gram Biji', inStock: true },
      { id: 'v-hb-1kg', label: '1 Kilogram (Kemasan Kedai)', inStock: true }
    ],
    isFeatured: true,
    isNew: false,
    stock: 60,
    tokopediaUrl: 'https://tokopedia.com',
    shopeeUrl: 'https://shopee.co.id'
  }
];

export const STORE_INFO = {
  brandName: 'Alat Kopi Malang',
  shortName: 'AKM',
  heritage: 'Official Coffee Equipment Store & Showroom Partner of Sanubari Roastery',
  address: 'Ruko Tlogomas Square Kav. 34, Jl. Raya Tlogomas, Lowokwaru, Kota Malang, Jawa Timur 65144',
  whatsappNumber: '6285121930454',
  whatsappDisplay: '+62 851-2193-0454',
  instagram: 'https://www.instagram.com/sanubari.roastery.mlg/',
  operationalHours: '09.00 – 23.00 WIB (Buka Setiap Hari)',
  freeShippingThreshold: 500000,
  tokopediaStoreUrl: 'https://www.tokopedia.com',
  shopeeStoreUrl: 'https://shopee.co.id',
  googleMapsUrl: 'https://maps.app.goo.gl/PMuxaEtsbEvC4APy7'
};

