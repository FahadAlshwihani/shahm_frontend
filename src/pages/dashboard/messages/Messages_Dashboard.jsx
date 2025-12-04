import React, { useEffect, useState } from "react";
import { useMessagesStore } from "../../../store/useMessagesStore";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import toast from "react-hot-toast";

export default function Messages_Dashboard() {
  const {
    messages,
    subscribers,
    loadMessages,
    loadSubscribers,
    sendBroadcast,
  } = useMessagesStore();

  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    loadMessages();
    loadSubscribers();
  }, []);

  const handleBroadcast = async () => {
    if (!subject.trim() || !content.trim()) {
      toast.error("اكتب عنوان ومحتوى الرسالة");
      return;
    }

    const res = await sendBroadcast({ subject, html: content });

    if (res.success) {
      toast.success(`تم إرسال الرسالة إلى ${res.sent} مشترك`);
      setSubject("");
      setContent("");
    } else {
      toast.error("حدث خطأ أثناء الإرسال");
    }
  };

  return (
    <div style={{ padding: 20 }}>

      <h1>Messages Dashboard</h1>

      {/* ========= CONTACT MESSAGES TABLE ========== */}
      <h2>Contact Messages</h2>
      <table border="1" width="100%" cellPadding="8">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Subject</th>
            <th>Status</th>
            <th>Read</th>
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
            </tr>
          ))}
        </tbody>
      </table>

      <hr style={{ margin: "40px 0" }} />

      {/* ========= SUBSCRIBERS TABLE ========== */}
      <h2>Newsletter Subscribers</h2>

      <table border="1" width="100%" cellPadding="8">
        <thead>
          <tr>
            <th>Email</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {subscribers.map((s) => (
            <tr key={s.id}>
              <td>{s.email}</td>
              <td>{new Date(s.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr style={{ margin: "40px 0" }} />

      {/* ========= BROADCAST SECTION ========== */}
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
    </div>
  );
}
