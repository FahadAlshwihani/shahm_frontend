import React from "react";
import DynamicFieldRenderer from "./DynamicFieldRenderer";

function getText(obj, field, isEn, fallback = "") {
  if (!obj) return fallback;
  return isEn
    ? obj[`${field}_en`] || obj[`${field}_ar`] || fallback
    : obj[`${field}_ar`] || obj[`${field}_en`] || fallback;
}

/**
 * Groups sorted fields into rows based on their width value.
 * Rules:
 *  - "full"  → always its own row (1 column)
 *  - "half"  → pack up to 2 per row
 *  - "third" → pack up to 3 per row
 *  - mixed   → start a new row whenever the current row is full
 *              or when widths would conflict (e.g. half after a third)
 */
function groupFieldsIntoRows(fields) {
  const rows = [];
  let currentRow = [];
  let currentType = null; // "half" | "third" | null
  let currentSlots = 0;   // slots already consumed in currentRow

  const maxSlots = { half: 2, third: 3 };

  const flush = () => {
    if (currentRow.length > 0) {
      rows.push(currentRow);
      currentRow = [];
      currentType = null;
      currentSlots = 0;
    }
  };

  fields.forEach((field) => {
    // appointment slots always get their own full-width row
    if (
      field.dynamic_source === "appointment_slots" ||
      field.settings?.dynamic_source === "appointment_slots"
    ) {
      flush();
      rows.push([field]);
      return;
    }

    // services picker always gets its own full-width row
    if (
      field.system_key === "service_ids" &&
      field.settings?.render_as === "services_picker"
    ) {
      flush();
      rows.push([field]);
      return;
    }

    const width = field.width || "full";

    if (width === "full") {
      flush();
      rows.push([field]);
      return;
    }

    const slots = maxSlots[width] || 2;

    // Different column type → start a new row
    if (currentType && currentType !== width) {
      flush();
    }

    // Row is full → start a new row
    if (currentSlots >= (maxSlots[width] || 2)) {
      flush();
    }

    currentRow.push(field);
    currentType = width;
    currentSlots += 1;
  });

  flush();
  return rows;
}

/**
 * Maps width → CSS grid class
 */
function rowClassName(fields) {
  if (!fields.length) return "srm-form-row";
  const firstField = fields[0];
  // appointment slots always full width
  if (
    firstField.dynamic_source === "appointment_slots" ||
    firstField.settings?.dynamic_source === "appointment_slots"
  ) {
    return "srm-form-row srm-form-row--full";
  }
  // services picker always full width
  if (
    firstField.system_key === "service_ids" &&
    firstField.settings?.render_as === "services_picker"
  ) {
    return "srm-form-row srm-form-row--full";
  }
  const width = fields[0].width || "full";
  if (width === "full") return "srm-form-row srm-form-row--full";
  if (width === "third") return "srm-form-row srm-form-row--thirds";
  return "srm-form-row"; // default half / 2-col
}

function DynamicSection({
  section,
  values,
  files,
  errors,
  onValueChange,
  onFileChange,
  isEn,
}) {
  const fields = [...(section.fields || [])].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  );

  const rows = groupFieldsIntoRows(fields);

  return (
    <section className="srm-section">
      {(getText(section, "title", isEn) || getText(section, "description", isEn)) && (
        <div>
          {getText(section, "title", isEn) && (
            <h3 className="srm-section-title">
              {getText(section, "title", isEn)}
            </h3>
          )}
          {getText(section, "description", isEn) && (
            <p className="srm-section-subtitle">
              {getText(section, "description", isEn)}
            </p>
          )}
        </div>
      )}

      {rows.map((rowFields, rowIdx) => (
        <div
          key={rowIdx}
          className={rowClassName(rowFields)}
        >
          {rowFields.map((field) => {
const fieldIdentifier =
  field.key;

            const normalizedField = {
              ...field,
              key: field.key,
              system_key: field.system_key,
            };

            return (
              <DynamicFieldRenderer
                key={`${section.id}-${field.key}`}
                section={section}
                field={normalizedField}
                values={values}
                value={values[fieldIdentifier]}
                file={files[fieldIdentifier]}
                error={errors[fieldIdentifier]}
                onValueChange={onValueChange}
                onFileChange={onFileChange}
                isEn={isEn}
              />
            );
          })}
        </div>
      ))}
    </section>
  );
}

export default React.memo(DynamicSection);