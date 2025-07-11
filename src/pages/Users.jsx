import React, { useState, useEffect } from "react";
import {
  FiUsers,
  FiSearch,
  FiRefreshCw,
  FiUserCheck,
  FiMail,
  FiUser,
} from "react-icons/fi";
import { MdAdminPanelSettings } from "react-icons/md";
import axios from "axios";
import { useToast } from "../contexts/ToastContext";

export const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const toast = useToast();

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API}/users`);

      if (response.data.success) {
        setUsers(response.data.users);
        setFilteredUsers(response.data.users);
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

  // Handle search functionality
  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);

    if (!searchValue.trim()) {
      setFilteredUsers(users);
      return;
    }

    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        user.email.toLowerCase().includes(searchValue.toLowerCase())
    );

    setFilteredUsers(filtered);
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
        // Update local state
        const updatedUsers = users.map((user) =>
          user.uid === uid ? { ...user, role: "admin" } : user
        );

        setUsers(updatedUsers);
        setFilteredUsers(
          updatedUsers.filter(
            (user) =>
              user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              user.email.toLowerCase().includes(searchTerm.toLowerCase())
          )
        );

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
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
            <MdAdminPanelSettings className="w-3 h-3 mr-1" />
            Admin
          </span>
        );
      case "teacher":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            <FiUser className="w-3 h-3 mr-1" />
            Teacher
          </span>
        );
      case "student":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <FiUser className="w-3 h-3 mr-1" />
            Student
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
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
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Users Management
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Manage all registered users and their roles
            </p>
          </div>
          <button
            onClick={fetchUsers}
            className="mt-3 sm:mt-0 inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            <FiRefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-lg placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5D5CDE] focus:border-transparent transition-all duration-200"
            placeholder="Search by name or email..."
          />
        </div>
      </div>

      {/* Users Count */}
      <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700/50">
        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
          <span>Total Users: {users.length}</span>
          <span>Showing: {filteredUsers.length}</span>
          <span>
            Admins: {users.filter((user) => user.role === "admin").length}
          </span>
          <span>
            Teachers: {users.filter((user) => user.role === "teacher").length}
          </span>
          <span>
            Students: {users.filter((user) => user.role === "student").length}
          </span>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        {filteredUsers.length === 0 ? (
          <div className="px-6 py-12 text-center">
            {searchTerm ? (
              <>
                <FiSearch className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                  No users found
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Try adjusting your search criteria.
                </p>
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
              {filteredUsers.map((user) => (
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
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          ID: {user.uid.slice(0, 8)}...
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
        )}
      </div>
    </div>
  );
};
