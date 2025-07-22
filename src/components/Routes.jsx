import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { Root } from "./Root";
import { Home } from "../pages/Home";
import { Register } from "../pages/Register";
import { Login } from "../pages/Login";
import { NotFound } from "../pages/NotFound";
import { TeachOnEduManage } from "../pages/TeachOnEduManage";
import { StudentDashboard } from "../pages/StudentDashboard";
import { MyEnrolledClasses } from "../pages/MyEnrolledClasses";
import { Profile } from "../pages/Profile";
import { TeacherDashboard } from "../pages/TeacherDashboard";
import { AddClass } from "../pages/AddClass";
import { MyClassesTeacher } from "../pages/MyClassesTeacher";
import { AdminDashboard } from "../pages/AdminDashboard";
import { TeacherRequest } from "../pages/TeacherRequest";
import { Users } from "../pages/Users";
import { AdminAllClasses } from "../pages/AdminAllClasses";
import { PrivateRoute } from "./PrivateRoutes";
import { TeacherRoute } from "./TeacherRoute";
import { AdminRoute } from "./AdminRoute";
import { AllClasses } from "../pages/AllClasses";
import { ClassDetails } from "../pages/ClassDetails";
import { Payment } from "../pages/CheckoutForm";
import { EnrolledClassDetails } from "../pages/EnrolledClassDetails";
import { ClassDetailsTeacher } from "../pages/ClassDetailsTeacher";
import { ForgotPassword } from "../pages/ForgotPassword";

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
          <PrivateRoute>
            <TeachOnEduManage />
          </PrivateRoute>
        ),
      },
      {
        path: "/all-classes",
        element: (
          <PrivateRoute>
            <AllClasses />
          </PrivateRoute>
        ),
      },
      {
        path: "/all-classes/:id",
        element: (
          <PrivateRoute>
            <ClassDetails />
          </PrivateRoute>
        ),
      },
      {
        path: "/payment/:id",
        element: (
          <PrivateRoute>
            <Payment />
          </PrivateRoute>
        ),
      },
      {
        path: "/student-dashboard",
        element: (
          <PrivateRoute>
            <StudentDashboard />
          </PrivateRoute>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="my-enroll-classes" />,
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
        ],
      },
      {
        path: "/teacher-dashboard",
        element: (
          <PrivateRoute>
            <TeacherRoute>
              <TeacherDashboard />
            </TeacherRoute>
          </PrivateRoute>
        ),
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
          <PrivateRoute>
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          </PrivateRoute>
        ),
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
