// src/pages/public/Services.jsx
import React, { useEffect, useState } from "react";
import {
  getPublicServices,
  getPublicServiceArea,
  getPublicAreas
} from "../../../api/publicApi";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../../../styles/pages/services.css";
import ServiceIcon from "../../../components/icons/ServiceIcon";
import AwardStar from "../../../assets/images/icons/award_star.svg";
import AwardStarHover from "../../../assets/images/icons/award_star (1).svg";

export default function Services() {
  const { i18n, t } = useTranslation();
  const isEn = i18n.language === "en";
  const isRTL = i18n.dir() === "rtl";

  const [areas, setAreas] = useState([]);
  const [activeArea, setActiveArea] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [allServices, setAllServices] = useState([]);

  const filteredServices = services.filter((s) =>
    (s.title_ar + s.title_en)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  useEffect(() => {
    async function loadAreas() {
      const areasRes = await getPublicAreas();
      const areasData = areasRes.data || [];
      setAreas(areasData);

      // اجلب كل الخدمات مرة وحدة
      const servicesRes = await getPublicServices();
      const all = servicesRes.data || [];

      setAllServices(all);     // ✅ ثابت للعداد
      setServices(all);        // ✅ المعروض حاليا (الكل)

      setActiveArea("all");
      setLoading(false);
    }

    loadAreas();
  }, []);

  const handleAreaClick = async (slug) => {
    setActiveArea(slug);

    if (slug === "all") {
      setServices(allServices); // ✅ بدون API call
    } else {
      const res = await getPublicServiceArea(slug);
      setServices(res.data.services || []);
    }
  };

  return (
    <div className="services-page" dir={isRTL ? "rtl" : "ltr"}>

      {/* ================= HEADER SECTION ================= */}
      <div className="services-header">
        <h1 className="services-title">{t("services.title")}</h1>
        <p className="services-description">{t("services.description")}</p>
      </div>

      {/* Full Width Divider */}
      <div className="services-header-divider"></div>

      {/* ================= MAIN LAYOUT ================= */}
      <div className="services-layout">
        {/* ================= SIDEBAR (LEFT COLUMN) ================= */}
        <aside className="services-sidebar">
          {/* Category Filters */}
          <div className="services-filters">

            {/* ===== FILTER: ALL ===== */}
            <div
              className={`services-filter-item ${activeArea === "all" ? "active" : ""
                }`}
              onClick={() => handleAreaClick("all")}
            >
              <div className="services-filter-icon">
                <ServiceIcon name="layers" />
              </div>

              <span className="services-filter-text">
                {isEn ? "All Services" : "الكل"}
              </span>

              <span className="services-filter-count">
                {allServices.length}
              </span>
            </div>

            {/* ===== AREAS ===== */}
            {areas.map((area) => (
              <div
                key={area.id}
                className={`services-filter-item ${activeArea === area.slug ? "active" : ""
                  }`}
                onClick={() => handleAreaClick(area.slug)}
              >
                <div className="services-filter-icon">
                  <ServiceIcon name={area.icon || "gavel"} />
                </div>

                <span className="services-filter-text">
                  {isEn ? area.name_en : area.name_ar}
                </span>

                <span className="services-filter-count">
                  {area.services_count || 0}
                </span>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="services-sidebar-divider"></div>

          {/* Search Bar */}
          <div className="services-search-wrapper">
            <input
              type="text"
              className="services-search-input"
              placeholder={t("services.search_placeholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <svg className="services-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Most Requested Info */}
          <div className="services-most-requested-info">

            <div className="services-most-requested-icon">
              <img
                src={AwardStar}
                alt="Most Requested"
                className="services-star-icon-black"
              />
            </div>

            <div className="services-most-requested-content">
              <h4 className="services-most-requested-title">
                {t("services.most_requested")}
              </h4>

              <p className="services-most-requested-description">
                {t("services.most_requested_description")}
              </p>
            </div>

          </div>
        </aside>

        {/* ================= SERVICES GRID (RIGHT COLUMN) ================= */}
        <main className="services-grid">
          {loading && <p className="services-loading">{t("common.loading")}</p>}

          {!loading &&
            filteredServices.map((service) => (
              <div key={service.id} className="services-card-wrapper">

                <Link
                  to={`/services/${service.slug}`}
                  className="services-card-link"
                >
                  <div className="services-card">

                    <div className="services-card-header">

                      {/* SERIAL NUMBER - يصير يسار */}
                      <span className="services-card-reference-left">
                        {service.serial_number || "L-SER-001"}
                      </span>

                      {/* ICON */}
                      <div className="services-card-icon">
                        {service.icon ? (
                          <ServiceIcon name={service.icon} />
                        ) : (
                          <svg width="32" height="30" viewBox="0 0 24 24" fill="none">
                            <path d="M12 3L4 9V21H20V9L12 3Z" stroke="currentColor" strokeWidth="1.5" />
                          </svg>
                        )}
                      </div>

                      {/* MOST REQUESTED - يصير يمين */}
                      {service.is_most_requested && (
                        <div className="services-badge-most-requested-right">
                          <img
                            src={AwardStar}
                            alt="Most Requested"
                            className="star-default"
                          />
                          <img
                            src={AwardStarHover}
                            alt="Most Requested Hover"
                            className="star-hover"
                          />
                        </div>
                      )}
                    </div>

                    <h3 className="services-card-title">
                      {isEn ? service.title_en : service.title_ar}
                    </h3>

                    <div className="services-card-divider"></div>

                    <p className="services-card-description">
                      {isEn
                        ? service.description_en
                        : service.description_ar}
                    </p>

                  </div>
                </Link>

                {/* OUTSIDE FOOTER */}
                <div className="services-card-outside">

                  <Link
                    to={`/services/${service.slug}`}
                    className="services-card-footer-button"
                  >
                    {t("services.request_service")}
                  </Link>

                  <span className="services-card-footer-type">
                    {isEn
                      ? service.area_data?.name_en
                      : service.area_data?.name_ar}
                  </span>

                </div>
              </div>
            ))}
        </main>
      </div>
    </div>
  );
}