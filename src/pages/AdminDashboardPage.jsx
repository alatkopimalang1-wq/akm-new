import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Image as ImageIcon, 
  Tags, 
  Ticket, 
  Settings, 
  ShieldCheck, 
  LogOut, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  Check, 
  AlertCircle, 
  TrendingUp, 
  DollarSign, 
  Users, 
  CheckCircle2, 
  Clock, 
  Truck, 
  X, 
  ExternalLink, 
  Coffee, 
  Sparkles,
  Phone,
  RotateCcw,
  Menu,
  Save,
  MessageCircle,
  ArrowRight,
  Upload,
  Camera,
  Star
} from 'lucide-react';
import { 
  getStoredProducts, 
  saveStoredProducts,
  getStoredStoreInfo, 
  saveStoredStoreInfo,
  getStoredHeroSlides, 
  saveStoredHeroSlides,
  getStoredOrders, 
  saveStoredOrders,
  getStoredCoupons, 
  saveStoredCoupons,
  getAdminCredentials, 
  saveAdminCredentials,
  checkAdminSession, 
  setAdminSession,
  getStoredShowroomPhotos,
  saveStoredShowroomPhotos,
  DEFAULT_SHOWROOM_PHOTOS,
  compressImageFile,
  DEFAULT_ADMIN_CREDENTIALS,
  DEFAULT_ORDERS,
  DEFAULT_COUPONS
} from '../utils/contentStore';
import { PRODUCTS, CATEGORIES, BRANDS } from '../data/products';
import { HERO_SLIDES } from '../components/Hero';
import { formatRupiah } from '../utils/format';

export default function AdminDashboardPage() {
  const navigate = useNavigate();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => checkAdminSession());
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Active Admin Tab: 'overview' | 'products' | 'orders' | 'banners' | 'categories' | 'coupons' | 'settings' | 'security'
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Toast feedback state
  const [toast, setToast] = useState(null);
  const showAdminToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Live Data States loaded from Storage
  const [products, setProducts] = useState(() => getStoredProducts());
  const [orders, setOrders] = useState(() => getStoredOrders());
  const [heroSlides, setHeroSlides] = useState(() => getStoredHeroSlides());
  const [showroomPhotos, setShowroomPhotos] = useState(() => getStoredShowroomPhotos());
  const [storeInfo, setStoreInfo] = useState(() => getStoredStoreInfo());
  const [coupons, setCoupons] = useState(() => getStoredCoupons());
  const [credentials, setCredentials] = useState(() => getAdminCredentials());

  // Reload data if storage changes
  useEffect(() => {
    const handleStorageUpdate = () => {
      setProducts(getStoredProducts());
      setOrders(getStoredOrders());
      setHeroSlides(getStoredHeroSlides());
      setShowroomPhotos(getStoredShowroomPhotos());
      setStoreInfo(getStoredStoreInfo());
      setCoupons(getStoredCoupons());
      setCredentials(getAdminCredentials());
    };
    window.addEventListener('akm_content_updated', handleStorageUpdate);
    return () => window.removeEventListener('akm_content_updated', handleStorageUpdate);
  }, []);

  // Login handler
  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');
    const currentCreds = getAdminCredentials();
    
    const isValidUsername = loginForm.username.trim().toLowerCase() === currentCreds.username.toLowerCase() ||
                            loginForm.username.trim().toLowerCase() === currentCreds.email.toLowerCase();
    const isValidPassword = loginForm.password === currentCreds.password;

    if (isValidUsername && isValidPassword) {
      setAdminSession(true);
      setIsAuthenticated(true);
      showAdminToast(`Selamat datang kembali, ${currentCreds.name}!`);
    } else {
      setLoginError('Username atau kata sandi tidak cocok. Silakan periksa kembali.');
    }
  };

  const handleLogout = () => {
    setAdminSession(false);
    setIsAuthenticated(false);
    showAdminToast('Anda telah berhasil keluar dari Admin Dashboard.', 'info');
  };

  // Fill default credentials for quick testing
  const handleFillDemoCreds = () => {
    const creds = getAdminCredentials();
    setLoginForm({
      username: creds.username,
      password: creds.password
    });
    setLoginError('');
  };

  // =========================================================================
  // PRODUCT MANAGEMENT LOGIC
  // =========================================================================
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProductImageUrl, setNewProductImageUrl] = useState('');
  const [productForm, setProductForm] = useState({
    id: '',
    name: '',
    slug: '',
    brand: 'Sanubari Roastery',
    category: 'filter-beans',
    price: 0,
    originalPrice: 0,
    stock: 25,
    rating: 4.9,
    tagline: '',
    description: '',
    images: [],
    badge: 'BARU'
  });

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCategory = productCategoryFilter === 'all' || p.category === productCategoryFilter;
      const matchSearch = productSearch.trim() === '' || 
        p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.brand.toLowerCase().includes(productSearch.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [products, productCategoryFilter, productSearch]);

  const handleOpenAddProduct = () => {
    const newId = `akm-prod-${Date.now()}`;
    setEditingProduct(null);
    setNewProductImageUrl('');
    setProductForm({
      id: newId,
      name: '',
      slug: `produk-${Date.now()}`,
      brand: 'Sanubari Roastery',
      category: 'filter-beans',
      price: 100000,
      originalPrice: 120000,
      stock: 30,
      rating: 5.0,
      tagline: 'Produk kurasi terbaik Sanubari Roastery Malang',
      description: 'Deskripsi lengkap peralatan atau biji kopi pilihan dengan mutu specialty grade.',
      images: ['https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80'],
      badge: 'TERLARIS'
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod);
    setNewProductImageUrl('');
    const existingImages = Array.isArray(prod.images) && prod.images.length > 0 
      ? [...prod.images] 
      : (prod.image ? [prod.image] : ['https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80']);

    setProductForm({
      id: prod.id,
      name: prod.name,
      slug: prod.slug || prod.id,
      brand: prod.brand,
      category: prod.category,
      price: prod.price,
      originalPrice: prod.originalPrice || prod.price,
      stock: prod.stock ?? 25,
      rating: prod.rating || 4.9,
      tagline: prod.tagline || '',
      description: prod.description || '',
      images: existingImages,
      badge: prod.badges?.[0] || prod.badge || ''
    });
    setIsProductModalOpen(true);
  };

  // Upload product images from device / file picker
  const handleProductImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    try {
      const compressedList = [];
      for (const file of files) {
        const compressed = await compressImageFile(file, 1000, 1000, 0.82);
        compressedList.push(compressed);
      }
      setProductForm((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...compressedList]
      }));
      showAdminToast(`${compressedList.length} foto produk berhasil diunggah!`);
      e.target.value = '';
    } catch (err) {
      alert('Gagal mengupload foto: ' + err.message);
    }
  };

  // Add image via URL
  const handleAddProductImageUrl = () => {
    if (!newProductImageUrl.trim()) return;
    setProductForm((prev) => ({
      ...prev,
      images: [...(prev.images || []), newProductImageUrl.trim()]
    }));
    setNewProductImageUrl('');
    showAdminToast('Link gambar ditambahkan ke galeri!');
  };

  // Delete individual image from product
  const handleRemoveProductImage = (idxToRemove) => {
    setProductForm((prev) => {
      const updated = (prev.images || []).filter((_, idx) => idx !== idxToRemove);
      return { ...prev, images: updated };
    });
    showAdminToast('Foto dihapus dari galeri produk.');
  };

  // Set selected image as primary (move to index 0)
  const handleSetPrimaryProductImage = (idxToPrimary) => {
    setProductForm((prev) => {
      const current = [...(prev.images || [])];
      const [chosen] = current.splice(idxToPrimary, 1);
      return { ...prev, images: [chosen, ...current] };
    });
    showAdminToast('Foto utama thumbnail berhasil diubah!');
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!productForm.name.trim()) {
      alert('Nama produk wajib diisi');
      return;
    }

    const finalImages = (productForm.images && productForm.images.length > 0)
      ? productForm.images
      : ['https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80'];

    const updatedProduct = {
      id: productForm.id,
      name: productForm.name.trim(),
      slug: productForm.slug.trim() || productForm.id,
      brand: productForm.brand,
      category: productForm.category,
      price: Number(productForm.price),
      originalPrice: Number(productForm.originalPrice),
      stock: Number(productForm.stock),
      rating: Number(productForm.rating),
      tagline: productForm.tagline.trim(),
      description: productForm.description.trim(),
      images: finalImages,
      badges: productForm.badge ? [productForm.badge] : []
    };

    let newProductsList;
    if (editingProduct) {
      newProductsList = products.map((p) => p.id === editingProduct.id ? { ...p, ...updatedProduct } : p);
      showAdminToast(`Produk "${updatedProduct.name}" berhasil diperbarui!`);
    } else {
      newProductsList = [updatedProduct, ...products];
      showAdminToast(`Produk baru "${updatedProduct.name}" berhasil ditambahkan!`);
    }

    setProducts(newProductsList);
    saveStoredProducts(newProductsList);
    setIsProductModalOpen(false);
  };

  const handleDeleteProduct = (productId, productName) => {
    if (window.confirm(`Yakin ingin menghapus produk "${productName}" dari katalog toko?`)) {
      const newProductsList = products.filter((p) => p.id !== productId);
      setProducts(newProductsList);
      saveStoredProducts(newProductsList);
      showAdminToast(`Produk "${productName}" telah dihapus.`, 'info');
    }
  };

  const handleResetDefaultProducts = () => {
    if (window.confirm('Kembalikan semua katalog produk ke default toko (30 produk asli)? Perubahan custom Anda akan di-reset.')) {
      setProducts(PRODUCTS);
      saveStoredProducts(PRODUCTS);
      showAdminToast('Katalog produk berhasil di-reset ke versi bawaan toko.');
    }
  };

  // =========================================================================
  // ORDERS MANAGEMENT LOGIC
  // =========================================================================
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [selectedOrderModal, setSelectedOrderModal] = useState(null);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (orderStatusFilter === 'all') return true;
      return o.status === orderStatusFilter;
    });
  }, [orders, orderStatusFilter]);

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    const updated = orders.map((o) => o.id === orderId ? { ...o, status: newStatus } : o);
    setOrders(updated);
    saveStoredOrders(updated);
    showAdminToast(`Status pesanan ${orderId} diubah menjadi: ${newStatus}`);
  };

  // =========================================================================
  // HERO BANNER SLIDES LOGIC (UPLOAD, EDIT, HAPUS)
  // =========================================================================
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [bannerForm, setBannerForm] = useState({
    id: '',
    title: '',
    ctaLink: '/kategori/all',
    image: '',
    fallbackImage: ''
  });

  const handleOpenAddBanner = () => {
    const newSlideId = `banner-${Date.now()}`;
    setEditingBanner(null);
    setBannerForm({
      id: newSlideId,
      title: 'Promo Spesial Alat Kopi',
      ctaLink: '/kategori/all',
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1600&q=80',
      fallbackImage: ''
    });
    setIsBannerModalOpen(true);
  };

  const handleOpenEditBanner = (slide) => {
    setEditingBanner(slide);
    setBannerForm({
      id: slide.id,
      title: slide.title,
      ctaLink: slide.ctaLink || '/kategori/all',
      image: slide.image,
      fallbackImage: slide.fallbackImage || ''
    });
    setIsBannerModalOpen(true);
  };

  const handleBannerFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageFile(file, 1600, 900, 0.85);
      setBannerForm((prev) => ({
        ...prev,
        image: compressed,
        fallbackImage: compressed
      }));
      showAdminToast('File banner berhasil diunggah!');
      e.target.value = '';
    } catch (err) {
      alert('Gagal mengupload banner: ' + err.message);
    }
  };

  const handleDeleteBanner = (slideId, title) => {
    if (heroSlides.length <= 1) {
      alert('Minimal harus ada 1 banner slide di homepage.');
      return;
    }
    if (window.confirm(`Hapus slide banner "${title}"?`)) {
      const updated = heroSlides.filter((s) => s.id !== slideId);
      setHeroSlides(updated);
      saveStoredHeroSlides(updated);
      showAdminToast(`Banner "${title}" berhasil dihapus.`);
    }
  };

  const handleSaveBanner = (e) => {
    e.preventDefault();
    if (!bannerForm.title.trim() || !bannerForm.image.trim()) {
      alert('Judul dan Gambar Banner wajib diisi');
      return;
    }

    let updatedSlides;
    if (editingBanner) {
      updatedSlides = heroSlides.map((s) => {
        if (s.id === editingBanner.id) {
          return {
            ...s,
            title: bannerForm.title.trim(),
            ctaLink: bannerForm.ctaLink.trim(),
            image: bannerForm.image.trim(),
            fallbackImage: bannerForm.fallbackImage.trim() || bannerForm.image.trim()
          };
        }
        return s;
      });
      showAdminToast(`Banner "${bannerForm.title}" berhasil diperbarui!`);
    } else {
      const newSlide = {
        id: bannerForm.id,
        title: bannerForm.title.trim(),
        ctaLink: bannerForm.ctaLink.trim(),
        image: bannerForm.image.trim(),
        fallbackImage: bannerForm.fallbackImage.trim() || bannerForm.image.trim()
      };
      updatedSlides = [...heroSlides, newSlide];
      showAdminToast(`Banner baru "${bannerForm.title}" berhasil ditambahkan!`);
    }

    setHeroSlides(updatedSlides);
    saveStoredHeroSlides(updatedSlides);
    setIsBannerModalOpen(false);
  };

  const handleResetDefaultBanners = () => {
    if (window.confirm('Reset seluruh banner slider ke bawaan?')) {
      setHeroSlides(HERO_SLIDES);
      saveStoredHeroSlides(HERO_SLIDES);
      showAdminToast('Banner slider berhasil di-reset.');
    }
  };

  // =========================================================================
  // SHOWROOM & SLOW BAR GALLERY LOGIC (UPLOAD, EDIT, HAPUS/RESET)
  // =========================================================================
  const handleShowroomPhotoUpload = async (idx, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageFile(file, 1200, 1000, 0.85);
      const updated = [...showroomPhotos];
      updated[idx] = { ...updated[idx], image: compressed };
      setShowroomPhotos(updated);
      saveStoredShowroomPhotos(updated);
      showAdminToast(`Foto slot "${updated[idx].title}" berhasil diupload dan disimpan!`);
      e.target.value = '';
    } catch (err) {
      alert('Gagal mengupload foto showroom: ' + err.message);
    }
  };

  const handleResetShowroomSlot = (idx) => {
    const defaultPhoto = DEFAULT_SHOWROOM_PHOTOS[idx] || DEFAULT_SHOWROOM_PHOTOS[0];
    const updated = [...showroomPhotos];
    updated[idx] = { ...updated[idx], image: defaultPhoto.image };
    setShowroomPhotos(updated);
    saveStoredShowroomPhotos(updated);
    showAdminToast(`Foto slot "${updated[idx].title}" direset ke bawaan.`);
  };

  const handleUpdateShowroomSlotText = (idx, field, value) => {
    const updated = [...showroomPhotos];
    updated[idx] = { ...updated[idx], [field]: value };
    setShowroomPhotos(updated);
  };

  const handleSaveShowroomPhotos = (e) => {
    e.preventDefault();
    saveStoredShowroomPhotos(showroomPhotos);
    showAdminToast('Seluruh data galeri showroom berhasil disimpan live!');
  };

  // =========================================================================
  // STORE SETTINGS LOGIC (TERMASUK LOGO TOKO)
  // =========================================================================
  const [storeSettingsForm, setStoreSettingsForm] = useState({ ...storeInfo });

  const handleStoreLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageFile(file, 400, 400, 0.9);
      setStoreSettingsForm((prev) => ({ ...prev, logo: compressed }));
      showAdminToast('Logo toko berhasil diupload!');
      e.target.value = '';
    } catch (err) {
      alert('Gagal mengupload logo: ' + err.message);
    }
  };

  const handleResetStoreLogo = () => {
    setStoreSettingsForm((prev) => ({ ...prev, logo: '' }));
    showAdminToast('Logo toko direset ke default icon.');
  };

  const handleSaveStoreSettings = (e) => {
    e.preventDefault();
    setStoreInfo(storeSettingsForm);
    saveStoredStoreInfo(storeSettingsForm);
    showAdminToast('Pengaturan identitas toko & kontak berhasil disimpan!');
  };

  // =========================================================================
  // ADMIN SECURITY / PASSWORD CHANGE LOGIC
  // =========================================================================
  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newUsername: credentials.username,
    newPassword: '',
    confirmPassword: ''
  });

  const handleChangeCredentials = (e) => {
    e.preventDefault();
    const current = getAdminCredentials();

    if (securityForm.currentPassword !== current.password) {
      alert('Kata sandi saat ini tidak cocok!');
      return;
    }

    if (securityForm.newPassword) {
      if (securityForm.newPassword.length < 6) {
        alert('Kata sandi baru minimal 6 karakter');
        return;
      }
      if (securityForm.newPassword !== securityForm.confirmPassword) {
        alert('Konfirmasi kata sandi baru tidak sama!');
        return;
      }
    }

    const updatedCreds = {
      ...current,
      username: securityForm.newUsername.trim() || current.username,
      password: securityForm.newPassword ? securityForm.newPassword : current.password
    };

    saveAdminCredentials(updatedCreds);
    setCredentials(updatedCreds);
    setSecurityForm({
      currentPassword: '',
      newUsername: updatedCreds.username,
      newPassword: '',
      confirmPassword: ''
    });
    showAdminToast('Username & Kata Sandi Admin berhasil diperbarui!');
  };

  // =========================================================================
  // PROMO COUPONS LOGIC
  // =========================================================================
  const [newCouponForm, setNewCouponForm] = useState({
    code: '',
    discountPercent: 10,
    minSpend: 100000,
    maxDiscount: 100000
  });

  const handleAddCoupon = (e) => {
    e.preventDefault();
    if (!newCouponForm.code.trim()) return;

    const newCp = {
      id: `cp-${Date.now()}`,
      code: newCouponForm.code.trim().toUpperCase(),
      discountPercent: Number(newCouponForm.discountPercent),
      minSpend: Number(newCouponForm.minSpend),
      maxDiscount: Number(newCouponForm.maxDiscount),
      isActive: true,
      usageCount: 0
    };

    const updated = [newCp, ...coupons];
    setCoupons(updated);
    saveStoredCoupons(updated);
    setNewCouponForm({ code: '', discountPercent: 10, minSpend: 100000, maxDiscount: 100000 });
    showAdminToast(`Kupon diskon ${newCp.code} berhasil ditambahkan!`);
  };

  const handleToggleCoupon = (couponId) => {
    const updated = coupons.map((c) => c.id === couponId ? { ...c, isActive: !c.isActive } : c);
    setCoupons(updated);
    saveStoredCoupons(updated);
    showAdminToast('Status kupon diperbarui');
  };

  const handleDeleteCoupon = (couponId, code) => {
    if (window.confirm(`Hapus kupon promo ${code}?`)) {
      const updated = coupons.filter((c) => c.id !== couponId);
      setCoupons(updated);
      saveStoredCoupons(updated);
      showAdminToast(`Kupon ${code} telah dihapus.`);
    }
  };

  // =========================================================================
  // RENDER: LOGIN GATEWAY (If Not Authenticated)
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#071322] text-slate-100 flex flex-col justify-center items-center p-4 selection:bg-[#0070f3] selection:text-white">
        
        {/* Top Floating Alert if available */}
        {toast && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#0e274b] border border-[#38bdf8] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-in text-sm font-semibold">
            <CheckCircle2 className="w-5 h-5 text-[#38bdf8]" />
            <span>{toast.message}</span>
          </div>
        )}

        <div className="w-full max-w-md bg-[#0c1c33] border border-[#173357] rounded-3xl p-6 sm:p-8 shadow-2xl shadow-blue-950/60 relative backdrop-blur-xl">
          
          {/* Brand Logo & Header */}
          <div className="text-center space-y-3 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0070f3] to-[#38bdf8] flex items-center justify-center mx-auto shadow-lg shadow-blue-500/20">
              <Coffee className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Portal Admin AKM
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Alat Kopi Malang — Partner Sanubari Roastery
              </p>
            </div>
          </div>

          {/* Login Error Notification */}
          {loginError && (
            <div className="p-3.5 mb-5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Username / Email Admin
              </label>
              <input
                type="text"
                required
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                placeholder="admin atau email admin"
                className="w-full px-4 py-3 bg-[#071322] border border-[#1b3a63] focus:border-[#0084ff] text-white rounded-xl text-sm focus:outline-none transition-all shadow-inner"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  required
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  placeholder="Masukkan kata sandi..."
                  className="w-full px-4 py-3 bg-[#071322] border border-[#1b3a63] focus:border-[#0084ff] text-white rounded-xl text-sm focus:outline-none pr-10 transition-all shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-gradient-to-r from-[#0070f3] to-[#0052cc] hover:from-[#0084ff] hover:to-[#0060e6] text-white font-bold rounded-xl text-sm shadow-lg shadow-[#0070f3]/30 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer mt-2"
            >
              Masuk ke Dashboard Admin →
            </button>
          </form>

          {/* Quick Demo Credentials Helper */}
          <div className="mt-6 pt-5 border-t border-[#173357] text-center space-y-2.5">
            <p className="text-[11px] text-slate-400">
              Kredensial Default: <strong className="text-white">admin</strong> / <strong className="text-white">alatkopimalang2026</strong>
            </p>
            <button
              type="button"
              onClick={handleFillDemoCreds}
              className="text-xs text-[#38bdf8] hover:text-white font-semibold underline underline-offset-4 cursor-pointer transition-colors"
            >
              Klik di sini untuk isi otomatis akun default
            </button>
          </div>

          {/* Back to Storefront Link */}
          <div className="mt-6 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              <span>← Kembali ke Halaman Toko</span>
            </Link>
          </div>

        </div>

      </div>
    );
  }

  // =========================================================================
  // RENDER: AUTHENTICATED ADMIN DASHBOARD
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#071322] text-slate-100 flex font-sans selection:bg-[#0070f3] selection:text-white">
      
      {/* Toast Feedback Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-[#0e274b] border border-[#38bdf8] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-in text-sm font-semibold">
          <CheckCircle2 className="w-5 h-5 text-[#38bdf8]" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* ===================================================================== */}
      {/* SIDEBAR NAVIGATION (Desktop persistent, Mobile drawer) */}
      {/* ===================================================================== */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0a182d] border-r border-[#142944] flex flex-col justify-between transition-transform duration-300 md:translate-x-0 ${
        mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div>
          {/* Sidebar Brand Header */}
          <div className="p-5 border-b border-[#142944] flex items-center justify-between">
            <Link to="/admin" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0070f3] to-[#38bdf8] flex items-center justify-center shadow-md">
                <Coffee className="w-5 h-5 text-white" />
              </div>
              <div className="leading-tight">
                <span className="font-extrabold text-white text-sm block tracking-wide">
                  Alat Kopi Malang
                </span>
                <span className="text-[10px] text-[#38bdf8] font-bold tracking-wider uppercase">
                  Admin Control Panel
                </span>
              </div>
            </Link>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="md:hidden text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Admin User Badge */}
          <div className="p-4 mx-3 my-3 rounded-2xl bg-[#0e213b] border border-[#1a385f] flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#0070f3] flex items-center justify-center text-white font-black text-sm">
              {credentials.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{credentials.name}</p>
              <p className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {credentials.role}
              </p>
            </div>
          </div>

          {/* Navigation Menu Links */}
          <nav className="px-3 space-y-1 text-xs font-semibold">
            {[
              { id: 'overview', label: 'Ringkasan Toko', icon: LayoutDashboard },
              { id: 'products', label: 'Kelola Produk & Biji', icon: Package, badge: products.length },
              { id: 'orders', label: 'Pesanan Pelanggan', icon: ShoppingBag, badge: orders.filter(o => o.status === 'Diproses').length },
              { id: 'banners', label: 'Banner Slider Homepage', icon: ImageIcon, badge: heroSlides.length },
              { id: 'showroom', label: 'Galeri Foto Showroom', icon: Camera, badge: showroomPhotos.length },
              { id: 'coupons', label: 'Kupon Promo & Voucher', icon: Ticket, badge: coupons.length },
              { id: 'settings', label: 'Pengaturan Toko & Logo', icon: Settings },
              { id: 'security', label: 'Keamanan Akun Admin', icon: ShieldCheck },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#0070f3] to-[#0052cc] text-white shadow-md shadow-[#0070f3]/25 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-[#0e213b]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#38bdf8]'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-white text-[#0070f3]' : 'bg-[#153257] text-[#38bdf8]'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: View Store & Logout */}
        <div className="p-4 border-t border-[#142944] space-y-2">
          <Link
            to="/"
            target="_blank"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#0e213b] hover:bg-[#142e50] border border-[#1b3a63] text-xs font-semibold text-slate-200 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span>Lihat Website Toko</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar Akun Admin</span>
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile sidebar */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-xs"
        />
      )}

      {/* ===================================================================== */}
      {/* MAIN ADMIN WORKSPACE */}
      {/* ===================================================================== */}
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
        
        {/* Top Header Bar */}
        <header className="sticky top-0 z-20 bg-[#0a182d]/90 backdrop-blur-md border-b border-[#142944] px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 -ml-2 rounded-xl text-slate-300 hover:text-white md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-white capitalize">
                {activeTab === 'overview' && 'Dashboard Ringkasan'}
                {activeTab === 'products' && 'Manajemen Produk & Biji Kopi'}
                {activeTab === 'orders' && 'Daftar Pesanan & Transaksi'}
                {activeTab === 'banners' && 'Banner Slider Homepage'}
                {activeTab === 'showroom' && 'Galeri Showroom & Slow Bar'}
                {activeTab === 'coupons' && 'Kupon Diskon & Promo'}
                {activeTab === 'settings' && 'Pengaturan Toko & Logo'}
                {activeTab === 'security' && 'Keamanan & Akses Admin'}
              </h2>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Kelola konten live website alatkopimalang.co.id
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0e213b] border border-[#1b3a63] text-xs font-semibold text-slate-200 hover:text-white hover:border-[#38bdf8]/50 transition-all shadow-xs"
            >
              <span>Lihat Toko Live</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#38bdf8]" />
            </Link>

            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-400 rounded-xl hover:bg-[#0e213b] transition-colors"
              title="Keluar Admin"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Content Body Area */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
          
          {/* ----------------------------------------------------------------- */}
          {/* TAB 1: OVERVIEW DASHBOARD */}
          {/* ----------------------------------------------------------------- */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Stat Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-[#0c1c33] border border-[#173357] shadow-lg">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Total Penjualan</span>
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    {formatRupiah(orders.reduce((acc, o) => acc + (o.total || 0), 0))}
                  </h3>
                  <p className="text-[11px] text-emerald-400 mt-1 font-semibold flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> +18.5% dari bulan lalu
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#0c1c33] border border-[#173357] shadow-lg">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Pesanan Masuk</span>
                    <ShoppingBag className="w-4 h-4 text-[#38bdf8]" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    {orders.length} Pesanan
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {orders.filter(o => o.status === 'Diproses').length} pesanan perlu diproses
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#0c1c33] border border-[#173357] shadow-lg">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Katalog Produk</span>
                    <Package className="w-4 h-4 text-amber-400" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    {products.length} Item
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1">
                    9 kategori peralatan &amp; biji kopi
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#0c1c33] border border-[#173357] shadow-lg">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Showroom Tlogomas</span>
                    <Coffee className="w-4 h-4 text-[#0070f3]" />
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-white">
                    Buka Setiap Hari
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1">
                    09.00 - 23.00 WIB (Slow Bar Aktif)
                  </p>
                </div>
              </div>

              {/* Quick Actions Bar */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0c1c33] to-[#0e274b] border border-[#173357] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="text-sm font-bold text-white">Kelola Cepat Konten Website</h4>
                  <p className="text-xs text-slate-300">Pilih menu aksi cepat untuk memperbarui katalog atau promosi toko.</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleOpenAddProduct}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#0070f3] to-[#0052cc] hover:from-[#0084ff] hover:to-[#0060e6] text-white text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Produk Baru</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('banners')}
                    className="px-4 py-2 rounded-xl bg-[#10223b] hover:bg-[#162e50] border border-[#1e3a5f] text-white text-xs font-semibold cursor-pointer"
                  >
                    Ganti Banner Slider
                  </button>
                </div>
              </div>

              {/* Recent Orders Preview */}
              <div className="rounded-2xl bg-[#0c1c33] border border-[#173357] overflow-hidden shadow-lg">
                <div className="p-5 border-b border-[#173357] flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">Pesanan Pelanggan Terbaru</h3>
                    <p className="text-xs text-slate-400">Daftar transaksi pesanan masuk secara live</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-[#38bdf8] hover:text-white font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <span>Lihat Semua Pesanan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#071322] text-slate-400 uppercase tracking-wider text-[10px] border-b border-[#173357]">
                      <tr>
                        <th className="py-3 px-4">ID Pesanan</th>
                        <th className="py-3 px-4">Pelanggan</th>
                        <th className="py-3 px-4">Total</th>
                        <th className="py-3 px-4">Pembayaran</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#173357] text-slate-200">
                      {orders.slice(0, 4).map((order) => (
                        <tr key={order.id} className="hover:bg-[#0e213b]/50 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-[#38bdf8]">{order.id}</td>
                          <td className="py-3.5 px-4">
                            <p className="font-bold text-white">{order.customerName}</p>
                            <p className="text-[11px] text-slate-400">{order.phone}</p>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-white">{formatRupiah(order.total)}</td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded-full bg-[#10223b] border border-[#1e3a5f] text-[10px]">
                              {order.paymentMethod}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              order.status === 'Selesai' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' :
                              order.status === 'Dikirim' ? 'bg-blue-950 text-blue-400 border border-blue-500/30' :
                              order.status === 'Diproses' ? 'bg-amber-950 text-amber-400 border border-amber-500/30' :
                              'bg-slate-800 text-slate-400 border border-slate-700'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => {
                                setSelectedOrderModal(order);
                              }}
                              className="px-2.5 py-1 bg-[#10223b] hover:bg-[#162e50] text-[#38bdf8] rounded-lg text-xs font-semibold cursor-pointer"
                            >
                              Detail
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ----------------------------------------------------------------- */}
          {/* TAB 2: PRODUCTS MANAGEMENT */}
          {/* ----------------------------------------------------------------- */}
          {activeTab === 'products' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Product Actions Header */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="flex flex-1 items-center gap-3">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Cari nama alat / biji kopi..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="w-full bg-[#0c1c33] border border-[#173357] text-white rounded-xl py-2 pl-9 pr-4 text-xs focus:outline-none focus:border-[#0084ff]"
                    />
                  </div>
                  <select
                    value={productCategoryFilter}
                    onChange={(e) => setProductCategoryFilter(e.target.value)}
                    className="bg-[#0c1c33] border border-[#173357] text-white rounded-xl py-2 px-3 text-xs focus:outline-none cursor-pointer"
                  >
                    <option value="all">Semua Kategori</option>
                    <option value="filter-beans">Filter Beans</option>
                    <option value="espresso-beans">Espresso Beans</option>
                    <option value="manual-brew">Manual Brew</option>
                    <option value="grinder">Grinder Kopi</option>
                    <option value="espresso-tools">Espresso & Lever</option>
                    <option value="kettle">Kettle Gooseneck</option>
                    <option value="scale">Scale & Timer</option>
                    <option value="accessories">Aksesoris & Filter</option>
                    <option value="bundles">Paket Starter Kit</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleResetDefaultProducts}
                    title="Kembalikan 30 produk default toko"
                    className="px-3 py-2 rounded-xl bg-[#0e213b] hover:bg-[#142e50] border border-[#1b3a63] text-xs font-semibold text-slate-300 flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Reset Default</span>
                  </button>
                  <button
                    onClick={handleOpenAddProduct}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#0070f3] to-[#0052cc] hover:from-[#0084ff] hover:to-[#0060e6] text-white text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Produk</span>
                  </button>
                </div>
              </div>

              {/* Products Table */}
              <div className="rounded-2xl bg-[#0c1c33] border border-[#173357] overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#071322] text-slate-400 uppercase tracking-wider text-[10px] border-b border-[#173357]">
                      <tr>
                        <th className="py-3 px-4">Produk</th>
                        <th className="py-3 px-4">Kategori</th>
                        <th className="py-3 px-4">Harga Jual</th>
                        <th className="py-3 px-4">Stok</th>
                        <th className="py-3 px-4">Rating</th>
                        <th className="py-3 px-4 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#173357] text-slate-200">
                      {filteredProducts.map((prod) => (
                        <tr key={prod.id} className="hover:bg-[#0e213b]/50 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={prod.images?.[0] || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=150&q=80'}
                                alt={prod.name}
                                className="w-10 h-10 rounded-lg object-cover bg-slate-900 border border-[#1b3a63] shrink-0"
                              />
                              <div className="min-w-0">
                                <p className="font-bold text-white line-clamp-1">{prod.name}</p>
                                <span className="text-[10px] text-[#38bdf8] font-semibold uppercase">{prod.brand}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-full bg-[#10223b] border border-[#1e3a5f] text-[10px] text-slate-300">
                              {prod.category}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-bold text-white">
                            {formatRupiah(prod.price)}
                            {prod.originalPrice > prod.price && (
                              <span className="block text-[10px] text-slate-500 line-through font-normal">
                                {formatRupiah(prod.originalPrice)}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`font-semibold ${prod.stock <= 5 ? 'text-red-400' : 'text-emerald-400'}`}>
                              {prod.stock ?? 25} pcs
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            ⭐ {prod.rating || 4.9}
                          </td>
                          <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                            <button
                              onClick={() => handleOpenEditProduct(prod)}
                              className="p-1.5 rounded-lg bg-[#10223b] hover:bg-[#162e50] text-[#38bdf8] transition-colors cursor-pointer"
                              title="Edit Produk"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(prod.id, prod.name)}
                              className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-950 text-red-400 transition-colors cursor-pointer"
                              title="Hapus Produk"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ----------------------------------------------------------------- */}
          {/* TAB 3: ORDERS MANAGEMENT */}
          {/* ----------------------------------------------------------------- */}
          {activeTab === 'orders' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {['all', 'Diproses', 'Dikirim', 'Selesai', 'Dibatalkan'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setOrderStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                        orderStatusFilter === st
                          ? 'bg-[#0070f3] text-white shadow-md'
                          : 'bg-[#0c1c33] text-slate-300 hover:text-white border border-[#173357]'
                      }`}
                    >
                      {st === 'all' ? 'Semua Pesanan' : st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-[#0c1c33] border border-[#173357] overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#071322] text-slate-400 uppercase tracking-wider text-[10px] border-b border-[#173357]">
                      <tr>
                        <th className="py-3 px-4">No. Order & Tanggal</th>
                        <th className="py-3 px-4">Pelanggan</th>
                        <th className="py-3 px-4">Item Pesanan</th>
                        <th className="py-3 px-4">Total</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#173357] text-slate-200">
                      {filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-[#0e213b]/50 transition-colors">
                          <td className="py-3.5 px-4 font-mono">
                            <span className="font-bold text-[#38bdf8] block">{order.id}</span>
                            <span className="text-[10px] text-slate-400">{order.date}</span>
                          </td>
                          <td className="py-3.5 px-4">
                            <p className="font-bold text-white">{order.customerName}</p>
                            <p className="text-[11px] text-slate-400">{order.phone}</p>
                          </td>
                          <td className="py-3.5 px-4 max-w-xs">
                            <p className="truncate text-slate-300">
                              {order.items?.map(it => `${it.name} (${it.quantity}x)`).join(', ')}
                            </p>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-white">
                            {formatRupiah(order.total)}
                          </td>
                          <td className="py-3.5 px-4">
                            <select
                              value={order.status}
                              onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                              className="bg-[#071322] border border-[#1b3a63] text-xs font-semibold rounded-lg px-2 py-1 text-slate-200 cursor-pointer focus:outline-none"
                            >
                              <option value="Menunggu Pembayaran">Menunggu Pembayaran</option>
                              <option value="Diproses">Diproses</option>
                              <option value="Dikirim">Dikirim</option>
                              <option value="Selesai">Selesai</option>
                              <option value="Dibatalkan">Dibatalkan</option>
                            </select>
                          </td>
                          <td className="py-3.5 px-4 text-right space-x-2">
                            <button
                              onClick={() => setSelectedOrderModal(order)}
                              className="px-2.5 py-1 bg-[#10223b] hover:bg-[#162e50] text-[#38bdf8] rounded-lg text-xs font-semibold cursor-pointer"
                            >
                              Invoice
                            </button>
                            <a
                              href={`https://wa.me/${order.phone?.replace(/[^0-9]/g, '')}?text=Halo%20kak%20${encodeURIComponent(order.customerName)},%20kami%20dari%20Alat%20Kopi%20Malang%20mengenai%20pesanan%20${order.id}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-950/70 hover:bg-emerald-900 text-emerald-400 rounded-lg text-xs font-semibold border border-emerald-500/30"
                              title="Chat WhatsApp Pelanggan"
                            >
                              <MessageCircle className="w-3 h-3" />
                              <span>WA</span>
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------------- */}
          {/* TAB 4: HERO BANNERS MANAGEMENT */}
          {/* ----------------------------------------------------------------- */}
          {activeTab === 'banners' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-white">Banner Slider di Beranda (Homepage)</h3>
                  <p className="text-xs text-slate-400">Upload, edit gambar slide, atur link CTA, atau tambah slide banner baru.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleOpenAddBanner}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#0070f3] to-[#0052cc] hover:from-[#0084ff] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Banner Baru</span>
                  </button>
                  <button
                    onClick={handleResetDefaultBanners}
                    className="px-3 py-1.5 rounded-xl bg-[#0e213b] hover:bg-[#142e50] border border-[#1b3a63] text-xs font-semibold text-slate-300 flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Default</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {heroSlides.map((slide, idx) => (
                  <div key={slide.id} className="rounded-2xl bg-[#0c1c33] border border-[#173357] overflow-hidden shadow-lg p-4 space-y-3">
                    <div className="relative h-44 rounded-xl overflow-hidden bg-slate-900 border border-[#1b3a63] group">
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          if (slide.fallbackImage) e.target.src = slide.fallbackImage;
                        }}
                      />
                      <span className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold">
                        Slide #{idx + 1}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-bold text-white truncate">{slide.title}</h4>
                        <p className="text-[11px] text-[#38bdf8] truncate">Tautan CTA: {slide.ctaLink}</p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleOpenEditBanner(slide)}
                          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#0070f3] to-[#0052cc] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteBanner(slide.id, slide.title)}
                          className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded-xl transition-colors cursor-pointer"
                          title="Hapus Slide Banner"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------------- */}
          {/* TAB: SHOWROOM & SLOW BAR GALLERY (UPLOAD, EDIT, HAPUS FOTO) */}
          {/* ----------------------------------------------------------------- */}
          {activeTab === 'showroom' && (
            <div className="space-y-6 animate-fade-in max-w-5xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-white">Galeri Foto Showroom &amp; Slow Bar Malang</h3>
                  <p className="text-xs text-slate-400">
                    Upload foto langsung dari perangkat (otomatis terkompresi), ganti link gambar, atau reset foto setiap slot showroom.
                  </p>
                </div>
                <button
                  onClick={handleSaveShowroomPhotos}
                  className="px-4 py-2 bg-gradient-to-r from-[#0070f3] to-[#0052cc] hover:from-[#0084ff] text-white text-xs font-bold rounded-xl shadow-md cursor-pointer flex items-center gap-2 self-start sm:self-auto"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan Galeri</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {showroomPhotos.map((slot, idx) => (
                  <div key={slot.id || `sr-${idx}`} className="rounded-2xl bg-[#0c1c33] border border-[#173357] p-5 shadow-lg flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-full bg-[#153257] text-[#38bdf8] text-[10px] font-bold uppercase tracking-wider">
                          Slot #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleResetShowroomSlot(idx)}
                          className="text-[11px] text-slate-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer transition-colors"
                          title="Kembalikan ke foto bawaan"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Reset Foto</span>
                        </button>
                      </div>

                      {/* Photo Preview Box */}
                      <div className="relative h-48 rounded-xl overflow-hidden bg-slate-900 border border-[#1b3a63] group">
                        <img
                          src={slot.image}
                          alt={slot.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                          <p className="text-xs font-bold text-white line-clamp-1">{slot.title}</p>
                        </div>
                      </div>

                      {/* Upload Photo Button */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1.5">
                          Upload Foto Baru (Dari HP / Komputer)
                        </label>
                        <label className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-[#071322] hover:bg-[#0e213b] border border-[#1b3a63] hover:border-[#38bdf8] text-xs font-semibold text-slate-200 cursor-pointer transition-all">
                          <Upload className="w-3.5 h-3.5 text-[#38bdf8]" />
                          <span>Pilih Foto dari Galeri</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleShowroomPhotoUpload(idx, e)}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {/* Or Image URL */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">
                          Atau URL Gambar
                        </label>
                        <input
                          type="text"
                          value={slot.image}
                          onChange={(e) => handleUpdateShowroomSlotText(idx, 'image', e.target.value)}
                          placeholder="https://..."
                          className="w-full bg-[#071322] border border-[#1b3a63] text-white px-3 py-2 rounded-xl text-xs focus:border-[#0084ff] focus:outline-none"
                        />
                      </div>

                      {/* Slot Title */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">
                          Judul Spot / Area
                        </label>
                        <input
                          type="text"
                          value={slot.title}
                          onChange={(e) => handleUpdateShowroomSlotText(idx, 'title', e.target.value)}
                          className="w-full bg-[#071322] border border-[#1b3a63] text-white px-3 py-2 rounded-xl text-xs focus:border-[#0084ff] focus:outline-none"
                        />
                      </div>

                      {/* Slot Description */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">
                          Keterangan Spot
                        </label>
                        <textarea
                          rows={2}
                          value={slot.desc}
                          onChange={(e) => handleUpdateShowroomSlotText(idx, 'desc', e.target.value)}
                          className="w-full bg-[#071322] border border-[#1b3a63] text-white px-3 py-2 rounded-xl text-xs focus:border-[#0084ff] focus:outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleResetShowroomSlot(idx)}
                      className="w-full py-1.5 text-center rounded-lg bg-red-950/20 hover:bg-red-950/40 border border-red-800/40 text-red-300 text-[11px] font-semibold cursor-pointer transition-colors"
                    >
                      Hapus / Reset Foto Slot Ini
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------------- */}
          {/* TAB 5: PROMO COUPONS MANAGEMENT */}
          {/* ----------------------------------------------------------------- */}
          {activeTab === 'coupons' && (
            <div className="space-y-6 animate-fade-in">
              {/* Add Coupon Form */}
              <div className="p-5 rounded-2xl bg-[#0c1c33] border border-[#173357] shadow-lg">
                <h3 className="text-sm font-bold text-white mb-3">Tambah Kupon Promo Baru</h3>
                <form onSubmit={handleAddCoupon} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Kode Voucher</label>
                    <input
                      type="text"
                      placeholder="CONTOH: AKM20"
                      value={newCouponForm.code}
                      onChange={(e) => setNewCouponForm({ ...newCouponForm, code: e.target.value })}
                      required
                      className="w-full bg-[#071322] border border-[#1b3a63] text-white px-3 py-2 rounded-xl text-xs uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Diskon (%)</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={newCouponForm.discountPercent}
                      onChange={(e) => setNewCouponForm({ ...newCouponForm, discountPercent: e.target.value })}
                      required
                      className="w-full bg-[#071322] border border-[#1b3a63] text-white px-3 py-2 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Min. Belanja (Rp)</label>
                    <input
                      type="number"
                      value={newCouponForm.minSpend}
                      onChange={(e) => setNewCouponForm({ ...newCouponForm, minSpend: e.target.value })}
                      required
                      className="w-full bg-[#071322] border border-[#1b3a63] text-white px-3 py-2 rounded-xl text-xs"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2 bg-gradient-to-r from-[#0070f3] to-[#0052cc] text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
                    >
                      + Simpan Kupon
                    </button>
                  </div>
                </form>
              </div>

              {/* Coupons List */}
              <div className="rounded-2xl bg-[#0c1c33] border border-[#173357] overflow-hidden shadow-lg">
                <div className="p-4 border-b border-[#173357]">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Daftar Voucher Aktif Toko</h4>
                </div>
                <div className="divide-y divide-[#173357]">
                  {coupons.map((cp) => (
                    <div key={cp.id} className="p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-950/60 border border-[#0070f3]/40 flex items-center justify-center">
                          <Ticket className="w-5 h-5 text-[#38bdf8]" />
                        </div>
                        <div>
                          <p className="font-mono font-bold text-white text-sm">{cp.code}</p>
                          <p className="text-[11px] text-slate-400">
                            Diskon {cp.discountPercent}% (Min. belanja {formatRupiah(cp.minSpend)})
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleToggleCoupon(cp.id)}
                          className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                            cp.isActive
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                              : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}
                        >
                          {cp.isActive ? 'Aktif' : 'Nonaktif'}
                        </button>
                        <button
                          onClick={() => handleDeleteCoupon(cp.id, cp.code)}
                          className="p-1.5 text-red-400 hover:bg-red-950 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------------- */}
          {/* TAB 6: STORE SETTINGS & CONTACT */}
          {/* ----------------------------------------------------------------- */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-fade-in max-w-4xl">
              <div className="rounded-2xl bg-[#0c1c33] border border-[#173357] p-6 shadow-lg">
                <h3 className="text-sm font-bold text-white mb-4">Pengaturan Identitas &amp; Kontak Toko</h3>
                
                <form onSubmit={handleSaveStoreSettings} className="space-y-4">
                  {/* Logo Toko Section */}
                  <div className="p-4 rounded-xl bg-[#071322] border border-[#1b3a63] space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-white">Logo &amp; Identitas Toko</h4>
                        <p className="text-[11px] text-slate-400">Upload file logo toko (PNG transparan / JPG) atau gunakan icon default.</p>
                      </div>
                      {storeSettingsForm.logo && (
                        <button
                          type="button"
                          onClick={handleResetStoreLogo}
                          className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Hapus / Reset Logo</span>
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-[#0e213b] border border-[#1b3a63] flex items-center justify-center overflow-hidden shrink-0">
                        {storeSettingsForm.logo ? (
                          <img src={storeSettingsForm.logo} alt="Logo Toko" className="w-full h-full object-contain p-1" />
                        ) : (
                          <Coffee className="w-8 h-8 text-[#38bdf8]" />
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0e213b] hover:bg-[#153257] border border-[#1b3a63] text-xs font-semibold text-white cursor-pointer transition-colors shadow-xs">
                          <Upload className="w-3.5 h-3.5 text-[#38bdf8]" />
                          <span>Upload File Logo dari Perangkat</span>
                          <input type="file" accept="image/*" onChange={handleStoreLogoUpload} className="hidden" />
                        </label>
                        <p className="text-[10px] text-slate-500">Format yang disarankan: PNG transparan, rasio 1:1 atau horizontal.</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Nama Toko</label>
                      <input
                        type="text"
                        value={storeSettingsForm.name || 'Alat Kopi Malang (AKM)'}
                        onChange={(e) => setStoreSettingsForm({ ...storeSettingsForm, name: e.target.value })}
                        className="w-full bg-[#071322] border border-[#1b3a63] text-white px-3 py-2 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Slogan / Tagline</label>
                      <input
                        type="text"
                        value={storeSettingsForm.tagline || 'Curated Specialty Coffee Equipment & Beans'}
                        onChange={(e) => setStoreSettingsForm({ ...storeSettingsForm, tagline: e.target.value })}
                        className="w-full bg-[#071322] border border-[#1b3a63] text-white px-3 py-2 rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Nomor WhatsApp CS (Konsultasi)</label>
                      <input
                        type="text"
                        value={storeSettingsForm.whatsappNumber || '6285121930454'}
                        onChange={(e) => setStoreSettingsForm({ ...storeSettingsForm, whatsappNumber: e.target.value })}
                        className="w-full bg-[#071322] border border-[#1b3a63] text-white px-3 py-2 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Minimum Belanja Gratis Ongkir (Rp)</label>
                      <input
                        type="number"
                        value={storeSettingsForm.freeShippingThreshold || 500000}
                        onChange={(e) => setStoreSettingsForm({ ...storeSettingsForm, freeShippingThreshold: Number(e.target.value) })}
                        className="w-full bg-[#071322] border border-[#1b3a63] text-white px-3 py-2 rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Alamat Lengkap Showroom</label>
                    <textarea
                      rows={2}
                      value={storeSettingsForm.address || 'Ruko Tlogomas Square Kav. 34, Jl. Raya Tlogomas, Lowokwaru, Kota Malang'}
                      onChange={(e) => setStoreSettingsForm({ ...storeSettingsForm, address: e.target.value })}
                      className="w-full bg-[#071322] border border-[#1b3a63] text-white px-3 py-2 rounded-xl text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Jam Operasional</label>
                      <input
                        type="text"
                        value={storeSettingsForm.operatingHours || '09.00 – 23.00 WIB (Buka Setiap Hari)'}
                        onChange={(e) => setStoreSettingsForm({ ...storeSettingsForm, operatingHours: e.target.value })}
                        className="w-full bg-[#071322] border border-[#1b3a63] text-white px-3 py-2 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Tautan Instagram Official</label>
                      <input
                        type="text"
                        value={storeSettingsForm.instagram || 'https://instagram.com/sanubari.roastery.mlg'}
                        onChange={(e) => setStoreSettingsForm({ ...storeSettingsForm, instagram: e.target.value })}
                        className="w-full bg-[#071322] border border-[#1b3a63] text-white px-3 py-2 rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-gradient-to-r from-[#0070f3] to-[#0052cc] hover:from-[#0084ff] text-white text-xs font-bold rounded-xl shadow-md cursor-pointer flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Simpan Pengaturan Toko</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------------- */}
          {/* TAB 7: ADMIN SECURITY & CREDENTIALS */}
          {/* ----------------------------------------------------------------- */}
          {activeTab === 'security' && (
            <div className="space-y-6 animate-fade-in max-w-2xl">
              <div className="rounded-2xl bg-[#0c1c33] border border-[#173357] p-6 shadow-lg space-y-5">
                <div>
                  <h3 className="text-sm font-bold text-white">Ubah Username &amp; Kata Sandi Admin</h3>
                  <p className="text-xs text-slate-400 mt-1">Perbarui akses login keamanan dashboard ini.</p>
                </div>

                <form onSubmit={handleChangeCredentials} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Username Admin Baru</label>
                    <input
                      type="text"
                      required
                      value={securityForm.newUsername}
                      onChange={(e) => setSecurityForm({ ...securityForm, newUsername: e.target.value })}
                      className="w-full bg-[#071322] border border-[#1b3a63] text-white px-3 py-2 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Kata Sandi Saat Ini (Verifikasi)</label>
                    <input
                      type="password"
                      required
                      placeholder="Masukkan kata sandi lama..."
                      value={securityForm.currentPassword}
                      onChange={(e) => setSecurityForm({ ...securityForm, currentPassword: e.target.value })}
                      className="w-full bg-[#071322] border border-[#1b3a63] text-white px-3 py-2 rounded-xl text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Kata Sandi Baru (Opsional)</label>
                      <input
                        type="password"
                        placeholder="Minimal 6 karakter"
                        value={securityForm.newPassword}
                        onChange={(e) => setSecurityForm({ ...securityForm, newPassword: e.target.value })}
                        className="w-full bg-[#071322] border border-[#1b3a63] text-white px-3 py-2 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Ulangi Kata Sandi Baru</label>
                      <input
                        type="password"
                        placeholder="Konfirmasi sandi baru"
                        value={securityForm.confirmPassword}
                        onChange={(e) => setSecurityForm({ ...securityForm, confirmPassword: e.target.value })}
                        className="w-full bg-[#071322] border border-[#1b3a63] text-white px-3 py-2 rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-[#0070f3] to-[#0052cc] text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
                  >
                    Simpan Perubahan Keamanan
                  </button>
                </form>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ===================================================================== */}
      {/* MODAL: ADD / EDIT PRODUCT */}
      {/* ===================================================================== */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-2xl bg-[#0c1c33] border border-[#1b3a63] rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#173357]">
              <h3 className="text-base font-bold text-white">
                {editingProduct ? `Edit Produk: ${editingProduct.name}` : 'Tambah Produk Baru'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Nama Produk</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Fellow Stagg EKG Electric Kettle 0.9L"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full bg-[#071322] border border-[#1b3a63] text-white px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-[#0084ff]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Brand</label>
                  <select
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    className="w-full bg-[#071322] border border-[#1b3a63] text-white px-3 py-2 rounded-xl text-xs cursor-pointer"
                  >
                    {BRANDS.filter(b => b !== 'Semua Brand').map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Kategori</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full bg-[#071322] border border-[#1b3a63] text-white px-3 py-2 rounded-xl text-xs cursor-pointer"
                  >
                    <option value="filter-beans">Filter Beans (Biji Kopi)</option>
                    <option value="espresso-beans">Espresso Beans (Biji Kopi)</option>
                    <option value="manual-brew">Manual Brew & Dripper</option>
                    <option value="grinder">Grinder Kopi Presisi</option>
                    <option value="espresso-tools">Espresso & Lever Tools</option>
                    <option value="kettle">Kettle Gooseneck</option>
                    <option value="scale">Scale & Timer Digital</option>
                    <option value="accessories">Aksesoris & Filter Paper</option>
                    <option value="bundles">Paket Starter Kit</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Harga Jual (Rp)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full bg-[#071322] border border-[#1b3a63] text-white px-3 py-2 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Harga Coret / Asli (Rp)</label>
                  <input
                    type="number"
                    min="0"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                    className="w-full bg-[#071322] border border-[#1b3a63] text-white px-3 py-2 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Stok (pcs)</label>
                  <input
                    type="number"
                    min="0"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    className="w-full bg-[#071322] border border-[#1b3a63] text-white px-3 py-2 rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* Product Gallery Images (Upload, Add URL, Delete, Set Primary) */}
              <div className="p-4 rounded-2xl bg-[#071322] border border-[#1b3a63] space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="block text-xs font-bold text-white">
                      Galeri Foto Produk ({(productForm.images || []).length} Foto)
                    </label>
                    <p className="text-[11px] text-slate-400">
                      Foto pertama akan otomatis menjadi foto utama (thumbnail katalog).
                    </p>
                  </div>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#0070f3] to-[#0052cc] hover:from-[#0084ff] text-white text-xs font-bold cursor-pointer transition-all shadow-xs self-start sm:self-auto">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Foto dari HP / PC</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleProductImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Add by URL input */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Atau tempel link URL foto: https://..."
                    value={newProductImageUrl}
                    onChange={(e) => setNewProductImageUrl(e.target.value)}
                    className="flex-1 bg-[#0c1c33] border border-[#1b3a63] text-white px-3 py-1.5 rounded-xl text-xs focus:border-[#0084ff] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddProductImageUrl}
                    className="px-3 py-1.5 rounded-xl bg-[#0e213b] hover:bg-[#153257] border border-[#1b3a63] text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
                  >
                    + Tambah Link
                  </button>
                </div>

                {/* Images Grid */}
                {(productForm.images && productForm.images.length > 0) ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                    {productForm.images.map((imgUrl, imgIdx) => (
                      <div
                        key={imgIdx}
                        className={`relative rounded-xl overflow-hidden border p-1 group flex flex-col justify-between ${
                          imgIdx === 0
                            ? 'bg-[#0070f3]/10 border-[#0070f3] ring-1 ring-[#0070f3]/50'
                            : 'bg-[#0c1c33] border-[#1b3a63]'
                        }`}
                      >
                        <div className="relative h-24 rounded-lg overflow-hidden bg-slate-900">
                          <img
                            src={imgUrl}
                            alt={`Foto Produk ${imgIdx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {imgIdx === 0 && (
                            <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-[#0070f3] text-white text-[9px] font-black flex items-center gap-1 shadow-sm">
                              <Star className="w-2.5 h-2.5 fill-current" />
                              <span>UTAMA</span>
                            </span>
                          )}
                        </div>

                        <div className="mt-1.5 flex items-center justify-between gap-1 pt-1 border-t border-[#173357]/60">
                          {imgIdx !== 0 ? (
                            <button
                              type="button"
                              onClick={() => handleSetPrimaryProductImage(imgIdx)}
                              className="text-[10px] text-[#38bdf8] hover:text-white font-medium flex items-center gap-0.5 cursor-pointer"
                            >
                              <Star className="w-2.5 h-2.5" />
                              <span>Set Utama</span>
                            </button>
                          ) : (
                            <span className="text-[10px] text-emerald-400 font-bold">Thumbnail</span>
                          )}

                          <button
                            type="button"
                            onClick={() => handleRemoveProductImage(imgIdx)}
                            className="p-1 text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded-md transition-colors cursor-pointer"
                            title="Hapus foto ini"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl border border-dashed border-[#1b3a63] text-center text-xs text-slate-400">
                    Belum ada foto produk. Klik tombol &ldquo;Upload Foto&rdquo; di atas untuk memilih gambar.
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Tagline Ringkas</label>
                <input
                  type="text"
                  placeholder="Satu kalimat keunggulan produk..."
                  value={productForm.tagline}
                  onChange={(e) => setProductForm({ ...productForm, tagline: e.target.value })}
                  className="w-full bg-[#071322] border border-[#1b3a63] text-white px-3 py-2 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Deskripsi Lengkap Produk</label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full bg-[#071322] border border-[#1b3a63] text-white px-3 py-2 rounded-xl text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#173357]">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#0e213b] text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#0070f3] to-[#0052cc] text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Simpan Produk Live
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL: EDIT & TAMBAH HERO BANNER (UPLOAD & HAPUS FOTO) */}
      {/* ===================================================================== */}
      {isBannerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg bg-[#0c1c33] border border-[#1b3a63] rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#173357]">
              <h3 className="text-base font-bold text-white">
                {editingBanner ? `Edit Banner Slide: ${bannerForm.title}` : 'Tambah Banner Slide Baru'}
              </h3>
              <button onClick={() => setIsBannerModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBanner} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Judul Banner</label>
                <input
                  type="text"
                  required
                  value={bannerForm.title}
                  onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                  className="w-full bg-[#071322] border border-[#1b3a63] text-white px-3 py-2 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Tautan Tujuan (Link CTA)</label>
                <input
                  type="text"
                  required
                  value={bannerForm.ctaLink}
                  onChange={(e) => setBannerForm({ ...bannerForm, ctaLink: e.target.value })}
                  className="w-full bg-[#071322] border border-[#1b3a63] text-white px-3 py-2 rounded-xl text-xs"
                />
              </div>

              {/* Banner Image with Upload & URL */}
              <div className="p-4 rounded-2xl bg-[#071322] border border-[#1b3a63] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-white">Gambar Slide Banner</label>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#0070f3] to-[#0052cc] hover:from-[#0084ff] text-white text-xs font-bold cursor-pointer transition-all shadow-xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload File Banner</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBannerFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div>
                  <input
                    type="text"
                    required
                    placeholder="Atau masukkan URL: https://..."
                    value={bannerForm.image}
                    onChange={(e) => setBannerForm({ ...bannerForm, image: e.target.value })}
                    className="w-full bg-[#0c1c33] border border-[#1b3a63] text-white px-3 py-2 rounded-xl text-xs focus:border-[#0084ff] focus:outline-none"
                  />
                </div>

                {bannerForm.image && (
                  <div className="relative h-36 rounded-xl overflow-hidden bg-slate-900 border border-[#1b3a63] group">
                    <img src={bannerForm.image} alt="Preview Banner" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setBannerForm({ ...bannerForm, image: '' })}
                      className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-300 text-xs font-bold flex items-center gap-1 border border-red-800/60 transition-colors shadow-sm cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus Foto</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#173357]">
                <button
                  type="button"
                  onClick={() => setIsBannerModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#0e213b] text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#0070f3] to-[#0052cc] text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Simpan Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL: ORDER DETAILS INVOICE */}
      {/* ===================================================================== */}
      {selectedOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg bg-[#0c1c33] border border-[#1b3a63] rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between pb-3 border-b border-[#173357]">
              <div>
                <h3 className="text-base font-bold text-white">Invoice: {selectedOrderModal.id}</h3>
                <p className="text-xs text-slate-400">{selectedOrderModal.date}</p>
              </div>
              <button onClick={() => setSelectedOrderModal(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#071322] rounded-xl border border-[#1b3a63] space-y-1">
                <p className="font-bold text-white">Data Penerima:</p>
                <p className="text-slate-300">{selectedOrderModal.customerName} ({selectedOrderModal.phone})</p>
                <p className="text-slate-400">{selectedOrderModal.shippingAddress}</p>
                {selectedOrderModal.notes && (
                  <p className="text-[#38bdf8] font-medium pt-1">Catatan: "{selectedOrderModal.notes}"</p>
                )}
              </div>

              <div className="space-y-2">
                <p className="font-bold text-white">Rincian Item:</p>
                <div className="divide-y divide-[#173357] bg-[#071322] rounded-xl p-3 border border-[#1b3a63]">
                  {selectedOrderModal.items?.map((item, idx) => (
                    <div key={idx} className="py-2 flex justify-between items-center text-slate-300">
                      <div>
                        <p className="font-bold text-white">{item.name}</p>
                        <p className="text-[10px] text-slate-400">{item.quantity}x @ {formatRupiah(item.price)}</p>
                      </div>
                      <span className="font-bold text-white">{formatRupiah(item.price * item.quantity)}</span>
                    </div>
                  ))}
                  <div className="pt-2 flex justify-between items-center font-bold text-sm text-white">
                    <span>Total Pembayaran:</span>
                    <span className="text-[#38bdf8]">{formatRupiah(selectedOrderModal.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#173357]">
              <a
                href={`https://wa.me/${selectedOrderModal.phone?.replace(/[^0-9]/g, '')}?text=Halo%20kak%20${encodeURIComponent(selectedOrderModal.customerName)},%20kami%20mengonfirmasi%20pesanan%20${selectedOrderModal.id}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Kirim Bukti via WA</span>
              </a>
              <button
                onClick={() => setSelectedOrderModal(null)}
                className="px-4 py-2 rounded-xl bg-[#0e213b] text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

