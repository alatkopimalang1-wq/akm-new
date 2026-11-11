import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck, 
  Award, 
  Store, 
  Coffee, 
  Sparkles,
  Flame,
  ArrowRight
} from 'lucide-react';
import { CATEGORIES } from '../data/products';

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

export default function Hero({ onSelectCategory, onScrollToCatalog, onScrollToCalculator, onScrollToShowroom }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const navigate = useNavigate();

  // Auto-play timer (5 seconds)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
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

  const activeSlideData = HERO_SLIDES[currentSlide];

  // Helper index for left and right peeking slides
  const prevSlideIndex = (currentSlide - 1 + HERO_SLIDES.length) % HERO_SLIDES.length;
  const nextSlideIndex = (currentSlide + 1) % HERO_SLIDES.length;

  return (
    <section className="relative overflow-hidden bg-white pt-4 pb-12 sm:pt-6 sm:pb-16">
      
      {/* ========================================================================= */}
      {/* IMAGE SLIDER CAROUSEL (Persis Gambar ke-2 dengan 5 Slide & Efek Peeking) */}
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
          
          {/* LEFT PEEKING SLIDE (Slide Sebelumnya - Tampak di Sisi Kiri) */}
          <div 
            onClick={handlePrev}
            className="hidden lg:block absolute left-[-16%] xl:left-[-12%] w-[45%] h-[340px] xl:h-[390px] rounded-3xl overflow-hidden opacity-40 hover:opacity-70 transition-all duration-500 cursor-pointer shadow-lg scale-95 pointer-events-auto z-10"
          >
            <img 
              src={HERO_SLIDES[prevSlideIndex].image} 
              alt="Slide Sebelumnya" 
              onError={(e) => {
                if (HERO_SLIDES[prevSlideIndex].fallbackImage) {
                  e.target.src = HERO_SLIDES[prevSlideIndex].fallbackImage;
                }
              }}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30" />
          </div>

          {/* MAIN ACTIVE CENTER SLIDE (Hanya Menampilkan Gambar Bersih) */}
          <div className="relative w-full max-w-5xl h-[300px] sm:h-[380px] lg:h-[420px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl shadow-slate-900/15 z-20 transition-all duration-500 ease-out group">
            
            {/* Clickable Banner Image (Tanpa Teks / Judul / Deskripsi) */}
            <Link 
              to={activeSlideData.ctaLink} 
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
              src={HERO_SLIDES[nextSlideIndex].image} 
              alt="Slide Berikutnya" 
              onError={(e) => {
                if (HERO_SLIDES[nextSlideIndex].fallbackImage) {
                  e.target.src = HERO_SLIDES[nextSlideIndex].fallbackImage;
                }
              }}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30" />
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 5 INDICATOR DOTS (Persis Gambar ke-2 dengan Elongated Active Pill) */}
        {/* ========================================================================= */}
        <div className="flex items-center justify-center gap-2 mt-4 sm:mt-6">
          {HERO_SLIDES.map((_, index) => {
            const isActive = currentSlide === index;
            return (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`transition-all duration-300 rounded-full outline-none focus:outline-none ${
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
      {/* 4 TRUST BADGES (Keaslian, Garansi, Showroom & Konsultasi) */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 py-6 px-6 sm:px-8 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-xs">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200/60 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#0070f3]" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">100% Original</h4>
              <p className="text-[11px] text-slate-500">Garansi Resmi Distributor</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200/60 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5 text-[#0070f3]" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">Barista Tested</h4>
              <p className="text-[11px] text-slate-500">Standar Kedai Sanubari</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200/60 flex items-center justify-center shrink-0">
              <Store className="w-5 h-5 text-[#0070f3]" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">Showroom Malang</h4>
              <p className="text-[11px] text-slate-500">Test Drive Sebelum Beli</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200/60 flex items-center justify-center shrink-0">
              <Coffee className="w-5 h-5 text-[#0070f3]" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">Free Konsultasi</h4>
              <p className="text-[11px] text-slate-500">Rekomendasi Seduh Ahli</p>
            </div>
          </div>

        </div>

        {/* Quick Category Chips */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#0070f3]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Kategori Pilihan Cepat
              </h3>
            </div>
            <span className="text-xs text-slate-400">Pilih kategori untuk filter katalog</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {CATEGORIES.filter(c => c.id !== 'all').map((cat) => (
              <Link
                key={cat.id}
                to={`/kategori/${cat.slug}`}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white hover:bg-blue-50/50 border border-slate-200/80 hover:border-[#0070f3] transition-all text-center group active:scale-95 shadow-xs"
              >
                <div className="w-8 h-8 rounded-xl bg-blue-50 group-hover:bg-blue-100/70 flex items-center justify-center mb-1.5 transition-colors">
                  <Coffee className="w-4 h-4 text-[#0070f3]" />
                </div>
                <span className="text-xs font-semibold text-slate-800 group-hover:text-[#0070f3] transition-colors line-clamp-1">
                  {cat.name}
                </span>
                <span className="text-[10px] text-slate-400">
                  {cat.count} Produk
                </span>
              </Link>
            ))}
          </div>
        </div>

      </div>

    </section>
  );
}
