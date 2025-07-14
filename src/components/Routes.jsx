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
import { Profile } from "../pages/Profile";
import { TeacherDashboard } from "../pages/TeacherDashboard";
import { AddClass } from "../pages/AddClass";
import { MyClasses } from "../pages/MyClasses";
import { AdminDashboard } from "../pages/AdminDashboard";
import { TeacherRequest } from "../pages/TeacherRequest";
import { Users } from "../pages/Users";
import { AllClasses } from "../pages/AllClasses";

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
            element: <Profile />,
          },
        ],
      },
      {
        path: "/teacher-dashboard",
        element: <TeacherDashboard />,
        children: [
          {
            index: true,
            element: <Navigate to="add-class" />,
          },
          {
            path: "add-class",
            element: <AddClass />,
          },
          {
            path: "my-classes",
            element: <MyClasses />,
          },
          {
            path: "profile",
            element: <Profile />,
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
