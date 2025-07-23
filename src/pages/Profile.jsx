import React, { useContext, useState, useEffect } from "react";
import { FiUser, FiMail, FiCalendar, FiSettings } from "react-icons/fi";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";

export const Profile = () => {
  const { user } = useContext(AuthContext);
  const [userRole, setUserRole] = useState("");
  const [roleLoading, setRoleLoading] = useState(true);
  const [userFromDB, setUserFromDB] = useState(null);

  // Fetch user data from backend including photo URL
  const fetchUserData = async () => {
    if (!user?.uid) return;

    try {
      setRoleLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API}/users/${user.uid}`
      );

      if (response.data.success) {
        setUserRole(response.data.user.role);
        setUserFromDB(response.data.user);
      }
    } catch (error) {
      setUserRole("student"); // Default fallback
      setUserFromDB(null);
    } finally {
      setRoleLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [user]);

  // Get the correct photo URL (backend first, then Firebase)
  const getPhotoURL = () => {
    return (
      userFromDB?.photoURL ||
      user?.photoURL ||
      "https://i.ibb.co/4wsPz9SL/profile-removebg-preview.webp"
    );
  };

  // Get the correct display name
  const getDisplayName = () => {
    return userFromDB?.name || user?.displayName || "Student";
  };

  // Get role badge with proper styling
  const getRoleBadge = (role) => {
    switch (role) {
      case "admin":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400">
            Admin
          </span>
        );
      case "teacher":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400">
            Teacher
          </span>
        );
      case "student":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
            Student
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-400">
            User
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 lg:space-x-6">
              <img
                src={getPhotoURL()}
                alt="Profile"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-gray-200 dark:border-gray-600 mx-auto sm:mx-0 flex-shrink-0"
                onError={(e) => {
                  e.target.src =
                    "https://i.ibb.co/4wsPz9SL/profile-removebg-preview.webp";
                }}
              />
              <div className="text-center sm:text-left min-w-0 flex-1 md:ml-4">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white truncate">
                  {getDisplayName()}
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg truncate">
                  {userFromDB?.email || user?.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Information */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
            Profile Information
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Your personal information and account details
          </p>
        </div>

        <div className="p-4 sm:p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <FiUser className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <p className="text-base text-gray-900 dark:text-white truncate">
                    {getDisplayName()}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <FiMail className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <p className="text-base text-gray-900 dark:text-white truncate">
                    {userFromDB?.email || user?.email}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Member Since
                </label>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <FiCalendar className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <p className="text-base text-gray-900 dark:text-white">
                    {userFromDB?.createdAt
                      ? new Date(userFromDB.createdAt).toLocaleDateString()
                      : user?.metadata?.creationTime
                      ? new Date(
                          user.metadata.creationTime
                        ).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Role
                </label>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <FiSettings className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  {roleLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Loading...
                      </span>
                    </div>
                  ) : (
                    getRoleBadge(userRole)
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
