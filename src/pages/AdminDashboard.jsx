import React, { useContext, useState } from "react";
import {
  FiUsers,
  FiUser,
  FiLogOut,
  FiHome,
  FiBookOpen,
  FiUserCheck,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { MdOutlineSchool } from "react-icons/md";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";

export const AdminDashboard = () => {
  const { user, Logout } = useContext(AuthContext);
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

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
      name: "Teacher Request",
      path: "/admin-dashboard/teacher-request",
      icon: FiUserCheck,
    },
    {
      name: "Users",
      path: "/admin-dashboard/users",
      icon: FiUsers,
    },
    {
      name: "All Classes",
      path: "/admin-dashboard/admin-all-classes",
      icon: FiBookOpen,
    },
    {
      name: "Profile",
      path: "/admin-dashboard/profile",
      icon: FiUser,
    },
  ];

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const handleNavItemClick = () => {
    setIsMobileNavOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-3 md:space-x-4">
              <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-[#5D5CDE] rounded-xl flex-shrink-0">
                <MdOutlineSchool className="text-white text-lg md:text-xl" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white truncate">
                  Admin Dashboard
                </h1>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 truncate">
                  Welcome back, {user?.displayName || "Admin"}!
                </p>
              </div>
            </div>

            {/* Home and Logout buttons - Hidden on mobile, visible on tablet and up */}
            <div className="hidden sm:flex items-center space-x-3">
              <Link
                to="/"
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-3 md:px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center space-x-2 text-sm md:text-base"
              >
                <FiHome className="w-4 h-4" />
                <span>Back to Home</span>
              </Link>

              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-3 md:px-4 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 text-sm md:text-base"
              >
                <FiLogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mb-6 md:mb-8">
          {/* Mobile Navigation Toggle */}
          <div className="md:hidden mb-4">
            <button
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="flex items-center justify-between w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <span className="text-base font-medium">Navigation Menu</span>
              {isMobileNavOpen ? (
                <FiX className="w-5 h-5" />
              ) : (
                <FiMenu className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Desktop Navigation Tabs */}
          <div className="hidden md:block">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="-mb-px flex space-x-6 lg:space-x-8 overflow-x-auto">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = isActivePath(item.path);

                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`py-4 px-1 border-b-2 font-medium text-sm lg:text-base transition-colors duration-200 flex items-center space-x-2 whitespace-nowrap ${
                        isActive
                          ? "border-[#5D5CDE] text-[#5D5CDE]"
                          : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                    >
                      <Icon className="w-4 h-4 lg:w-5 lg:h-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileNavOpen && (
            <div className="md:hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
              <nav className="py-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = isActivePath(item.path);

                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={handleNavItemClick}
                      className={`flex items-center space-x-3 px-4 py-3 text-base font-medium transition-colors duration-200 ${
                        isActive
                          ? "bg-[#5D5CDE] text-white border-r-4 border-[#5D5CDE]"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 min-h-[60vh]">
          <div className="p-4 md:p-6 lg:p-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};