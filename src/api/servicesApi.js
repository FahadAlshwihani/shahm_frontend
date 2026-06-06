import api from "./axiosClient";

/* ======================================================
   MAIN SERVICES
====================================================== */

export const getMainServices = (params = {}) =>
  api.get(
    "/services/admin/main-services/",
    { params }
  );

export const getMainService = (id) =>
  api.get(
    `/services/admin/main-services/${id}/`
  );

export const createMainService = (data) =>
  api.post(
    "/services/admin/main-services/",
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

export const updateMainService = (
  id,
  data
) =>
  api.patch(
    `/services/admin/main-services/${id}/`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

export const deleteMainService = (id) =>
  api.delete(
    `/services/admin/main-services/${id}/`
  );


/* ======================================================
   SERVICES
====================================================== */

export const getServices = (params = {}) =>
  api.get(
    "/services/admin/services/",
    { params }
  );

export const getService = (id) =>
  api.get(
    `/services/admin/services/${id}/`
  );

export const createService = (data) =>
  api.post(
    "/services/admin/services/",
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

export const updateService = (
  id,
  data
) =>
  api.patch(
    `/services/admin/services/${id}/`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

export const deleteService = (id) =>
  api.delete(
    `/services/admin/services/${id}/`
  );


/* ======================================================
   SERVICE SECTIONS
====================================================== */

export const getServiceSections = (
  params = {}
) =>
  api.get(
    "/services/admin/service-sections/",
    { params }
  );

export const getServiceSection = (
  id
) =>
  api.get(
    `/services/admin/service-sections/${id}/`
  );

export const createServiceSection = (
  data
) =>
  api.post(
    "/services/admin/service-sections/",
    data
  );

export const updateServiceSection = (
  id,
  data
) =>
  api.patch(
    `/services/admin/service-sections/${id}/`,
    data
  );

export const deleteServiceSection = (
  id
) =>
  api.delete(
    `/services/admin/service-sections/${id}/`
  );


/* ======================================================
   SERVICES PAGE CMS
====================================================== */

export const getServicesPageCMS = () =>
  api.get(
    "/services/admin/services-page/"
  );

export const getServicesPageCMSById = (
  id
) =>
  api.get(
    `/services/admin/services-page/${id}/`
  );

export const createServicesPageCMS = (
  data
) =>
  api.post(
    "/services/admin/services-page/",
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

export const updateServicesPageCMS = (
  id,
  data
) =>
  api.patch(
    `/services/admin/services-page/${id}/`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );


/* ======================================================
   SERVICE ADVISORY PAGE
====================================================== */

export const getServiceAdvisoryPage =
  () =>
    api.get(
      "/services/admin/service-advisory-page/"
    );

export const getServiceAdvisoryPageById =
  (id) =>
    api.get(
      `/services/admin/service-advisory-page/${id}/`
    );

export const createServiceAdvisoryPage =
  (data) =>
    api.post(
      "/services/admin/service-advisory-page/",
      data
    );

export const updateServiceAdvisoryPage =
  (id, data) =>
    api.patch(
      `/services/admin/service-advisory-page/${id}/`,
      data
    );


/* ======================================================
   SERVICE ADVISORY REQUESTS
====================================================== */

export const getServiceAdvisoryRequests =
  (params = {}) =>
    api.get(
      "/services/admin/service-advisory-requests/",
      { params }
    );

export const getServiceAdvisoryRequest =
  (id) =>
    api.get(
      `/services/admin/service-advisory-requests/${id}/`
    );

export const updateServiceAdvisoryRequest =
  (id, data) =>
    api.patch(
      `/services/admin/service-advisory-requests/${id}/`,
      data
    );

export const deleteServiceAdvisoryRequest =
  (id) =>
    api.delete(
      `/services/admin/service-advisory-requests/${id}/`
    );


/* ======================================================
   IMPORT SERVICES EXCEL
====================================================== */

export const importServicesExcel = (
  file
) => {
  const formData = new FormData();

  formData.append("file", file);

  return api.post(
    "/services/admin/import-services/",
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );
};


/* ======================================================
   PUBLIC MAIN SERVICES
====================================================== */

export const getPublicMainServices =
  (params = {}) =>
    api.get(
      "/services/public/main-services/",
      { params }
    );

export const getPublicMainServiceBySlug =
  (slug) =>
    api.get(
      `/services/public/main-services/${slug}/`
    );


/* ======================================================
   PUBLIC SERVICES
====================================================== */

export const getPublicServices = (
  params = {}
) =>
  api.get(
    "/services/public/services/",
    { params }
  );

export const getPublicServiceBySlug = (
  slug
) =>
  api.get(
    `/services/public/services/${slug}/`
  );


/* ======================================================
   PUBLIC SERVICES PAGE CMS
====================================================== */

export const getPublicServicesPage =
  () =>
    api.get(
      "/services/public/services-page/"
    );


/* ======================================================
   PUBLIC CAREERS
====================================================== */

export const getPublicCareers =
  () =>
    api.get(
      "/services/public/careers/jobs/"
    );


// ── Access links (canonical – deduplicated) ──────────────────────────────────
export const getServiceRequestAccessLinks = (requestId) =>
  api.get(
    `/services/admin/service-advisory-requests/${requestId}/access-links/`
  );

export const createServiceRequestAccessLink = (
  requestId,
  payload
) =>
  api.post(
    `/services/admin/service-advisory-requests/${requestId}/access-links/create/`,
    payload
  );

export const revokeServiceRequestAccessLink = (
  linkId
) =>
  api.post(
    `/services/admin/request-access-links/${linkId}/revoke/`
  );

export const regenerateServiceRequestAccessLink = (
  linkId
) =>
  api.post(
    `/services/admin/request-access-links/${linkId}/regenerate/`
  );

export const updateAdminSubmission = (
  submissionId,
  data
) =>
  api.patch(
    `/services/admin/submissions/${submissionId}/update/`,
    data
  );

export const getSubmissionEditHistory = (
  submissionId
) =>
  api.get(
    `/services/admin/submissions/${submissionId}/history/`
  );

export const getRequestAccessLogs = (
  requestId
) =>
  api.get(
    `/services/admin/service-advisory-requests/${requestId}/logs/`
  );

// Legacy aliases kept so old call-sites don't crash during migration

/** @deprecated use getServiceRequestAccessLinks */
export const getRequestAccessLinks = (
  requestId
) =>
  getServiceRequestAccessLinks(requestId);

/** @deprecated use createServiceRequestAccessLink */
export const createRequestAccessLink = (
  requestId,
  payload
) =>
  createServiceRequestAccessLink(
    requestId,
    payload
  );

/** @deprecated use revokeServiceRequestAccessLink */
export const revokeRequestAccessLink = (
  linkId
) =>
  revokeServiceRequestAccessLink(
    linkId
  );


/* ======================================================
   PUBLIC ACCESS
====================================================== */

export const sendRequestOTP = (
  publicKey
) =>
  api.post(
    "/services/public/request-access/send-otp/",
    {
      public_key: publicKey,
    }
  );

export const verifyRequestOTP = (
  publicKey,
  otp
) =>
  api.post(
    "/services/public/request-access/verify-otp/",
    {
      public_key: publicKey,
      code: otp,
    }
  );

export const getEditableRequestSnapshot = (
  publicKey,
  token
) =>
  api.get(
    `/services/public/request-access/${publicKey}/`,
    {
      headers: {
        "X-Access-Token": token,
      },
    }
  );

export const updateEditableRequest = (
  publicKey,
  token,
  data
) => {
  return api.patch(
    `/services/public/request-access/${publicKey}/update/`,
    data,
    {
      headers: {
        "X-Access-Token": token,
      },
    }
  );
};

/* ======================================================
   BACKWARD COMPATIBILITY ALIASES
====================================================== */

/**
 * Service Requests
 */
export const getServiceRequests =
  getServiceAdvisoryRequests;

export const deleteServiceRequest =
  deleteServiceAdvisoryRequest;

/**
 * Update request status only
 */
export const updateServiceRequestStatus = (
  id,
  status
) =>
  updateServiceAdvisoryRequest(id, {
    status,
  });

/**
 * Access Links
 */
export const revokeAccessLink =
  revokeRequestAccessLink;

export const regenerateAccessLink =
  regenerateServiceRequestAccessLink;