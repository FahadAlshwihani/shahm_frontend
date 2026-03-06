import api from "./axiosClient";

// CMS TEXT
export const getServiceAdvisoryPage = () =>
  api.get("services/public/service-advisory/");

// SUBMIT FORM
export const submitServiceAdvisory = (data) =>
  api.post("services/public/service-advisory/submit/", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
