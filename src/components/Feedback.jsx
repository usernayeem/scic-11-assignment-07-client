import React, { useState, useEffect } from "react";
import {
  FiStar,
  FiChevronLeft,
  FiChevronRight,
  FiUser,
  FiRefreshCw,
  FiMessageCircle,
} from "react-icons/fi";
import { MdRateReview, MdOutlineSchool } from "react-icons/md";
import { useToast } from "../contexts/ToastContext";
import axios from "axios";

export const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const toast = useToast();

  // Responsive slides per view
  const [slidesPerView, setSlidesPerView] = useState(3);

  // Fetch feedback data
  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API}/teaching-evaluations`
      );

      if (response.data.success) {
        // Filter only completed evaluations with ratings
        const validFeedbacks = response.data.evaluations
          .filter(
            (evaluation) =>
              evaluation.rating >= 4 && evaluation.description.trim()
          )
          .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
          .slice(0, 12); // Limit to most recent 12 high-rated feedbacks

        setFeedbacks(validFeedbacks);
      } else {
        toast.error("Failed to fetch feedback");
      }
    } catch (error) {
      toast.error("Failed to load feedback");
    } finally {
      setLoading(false);
    }
  };

  // Handle responsive slides per view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSlidesPerView(1);
      } else if (window.innerWidth < 1024) {
        setSlidesPerView(2);
      } else {
        setSlidesPerView(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    if (!isAutoPlaying || feedbacks.length <= slidesPerView) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => {
        const maxSlide = Math.max(0, feedbacks.length - slidesPerView);
        return prev >= maxSlide ? 0 : prev + 1;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, feedbacks.length, slidesPerView]);

  // Navigation functions
  const nextSlide = () => {
    setCurrentSlide((prev) => {
      const maxSlide = Math.max(0, feedbacks.length - slidesPerView);
      return prev >= maxSlide ? 0 : prev + 1;
    });
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => {
      const maxSlide = Math.max(0, feedbacks.length - slidesPerView);
      return prev <= 0 ? maxSlide : prev - 1;
    });
  };

  const goToSlide = (index) => {
    const maxSlide = Math.max(0, feedbacks.length - slidesPerView);
    setCurrentSlide(Math.min(index, maxSlide));
  };

  // Truncate text helper
  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Render star rating
  const renderStarRating = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <FiStar
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? "text-yellow-400 fill-current"
                : "text-gray-300 dark:text-gray-600"
            }`}
          />
        ))}
      </div>
    );
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  if (loading) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-8">
            <div className="flex items-center justify-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5D5CDE]"></div>
              <span className="text-gray-600 dark:text-gray-300">
                Loading feedback...
              </span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (feedbacks.length === 0) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-[#5D5CDE] rounded-2xl mx-auto mb-6">
              <MdRateReview className="text-white text-2xl" />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Student Feedback
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-6">
              No feedback available yet. Student reviews will appear here once
              they start sharing their experiences.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const maxSlide = Math.max(0, feedbacks.length - slidesPerView);
  const showNavigation = feedbacks.length > slidesPerView;

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center w-16 h-16 bg-[#5D5CDE] rounded-2xl mx-auto mb-6">
            <MdRateReview className="text-white text-2xl" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            What Our Students Say
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-6">
            Discover the experiences and success stories shared by our amazing
            students and their journey with our expert instructors.
          </p>
        </div>

        {/* Slider Container */}
        <div
          className="relative"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Navigation Arrows */}
          {showNavigation && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-[#5D5CDE] dark:hover:text-[#5D5CDE] hover:border-[#5D5CDE] p-3 rounded-full transition-all duration-200 z-10 shadow-lg hover:shadow-xl"
              >
                <FiChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-[#5D5CDE] dark:hover:text-[#5D5CDE] hover:border-[#5D5CDE] p-3 rounded-full transition-all duration-200 z-10 shadow-lg hover:shadow-xl"
              >
                <FiChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Slides Container */}
          <div className="overflow-hidden rounded-2xl">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${
                  (currentSlide * 100) / slidesPerView
                }%)`,
              }}
            >
              {feedbacks.map((feedback) => (
                <div
                  key={feedback._id}
                  className="flex-shrink-0 px-3"
                  style={{ width: `${100 / slidesPerView}%` }}
                >
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden group h-[400px] flex flex-col">
                    {/* Header with Rating */}
                    <div className="p-6 pb-4 flex-shrink-0">
                      <div className="flex items-center justify-between mb-4">
                        {renderStarRating(feedback.rating)}
                        <div className="flex items-center justify-center w-8 h-8 bg-[#5D5CDE] bg-opacity-10 rounded-lg">
                          <FiMessageCircle className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Feedback Content */}
                    <div className="px-6 pb-4 flex-grow flex flex-col">
                      {/* Feedback Text */}
                      <blockquote className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 flex-grow">
                        "{truncateText(feedback.description, 150)}"
                      </blockquote>

                      {/* Class Title */}
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Class:
                        </p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {feedback.classTitle || "EduManage Course"}
                        </p>
                      </div>
                    </div>

                    {/* Student Info Footer */}
                    <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 flex-shrink-0">
                      <div className="flex items-center space-x-3">
                        <img
                          src={
                            feedback.studentPhotoURL ||
                            "https://i.ibb.co/4wsPz9SL/profile-removebg-preview.webp"
                          }
                          alt={feedback.studentName || "Student"}
                          className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600 flex-shrink-0"
                          onError={(e) => {
                            e.target.src =
                              "https://i.ibb.co/4wsPz9SL/profile-removebg-preview.webp";
                          }}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {feedback.studentName || "Anonymous Student"}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Verified Student
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Slide Indicators */}
          {showNavigation && (
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: maxSlide + 1 }, (_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    currentSlide === index
                      ? "bg-[#5D5CDE] scale-125"
                      : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
