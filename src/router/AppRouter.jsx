import { Navigate } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import MainLayout from "../components/layout/MainLayout";

// Public pages
import Home from "../pages/public/Home";
import Services from "../pages/public/Services/Services";
import ServiceDetails from "../pages/public/Services/ServiceDetail";
import Team from "../pages/public/Team/Team";
import Blog from "../pages/public/Blog/Blog";
import BlogDetails from "../pages/public/Blog/BlogDetails";
import LegalPage from "../pages/public/LegalPage";
import Page from "../pages/public/Page";
import FAQ from "../pages/public/FAQ";
import Contact from "../pages/public/Contact";
import ServiceAdvisory from "../pages/public/Services/ServiceAdvisory";
import Payment from "../pages/public/Payment";
import AppointmentBooking from "../pages/public/AppointmentBooking";
import Careers from "../pages/public/Team/Careers";
import CareersCMS from "../pages/dashboard/jobs/CareersCMS";
import CareerApplicationsCMS from "../pages/dashboard/jobs/CareerApplicationsCMS";



// Auth
import Login from "../pages/auth/Login";

// Dashboard pages
import DashboardHome from "../pages/dashboard/DashboardHome";
import Users from "../pages/dashboard/Users";
import UserForm from "../pages/dashboard/UserForm";
import CMS_Heroes from "../pages/dashboard/CMS_Heroes";
import CMS_Pages from "../pages/dashboard/CMS_Pages";
import Services_Manage from "../pages/dashboard/services/Services_Manage";
import SEO_Settings from "../pages/dashboard/SEO_Settings";

import Messages_Dashboard from "../pages/dashboard/messages/Messages_Dashboard";
import Message_View from "../pages/dashboard/messages/Message_View";

import Blog_Manage from "../pages/dashboard/Blog_Manage";
import Team_Manage from "../pages/dashboard/jobs/Team_Manage";
import Settings from "../pages/dashboard/Settings_Manage";
import EmailSettings from "../pages/dashboard/email/EmailSettings";
import EmailTemplates from "../pages/dashboard/email/EmailTemplates";

import CMS_Header from "../pages/dashboard/CMS_Header";
import CMS_Footer from "../pages/dashboard/CMS_Footer";
import CMS_FAQ from "../pages/dashboard/CMS_FAQ";
import CMS_Contact from "../pages/dashboard/contact/CMS_Contact";
import CMS_Legal from "../pages/dashboard/CMS_Legal";
import AppointmentsCMS from "../pages/dashboard/appointment/AppointmentsCMS";


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
            <ServiceDetails />
          </MainLayout>
        }
      />

      <Route
        path="/service-advisory"
        element={
          <MainLayout>
            <ServiceAdvisory />
          </MainLayout>
        }
      />
      <Route
        path="/page/service-advisory"
        element={<Navigate to="/service-advisory" replace />}
      />

      <Route
        path="/appointments"
        element={
          <MainLayout>
            <AppointmentBooking />
          </MainLayout>
        }
      />




      <Route
        path="/payment"
        element={
          <MainLayout>
            <Payment />
          </MainLayout>
        }
      />
      <Route
        path="/careers"
        element={
          <MainLayout>
            <Careers />
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

      <Route
        path="/contact"
        element={
          <MainLayout>
            <Contact />
          </MainLayout>
        }
      />




      {/* Redirect CMS blog page to real blog */}
      <Route
        path="/page/blog"
        element={<Navigate to="/blog" replace />}
      />
      <Route
        path="/page/contact-methods"
        element={<Navigate to="/contact" replace />}
      />

      <Route
        path="/page/:slug"
        element={
          <MainLayout>
            <Page />
          </MainLayout>
        }
      />

      <Route
        path="/faq"
        element={
          <MainLayout>
            <FAQ />
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

      <Route
        path="/dashboard/cms/legal"
        element={
          <ProtectedRoute>
            <CMS_Legal />
          </ProtectedRoute>
        }
      />

      {/* CMS FAQ */}
      <Route
        path="/dashboard/cms/faq"
        element={
          <ProtectedRoute>
            <CMS_FAQ />
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

      <Route
        path="/dashboard/appointments"
        element={
          <ProtectedRoute>
            <AppointmentsCMS />
          </ProtectedRoute>
        }
      />

      {/* Careers */}
      <Route
        path="/dashboard/careers"
        element={
          <ProtectedRoute>
            <CareersCMS />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/careers/applications"
        element={
          <ProtectedRoute>
            <CareerApplicationsCMS />
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

      {/*Contact CMS*/}
      <Route
        path="/dashboard/cms/contact"
        element={
          <ProtectedRoute>
            <CMS_Contact />
          </ProtectedRoute>
        }
      />


    </Routes>
  );
}
