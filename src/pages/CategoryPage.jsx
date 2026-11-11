import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Coffee, 
  RotateCcw,
  Filter
} from 'lucide-react';
import { PRODUCTS, CATEGORIES, BRANDS } from '../data/products';
import ProductCard from '../components/ProductCard';

export default function CategoryPage({ 
  onAddToCart, 
  wishlist, 
  onToggleWishlist, 
  showToast 
}) {
  const { categorySlug = 'all' } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Find category by id or slug
  const category = CATEGORIES.find(
    (c) => c.id === categorySlug || c.slug === categorySlug
  );

  const initialBrandParam = searchParams.get('brand');
  const [selectedBrand, setSelectedBrand] = useState(initialBrandParam || 'Semua Brand');
  const searchQueryParam = (searchParams.get('q') || searchParams.get('search') || '').trim();

  // Sync brand param on category or brand param changes
  useEffect(() => {
    const brandParam = searchParams.get('brand');
    setSelectedBrand(brandParam || 'Semua Brand');
  }, [categorySlug, searchParams]);

  // Filtered & Sorted products for this category
  const filteredProducts = useMemo(() => {
    if (!category) return [];

    return PRODUCTS.filter((item) => {
      // Search query filter (matches name, brand, category, description, tagline)
      if (searchQueryParam) {
        const qLower = searchQueryParam.toLowerCase();
        const nameMatch = (item.name || '').toLowerCase().includes(qLower);
        const brandMatch = (item.brand || '').toLowerCase().includes(qLower);
        const catMatch = (item.category || '').toLowerCase().includes(qLower);
        const descMatch = (item.description || '').toLowerCase().includes(qLower);
        const taglineMatch = (item.tagline || '').toLowerCase().includes(qLower);
        if (!nameMatch && !brandMatch && !catMatch && !descMatch && !taglineMatch) {
          return false;
        }
      }

      // Category match
      if (category.id !== 'all' && item.category !== category.id) {
        return false;
      }
      // Brand match
      if (selectedBrand !== 'Semua Brand') {
        const brandNormalized = selectedBrand.toLowerCase();
        const itemBrandNormalized = (item.brand || '').toLowerCase();
        const isMatch = 
          itemBrandNormalized === brandNormalized ||
          itemBrandNormalized.includes(brandNormalized) ||
          brandNormalized.includes(itemBrandNormalized) ||
          (brandNormalized.includes('alat kopi') && itemBrandNormalized.includes('akm'));
        if (!isMatch) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      return (b.badge ? 1 : 0) - (a.badge ? 1 : 0);
    });
  }, [category, selectedBrand, searchQueryParam]);

  // Brands present in this specific category / search for cleaner filter chips
  const categoryBrands = useMemo(() => {
    let base = PRODUCTS;
    if (category && category.id !== 'all') {
      base = base.filter((p) => p.category === category.id);
    }
    if (searchQueryParam) {
      const qLower = searchQueryParam.toLowerCase();
      base = base.filter((p) => 
        (p.name || '').toLowerCase().includes(qLower) ||
        (p.brand || '').toLowerCase().includes(qLower) ||
        (p.category || '').toLowerCase().includes(qLower)
      );
    }
    const raw = base.map((p) => p.brand).filter(Boolean);
    const unique = ['Semua Brand', ...new Set(raw)];
    return unique;
  }, [category, searchQueryParam]);

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <Coffee className="w-16 h-16 text-slate-300 mx-auto opacity-70 mb-4" />
        <h2 className="text-2xl font-bold text-slate-900">Kategori Tidak Ditemukan</h2>
        <p className="text-xs text-slate-500 mt-2 mb-6">
          Kategori dengan alamat "{categorySlug}" tidak ditemukan atau telah dipindahkan.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0e1f36] hover:bg-[#152e50] text-white font-bold text-xs transition-all shadow-md shadow-slate-900/15"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Katalog Utama</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 pb-24">
      
      {/* Category Hero Banner */}
      <div className="bg-gradient-to-b from-blue-50/50 via-slate-50/20 to-white border-b border-slate-200 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {searchQueryParam ? (
              <span className="flex items-center gap-3 flex-wrap">
                <span>Hasil Pencarian:</span>
                <span className="text-[#0e1f36]">"{searchQueryParam}"</span>
                <span className="text-sm font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                  {filteredProducts.length} produk ditemukan
                </span>
              </span>
            ) : (
              category.name
            )}
          </h1>

          {searchQueryParam && (
            <div className="mt-3 flex items-center gap-2">
              <Link
                to={`/kategori/${categorySlug}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold transition-colors border border-slate-200"
              >
                <span>✕ Hapus Filter Pencarian</span>
              </Link>
            </div>
          )}

          {/* Quick Category Switcher Tabs */}
          <div className="mt-4 pt-4 border-t border-slate-200/80">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Jelajahi Kategori Lainnya:
            </span>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/kategori/${cat.slug}`}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all border ${
                    category.id === cat.id
                      ? 'bg-[#0e1f36] text-white border-[#0e1f36] shadow-sm'
                      : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Main Catalog View for Category */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        
        {/* Brand Filter Chips for this category */}
        {categoryBrands.length > 2 && (
          <div className="mb-6 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs sm:text-sm pt-1">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider shrink-0 mr-1">
              Brand:
            </span>
            {categoryBrands.map((brand) => (
              <button
                key={brand}
                onClick={() => setSelectedBrand(brand)}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all border ${
                  selectedBrand === brand
                    ? 'bg-slate-100 text-[#0e1f36] border-[#0e1f36]/40 font-bold shadow-xs'
                    : 'bg-white text-slate-500 border-slate-200 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                {brand}
              </button>
            ))}

            {selectedBrand !== 'Semua Brand' && (
              <button
                onClick={() => setSelectedBrand('Semua Brand')}
                className="ml-auto text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1 shrink-0 px-2 py-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        )}

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 rounded-3xl bg-slate-50 border border-slate-200 p-8 space-y-4">
            <Coffee className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900">Produk Tidak Ditemukan</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchQueryParam
                ? `Tidak ada produk yang cocok dengan kata kunci "${searchQueryParam}". Silakan coba kata kunci lain atau lihat seluruh katalog produk.`
                : `Tidak ada produk di kategori "${category.name}" yang cocok dengan filter brand "${selectedBrand}".`
              }
            </p>
            <Link
              to="/kategori/all"
              className="inline-block px-5 py-2.5 rounded-xl bg-[#0e1f36] hover:bg-[#152e50] text-white font-bold text-xs shadow-md shadow-slate-900/15"
            >
              Lihat Semua Produk
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => navigate(`/product/${p.slug}`)}
                onAddToCart={onAddToCart}
                isWishlisted={wishlist.some((w) => w.id === product.id)}
                onToggleWishlist={onToggleWishlist}
              />
            ))}
          </div>
        )}

      </main>

    </div>
  );
}

