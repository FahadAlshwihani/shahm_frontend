import React from "react";
import AppRouter from "./router/AppRouter";
import Footer from "./components/layout/Footer";
import { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";

function App() {
  const { i18n } = useTranslation();

  return (
    <div dir={i18n.language === "ar" ? "rtl" : "ltr"}>
      <AppRouter />
      <Footer />
      <Toaster position="top-center" />
    </div>
  );
}

export default App;
