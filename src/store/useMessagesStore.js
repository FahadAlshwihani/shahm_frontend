import { create } from "zustand";
import {
  adminGetMessages,
  adminGetSingleMessage,
  adminUpdateMessage,
  adminGetSubscribers,
  adminBroadcast,
  adminDeleteSubscriber,
  adminGetBroadcastLogs,
  adminExportSubscribers,
} from "../api/messagesApi";

export const useMessagesStore = create((set) => ({
  messages: [],
  subscribers: [],
  selectedMessage: null,
  broadcastLogs: [],

  // تحميل جميع الرسائل
  loadMessages: async () => {
    const res = await adminGetMessages();
    set({ messages: res.data });
  },

  // تحميل مشتركين النشرة
  loadSubscribers: async () => {
    const res = await adminGetSubscribers();
    set({ subscribers: res.data });
  },

  // حذف مشترك من النشرة
  deleteSubscriber: async (id) => {
    await adminDeleteSubscriber(id);
    const res = await adminGetSubscribers();
    set({ subscribers: res.data });
    return { success: true };
  },

  // تحميل سجل الرسائل المرسلة
  loadBroadcastLogs: async () => {
    const res = await adminGetBroadcastLogs();
    set({ broadcastLogs: res.data });
  },

  // تصدير المشتركين (نعيد الـ response للـ component عشان يعمل download)
  exportSubscribers: async () => {
    const res = await adminExportSubscribers();
    return res;
  },

  // إرسال بريد جماعي
  sendBroadcast: async (data) => {
    const res = await adminBroadcast(data);
    return res.data;
  },

  // تحميل رسالة واحدة
  loadSingle: async (id) => {
    const res = await adminGetSingleMessage(id);
    set({ selectedMessage: res.data });
  },

  // تحديث الرسالة
  updateMessage: async (id, data) => {
    const res = await adminUpdateMessage(id, data);
    return res.data;
  },
}));
