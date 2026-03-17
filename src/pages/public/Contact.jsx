import React, { useEffect, useState } from "react";
import { useContactStore } from "../../store/useContactStore";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { getPublicSettings } from "../../api/publicApi";
import "../../styles/pages/contact.css";
import ServiceRequestModal from "./Modals/ServiceAdvisoryAbout";
import AppointmentBookingModal from "./Modals/AppointmentBookingModal";

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

  const [settings, setSettings] = useState(null);

  const [form, setForm] = useState({ phone: "" });

  const [openIndex, setOpenIndex] = useState(null);
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);


  /* =========================
     Load CMS + Settings
  ========================== */

  useEffect(() => {

    fetchContactPage();

    async function loadSettings() {
      try {
        const res = await getPublicSettings();
        setSettings(res.data);
      } catch (err) {
        console.error(err);
      }
    }

    loadSettings();

  }, []);


  /* =========================
     Submit Contact Form
     ارسال نموذج التواصل
  ========================== */

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!form.phone) {
      toast.error(
        isEn
          ? "Please enter phone number"
          : "يرجى إدخال رقم الجوال"
      );
      return;
    }

    try {

      await submitContact(form);

      toast.success(
        isEn
          ? "Sent successfully"
          : "تم الإرسال بنجاح"
      );

      setForm({ phone: "" });

    } catch (err) {
      toast.error(
        isEn
          ? "Submission failed"
          : "فشل الإرسال"
      );
    }

  };


  /* =========================
     Helpers
     أدوات مساعدة
  ========================== */

  const getCards = (order) =>
    cards.filter((c) => Number(c.order) === order);


  /* =========================
     Button Actions
     أزرار التفاعل
  ========================== */

  const handleButtonAction = (order, index = 0) => {

    switch (order) {

      /* Disabled button */
      case 2:
        return;

      /* WhatsApp button */
      case 3:

        if (settings?.whatsapp_number) {
          window.open(
            `https://wa.me/${settings.whatsapp_number}`,
            "_blank"
          );
        }

        break;

      /* Two in One card */
      case 5:

        if (index === 0) {
          setAppointmentModalOpen(true);
        } else {
          setServiceModalOpen(true);
        }

        break;


      default:
        break;
    }
  };


  /* =========================
     Reusable Note Component
     مكون الملاحظة أسفل النص
  ========================== */

  const CardNote = ({ children }) => (
    <p className="contact-card-note">
      {children}
    </p>
  );


  /* =========================
     Render
  ========================== */

  return (
    <div className="contact-page" dir={isEn ? "ltr" : "rtl"}>

      {/* =========================
          Header Section
      ========================== */}

      {(title_ar || title_en) && (

        <div className="contact-header">

          <h1>
            {isEn ? title_en : title_ar}
          </h1>

          {(description_ar || description_en) && (
            <p>
              {isEn
                ? description_en
                : description_ar}
            </p>
          )}

        </div>

      )}


      {/* =========================
          Cards Grid
      ========================== */}

      <div className="contact-grid">


        {/* =========================
            CARD 1
            Contact Info
        ========================== */}

        {getCards(1).map((card) => (

          <div className="contact-card" key={card.id}>

            <h3>
              {isEn ? card.title_en : card.title_ar}
            </h3>

            <p>
              {isEn
                ? card.description_en
                : card.description_ar}
            </p>

            {card.description2_ar && (
              <p>
                {isEn
                  ? card.description2_en
                  : card.description2_ar}
              </p>
            )}

            <CardNote>
              {isEn
                ? "WhatsApp communication is preferred to ensure faster response and higher service quality."
                : "يُفضَّل اختيار التواصل عبر تطبيق واتساب لضمان سرعة المتابعة ودقة التواصل وجودة أعلى في تقديم الخدمة."}
            </CardNote>

          </div>

        ))}



        {/* =========================
            CARD 2
            Ask Question (Disabled)
        ========================== */}

        {getCards(2).map((card) => (

          <div className="contact-card" key={card.id}>

            <h3>
              {isEn ? card.title_en : card.title_ar}
            </h3>

            <p>
              {isEn
                ? card.description_en
                : card.description_ar}
            </p>

            <CardNote>
              {isEn
                ? <>By clicking below you confirm reading the <a href="/privacy">Privacy Policy</a>.</>
                : <>عبر النقر أدناه، تؤكد أنك قد اطّلعت على <a href="/privacy">بيان الخصوصية</a>.</>}
            </CardNote>

            <button className="btn disabled" disabled>
              {isEn
                ? card.button_label_en
                : card.button_label_ar}
            </button>

          </div>

        ))}



        {/* =========================
            CARD 3
            WhatsApp Chat
        ========================== */}

        {getCards(3).map((card) => (

          <div className="contact-card" key={card.id}>

            <h3>
              {isEn ? card.title_en : card.title_ar}
            </h3>

            <p>
              {isEn
                ? card.description_en
                : card.description_ar}
            </p>

            <CardNote>
              {isEn
                ? <>By clicking below you confirm reading the <a href="/privacy">Privacy Policy</a>.</>
                : <>عبر النقر أدناه، تؤكد أنك قد اطّلعت على <a href="/privacy">بيان الخصوصية</a>.</>}
            </CardNote>

            <button
              className={`btn ${card.is_active ? "active" : "disabled"}`}
              disabled={!card.is_active}
              onClick={() => handleButtonAction(3)}
            >
              {isEn
                ? card.button_label_en
                : card.button_label_ar}
            </button>

          </div>

        ))}



        {/* =========================
            CARD 4
            Contact Form
        ========================== */}

        {getCards(4).map((card) => (

          <div
            className="contact-card contact-form-card"
            key={card.id}
          >

            <h3>
              {isEn ? card.title_en : card.title_ar}
            </h3>

            <p>
              {isEn
                ? card.description_en
                : card.description_ar}
            </p>

            <CardNote>
              {isEn
                ? "Please fill the field below:"
                : "يرجى ملء الحقل أدناه:"}
            </CardNote>

            <form
              className="contact-form-inputs"
              onSubmit={handleSubmit}
            >

              <input
                type="tel"
                placeholder={
                  isEn
                    ? "Phone Number"
                    : "رقم الجوال"
                }
                value={form.phone}
                onChange={(e) =>
                  setForm({
                    phone: e.target.value
                  })
                }
              />

              <button type="submit">
                {isEn
                  ? "Contact Me"
                  : "تواصل معي"}
              </button>

            </form>

          </div>

        ))}



        {/* =========================
            CARD 5
            Two in One
        ========================== */}

        {getCards(5).length === 2 && (

          <div className="contact-card two-in-one">

            {getCards(5).map((card, i) => (

              <div
                key={card.id}
                className="two-in-one-section"
              >

                <h3>
                  {isEn
                    ? card.title_en
                    : card.title_ar}
                </h3>

                <p>
                  {isEn
                    ? card.description_en
                    : card.description_ar}
                </p>

                <CardNote>

                  {i === 0 ? (

                    isEn
                      ? <>By clicking below you confirm reading the <a href="/appointment-terms">Appointment Terms</a>.</>
                      : <>عبر النقر أدناه، تؤكد أنك قد اطّلعت على <a href="/appointment-terms">شروط وأحكام حجز المواعيد</a>.</>

                  ) : (

                    isEn
                      ? <>By clicking below you confirm reading the <a href="/legal-terms">Legal Service Terms</a>.</>
                      : <>عبر النقر أدناه، تؤكد أنك قد اطّلعت على <a href="/legal-terms">شروط وأحكام تقديم الخدمات القانونية</a>.</>

                  )}

                </CardNote>

                <button
                  className={`btn ${card.is_active ? "active" : "disabled"}`}
                  disabled={!card.is_active}
                  onClick={() =>
                    handleButtonAction(5, i)
                  }
                >
                  {isEn
                    ? card.button_label_en
                    : card.button_label_ar}
                </button>

                {i === 0 && (
                  <div className="two-in-one-divider" />
                )}

              </div>

            ))}

          </div>

        )}



        {/* =========================
            CARD 6
            FAQ
        ========================== */}

        {getCards(6).map((card) => (

          <div
            className="contact-card faq-preview"
            key={card.id}
          >

            <h3>
              {isEn ? card.title_en : card.title_ar}
            </h3>

            <div className="faq-list">

              {faqPreview.map((f, i) => {

                const isOpen = openIndex === i;

                return (

                  <div
                    key={f.id}
                    className={`faq-item ${isOpen ? "open" : ""
                      }`}
                  >

                    <button
                      className="faq-question"
                      onClick={() =>
                        setOpenIndex(
                          isOpen ? null : i
                        )
                      }
                    >

                      <span className="faq-q-text">
                        {isEn
                          ? f.faq.question_en
                          : f.faq.question_ar}
                      </span>

                      <span className="faq-arrow">
                        ▾
                      </span>

                    </button>

                    <div className="faq-answer-container">
                      <div className="faq-answer">
                        {isEn
                          ? f.faq.answer_en
                          : f.faq.answer_ar}
                      </div>
                    </div>

                  </div>

                );

              })}

            </div>

            <a href="/faq" className="faq-link">
              {isEn
                ? "View all FAQs"
                : "الاطلاع على جميع الأسئلة الشائعة"}
              <span className="faq-link-arrow">←</span>
            </a>

          </div>

        ))}

      </div>


      {/* Service Modal */}
      <ServiceRequestModal
        isOpen={serviceModalOpen}
        onClose={() => setServiceModalOpen(false)}
        openAppointmentModal={() => {
          setServiceModalOpen(false);
          setTimeout(() => setAppointmentModalOpen(true), 150);
        }}
      />

      {/* Appointment Modal */}
      <AppointmentBookingModal
        isOpen={appointmentModalOpen}
        onClose={() => setAppointmentModalOpen(false)}
        openServiceModal={() => {
          setAppointmentModalOpen(false);
          setTimeout(() => setServiceModalOpen(true), 150);
        }}
      />


    </div>
  );
}