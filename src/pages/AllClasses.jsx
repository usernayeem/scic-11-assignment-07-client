import React, { useState, useEffect, useContext } from "react";
import {
  FiBook,
  FiUser,
  FiDollarSign,
  FiUsers,
  FiArrowRight,
  FiRefreshCw,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiX,
} from "react-icons/fi";
import { MdOutlineSchool } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import axios from "axios";

export const AllClasses = () => {
  const { user } = useContext(AuthContext);
  const toast = useToast();
  const navigate = useNavigate();

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalClasses, setTotalClasses] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Fetch classes with pagination
  const fetchClasses = async (
    page = currentPage,
    limit = pageSize,
    search = searchTerm
  ) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        status: "approved",
      });

      if (search.trim()) {
        params.append("search", search.trim());
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API}/classes?${params}`
      );

      if (response.data.success) {
        setClasses(response.data.classes);
        setTotalClasses(response.data.totalClasses || 0);
        setTotalPages(response.data.totalPages || 0);
      } else {
        toast.error("Failed to fetch classes");
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
      toast.error("Failed to load classes");
    } finally {
      setLoading(false);
    }
  };

  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmedSearch = searchInput.trim();
    setSearchTerm(trimmedSearch);
    setCurrentPage(1); // Reset to first page when searching
    fetchClasses(1, pageSize, trimmedSearch);
  };

  // Handle search clear
  const handleSearchClear = () => {
    setSearchInput("");
    setSearchTerm("");
    setCurrentPage(1);
    fetchClasses(1, pageSize, "");
  };

  // Handle Enter key press in search input
  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearchSubmit(e);
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      fetchClasses(newPage, pageSize, searchTerm);
    }
  };

  // Handle page size change
  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
    fetchClasses(1, newPageSize, searchTerm);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust start page if we're near the end
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-8">
            <div className="flex items-center justify-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5D5CDE]"></div>
              <span className="text-gray-600 dark:text-gray-300">
                Loading classes...
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center w-16 h-16 bg-[#5D5CDE] rounded-2xl mx-auto mb-6">
            <MdOutlineSchool className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Explore All Classes
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover amazing courses from expert instructors and start your
            learning journey today.
          </p>
        </div>

        {/* Search and Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Search Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="relative flex-1 max-w-md"
            >
              <div className="flex">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyPress={handleSearchKeyPress}
                    className="block w-full pl-10 pr-10 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-l-xl placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5D5CDE] focus:border-transparent transition-all duration-200"
                    placeholder="Search classes, instructors, or topics..."
                  />
                  {searchInput && (
                    <button
                      type="button"
                      onClick={handleSearchClear}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <FiX className="h-5 w-5" />
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  className="px-4 py-3 bg-[#5D5CDE] text-white rounded-r-xl hover:bg-[#4A4BC9] focus:outline-none focus:ring-2 focus:ring-[#5D5CDE] focus:ring-offset-2 transition-colors duration-200 flex items-center"
                >
                  <FiSearch className="h-5 w-5" />
                </button>
              </div>
            </form>

            {/* Stats and Controls */}
            <div className="flex items-center space-x-4">
              {/* Active Search Indicator */}
              {searchTerm && (
                <div className="flex items-center space-x-2 px-3 py-1 bg-[#5D5CDE]/10 dark:bg-[#5D5CDE]/20 rounded-lg">
                  <span className="text-sm text-[#5D5CDE] dark:text-[#5D5CDE]">
                    Searching: "{searchTerm}"
                  </span>
                  <button
                    onClick={handleSearchClear}
                    className="text-[#5D5CDE] hover:text-[#4A4BC9] transition-colors duration-200"
                  >
                    <FiX className="h-4 w-4" />
                  </button>
                </div>
              )}

              <button
                onClick={() => fetchClasses(currentPage, pageSize, searchTerm)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                <FiRefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Classes Grid */}
        {classes.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-12 text-center mb-8">
            {searchTerm ? (
              <>
                <FiSearch className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No classes found for "{searchTerm}"
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Try adjusting your search criteria or browse all available
                  classes.
                </p>
                <button
                  onClick={handleSearchClear}
                  className="bg-[#5D5CDE] hover:bg-[#4A4BC9] text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  Clear Search
                </button>
              </>
            ) : (
              <>
                <FiBook className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No classes available
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Classes will appear here once instructors create and admins
                  approve them.
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {classes.map((classItem) => (
              <div
                key={classItem._id}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden group"
              >
                {/* Class Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={classItem.image}
                    alt={classItem.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src =
                        "https://i.ibb.co/GQzR5BLS/image-not-found.webp";
                    }}
                  />
                  <div className="absolute top-4 right-4 bg-[#5D5CDE] text-white px-3 py-1 rounded-full text-sm font-medium">
                    ${classItem.price}
                  </div>
                </div>

                {/* Class Content */}
                <div className="p-6">
                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-[#5D5CDE] transition-colors duration-200 truncate">
                    {classItem.title}
                  </h3>

                  {/* Instructor */}
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <FiUser className="w-4 h-4 mr-2" />
                    <span>By {classItem.teacherName}</span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-5">
                    {classItem.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-6">
                    <div className="flex items-center">
                      <FiUsers className="w-4 h-4 mr-1" />
                      <span>
                        {classItem.enrolledStudents?.length || 0} enrolled
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium text-[#5D5CDE]">
                        ${classItem.price}
                      </span>
                    </div>
                  </div>

                  {/* Enroll Button */}
                  <Link
                    to={`/all-classes/${classItem._id}`}
                    className="w-full bg-gradient-to-r from-[#5D5CDE] to-[#4A4BC9] text-white py-3 px-4 rounded-xl font-semibold text-base hover:from-[#4A4BC9] hover:to-[#3A3AB9] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5D5CDE] transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl group"
                  >
                    <span>Enroll Now</span>
                    <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination - Always Visible */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Left Side: Pagination Info and Page Size Selector */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Pagination Info */}
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Showing{" "}
                {totalClasses > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{" "}
                {Math.min(currentPage * pageSize, totalClasses)} of{" "}
                {totalClasses} classes
              </div>

              {/* Page Size Selector */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Show:
                </span>
                <select
                  value={pageSize}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                  className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5D5CDE] focus:border-transparent transition-all duration-200"
                >
                  <option value={5}>5 per page</option>
                  <option value={10}>10 per page</option>
                  <option value={15}>15 per page</option>
                  <option value={20}>20 per page</option>
                </select>
              </div>
            </div>

            {/* Right Side: Pagination Controls */}
            {totalPages > 1 ? (
              <div className="flex items-center space-x-2">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <FiChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </button>

                {/* Page Numbers */}
                <div className="flex items-center space-x-1">
                  {getPageNumbers().map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        currentPage === pageNum
                          ? "bg-[#5D5CDE] text-white"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Next
                  <FiChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            ) : (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {totalClasses <= pageSize
                  ? "All classes displayed"
                  : "Page 1 of 1"}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
