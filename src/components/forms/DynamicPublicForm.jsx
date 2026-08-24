import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { getPublicForm, submitPublicForm } from "../../api/formBuilderApi";
import DynamicSection from "./DynamicSection";
import PublicSuccessCard from "./PublicSuccessCard";
import { useSearchParams } from "react-router-dom";
import { useFormAccessStore } from "../../store/useFormAccessStore";
import "../../styles/pages/ServiceRequestModal.css"

// ─── helpers ────────────────────────────────────────────────────────────────

function hasFileField(form) {
  return form?.sections?.some((section) =>
    section.fields?.some((field) => field.field_type === "file")
  );
}

function getText(obj, field, isEn, fallback = "") {
  if (!obj) return fallback;
  return isEn
    ? obj[`${field}_en`] || obj[`${field}_ar`] || fallback
    : obj[`${field}_ar`] || obj[`${field}_en`] || fallback;
}

// ─── component ───────────────────────────────────────────────────────────────

export default function DynamicPublicForm({
  slug,
  mode = "modal",
  open = true,
  onClose,
  logoSrc,
}) {
  const { i18n, t } = useTranslation();
  const isEn = i18n.language === "en";
  const isRTL = i18n.dir() === "rtl";

  const [searchParams] = useSearchParams();
  const accessKey = searchParams.get("access_key");
  const accessToken = useFormAccessStore((s) => s.accessToken);
  const verified = !!accessToken;

  const [formSchema, setFormSchema] = useState(null);
  const [values, setValues] = useState({});
  const [files, setFiles] = useState({});
  const [acceptTerms] = useState(true);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);

  const sections = useMemo(
    () => [...(formSchema?.sections || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [formSchema]
  );

  const successResponse =
    submitResult?.success_response ||
    formSchema?.success_response ||
    null;

  // ── load form ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!slug || !open) return;
    let alive = true;

    async function loadForm() {
      try {
        setLoading(true);
        const res = await getPublicForm(slug);
        if (!alive) return;
        setFormSchema(res.data);
        if (
          res.data?.initial_values
        ) {

          const initialFiles = {};

          Object.entries(
            res.data.initial_values
          ).forEach(([key, value]) => {

            if (
              Array.isArray(value)
            ) {
              initialFiles[key] = value;
            }

          });

          setFiles(initialFiles);

        }
      } catch (err) {
        console.error(err);
        toast.error(t("forms.load_error", "Failed to load form"));
      } finally {
        if (alive) setLoading(false);
      }
    }

    loadForm();
    return () => { alive = false; };
  }, [slug, open, t]);

  // ── field handlers ─────────────────────────────────────────────────────────
  const setFieldValue = (key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const setFieldFile = (
    key,
    incomingFiles
  ) => {

    let normalized = [];

    if (!incomingFiles) {
      normalized = [];
    }

    else if (
      Array.isArray(incomingFiles)
    ) {
      normalized = incomingFiles;
    }

    else {
      normalized = [incomingFiles];
    }

    setFiles((prev) => ({
      ...prev,
      [key]: normalized,
    }));

    setErrors((prev) => ({
      ...prev,
      [key]: undefined,
    }));
  };

  // ── validation ─────────────────────────────────────────────────────────────
  const validateClient = () => {
    const nextErrors = {};

    sections.forEach((section) => {
      (section.fields || []).forEach((field) => {
        const fieldKey = field.key;

        if (!field.required) return;

        if (field.field_type === "file") {
          if (
            !files[fieldKey] ||
            files[fieldKey].length === 0
          ) {
            nextErrors[fieldKey] = t(
              "forms.required_file",
              "This file is required"
            );
          }
          return;
        }

        const value = values[fieldKey];

        if (
          value === undefined ||
          value === null ||
          value === "" ||
          (Array.isArray(value) && value.length === 0)
        ) {
          nextErrors[fieldKey] = t(
            "forms.required_field",
            "This field is required"
          );
        }

        if (field.field_type === "phone") {
          if (!value?.country_code || !value?.number) {
            nextErrors[fieldKey] = t(
              "forms.required_field",
              "This field is required"
            );
          }
        }
      });
    });

    if (formSchema?.require_terms_approval && !acceptTerms) {
      nextErrors.accept_terms = t(
        "forms.terms_required",
        "You must approve the terms"
      );
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  // ── payload ────────────────────────────────────────────────────────────────
  const buildPayload = () => {
    const usesMultipart = hasFileField(formSchema);
    const cleanData = { ...values };

    if (formSchema?.require_terms_approval) {
      cleanData.accept_terms = acceptTerms;
    }

    if (!usesMultipart) {
      return cleanData;
    }

    const fd = new FormData();

    fd.append("data", JSON.stringify(cleanData));

    Object.entries(files).forEach(([key, fileList]) => {
      if (
        !Array.isArray(fileList)
      ) {
        return;
      }

      fileList.forEach((item) => {

        if (
          item instanceof File
        ) {
          fd.append(key, item);
        }

      });
    });

    return fd;
  };

  // ── submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateClient()) {
      toast.error(t("forms.fix_errors", "Please complete the required fields"));
      return;
    }

    try {
      setSubmitting(true);

      const payload = buildPayload();

      const res = await submitPublicForm(slug, payload, { accessKey, accessToken });

      setSubmitResult(res.data);

      toast.success(
        getText(res.data?.success_response, "title", isEn) ||
        t("forms.submit_success", "Form submitted successfully")
      );

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      const apiErrors = err?.response?.data;
      if (apiErrors && typeof apiErrors === "object") setErrors(apiErrors);
      toast.error(t("forms.submit_error", "Failed to submit form"));
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  // ── content ────────────────────────────────────────────────────────────────
  const content = (
    <div className="srm-container" dir={isRTL ? "rtl" : "ltr"}>

      {/* Header: logo + close button */}
      <div className="srm-header">
        {mode === "modal" && (
          <button
            type="button"
            className="srm-close-button"
            onClick={onClose}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
            <span>{t("forms.close", "Close")}</span>
          </button>
        )}

        {logoSrc && (
          <img src={logoSrc} alt="" className="srm-logo" />
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="srm-terms" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p className="srm-terms-description">{t("forms.loading", "Loading...")}</p>
        </div>
      )}

      {/* Not found */}
      {!loading && !formSchema && (
        <div className="srm-terms" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p className="srm-terms-description">{t("forms.not_found", "Form not found")}</p>
        </div>
      )}

      {/* Thank-you screen — rendered outside the card, over the overlay */}
      {!loading && formSchema && submitted && (
        <PublicSuccessCard
          data={{
            ...successResponse,
            logo_url: successResponse?.logo_url || logoSrc || null,
          }}
          isEn={isEn}
          onClose={onClose}
        />
      )}

      {/* Main form */}
      {!loading && formSchema && !submitted && (
        <form
          onSubmit={handleSubmit}
          style={{
            opacity: formSchema?.requires_verification && !verified ? 0.4 : 1,
            pointerEvents: formSchema?.requires_verification && !verified ? "none" : "auto",
          }}
        >
          {/* Form title + description */}
          {(getText(formSchema, "title", isEn) || getText(formSchema, "description", isEn)) && (
            <div className="srm-terms">
              {getText(formSchema, "title", isEn) && (
                <h2 className="srm-terms-title">{getText(formSchema, "title", isEn)}</h2>
              )}
              {getText(formSchema, "description", isEn) && (
                <p className="srm-terms-description">{getText(formSchema, "description", isEn)}</p>
              )}
            </div>
          )}

          <div className="srm-divider" />

          <div className="srm-content">

            {/* Empty state */}
            {sections.length === 0 && (
              <p className="srm-terms-description">
                {t("forms.no_sections", "No sections have been added to this form yet.")}
              </p>
            )}

            {/* Sections */}
            {sections.map((section, idx) => (
              <React.Fragment key={section.id}>
                <DynamicSection
                  section={section}
                  values={values}
                  files={files}
                  errors={errors}
                  onValueChange={setFieldValue}
                  onFileChange={setFieldFile}
                  isEn={isEn}
                />
                {idx < sections.length - 1 && (
                  <div className="srm-divider" style={{ margin: "0 0 40px 0" }} />
                )}
              </React.Fragment>
            ))}

            {/* terms acceptance is implicit on submit — no checkbox needed */}

            {/* Submit row — button first, terms below */}
            {(() => {
              // compute whether every required field has a value
              const allFilled = sections.every((section) =>
                (section.fields || []).every((field) => {
                  if (!field.required) return true;
                  if (field.field_type === "file") {
                    return files[field.key] && files[field.key].length > 0;
                  }
                  if (field.field_type === "phone") {
                    const v = values[field.key];
                    return v?.country_code && v?.number?.trim();
                  }
                  const v = values[field.key];
                  return v !== undefined && v !== null && v !== "" &&
                    !(Array.isArray(v) && v.length === 0);
                })
              );
              const isActive = allFilled && !submitting;

              return (
                <div className="srm-submit-row">
                  <button
                    type="submit"
                    disabled={!isActive}
                    className={[
                      "srm-submit-button",
                      submitting ? "loading" :
                        isActive ? "active" : "",
                    ].join(" ")}
                  >
                    {submitting
                      ? t("forms.submitting", "Submitting...")
                      : getText(formSchema, "submit_button_text", isEn) ||
                      t("forms.submit", "Submit")}
                  </button>

                  {/* Policy/terms text — always below button */}
                  {(formSchema.terms_text_ar || formSchema.terms_text_en) && (
                    <p className="srm-submit-terms">
                      {getText(formSchema, "terms_text", isEn)}
                    </p>
                  )}
                </div>
              );
            })()}
          </div>
        </form>
      )}
    </div>
  );

  // ── render modes ───────────────────────────────────────────────────────────
  if (mode === "page") {
    return (
      <>
        <div className="srm-overlay" style={{ position: "relative", background: "none", padding: "40px 20px" }}>
          {content}
        </div>
        {!loading && formSchema && submitted && (
          <PublicSuccessCard
            data={{ ...successResponse, logo_url: successResponse?.logo_url || logoSrc || null }}
            isEn={isEn}
            onClose={onClose}
          />
        )}
      </>
    );
  }

  return (
    <div className="srm-overlay">
      {!submitted && <div>{content}</div>}
      {submitted && (
        <PublicSuccessCard
          data={{ ...successResponse, logo_url: successResponse?.logo_url || logoSrc || null }}
          isEn={isEn}
          onClose={onClose}
        />
      )}
    </div>
  );
}
