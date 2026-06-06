// src/pages/Login.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import "../../styles/Login.css";
import LogoForLogin from "../../assets/images/logo/Vector (2).png";

/* ── SVG Icons ───────────────────────────────────────────────── */

const IconEmail = () => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M2 7l8 5 8-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconLock = () => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="4" y="9" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M7 9V6a3 3 0 0 1 6 0v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="10" cy="13.5" r="1" fill="currentColor"/>
  </svg>
);

const IconEyeOpen = () => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M1.5 10S4.5 4 10 4s8.5 6 8.5 6-3 6-8.5 6S1.5 10 1.5 10Z"
      stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
);

const IconEyeClosed = () => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M3 3l14 14M8.5 8.7A2.5 2.5 0 0 0 12.3 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M6.2 6.5C3.9 7.8 2 10 2 10s2.9 6 8 6c1.5 0 2.9-.4 4-1.1"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M11 4.3C15 5.4 18 10 18 10s-.9 1.8-2.3 3.2"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconArrowRight = () => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconArrowLeft = () => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M13 8H3M7 4L3 8l4 4" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/* Globe icon — same as sidebar language button */
const IconGlobe = () => (
  <svg fill="currentColor" viewBox="0 0 256 256" aria-hidden="true">
    <path d="M235.57178,214.21094l-56-112a4.00006,4.00006,0,0,0-7.15528,0l-22.854,45.708a92.04522,92.04522,0,0,1-55.57275-20.5752A99.707,99.707,0,0,0,123.90723,60h28.08691a4,4,0,0,0,0-8h-60V32a4,4,0,0,0-8,0V52h-60a4,4,0,0,0,0,8h91.90772a91.74207,91.74207,0,0,1-27.91895,62.03357A91.67371,91.67371,0,0,1,65.23389,86.667a4,4,0,0,0-7.542,2.668,99.63009,99.63009,0,0,0,24.30469,38.02075A91.5649,91.5649,0,0,1,23.99414,148a4,4,0,0,0,0,8,99.54451,99.54451,0,0,0,63.99951-23.22461,100.10427,100.10427,0,0,0,57.65479,22.97192L116.4165,214.21094a4,4,0,1,0,7.15528,3.57812L138.46631,188H213.522l14.89453,29.78906a4,4,0,1,0,7.15528-3.57812ZM142.46631,180l33.52783-67.05566L209.522,180Z"/>
  </svg>
);

/* ── Quick links — same set as DashboardLayout footer ────────── */
const QUICK_LINKS = [
  { href: "/",             key: "sidebar.footer_link_home" },
  { href: "/services",     key: "sidebar.footer_link_services" },
  { href: "/about",        key: "sidebar.footer_link_about" },
  { href: "/blog",         key: "sidebar.footer_link_blog" },
  { href: "/careers",      key: "sidebar.footer_link_careers" },
  { href: "/contact",      key: "sidebar.footer_link_contact" },
  { href: "/faq",          key: "sidebar.footer_link_faq" },
  { href: "/appointments", key: "sidebar.footer_link_appointments" },
];

/* ── Component ────────────────────────────────────────────────── */

export default function Login() {
  const { t, i18n } = useTranslation();
  const navigate    = useNavigate();

  const login           = useAuthStore((s) => s.login);
  const loading         = useAuthStore((s) => s.loading);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const dir = useMemo(
    () => (i18n.language === "ar" ? "rtl" : "ltr"),
    [i18n.language]
  );

  const [email,        setEmail]        = useState("");
  const [password,     setPassword]     = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [shake,        setShake]        = useState(false);
  const [errors,       setErrors]       = useState({ email: false, password: false });

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard", { replace: true });
  }, [isAuthenticated, navigate]);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 450);
  };

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "en" ? "ar" : "en");
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const emailError    = !email.trim();
    const passwordError = !password.trim();

    setErrors({ email: emailError, password: passwordError });

    if (emailError || passwordError) {
      toast.error(t("login.required"));
      triggerShake();
      return;
    }

    const ok = await login({ email, password });

    if (!ok) {
      toast.error(t("login.invalid"));
      triggerShake();
      setErrors({ email: true, password: true });
    }
  };

  return (
    <div className="sh-login-root" dir={dir}>

      {/* ── Dark glass page background ──────────────────────── */}
      <div className="sh-login-bg" aria-hidden="true" />

      {/* ── Card area ───────────────────────────────────────── */}
      <div className="sh-login-content">
        <div className={`sh-login-card${shake ? " is-shaking" : ""}`}>

          {/* Logo */}
          <div className="sh-login-logo-wrap">
            <img
              src={LogoForLogin}
              alt="Shahm"
              className="sh-login-logo"
            />
          </div>

          {/* Header */}
          <div className="sh-login-header">
            <h1 className="sh-login-title">{t("login.title")}</h1>
            <p className="sh-login-desc">{t("login.desc")}</p>
          </div>

          {/* Form */}
          <form onSubmit={submitHandler} noValidate>

            {/* Email */}
            <div className={`sh-login-field${errors.email ? " has-error" : ""}`}>
              <label className="sh-login-label">{t("login.email")}</label>
              <div className="sh-input-wrapper">
                <span className="sh-input-icon"><IconEmail /></span>
                <input
                  className="sh-login-input"
                  type="email"
                  value={email}
                  autoComplete="email"
                  placeholder={t("login.email_ph")}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((x) => ({ ...x, email: false }));
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div className={`sh-login-field${errors.password ? " has-error" : ""}`}>
              <label className="sh-login-label">{t("login.password")}</label>
              <div className="sh-input-wrapper">
                <span className="sh-input-icon"><IconLock /></span>
                <input
                  className="sh-login-input"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  autoComplete="current-password"
                  placeholder={t("login.password_ph")}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((x) => ({ ...x, password: false }));
                  }}
                />
                <button
                  type="button"
                  className="sh-password-toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? t("login.hidePassword") : t("login.showPassword")}
                >
                  {showPassword ? <IconEyeOpen /> : <IconEyeClosed />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <div className="sh-login-actions">
              <button className="sh-login-btn" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <span className="sh-btn-spinner" />
                    {t("login.loading")}
                  </>
                ) : (
                  <>
                    {t("login.submit")}
                    <span className="sh-btn-arrow">
                      {dir === "rtl" ? <IconArrowLeft /> : <IconArrowRight />}
                    </span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>

      {/* ── Footer — same glass as DashboardLayout footer ─────── */}
      <footer className="sh-login-footer">
        <div className="sh-login-footer-inner">

          {/* Quick links row */}
          <nav className="sh-login-footer-links" aria-label={t("sidebar.footer_quick_links")}>
            {QUICK_LINKS.map((link, i) => (
              <React.Fragment key={link.href}>
                {i > 0 && <span className="sh-login-footer-dot" aria-hidden="true">·</span>}
                <a
                  href={link.href}
                  className="sh-login-footer-link"
                  target="_blank"
                  rel="noreferrer"
                >
                  {t(link.key)}
                </a>
              </React.Fragment>
            ))}
          </nav>

          {/* Copyright + language switcher */}
          <div className="sh-login-footer-bottom">
            <p className="sh-login-footer-copy">
              © {new Date().getFullYear()} Shahm. {t("sidebar.footer_rights")}
            </p>

            <button
              className="sh-login-lang-btn"
              onClick={toggleLanguage}
              type="button"
              aria-label={t("sidebar.change_language")}
            >
              <IconGlobe />
              {i18n.language === "en" ? "عربي" : "EN"}
            </button>
          </div>

        </div>
      </footer>

    </div>
  );
}