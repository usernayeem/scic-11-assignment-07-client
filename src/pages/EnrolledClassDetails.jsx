import React, { useState, useEffect, useContext } from "react";
import {
  FiBook,
  FiUser,
  FiMail,
  FiDollarSign,
  FiCalendar,
  FiFileText,
  FiSend,
  FiArrowLeft,
  FiUpload,
  FiX,
  FiStar,
  FiCheckCircle,
  FiClock,
  FiTarget,
} from "react-icons/fi";
import { MdVerified, MdOutlineSchool, MdRateReview } from "react-icons/md";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { useForm } from "react-hook-form";
import axios from "axios";

export const EnrolledClassDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const toast = useToast();
  const navigate = useNavigate();

  const [classData, setClassData] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submissionLoading, setSubmissionLoading] = useState({});
  const [isTerModalOpen, setIsTerModalOpen] = useState(false);
  const [terSubmitting, setTerSubmitting] = useState(false);
  const [rating, setRating] = useState(0);

  // Submission text state for each assignment
  const [submissionTexts, setSubmissionTexts] = useState({});
  const [submissionErrors, setSubmissionErrors] = useState({});

  // React Hook Form for TER
  const {
    register: registerTer,
    handleSubmit: handleTerSubmit,
    formState: { errors: terErrors },
    reset: resetTer,
  } = useForm({
    defaultValues: {
      description: "",
    },
  });

  // Fetch class details
  const fetchClassDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API}/classes/${id}`
      );

      if (response.data.success) {
        const classInfo = response.data.class;

        // Check if user is enrolled
        if (!classInfo.enrolledStudents?.includes(user?.uid)) {
          toast.error("You are not enrolled in this class");
          navigate("/student-dashboard/my-enroll-classes");
          return;
        }

        setClassData(classInfo);
      } else {
        toast.error("Class not found");
        navigate("/student-dashboard/my-enroll-classes");
      }
    } catch (error) {
      toast.error("Failed to load class details");
      navigate("/student-dashboard/my-enroll-classes");
    } finally {
      setLoading(false);
    }
  };

  // Fetch assignments for this class
  const fetchAssignments = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API}/assignments/class/${id}`
      );
      if (response.data.success) {
        setAssignments(response.data.assignments);
      }
    } catch (error) {
      toast.error("Error fetching assignments:");
    }
  };

  // Fetch submissions for this student and class
  const fetchSubmissions = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API}/submissions/student/${
          user?.uid
        }/class/${id}`
      );
      if (response.data.success) {
        setSubmissions(response.data.submissions);
      }
    } catch (error) {
      toast.error("Error fetching submissions:");
    }
  };

  // Handle submission text change
  const handleSubmissionTextChange = (assignmentId, value) => {
    setSubmissionTexts((prev) => ({
      ...prev,
      [assignmentId]: value,
    }));

    // Clear error when user starts typing
    if (submissionErrors[assignmentId]) {
      setSubmissionErrors((prev) => ({
        ...prev,
        [assignmentId]: null,
      }));
    }
  };

  // Handle assignment submission
  const handleAssignmentSubmission = async (assignmentId) => {
    const submissionText = submissionTexts[assignmentId]?.trim();

    if (!submissionText) {
      setSubmissionErrors((prev) => ({
        ...prev,
        [assignmentId]: "Submission text is required",
      }));
      return;
    }

    setSubmissionLoading((prev) => ({ ...prev, [assignmentId]: true }));

    try {
      const submissionData = {
        assignmentId,
        classId: id,
        studentUid: user?.uid,
        studentName: user?.displayName || "",
        studentEmail: user?.email || "",
        submissionText: submissionText,
        submittedAt: new Date(),
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API}/submissions`,
        submissionData
      );

      if (response.data.success) {
        toast.success("Assignment submitted successfully!");

        // Clear the submission text for this assignment
        setSubmissionTexts((prev) => ({
          ...prev,
          [assignmentId]: "",
        }));

        // Refresh submissions
        fetchSubmissions();
      } else {
        toast.error("Failed to submit assignment");
      }
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error("You have already submitted this assignment");
      } else {
        toast.error("Failed to submit assignment. Please try again.");
      }
    } finally {
      setSubmissionLoading((prev) => ({ ...prev, [assignmentId]: false }));
    }
  };

  // Handle TER submission
  const onTerSubmit = async (data) => {
    if (rating === 0) {
      toast.error("Please provide a rating");
      return;
    }

    setTerSubmitting(true);
    try {
      const terData = {
        classId: id,
        teacherUid: classData?.teacherUid,
        studentUid: user?.uid,
        studentName: user?.displayName || "",
        studentEmail: user?.email || "",
        rating: rating,
        description: data.description,
        submittedAt: new Date(),
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API}/teaching-evaluations`,
        terData
      );

      if (response.data.success) {
        toast.success("Teaching evaluation submitted successfully!");
        setIsTerModalOpen(false);
        resetTer();
        setRating(0);
      } else {
        toast.error("Failed to submit evaluation");
      }
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error("You have already submitted an evaluation for this class");
      } else {
        toast.error("Failed to submit evaluation. Please try again.");
      }
    } finally {
      setTerSubmitting(false);
    }
  };

  // Check if assignment is already submitted
  const isAssignmentSubmitted = (assignmentId) => {
    return submissions.some((sub) => sub.assignmentId === assignmentId);
  };

  // Format date helper
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Check if deadline has passed
  const isDeadlinePassed = (deadline) => {
    return new Date(deadline) < new Date();
  };

  // Star Rating Component
  const StarRating = ({ rating, setRating, readonly = false }) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => !readonly && setRating(star)}
            disabled={readonly}
            className={`text-2xl transition-colors duration-200 ${
              star <= rating
                ? "text-yellow-400"
                : "text-gray-300 dark:text-gray-600"
            } ${!readonly ? "hover:text-yellow-300" : ""}`}
          >
            <FiStar fill={star <= rating ? "currentColor" : "none"} />
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
          {rating > 0 ? `${rating}/5` : "No rating"}
        </span>
      </div>
    );
  };

  useEffect(() => {
    if (id && user?.uid) {
      fetchClassDetails();
      fetchAssignments();
      fetchSubmissions();
    }
  }, [id, user]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-8">
          <div className="flex items-center justify-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5D5CDE]"></div>
            <span className="text-gray-600 dark:text-gray-300">
              Loading class details...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="p-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Class not found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            The class you're looking for doesn't exist or you're not enrolled.
          </p>
          <button
            onClick={() => navigate("/student-dashboard/my-enroll-classes")}
            className="bg-[#5D5CDE] hover:bg-[#4A4BC9] text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
          >
            Back to My Classes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Back Button and TER Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/student-dashboard/my-enroll-classes")}
          className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-[#5D5CDE] dark:hover:text-[#5D5CDE] transition-colors duration-200"
        >
          <FiArrowLeft className="w-5 h-5 mr-2" />
          Back to My Classes
        </button>

        <button
          onClick={() => setIsTerModalOpen(true)}
          className="bg-gradient-to-r from-[#5D5CDE] to-[#4A4BC9] text-white px-6 py-3 rounded-xl font-semibold hover:from-[#4A4BC9] hover:to-[#3A3AB9] transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
        >
          <MdRateReview className="w-5 h-5" />
          <span>Teaching Evaluation Report</span>
        </button>
      </div>

      {/* Class Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="relative h-48">
          <img
            src={classData.image}
            alt={classData.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "https://i.ibb.co/GQzR5BLS/image-not-found.webp";
            }}
          />
          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              <MdVerified className="w-4 h-4 mr-1" />
              Enrolled
            </span>
          </div>
        </div>

        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {classData.title}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <FiUser className="w-4 h-4 mr-2" />
              <span>Instructor: {classData.teacherName}</span>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <FiMail className="w-4 h-4 mr-2" />
              <span>{classData.teacherEmail}</span>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <FiDollarSign className="w-4 h-4 mr-2" />
              <span>Price: ${classData.price}</span>
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {classData.description}
          </p>
        </div>
      </div>

      {/* Class Progress */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <FiTarget className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {assignments.length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Assignments
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <FiCheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {submissions.length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Completed
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
              <FiClock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="ml-4">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {assignments.length - submissions.length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Pending
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Assignments Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Class Assignments
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            Complete your assignments and track your progress
          </p>
        </div>

        <div className="overflow-x-auto">
          {assignments.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-2xl mx-auto mb-4">
                <FiBook className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No assignments yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Your instructor hasn't created any assignments yet. Check back
                later!
              </p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Deadline
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Submission
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {assignments.map((assignment) => {
                  const isSubmitted = isAssignmentSubmitted(assignment._id);
                  const isPastDeadline = isDeadlinePassed(assignment.deadline);
                  const canSubmit = !isSubmitted && !isPastDeadline;

                  return (
                    <tr
                      key={assignment._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {assignment.title}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 dark:text-gray-300 max-w-xs">
                          {assignment.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {formatDate(assignment.deadline)}
                        </div>
                        {isPastDeadline && !isSubmitted && (
                          <div className="text-xs text-red-600 dark:text-red-400">
                            Past deadline
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isSubmitted ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            <FiCheckCircle className="w-3 h-3 mr-1" />
                            Submitted
                          </span>
                        ) : isPastDeadline ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                            <FiX className="w-3 h-3 mr-1" />
                            Missed
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                            <FiClock className="w-3 h-3 mr-1" />
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {canSubmit ? (
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <textarea
                                value={submissionTexts[assignment._id] || ""}
                                onChange={(e) =>
                                  handleSubmissionTextChange(
                                    assignment._id,
                                    e.target.value
                                  )
                                }
                                rows={2}
                                className="block w-40 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5D5CDE] focus:border-transparent transition-all duration-200 resize-none"
                                placeholder="Your submission..."
                              />
                              <button
                                onClick={() =>
                                  handleAssignmentSubmission(assignment._id)
                                }
                                disabled={submissionLoading[assignment._id]}
                                className="inline-flex items-center px-3 py-2 border border-transparent text-xs font-medium rounded-md text-white bg-[#5D5CDE] hover:bg-[#4A4BC9] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5D5CDE] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                              >
                                {submissionLoading[assignment._id] ? (
                                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                                ) : (
                                  <FiSend className="w-3 h-3 mr-1" />
                                )}
                                Submit
                              </button>
                            </div>
                            {submissionErrors[assignment._id] && (
                              <p className="text-xs text-red-600 dark:text-red-400">
                                {submissionErrors[assignment._id]}
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400 dark:text-gray-500 text-xs">
                            {isSubmitted
                              ? "Already submitted"
                              : "Cannot submit"}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* TER Modal */}
      {isTerModalOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-[#5D5CDE] bg-opacity-10 rounded-xl">
                  <MdRateReview className="w-5 h-5 text-[#5D5CDE]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Teaching Evaluation Report
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Share your feedback about this class
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsTerModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <form
              onSubmit={handleTerSubmit(onTerSubmit)}
              className="p-6 space-y-6"
            >
              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Overall Rating *
                </label>
                <StarRating rating={rating} setRating={setRating} />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Feedback Description *
                </label>
                <textarea
                  rows={6}
                  {...registerTer("description", {
                    required: "Description is required",
                    minLength: {
                      value: 10,
                      message: "Description must be at least 10 characters",
                    },
                  })}
                  className={`block w-full px-3 py-3 text-base border rounded-xl placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5D5CDE] focus:border-transparent transition-all duration-200 resize-none ${
                    terErrors.description
                      ? "border-red-500 ring-2 ring-red-200 dark:ring-red-800"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  placeholder="Share your thoughts about the teaching quality, course content, instructor's communication, and overall experience..."
                />
                {terErrors.description && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {terErrors.description.message}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setIsTerModalOpen(false)}
                  className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-6 py-3 rounded-xl font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <FiX className="w-5 h-5" />
                  <span>Cancel</span>
                </button>
                <button
                  type="submit"
                  disabled={terSubmitting}
                  className="flex-1 bg-[#5D5CDE] hover:bg-[#4A4BC9] text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {terSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <FiSend className="w-5 h-5" />
                      <span>Send Evaluation</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
