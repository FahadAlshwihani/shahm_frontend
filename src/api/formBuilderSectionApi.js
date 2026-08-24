// src/api/formBuilderSectionApi.js
// Direct API calls for sections, fields, and options
// These are NOT in the Zustand store — consumed directly in components
import axios from "./axiosClient";
import { API_PATHS } from "./routes";

// ── Sections ──────────────────────────────────────────────────────────────────
export const createSection = (formId, data) =>
  axios.post(API_PATHS.forms.sections(formId), data);

export const updateSection = (sectionId, data) =>
  axios.patch(API_PATHS.forms.section(sectionId), data);

export const deleteSection = (sectionId) =>
  axios.delete(API_PATHS.forms.section(sectionId));

// ── Fields ────────────────────────────────────────────────────────────────────
export const createField = (formId, data) =>
  axios.post(API_PATHS.forms.fields(formId), data);

export const updateField = (fieldId, data) =>
  axios.patch(API_PATHS.forms.field(fieldId), data);

export const deleteField = (fieldId) =>
  axios.delete(API_PATHS.forms.field(fieldId));

// ── Options ───────────────────────────────────────────────────────────────────
export const createOption = (fieldId, data) =>
  axios.post(API_PATHS.forms.options(fieldId), data);

export const updateOption = (optionId, data) =>
  axios.patch(API_PATHS.forms.option(optionId), data);

export const deleteOption = (optionId) =>
  axios.delete(API_PATHS.forms.option(optionId));
