import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

// Auth Routes
import AuthLayout from "./AuthLayout";
import Login from "../pages/Login";
import Register from "../pages/Register";

// Main Routes
import MainLayout from "./MainLayout";
import Home from "../pages/Home";

// Error Routes
import Error404 from "../components/errors/Error404";

const Layout = ({ socket }) => {
  return (
    <>
    <Routes>
      {/* Auth Routes */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="" element={<Navigate to="login" replace />} />
      </Route>

      {/* Main Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home socket={socket} />} />
      </Route>

      {/* Error Routes */}
      <Route path="/404" element={<Error404 />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
    </>
  );
};

export default Layout;
