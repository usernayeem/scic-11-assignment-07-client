import React, { useState, useEffect } from "react";
import { StatCard } from "../components/charts/StatCard";
import {
  SimpleBarChart,
  SimplePieChart,
} from "../components/charts/SimpleChart";
import { FiUsers, FiBook, FiUserCheck, FiTrendingUp } from "react-icons/fi";
import axios from "axios";

export const AdminOverview = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalClasses: 0,
    totalEnrollments: 0,
    pendingApplications: 0,
  });
  const [userRoleData, setUserRoleData] = useState([]);
  const [classStatusData, setClassStatusData] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      setLoading(true);

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

      // Recent activity (recent applications)
      const recentApps = applications.slice(0, 5).map((app) => ({
        name: app.name,
        type: "Teacher Application",
        status: app.status,
        date: new Date(app.appliedAt).toLocaleDateString(),
      }));

      setStats({
        totalUsers: publicStats.totalUsers,
        totalClasses: publicStats.totalClasses,
        totalEnrollments: publicStats.totalEnrollments,
        pendingApplications,
      });

      setUserRoleData(roleData);
      setClassStatusData(statusData);
      setRecentActivity(recentApps);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5D5CDE]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          System Overview
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Platform statistics and management insights
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={FiUsers}
          color="bg-blue-500"
          subtext="Registered users"
        />
        <StatCard
          title="Total Classes"
          value={stats.totalClasses}
          icon={FiBook}
          color="bg-green-500"
          subtext="Approved classes"
        />
        <StatCard
          title="Total Enrollments"
          value={stats.totalEnrollments}
          icon={FiTrendingUp}
          color="bg-purple-500"
          subtext="Student enrollments"
        />
        <StatCard
          title="Pending Applications"
          value={stats.pendingApplications}
          icon={FiUserCheck}
          color="bg-orange-500"
          subtext="Teacher requests"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {userRoleData.length > 0 && (
          <SimplePieChart
            data={userRoleData}
            title="User Role Distribution"
            colors={["#5D5CDE", "#10B981", "#F59E0B"]}
          />
        )}

        {classStatusData.length > 0 && (
          <SimplePieChart
            data={classStatusData}
            title="Class Status Distribution"
            colors={["#F59E0B", "#10B981", "#EF4444"]}
          />
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Activity
        </h3>
        <div className="space-y-3">
          {recentActivity.map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {activity.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {activity.type} • {activity.date}
                </p>
              </div>
              <div className="text-right">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    activity.status === "pending"
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      : activity.status === "approved"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  }`}
                >
                  {activity.status}
                </span>
              </div>
            </div>
          ))}
          {recentActivity.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              No recent activity
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
