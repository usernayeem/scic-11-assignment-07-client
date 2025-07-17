import React, { useState, useEffect } from "react";
import {
  FiCheck,
  FiX,
  FiBook,
  FiMail,
  FiRefreshCw,
  FiImage,
  FiUser,
  FiActivity,
} from "react-icons/fi";
import { MdVerified, MdPending } from "react-icons/md";
import axios from "axios";
import { useToast } from "../contexts/ToastContext";

export const AdminAllClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const toast = useToast();

  // Fetch all classes
  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API}/classes`);

      if (response.data.success) {
        setClasses(response.data.classes);
      } else {
        toast.error("Failed to fetch classes");
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
      toast.error("Failed to load classes");
    } finally {
      setLoading(false);
    }
  };

  // Handle approve class
  const handleApprove = async (classId, className) => {
    setActionLoading((prev) => ({ ...prev, [classId]: "approving" }));

    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API}/classes/${classId}`,
        { status: "approved" }
      );

      if (response.data.success) {
        // Update local state
        setClasses((prev) =>
          prev.map((cls) =>
            cls._id === classId
              ? { ...cls, status: "approved", updatedAt: new Date() }
              : cls
          )
        );

        toast.success(`Class "${className}" approved successfully!`);
      }
    } catch (error) {
      console.error("Error approving class:", error);
      toast.error("Failed to approve class. Please try again.");
    } finally {
      setActionLoading((prev) => ({ ...prev, [classId]: null }));
    }
  };

  // Handle reject class
  const handleReject = async (classId, className) => {
    setActionLoading((prev) => ({ ...prev, [classId]: "rejecting" }));

    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API}/classes/${classId}`,
        { status: "rejected" }
      );

      if (response.data.success) {
        // Update local state
        setClasses((prev) =>
          prev.map((cls) =>
            cls._id === classId
              ? { ...cls, status: "rejected", updatedAt: new Date() }
              : cls
          )
        );

        toast.success(`Class "${className}" rejected`);
      }
    } catch (error) {
      console.error("Error rejecting class:", error);
      toast.error("Failed to reject class. Please try again.");
    } finally {
      setActionLoading((prev) => ({ ...prev, [classId]: null }));
    }
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

  // Truncate text helper
  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-8">
        <div className="flex items-center justify-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5D5CDE]"></div>
          <span className="text-gray-600 dark:text-gray-300">
            Loading classes...
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
              All Classes Management
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Review and manage all submitted classes
            </p>
          </div>
          <button
            onClick={fetchClasses}
            className="mt-3 sm:mt-0 inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            <FiRefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Classes Count */}
      <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700/50">
        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
          <span>Total Classes: {classes.length}</span>
          <span>
            Pending: {classes.filter((cls) => cls.status === "pending").length}
          </span>
          <span>
            Approved:{" "}
            {classes.filter((cls) => cls.status === "approved").length}
          </span>
          <span>
            Rejected:{" "}
            {classes.filter((cls) => cls.status === "rejected").length}
          </span>
        </div>
      </div>

      {/* Classes Table */}
      <div className="overflow-x-auto">
        {classes.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <FiBook className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              No classes submitted
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Classes will appear here when teachers submit them.
            </p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Class Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Teacher
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {classes.map((classItem) => (
                <tr
                  key={classItem._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  {/* Class Details */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={classItem.image}
                        alt={classItem.title}
                        className="h-16 w-16 rounded-lg object-cover"
                        onError={(e) => {
                          e.target.src =
                            "https://i.ibb.co/GQzR5BLS/image-not-found.webp";
                        }}
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white max-w-xs">
                          {truncateText(classItem.title, 50)}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Created:{" "}
                          {new Date(classItem.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Teacher Info */}
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white">
                      <div className="flex items-center mb-1">
                        <FiUser className="w-4 h-4 mr-1 text-gray-400" />
                        {classItem.teacherName}
                      </div>
                      <div className="flex items-center text-gray-500 dark:text-gray-400">
                        <FiMail className="w-4 h-4 mr-1" />
                        {classItem.teacherEmail}
                      </div>
                    </div>
                  </td>

                  {/* Description */}
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white max-w-xs">
                      {truncateText(classItem.description, 100)}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(classItem.status)}
                  </td>

                  {/* Price */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      ${classItem.price}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      {classItem.status === "pending" ? (
                        <>
                          <button
                            onClick={() =>
                              handleApprove(classItem._id, classItem.title)
                            }
                            disabled={actionLoading[classItem._id]}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                          >
                            {actionLoading[classItem._id] === "approving" ? (
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                            ) : (
                              <FiCheck className="w-3 h-3 mr-1" />
                            )}
                            Approve
                          </button>
                          <button
                            onClick={() =>
                              handleReject(classItem._id, classItem.title)
                            }
                            disabled={actionLoading[classItem._id]}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                          >
                            {actionLoading[classItem._id] === "rejecting" ? (
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                            ) : (
                              <FiX className="w-3 h-3 mr-1" />
                            )}
                            Reject
                          </button>
                        </>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500 text-xs">
                          {classItem.status === "approved"
                            ? "Approved"
                            : "Rejected"}
                        </span>
                      )}

                      {/* Progress Button */}
                      <button
                        onClick={() =>
                          handleViewProgress(classItem._id, classItem.title)
                        }
                        disabled={classItem.status !== "approved"}
                        className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md transition-colors duration-200 ${
                          classItem.status === "approved"
                            ? "text-white bg-[#5D5CDE] hover:bg-[#4A4BC9] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5D5CDE]"
                            : "text-gray-400 dark:text-gray-500 bg-gray-200 dark:bg-gray-700 cursor-not-allowed"
                        }`}
                      >
                        <FiActivity className="w-3 h-3 mr-1" />
                        Progress
                      </button>
                    </div>
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
