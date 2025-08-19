import React, { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const slides = [
    {
      id: 1,
      image: "/banner1.webp",
      title: "Modern Learning Facilities",
      subtitle: "Experience education in state-of-the-art campus environments",
    },
    {
      id: 2,
      image: "banner2.webp",
      title: "Interactive Campus Experience",
      subtitle: "Connect, learn, and grow in dynamic educational spaces",
    },
    {
      id: 3,
      image: "banner3.webp",
      title: "Excellence in Education",
      subtitle: "Join our community of learners in premium academic facilities",
    },
  ];

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 3000);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 3000);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 3000);
  };

  return (
    <section className="relative w-full h-screen overflow-hidden bg-gray-900 dark:bg-gray-950">
      {/* Slides Container */}
      <div
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={slide.id} className="min-w-full h-full relative">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover object-center"
              style={{
                imageRendering: "auto",
                filter: "brightness(0.8) contrast(1.1)",
              }}
              onError={(e) => {
                e.target.src = `/banner1.webp`; // Fallback image
              }}
            />

            {/* Dark Overlay for better text readability */}
            <div className="absolute inset-0 bg-black/40"></div>

            {/* Vignette Effect */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.5) 100%)",
              }}
            ></div>

            {/* Bottom Gradient for Navigation */}
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>

            {/* Top Gradient for Brand Accent */}
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#5D5CDE]/40 via-[#5D5CDE]/20 to-transparent"></div>

            {/* Content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white px-6 max-w-5xl">
                <h1
                  className="text-4xl md:text-5xl lg:text-7xl font-bold mb-8 text-white leading-tight"
                  style={{
                    textShadow:
                      "0 4px 8px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.6)",
                  }}
                >
                  {slide.title}
                </h1>
                <p
                  className="text-xl md:text-2xl lg:text-3xl text-gray-100 leading-relaxed font-medium"
                  style={{
                    textShadow: "0 2px 4px rgba(0,0,0,0.8)",
                  }}
                >
                  {slide.subtitle}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/25 hover:bg-white/40 backdrop-blur-md rounded-full p-4 md:p-5 text-white transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/30 shadow-xl"
      >
        <FiChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/25 hover:bg-white/40 backdrop-blur-md rounded-full p-4 md:p-5 text-white transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/30 shadow-xl"
      >
        <FiChevronRight className="w-6 h-6 md:w-8 md:h-8" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-4">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-4 h-4 rounded-full transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/30 ${
              currentSlide === index
                ? "bg-[#5D5CDE] scale-125 shadow-2xl ring-2 ring-white/50"
                : "bg-white/70 hover:bg-white/90 hover:scale-110"
            }`}
          />
        ))}
      </div>

      {/* Auto-play Indicator */}
      <div className="absolute top-8 right-8">
        <div
          className={`w-4 h-4 rounded-full transition-all duration-500 shadow-lg ${
            isAutoPlaying ? "bg-[#5D5CDE] animate-pulse" : "bg-white/50"
          }`}
        />
      </div>
    </section>
  );
};
