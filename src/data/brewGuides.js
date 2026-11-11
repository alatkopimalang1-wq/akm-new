// Panduan & Kalkulator Rasio Seduh Kopi
export const BREW_METHODS = [
  {
    id: 'v60',
    name: 'V60 Pour Over',
    defaultRatio: 15, // 1:15
    ratioOptions: [14, 15, 16],
    defaultDose: 15, // gram
    temp: '91°C - 93°C',
    grindSize: 'Medium-Fine (Garam Meja Halus)',
    time: '2 menit 30 detik - 3 menit',
    tastingNote: 'Clean body, keasaman buah cerah, aroma floral semerbak',
    recommendedGearIds: ['akm-dripper-v60-ceramic', 'akm-grinder-c3s', 'akm-scale-timemore-blackmirror', 'akm-filter-cafec-abaca'],
    steps: [
      'Bilas filter paper dengan air panas lalu buang air bilasan.',
      'Tuang bubuk kopi 15g ke dripper, ratakan permukaan, lalu tare timbangan.',
      'Tuangan 1 (Blooming): 45g air (rasio 1:3), diamkan selama 45 detik untuk degassing.',
      'Tuangan 2: Tuang melingkar stabil hingga 135g pada menit ke-1:00.',
      'Tuangan 3: Tuang lembut di tengah hingga total 225g pada menit ke-1:45.',
      'Tunggu drawdown selesai di 2:45 - 3:00. Putar pelan server dan nikmati.'
    ]
  },
  {
    id: 'aeropress',
    name: 'AeroPress (Inverted)',
    defaultRatio: 13, // 1:13
    ratioOptions: [11, 13, 14],
    defaultDose: 16,
    temp: '88°C - 90°C',
    grindSize: 'Medium (Sedikit lebih halus dari garam kasar)',
    time: '2 menit 00 detik',
    tastingNote: 'Body bulat manis, aftertaste panjang, tingkat keasaman seimbang',
    recommendedGearIds: ['akm-aeropress-original', 'akm-grinder-c3s', 'akm-scale-timemore-blackmirror'],
    steps: [
      'Pasang AeroPress posisi terbalik (inverted), bilas kertas filter di cap penutup.',
      'Masukkan 16g kopi bubuk ukuran medium.',
      'Tuang 210g air panas (suhu 89°C) secara cepat dalam waktu 15 detik.',
      'Aduk rata selama 10 detik dengan dayung pengaduk (stirrer).',
      'Pasang cap filter dengan kencang, diamkan hingga menit 1:30.',
      'Balikkan AeroPress ke atas cangkir/server, lalu tekan plunger pelan stabil selama 30 detik sampai berdesis pelan.'
    ]
  },
  {
    id: 'kalita',
    name: 'Flat Bed / Origami Wave',
    defaultRatio: 16,
    ratioOptions: [15, 16, 17],
    defaultDose: 15,
    temp: '92°C - 94°C',
    grindSize: 'Medium',
    time: '3 menit',
    tastingNote: 'Manis karamel menonjol, ekstraksi rata, rasa seimbang bulat',
    recommendedGearIds: ['akm-dripper-origami-air', 'akm-kettle-fellow-stagg', 'akm-grinder-c3s'],
    steps: [
      'Pasang filter wave di atas dripper flat bed, bilas singkat.',
      'Masukkan 15g bubuk kopi, ratakan alas.',
      'Blooming 50g air selama 40 detik.',
      'Lakukan 3 kali pulse pour masing-masing 60-70g air dengan interval 30 detik.',
      'Total air mencapai 240g pada menit 2:15, biarkan menetes tuntas.'
    ]
  },
  {
    id: 'espresso',
    name: 'Manual Lever Espresso (Flair)',
    defaultRatio: 2, // 1:2
    ratioOptions: [1.8, 2, 2.2],
    defaultDose: 18,
    temp: '93°C - 95°C',
    grindSize: 'Fine (Bubuk Halus Halus Espresso)',
    time: '30 - 35 detik ekstraksi',
    tastingNote: 'Crema tebal keemasan, body pekat intense, kekayaan rasa maksimal',
    recommendedGearIds: ['akm-flair-58', 'akm-wdt-distribution-tool', 'akm-grinder-kingrinder-k6'],
    steps: [
      'Panaskan brew head chamber Flair hingga suhu target (90-95°C).',
      'Giling 18g biji kopi halus dengan grinder presisi Kingrinder atau C3S.',
      'Gunakan AKM WDT tool untuk mengurai gumpalan di portafilter.',
      'Tamping rata dan pasang puck screen.',
      'Pasang portafilter, isi air mendidih ke chamber.',
      'Pre-infusion lembut di 2-3 bar selama 5 detik, lalu tekan stabil di 9 bar hingga menghasilkan 36g liquid espresso dalam 30 detik.'
    ]
  },
  {
    id: 'french-press',
    name: 'French Press (Immersion)',
    defaultRatio: 14,
    ratioOptions: [12, 14, 15],
    defaultDose: 20,
    temp: '94°C',
    grindSize: 'Coarse (Kasar seperti garam laut)',
    time: '4 menit ekstraksi',
    tastingNote: 'Heavy body, rasa cokelat & karamel kental, aroma klasik memikat',
    recommendedGearIds: ['akm-grinder-c3s', 'akm-scale-timemore-blackmirror'],
    steps: [
      'Giling 20g biji kopi dengan ukuran kasar (coarse).',
      'Masukkan bubuk kopi ke bejana French Press.',
      'Tuang 280g air panas bersuhu 94°C.',
      'Biarkan terekstraksi selama 4 menit penuh tanpa ditekan.',
      'Buka tutup, pecahkan kerak (crust) dengan sendok dan bersihkan busa mengambang.',
      'Pasang plunger dan tekan perlahan ke dasar. Langsung tuang ke cangkir agar tidak over-extract.'
    ]
  }
];

