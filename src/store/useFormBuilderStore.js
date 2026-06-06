import { create } from "zustand";
import {
  getAdminForms,
  getAdminForm,
  createAdminForm,
  updateAdminForm,
  deleteAdminForm,
  getFormSubmissions,

  getSuccessResponses,
  getSuccessResponse,
  createSuccessResponse,
  updateSuccessResponse,
  deleteSuccessResponse,

} from "../api/formBuilderApi";

export const useFormBuilderStore = create((set, get) => ({
  forms: [],
  selectedForm: null,
  submissions: [],
  successResponses: [],
  selectedSuccessResponse: null,

  loading: false,
  saving: false,
  error: null,

  fetchForms: async () => {
    try {
      set({ loading: true, error: null });

      const res = await getAdminForms();

      set({
        forms: Array.isArray(res.data) ? res.data : res.data.results || [],
        loading: false,
      });
    } catch (err) {
      console.error(err);
      set({ error: err, loading: false });
    }
  },

  fetchForm: async (id) => {
    try {
      set({ loading: true, error: null });

      const res = await getAdminForm(id);

      set({
        selectedForm: res.data,
        loading: false,
      });
    } catch (err) {
      console.error(err);
      set({ error: err, loading: false });
    }
  },

  createForm: async (payload) => {
    try {
      set({ saving: true, error: null });

      const res = await createAdminForm(payload);

      set({
        forms: [res.data, ...get().forms],
        saving: false,
      });

      return res.data;
    } catch (err) {
      console.error(err);
      set({ error: err, saving: false });
      throw err;
    }
  },

  updateForm: async (id, payload) => {
    try {
      set({ saving: true, error: null });

      const res = await updateAdminForm(id, payload);

      set({
        forms: get().forms.map((f) => (f.id === id ? res.data : f)),
        selectedForm: res.data,
        saving: false,
      });

      return res.data;
    } catch (err) {
      console.error(err);
      set({ error: err, saving: false });
      throw err;
    }
  },

  deleteForm: async (id) => {
    try {
      set({ saving: true, error: null });

      await deleteAdminForm(id);

      set({
        forms: get().forms.filter((f) => f.id !== id),
        saving: false,
      });
    } catch (err) {
      console.error(err);
      set({ error: err, saving: false });
      throw err;
    }
  },

  fetchSubmissions: async (formId) => {
    try {
      set({ loading: true, error: null });

      const res = await getFormSubmissions(formId);

      set({
        submissions: Array.isArray(res.data) ? res.data : res.data.results || [],
        loading: false,
      });
    } catch (err) {
      console.error(err);
      set({ error: err, loading: false });
    }
  },
  fetchSuccessResponses: async () => {
    try {
      set({ loading: true, error: null });

      const res = await getSuccessResponses();

      set({
        successResponses: Array.isArray(res.data)
          ? res.data
          : res.data.results || [],
        loading: false,
      });

    } catch (err) {
      console.error(err);

      set({
        error: err,
        loading: false,
      });
    }
  },

  fetchSuccessResponse: async (id) => {
    try {
      set({ loading: true, error: null });

      const res = await getSuccessResponse(id);

      set({
        selectedSuccessResponse: res.data,
        loading: false,
      });

    } catch (err) {
      console.error(err);

      set({
        error: err,
        loading: false,
      });
    }
  },

  createSuccessResponse: async (payload) => {
    try {
      set({ saving: true, error: null });

      const res = await createSuccessResponse(payload);

      set({
        successResponses: [
          res.data,
          ...get().successResponses,
        ],
        saving: false,
      });

      return res.data;

    } catch (err) {
      console.error(err);

      set({
        error: err,
        saving: false,
      });

      throw err;
    }
  },

  updateSuccessResponse: async (
    id,
    payload,
  ) => {
    try {
      set({ saving: true, error: null });

      const res = await updateSuccessResponse(
        id,
        payload,
      );

      set({
        successResponses: get().successResponses.map(
          (item) =>
            item.id === id ? res.data : item
        ),

        selectedSuccessResponse: res.data,

        saving: false,
      });

      return res.data;

    } catch (err) {
      console.error(err);

      set({
        error: err,
        saving: false,
      });

      throw err;
    }
  },

  deleteSuccessResponse: async (id) => {
    try {
      set({ saving: true, error: null });

      await deleteSuccessResponse(id);

      set({
        successResponses:
          get().successResponses.filter(
            (item) => item.id !== id
          ),

        saving: false,
      });

    } catch (err) {
      console.error(err);

      set({
        error: err,
        saving: false,
      });

      throw err;
    }
  },


}));