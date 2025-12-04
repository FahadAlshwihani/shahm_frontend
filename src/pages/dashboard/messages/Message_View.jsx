import React, { useEffect, useState } from "react";
import { useMessagesStore } from "../../../store/useMessagesStore";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

export default function Message_View() {
  const { id } = useParams();
  const { selectedMessage, loadSingle, updateMessage } = useMessagesStore();

  const [form, setForm] = useState({
    status: "",
  });

  useEffect(() => {
    loadSingle(id);
  }, [id]);

  useEffect(() => {
    if (selectedMessage)
      setForm({ status: selectedMessage.status });
  }, [selectedMessage]);

  const handleSave = async () => {
    await updateMessage(id, form);
    toast.success("Message updated");
  };

  if (!selectedMessage) return "Loading...";

  return (
    <div style={{ padding: 20 }}>
      <h1>Message Details</h1>

      <p><strong>Name:</strong> {selectedMessage.name}</p>
      <p><strong>Email:</strong> {selectedMessage.email}</p>
      <p><strong>Phone:</strong> {selectedMessage.phone}</p>
      <p><strong>Subject:</strong> {selectedMessage.subject}</p>
      <p><strong>Message:</strong> {selectedMessage.message}</p>

      <hr />

      <select
        value={form.status}
        onChange={(e) => setForm({ status: e.target.value })}
      >
        <option value="new">New</option>
        <option value="in_progress">In progress</option>
        <option value="closed">Closed</option>
      </select>

      <button onClick={handleSave} style={{ marginLeft: 10 }}>
        Save
      </button>
    </div>
  );
}
