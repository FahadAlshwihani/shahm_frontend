import React, { useEffect, useState } from "react";
import api from "../../api/axiosClient";

export default function ServicePracticeAreas() {

  const [areas, setAreas] = useState([]);
  const [editing, setEditing] = useState(null);

  const emptyForm = {
    name_ar: "",
    name_en: "",
    icon: "",
    order: 0,
    is_active: true,
  };

  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    const res = await api.get("services/admin/areas/");
    setAreas(res.data || []);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();

    if (editing) {
      await api.patch(`services/admin/areas/${editing.id}/`, form);
    } else {
      await api.post("services/admin/areas/", form);
    }

    setForm(emptyForm);
    setEditing(null);
    load();
  };

  return (
    <div className="cms-service-advisory">

      <h2 className="cms-title">إدارة المجالات القانونية</h2>

      <form className="cms-card" onSubmit={submit}>

        <input
          placeholder="اسم المجال (AR)"
          value={form.name_ar}
          onChange={(e) => setForm({ ...form, name_ar: e.target.value })}
          required
        />

        <input
          placeholder="Practice Area Name (EN)"
          value={form.name_en}
          onChange={(e) => setForm({ ...form, name_en: e.target.value })}
          required
        />

        {/* SVG ICON SELECT */}
        <select
          value={form.icon}
          onChange={(e) => setForm({ ...form, icon: e.target.value })}
        >
          <option value="">اختر أيقونة</option>
          <option value="gavel">Gavel</option>
          <option value="scale">Scale</option>
          <option value="briefcase">Briefcase</option>
          <option value="balance">Balance</option>
          <option value="court">Court</option>
          <option value="document">Document</option>
          <option value="shield">Shield</option>
          <option value="pen">Pen</option>
        </select>

        <input
          type="number"
          placeholder="Order"
          value={form.order}
          onChange={(e) => setForm({ ...form, order: e.target.value })}
        />

        <label>
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) =>
              setForm({ ...form, is_active: e.target.checked })
            }
          />
          مفعل
        </label>

        <button className="cms-btn-primary">
          {editing ? "تحديث المجال" : "إضافة مجال"}
        </button>

      </form>

      {/* TABLE */}
      <div className="cms-card">
        <table className="cms-table">
          <thead>
            <tr>
              <th>#</th>
              <th>الاسم</th>
              <th>الأيقونة</th>
              <th>الحالة</th>
              <th>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {areas.map((a) => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{a.name_ar}</td>
                <td>{a.icon || "—"}</td>
                <td>{a.is_active ? "مفعل" : "موقوف"}</td>
                <td>
                  <button
                    className="cms-btn-secondary"
                    onClick={() => {
                      setEditing(a);
                      setForm(a);
                    }}
                  >
                    تعديل
                  </button>

                  <button
                    className="cms-btn-secondary"
                    onClick={async () => {
                      await api.patch(
                        `services/admin/areas/${a.id}/`,
                        { is_active: !a.is_active }
                      );
                      load();
                    }}
                  >
                    {a.is_active ? "إيقاف" : "تفعيل"}
                  </button>
                </td>
              </tr>
            ))}

            {areas.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  لا توجد مجالات
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}