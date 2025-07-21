import React, { useState, useEffect } from "react";
import {
  FiUsers,
  FiBook,
  FiUserCheck,
  FiTrendingUp,
  FiRefreshCw,
} from "react-icons/fi";
import { MdOutlineSchool } from "react-icons/md";
import { useToast } from "../contexts/ToastContext";
import axios from "axios";

export const Statistics = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalClasses: 0,
    totalEnrollments: 0,
  });
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  // Fetch statistics data
  const fetchStatistics = async () => {
    try {
      setLoading(true);

      // Fetch all required data in parallel
      const [usersResponse, classesResponse] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API}/users`),
        axios.get(`${import.meta.env.VITE_API}/classes`),
      ]);

      let totalUsers = 0;
      let totalClasses = 0;
      let totalEnrollments = 0;

      // Calculate total users
      if (usersResponse.data.success) {
        totalUsers = usersResponse.data.users.length;
      }

      // Calculate total classes and enrollments
      if (classesResponse.data.success) {
        const approvedClasses = classesResponse.data.classes.filter(
          (cls) => cls.status === "approved"
        );
        totalClasses = approvedClasses.length;

        // Calculate total enrollments across all approved classes
        totalEnrollments = approvedClasses.reduce((sum, cls) => {
          return sum + (cls.enrolledStudents?.length || 0);
        }, 0);
      }

      setStats({
        totalUsers,
        totalClasses,
        totalEnrollments,
      });
    } catch (error) {
      console.error("Error fetching statistics:", error);
      toast.error("Failed to load statistics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  const statisticsData = [
    {
      icon: FiUsers,
      title: "Total Users",
      value: stats.totalUsers,
      description: "Registered users on our platform",
      color: "bg-blue-500",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      textColor: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: FiBook,
      title: "Total Classes",
      value: stats.totalClasses,
      description: "Approved courses available for learning",
      color: "bg-green-500",
      bgColor: "bg-green-100 dark:bg-green-900/30",
      textColor: "text-green-600 dark:text-green-400",
    },
    {
      icon: FiUserCheck,
      title: "Total Enrollments",
      value: stats.totalEnrollments,
      description: "Students enrolled across all courses",
      color: "bg-purple-500",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
      textColor: "text-purple-600 dark:text-purple-400",
    },
  ];

  if (loading) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-8">
            <div className="flex items-center justify-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5D5CDE]"></div>
              <span className="text-gray-600 dark:text-gray-300">
                Loading statistics...
              </span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center w-16 h-16 bg-[#5D5CDE] rounded-2xl mx-auto mb-6">
            <FiTrendingUp className="text-white text-2xl" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Platform Statistics
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover the growing impact of our educational platform and join our
            thriving community of learners and educators
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Statistics Cards */}
          <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="space-y-6">
              {statisticsData.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div
                    key={index}
                    className="bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 p-6 group hover:-translate-y-1"
                  >
                    <div className="flex items-center space-x-6">
                      {/* Icon */}
                      <div
                        className={`flex items-center justify-center w-16 h-16 ${stat.bgColor} rounded-xl group-hover:scale-110 transition-transform duration-300`}
                      >
                        <IconComponent
                          className={`w-8 h-8 ${stat.textColor}`}
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-baseline space-x-2 mb-2">
                          <h4 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white group-hover:text-[#5D5CDE] transition-colors duration-200">
                            {stat.value.toLocaleString()}
                          </h4>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stat.bgColor} ${stat.textColor}`}
                          >
                            {stat.title}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300">
                          {stat.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Side - Illustration */}
          <div className="flex items-center justify-center">
            <div className="relative">
              {/* Background Circle */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#5D5CDE] to-[#4A4BC9] rounded-full opacity-10 scale-110"></div>

              {/* Main Image Container */}
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
                <div className="text-center space-y-6">
                  {/* Illustration Icons */}
                  <div className="flex items-center justify-center space-x-4 mb-8">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                      <FiUsers className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                      <FiBook className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                      <FiUserCheck className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>

                  {/* Central EduManage Logo */}
                  <div className="w-24 h-24 bg-gradient-to-r from-[#5D5CDE] to-[#4A4BC9] rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <MdOutlineSchool className="w-12 h-12 text-white" />
                  </div>

                  {/* Decorative Elements */}
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      EduManage Platform
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 max-w-xs mx-auto">
                      Empowering education through innovative technology and
                      community-driven learning
                    </p>

                    {/* Achievement Badges */}
                    <div className="flex items-center justify-center space-x-3 mt-6">
                      <div className="flex items-center space-x-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 px-3 py-1 rounded-full text-xs font-medium">
                        <span>🏆</span>
                        <span>Top Rated</span>
                      </div>
                      <div className="flex items-center space-x-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-3 py-1 rounded-full text-xs font-medium">
                        <span>✨</span>
                        <span>Trusted</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full animate-bounce opacity-80"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-pink-400 rounded-full animate-pulse opacity-80"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
