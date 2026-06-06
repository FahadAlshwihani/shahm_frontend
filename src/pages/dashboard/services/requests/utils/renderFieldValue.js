export default function renderFieldValue(
  field,
  value,
  isEn = true
) {

  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "-";
  }

  // =========================================
  // FILES
  // =========================================

  if (
    field.field_type === "file"
  ) {

    // MULTIPLE FILES
    if (
      Array.isArray(value)
    ) {

      return value.map((item) => {

        // normalized file object
        if (
          item &&
          typeof item === "object"
        ) {

          return {
            type: "file",
            url: item.url,
            name:
              item.name ||
              item.original_name ||
              "File",
          };

        }

        // old raw string
        return {
          type: "file",
          url: item,
          name: "File",
        };

      });

    }

    // SINGLE FILE OBJECT
    if (
      value &&
      typeof value === "object"
    ) {

      return {
        type: "file",
        url: value.url,
        name:
          value.name ||
          value.original_name ||
          "File",
      };

    }

    // RAW URL STRING
    return {
      type: "file",
      url: value,
      name: "File",
    };

  }

  // =========================================
  // PHONE
  // =========================================

  if (
    field.field_type === "phone" &&
    typeof value === "object"
  ) {

    return `${value.country_code || ""} ${value.number || ""}`;

  }

  // =========================================
  // SELECT / RADIO
  // =========================================

  if (
    ["select", "radio"].includes(
      field.field_type
    )
  ) {

    const option = (
      field.options || []
    ).find(
      (o) =>
        String(o.value) === String(value)
    );

    return (
      option?.[
        isEn
          ? "label_en"
          : "label_ar"
      ] || value
    );

  }

  // =========================================
  // CHECKBOX
  // =========================================

  if (
    field.field_type === "checkbox" &&
    Array.isArray(value)
  ) {

    return value.map((v) => {

      const option = (
        field.options || []
      ).find(
        (o) =>
          String(o.value) === String(v)
      );

      return (
        option?.[
          isEn
            ? "label_en"
            : "label_ar"
        ] || v
      );

    });

  }

  // =========================================
  // JSON OBJECT
  // =========================================

  if (
    typeof value === "object"
  ) {

    return JSON.stringify(
      value,
      null,
      2
    );

  }

  return value;

}