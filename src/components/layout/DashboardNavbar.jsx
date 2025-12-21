// src/components/layout/DashboardNavbar.jsx
import React from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useTranslation } from "react-i18next";
import "../../styles/DashboardNavbar.css";

export default function DashboardNavbar() {
  const { user } = useAuthStore();
  const { t } = useTranslation();

  return (
    <header className="sh-dashboard-navbar">
      <div className="sh-dashboard-navbar-left">
        <span className="sh-dashboard-navbar-title">
          {t("dashboard.title")}
        </span>
      </div>

      <div className="sh-dashboard-navbar-right">
        <span className="sh-dashboard-navbar-user">
          {t("dashboard.welcome")} {user?.full_name}
        </span>
      </div>
    </header>
  );
}
