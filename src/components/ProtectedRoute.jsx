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

    if (user) {
      fetchUserRole();
    }
  }, [user, requiredRole, toast]);

  if (loading || roleLoading) {
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Access Denied
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              You don't have permission to access this link.
            </p>
            <button
              onClick={() => (window.location.href = "/")}
              className="bg-[#5D5CDE] hover:bg-[#4A4BC9] text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
};
