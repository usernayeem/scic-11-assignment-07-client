import React from "react";
import { FiUsers, FiBook, FiUserCheck, FiTrendingUp } from "react-icons/fi";
import { BaseOverview } from "../../components/BaseOverview";
import axios from "axios";

const adminConfig = {
  role: "admin",
  title: "System Overview",
  description: "Platform statistics and management insights",

  dataFetcher: async () => {
    // Fetch public statistics
    const statsResponse = await axios.get(
      `${import.meta.env.VITE_API}/public-statistics`
    );
    const publicStats = statsResponse.data.statistics;

    // Fetch teacher applications
    const applicationsResponse = await axios.get(
      `${import.meta.env.VITE_API}/teacher-applications?limit=100`
    );
    const applications = applicationsResponse.data.applications || [];
    const pendingApplications = applications.filter(
      (app) => app.status === "pending"
    ).length;

    // Fetch all users for role distribution
    const usersResponse = await axios.get(
      `${import.meta.env.VITE_API}/users?limit=100`
    );
    const users = usersResponse.data.users || [];

    // Calculate role distribution
    const roleCount = { student: 0, teacher: 0, admin: 0 };
    users.forEach((user) => {
      roleCount[user.role] = (roleCount[user.role] || 0) + 1;
    });

    const roleData = Object.entries(roleCount).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }));

    // Fetch all classes for status distribution
    const classesResponse = await axios.get(
      `${import.meta.env.VITE_API}/classes?limit=100`
    );
    const classes = classesResponse.data.classes || [];

    const statusCount = { pending: 0, approved: 0, rejected: 0 };
    classes.forEach((cls) => {
      statusCount[cls.status] = (statusCount[cls.status] || 0) + 1;
    });

    const statusData = Object.entries(statusCount)
      .filter(([_, value]) => value > 0)
      .map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
      }));

    return {
      stats: {
        totalUsers: publicStats.totalUsers,
        totalClasses: publicStats.totalClasses,
        totalEnrollments: publicStats.totalEnrollments,
        pendingApplications,
      },
      chartData: {
        userRoles: roleData,
        classStatus: statusData,
      },
    };
  },

  statCards: [
    {
      title: "Total Users",
      getValue: (stats) => stats.totalUsers,
      icon: FiUsers,
      color: "bg-blue-500",
      subtext: "Registered users",
    },
    {
      title: "Total Classes",
      getValue: (stats) => stats.totalClasses,
      icon: FiBook,
      color: "bg-green-500",
      subtext: "Approved classes",
    },
    {
      title: "Total Enrollments",
      getValue: (stats) => stats.totalEnrollments,
      icon: FiTrendingUp,
      color: "bg-purple-500",
      subtext: "Student enrollments",
    },
    {
      title: "Pending Applications",
      getValue: (stats) => stats.pendingApplications,
      icon: FiUserCheck,
      color: "bg-orange-500",
      subtext: "Teacher requests",
    },
  ],

  charts: [
    {
      type: "pie",
      dataKey: "userRoles",
      title: "User Role Distribution",
      colors: ["#5D5CDE", "#10B981", "#F59E0B"],
    },
    {
      type: "pie",
      dataKey: "classStatus",
      title: "Class Status Distribution",
      colors: ["#F59E0B", "#10B981", "#EF4444"],
    },
  ],
};

export const AdminOverview = () => {
  return <BaseOverview config={adminConfig} />;
};
