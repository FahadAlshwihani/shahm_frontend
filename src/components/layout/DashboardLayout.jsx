// src/components/layout/DashboardLayout.jsx
import React from "react";
import DashboardSidebar from "./DashboardSidebar";
import DashboardNavbar from "./DashboardNavbar";

export default function DashboardLayout({ children }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <DashboardSidebar />

      <main style={{ flex: 1 }}>
        <DashboardNavbar />
        <div style={{ padding: "20px" }}>{children}</div>
      </main>
    </div>
  );
}
