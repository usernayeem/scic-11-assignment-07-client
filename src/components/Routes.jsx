import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { Root } from "./Root";
import { Home } from "../pages/Home";
import { Register } from "../pages/Register";
import { Login } from "../pages/Login";
import { NotFound } from "../pages/NotFound";
import { TeachOnEduManage } from "../pages/TeachOnEduManage";
import { StudentDashboard } from "../pages/student/StudentDashboard";
import { Profile } from "../pages/Profile";
import { TeacherDashboard } from "../pages/teacher/TeacherDashboard";
import { AddClass } from "../pages/teacher/AddClass";
import { MyClassesTeacher } from "../pages/teacher/MyClassesTeacher";
import { AdminDashboard } from "../pages/admin/AdminDashboard";
import { TeacherRequest } from "../pages/admin/TeacherRequest";
import { Users } from "../pages/admin/Users";
import { AdminAllClasses } from "../pages/admin/AdminAllClasses";
import { ProtectedRoute } from "./ProtectedRoute";
import { AllClasses } from "../pages/AllClasses";
import { ClassDetails } from "../pages/ClassDetails";
import { Payment } from "../pages/CheckoutForm";
import { ForgotPassword } from "../pages/ForgotPassword";
import { StudentOverview } from "../pages/student/StudentOverview";
import { TeacherOverview } from "../pages/teacher/TeacherOverview";
import { AdminOverview } from "../pages/admin/AdminOverview";
import { ClassDetailsTeacher } from "../pages/teacher/ClassDetailsTeacher";
import { EnrolledClassDetails } from "../pages/student/EnrolledClassDetails";
import { MyEnrolledClasses } from "../pages/student/MyEnrolledClasses";
import { MyRequest } from "../pages/student/MyRequest";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "/teach",
        element: (
          <ProtectedRoute>
            <TeachOnEduManage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/all-classes",
        element: (
          <ProtectedRoute>
            <AllClasses />
          </ProtectedRoute>
        ),
      },
      {
        path: "/all-classes/:id",
        element: (
          <ProtectedRoute>
            <ClassDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: "/payment/:id",
        element: (
          <ProtectedRoute>
            <Payment />
          </ProtectedRoute>
        ),
      },
      {
        path: "/student-dashboard",
        element: (
          <ProtectedRoute requiredRole="student">
            <StudentDashboard />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="overview" />,
          },
          {
            path: "overview",
            element: <StudentOverview />,
          },
          {
            path: "my-enroll-classes",
            element: <MyEnrolledClasses />,
          },
          {
            path: "my-enroll-class/:id",
            element: <EnrolledClassDetails />,
          },
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "my-request",
            element: <MyRequest />,
          },
        ],
      },
      {
        path: "/teacher-dashboard",
        element: (
          <ProtectedRoute requiredRole="teacher">
            <TeacherDashboard />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="overview" />,
          },
          {
            path: "overview",
            element: <TeacherOverview />,
          },
          {
            path: "add-class",
            element: <AddClass />,
          },
          {
            path: "my-classes",
            element: <MyClassesTeacher />,
          },
          {
            path: "my-classes/:id",
            element: <ClassDetailsTeacher />,
          },
          {
            path: "profile",
            element: <Profile />,
          },
        ],
      },
      {
        path: "/admin-dashboard",
        element: (
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="overview" />,
          },
          {
            path: "overview",
            element: <AdminOverview />,
          },
          {
            path: "teacher-request",
            element: <TeacherRequest />,
          },
          {
            path: "users",
            element: <Users />,
          },
          {
            path: "admin-all-classes",
            element: <AdminAllClasses />,
          },
          {
            path: "profile",
            element: <Profile />,
          },
        ],
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);
