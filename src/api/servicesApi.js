import api from "./axiosClient";
import { API_PATHS } from "./routes";

/* ======================================================
   MAIN SERVICES
====================================================== */

export const getMainServices = (params = {}) =>
  api.get(
    API_PATHS.services.mainServices,
    { params }
  );

export const createMainService = (data) =>
  api.post(
    API_PATHS.services.mainServices,
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
    API_PATHS.services.mainService(id),
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

export const deleteMainService = (id) =>
  api.delete(
    API_PATHS.services.mainService(id)
  );


/* ======================================================
   SERVICES
====================================================== */

export const getServices = (params = {}) =>
  api.get(
    API_PATHS.services.services,
    { params }
  );

export const createService = (data) =>
  api.post(
    API_PATHS.services.services,
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
    API_PATHS.services.service(id),
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

export const deleteService = (id) =>
  api.delete(
    API_PATHS.services.service(id)
  );


/* ======================================================
   SERVICE SECTIONS
====================================================== */

export const getServiceSections = (
  params = {}
) =>
  api.get(
    API_PATHS.services.sections,
    { params }
  );

export const createServiceSection = (
  data
) =>
  api.post(
    API_PATHS.services.sections,
    data
  );

export const updateServiceSection = (
  id,
  data
) =>
  api.patch(
    API_PATHS.services.section(id),
    data
  );

export const deleteServiceSection = (
  id
) =>
  api.delete(
    API_PATHS.services.section(id)
  );


/* ======================================================
   SERVICES PAGE CMS
====================================================== */

export const getServicesPageCMS = () =>
  api.get(
    API_PATHS.services.page
  );

export const createServicesPageCMS = (
  data
) =>
  api.post(
    API_PATHS.services.page,
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
    API_PATHS.services.pageItem(id),
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

/* ======================================================
   SERVICE ADVISORY REQUESTS
====================================================== */

export const getServiceAdvisoryRequests =
  (params = {}) =>
    api.get(
      API_PATHS.services.requests,
      { params }
    );

export const getServiceAdvisoryRequest =
  (id) =>
    api.get(
      API_PATHS.services.request(id)
    );

export const updateServiceAdvisoryRequest =
  (id, data) =>
    api.patch(
      API_PATHS.services.request(id),
      data
    );

export const deleteServiceAdvisoryRequest =
  (id) =>
    api.delete(
      API_PATHS.services.request(id)
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
    API_PATHS.services.import,
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
      API_PATHS.services.publicMainServices,
      { params }
    );

/* ======================================================
   PUBLIC SERVICES
====================================================== */

export const getPublicServices = (
  params = {}
) =>
  api.get(
    API_PATHS.services.publicServices,
    { params }
  );

/* ======================================================
   PUBLIC SERVICES PAGE CMS
====================================================== */

export const getPublicServicesPage =
  () =>
    api.get(
      API_PATHS.services.publicPage
    );


/* ======================================================
   PUBLIC CAREERS
====================================================== */

export const getPublicCareers =
  () =>
    api.get(
      API_PATHS.services.publicCareers
    );


// ── Access links (canonical – deduplicated) ──────────────────────────────────
export const getServiceRequestAccessLinks = (requestId) =>
  api.get(
    API_PATHS.services.requestLinks(requestId)
  );

export const createServiceRequestAccessLink = (
  requestId,
  payload
) =>
  api.post(
    API_PATHS.services.createRequestLink(requestId),
    payload
  );

export const revokeServiceRequestAccessLink = (
  linkId
) =>
  api.post(
    API_PATHS.services.revokeLink(linkId)
  );

export const regenerateServiceRequestAccessLink = (
  linkId
) =>
  api.post(
    API_PATHS.services.regenerateLink(linkId)
  );

export const updateAdminSubmission = (
  submissionId,
  data
) =>
  api.patch(
    API_PATHS.services.updateSubmission(submissionId),
    data
  );

export const getSubmissionEditHistory = (
  submissionId
) =>
  api.get(
    API_PATHS.services.submissionHistory(submissionId)
  );

export const getRequestAccessLogs = (
  requestId
) =>
  api.get(
    API_PATHS.services.requestLogs(requestId)
  );

/* ======================================================
   PUBLIC ACCESS
====================================================== */

export const sendRequestOTP = (
  publicKey
) =>
  api.post(
    API_PATHS.services.sendOtp,
    {
      public_key: publicKey,
    }
  );

export const verifyRequestOTP = (
  publicKey,
  otp
) =>
  api.post(
    API_PATHS.services.verifyOtp,
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
    API_PATHS.services.editableRequest(publicKey),
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
    API_PATHS.services.updateEditableRequest(publicKey),
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
