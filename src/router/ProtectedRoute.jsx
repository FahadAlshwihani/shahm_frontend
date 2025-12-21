// src/router/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import DashboardLayout from "../components/layout/DashboardLayout";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, user } = useAuthStore();

  // شرط 1: مهو مسجل دخول
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // شرط 2: لو فيه أدوار مطلوبة
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/login" replace />;
  }

return <DashboardLayout>{children}</DashboardLayout>;
}
