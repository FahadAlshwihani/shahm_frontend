// src/pages/dashboard/CMSForms.jsx
import React, { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useSweetAlert } from "../../../components/common/SweetAlert";
import { useFormBuilderStore } from "../../../store/useFormBuilderStore";
import FormsList from "./components/FormsList";
import FormBuilder from "./validation/FormBuilder";
import CreateFormModal from "./components/CreateFormModal";
import "../../../styles/forms/dynamic-form.css";
import SuccessResponses from "./components/SuccessResponses";

const IconForms = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <rect x="3" y="2" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M7 6h6M7 10h6M7 14h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export default function CMSForms() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const { alert: sweetAlertEl, show: showAlert } = useSweetAlert();

const {
  forms,
  loading,
  saving,

  successResponses,

  fetchForms,
  fetchForm,
  fetchSuccessResponses,

  createForm,
  updateForm,
  deleteForm,
} = useFormBuilderStore();

  // "list" | "builder"
  const [view, setView] = useState("list");
  // list | builder | success-responses
  const [editingForm, setEditingForm] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

useEffect(() => {
    fetchForms();
    fetchSuccessResponses();
}, [
    fetchForms,
    fetchSuccessResponses,
]);

  // ── Open existing form in builder ──────────────────────────────────────────
  const handleEdit = useCallback(async (form) => {
    try {
      const res = await fetchForm(form.id);
      // fetchForm sets selectedForm in store; also set locally
      setEditingForm(res || form);
      setView("builder");
    } catch {
      // fallback: open with list data
      setEditingForm(form);
      setView("builder");
    }
  }, [fetchForm]);

  // Use store selectedForm when available
  const { selectedForm } = useFormBuilderStore();
  useEffect(() => {
    if (selectedForm && view === "builder") {
      setEditingForm(selectedForm);
    }
  }, [selectedForm, view]);

  // ── Create form ────────────────────────────────────────────────────────────
  const handleCreate = async (formData) => {
    try {
      const created = await createForm(formData);
      toast.success(t("cms.forms.success.created"));
      setShowCreateModal(false);
      // Immediately open builder
      setEditingForm(created);
      setView("builder");
    } catch (err) {
      const msg = err?.response?.data
        ? Object.values(err.response.data).flat().join(", ")
        : t("cms.forms.errors.create_failed");
      toast.error(msg);
      throw err;
    }
  };

  // ── Toggle active ──────────────────────────────────────────────────────────
  const handleToggleActive = async (form) => {
    try {
      await updateForm(form.id, { is_active: !form.is_active });
      toast.success(t("cms.forms.success.status_updated"));
    } catch {
      toast.error(t("cms.forms.errors.update_failed"));
    }
  };

  // ── Delete form ────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    const confirmed = await showAlert({
      type: "confirm",
      title: t("cms.forms.confirm_delete_title"),
      message: t("cms.forms.confirm_delete_text"),
      confirmText: t("cms.forms.delete_button"),
      cancelText: t("cms.forms.cancel_button"),
      showCancel: true,
      isRtl,
    });
    if (!confirmed) return;
    try {
      await deleteForm(id);
      toast.success(t("cms.forms.success.deleted"));
      if (view === "builder" && editingForm?.id === id) {
        setView("list");
        setEditingForm(null);
      }
    } catch (err) {
      const msg = err?.response?.data?.detail || t("cms.forms.errors.delete_failed");
      toast.error(msg);
    }
  };

  // ── Save form settings from builder ───────────────────────────────────────
  const handleSaveForm = async (id, payload) => {
    const updated = await updateForm(id, payload);
    return updated;
  };

  // ── Back from builder ──────────────────────────────────────────────────────
  const handleBack = () => {
    setView("list");
    setEditingForm(null);
    fetchForms();
  };


  return (
    <div className="fb-root" dir={isRtl ? "rtl" : "ltr"}>
      {sweetAlertEl}

      {/* ── Page header (list view only) ── */}
      {view === "list" && (
        <div className="fb-page-header">
          <div className="fb-page-header-left">
            <div className="fb-page-header-icon"><IconForms /></div>
            <div>
              <h1 className="fb-page-title">{t("cms.forms.title")}</h1>
              <p className="fb-page-subtitle">{t("cms.forms.subtitle")}</p>
            </div>
          </div>
          <button
            className="fb-btn fb-btn--ghost"
            onClick={() => setView("success-responses")}
          >
            {t("cms.forms.success_responses.tab_label")}
          </button>
        </div>
      )}

      {/* ── LIST VIEW ── */}
      {view === "list" && (
        <FormsList
          forms={forms}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onNew={() => setShowCreateModal(true)}
          onToggleActive={handleToggleActive}
        />
      )}

      {/* ── BUILDER VIEW ── */}
      {view === "builder" && editingForm && (
        <FormBuilder
    form={editingForm}
    onSaveForm={handleSaveForm}
    onBack={handleBack}
    saving={saving}
    successResponses={successResponses}
/>
      )}

      {/* ── SUCCESS RESPONSES VIEW ── */}
      {view === "success-responses" && (
        <SuccessResponses
          onBack={() => setView("list")}
        />
      )}

      {/* ── CREATE MODAL ── */}
      {showCreateModal && (
        <CreateFormModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreate}
          saving={saving}
        />
      )}
    </div>
  );
}
