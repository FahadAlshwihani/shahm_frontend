import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

import {
  getAppointmentPage,
  getAppointmentSettings,
  getAvailableSlots,
  bookAppointment,
} from "../src/api/appointmentsApi";

import LogoImage from "../../assets/images/logo.png";
import "../../styles/pages/service-advisory.css";

export default function AppointmentBooking() {

  const { i18n } = useTranslation();
  const isEn = i18n.language === "en";

  const [loading, setLoading] = useState(true)

  const [page, setPage] = useState({})
  const [settings, setSettings] = useState({})
  const [slots, setSlots] = useState([])

  const [showThankYou, setShowThankYou] = useState(false)

  const [selectedSlot, setSelectedSlot] = useState("")

  const [attachment, setAttachment] = useState(null)
  const [voiceNote, setVoiceNote] = useState(null)

  const [form, setForm] = useState({
    title: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    message: "",
  })

  useEffect(() => {

    async function load() {

      try {

        const [pageRes, settingsRes, slotsRes] = await Promise.all([
          getAppointmentPage(),
          getAppointmentSettings(),
          getAvailableSlots()
        ])

        setPage(pageRes.data || {})
        setSettings(settingsRes.data || {})
        setSlots(slotsRes.data || [])

      } catch (err) {
        console.error(err)
        toast.error("Failed to load data")
      }

      setLoading(false)

    }

    load()

  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const isFormValid = () => (
    form.first_name &&
    form.last_name &&
    form.email &&
    form.phone &&
    selectedSlot
  )

  const handleSubmit = async (e) => {

    e.preventDefault()

    try {

      const data = new FormData()

      data.append("slot_id", selectedSlot)

      Object.keys(form).forEach(key => {
        if (form[key]) data.append(key, form[key])
      })

      if (attachment) {
        data.append("attachment", attachment)
      }

      if (voiceNote) {
        data.append("voice_note", voiceNote)
      }

      await bookAppointment(data)

      setShowThankYou(true)

      setForm({
        title: "",
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        message: "",
      })

      setAttachment(null)
      setVoiceNote(null)
      setSelectedSlot("")

      const res = await getAvailableSlots()
      setSlots(res.data || [])

    } catch (err) {
      console.error(err)
      toast.error("Failed to create appointment")
    }

  }

  if (loading) return null

  if (showThankYou) {
    return (

      <div className="service-advisory-modal-overlay">

        <div className="service-advisory-modal">

          <div className="modal-logo">
            <img src={LogoImage} alt="logo" width="120" />
          </div>

          <h2>{isEn ? "Thank You" : "شكراً لك"}</h2>

          <p className="modal-subtitle">
            {isEn ?
              "Your appointment request has been submitted successfully."
              :
              "تم استلام طلب الحجز بنجاح"
            }
          </p>

          <button
            className="modal-close-btn"
            onClick={() => setShowThankYou(false)}
          >
            {isEn ? "Back" : "العودة"}
          </button>

        </div>

      </div>

    )
  }

  return (

    <div className="service-advisory-page" dir={isEn ? "ltr" : "rtl"}>

      <div className="service-advisory-header">

        <h1>
          {isEn ? page.title_en : "page.title_ar"}
        </h1>

        <p>
          {isEn ? page.description_en : page.description_ar}
        </p>

      </div>

      <div className="service-advisory-two-column">

        <div className="service-advisory-left-column">
          <div className="cms-description-box">

            <p>
              {isEn ?
                "Choose a suitable time and complete your information."
                :
                "اختر الموعد المناسب وقم بتعبئة بياناتك"
              }
            </p>

          </div>
        </div>

        <div className="service-advisory-right-column">

          <form
            className="service-advisory-form"
            onSubmit={handleSubmit}
          >

            <div className="form-layout">

              <div className="form-section">

                <h3>{isEn ? "Your Information" : "معلوماتك"}</h3>

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

                <input
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                />

                <input
                  name="phone"
                  placeholder={isEn ? "Phone" : "الجوال"}
                  value={form.phone}
                  onChange={handleChange}
                />

              </div>

              <div className="form-section">

                <h3>{isEn ? "Appointment Details" : "تفاصيل الموعد"}</h3>

                <select
                  value={appointmentType}
                  onChange={(e) => setAppointmentType(e.target.value)}
                >

                  <option value="in_person">
                    {isEn ? "In Person" : "حضوري"}
                  </option>

                  <option value="online">
                    {isEn ? "Online" : "عن بعد"}
                  </option>

                </select>

                <select
                  value={selectedSlot}
                  onChange={(e) => setSelectedSlot(e.target.value)}
                >

                  <option value="">
                    {isEn ? "Select Time" : "اختر الموعد"}
                  </option>

                  {slots.map(slot => (
                    <option key={slot.id} value={slot.id}>
                      {slot.date} — {slot.start_time}
                    </option>
                  ))}

                </select>

                <textarea
                  name="message"
                  placeholder={isEn ? "Notes" : "ملاحظات"}
                  value={form.message}
                  onChange={handleChange}
                />

                <div className="file-input-wrapper">

                  <label className="file-input-label">

                    {isEn ? "Upload file" : "رفع ملف"}

                    <input
                      type="file"
                      onChange={(e) => setAttachment(e.target.files[0])}
                    />

                  </label>

                </div>

                <div className="file-input-wrapper">

                  <label className="file-input-label">

                    {isEn ? "Voice note" : "رسالة صوتية"}

                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(e) => setVoiceNote(e.target.files[0])}
                    />

                  </label>

                </div>

              </div>

            </div>

            <button
              type="submit"
              className={`service-advisory-submit ${!isFormValid() ? "disabled" : ""
                }`}
              disabled={!isFormValid()}
            >

              {isEn ? "Book Appointment" : "حجز الموعد"}

            </button>

          </form>

        </div>

      </div>

    </div>

  )

}