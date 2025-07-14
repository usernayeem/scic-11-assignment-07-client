import React, { useContext, useState } from "react";
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

export const Profile = () => {
  const { user, auth } = useContext(AuthContext);
  const toast = useToast();
  const [isEditing, setIsEditing] = useState(false);

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

  React.useEffect(() => {
    if (user) {
      setValue("name", user.displayName || "");
      setValue("email", user.email || "");
      setValue("photoURL", user.photoURL || "");
    }
  }, [user, setValue]);

  const handleProfileUpdate = async (data) => {
    try {
      await updateProfile(auth.currentUser, {
        displayName: data.name,
        photoURL: data.photoURL,
      });

      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    reset({
      name: user?.displayName || "",
      email: user?.email || "",
      photoURL: user?.photoURL || "",
    });
  };

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-6 mb-6 md:mb-0">
              <img
                src={
                  user?.photoURL ||
                  "https://i.ibb.co/4wsPz9SL/profile-removebg-preview.webp"
                }
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 dark:border-gray-600"
                onError={(e) => {
                  e.target.src =
                    "https://i.ibb.co/4wsPz9SL/profile-removebg-preview.webp";
                }}
              />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  {user?.displayName || "Student"}
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  {user?.email}
                </p>
              </div>
            </div>

            <div className="flex space-x-3">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-[#5D5CDE] hover:bg-[#4A4BC9] text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
                >
                  <FiEdit3 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleCancelEdit}
                    className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 flex items-center space-x-2"
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
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Profile Information
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {isEditing
              ? "Update your personal information"
              : "Your personal information and account details"}
          </p>
        </div>

        <div className="p-6">
          {!isEditing ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <div className="flex items-center space-x-3">
                    <FiUser className="w-5 h-5 text-gray-400" />
                    <p className="text-base text-gray-900 dark:text-white">
                      {user?.displayName || "Not provided"}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="flex items-center space-x-3">
                    <FiMail className="w-5 h-5 text-gray-400" />
                    <p className="text-base text-gray-900 dark:text-white">
                      {user?.email}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Member Since
                  </label>
                  <div className="flex items-center space-x-3">
                    <FiCalendar className="w-5 h-5 text-gray-400" />
                    <p className="text-base text-gray-900 dark:text-white">
                      {user?.metadata?.creationTime
                        ? new Date(
                            user.metadata.creationTime
                          ).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Account Status
                  </label>
                  <div className="flex items-center space-x-3">
                    <FiSettings className="w-5 h-5 text-gray-400" />
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(handleProfileUpdate)}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
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
                    className={`block w-full px-3 py-2 text-base border rounded-lg placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5D5CDE] focus:border-transparent transition-all duration-200 ${
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    {...register("email")}
                    readOnly
                    className="block w-full px-3 py-2 text-base border rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 cursor-not-allowed"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Email cannot be changed
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Profile Photo URL
                  </label>
                  <input
                    type="url"
                    {...register("photoURL")}
                    className="block w-full px-3 py-2 text-base border rounded-lg placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5D5CDE] focus:border-transparent transition-all duration-200 border-gray-300 dark:border-gray-600"
                    placeholder="Enter photo URL (optional)"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-6 py-2 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#5D5CDE] hover:bg-[#4A4BC9] text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
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
