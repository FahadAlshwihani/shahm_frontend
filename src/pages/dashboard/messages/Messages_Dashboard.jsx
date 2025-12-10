// src/pages/dashboard/messages/Messages_Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useMessagesStore } from "../../../store/useMessagesStore";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Messages_Dashboard() {
  const {
    messages,
    subscribers,
    broadcastLogs,
    loadMessages,
    loadSubscribers,
    loadBroadcastLogs,
    sendBroadcast,
    deleteSubscriber,
    exportSubscribers,
  } = useMessagesStore();

  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");

  // اختيار المستلمين
  const [selectedSubscriberIds, setSelectedSubscriberIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    loadMessages();
    loadSubscribers();
    loadBroadcastLogs();
  }, []);

  // تحديد الكل
  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedSubscriberIds([]);
      setSelectAll(false);
    } else {
      const allIds = subscribers.map((s) => s.id);
      setSelectedSubscriberIds(allIds);
      setSelectAll(true);
    }
  };

  // تحديد مشترك واحد
  const toggleSubscriber = (id) => {
    setSelectedSubscriberIds((prev) => {
      if (prev.includes(id)) {
        const next = prev.filter((x) => x !== id);
        if (selectAll && next.length !== subscribers.length) {
          setSelectAll(false);
        }
        return next;
      } else {
        const next = [...prev, id];
        if (next.length === subscribers.length) {
          setSelectAll(true);
        }
        return next;
      }
    });
  };

  // تصدير المشتركين إلى CSV (Excel)
  const handleExport = async () => {
    try {
      const res = await exportSubscribers();
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "subscribers.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء التصدير");
    }
  };

  // إرسال النشرة
  const handleBroadcast = async () => {
    if (!subject.trim() || !content.trim()) {
      toast.error("اكتب عنوان ومحتوى الرسالة");
      return;
    }

    const payload = { subject, html: content };

    if (selectedSubscriberIds.length > 0) {
      payload.subscriber_ids = selectedSubscriberIds;
    }

    const res = await sendBroadcast(payload);

    if (res.success) {
      toast.success(`تم إرسال الرسالة إلى ${res.sent} مشترك`);
      setSubject("");
      setContent("");
      // تحديث سجل الإرسال بعد كل Broadcast
      loadBroadcastLogs();
    } else {
      toast.error("حدث خطأ أثناء الإرسال");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Messages Dashboard</h1>

      {/* CONTACT MESSAGES */}
      <h2>Contact Messages</h2>
      <table border="1" width="100%" cellPadding="8">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Subject</th>
            <th>Status</th>
            <th>Read</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {messages.map((m) => (
            <tr key={m.id}>
              <td>{m.name}</td>
              <td>{m.email}</td>
              <td>{m.subject}</td>
              <td>{m.status}</td>
              <td>{m.is_read ? "Yes" : "No"}</td>
              <td>
                <button onClick={() => navigate(`/dashboard/messages/${m.id}`)}>
                  فتح
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr style={{ margin: "40px 0" }} />

      {/* SUBSCRIBERS LIST */}
      <h2>Newsletter Subscribers</h2>

      <div style={{ marginBottom: 10, display: "flex", gap: 20 }}>
        <label>
          <input type="checkbox" checked={selectAll} onChange={toggleSelectAll} />{" "}
          تحديد الكل
        </label>

        <span>
          عدد المحددين: {selectedSubscriberIds.length} / {subscribers.length}
        </span>

        <button onClick={handleExport}>تصدير المشتركين إلى Excel</button>
      </div>

      <table border="1" width="100%" cellPadding="8">
        <thead>
          <tr>
            <th>اختر</th>
            <th>Email</th>
            <th>Date</th>
            <th>Delete</th>
          </tr>
        </thead>

        <tbody>
          {subscribers.map((s) => (
            <tr key={s.id}>
              <td style={{ textAlign: "center" }}>
                <input
                  type="checkbox"
                  checked={selectedSubscriberIds.includes(s.id)}
                  onChange={() => toggleSubscriber(s.id)}
                />
              </td>

              <td>{s.email}</td>
              <td>{new Date(s.created_at).toLocaleDateString()}</td>

              <td>
                <button
                  style={{ background: "red", color: "white" }}
                  onClick={async () => {
                    if (window.confirm("هل تريد حذف هذا المشترك؟")) {
                      await deleteSubscriber(s.id);
                      toast.success("تم الحذف");
                    }
                  }}
                >
                  حذف
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr style={{ margin: "40px 0" }} />

      {/* BROADCAST SECTION */}
      <h2>Send Newsletter Broadcast</h2>

      <label>Subject</label>
      <input
        style={{ width: "100%", marginBottom: 10 }}
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />

      <SunEditor
        setContents={content}
        onChange={setContent}
        setOptions={{
          height: 250,
          buttonList: [
            ["undo", "redo"],
            ["bold", "italic", "underline"],
            ["fontColor", "hiliteColor"],
            ["align", "list"],
            ["link"],
            ["codeView"],
          ],
        }}
      />

      <button
        onClick={handleBroadcast}
        style={{
          marginTop: 20,
          padding: "10px 20px",
          background: "black",
          color: "white",
        }}
      >
        Send Newsletter
      </button>

      <hr style={{ margin: "40px 0" }} />

      {/* BROADCAST LOGS */}
      <h2>سجل الرسائل المرسلة</h2>

      <table border="1" width="100%" cellPadding="8">
        <thead>
          <tr>
            <th>التاريخ</th>
            <th>العنوان</th>
            <th>عدد المستلمين</th>
            <th>الإيميلات (مختصرة)</th>
          </tr>
        </thead>

        <tbody>
          {broadcastLogs.map((log) => (
            <tr key={log.id}>
              <td>{new Date(log.created_at).toLocaleString()}</td>
              <td>{log.subject}</td>
              <td>{log.recipients_count}</td>
              <td style={{ maxWidth: 400, whiteSpace: "pre-wrap" }}>
                {/* نعرض أول 200 حرف فقط للتنظيم */}
                {log.recipients_list.length > 200
                  ? log.recipients_list.slice(0, 200) + "..."
                  : log.recipients_list}
              </td>
            </tr>
          ))}

          {broadcastLogs.length === 0 && (
            <tr>
              <td colSpan={4}>لا توجد رسائل مرسلة بعد.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
