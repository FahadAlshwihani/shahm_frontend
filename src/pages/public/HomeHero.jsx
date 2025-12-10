// src/pages/home/HomeHero.jsx
import React from "react";
import "../../styles/home.css";
// لو عندك i18n جاهز تقدر تفعل السطور التالية لإختيار اللغة تلقائياً
// import { useTranslation } from "react-i18next";

export default function HomeHero({ hero }) {
  if (!hero) return null;

  const media = hero.media || [];

  // شعار المنتصف
  const logo = media.find((m) => m.media_type === "logo" && m.is_active);

  // أول صورتين فعّالتين للهيرو (يسار / يمين)
  const images = media
    .filter((m) => m.media_type === "image" && m.is_active)
    .slice(0, 2);

  const leftImage = images[0];
  const rightImage = images[1];

  // لو حاب تستخدم اللغة من i18n فعّل الكود
  // const { i18n } = useTranslation();
  // const isArabic = i18n.language === "ar" || i18n.language.startsWith("ar");
  const isArabic = true; // حالياً نخليها عربي دائماً، تقدر تربطها بالسويتشر لاحقاً

  // عناوين وأزرار من الـ CMS (مع قيم افتراضية من التصميم)
  const leftTitle = isArabic
    ? hero.left_title_ar || "منهج شهم"
    : hero.left_title_en || "Shahm Method";

  const rightTitle = isArabic
    ? hero.right_title_ar || "الخبرات القانونية"
    : hero.right_title_en || "Legal Expertise";

  const leftCta = isArabic
    ? hero.left_button_text_ar || "استكشف"
    : hero.left_button_text_en || "Explore";

  const rightCta = isArabic
    ? hero.right_button_text_ar || "استكشف"
    : hero.right_button_text_en || "Explore";

  // روابط الأزرار: URL مباشر أو صفحة من الـ CMS (slug)
  const leftHref =
    hero.left_button_url ||
    (hero.left_button_page_slug
      ? `/page/${hero.left_button_page_slug}`
      : "#");

  const rightHref =
    hero.right_button_url ||
    (hero.right_button_page_slug
      ? `/page/${hero.right_button_page_slug}`
      : "#");

  const handleNavigate = (href) => {
    if (!href || href === "#") return;
    window.location.href = href;
  };

  return (
    <section className="dual-hero-wrapper">
      {/* القسم الأيسر */}
      <div className="hero-side left-side">
        {leftImage && (
          <>
            <img
              src={leftImage.file_url}
              className="hero-img"
              alt={leftTitle}
            />
            <div className="hero-gray-overlay hero-gray-overlay-left" />

            <div className="hero-content">
              <h2 className="hero-title">{leftTitle}</h2>
              <button
                type="button"
                className="hero-btn"
                onClick={() => handleNavigate(leftHref)}
              >
                {leftCta}
              </button>
            </div>
          </>
        )}
      </div>

      {/* القسم الأيمن */}
      <div className="hero-side right-side">
        {rightImage && (
          <>
            <img
              src={rightImage.file_url}
              className="hero-img"
              alt={rightTitle}
            />
            <div className="hero-gray-overlay hero-gray-overlay-right" />

            <div className="hero-content">
              <h2 className="hero-title">{rightTitle}</h2>
              <button
                type="button"
                className="hero-btn"
                onClick={() => handleNavigate(rightHref)}
              >
                {rightCta}
              </button>
            </div>
          </>
        )}
      </div>

      {/* الشعار + زر + في المنتصف (يُخفى في الموبايل مثل التصميم) */}
<div className="hero-center-logo">

  {logo && (
    <img src={logo.file_url} className="center-logo" alt="Shahm Logo" />
  )}

  <div className="plus-wrapper">

    {/* Hover Right (Arabic) */}
    <div className="hover-area right-area"></div>

    {/* The Circle */}
    <div className="plus-circle">
      <span className="plus-icon">+</span>
    </div>

    {/* Hover Left (English) */}
    <div className="hover-area left-area"></div>

    {/* Text Arabic */}
    <div className="plus-text-ar">اكتشف</div>

    {/* Text English */}
    <div className="plus-text-en">Discover</div>
  </div>

</div>


    </section>
  );
}
