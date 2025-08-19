import React from "react";
import { FiBook, FiUser, FiFileText } from "react-icons/fi";
import { AiFillHome } from "react-icons/ai";
import { DashboardLayout } from "../../components/DashboardLayout";

export const StudentDashboard = () => {
  const navigationItems = [
    { name: "Overview", path: "/student-dashboard/overview", icon: AiFillHome },
    {
      name: "My Enrolled Classes",
      path: "/student-dashboard/my-enroll-classes",
      icon: FiBook,
    },
    {
      name: "My Request",
      path: "/student-dashboard/my-request",
      icon: FiFileText,
    },
    { name: "Profile", path: "/student-dashboard/profile", icon: FiUser },
  ];

  return (
    <DashboardLayout
      title="Student Dashboard"
      navigationItems={navigationItems}
    />
  );
};
