import React, { useState, useEffect, useContext } from "react";
import { StatCard } from "../components/charts/StatCard";
import {
  SimpleBarChart,
  SimplePieChart,
} from "../components/charts/SimpleChart";
import { FiBook, FiUsers, FiDollarSign, FiCheckCircle } from "react-icons/fi";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";

export const TeacherOverview = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalStudents: 0,
    totalEarnings: 0,
    approvedClasses: 0,
  });
  const [classData, setClassData] = useState([]);
  const [statusData, setStatusData] = useState([]);

  useEffect(() => {
    if (user?.uid) {
      fetchTeacherStats();
    }
  }, [user]);

  const fetchTeacherStats = async () => {
    try {
      setLoading(true);

      // Fetch teacher's classes
      const classesResponse = await axios.get(
        `${import.meta.env.VITE_API}/classes/teacher/${user.uid}?limit=100`
      );

      const classes = classesResponse.data.classes || [];

      // Calculate stats
      const totalStudents = classes.reduce(
        (sum, cls) => sum + (cls.enrolledStudents?.length || 0),
        0
      );
      const approvedClasses = classes.filter(
        (cls) => cls.status === "approved"
      ).length;
      const totalEarnings = classes.reduce((sum, cls) => {
        const studentCount = cls.enrolledStudents?.length || 0;
        return sum + studentCount * cls.price;
      }, 0);

      // Prepare chart data
      const classChartData = classes.slice(0, 5).map((cls) => ({
        name:
          cls.title.length > 15
            ? cls.title.substring(0, 15) + "..."
            : cls.title,
        students: cls.enrolledStudents?.length || 0,
      }));

      // Status distribution
      const statusCount = { pending: 0, approved: 0, rejected: 0 };
      classes.forEach((cls) => {
        statusCount[cls.status] = (statusCount[cls.status] || 0) + 1;
      });

      const statusChartData = Object.entries(statusCount)
        .filter(([_, value]) => value > 0)
        .map(([name, value]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          value,
        }));

      setStats({
        totalClasses: classes.length,
        totalStudents,
        totalEarnings,
        approvedClasses,
      });

      setClassData(classChartData);
      setStatusData(statusChartData);
    } catch (error) {
      console.error("Error fetching teacher stats:", error);
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
          Teaching Overview
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Your teaching performance and statistics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Classes"
          value={stats.totalClasses}
          icon={FiBook}
          color="bg-blue-500"
          subtext="Classes created"
        />
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon={FiUsers}
          color="bg-green-500"
          subtext="Across all classes"
        />
        <StatCard
          title="Total Earnings"
          value={`$${stats.totalEarnings.toFixed(2)}`}
          icon={FiDollarSign}
          color="bg-purple-500"
          subtext="From enrollments"
        />
        <StatCard
          title="Approved Classes"
          value={stats.approvedClasses}
          icon={FiCheckCircle}
          color="bg-orange-500"
          subtext="Live classes"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {classData.length > 0 && (
          <SimpleBarChart
            data={classData}
            dataKey="students"
            xAxisKey="name"
            title="Student Enrollment by Class"
          />
        )}

        {statusData.length > 0 && (
          <SimplePieChart
            data={statusData}
            title="Class Status Distribution"
            colors={["#F59E0B", "#10B981", "#EF4444"]}
          />
        )}
      </div>

      {/* Class Performance */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Top Performing Classes
        </h3>
        <div className="space-y-3">
          {classData.slice(0, 3).map((cls, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {cls.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {cls.students} students enrolled
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-[#5D5CDE]">
                  #{index + 1}
                </span>
              </div>
            </div>
          ))}
          {classData.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              No classes created yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
