import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getPublicServiceDetail, getPublicServices } from "../../api/publicApi";
import { useTranslation } from "react-i18next";
import ServiceIcon from "../../components/ServiceIcon";
import AwardStar from "../../assets/images/icons/award_star.svg";
import AwardStarHover from "../../assets/images/icons/award_star (1).svg";
import "../../styles/pages/serviceDetails.css";
import ServiceRequestModal from "./ServiceAdvisoryAbout";

export default function ServiceDetails() {
  const { slug } = useParams();
  const { i18n, t } = useTranslation();
  const isEn = i18n.language === "en";
  const isRTL = i18n.dir() === "rtl";

  const [service, setService] = useState(null);
  const [related, setRelated] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [expanded, setExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await getPublicServiceDetail(slug);
      setService(res.data);

      const all = await getPublicServices();
      const filtered = all.data
        .filter(s => s.slug !== slug)
        .slice(0, 4);
      setRelated(filtered);
    }
    load();
  }, [slug]);

  useEffect(() => {
    const body = document.body;
    const header = document.querySelector("header.top-navbar");
    const hero = document.querySelector(".service-details-hero-image");

    if (!header || !hero) return;

    body.classList.add("service-page-active");

    const isMobile = () => window.matchMedia("(max-width: 768px)").matches;

    // العناصر اللي نلوّنها فقط (لا تلمس overlay حق البحث لأنه خارج الهيدر)
    const getTargets = () =>
      header.querySelectorAll(
        ".top-navbar-search svg, .navbar-toggle span, .top-navbar-logo img, .top-navbar-logo svg"
      );

    const setWhite = (el) => el.classList.add("nav-over-hero");
    const reset = (el) => el.classList.remove("nav-over-hero");

    const run = () => {
      const heroRect = hero.getBoundingClientRect();
      const heroVisible = heroRect.bottom > 65; // 65 ارتفاع الهيدر

      // background behavior
      if (heroVisible) body.classList.add("service-navbar-light");
      else body.classList.remove("service-navbar-light");

      const targets = getTargets();

      // 📱 Mobile: إذا الهيرو ظاهر خل كل شيء أبيض
      if (isMobile()) {
        targets.forEach((el) => (heroVisible ? setWhite(el) : reset(el)));
        return;
      }

      // 🖥 Desktop: أبيض فقط للعناصر اللي فعليًا فوق مساحة الصورة
      targets.forEach((el) => {
        const r = el.getBoundingClientRect();

        const overlaps =
          r.right > heroRect.left &&
          r.left < heroRect.right &&
          r.bottom > heroRect.top &&
          r.top < heroRect.bottom;

        if (heroVisible && overlaps) setWhite(el);
        else reset(el);
      });
    };

    run();
    window.addEventListener("scroll", run, { passive: true });
    window.addEventListener("resize", run);

    return () => {
      body.classList.remove("service-page-active");
      body.classList.remove("service-navbar-light");
      window.removeEventListener("scroll", run);
      window.removeEventListener("resize", run);
      getTargets().forEach((el) => reset(el));
    };
  }, []);

  if (!service) return null;

  const getTabContent = () => {
    switch (activeTab) {
      case "overview":
        return isEn ? service.overview_en : service.overview_ar;
      case "who":
        return isEn ? service.who_for_en : service.who_for_ar;
      case "scope":
        return isEn ? service.scope_en : service.scope_ar;
      case "deliverables":
        return isEn ? service.deliverables_en : service.deliverables_ar;
      case "how":
        return isEn ? service.how_it_works_en : service.how_it_works_ar;
      case "faq":
        return service.faq_data || [];
      default:
        return "";
    }
  };

  const content = getTabContent();

  let words = [];
  let shortText = "";

  if (activeTab !== "faq" && typeof content === "string") {
    words = content.split(" ");
    shortText = words.slice(0, 30).join(" ");
  }
  return (
    <div className="service-details-page" dir={isRTL ? "rtl" : "ltr"}>

      {/* ================= HERO SECTION (ROW 1) ================= */}
      <div className="service-details-hero">

        {/* LEFT: Hero Image */}
        <div className="service-details-hero-image">
          {service.cover_image && (
            <img
              src={service.cover_image}
              alt={isEn ? service.title_en : service.title_ar}
            />
          )}
        </div>

        {/* RIGHT: Content */}
        <div className="service-details-hero-content">

          <h1 className="service-details-title">
            {isEn ? service.title_en : service.title_ar}
          </h1>

          <div className="service-details-category">
            {isEn
              ? service.area_data?.name_en
              : service.area_data?.name_ar}
          </div>

          <div className="service-details-divider"></div>

          <div className="service-details-meta-row">

            <div className="service-details-reference">
              {service.icon && (
                <ServiceIcon name={service.icon} />
              )}

              <span className="service-details-reference-label">
                {t("serviceDetails.reference_id")}:
              </span>

              <span className="service-details-reference-id">
                {service.serial_number}
              </span>
            </div>

            {service.is_most_requested && (
              <img
                src={AwardStar}
                alt="Most Requested"
                className="service-details-most-requested-icon"
              />
            )}
          </div>

          <button
            className="service-details-request-btn"
            onClick={() => setIsModalOpen(true)}
          >
            {t("serviceDetails.request_service")}
          </button>

          <p className="service-details-note">
            <span>{t("serviceDetails.note")}:</span> {t("serviceDetails.note_text")}
          </p>

          <p className="service-details-privacy">
            {t("serviceDetails.privacy_text")}{" "}
            <span className="service-details-privacy-link">
              {t("serviceDetails.privacy_statement")}
            </span>.
          </p>

          {/* TABS */}
          <div className="service-details-tabs">
            {[
              { key: "overview", label: t("serviceDetails.tab_overview") },
              { key: "who", label: t("serviceDetails.tab_who") },
              { key: "scope", label: t("serviceDetails.tab_scope") },
              { key: "deliverables", label: t("serviceDetails.tab_deliverables") },
              { key: "how", label: t("serviceDetails.tab_how") },
              { key: "faq", label: t("serviceDetails.tab_faq") }
            ].map(tab => (
              <button
                key={tab.key}
                className={`service-details-tab-btn ${activeTab === tab.key ? "active" : ""}`}
                onClick={() => {
                  setActiveTab(tab.key);
                  setExpanded(false);
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="service-details-divider"></div>

          <div className="service-details-tab-content">

            {activeTab === "faq" ? (
              service.faq_data && service.faq_data.length > 0 ? (
                service.faq_data.map((faq) => (
                  <div key={faq.id} style={{ marginBottom: "20px" }}>
                    <strong>
                      {isEn ? faq.question_en : faq.question_ar}
                    </strong>
                    <p>
                      {isEn ? faq.answer_en : faq.answer_ar}
                    </p>
                  </div>
                ))
              ) : (
                <p>{t("serviceDetails.no_faq")}</p>
              )
            ) : (
              <>
                {expanded ? content : shortText}
                {words.length > 30 && (
                  <button
                    className="service-details-see-more-btn"
                    onClick={() => setExpanded(!expanded)}
                  >
                    {expanded
                      ? t("serviceDetails.see_less")
                      : t("serviceDetails.see_more")}
                  </button>
                )}
              </>
            )}

          </div>

        </div>
      </div>

      {/* ================= RELATED SERVICES (ROW 2) ================= */}
      <div className="service-details-related-section">
        <h2 className="service-details-related-title">
          {t("serviceDetails.related_services")}
        </h2>

        <div className="service-details-related-grid">
          {related.map(item => (
            <div key={item.id} className="service-details-card-wrapper">

              <Link
                to={`/services/${item.slug}`}
                className="service-details-card-link"
              >
                <div className="service-details-card">

                  <div className="service-details-card-header">

                    {/* Serial Number - LEFT */}
                    <span className="service-details-card-reference-left">
                      {item.serial_number || "L-SER-001"}
                    </span>

                    {/* Icon - CENTER */}
                    <div className="service-details-card-icon">
                      <ServiceIcon name={item.icon || "gavel"} />
                    </div>

                    {/* Most Requested - RIGHT */}
                    {item.is_most_requested && (
                      <div className="service-details-badge-most-requested-right">
                        <img
                          src={AwardStar}
                          alt="Most Requested"
                          className="service-details-star-default"
                        />
                        <img
                          src={AwardStarHover}
                          alt="Most Requested Hover"
                          className="service-details-star-hover"
                        />
                      </div>
                    )}
                  </div>

                  <h3 className="service-details-card-title">
                    {isEn ? item.title_en : item.title_ar}
                  </h3>

                  <div className="service-details-card-divider"></div>

                  <p className="service-details-card-description">
                    {isEn
                      ? item.description_en
                      : item.description_ar}
                  </p>

                </div>
              </Link>

              {/* OUTSIDE FOOTER */}
              <div className="service-details-card-outside">

                <Link
                  to={`/services/${item.slug}`}
                  className="service-details-card-footer-button"
                >
                  {t("serviceDetails.request_service")}
                </Link>

                <span className="service-details-card-footer-type">
                  {isEn
                    ? item.area_data?.name_en
                    : item.area_data?.name_ar}
                </span>

              </div>
            </div>
          ))}
        </div>
      </div>

      <ServiceRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        preSelectedService={service}
      />

    </div>
  );
}