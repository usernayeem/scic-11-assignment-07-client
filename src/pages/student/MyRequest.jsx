import React, { useState, useEffect, useContext } from "react";
import {
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiRefreshCw,
  FiUser,
  FiMail,
  FiBook,
  FiAward,
  FiCalendar,
} from "react-icons/fi";
import { MdVerified, MdPending, MdOutlineSchool } from "react-icons/md";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import axios from "axios";

export const MyRequest = () => {
  const { user } = useContext(AuthContext);
  const toast = useToast();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasApplication, setHasApplication] = useState(false);

  // Fetch user's teacher application
  const fetchMyApplication = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API}/teacher-applications`
      );

      if (response.data.success) {
        // Find application for current user
        const userApplication = response.data.applications.find(
          (app) => app.uid === user?.uid
        );

        if (userApplication) {
          setApplication(userApplication);
          setHasApplication(true);
        } else {
          setHasApplication(false);
        }
      }
    } catch (error) {
      toast.error("Failed to load your application");
    } finally {
      setLoading(false);
    }
  };

  // Format text helper
  const formatText = (text) => {
    return text
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Format date helper
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            <MdPending className="w-4 h-4 mr-1" />
            Under Review
          </span>
        );
      case "approved":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <MdVerified className="w-4 h-4 mr-1" />
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            <FiXCircle className="w-4 h-4 mr-1" />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  // Get status icon and color
  const getStatusDisplay = (status) => {
    switch (status) {
      case "pending":
        return {
          icon: FiClock,
          bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
          iconColor: "text-yellow-600 dark:text-yellow-400",
          title: "Application Under Review",
          description:
            "Your teaching application is being reviewed by our team. We typically review applications within 2-3 business days.",
        };
      case "approved":
        return {
          icon: FiCheckCircle,
          bgColor: "bg-green-100 dark:bg-green-900/30",
          iconColor: "text-green-600 dark:text-green-400",
          title: "Application Approved!",
          description:
            "Congratulations! Your teaching application has been approved. You can now access the teacher dashboard to start creating classes.",
        };
      case "rejected":
        return {
          icon: FiXCircle,
          bgColor: "bg-red-100 dark:bg-red-900/30",
          iconColor: "text-red-600 dark:text-red-400",
          title: "Application Not Approved",
          description:
            "Unfortunately, your teaching application was not approved at this time. You can submit a new application by visiting the 'Teach on EduManage' page.",
        };
      default:
        return null;
    }
  };

  useEffect(() => {
    if (user?.uid) {
      fetchMyApplication();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-8">
          <div className="flex items-center justify-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5D5CDE]"></div>
            <span className="text-gray-600 dark:text-gray-300">
              Loading your application status...
            </span>
          </div>
        </div>
      </div>
    );
  }

  // No application found
  if (!hasApplication) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                My Teaching Request
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Track the status of your teaching application
              </p>
            </div>
            <button
              onClick={fetchMyApplication}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              <FiRefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-12 text-center">
          <div className="flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-2xl mx-auto mb-6">
            <MdOutlineSchool className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Teaching Application Found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            You haven't submitted a teaching application yet. Start your journey
            as an instructor by applying to teach on EduManage.
          </p>
          <Link
            to="/teach"
            className="inline-flex items-center bg-[#5D5CDE] hover:bg-[#4A4BC9] text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            <FiBook className="w-5 h-5 mr-2" />
            Apply to Teach
          </Link>
        </div>
      </div>
    );
  }

  const statusDisplay = getStatusDisplay(application.status);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              My Teaching Request
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Track the status of your teaching application
            </p>
          </div>
          <button
            onClick={fetchMyApplication}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            <FiRefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Status Overview */}
      <div className="mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-8 text-center">
          <div
            className={`flex items-center justify-center w-16 h-16 ${statusDisplay.bgColor} rounded-2xl mx-auto mb-6`}
          >
            <statusDisplay.icon
              className={`w-8 h-8 ${statusDisplay.iconColor}`}
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {statusDisplay.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
            {statusDisplay.description}
          </p>
          <div className="flex justify-center">
            {getStatusBadge(application.status)}
          </div>

          {/* Show action button for approved status */}
          {application.status === "approved" && (
            <div className="mt-6">
              <Link
                to="/teacher-dashboard"
                className="inline-flex items-center bg-gradient-to-r from-[#5D5CDE] to-[#4A4BC9] text-white px-6 py-3 rounded-xl font-semibold hover:from-[#4A4BC9] hover:to-[#3A3AB9] transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <MdOutlineSchool className="w-5 h-5 mr-2" />
                Go to Teacher Dashboard
              </Link>
            </div>
          )}

          {/* Show action button for rejected status */}
          {application.status === "rejected" && (
            <div className="mt-6">
              <Link
                to="/teach"
                className="inline-flex items-center bg-gradient-to-r from-[#5D5CDE] to-[#4A4BC9] text-white px-6 py-3 rounded-xl font-semibold hover:from-[#4A4BC9] hover:to-[#3A3AB9] transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <FiRefreshCw className="w-5 h-5 mr-2" />
                Submit New Application
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Application Details */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Application Details
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            Your submitted teaching application information
          </p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Personal Information
              </h4>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <FiUser className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Full Name
                  </p>
                  <p className="text-base text-gray-900 dark:text-white truncate">
                    {application.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <FiMail className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email Address
                  </p>
                  <p className="text-base text-gray-900 dark:text-white truncate">
                    {application.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <FiCalendar className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Applied Date
                  </p>
                  <p className="text-base text-gray-900 dark:text-white">
                    {formatDate(application.appliedAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* Course Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Teaching Information
              </h4>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <FiBook className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Course Title
                  </p>
                  <p className="text-base text-gray-900 dark:text-white">
                    {application.title}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <FiAward className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Experience Level
                  </p>
                  <p className="text-base text-gray-900 dark:text-white">
                    {formatText(application.experience)}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <FiBook className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Category
                  </p>
                  <p className="text-base text-gray-900 dark:text-white">
                    {formatText(application.category)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline for pending applications */}
          {application.status === "pending" && (
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                What's Next?
              </h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-6 h-6 bg-[#5D5CDE] rounded-full">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    Application submitted and received
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-6 h-6 bg-yellow-500 rounded-full">
                    <FiClock className="w-3 h-3 text-white" />
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    Under review by our team (2-3 business days)
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">
                    Decision notification via email
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
