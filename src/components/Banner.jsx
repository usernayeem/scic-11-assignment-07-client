import React, { useState, useEffect } from "react";
import {
  FiArrowRight,
  FiPlay,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { MdSchool, MdGroups, MdComputer } from "react-icons/md";

export const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const bannerSlides = [
    {
      id: 1,
      title: "Master New Skills Today",
      subtitle: "Join thousands of learners worldwide",
      description: "Access premium courses and learn from expert instructors",
      background: "bg-gradient-to-r from-[#5D5CDE] to-[#4A4BC9]",
      icon: MdSchool,
    },
    {
      id: 2,
      title: "Learn from Expert Instructors",
      subtitle: "Industry professionals teaching real skills",
      description: "Get personalized guidance and hands-on experience",
      background: "bg-gradient-to-r from-[#4A4BC9] to-[#6B5CE8]",
      icon: MdGroups,
    },
    {
      id: 3,
      title: "Interactive Online Classes",
      subtitle: "Modern learning experience",
      description: "Engage with cutting-edge technology and tools",
      background: "bg-gradient-to-r from-[#6B5CE8] to-[#5D5CDE]",
      icon: MdComputer,
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length
    );
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden pt-8 md:pt-0">
      {/* Slides Container */}
      <div
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {bannerSlides.map((slide) => {
          const IconComponent = slide.icon;
          return (
            <div
              key={slide.id}
              className={`min-w-full h-full ${slide.background} relative overflow-hidden`}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full"></div>
                <div className="absolute top-40 right-20 w-20 h-20 bg-white rounded-full"></div>
                <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-white rounded-full"></div>
                <div className="absolute bottom-10 right-10 w-24 h-24 bg-white rounded-full"></div>
              </div>

              {/* Content */}
              <div className="relative z-10 h-full flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div className="text-center">
                    {/* Icon */}
                    <div className="flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-2xl mx-auto mb-6 text-gray-500">
                      <IconComponent className="text-gray text-3xl" />
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                      {slide.title}
                    </h1>

                    {/* Subtitle */}
                    <h2 className="text-xl md:text-2xl text-white text-opacity-90 mb-4">
                      {slide.subtitle}
                    </h2>

                    {/* Description */}
                    <p className="text-lg md:text-xl text-white text-opacity-80 mb-8 max-w-2xl mx-auto">
                      {slide.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition-all duration-200 z-20 backdrop-blur-sm"
      >
        <FiChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition-all duration-200 z-20 backdrop-blur-sm"
      >
        <FiChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {bannerSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              currentSlide === index
                ? "bg-white bg-opacity-50 hover:bg-opacity-70"
                : "bg-[#5D5CDE] scale-110"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
