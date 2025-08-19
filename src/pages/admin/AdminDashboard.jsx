import React from "react";
import {
  FiUsers,
  FiUser,
  FiHome,
  FiBookOpen,
  FiUserCheck,
} from "react-icons/fi";
import { DashboardLayout } from "../../components/DashboardLayout";

export const AdminDashboard = () => {
  const navigationItems = [
    { name: "Overview", path: "/admin-dashboard/overview", icon: FiHome },
    {
      name: "Teacher Request",
      path: "/admin-dashboard/teacher-request",
      icon: FiUserCheck,
    },
    { name: "Users", path: "/admin-dashboard/users", icon: FiUsers },
    {
      name: "All Classes",
      path: "/admin-dashboard/admin-all-classes",
      icon: FiBookOpen,
    },
    { name: "Profile", path: "/admin-dashboard/profile", icon: FiUser },
  ];

  return (
    <DashboardLayout
      title="Admin Dashboard"
      navigationItems={navigationItems}
    />
  );
};
