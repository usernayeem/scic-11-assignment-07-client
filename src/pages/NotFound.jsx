import React from "react";
import { FiHome, FiArrowLeft } from "react-icons/fi";
import { MdOutlineSchool } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";

export const NotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden pt-20">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#5D5CDE] rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-20 h-20 bg-[#5D5CDE] rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-[#5D5CDE] rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-[#5D5CDE] rounded-full animate-bounce"></div>
        <div className="absolute top-1/2 left-10 w-12 h-12 bg-[#5D5CDE] rounded-full animate-ping"></div>
        <div className="absolute top-32 right-1/3 w-8 h-8 bg-[#5D5CDE] rounded-full animate-pulse"></div>
      </div>

      <div className="max-w-6xl mx-auto text-center relative z-10">
        {/* Main 404 Section */}
        <div className="mb-16">
          {/* Large 404 with modern styling */}
          <div className="relative mb-8">
            <h1 className="text-8xl md:text-9xl lg:text-[10rem] font-bold bg-gradient-to-r from-[#5D5CDE] via-[#4A4BC9] to-[#6B5CE8] bg-clip-text text-transparent leading-none mb-4">
              404
            </h1>
            <div className="absolute inset-0 text-8xl md:text-9xl lg:text-[10rem] font-bold text-[#5D5CDE] opacity-10 blur-sm leading-none">
              404
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Oops! Page Not Found
            </h2>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
              The page you’re looking for isn’t available. Don’t worry! We’ll
              help you get back to learning
            </p>

            {/* Decorative Elements */}
            <div className="flex items-center justify-center space-x-2 mb-8">
              <div className="w-2 h-2 bg-[#5D5CDE] rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-[#4A4BC9] rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-[#6B5CE8] rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button
              onClick={handleGoBack}
              className="bg-white dark:bg-gray-800 border-2 border-[#5D5CDE] text-[#5D5CDE] px-8 py-4 rounded-xl font-semibold text-base hover:bg-[#5D5CDE] hover:text-white transition-all duration-300 flex items-center space-x-2 min-w-[200px] justify-center shadow-lg hover:shadow-xl hover:-translate-y-1 group"
            >
              <FiArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
              <span>Go Back</span>
            </button>

            <Link
              to="/"
              className="bg-gradient-to-r from-[#5D5CDE] to-[#4A4BC9] text-white px-8 py-4 rounded-xl font-semibold text-base hover:from-[#4A4BC9] hover:to-[#3A3AB9] transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl min-w-[200px] justify-center hover:-translate-y-1 group"
            >
              <FiHome className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
