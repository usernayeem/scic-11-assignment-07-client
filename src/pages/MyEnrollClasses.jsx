import React, { useState, useEffect, useContext } from "react";
import {
  FiBook,
  FiClock,
  FiPlay,
  FiAward,
  FiTrendingUp,
  FiSearch,
  FiFilter,
  FiAlertCircle,
  FiRefreshCw,
} from "react-icons/fi";
import { AuthContext } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import axios from "axios";

export const MyEnrollClasses = () => {
  const { user } = useContext(AuthContext);
  const toast = useToast();
  const [enrolledClasses, setEnrolledClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Function to fetch enrolled classes from server
  const fetchEnrolledClasses = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.get(
        `${import.meta.env.VITE_API}/enrolled-classes/${user.uid}`,
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );

      setEnrolledClasses(response.data.enrolledClasses || []);
    } catch (error) {
      console.error("Error fetching enrolled classes:", error);
      setError("Failed to load your enrolled classes. Please try again.");

      // Show specific error messages based on status code
      if (error.response?.status === 404) {
        setError("No enrolled classes found.");
      } else if (error.response?.status === 401) {
        setError("Please log in again to view your classes.");
      } else if (error.response?.status >= 500) {
        setError("Server error. Please try again later.");
      }

      toast.error("Failed to load enrolled classes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.uid) {
      fetchEnrolledClasses();
    }
  }, [user]);

  const filteredClasses = enrolledClasses.filter((cls) => {
    const matchesSearch =
      cls.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.instructor?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      cls.category?.toLowerCase().replace(/\s+/g, "-") === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const calculateOverallProgress = () => {
    if (enrolledClasses.length === 0) return 0;
    const totalProgress = enrolledClasses.reduce(
      (sum, cls) => sum + (cls.progress || 0),
      0
    );
    return Math.round(totalProgress / enrolledClasses.length);
  };

  const getTotalCompletedLessons = () => {
    return enrolledClasses.reduce(
      (sum, cls) => sum + (cls.completedLessons || 0),
      0
    );
  };

  // Retry function for error state
  const handleRetry = () => {
    fetchEnrolledClasses();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5D5CDE] mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">
            Loading your classes...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center max-w-md">
          <FiAlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Unable to Load Classes
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={handleRetry}
            className="bg-[#5D5CDE] hover:bg-[#4A4BC9] text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2 mx-auto"
          >
            <FiRefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Classes
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {enrolledClasses.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-[#5D5CDE]/10 rounded-lg flex items-center justify-center">
              <FiBook className="w-6 h-6 text-[#5D5CDE]" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Completed Lessons
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {getTotalCompletedLessons()}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <FiAward className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Average Progress
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {calculateOverallProgress()}%
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <FiTrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Classes Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-0">
              My Enrolled Classes ({filteredClasses.length})
            </h2>
            <button
              onClick={fetchEnrolledClasses}
              className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 flex items-center space-x-2"
            >
              <FiRefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 text-base border rounded-lg placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5D5CDE] focus:border-transparent border-gray-300 dark:border-gray-600"
                placeholder="Search classes or instructors..."
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-base text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5D5CDE] focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="web-development">Web Development</option>
              <option value="design">Design</option>
              <option value="marketing">Marketing</option>
              <option value="programming">Programming</option>
              <option value="data-science">Data Science</option>
              <option value="mobile-development">Mobile Development</option>
              <option value="ui-ux-design">UI/UX Design</option>
              <option value="artificial-intelligence">
                Artificial Intelligence
              </option>
            </select>
          </div>

          {/* Classes Grid */}
          {filteredClasses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredClasses.map((cls) => (
                <div
                  key={cls._id || cls.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="relative">
                    <img
                      src={
                        cls.thumbnail ||
                        `https://picsum.photos/400/250?random=${
                          cls._id || cls.id
                        }`
                      }
                      alt={cls.title}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.src = `https://picsum.photos/400/250?random=${
                          cls._id || cls.id
                        }`;
                      }}
                    />
                    <div className="absolute top-3 right-3">
                      <span className="bg-[#5D5CDE] text-white px-2 py-1 rounded-full text-xs font-medium">
                        {cls.category || "General"}
                      </span>
                    </div>
                    <button
                      className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-200"
                      onClick={() => {
                        // Handle continue learning - navigate to course or update progress
                        toast.info("Opening course...");
                      }}
                    >
                      <div className="bg-white rounded-full p-3">
                        <FiPlay className="w-6 h-6 text-[#5D5CDE]" />
                      </div>
                    </button>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {cls.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      by {cls.instructor || "Unknown Instructor"}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {cls.description || "No description available."}
                    </p>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <span>Progress</span>
                        <span>{cls.progress || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-[#5D5CDE] h-2 rounded-full transition-all duration-300"
                          style={{ width: `${cls.progress || 0}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Class Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                      <div className="flex items-center space-x-1">
                        <FiBook className="w-4 h-4" />
                        <span>
                          {cls.completedLessons || 0}/{cls.totalLessons || 0}{" "}
                          lessons
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FiClock className="w-4 h-4" />
                        <span>{cls.duration || "N/A"}</span>
                      </div>
                    </div>

                    <button
                      className="w-full bg-[#5D5CDE] hover:bg-[#4A4BC9] text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                      onClick={() => {
                        // Handle continue learning
                        toast.info("Continuing course...");
                      }}
                    >
                      <FiPlay className="w-4 h-4" />
                      <span>Continue Learning</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FiBook className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {searchTerm || selectedCategory !== "all"
                  ? "No classes found"
                  : "No enrolled classes"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm || selectedCategory !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "You haven't enrolled in any classes yet. Browse our courses to get started!"}
              </p>
              {!searchTerm && selectedCategory === "all" && (
                <button
                  onClick={() => window.open("/", "_blank")}
                  className="mt-4 bg-[#5D5CDE] hover:bg-[#4A4BC9] text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  Browse Courses
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
