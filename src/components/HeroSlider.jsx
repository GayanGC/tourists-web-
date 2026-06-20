import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, ArrowRight } from 'lucide-react';

const SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1920&q=80",
    title: "Sigiriya Rock Fortress",
    subtitle: "Cultural Heritage",
    tagline: "Climb the majestic 8th Wonder of the World and explore ancient palaces floating in the clouds."
  },
  {
    image: "https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1920&q=80",
    title: "Nine Arch Bridge, Ella",
    subtitle: "Misty Mountain Highlands",
    tagline: "Watch old colonial trains steam across towering arches surrounded by lush green tea plantations."
  },
  {
    image: "https://images.unsplash.com/photo-1588598126702-86105f2bf376?auto=format&fit=crop&w=1920&q=80",
    title: "Southern Beach Paradises",
    subtitle: "Coastal Getaways",
    tagline: "Relax on golden sands under leaning palms and experience legendary Mirissa whale watching tours."
  }
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const scrollToSection = (id) => {
    const targetElement = document.querySelector(id);
    if (targetElement) {
      const navHeight = 80;
      const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="home" className="relative h-screen min-h-[600px] w-full overflow-hidden bg-slate-950">
      {/* Slides Container */}
      <div className="absolute inset-0 w-full h-full">
        {SLIDES.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              idx === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Image Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/40 to-slate-950/80 z-10"></div>
            <img
              src={slide.image}
              alt={slide.title}
              className="absolute inset-0 w-full h-full object-cover scale-105 transition-transform duration-[6000ms]"
              style={{ transform: idx === current ? 'scale(1.0)' : 'scale(1.05)' }}
            />
          </div>
        ))}
      </div>

      {/* Slide Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full border border-white/20 bg-slate-900/30 backdrop-blur-sm text-white flex items-center justify-center hover:bg-emerald-600 hover:border-emerald-500 hover:scale-105 transition-all duration-300"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full border border-white/20 bg-slate-900/30 backdrop-blur-sm text-white flex items-center justify-center hover:bg-emerald-600 hover:border-emerald-500 hover:scale-105 transition-all duration-300"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === current ? 'w-8 bg-emerald-500' : 'w-2 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          ></button>
        ))}
      </div>

      {/* Main Hero Content */}
      <div className="absolute inset-0 z-15 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl text-left">
            {SLIDES.map((slide, idx) => (
              <div
                key={idx}
                className={`transition-all duration-700 ease-out ${
                  idx === current
                    ? 'opacity-100 translate-y-0 relative'
                    : 'opacity-0 translate-y-8 absolute pointer-events-none'
                }`}
              >
                {idx === current && (
                  <>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30 mb-4 animate-fade-in">
                      {slide.subtitle}
                    </span>
                    <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold font-display text-white tracking-tight leading-none mb-6">
                      {slide.title.split(',')[0]}
                      {slide.title.includes(',') && (
                        <span className="block text-emerald-400 text-3xl sm:text-5xl md:text-6xl mt-2">
                          {slide.title.split(',')[1]}
                        </span>
                      )}
                    </h1>
                    <p className="text-lg sm:text-xl text-slate-300 max-w-xl mb-8 leading-relaxed">
                      {slide.tagline}
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <button
                        onClick={() => scrollToSection('#planner')}
                        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-950/40 hover:-translate-y-0.5 hover:shadow-emerald-500/20 transition-all duration-300 group"
                      >
                        <span>Plan Your Tour</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                      <button
                        onClick={() => scrollToSection('#rates')}
                        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-slate-900/60 hover:bg-slate-800/80 border border-slate-700 hover:border-slate-500 text-white font-semibold shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                      >
                        <Calendar className="w-5 h-5 text-amber-400" />
                        <span>Airport Transfers</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
