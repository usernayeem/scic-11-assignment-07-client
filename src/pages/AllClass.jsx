import React, { useState, useEffect, useContext } from "react";
import {
  FiBook,
  FiUser,
  FiDollarSign,
  FiUsers,
  FiArrowRight,
  FiRefreshCw,
  FiSearch,
} from "react-icons/fi";
import { MdOutlineSchool } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import axios from "axios";

export const AllClass = () => {
  const { user } = useContext(AuthContext);
  const toast = useToast();
  const navigate = useNavigate();

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredClasses, setFilteredClasses] = useState([]);

  // Fetch approved classes
  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API}/classes`);

      if (response.data.success) {
        // Filter only approved classes
        const approvedClasses = response.data.classes.filter(
          (cls) => cls.status === "approved"
        );
        setClasses(approvedClasses);
        setFilteredClasses(approvedClasses);
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

  // Handle search functionality
  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);

    if (!searchValue.trim()) {
      setFilteredClasses(classes);
      return;
    }

    const filtered = classes.filter(
      (cls) =>
        cls.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        cls.teacherName.toLowerCase().includes(searchValue.toLowerCase()) ||
        cls.description.toLowerCase().includes(searchValue.toLowerCase())
    );

    setFilteredClasses(filtered);
  };

  // Truncate text helper
  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
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
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-xl placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5D5CDE] focus:border-transparent transition-all duration-200"
                placeholder="Search classes, instructors, or topics..."
              />
            </div>

            {/* Stats and Refresh */}
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium">{filteredClasses.length}</span>{" "}
                {filteredClasses.length === 1 ? "class" : "classes"} available
              </div>
              <button
                onClick={fetchClasses}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                <FiRefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Classes Grid */}
        {filteredClasses.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-12 text-center">
            {searchTerm ? (
              <>
                <FiSearch className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No classes found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Try adjusting your search criteria or browse all available
                  classes.
                </p>
                <button
                  onClick={() => handleSearch("")}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredClasses.map((classItem) => (
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
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-[#5D5CDE] transition-colors duration-200">
                    {truncateText(classItem.title, 60)}
                  </h3>

                  {/* Instructor */}
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <FiUser className="w-4 h-4 mr-2" />
                    <span>By {classItem.teacherName}</span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                    {truncateText(classItem.description, 120)}
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

                  {/* Enroll Button - FIXED: Changed classId to classItem._id */}
                  <Link
                    to={`/all-class/${classItem._id}`}
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
      </div>
    </div>
  );
};
