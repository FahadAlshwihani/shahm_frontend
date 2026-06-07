import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  getPublicMainServices,
  getPublicServices,
} from "../../../api/servicesApi";

function getText(
    obj,
    field,
    isEn,
    fallback = ""
) {
    return isEn
        ? obj?.[`${field}_en`] ||
              obj?.[`${field}_ar`] ||
              fallback
        : obj?.[`${field}_ar`] ||
              obj?.[`${field}_en`] ||
              fallback;
}

function ServicesPickerField({
  field,
  value = [],
  onValueChange,
  isEn,
}) {
    const { t } = useTranslation();
  const fieldLabel = getText(field, "label", isEn);

  const [mainServices, setMainServices] = useState([]);
  const [servicesMap,  setServicesMap]  = useState({});

  // Always start with one required group
  const groups = Array.isArray(value) && value.length
    ? value
    : [{ main_service: "", service: "" }];

  // Load all main service categories once
  useEffect(() => {
    async function load() {
      try {
        const res   = await getPublicMainServices();
        const items = res?.data?.results || res?.data || [];
        setMainServices(items);
      } catch (err) { console.error(err); }
    }
    load();
  }, []);

  // Load sub-services for a given category (cached)
  const ensureServices = async (mainServiceId) => {
    if (!mainServiceId || servicesMap[mainServiceId]) return;
    try {
      const res   = await getPublicServices({ main_service: mainServiceId });
      const items = res?.data?.results || res?.data || [];
      setServicesMap((prev) => ({ ...prev, [mainServiceId]: items }));
    } catch (err) { console.error(err); }
  };

  const push = (newGroups) => onValueChange(field.key, newGroups);

  const handleCategory = async (idx, catId) => {
    await ensureServices(catId);
    const next = [...groups];
    next[idx]  = { main_service: catId, service: "" };
    push(next);
  };

  const handleService = (idx, svcId) => {
    const next = [...groups];
    next[idx]  = { ...next[idx], service: svcId };
    push(next);
  };

  const addGroup = () => {
    push([...groups, { main_service: "", service: "" }]);
  };

  const removeGroup = (idx) => {
    push(groups.filter((_, i) => i !== idx));
  };

  // Shared floating-label select style matching SelectField
  const floatWrapStyle = {
    paddingTop: "18px",
    minHeight: "68px",
    boxSizing: "border-box",
    position: "relative",
    width: "100%",
  };

  // isRTL drives left/right anchoring — matches SelectField exactly
  const floatLabelStyle = (floated, isRTL) => ({
    position: "absolute",
    top: floated ? "0px" : "14px",
    left:  isRTL ? "auto" : 0,
    right: isRTL ? 0      : "auto",
    fontSize: floated ? "10px" : "12px",
    color: "#7C8D8D",
    fontFamily: "var(--font-content)",
    fontWeight: 400,
    lineHeight: "29px",
    pointerEvents: "none",
    transition: "top 0.2s ease, font-size 0.2s ease",
    whiteSpace: "nowrap",
  });

  const isRTL = !isEn;

  return (
    <div className="srm-form-field" style={{ gridColumn: "1 / -1" }}>

      {/* field label */}
      {fieldLabel && (
        <h3 className="srm-section-title" style={{ marginBottom: "16px" }}>
          {fieldLabel}
          {field.required && <span aria-hidden="true"> *</span>}
        </h3>
      )}

      <div className="services-picker-wrapper">

        {groups.map((group, idx) => {
          const isFirst      = idx === 0;
          const subServices  = servicesMap[group.main_service] || [];
          const catSelected  = !!group.main_service;
          const svcSelected  = !!group.service;

          const catLabel = isEn ? "Main Category" : "التصنيف الرئيسي";
          const svcLabel = isEn ? "Service Type"  : "نوع الخدمة";

          const catOption = mainServices.find(
            (m) => String(m.id) === String(group.main_service)
          );
          const catDisplay = catOption ? getText(catOption, "title", isEn) : null;

          const svcOption = subServices.find(
            (s) => String(s.id) === String(group.service)
          );
          const svcDisplay = svcOption ? getText(svcOption, "title", isEn) : null;

          return (
            <div key={idx} className="services-picker-group">
              <div className={`services-picker-selects-row${!isFirst ? " has-remove" : ""}`}>

                {/* Col 1: X button — only on additional groups */}
                {!isFirst && (
                  <button
                    type="button"
                    className="services-remove-btn"
                    aria-label={isEn ? "Remove" : "حذف"}
                    onClick={() => removeGroup(idx)}
                  >
                    <svg
                      viewBox="0 0 51.123 51.123"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path d="M45.123,0H6C2.691,0,0,2.691,0,6v39.123c0,3.309,2.691,6,6,6h39.123c3.309,0,6-2.691,6-6V6C51.123,2.691,48.431,0,45.123,0z M49.123,45.123c0,2.206-1.794,4-4,4H6c-2.206,0-4-1.794-4-4V6c0-2.206,1.794-4,4-4h39.123c2.206,0,4,1.794,4,4V45.123z M36.791,15.746l-9.815,9.815l9.815,9.815c0.391,0.391,0.391,1.023,0,1.414c-0.195,0.195-0.451,0.293-0.707,0.293s-0.512-0.098-0.707-0.293l-9.815-9.815l-9.815,9.815c-0.195,0.195-0.451,0.293-0.707,0.293s-0.512-0.098-0.707-0.293c-0.391-0.391-0.391-1.023,0-1.414l9.815-9.815l-9.815-9.815c-0.391-0.391-0.391-1.023,0-1.414s1.023-0.391,1.414,0l9.815,9.815l9.815-9.815c0.391-0.391,1.023-0.391,1.414,0S37.181,15.355,36.791,15.746z"/>
                    </svg>
                  </button>
                )}

                {/* Col 2: Category select */}
                <CategorySelect
                  label={catLabel}
                  options={mainServices}
                  value={group.main_service}
                  display={catDisplay}
                  isEn={isEn}
                  isRTL={isRTL}
                  required={isFirst && field.required}
                  floatWrapStyle={floatWrapStyle}
                  floatLabelStyle={floatLabelStyle}
                  getText={getText}
                  onChange={(catId) => handleCategory(idx, catId)}
                />

                {/* Col 3: Service select */}
                <ServiceSelect
                  label={svcLabel}
                  options={subServices}
                  value={group.service}
                  display={svcDisplay}
                  isEn={isEn}
                  isRTL={isRTL}
                  disabled={!catSelected}
                  required={isFirst && field.required}
                  floatWrapStyle={floatWrapStyle}
                  floatLabelStyle={floatLabelStyle}
                  getText={getText}
                  onChange={(svcId) => handleService(idx, svcId)}
                />

              </div>
            </div>
          );
        })}

        {/* Add additional service button */}
        <div className="services-add-row">
          <button
            type="button"
            className="services-add-btn"
            aria-label={isEn ? "Add an additional service" : "إضافة خدمة إضافية"}
            onClick={addGroup}
          >
            <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect width="48" height="48" fill="none"/>
              <path d="M34,22H26V14a2,2,0,0,0-4,0v8H14a2,2,0,0,0,0,4h8v8a2,2,0,0,0,4,0V26h8a2,2,0,0,0,0-4Z"/>
              <path d="M40,8V40H8V8H40m2-4H6A2,2,0,0,0,4,6V42a2,2,0,0,0,2,2H42a2,2,0,0,0,2-2V6a2,2,0,0,0-2-2Z"/>
            </svg>
          </button>
          <span className="services-add-label">
            {isEn ? "Add an Additional Service ?" : "إضافة خدمة إضافية ؟"}
          </span>
        </div>

      </div>
    </div>
  );
}

// ── Internal sub-components ─────────────────────────────────────────

function CategorySelect({ label, options, value, display, isEn, isRTL, required, floatWrapStyle, floatLabelStyle, getText, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div style={floatWrapStyle} ref={ref}>
      <label style={floatLabelStyle(!!display, isRTL)}>
        {label}{required && <span aria-hidden="true"> *</span>}
      </label>
      <div className="srm-custom-select">
        <div
          className="srm-custom-select-trigger"
          onClick={() => setOpen((p) => !p)}
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen((p) => !p); } if (e.key === "Escape") setOpen(false); }}
        >
          <span style={{ flex: 1, color: display ? "#343C3C" : "transparent" }}>
            {display || "_"}
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", flexShrink: 0 }}>
            <svg className={`srm-dropdown-arrow${open ? " open" : ""}`} width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 6L8 10L12 6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </div>
        {open && (
          <ul className="srm-custom-select-dropdown" role="listbox">
            {options.map((item) => (
              <li
                key={item.id}
                className="srm-custom-select-option"
                role="option"
                aria-selected={String(item.id) === String(value)}
                style={String(item.id) === String(value) ? { fontWeight: 600, color: "#353C3C" } : {}}
                onClick={() => { onChange(String(item.id)); setOpen(false); }}
              >
                {getText(item, "title", isEn)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function ServiceSelect({ label, options, value, display, isEn, isRTL, disabled, required, floatWrapStyle, floatLabelStyle, getText, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div
      style={{ ...floatWrapStyle, opacity: disabled ? 0.45 : 1 }}
      className={disabled ? "services-service-disabled" : ""}
      ref={ref}
    >
      <label style={floatLabelStyle(!!display, isRTL)}>
        {label}{required && <span aria-hidden="true"> *</span>}
      </label>
      <div className="srm-custom-select">
        <div
          className="srm-custom-select-trigger"
          onClick={() => { if (!disabled) setOpen((p) => !p); }}
          tabIndex={disabled ? -1 : 0}
          style={{ cursor: disabled ? "default" : "pointer" }}
          onKeyDown={(e) => {
            if (disabled) return;
            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen((p) => !p); }
            if (e.key === "Escape") setOpen(false);
          }}
        >
          <span style={{ flex: 1, color: display ? "#343C3C" : "transparent" }}>
            {display || "_"}
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", flexShrink: 0 }}>
            <svg className={`srm-dropdown-arrow${open ? " open" : ""}`} width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 6L8 10L12 6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </div>
        {open && !disabled && (
          <ul className="srm-custom-select-dropdown" role="listbox">
            {options.map((item) => (
              <li
                key={item.id}
                className="srm-custom-select-option"
                role="option"
                aria-selected={String(item.id) === String(value)}
                style={String(item.id) === String(value) ? { fontWeight: 600, color: "#353C3C" } : {}}
                onClick={() => { onChange(String(item.id)); setOpen(false); }}
              >
                {getText(item, "title", isEn)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default React.memo(ServicesPickerField);