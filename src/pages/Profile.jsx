import React, { useContext, useState, useEffect } from "react";
import {
  FiUser,
  FiMail,
  FiCalendar,
  FiSettings,
  FiStar,
  FiAward,
} from "react-icons/fi";
import { MdVerified, MdOutlineSchool } from "react-icons/md";
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
      setUserRole("student");
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

  // Get role badge with consistent styling
  const getRoleBadge = (role) => {
    switch (role) {
      case "admin":
        return (
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-[#5D5CDE] to-[#4A4BC9] text-white shadow-lg">
            <FiAward className="w-4 h-4 mr-2" />
            Admin
          </div>
        );
      case "teacher":
        return (
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-[#5D5CDE] to-[#4A4BC9] text-white shadow-lg">
            <MdOutlineSchool className="w-4 h-4 mr-2" />
            Teacher
          </div>
        );
      case "student":
        return (
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-[#5D5CDE] to-[#4A4BC9] text-white shadow-lg">
            <FiStar className="w-4 h-4 mr-2" />
            Student
          </div>
        );
      default:
        return (
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-[#5D5CDE] to-[#4A4BC9] text-white shadow-lg">
            <FiUser className="w-4 h-4 mr-2" />
            User
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 -m-8 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Main Profile Card */}
        <div className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700">
          {/* Header with Gradient Background */}
          <div className="relative bg-gradient-to-br from-[#5D5CDE] via-[#4A4BC9] to-[#3A3AB9] px-8 py-12 sm:px-12 sm:py-16">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>

            <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              {/* Profile Picture and Basic Info */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="relative mx-auto sm:mx-0">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-white/20 backdrop-blur-sm p-2">
                    <img
                      src={getPhotoURL()}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover shadow-2xl"
                      onError={(e) => {
                        e.target.src =
                          "https://i.ibb.co/4wsPz9SL/profile-removebg-preview.webp";
                      }}
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg">
                    <MdVerified className="w-6 h-6 text-[#5D5CDE]" />
                  </div>
                </div>

                <div className="text-center sm:text-left">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 drop-shadow-lg">
                    {getDisplayName()}
                  </h1>
                  <p className="text-xl sm:text-2xl text-white/90 mb-4 drop-shadow">
                    {userFromDB?.email || user?.email}
                  </p>
                  <div className="flex justify-center sm:justify-start">
                    {roleLoading ? (
                      <div className="flex items-center space-x-3 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span className="text-white font-medium">
                          Loading role...
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

          {/* Profile Information Grid */}
          <div className="p-8 sm:p-12">
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Profile Information
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Your personal information and account details
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {/* Full Name */}
              <div className="group">
                <div className="bg-gradient-to-br from-[#5D5CDE]/5 to-[#4A4BC9]/10 dark:from-[#5D5CDE]/10 dark:to-[#4A4BC9]/20 rounded-2xl p-6 h-full border border-[#5D5CDE]/20 dark:border-[#5D5CDE]/30 hover:shadow-xl hover:shadow-[#5D5CDE]/10 transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#5D5CDE] to-[#4A4BC9] rounded-xl flex items-center justify-center shadow-lg">
                      <FiUser className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[#5D5CDE] dark:text-[#5D5CDE] uppercase tracking-wide">
                        Full Name
                      </h3>
                    </div>
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    {getDisplayName()}
                  </p>
                </div>
              </div>

              {/* Email Address */}
              <div className="group">
                <div className="bg-gradient-to-br from-[#5D5CDE]/5 to-[#4A4BC9]/10 dark:from-[#5D5CDE]/10 dark:to-[#4A4BC9]/20 rounded-2xl p-6 h-full border border-[#5D5CDE]/20 dark:border-[#5D5CDE]/30 hover:shadow-xl hover:shadow-[#5D5CDE]/10 transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#5D5CDE] to-[#4A4BC9] rounded-xl flex items-center justify-center shadow-lg">
                      <FiMail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[#5D5CDE] dark:text-[#5D5CDE] uppercase tracking-wide">
                        Email Address
                      </h3>
                    </div>
                  </div>
                  <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white break-all">
                    {userFromDB?.email || user?.email}
                  </p>
                </div>
              </div>

              {/* Member Since */}
              <div className="group">
                <div className="bg-gradient-to-br from-[#5D5CDE]/5 to-[#4A4BC9]/10 dark:from-[#5D5CDE]/10 dark:to-[#4A4BC9]/20 rounded-2xl p-6 h-full border border-[#5D5CDE]/20 dark:border-[#5D5CDE]/30 hover:shadow-xl hover:shadow-[#5D5CDE]/10 transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#5D5CDE] to-[#4A4BC9] rounded-xl flex items-center justify-center shadow-lg">
                      <FiCalendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[#5D5CDE] dark:text-[#5D5CDE] uppercase tracking-wide">
                        Member Since
                      </h3>
                    </div>
                  </div>
                  <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                    {userFromDB?.createdAt
                      ? new Date(userFromDB.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )
                      : user?.metadata?.creationTime
                      ? new Date(user.metadata.creationTime).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )
                      : "N/A"}
                  </p>
                </div>
              </div>

              {/* Role */}
              <div className="group">
                <div className="bg-gradient-to-br from-[#5D5CDE]/5 to-[#4A4BC9]/10 dark:from-[#5D5CDE]/10 dark:to-[#4A4BC9]/20 rounded-2xl p-6 h-full border border-[#5D5CDE]/20 dark:border-[#5D5CDE]/30 hover:shadow-xl hover:shadow-[#5D5CDE]/10 transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#5D5CDE] to-[#4A4BC9] rounded-xl flex items-center justify-center shadow-lg">
                      <FiSettings className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[#5D5CDE] dark:text-[#5D5CDE] uppercase tracking-wide">
                        Account Role
                      </h3>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {roleLoading ? (
                      <div className="flex items-center space-x-3">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#5D5CDE]"></div>
                        <span className="text-lg text-gray-500 dark:text-gray-400 font-medium">
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
    </div>
  );
};
