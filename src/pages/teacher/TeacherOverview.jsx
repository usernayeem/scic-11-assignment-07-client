import React from "react";
import { FiBook, FiUsers, FiDollarSign, FiCheckCircle } from "react-icons/fi";
import { BaseOverview } from "../../components/BaseOverview";
import axios from "axios";

const teacherConfig = {
  role: "teacher",
  title: "Teaching Overview",
  description: "Your teaching performance and statistics",

  dataFetcher: async (user) => {
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
        cls.title.length > 15 ? cls.title.substring(0, 15) + "..." : cls.title,
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

    return {
      stats: {
        totalClasses: classes.length,
        totalStudents,
        totalEarnings,
        approvedClasses,
      },
      chartData: {
        classEnrollments: classChartData,
        classStatus: statusChartData,
      },
    };
  },

  statCards: [
    {
      title: "Total Classes",
      getValue: (stats) => stats.totalClasses,
      icon: FiBook,
      color: "bg-blue-500",
      subtext: "Classes created",
    },
    {
      title: "Total Students",
      getValue: (stats) => stats.totalStudents,
      icon: FiUsers,
      color: "bg-green-500",
      subtext: "Across all classes",
    },
    {
      title: "Total Earnings",
      getValue: (stats) => `$${stats.totalEarnings.toFixed(2)}`,
      icon: FiDollarSign,
      color: "bg-purple-500",
      subtext: "From enrollments",
    },
    {
      title: "Approved Classes",
      getValue: (stats) => stats.approvedClasses,
      icon: FiCheckCircle,
      color: "bg-orange-500",
      subtext: "Live classes",
    },
  ],

  charts: [
    {
      type: "bar",
      dataKey: "classEnrollments",
      chartDataKey: "students",
      xAxisKey: "name",
      title: "Student Enrollment by Class",
    },
    {
      type: "pie",
      dataKey: "classStatus",
      title: "Class Status Distribution",
      colors: ["#F59E0B", "#10B981", "#EF4444"],
    },
  ],
};

export const TeacherOverview = () => {
  return <BaseOverview config={teacherConfig} />;
};
