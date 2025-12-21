import React, { useEffect } from "react";
import { useMessagesStore } from "../../../store/useMessagesStore";
import { Link } from "react-router-dom";

export default function Messages_List() {
  const { messages, loadMessages } = useMessagesStore();

  useEffect(() => {
    loadMessages();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Messages</h1>

      <table border={1} cellPadding={10} width="100%">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Subject</th>
            <th>Status</th>
            <th>Read</th>
            <th>Open</th>
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
                <Link to={`/dashboard/messages/${m.id}`}>Open</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
