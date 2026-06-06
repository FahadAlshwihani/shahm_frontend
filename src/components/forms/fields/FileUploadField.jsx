import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

function getText(obj, field, isEn, fallback = "") {
  return isEn
    ? obj[`${field}_en`] || obj[`${field}_ar`] || fallback
    : obj[`${field}_ar`] || obj[`${field}_en`] || fallback;
}

function FileUploadField({ field, file, error, onFileChange, isEn }) {
  const { t } = useTranslation();
  const label = getText(field, "label", isEn);
  const help  = getText(field, "help_text", isEn);
  const inputRef = useRef(null);
  const [touched, setTouched] = useState(false);

  const allowedExtensions = field.validation_rules?.allowed_extensions || [];
  const accept = allowedExtensions.length
    ? allowedExtensions.map((ext) => (ext.startsWith(".") ? ext : `.${ext}`)).join(",")
    : undefined;

  const isMultiple = !!field.validation_rules?.multiple;

  /* normalise file list */
  const fileList = Array.isArray(file) ? file : (file ? [file] : []);
  const hasFile  = fileList.length > 0;

  /* display name — for multiple files show count, else show name */
  const displayName = hasFile
    ? isMultiple && fileList.length > 1
      ? `${fileList.length} ${isEn ? "files" : "ملفات"}`
      : (fileList[0]?.name || fileList[0]?.original_name || (isEn ? "File" : "ملف"))
    : "";

  const showError = touched && field.required && !hasFile;

  const wrapperClass = [
    "srm-file-wrapper",
    hasFile           ? "is-filled" : "",
    showError || error ? "is-error"  : "",
  ].filter(Boolean).join(" ");

  const handleClick = () => {
    setTouched(true);
    inputRef.current?.click();
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onFileChange(field.key, []);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleRemoveOne = (e, idx) => {
    e.stopPropagation();
    const cloned = [...fileList];
    cloned.splice(idx, 1);
    onFileChange(field.key, cloned);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleChange = (e) => {
    const selected = Array.from(e.target.files || []);
    setTouched(true);
    if (isMultiple) {
      onFileChange(field.key, selected);
    } else {
      onFileChange(field.key, selected[0] ? [selected[0]] : []);
    }
  };

  return (
    <div className="srm-form-field">
      <div className={wrapperClass}>

        {/* floating label */}
        {label && (
          <span className="srm-float-label" style={showError ? { color: "#EF5D5F" } : {}}>
            {label}
            {field.required && <span aria-hidden="true"> *</span>}
          </span>
        )}

        {/* hidden native file input */}
        <input
          ref={inputRef}
          type="file"
          name={field.key}
          accept={accept}
          multiple={isMultiple}
          aria-hidden="true"
          onChange={handleChange}
        />

        {/* single-file or no-file: one trigger row */}
        {!isMultiple || !hasFile ? (
          <div
            className={`srm-file-trigger${showError || error ? " error" : ""}`}
            onClick={handleClick}
            role="button"
            tabIndex={0}
            aria-label={label}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleClick(); }}
            onBlur={() => setTouched(true)}
          >
            {/* filename or required placeholder */}
            {hasFile ? (
              <span className="srm-file-filename">
                {fileList[0]?.url ? (
                  <a
                    href={fileList[0].url}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "#343C3C", textDecoration: "underline" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {displayName}
                  </a>
                ) : displayName}
              </span>
            ) : showError ? (
              <span className="srm-required-placeholder" style={{ position: "static", width: "auto", height: "auto" }}>
                {t("forms.required_field_placeholder", "Required field")}
              </span>
            ) : (
              <span style={{ flex: 1 }} />
            )}

            {/* icon: X if file uploaded, file icon otherwise */}
            {hasFile ? (
              <button
                type="button"
                className="srm-file-delete"
                aria-label={isEn ? "Remove file" : "إزالة الملف"}
                onClick={handleRemove}
              >
                <svg viewBox="0 0 10 10" fill="none" aria-hidden="true">
                  <path d="M1 1l8 8M9 1L1 9" strokeLinecap="round" />
                </svg>
              </button>
            ) : (
              <span className="srm-file-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 18V12M12 12L14 14M12 12L10 14M13 3H8.2C7.0799 3 6.51984 3 6.09202 3.21799C5.71569 3.40973 5.40973 3.71569 5.21799 4.09202C5 4.51984 5 5.0799 5 6.2V17.8C5 18.9201 5 19.4802 5.21799 19.908C5.40973 20.2843 5.71569 20.5903 6.09202 20.782C6.51984 21 7.0799 21 8.2 21H15.8C16.9201 21 17.4802 21 17.908 20.782C18.2843 20.5903 18.5903 20.2843 18.782 19.908C19 19.4802 19 18.9201 19 17.8V9M13 3L19 9M13 3V7.4C13 7.96005 13 8.24008 13.109 8.45399C13.2049 8.64215 13.3578 8.79513 13.546 8.89101C13.7599 9 14.0399 9 14.6 9H19"
                    stroke="#343C3C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  />
                </svg>
              </span>
            )}
          </div>
        ) : (
          /* multiple files: list each with its own X */
          <div style={{ paddingTop: "18px", borderBottom: "1px solid #E9ECEC" }}>
            {fileList.map((item, idx) => {
              const name = item?.name || item?.original_name || `File ${idx + 1}`;
              return (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "4px 0",
                  }}
                >
                  <span className="srm-file-filename">
                    {item?.url ? (
                      <a href={item.url} target="_blank" rel="noreferrer"
                        style={{ color: "#343C3C", textDecoration: "underline" }}>
                        {name}
                      </a>
                    ) : name}
                  </span>
                  <button
                    type="button"
                    className="srm-file-delete"
                    aria-label={isEn ? "Remove file" : "إزالة الملف"}
                    onClick={(e) => handleRemoveOne(e, idx)}
                  >
                    <svg viewBox="0 0 10 10" fill="none" aria-hidden="true">
                      <path d="M1 1l8 8M9 1L1 9" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              );
            })}
            {/* add more */}
            <div
              className="srm-file-trigger"
              style={{ borderBottom: "none", paddingTop: "4px" }}
              onClick={handleClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleClick(); }}
            >
              <span style={{ fontSize: "12px", color: "#7C8D8D" }}>
                {isEn ? "+ Add more" : "+ إضافة المزيد"}
              </span>
            </div>
          </div>
        )}

        {/* force label up when error shows */}
        {showError && (
          <style>{`.srm-file-wrapper.is-error .srm-float-label { top: 0 !important; font-size: 10px !important; }`}</style>
        )}

      </div>

      {help && <p className="srm-section-subtitle" style={{ marginBottom: 0 }}>{help}</p>}
      {error && !showError && <p className="srm-field-error">{String(error)}</p>}
    </div>
  );
}

export default React.memo(FileUploadField);