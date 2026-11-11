// Content Management & Persistence Engine for Alat Kopi Malang Admin
import { PRODUCTS, STORE_INFO } from '../data/products';
import { HERO_SLIDES } from '../components/Hero';
import { CATEGORY_NAVIGATION_DATA } from '../data/categoryNavigation';

// Default Admin Credentials
export const DEFAULT_ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'alatkopimalang2026',
  email: 'admin@alatkopimalang.co.id',
  name: 'Super Admin Barista',
  role: 'Owner & Store Manager'
};

// Default Demo Orders
export const DEFAULT_ORDERS = [
  {
    id: 'ORD-202611-001',
    customerName: 'Budi Santoso',
    phone: '0812-3456-7891',
    email: 'budisantoso@gmail.com',
    shippingAddress: 'Jl. Danau Toba No. 12, Sawojajar, Kota Malang',
    date: '2026-11-11 14:30',
    status: 'Diproses', // 'Menunggu Pembayaran' | 'Diproses' | 'Dikirim' | 'Selesai' | 'Dibatalkan'
    paymentMethod: 'QRIS',
    shippingCourier: 'GoSend Instant Malang',
    items: [
      { id: 'akm-timemore-c3s', name: 'Timemore Chestnut C3S Pro Hand Grinder', quantity: 1, price: 925000 },
      { id: 'snb-filter-kawi', name: 'Gunung Kawi Washed Specialty Filter Beans 200g', quantity: 2, price: 110000 }
    ],
    subtotal: 1145000,
    shippingCost: 0,
    discount: 114500,
    total: 1030500,
    notes: 'Mohon digiling ukuran V60 untuk biji kopinya ya min'
  },
  {
    id: 'ORD-202611-002',
    customerName: 'Siti Rahmawati',
    phone: '0813-9876-5432',
    email: 'siti.rahma@yahoo.com',
    shippingAddress: 'Jl. Soekarno Hatta No. 88, Lowokwaru, Kota Malang',
    date: '2026-11-11 10:15',
    status: 'Selesai',
    paymentMethod: 'Transfer BCA',
    shippingCourier: 'Ambil di Showroom Tlogomas',
    items: [
      { id: 'akm-origami-air', name: 'Origami Dripper Air S - Resin Pour Over', quantity: 1, price: 345000 },
      { id: 'akm-cafec-abaca', name: 'Cafec Abaca Filter Paper V60 (100 Lembar)', quantity: 1, price: 85000 }
    ],
    subtotal: 430000,
    shippingCost: 0,
    discount: 0,
    total: 430000,
    notes: 'Akan diambil sore nanti jam 16.00 WIB'
  },
  {
    id: 'ORD-202611-003',
    customerName: 'Ahmad Fauzi',
    phone: '0857-1122-3344',
    email: 'ahmadfauzi.barista@gmail.com',
    shippingAddress: 'Jl. Pahlawan No. 4, Kepanjen, Kab. Malang',
    date: '2026-11-10 19:40',
    status: 'Dikirim',
    paymentMethod: 'QRIS',
    shippingCourier: 'JNE YES',
    items: [
      { id: 'akm-flair-58', name: 'Flair 58 Manual Lever Espresso Machine', quantity: 1, price: 9250000 }
    ],
    subtotal: 9250000,
    shippingCost: 0,
    discount: 500000,
    total: 8750000,
    notes: 'Packing kayu dan bubble wrap tebal ya'
  }
];

// Default Promo Coupons
export const DEFAULT_COUPONS = [
  { id: 'cp-1', code: 'SANUBARI10', discountPercent: 10, maxDiscount: 100000, minSpend: 150000, isActive: true, usageCount: 42 },
  { id: 'cp-2', code: 'AKM10', discountPercent: 10, maxDiscount: 100000, minSpend: 100000, isActive: true, usageCount: 28 },
  { id: 'cp-3', code: 'PROMOBARISTA', discountPercent: 15, maxDiscount: 200000, minSpend: 350000, isActive: true, usageCount: 15 }
];

// Helper to notify other components of content change
export function notifyContentUpdate() {
  window.dispatchEvent(new Event('akm_content_updated'));
}

// =================== PRODUCTS STORE ===================
export function getStoredProducts() {
  try {
    const saved = localStorage.getItem('akm_products');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Error loading products from storage', e);
  }
  return PRODUCTS;
}

export function saveStoredProducts(productsList) {
  localStorage.setItem('akm_products', JSON.stringify(productsList));
  notifyContentUpdate();
}

// =================== STORE INFO STORE ===================
export function getStoredStoreInfo() {
  try {
    const saved = localStorage.getItem('akm_store_info');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Error loading store info from storage', e);
  }
  return STORE_INFO;
}

export function saveStoredStoreInfo(storeInfo) {
  localStorage.setItem('akm_store_info', JSON.stringify(storeInfo));
  notifyContentUpdate();
}

// =================== HERO SLIDES STORE ===================
export function getStoredHeroSlides() {
  try {
    const saved = localStorage.getItem('akm_hero_slides');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Error loading hero slides from storage', e);
  }
  return HERO_SLIDES;
}

export function saveStoredHeroSlides(slidesList) {
  localStorage.setItem('akm_hero_slides', JSON.stringify(slidesList));
  notifyContentUpdate();
}

// =================== ORDERS STORE ===================
export function getStoredOrders() {
  try {
    const saved = localStorage.getItem('akm_orders');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Error loading orders from storage', e);
  }
  return DEFAULT_ORDERS;
}

export function saveStoredOrders(ordersList) {
  localStorage.setItem('akm_orders', JSON.stringify(ordersList));
  notifyContentUpdate();
}

export function addStoredOrder(newOrder) {
  const current = getStoredOrders();
  const updated = [newOrder, ...current];
  saveStoredOrders(updated);
  return updated;
}

// =================== COUPONS STORE ===================
export function getStoredCoupons() {
  try {
    const saved = localStorage.getItem('akm_coupons');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Error loading coupons from storage', e);
  }
  return DEFAULT_COUPONS;
}

export function saveStoredCoupons(couponsList) {
  localStorage.setItem('akm_coupons', JSON.stringify(couponsList));
  notifyContentUpdate();
}

// =================== ADMIN CREDENTIALS & SESSION ===================
export function getAdminCredentials() {
  try {
    const saved = localStorage.getItem('akm_admin_credentials');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Error loading admin credentials from storage', e);
  }
  return DEFAULT_ADMIN_CREDENTIALS;
}

export function saveAdminCredentials(creds) {
  localStorage.setItem('akm_admin_credentials', JSON.stringify(creds));
}

export function checkAdminSession() {
  return localStorage.getItem('akm_admin_authenticated') === 'true';
}

export function setAdminSession(isAuth) {
  if (isAuth) {
    localStorage.setItem('akm_admin_authenticated', 'true');
    localStorage.setItem('akm_admin_login_time', new Date().toISOString());
  } else {
    localStorage.removeItem('akm_admin_authenticated');
    localStorage.removeItem('akm_admin_login_time');
  }
}
