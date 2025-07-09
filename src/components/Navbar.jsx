import React, { useState, useEffect, useRef, useContext } from "react";
import { CiMenuBurger } from "react-icons/ci";
import { FiUser, FiChevronDown, FiLogOut, FiGrid } from "react-icons/fi";
import { MdOutlineSchool } from "react-icons/md";
import { AuthContext } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { Link, useNavigate } from "react-router-dom";

export const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Auth context
  const { user, Logout, loading } = useContext(AuthContext);
  const toast = useToast();
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await Logout();
      toast.success("Logged out successfully!");
      setIsDropdownOpen(false);
      navigate("/");
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Navigation Links */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-[#5D5CDE] rounded-lg">
                <MdOutlineSchool className="text-white text-xl" />
              </div>
              <span className="md:text-xl font-bold text-gray-900 dark:text-white">
                EduManage
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-6">
              <a
                href="/"
                className="text-gray-700 dark:text-gray-300 hover:text-[#5D5CDE] dark:hover:text-[#5D5CDE] transition-colors duration-200 font-medium"
              >
                Home
              </a>
              <a
                href="#"
                className="text-gray-700 dark:text-gray-300 hover:text-[#5D5CDE] dark:hover:text-[#5D5CDE] transition-colors duration-200 font-medium"
              >
                All Classes
              </a>
              <Link
                to="/teach"
                className="text-gray-700 dark:text-gray-300 hover:text-[#5D5CDE] dark:hover:text-[#5D5CDE] transition-colors duration-200 font-medium"
              >
                Teach on EduManage
              </Link>
            </div>
          </div>

          {/* Authentication and User Profile */}
          <div className="flex items-center space-x-4">
            {/* Show Sign In button only when user is not authenticated */}
            {!user && !loading && (
              <Link
                to="/login"
                className="bg-[#5D5CDE] hover:bg-[#4A4BC9] text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 text-base hidden md:flex"
              >
                Log In
              </Link>
            )}

            {/* Show user profile dropdown when authenticated */}
            {user && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                >
                  <img
                    src={
                      user?.photoURL ||
                      "https://i.ibb.co/4wsPz9SL/profile-removebg-preview.webp"
                    }
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                    onError={(e) => {
                      e.target.src =
                        "https://i.ibb.co/4wsPz9SL/profile-removebg-preview.webp";
                    }}
                  />
                  <FiChevronDown
                    className={`text-gray-600 dark:text-gray-400 transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* User Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                    <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                      <p className="font-medium truncate">{user.displayName}</p>
                      {user.email && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {user.email}
                        </p>
                      )}
                    </div>
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-2">
                      <FiGrid className="text-gray-500 dark:text-gray-400" />
                      <span>Dashboard</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-2"
                    >
                      <FiLogOut className="text-red-500 dark:text-red-400" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              <CiMenuBurger className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a
                href="/"
                className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-[#5D5CDE] dark:hover:text-[#5D5CDE] hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </a>
              <a
                href="#"
                className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-[#5D5CDE] dark:hover:text-[#5D5CDE] hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                All Classes
              </a>
              <Link
                to="/teach"
                className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-[#5D5CDE] dark:hover:text-[#5D5CDE] hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Teach on EduManage
              </Link>

              {/* Mobile Auth Section */}
              {!user && !loading && (
                <Link
                  to="/login"
                  className="bg-[#5D5CDE] hover:bg-[#4A4BC9] text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 text-base w-full"
                >
                  Login In
                </Link>
              )}

              {user && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                  <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                    Signed in as: {user.displayName}
                  </div>
                  <button className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-[#5D5CDE] dark:hover:text-[#5D5CDE] hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors duration-200">
                    Dashboard
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
