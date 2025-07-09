import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import {
  FiUser,
  FiMail,
  FiBook,
  FiAward,
  FiGrid,
  FiCheckCircle,
  FiArrowRight,
} from "react-icons/fi";
import { MdOutlineSchool } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import axios from "axios";

export const TeachOnEduManage = () => {
  const { user } = useContext(AuthContext);
  const toast = useToast();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: user?.displayName || "",
      email: user?.email || "",
      title: "",
      experience: "",
      category: "",
    },
    mode: "onBlur",
  });

  const experienceOptions = [
    { value: "beginner", label: "Beginner" },
    { value: "mid-level", label: "Mid-Level" },
    { value: "experienced", label: "Experienced" },
  ];

  const categoryOptions = [
    { value: "web-development", label: "Web Development" },
    { value: "digital-marketing", label: "Digital Marketing" },
    { value: "graphic-design", label: "Graphic Design" },
    { value: "data-science", label: "Data Science" },
    { value: "mobile-development", label: "Mobile Development" },
    { value: "ui-ux-design", label: "UI/UX Design" },
    { value: "programming", label: "Programming" },
    { value: "artificial-intelligence", label: "Artificial Intelligence" },
  ];

  // Validation rules
  const validationRules = {
    name: {
      required: "Name is required",
      minLength: {
        value: 2,
        message: "Name must be at least 2 characters",
      },
    },
    title: {
      required: "Course title is required",
      minLength: {
        value: 10,
        message: "Course title must be at least 10 characters",
      },
    },
    experience: {
      required: "Please select your experience level",
    },
    category: {
      required: "Please select a category",
    },
  };

  // Function to submit teacher application to database
  const submitTeacherApplication = async (applicationData) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API}/teacher-applications`,
        applicationData
      );
      return response.data;
    } catch (error) {
      console.error("Error submitting teacher application:", error);
      throw error;
    }
  };

  // Form submission handler
  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const applicationData = {
        uid: user.uid,
        name: data.name,
        email: user.email,
        photoURL: user.photoURL || "",
        title: data.title,
        experience: data.experience,
        category: data.category,
        status: "pending",
        appliedAt: new Date(),
      };

      await submitTeacherApplication(applicationData);

      // Reset form
      reset({
        name: user?.displayName || "",
        email: user?.email || "",
        title: "",
        experience: "",
        category: "",
      });

      toast.success(
        "Application submitted successfully! We will review your application and get back to you soon."
      );

      // Redirect to home page after successful submission
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error("You have already submitted a teaching application.");
      } else if (error.response?.status === 400) {
        toast.error("Please check all required fields and try again.");
      } else {
        toast.error("Failed to submit application. Please try again later.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 bg-[#5D5CDE] rounded-2xl mx-auto mb-6">
            <MdOutlineSchool className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Become an Instructor
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
            Join our community of educators and share your expertise with
            students worldwide. Apply to teach on EduManage today.
          </p>
        </div>

        {/* Application Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-8 py-6 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Teaching Application
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Please fill out the form below to apply for a teaching position.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
            {/* Instructor Profile Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Profile Image */}
              <div className="md:col-span-2 flex items-center space-x-4">
                <img
                  src={
                    user?.photoURL ||
                    "https://i.ibb.co/4wsPz9SL/profile-removebg-preview.webp"
                  }
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover border-4 border-gray-200 dark:border-gray-600"
                  onError={(e) => {
                    e.target.src =
                      "https://i.ibb.co/4wsPz9SL/profile-removebg-preview.webp";
                  }}
                />
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Instructor Profile
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Your profile information will be displayed to students
                  </p>
                </div>
              </div>

              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    {...register("name", validationRules.name)}
                    className={`block w-full pl-10 pr-3 py-3 text-base border rounded-xl placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5D5CDE] focus:border-transparent transition-all duration-200 ${
                      errors.name
                        ? "border-red-500 ring-2 ring-red-200 dark:ring-red-800"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email Field (Read Only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    {...register("email")}
                    readOnly
                    className="block w-full pl-10 pr-3 py-3 text-base border rounded-xl bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 cursor-not-allowed"
                    placeholder="Your email address"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Email cannot be changed
                </p>
              </div>
            </div>

            {/* Course Information Section */}
            <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Teaching Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Course Title */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Course Title *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiBook className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      {...register("title", validationRules.title)}
                      className={`block w-full pl-10 pr-3 py-3 text-base border rounded-xl placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5D5CDE] focus:border-transparent transition-all duration-200 ${
                        errors.title
                          ? "border-red-500 ring-2 ring-red-200 dark:ring-red-800"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                      placeholder="e.g., Complete React Development Bootcamp"
                    />
                  </div>
                  {errors.title && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                {/* Experience Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Experience Level *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiAward className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      {...register("experience", validationRules.experience)}
                      className={`block w-full pl-10 pr-3 py-3 text-base border rounded-xl text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5D5CDE] focus:border-transparent transition-all duration-200 ${
                        errors.experience
                          ? "border-red-500 ring-2 ring-red-200 dark:ring-red-800"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    >
                      <option value="">Select experience level</option>
                      {experienceOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.experience && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                      {errors.experience.message}
                    </p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiGrid className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      {...register("category", validationRules.category)}
                      className={`block w-full pl-10 pr-3 py-3 text-base border rounded-xl text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5D5CDE] focus:border-transparent transition-all duration-200 ${
                        errors.category
                          ? "border-red-500 ring-2 ring-red-200 dark:ring-red-800"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    >
                      <option value="">Select category</option>
                      {categoryOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.category && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                      {errors.category.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#5D5CDE] to-[#4A4BC9] text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-[#4A4BC9] hover:to-[#3A3AB9] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5D5CDE] transition-all duration-200 flex items-center justify-center space-x-3 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl group"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    <span>Submitting Application...</span>
                  </>
                ) : (
                  <>
                    <FiCheckCircle className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                    <span>Submit for Review</span>
                    <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                  </>
                )}
              </button>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-3">
                Your application will be reviewed within 2-3 business days
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
