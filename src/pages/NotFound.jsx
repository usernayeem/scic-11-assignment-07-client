import React from "react";
import {
  FiHome,
  FiArrowLeft,
  FiSearch,
  FiBookOpen,
  FiUsers,
  FiAward,
} from "react-icons/fi";
import { MdOutlineSchool } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";

export const NotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#5D5CDE] rounded-full"></div>
        <div className="absolute top-40 right-20 w-20 h-20 bg-[#5D5CDE] rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-[#5D5CDE] rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-[#5D5CDE] rounded-full"></div>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* 404 Error Section */}
        <div className="mb-12">
          {/* Large 404 */}
          <div className="mb-8">
            <h1 className="text-8xl md:text-9xl lg:text-[12rem] font-bold text-[#5D5CDE] opacity-20 leading-none">
              404
            </h1>
            <div className="relative -mt-16 md:-mt-20 lg:-mt-24">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Oops! Page Not Found
              </h2>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Looks like you've ventured into uncharted educational territory.
                The page you're looking for seems to have graduated and moved
                on!
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button
              onClick={handleGoBack}
              className="bg-transparent border-2 border-[#5D5CDE] text-[#5D5CDE] px-8 py-3 rounded-xl font-semibold text-base hover:bg-[#5D5CDE] hover:text-white transition-all duration-200 flex items-center space-x-2 min-w-[200px] justify-center"
            >
              <FiArrowLeft className="w-5 h-5" />
              <span>Go Back</span>
            </button>

            <Link
              to="/"
              className="bg-gradient-to-r from-[#5D5CDE] to-[#4A4BC9] text-white px-8 py-3 rounded-xl font-semibold text-base hover:from-[#4A4BC9] hover:to-[#3A3AB9] transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl min-w-[200px] justify-center group"
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
