// src/components/layout/DashboardLayout.jsx
import React, { useState } from "react";
import DashboardSidebar from "./DashboardSidebar";
import DashboardNavbar from "./DashboardNavbar";
import "../../styles/DashboardLayout.css";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="sh-dashboard-root">
      {/* Overlay for mobile */}
      <div
        className={`sh-dashboard-overlay ${sidebarOpen ? "active" : ""}`}
        onClick={closeSidebar}
      />

      <DashboardSidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      <div className="sh-dashboard-main">
        <DashboardNavbar onToggleSidebar={toggleSidebar} />
        <div className="sh-dashboard-content">{children}</div>
      </div>
    </div>
  );
}