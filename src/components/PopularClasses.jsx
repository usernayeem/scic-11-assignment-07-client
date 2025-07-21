import React, { useState, useEffect } from "react";
import {
  FiArrowRight,
  FiUser,
  FiUsers,
  FiChevronLeft,
  FiChevronRight,
  FiStar,
  FiRefreshCw,
} from "react-icons/fi";
import { MdVerified, MdOutlineSchool } from "react-icons/md";
import { Link } from "react-router-dom";
import { useToast } from "../contexts/ToastContext";
import axios from "axios";

export const PopularClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const toast = useToast();

  // Responsive slides per view
  const [slidesPerView, setSlidesPerView] = useState(3);

  // Fetch popular classes with fallback
  const fetchPopularClasses = async () => {
    try {
      setLoading(true);

      // Try the popular classes endpoint first
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API}/classes/popular`
        );

        if (response.data.success && response.data.classes.length > 0) {
          setClasses(response.data.classes);
          return;
        }
      } catch (popularError) {
        console.log("Popular endpoint failed, trying fallback:", popularError);
      }

      // Fallback to all approved classes and sort on frontend
      const fallbackResponse = await axios.get(
        `${import.meta.env.VITE_API}/classes`
      );

      if (fallbackResponse.data.success) {
        const approvedClasses = fallbackResponse.data.classes
          .filter((cls) => cls.status === "approved")
          .sort((a, b) => {
            const aEnrollment = a.enrolledStudents?.length || 0;
            const bEnrollment = b.enrolledStudents?.length || 0;
            return bEnrollment - aEnrollment;
          })
          .slice(0, 6);

        setClasses(approvedClasses);
      } else {
        toast.error("Failed to fetch classes");
      }
    } catch (error) {
      console.error("Error fetching popular classes:", error);
      toast.error("Failed to load popular classes");
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
    if (!isAutoPlaying || classes.length <= slidesPerView) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => {
        const maxSlide = Math.max(0, classes.length - slidesPerView);
        return prev >= maxSlide ? 0 : prev + 1;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, classes.length, slidesPerView]);

  // Navigation functions
  const nextSlide = () => {
    setCurrentSlide((prev) => {
      const maxSlide = Math.max(0, classes.length - slidesPerView);
      return prev >= maxSlide ? 0 : prev + 1;
    });
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => {
      const maxSlide = Math.max(0, classes.length - slidesPerView);
      return prev <= 0 ? maxSlide : prev - 1;
    });
  };

  const goToSlide = (index) => {
    const maxSlide = Math.max(0, classes.length - slidesPerView);
    setCurrentSlide(Math.min(index, maxSlide));
  };

  // Truncate text helper
  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  useEffect(() => {
    fetchPopularClasses();
  }, []);

  if (loading) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-8">
            <div className="flex items-center justify-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5D5CDE]"></div>
              <span className="text-gray-600 dark:text-gray-300">
                Loading popular classes...
              </span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (classes.length === 0) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-[#5D5CDE] rounded-2xl mx-auto mb-6">
              <MdOutlineSchool className="text-white text-2xl" />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Popular Classes
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-6">
              No classes available at the moment. Check back soon for exciting
              courses!
            </p>
            <Link
              to="/all-class"
              className="inline-flex items-center bg-[#5D5CDE] hover:bg-[#4A4BC9] text-white px-6 py-3 rounded-xl font-semibold transition-colors duration-200 space-x-2"
            >
              <span>Browse All Classes</span>
              <FiArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const maxSlide = Math.max(0, classes.length - slidesPerView);
  const showNavigation = classes.length > slidesPerView;

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center w-16 h-16 bg-[#5D5CDE] rounded-2xl mx-auto mb-6">
            <FiStar className="text-white text-2xl" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Most Popular Classes
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-6">
            Discover the most sought-after courses chosen by thousands of
            learners worldwide
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
              {classes.map((classItem) => (
                <div
                  key={classItem._id}
                  className="flex-shrink-0 px-3"
                  style={{ width: `${100 / slidesPerView}%` }}
                >
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden group h-[450px] flex flex-col">
                    {/* Class Image */}
                    <div className="relative h-48 overflow-hidden flex-shrink-0">
                      <img
                        src={classItem.image}
                        alt={classItem.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src =
                            "https://i.ibb.co/GQzR5BLS/image-not-found.webp";
                        }}
                      />
                      <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#5D5CDE] text-white">
                          <FiStar className="w-3 h-3 mr-1" />
                          Popular
                        </span>
                      </div>
                      <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm font-medium">
                        ${classItem.price}
                      </div>
                      <div className="absolute bottom-4 right-4">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          <MdVerified className="w-3 h-3 mr-1" />
                          Approved
                        </span>
                      </div>
                    </div>

                    {/* Class Content */}
                    <div className="p-6 flex flex-col flex-grow">
                      {/* Title */}
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 group-hover:text-[#5D5CDE] transition-colors duration-200 truncate">
                        {classItem.title}
                      </h3>

                      {/* Instructor */}
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
                        <FiUser className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="truncate">
                          By {classItem.teacherName}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2 flex-grow">
                        {truncateText(classItem.description, 80)}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-6 mt-auto">
                        <div className="flex items-center">
                          <FiUsers className="w-4 h-4 mr-1" />
                          <span>
                            {classItem.enrolledStudents?.length || 0} enrolled
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-[#5D5CDE] text-lg">
                            ${classItem.price}
                          </span>
                        </div>
                      </div>

                      {/* Enroll Button */}
                      <Link
                        to={`/all-class/${classItem._id}`}
                        className="w-full bg-gradient-to-r from-[#5D5CDE] to-[#4A4BC9] text-white py-3 px-4 rounded-xl font-semibold text-sm hover:from-[#4A4BC9] hover:to-[#3A3AB9] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5D5CDE] transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl group/btn"
                      >
                        <span>Enroll Now</span>
                        <FiArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
                      </Link>
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

        {/* View All Classes Link */}
        <div className="text-center mt-12">
          <Link
            to="/all-class"
            className="inline-flex items-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-[#5D5CDE] hover:text-[#5D5CDE] transition-all duration-200 shadow-lg hover:shadow-xl space-x-2"
          >
            <span>Explore All Classes</span>
            <FiArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};
