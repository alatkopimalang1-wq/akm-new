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
import OrderTrackingPage from './pages/OrderTrackingPage';
import BrewGuidesPage from './pages/BrewGuidesPage';
import WholesalePage from './pages/WholesalePage';

import { PRODUCTS, CATEGORIES, BRANDS, STORE_INFO } from './data/products';
import { 
  Filter, 
  ArrowUpDown, 
  Sparkles, 
  Coffee, 
  RotateCcw, 
  CheckCircle,
  SlidersHorizontal,
  PhoneCall
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
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById('katalog-produk')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById('katalog-produk')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToCatalog = () => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById('katalog-produk')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById('katalog-produk')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToCalculator = () => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById('kalkulator-seduh')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById('kalkulator-seduh')?.scrollIntoView({ behavior: 'smooth' });
    }
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
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-[#0070f3] selection:text-white">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-slate-800 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-fade-in text-xs font-semibold">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Floating WhatsApp Quick Consultation Button (Azure Sapphire Style) */}
      <a
        href={`https://wa.me/${STORE_INFO.whatsappNumber}?text=Halo%20barista%20Sanubari%20x%20Alat%20Kopi%20Malang!%20Saya%20ingin%20tanya%20rekomendasi%20alat`}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 left-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-[#0070f3] to-[#0052cc] hover:brightness-110 text-white font-bold text-xs shadow-xl shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all group"
        title="Chat Barista via WhatsApp"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-cyan-300 animate-ping"></span>
        <PhoneCall className="w-4 h-4" />
        <span className="hidden sm:inline">Konsultasi Barista</span>
      </a>

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
            <>
              {/* Hero Section */}
              <Hero
                onSelectCategory={handleSelectCategory}
                onScrollToCatalog={scrollToCatalog}
                onScrollToCalculator={scrollToCalculator}
                onScrollToShowroom={scrollToShowroom}
              />

              {/* Spotlight Product Section (Flair 58) */}
              <SpotlightProduct
                product={spotlightItem}
                onQuickView={(p) => navigate(`/product/${p.slug}`)}
                onAddToCart={handleAddToCart}
              />

              {/* Main Product Catalog Section */}
              <main id="katalog-produk" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1 w-full">
                
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-xs font-bold text-[#0070f3] tracking-wider uppercase mb-2 border border-blue-200">
                      <Coffee className="w-3.5 h-3.5" />
                      <span>KATALOG ALAT &amp; BIJI KOPI</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      Peralatan Kopi Specialty Pilihan
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      Menampilkan {filteredProducts.length} dari {PRODUCTS.length} pilihan — Klik produk untuk membuka link &amp; spesifikasi lengkap
                    </p>
                  </div>

                  {/* Action Tools & Sort Dropdown */}
                  <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
                    <button
                      onClick={() => setIsGrinderChartOpen(true)}
                      className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-xs font-semibold text-[#0070f3] border border-slate-200 flex items-center gap-1.5 transition-all shadow-sm"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      <span>Tabel Klik Grinder</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <ArrowUpDown className="w-3.5 h-3.5" />
                        <span>Urutkan:</span>
                      </span>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="bg-white border border-slate-200 text-xs text-slate-800 rounded-xl px-3 py-2 focus:border-[#0070f3] focus:outline-none shadow-sm"
                      >
                        <option value="popular">Paling Populer</option>
                        <option value="price-low">Harga Terendah</option>
                        <option value="price-high">Harga Tertinggi</option>
                        <option value="rating">Rating Tertinggi</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Filters Bar: Category Tabs & Brand Filter */}
                <div className="space-y-4 mb-8">
                  
                  {/* Category Tabs */}
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                          selectedCategory === cat.id
                            ? 'bg-gradient-to-r from-[#0070f3] to-[#0052cc] text-white border-[#0070f3] shadow-md shadow-blue-500/25'
                            : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>

                  {/* Brand Filter Chips */}
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
                    <span className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider shrink-0 mr-1">
                      Brand:
                    </span>
                    {BRANDS.map((brand) => (
                      <button
                        key={brand}
                        onClick={() => setSelectedBrand(brand)}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all border ${
                          selectedBrand === brand
                            ? 'bg-blue-50 text-[#0070f3] border-blue-300 font-semibold shadow-xs'
                            : 'bg-white text-slate-500 border-slate-200 hover:text-slate-800 hover:bg-slate-50'
                        }`}
                      >
                        {brand}
                      </button>
                    ))}

                    {(selectedCategory !== 'all' || selectedBrand !== 'Semua Brand' || searchQuery) && (
                      <button
                        onClick={() => {
                          setSelectedCategory('all');
                          setSelectedBrand('Semua Brand');
                          setSearchQuery('');
                        }}
                        className="ml-auto text-[11px] text-red-500 hover:text-red-700 font-medium flex items-center gap-1 shrink-0 px-2 py-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reset Filter</span>
                      </button>
                    )}
                  </div>

                </div>

                {/* Product Grid */}
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-20 rounded-3xl bg-slate-50 border border-slate-200 p-8 space-y-4">
                    <Coffee className="w-12 h-12 text-slate-400 mx-auto opacity-70" />
                    <h3 className="text-lg font-bold text-slate-900">Produk Tidak Ditemukan</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Tidak ada alat atau biji kopi yang cocok dengan kata kunci "{searchQuery}" atau filter yang dipilih. Silakan coba filter lainnya.
                    </p>
                    <button
                      onClick={() => {
                        setSelectedCategory('all');
                        setSelectedBrand('Semua Brand');
                        setSearchQuery('');
                      }}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0070f3] to-[#0052cc] text-white font-bold text-xs hover:brightness-110 shadow-md shadow-blue-500/20"
                    >
                      Tampilkan Semua Produk
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onQuickView={(p) => navigate(`/product/${p.slug}`)}
                        onAddToCart={handleAddToCart}
                        isWishlisted={wishlist.some((w) => w.id === product.id)}
                        onToggleWishlist={handleToggleWishlist}
                      />
                    ))}
                  </div>
                )}

              </main>

              {/* Interactive Brewing Ratio Calculator Section */}
              <BrewCalculator
                onQuickView={(p) => navigate(`/product/${p.slug}`)}
                onAddToCart={handleAddToCart}
              />

              {/* FAQ Section */}
              <FAQSection />

              {/* Showroom & Slow Bar Tlogomas Square Section */}
              <ShowroomSection />
            </>
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

    </div>
  );
}
