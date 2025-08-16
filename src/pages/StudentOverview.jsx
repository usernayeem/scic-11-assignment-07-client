import React, { useState, useEffect, useContext } from "react";
import { StatCard } from "../components/charts/StatCard";
import {
  SimpleBarChart,
  SimplePieChart,
} from "../components/charts/SimpleChart";
import { FiBook, FiCheckCircle, FiClock, FiTrendingUp } from "react-icons/fi";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";

export const StudentOverview = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    enrolledClasses: 0,
    completedAssignments: 0,
    pendingAssignments: 0,
    totalPayments: 0,
  });
  const [recentClasses, setRecentClasses] = useState([]);
  const [classCategories, setClassCategories] = useState([]);

  useEffect(() => {
    if (user?.uid) {
      fetchStudentStats();
    }
  }, [user]);

  const fetchStudentStats = async () => {
    try {
      setLoading(true);

      // Fetch enrolled classes
      const classesResponse = await axios.get(
        `${import.meta.env.VITE_API}/students/${
          user.uid
        }/enrolled-classes?limit=100`
      );

      const enrolledClasses = classesResponse.data.classes || [];

      // Fetch payment history
      const paymentsResponse = await axios.get(
        `${import.meta.env.VITE_API}/students/${user.uid}/payments`
      );

      const payments = paymentsResponse.data.payments || [];

      // Process data
      const categoryCount = {};
      enrolledClasses.forEach((cls) => {
        categoryCount[cls.category] = (categoryCount[cls.category] || 0) + 1;
      });

      const categoryData = Object.entries(categoryCount).map(
        ([name, value]) => ({
          name,
          value,
        })
      );

      // Recent classes (last 5)
      const recent = enrolledClasses.slice(0, 5).map((cls) => ({
        name: cls.title,
        enrollments: cls.enrolledStudents?.length || 0,
      }));

      setStats({
        enrolledClasses: enrolledClasses.length,
        completedAssignments: 0, // Would need assignment endpoint
        pendingAssignments: 0, // Would need assignment endpoint
        totalPayments: payments.reduce(
          (sum, payment) => sum + payment.amount,
          0
        ),
      });

      setRecentClasses(recent);
      setClassCategories(categoryData);
    } catch (error) {
      console.error("Error fetching student stats:", error);
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
          Overview
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Your learning progress and statistics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Enrolled Classes"
          value={stats.enrolledClasses}
          icon={FiBook}
          color="bg-blue-500"
          subtext="Active enrollments"
        />
        <StatCard
          title="Total Spent"
          value={`$${stats.totalPayments.toFixed(2)}`}
          icon={FiTrendingUp}
          color="bg-green-500"
          subtext="On course purchases"
        />
        <StatCard
          title="Completed Tasks"
          value={stats.completedAssignments}
          icon={FiCheckCircle}
          color="bg-purple-500"
          subtext="Assignments done"
        />
        <StatCard
          title="Pending Tasks"
          value={stats.pendingAssignments}
          icon={FiClock}
          color="bg-orange-500"
          subtext="Due assignments"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {recentClasses.length > 0 && (
          <SimpleBarChart
            data={recentClasses}
            dataKey="enrollments"
            xAxisKey="name"
            title="Class Popularity (Your Enrolled Classes)"
          />
        )}

        {classCategories.length > 0 && (
          <SimplePieChart
            data={classCategories}
            title="Your Classes by Category"
          />
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Enrollments
        </h3>
        <div className="space-y-3">
          {recentClasses.slice(0, 3).map((cls, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {cls.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {cls.enrollments} total students
                </p>
              </div>
              <FiBook className="text-[#5D5CDE] w-5 h-5" />
            </div>
          ))}
          {recentClasses.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              No enrolled classes yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
