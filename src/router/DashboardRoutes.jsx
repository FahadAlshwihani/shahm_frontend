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
import DashboardHome from "../pages/dashboard/DashboardHome";

// ---------------- Users ----------------
import Users from "../pages/dashboard/Users";

// ---------------- CMS ----------------
import CMS_Heroes from "../pages/dashboard/CMS_Heroes";
// import CMS_Pages from "../../soon/CMS_Pages";
import CMS_Legal from "../pages/dashboard/CMS_Legal";
import CMS_FAQ from "../pages/dashboard/CMS_FAQ";
import CMS_Header from "../pages/dashboard/CMS_Header";
import CMS_Footer from "../pages/dashboard/CMS_Footer";
import CMS_Contact from "../pages/dashboard/contact/CMS_Contact";
import CMSAbout from "../pages/dashboard/CMS_About";
import CMSForms from "../pages/dashboard/forms/CMSForms";

// ---------------- Services ----------------
import Services_Manage from "../pages/dashboard/services/Services_Manage";

// ---------------- Appointments ----------------
import AppointmentsCMS from "../pages/dashboard/appointment/AppointmentsCMS";

// ---------------- Careers / Jobs ----------------
import CareersCMS from "../pages/dashboard/jobs/CareersCMS";
import CareerApplicationsCMS from "../pages/dashboard/jobs/CareerApplicationsCMS";

// ---------------- Team ----------------
import Team_Manage from "../pages/dashboard/jobs/Team_Manage";


// ---------------- Blog ----------------
import Blog_Manage from "../pages/dashboard/Blog_Manage";

// ---------------- Messages ----------------
import Messages_Dashboard from "../pages/dashboard/messages/Messages_Dashboard";
import Message_View from "../pages/dashboard/messages/Message_View";

// ---------------- SEO ----------------
import SEO_Settings from "../pages/dashboard/SEO_Settings";

// ---------------- Settings ----------------
import Settings from "../pages/dashboard/Settings_Manage";

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


      {/* ---------------- CMS — Heroes / Pages / Legal ---------------- */}
      <Route path="/dashboard/cms/heroes" element={<CMS_Heroes />} />
      {/* <Route path="/dashboard/cms/pages" element={<CMS_Pages />} /> */}
      <Route path="/dashboard/cms/legal" element={<CMS_Legal />} />

      {/* ---------------- CMS — FAQ ---------------- */}
      <Route path="/dashboard/cms/faq" element={<CMS_FAQ />} />

      {/* ---------------- CMS — Header & Footer ---------------- */}
      <Route path="/dashboard/cms/header" element={<CMS_Header />} />
      <Route path="/dashboard/cms/footer" element={<CMS_Footer />} />

      {/* ---------------- CMS — Contact ---------------- */}
      <Route path="/dashboard/cms/contact" element={<CMS_Contact />} />

      {/* ---------------- CMS — About ---------------- */}
      <Route path="/dashboard/cms/about" element={<CMSAbout />} />

      {/* ---------------- Admin — Form ---------------- */}
      <Route path="/admin/forms" element={<CMSForms />} />

      {/* ---------------- Services ---------------- */}
      <Route path="/dashboard/services" element={<Services_Manage />} />

      {/* ---------------- Appointments ---------------- */}
      <Route path="/dashboard/appointments" element={<AppointmentsCMS />} />

      {/* ---------------- Careers / Jobs ---------------- */}
      <Route path="/dashboard/careers" element={<CareersCMS />} />
      <Route path="/dashboard/careers/applications" element={<CareerApplicationsCMS />} />

      {/* ---------------- Team ---------------- */}
      {/* <Route path="/dashboard/team" element={<Team_Manage />} /> */}

      {/* ---------------- Blog ---------------- */}
      <Route path="/dashboard/blog" element={<Blog_Manage />} />

      {/* ---------------- Messages ---------------- */}
      <Route path="/dashboard/messages" element={<Messages_Dashboard />} />
      <Route path="/dashboard/messages/:id" element={<Message_View />} />

      {/* ---------------- SEO ---------------- */}
      <Route path="/dashboard/seo" element={<SEO_Settings />} />

      {/* ---------------- Settings ---------------- */}
      <Route path="/dashboard/settings" element={<Settings />} />

      {/* ---------------- Email ---------------- */}
      <Route path="/dashboard/email-settings" element={<EmailSettings />} />
      <Route path="/dashboard/email-templates" element={<EmailTemplates />} />

    </Route>
  );
}