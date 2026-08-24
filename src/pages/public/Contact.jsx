import React, { useEffect, useState } from "react";
import { useContactStore } from "../../store/useContactStore";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import "../../styles/pages/contact.css";
import DynamicPublicForm from "../../components/forms/DynamicPublicForm";
import InfoModal from "../../components/forms/InfoModal";
import { openExternalUrl } from "../../utils/safeNavigation";

export default function Contact() {

  /* =========================
     Translation / اللغة
  ========================== */

  const { i18n } = useTranslation();
  const isEn = i18n.language === "en";


  /* =========================
     CMS Data / بيانات CMS
  ========================== */

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


  /* =========================
     States
  ========================== */

  const [form, setForm] = useState({ phone: "" });
  const [openIndex, setOpenIndex] = useState(null);
  const [activeFormSlug, setActiveFormSlug] = useState(null);

  /* Mobile accordion open states per card order */
  const [mobileOpenCard, setMobileOpenCard] = useState({});
  const [activeInfoModalSlug, setActiveInfoModalSlug] = useState(null);


  /* =========================
     Load CMS + Settings
  ========================== */

  useEffect(() => {

    fetchContactPage();

  }, [fetchContactPage]);


  /* =========================
     Submit Contact Form
  ========================== */

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!form.phone) {
      toast.error(isEn ? "Please enter phone number" : "يرجى إدخال رقم الجوال");
      return;
    }

    try {
      await submitContact(form);
      toast.success(isEn ? "Sent successfully" : "تم الإرسال بنجاح");
      setForm({ phone: "" });
    } catch (err) {
      toast.error(isEn ? "Submission failed" : "فشل الإرسال");
    }

  };


  /* =========================
     Helpers
  ========================== */

  const toggleMobileCard = (order) =>
    setMobileOpenCard((prev) => ({ ...prev, [order]: !prev[order] }));


  const handleAction = (
    type,
    url,
    formSlug,
    infoModalSlug,
  ) => {
    if (type === "url" && url) {
      openExternalUrl(url);
      return;
    }

    if (type === "form_modal" && formSlug) {
      setActiveFormSlug(formSlug);
      return;
    }

    if (type === "info_modal" && infoModalSlug) {
      setActiveInfoModalSlug(infoModalSlug);
    }
  };


  /* =========================
     Render
  ========================== */

  return (
    <div className="contact-page" dir={isEn ? "ltr" : "rtl"}>

      {/* Header */}
      {(title_ar || title_en) && (
        <div className="contact-header">
          <h1>{isEn ? title_en : title_ar}</h1>
          {(description_ar || description_en) && (
            <p>{isEn ? description_en : description_ar}</p>
          )}
        </div>
      )}


      {/* Cards Grid */}
      <div className="contact-grid">

        {
          cards.map((card, cardIndex) => {

            const title = isEn
              ? card.title_en
              : card.title_ar;

            const subtitle = isEn
              ? card.subtitle_en
              : card.subtitle_ar;

            const description = isEn
              ? card.description_en
              : card.description_ar;

            return (
              <React.Fragment key={card.id}>

                {/* Row divider — inject before every card that starts a new row (every 3rd, not the first) */}
                {cardIndex > 0 && cardIndex % 3 === 0 && (
                  <div className="contact-row-divider" />
                )}

                <div
                  className={`contact-card${card.type === "faq_preview" ? " faq-preview" : ""}${mobileOpenCard[cardIndex] ? " mobile-open" : ""}`}
                >

                  <h3
                    onClick={() => toggleMobileCard(cardIndex)}
                  >
                    {title}
                  </h3>

                  <div className="contact-card-body">

                  {
                    subtitle && (
                      <p className="contact-card-subtitle">
                        {subtitle}
                      </p>
                    )
                  }

                  {/* Secondary button — optional, sits between subtitle and description */}
                  {
                    card.secondary_action_type !== "none" && (
                      <button
                        className="contact-btn contact-btn--secondary"
                        onClick={() =>
                          handleAction(
                            card.secondary_action_type,
                            card.secondary_url,
                            card.secondary_form_slug,
                            card.secondary_info_modal?.slug,
                          )
                        }
                      >
                        {
                          isEn
                            ? card.secondary_button_label_en
                            : card.secondary_button_label_ar
                        }
                      </button>
                    )
                  }

                  {
                    description && (
                      <p className="contact-card-description">
                        {description}
                      </p>
                    )
                  }

                  {
                    card.type === "faq_preview" && (
                      <div className="faq-list">

                        {
                          faqPreview.map((f, i) => {

                            const isOpen = openIndex === i;

                            return (
                              <div
                                key={f.id}
                                className={`faq-item ${isOpen ? "open" : ""}`}
                              >

                                <button
                                  className="faq-question"
                                  onClick={() =>
                                    setOpenIndex(
                                      isOpen
                                        ? null
                                        : i
                                    )
                                  }
                                >

                                  <span className="faq-q-text">
                                    {
                                      isEn
                                        ? f.faq.question_en
                                        : f.faq.question_ar
                                    }
                                  </span>

                                  <span className="faq-toggle">
                                    {isOpen ? "−" : "+"}
                                  </span>

                                </button>

                                <div className="faq-answer-container">
                                  <div className="faq-answer">
                                    {
                                      isEn
                                        ? f.faq.answer_en
                                        : f.faq.answer_ar
                                    }
                                  </div>
                                </div>

                              </div>
                            );
                          })
                        }

                      </div>
                    )
                  }

                  {/* Primary button — always last, 48px below whatever is above it */}
                  {
                    card.primary_action_type === "contact_request" ? (
                      <form
                        className="contact-form-inputs"
                        onSubmit={handleSubmit}
                        style={{ marginTop: "48px", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "0" }}
                      >
                        {/* Floating label phone input */}
                        <div
                          className={[
                            "contact-quick-wrapper",
                            form.phone ? "is-filled" : "",
                          ].filter(Boolean).join(" ")}
                        >
                          <span className="contact-quick-label">
                            {isEn ? "*Mobile Number" : "*رقم الجوال"}
                          </span>
                          <input
                            type="tel"
                            className="contact-quick-input"
                            placeholder=" "
                            value={form.phone}
                            onFocus={(e) => e.currentTarget.closest(".contact-quick-wrapper")?.classList.add("is-focused")}
                            onBlur={(e) => e.currentTarget.closest(".contact-quick-wrapper")?.classList.remove("is-focused")}
                            onChange={(e) =>
                              setForm({ ...form, phone: e.target.value })
                            }
                          />
                        </div>

                        <button
                          type="submit"
                          className="contact-btn contact-btn--active"
                          style={{ marginTop: "24px" }}
                        >
                          {isEn
                            ? card.primary_button_label_en
                            : card.primary_button_label_ar}
                        </button>
                      </form>
                    ) : (
                      card.primary_action_type !== "none" && (
                        <button
                          className="contact-btn contact-btn--active contact-btn--primary-last"
                          onClick={() =>
                            handleAction(
                              card.primary_action_type,
                              card.primary_url,
                              card.primary_form_slug,
                              card.primary_info_modal?.slug,
                            )
                          }
                        >
                          {
                            isEn
                              ? card.primary_button_label_en
                              : card.primary_button_label_ar
                          }
                        </button>
                      )
                    )
                  }

              </div>{/* end contact-card-body */}
                </div>

              </React.Fragment>
            );
          })
        }

      </div>

      {
        activeFormSlug && (
          <DynamicPublicForm
            slug={activeFormSlug}
            isOpen={!!activeFormSlug}
            onClose={() => setActiveFormSlug(null)}
          />
        )
      }
      {activeInfoModalSlug && (
        <InfoModal
          slug={activeInfoModalSlug}
          isOpen={!!activeInfoModalSlug}
          isEn={isEn}
          onClose={() => setActiveInfoModalSlug(null)}
        />
      )}

    </div>
  );
}
