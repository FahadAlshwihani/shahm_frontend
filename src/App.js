import { useEffect } from "react";
import AppRouter from "./router/AppRouter";
import Footer from "./components/layout/Footer";
import { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "./store/useAuthStore";
import { startIdleTimer, stopIdleTimer } from "./utils/idleSessionManager";

function App() {
  const { i18n } = useTranslation();

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    if (isAuthenticated) {
      startIdleTimer(() => {
        logout();
      });
    } else {
      stopIdleTimer();
    }

    return () => {
      stopIdleTimer();
    };
  }, [isAuthenticated, logout]);

  return (
    <div dir={i18n.language === "ar" ? "rtl" : "ltr"}>
      <AppRouter />
      <Footer />
      <Toaster position="top-center" />
    </div>
  );
}

export default App;