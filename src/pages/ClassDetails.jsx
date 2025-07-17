import React, { useState, useEffect, useContext } from "react";
import {
  FiUser,
  FiMail,
  FiDollarSign,
  FiUsers,
  FiClock,
  FiArrowLeft,
  FiCreditCard,
  FiStar,
  FiCalendar,
  FiBookOpen,
  FiAward,
} from "react-icons/fi";
import { MdVerified, MdOutlineSchool } from "react-icons/md";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import axios from "axios";

export const ClassDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const toast = useToast();
  const navigate = useNavigate();

  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);

  // Fetch class details
  const fetchClassDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API}/classes/${id}`
      );

      if (response.data.success) {
        const classInfo = response.data.class;
        setClassData(classInfo);
        
        // Check if user is already enrolled
        if (classInfo.enrolledStudents && user?.uid) {
          setIsAlreadyEnrolled(
            classInfo.enrolledStudents.includes(user.uid)
          );
        }
      } else {
        toast.error("Class not found");
        navigate("/all-classes");
      }
    } catch (error) {
      console.error("Error fetching class details:", error);
      toast.error("Failed to load class details");
      navigate("/all-classes");
    } finally {
      setLoading(false);
    }
  };

  // Handle enrollment/payment
  const handleEnrollment = () => {
    

    if (isAlreadyEnrolled) {
      toast.info("You are already enrolled in this class");
      return;
    }

    // Navigate to payment page with class information
    navigate(`/payment/${id}`, {
      state: {
        classData: classData,
        amount: classData.price,
        type: "class_enrollment",
      },
    });
  };

  // Format date helper
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Truncate text helper
  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  useEffect(() => {
    if (id) {
      fetchClassDetails();
    }
  }, [id, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-8">
            <div className="flex items-center justify-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5D5CDE]"></div>
              <span className="text-gray-600 dark:text-gray-300">
                Loading class details...
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-8 text-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Class not found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              The class you're looking for doesn't exist or has been removed.
            </p>
            <Link
              to="/all-classes"
              className="bg-[#5D5CDE] hover:bg-[#4A4BC9] text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Browse All Classes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-[#5D5CDE] dark:hover:text-[#5D5CDE] transition-colors duration-200"
          >
            <FiArrowLeft className="w-5 h-5 mr-2" />
            Back to Classes
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Class Header */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
              {/* Class Image */}
              <div className="relative h-64 md:h-80">
                <img
                  src={classData.image}
                  alt={classData.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://i.ibb.co/GQzR5BLS/image-not-found.webp";
                  }}
                />
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    <MdVerified className="w-4 h-4 mr-1" />
                    Approved
                  </span>
                </div>
              </div>

              {/* Class Info */}
              <div className="p-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {classData.title}
                </h1>

                {/* Teacher Info */}
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-[#5D5CDE] bg-opacity-10 rounded-xl">
                    <FiUser className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {classData.teacherName}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 flex items-center">
                      <FiMail className="w-4 h-4 mr-2" />
                      {classData.teacherEmail}
                    </p>
                  </div>
                </div>

                {/* Class Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <div className="flex items-center text-gray-600 dark:text-gray-400 mb-1">
                      <FiUsers className="w-4 h-4 mr-2" />
                      <span className="text-sm">Enrolled</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {classData.enrolledStudents?.length || 0}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <div className="flex items-center text-gray-600 dark:text-gray-400 mb-1">
                      <FiCalendar className="w-4 h-4 mr-2" />
                      <span className="text-sm">Created</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatDate(classData.createdAt)}
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 col-span-2 md:col-span-1">
                    <div className="flex items-center text-gray-600 dark:text-gray-400 mb-1">
                      <FiStar className="w-4 h-4 mr-2" />
                      <span className="text-sm">Rating</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      5.0
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <FiBookOpen className="w-5 h-5 mr-2 text-[#5D5CDE]" />
                    About This Class
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {classData.description}
                  </p>
                </div>
              </div>
            </div>

            {/* What You'll Learn Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <FiAward className="w-5 h-5 mr-2 text-[#5D5CDE]" />
                What You'll Learn
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Master the fundamentals and advanced concepts",
                  "Build real-world projects from scratch",
                  "Get personalized feedback from expert instructor",
                  "Access to exclusive learning resources",
                  "Certificate of completion",
                  "Lifetime access to course materials",
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mt-0.5">
                      <svg
                        className="w-4 h-4 text-green-600 dark:text-green-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Enrollment Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 sticky top-6">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center w-16 h-16 bg-[#5D5CDE] bg-opacity-10 rounded-2xl mx-auto mb-4">
                  <MdOutlineSchool className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Enroll Now
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Start your learning journey today
                </p>
              </div>

              {/* Price */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <FiDollarSign className="w-8 h-8 text-[#5D5CDE]" />
                  <span className="text-4xl font-bold text-[#5D5CDE]">
                    {classData.price}
                  </span>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  One-time payment • Lifetime access
                </p>
              </div>

              {/* Enrollment Status */}
              {isAlreadyEnrolled && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
                  <div className="flex items-center text-green-700 dark:text-green-400">
                    <MdVerified className="w-5 h-5 mr-2" />
                    <span className="font-medium">Already Enrolled</span>
                  </div>
                  <p className="text-green-600 dark:text-green-500 text-sm mt-1">
                    You have access to this class
                  </p>
                </div>
              )}

              {/* Enroll Button */}
              <button
                onClick={handleEnrollment}
                disabled={enrolling || isAlreadyEnrolled}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl ${
                  isAlreadyEnrolled
                    ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#5D5CDE] to-[#4A4BC9] text-white hover:from-[#4A4BC9] hover:to-[#3A3AB9] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5D5CDE]"
                } disabled:opacity-70 disabled:cursor-not-allowed`}
              >
                {enrolling ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </>
                ) : isAlreadyEnrolled ? (
                  <>
                    <MdVerified className="w-5 h-5" />
                    <span>Enrolled</span>
                  </>
                ) : (
                  <>
                    <FiCreditCard className="w-5 h-5" />
                    <span>Pay & Enroll</span>
                  </>
                )}
              </button>

              {!isAlreadyEnrolled && (
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
                  Secure payment • 30-day money back guarantee
                </p>
              )}

              {/* Course Includes */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                  This class includes:
                </h4>
                <div className="space-y-2">
                  {[
                    { icon: FiClock, text: "Lifetime access" },
                    { icon: FiBookOpen, text: "Course materials" },
                    { icon: FiAward, text: "Certificate of completion" },
                    { icon: FiUsers, text: "Community access" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <item.icon className="w-4 h-4 text-[#5D5CDE]" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Instructor Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                Your Instructor
              </h4>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-[#5D5CDE] bg-opacity-10 rounded-full flex items-center justify-center">
                  <FiUser className="w-6 h-6 text-[#5D5CDE]" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {classData.teacherName}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Expert Instructor
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Experienced educator with expertise in this field, dedicated to
                helping students achieve their learning goals.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};