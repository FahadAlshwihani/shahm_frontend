// src/App.jsx
// WhatsAppFloat is rendered here so it appears on every public page.

import { useEffect } from "react";
import AppRouter from "./router/AppRouter";
import { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "./store/useAuthStore";
import { startIdleTimer, stopIdleTimer } from "./utils/idleSessionManager";
import { usePublicStore } from "./store/usePublicStore";

function App() {
  const { i18n } = useTranslation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);
  const initializePublicData = usePublicStore(
    (s) => s.initialize
  );

  /* ================= RTL / LTR sync ================= */
  useEffect(() => {
    const dir = i18n.language === "ar" ? "rtl" : "ltr";
    document.documentElement.dir = dir;
    document.documentElement.lang = i18n.language;
    document.body.dir = dir;
    document.body.classList.remove("rtl", "ltr");
    document.body.classList.add(dir);
  }, [i18n.language]);

  /* ================= Idle logout ================= */
  useEffect(() => {
    if (isAuthenticated) {
      startIdleTimer(() => { logout(); });
    } else {
      stopIdleTimer();
    }
    return () => { stopIdleTimer(); };
  }, [isAuthenticated, logout]);

  useEffect(() => {
    initializePublicData();
  }, []);

  return (
    <>
      <AppRouter />

      {/*
        WhatsApp floating button — outside the router so it persists
        across all page navigations without remounting.
        Position + behaviour controlled entirely in whatsapp-float.css.
      */}
      <Toaster
        position="top-center"
        containerStyle={{ zIndex: 99999 }} />
    </>
  );
}

export default App;