// src/components/layout/DashboardNavbar.jsx
import React from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useTranslation } from "react-i18next";
import "../../styles/DashboardNavbar.css";

export default function DashboardNavbar({ onToggleSidebar }) {
  const { user } = useAuthStore();
  const { t } = useTranslation();

  return (
    <header className="dashboard-navbar">
      <div className="dashboard-navbar-left">
        {/* Mobile Menu Toggle */}
        <button 
          className="dashboard-navbar-menu-toggle" 
          onClick={onToggleSidebar}
          aria-label={t("navbar.toggle_menu")}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Breadcrumb / Title */}
        <div className="dashboard-navbar-breadcrumb">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2.5L2.5 7.5V16.25C2.5 16.5815 2.6317 16.8995 2.86612 17.1339C3.10054 17.3683 3.41848 17.5 3.75 17.5H7.5V12.5H12.5V17.5H16.25C16.5815 17.5 16.8995 17.3683 17.1339 17.1339C17.3683 16.8995 17.5 16.5815 17.5 16.25V7.5L10 2.5Z" fill="currentColor"/>
          </svg>
          <span className="dashboard-navbar-title">{t("dashboard.title")}</span>
        </div>
      </div>

      <div className="dashboard-navbar-right">
        {/* User Profile */}
        <div className="dashboard-navbar-user">
          <div className="dashboard-navbar-user-avatar">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM10 3C11.66 3 13 4.34 13 6C13 7.66 11.66 9 10 9C8.34 9 7 7.66 7 6C7 4.34 8.34 3 10 3ZM10 17.2C7.5 17.2 5.29 15.92 4 13.98C4.03 11.99 8 10.9 10 10.9C11.99 10.9 15.97 11.99 16 13.98C14.71 15.92 12.5 17.2 10 17.2Z" fill="currentColor"/>
            </svg>
          </div>
          <div className="dashboard-navbar-user-info">
            <span className="dashboard-navbar-user-greeting">{t("dashboard.welcome")}</span>
            <span className="dashboard-navbar-user-name">{user?.full_name || t("navbar.user")}</span>
          </div>
        </div>

        {/* Notifications */}
        <button className="dashboard-navbar-icon-btn" aria-label={t("navbar.notifications")}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2C6.69 2 4 4.69 4 8V12L2 14V15H18V14L16 12V8C16 4.69 13.31 2 10 2ZM12 16H8C8 17.1 8.9 18 10 18C11.1 18 12 17.1 12 16Z" fill="currentColor"/>
          </svg>
          <span className="dashboard-navbar-badge">3</span>
        </button>
      </div>
    </header>
  );
}