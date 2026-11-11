// Single Source of Truth untuk Kategori Navigasi (Desktop Mega Menu & Mobile Kategori Hub)
// Selaras 100% antara versi Desktop dan versi Mobile

export const CATEGORY_NAVIGATION_DATA = [
  {
    id: 'filter-beans',
    name: 'Filter Beans',
    title: 'Filter Beans',
    slug: 'filter-beans',
    categoryTarget: 'filter-beans',
    allLabel: 'Lihat Semua di Filter Beans',
    allUrl: '/kategori/filter-beans',
    items: [
      {
        id: 'classic-process',
        name: 'Classic Process',
        iconType: 'beans-classic',
        desc: 'Washed & Natural Profile Kawi',
        link: '/kategori/filter-beans',
        targetCategory: 'filter-beans'
      },
      {
        id: 'experimental-process',
        name: 'Experimantal Process',
        iconType: 'beans-exp',
        desc: 'Anaerobic & Yeast Inoculation',
        link: '/kategori/filter-beans',
        targetCategory: 'filter-beans'
      },
      {
        id: 'co-ferment',
        name: 'Co-Ferment Process',
        iconType: 'beans-coferment',
        desc: 'Nanas Madu & Sweet Plum',
        link: '/kategori/filter-beans',
        targetCategory: 'filter-beans'
      },
      {
        id: 'paket-box-hampers',
        name: 'Paket Box Hampers',
        iconType: 'gift',
        desc: 'Specialty Gift Box Roastery',
        link: '/kategori/bundles',
        targetCategory: 'bundles'
      }
    ]
  },
  {
    id: 'espresso-beans',
    name: 'Espresso Beans',
    title: 'Espresso Beans',
    slug: 'espresso-beans',
    categoryTarget: 'espresso-beans',
    allLabel: 'Lihat Semua di Espresso Beans',
    allUrl: '/kategori/espresso-beans',
    items: [
      {
        id: 'fine-robusta',
        name: 'Fine Robusta',
        iconType: 'robusta',
        desc: 'Dampit & Malang Grade 1',
        link: '/kategori/espresso-beans',
        targetCategory: 'espresso-beans'
      },
      {
        id: 'full-arabica',
        name: 'Full Arabica',
        iconType: 'arabica',
        desc: '100% Arabika Gunung Kawi',
        link: '/kategori/espresso-beans',
        targetCategory: 'espresso-beans'
      },
      {
        id: 'houseblend',
        name: 'Houseblend',
        iconType: 'houseblend',
        desc: 'Formula Kopi Susu & Espresso',
        link: '/kategori/espresso-beans',
        targetCategory: 'espresso-beans'
      }
    ]
  },
  {
    id: 'alat-kopi',
    name: 'Peralatan Seduh (Alat Kopi)',
    title: 'Peralatan Seduh (Alat Kopi)',
    slug: 'alat-kopi',
    categoryTarget: 'all',
    allLabel: 'Lihat Semua Peralatan Kopi',
    allUrl: '/kategori/all',
    items: [
      {
        id: 'manual-brew',
        name: 'Manual Brew & Dripper',
        iconType: 'dripper',
        desc: 'Hario Kasuya, Origami, Aeropress',
        link: '/kategori/manual-brew',
        targetCategory: 'manual-brew'
      },
      {
        id: 'hand-grinder',
        name: 'Hand Grinder Presisi',
        iconType: 'grinder',
        desc: 'Timemore C3S & Kingrinder K6',
        link: '/kategori/grinder',
        targetCategory: 'grinder'
      },
      {
        id: 'espresso-tools',
        name: 'Espresso & Lever Tools',
        iconType: 'flair',
        desc: 'Flair 58, Portafilter 58mm, WDT',
        link: '/kategori/espresso-tools',
        targetCategory: 'espresso-tools'
      },
      {
        id: 'kettle',
        name: 'Kettle Gooseneck',
        iconType: 'kettle',
        desc: 'Fellow Stagg & Timemore Fish',
        link: '/kategori/kettle',
        targetCategory: 'kettle'
      },
      {
        id: 'scale',
        name: 'Scale & Timer Digital',
        iconType: 'scale',
        desc: 'Timemore Black Mirror Basic 2',
        link: '/kategori/scale',
        targetCategory: 'scale'
      },
      {
        id: 'bundles',
        name: 'Paket Starter Kit',
        iconType: 'bundle',
        desc: 'Set Lengkap Barista Rumah',
        link: '/kategori/bundles',
        targetCategory: 'bundles'
      }
    ]
  },
  {
    id: 'fitur-penawaran',
    name: 'Fitur dan Penawaran',
    title: 'Fitur dan Penawaran',
    slug: 'fitur-penawaran',
    allLabel: 'Lihat Seluruh Fitur & Panduan',
    allUrl: '/panduan-seduh',
    items: [
      {
        id: 'cybr',
        name: 'C.Y.B.R (Custom...)',
        iconType: 'cybr',
        desc: 'Custom Roasting & Profile Barista',
        link: '/kategori/filter-beans',
        internalUrl: '/kategori/filter-beans'
      },
      {
        id: 'acara',
        name: 'Acara',
        iconType: 'acara',
        desc: 'Cupping Session & Kalibrasi Barista',
        link: '/showroom',
        internalUrl: '/showroom'
      },
      {
        id: 'kalkulator',
        name: 'Kalkulator Rasio Seduh',
        iconType: 'scale',
        desc: 'Hitung gramasi kopi & air presisi',
        link: '/panduan-seduh',
        internalUrl: '/panduan-seduh',
        action: 'calc'
      },
      {
        id: 'panduan-seduh',
        name: 'Panduan Resep Seduh',
        iconType: 'dripper',
        desc: 'Ekstraksi resmi Slow Bar Sanubari',
        link: '/panduan-seduh',
        internalUrl: '/panduan-seduh'
      }
    ]
  }
];

// Alias subcategories to items for backwards compatibility with Mega Menu
export const MEGA_MENU_CATEGORIES = CATEGORY_NAVIGATION_DATA.map(cat => ({
  ...cat,
  subcategories: cat.items
}));

