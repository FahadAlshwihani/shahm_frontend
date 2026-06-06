import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { useSweetAlert } from "../../components/common/SweetAlert";
import {
  adminLegalList,
  adminLegalCreate,
  adminLegalEdit,
  adminLegalDelete,
} from "../../api/legalApi";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import "../../styles/CMS_LEGAL.css";

/* ══════════════════════════════════════════════════════
   ICONS
══════════════════════════════════════════════════════ */
const IconDoc = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M12 2H5a1 1 0 00-1 1v14a1 1 0 001 1h10a1 1 0 001-1V6l-4-4z"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 2v4h4M7 10h6M7 13h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
const IconSection = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <rect x="1.5" y="2" width="13" height="2.5" rx="1" fill="currentColor" opacity=".3" />
    <rect x="1.5" y="6.5" width="9" height="2" rx="1" fill="currentColor" opacity=".5" />
    <rect x="1.5" y="10.5" width="11" height="2" rx="1" fill="currentColor" opacity=".5" />
  </svg>
);
const IconSubsection = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M3 2v10M3 7h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="11" cy="7" r="1.5" fill="currentColor" />
  </svg>
);
const IconPlus = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);
const IconEdit = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M13.2583 3.75L16.5 7.00001M2.25 21.75L3.64706 16.6765L15.5294 4.79412C15.7347 4.58881 16.0128 4.47354 16.3029 4.47354C16.5931 4.47354 16.8712 4.58881 17.0765 4.79412L19.2059 6.92353C19.4112 7.12882 19.5265 7.40693 19.5265 7.69706C19.5265 7.98719 19.4112 8.2653 19.2059 8.47059L7.32353 20.3529L2.25 21.75Z"
      stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
    />
  </svg>
);
const IconTrash = () => (
  <svg width="14" height="14" viewBox="0 0 48 48" fill="currentColor" aria-hidden="true">
    <path d="M 20 2 C 18.35503 2 17 3.3550302 17 5 L 17 7 L 4 7 A 1.0001 1.0001 0 1 0 4 9 L 17.832031 9 A 1.0001 1.0001 0 0 0 18.158203 9 L 29.832031 9 A 1.0001 1.0001 0 0 0 30.158203 9 L 44 9 A 1.0001 1.0001 0 1 0 44 7 L 31 7 L 31 5 C 31 3.3550302 29.64497 2 28 2 L 20 2 z M 20 4 L 28 4 C 28.56503 4 29 4.4349698 29 5 L 29 7 L 19 7 L 19 5 C 19 4.4349698 19.43497 4 20 4 z M 6.9804688 10.986328 A 1.0001 1.0001 0 0 0 5.9941406 12.09375 L 8.6640625 40.462891 C 8.900709 43.030242 11.061274 45 13.640625 45 L 34.359375 45 C 36.938726 45 39.099291 43.030242 39.335938 40.462891 L 39.335938 40.460938 L 42.005859 12.09375 A 1.0004955 1.0004955 0 1 0 40.013672 11.90625 L 37.34375 40.275391 A 1.0001 1.0001 0 0 0 37.34375 40.279297 C 37.199488 41.851004 35.939375 43 34.359375 43 L 13.640625 43 C 12.060625 43 10.800512 41.850998 10.65625 40.279297 A 1.0001 1.0001 0 0 0 10.65625 40.275391 L 7.9863281 11.90625 A 1.0001 1.0001 0 0 0 6.9804688 10.986328 z" />
  </svg>
);
const IconSave = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
    <path d="M2 2H10.5L13 4.5V13H2V2Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4.5 2V5.5H10V2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 8.5H12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);
const IconX = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
    <path d="M11.5 1.5L1.5 11.5M1.5 1.5L11.5 11.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);
const IconUp = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
    <path d="M6.5 10V3M3 6.5l3.5-3.5 3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconDown = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
    <path d="M6.5 3v7M3 6.5l3.5 3.5 3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconList = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path d="M6 4.5h9M6 9h9M6 13.5h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="3" cy="4.5" r="1" fill="currentColor" />
    <circle cx="3" cy="9" r="1" fill="currentColor" />
    <circle cx="3" cy="13.5" r="1" fill="currentColor" />
  </svg>
);
const Spinner = () => (
  <span className="cl-spinner" aria-hidden="true">
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5"
        strokeDasharray="28" strokeDashoffset="10" strokeLinecap="round" />
    </svg>
  </span>
);

/* ══════════════════════════════════════════════════════
   SUNEDITOR TOOLBAR CONFIG
══════════════════════════════════════════════════════ */
const EDITOR_OPTIONS = {
  height: 220,
  buttonList: [
    ["bold", "italic", "underline", "strike"],
    ["fontColor", "hiliteColor"],
    ["outdent", "indent"],
    ["align", "list", "lineHeight"],
    ["link", "table"],
    ["undo", "redo"],
    ["removeFormat"],
  ],
};

/* ══════════════════════════════════════════════════════
   EMPTY FORM FACTORY
══════════════════════════════════════════════════════ */
const emptySubsection = () => ({
  title_ar: "", title_en: "", content_ar: "", content_en: "",
});
const emptySection = () => ({
  title_ar: "", title_en: "", subsections: [emptySubsection()],
});
const emptyForm = () => ({
  slug: "", title_ar: "", title_en: "", sections: [emptySection()],
});

/* ══════════════════════════════════════════════════════
   SECTION DIVIDER
══════════════════════════════════════════════════════ */
function SectionDivider({ icon, label }) {
  return (
    <div className="cl-divider">
      <span className="cl-divider-icon">{icon}</span>
      <span className="cl-divider-label">{label}</span>
      <div className="cl-divider-line" />
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════ */
export default function CMS_Legal() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const { alert: sweetAlertEl, show: showAlert } = useSweetAlert();

  const [pages, setPages]       = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm]         = useState(emptyForm());
  const [saving, setSaving]     = useState(false);

  useEffect(() => { loadPages(); }, []);

  async function loadPages() {
    try {
      const res = await adminLegalList();
      setPages(res.data);
    } catch (err) {
      console.error("Legal load error", err);
      toast.error(t("cms.legal.error.load_failed"));
    }
  }

  /* ── Top-level field change ── */
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  /* ── Section helpers ── */
  function addSection() {
    setForm(prev => ({ ...prev, sections: [...prev.sections, emptySection()] }));
  }
  function removeSection(i) {
    const s = [...form.sections];
    s.splice(i, 1);
    setForm({ ...form, sections: s });
  }
  function updateSection(i, field, value) {
    const s = [...form.sections];
    s[i][field] = value;
    setForm({ ...form, sections: s });
  }
  function moveSectionUp(i) {
    if (i === 0) return;
    const s = [...form.sections];
    [s[i], s[i - 1]] = [s[i - 1], s[i]];
    setForm({ ...form, sections: s });
  }
  function moveSectionDown(i) {
    if (i === form.sections.length - 1) return;
    const s = [...form.sections];
    [s[i], s[i + 1]] = [s[i + 1], s[i]];
    setForm({ ...form, sections: s });
  }

  /* ── Subsection helpers ── */
  function addSubsection(si) {
    const s = [...form.sections];
    s[si].subsections.push(emptySubsection());
    setForm({ ...form, sections: s });
  }
  function removeSubsection(si, subi) {
    const s = [...form.sections];
    s[si].subsections.splice(subi, 1);
    setForm({ ...form, sections: s });
  }
  function updateSubsection(si, subi, field, value) {
    const s = [...form.sections];
    s[si].subsections[subi][field] = value;
    setForm({ ...form, sections: s });
  }

  /* ── Submit ── */
  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, sections_data: form.sections };
      if (editingId) {
        await adminLegalEdit(editingId, payload);
        toast.success(t("cms.legal.success.updated"));
      } else {
        await adminLegalCreate(payload);
        toast.success(t("cms.legal.success.created"));
      }
      setForm(emptyForm());
      setEditingId(null);
      loadPages();
    } catch (err) {
      console.error("Save error", err);
      toast.error(t("cms.legal.error.save_failed"));
    } finally {
      setSaving(false);
    }
  }

  /* ── Edit ── */
  function handleEdit(page) {
    setEditingId(page.id);
    setForm({
      slug: page.slug,
      title_ar: page.title_ar,
      title_en: page.title_en,
      sections: (page.sections || []).map(sec => ({
        ...sec,
        subsections: sec.subsections || [],
      })),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ── Delete ── */
  async function handleDelete(id) {
    const confirmed = await showAlert({
      type: "confirm",
      title: t("cms.legal.confirm_delete_title"),
      message: t("cms.legal.confirm_delete_text"),
      confirmText: t("cms.legal.delete_button"),
      cancelText: t("cms.legal.cancel_button"),
      showCancel: true,
      isRtl,
    });
    if (!confirmed) return;
    try {
      await adminLegalDelete(id);
      toast.success(t("cms.legal.success.deleted"));
      loadPages();
    } catch (err) {
      console.error("Delete error", err);
      toast.error(t("cms.legal.error.delete_failed"));
    }
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm());
  }

  /* ══════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════ */
  return (
    <div className="cl-root" dir={isRtl ? "rtl" : "ltr"}>
      {sweetAlertEl}

      {/* ── Page Header ── */}
      <div className="cl-page-header">
        <div className="cl-page-header-left">
          <div className="cl-page-header-icon"><IconDoc /></div>
          <div>
            <h1 className="cl-page-title">{t("cms.legal.title")}</h1>
            <p className="cl-page-subtitle">{t("cms.legal.subtitle")}</p>
          </div>
        </div>
      </div>

      {/* ════════════ FORM CARD ════════════ */}
      <div className="cl-card">
        <div className="cl-card-header">
          <div className="cl-card-header-left">
            <span className="cl-card-header-icon cl-card-header-icon--blue"><IconDoc /></span>
            <h2 className="cl-card-title">
              {editingId ? t("cms.legal.form_title_edit") : t("cms.legal.form_title_create")}
            </h2>
          </div>
          {editingId && (
            <button className="cl-btn cl-btn--ghost" onClick={cancelEdit} type="button">
              <IconX />{t("cms.legal.actions.cancel")}
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="cl-form">

          {/* ── Page Info ── */}
          <SectionDivider icon={<IconDoc />} label={t("cms.legal.section_page_info")} />
          <div className="cl-form-row">
            <div className="cl-form-group">
              <label className="cl-label">{t("cms.legal.fields.title_ar")}</label>
              <input
                className="cl-input" name="title_ar" dir="rtl" required
                placeholder={t("cms.legal.placeholders.title_ar")}
                value={form.title_ar} onChange={handleChange}
              />
            </div>
            <div className="cl-form-group">
              <label className="cl-label">{t("cms.legal.fields.title_en")}</label>
              <input
                className="cl-input" name="title_en" dir="ltr" required
                placeholder={t("cms.legal.placeholders.title_en")}
                value={form.title_en} onChange={handleChange}
              />
            </div>
          </div>
          <div className="cl-form-row">
            <div className="cl-form-group">
              <label className="cl-label">
                {t("cms.legal.fields.slug")}
                <span className="cl-label-hint">{t("cms.legal.slug_hint")}</span>
              </label>
              <input
                className="cl-input" name="slug" dir="ltr" required
                placeholder={t("cms.legal.placeholders.slug")}
                value={form.slug} onChange={handleChange}
              />
            </div>
            <div className="cl-form-spacer" aria-hidden="true" />
          </div>

          {/* ── Sections ── */}
          <SectionDivider icon={<IconSection />} label={t("cms.legal.section_sections")} />

          {form.sections.map((section, si) => (
            <div key={si} className="cl-section-block">

              {/* Section header bar */}
              <div className="cl-section-header">
                <div className="cl-section-header-left">
                  <span className="cl-section-number">{si + 1}</span>
                  <span className="cl-section-label-text">
                    {t("cms.legal.section_label")} {si + 1}
                  </span>
                </div>
                <div className="cl-section-header-actions">
                  <button type="button" className="cl-icon-btn cl-icon-btn--ghost"
                    onClick={() => moveSectionUp(si)} disabled={si === 0}
                    title={t("cms.legal.actions.move_up")}>
                    <IconUp />
                  </button>
                  <button type="button" className="cl-icon-btn cl-icon-btn--ghost"
                    onClick={() => moveSectionDown(si)} disabled={si === form.sections.length - 1}
                    title={t("cms.legal.actions.move_down")}>
                    <IconDown />
                  </button>
                  <button type="button" className="cl-icon-btn cl-icon-btn--delete"
                    onClick={() => removeSection(si)}
                    title={t("cms.legal.actions.remove_section")}>
                    <IconTrash />
                  </button>
                </div>
              </div>

              {/* Section titles */}
              <div className="cl-section-body">
                <div className="cl-form-row">
                  <div className="cl-form-group">
                    <label className="cl-label">{t("cms.legal.fields.section_title_ar")}</label>
                    <input className="cl-input" dir="rtl"
                      placeholder={t("cms.legal.placeholders.section_title_ar")}
                      value={section.title_ar}
                      onChange={(e) => updateSection(si, "title_ar", e.target.value)}
                    />
                  </div>
                  <div className="cl-form-group">
                    <label className="cl-label">{t("cms.legal.fields.section_title_en")}</label>
                    <input className="cl-input" dir="ltr"
                      placeholder={t("cms.legal.placeholders.section_title_en")}
                      value={section.title_en}
                      onChange={(e) => updateSection(si, "title_en", e.target.value)}
                    />
                  </div>
                </div>

                {/* Subsections */}
                <div className="cl-subsections">
                  <div className="cl-subsections-header">
                    <IconSubsection />
                    <span>{t("cms.legal.subsections_label")}</span>
                    <span className="cl-sub-count">{section.subsections.length}</span>
                  </div>

                  {section.subsections.map((sub, subi) => (
                    <div key={subi} className="cl-subsection-block">
                      <div className="cl-subsection-header">
                        <span className="cl-subsection-number">{si + 1}.{subi + 1}</span>
                        <span className="cl-subsection-label-text">
                          {t("cms.legal.subsection_label")} {subi + 1}
                        </span>
                        <button type="button" className="cl-icon-btn cl-icon-btn--delete cl-icon-btn--sm"
                          onClick={() => removeSubsection(si, subi)}
                          title={t("cms.legal.actions.remove_subsection")}>
                          <IconTrash />
                        </button>
                      </div>

                      <div className="cl-subsection-body">
                        {/* Sub titles row */}
                        <div className="cl-form-row">
                          <div className="cl-form-group">
                            <label className="cl-label">{t("cms.legal.fields.subsection_title_ar")}</label>
                            <input className="cl-input" dir="rtl"
                              placeholder={t("cms.legal.placeholders.subsection_title_ar")}
                              value={sub.title_ar}
                              onChange={(e) => updateSubsection(si, subi, "title_ar", e.target.value)}
                            />
                          </div>
                          <div className="cl-form-group">
                            <label className="cl-label">{t("cms.legal.fields.subsection_title_en")}</label>
                            <input className="cl-input" dir="ltr"
                              placeholder={t("cms.legal.placeholders.subsection_title_en")}
                              value={sub.title_en}
                              onChange={(e) => updateSubsection(si, subi, "title_en", e.target.value)}
                            />
                          </div>
                        </div>

                        {/* Content editors row */}
                        <div className="cl-form-row cl-form-row--editors">
                          <div className="cl-form-group">
                            <label className="cl-label cl-label--editor">
                              {t("cms.legal.fields.content_ar")}
                            </label>
                            <div className="cl-editor-wrap" dir="rtl">
                              <SunEditor
                                key={`ar-${si}-${subi}`}
                                setContents={sub.content_ar}
                                onChange={(content) =>
                                  updateSubsection(si, subi, "content_ar", content)
                                }
                                setOptions={EDITOR_OPTIONS}
                              />
                            </div>
                          </div>
                          <div className="cl-form-group">
                            <label className="cl-label cl-label--editor">
                              {t("cms.legal.fields.content_en")}
                            </label>
                            <div className="cl-editor-wrap" dir="ltr">
                              <SunEditor
                                key={`en-${si}-${subi}`}
                                setContents={sub.content_en}
                                onChange={(content) =>
                                  updateSubsection(si, subi, "content_en", content)
                                }
                                setOptions={EDITOR_OPTIONS}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <button type="button" className="cl-btn cl-btn--add-sub"
                    onClick={() => addSubsection(si)}>
                    <IconPlus />
                    {t("cms.legal.actions.add_subsection")}
                  </button>
                </div>
              </div>
            </div>
          ))}

          <button type="button" className="cl-btn cl-btn--add-section" onClick={addSection}>
            <IconPlus />
            {t("cms.legal.actions.add_section")}
          </button>

          {/* ── Form Actions ── */}
          <div className="cl-form-actions">
            <button type="submit" className="cl-btn cl-btn--primary" disabled={saving}>
              {saving ? <Spinner /> : <IconSave />}
              {editingId ? t("cms.legal.actions.update") : t("cms.legal.actions.create")}
            </button>
            {editingId && (
              <button type="button" className="cl-btn cl-btn--ghost" onClick={cancelEdit}>
                <IconX />{t("cms.legal.actions.cancel")}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ════════════ LIST CARD ════════════ */}
      <div className="cl-card">
        <div className="cl-card-header">
          <div className="cl-card-header-left">
            <span className="cl-card-header-icon cl-card-header-icon--purple"><IconList /></span>
            <h2 className="cl-card-title">{t("cms.legal.list_title")}</h2>
          </div>
          <span className="cl-count-badge">{pages.length}</span>
        </div>

        {pages.length === 0 ? (
          <div className="cl-empty">
            <IconDoc />
            <p>{t("cms.legal.empty")}</p>
          </div>
        ) : (
          <div className="cl-table-wrapper">
            <table className="cl-table">
              <thead>
                <tr>
                  <th>{t("cms.legal.table.id")}</th>
                  <th>{t("cms.legal.table.slug")}</th>
                  <th>{t("cms.legal.table.title_ar")}</th>
                  <th>{t("cms.legal.table.title_en")}</th>
                  <th>{t("cms.legal.table.sections")}</th>
                  <th>{t("cms.legal.table.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {pages.map((page) => (
                  <tr key={page.id} className="cl-table-row--animate">
                    <td><span className="cl-id-chip">#{page.id}</span></td>
                    <td><code className="cl-slug-code">{page.slug}</code></td>
                    <td dir="rtl" className="cl-cell-ar">{page.title_ar}</td>
                    <td className="cl-cell-en">{page.title_en}</td>
                    <td>
                      <span className="cl-count-chip">
                        {page.sections?.length ?? 0} {t("cms.legal.table.sections_count")}
                      </span>
                    </td>
                    <td>
                      <div className="cl-actions-cell">
                        <button className="cl-icon-btn cl-icon-btn--edit"
                          onClick={() => handleEdit(page)}
                          title={t("cms.legal.actions.edit")}>
                          <IconEdit />
                        </button>
                        <button className="cl-icon-btn cl-icon-btn--delete"
                          onClick={() => handleDelete(page.id)}
                          title={t("cms.legal.actions.delete")}>
                          <IconTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}