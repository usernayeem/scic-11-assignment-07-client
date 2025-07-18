import React, { useState, useEffect, useContext } from "react";
import {
  FiUsers,
  FiBook,
  FiFileText,
  FiPlus,
  FiX,
  FiCalendar,
  FiSave,
  FiArrowLeft,
  FiCheckCircle,
  FiClock,
  FiUser,
  FiMail,
  FiDollarSign,
} from "react-icons/fi";
import { MdVerified, MdOutlineSchool } from "react-icons/md";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { useForm } from "react-hook-form";
import axios from "axios";

export const ClassDetailsTeacher = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const toast = useToast();
  const navigate = useNavigate();

  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreatingAssignment, setIsCreatingAssignment] = useState(false);

  // React Hook Form for assignment creation
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      title: "",
      deadline: "",
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
        setClassData(response.data.class);
      } else {
        toast.error("Class not found");
        navigate("/teacher-dashboard/my-classes");
      }
    } catch (error) {
      console.error("Error fetching class details:", error);
      toast.error("Failed to load class details");
      navigate("/teacher-dashboard/my-classes");
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
      console.error("Error fetching assignments:", error);
    }
  };

  // Fetch submissions for this class
  const fetchSubmissions = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API}/submissions/class/${id}`
      );
      if (response.data.success) {
        setSubmissions(response.data.submissions);
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
    }
  };

  // Handle assignment creation
  const onSubmitAssignment = async (data) => {
    setIsCreatingAssignment(true);
    try {
      const assignmentData = {
        classId: id,
        teacherUid: user?.uid,
        title: data.title,
        deadline: data.deadline,
        description: data.description,
        createdAt: new Date(),
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API}/assignments`,
        assignmentData
      );

      if (response.data.success) {
        toast.success("Assignment created successfully!");
        setIsCreateModalOpen(false);
        reset();
        fetchAssignments(); // Refresh assignments
      } else {
        toast.error("Failed to create assignment");
      }
    } catch (error) {
      console.error("Error creating assignment:", error);
      toast.error("Failed to create assignment. Please try again.");
    } finally {
      setIsCreatingAssignment(false);
    }
  };

  // Close modal
  const closeModal = () => {
    setIsCreateModalOpen(false);
    reset();
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
    if (id) {
      fetchClassDetails();
      fetchAssignments();
      fetchSubmissions();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-8">
        <div className="flex items-center justify-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5D5CDE]"></div>
          <span className="text-gray-600 dark:text-gray-300">
            Loading class details...
          </span>
        </div>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-8 text-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Class not found
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          The class you're looking for doesn't exist or has been removed.
        </p>
        <button
          onClick={() => navigate("/teacher-dashboard/my-classes")}
          className="bg-[#5D5CDE] hover:bg-[#4A4BC9] text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
        >
          Back to My Classes
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <div>
        <button
          onClick={() => navigate("/teacher-dashboard/my-classes")}
          className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-[#5D5CDE] dark:hover:text-[#5D5CDE] transition-colors duration-200"
        >
          <FiArrowLeft className="w-5 h-5 mr-2" />
          Back to My Classes
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
              {classData.status}
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
              <span>{classData.teacherName}</span>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <FiMail className="w-4 h-4 mr-2" />
              <span>{classData.teacherEmail}</span>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <FiDollarSign className="w-4 h-4 mr-2" />
              <span>${classData.price}</span>
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {classData.description}
          </p>

          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Created on {formatDate(classData.createdAt)}
          </div>
        </div>
      </div>

      {/* Class Progress Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Class Progress
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Enrollment Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <FiUsers className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {classData.enrolledStudents?.length || 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Enrollment
                </p>
              </div>
            </div>
          </div>

          {/* Total Assignment Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl">
                <FiBook className="w-6 h-6 text-green-600 dark:text-green-400" />
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

          {/* Total Assignment Submissions Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                <FiFileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {submissions.length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Assignment Submissions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Class Assignment Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Class Assignments
          </h3>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-[#5D5CDE] hover:bg-[#4A4BC9] text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
          >
            <FiPlus className="w-4 h-4" />
            <span>Create</span>
          </button>
        </div>

        {/* Assignments List */}
        {assignments.length === 0 ? (
          <div className="text-center py-8">
            <div className="flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-2xl mx-auto mb-4">
              <FiBook className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No assignments created yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Create your first assignment to get started.
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-[#5D5CDE] hover:bg-[#4A4BC9] text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Create Assignment
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {assignments.map((assignment, index) => (
              <div
                key={assignment._id || index}
                className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {assignment.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 mb-3">
                      {assignment.description}
                    </p>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <FiCalendar className="w-4 h-4 mr-1" />
                      <span>
                        Due: {formatDate(assignment.deadline)}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Created: {formatDate(assignment.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Assignment Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-[#5D5CDE] bg-opacity-10 rounded-xl">
                  <FiPlus className="w-5 h-5 text-[#5D5CDE]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Create Assignment
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Add a new assignment for your students
                  </p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <form
              onSubmit={handleSubmit(onSubmitAssignment)}
              className="p-6 space-y-6"
            >
              {/* Assignment Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Assignment Title *
                </label>
                <input
                  type="text"
                  {...register("title", {
                    required: "Assignment title is required",
                  })}
                  className={`block w-full px-3 py-3 text-base border rounded-xl placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5D5CDE] focus:border-transparent transition-all duration-200 ${
                    errors.title
                      ? "border-red-500 ring-2 ring-red-200 dark:ring-red-800"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  placeholder="Enter assignment title"
                />
                {errors.title && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Assignment Deadline */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Assignment Deadline *
                </label>
                <input
                  type="datetime-local"
                  {...register("deadline", {
                    required: "Assignment deadline is required",
                  })}
                  className={`block w-full px-3 py-3 text-base border rounded-xl placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5D5CDE] focus:border-transparent transition-all duration-200 ${
                    errors.deadline
                      ? "border-red-500 ring-2 ring-red-200 dark:ring-red-800"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                />
                {errors.deadline && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {errors.deadline.message}
                  </p>
                )}
              </div>

              {/* Assignment Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Assignment Description *
                </label>
                <textarea
                  rows={6}
                  {...register("description", {
                    required: "Assignment description is required",
                  })}
                  className={`block w-full px-3 py-3 text-base border rounded-xl placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5D5CDE] focus:border-transparent transition-all duration-200 resize-none ${
                    errors.description
                      ? "border-red-500 ring-2 ring-red-200 dark:ring-red-800"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  placeholder="Describe the assignment requirements and instructions..."
                />
                {errors.description && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-6 py-3 rounded-xl font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <FiX className="w-5 h-5" />
                  <span>Cancel</span>
                </button>
                <button
                  type="submit"
                  disabled={isCreatingAssignment}
                  className="flex-1 bg-[#5D5CDE] hover:bg-[#4A4BC9] text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isCreatingAssignment ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <FiSave className="w-5 h-5" />
                      <span>Add Assignment</span>
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