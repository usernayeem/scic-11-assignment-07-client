import React, { useState, useEffect, useContext } from "react";
import {
  FiUser,
  FiArrowRight,
  FiBook,
  FiRefreshCw,
  FiClock,
  FiAward,
} from "react-icons/fi";
import { MdOutlineSchool, MdVerified } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import axios from "axios";

export const MyEnrolledClasses = () => {
  const { user } = useContext(AuthContext);
  const toast = useToast();
  const navigate = useNavigate();

  const [enrolledClasses, setEnrolledClasses] = useState([]);
  const [classProgress, setClassProgress] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch enrolled classes
  const fetchEnrolledClasses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API}/students/${user.uid}/enrolled-classes`
      );

      if (response.data.success) {
        const classes = response.data.classes;
        setEnrolledClasses(classes);

        // Fetch progress for each class
        await fetchProgressForClasses(classes);
      } else {
        toast.error("Failed to fetch enrolled classes");
      }
    } catch (error) {
      console.error("Error fetching enrolled classes:", error);
      toast.error("Failed to load enrolled classes");
    } finally {
      setLoading(false);
    }
  };

  // Fetch progress data for all classes
  const fetchProgressForClasses = async (classes) => {
    const progressData = {};

    try {
      // Fetch progress for each class in parallel
      const progressPromises = classes.map(async (classItem) => {
        const classId = classItem._id;

        try {
          // Fetch assignments and submissions for this class
          const [assignmentsResponse, submissionsResponse] = await Promise.all([
            axios.get(
              `${import.meta.env.VITE_API}/assignments/class/${classId}`
            ),
            axios.get(
              `${import.meta.env.VITE_API}/submissions/student/${
                user.uid
              }/class/${classId}`
            ),
          ]);

          const assignments = assignmentsResponse.data.success
            ? assignmentsResponse.data.assignments
            : [];
          const submissions = submissionsResponse.data.success
            ? submissionsResponse.data.submissions
            : [];

          // Calculate progress
          const totalAssignments = assignments.length;
          const completedAssignments = submissions.length;
          const progressPercentage =
            totalAssignments > 0
              ? Math.round((completedAssignments / totalAssignments) * 100)
              : 0;
          const isCompleted =
            totalAssignments > 0 && completedAssignments === totalAssignments;

          progressData[classId] = {
            totalAssignments,
            completedAssignments,
            progressPercentage,
            isCompleted,
            hasAssignments: totalAssignments > 0,
          };
        } catch (error) {
          console.error(`Error fetching progress for class ${classId}:`, error);
          // Set default progress data on error
          progressData[classId] = {
            totalAssignments: 0,
            completedAssignments: 0,
            progressPercentage: 0,
            isCompleted: false,
            hasAssignments: false,
          };
        }
      });

      await Promise.all(progressPromises);
      setClassProgress(progressData);
    } catch (error) {
      console.error("Error fetching class progress:", error);
    }
  };

  // Calculate overall stats
  const calculateOverallStats = () => {
    const totalClasses = enrolledClasses.length;
    const completedClasses = Object.values(classProgress).filter(
      (progress) => progress.isCompleted
    ).length;
    const inProgressClasses = Object.values(classProgress).filter(
      (progress) =>
        progress.hasAssignments &&
        !progress.isCompleted &&
        progress.completedAssignments > 0
    ).length;
    const notStartedClasses = Object.values(classProgress).filter(
      (progress) =>
        progress.hasAssignments && progress.completedAssignments === 0
    ).length;

    return {
      totalClasses,
      completedClasses,
      inProgressClasses,
      notStartedClasses,
    };
  };

  // Get progress status for a class
  const getProgressStatus = (classId) => {
    const progress = classProgress[classId];
    if (!progress)
      return { status: "loading", text: "Loading...", color: "gray" };

    if (!progress.hasAssignments) {
      return {
        status: "no-assignments",
        text: "No assignments",
        color: "blue",
      };
    }

    if (progress.isCompleted) {
      return { status: "completed", text: "Completed", color: "green" };
    }

    if (progress.completedAssignments > 0) {
      return { status: "in-progress", text: "In Progress", color: "yellow" };
    }

    return { status: "not-started", text: "Not Started", color: "gray" };
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
      month: "short",
      day: "numeric",
    });
  };

  useEffect(() => {
    if (user?.uid) {
      fetchEnrolledClasses();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-8">
          <div className="flex items-center justify-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5D5CDE]"></div>
            <span className="text-gray-600 dark:text-gray-300">
              Loading your enrolled classes...
            </span>
          </div>
        </div>
      </div>
    );
  }

  const stats = calculateOverallStats();

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              My Enrolled Classes
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Continue your learning journey with your enrolled courses
            </p>
          </div>
          <button
            onClick={fetchEnrolledClasses}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            <FiRefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>

        {/* Dynamic Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 bg-[#5D5CDE] bg-opacity-10 rounded-lg">
                <FiBook className="w-5 h-5 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalClasses}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Enrolled
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <FiClock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.inProgressClasses}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  In Progress
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <FiAward className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.completedClasses}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Completed
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Classes Grid */}
      {enrolledClasses.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-12 text-center">
          <div className="flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-2xl mx-auto mb-6">
            <MdOutlineSchool className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Enrolled Classes
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            You haven't enrolled in any classes yet. Start exploring our courses
            to begin your learning journey.
          </p>
          <Link
            to="/all-classes"
            className="inline-flex items-center bg-[#5D5CDE] hover:bg-[#4A4BC9] text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            <FiBook className="w-5 h-5 mr-2" />
            Browse Classes
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {enrolledClasses.map((classItem) => {
            const progress = classProgress[classItem._id] || {
              progressPercentage: 0,
              completedAssignments: 0,
              totalAssignments: 0,
            };
            const progressStatus = getProgressStatus(classItem._id);

            return (
              <div
                key={classItem._id}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden group"
              >
                {/* Class Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={classItem.image}
                    alt={classItem.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src =
                        "https://i.ibb.co/GQzR5BLS/image-not-found.webp";
                    }}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      <MdVerified className="w-3 h-3 mr-1" />
                      Enrolled
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        progressStatus.color === "green"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : progressStatus.color === "yellow"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          : progressStatus.color === "blue"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                      }`}
                    >
                      {progressStatus.text}
                    </span>
                  </div>
                </div>

                {/* Class Content */}
                <div className="p-6">
                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-[#5D5CDE] transition-colors duration-200">
                    {truncateText(classItem.title, 50)}
                  </h3>

                  {/* Instructor */}
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <FiUser className="w-4 h-4 mr-2" />
                    <span>By {classItem.teacherName}</span>
                  </div>

                  {/* Enrollment Date */}
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-4">
                    <FiClock className="w-4 h-4 mr-2" />
                    <span>Enrolled on {formatDate(classItem.updatedAt)}</span>
                  </div>

                  {/* Progress Section */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <span>Progress</span>
                      <span>{progress.progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          progress.progressPercentage === 100
                            ? "bg-green-500"
                            : progress.progressPercentage > 0
                            ? "bg-[#5D5CDE]"
                            : "bg-gray-300 dark:bg-gray-600"
                        }`}
                        style={{ width: `${progress.progressPercentage}%` }}
                      ></div>
                    </div>
                    {progress.totalAssignments > 0 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {progress.completedAssignments} of{" "}
                        {progress.totalAssignments} assignments completed
                      </div>
                    )}
                  </div>

                  {/* Continue Button */}
                  <Link
                    to={`/student-dashboard/my-enroll-class/${classItem._id}`}
                    className="w-full bg-gradient-to-r from-[#5D5CDE] to-[#4A4BC9] text-white py-3 px-4 rounded-xl font-semibold text-base hover:from-[#4A4BC9] hover:to-[#3A3AB9] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5D5CDE] transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl group"
                  >
                    <span>
                      {progress.isCompleted
                        ? "Review Class"
                        : "Continue Learning"}
                    </span>
                    <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
