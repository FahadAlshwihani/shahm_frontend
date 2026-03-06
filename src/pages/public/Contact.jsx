import React, { useEffect, useState } from "react";
import { useContactStore } from "../../store/useContactStore";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import "../../styles/pages/contact.css";

export default function Contact() {
  const { i18n } = useTranslation();

  const {
    title_ar,
    title_en,
    description_ar,
    description_en,
    cards,
    faqPreview,
    fetchContactPage,
    submitContact,
  } = useContactStore();

  const [form, setForm] = useState({ email: "", phone: "" });
  const [openIndex, setOpenIndex] = useState(null);

  const isEn = i18n.language === "en";

  useEffect(() => {
    fetchContactPage();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email && !form.phone) {
      toast.error(isEn ? "Please enter email or phone" : "يرجى إدخال البريد أو الجوال");
      return;
    }

    await submitContact(form);
    toast.success(isEn ? "Sent successfully" : "تم الإرسال بنجاح");
    setForm({ email: "", phone: "" });
  };


const groupedCards = Object.entries(
  cards.reduce((acc, card) => {
    acc[card.order] = acc[card.order] || [];
    acc[card.order].push(card);
    return acc;
  }, {})
)
  .sort(([a], [b]) => Number(a) - Number(b))
  .map(([, value]) => value);



  /* ================= Render Card ================= */
  const renderCard = (card) => {
    switch (card.type) {
      case "info":
        return (
          <div className="contact-card" key={card.id}>
            <h3>{isEn ? card.title_en : card.title_ar}</h3>
            <p>{isEn ? card.description_en : card.description_ar}</p>
            {card.description2_ar && (
              <p>{isEn ? card.description2_en : card.description2_ar}</p>
            )}
          </div>
        );

      case "button":
        return (
          <div className="contact-card" key={card.id}>
            <h3>{isEn ? card.title_en : card.title_ar}</h3>
            <p>{isEn ? card.description_en : card.description_ar}</p>

            <button
              className={`btn ${card.is_active ? "active" : "disabled"}`}
              disabled={!card.is_active}
              onClick={() => {
                if (!card.is_active) return;
                window.open(card.url, "_blank");
              }}
            >
              {isEn ? card.button_label_en : card.button_label_ar}
            </button>
          </div>
        );


      case "form":
        return (
          <div className="contact-card contact-form-card" key={card.id}>
            <h3>{isEn ? card.title_en : card.title_ar}</h3>
            <p>{isEn ? card.description_en : card.description_ar}</p>

            <form className="contact-form-inputs" onSubmit={handleSubmit}>
              <input
                type="tel"
                placeholder={isEn ? "Phone Number" : "رقم الجوال"}
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <input
                type="email"
                placeholder={isEn ? "Email Address" : "البريد الإلكتروني"}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <button type="submit">
                {isEn ? "Submit" : "إرسال"}
              </button>
            </form>
          </div>
        );

      case "faq":
        return (
          <div className="contact-card faq-preview" key={card.id}>
            <h3>{isEn ? card.title_en : card.title_ar}</h3>

            <div className="faq-list">
              {faqPreview.map((f, i) => {
                const isOpen = openIndex === i;

                return (
                  <div
                    key={f.id}
                    className={`faq-item ${isOpen ? "open" : ""}`}
                  >
                    <button
                      className="faq-question"
                      onClick={() => setOpenIndex(isOpen ? null : i)}
                    >
                      <span className="faq-q-text">
                        {isEn ? f.faq.question_en : f.faq.question_ar}
                      </span>
                      <span className="faq-arrow">▾</span>
                    </button>

                    <div className="faq-answer-container">
                      <div className="faq-answer">
                        {isEn ? f.faq.answer_en : f.faq.answer_ar}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
                            <a href="/faq" className="faq-link">
                  {isEn ? "View all FAQs" : "الاطلاع على جميع الأسئلة الشائعة"}
                  <span className="faq-link-arrow">←</span>
                </a>
          </div>
        );

      default:
        return null;
    }
  };

  /* ================= JSX ================= */
  return (
    <div className="contact-page" dir={isEn ? "ltr" : "rtl"}>

      {/* ===== PAGE HEADER (من CMS) ===== */}
      {(title_ar || title_en) && (
        <div className="contact-header">
          <h1>{isEn ? title_en : title_ar}</h1>
          {(description_ar || description_en) && (
            <p>{isEn ? description_en : description_ar}</p>
          )}
        </div>
      )}

      {/* ===== CARDS ===== */}
      <div className="contact-grid">
        {groupedCards.map((group, index) => {
          if (group.length === 2) {
            return (
              <div className="contact-card two-in-one" key={index}>
                {group.map((card, i) => (
                  <div key={card.id} className="two-in-one-section">
                    <h3>{isEn ? card.title_en : card.title_ar}</h3>
                    <p>{isEn ? card.description_en : card.description_ar}</p>

                    <button
                      className={`btn ${card.is_active ? "active" : "disabled"}`}
                      disabled={!card.is_active}
                      onClick={() => {
                        if (!card.is_active) return;
                        window.open(card.url, "_blank");
                      }}
                    >
                      {isEn ? card.button_label_en : card.button_label_ar}
                    </button>

                    {i === 0 && <div className="two-in-one-divider" />}
                  </div>
                ))}
              </div>
            );
          }

          return group.map(renderCard);
        })}
      </div>


    </div>
  );
}
