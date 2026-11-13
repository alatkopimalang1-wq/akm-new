@props([
    'images' => [],
    'title' => 'Helical Ribbon Showcase — Jejak Rasa Sanubari',
    'subtitle' => 'Putar dan jelajahi arsip visual lereng Gunung Kawi, proses kurasi sangrai, dan suasana roastery dalam pita spiral 3D interaktif.',
    'badge' => 'Galeri 3D Interaktif • Three.js',
    'height' => 'h-[460px] sm:h-[560px] lg:h-[620px]',
    'autoRotate' => true,
    'autoRotateSpeed' => 0.20,
    'visibleColumns' => 5,
    'tiersCount' => 2,
    'showHeader' => false,
])

@php
    $componentId = 'helix_gallery_' . str_replace('.', '_', uniqid('', true));
    
    $defaultItems = [
        [
            'id' => 'kawi-1',
            'title' => 'Lereng Gunung Kawi',
            'subtitle' => 'Elevasi 1.400 mdpl',
            'category' => 'Single Origin Terroir',
            'badge' => 'Gunung Kawi',
            'description' => 'Tanah vulkanik subur lereng Gunung Kawi Malang, tempat pohon kopi Typica dan Kartika tumbuh alami di bawah naungan pohon pinus dan cemara.',
            'link_url' => '/shop?series=kawi',
            'link_label' => 'Jelajah Kopi Kawi',
        ],
        [
            'id' => 'kawi-2',
            'title' => 'Matahari Terbit Puncak Kawi',
            'subtitle' => 'Panorama 2.851 mdpl',
            'category' => 'Lanskap Alam',
            'badge' => 'Panorama',
            'description' => 'Cahaya fajar menyinari hamparan perkebunan kopi arabika di lereng selatan Malang, menghadirkan suhu mikro ideal untuk pematangan cherry kopi secara lambat.',
            'link_url' => '/kunjungi',
            'link_label' => 'Kunjungi Kebun & Roastery',
        ],
        [
            'id' => 'kawi-3',
            'title' => 'Panen Cherry Merah Pilihan',
            'subtitle' => 'Petik Merah 100%',
            'category' => 'Proses Pasca Panen',
            'badge' => 'Sortasi Ketat',
            'description' => 'Proses seleksi ketat cherry kopi matang sempurna bersama kelompok tani lokal Malang demi memastikan kemanisan brix optimal sebelum proses fermentasi.',
            'link_url' => '/panduan-seduh',
            'link_label' => 'Pelajari Proses',
        ],
        [
            'id' => 'kawi-4',
            'title' => 'Honey & Natural Process',
            'subtitle' => 'Fermentasi Terkontrol',
            'category' => 'Pengolahan Biji',
            'badge' => 'Micro-Lot',
            'description' => 'Pengeringan di atas raised bed dengan sirkulasi udara pegunungan segar untuk mengunci karakter rasa buah tropis, madu hutan, dan keasaman sitrus yang cerah.',
            'link_url' => '/shop?series=honey',
            'link_label' => 'Beli Kopi Honey',
        ],
        [
            'id' => 'kawi-5',
            'title' => 'Sanubari Roastery Lab',
            'subtitle' => 'Tlogomas Square Malang',
            'category' => 'Roasting & Cupping',
            'badge' => 'Roaster Lab',
            'description' => 'Laboratorium sangrai modern tempat profiling kurva sangrai dikembangkan secara presisi demi menonjolkan potensi terbaik setiap lot biji kopi.',
            'link_url' => '/roasting',
            'link_label' => 'Lihat Layanan Roasting',
        ],
        [
            'id' => 'kawi-6',
            'title' => 'Sensory Cupping Table',
            'subtitle' => 'SCA Protocol Standard',
            'category' => 'Kalibrasi Rasa',
            'badge' => 'Sensory Lab',
            'description' => 'Sesi cupping berkala setiap pekan untuk mengevaluasi konsistensi profil rasa, aroma, sweetness, dan body sebelum disajikan kepada penikmat kopi.',
            'link_url' => '/acara',
            'link_label' => 'Ikuti Sesi Cupping',
        ],
        [
            'id' => 'kawi-7',
            'title' => 'Slow Bar Experience',
            'subtitle' => 'Seduhan Manual Presisi',
            'category' => 'Pengalaman Rasa',
            'badge' => 'Slow Bar',
            'description' => 'Ruang santai berdiskusi rasa, mencicipi pour over V60, Origami, atau Aeropress dengan rasio dan temperatur air yang dikalibrasi harian.',
            'link_url' => '/kunjungi',
            'link_label' => 'Reservasi Slow Bar',
        ],
        [
            'id' => 'kawi-8',
            'title' => 'Inovasi CO-Ferment',
            'subtitle' => 'Eksperimen Rasa Buah Alami',
            'category' => 'Inovasi Rasa',
            'badge' => 'Specialty Innovation',
            'description' => 'Kolaborasi fermentasi buah alami dengan ragi pilihan menghasilkan sensasi rasa peach, stroberi liar, dan aroma bunga yang memikat indra.',
            'link_url' => '/shop?series=co-ferment',
            'link_label' => 'Coba Kopi CO-Ferment',
        ],
        [
            'id' => 'kawi-9',
            'title' => 'Biji Sangrai Espresso Kawi',
            'subtitle' => 'Keseimbangan Manis & Cokelat',
            'category' => 'Espresso Blend',
            'badge' => 'House Blend',
            'description' => 'Formulasi sangrai medium-dark yang lembut, dirancang untuk menghasilkan ekstraksi espresso tebal beraroma cokelat hitam, gula aren, dan aftertaste manis panjang.',
            'link_url' => '/shop?category=espresso-beans',
            'link_label' => 'Beli Espresso Roast',
        ],
        [
            'id' => 'kawi-10',
            'title' => 'Komunitas Barista & Edukasi',
            'subtitle' => 'Ruang Kolaborasi Malang',
            'category' => 'Edukasi Kopi',
            'badge' => 'Workshop',
            'description' => 'Program pelatihan barista, kelas sensory, dan workshop teknik seduh manual untuk barista rumahan maupun profesional di Malang Raya.',
            'link_url' => '/pelatihan-barista',
            'link_label' => 'Daftar Pelatihan',
        ],
        [
            'id' => 'kawi-11',
            'title' => 'Senja di Lereng Gunung',
            'subtitle' => 'Hawa Dingin Pegunungan',
            'category' => 'Atmosfer Kawi',
            'badge' => 'Jejak Rasa',
            'description' => 'Menikmati secangkir seduhan hangat di tengah kabut sore yang turun perlahan dari lereng Gunung Kawi, menghangatkan jiwa di tiap sesapan.',
            'link_url' => '/blog',
            'link_label' => 'Baca Cerita Roaster',
        ],
        [
            'id' => 'kawi-12',
            'title' => 'Kemitraan Petani Lokal',
            'subtitle' => 'Fair & Direct Trade',
            'category' => 'Keberlanjutan',
            'badge' => 'Fair Trade',
            'description' => 'Komitmen Sanubari Roastery untuk memberdayakan petani kopi lokal lereng Kawi melalui harga pembelian yang adil dan transfer pengetahuan budidaya berkelanjutan.',
            'link_url' => '/tentang-kami',
            'link_label' => 'Tentang Sanubari',
        ],
        [
            'id' => 'kawi-13',
            'title' => 'Wet Hulling Klasik Jawa',
            'subtitle' => 'Tradisi Giling Basah',
            'category' => 'Metode Pengolahan',
            'badge' => 'Tradisi',
            'description' => 'Metode legendaris yang menghasilkan body kopi tebal, aroma rempah khas, dan tingkat keasaman yang seimbang bersahaja.',
            'link_url' => '/panduan-seduh',
            'link_label' => 'Pelajari Metode',
        ],
        [
            'id' => 'kawi-14',
            'title' => 'Sortasi Meja Gravitasi',
            'subtitle' => 'Kerapatan Biji Maksimal',
            'category' => 'Quality Control',
            'badge' => 'Grading',
            'description' => 'Pemisahan green beans berdasarkan densitas dan ukuran untuk menjamin keseragaman kematangan sangrai di setiap batch roaster.',
            'link_url' => '/roasting',
            'link_label' => 'Lihat Standar QC',
        ],
        [
            'id' => 'kawi-15',
            'title' => 'Cold Drip & Nitro Brew',
            'subtitle' => 'Ekstraksi Dingin 12 Jam',
            'category' => 'Seduhan Inovatif',
            'badge' => 'Cold Brew',
            'description' => 'Tetesan air dingin lambat mengesktrak rasa manis manis bunga kopi dan cokelat susu tanpa mengekstrak asam pahit berlebih.',
            'link_url' => '/kunjungi',
            'link_label' => 'Cicipi Nitro Brew',
        ],
        [
            'id' => 'kawi-16',
            'title' => 'Profil Sangrai Nordic',
            'subtitle' => 'Light Roast Bernuansa Bunga',
            'category' => 'Roast Profiling',
            'badge' => 'Nordic Style',
            'description' => 'Pengembangan profil sangrai cerah yang menjaga keaslian karakter terroir Gunung Kawi dengan floral aroma melati dan jeruk purut.',
            'link_url' => '/shop?series=nordic',
            'link_label' => 'Jelajah Nordic Roast',
        ],
        [
            'id' => 'kawi-17',
            'title' => 'Presisi Kalibrasi Grinder',
            'subtitle' => 'Distribusi Partikel Mikro',
            'category' => 'Barista Lab',
            'badge' => 'Presisi',
            'description' => 'Pengecekan mikron gilingan setiap pagi menggunakan burr datar berlapis titanium demi ekstraksi espresso yang seimbang.',
            'link_url' => '/pelatihan-barista',
            'link_label' => 'Belajar Barista',
        ],
        [
            'id' => 'kawi-18',
            'title' => 'Kemasan Degassing Valve',
            'subtitle' => 'Pelindung Kesegaran Aroma',
            'category' => 'Packaging',
            'badge' => 'Freshness',
            'description' => 'Kantung aluminium foil food grade dengan one-way valve menjaga gas CO2 keluar alami tanpa membiarkan oksigen merusak aroma biji kopi.',
            'link_url' => '/shop',
            'link_label' => 'Belanja Kopi Segar',
        ],
        [
            'id' => 'kawi-19',
            'title' => 'Kedai Roastery Tlogomas',
            'subtitle' => 'Titik Temu Penikmat Kopi',
            'category' => 'Komunitas & Ruang',
            'badge' => 'Tlogomas Lab',
            'description' => 'Suasana hangat kedai di Ruko Tlogomas Square Kota Malang, tempat bertukar cerita aroma dan seduhan bersama para sangrai.',
            'link_url' => '/kunjungi',
            'link_label' => 'Petunjuk Arah Kedai',
        ],
        [
            'id' => 'kawi-20',
            'title' => 'Harmoni Lereng & Kabut',
            'subtitle' => 'Arsip Visual Nusantara',
            'category' => 'Lanskap Kawi',
            'badge' => 'Sanubari Story',
            'description' => 'Refleksi perjalanan dari lereng gunung hingga secangkir kopi di tangan Anda, membawa kehangatan dan rasa syukur di setiap tegukan.',
            'link_url' => '/tentang-kami',
            'link_label' => 'Baca Kisah Kami',
        ],
    ];

    $galleryData = !empty($images) && is_array($images) ? $images : $defaultItems;
    if (count($galleryData) < 20) {
        $tiledData = [];
        for ($i = 0; $i < 20; $i++) {
            $orig = $galleryData[$i % count($galleryData)];
            $orig['id'] = ($orig['id'] ?? 'kawi') . '-' . $i;
            $tiledData[] = $orig;
        }
        $galleryData = $tiledData;
    }
@endphp

<section id="{{ $componentId }}_section" class="w-full max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 my-8 sm:my-12 select-none">
    {{-- Header Section (Hidden by default / Sembunyikan Tampilan) --}}
    @if($showHeader)
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4 sm:mb-6">
        <div class="space-y-1.5">
            <div class="flex items-center gap-2">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-accent-copper/20 text-accent-copper border border-accent-copper/30">
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                    </svg>
                    <span>{{ $badge }}</span>
                </span>
                <span class="text-[11px] text-brand-500 font-semibold hidden md:inline-flex items-center gap-1">
                    <svg class="w-3 h-3 text-accent-copper" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
                    </svg>
                    <span>5 Gambar Depan • 2 Baris Bertingkat • 360° Drag</span>
                </span>
            </div>

            <h2 class="text-xl sm:text-3xl font-extrabold text-brand-950 tracking-tight">
                {{ $title }}
            </h2>

            <p class="text-xs sm:text-sm text-brand-600 max-w-3xl leading-relaxed">
                {{ $subtitle }}
            </p>
        </div>

        {{-- Desktop Instructions Badge --}}
        <div class="hidden lg:flex items-center gap-2 text-xs text-brand-600 bg-sand-100/80 px-3.5 py-2 rounded-xl border border-sand-200">
            <span class="inline-flex items-center gap-1">
                <svg class="w-3.5 h-3.5 text-accent-copper" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="5 9 2 12 5 15"/><polyline points="9 5 12 2 15 5"/><polyline points="15 19 12 22 9 19"/><polyline points="19 9 22 12 19 15"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/></svg>
                <span>Geser 360°</span>
            </span>
            <span class="text-sand-300">•</span>
            <span class="inline-flex items-center gap-1">
                <svg class="w-3.5 h-3.5 text-accent-copper" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
                <span>Scroll 2 Tingkat</span>
            </span>
            <span class="text-sand-300">•</span>
            <span class="inline-flex items-center gap-1">
                <svg class="w-3.5 h-3.5 text-accent-copper" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <span>Klik gambar untuk detail</span>
            </span>
        </div>
    </div>
    @endif

    {{-- 3D Canvas Stage Container (100% Transparent / Melayang) --}}
    <div id="{{ $componentId }}_wrapper" class="relative w-full rounded-3xl overflow-hidden">
        {{-- Three.js Canvas Mount Container --}}
        <div id="{{ $componentId }}_canvas" class="w-full {{ $height }} select-none touch-none bg-transparent"></div>

        {{-- Top Control Bar Overlay --}}
        <div class="absolute top-3.5 sm:top-5 left-3.5 sm:left-5 right-3.5 sm:right-5 flex items-center justify-between pointer-events-none z-10">
            <div id="{{ $componentId }}_status_pill" class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-sand-300 text-brand-950 text-[11px] font-semibold shadow-md pointer-events-auto">
                <span id="{{ $componentId }}_status_dot" class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span id="{{ $componentId }}_status_text">Rotasi Otomatis</span>
                <span class="text-brand-500 text-[10px]">({{ count($galleryData) }} Segmen)</span>
            </div>

            <div class="flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
                <button type="button" id="{{ $componentId }}_btn_toggle_rotate" class="p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-semibold bg-white/90 hover:bg-white text-brand-900 border border-sand-300 backdrop-blur-md shadow-sm flex items-center gap-1.5 transition-all active:scale-95">
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                    <span class="hidden sm:inline">Jeda</span>
                </button>

                <button type="button" id="{{ $componentId }}_btn_reset" class="p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-semibold bg-white/90 hover:bg-white text-brand-900 border border-sand-300 backdrop-blur-md shadow-sm flex items-center gap-1.5 transition-all active:scale-95" title="Reset Posisi Kamera">
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                    <span class="hidden sm:inline">Reset</span>
                </button>

                <button type="button" id="{{ $componentId }}_btn_fullscreen" class="p-2 sm:px-2.5 sm:py-1.5 rounded-xl text-xs bg-white/90 hover:bg-white text-brand-900 border border-sand-300 backdrop-blur-md shadow-sm flex items-center transition-all active:scale-95" title="Layar Penuh">
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
                </button>
            </div>
        </div>
    </div>

    {{-- Lightbox Modal Container (Pure Image Viewer, No Titles, No Links) --}}
    <div id="{{ $componentId }}_modal" class="fixed inset-0 z-50 hidden items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
        <div class="relative max-w-4xl max-h-[90vh] bg-transparent flex flex-col items-center justify-center">
            <button type="button" id="{{ $componentId }}_modal_close" class="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 z-20 p-2 sm:p-2.5 rounded-full bg-sand-900/90 hover:bg-black text-white/90 hover:text-white backdrop-blur-md border border-white/20 transition-all shadow-xl hover:scale-105 active:scale-95" aria-label="Tutup Preview Gambar">
                <svg class="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>

            <div class="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-sand-950/60 max-h-[85vh] flex items-center justify-center">
                <img id="{{ $componentId }}_modal_img" src="" alt="Galeri Sanubari" class="w-auto h-auto max-w-full max-h-[82vh] object-contain rounded-2xl sm:rounded-3xl">
            </div>
        </div>
    </div>
</section>

{{-- Ensure Three.js is loaded and mount 3D gallery --}}
<script>
(function() {
    const rawData = @json($galleryData);
    const containerId = "{{ $componentId }}_canvas";
    const wrapperId = "{{ $componentId }}_wrapper";
    const modalId = "{{ $componentId }}_modal";

    function loadScript(url, callback) {
        if (window.THREE) {
            callback();
            return;
        }
        const existing = document.querySelector('script[data-three-loader]');
        if (existing) {
            existing.addEventListener('load', callback);
            return;
        }
        const s = document.createElement('script');
        s.setAttribute('data-three-loader', 'true');
        s.src = url;
        s.onload = callback;
        document.head.appendChild(s);
    }

    // Procedural Landscape Generator (Landscape Dunes matching reference)
    function generateCanvasTexture(index) {
        const c = document.createElement('canvas');
        c.width = 800;
        c.height = 600; // 4:3 aspect ratio
        const ctx = c.getContext('2d');
        if (!ctx) return '';

        const palettes = [
            { sky: ['#f4efe8', '#f2e8dc', '#ecd5be'], sun: '#fffdfa', glow: 'rgba(245,158,11,0.25)', layers: ['#f59e0b', '#ea580c', '#c2410c'], hasSun: true },
            { sky: ['#e2edf3', '#c8dfe8', '#99c2d4'], sun: '#ffffff', glow: 'rgba(14,165,233,0.25)', layers: ['#38bdf8', '#0284c7', '#0369a1'], hasSun: true },
            { sky: ['#eaedf1', '#dbe2e8', '#b8c5d2'], sun: '#ffffff', glow: 'rgba(100,116,139,0.2)', layers: ['#64748b', '#475569', '#334155'], hasSun: false },
            { sky: ['#f3edf7', '#e8dcf0', '#d3bee3'], sun: '#ffffff', glow: 'rgba(168,85,247,0.2)', layers: ['#c084fc', '#9333ea', '#6b21a8'], hasSun: false },
            { sky: ['#fbf8ed', '#f5eed3', '#e8dcb3'], sun: '#fffef5', glow: 'rgba(234,179,8,0.25)', layers: ['#fde047', '#eab308', '#ca8a04'], hasSun: true },
            { sky: ['#e6e9f5', '#ccd4eb', '#99a9d8'], sun: '#ffffff', glow: 'rgba(99,102,241,0.2)', layers: ['#818cf8', '#4f46e5', '#312e81'], hasSun: false },
            { sky: ['#edf5ef', '#dbeee0', '#b9dfc2'], sun: '#ffffff', glow: 'rgba(34,197,94,0.2)', layers: ['#4ade80', '#16a34a', '#14532d'], hasSun: true },
            { sky: ['#faecee', '#f5d9dc', '#eeb8be'], sun: '#fff5f6', glow: 'rgba(244,63,94,0.25)', layers: ['#fb7185', '#e11d48', '#881337'], hasSun: true },
            { sky: ['#eaf7f5', '#d4eee9', '#a9dcd3'], sun: '#ffffff', glow: 'rgba(20,184,166,0.2)', layers: ['#2dd4bf', '#0d9488', '#115e59'], hasSun: true },
            { sky: ['#f7eee9', '#eddcd3', '#dcbeaf'], sun: '#fffbf9', glow: 'rgba(217,119,6,0.25)', layers: ['#fb923c', '#d97706', '#7c2d12'], hasSun: false },
            { sky: ['#eef2f6', '#dde4ec', '#bcc8d8'], sun: '#ffffff', glow: 'rgba(56,189,248,0.25)', layers: ['#7dd3fc', '#0284c7', '#1e293b'], hasSun: true },
            { sky: ['#f9ebea', '#f3d4d2', '#e5aba7'], sun: '#ffffff', glow: 'rgba(239,68,68,0.25)', layers: ['#f87171', '#dc2626', '#450a0a'], hasSun: true }
        ];

        const p = palettes[index % palettes.length];

        // Sky
        const skyGrad = ctx.createLinearGradient(0, 0, 0, c.height * 0.75);
        p.sky.forEach((col, i) => skyGrad.addColorStop(i / (p.sky.length - 1), col));
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, c.width, c.height);

        // Sun
        if (p.hasSun) {
            const sunX = c.width * 0.48;
            const sunY = c.height * 0.32;
            const sunR = 45;
            const glow = ctx.createRadialGradient(sunX, sunY, sunR * 0.4, sunX, sunY, sunR * 2.2);
            glow.addColorStop(0, p.glow);
            glow.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(sunX, sunY, sunR * 2.2, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = p.sun;
            ctx.beginPath();
            ctx.arc(sunX, sunY, sunR, 0, Math.PI * 2);
            ctx.fill();
        }

        // Layer 1
        ctx.fillStyle = p.layers[0];
        ctx.beginPath();
        ctx.moveTo(0, c.height);
        ctx.lineTo(0, c.height * 0.48);
        ctx.bezierCurveTo(c.width * 0.25, c.height * 0.38, c.width * 0.65, c.height * 0.54, c.width, c.height * 0.44);
        ctx.lineTo(c.width, c.height);
        ctx.closePath();
        ctx.fill();

        // Layer 2
        ctx.fillStyle = p.layers[1];
        ctx.beginPath();
        ctx.moveTo(0, c.height);
        ctx.lineTo(0, c.height * 0.62);
        ctx.bezierCurveTo(c.width * 0.32, c.height * 0.72, c.width * 0.68, c.height * 0.46, c.width, c.height * 0.58);
        ctx.lineTo(c.width, c.height);
        ctx.closePath();
        ctx.fill();

        // Layer 3
        ctx.fillStyle = p.layers[2];
        ctx.beginPath();
        ctx.moveTo(0, c.height);
        ctx.lineTo(0, c.height * 0.75);
        ctx.bezierCurveTo(c.width * 0.38, c.height * 0.58, c.width * 0.72, c.height * 0.82, c.width, c.height * 0.72);
        ctx.lineTo(c.width, c.height);
        ctx.closePath();
        ctx.fill();

        return c.toDataURL('image/jpeg', 0.94);
    }

    function initHelix() {
        const mount = document.getElementById(containerId);
        if (!mount) return;

        const THREE = window.THREE;
        const width = mount.clientWidth || 800;
        const height = mount.clientHeight || 560;

        const columns = Math.max(3, Math.min(8, {{ (int) $visibleColumns }}));
        const tiers = Math.max(1, Math.min(4, {{ (int) $tiersCount }}));
        const itemsPerTurn = columns * 2;
        const autoRotateSpeed = {{ (float) $autoRotateSpeed }};

        function calcCameraZ(w) {
            const colOffset = (columns - 5) * 0.75;
            if (w < 640) return 11.5 + colOffset;
            if (w < 1024) return 10.2 + colOffset;
            return 9.0 + colOffset;
        }

        // Scene
        const scene = new THREE.Scene();
        scene.background = null;

        // Camera: columns across, tiers rows down framing in 4:3
        const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
        camera.position.set(0, 0, calcCameraZ(width));

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
        renderer.setClearColor(0x000000, 0);
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.toneMapping = THREE.NoToneMapping;
        mount.replaceChildren(renderer.domElement);

        renderer.domElement.style.width = '100%';
        renderer.domElement.style.height = '100%';
        renderer.domElement.style.display = 'block';
        renderer.domElement.style.cursor = 'grab';

        // Lights
        const ambient = new THREE.AmbientLight(0xfff8f0, 1.25);
        scene.add(ambient);

        const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
        keyLight.position.set(4, 7, 7);
        scene.add(keyLight);

        const rimLight = new THREE.DirectionalLight(0xd97706, 1.5);
        rimLight.position.set(-6, -3, -5);
        scene.add(rimLight);

        const topLight = new THREE.DirectionalLight(0xfffbeb, 0.9);
        topLight.position.set(0, 8, 4);
        scene.add(topLight);

        // Helical Group: columns across, tiers rows down
        const helixGroup = new THREE.Group();
        scene.add(helixGroup);

        const radius = 3.6;
        const totalItems = rawData.length;
        const angleStep = (Math.PI * 2) / itemsPerTurn;
        const panelArc = angleStep * 0.84;
        const curvedWidth = radius * panelArc;
        const panelHeight = (curvedWidth * 3) / 4; // 4:3 aspect ratio
        const tierSpacing = panelHeight * 1.21;
        const heightStep = tierSpacing / itemsPerTurn;
        const totalHelixHeight = (totalItems - 1) * heightStep;

        const frontGeometry = new THREE.CylinderGeometry(radius, radius, panelHeight, 28, 1, true, -panelArc / 2, panelArc);
        const backGeometry = new THREE.CylinderGeometry(radius * 0.995, radius * 0.995, panelHeight * 0.996, 28, 1, true, -panelArc / 2, panelArc);

        const backMaterial = new THREE.MeshBasicMaterial({
            color: 0x18181b,
            side: THREE.BackSide,
        });

        const textureLoader = new THREE.TextureLoader();
        const panels = [];

        rawData.forEach((item, index) => {
            const angle = index * angleStep;
            const yPos = index * heightStep - totalHelixHeight / 2;

            let texture;
            if (item.image && (item.image.startsWith('http') || item.image.startsWith('/'))) {
                texture = textureLoader.load(item.image);
            } else {
                const dataUrl = generateCanvasTexture(index);
                const img = new Image();
                img.src = dataUrl;
                texture = new THREE.Texture(img);
                img.onload = () => { texture.needsUpdate = true; };
            }

            if ('colorSpace' in texture && THREE.SRGBColorSpace) {
                texture.colorSpace = THREE.SRGBColorSpace;
            }

            texture.wrapS = THREE.ClampToEdgeWrapping;
            texture.wrapT = THREE.ClampToEdgeWrapping;
            texture.generateMipmaps = true;

            // Pure original photo colors without any lighting, specular, or shading effects
            const frontMaterial = new THREE.MeshBasicMaterial({
                map: texture,
                side: THREE.FrontSide,
                toneMapped: false,
            });

            const frontMesh = new THREE.Mesh(frontGeometry, frontMaterial);
            frontMesh.userData = { index, item };

            const backMesh = new THREE.Mesh(backGeometry, backMaterial);

            const panelGroup = new THREE.Group();
            panelGroup.position.set(0, yPos, 0);
            panelGroup.rotation.y = angle;

            const slopeAngle = Math.atan2(heightStep, radius * angleStep) * 0.35;
            frontMesh.rotation.z = -slopeAngle;
            backMesh.rotation.z = -slopeAngle;

            panelGroup.add(frontMesh);
            panelGroup.add(backMesh);

            helixGroup.add(panelGroup);
            panels.push({ mesh: frontMesh, item, angle, y: yPos });
        });

        // Motion physics
        const motion = {
            targetRotationY: 0,
            currentRotationY: 0,
            targetScrollY: 0,
            currentScrollY: 0,
            targetCameraZ: calcCameraZ(width),
            currentCameraZ: calcCameraZ(width),
            isDragging: false,
            lastX: 0,
            lastY: 0,
            downX: 0,
            downY: 0,
            downTime: 0,
            autoRotate: {{ $autoRotate ? 'true' : 'false' }},
        };

        const raycaster = new THREE.Raycaster();
        const pointer = new THREE.Vector2();

        // Modal Elements
        const modal = document.getElementById(modalId);
        const modalImg = document.getElementById("{{ $componentId }}_modal_img");
        const modalClose = document.getElementById("{{ $componentId }}_modal_close");

        function openModal(item, index) {
            if (!modal) return;
            const imgSrc = item.image || generateCanvasTexture(index);
            if (modalImg) modalImg.src = imgSrc;
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }

        function closeModal() {
            if (!modal) return;
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }

        if (modalClose) modalClose.addEventListener('click', closeModal);
        if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

        // Pointer Events
        const dom = renderer.domElement;

        dom.addEventListener('pointerdown', (e) => {
            motion.isDragging = true;
            motion.lastX = e.clientX;
            motion.lastY = e.clientY;
            motion.downX = e.clientX;
            motion.downY = e.clientY;
            motion.downTime = performance.now();
            dom.style.cursor = 'grabbing';
        });

        window.addEventListener('pointermove', (e) => {
            if (!motion.isDragging) return;
            const dx = e.clientX - motion.lastX;
            const dy = e.clientY - motion.lastY;
            motion.lastX = e.clientX;
            motion.lastY = e.clientY;

            motion.targetRotationY += dx * 0.0055;
            motion.targetScrollY -= dy * 0.008;

            const maxScroll = totalHelixHeight * 0.7;
            motion.targetScrollY = Math.max(-maxScroll, Math.min(maxScroll, motion.targetScrollY));
        });

        window.addEventListener('pointerup', (e) => {
            if (!motion.isDragging) return;
            motion.isDragging = false;
            dom.style.cursor = 'grab';

            const dist = Math.hypot(e.clientX - motion.downX, e.clientY - motion.downY);
            const duration = performance.now() - motion.downTime;

            if (dist < 6 && duration < 350) {
                const rect = dom.getBoundingClientRect();
                pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
                pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

                raycaster.setFromCamera(pointer, camera);
                const intersects = raycaster.intersectObjects(panels.map(p => p.mesh), false);

                if (intersects.length > 0) {
                    const hit = intersects[0].object;
                    const itemData = hit.userData?.item;
                    const itemIdx = hit.userData?.index || 0;
                    if (itemData) {
                        openModal(itemData, itemIdx);
                        const rec = panels.find(p => p.mesh === hit);
                        if (rec) {
                            const targetAngle = -rec.angle;
                            const diff = (targetAngle - motion.targetRotationY) % (Math.PI * 2);
                            const shortest = Math.atan2(Math.sin(diff), Math.cos(diff));
                            motion.targetRotationY += shortest;
                            motion.targetScrollY = -rec.y * 0.9;
                        }
                    }
                }
            }
        });

        dom.addEventListener('wheel', (e) => {
            e.preventDefault();
            motion.targetScrollY += e.deltaY * 0.0035;
            const maxScroll = totalHelixHeight * 0.7;
            motion.targetScrollY = Math.max(-maxScroll, Math.min(maxScroll, motion.targetScrollY));
        }, { passive: false });

        // Control Buttons
        const btnToggle = document.getElementById("{{ $componentId }}_btn_toggle_rotate");
        const statusDot = document.getElementById("{{ $componentId }}_status_dot");
        const statusText = document.getElementById("{{ $componentId }}_status_text");
        const btnReset = document.getElementById("{{ $componentId }}_btn_reset");
        const btnFs = document.getElementById("{{ $componentId }}_btn_fullscreen");
        const wrapper = document.getElementById(wrapperId);

        if (btnToggle) {
            btnToggle.addEventListener('click', () => {
                motion.autoRotate = !motion.autoRotate;
                if (statusDot) statusDot.className = motion.autoRotate ? 'w-2 h-2 rounded-full bg-emerald-500 animate-pulse' : 'w-2 h-2 rounded-full bg-amber-500';
                if (statusText) statusText.textContent = motion.autoRotate ? 'Rotasi Otomatis' : 'Interaksi Manual';
            });
        }

        if (btnReset) {
            btnReset.addEventListener('click', () => {
                motion.targetRotationY = 0;
                motion.targetScrollY = 0;
                motion.targetCameraZ = calcCameraZ(width);
            });
        }

        if (btnFs && wrapper) {
            btnFs.addEventListener('click', () => {
                if (!document.fullscreenElement) wrapper.requestFullscreen().catch(() => {});
                else document.exitFullscreen().catch(() => {});
            });
        }

        // Resize
        function onResize() {
            if (!mount || !renderer || !camera) return;
            const nw = mount.clientWidth;
            const nh = mount.clientHeight;
            camera.aspect = nw / nh;
            motion.targetCameraZ = calcCameraZ(nw);
            camera.updateProjectionMatrix();
            renderer.setSize(nw, nh);
        }

        window.addEventListener('resize', onResize);

        // Render Loop
        let lastTime = performance.now();
        function animate(t) {
            requestAnimationFrame(animate);
            const dt = Math.min((t - lastTime) / 1000, 0.1);
            lastTime = t;

            if (motion.autoRotate && !motion.isDragging) {
                motion.targetRotationY += autoRotateSpeed * dt;
            }

            const damping = 0.08;
            motion.currentRotationY += (motion.targetRotationY - motion.currentRotationY) * damping;
            motion.currentScrollY += (motion.targetScrollY - motion.currentScrollY) * damping;
            motion.currentCameraZ += (motion.targetCameraZ - motion.currentCameraZ) * damping;

            helixGroup.rotation.y = motion.currentRotationY;
            helixGroup.position.y = -motion.currentScrollY;

            camera.position.z = motion.currentCameraZ;
            camera.lookAt(0, 0, 0);

            renderer.render(scene, camera);
        }

        requestAnimationFrame(animate);
    }

    loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', initHelix);
})();
</script>
