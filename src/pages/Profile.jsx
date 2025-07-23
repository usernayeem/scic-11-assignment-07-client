import React, { useContext, useState, useEffect } from "react";
import {
  FiUser,
  FiMail,
  FiCalendar,
  FiEdit3,
  FiSettings,
  FiSave,
  FiX,
} from "react-icons/fi";
import { AuthContext } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { updateProfile } from "firebase/auth";
import { useForm } from "react-hook-form";
import axios from "axios";

export const Profile = () => {
  const { user, auth } = useContext(AuthContext);
  const toast = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [roleLoading, setRoleLoading] = useState(true);
  const [userFromDB, setUserFromDB] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      name: user?.displayName || "",
      email: user?.email || "",
      photoURL: user?.photoURL || "",
    },
  });

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
        // Update form with backend data
        setValue("name", response.data.user.name || user?.displayName || "");
        setValue("email", response.data.user.email || user?.email || "");
        setValue(
          "photoURL",
          response.data.user.photoURL || user?.photoURL || ""
        );
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

  React.useEffect(() => {
    if (userFromDB) {
      setValue("name", userFromDB.name || user?.displayName || "");
      setValue("email", userFromDB.email || user?.email || "");
      setValue("photoURL", userFromDB.photoURL || user?.photoURL || "");
    } else if (user) {
      setValue("name", user.displayName || "");
      setValue("email", user.email || "");
      setValue("photoURL", user.photoURL || "");
    }
  }, [user, userFromDB, setValue]);

  const handleProfileUpdate = async (data) => {
    try {
      await updateProfile(auth.currentUser, {
        displayName: data.name,
        photoURL: data.photoURL,
      });

      // Also update in backend if needed
      try {
        await axios.patch(`${import.meta.env.VITE_API}/users/${user.uid}`, {
          name: data.name,
          photoURL: data.photoURL,
        });
      } catch (backendError) {
        toast.info(
          "Backend update not available, continuing with Firebase update"
        );
      }

      toast.success("Profile updated successfully!");
      setIsEditing(false);
      // Refresh user data from backend
      fetchUserData();
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    reset({
      name: userFromDB?.name || user?.displayName || "",
      email: userFromDB?.email || user?.email || "",
      photoURL: userFromDB?.photoURL || user?.photoURL || "",
    });
  };

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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
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
              <div className="text-center sm:text-left min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white truncate">
                  {getDisplayName()}
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg truncate">
                  {userFromDB?.email || user?.email}
                </p>
              </div>
            </div>

            <div className="flex justify-center md:justify-end">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-[#5D5CDE] hover:bg-[#4A4BC9] text-white px-4 sm:px-6 py-2.5 sm:py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2 text-sm sm:text-base w-full sm:w-auto justify-center max-w-xs"
                >
                  <FiEdit3 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex space-x-2 w-full sm:w-auto max-w-xs">
                  <button
                    onClick={handleCancelEdit}
                    className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-4 py-2.5 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 flex items-center space-x-2 text-sm sm:text-base flex-1 sm:flex-none justify-center"
                  >
                    <FiX className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              )}
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
            {isEditing
              ? "Update your personal information"
              : "Your personal information and account details"}
          </p>
        </div>

        <div className="p-4 sm:p-6">
          {!isEditing ? (
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
                    Account Type
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
          ) : (
            <form
              onSubmit={handleSubmit(handleProfileUpdate)}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="sm:col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    {...register("name", {
                      required: "Name is required",
                      minLength: {
                        value: 2,
                        message: "Name must be at least 2 characters",
                      },
                    })}
                    className={`block w-full px-3 py-2.5 text-base border rounded-lg placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5D5CDE] focus:border-transparent transition-all duration-200 ${
                      errors.name
                        ? "border-red-500 ring-2 ring-red-200 dark:ring-red-800"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    {...register("email")}
                    readOnly
                    className="block w-full px-3 py-2.5 text-base border rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 cursor-not-allowed"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Email cannot be changed
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Profile Photo URL
                  </label>
                  <input
                    type="url"
                    {...register("photoURL")}
                    className="block w-full px-3 py-2.5 text-base border rounded-lg placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5D5CDE] focus:border-transparent transition-all duration-200 border-gray-300 dark:border-gray-600"
                    placeholder="Enter photo URL (optional)"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="w-full sm:w-auto bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto bg-[#5D5CDE] hover:bg-[#4A4BC9] text-white px-6 py-2.5 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <FiSave className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
