// src/router/DashboardRoutes.jsx
//
// ✅ Uses a single parent <Route element={<ProtectedRoute />}> that wraps
//    ALL dashboard children via nested routes + <Outlet />.
//
//    Benefits:
//    • Zero repetition of <ProtectedRoute> on every single route
//    • Auth check runs once at the layout level
//    • Adding new dashboard pages = just one extra <Route> child
//
// Called as a function  {DashboardRoutes()}  in AppRouter.

import { Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

// ---------------- General ----------------
import DashboardHome from "../pages/dashboard/home/DashboardHome";

// ---------------- Users ----------------
import Users from "../pages/dashboard/users/Users";

// ---------------- CMS ----------------
import CMSHeroes from "../pages/dashboard/cms/Heroes";
import CMSLegal from "../pages/dashboard/cms/Legal";
import CMSFAQ from "../pages/dashboard/cms/FAQ";
import CMSHeader from "../pages/dashboard/cms/Header";
import CMSFooter from "../pages/dashboard/cms/Footer";
import CMSContact from "../pages/dashboard/contact/CMS_Contact";
import CMSAbout from "../pages/dashboard/cms/About";
import CMSForms from "../pages/dashboard/forms/CMSForms";

// ---------------- Services ----------------
import ServicesManage from "../pages/dashboard/services/Services_Manage";

// ---------------- Appointments ----------------
import AppointmentsCMS from "../pages/dashboard/appointments/AppointmentsCMS";

// ---------------- Careers / Jobs ----------------
import CareersCMS from "../pages/dashboard/jobs/CareersCMS";
import CareerApplicationsCMS from "../pages/dashboard/jobs/CareerApplicationsCMS";

// ---------------- Blog ----------------
import BlogManage from "../pages/dashboard/cms/Blog";

// ---------------- Messages ----------------
import MessagesDashboard from "../pages/dashboard/messages/Messages_Dashboard";
import MessageView from "../pages/dashboard/messages/Message_View";

// ---------------- SEO ----------------
import SEOSettings from "../pages/dashboard/cms/SEO";

// ---------------- Settings ----------------
import Settings from "../pages/dashboard/settings/Settings";

// ---------------- Email ----------------
import EmailSettings from "../pages/dashboard/email/EmailSettings";
import EmailTemplates from "../pages/dashboard/email/EmailTemplates";

export default function DashboardRoutes() {
  return (
    /*
     * Single auth guard + DashboardLayout wrapper.
     * Every child below is automatically protected and rendered
     * inside DashboardLayout via <Outlet />.
     */
    <Route element={<ProtectedRoute />}>

      {/* ---------------- Dashboard Home ---------------- */}
      <Route path="/dashboard" element={<DashboardHome />} />

      {/* ---------------- Users ---------------- */}
      <Route path="/dashboard/users" element={<Users />} />


      {/* ---------------- CMS — Heroes / Legal ---------------- */}
      <Route path="/dashboard/cms/heroes" element={<CMSHeroes />} />
      <Route path="/dashboard/cms/legal" element={<CMSLegal />} />

      {/* ---------------- CMS — FAQ ---------------- */}
      <Route path="/dashboard/cms/faq" element={<CMSFAQ />} />

      {/* ---------------- CMS — Header & Footer ---------------- */}
      <Route path="/dashboard/cms/header" element={<CMSHeader />} />
      <Route path="/dashboard/cms/footer" element={<CMSFooter />} />

      {/* ---------------- CMS — Contact ---------------- */}
      <Route path="/dashboard/cms/contact" element={<CMSContact />} />

      {/* ---------------- CMS — About ---------------- */}
      <Route path="/dashboard/cms/about" element={<CMSAbout />} />

      {/* ---------------- Admin — Form ---------------- */}
      <Route path="/admin/forms" element={<CMSForms />} />

      {/* ---------------- Services ---------------- */}
      <Route path="/dashboard/services" element={<ServicesManage />} />

      {/* ---------------- Appointments ---------------- */}
      <Route path="/dashboard/appointments" element={<AppointmentsCMS />} />

      {/* ---------------- Careers / Jobs ---------------- */}
      <Route path="/dashboard/careers" element={<CareersCMS />} />
      <Route path="/dashboard/careers/applications" element={<CareerApplicationsCMS />} />

      {/* ---------------- Blog ---------------- */}
      <Route path="/dashboard/blog" element={<BlogManage />} />

      {/* ---------------- Messages ---------------- */}
      <Route path="/dashboard/messages" element={<MessagesDashboard />} />
      <Route path="/dashboard/messages/:id" element={<MessageView />} />

      {/* ---------------- SEO ---------------- */}
      <Route path="/dashboard/seo" element={<SEOSettings />} />

      {/* ---------------- Settings ---------------- */}
      <Route path="/dashboard/settings" element={<Settings />} />

      {/* ---------------- Email ---------------- */}
      <Route path="/dashboard/email-settings" element={<EmailSettings />} />
      <Route path="/dashboard/email-templates" element={<EmailTemplates />} />

    </Route>
  );
}
