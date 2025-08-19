import React from "react";
import { FiPlus, FiBook, FiUser } from "react-icons/fi";
import { AiFillHome } from "react-icons/ai";
import { DashboardLayout } from "../../components/DashboardLayout";

export const TeacherDashboard = () => {
  const navigationItems = [
    { name: "Overview", path: "/teacher-dashboard/overview", icon: AiFillHome },
    { name: "Add Class", path: "/teacher-dashboard/add-class", icon: FiPlus },
    { name: "My Classes", path: "/teacher-dashboard/my-classes", icon: FiBook },
    { name: "Profile", path: "/teacher-dashboard/profile", icon: FiUser },
  ];

  return (
    <DashboardLayout
      title="Teacher Dashboard"
      navigationItems={navigationItems}
    />
  );
};
