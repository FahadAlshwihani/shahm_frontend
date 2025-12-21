import React, { useEffect, useMemo, useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import "../../styles/Login.css";
import ShahmLogo from "../../images/hover=Default.png";

export default function Login() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const login = useAuthStore((s) => s.login);
  const loading = useAuthStore((s) => s.loading);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const dir = useMemo(
    () => (i18n.language === "ar" ? "rtl" : "ltr"),
    [i18n.language]
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [shake, setShake] = useState(false);
  const [errors, setErrors] = useState({ email: false, password: false });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 450);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const emailError = !email.trim();
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
      <main className={`sh-login-shell ${shake ? "is-shaking" : ""}`}>
        {/* ================= LEFT PANEL ================= */}
        <div className="sh-login-brand">
          {/* 3D Animated Background Grid */}
          <div className="sh-login-grid-bg" aria-hidden="true"></div>

          {/* Floating 3D Elements */}
          <div className="sh-login-3d-elements" aria-hidden="true">
            <div className="sh-3d-cube sh-float-1">
              <div className="cube-face front"></div>
              <div className="cube-face back"></div>
              <div className="cube-face left"></div>
              <div className="cube-face right"></div>
              <div className="cube-face top"></div>
              <div className="cube-face bottom"></div>
            </div>

            <div className="sh-3d-sphere sh-float-2"></div>

            <div className="sh-3d-pyramid sh-float-3">
              <div className="pyramid-face base"></div>
              <div className="pyramid-face side1"></div>
              <div className="pyramid-face side2"></div>
              <div className="pyramid-face side3"></div>
              <div className="pyramid-face side4"></div>
            </div>
          </div>

          {/* Content */}
          <div className="sh-login-brand-content">
            <img
              src={ShahmLogo}
              alt="Shahm Logo"
              className="sh-login-mark"
            />
            <h2 className="sh-login-brandName">{t("login.brand")}</h2>
            <p className="sh-login-brandHint">{t("login.subtitle")}</p>


          </div>
        </div>

        {/* ================= RIGHT PANEL ================= */}
        <section className="sh-login-card">
          <div className="sh-login-formWrapper">
            <div className="sh-login-header">
              <h1 className="sh-login-title">{t("login.title")}</h1>
              <p className="sh-login-desc">{t("login.desc")}</p>
            </div>

            <form onSubmit={submitHandler} noValidate>
              {/* Email */}
              <div className={`sh-login-field ${errors.email ? "has-error" : ""}`}>
                <label className="sh-login-label">{t("login.email")}</label>
                <div className="sh-input-wrapper">
                  <span className="sh-input-icon">📧</span>
                  <input
                    className="sh-login-input"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrors((x) => ({ ...x, email: false }));
                    }}
                    placeholder={t("login.email_ph")}
                  />
                </div>
              </div>

              {/* Password */}
              <div className={`sh-login-field ${errors.password ? "has-error" : ""}`}>
                <label className="sh-login-label">{t("login.password")}</label>
                <div className="sh-input-wrapper">
                  <span className="sh-input-icon">🔒</span>
                  <input
                    className="sh-login-input"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrors((x) => ({ ...x, password: false }));
                    }}
                    placeholder={t("login.password_ph")}
                  />
                  <button
                    type="button"
                    className="sh-password-toggle"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? t("login.hidePassword") : t("login.showPassword")}
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <div className="sh-login-actions">
                <button
                  className="sh-login-btn"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="sh-btn-spinner"></span>
                      {t("login.loading")}
                    </>
                  ) : (
                    <>
                      {t("login.submit")}
                      <span className="sh-btn-arrow">→</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Footer */}
            <div className="sh-login-footer">
              <p className="sh-login-footer-text">
                {t("login.footer_text")}
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}