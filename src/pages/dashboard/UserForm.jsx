import React, { useEffect, useState } from "react";
import {
  createUser,
  getUserById,
  updateUser,
} from "../../api/authApi";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

export default function UserForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);

  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name_ar: "",
    full_name_en: "",
    email: "",
    password: "",
    role: "editor",
    is_active: true,
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function loadUser() {
    if (!isEdit) return;

    setLoading(true);
    try {
      const res = await getUserById(id);
      setForm({
        full_name_ar: res.data.full_name_ar,
        full_name_en: res.data.full_name_en,
        email: res.data.email,
        password: "",
        role: res.data.role,
        is_active: res.data.is_active,
      });
    } catch (err) {
      toast.error("Cannot load user");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUser();
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);

    try {
      if (isEdit) {
        await updateUser(id, form);
        toast.success("User updated");
      } else {
        await createUser(form);
        toast.success("User created");
      }

      navigate("/dashboard/users");
    } catch (err) {
      toast.error("Error saving user");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>{isEdit ? "Edit User" : "New User"}</h1>

      <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
        <div style={{ marginBottom: 10 }}>
          <label>Full Name (AR):</label>
          <input
            name="full_name_ar"
            value={form.full_name_ar}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>Full Name (EN):</label>
          <input
            name="full_name_en"
            value={form.full_name_en}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>Email:</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        {!isEdit && (
          <div style={{ marginBottom: 10 }}>
            <label>Password:</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required={!isEdit}
            />
          </div>
        )}

        <div style={{ marginBottom: 10 }}>
          <label>Role:</label>
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="viewer">Viewer</option>
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
            <option value="superadmin">Super Admin</option>
          </select>
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>Status:</label>
          <select
            name="is_active"
            value={form.is_active}
            onChange={(e) =>
              setForm({ ...form, is_active: e.target.value === "true" })
            }
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
}
