import React from "react";
import { useTranslation } from "react-i18next";

import ServiceAdvisoryCMS from "./ServiceAdvisoryCMS";
import ServiceAdvisoryRequests from "./ServiceAdvisoryRequests";
import ServiceAdvisoryServices from "./ServiceAdvisoryServices";
import ServicePracticeAreas from "./ServicePracticeAreas";

import "../../styles/CMS_SERVICE_ADVISORY.css";

export default function Services_Manage() {
  const { t } = useTranslation();

  return (
    <div className="service-cms-container">
      {/* ===== PAGE HEADER ===== */}
      <div className="service-cms-header">
        <h1 className="service-cms-title">
          {t("cms.service_advisory.title")}
        </h1>
        <p className="service-cms-subtitle">
          {t("cms.service_advisory.subtitle")}
        </p>
      </div>

      {/* ===== CMS CONTENT ===== */}
      <ServiceAdvisoryCMS />

      <div className="service-divider" />

      <ServicePracticeAreas />

      <div className="service-divider" />

      <ServiceAdvisoryServices />
      


      {/* ===== REQUESTS ===== */}
      <ServiceAdvisoryRequests />
    </div>
  );
}

