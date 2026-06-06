// src/pages/dashboard/forms/components/SuccessResponses.jsx
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { useSweetAlert } from "../../../../components/common/SweetAlert";
import Editbtn   from "../../../../components/common/dashboard/Editbtn";
import Deletebtn from "../../../../components/common/dashboard/Deletebtn";
import SuccessResponseModal from "./SuccessResponseModal";
import { useFormBuilderStore } from "../../../../store/useFormBuilderStore";

const IcoBack = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M9.5 3L5 7.5 9.5 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IcoPlus = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);
const IcoSuccess = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M6.5 10l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function SuccessResponses({ onBack }) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  const {
    successResponses, fetchSuccessResponses,
    createSuccessResponse, updateSuccessResponse, deleteSuccessResponse,
    loading, saving,
  } = useFormBuilderStore();

  const { alert: sweetEl, show: showAlert } = useSweetAlert();
  const [modalOpen,   setModalOpen]   = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => { fetchSuccessResponses(); }, [fetchSuccessResponses]);

  const handleCreate = () => { setEditingItem(null); setModalOpen(true); };
  const handleEdit   = (item) => { setEditingItem(item); setModalOpen(true); };

  const handleDelete = async (id) => {
    const confirmed = await showAlert({
      type:"confirm",
      title:       t("cms.forms.success_responses.confirm_delete_title"),
      message:     t("cms.forms.success_responses.confirm_delete_text"),
      confirmText: t("cms.forms.success_responses.delete_button"),
      cancelText:  t("cms.forms.success_responses.cancel_button"),
      showCancel: true, isRtl,
    });
    if (!confirmed) return;
    try {
      await deleteSuccessResponse(id);
      toast.success(t("cms.forms.success_responses.success.deleted"));
    } catch (err) {
      toast.error(err?.response?.data?.detail || t("cms.forms.errors.save_failed"));
    }
  };

  const handleSubmit = async (payload) => {
    try {
      if (editingItem) {
        await updateSuccessResponse(editingItem.id, payload);
        toast.success(t("cms.forms.success_responses.success.updated"));
      } else {
        await createSuccessResponse(payload);
        toast.success(t("cms.forms.success_responses.success.created"));
      }
      setModalOpen(false); setEditingItem(null);
    } catch (err) {
      const errors = err?.response?.data;
      toast.error(errors ? Object.values(errors).flat().join(", ") : t("cms.forms.errors.save_failed"));
      throw err;
    }
  };

  return (
    <div className="fb-success-page">
      {sweetEl}

      {/* Page header */}
      <div className="fb-page-header">
        <div className="fb-page-header-left">
          <button className="fb-btn fb-btn--ghost fb-btn--sm" onClick={onBack} type="button">
            <IcoBack />
            {t("cms.forms.actions.back")}
          </button>
          <div>
            <h1 className="fb-page-title">{t("cms.forms.success_responses.title")}</h1>
            <p className="fb-page-subtitle">{t("cms.forms.success_responses.subtitle")}</p>
          </div>
        </div>
        <button className="fb-btn fb-btn--primary" onClick={handleCreate} type="button">
          <IcoPlus />
          {t("cms.forms.success_responses.new_btn")}
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="fb-empty-state">
          <div className="fb-spinner-lg"/>
          <p>{t("cms.forms.loading")}</p>
        </div>
      ) : successResponses.length === 0 ? (
        <div className="fb-empty-state">
          <div className="fb-empty-icon">
            <IcoSuccess />
          </div>
          <p className="fb-empty-title">{t("cms.forms.success_responses.empty_title")}</p>
          <p className="fb-empty-subtitle">{t("cms.forms.success_responses.empty_subtitle")}</p>
          <button className="fb-btn fb-btn--primary" onClick={handleCreate} type="button">
            <IcoPlus />
            {t("cms.forms.success_responses.create_first")}
          </button>
        </div>
      ) : (
        <div className="fb-success-grid">
          {successResponses.map((item) => (
            <div key={item.id} className="fb-success-card">
              {item.logo_url && (
                <div className="fb-success-card-logo">
                  <img src={item.logo_url} alt="" />
                </div>
              )}
              <div className="fb-success-card-body">
                <h3 className="fb-success-card-title">
                  {isRtl ? (item.title_ar || item.title_en) : (item.title_en || item.title_ar)}
                </h3>
                {(item.subtitle_ar || item.subtitle_en) && (
                  <p className="fb-success-card-subtitle">
                    {isRtl ? item.subtitle_ar : item.subtitle_en}
                  </p>
                )}
                <code className="fb-slug-chip fb-slug-chip--sm">{item.slug}</code>
              </div>
              <div className="fb-success-card-actions">
                <Editbtn
                  onClick={() => handleEdit(item)}
                  className="fb-btn fb-btn--ghost fb-btn--sm"
                  iconOnly={false}
                  label={t("cms.forms.actions.edit")}
                />
                <Deletebtn
                  onConfirm={() => handleDelete(item.id)}
                  className="fb-btn fb-btn--danger-ghost fb-btn--sm"
                  iconOnly={false}
                  label={t("cms.forms.actions.delete")}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <SuccessResponseModal
          initialData={editingItem}
          saving={saving}
          onClose={() => { setModalOpen(false); setEditingItem(null); }}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}