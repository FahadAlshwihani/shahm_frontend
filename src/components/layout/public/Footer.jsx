import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getPublicSettings } from "../../../api/publicApi";
import api from "../../../api/axiosClient";
import "../../../styles/footer.css";
import { useTranslation } from "react-i18next";
import SocialMedia from "../../common/SocialMedia";

export default function Footer() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const navigate = useNavigate();
  const location = useLocation();

  const [footerData, setFooterData] = useState(null);
  const [generalSettings, setGeneralSettings] = useState(null);
  const [email, setEmail] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [openTrees, setOpenTrees] = useState({});
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  const toggleTree = (id) => setOpenTrees((p) => ({ ...p, [id]: !p[id] }));

  const loadData = useCallback(async () => {
    try {
      const res = await api.get("cms/public/home/");
      if (res.data?.footer) setFooterData(res.data.footer);
    } catch (err) {
      console.error("Footer load error:", err);
    }
    try {
      const res = await getPublicSettings();
      setGeneralSettings(res.data);
    } catch { }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const columns = footerData?.columns || [];
  const ctaButtons = useMemo(() => (footerData?.cta_buttons || []).filter((b) => b.is_active).slice(0, 3), [footerData]);
  const settings = footerData?.settings || null;
  const footerLogo = isAr ? settings?.logo_ar : settings?.logo_en;
  const vatLogo = settings?.vat_logo;
  const newsletterTitle = isAr ? settings?.newsletter_title_ar : settings?.newsletter_title_en || settings?.newsletter_title_ar;
  const copyright = (isAr ? settings?.copyright_ar : settings?.copyright_en || settings?.copyright_ar) || t("footer.copyright", { year: new Date().getFullYear() });
  const newsletterCol = useMemo(() => columns.find((c) => c.key === "newsletter"), [columns]);
  const contentColumns = useMemo(() => columns.filter((c) => c.key !== "newsletter" && c.key !== "social" && c.key !== "sitemap"), [columns]);

  const subscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    try {
      await api.post("messaging/subscribe/", { email });
      setEmail("");
      alert(isAr ? "تم الاشتراك ✅" : "Subscribed ✅");
    } catch (err) {
      console.error("Subscribe error:", err?.response?.data || err.message);
      alert(isAr ? "فشل الاشتراك ❌" : "Failed ❌");
    }
  };

  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const linkMap = useMemo(() => flattenLinks(columns), [columns]);

  const breadcrumbs = useMemo(() => {
    const parts = location.pathname.split("/").filter(Boolean);
    const crumbs = [{ label: t("footer.home"), path: "/" }];
    let acc = "";
    parts.forEach((seg) => {
      acc += `/${seg}`;
      const match = linkMap[seg];
      // Priority: CMS link label → i18n routes map → raw slug
      const translatedSeg = t(`footer.routes.${seg}`, seg);
      const label = isAr
        ? match?.label_ar || translatedSeg
        : match?.label_en || match?.label_ar || translatedSeg;
      crumbs.push({ label, path: acc });
    });
    return crumbs;
  }, [location.pathname, linkMap, isAr, t]);

  function flattenLinks(columns = []) {
    const map = {};
    function walk(list) {
      list.forEach((item) => {
        if (item.slug) map[item.slug] = item;
        if (item.children) walk(item.children);
      });
    }
    columns.forEach((col) => walk(col.links || []));
    return map;
  }

  function FooterTree({ item }) {
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openTrees[item.id];
    const isDisabled = item.is_coming_soon || item.is_active === false;
    const label = isAr ? item.label_ar || item.display_label : item.label_en || item.label_ar || item.display_label;

    const handleLinkClick = (e) => {
      if (isDisabled) {
        e.preventDefault();
        return;
      }
      if (item.resolved_url) {
        e.preventDefault();
        navigate(item.resolved_url);
      }
    };

    return (
      <li>
        {hasChildren ? (
          <div className={`footer-tree-toggle${isDisabled ? " footer-link-disabled" : ""}`} onClick={() => toggleTree(item.id)}>
            <span>{label}</span>
            <svg className={`footer-chevron-down${isOpen ? " open" : ""}`} width="11" height="7" viewBox="0 0 11 7" fill="none">
              <path d="M1 1L5.5 6L10 1" stroke="#353C3C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        ) : (
          <a href={item.resolved_url || "#"} onClick={handleLinkClick} className={isDisabled ? "footer-link-disabled" : ""} aria-disabled={isDisabled || undefined}>
            {label}
          </a>
        )}
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

  const isFormValid = email.trim().length > 0;

  return (
    <div className="footer-wrapper">
      <div className="footer-card">
        <div className="footer-meta-row">
          <nav className="footer-breadcrumb" aria-label="breadcrumb">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={crumb.path}>
                {idx > 0 && <span className="footer-breadcrumb-sep">\</span>}
                {idx < breadcrumbs.length - 1 ? (
                  <button className="footer-breadcrumb-link" onClick={() => navigate(crumb.path)}>
                    {crumb.label}
                  </button>
                ) : (
                  <span className="footer-breadcrumb-current">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
          {vatLogo && <img src={vatLogo} alt="VAT" className="footer-vat-logo" />}
        </div>

        {ctaButtons.length > 0 && (
          <div className="footer-cta-section">
            {ctaButtons.map((cta, idx) => {
              const title = isAr ? cta.title_ar : cta.title_en || cta.title_ar;
              const desc = isAr ? cta.description_ar : cta.description_en || cta.description_ar;
              return (
                <React.Fragment key={cta.id}>
                  {idx > 0 && <div className="footer-cta-divider" aria-hidden="true" />}
                  <button className="footer-cta-item" onClick={() => cta.resolved_url && navigate(cta.resolved_url)} disabled={!cta.resolved_url}>
                    <div className="footer-cta-text">
                      <span className="footer-cta-title">{title}</span>
                      <span className="footer-cta-desc">{desc}</span>
                    </div>
                    <svg className="footer-cta-arrow" width="7" height="11" viewBox="0 0 7 11" fill="none">
                      <path d="M1 1L6 5.5L1 10" stroke="#343C3C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </React.Fragment>
              );
            })}
          </div>
        )}

        <div className="footer-main-row">
          <div className="footer-newsletter-section">
            <h3 className="footer-newsletter-title">{newsletterTitle || (newsletterCol ? (isAr ? newsletterCol.title_ar : newsletterCol.title_en || newsletterCol.title_ar) : "")}</h3>
            <form className="footer-newsletter" onSubmit={subscribe}>
              <div className="footer-input-wrapper">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} onFocus={() => setEmailFocused(true)} onBlur={() => setEmailFocused(false)} required className={email || emailFocused ? "has-value" : ""} />
                <label className={email || emailFocused ? "floating" : ""}>{t("footer.newsletter_placeholder")}</label>
              </div>
              <button type="submit" className={`confirm-btn ${isFormValid ? "active" : "disabled"}`} disabled={!isFormValid}>
                {t("footer.newsletter_confirm")}
              </button>
            </form>
          </div>

          <div className="footer-columns">
            {contentColumns.map((col) => {
              const colTitle = isAr ? col.title_ar : col.title_en || col.title_ar;
              return (
                <div className="footer-column" key={col.id}>
                  <h3 className={`footer-title${isAr ? "" : " en"}`}>{colTitle}</h3>
                  <ul className="footer-links">
                    {(col.links || []).map((link) => (
                      <FooterTree key={link.id} item={link} />
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        <div className={`footer-lang-row${isMobile ? " footer-lang-row--mobile" : ""}`}>
          {isMobile ? (
            /* ── MOBILE: label left, language+chevron right ── */
            <>
              <span className="footer-lang-label">{t("footer.choose_language")}</span>
              <div className="footer-lang-current-wrapper">
                <button className="footer-lang-current" onClick={() => setShowLangDropdown((v) => !v)} aria-expanded={showLangDropdown}>
                  {isAr ? "العربية (ar)" : "English (en)"}
                  <span className="footer-lang-chevron" aria-hidden="true">›</span>
                </button>
                {showLangDropdown && (
                  <div className="footer-lang-dropdown">
                    <button className={isAr ? "active" : ""} onClick={() => { i18n.changeLanguage("ar"); setShowLangDropdown(false); }}>العربية (ar)</button>
                    <button className={!isAr ? "active" : ""} onClick={() => { i18n.changeLanguage("en"); setShowLangDropdown(false); }}>English (en)</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* ── DESKTOP: compact inline group, floats to correct side ── */
            <div className="footer-lang-group">
              <svg className="footer-lang-icon" width="22" height="20" viewBox="0 0 22 20" fill="none">
                <path d="M3 5h6M6 3v2M5 5c0 2.5 1.5 4.5 3 6" stroke="#7C8D8D" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M10 17l4-10 4 10M11.5 13.5h5" stroke="#7C8D8D" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="footer-lang-label">{t("footer.choose_language")}</span>
              <div className="footer-lang-current-wrapper">
                <button className="footer-lang-current" onClick={() => setShowLangDropdown((v) => !v)} aria-expanded={showLangDropdown}>
                  {isAr ? "العربية (ar)" : "English (en)"}
                  <span className="footer-lang-chevron" aria-hidden="true">›</span>
                </button>
                {showLangDropdown && (
                  <div className="footer-lang-dropdown">
                    <button className={isAr ? "active" : ""} onClick={() => { i18n.changeLanguage("ar"); setShowLangDropdown(false); }}>العربية (ar)</button>
                    <button className={!isAr ? "active" : ""} onClick={() => { i18n.changeLanguage("en"); setShowLangDropdown(false); }}>English (en)</button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="footer-bottom">

          <SocialMedia settings={generalSettings} isMobile={isMobile} />
          
          <p className="footer-copy">{copyright}</p>
          <div className="footer-logo">{footerLogo ? <img src={footerLogo} alt="Shahm Logo" /> : <span className="footer-logo-mark">{isAr ? "شهم" : "Shahm"}</span>}</div>
        </div>
      </div>
    </div>
  );
}