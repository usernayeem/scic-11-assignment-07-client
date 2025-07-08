import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { Root } from "./Root";
import { Home } from "../pages/Home";
import { Register } from "../pages/Register";

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
    ],
  },
]);
