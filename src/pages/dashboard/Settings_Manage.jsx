// src/pages/dashboard/Settings_Manage.jsx
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSettingsStore } from "../../store/useSettingsStore";

export default function Settings_Manage() {
  const { settings, fetchSettings, saveSettings, loading } = useSettingsStore();

  const [form, setForm] = useState({
    site_name_ar: "",
    site_name_en: "",
    contact_receiver_email: "",
    auto_reply_email: "",
    phone_number: "",
    whatsapp_number: "",
    address: "",
    map_embed: "",
    linkedin_url: "",
    x_url: "",
    instagram_url: "",
    country: "",
    locale: "",
    logo_light: null,
    logo_dark: null,
  });

  // Load settings on mount
  useEffect(() => {
    fetchSettings();
  }, []);

  // Fill form with loaded settings
  useEffect(() => {
    if (settings) {
      setForm({
        site_name_ar: settings.site_name_ar || "",
        site_name_en: settings.site_name_en || "",
        contact_receiver_email: settings.contact_receiver_email || "",
        auto_reply_email: settings.auto_reply_email || "",
        phone_number: settings.phone_number || "",
        whatsapp_number: settings.whatsapp_number || "",
        address: settings.address || "",
        map_embed: settings.map_embed || "",
        linkedin_url: settings.linkedin_url || "",
        x_url: settings.x_url || "",
        instagram_url: settings.instagram_url || "",
        country: settings.country || "Saudi Arabia",
        locale: settings.locale || "ar",
        logo_light: null,
        logo_dark: null,
      });
    }
  }, [settings]);

  // Handle field update
  const updateField = (e) => {
    const { name, value, files } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // Save handler
  const submitHandler = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    for (const key in form) {
      if (form[key] !== null && form[key] !== undefined) {
        fd.append(key, form[key]);
      }
    }

    const res = await saveSettings(fd);

    if (res.success) {
      toast.success("تم تحديث الإعدادات بنجاح");
    } else {
      toast.error(res.message || "تعذر تحديث الإعدادات");
    }
  };

  if (!settings) return <p>Loading…</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>إعدادات الموقع</h1>
      <p>تحكم بجميع إعدادات موقع شهم من مكان واحد.</p>

      <form onSubmit={submitHandler} style={{ marginTop: 20 }}>
        {/* Website Names */}
        <div style={{ marginBottom: 15 }}>
          <label>اسم الموقع (العربية)</label>
          <input
            name="site_name_ar"
            value={form.site_name_ar}
            onChange={updateField}
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 15 }}>
          <label>اسم الموقع (الإنجليزية)</label>
          <input
            name="site_name_en"
            value={form.site_name_en}
            onChange={updateField}
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        {/* Emails */}
        <h3>البريد</h3>

        <div style={{ marginBottom: 15 }}>
          <label>بريد استقبال رسائل نموذج التواصل</label>
          <input
            type="email"
            name="contact_receiver_email"
            value={form.contact_receiver_email}
            onChange={updateField}
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 15 }}>
          <label>بريد الرد التلقائي للعملاء</label>
          <input
            type="email"
            name="auto_reply_email"
            value={form.auto_reply_email}
            onChange={updateField}
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        {/* Contact */}

        <h3>التواصل</h3>

        <div style={{ marginBottom: 15 }}>
          <label>رقم الهاتف</label>
          <input
            name="phone_number"
            value={form.phone_number}
            onChange={updateField}
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 15 }}>
          <label>رقم واتساب</label>
          <input
            name="whatsapp_number"
            value={form.whatsapp_number}
            onChange={updateField}
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 15 }}>
          <label>العنوان</label>
          <input
            name="address"
            value={form.address}
            onChange={updateField}
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 15 }}>
          <label>خريطة Google</label>
          <textarea
            name="map_embed"
            value={form.map_embed}
            onChange={updateField}
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        {/* Social Media */}
        <h3>حسابات التواصل</h3>

        <div style={{ marginBottom: 15 }}>
          <label>LinkedIn</label>
          <input
            name="linkedin_url"
            value={form.linkedin_url}
            onChange={updateField}
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 15 }}>
          <label>X (Twitter سابقًا)</label>
          <input
            name="x_url"
            value={form.x_url}
            onChange={updateField}
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 15 }}>
          <label>Instagram</label>
          <input
            name="instagram_url"
            value={form.instagram_url}
            onChange={updateField}
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        {/* Country & Locale */}
        <h3>المنطقة واللغة</h3>

        <div style={{ marginBottom: 15 }}>
          <label>الدولة</label>
          <input
            name="country"
            value={form.country}
            onChange={updateField}
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        <div style={{ marginBottom: 15 }}>
          <label>اللغة (ar/en)</label>
          <input
            name="locale"
            value={form.locale}
            onChange={updateField}
            style={{ width: "100%", padding: 8 }}
          />
        </div>

        {/* Logos */}
        <h3>الشعار</h3>

        <div style={{ marginBottom: 15 }}>
          <label>Logo (Light)</label>
          <input
            type="file"
            name="logo_light"
            accept="image/*"
            onChange={updateField}
          />

          {settings.logo_light && (
            <div style={{ marginTop: 10 }}>
              <img
                src={settings.logo_light}
                alt="Light Logo"
                width={150}
                style={{ border: "1px solid #ccc", padding: 4 }}
              />
            </div>
          )}
        </div>

        <div style={{ marginBottom: 15 }}>
          <label>Logo (Dark)</label>
          <input
            type="file"
            name="logo_dark"
            accept="image/*"
            onChange={updateField}
          />

          {settings.logo_dark && (
            <div style={{ marginTop: 10 }}>
              <img
                src={settings.logo_dark}
                alt="Dark Logo"
                width={150}
                style={{ border: "1px solid #ccc", padding: 4 }}
              />
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: 10,
            width: "200px",
            background: "#000",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          {loading ? "Saving…" : "Save Settings"}
        </button>
      </form>
    </div>
  );
}
