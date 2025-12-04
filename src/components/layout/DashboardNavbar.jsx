// src/components/layout/DashboardNavbar.jsx
import React from "react";
import { useAuthStore } from "../../store/useAuthStore";

export default function DashboardNavbar() {
  const { user } = useAuthStore();

  return (
    <header style={{ padding: "15px", background: "#ddd" }}>
      <strong>Welcome, {user?.full_name}</strong>
    </header>
  );
}
