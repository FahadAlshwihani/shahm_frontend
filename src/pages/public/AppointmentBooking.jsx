import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

import {
  getAppointmentPage,
  getAppointmentSettings,
  getAvailableSlots,
} from "../../api/appointmentsApi";

import "../../styles/pages/service-advisory.css";

export default function AppointmentBooking() {
  const { i18n } = useTranslation();
  const isEn = i18n.language === "en";
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  /* ================= CMS DATA ================= */
  const [page, setPage] = useState({});
  const [price, setPrice] = useState(0);
  const [slots, setSlots] = useState([]);

  /* ================= FORM ================= */
  const [selectedSlot, setSelectedSlot] = useState("");
  const [form, setForm] = useState({
    title: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    message: "",
  });

  const MAX_MESSAGE_LENGTH = 360;

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    async function load() {
      try {
        const [pageRes, settingsRes, slotsRes] = await Promise.all([
          getAppointmentPage(),
          getAppointmentSettings(),
          getAvailableSlots(),
        ]);

        setPage(pageRes.data || {});
        setPrice(settingsRes.data?.price || 0);
        setSlots(slotsRes.data || []);
      } catch (err) {
        console.error(err);
        toast.error(isEn ? "Failed to load data" : "فشل تحميل البيانات");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [isEn]);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "message" && value.length > MAX_MESSAGE_LENGTH) return;

    setForm({ ...form, [name]: value });
  };

  const isFormValid = () =>
    form.title &&
    form.first_name &&
    form.last_name &&
    form.email &&
    form.phone &&
    selectedSlot;

  /* ================= SUBMIT → PAYMENT ================= */
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedSlot) {
      toast.error(isEn ? "Please select a time" : "يرجى اختيار موعد");
      return;
    }

    const payload = {
      appointment: true,
      slot: selectedSlot,
      appointment_price: price,

      title: form.title,
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      phone: form.phone,
      message: form.message,
    };

    localStorage.setItem("payment_payload", JSON.stringify(payload));

    navigate("/payment", { state: payload });
  };

  if (loading) return null;

  /* ================= UI ================= */
  return (
    <div className="service-advisory-page" dir={isEn ? "ltr" : "rtl"}>
      {/* ===== HEADER (CMS) ===== */}
      <div className="service-advisory-header">
        <h1>
          {isEn ? page.title_en || "Book an Appointment" : page.title_ar || "حجز موعد"}
        </h1>
        <p>
          {isEn ? page.description_en : page.description_ar}
        </p>
      </div>

      <div className="service-advisory-two-column">
        {/* LEFT INFO */}
        <div className="service-advisory-left-column">
          <div className="cms-description-box">
            <p>
              {isEn
                ? "Choose a suitable time and complete your information."
                : "اختر الموعد المناسب وقم بتعبئة بياناتك لإتمام الحجز."}
            </p>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="service-advisory-right-column">
          <form className="service-advisory-form" onSubmit={handleSubmit}>
            <div className="form-layout">
              {/* ===== PERSONAL INFO ===== */}
              <div className="form-section">
                <h3>{isEn ? "Your Information" : "معلوماتك"}</h3>

                <select
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
                    placeholder={isEn ? "First Name" : "الاسم الأول"}
                    value={form.first_name}
                    onChange={handleChange}
                  />
                  <input
                    name="last_name"
                    placeholder={isEn ? "Last Name" : "الاسم الأخير"}
                    value={form.last_name}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-row">
                  <input
                    type="email"
                    name="email"
                    placeholder={isEn ? "Email" : "البريد الإلكتروني"}
                    value={form.email}
                    onChange={handleChange}
                  />
                  <input
                    name="phone"
                    placeholder={isEn ? "Phone" : "رقم الجوال"}
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* ===== APPOINTMENT ===== */}
              <div className="form-section">
                <h3>{isEn ? "Appointment Details" : "تفاصيل الموعد"}</h3>

                <select
                  value={selectedSlot}
                  onChange={(e) => setSelectedSlot(e.target.value)}
                >
                  <option value="">
                    {isEn ? "Select time" : "اختر موعدًا"}
                  </option>
                  {slots.map((slot) => (
                    <option key={slot.id} value={slot.id}>
                      {slot.date} — {slot.start_time}
                    </option>
                  ))}
                </select>

                <input disabled value={`${price} SAR`} />

                <textarea
                  name="message"
                  placeholder={isEn ? "Notes (optional)" : "ملاحظات (اختياري)"}
                  value={form.message}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              type="submit"
              className={`service-advisory-submit ${
                !isFormValid() ? "disabled" : ""
              }`}
              disabled={!isFormValid()}
            >
              {isEn ? "Proceed to Payment" : "الانتقال للدفع"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
