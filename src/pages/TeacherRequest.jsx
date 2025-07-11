import React, { useState, useEffect } from "react";
import {
  FiCheck,
  FiX,
  FiUser,
  FiBook,
  FiAward,
  FiClock,
  FiRefreshCw,
} from "react-icons/fi";
import { MdVerified, MdPending } from "react-icons/md";
import axios from "axios";
import { useToast } from "../contexts/ToastContext";

export const TeacherRequest = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const toast = useToast();

  // Fetch teacher applications
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API}/teacher-applications`
      );

      if (response.data.success) {
        setApplications(response.data.applications);
      } else {
        toast.error("Failed to fetch teacher applications");
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Failed to load teacher applications");
    } finally {
      setLoading(false);
    }
  };

  // Handle approve application
  const handleApprove = async (applicationId, uid) => {
    setActionLoading((prev) => ({ ...prev, [applicationId]: "approving" }));

    try {
      // Update application status to approved
      const response = await axios.patch(
        `${import.meta.env.VITE_API}/teacher-applications/${applicationId}`,
        { status: "approved" }
      );

      if (response.data.success) {
        // Update user role to teacher
        await axios.patch(`${import.meta.env.VITE_API}/users/${uid}`, {
          role: "teacher",
        });

        // Update local state
        setApplications((prev) =>
          prev.map((app) =>
            app._id === applicationId
              ? { ...app, status: "approved", reviewedAt: new Date() }
              : app
          )
        );

        toast.success("Teacher application approved successfully!");
      }
    } catch (error) {
      console.error("Error approving application:", error);
      toast.error("Failed to approve application. Please try again.");
    } finally {
      setActionLoading((prev) => ({ ...prev, [applicationId]: null }));
    }
  };

  // Handle reject application
  const handleReject = async (applicationId) => {
    setActionLoading((prev) => ({ ...prev, [applicationId]: "rejecting" }));

    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API}/teacher-applications/${applicationId}`,
        { status: "rejected" }
      );

      if (response.data.success) {
        // Update local state
        setApplications((prev) =>
          prev.map((app) =>
            app._id === applicationId
              ? { ...app, status: "rejected", reviewedAt: new Date() }
              : app
          )
        );

        toast.success("Teacher application rejected");
      }
    } catch (error) {
      console.error("Error rejecting application:", error);
      toast.error("Failed to reject application. Please try again.");
    } finally {
      setActionLoading((prev) => ({ ...prev, [applicationId]: null }));
    }
  };

  // Format experience level
  const formatExperience = (experience) => {
    return experience
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Format category
  const formatCategory = (category) => {
    return category
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            <MdPending className="w-4 h-4 mr-1" />
            Pending
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
            <FiX className="w-4 h-4 mr-1" />
            Rejected
          </span>
        );
      default:
        return status;
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-8">
        <div className="flex items-center justify-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5D5CDE]"></div>
          <span className="text-gray-600 dark:text-gray-300">
            Loading teacher applications...
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
              Teacher Applications
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Manage and review teacher application requests
            </p>
          </div>
          <button
            onClick={fetchApplications}
            className="mt-3 sm:mt-0 inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            <FiRefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Applications Count */}
      <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700/50">
        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
          <span>Total Applications: {applications.length}</span>
          <span>
            Pending:{" "}
            {applications.filter((app) => app.status === "pending").length}
          </span>
          <span>
            Approved:{" "}
            {applications.filter((app) => app.status === "approved").length}
          </span>
          <span>
            Rejected:{" "}
            {applications.filter((app) => app.status === "rejected").length}
          </span>
        </div>
      </div>

      {/* Applications Table */}
      <div className="overflow-x-auto">
        {applications.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <FiUser className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              No teacher applications
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Teacher applications will appear here when submitted.
            </p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Applicant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Course Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Experience
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Applied Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {applications.map((application) => (
                <tr
                  key={application._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  {/* Applicant Info */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={
                          application.photoURL ||
                          "https://i.ibb.co/4wsPz9SL/profile-removebg-preview.webp"
                        }
                        alt={application.name}
                        className="h-12 w-12 rounded-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            "https://i.ibb.co/4wsPz9SL/profile-removebg-preview.webp";
                        }}
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {application.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {application.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Course Details */}
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white font-medium">
                      {application.title}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1">
                      <FiBook className="w-4 h-4 mr-1" />
                      {formatCategory(application.category)}
                    </div>
                  </td>

                  {/* Experience */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900 dark:text-white">
                      <FiAward className="w-4 h-4 mr-2 text-[#5D5CDE]" />
                      {formatExperience(application.experience)}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(application.status)}
                  </td>

                  {/* Applied Date */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <FiClock className="w-4 h-4 mr-1" />
                      {new Date(application.appliedAt).toLocaleDateString()}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {application.status === "pending" ? (
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() =>
                            handleApprove(application._id, application.uid)
                          }
                          disabled={actionLoading[application._id]}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                          {actionLoading[application._id] === "approving" ? (
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                          ) : (
                            <FiCheck className="w-3 h-3 mr-1" />
                          )}
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(application._id)}
                          disabled={actionLoading[application._id]}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                          {actionLoading[application._id] === "rejecting" ? (
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                          ) : (
                            <FiX className="w-3 h-3 mr-1" />
                          )}
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-400 dark:text-gray-500 text-xs">
                        {application.status === "approved"
                          ? "Approved"
                          : "Rejected"}
                      </span>
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
