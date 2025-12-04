// src/pages/dashboard/EmailTemplates.jsx
import React, { useEffect, useState } from "react";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";

import {
  getEmailTemplates,
  updateEmailTemplate
} from "../../api/emailApi";

import toast from "react-hot-toast";

export default function EmailTemplates() {
  const [templates, setTemplates] = useState({
    admin_alert: "",
    auto_reply: "",
    subscription_welcome: "",
  });

  const [activeTab, setActiveTab] = useState("admin_alert");

  // ============================================
  // Load all templates
  // ============================================
  useEffect(() => {
    loadTemplates();
  }, []);

  async function loadTemplates() {
    try {
      const res = await getEmailTemplates();

      const mapped = {
        admin_alert: "",
        auto_reply: "",
        subscription_welcome: "",
      };

      res.data.forEach((t) => {
        mapped[t.template_type] = t.html_content;
      });

      setTemplates(mapped);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load templates");
    }
  }

  // ============================================
  // Save template
  // ============================================
  async function saveTemplate() {
    try {
      await updateEmailTemplate({
        template_type: activeTab,
        subject: "",
        html_content: templates[activeTab],
      });

      toast.success("Template saved successfully!");
    } catch (err) {
      console.log(err);
      toast.error("Failed to save template!");
    }
  }

  // ============================================
  // Insert variable inside editor
  // ============================================
  function insertVariable(v) {
    setTemplates((prev) => ({
      ...prev,
      [activeTab]: prev[activeTab] + v,
    }));
  }

  return (
    <div style={{ padding: 25 }}>
      <h1>Email HTML Templates</h1>
      <p>Customize auto-reply emails and admin notifications.</p>

      {/* ======================= TABS ======================= */}
      <div style={{ marginTop: 20 }}>
        <button
          onClick={() => setActiveTab("admin_alert")}
          style={activeTab === "admin_alert" ? styles.activeTab : styles.tab}
        >
          Admin – New Message
        </button>

        <button
          onClick={() => setActiveTab("auto_reply")}
          style={activeTab === "auto_reply" ? styles.activeTab : styles.tab}
        >
          Auto Reply to User
        </button>

        <button
          onClick={() => setActiveTab("subscription_welcome")}
          style={
            activeTab === "subscription_welcome"
              ? styles.activeTab
              : styles.tab
          }
        >
          Newsletter Welcome
        </button>
      </div>

      {/* =================== VARIABLES ====================== */}
      <div style={{ marginTop: 20 }}>
        <h3>Insert Variables:</h3>

        {[
          "{{name}}",
          "{{email}}",
          "{{phone}}",
          "{{subject}}",
          "{{message}}",
          "{{site_name}}",
        ].map((v) => (
          <button
            key={v}
            onClick={() => insertVariable(v)}
            style={styles.variableBtn}
          >
            {v}
          </button>
        ))}
      </div>

      {/* =================== EDITOR ====================== */}
      <div style={{ marginTop: 20 }}>
        <SunEditor
          setContents={templates[activeTab]}
          onChange={(content) =>
            setTemplates((prev) => ({
              ...prev,
              [activeTab]: content,
            }))
          }
          setOptions={{
            height: 350,
            buttonList: [
              ["undo", "redo"],
              ["bold", "italic", "underline"],
              ["fontColor", "hiliteColor"],
              ["align", "list"],
              ["link"],
              ["codeView"],
            ],
          }}
        />
      </div>

      <button
        onClick={saveTemplate}
        style={{
          marginTop: 20,
          padding: "10px 25px",
          background: "#333",
          color: "#fff",
          borderRadius: 6,
        }}
      >
        Save Template
      </button>
    </div>
  );
}

const styles = {
  tab: {
    padding: "10px 15px",
    marginRight: 5,
    border: "1px solid #ccc",
    borderRadius: 5,
    cursor: "pointer",
    background: "#f5f5f5",
  },
  activeTab: {
    padding: "10px 15px",
    marginRight: 5,
    border: "1px solid #333",
    background: "#333",
    color: "#fff",
    borderRadius: 5,
    cursor: "pointer",
  },
  variableBtn: {
    marginRight: 10,
    marginBottom: 10,
    padding: "7px 12px",
    background: "#eee",
    borderRadius: 5,
    cursor: "pointer",
    border: "1px solid #ccc",
  },
};
