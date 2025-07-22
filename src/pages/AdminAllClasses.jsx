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
  FiUsers,
  FiFileText,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { MdVerified, MdPending } from "react-icons/md";
import axios from "axios";
import { useToast } from "../contexts/ToastContext";

export const AdminAllClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [selectedClassProgress, setSelectedClassProgress] = useState(null);
  const [progressLoading, setProgressLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalClasses, setTotalClasses] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const toast = useToast();

  // Fetch classes with pagination
  const fetchClasses = async (page = currentPage, limit = pageSize) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await axios.get(
        `${import.meta.env.VITE_API}/classes?${params}`
      );

      if (response.data.success) {
        setClasses(response.data.classes);
        setTotalClasses(response.data.totalClasses || 0);
        setTotalPages(response.data.totalPages || 0);
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

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      fetchClasses(newPage, pageSize);
    }
  };

  // Handle page size change
  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
    fetchClasses(1, newPageSize);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust start page if we're near the end
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  // Fetch progress data for a class
  const fetchClassProgress = async (classId) => {
    try {
      const [classResponse, assignmentsResponse, submissionsResponse] =
        await Promise.all([
          axios.get(`${import.meta.env.VITE_API}/classes/${classId}`),
          axios.get(`${import.meta.env.VITE_API}/assignments/class/${classId}`),
          axios.get(`${import.meta.env.VITE_API}/submissions/class/${classId}`),
        ]);

      return {
        classData: classResponse.data.success ? classResponse.data.class : null,
        assignments: assignmentsResponse.data.success
          ? assignmentsResponse.data.assignments
          : [],
        submissions: submissionsResponse.data.success
          ? submissionsResponse.data.submissions
          : [],
      };
    } catch (error) {
      console.error("Error fetching progress data:", error);
      throw error;
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
        // Refresh the current page to show updated data
        await fetchClasses(currentPage, pageSize);
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
        // Refresh the current page to show updated data
        await fetchClasses(currentPage, pageSize);
        toast.success(`Class "${className}" rejected`);
      }
    } catch (error) {
      console.error("Error rejecting class:", error);
      toast.error("Failed to reject class. Please try again.");
    } finally {
      setActionLoading((prev) => ({ ...prev, [classId]: null }));
    }
  };

  // Handle view progress
  const handleViewProgress = async (classId, className) => {
    try {
      setIsProgressModalOpen(true);
      setProgressLoading(true);
      setSelectedClassProgress({
        className,
        classData: null,
        enrollmentCount: 0,
        assignmentCount: 0,
        submissionCount: 0,
      });

      const progressData = await fetchClassProgress(classId);

      const enrollmentCount =
        progressData.classData?.enrolledStudents?.length || 0;
      const assignmentCount = progressData.assignments.length;
      const submissionCount = progressData.submissions.length;

      setSelectedClassProgress({
        className,
        classData: progressData.classData,
        enrollmentCount,
        assignmentCount,
        submissionCount,
      });
    } catch (error) {
      console.error("Error fetching progress data:", error);
      toast.error("Failed to load progress data");
      setIsProgressModalOpen(false);
    } finally {
      setProgressLoading(false);
    }
  };

  // Close progress modal
  const closeProgressModal = () => {
    setIsProgressModalOpen(false);
    setSelectedClassProgress(null);
    setProgressLoading(false);
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

  // Format date helper
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
    <>
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
              onClick={() => fetchClasses(currentPage, pageSize)}
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
            <span>Total Classes: {totalClasses}</span>
            <span>
              Showing {totalClasses > 0 ? (currentPage - 1) * pageSize + 1 : 0}{" "}
              to {Math.min(currentPage * pageSize, totalClasses)} of{" "}
              {totalClasses} classes
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

        {/* Pagination */}
        <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Left Side: Pagination Info and Page Size Selector */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Pagination Info */}
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Showing{" "}
                {totalClasses > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{" "}
                {Math.min(currentPage * pageSize, totalClasses)} of{" "}
                {totalClasses} classes
              </div>

              {/* Page Size Selector */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Show:
                </span>
                <select
                  value={pageSize}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                  className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5D5CDE] focus:border-transparent transition-all duration-200"
                >
                  <option value={5}>5 per page</option>
                  <option value={10}>10 per page</option>
                  <option value={15}>15 per page</option>
                  <option value={20}>20 per page</option>
                </select>
              </div>
            </div>

            {/* Right Side: Pagination Controls */}
            {totalPages > 1 ? (
              <div className="flex items-center space-x-2">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <FiChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </button>

                {/* Page Numbers */}
                <div className="flex items-center space-x-1">
                  {getPageNumbers().map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        currentPage === pageNum
                          ? "bg-[#5D5CDE] text-white"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Next
                  <FiChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            ) : (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {totalClasses <= pageSize
                  ? "All classes displayed"
                  : "Page 1 of 1"}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress Modal */}
      {isProgressModalOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                  <FiActivity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Class Progress
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedClassProgress?.className || "Loading..."}
                  </p>
                </div>
              </div>
              <button
                onClick={closeProgressModal}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {progressLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  <span className="ml-3 text-gray-600 dark:text-gray-300">
                    Loading progress data...
                  </span>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Progress Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Total Enrollment Card */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-xl">
                          <FiUsers className="w-6 h-6 text-white" />
                        </div>
                        <div className="ml-4">
                          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                            {selectedClassProgress?.enrollmentCount || 0}
                          </p>
                          <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                            Total Enrollment
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Total Assignments Card */}
                    <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-12 h-12 bg-green-500 rounded-xl">
                          <FiBook className="w-6 h-6 text-white" />
                        </div>
                        <div className="ml-4">
                          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                            {selectedClassProgress?.assignmentCount || 0}
                          </p>
                          <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                            Total Assignments
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Total Submissions Card */}
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-12 h-12 bg-purple-500 rounded-xl">
                          <FiFileText className="w-6 h-6 text-white" />
                        </div>
                        <div className="ml-4">
                          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                            {selectedClassProgress?.submissionCount || 0}
                          </p>
                          <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                            Assignment Submissions
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Progress Info */}
                  {selectedClassProgress?.classData && (
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Progress Overview
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-gray-400">
                            Class Status:
                          </span>
                          <span>
                            {getStatusBadge(
                              selectedClassProgress.classData.status
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-gray-400">
                            Teacher:
                          </span>
                          <span className="text-gray-900 dark:text-white font-medium">
                            {selectedClassProgress.classData.teacherName}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-gray-400">
                            Created:
                          </span>
                          <span className="text-gray-900 dark:text-white">
                            {formatDate(
                              selectedClassProgress.classData.createdAt
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-gray-400">
                            Price:
                          </span>
                          <span className="text-gray-900 dark:text-white font-medium">
                            ${selectedClassProgress.classData.price}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
