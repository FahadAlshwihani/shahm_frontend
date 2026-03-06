import axiosClient from "./axiosClient";

/* ========= PUBLIC ========= */

export const getCareerJobs = () =>
  axiosClient.get("/services/public/careers/jobs/");

export const submitCareerApplication = (data) =>
  axiosClient.post(
    "/services/public/careers/apply/",
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );



/* ========= ADMIN ========= */

export const getAdminJobs = () =>
  axiosClient.get("/services/admin/careers/jobs/");

export const createJob = (data) =>
  axiosClient.post("/services/admin/careers/jobs/", data);

export const updateJob = (id, data) =>
  axiosClient.patch(`/services/admin/careers/jobs/${id}/`, data);

export const deleteJob = (id) =>
  axiosClient.delete(`/services/admin/careers/jobs/${id}/`);

export const getApplications = () =>
  axiosClient.get("/services/admin/careers/applications/");
