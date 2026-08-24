import axiosClient from "./axiosClient";
import { API_PATHS } from "./routes";

/* ========= ADMIN ========= */

export const getAdminJobs = () =>
  axiosClient.get(API_PATHS.careers.jobs);

export const createJob = (data) =>
  axiosClient.post(API_PATHS.careers.jobs, data);

export const updateJob = (id, data) =>
  axiosClient.patch(API_PATHS.careers.job(id), data);

export const deleteJob = (id) =>
  axiosClient.delete(API_PATHS.careers.job(id));

export const getApplications = () =>
  axiosClient.get(API_PATHS.careers.applications);
