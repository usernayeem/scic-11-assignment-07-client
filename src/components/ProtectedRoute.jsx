import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { Navigate, useLocation } from "react-router-dom";
import axios from "axios";

export const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, loading } = useContext(AuthContext);
  const [userRole, setUserRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);
  const toast = useToast();
  const location = useLocation();

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user || !user.uid) {
        setRoleLoading(false);
        return;
      }

      if (!requiredRole) {
        setRoleLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API}/users/${user.uid}`
        );
        if (response.data.success) {
          setUserRole(response.data.user.role);
        } else {
          toast.error("Unable to verify user permissions");
        }
      } catch (error) {
        toast.error("Failed to verify user permissions");
      } finally {
        setRoleLoading(false);
      }
    };

    if (!loading) {
      fetchUserRole();
    }
  }, [user, requiredRole, toast, loading]);

  if (loading || (user && roleLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-8">
          <div className="flex items-center justify-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5D5CDE]"></div>
            <span className="text-gray-600 dark:text-gray-300">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!user || !user.email) {
    return <Navigate state={location?.pathname} to="/login" />;
  }

  if (requiredRole && userRole !== requiredRole) {
    const getRoleDisplayName = (role) => {
      switch (role) {
        case "admin":
          return "Administrator";
        case "teacher":
          return "Teacher";
        case "student":
          return "Student";
        default:
          return "User";
      }
    };

    const getAccessMessage = () => {
      const requiredRoleDisplay = getRoleDisplayName(requiredRole);
      const currentRoleDisplay = getRoleDisplayName(userRole);

      return {
        title: `${requiredRoleDisplay} Access Required`,
        message: `This page link is only accessible to ${requiredRoleDisplay.toLowerCase()}s. You are currently logged in as a ${currentRoleDisplay.toLowerCase()}.`,
        suggestion: getAccessSuggestion(),
      };
    };

    const getAccessSuggestion = () => {
      if (requiredRole === "teacher" && userRole === "student") {
        return "If you want to become a teacher, you can apply through the 'Teach on EduManage' page.";
      }
      if (requiredRole === "admin") {
        return "Administrator access is restricted. Contact support if you believe this is an error.";
      }
      if (requiredRole === "student" && userRole === "teacher") {
        return "This is a student-only area. You can access teacher features through the Teacher Dashboard.";
      }
      return "Please use the appropriate dashboard for your account type.";
    };

    const getUserDashboardInfo = () => {
      switch (userRole) {
        case "admin":
          return {
            url: "/admin-dashboard/overview",
            label: "Go to Admin Dashboard",
          };
        case "teacher":
          return {
            url: "/teacher-dashboard/overview",
            label: "Go to Teacher Dashboard",
          };
        case "student":
          return {
            url: "/student-dashboard/overview",
            label: "Go to Student Dashboard",
          };
        default:
          return null;
      }
    };

    const accessInfo = getAccessMessage();
    const dashboardInfo = getUserDashboardInfo();

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-8 max-w-lg w-full mx-4">
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              {accessInfo.title}
            </h3>

            <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
              {accessInfo.message}
            </p>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Suggestion:</strong> {accessInfo.suggestion}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => (window.location.href = "/")}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                Go to Home
              </button>

              {dashboardInfo && (
                <button
                  onClick={() => (window.location.href = dashboardInfo.url)}
                  className="bg-[#5D5CDE] hover:bg-[#4A4BC9] text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  {dashboardInfo.label}
                </button>
              )}

              {requiredRole === "teacher" && userRole === "student" && (
                <button
                  onClick={() => (window.location.href = "/teach")}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  Apply to Teach
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return children;
};
