import React from "react";
import { FiBook, FiCheckCircle, FiClock, FiTrendingUp } from "react-icons/fi";
import { BaseOverview } from "../../components/BaseOverview";
import axios from "axios";

const studentConfig = {
  role: "student",
  title: "Overview",
  description: "Your learning progress and statistics",

  dataFetcher: async (user) => {
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

    const categoryData = Object.entries(categoryCount).map(([name, value]) => ({
      name,
      value,
    }));

    // Recent classes (last 5)
    const recent = enrolledClasses.slice(0, 5).map((cls) => ({
      name: cls.title,
      enrollments: cls.enrolledStudents?.length || 0,
    }));

    return {
      stats: {
        enrolledClasses: enrolledClasses.length,
        completedAssignments: 0, // Would need assignment endpoint
        pendingAssignments: 0, // Would need assignment endpoint
        totalPayments: payments.reduce(
          (sum, payment) => sum + payment.amount,
          0
        ),
      },
      chartData: {
        recentClasses: recent,
        classCategories: categoryData,
      },
    };
  },

  statCards: [
    {
      title: "Enrolled Classes",
      getValue: (stats) => stats.enrolledClasses,
      icon: FiBook,
      color: "bg-blue-500",
      subtext: "Active enrollments",
    },
    {
      title: "Total Spent",
      getValue: (stats) => `$${stats.totalPayments.toFixed(2)}`,
      icon: FiTrendingUp,
      color: "bg-green-500",
      subtext: "On course purchases",
    },
    {
      title: "Completed Tasks",
      getValue: (stats) => stats.completedAssignments,
      icon: FiCheckCircle,
      color: "bg-purple-500",
      subtext: "Assignments done",
    },
    {
      title: "Pending Tasks",
      getValue: (stats) => stats.pendingAssignments,
      icon: FiClock,
      color: "bg-orange-500",
      subtext: "Due assignments",
    },
  ],

  charts: [
    {
      type: "bar",
      dataKey: "recentClasses",
      chartDataKey: "enrollments",
      xAxisKey: "name",
      title: "Class Popularity (Your Enrolled Classes)",
    },
    {
      type: "pie",
      dataKey: "classCategories",
      title: "Your Classes by Category",
    },
  ],
};

export const StudentOverview = () => {
  return <BaseOverview config={studentConfig} />;
};
