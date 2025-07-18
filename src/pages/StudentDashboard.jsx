import React, { useContext } from "react";
import { FiBook, FiUser, FiLogOut, FiHome } from "react-icons/fi";
import { MdOutlineSchool } from "react-icons/md";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";

export const StudentDashboard = () => {
  const { user, Logout } = useContext(AuthContext);
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await Logout();
      toast.success("Logged out successfully!");
      navigate("/");
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  };

  const navigationItems = [
    {
      name: "My Enrolled Classes",
      path: "/student-dashboard/my-enroll-classes",
      icon: FiBook,
    },
    {
      name: "Profile",
      path: "/student-dashboard/profile",
      icon: FiUser,
    },
  ];

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center space-x-4 mb-6 lg:mb-0">
              <div className="flex items-center justify-center w-12 h-12 bg-[#5D5CDE] rounded-xl">
                <MdOutlineSchool className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  Student Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Welcome back, {user?.displayName || "Student"}!
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-2"
              >
                <FiHome className="w-4 h-4" />
                <span>Back to Home</span>
              </Link>

              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
              >
                <FiLogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActivePath(item.path);

                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`py-4 px-1 border-b-2 font-medium text-base transition-colors duration-200 flex items-center space-x-2 ${
                      isActive
                        ? "border-[#5D5CDE] text-[#5D5CDE]"
                        : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};
