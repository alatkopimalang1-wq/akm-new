import React, { useState, useEffect, useMemo } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import SpotlightProduct from './components/SpotlightProduct';
import BrewCalculator from './components/BrewCalculator';
import GrinderClickChartModal from './components/GrinderClickChartModal';
import FAQSection from './components/FAQSection';
import ShowroomSection from './components/ShowroomSection';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import Footer from './components/Footer';
import ProductDetailPage from './pages/ProductDetailPage';
import CategoryPage from './pages/CategoryPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import BrewGuidesPage from './pages/BrewGuidesPage';
import WholesalePage from './pages/WholesalePage';
import BrandsPage from './pages/BrandsPage';
import CategoriesHubPage from './pages/CategoriesHubPage';
import AccountPage from './pages/AccountPage';
import MobileBottomNav from './components/MobileBottomNav';

import { PRODUCTS, CATEGORIES, BRANDS, STORE_INFO } from './data/products';
import { 
  Filter, 
  ArrowUpDown, 
  Sparkles, 
  Coffee, 
  RotateCcw, 
  CheckCircle,
  SlidersHorizontal
} from 'lucide-react';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Cart state persisted in localStorage
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('akm_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist state persisted in localStorage
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('akm_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // UI modals state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isGrinderChartOpen, setIsGrinderChartOpen] = useState(false);
  const [activeModalProduct, setActiveModalProduct] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('Semua Brand');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('akm_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('akm_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Sync search query from URL parameter if available
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q') || params.get('search');
    if (q) {
      setSearchQuery(q);
    }
  }, [location.search]);

  // Show Toast
  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Cart operations
  const handleAddToCart = (product, selectedVariant = null) => {
    setCart((prev) => {
      const variantId = selectedVariant ? selectedVariant.id : 'default';
      const existingIndex = prev.findIndex(
        (item) => item.id === product.id && (item.selectedVariant?.id || 'default') === variantId
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += 1;
        return next;
      } else {
        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            brand: product.brand,
            price: product.price,
            images: product.images,
            selectedVariant: selectedVariant,
            quantity: 1
          }
        ];
      }
    });

    showToast(`"${product.name}" ditambahkan ke keranjang!`);
  };

  const handleUpdateQuantity = (productId, variantId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(productId, variantId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        const itemVarId = item.selectedVariant?.id || 'default';
        if (item.id === productId && itemVarId === (variantId || 'default')) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const handleRemoveFromCart = (productId, variantId) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.id === productId && (item.selectedVariant?.id || 'default') === (variantId || 'default'))
      )
    );
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Wishlist operations
  const handleToggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        showToast(`Dihapus dari wishlist`);
        return prev.filter((item) => item.id !== product.id);
      } else {
        showToast(`Ditambahkan ke wishlist!`);
        return [...prev, product];
      }
    });
  };

  const handleRemoveFromWishlist = (productId) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
  };

  // Navigation helpers
  const handleSelectCategory = (catId) => {
    setSelectedCategory(catId);
    navigate(`/kategori/${catId}`);
  };

  const scrollToCatalog = () => {
    navigate('/kategori/all');
  };

  const scrollToCalculator = () => {
    navigate('/panduan-seduh');
  };

  const scrollToShowroom = () => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById('showroom-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById('showroom-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Filtered & Sorted Products for catalog
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      if (selectedBrand !== 'Semua Brand' && item.brand !== selectedBrand) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = item.name.toLowerCase().includes(query);
        const matchBrand = item.brand.toLowerCase().includes(query);
        const matchTagline = item.tagline?.toLowerCase().includes(query);
        const matchDesc = item.description?.toLowerCase().includes(query);
        if (!matchTitle && !matchBrand && !matchTagline && !matchDesc) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return (b.badge ? 1 : 0) - (a.badge ? 1 : 0);
    });
  }, [selectedCategory, selectedBrand, searchQuery, sortBy]);

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const spotlightItem = PRODUCTS.find((p) => p.id === 'akm-flair-58') || PRODUCTS[0];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-[#0070f3] selection:text-white pb-20 md:pb-0 overflow-x-clip">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 bg-slate-900 border border-slate-800 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-fade-in text-xs font-semibold">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        cartCount={totalCartCount}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenGrinderChart={() => setIsGrinderChartOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        onScrollToCalculator={scrollToCalculator}
        onScrollToShowroom={scrollToShowroom}
      />

      {/* Routing between Homepage, Product Detail, Tracking, Guides, Wholesale */}
      <Routes>
        {/* Homepage Route */}
        <Route
          path="/"
          element={
            /* Hero Section (5-Slide Image Banner, 4 Trust Badges, Quick Category Chips) */
            <Hero
              onSelectCategory={handleSelectCategory}
              onScrollToCatalog={scrollToCatalog}
              onScrollToCalculator={scrollToCalculator}
              onScrollToShowroom={scrollToShowroom}
            />
          }
        />

        {/* Dedicated Product Detail Route */}
        <Route
          path="/product/:slug"
          element={
            <ProductDetailPage
              onAddToCart={handleAddToCart}
              wishlist={wishlist}
              onToggleWishlist={handleToggleWishlist}
              showToast={showToast}
              onOpenCart={() => setIsCartOpen(true)}
            />
          }
        />

        {/* Dedicated All Categories Hub Route (Persis Screenshot) */}
        <Route
          path="/kategori"
          element={<CategoriesHubPage />}
        />
        <Route
          path="/semua-kategori"
          element={<CategoriesHubPage />}
        />

        {/* Dedicated Category & Shop Routes */}
        <Route
          path="/shop"
          element={
            <CategoryPage
              onAddToCart={handleAddToCart}
              wishlist={wishlist}
              onToggleWishlist={handleToggleWishlist}
              showToast={showToast}
            />
          }
        />
        <Route
          path="/katalog"
          element={
            <CategoryPage
              onAddToCart={handleAddToCart}
              wishlist={wishlist}
              onToggleWishlist={handleToggleWishlist}
              showToast={showToast}
            />
          }
        />
        <Route
          path="/kategori/:categorySlug"
          element={
            <CategoryPage
              onAddToCart={handleAddToCart}
              wishlist={wishlist}
              onToggleWishlist={handleToggleWishlist}
              showToast={showToast}
            />
          }
        />
        <Route
          path="/category/:categorySlug"
          element={
            <CategoryPage
              onAddToCart={handleAddToCart}
              wishlist={wishlist}
              onToggleWishlist={handleToggleWishlist}
              showToast={showToast}
            />
          }
        />

        {/* Dedicated Order Tracking Route */}
        <Route
          path="/lacak-pesanan"
          element={<OrderTrackingPage />}
        />

        {/* Dedicated Brew Guides Route */}
        <Route
          path="/panduan-seduh"
          element={<BrewGuidesPage />}
        />

        {/* Dedicated Wholesale Partnership Route */}
        <Route
          path="/wholesale"
          element={<WholesalePage />}
        />

        {/* Dedicated Brands Collection Route */}
        <Route
          path="/brands"
          element={<BrandsPage />}
        />
        <Route
          path="/semua-brand"
          element={<BrandsPage />}
        />

        {/* Dedicated Account / Profil Page (Sesuai Desain Pengguna) */}
        <Route
          path="/akun"
          element={<AccountPage showToast={showToast} />}
        />
        <Route
          path="/account"
          element={<AccountPage showToast={showToast} />}
        />
        <Route
          path="/profil"
          element={<AccountPage showToast={showToast} />}
        />
      </Routes>

      {/* Footer */}
      <Footer
        onSelectCategory={handleSelectCategory}
        onScrollToCalculator={scrollToCalculator}
        onScrollToShowroom={scrollToShowroom}
      />

      {/* Grinder Click Chart Modal */}
      <GrinderClickChartModal
        isOpen={isGrinderChartOpen}
        onClose={() => setIsGrinderChartOpen(false)}
      />

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
      />

      {/* Slide-over Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistItems={wishlist}
        onAddToCart={handleAddToCart}
        onRemoveFromWishlist={handleRemoveFromWishlist}
      />

      {/* Mobile Bottom Navigation Bar (Persis Screenshot) */}
      <MobileBottomNav
        cartCount={totalCartCount}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
      />

    </div>
  );
}
