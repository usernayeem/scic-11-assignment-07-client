import React, { useState, useEffect } from "react";
import {
  FiUsers,
  FiSearch,
  FiRefreshCw,
  FiUserCheck,
  FiMail,
  FiUser,
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiCalendar,
} from "react-icons/fi";
import { MdAdminPanelSettings } from "react-icons/md";
import axios from "axios";
import { useToast } from "../contexts/ToastContext";

export const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const toast = useToast();

  // Fetch users with pagination
  const fetchUsers = async (
    page = currentPage,
    limit = pageSize,
    search = searchTerm
  ) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (search.trim()) {
        params.append("search", search.trim());
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API}/users?${params}`
      );

      if (response.data.success) {
        setUsers(response.data.users);
        setTotalUsers(response.data.totalUsers || 0);
        setTotalPages(response.data.totalPages || 0);
      } else {
        toast.error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
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
    fetchUsers(1, pageSize, trimmedSearch);
  };

  // Handle search clear
  const handleSearchClear = () => {
    setSearchInput("");
    setSearchTerm("");
    setCurrentPage(1);
    fetchUsers(1, pageSize, "");
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
      fetchUsers(newPage, pageSize, searchTerm);
    }
  };

  // Handle page size change
  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
    fetchUsers(1, newPageSize, searchTerm);
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

  // Handle make admin
  const handleMakeAdmin = async (uid, userName) => {
    setActionLoading((prev) => ({ ...prev, [uid]: true }));

    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API}/users/${uid}`,
        {
          role: "admin",
        }
      );

      if (response.data.success) {
        // Refresh the current page to show updated data
        await fetchUsers(currentPage, pageSize, searchTerm);
        toast.success(`${userName} has been made an admin successfully!`);
      }
    } catch (error) {
      console.error("Error making user admin:", error);
      toast.error("Failed to make user admin. Please try again.");
    } finally {
      setActionLoading((prev) => ({ ...prev, [uid]: false }));
    }
  };

  // Get role badge
  const getRoleBadge = (role) => {
    switch (role) {
      case "admin":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
            <MdAdminPanelSettings className="w-3 h-3 mr-1" />
            Admin
          </span>
        );
      case "teacher":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            <FiUser className="w-3 h-3 mr-1" />
            Teacher
          </span>
        );
      case "student":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <FiUser className="w-3 h-3 mr-1" />
            Student
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
            User
          </span>
        );
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-8">
        <div className="flex items-center justify-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5D5CDE]"></div>
          <span className="text-gray-600 dark:text-gray-300">
            Loading users...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
      {/* Header */}
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Users Management
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Manage all registered users and their roles
            </p>
          </div>
          <button
            onClick={() => fetchUsers(currentPage, pageSize, searchTerm)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            <FiRefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Search Form */}
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
                  className="block w-full pl-10 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-l-lg placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5D5CDE] focus:border-transparent transition-all duration-200"
                  placeholder="Search by name or email..."
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
                className="px-4 py-2 bg-[#5D5CDE] text-white rounded-r-lg hover:bg-[#4A4BC9] focus:outline-none focus:ring-2 focus:ring-[#5D5CDE] focus:ring-offset-2 transition-colors duration-200 flex items-center"
              >
                <FiSearch className="h-5 w-5" />
              </button>
            </div>
          </form>

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
        </div>
      </div>

      {/* Users Content */}
      <div>
        {users.length === 0 ? (
          <div className="px-4 sm:px-6 py-12 text-center">
            {searchTerm ? (
              <>
                <FiSearch className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                  No users found for "{searchTerm}"
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Try adjusting your search criteria.
                </p>
                <button
                  onClick={handleSearchClear}
                  className="mt-4 bg-[#5D5CDE] hover:bg-[#4A4BC9] text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  Clear Search
                </button>
              </>
            ) : (
              <>
                <FiUsers className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                  No users registered
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Users will appear here when they register.
                </p>
              </>
            )}
          </div>
        ) : (
          <>
            {/* Mobile Card Layout (visible on small screens) */}
            <div className="block lg:hidden">
              <div className="space-y-4 p-4">
                {users.map((user) => (
                  <div
                    key={user._id}
                    className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
                  >
                    {/* User Header */}
                    <div className="flex items-center space-x-3 mb-4">
                      <img
                        src={
                          user.photoURL ||
                          "https://i.ibb.co/4wsPz9SL/profile-removebg-preview.webp"
                        }
                        alt={user.name}
                        className="h-10 w-10 rounded-full object-cover flex-shrink-0"
                        onError={(e) => {
                          e.target.src =
                            "https://i.ibb.co/4wsPz9SL/profile-removebg-preview.webp";
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {user.name || "No Name"}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate flex items-center">
                          <FiMail className="w-3 h-3 mr-1" />
                          {user.email}
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        {getRoleBadge(user.role)}
                      </div>
                    </div>

                    {/* User Details */}
                    <div className="mb-3">
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <FiCalendar className="w-3 h-3 mr-1" />
                        Joined:{" "}
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "N/A"}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end">
                      {user.role === "admin" ? (
                        <span className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
                          <MdAdminPanelSettings className="w-3 h-3 mr-1" />
                          Already Admin
                        </span>
                      ) : (
                        <button
                          onClick={() => handleMakeAdmin(user.uid, user.name)}
                          disabled={actionLoading[user.uid]}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-[#5D5CDE] hover:bg-[#4A4BC9] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5D5CDE] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                          {actionLoading[user.uid] ? (
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                          ) : (
                            <FiUserCheck className="w-3 h-3 mr-1" />
                          )}
                          Make Admin
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop Table Layout (hidden on small screens) */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Joined Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {users.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      {/* User Info */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={
                              user.photoURL ||
                              "https://i.ibb.co/4wsPz9SL/profile-removebg-preview.webp"
                            }
                            alt={user.name}
                            className="h-12 w-12 rounded-full object-cover"
                            onError={(e) => {
                              e.target.src =
                                "https://i.ibb.co/4wsPz9SL/profile-removebg-preview.webp";
                            }}
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {user.name || "No Name"}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900 dark:text-white">
                          <FiMail className="w-4 h-4 mr-2 text-gray-400" />
                          {user.email}
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getRoleBadge(user.role)}
                      </td>

                      {/* Joined Date */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "N/A"}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {user.role === "admin" ? (
                          <span className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
                            <MdAdminPanelSettings className="w-3 h-3 mr-1" />
                            Already Admin
                          </span>
                        ) : (
                          <button
                            onClick={() => handleMakeAdmin(user.uid, user.name)}
                            disabled={actionLoading[user.uid]}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-[#5D5CDE] hover:bg-[#4A4BC9] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5D5CDE] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                          >
                            {actionLoading[user.uid] ? (
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                            ) : (
                              <FiUserCheck className="w-3 h-3 mr-1" />
                            )}
                            Make Admin
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Responsive Pagination */}
      <div className="bg-gray-50 dark:bg-gray-700/50 px-4 sm:px-6 py-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          {/* Left Side: Pagination Info and Page Size Selector */}
          <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
            {/* Pagination Info */}
            <div className="text-sm text-gray-600 dark:text-gray-300 text-center sm:text-left">
              Showing {totalUsers > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{" "}
              {Math.min(currentPage * pageSize, totalUsers)} of {totalUsers}{" "}
              users
            </div>

            {/* Page Size Selector */}
            <div className="flex items-center justify-center sm:justify-start space-x-2">
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
            <div className="flex items-center justify-center space-x-2">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <FiChevronLeft className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Previous</span>
              </button>

              {/* Page Numbers - Hide on very small screens */}
              <div className="hidden sm:flex items-center space-x-1">
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

              {/* Current page indicator for small screens */}
              <div className="sm:hidden px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                {currentPage} / {totalPages}
              </div>

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <span className="hidden sm:inline">Next</span>
                <FiChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          ) : (
            <div className="text-sm text-gray-500 dark:text-gray-400 text-center lg:text-right">
              {totalUsers <= pageSize ? "All users displayed" : "Page 1 of 1"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
