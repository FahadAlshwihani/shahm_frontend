// src/pages/dashboard/Users.jsx
import React, { useEffect, useState } from "react";
import { useUsersStore } from "../../store/useUsersStore";

export default function Users() {
  const { users, fetchUsers, addUser, editUser, removeUser, loading } =
    useUsersStore();

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(null);

  const [form, setForm] = useState({
    email: "",
    name: "",
    password: "",
    role: "viewer",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = async () => {
    const ok = await addUser(form);
    if (ok) {
      setShowAdd(false);
      setForm({ email: "", name: "", password: "", role: "viewer" });
    }
  };

  const handleUpdate = async () => {
    const ok = await editUser(showEdit.id, form);
    if (ok) setShowEdit(null);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Users Management</h1>

      <button onClick={() => setShowAdd(true)}>Add User</button>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table border="1" cellPadding="10" style={{ marginTop: 20 }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Name</th>
              <th>Role</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.email}</td>
                <td>{u.name}</td>
                <td>{u.role}</td>
                <td>{u.is_active ? "Yes" : "No"}</td>

                <td>
                  <button
                    onClick={() => {
                      setShowEdit(u);
                      setForm({
                        email: u.email,
                        name: u.name,
                        password: "",
                        role: u.role,
                      });
                    }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm("Delete user?")) removeUser(u.id);
                    }}
                    style={{ marginLeft: 10 }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Add Modal */}
      {showAdd && (
        <div style={{ background: "#fff", padding: 20, marginTop: 20 }}>
          <h3>Create User</h3>

          <input
            type="email"
            placeholder="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            type="text"
            placeholder="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            type="password"
            placeholder="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="super_admin">Super Admin</option>
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </select>

          <button onClick={handleCreate}>Save</button>
          <button onClick={() => setShowAdd(false)}>Cancel</button>
        </div>
      )}

      {/* Edit Modal */}
      {showEdit && (
        <div style={{ background: "#fff", padding: 20, marginTop: 20 }}>
          <h3>Edit User</h3>

          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            type="password"
            placeholder="new password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="super_admin">Super Admin</option>
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </select>

          <button onClick={handleUpdate}>Save Changes</button>
          <button onClick={() => setShowEdit(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
}
