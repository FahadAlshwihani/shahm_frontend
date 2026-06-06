// src/api/formBuilderSectionApi.js
// Direct API calls for sections, fields, and options
// These are NOT in the Zustand store — consumed directly in components
import axios from "./axiosClient";

// ── Sections ──────────────────────────────────────────────────────────────────
export const createSection = (formId, data) =>
  axios.post(`/admin/forms/${formId}/sections/`, data);

export const updateSection = (sectionId, data) =>
  axios.patch(`/admin/forms/sections/${sectionId}/`, data);

export const deleteSection = (sectionId) =>
  axios.delete(`/admin/forms/sections/${sectionId}/`);

// ── Fields ────────────────────────────────────────────────────────────────────
export const createField = (formId, data) =>
  axios.post(`/admin/forms/${formId}/fields/`, data);

export const updateField = (fieldId, data) =>
  axios.patch(`/admin/forms/fields/${fieldId}/`, data);

export const deleteField = (fieldId) =>
  axios.delete(`/admin/forms/fields/${fieldId}/`);

// ── Options ───────────────────────────────────────────────────────────────────
export const createOption = (fieldId, data) =>
  axios.post(`/admin/forms/fields/${fieldId}/options/`, data);

export const updateOption = (optionId, data) =>
  axios.patch(`/admin/forms/options/${optionId}/`, data);

export const deleteOption = (optionId) =>
  axios.delete(`/admin/forms/options/${optionId}/`);