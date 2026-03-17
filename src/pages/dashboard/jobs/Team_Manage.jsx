// src/pages/dashboard/Team_Manage.jsx
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  adminTeamList,
  adminAddMember,
  adminUpdateMember,
  adminDeleteMember,
  adminGetTeamPage,
  adminSaveTeamPage,
} from "../../../api/teamApi";
import "../../../styles/CMS_TEAM.css";

/* ======================================================
   QUILL EDITOR COMPONENT
====================================================== */
function QuillEditor({ value, onChange, placeholder = "", height = 250 }) {
  const containerRef = useRef(null);
  const quillRef = useRef(null);
  const lastHtmlRef = useRef(value || "");

  useEffect(() => {
    let mounted = true;

    async function init() {
      if (!containerRef.current || quillRef.current) return;

      const Quill = (await import("quill")).default;

      const toolbarOptions = [
        ["bold", "italic", "underline"],
        [{ size: ["small", false, "large", "huge"] }],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link"],
        ["clean"],
      ];

      const quill = new Quill(containerRef.current, {
        theme: "snow",
        placeholder,
        modules: { toolbar: toolbarOptions },
      });

      const editor = containerRef.current.querySelector(".ql-editor");
      if (editor) editor.style.minHeight = `${height}px`;

      if (value) {
        quill.clipboard.dangerouslyPasteHTML(value);
        lastHtmlRef.current = value;
      } else {
        lastHtmlRef.current = "";
      }

      quill.on("text-change", () => {
        const html = quill.root.innerHTML;
        if (html !== lastHtmlRef.current) {
          lastHtmlRef.current = html;
          onChange?.(html);
        }
      });

      if (!mounted) quill.off("text-change");
      quillRef.current = quill;
    }

    init();

    return () => {
      mounted = false;
      quillRef.current = null;
    };
  }, []);

  useEffect(() => {
    const quill = quillRef.current;
    const next = value || "";

    if (!quill) {
      lastHtmlRef.current = next;
      return;
    }

    const current = quill.root.innerHTML;
    if (next !== current) {
      const sel = quill.getSelection();
      quill.clipboard.dangerouslyPasteHTML(next);
      lastHtmlRef.current = next;
      if (sel) quill.setSelection(sel);
    }
  }, [value]);

  return (
    <div className="dashboard-team-editor-wrapper">
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/quill@1.3.7/dist/quill.snow.css"
      />
      <div ref={containerRef} />
    </div>
  );
}

export default function Team_Manage() {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState("page");

  const [page, setPage] = useState({});
  const [members, setMembers] = useState([]);
  const [editing, setEditing] = useState(null);

  const [memberForm, setMemberForm] = useState({
    name_ar: "",
    name_en: "",
    field_ar: "",
    field_en: "",
    sector_ar: "",
    sector_en: "",
    experience_ar: "",
    experience_en: "",
    profile_image: null,
    order: 0,
    is_active: true,
  });

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    const [m, p] = await Promise.all([adminTeamList(), adminGetTeamPage()]);
    setMembers(m.data || []);
    setPage(p.data || {});
  }

  async function savePage() {
    const fd = new FormData();
    Object.entries(page).forEach(([k, v]) => {
      if (v === null || v === undefined) return;
      if ((k === "hero_image" || k === "bottom_image") && typeof v === "string") return;
      fd.append(k, v);
    });
    await adminSaveTeamPage(fd);
    toast.success(t("cms.team.page.success.saved"));
  }

  async function saveMember() {
    if (!memberForm.name_ar.trim()) {
      return toast.error(t("cms.team.errors.name_required"));
    }

    const fd = new FormData();
    Object.entries(memberForm).forEach(([k, v]) => {
      if (v !== null) fd.append(k, v);
    });

    try {
      if (editing) {
        await adminUpdateMember(editing.id, fd);
        toast.success(t("cms.team.success.member_updated"));
      } else {
        await adminAddMember(fd);
        toast.success(t("cms.team.success.member_created"));
      }

      setEditing(null);
      setMemberForm({
        name_ar: "",
        name_en: "",
        field_ar: "",
        field_en: "",
        sector_ar: "",
        sector_en: "",
        experience_ar: "",
        experience_en: "",
        profile_image: null,
        order: 0,
        is_active: true,
      });
      loadAll();
    } catch (error) {
      toast.error(t("cms.team.errors.save_failed"));
    }
  }

  const handleDeleteMember = async (id) => {
    const result = await Swal.fire({
      title: t("cms.team.confirm_delete_title"),
      text: t("cms.team.confirm_delete"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: t("cms.team.actions.delete"),
      cancelButtonText: t("cms.team.actions.cancel"),
      reverseButtons: i18n.language === "ar",
    });

    if (result.isConfirmed) {
      await adminDeleteMember(id);
      Swal.fire({
        title: t("cms.team.deleted_title"),
        text: t("cms.team.success.member_deleted"),
        icon: "success",
        confirmButtonColor: "#22c55e",
      });
      loadAll();
    }
  };

  const loadMemberIntoForm = (member) => {
    setMemberForm({
      name_ar: member.name_ar,
      name_en: member.name_en,
      field_ar: member.field_ar || "",
      field_en: member.field_en || "",
      sector_ar: member.sector_ar || "",
      sector_en: member.sector_en || "",
      experience_ar: member.experience_ar || "",
      experience_en: member.experience_en || "",
      profile_image: null,
      order: member.order || 0,
      is_active: member.is_active !== false,
    });
    setEditing(member);
    setActiveTab("members");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const tabs = [
    { id: "page", label: t("cms.team.tabs.page") },
    { id: "members", label: t("cms.team.tabs.members") },
  ];

  return (
    <div className="dashboard-team-container">
      <div className="dashboard-team-header">
        <div className="dashboard-team-header-content">
          <h1 className="dashboard-team-title">{t("cms.team.title")}</h1>
          <p className="dashboard-team-subtitle">{t("cms.team.subtitle")}</p>
        </div>
      </div>

      <div className="dashboard-team-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`dashboard-team-tab ${activeTab === tab.id ? "dashboard-team-tab-active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              {tab.id === "page" && (
                <path d="M14 2H6C4.9 2 4 2.9 4 4V16C4 17.1 4.9 18 6 18H14C15.1 18 16 17.1 16 16V4C16 2.9 15.1 2 14 2Z" fill="currentColor"/>
              )}
              {tab.id === "members" && (
                <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor"/>
              )}
            </svg>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="dashboard-team-tab-content">
        {activeTab === "page" && (
          <div className="dashboard-team-content">
            <div className="dashboard-team-content-header">
              <div className="dashboard-team-content-header-left">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="currentColor"/>
                </svg>
                <h2>{t("cms.team.page.title")}</h2>
              </div>
              <p className="dashboard-team-content-subtitle">{t("cms.team.page.subtitle")}</p>
            </div>

            <div className="dashboard-team-form-card">
              <div className="dashboard-team-form-section">
                <h3 className="dashboard-team-section-title">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M9 1.5C4.86 1.5 1.5 4.86 1.5 9C1.5 13.14 4.86 16.5 9 16.5C13.14 16.5 16.5 13.14 16.5 9C16.5 4.86 13.14 1.5 9 1.5Z" fill="currentColor"/>
                  </svg>
                  {t("cms.team.page.section_basic")}
                </h3>

                <div className="dashboard-team-form-grid-row">
                  <div className="dashboard-team-form-group">
                    <label className="dashboard-team-label">{t("cms.team.page.fields.title_ar")}</label>
                    <input
                      className="dashboard-team-input"
                      value={page.title_ar || ""}
                      onChange={(e) => setPage({ ...page, title_ar: e.target.value })}
                      dir="rtl"
                    />
                  </div>
                  <div className="dashboard-team-form-group">
                    <label className="dashboard-team-label">{t("cms.team.page.fields.title_en")}</label>
                    <input
                      className="dashboard-team-input"
                      value={page.title_en || ""}
                      onChange={(e) => setPage({ ...page, title_en: e.target.value })}
                    />
                  </div>
                </div>

                <div className="dashboard-team-form-group">
                  <label className="dashboard-team-label">{t("cms.team.page.fields.description_ar")}</label>
                  <QuillEditor
                    value={page.description_ar || ""}
                    onChange={(v) => setPage((prev) => ({ ...prev, description_ar: v }))}
                    height={200}
                    placeholder={t("cms.team.page.placeholders.description_ar")}
                  />
                </div>

                <div className="dashboard-team-form-group">
                  <label className="dashboard-team-label">{t("cms.team.page.fields.description_en")}</label>
                  <QuillEditor
                    value={page.description_en || ""}
                    onChange={(v) => setPage((prev) => ({ ...prev, description_en: v }))}
                    height={200}
                    placeholder={t("cms.team.page.placeholders.description_en")}
                  />
                </div>
              </div>

              <div className="dashboard-team-form-section">
                <h3 className="dashboard-team-section-title">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M16.5 2.25H1.5C0.675 2.25 0 2.925 0 3.75V14.25C0 15.075 0.675 15.75 1.5 15.75H16.5C17.325 15.75 18 15.075 18 14.25V3.75C18 2.925 17.325 2.25 16.5 2.25Z" fill="currentColor"/>
                  </svg>
                  {t("cms.team.page.section_hero")}
                </h3>

                <div className="dashboard-team-form-group">
                  <label className="dashboard-team-label">{t("cms.team.page.fields.hero_image")}</label>
                  <input
                    className="dashboard-team-input"
                    type="file"
                    onChange={(e) => setPage({ ...page, hero_image: e.target.files[0] })}
                  />
                </div>

                <div className="dashboard-team-form-group">
                  <label className="dashboard-team-label">{t("cms.team.page.fields.hero_description_ar")}</label>
                  <QuillEditor
                    value={page.hero_description_ar || ""}
                    onChange={(v) => setPage((prev) => ({ ...prev, hero_description_ar: v }))}
                    height={200}
                  />
                </div>

                <div className="dashboard-team-form-group">
                  <label className="dashboard-team-label">{t("cms.team.page.fields.hero_description_en")}</label>
                  <QuillEditor
                    value={page.hero_description_en || ""}
                    onChange={(v) => setPage((prev) => ({ ...prev, hero_description_en: v }))}
                    height={200}
                  />
                </div>
              </div>

              <div className="dashboard-team-form-section">
                <h3 className="dashboard-team-section-title">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M14 2H4C2.9 2 2 2.9 2 4V14C2 15.1 2.9 16 4 16H14C15.1 16 16 15.1 16 14V4C16 2.9 15.1 2 14 2Z" fill="currentColor"/>
                  </svg>
                  {t("cms.team.page.section_content")}
                </h3>

                <div className="dashboard-team-form-group">
                  <label className="dashboard-team-label">{t("cms.team.page.fields.content_ar")}</label>
                  <QuillEditor
                    value={page.content_ar || ""}
                    onChange={(v) => setPage((prev) => ({ ...prev, content_ar: v }))}
                    height={250}
                  />
                </div>

                <div className="dashboard-team-form-group">
                  <label className="dashboard-team-label">{t("cms.team.page.fields.content_en")}</label>
                  <QuillEditor
                    value={page.content_en || ""}
                    onChange={(v) => setPage((prev) => ({ ...prev, content_en: v }))}
                    height={250}
                  />
                </div>
              </div>

              <div className="dashboard-team-form-section">
                <h3 className="dashboard-team-section-title">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M16.5 2.25H1.5C0.675 2.25 0 2.925 0 3.75V14.25C0 15.075 0.675 15.75 1.5 15.75H16.5C17.325 15.75 18 15.075 18 14.25V3.75C18 2.925 17.325 2.25 16.5 2.25Z" fill="currentColor"/>
                  </svg>
                  {t("cms.team.page.section_bottom")}
                </h3>

                <div className="dashboard-team-form-group">
                  <label className="dashboard-team-label">{t("cms.team.page.fields.bottom_image")}</label>
                  <input
                    className="dashboard-team-input"
                    type="file"
                    onChange={(e) => setPage({ ...page, bottom_image: e.target.files[0] })}
                  />
                </div>

                <div className="dashboard-team-form-grid-row">
                  <div className="dashboard-team-form-group">
                    <label className="dashboard-team-label">{t("cms.team.page.fields.right_cta_title_ar")}</label>
                    <QuillEditor
                      value={page.right_cta_title_ar || ""}
                      onChange={(v) => setPage((prev) => ({ ...prev, right_cta_title_ar: v }))}
                      height={100}
                    />
                  </div>
                  <div className="dashboard-team-form-group">
                    <label className="dashboard-team-label">{t("cms.team.page.fields.right_cta_title_en")}</label>
                    <QuillEditor
                      value={page.right_cta_title_en || ""}
                      onChange={(v) => setPage((prev) => ({ ...prev, right_cta_title_en: v }))}
                      height={100}
                    />
                  </div>
                </div>

                <div className="dashboard-team-form-grid-row">
                  <div className="dashboard-team-form-group">
                    <label className="dashboard-team-label">{t("cms.team.page.fields.left_cta_title_ar")}</label>
                    <QuillEditor
                      value={page.left_cta_title_ar || ""}
                      onChange={(v) => setPage((prev) => ({ ...prev, left_cta_title_ar: v }))}
                      height={100}
                    />
                  </div>
                  <div className="dashboard-team-form-group">
                    <label className="dashboard-team-label">{t("cms.team.page.fields.left_cta_title_en")}</label>
                    <QuillEditor
                      value={page.left_cta_title_en || ""}
                      onChange={(v) => setPage((prev) => ({ ...prev, left_cta_title_en: v }))}
                      height={100}
                    />
                  </div>
                </div>

                <div className="dashboard-team-form-grid">
                  <div className="dashboard-team-form-group">
                    <label className="dashboard-team-label">{t("cms.team.page.fields.left_link_text_ar")}</label>
                    <input
                      className="dashboard-team-input"
                      value={page.left_link_text_ar || ""}
                      onChange={(e) => setPage({ ...page, left_link_text_ar: e.target.value })}
                      dir="rtl"
                    />
                  </div>
                  <div className="dashboard-team-form-group">
                    <label className="dashboard-team-label">{t("cms.team.page.fields.left_link_text_en")}</label>
                    <input
                      className="dashboard-team-input"
                      value={page.left_link_text_en || ""}
                      onChange={(e) => setPage({ ...page, left_link_text_en: e.target.value })}
                    />
                  </div>
                  <div className="dashboard-team-form-group">
                    <label className="dashboard-team-label">{t("cms.team.page.fields.left_link_url")}</label>
                    <input
                      className="dashboard-team-input"
                      value={page.left_link_url || ""}
                      onChange={(e) => setPage({ ...page, left_link_url: e.target.value })}
                    />
                  </div>
                </div>

                <div className="dashboard-team-form-group">
                  <label className="dashboard-team-checkbox-label">
                    <input
                      type="checkbox"
                      checked={!!page.left_link_visible}
                      onChange={(e) => setPage({ ...page, left_link_visible: e.target.checked })}
                    />
                    <span className="dashboard-team-checkbox-text">{t("cms.team.page.fields.left_link_visible")}</span>
                  </label>
                </div>

                <div className="dashboard-team-form-grid">
                  <div className="dashboard-team-form-group">
                    <label className="dashboard-team-label">{t("cms.team.page.fields.right_link_text_ar")}</label>
                    <input
                      className="dashboard-team-input"
                      value={page.right_link_text_ar || ""}
                      onChange={(e) => setPage({ ...page, right_link_text_ar: e.target.value })}
                      dir="rtl"
                    />
                  </div>
                  <div className="dashboard-team-form-group">
                    <label className="dashboard-team-label">{t("cms.team.page.fields.right_link_text_en")}</label>
                    <input
                      className="dashboard-team-input"
                      value={page.right_link_text_en || ""}
                      onChange={(e) => setPage({ ...page, right_link_text_en: e.target.value })}
                    />
                  </div>
                  <div className="dashboard-team-form-group">
                    <label className="dashboard-team-label">{t("cms.team.page.fields.right_link_url")}</label>
                    <input
                      className="dashboard-team-input"
                      value={page.right_link_url || ""}
                      onChange={(e) => setPage({ ...page, right_link_url: e.target.value })}
                    />
                  </div>
                </div>

                <div className="dashboard-team-form-group">
                  <label className="dashboard-team-checkbox-label">
                    <input
                      type="checkbox"
                      checked={!!page.right_link_visible}
                      onChange={(e) => setPage({ ...page, right_link_visible: e.target.checked })}
                    />
                    <span className="dashboard-team-checkbox-text">{t("cms.team.page.fields.right_link_visible")}</span>
                  </label>
                </div>
              </div>

              <div className="dashboard-team-form-actions">
                <button className="dashboard-team-btn-primary" onClick={savePage}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M15.75 8.0625V15.1875C15.75 15.4361 15.6512 15.6746 15.4754 15.8504C15.2996 16.0262 15.0611 16.125 14.8125 16.125H3.1875C2.93886 16.125 2.70041 16.0262 2.52459 15.8504C2.34878 15.6746 2.25 15.4361 2.25 15.1875V3.5625C2.25 3.31386 2.34878 3.07541 2.52459 2.89959C2.70041 2.72378 2.93886 2.625 3.1875 2.625H10.3125" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M13.5 1.5L16.5 4.5L8.25 12.75H5.25V9.75L13.5 1.5Z" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  {t("cms.team.page.actions.save")}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "members" && (
          <div className="dashboard-team-content">
            <div className="dashboard-team-content-header">
              <div className="dashboard-team-content-header-left">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor"/>
                </svg>
                <h2>{editing ? t("cms.team.edit_member") : t("cms.team.create_member")}</h2>
              </div>
              <p className="dashboard-team-content-subtitle">{t("cms.team.members.subtitle")}</p>
            </div>

            <div className="dashboard-team-form-card">
              <div className="dashboard-team-form-section">
                <h3 className="dashboard-team-section-title">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M9 1.5C4.86 1.5 1.5 4.86 1.5 9C1.5 13.14 4.86 16.5 9 16.5C13.14 16.5 16.5 13.14 16.5 9C16.5 4.86 13.14 1.5 9 1.5Z" fill="currentColor"/>
                  </svg>
                  {t("cms.team.sections.basic_info")}
                </h3>

                <div className="dashboard-team-form-grid-row">
                  <div className="dashboard-team-form-group">
                    <label className="dashboard-team-label">{t("cms.team.fields.name_ar")}</label>
                    <input
                      className="dashboard-team-input"
                      placeholder={t("cms.team.placeholders.name_ar")}
                      value={memberForm.name_ar}
                      onChange={(e) => setMemberForm({ ...memberForm, name_ar: e.target.value })}
                      dir="rtl"
                    />
                  </div>
                  <div className="dashboard-team-form-group">
                    <label className="dashboard-team-label">{t("cms.team.fields.name_en")}</label>
                    <input
                      className="dashboard-team-input"
                      placeholder={t("cms.team.placeholders.name_en")}
                      value={memberForm.name_en}
                      onChange={(e) => setMemberForm({ ...memberForm, name_en: e.target.value })}
                    />
                  </div>
                </div>

                <div className="dashboard-team-form-grid-row">
                  <div className="dashboard-team-form-group">
                    <label className="dashboard-team-label">{t("cms.team.fields.field_ar")}</label>
                    <input
                      className="dashboard-team-input"
                      placeholder={t("cms.team.placeholders.field_ar")}
                      value={memberForm.field_ar}
                      onChange={(e) => setMemberForm({ ...memberForm, field_ar: e.target.value })}
                      dir="rtl"
                    />
                  </div>
                  <div className="dashboard-team-form-group">
                    <label className="dashboard-team-label">{t("cms.team.fields.field_en")}</label>
                    <input
                      className="dashboard-team-input"
                      placeholder={t("cms.team.placeholders.field_en")}
                      value={memberForm.field_en}
                      onChange={(e) => setMemberForm({ ...memberForm, field_en: e.target.value })}
                    />
                  </div>
                </div>

                <div className="dashboard-team-form-grid-row">
                  <div className="dashboard-team-form-group">
                    <label className="dashboard-team-label">{t("cms.team.fields.sector_ar")}</label>
                    <input
                      className="dashboard-team-input"
                      placeholder={t("cms.team.placeholders.sector_ar")}
                      value={memberForm.sector_ar}
                      onChange={(e) => setMemberForm({ ...memberForm, sector_ar: e.target.value })}
                      dir="rtl"
                    />
                  </div>
                  <div className="dashboard-team-form-group">
                    <label className="dashboard-team-label">{t("cms.team.fields.sector_en")}</label>
                    <input
                      className="dashboard-team-input"
                      placeholder={t("cms.team.placeholders.sector_en")}
                      value={memberForm.sector_en}
                      onChange={(e) => setMemberForm({ ...memberForm, sector_en: e.target.value })}
                    />
                  </div>
                </div>

                <div className="dashboard-team-form-grid">
                  <div className="dashboard-team-form-group">
                    <label className="dashboard-team-label">{t("cms.team.fields.profile_image")}</label>
                    <input
                      className="dashboard-team-input"
                      type="file"
                      onChange={(e) => setMemberForm({ ...memberForm, profile_image: e.target.files[0] })}
                    />
                  </div>
                  <div className="dashboard-team-form-group">
                    <label className="dashboard-team-label">{t("cms.team.fields.order")}</label>
                    <input
                      className="dashboard-team-input"
                      type="number"
                      value={memberForm.order}
                      onChange={(e) => setMemberForm({ ...memberForm, order: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>
              </div>

              <div className="dashboard-team-form-section">
                <h3 className="dashboard-team-section-title">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M14 2H4C2.9 2 2 2.9 2 4V14C2 15.1 2.9 16 4 16H14C15.1 16 16 15.1 16 14V4C16 2.9 15.1 2 14 2Z" fill="currentColor"/>
                  </svg>
                  {t("cms.team.sections.experience")}
                </h3>

                <div className="dashboard-team-form-group">
                  <label className="dashboard-team-label">{t("cms.team.fields.experience_ar")}</label>
                  <QuillEditor
                    value={memberForm.experience_ar || ""}
                    onChange={(v) => setMemberForm((prev) => ({ ...prev, experience_ar: v }))}
                    height={200}
                    placeholder={t("cms.team.placeholders.experience_ar")}
                  />
                </div>

                <div className="dashboard-team-form-group">
                  <label className="dashboard-team-label">{t("cms.team.fields.experience_en")}</label>
                  <QuillEditor
                    value={memberForm.experience_en || ""}
                    onChange={(v) => setMemberForm((prev) => ({ ...prev, experience_en: v }))}
                    height={200}
                    placeholder={t("cms.team.placeholders.experience_en")}
                  />
                </div>
              </div>

              <div className="dashboard-team-form-section">
                <h3 className="dashboard-team-section-title">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M9 2C6.79 2 5 3.79 5 6C5 8.21 6.79 10 9 10C11.21 10 13 8.21 13 6C13 3.79 11.21 2 9 2Z" fill="currentColor"/>
                  </svg>
                  {t("cms.team.sections.settings")}
                </h3>

                <div className="dashboard-team-form-group">
                  <label className="dashboard-team-checkbox-label">
                    <input
                      type="checkbox"
                      checked={memberForm.is_active}
                      onChange={(e) => setMemberForm({ ...memberForm, is_active: e.target.checked })}
                    />
                    <span className="dashboard-team-checkbox-text">{t("cms.team.fields.active")}</span>
                  </label>
                </div>
              </div>

              <div className="dashboard-team-form-actions">
                <button className="dashboard-team-btn-primary" onClick={saveMember}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M15.75 8.0625V15.1875C15.75 15.4361 15.6512 15.6746 15.4754 15.8504C15.2996 16.0262 15.0611 16.125 14.8125 16.125H3.1875C2.93886 16.125 2.70041 16.0262 2.52459 15.8504C2.34878 15.6746 2.25 15.4361 2.25 15.1875V3.5625C2.25 3.31386 2.34878 3.07541 2.52459 2.89959C2.70041 2.72378 2.93886 2.625 3.1875 2.625H10.3125" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M13.5 1.5L16.5 4.5L8.25 12.75H5.25V9.75L13.5 1.5Z" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  {editing ? t("cms.team.actions.update") : t("cms.team.actions.create")}
                </button>
                {editing && (
                  <button
                    className="dashboard-team-btn-secondary"
                    onClick={() => {
                      setEditing(null);
                      setMemberForm({
                        name_ar: "",
                        name_en: "",
                        field_ar: "",
                        field_en: "",
                        sector_ar: "",
                        sector_en: "",
                        experience_ar: "",
                        experience_en: "",
                        profile_image: null,
                        order: 0,
                        is_active: true,
                      });
                    }}
                  >
                    {t("cms.team.actions.cancel")}
                  </button>
                )}
              </div>
            </div>

            <div className="dashboard-team-list-card">
              <div className="dashboard-team-list-header">
                <div className="dashboard-team-list-title-wrapper">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M3 3H17V7H3V3ZM3 9H17V13H3V9ZM3 15H17V17H3V15Z" fill="currentColor"/>
                  </svg>
                  <h3>{t("cms.team.list_title")}</h3>
                </div>
                <span className="dashboard-team-count-badge">{members.length}</span>
              </div>

              {members.length > 0 ? (
                <div className="dashboard-team-table-wrapper">
                  <table className="dashboard-team-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>{t("cms.team.table.image")}</th>
                        <th>{t("cms.team.table.name")}</th>
                        <th>{t("cms.team.table.field")}</th>
                        <th>{t("cms.team.table.order")}</th>
                        <th>{t("cms.team.table.active")}</th>
                        <th>{t("cms.team.table.actions")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {members.map((m) => (
                        <tr key={m.id}>
                          <td className="dashboard-team-table-id">{m.id}</td>
                          <td>
                            {m.profile_image && (
                              <img
                                className="dashboard-team-profile-image"
                                src={m.profile_image}
                                alt={m.name_ar}
                              />
                            )}
                          </td>
                          <td className="dashboard-team-table-name">{m.name_ar}</td>
                          <td className="dashboard-team-table-field">{m.field_ar}</td>
                          <td className="dashboard-team-table-order">{m.order}</td>
                          <td>
                            <span className={`dashboard-team-status-badge ${m.is_active ? "dashboard-team-status-active" : "dashboard-team-status-inactive"}`}>
                              {m.is_active ? t("cms.team.status.active") : t("cms.team.status.inactive")}
                            </span>
                          </td>
                          <td>
                            <div className="dashboard-team-table-actions">
                              <button
                                className="dashboard-team-btn-edit"
                                onClick={() => loadMemberIntoForm(m)}
                              >
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                  <path d="M11.333 2L14 4.667L5.333 13.333H2.667V10.667L11.333 2Z" fill="currentColor"/>
                                </svg>
                                {t("cms.team.actions.edit")}
                              </button>
                              <button
                                className="dashboard-team-btn-delete"
                                onClick={() => handleDeleteMember(m.id)}
                              >
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                  <path d="M4 6V14H12V6H4ZM10.5 2L9.5 1H6.5L5.5 2H2V4H14V2H10.5Z" fill="currentColor"/>
                                </svg>
                                {t("cms.team.actions.delete")}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="dashboard-team-empty">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <path d="M24 4C16.83 4 11 9.83 11 17C11 24.17 16.83 30 24 30C31.17 30 37 24.17 37 17C37 9.83 31.17 4 24 4ZM24 34C16.67 34 2 37.67 2 45V48H46V45C46 37.67 31.33 34 24 34Z" fill="currentColor"/>
                  </svg>
                  <p>{t("cms.team.empty")}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}