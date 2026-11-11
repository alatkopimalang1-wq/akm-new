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

  // Scroll to top when category or brand param changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const brandParam = searchParams.get('brand');
    setSelectedBrand(brandParam || 'Semua Brand');
  }, [categorySlug, searchParams]);

  // Filtered & Sorted products for this category
  const filteredProducts = useMemo(() => {
    if (!category) return [];

    return PRODUCTS.filter((item) => {
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
  }, [category, selectedBrand]);

  // Brands present in this specific category for cleaner filter chips
  const categoryBrands = useMemo(() => {
    if (!category || category.id === 'all') return BRANDS;
    const raw = PRODUCTS.filter((p) => p.category === category.id).map((p) => p.brand);
    const unique = ['Semua Brand', ...new Set(raw)];
    return unique;
  }, [category]);

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
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#4f46e5] hover:bg-[#4338ca] text-white font-bold text-xs transition-all shadow-lg shadow-indigo-500/20"
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
      <div className="bg-gradient-to-b from-indigo-50/40 via-slate-50/20 to-white border-b border-slate-200 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {category.name}
          </h1>

          {/* Quick Category Switcher Tabs */}
          <div className="mt-4 pt-4 border-t border-slate-200/80">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Jelajahi Kategori Lainnya:
            </span>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/kategori/${cat.slug}`}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                    category.id === cat.id
                      ? 'bg-[#4f46e5] text-white border-[#4f46e5] shadow-md shadow-indigo-500/20'
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
          <div className="mb-6 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs pt-1">
            <span className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider shrink-0 mr-1">
              Brand:
            </span>
            {categoryBrands.map((brand) => (
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

            {selectedBrand !== 'Semua Brand' && (
              <button
                onClick={() => setSelectedBrand('Semua Brand')}
                className="ml-auto text-[11px] text-red-500 hover:text-red-700 font-medium flex items-center gap-1 shrink-0 px-2 py-1"
              >
                <RotateCcw className="w-3 h-3" />
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
              Tidak ada produk di kategori "{category.name}" yang cocok dengan filter brand "{selectedBrand}".
            </p>
            <button
              onClick={() => setSelectedBrand('Semua Brand')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0070f3] to-[#0052cc] text-white font-bold text-xs hover:brightness-110 shadow-md shadow-blue-500/20"
            >
              Reset Filter Kategori
            </button>
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

