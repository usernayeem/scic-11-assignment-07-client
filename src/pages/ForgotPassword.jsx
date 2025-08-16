import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FiMail, FiArrowLeft, FiCheck } from "react-icons/fi";
import { MdOutlineSchool } from "react-icons/md";
import { Link } from "react-router-dom";
import { useToast } from "../contexts/ToastContext";
import { sendPasswordResetEmail } from "firebase/auth";
import { AuthContext } from "../contexts/AuthContext";
import { useContext } from "react";

export const ForgotPassword = () => {
  const { auth } = useContext(AuthContext);
  const toast = useToast();
  const [isEmailSent, setIsEmailSent] = useState(false);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({
    defaultValues: {
      email: "",
    },
    mode: "onBlur",
  });

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

  // Form submission handler
  const onSubmit = async (data) => {
    try {
      await sendPasswordResetEmail(auth, data.email);
      setIsEmailSent(true);
      toast.success("Password reset email sent successfully!");
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        toast.error("No account found with this email address.");
      } else if (error.code === "auth/invalid-email") {
        toast.error("Please enter a valid email address.");
      } else if (error.code === "auth/too-many-requests") {
        toast.error("Too many attempts. Please try again later.");
      } else {
        toast.error("Failed to send reset email. Please try again.");
      }
    }
  };

  const emailValue = watch("email");

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center w-15 h-15 bg-[#5D5CDE] rounded-2xl mx-auto mb-6">
            <MdOutlineSchool className="text-white text-2xl" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {isEmailSent ? "Check Your Email" : "Forgot Password?"}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {isEmailSent
              ? `We've sent a password reset link to ${emailValue}`
              : "Enter your email address and we'll send you a link to reset your password"}
          </p>
        </div>

        {/* Form or Success Message */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
          {isEmailSent ? (
            // Success State
            <div className="text-center space-y-6">
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mx-auto">
                <FiCheck className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <div className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">
                  Please check your email inbox and click on the password reset
                  link to create a new password.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Don't see the email? Check your spam folder or try again.
                </p>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => setIsEmailSent(false)}
                  className="w-full bg-gradient-to-r from-[#5D5CDE] to-[#4A4BC9] text-white py-3 px-4 rounded-xl font-semibold text-base hover:from-[#4A4BC9] hover:to-[#3A3AB9] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5D5CDE] transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Send Another Email
                </button>
                <Link
                  to="/login"
                  className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-xl font-semibold text-base hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm hover:shadow-md"
                >
                  <FiArrowLeft className="w-5 h-5" />
                  <span>Back to Login</span>
                </Link>
              </div>
            </div>
          ) : (
            // Form State
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
              noValidate
            >
              {/* Email Field */}
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
                    placeholder="Enter your email address"
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#5D5CDE] to-[#4A4BC9] text-white py-3 px-4 rounded-xl font-semibold text-base hover:from-[#4A4BC9] hover:to-[#3A3AB9] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5D5CDE] transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <span>Send Reset Link</span>
                )}
              </button>

              {/* Back to Login Link */}
              <div className="text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center space-x-2 text-sm text-[#5D5CDE] hover:text-[#4A4BC9] transition-colors duration-200 font-medium"
                >
                  <FiArrowLeft className="w-4 h-4" />
                  <span>Back to Login</span>
                </Link>
              </div>
            </form>
          )}
        </div>

        {/* Additional Help */}
        {!isEmailSent && (
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Remember your password?{" "}
              <Link
                to="/login"
                className="font-medium text-[#5D5CDE] hover:text-[#4A4BC9] transition-colors duration-200"
              >
                Sign in here
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
