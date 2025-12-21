import React, { useEffect, useState, useMemo } from "react";
import { getPublicFooter, getPublicSettings } from "../../api/publicApi";
import api from "../../api/axiosClient";
import "../../styles/footer.css";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  const [columns, setColumns] = useState([]);
  const [settings, setSettings] = useState(null);
  const [email, setEmail] = useState("");
  const [openTrees, setOpenTrees] = useState({});
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  const toggleTree = (id) =>
    setOpenTrees((p) => ({ ...p, [id]: !p[id] }));

  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
  };

  /* ================= Load Data ================= */
  useEffect(() => {
    getPublicFooter().then((res) => setColumns(res.data));
    getPublicSettings().then((res) => setSettings(res.data));
  }, []);

  /* ================= Footer Logo & Social ================= */
  const { footerLogo, socialLinks } = useMemo(() => {
    const followCol = columns.find((c) => c.title_ar === "تابعنا");
    if (!followCol) return { footerLogo: null, socialLinks: [] };

    const logo = followCol.links?.find((l) => l.media_type === "footer_logo");
    const socials =
      followCol.links?.filter((l) => l.media_type !== "footer_logo") || [];

    return {
      footerLogo: logo?.file_url || null,
      socialLinks: socials,
    };
  }, [columns]);

  /* ================= Subscribe ================= */
  const subscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      const res = await api.post("messaging/subscribe/", { email });
      console.log("SUBSCRIBE RES:", res.data);
      setEmail("");
      alert("تم الاشتراك ✅");
    } catch (err) {
      console.error("SUBSCRIBE ERR:", err?.response?.data || err.message);
      alert("فشل الاشتراك ❌ شوف console");
    }
  };

  const year = new Date().getFullYear();

  /* ================= Column Order ================= */
  const columnOrder = [
    "عن شهم",
    "خدمات العملاء",
    "الأخلاقيات والامتثال",
    "الشروط القانونية",
  ];

  const sitemapColumn = useMemo(
    () => columns.find((c) => c.title_ar === "خريطة الموقع"),
    [columns]
  );

  const sortedColumns = useMemo(
    () =>
      columnOrder
        .map((t) => columns.find((c) => c.title_ar === t))
        .filter(Boolean),
    [columns]
  );

const newsletterColumn = useMemo(
  () =>
    columns.find(
      (c) => c.title_ar === "أرغب في تلقّي كل جديد من أخبار شهم"
    ),
  [columns]
);


  /* ================= Tree Item ================= */
function FooterTree({ item }) {
  const hasChildren = item.children?.length > 0;
  const label = isAr
    ? item.label_ar
    : item.label_en || item.label_ar;
  
  const isOpen = openTrees[item.id];

  return (
    <li>
      <div
        className="footer-tree-toggle"
        onClick={() => hasChildren && toggleTree(item.id)}
      >
        {item.url ? <a href={item.url}>{label}</a> : <span>{label}</span>}

        {hasChildren && (
          <span className={`arrow ${isOpen ? "open" : ""}`}>
            {isAr ? "▾" : "▾"}
          </span>
        )}
      </div>

      {hasChildren && isOpen && (
        <ul className="footer-tree-content">
          {item.children.map((c) => (
            <FooterTree key={c.id} item={c} />
          ))}
        </ul>
      )}
    </li>
  );
}

  /* ================= Render ================= */
  return (
    <footer className={`site-footer ${highContrast ? 'high-contrast-mode' : ''}`}>
      <div className="footer-card">
        {/* ================= ROW 1 ================= */}
        <div className="footer-main-row">
          {/* ===== Newsletter ===== */}
          {newsletterColumn && (
            <div className="footer-newsletter-section">
              <h3 className="footer-newsletter-title">
                {isAr
                  ? newsletterColumn.title_ar
                  : newsletterColumn.title_en || newsletterColumn.title_ar}
              </h3>

              <form className="footer-newsletter" onSubmit={subscribe}>
                <input
                  type="email"
                  placeholder={t("footer.newsletter_placeholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="confirm-btn">
                  {t("footer.newsletter_confirm")}
                </button>
              </form>


              {/* High Contrast Toggle */}
              <div className="footer-contrast-toggle">
                <span className="footer-contrast-label">
                  {t("footer.high_contrast_label")}
                </span>
                <button
                  className={`ios-toggle ${highContrast ? 'active' : ''}`}
                  onClick={toggleHighContrast}
                  aria-label={t("footer.high_contrast_toggle")}
                >
                  <span className="ios-toggle-knob"></span>
                </button>
              </div>

            </div>
          )}

          {/* ===== Columns ===== */}
          <div className="footer-columns">
            {sortedColumns.map((col) => {
              const isLegal = col.title_ar === "الشروط القانونية";

              const mergedLinks =
                isLegal && sitemapColumn
                  ? [
                    ...col.links,
                    {
                      id: "legal-sitemap",
                      label_ar: "خريطة الموقع",
                      label_en: "Sitemap",
                      url: "",
                      children: sitemapColumn.links || [],
                    },
                  ]
                  : col.links;

              return (
                <div className="footer-column" key={col.id}>
                  <h3 className="footer-title">
                    {isAr
                      ? col.title_ar
                      : col.title_en || col.title_ar}
                  </h3>

                  <ul className="footer-links">
                    {mergedLinks?.map((l) => (
                      <FooterTree key={`${col.id}-${l.id}`} item={l} />
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= ROW 2 ================= */}
        <div className="footer-bottom">
          {/* Follow Us */}
          <div className="footer-social">
            <span className="footer-social-label">
              {t("footer.follow_us")}
            </span>

            {socialLinks.map((s) => (
              <a key={s.id} href={s.url} target="_blank" rel="noreferrer">
                {isAr ? s.label_ar : s.label_en || s.label_ar}
              </a>
            ))}
          </div>

          {/* Logo */}
          <div className="footer-logo">
            {footerLogo ? (
              <img src={footerLogo} alt="Shahm Logo" />
            ) : (
              <span className="footer-logo-mark">
                {isAr ? "شهم" : "Shahm"}
              </span>
            )}
          </div>

          {/* Language & High Contrast Toggle */}
          <div className="footer-location-lang">
            <div
              className="footer-location"
              onClick={() => setShowLangDropdown(!showLangDropdown)}
            >
              <span className="footer-location-label">
                {t("footer.country_label")}
              </span>

              <span className="footer-location-value">
                {settings?.country || t("footer.country_default")} (
                {isAr ? t("footer.language_ar") : t("footer.language_en")})
              </span>

              <span className="footer-location-arrow">
                ▾
              </span>
            </div>


            {showLangDropdown && (
              <div className="footer-lang-dropdown">
                <button
                  className={isAr ? "active" : ""}
                  onClick={() => {
                    i18n.changeLanguage("ar");
                    setShowLangDropdown(false);
                  }}
                >
                  {t("footer.language_ar")}
                </button>
                <button
                  className={!isAr ? "active" : ""}
                  onClick={() => {
                    i18n.changeLanguage("en");
                    setShowLangDropdown(false);
                  }}
                >
                  {t("footer.language_en")}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ================= COPYRIGHT ================= */}
        <div className="footer-copy">
          {t("footer.copyright", { year })}
        </div>
      </div>
    </footer>
  );
}