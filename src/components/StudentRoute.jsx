import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import { Navigate, useLocation } from "react-router-dom";
import axios from "axios";

export const StudentRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const [userRole, setUserRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);
  const [roleError, setRoleError] = useState(false);
  const toast = useToast();
  const location = useLocation();

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user || !user.uid) {
        setRoleLoading(false);
        return;
      }

      try {
        setRoleLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API}/users/${user.uid}`
        );

        if (response.data.success) {
          setUserRole(response.data.user.role);
          setRoleError(false);
        } else {
          setRoleError(true);
          toast.error("Unable to verify user permissions");
        }
      } catch (error) {
        setRoleError(true);
        toast.error("Failed to verify user permissions");
      } finally {
        setRoleLoading(false);
      }
    };

    if (user) {
      fetchUserRole();
    }
  }, [user, toast]);

  // Show loading while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-8">
          <div className="flex items-center justify-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5D5CDE]"></div>
            <span className="text-gray-600 dark:text-gray-300">
              Authenticating...
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Redirect to login if user is not authenticated
  if (!user || !user.email) {
    return <Navigate state={location?.pathname} to="/login" />;
  }

  // Show loading while checking user role
  if (roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-8">
          <div className="flex items-center justify-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5D5CDE]"></div>
            <span className="text-gray-600 dark:text-gray-300">
              Verifying permissions...
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if role check failed
  if (roleError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Permission Error
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Unable to verify your permissions. Please try again or contact
              support.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-[#5D5CDE] hover:bg-[#4A4BC9] text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Check if user has student role
  if (userRole !== "student") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Student Access Only
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              This page link is only for students. If you're a teacher or admin,
              please access your respective dashboard.
            </p>
            <div className="space-y-2">
              <button
                onClick={() => window.history.back()}
                className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-6 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                Go Back
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                className="w-full bg-[#5D5CDE] hover:bg-[#4A4BC9] text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Allow access if user has student role
  return children;
};
