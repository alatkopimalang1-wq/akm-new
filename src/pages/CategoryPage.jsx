import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Share2, 
  Copy, 
  CheckCircle2, 
  Coffee, 
  Sparkles, 
  SlidersHorizontal, 
  ArrowUpDown, 
  RotateCcw,
  Flame,
  Cog,
  Pipette,
  Timer,
  Filter,
  PackageCheck
} from 'lucide-react';
import { PRODUCTS, CATEGORIES, BRANDS } from '../data/products';
import ProductCard from '../components/ProductCard';

export default function CategoryPage({ 
  onAddToCart, 
  wishlist, 
  onToggleWishlist, 
  showToast 
}) {
  const { categorySlug } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Find category by id or slug
  const category = CATEGORIES.find(
    (c) => c.id === categorySlug || c.slug === categorySlug
  );

  const initialBrandParam = searchParams.get('brand');
  const [selectedBrand, setSelectedBrand] = useState(initialBrandParam || 'Semua Brand');
  const [sortBy, setSortBy] = useState('popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  // Scroll to top when category or brand param changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const brandParam = searchParams.get('brand');
    setSelectedBrand(brandParam || 'Semua Brand');
    setSearchQuery('');
    setSortBy('popular');
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
      // Search query within category
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = item.name.toLowerCase().includes(query);
        const matchBrand = item.brand.toLowerCase().includes(query);
        const matchTagline = item.tagline?.toLowerCase().includes(query);
        if (!matchTitle && !matchBrand && !matchTagline) {
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
  }, [category, selectedBrand, sortBy, searchQuery]);

  // Brands present in this specific category for cleaner filter chips
  const categoryBrands = useMemo(() => {
    if (!category || category.id === 'all') return BRANDS;
    const raw = PRODUCTS.filter((p) => p.category === category.id).map((p) => p.brand);
    const unique = ['Semua Brand', ...new Set(raw)];
    return unique;
  }, [category]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    showToast(`Link kategori "${category?.name}" berhasil disalin!`);
    setTimeout(() => setCopied(false), 2500);
  };

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
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#0070f3] to-[#0052cc] text-white font-bold text-xs hover:brightness-110 transition-all shadow-lg shadow-blue-500/25"
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
      <div className="bg-gradient-to-b from-blue-50/60 via-slate-50/40 to-white border-b border-slate-200 py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          <div className="max-w-3xl">
            {/* Category Badge & Share Button */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-xs font-extrabold text-[#0070f3] border border-blue-200 uppercase tracking-wider">
                  <Coffee className="w-3.5 h-3.5" />
                  <span>KATEGORI PRODUK</span>
                </span>

                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white text-[11px] font-mono text-slate-500 border border-slate-200 shadow-xs">
                  <span>URL:</span>
                  <strong className="text-[#0070f3]">/kategori/{category.slug}</strong>
                </span>
              </div>

              {/* Share Category Link Button */}
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-[#0070f3] text-xs font-semibold border border-slate-200 transition-all shadow-xs"
                title="Salin Link Kategori Ini"
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Tersalin!' : 'Bagikan Link Kategori'}</span>
              </button>
            </div>

            {/* Category Heading */}
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {category.name}
            </h1>

            {/* Tagline */}
            {category.tagline && (
              <p className="text-sm font-semibold text-[#0070f3] mt-1.5">
                {category.tagline}
              </p>
            )}

            {/* Description */}
            {category.description && (
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                {category.description}
              </p>
            )}

            {/* Stats */}
            <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
              <span>Menampilkan <strong>{filteredProducts.length}</strong> produk pilihan</span>
              <span>•</span>
              <span className="text-emerald-700 font-medium">Jaminan 100% Original &amp; Bergaransi</span>
            </div>
          </div>

          {/* Quick Category Switcher Tabs */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
              Jelajahi Kategori Lainnya:
            </span>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/kategori/${cat.slug}`}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                    category.id === cat.id
                      ? 'bg-gradient-to-r from-[#0070f3] to-[#0052cc] text-white border-[#0070f3] shadow-md shadow-blue-500/25'
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Controls: Search in Category, Brand Filters & Sort */}
        <div className="space-y-4 mb-8">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            
            {/* Search Input in this category */}
            <div className="relative max-w-sm flex-1">
              <input
                type="text"
                placeholder={`Cari di kategori ${category.name}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#0070f3] text-xs text-slate-900 placeholder-slate-400 rounded-xl py-2.5 pl-9 pr-3 focus:outline-none transition-all shadow-xs"
              />
              <Coffee className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 hover:text-slate-900 bg-slate-200 px-1.5 py-0.5 rounded font-medium"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5" />
                <span>Urutkan:</span>
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-slate-200 text-xs text-slate-800 rounded-xl px-3 py-2 focus:border-[#0070f3] focus:outline-none shadow-xs"
              >
                <option value="popular">Paling Populer</option>
                <option value="price-low">Harga Terendah</option>
                <option value="price-high">Harga Tertinggi</option>
                <option value="rating">Rating Tertinggi</option>
              </select>
            </div>

          </div>

          {/* Brand Filter Chips for this category */}
          {categoryBrands.length > 2 && (
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar text-xs pt-1">
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

              {(selectedBrand !== 'Semua Brand' || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedBrand('Semua Brand');
                    setSearchQuery('');
                  }}
                  className="ml-auto text-[11px] text-red-500 hover:text-red-700 font-medium flex items-center gap-1 shrink-0 px-2 py-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 rounded-3xl bg-slate-50 border border-slate-200 p-8 space-y-4">
            <Coffee className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900">Produk Tidak Ditemukan</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Tidak ada produk di kategori "{category.name}" yang cocok dengan filter atau kata kunci "{searchQuery}".
            </p>
            <button
              onClick={() => {
                setSelectedBrand('Semua Brand');
                setSearchQuery('');
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0070f3] to-[#0052cc] text-white font-bold text-xs hover:brightness-110 shadow-md shadow-blue-500/20"
            >
              Reset Filter Kategori
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

