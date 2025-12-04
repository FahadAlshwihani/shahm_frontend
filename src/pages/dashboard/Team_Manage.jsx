// src/pages/dashboard/Team_Manage.jsx
import React, { useEffect, useState } from "react";
import { useTeamStore } from "../../store/useTeamStore";
import toast from "react-hot-toast";

export default function Team_Manage() {
  const {
    members,
    fetchMembers,
    createMember,
    updateMember,
    deleteMember,
  } = useTeamStore();

  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name_ar: "",
    name_en: "",
    job_title_ar: "",
    job_title_en: "",
    role: "lawyer",
    bio_ar: "",
    bio_en: "",
    experience_ar: "",
    experience_en: "",
    linkedin_url: "",
    order: 0,
    is_active: true,
    profile_image: null,
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (files && files.length > 0) {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    if (!form.name_ar.trim()) return toast.error("Arabic name required");

    const fd = new FormData();
    Object.keys(form).forEach((key) => {
      if (form[key] !== null) fd.append(key, form[key]);
    });

    let result;
    if (editing) {
      result = await updateMember(editing.id, fd);
    } else {
      result = await createMember(fd);
    }

    if (result.success) {
      toast.success(editing ? "Updated" : "Created");
      setEditing(null);
      setForm({
        name_ar: "",
        name_en: "",
        job_title_ar: "",
        job_title_en: "",
        role: "lawyer",
        bio_ar: "",
        bio_en: "",
        experience_ar: "",
        experience_en: "",
        linkedin_url: "",
        order: 0,
        is_active: true,
        profile_image: null,
      });
    } else toast.error("Error saving member");
  };

  const handleEdit = (m) => {
    setEditing(m);
    setForm({
      name_ar: m.name_ar,
      name_en: m.name_en,
      job_title_ar: m.job_title_ar,
      job_title_en: m.job_title_en,
      role: m.role,
      bio_ar: m.bio_ar,
      bio_en: m.bio_en,
      experience_ar: m.experience_ar,
      experience_en: m.experience_en,
      linkedin_url: m.linkedin_url,
      order: m.order,
      is_active: m.is_active,
      profile_image: null,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete member?")) return;
    const r = await deleteMember(id);
    if (r.success) toast.success("Deleted");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Team Management</h1>

      {/* FORM */}
      <div style={{ marginBottom: 30 }}>
        <input
          name="name_ar"
          placeholder="Name AR"
          value={form.name_ar}
          onChange={handleChange}
        />
        <input
          name="name_en"
          placeholder="Name EN"
          value={form.name_en}
          onChange={handleChange}
          style={{ marginLeft: 8 }}
        />

        <div>
          <input
            name="job_title_ar"
            placeholder="Job Title AR"
            value={form.job_title_ar}
            onChange={handleChange}
          />
          <input
            name="job_title_en"
            placeholder="Job Title EN"
            value={form.job_title_en}
            onChange={handleChange}
            style={{ marginLeft: 8 }}
          />
        </div>

        <div>
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="lawyer">Lawyer</option>
            <option value="partner">Partner</option>
            <option value="consultant">Consultant</option>
            <option value="advisor">Advisor</option>
            <option value="manager">Manager</option>
            <option value="other">Other</option>
          </select>
        </div>

        <textarea
          placeholder="Bio AR"
          name="bio_ar"
          value={form.bio_ar}
          onChange={handleChange}
          style={{ width: "100%", minHeight: 60 }}
        />

        <textarea
          placeholder="Bio EN"
          name="bio_en"
          value={form.bio_en}
          onChange={handleChange}
          style={{ width: "100%", minHeight: 60 }}
        />

        <textarea
          placeholder="Experience AR"
          name="experience_ar"
          value={form.experience_ar}
          onChange={handleChange}
          style={{ width: "100%", minHeight: 60 }}
        />

        <textarea
          placeholder="Experience EN"
          name="experience_en"
          value={form.experience_en}
          onChange={handleChange}
          style={{ width: "100%", minHeight: 60 }}
        />

        <input
          name="linkedin_url"
          placeholder="LinkedIn URL"
          value={form.linkedin_url}
          onChange={handleChange}
          style={{ width: 300 }}
        />

        <input
          type="number"
          name="order"
          placeholder="Order"
          value={form.order}
          onChange={handleChange}
          style={{ width: 80 }}
        />

        <label style={{ marginLeft: 8 }}>
          <input
            type="checkbox"
            name="is_active"
            checked={form.is_active}
            onChange={handleChange}
          />
          Active
        </label>

        <div>
          <input type="file" name="profile_image" onChange={handleChange} />
        </div>

        <button onClick={handleSave} style={{ marginTop: 10 }}>
          {editing ? "Update Member" : "Create Member"}
        </button>
      </div>

      {/* TABLE */}
      <table border={1} cellPadding={8} width="100%">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name AR</th>
            <th>Role</th>
            <th>Order</th>
            <th>Active</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {members.map((m) => (
            <tr key={m.id}>
              <td>{m.id}</td>
              <td>{m.name_ar}</td>
              <td>{m.role}</td>
              <td>{m.order}</td>
              <td>{m.is_active ? "Yes" : "No"}</td>
              <td>
                {m.profile_image_url && (
                  <img
                    src={m.profile_image_url}
                    width={50}
                    height={50}
                    style={{ objectFit: "cover" }}
                  />
                )}
              </td>
              <td>
                <button onClick={() => handleEdit(m)}>Edit</button>
                <button onClick={() => handleDelete(m.id)}>Delete</button>
              </td>
            </tr>
          ))}

          {members.length === 0 && (
            <tr>
              <td colSpan={7}>No team members yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
