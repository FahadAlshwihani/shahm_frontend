import React from "react";
import { useTranslation } from "react-i18next";

/**
 * The save controls, with the state of the edit stated in words.
 *
 * An editor should never have to guess whether their work is stored, so the
 * bar says "unsaved changes" while an edit is pending and stays out of the way
 * when there is nothing to save.
 */
export default function SaveBar({
  dirty,
  saving,
  onCancel,
  cancelLabel,
  submitLabel,
  savingLabel,
  formError,
  children,
}) {
  const { t } = useTranslation();

  return (
    <div className="sf-savebar">
      <div className="sf-savebar__state">
        {formError ? (
          <span className="sf-savebar__error" role="alert">{formError}</span>
        ) : dirty ? (
          <span className="sf-savebar__dirty">
            {t("form_layer.unsaved", "تعديل غير محفوظ")}
          </span>
        ) : (
          <span className="sf-savebar__clean">
            {t("form_layer.saved", "لا تعديل معلق")}
          </span>
        )}
      </div>

      <div className="sf-savebar__actions">
        {children}

        {onCancel && (
          <button type="button" className="sf-btn sf-btn--quiet" onClick={onCancel} disabled={saving}>
            {cancelLabel || t("form_layer.cancel", "الغاء")}
          </button>
        )}

        <button type="submit" className="sf-btn" disabled={saving || !dirty}>
          {saving
            ? savingLabel || t("form_layer.saving", "جار الحفظ")
            : submitLabel || t("form_layer.save", "حفظ")}
        </button>
      </div>
    </div>
  );
}
