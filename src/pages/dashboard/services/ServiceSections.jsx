// src/pages/dashboard/services/ServiceSections.jsx
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { useSweetAlert } from "../../../components/common/SweetAlert";
import {
  getServiceSections, createServiceSection,
  updateServiceSection, deleteServiceSection,
  getServices,
} from "../../../api/servicesApi";
import {
  IconEdit, IconTrash, IconSave, IconX, IconSearch,
  SvcSpinner, SvcDivider, SvcToggle, SvcStatusBadge,
  SvcContentHeader, SvcCardHeader, SvcEmpty, SvcLoading, SvcCountBadge,
} from "./_shared";

const IconSections = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M2 3h14M2 7h14M2 11h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);
const IconSettings = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="1.2" />
    <path d="M7 1v1M7 12v1M1 7h1M12 7h1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);
const IconText = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2 3h10M2 6.5h7M2 10h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);
function IconToggle() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="1" y="4" width="12" height="6" rx="3" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="10" cy="7" r="2" fill="currentColor" />
    </svg>
  );
}

const emptyForm = {
  service: "", title_ar: "", title_en: "",
  subtitle_ar: "", subtitle_en: "",
  content_ar: "", content_en: "",
  order: 0, is_active: true,
};

export default function ServiceSections() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const { alert: sweetEl, show: showAlert } = useSweetAlert();

  const [items, setItems]           = useState([]);
  const [services, setServices]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [editing, setEditing]       = useState(null);
  const [form, setForm]             = useState(emptyForm);
  const [filterService, setFilterService] = useState("");
  const [localSearch, setLocalSearch]     = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterService) params.service = filterService;
      const [secRes, svcRes] = await Promise.all([
        getServiceSections(params), getServices(),
      ]);
      setItems(secRes.data?.results ?? secRes.data ?? []);
      setServices(svcRes.data?.results ?? svcRes.data ?? []);
    } catch { toast.error(t("cms.services.error.load_failed")); }
    finally  { setLoading(false); }
  };

  useEffect(() => { loadData(); }, [filterService]);

  const resetForm = () => { setForm(emptyForm); setEditing(null); };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        service:      form.service,
        title_ar:     form.title_ar,
        title_en:     form.title_en,
        subtitle_ar:  form.subtitle_ar,
        subtitle_en:  form.subtitle_en,
        content_ar:   form.content_ar,
        content_en:   form.content_en,
        order:        form.order,
        is_active:    form.is_active,
      };
      if (editing) {
        await updateServiceSection(editing.id, payload);
        toast.success(t("cms.services.sections.success.updated"));
      } else {
        await createServiceSection(payload);
        toast.success(t("cms.services.sections.success.created"));
      }
      resetForm(); loadData();
    } catch (err) {
      const d = err?.response?.data;
      toast.error(typeof d === "object" ? Object.values(d).flat().join(" ") : t("cms.services.error.save_failed"));
    } finally { setSaving(false); }
  };

  const handleToggle = async (item) => {
    try {
      await updateServiceSection(item.id, { is_active: !item.is_active });
      toast.success(t("cms.services.sections.success.toggled"));
      loadData();
    } catch { toast.error(t("cms.services.error.toggle_failed")); }
  };

  const handleDelete = async (id) => {
    const confirmed = await showAlert({
      type: "confirm",
      title: t("cms.services.confirm_delete_title"),
      message: t("cms.services.confirm_delete_text"),
      confirmText: t("cms.services.delete_button"),
      cancelText: t("cms.services.cancel_button"),
      showCancel: true, isRtl,
    });
    if (!confirmed) return;
    try {
      await deleteServiceSection(id);
      toast.success(t("cms.services.sections.success.deleted"));
      loadData();
    } catch { toast.error(t("cms.services.error.delete_failed")); }
  };

  const handleEdit = (item) => {
    setEditing(item);
    setForm({
      service:      item.service || "",
      title_ar:     item.title_ar || "",
      title_en:     item.title_en || "",
      subtitle_ar:  item.subtitle_ar || "",
      subtitle_en:  item.subtitle_en || "",
      content_ar:   item.content_ar || "",
      content_en:   item.content_en || "",
      order:        item.order ?? 0,
      is_active:    item.is_active ?? true,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getServiceLabel = (serviceId) => {
    const s = services.find((sv) => String(sv.id) === String(serviceId));
    if (!s) return "—";
    return `[${s.serial_number || s.id}] ${isRtl ? s.title_ar : s.title_en}`;
  };

  const filtered = items.filter((item) => {
    if (!localSearch) return true;
    const q = localSearch.toLowerCase();
    return (
      item.title_en?.toLowerCase().includes(q) ||
      item.title_ar?.toLowerCase().includes(q) ||
      item.subtitle_en?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="cms-services-content">
      {sweetEl}

      <SvcContentHeader
        icon={<IconSections />}
        title={t("cms.services.sections.title")}
        subtitle={t("cms.services.sections.subtitle")}
      />

      {/* ── Form card ── */}
      <div className="cms-services-card cms-services-card--glass">
        <SvcCardHeader
          icon={<IconSections />}
          accent="amber"
          title={editing ? t("cms.services.sections.form_edit") : t("cms.services.sections.form_create")}
          right={editing && (
            <button className="cms-services-icon-btn cms-services-icon-btn--ghost" onClick={resetForm} type="button">
              <IconX />
            </button>
          )}
        />
        <form onSubmit={submit} className="cms-services-form">
          <SvcDivider icon={<IconSettings />} label={t("cms.services.sections.section_meta")} />
          <div className="cms-services-form-row">
            <div className="cms-services-form-group">
              <label className="cms-services-label">{t("cms.services.sections.service")} *</label>
              <select className="cms-services-select"
                value={form.service}
                onChange={(e) => setForm((f) => ({ ...f, service: e.target.value }))} required>
                <option value="">{t("cms.services.sections.select_service")}</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    [{s.serial_number || s.id}] {isRtl ? s.title_ar : s.title_en}
                  </option>
                ))}
              </select>
            </div>
            <div className="cms-services-form-group">
              <label className="cms-services-label">{t("cms.services.sections.order")}</label>
              <input className="cms-services-input" type="number" min="0"
                value={form.order} onChange={(e) => setForm((f) => ({ ...f, order: e.target.value }))} />
            </div>
          </div>

          <SvcDivider icon={<IconText />} label={t("cms.services.sections.section_titles")} />
          <div className="cms-services-form-row">
            <div className="cms-services-form-group">
              <label className="cms-services-label">{t("cms.services.sections.title_ar")} *</label>
              <input className="cms-services-input" dir="rtl"
                placeholder={t("cms.services.sections.placeholder_title_ar")}
                value={form.title_ar} onChange={(e) => setForm((f) => ({ ...f, title_ar: e.target.value }))} required />
            </div>
            <div className="cms-services-form-group">
              <label className="cms-services-label">{t("cms.services.sections.title_en")} *</label>
              <input className="cms-services-input" dir="ltr"
                placeholder={t("cms.services.sections.placeholder_title_en")}
                value={form.title_en} onChange={(e) => setForm((f) => ({ ...f, title_en: e.target.value }))} required />
            </div>
          </div>
          <div className="cms-services-form-row">
            <div className="cms-services-form-group">
              <label className="cms-services-label">{t("cms.services.sections.subtitle_ar")}</label>
              <input className="cms-services-input" dir="rtl"
                placeholder={t("cms.services.sections.placeholder_subtitle_ar")}
                value={form.subtitle_ar} onChange={(e) => setForm((f) => ({ ...f, subtitle_ar: e.target.value }))} />
            </div>
            <div className="cms-services-form-group">
              <label className="cms-services-label">{t("cms.services.sections.subtitle_en")}</label>
              <input className="cms-services-input" dir="ltr"
                placeholder={t("cms.services.sections.placeholder_subtitle_en")}
                value={form.subtitle_en} onChange={(e) => setForm((f) => ({ ...f, subtitle_en: e.target.value }))} />
            </div>
          </div>

          <SvcDivider icon={<IconText />} label={t("cms.services.sections.section_content")} />
          <div className="cms-services-form-row">
            <div className="cms-services-form-group">
              <label className="cms-services-label">{t("cms.services.sections.content_ar")}</label>
              <textarea className="cms-services-textarea" dir="rtl" rows={5}
                placeholder={t("cms.services.sections.placeholder_content_ar")}
                value={form.content_ar} onChange={(e) => setForm((f) => ({ ...f, content_ar: e.target.value }))} />
            </div>
            <div className="cms-services-form-group">
              <label className="cms-services-label">{t("cms.services.sections.content_en")}</label>
              <textarea className="cms-services-textarea" dir="ltr" rows={5}
                placeholder={t("cms.services.sections.placeholder_content_en")}
                value={form.content_en} onChange={(e) => setForm((f) => ({ ...f, content_en: e.target.value }))} />
            </div>
          </div>

          <SvcToggle checked={form.is_active}
            onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
            label={form.is_active ? t("cms.services.status.active") : t("cms.services.status.inactive")} />

          <div className="cms-services-form-actions">
            <button type="submit" className="cms-services-btn cms-services-btn--primary" disabled={saving}>
              {saving ? <SvcSpinner /> : <IconSave />}
              {saving ? t("cms.services.actions.saving") : editing ? t("cms.services.actions.update") : t("cms.services.actions.create")}
            </button>
            {editing && (
              <button type="button" className="cms-services-btn cms-services-btn--ghost" onClick={resetForm}>
                <IconX />{t("cms.services.actions.cancel")}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ── List card ── */}
      <div className="cms-services-card">
        <SvcCardHeader
          icon={<IconSections />}
          accent="purple"
          title={t("cms.services.sections.list_title")}
          right={<SvcCountBadge count={filtered.length} />}
        />

        <div className="cms-services-filter-bar">
          <div className="cms-services-search-wrap">
            <IconSearch />
            <input className="cms-services-search-input"
              placeholder={t("cms.services.actions.search")}
              value={localSearch} onChange={(e) => setLocalSearch(e.target.value)} />
          </div>
          <select className="cms-services-select cms-services-select--sm"
            value={filterService} onChange={(e) => setFilterService(e.target.value)}>
            <option value="">{t("cms.services.sections.filter_all_services")}</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                [{s.serial_number || s.id}] {isRtl ? s.title_ar : s.title_en}
              </option>
            ))}
          </select>
        </div>

        {loading ? <SvcLoading /> : filtered.length === 0 ? (
          <SvcEmpty message={t("cms.services.sections.empty")} />
        ) : (
          <div className="cms-services-table-wrapper">
            <table className="cms-services-table">
              <thead>
                <tr>
                  <th>{t("cms.services.table.id")}</th>
                  <th>{t("cms.services.table.title")}</th>
                  <th>{t("cms.services.sections.service")}</th>
                  <th>{t("cms.services.sections.subtitle_en")}</th>
                  <th>{t("cms.services.table.order")}</th>
                  <th>{t("cms.services.table.status")}</th>
                  <th>{t("cms.services.table.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} className="cms-services-table-row">
                    <td><span className="cms-services-id-chip">#{item.id}</span></td>
                    <td className="cms-services-table-name">
                      <div>{isRtl ? item.title_ar : item.title_en}</div>
                      <div className="cms-services-table-name-sub">{isRtl ? item.title_en : item.title_ar}</div>
                    </td>
                    <td className="cms-services-table-cell-sm">{getServiceLabel(item.service)}</td>
                    <td className="cms-services-table-cell-sm cms-services-muted">
                      {(isRtl ? item.subtitle_ar : item.subtitle_en) || "—"}
                    </td>
                    <td><span className="cms-services-order-chip">{item.order}</span></td>
                    <td><SvcStatusBadge active={item.is_active} /></td>
                    <td>
                      <div className="cms-services-actions-cell">
                        <button className="cms-services-icon-btn cms-services-icon-btn--edit" onClick={() => handleEdit(item)} title={t("cms.services.actions.edit")}><IconEdit /></button>
                        <button className="cms-services-icon-btn cms-services-icon-btn--toggle" onClick={() => handleToggle(item)} title={item.is_active ? t("cms.services.actions.deactivate") : t("cms.services.actions.activate")}><IconToggle /></button>
                        <button className="cms-services-icon-btn cms-services-icon-btn--delete" onClick={() => handleDelete(item.id)} title={t("cms.services.actions.delete")}><IconTrash /></button>
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