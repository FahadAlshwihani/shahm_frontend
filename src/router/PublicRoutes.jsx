// src/router/PublicRoutes.jsx
//
// ✅ Returns a <React.Fragment> containing all public <Route> elements.
// Called as a function  {PublicRoutes()}  in AppRouter so React Router
// sees plain <Route> nodes — not a custom component wrapper.

import { Navigate, Route } from "react-router-dom";
import MainLayout from "../components/layout/dashboard/MainLayout";

// ── SOON Pages ──────────────────────────────────────────────────────────────────
// import ServiceDetails from "../../soon/ServiceDetail";
// import ServiceAdvisory from "../../soon/ServiceAdvisory";
// import AppointmentBooking from "../../soon/AppointmentBooking";
// import Payment from "../../soon/Payment";
// import Careers from "../../soon/Team/Careers";
// import Team from "../pages/public/Team/Team";
// import Page from "../../soon/Page";

// ── Pages ──────────────────────────────────────────────────────────────────
import Home from "../pages/public/Home";
import Services from "../pages/public/Services/Services";
import Blog from "../pages/public/Blog/Blog";
import BlogDetails from "../pages/public/Blog/BlogDetails";
import LegalPage from "../pages/public/LegalPage";
import Contact from "../pages/public/Contact";
import FAQ from "../pages/public/FAQ";
import About from "../pages/public/About";
import RequestAccessPage from "../pages/public/RequestAccess/RequestAccessPage";

import WhatsAppFloat from "../components/common/WhatsAppFloat"; // adjust path
import BackButton from "../components/common/BackButton";

// Thin wrapper so every public page shares the same navbar / footer + WhatsApp button
const PL = ({ children }) => (
  <MainLayout>
    <BackButton />
    {children}
    <WhatsAppFloat />
  </MainLayout>
);

export default function PublicRoutes() {
  return (
    <>
      {/* ---------------- Home ---------------- */}
      {/* No layout — full-screen hero, but still gets WhatsApp button */}
      <Route path="/" element={<><Home /><WhatsAppFloat /></>} />

      {/* ---------------- Services ---------------- */}
      <Route path="/services" element={<PL><Services /></PL>} />
      {/* <Route path="/services/:slug" element={<PL><ServiceDetails /></PL>} /> */}
      {/* <Route path="/service-advisory" element={<PL><ServiceAdvisory /></PL>} /> */}
      {/* Redirect: /page/service-advisory → /service-advisory */}
      {/* <Route path="/page/service-advisory" element={<Navigate to="/service-advisory" replace />} /> */}


      {/* ---------------- About ---------------- */}
      <Route path="/about" element={<PL><About /></PL>} />

      {/* ---------------- Blog ---------------- */}
      <Route path="/blog" element={<PL><Blog /></PL>} />
      <Route path="/blog/:slug" element={<PL><BlogDetails /></PL>} />
      {/* Redirect: /page/blog → /blog */}
      <Route path="/page/blog" element={<Navigate to="/blog" replace />} />

      {/* ---------------- Legal ---------------- */}
      <Route path="/legal/:slug" element={<PL><LegalPage /></PL>} />

      {/* ---------------- Contact ---------------- */}
      <Route path="/contact" element={<PL><Contact /></PL>} />
      {/* Redirect: /page/contact-methods → /contact */}
      <Route path="/page/contact-methods" element={<Navigate to="/contact" replace />} />

      {/* ---------------- FAQ ---------------- */}
      <Route path="/faq" element={<PL><FAQ /></PL>} />

      {/* ---------------- Access Page ---------------- */}
      <Route path="/request-access/:publicKey" element={<PL><RequestAccessPage /></PL>} />





      {/* ---------------- Appointments & Payment ---------------- */}
      {/* <Route path="/appointments" element={<PL><AppointmentBooking /></PL>} />
      <Route path="/payment" element={<PL><Payment /></PL>} /> */}

      {/* ---------------- Careers ---------------- */}
      {/* <Route path="/careers" element={<PL><Careers /></PL>} /> */}

      {/* ---------------- Team ---------------- */}
      {/* <Route path="/team" element={<PL><Team /></PL>} /> */}

      {/* ---------------- Dynamic CMS Pages ---------------- */}
      {/* <Route path="/page/:slug" element={<PL><Page /></PL>} /> */}

    </>

  );
}