import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import {
  FiUser,
  FiMail,
  FiLock,
  FiImage,
  FiEye,
  FiEyeOff,
  FiArrowRight,
} from "react-icons/fi";
import { MdOutlineSchool } from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { updateProfile } from "firebase/auth";
import axios from "axios";

export const Register = () => {
  const { registerUser, googleAuth } = useContext(AuthContext);
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      photoURL: "",
    },
    mode: "onBlur", // Validate on blur for better UX
  });

  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Validation rules
  const validationRules = {
    email: {
      required: "Email is required",
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Please enter a valid email address",
      },
    },
  };

  // Function to save user data to MongoDB
  const saveUserToDatabase = async (user, userData) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API}/users`, {
        uid: user.uid,
        name: userData.name || user.displayName,
        email: user.email,
        photoURL: userData.photoURL || user.photoURL || "",
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // Form submission handler
  const onSubmit = async (data) => {
    try {
      const userCredential = await registerUser(data.email, data.password);

      await updateProfile(userCredential.user, {
        displayName: data.name,
        photoURL: data.photoURL,
      });

      // Save user data to MongoDB
      await saveUserToDatabase(userCredential.user, data);

      toast.success("Registration successful!");
      navigate(location.state || "/");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        toast.error("This email is already registered.");
      } else if (error.code === "auth/weak-password") {
        toast.error("Password is too weak. Please choose a stronger password.");
      } else if (error.code === "auth/invalid-email") {
        toast.error("Please enter a valid email address.");
      } else {
        toast.error("Registration failed. Please try again.");
      }
    }
  };

  const handleGoogleRegister = async () => {
    setGoogleLoading(true);
    try {
      const result = await googleAuth();

      // Save Google user data to MongoDB
      await saveUserToDatabase(result.user, {
        name: result.user.displayName,
        photoURL: result.user.photoURL,
      });

      toast.success("Google registration successful!");
      navigate(location.state || "/");
    } catch (error) {
      toast.error("Google registration failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center w-15 h-15 bg-[#5D5CDE] rounded-2xl mx-auto mb-6">
            <MdOutlineSchool className="text-white text-2xl" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Join EduManage
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Create your account to start learning
          </p>
        </div>

        {/* Registration Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
            noValidate
          >
            {/* Name Field - No validation */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  type="text"
                  {...register("name")}
                  className="block w-full pl-10 pr-3 py-3 text-base border rounded-xl placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5D5CDE] focus:border-transparent transition-all duration-200 border-gray-300 dark:border-gray-600"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            {/* Email Field - Validation kept */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  {...register("email", validationRules.email)}
                  className={`block w-full pl-10 pr-3 py-3 text-base border rounded-xl placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5D5CDE] focus:border-transparent transition-all duration-200 ${
                    errors.email
                      ? "border-red-500 ring-2 ring-red-200 dark:ring-red-800"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  placeholder="Enter your email"
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
              </div>
              {errors.email && (
                <p
                  id="email-error"
                  className="mt-2 text-sm text-red-600 dark:text-red-400"
                >
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field - No validation */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className="block w-full pl-10 pr-12 py-3 text-base border rounded-xl placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5D5CDE] focus:border-transparent transition-all duration-200 border-gray-300 dark:border-gray-600"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200" />
                  ) : (
                    <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200" />
                  )}
                </button>
              </div>
            </div>

            {/* Photo URL Field - No validation */}
            <div>
              <label
                htmlFor="photoURL"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Photo URL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiImage className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="photoURL"
                  type="url"
                  {...register("photoURL")}
                  className="block w-full pl-10 pr-3 py-3 text-base border rounded-xl placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5D5CDE] focus:border-transparent transition-all duration-200 border-gray-300 dark:border-gray-600"
                  placeholder="Enter photo URL (optional)"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[#5D5CDE] to-[#4A4BC9] text-white py-3 px-4 rounded-xl font-semibold text-base hover:from-[#4A4BC9] hover:to-[#3A3AB9] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5D5CDE] transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl group"
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <span>Create Account</span>
                  <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>
          </div>

          {/* Google Registration Button */}
          <button
            type="button"
            onClick={handleGoogleRegister}
            disabled={googleLoading || isSubmitting}
            className="mt-4 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-xl font-semibold text-base hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5D5CDE] transition-all duration-200 flex items-center justify-center space-x-3 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
          >
            {googleLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600 dark:border-gray-300"></div>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-[#5D5CDE] hover:text-[#4A4BC9] transition-colors duration-200"
              >
                Login in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
