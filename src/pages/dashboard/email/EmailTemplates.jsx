import React, { useEffect, useState } from "react";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import { getEmailTemplates, updateEmailTemplate } from "../../../api/emailApi";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import "../../../styles/dashboard/email-templates.css";

/* ══════════════════════════════════════════════════════
   ICONS
══════════════════════════════════════════════════════ */
const IconMail = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M2 7l8 5 8-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
const IconBell = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M8 1.5A4.5 4.5 0 003.5 6v3L2 11h12l-1.5-2V6A4.5 4.5 0 008 1.5z"
      stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    <path d="M6.5 11.5a1.5 1.5 0 003 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);
const IconReply = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M6 3L2 7l4 4M2 7h8a4 4 0 014 4v1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconStar = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M8 1.5l1.8 3.6 4 .58-2.9 2.83.68 3.99L8 10.35l-3.58 1.88.68-4L2.2 5.68l4-.58L8 1.5z"
      stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
  </svg>
);
const IconCode = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M4.5 3.5L1 7l3.5 3.5M9.5 3.5L13 7l-3.5 3.5M8 2l-2 10"
      stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconInfo = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
    <circle cx="7.5" cy="7.5" r="6" stroke="currentColor" strokeWidth="1.4" />
    <path d="M7.5 5.5V5M7.5 7.5V10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
const IconSave = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
    <path d="M2 2H10.5L13 4.5V13H2V2Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4.5 2V5.5H10V2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 8.5H12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);
const Spinner = () => (
  <span className="et-spinner" aria-hidden="true">
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5"
        strokeDasharray="28" strokeDashoffset="10" strokeLinecap="round" />
    </svg>
  </span>
);

/* ══════════════════════════════════════════════════════
   SECTION DIVIDER
══════════════════════════════════════════════════════ */
function SectionDivider({ icon, label }) {
  return (
    <div className="et-divider">
      <span className="et-divider-icon">{icon}</span>
      <span className="et-divider-label">{label}</span>
      <div className="et-divider-line" />
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   SUNEDITOR CONFIG
══════════════════════════════════════════════════════ */
const EDITOR_OPTIONS = {
  height: 380,
  buttonList: [
    ["undo", "redo"],
    ["bold", "italic", "underline"],
    ["fontColor", "hiliteColor"],
    ["fontSize", "formatBlock"],
    ["align", "list"],
    ["link", "image"],
    ["codeView"],
  ],
};

/* ══════════════════════════════════════════════════════
   TAB CONFIG
══════════════════════════════════════════════════════ */
const TAB_ICONS = {
  admin_alert: <IconBell />,
  auto_reply: <IconReply />,
  subscription_welcome: <IconStar />,
  service_request_otp: <IconMail />,
};

/* ══════════════════════════════════════════════════════
   VARIABLE LIST
══════════════════════════════════════════════════════ */
const VARIABLES = [
  { var: "{{name}}", key: "name" },
  { var: "{{email}}", key: "email" },
  { var: "{{phone}}", key: "phone" },
  { var: "{{subject}}", key: "subject" },
  { var: "{{message}}", key: "message" },
  { var: "{{site_name}}", key: "site_name" },

  { var: "{{otp_code}}", key: "otp_code" },
  { var: "{{expiry_minutes}}", key: "expiry_minutes" },
];

/* ══════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════ */
export default function EmailTemplates() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  const [templates, setTemplates] = useState({
    admin_alert: { subject: "", html: "" },
    auto_reply: { subject: "", html: "" },
    subscription_welcome: { subject: "", html: "" },
  });
  const [activeTab, setActiveTab] = useState("admin_alert");
  const [saving, setSaving] = useState(false);

  /* ── Load templates — logic unchanged ── */
  // eslint-disable-next-line react-hooks/exhaustive-deps -- local loader is intentionally mount-only.
  useEffect(() => { loadTemplates(); }, []);

  async function loadTemplates() {
    try {
      const res = await getEmailTemplates();
      const mapped = {
        admin_alert: { subject: "", html: "" },
        auto_reply: { subject: "", html: "" },
        subscription_welcome: { subject: "", html: "" },
      };
      res.data.forEach((tItem) => {
        mapped[tItem.template_type] = {
          subject: tItem.subject || "",
          html: tItem.html_content || "",
        };
      });
      setTemplates(mapped);
    } catch {
      toast.error(t("cms.email_templates.errors.load_failed"));
    }
  }

  /* ── Save template — logic unchanged ── */
  async function saveTemplate() {
    if (!templates[activeTab].html.trim()) {
      toast.error(t("cms.email_templates.errors.empty_content"));
      return;
    }
    setSaving(true);
    try {
      await updateEmailTemplate({
        template_type: activeTab,
        subject: templates[activeTab].subject,
        html_content: templates[activeTab].html,
      });
      toast.success(t("cms.email_templates.success.saved"));
    } catch {
      toast.error(t("cms.email_templates.errors.save_failed"));
    } finally {
      setSaving(false);
    }
  }

  /* ── Insert variable — logic unchanged ── */
  function insertVariable(v) {
    setTemplates((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        html: prev[activeTab].html + v,
      },
    }));
  }

  const tabs = [
    "admin_alert",
    "auto_reply",
    "subscription_welcome",
    "service_request_otp",
  ];
  /* ══════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════ */
  return (
    <div className="et-root" dir={isRtl ? "rtl" : "ltr"}>

      {/* ── Page Header ── */}
      <div className="et-page-header">
        <div className="et-page-header-left">
          <div className="et-page-header-icon"><IconMail /></div>
          <div>
            <h1 className="et-page-title">{t("cms.email_templates.title")}</h1>
            <p className="et-page-subtitle">{t("cms.email_templates.subtitle")}</p>
          </div>
        </div>
      </div>

      {/* ── Tabs bar ── */}
      <div className="et-tabs-bar">
        <div className="et-tabs-inner">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`et-tab-btn ${activeTab === tab ? "et-tab-btn--active" : ""}`}
              onClick={() => setActiveTab(tab)}
              type="button"
            >
              <span className="et-tab-icon">{TAB_ICONS[tab]}</span>
              <span>{t(`cms.email_templates.tabs.${tab}`)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Main content card ── */}
      <div className="et-card">
        <div className="et-card-header">
          <div className="et-card-header-left">
            <span className={`et-card-header-icon et-card-header-icon--${activeTab === "admin_alert" ? "amber" :
                activeTab === "auto_reply" ? "blue" : "green"
              }`}>
              {TAB_ICONS[activeTab]}
            </span>
            <h2 className="et-card-title">
              {t(`cms.email_templates.tabs.${activeTab}`)}
            </h2>
          </div>
        </div>

        <div className="et-form">

          {/* Info box */}
          <div className="et-info-box">
            <IconInfo />
            <span>{t("cms.email_templates.info")}</span>
          </div>

          {/* Variables */}
          <SectionDivider icon={<IconCode />} label={t("cms.email_templates.variables.title")} />
          <div className="et-variables-grid">
            {VARIABLES.map((item) => (
              <button
                key={item.var}
                className="et-variable-chip"
                onClick={() => insertVariable(item.var)}
                type="button"
                title={t(`cms.email_templates.variables.${item.key}`)}
              >
                <span className="et-variable-code">{item.var}</span>
                <span className="et-variable-label">{t(`cms.email_templates.variables.${item.key}`)}</span>
              </button>
            ))}
          </div>

          {/* Subject input */}
          <SectionDivider icon={<IconMail />} label={t("cms.email_templates.fields.subject")} />
          <input
            className="et-input"
            dir="ltr"
            placeholder={t("cms.email_templates.placeholders.subject")}
            value={templates[activeTab].subject}
            onChange={(e) =>
              setTemplates((prev) => ({
                ...prev,
                [activeTab]: { ...prev[activeTab], subject: e.target.value },
              }))
            }
          />

          {/* HTML editor */}
          <SectionDivider icon={<IconCode />} label={t("cms.email_templates.fields.content")} />
          <div className="et-editor-wrap">
            <SunEditor
              key={activeTab}
              setContents={templates[activeTab].html}
              onChange={(content) =>
                setTemplates((prev) => ({
                  ...prev,
                  [activeTab]: { ...prev[activeTab], html: content },
                }))
              }
              setOptions={EDITOR_OPTIONS}
            />
          </div>

          {/* Actions */}
          <div className="et-form-actions">
            <button
              className="et-btn et-btn--primary"
              onClick={saveTemplate}
              disabled={saving}
              type="button"
            >
              {saving ? <Spinner /> : <IconSave />}
              {saving ? t("cms.email_templates.actions.saving") : t("cms.email_templates.actions.save")}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
