import axios from "./axiosClient";
import { API_PATHS } from "./routes";

export const getAdminForms = () =>
  axios.get(API_PATHS.forms.admin);

export const getAdminForm = (id) =>
  axios.get(API_PATHS.forms.adminForm(id));

export const createAdminForm = (data) =>
  axios.post(API_PATHS.forms.admin, data);

export const updateAdminForm = (id, data) =>
  axios.patch(API_PATHS.forms.adminForm(id), data);

export const deleteAdminForm = (id) =>
  axios.delete(API_PATHS.forms.adminForm(id));

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
    API_PATHS.forms.submissions,
    {
      params,
    },
  );
};

export const getPublicForm = (slug) =>
  axios.get(API_PATHS.forms.publicForm(slug));

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
    API_PATHS.forms.submit(slug),
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
  axios.get(API_PATHS.forms.successResponses);

export const getSuccessResponse = (id) =>
  axios.get(API_PATHS.forms.successResponse(id));

export const createSuccessResponse = (data) =>
  axios.post(
    API_PATHS.forms.successResponses,
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
    API_PATHS.forms.successResponse(id),
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

export const deleteSuccessResponse = (id) =>
  axios.delete(
    API_PATHS.forms.successResponse(id),
  );
