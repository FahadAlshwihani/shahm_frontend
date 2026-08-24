import api from "./axiosClient";
import { API_PATHS } from "./routes";

// Public
export const sendContact = (data) => api.post(API_PATHS.messaging.contact, data);

// Admin
export const adminGetMessages = () => api.get(API_PATHS.messaging.messages);
export const adminGetSingleMessage = (id) =>
  api.get(API_PATHS.messaging.message(id));
export const adminUpdateMessage = (id, data) =>
  api.patch(API_PATHS.messaging.message(id), data);

export const adminGetSubscribers = () =>
  api.get(API_PATHS.messaging.subscribers);

export const adminDeleteSubscriber = (id) =>
  api.delete(API_PATHS.messaging.subscriber(id));

export const adminBroadcast = (data) =>
  api.post(API_PATHS.messaging.broadcast, data);

// ✅ تصدير المشتركين إلى CSV (Excel)
export const adminExportSubscribers = () =>
  api.get(API_PATHS.messaging.subscriberExport, {
    responseType: "blob",
  });

// ✅ جلب سجل الرسائل المرسلة
export const adminGetBroadcastLogs = () =>
  api.get(API_PATHS.messaging.broadcastLogs);
