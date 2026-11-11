import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck, 
  Truck,
  BadgeCheck,
  Headphones,
  Award, 
  Store, 
  Coffee, 
  Sparkles,
  ArrowRight,
  Check
} from 'lucide-react';
import { STORE_INFO, OFFICIAL_BRANDS_DATA } from '../data/products';
import { getStoredHeroSlides } from '../utils/contentStore';

export const HERO_SLIDES = [
  {
    id: 'dirty-latte',
    title: 'Dirty Latte Sanubari',
    ctaLink: '/kategori/espresso-beans',
    image: '/slides/dirty-latte-banner.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=1600&q=85',
  },
  {
    id: 'manual-brew',
    title: 'Manual Brew Mastery',
    ctaLink: '/kategori/manual-brew',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1600&q=85',
  },
  {
    id: 'hand-grinder',
    title: 'Hand Grinder Presisi',
    ctaLink: '/kategori/grinder',
    image: 'https://images.unsplash.com/photo-1589396575653-c09c794ff6a6?auto=format&fit=crop&w=1600&q=85',
  },
  {
    id: 'flair-58',
    title: 'Flair 58 Commercial Lever',
    ctaLink: '/product/akm-flair-58',
    image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1600&q=85',
  },
  {
    id: 'roastery-beans',
    title: 'Specialty Coffee Beans',
    ctaLink: '/kategori/filter-beans',
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1600&q=85',
  }
];

// Data Kategori Pilihan (Diselaraskan Persis dengan Kategori Produk yang Sudah Ada di Toko)
export const KATEGORI_PILIHAN_ITEMS = [
  {
    id: 'filter-beans',
    name: 'Filter Beans',
    link: '/kategori/filter-beans',
    iconType: 'filter-beans'
  },
  {
    id: 'espresso-beans',
    name: 'Espresso Beans',
    link: '/kategori/espresso-beans',
    iconType: 'espresso-beans'
  },
  {
    id: 'manual-brew',
    name: 'Manual Brew',
    link: '/kategori/manual-brew',
    iconType: 'manual-brew'
  },
  {
    id: 'grinder',
    name: 'Grinder Kopi',
    link: '/kategori/grinder',
    iconType: 'grinder'
  },
  {
    id: 'espresso-tools',
    name: 'Espresso & Lever',
    link: '/kategori/espresso-tools',
    iconType: 'lever'
  },
  {
    id: 'kettle',
    name: 'Kettle Gooseneck',
    link: '/kategori/kettle',
    iconType: 'kettle'
  },
  {
    id: 'scale',
    name: 'Scale & Timer',
    link: '/kategori/scale',
    iconType: 'scale'
  },
  {
    id: 'accessories',
    name: 'Aksesoris & Filter',
    link: '/kategori/accessories',
    iconType: 'accessories'
  },
  {
    id: 'bundles',
    name: 'Paket Starter Kit',
    badge: 'HEMAT',
    link: '/kategori/bundles',
    iconType: 'bundle'
  },
  {
    id: 'panduan-seduh',
    name: 'Panduan Seduh',
    link: '/panduan-seduh',
    iconType: 'guide'
  },
  {
    id: 'wholesale',
    name: 'Kemitraan B2B',
    link: '/wholesale',
    iconType: 'b2b'
  }
];

export default function Hero({ onSelectCategory, onScrollToCatalog, onScrollToCalculator, onScrollToShowroom }) {
  const [slides, setSlides] = useState(() => getStoredHeroSlides());
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const categoryScrollRef = useRef(null);
  const brandScrollRef = useRef(null);
  const navigate = useNavigate();

  // Listen to admin banner updates
  useEffect(() => {
    const handleStorageUpdate = () => {
      setSlides(getStoredHeroSlides());
    };
    window.addEventListener('akm_content_updated', handleStorageUpdate);
    return () => window.removeEventListener('akm_content_updated', handleStorageUpdate);
  }, []);

  // Auto-play timer for hero banner slider (5 seconds)
  useEffect(() => {
    if (isPaused || slides.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const handlePrev = () => {
    if (slides.length === 0) return;
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (slides.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      handleNext();
    }
    if (touchStartX.current - touchEndX.current < -50) {
      handlePrev();
    }
  };

  // Scroll handler for Category Carousel
  const scrollCategoryCarousel = (direction) => {
    if (categoryScrollRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      categoryScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'auto' });
    }
  };

  // Scroll handler for Brand Carousel
  const scrollBrandCarousel = (direction) => {
    if (brandScrollRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      brandScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'auto' });
    }
  };

  const totalSlides = slides.length > 0 ? slides.length : 1;
  const activeSlideData = slides[currentSlide % totalSlides] || HERO_SLIDES[0];

  // Helper index for left and right peeking slides
  const prevSlideIndex = (currentSlide - 1 + totalSlides) % totalSlides;
  const nextSlideIndex = (currentSlide + 1) % totalSlides;

  // Render circular icon emblems matching the user's screenshot
  const renderCategoryEmblem = (type) => {
    switch (type) {
      case 'filter-beans':
        return (
          <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
            <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" fill="currentColor" fillOpacity="0.15" />
            <path d="M6 2v2M10 2v2M14 2v2" strokeLinecap="round" />
            <ellipse cx="19" cy="19" rx="2.5" ry="3.5" transform="rotate(30 19 19)" fill="currentColor" />
          </svg>
        );
      case 'espresso-beans':
        return (
          <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="9" cy="9" r="6" stroke="currentColor" />
            <path d="M13.5 13.5L20 20" strokeWidth="2.5" strokeLinecap="round" />
            <ellipse cx="8" cy="8" rx="2" ry="3.5" transform="rotate(-30 8 8)" fill="currentColor" />
            <circle cx="16" cy="6" r="2.5" fill="currentColor" />
            <circle cx="19" cy="10" r="2" fill="currentColor" />
          </svg>
        );
      case 'robusta':
        return (
          <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 18c2-3 4-8 4-13M20 18c-2-3-4-8-4-13" strokeLinecap="round" />
            <path d="M5 13c3-1 4-2 4-2M19 13c-3-1-4-2-4-2" />
            <path d="M8 8l4-3 4 3-2 3H10z" fill="currentColor" />
            <ellipse cx="12" cy="15" rx="2.8" ry="4.5" fill="currentColor" stroke="currentColor" />
            <path d="M12 12c.5 1.5 1 3.5 1 6" stroke="#000" strokeWidth="1.2" />
          </svg>
        );
      case 'cybr':
        return (
          <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M6 3h12l-4 7v6l-4 2v-8z" fill="currentColor" fillOpacity="0.2" />
            <text x="12" y="14" textAnchor="middle" fill="currentColor" fontSize="6" fontWeight="bold" fontFamily="sans-serif">CY</text>
            <text x="12" y="20" textAnchor="middle" fill="currentColor" fontSize="5" fontWeight="bold" fontFamily="sans-serif">BR</text>
          </svg>
        );
      case 'b2b':
        return (
          <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M11 17l-5-5 5-5M13 7l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="7" r="2" fill="currentColor" />
            <circle cx="7" cy="12" r="2" fill="currentColor" />
            <circle cx="17" cy="12" r="2" fill="currentColor" />
            <path d="M7 17l3-3 4 4 3-3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'roasting':
        return (
          <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="5" y="4" width="14" height="10" rx="3" fill="currentColor" fillOpacity="0.2" />
            <circle cx="12" cy="9" r="3" stroke="currentColor" />
            <path d="M8 17c1 2 2 3 4 3s3-1 4-3" strokeLinecap="round" />
            <path d="M12 14c-1 1-1 2 0 3s1-1 0-3" fill="currentColor" />
            <path d="M9 20h6" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
      case 'guide':
        return (
          <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
            <path d="M6 6h10M6 10h10M6 14h6" strokeLinecap="round" />
            <circle cx="15" cy="14" r="2" fill="currentColor" />
          </svg>
        );
      case 'manual-brew':
        return (
          <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M5 4h14l-4 7v6a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-6z" fill="currentColor" fillOpacity="0.2" />
            <path d="M3 4h18" strokeLinecap="round" />
          </svg>
        );
      case 'grinder':
        return (
          <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="8" y="7" width="8" height="13" rx="2" fill="currentColor" fillOpacity="0.2" />
            <path d="M12 7V3l6-1" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="18" cy="2" r="1.5" fill="currentColor" />
            <path d="M8 13h8" strokeLinecap="round" />
          </svg>
        );
      case 'lever':
        return (
          <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M6 19h12M12 19V7M8 4l4 3 4-3" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="7" r="3" fill="currentColor" fillOpacity="0.3" />
          </svg>
        );
      case 'kettle':
        return (
          <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M6 9h12v9a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9Z" fill="currentColor" fillOpacity="0.2" />
            <path d="M18 12c3-1 4-5 2-8M6 14c-4-2-4-8-1-10" strokeLinecap="round" />
            <path d="M9 5h6" strokeLinecap="round" />
          </svg>
        );
      case 'scale':
        return (
          <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="4" y="5" width="16" height="14" rx="3" fill="currentColor" fillOpacity="0.2" />
            <rect x="8" y="8" width="8" height="4" rx="1" stroke="currentColor" />
            <circle cx="12" cy="15" r="1.5" fill="currentColor" />
          </svg>
        );
      case 'accessories':
        return (
          <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" fillOpacity="0.2" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="3" y="8" width="18" height="12" rx="2" fill="currentColor" fillOpacity="0.2" />
            <path d="M12 8v12M3 13h18" />
            <path d="M12 8a3 3 0 0 0-3-3H7v3M12 8a3 3 0 0 1 3-3h2v3" />
          </svg>
        );
    }
  };

  return (
    <section className="relative overflow-hidden bg-white pt-4 pb-12 sm:pt-6 sm:pb-16">
      
      {/* ========================================================================= */}
      {/* HERO BANNER SLIDER (5 Slide Bersih Tanpa Teks Overlay) */}
      {/* ========================================================================= */}
      <div 
        className="relative w-full max-w-[1400px] mx-auto px-2 sm:px-4 lg:px-6"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div 
          className="relative flex items-center justify-center overflow-hidden py-2"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          
          {/* LEFT PEEKING SLIDE (Slide Sebelumnya - Tampak di Sisi Kanan) */}
          <div 
            onClick={handlePrev}
            className="hidden lg:block absolute left-[-16%] xl:left-[-12%] w-[45%] h-[340px] xl:h-[390px] rounded-3xl overflow-hidden opacity-40 hover:opacity-70 transition-all duration-500 cursor-pointer shadow-lg scale-95 pointer-events-auto z-10"
          >
            <img 
              src={(slides[prevSlideIndex] || slides[0]).image} 
              alt="Slide Sebelumnya" 
              onError={(e) => {
                if ((slides[prevSlideIndex] || slides[0]).fallbackImage) {
                  e.target.src = (slides[prevSlideIndex] || slides[0]).fallbackImage;
                }
              }}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30" />
          </div>

          {/* MAIN ACTIVE CENTER SLIDE (Hanya Menampilkan Gambar Bersih) */}
          <div className="relative w-full max-w-5xl h-[300px] sm:h-[380px] lg:h-[420px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl shadow-slate-900/15 z-20 transition-all duration-500 ease-out group">
            
            {/* Clickable Banner Image */}
            <Link 
              to={activeSlideData.ctaLink || '/kategori/all'} 
              className="block w-full h-full cursor-pointer overflow-hidden focus:outline-none"
              title={`Buka ${activeSlideData.title}`}
            >
              <img
                src={activeSlideData.image}
                alt={activeSlideData.title}
                onError={(e) => {
                  if (activeSlideData.fallbackImage) {
                    e.target.src = activeSlideData.fallbackImage;
                  }
                }}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </Link>

            {/* Navigation Arrow LEFT (Circular Pill) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-30 outline-none focus:outline-none cursor-pointer"
              title="Slide Sebelumnya"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-slate-800" />
            </button>

            {/* Navigation Arrow RIGHT (Circular Pill) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-30 outline-none focus:outline-none cursor-pointer"
              title="Slide Berikutnya"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-slate-800" />
            </button>

          </div>

          {/* RIGHT PEEKING SLIDE (Slide Berikutnya - Tampak di Sisi Kanan) */}
          <div 
            onClick={handleNext}
            className="hidden lg:block absolute right-[-16%] xl:right-[-12%] w-[45%] h-[340px] xl:h-[390px] rounded-3xl overflow-hidden opacity-40 hover:opacity-70 transition-all duration-500 cursor-pointer shadow-lg scale-95 pointer-events-auto z-10"
          >
            <img 
              src={(slides[nextSlideIndex] || slides[0]).image} 
              alt="Slide Berikutnya" 
              onError={(e) => {
                if ((slides[nextSlideIndex] || slides[0]).fallbackImage) {
                  e.target.src = (slides[nextSlideIndex] || slides[0]).fallbackImage;
                }
              }}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30" />
          </div>

        </div>

        {/* INDICATOR DOTS (Elongated Active Pill) */}
        <div className="flex items-center justify-center gap-2 mt-4 sm:mt-6">
          {slides.map((_, index) => {
            const isActive = currentSlide === index;
            return (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`transition-all duration-300 rounded-full outline-none focus:outline-none cursor-pointer ${
                  isActive
                    ? 'w-7 sm:w-8 h-2 sm:h-2.5 bg-[#0b1e36] shadow-sm'
                    : 'w-2 sm:w-2.5 h-2 sm:h-2.5 bg-slate-300 hover:bg-slate-400'
                }`}
                title={`Pindah ke slide ${index + 1}`}
              />
            );
          })}
        </div>

      </div>

      {/* ========================================================================= */}
      {/* KATEGORI PILIHAN CAROUSEL (Persis Gambar yang Diunggah Pengguna) */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
        
        {/* Section Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Kategori Pilihan
          </h2>
        </div>

        {/* Carousel Outer Container with Left & Right Arrow Buttons */}
        <div className="relative px-1 sm:px-2">
          
          {/* Carousel Scroll Left Button - Hidden on mobile, visible on desktop */}
          <button
            onClick={() => scrollCategoryCarousel('left')}
            className="hidden sm:flex absolute -left-2 sm:-left-4 top-[44px] sm:top-[48px] -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-slate-200 text-slate-700 shadow-md hover:bg-slate-50 hover:text-[#0e1f36] items-center justify-center transition-all z-20 hover:scale-110 active:scale-95 cursor-pointer outline-none focus:outline-none"
            title="Geser kategori ke kiri"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Carousel Scrollable Track */}
          <div
            ref={categoryScrollRef}
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            className="flex items-start gap-6 sm:gap-10 overflow-x-auto no-scrollbar [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth snap-x snap-mandatory py-3 px-3 sm:px-4"
          >
            {KATEGORI_PILIHAN_ITEMS.map((item) => {
              const content = (
                <div className="flex flex-col items-center group/cat cursor-pointer shrink-0 select-none w-20 sm:w-24 text-center snap-start">
                  
                  {/* Circular Emblem Container with Badge */}
                  <div className="relative mb-2.5">
                    
                    {/* Badge "BARU" for C.Y.B.R */}
                    {item.badge && (
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-[#8B5A2B] text-white text-[9px] font-black uppercase tracking-wider shadow-sm z-10 whitespace-nowrap">
                        {item.badge}
                      </span>
                    )}

                    {/* Outer Light Gray Circle */}
                    <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-slate-100 group-hover/cat:bg-slate-200/60 flex items-center justify-center transition-all duration-300 group-hover/cat:scale-105 shadow-xs border border-slate-200/60 group-hover/cat:border-[#0e1f36]/30">
                      
                      {/* Inner Dark / Black Circle */}
                      <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-[#111827] group-hover/cat:bg-[#0e1f36] flex items-center justify-center transition-colors shadow-sm">
                        {renderCategoryEmblem(item.iconType)}
                      </div>

                    </div>
                  </div>

                  {/* Label Text */}
                  <span className="text-xs sm:text-sm font-semibold text-slate-800 group-hover/cat:text-[#0e1f36] transition-colors leading-tight line-clamp-2">
                    {item.name}
                  </span>

                </div>
              );

              if (item.isExternal) {
                return (
                  <a
                    key={item.id}
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="focus:outline-none"
                  >
                    {content}
                  </a>
                );
              }

              return (
                <Link
                  key={item.id}
                  to={item.link}
                  className="focus:outline-none"
                >
                  {content}
                </Link>
              );
            })}
          </div>

          {/* Carousel Scroll Right Button - Hidden on mobile, visible on desktop */}
          <button
            onClick={() => scrollCategoryCarousel('right')}
            className="hidden sm:flex absolute -right-2 sm:-right-4 top-[44px] sm:top-[48px] -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-slate-200 text-slate-700 shadow-md hover:bg-slate-50 hover:text-[#0e1f36] items-center justify-center transition-all z-20 hover:scale-110 active:scale-95 cursor-pointer outline-none focus:outline-none"
            title="Geser kategori ke kanan"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 4 FITUR UNGGULAN / TRUST CARDS (2 Kolom di Mobile, 4 Kolom di Desktop) */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-14">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
          
          {/* Card 1: Pengiriman Cepat */}
          <div className="flex items-center gap-2.5 sm:gap-4 p-3 sm:p-4 lg:p-5 rounded-xl sm:rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all">
            <div className="w-8 h-8 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-lg sm:rounded-xl bg-[#eef4ff] flex items-center justify-center shrink-0">
              <Truck className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-[#2563eb]" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm lg:text-sm font-bold text-slate-900 leading-tight truncate">Pengiriman Cepat</h4>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-tight truncate">Order Langsung Kirim</p>
            </div>
          </div>

          {/* Card 2: 100% Original */}
          <div className="flex items-center gap-2.5 sm:gap-4 p-3 sm:p-4 lg:p-5 rounded-xl sm:rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all">
            <div className="w-8 h-8 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-lg sm:rounded-xl bg-[#eef4ff] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-[#2563eb]" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm lg:text-sm font-bold text-slate-900 leading-tight truncate">100% Original</h4>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-tight truncate">Garansi uang kembali</p>
            </div>
          </div>

          {/* Card 3: Produk Bergaransi */}
          <div className="flex items-center gap-2.5 sm:gap-4 p-3 sm:p-4 lg:p-5 rounded-xl sm:rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all">
            <div className="w-8 h-8 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-lg sm:rounded-xl bg-[#eef4ff] flex items-center justify-center shrink-0">
              <BadgeCheck className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-[#2563eb]" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm lg:text-sm font-bold text-slate-900 leading-tight truncate">Produk Bergaransi</h4>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-tight truncate">Garansi Toko & Distributor</p>
            </div>
          </div>

          {/* Card 4: Free Konsultasi */}
          <div className="flex items-center gap-2.5 sm:gap-4 p-3 sm:p-4 lg:p-5 rounded-xl sm:rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all">
            <div className="w-8 h-8 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-lg sm:rounded-xl bg-[#eef4ff] flex items-center justify-center shrink-0">
              <Headphones className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-[#2563eb]" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm lg:text-sm font-bold text-slate-900 leading-tight truncate">Free Konsultasi</h4>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-tight truncate">24 Jam</p>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* BRAND PILIHAN CAROUSEL (Clean / Frameless tanpa background box) */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 sm:mt-14">
        <div>
          
          {/* Section Header: Title left, "Semua Brand >" right */}
          <div className="flex items-center justify-between mb-5 sm:mb-6">
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Brand Pilihan
            </h3>
            <Link
              to="/brands"
              className="text-xs sm:text-sm font-bold text-[#0e1f36] hover:underline flex items-center gap-1 transition-colors"
            >
              <span>Semua Brand</span>
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </Link>
          </div>

          {/* Carousel Outer Container with Left & Right Arrow Buttons */}
          <div className="relative px-1">
            
            {/* Carousel Scroll Left Button - Hidden on mobile, visible on desktop */}
            <button
              onClick={() => scrollBrandCarousel('left')}
              className="hidden sm:flex absolute -left-3 sm:-left-5 top-[40px] sm:top-[48px] -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white border border-slate-200 text-slate-700 shadow-md hover:bg-slate-50 hover:text-[#0e1f36] items-center justify-center transition-all z-20 hover:scale-110 active:scale-95 cursor-pointer outline-none focus:outline-none"
              title="Geser brand ke kiri"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Brand Scrollable Track */}
            <div
              ref={brandScrollRef}
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              className="flex items-start gap-4 sm:gap-6 overflow-x-auto no-scrollbar [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth snap-x snap-mandatory py-2 px-1"
            >
              {OFFICIAL_BRANDS_DATA.map((brand) => (
                <Link
                  key={brand.id}
                  to={`/kategori/all?brand=${encodeURIComponent(brand.name)}`}
                  className="flex flex-col items-center group/brand cursor-pointer shrink-0 select-none w-20 sm:w-24 text-center snap-start focus:outline-none"
                  title={`Lihat produk resmi ${brand.name}`}
                >
                  
                  {/* Circular Emblem Container with Pastel Ring & Verified Checkmark */}
                  <div className="relative mb-2.5">
                    <div
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center font-black tracking-wider uppercase transition-transform duration-300 group-hover/brand:scale-105 shadow-xs"
                      style={{
                        backgroundColor: brand.bg,
                        borderColor: brand.border,
                        borderWidth: '2.5px',
                        color: brand.text
                      }}
                    >
                      {brand.logoType === 'akm' ? (
                        <div className="flex flex-col items-center leading-none text-center p-1">
                          <Coffee className="w-5 h-5 mb-0.5 text-[#6b21a8]" />
                          <span className="text-[8px] sm:text-[9px] font-black tracking-tighter">ALAT KOPI</span>
                          <span className="text-[6px] sm:text-[7px] font-bold tracking-widest text-[#9333ea]">MALANG</span>
                        </div>
                      ) : brand.logoType === 'sanubari' ? (
                        <div className="flex flex-col items-center leading-none text-center p-1">
                          <span className="text-[9px] sm:text-[10px] font-black tracking-tight text-[#0369a1]">SANUBARI</span>
                          <span className="text-[6px] sm:text-[7px] font-semibold text-[#0284c7]">ROASTERY</span>
                        </div>
                      ) : (
                        <span className="text-xs sm:text-sm font-black px-1 tracking-tight truncate max-w-full">
                          {brand.shortName}
                        </span>
                      )}
                    </div>

                    {/* Verified Blue Badge Checkmark (Persis Screenshot) */}
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#0070f3] border-2 border-white flex items-center justify-center text-white shadow-xs">
                      <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[3]" />
                    </div>
                  </div>

                  {/* Brand Name Label Text below Circle */}
                  <span className="text-xs sm:text-sm font-semibold text-slate-800 group-hover/brand:text-[#0e1f36] transition-colors leading-tight line-clamp-1 truncate max-w-[76px] sm:max-w-[92px]">
                    {brand.name}
                  </span>

                </Link>
              ))}
            </div>

            {/* Carousel Scroll Right Button - Hidden on mobile, visible on desktop */}
            <button
              onClick={() => scrollBrandCarousel('right')}
              className="hidden sm:flex absolute -right-3 sm:-right-5 top-[40px] sm:top-[48px] -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white border border-slate-200 text-slate-700 shadow-md hover:bg-slate-50 hover:text-[#0e1f36] items-center justify-center transition-all z-20 hover:scale-110 active:scale-95 cursor-pointer outline-none focus:outline-none"
              title="Geser brand ke kanan"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

          </div>

        </div>
      </div>

    </section>
  );
}
