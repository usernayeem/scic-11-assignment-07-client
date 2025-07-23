import React, { useContext, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  FiUser,
  FiMail,
  FiBook,
  FiAward,
  FiGrid,
  FiCheckCircle,
  FiArrowRight,
  FiClock,
  FiXCircle,
  FiRefreshCw,
  FiEdit3,
  FiArrowLeft,
} from "react-icons/fi";
import { MdOutlineSchool, MdVerified } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import axios from "axios";

export const TeachOnEduManage = () => {
  const { user } = useContext(AuthContext);
  const toast = useToast();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [userRole, setUserRole] = useState("student");
  const [loading, setLoading] = useState(true);
  const [isResubmitting, setIsResubmitting] = useState(false);
  const [applicationData, setApplicationData] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
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

  // Check user role and application status
  const checkUserStatus = async () => {
    try {
      setLoading(true);

      // Get user role
      const userResponse = await axios.get(
        `${import.meta.env.VITE_API}/users/${user.uid}`
      );

      if (userResponse.data.success) {
        setUserRole(userResponse.data.user.role);
      }

      // Check for existing teacher application
      const applicationResponse = await axios.get(
        `${import.meta.env.VITE_API}/teacher-applications`
      );

      if (applicationResponse.data.success) {
        // Find application for current user
        const userApplication = applicationResponse.data.applications.find(
          (app) => app.uid === user.uid
        );

        if (userApplication) {
          setApplicationStatus(userApplication.status);
          setApplicationData(userApplication);
        }
      }
    } catch (error) {
      toast.error("Failed to load user status");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      checkUserStatus();
    }
  }, [user]);

  // Function to submit teacher application to database
  const submitTeacherApplication = async (applicationData) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API}/teacher-applications`,
        applicationData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // Function to update existing teacher application
  const updateTeacherApplication = async (applicationId, updateData) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API}/teacher-applications/${applicationId}`,
        updateData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // Handle showing edit form for resubmission
  const handleStartEdit = () => {
    if (applicationData) {
      // Pre-fill form with existing data
      setValue("title", applicationData.title);
      setValue("experience", applicationData.experience);
      setValue("category", applicationData.category);
      setShowEditForm(true);
    }
  };

  // Handle canceling edit
  const handleCancelEdit = () => {
    setShowEditForm(false);
    // Reset form to original values
    reset({
      name: user?.displayName || "",
      email: user?.email || "",
      title: "",
      experience: "",
      category: "",
    });
  };

  // Form submission handler
  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      if (showEditForm && applicationData) {
        // Update existing application
        const updateData = {
          title: data.title,
          experience: data.experience,
          category: data.category,
        };

        await updateTeacherApplication(applicationData._id, updateData);

        // Update local state
        setApplicationStatus("pending");
        setApplicationData({
          ...applicationData,
          ...updateData,
          status: "pending",
        });
        setShowEditForm(false);

        toast.success(
          "Application updated and resubmitted successfully! We will review your updated application."
        );
      } else {
        // Create new application
        const applicationPayload = {
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

        await submitTeacherApplication(applicationPayload);

        // Update local state to show pending status
        setApplicationStatus("pending");

        toast.success(
          "Application submitted successfully! We will review your application and get back to you soon."
        );
      }

      // Reset form
      reset({
        name: user?.displayName || "",
        email: user?.email || "",
        title: "",
        experience: "",
        category: "",
      });
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error("You have already submitted a teaching application.");
        // Refresh the status to show current application
        checkUserStatus();
      } else if (error.response?.status === 400) {
        toast.error("Please check all required fields and try again.");
      } else {
        toast.error("Failed to submit application. Please try again later.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format category and experience
  const formatText = (text) => {
    return text
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
            <div className="flex items-center justify-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5D5CDE]"></div>
              <span className="text-gray-600 dark:text-gray-300">
                Loading your application status...
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show message if user is already a teacher
  if (userRole === "teacher") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-2xl mx-auto mb-6">
              <MdVerified className="text-green-600 dark:text-green-400 text-2xl" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Welcome, Teacher!
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
              Congratulations! You are already an approved instructor on
              EduManage. Start creating and managing your courses from your
              teacher dashboard.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
            <div className="inline-block mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
                <MdVerified className="text-white text-3xl" />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              You're All Set!
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Your teaching application has been approved. You can now create
              classes and start your teaching journey with EduManage.
            </p>

            <button
              onClick={() => navigate("/teacher-dashboard")}
              className="bg-gradient-to-r from-[#5D5CDE] to-[#4A4BC9] text-white py-3 px-8 rounded-xl font-semibold text-lg hover:from-[#4A4BC9] hover:to-[#3A3AB9] transition-all duration-200 flex items-center justify-center space-x-3 mx-auto shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              <span>Go to Teacher Dashboard</span>
              <FiArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show pending status
  if (applicationStatus === "pending" && !showEditForm) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-2xl mx-auto mb-6">
              <FiClock className="text-yellow-600 dark:text-yellow-400 text-2xl" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Application Under Review
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
              Thank you for your interest in teaching on EduManage! Your
              application is currently being reviewed by our team.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
            <div className="text-center mb-6">
              <div className="inline-block mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto">
                  <FiClock className="text-white text-2xl animate-pulse" />
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Your Application Details
              </h3>

              {applicationData && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 text-left space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Course Title:
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {applicationData.title}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Category:
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {formatText(applicationData.category)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Experience:
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {formatText(applicationData.experience)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Applied Date:
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {new Date(applicationData.appliedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Status:
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                      <FiClock className="w-4 h-4 mr-1" />
                      Pending Review
                    </span>
                  </div>
                </div>
              )}

              <p className="text-gray-600 dark:text-gray-300 mt-6">
                We typically review applications within 2-3 business days.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show rejected status with edit option
  if (applicationStatus === "rejected" && !showEditForm) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900 rounded-2xl mx-auto mb-6">
              <FiXCircle className="text-red-600 dark:text-red-400 text-2xl" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Application Not Approved
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
              Unfortunately, your teaching application was not approved at this
              time. You can edit and resubmit your application with updated
              information.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
            <div className="inline-block mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto">
                <FiXCircle className="text-white text-3xl" />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Application Status: Rejected
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              We appreciate your interest in teaching with us. You can now edit
              your application information and submit it again for review.
            </p>

            <button
              onClick={handleStartEdit}
              className="bg-gradient-to-r from-[#5D5CDE] to-[#4A4BC9] text-white py-3 px-8 rounded-xl font-semibold text-lg hover:from-[#4A4BC9] hover:to-[#3A3AB9] transition-all duration-200 flex items-center justify-center space-x-3 mx-auto shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              <FiEdit3 className="w-5 h-5" />
              <span>Edit & Resubmit Application</span>
            </button>

            <p className="text-gray-500 dark:text-gray-400 mt-4 text-sm">
              Update your course information and resubmit for review
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show application form (default state or edit mode)
  const isEditMode = showEditForm && applicationData;
  const formTitle = isEditMode
    ? "Edit Teaching Application"
    : "Become an Instructor";
  const formDescription = isEditMode
    ? "Update your teaching application information and resubmit for review."
    : "Join our community of educators and share your expertise with students worldwide. Apply to teach on EduManage today.";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 bg-[#5D5CDE] rounded-2xl mx-auto mb-6">
            <MdOutlineSchool className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {formTitle}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
            {formDescription}
          </p>

          {isEditMode && (
            <button
              onClick={handleCancelEdit}
              className="mt-4 inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
            >
              <FiArrowLeft className="w-4 h-4 mr-1" />
              Back to Application Status
            </button>
          )}
        </div>

        {/* Application Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-8 py-6 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-600">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {isEditMode ? "Update Application" : "Teaching Application"}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {isEditMode
                ? "Make changes to your application information below."
                : "Please fill out the form below to apply for a teaching position."}
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
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                {isEditMode && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="w-full sm:w-auto px-6 py-4 border border-gray-300 dark:border-gray-600 rounded-xl font-semibold text-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#5D5CDE] to-[#4A4BC9] text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-[#4A4BC9] hover:to-[#3A3AB9] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5D5CDE] transition-all duration-200 flex items-center justify-center space-x-3 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl group"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      <span>
                        {isEditMode
                          ? "Updating Application..."
                          : "Submitting Application..."}
                      </span>
                    </>
                  ) : (
                    <>
                      <FiCheckCircle className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                      <span>
                        {isEditMode ? "Update & Resubmit" : "Submit for Review"}
                      </span>
                      <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                    </>
                  )}
                </button>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-3">
                {isEditMode
                  ? "Your updated application will be reviewed within 2-3 business days"
                  : "Your application will be reviewed within 2-3 business days"}
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
