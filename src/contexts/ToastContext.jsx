import React, { createContext, useContext } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Create the context
const ToastContext = createContext();

// Custom hook to use the toast context
export const useToast = () => {
  return useContext(ToastContext);
};

// Toast provider component
export const ToastProvider = ({ children }) => {
  // Toast functions
  const showToast = {
    success: (message) => {
      toast.success(message);
    },
    error: (message) => {
      toast.error(message);
    },
    info: (message) => {
      toast.info(message);
    },
    warning: (message) => {
      toast.warning(message);
    },
  };

  return (
    <ToastContext.Provider value={showToast}>{children}</ToastContext.Provider>
  );
};
