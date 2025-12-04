// src/components/layout/DashboardSidebar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

export default function DashboardSidebar() {
  const { pathname } = useLocation();
  const { logout } = useAuthStore();

  const links = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/dashboard/users", label: "Users" },
    { to: "/dashboard/settings", label: "Settings" },

    { to: "/dashboard/cms/heroes", label: "CMS Heroes" },
    { to: "/dashboard/cms/pages", label: "CMS Pages" },

    { to: "/dashboard/services", label: "Services" },
    { to: "/dashboard/blog", label: "Blog" },

    { to: "/dashboard/team", label: "Team" },

    { to: "/dashboard/seo", label: "SEO" },

    { to: "/dashboard/messages", label: "Messages" },

    { to: "/dashboard/email-settings", label: "Email Settings" },
    { to: "/dashboard/email-templates", label: "Email Templates" },

    { to: "/dashboard/cms/header", label: "CMS Header" },
    { to: "/dashboard/cms/footer", label: "CMS Footer" },

  ];

  return (
    <aside style={{ width: "250px", background: "#eee", padding: "20px" }}>
      <h2>Dashboard</h2>

      <nav>
        {links.map((item) => (
          <div key={item.to} style={{ margin: "10px 0" }}>
            <Link
              style={{
                fontWeight: pathname === item.to ? "bold" : "normal",
              }}
              to={item.to}
            >
              {item.label}
            </Link>
          </div>
        ))}
      </nav>

      <button onClick={logout} style={{ marginTop: "40px" }}>
        Logout
      </button>
    </aside>
  );
}
