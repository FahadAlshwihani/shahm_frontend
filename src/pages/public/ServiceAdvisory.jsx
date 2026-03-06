import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getServiceAdvisoryPage, submitServiceAdvisory } from "../../api/serviceAdvisoryApi";
import { getPublicServices } from "../../api/publicApi";
import toast from "react-hot-toast";
import "../../styles/pages/service-advisory.css";

export default function ServiceAdvisory() {
  const { i18n } = useTranslation();
  const isEn = i18n.language === "en";
  const navigate = useNavigate();


  const [cms, setCms] = useState({});
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);


  const [form, setForm] = useState({
    title: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
    attachment: null,
  });

  const MAX_MESSAGE_LENGTH = 360;

  useEffect(() => {
    async function load() {
      try {
        const [cmsRes, servicesRes] = await Promise.all([
          getServiceAdvisoryPage(),
          getPublicServices(),
        ]);
        setCms(cmsRes.data || {});
        setServices(servicesRes.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "message") {
      if (value.length <= MAX_MESSAGE_LENGTH) {
        setForm({
          ...form,
          [name]: value,
        });
      }
    } else {
      setForm({
        ...form,
        [name]: files ? files[0] : value,
      });
    }
  };

  const isFormValid = () => {
    return (
      form.title &&
      form.first_name &&
      form.last_name &&
      form.email &&
      form.phone &&
      form.service &&
      form.message
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      toast.error(
        isEn ? "Please fill required fields" : "يرجى تعبئة الحقول المطلوبة"
      );
      return;
    }

    // الخدمة المختارة
    const selectedService = services.find(
      (s) => s.id === Number(form.service)
    );

    if (!selectedService) {
      toast.error(isEn ? "Service not selected" : "لم يتم اختيار الخدمة");
      return;
    }

    /**
     * ============================
     * 🟢 CASE 1: خدمة بدون سعر
     * ============================
     */
    if (!selectedService.is_priced) {
      const data = new FormData();

      Object.entries(form).forEach(([key, val]) => {
        if (!val) return;

        if (key === "service") {
          data.append("service_id", val); // مهم جدًا
        } else {
          data.append(key, val);
        }
      });

      try {
        await submitServiceAdvisory(data);
        setShowModal(true);
      } catch (err) {
        console.error(err?.response?.data);
        toast.error(isEn ? "Submission failed" : "حدث خطأ أثناء الإرسال");
      }

      return;
    }

    /**
     * 🔵 CASE 2: خدمة بسعر → دفع
     */
    try {
      const payload = {
        title: form.title,
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        phone: form.phone,
        message: form.message,
        attachment: form.attachment,
        service_id: selectedService.id,
        service_title: isEn ? selectedService.title_en : selectedService.title_ar,
        service_price: selectedService.price,
      };

      localStorage.setItem("payment_payload", JSON.stringify(payload));
      navigate("/payment", { state: payload });


    } catch (err) {
      console.error(err);
      toast.error(isEn ? "Payment initialization failed" : "فشل بدء الدفع");
    }

  };


  const closeModal = () => {
    setShowModal(false);
    setForm({
      title: "",
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      service: "",
      message: "",
      attachment: null,
    });
  };
  const selectedService = services.find(
    (s) => s.id === Number(form.service)
  );

  const getSelectedService = () => {
    const serviceId = Number(form.service);
    const selected = services.find(s => s.id === serviceId);

    return selected
      ? (isEn ? selected.title_en : selected.title_ar)
      : (isEn ? "Not selected" : "غير محدد");
  };

  const remainingChars = MAX_MESSAGE_LENGTH - form.message.length;

  if (loading) return null;

  return (
    <div className="service-advisory-page" dir={isEn ? "ltr" : "rtl"}>
      {/* ===== CMS TOP ===== */}
      {(cms.title_top_ar || cms.title_top_en) && (
        <div className="service-advisory-header">
          <h1>{isEn ? cms.title_top_en : cms.title_top_ar}</h1>
        </div>
      )}

      {/* ===== TWO COLUMN LAYOUT ===== */}
      <div className="service-advisory-two-column">
        {/* LEFT COLUMN - CMS Description */}
        <div className="service-advisory-left-column">
          {(cms.description_top_ar || cms.description_top_en) && (
            <div className="cms-description-box">
              <p>{isEn ? cms.description_top_en : cms.description_top_ar}</p>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN - Form Content */}
        <div className="service-advisory-right-column">
          {/* ===== INFO ROW ===== */}
          <div className="service-advisory-info">
            <h1>
              {isEn
                ? "Send us your request. We will contact you as soon as possible."
                : "من فضلك قم بتعبئة البيانات التالية"}
            </h1>
            <p>
              {isEn
                ? "*Required fields"
                : "*الحقول الإلزامية"}
            </p>
          </div>

          {/* ===== FORM ===== */}
          <form className="service-advisory-form" onSubmit={handleSubmit}>
            <div className="form-layout">
              {/* معلوماتك Section */}
              <div className="form-section">
                <h3 className="service-advisory-section-title">
                  {isEn ? "Your Information" : "معلوماتك"}
                </h3>

                <p className="field-label">{isEn ? "*Title" : "*عنوان"}</p>
                <select
                  className="form-section-input-title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                >
                  <option value="">
                    {isEn ? "Select Title" : "اختر اللقب"}
                  </option>
                  <option value="mr">{isEn ? "Mr." : "سيد"}</option>
                  <option value="mrs">{isEn ? "Mrs." : "سيدة"}</option>
                  <option value="ms">{isEn ? "Ms." : "آنسة"}</option>
                </select>

                <div className="form-row">
                  <input
                    name="first_name"
                    placeholder={isEn ? "*First Name" : "*الاسم الأول"}
                    value={form.first_name}
                    onChange={handleChange}
                    required
                  />
                  <input
                    name="last_name"
                    placeholder={isEn ? "*Last Name" : "*الاسم الأخير"}
                    value={form.last_name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-row">
                  <input
                    type="email"
                    name="email"
                    placeholder={isEn ? "*Email" : "*البريد الإلكتروني"}
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                  <input
                    name="phone"
                    placeholder={isEn ? "*Phone Number" : "*رقم الجوال"}
                    value={form.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* طلبك Section */}
              <div className="form-section">
                <h3 className="service-advisory-section-title">
                  {isEn ? "Your Request" : "طلبك"}
                </h3>

                <div className="form-row">
                  <div className="form-field-wrapper">
                    <p className="field-label">{isEn ? "*Subject" : "*الموضوع"}</p>
                    <select name="service" value={form.service} onChange={handleChange}>
                      <option value="">
                        {isEn ? "Select Service" : "اختر الخدمة"}
                      </option>
                      {services.map((s) => (
                        <option key={s.id} value={s.id}>
                          {isEn ? s.title_en : s.title_ar}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-field-wrapper">
                    <p className="field-label">{isEn ? "Cost" : "التكلفة"}</p>

                    <input
                      disabled
                      value={
                        selectedService?.is_priced
                          ? `${selectedService.price} SAR`
                          : isEn
                            ? "Price will be determined later"
                            : "يتم تحديد السعر لاحقًا"
                      }
                    />

                  </div>
                </div>

                <p className="field-label">{isEn ? "**Attachments" : "**المرفقات"}</p>
                <div className="file-input-wrapper">
                  <input
                    type="file"
                    name="attachment"
                    id="file-input"
                    onChange={handleChange}
                  />
                  <label htmlFor="file-input" className="file-input-label">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M17 8L12 3L7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M12 3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>{form.attachment ? form.attachment.name : (isEn ? "Attach File" : "إرفاق ملف")}</span>
                  </label>
                </div>

                <p className="field-label">{isEn ? "Your Message" : "رسالتك"}</p>
                <textarea
                  name="message"
                  placeholder={isEn ? "Message" : "الرسالة"}
                  value={form.message}
                  onChange={handleChange}
                  maxLength={MAX_MESSAGE_LENGTH}
                />
                <p className="char-counter">
                  {isEn
                    ? `${remainingChars} characters or less remaining`
                    : `متبقي ${remainingChars} حرفًا أو أقل`}
                </p>
              </div>
            </div>

            <button
              type="submit"
              className={`service-advisory-submit ${!isFormValid() ? 'disabled' : ''}`}
              disabled={!isFormValid()}
            >
              {isEn ? "Next" : "التالي"}
            </button>
          </form>
        </div>
      </div>

      {/* ===== CMS BOTTOM ===== */}
      {(cms.title_bottom_ar || cms.title_bottom_en) && (
        <div className="service-advisory-footer">
          <h3>{isEn ? cms.title_bottom_en : cms.title_bottom_ar}</h3>
          <p>{isEn ? cms.description_bottom_en : cms.description_bottom_ar}</p>
        </div>
      )}

      {/* ===== SUCCESS MODAL ===== */}
      {showModal && (
        <div className="service-advisory-modal-overlay modal-fade-in" onClick={closeModal}>
          <div className="service-advisory-modal modal-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="modal-logo">
              <img
                src="https://res.cloudinary.com/dxgqcmf7j/image/upload/v1767182783/bstkffqeqxjxsplbrvmo.png"
                alt="Logo"
                style={{ width: '36.9px', height: '50.73' }}
              />
            </div>

            <h2>{isEn ? "Request Sent Successfully!" : "تم إرسال طلبك بنجاح!"}</h2>
            <p className="modal-subtitle">
              {isEn
                ? "We will contact you soon from our team"
                : "سوف يتم التواصل معك قريبا من قبل فريقنا"}
            </p>

            <h3 className="modal-details-title">{isEn ? "Request Details" : "تفاصيل طلبك"}</h3>

            <div className="modal-details-card" dir={isEn ? "ltr" : "rtl"}>
              <h4 className="card-title">{isEn ? "Legal Service Request" : "طلب خدمة قانونية"}</h4>

              <div className="detail-row">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#7b8487" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#7b8487" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="detail-value">{`${form.first_name} ${form.last_name}`}</span>
              </div>

              <div className="detail-row">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="#7b8487" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M22 6L12 13L2 6" stroke="#7b8487" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="detail-value">{form.email}</span>
              </div>

              <div className="detail-row">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M22 16.92V19.92C22 20.4728 21.5523 20.9205 21 20.9205H18C8.61116 20.9205 1 13.3093 1 3.9205V1C1 0.447715 1.44772 0 2 0H5C5.55228 0 6 0.447715 6 1V5.5C6 6.05228 5.55228 6.5 5 6.5H3.5C3.5 11.7467 7.75329 16 13 16V14.5C13 13.9477 13.4477 13.5 14 13.5H18.5C19.0523 13.5 19.5 13.9477 19.5 14.5V16.92C19.5 17.4728 19.9477 17.9205 20.5 17.9205H22Z" stroke="#7b8487" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="detail-value">{form.phone}</span>
              </div>

              <div className="detail-row">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#7b8487" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M14 2V8H20" stroke="#7b8487" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="detail-value">{getSelectedService()}</span>
              </div>

              {form.attachment && (
                <div className="detail-row">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M21.44 11.05L12.25 20.24C11.1242 21.3658 9.59723 21.9983 8.005 21.9983C6.41277 21.9983 4.88581 21.3658 3.76 20.24C2.63419 19.1142 2.00166 17.5872 2.00166 15.995C2.00166 14.4028 2.63419 12.8758 3.76 11.75L12.95 2.56C13.7006 1.80944 14.7186 1.38782 15.78 1.38782C16.8414 1.38782 17.8594 1.80944 18.61 2.56C19.3606 3.31056 19.7822 4.32863 19.7822 5.39C19.7822 6.45137 19.3606 7.46944 18.61 8.22L9.41 17.41C9.03472 17.7853 8.52573 17.9961 7.995 17.9961C7.46427 17.9961 6.95528 17.7853 6.58 17.41C6.20472 17.0347 5.99391 16.5257 5.99391 15.995C5.99391 15.4643 6.20472 14.9553 6.58 14.58L15.07 6.1" stroke="#7b8487" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="detail-value">{form.attachment.name}</span>
                </div>
              )}

              <div className="detail-row">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="5" width="20" height="14" rx="2" stroke="#7b8487" strokeWidth="2" />
                  <path d="M2 10H22" stroke="#7b8487" strokeWidth="2" />
                </svg>
                <span className="detail-value">{isEn ? "Will be determined later" : "يحدد السعر لاحقًا"}</span>
              </div>
            </div>

            <button onClick={closeModal} className="modal-close-btn">
              {isEn ? "Close" : "التالي"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}