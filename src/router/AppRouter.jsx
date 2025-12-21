import { Navigate } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../components/layout/MainLayout";

// Public pages
import Home from "../pages/public/Home";
import Services from "../pages/public/Services";
import AreaDetails from "../pages/public/AreaDetails";   // ✅ NEW
import Team from "../pages/public/Team";
import Blog from "../pages/public/Blog";
import BlogDetails from "../pages/public/BlogDetails";
import LegalPage from "../pages/public/LegalPage";
import Page from "../pages/public/Page";

// Auth
import Login from "../pages/auth/Login";

// Dashboard pages
import DashboardHome from "../pages/dashboard/DashboardHome";
import Users from "../pages/dashboard/Users";
import UserForm from "../pages/dashboard/UserForm";
import CMS_Heroes from "../pages/dashboard/CMS_Heroes";
import CMS_Pages from "../pages/dashboard/CMS_Pages";
import Services_Manage from "../pages/dashboard/Services_Manage";
import SEO_Settings from "../pages/dashboard/SEO_Settings";

import Messages_Dashboard from "../pages/dashboard/messages/Messages_Dashboard";
import Message_View from "../pages/dashboard/messages/Message_View";

import Blog_Manage from "../pages/dashboard/Blog_Manage";
import Team_Manage from "../pages/dashboard/Team_Manage";
import Settings from "../pages/dashboard/Settings_Manage";
import EmailSettings from "../pages/dashboard/EmailSettings";
import EmailTemplates from "../pages/dashboard/EmailTemplates";

import CMS_Header from "../pages/dashboard/CMS_Header";
import CMS_Footer from "../pages/dashboard/CMS_Footer";

export default function AppRouter() {
  return (
    <Routes>

      {/* ---------------- Public ---------------- */}

      {/* Home (بدون Layout — الهيرو فقط) */}
      <Route path="/" element={<Home />} />

      {/* Public pages WITH Navbar */}
      <Route
        path="/services"
        element={
          <MainLayout>
            <Services />
          </MainLayout>
        }
      />

      <Route
        path="/services/:slug"
        element={
          <MainLayout>
            <AreaDetails />
          </MainLayout>
        }
      />

      <Route
        path="/team"
        element={
          <MainLayout>
            <Team />
          </MainLayout>
        }
      />

      <Route
        path="/blog"
        element={
          <MainLayout>
            <Blog />
          </MainLayout>
        }
      />

      <Route
        path="/blog/:slug"
        element={
          <MainLayout>
            <BlogDetails />
          </MainLayout>
        }
      />

      <Route
        path="/legal/:slug"
        element={
          <MainLayout>
            <LegalPage />
          </MainLayout>
        }
      />

      {/* Redirect CMS blog page to real blog */}
      <Route
        path="/page/blog"
        element={<Navigate to="/blog" replace />}
      />

      <Route
        path="/page/:slug"
        element={
          <MainLayout>
            <Page />
          </MainLayout>
        }
      />

      {/* ---------------- Auth ---------------- */}
      <Route path="/login" element={<Login />} />

      {/* ---------------- Dashboard ---------------- */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardHome />
          </ProtectedRoute>
        }
      />

      {/* Users */}
      <Route
        path="/dashboard/users"
        element={
          <ProtectedRoute>
            <Users />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/users/create"
        element={
          <ProtectedRoute>
            <UserForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/users/:id"
        element={
          <ProtectedRoute>
            <UserForm />
          </ProtectedRoute>
        }
      />

      {/* CMS */}
      <Route
        path="/dashboard/cms/heroes"
        element={
          <ProtectedRoute>
            <CMS_Heroes />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/cms/pages"
        element={
          <ProtectedRoute>
            <CMS_Pages />
          </ProtectedRoute>
        }
      />

      {/* Services */}
      <Route
        path="/dashboard/services"
        element={
          <ProtectedRoute>
            <Services_Manage />
          </ProtectedRoute>
        }
      />

      {/* SEO */}
      <Route
        path="/dashboard/seo"
        element={
          <ProtectedRoute>
            <SEO_Settings />
          </ProtectedRoute>
        }
      />

      {/* Messages */}
      <Route
        path="/dashboard/messages"
        element={
          <ProtectedRoute>
            <Messages_Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/messages/:id"
        element={
          <ProtectedRoute>
            <Message_View />
          </ProtectedRoute>
        }
      />

      {/* Blog */}
      <Route
        path="/dashboard/blog"
        element={
          <ProtectedRoute>
            <Blog_Manage />
          </ProtectedRoute>
        }
      />

      {/* Team */}
      <Route
        path="/dashboard/team"
        element={
          <ProtectedRoute>
            <Team_Manage />
          </ProtectedRoute>
        }
      />

      {/* Settings */}
      <Route
        path="/dashboard/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      {/* Email */}
      <Route
        path="/dashboard/email-settings"
        element={
          <ProtectedRoute>
            <EmailSettings />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/email-templates"
        element={
          <ProtectedRoute>
            <EmailTemplates />
          </ProtectedRoute>
        }
      />

      {/* CMS Header */}
      <Route
        path="/dashboard/cms/header"
        element={
          <ProtectedRoute>
            <CMS_Header />
          </ProtectedRoute>
        }
      />

      {/* CMS Footer */}
      <Route
        path="/dashboard/cms/footer"
        element={
          <ProtectedRoute>
            <CMS_Footer />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}
