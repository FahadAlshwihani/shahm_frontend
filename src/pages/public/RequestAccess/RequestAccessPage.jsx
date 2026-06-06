import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

import {
  sendRequestOTP,
  verifyRequestOTP,
  getEditableRequestSnapshot,
  updateEditableRequest,
} from "../../../api/servicesApi";

import { useRequestAccessStore } from "../../../store/useRequestAccessStore";
import DynamicSection from "../../../components/forms/DynamicSection";

import "../../../styles/pages/RequestAccessPage.css";
import "../../../styles/pages/ServiceRequestModal.css";

// ─── helper: build getText same as form helpers ───────────────────
function getText(obj, field, isEn, fallback = "") {
  if (!obj) return fallback;
  return isEn
    ? obj[`${field}_en`] || obj[`${field}_ar`] || fallback
    : obj[`${field}_ar`] || obj[`${field}_en`] || fallback;
}

export default function RequestAccessPage() {
  const { publicKey } = useParams();
  const { i18n, t } = useTranslation();
  const isEn = i18n.language === "en";
  const isRTL = i18n.dir() === "rtl";

  const { accessToken, setAccessToken, snapshot, setSnapshot } =
    useRequestAccessStore();

  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("verify");
  const [loading, setLoading] = useState(false);

  const [maskedDestination, setMasked] = useState("");

  const [formValues, setFormValues] = useState({});
  const [formFiles, setFormFiles] = useState({});

  const [otpTouched, setOtpTouched] = useState(false);
  const [otpFocused, setOtpFocused] = useState(false);

  const [resendCooldown, setResendCooldown] = useState(0);

  // ─────────────────────────────────────────────────────────────
  // OTP COOLDOWN TIMER
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (resendCooldown <= 0) return;

    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        const next = prev - 1;

        if (next <= 0) {
          localStorage.removeItem(
            "request_otp_cooldown_until"
          );

          return 0;
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [resendCooldown]);

  // restore cooldown after refresh
  useEffect(() => {
    const cooldownUntil = localStorage.getItem(
      "request_otp_cooldown_until"
    );

    const masked = localStorage.getItem(
      "request_otp_masked"
    );

    if (masked) {
      setMasked(masked);
    }

    if (!cooldownUntil) {
      return;
    }

    const remaining = Math.max(
      0,
      Math.floor(
        (Number(cooldownUntil) - Date.now()) / 1000
      )
    );

    if (remaining > 0) {
      setResendCooldown(remaining);
      setStep("otp");
    } else {
      localStorage.removeItem(
        "request_otp_cooldown_until"
      );
    }
  }, []);

  // ── Populate form from snapshot, keep existing files ─────────────
  useEffect(() => {
    if (!snapshot?.values) return;

    const nextValues = {};
    const nextFiles = {};

    Object.entries(snapshot.values).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        // arrays with url objects = existing server files → keep in files
        const hasFileLike = value.some((item) => item?.url);
        if (hasFileLike) nextFiles[key] = value;  // preserve existing
        else nextValues[key] = value;
        return;
      }
      if (value && typeof value === "object" && value.url) {
        nextFiles[key] = [value];  // preserve existing single file
        return;
      }
      nextValues[key] = value;
    });

    setFormValues(nextValues);
    setFormFiles(nextFiles);
  }, [snapshot]);

  // ── Send OTP ─────────────────────────────────────────────────────
  const handleSendOTP = async () => {
    if (resendCooldown > 0 || loading) {
      return;
    }

    try {
      setLoading(true);

      const res = await sendRequestOTP(publicKey);

      setMasked(
        res.data.masked_destination || ""
      );

      const cooldown =
        Number(res.data.cooldown_seconds) || 120;

      setResendCooldown(cooldown);

      localStorage.setItem(
        "request_otp_cooldown_until",
        String(Date.now() + cooldown * 1000)
      );

      localStorage.setItem(
        "request_otp_masked",
        res.data.masked_destination || ""
      );

      toast.success(
        res.data.message ||
        t(
          "request_access.otp_sent",
          "Verification code sent"
        )
      );

      setStep("otp");

    } catch (err) {

      const status = err?.response?.status;

      // backend cooldown
      if (status === 429) {

        const remaining =
          Number(
            err?.response?.data?.remaining_seconds
          ) || 120;

        setResendCooldown(remaining);

        localStorage.setItem(
          "request_otp_cooldown_until",
          String(Date.now() + remaining * 1000)
        );
        toast.error(
          t(
            "request_access.wait_before_retry",
            "Please wait before requesting another code"
          )
        );

        return;
      }

      toast.error(
        err?.response?.data?.detail ||
        t(
          "request_access.otp_send_failed",
          "Failed to send code"
        )
      );

    } finally {
      setLoading(false);
    }
  };

  // ── Verify OTP ───────────────────────────────────────────────────
  const handleVerifyOTP = async () => {
    setOtpTouched(true);

    if (!otp.trim()) {
      return;
    }

    try {
      setLoading(true);

      const res = await verifyRequestOTP(
        publicKey,
        otp
      );

      setAccessToken(
        res.data.access_token
      );

      localStorage.removeItem(
        "request_otp_cooldown"
      );

      localStorage.removeItem(
        "request_otp_masked"
      );

      localStorage.removeItem(
        "request_otp_cooldown_until"
      );

      toast.success(
        t(
          "request_access.verified",
          "Verification successful"
        )
      );

      setStep("loading");

    } catch (err) {

      const status = err?.response?.status;

      if (status === 429) {
        toast.error(
          t(
            "request_access.too_many_attempts",
            "Too many attempts"
          )
        );

        return;
      }

      toast.error(
        err?.response?.data?.detail ||
        t(
          "request_access.otp_invalid",
          "Invalid code"
        )
      );

    } finally {
      setLoading(false);
    }
  };

  // ── Load snapshot after token ─────────────────────────────────────
  useEffect(() => {
    if (!accessToken) return;
    async function load() {
      try {
        const res = await getEditableRequestSnapshot(publicKey, accessToken);
        setSnapshot(res.data);
        setStep("form");
      } catch {
        toast.error(t("request_access.load_failed", "Failed to load request"));
      }
    }
    load();
  }, [accessToken, publicKey, setSnapshot, t]);

  // ── Submit form ───────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = snapshot?.form;
    const editableFields = snapshot?.editable_fields || [];
    const sections = (form?.sections || []).sort(
      (a, b) => (a.order ?? 0) - (b.order ?? 0)
    );

    try {
      setLoading(true);

      const payload = {};

      // editable text/select/etc values
      sections.forEach((section) => {
        (section.fields || []).forEach((field) => {
          const isEditable =
            editableFields.length === 0 || editableFields.includes(field.key);
          if (!isEditable) return;
          const value = formValues[field.key];
          if (value !== undefined && value !== null) payload[field.key] = value;
        });
      });

      // files: only send NEW File objects — existing server files are kept
      // by the backend automatically when the key is absent from the payload
      Object.entries(formFiles).forEach(([key, files]) => {
        const fresh = Array.isArray(files)
          ? files.filter((f) => f instanceof File)
          : files instanceof File
            ? [files]
            : [];
        // only append if user actually selected new files
        if (fresh.length > 0) payload[key] = fresh;
        // if fresh is empty, we skip the key → backend keeps old files
      });

      const formData = new FormData();

      Object.entries(payload).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          const hasFiles = value.some((f) => f instanceof File);
          if (hasFiles) {
            value.forEach((f) => { if (f instanceof File) formData.append(key, f); });
          } else {
            formData.append(key, JSON.stringify(value));
          }
          return;
        }
        if (value instanceof File) { formData.append(key, value); return; }
        if (typeof value === "object" && value !== null) {
          formData.append(key, JSON.stringify(value));
          return;
        }
        formData.append(key, value);
      });

      await updateEditableRequest(publicKey, accessToken, formData);
      toast.success(
        t("request_access.updated", "Your information has been saved and updated successfully")
      );
    } catch (err) {
      toast.error(err?.response?.data?.detail || t("request_access.update_failed", "Update failed"));
    } finally {
      setLoading(false);
    }
  };

  const setFieldValue = (key, value) =>
    setFormValues((prev) => ({ ...prev, [key]: value }));

  const setFieldFile = (key, files) =>
    setFormFiles((prev) => ({ ...prev, [key]: files }));

  // ─────────────────────────────────────────────────────────────────
  // STEP: verify
  // ─────────────────────────────────────────────────────────────────
  if (step === "verify") {
    return (
      <div className="rap-page" dir={isRTL ? "rtl" : "ltr"}>
        <div className="rap-card">
          <h1 className="rap-title">
            {t("request_access.verify_title", "Verify Access")}
          </h1>
          <p className="rap-subtitle">
            {t("request_access.verify_desc",
              "A verification code will be sent to your registered contact.")}
          </p>
          <div className="rap-divider" />
          <button
            className={`rap-btn${loading ? " loading" : " active"
              }`}
            onClick={handleSendOTP}
            disabled={
              loading ||
              resendCooldown > 0
            }
          >
            {loading
              ? t(
                "request_access.sending",
                "Sending..."
              )
              : t(
                "request_access.send_code",
                "Send Verification Code"
              )}
          </button>

          {resendCooldown > 0 && (
            <p
              style={{
                marginTop: "14px",
                opacity: 0.7,
                fontSize: "14px",
                textAlign: "center",
              }}
            >
              {t(
                "request_access.wait_before_retry",
                "Please wait before requesting another code"
              )}{" "}
              ({resendCooldown}s)
            </p>
          )}
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────
  // STEP: otp
  // ─────────────────────────────────────────────────────────────────
  if (step === "otp") {
    const otpHasValue = otp.trim().length > 0;
    const showOtpError = otpTouched && !otpFocused && !otpHasValue;

    return (
      <div className="rap-page" dir={isRTL ? "rtl" : "ltr"}>
        <div className="rap-card">
          <h1 className="rap-title">
            {t("request_access.otp_title", "Enter Verification Code")}
          </h1>

          {maskedDestination && (
            <div className="rap-destination">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.5a19.79 19.79 0 01-3.07-8.67A2 2 0 012.18 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.15a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
              </svg>
              {maskedDestination}
            </div>
          )}

          <p className="rap-subtitle">
            {t("request_access.otp_desc",
              "Please enter the 6-digit code sent to your contact.")}
          </p>

          <div className="rap-divider" />

          <div
            className={["rap-field",
              otpHasValue || otpFocused ? "is-filled" : "",
              showOtpError ? "is-error" : "",
            ].filter(Boolean).join(" ")}
            style={{ marginBottom: "32px" }}
          >
            <span className="rap-field-label">
              {t("request_access.otp_label", "Verification Code")}
            </span>
            <input
              className={`rap-otp-input${showOtpError ? " error" : ""}`}
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              placeholder="• • • • • •"
              onFocus={() => setOtpFocused(true)}
              onBlur={() => { setOtpFocused(false); setOtpTouched(true); }}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            />
            {showOtpError && (
              <p className="rap-field-error">
                {t("request_access.otp_required", "Please enter the verification code")}
              </p>
            )}
          </div>

          <div className="rap-resend-row">
            <span className="rap-resend-text">
              {t("request_access.no_code", "Didn't receive a code?")}
            </span>
            <button
              className="rap-resend-btn"
              onClick={handleSendOTP}
              disabled={
                loading ||
                resendCooldown > 0
              }
            >
              {resendCooldown > 0
                ? `${resendCooldown}s`
                : t(
                  "request_access.resend",
                  "Resend"
                )
              }
            </button>
          </div>

          <button
            className={["rap-btn",
              loading ? "loading" : otpHasValue ? "active" : "",
            ].filter(Boolean).join(" ")}
            onClick={handleVerifyOTP}
            disabled={loading || !otpHasValue}
          >
            {loading
              ? t("request_access.verifying", "Verifying...")
              : t("request_access.verify", "Verify")}
          </button>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────
  // STEP: loading
  // ─────────────────────────────────────────────────────────────────
  if (step === "loading") {
    return (
      <div className="rap-page" dir={isRTL ? "rtl" : "ltr"}>
        <div className="rap-card">
          <div className="rap-loading">
            <div className="rap-spinner" />
            <p className="rap-loading-text">
              {t("request_access.loading", "Loading your request...")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────
  // STEP: form — popup modal identical to DynamicPublicForm
  // ─────────────────────────────────────────────────────────────────
  if (step === "form") {
    const form = snapshot?.form;
    const editableFields = snapshot?.editable_fields || [];
    const sections = (form?.sections || []).sort(
      (a, b) => (a.order ?? 0) - (b.order ?? 0)
    );

    const formTitle = getText(form, "title", isEn);
    const formDescription = getText(form, "description", isEn);
    const submitLabel = getText(form, "submit_button_text", isEn);

    // compute all required editable fields filled
    const allFilled = sections.every((section) =>
      (section.fields || []).every((field) => {
        const isEditable =
          editableFields.length === 0 || editableFields.includes(field.key);
        if (!isEditable || !field.required) return true;
        // file fields: existing server files count as filled
        if (field.field_type === "file") {
          return (formFiles[field.key]?.length ?? 0) > 0;
        }
        if (field.field_type === "phone") {
          const v = formValues[field.key];
          return v?.country_code && v?.number?.trim();
        }
        const v = formValues[field.key];
        return v !== undefined && v !== null && v !== "" &&
          !(Array.isArray(v) && v.length === 0);
      })
    );

    const isActive = allFilled && !loading;

    return (
      <div className="srm-overlay" dir={isRTL ? "rtl" : "ltr"}>
        <div className="srm-container" dir={isRTL ? "rtl" : "ltr"}>

          {/* Header */}
          <div className="srm-header">
            {/* no close button — this is the edit page, user must save or navigate away */}
          </div>

          {/* Title + description */}
          {(formTitle || formDescription) && (
            <div className="srm-terms">
              {formTitle && <h2 className="srm-terms-title">{formTitle}</h2>}
              {formDescription && (
                <p className="srm-terms-description">{formDescription}</p>
              )}
            </div>
          )}

          <div className="srm-divider" />

          <form onSubmit={handleSubmit}>
            <div className="srm-content">

              {sections.map((section, idx) => {
                const updatedSection = {
                  ...section,
                  fields: (section.fields || []).map((field) => ({
                    ...field,
                    editable:
                      editableFields.length === 0 ||
                      editableFields.includes(field.key),
                  })),
                };

                return (
                  <div key={section.id}>
                    <DynamicSection
                      section={updatedSection}
                      values={formValues}
                      files={formFiles}
                      errors={{}}
                      onValueChange={setFieldValue}
                      onFileChange={setFieldFile}
                      isEn={isEn}
                    />
                    {idx < sections.length - 1 && (
                      <div className="srm-divider" style={{ margin: "0 0 40px 0" }} />
                    )}
                  </div>
                );
              })}

              {/* Submit row */}
              <div className="srm-submit-row">
                <button
                  type="submit"
                  disabled={!isActive}
                  className={[
                    "srm-submit-button",
                    loading ? "loading" : isActive ? "active" : "",
                  ].filter(Boolean).join(" ")}
                >
                  {loading
                    ? t("request_access.saving", "Saving...")
                    : submitLabel || t("request_access.save_changes", "Save Changes")}
                </button>
              </div>

            </div>
          </form>

        </div>
      </div>
    );
  }

  return null;
}