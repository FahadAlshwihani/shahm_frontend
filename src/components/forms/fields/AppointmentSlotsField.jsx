import React from "react";
import { useTranslation } from "react-i18next";

function getText(obj, field, isEn, fallback = "") {
    return isEn
        ? obj?.[`${field}_en`] || obj?.[`${field}_ar`] || fallback
        : obj?.[`${field}_ar`] || obj?.[`${field}_en`] || fallback;
}

function format12HourTime(time) {
    if (!time) return "";

    const [hoursRaw, minutes] = time.split(":");
    let hours = parseInt(hoursRaw, 10);

    const suffix = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;

    if (hours === 0) {
        hours = 12;
    }

    return `${hours}:${minutes} ${suffix}`;
}

export default function AppointmentSlotsField({
    field,
    value,
    error,
    onValueChange,
    isEn,
}) {
    const { t } = useTranslation();

    const label = getText(field, "label", isEn);
    const options = field.options || [];

    // Split options into rows of max 5
    const rows = [];
    for (let i = 0; i < options.length; i += 5) {
        rows.push(options.slice(i, i + 5));
    }

    return (
        // srm-form-row--full forces this field to always take the full width row
        <div className="srm-form-field" style={{ gridColumn: "1 / -1" }}>

            {label && (
                <label
                    className="srm-section-title"
                    style={{ display: "block", marginBottom: "8px" }}
                >
                    {label}
                    {field.required && <span aria-hidden="true"> *</span>}
                </label>
            )}

            {options.length === 0 ? (
                <p className="appointment-no-slots">
                    {t("appointments.no_slots", "No appointments available")}
                </p>
            ) : (
                <div
                    className="appointment-slots-grid"
                    dir={isEn ? "ltr" : "rtl"}
                >
                    {options.map((option) => {
                        const isSelected = String(value) === String(option.value);
                        const isAvailable = option.is_available !== false;

                        const displayTime =
                            option.start_time
                                ? format12HourTime(option.start_time)
                                : option.label_ar || option.label_en

                        return (
                            <button
                                key={option.value}
                                type="button"
                                disabled={!isAvailable}
                                aria-pressed={isSelected}
                                className={[
                                    "appointment-slot",
                                    isAvailable ? "available" : "disabled",
                                    isSelected ? "selected" : "",
                                ].filter(Boolean).join(" ")}
                                onClick={() => {
                                    if (!isAvailable) return;
                                    onValueChange(field.key, option.value);
                                }}
                            >
                                {displayTime}
                            </button>
                        );
                    })}
                </div>
            )}

            {error && (
                <p className="srm-field-error">{String(error)}</p>
            )}
        </div>
    );
}