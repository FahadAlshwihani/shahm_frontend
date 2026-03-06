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
    <div className="dashboard-layout-root">
      {/* Overlay for mobile */}
      <div
        className={`dashboard-layout-overlay ${sidebarOpen ? "dashboard-layout-overlay-active" : ""}`}
        onClick={closeSidebar}
        aria-hidden="true"
      />

      <DashboardSidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      <div className="dashboard-layout-main">
        <DashboardNavbar onToggleSidebar={toggleSidebar} />
        <main className="dashboard-layout-content">{children}</main>
        
        {/* Footer */}
        <footer className="dashboard-layout-footer">
          <div className="dashboard-layout-footer-content">
            <p className="dashboard-layout-footer-text">
              © {new Date().getFullYear()} Shahm. All rights reserved.
            </p>
            <div className="dashboard-layout-footer-links">
              <a href="/privacy" className="dashboard-layout-footer-link">Privacy</a>
              <span className="dashboard-layout-footer-divider">•</span>
              <a href="/terms" className="dashboard-layout-footer-link">Terms</a>
              <span className="dashboard-layout-footer-divider">•</span>
              <a href="/support" className="dashboard-layout-footer-link">Support</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}