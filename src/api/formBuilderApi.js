import axios from "./axiosClient";

const BASE = "";

export const getAdminForms = () =>
  axios.get(`${BASE}/admin/forms/`);

export const getAdminForm = (id) =>
  axios.get(`${BASE}/admin/forms/${id}/`);

export const createAdminForm = (data) =>
  axios.post(`${BASE}/admin/forms/`, data);

export const updateAdminForm = (id, data) =>
  axios.patch(`${BASE}/admin/forms/${id}/`, data);

export const deleteAdminForm = (id) =>
  axios.delete(`${BASE}/admin/forms/${id}/`);

export const getFormSubmissions = (
  formId,
  status = null,
) => {
  const params = {};

  if (formId) {
    params.form = formId;
  }

  if (status) {
    params.status = status;
  }

  return axios.get(
    `${BASE}/admin/form-submissions/`,
    {
      params,
    },
  );
};

export const getPublicForm = (slug) =>
  axios.get(`${BASE}/public/forms/${slug}/`);

export const submitPublicForm = (
  slug,
  data,
  options = {},
) => {

  const {
    accessToken,
    accessKey,
  } = options;

  return axios.post(
    `${BASE}/public/forms/${slug}/submit/`,
    data,
    {
      params: accessKey
        ? {
            access_key: accessKey,
          }
        : {},

      headers: accessToken
        ? {
            "X-Access-Token":
              accessToken,
          }
        : {},
    },
  );
};

// =========================
// Success Responses
// =========================

export const getSuccessResponses = () =>
  axios.get(`${BASE}/admin/success-responses/`);

export const getSuccessResponse = (id) =>
  axios.get(`${BASE}/admin/success-responses/${id}/`);

export const createSuccessResponse = (data) =>
  axios.post(
    `${BASE}/admin/success-responses/`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

export const updateSuccessResponse = (
  id,
  data,
) =>
  axios.patch(
    `${BASE}/admin/success-responses/${id}/`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

export const deleteSuccessResponse = (id) =>
  axios.delete(
    `${BASE}/admin/success-responses/${id}/`,
  );



  export const sendFormOTP = (data) =>
  axios.post(
    `${BASE}/public/forms/access/send-otp/`,
    data,
  );

export const verifyFormOTP = (data) =>
  axios.post(
    `${BASE}/public/forms/access/verify-otp/`,
    data,
  );