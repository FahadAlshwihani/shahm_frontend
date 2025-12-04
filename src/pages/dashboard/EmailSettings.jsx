import React, { useEffect, useState } from "react";
import { useEmailSettingsStore } from "../../store/useEmailSettingsStore";
import toast from "react-hot-toast";
import "../../styles/EmailSettings.css";

export default function Email_Settings() {
  const {
    settings,
    fetchSettings,
    saveSettings,
    testSMTP,
    resetDefaults,
  } = useEmailSettingsStore();

  const [form, setForm] = useState(null);
  const [loadingTest, setLoadingTest] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);

  // Load settings
  useEffect(() => {
    fetchSettings();
  }, []);

  // Update form when settings load
  useEffect(() => {
    if (settings) setForm(settings);
  }, [settings]);

  if (!form) return <p>Loading...</p>;

  // Save SMTP settings
  const handleSave = async () => {
    setLoadingSave(true);
    const result = await saveSettings(form);
    setLoadingSave(false);

    if (result.success) toast.success("تم حفظ الإعدادات بنجاح");
    else toast.error("حدث خطأ أثناء الحفظ");
  };

  // Test SMTP connection
  const handleTestSMTP = async () => {
    setLoadingTest(true);
    const result = await testSMTP(form);
    setLoadingTest(false);

    if (result.success) toast.success("✔ SMTP يعمل بنجاح!");
    else toast.error(`⚠ فشل الاتصال: ${result.message}`);
  };

  return (
    <div className="email-settings-container">

      <h1>Email Settings</h1>
      <p>Configure your SMTP server and notification emails.</p>

      {/* ==================== SMTP CONFIG ==================== */}
      <div className="section">
        <h2>SMTP Server</h2>

        <label>SMTP Host</label>
        <input
          value={form.smtp_host}
          onChange={(e) => setForm({ ...form, smtp_host: e.target.value })}
        />

        <label>SMTP Port</label>
        <input
          type="number"
          value={form.smtp_port}
          onChange={(e) => setForm({ ...form, smtp_port: e.target.value })}
        />

        <label>SMTP Username</label>
        <input
          value={form.smtp_username}
          onChange={(e) => setForm({ ...form, smtp_username: e.target.value })}
        />

        <label>SMTP Password</label>
        <input
          type="password"
          value={form.smtp_password}
          onChange={(e) =>
            setForm({ ...form, smtp_password: e.target.value })
          }
        />

        {/* TLS / SSL */}
        <div className="row">
          <label>
            <input
              type="checkbox"
              checked={form.smtp_use_tls}
              onChange={(e) =>
                setForm({ ...form, smtp_use_tls: e.target.checked })
              }
            />
            Use TLS
          </label>

          <label style={{ marginLeft: 20 }}>
            <input
              type="checkbox"
              checked={form.smtp_use_ssl}
              onChange={(e) =>
                setForm({ ...form, smtp_use_ssl: e.target.checked })
              }
            />
            Use SSL
          </label>
        </div>
      </div>

      {/* ==================== SENDER EMAILS ==================== */}
      <div className="section">
        <h2>Sender Emails</h2>

        <label>Admin Notification Email</label>
        <input
          value={form.contact_receiver_email}
          onChange={(e) =>
            setForm({ ...form, contact_receiver_email: e.target.value })
          }
        />

        <label>Auto Reply Email</label>
        <input
          value={form.auto_reply_email}
          onChange={(e) =>
            setForm({ ...form, auto_reply_email: e.target.value })
          }
        />
      </div>

      {/* ==================== ACTION BUTTONS ==================== */}
      <div className="actions">
        <button
          className="btn test"
          onClick={handleTestSMTP}
          disabled={loadingTest}
        >
          {loadingTest ? "Testing..." : "Test SMTP Connection"}
        </button>

        <button className="btn reset" onClick={resetDefaults}>
          Reset to Defaults
        </button>

        <button
          className="btn save"
          onClick={handleSave}
          disabled={loadingSave}
        >
          {loadingSave ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
