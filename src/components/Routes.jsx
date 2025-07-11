import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { Root } from "./Root";
import { Home } from "../pages/Home";
import { Register } from "../pages/Register";
import { Login } from "../pages/Login";
import { NotFound } from "../pages/NotFound";
import { TeachOnEduManage } from "../pages/TeachOnEduManage";
import { StudentDashboard } from "../pages/StudentDashboard";
import { MyEnrollClasses } from "../pages/MyEnrollClasses";
import { StudentProfile } from "../pages/StudentProfile";
import { AdminDashboard } from "../pages/AdminDashboard";
import { TeacherRequest } from "../pages/TeacherRequest";
import { Users } from "../pages/Users";
import { AllClasses } from "../pages/AllClasses";
import { AdminProfile } from "../pages/AdminProfile";

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
        path: "/teach",
        element: <TeachOnEduManage />,
      },
      {
        path: "/student-dashboard",
        element: <StudentDashboard />,
        children: [
          {
            index: true,
            element: <Navigate to="my-classes" />,
          },
          {
            path: "my-classes",
            element: <MyEnrollClasses />,
          },
          {
            path: "profile",
            element: <StudentProfile />,
          },
        ],
      },
      {
        path: "/admin-dashboard",
        element: <AdminDashboard />,
        children: [
          {
            index: true,
            element: <Navigate to="teacher-request" />,
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
            path: "all-classes",
            element: <AllClasses />,
          },
          {
            path: "profile",
            element: <AdminProfile />,
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
