import React, { useEffect, useState } from "react";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";

import { getEmailTemplates, updateEmailTemplate } from "../../api/emailApi";

import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import "../../styles/CMS_EMAILTEMPLATES.css";

export default function EmailTemplates() {
  const { t } = useTranslation();

  const [templates, setTemplates] = useState({
    admin_alert: { subject: "", html: "" },
    auto_reply: { subject: "", html: "" },
    subscription_welcome: { subject: "", html: "" },
  });

  const [activeTab, setActiveTab] = useState("admin_alert");

  /* ============================================
     LOAD TEMPLATES
  ============================================ */
  useEffect(() => {
    loadTemplates();
  }, []);

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
    } catch (err) {
      toast.error(t("cms.email_templates.errors.load_failed"));
    }
  }

  /* ============================================
     SAVE TEMPLATE
  ============================================ */
  async function saveTemplate() {
    if (!templates[activeTab].html.trim()) {
      toast.error("محتوى القالب لا يمكن أن يكون فارغًا");
      return;
    }

    try {
      await updateEmailTemplate({
        template_type: activeTab,
        subject: templates[activeTab].subject,
        html_content: templates[activeTab].html,
      });

      toast.success(t("cms.email_templates.success.saved"));
    } catch (err) {
      toast.error(t("cms.email_templates.errors.save_failed"));
    }
  }

  /* ============================================
     PREVIEW (جاهز للاستخدام لاحقًا)
  ============================================ */
  const previewHtml = templates[activeTab].html
    .replace("{{name}}", "فهد")
    .replace("{{email}}", "test@email.com")
    .replace("{{site_name}}", "شهم");

  /* ============================================
     INSERT VARIABLE
  ============================================ */
  function insertVariable(v) {
    setTemplates((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        html: prev[activeTab].html + v,
      },
    }));
  }

  return (
    <div className="email-templates-cms-container">
      {/* ==================== HEADER ==================== */}
      <div className="email-templates-cms-header">
        <h1 className="email-templates-cms-title">
          {t("cms.email_templates.title")}
        </h1>
        <p className="email-templates-cms-subtitle">
          {t("cms.email_templates.subtitle")}
        </p>
      </div>

      {/* ==================== TABS ==================== */}
      <div className="email-templates-tabs-card">
        <div className="email-templates-tabs">
          <button
            className={`email-templates-tab ${activeTab === "admin_alert" ? "active" : ""
              }`}
            onClick={() => setActiveTab("admin_alert")}
          >
            {t("cms.email_templates.tabs.admin_alert")}
          </button>

          <button
            className={`email-templates-tab ${activeTab === "auto_reply" ? "active" : ""
              }`}
            onClick={() => setActiveTab("auto_reply")}
          >
            {t("cms.email_templates.tabs.auto_reply")}
          </button>

          <button
            className={`email-templates-tab ${activeTab === "subscription_welcome" ? "active" : ""
              }`}
            onClick={() => setActiveTab("subscription_welcome")}
          >
            {t("cms.email_templates.tabs.subscription_welcome")}
          </button>
        </div>
      </div>

      {/* ==================== INFO BOX ==================== */}
      <div className="email-templates-info-box">
        💡 {t("cms.email_templates.info")}
      </div>

      {/* ==================== VARIABLES ==================== */}
      <div className="email-templates-variables-card">
        <h3 className="email-templates-variables-title">
          {t("cms.email_templates.variables.title")}
        </h3>

        <div className="email-templates-variables-grid">
          {[
            { var: "{{name}}", label: t("cms.email_templates.variables.name") },
            {
              var: "{{email}}",
              label: t("cms.email_templates.variables.email"),
            },
            {
              var: "{{phone}}",
              label: t("cms.email_templates.variables.phone"),
            },
            {
              var: "{{subject}}",
              label: t("cms.email_templates.variables.subject"),
            },
            {
              var: "{{message}}",
              label: t("cms.email_templates.variables.message"),
            },
            {
              var: "{{site_name}}",
              label: t("cms.email_templates.variables.site_name"),
            },
          ].map((item) => (
            <button
              key={item.var}
              className="email-templates-variable-chip"
              onClick={() => insertVariable(item.var)}
              title={item.label}
            >
              {item.var}
            </button>
          ))}
        </div>
      </div>

<input
  className="email-template-subject"
  placeholder={t("cms.email_templates.subject")}
  value={templates[activeTab].subject}
  onChange={(e) =>
    setTemplates((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        subject: e.target.value,
      },
    }))
  }
/>


      {/* ==================== EDITOR ==================== */}
      <div className="email-templates-editor-card">
        <div className="email-templates-editor-wrapper">
          <SunEditor
            setContents={templates[activeTab].html}
  onChange={(content) =>
    setTemplates((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        html: content,
      },
    }))
            }
            setOptions={{
              height: 400,
              buttonList: [
                ["undo", "redo"],
                ["bold", "italic", "underline"],
                ["fontColor", "hiliteColor"],
                ["fontSize", "formatBlock"],
                ["align", "list"],
                ["link", "image"],
                ["codeView"],
              ],
            }}
          />
        </div>
      </div>

      {/* ==================== ACTIONS ==================== */}
      <div className="email-templates-actions">
        <button className="email-templates-btn-save" onClick={saveTemplate}>
          {t("cms.email_templates.actions.save")}
        </button>
      </div>
    </div>
  );
}