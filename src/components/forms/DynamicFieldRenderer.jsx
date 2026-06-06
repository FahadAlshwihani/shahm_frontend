import React, {
  useEffect,
  useState,
} from "react";

import TextField from "./fields/TextField";
import TextareaField from "./fields/TextareaField";
import SelectField from "./fields/SelectField";
import RadioField from "./fields/RadioField";
import CheckboxField from "./fields/CheckboxField";
import PhoneField from "./fields/PhoneField";
import FileUploadField from "./fields/FileUploadField";
import AppointmentSlotsField from "./fields/AppointmentSlotsField";
import {
  getPublicServices,
  getPublicCareers,
  getPublicMainServices,
} from "../../api/servicesApi";

import {
  getAvailableSlots,
} from "../../api/appointmentsApi";
import ServicesPickerField from "./fields/ServicesPickerField";

function DynamicFieldRenderer(props) {
  const {
    field,
    values,
  } = props;

  const [
    dynamicOptions,
    setDynamicOptions,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const source =
    field.dynamic_source ||
    field.settings?.dynamic_source;

  const dependsOn =
    field.settings?.depends_on;

  /*
  |--------------------------------------------------------------------------
  | Resolve dependency field key
  |--------------------------------------------------------------------------
  |
  | depends_on stores SYSTEM KEY
  | but form values store FIELD KEY
  |
  */

  const dependencyField =
    props.section?.fields?.find(
      (f) =>
        f.system_key === dependsOn ||
        f.key === dependsOn
    );

  const dependencyKey =
    dependencyField?.key;

  const dependencyValue =
    dependencyKey
      ? values?.[dependencyKey]
      : null;

  const periodField =
    props.section?.fields?.find(
      (f) =>
        f.system_key === "appointment_period" ||
        f.key === "appointment_period"
    );

  const periodKey = periodField?.key;

  const selectedPeriod =
    periodKey
      ? values?.[periodKey]
      : null;

  const requestRef = React.useRef(0);

  useEffect(() => {
    if (!source) return;

    // appointment slots require selected date
    if (
      source === "appointment_slots" &&
      (
        !dependencyValue ||
        !selectedPeriod
      )
    ) {
      setDynamicOptions([]);
      return;
    }

    let mounted = true;

    async function loadOptions() {
      const requestId = ++requestRef.current;

      try {
        setLoading(true);

        let items = [];

        // SERVICES
        if (source === "services") {
          const params = {};

          if (dependencyValue) {
            params.main_service = dependencyValue;
          }

          const res = await getPublicServices(params);

          items =
            res?.data?.results ||
            res?.data ||
            [];
        }

        // SERVICE CATEGORIES
        else if (source === "service_categories") {
          const res = await getPublicMainServices();

          items =
            res?.data?.results ||
            res?.data ||
            [];
        }

        // CAREERS
        else if (source === "career_jobs") {
          const res = await getPublicCareers();

          items =
            res?.data?.results ||
            res?.data ||
            [];
        }

// APPOINTMENT PERIODS
else if (source === "appointment_periods") {
  items = [
    {
      id: "morning",
      label_ar: "الفترة الصباحية",
      label_en: "Morning",
      value: "morning",
    },
    {
      id: "evening",
      label_ar: "الفترة المسائية",
      label_en: "Evening",
      value: "evening",
    },
  ];
}

// APPOINTMENT SLOTS
else if (source === "appointment_slots") {
  const res = await getAvailableSlots({
    date: dependencyValue,
    period: selectedPeriod,
  });

  items =
    res?.data?.results ||
    res?.data ||
    [];
}

const mapped = items.map((item) => {
  return {
    label_ar:
      item.label_ar ||
      item.start_time ||
      item.slot_label ||
      item.title_ar ||
      item.title_en ||
      `#${item.id}`,

    label_en:
      item.label_en ||
      item.start_time ||
      item.slot_label ||
      item.title_en ||
      item.title_ar ||
      `#${item.id}`,

    start_time: item.start_time,
    end_time: item.end_time,

    value: String(item.value || item.id),

    is_available:
      item.is_available !== false,
  };
});

        if (
          mounted &&
          requestId === requestRef.current
        ) {
          setDynamicOptions(mapped);
        }

      } catch (err) {
        console.error(
          "Dynamic source error",
          err
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadOptions();

    return () => {
      mounted = false;
    };

  }, [
  source,
  dependencyValue,
  selectedPeriod,
]);

  const enhancedField = {
    ...field,

    options:
      source
        ? dynamicOptions
        : field.options,
  };

  if (loading) {
    return (
      <div className="dpf-loading-field">
        Loading...
      </div>
    );
  }

  switch (field.field_type) {

    case "text":
    case "email":
    case "number":
    case "date":
      return (
        <TextField
          {...props}
          field={enhancedField}
        />
      );

    case "textarea":
      return (
        <TextareaField
          {...props}
          field={enhancedField}
        />
      );

    case "select":

      // Appointment Slots
      if (source === "appointment_slots") {
        return (
          <AppointmentSlotsField
            {...props}
            field={enhancedField}
          />
        );
      }

      // Services Picker
      if (
        field.system_key === "service_ids" &&
        field.settings?.render_as === "services_picker"
      ) {
        return (
          <ServicesPickerField
            {...props}
            field={enhancedField}
          />
        );
      }

      return (
        <SelectField
          {...props}
          field={enhancedField}
        />
      );

    case "radio":
      return (
        <RadioField
          {...props}
          field={enhancedField}
        />
      );

    case "checkbox":
      return (
        <CheckboxField
          {...props}
          field={enhancedField}
        />
      );

    case "phone":
      return (
        <PhoneField
          {...props}
          field={enhancedField}
        />
      );

    case "file":
      return (
        <FileUploadField
          {...props}
          field={enhancedField}
        />
      );

    default:
      return null;
  }
}

export default React.memo(DynamicFieldRenderer);