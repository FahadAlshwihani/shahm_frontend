import React, { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import "../../styles/CMS_SERVICE_ADVISORY.css";

export default function ServiceAdvisoryServices() {

    const [services, setServices] = useState([]);
    const [areas, setAreas] = useState([]);
    const [editing, setEditing] = useState(null);
    const [faqs, setFaqs] = useState([]);

    const emptyForm = {
        practice_area: "",
        title_ar: "",
        title_en: "",
        description_ar: "",
        description_en: "",
        serial_number: "",
        icon: "",
        cover_image: null,
        is_featured: false,
        is_most_requested: false,
        overview_ar: "",
        overview_en: "",
        who_for_ar: "",
        who_for_en: "",
        scope_ar: "",
        scope_en: "",
        deliverables_ar: "",
        deliverables_en: "",
        how_it_works_ar: "",
        how_it_works_en: "",
        faqs: [],
    };

    const [form, setForm] = useState(emptyForm);

    const load = async () => {
        const res = await api.get("services/admin/items/");
        const areasRes = await api.get("services/admin/areas/");
        const faqRes = await api.get("cms/admin/faq/");
        setFaqs(faqRes.data || []);
        setServices(res.data || []);
        setAreas(areasRes.data || []);
    };

    useEffect(() => {
        load();
    }, []);

    const submit = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        Object.keys(form).forEach((key) => {
            if (key === "faqs") {
                form[key].forEach((faq) =>
                    formData.append("faqs", faq)
                );
            }
            else if (key === "cover_image") {
                if (form.cover_image) {
                    formData.append("cover_image", form.cover_image);
                }
            }
            else if (typeof form[key] === "boolean") {
                formData.append(key, form[key] ? "true" : "false");
            }
            else if (form[key] !== null && form[key] !== "") {
                formData.append(key, form[key]);
            }
        });

        if (editing) {
            await api.patch(
                `services/admin/items/${editing.id}/`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
        } else {
            await api.post(
                "services/admin/items/",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
        }

        setForm(emptyForm);
        setEditing(null);
        load();
    };

    return (
        <div className="cms-service-advisory">
            <h2 className="cms-title">إدارة الخدمات</h2>

            {/* ================= FORM ================= */}
            <form className="cms-card" onSubmit={submit}>

                <select
                    value={form.practice_area}
                    onChange={(e) =>
                        setForm({ ...form, practice_area: e.target.value })
                    }
                    required
                >
                    <option value="">اختر المجال القانوني</option>
                    {areas.map((a) => (
                        <option key={a.id} value={a.id}>
                            {a.name_ar}
                        </option>
                    ))}
                </select>

                <input
                    placeholder="عنوان الخدمة (AR)"
                    value={form.title_ar}
                    onChange={(e) =>
                        setForm({ ...form, title_ar: e.target.value })
                    }
                    required
                />

                <input
                    placeholder="Service Title (EN)"
                    value={form.title_en}
                    onChange={(e) =>
                        setForm({ ...form, title_en: e.target.value })
                    }
                    required
                />

                <textarea
                    placeholder="الوصف المختصر (AR)"
                    value={form.description_ar}
                    onChange={(e) =>
                        setForm({ ...form, description_ar: e.target.value })
                    }
                />

                <textarea
                    placeholder="Short Description (EN)"
                    value={form.description_en}
                    onChange={(e) =>
                        setForm({ ...form, description_en: e.target.value })
                    }
                />

                <input
                    placeholder="Serial Number"
                    value={form.serial_number}
                    onChange={(e) =>
                        setForm({ ...form, serial_number: e.target.value })
                    }
                />

                <select
                    value={form.icon}
                    onChange={(e) => setForm({ ...form, icon: e.target.value })}
                >
                    <option value="">اختر أيقونة</option>
                    <option value="gavel">Gavel</option>
                    <option value="scale">Scale of Justice</option>
                    <option value="briefcase">Briefcase</option>
                    <option value="contract">Contract</option>
                    <option value="shield">Shield</option>
                    <option value="court">Court</option>
                    <option value="document">Document</option>
                    <option value="pen">Pen</option>
                </select>

                <div>
                    <label>صورة الخدمة</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                            setForm({ ...form, cover_image: e.target.files[0] })
                        }
                    />
                </div>

                {form.cover_image && (
                    <div style={{ marginTop: "10px" }}>
                        <img
                            src={URL.createObjectURL(form.cover_image)}
                            alt="preview"
                            style={{ width: "150px", borderRadius: "6px" }}
                        />
                    </div>
                )}

                <label>
                    <input
                        type="checkbox"
                        checked={form.is_featured}
                        onChange={(e) =>
                            setForm({ ...form, is_featured: e.target.checked })
                        }
                    />
                    خدمة مميزة
                </label>

                <label>
                    <input
                        type="checkbox"
                        checked={form.is_most_requested}
                        onChange={(e) =>
                            setForm({ ...form, is_most_requested: e.target.checked })
                        }
                    />
                    الأكثر طلبًا
                </label>

                <textarea
                    placeholder="Overview AR"
                    value={form.overview_ar}
                    onChange={(e) =>
                        setForm({ ...form, overview_ar: e.target.value })
                    }
                />

                <textarea
                    placeholder="Overview EN"
                    value={form.overview_en}
                    onChange={(e) =>
                        setForm({ ...form, overview_en: e.target.value })
                    }
                />

                <textarea
                    placeholder="Who is this for (AR)"
                    value={form.who_for_ar}
                    onChange={(e) =>
                        setForm({ ...form, who_for_ar: e.target.value })
                    }
                />

                <textarea
                    placeholder="Who is this for (EN)"
                    value={form.who_for_en}
                    onChange={(e) =>
                        setForm({ ...form, who_for_en: e.target.value })
                    }
                />

                <textarea
                    placeholder="Scope AR"
                    value={form.scope_ar}
                    onChange={(e) =>
                        setForm({ ...form, scope_ar: e.target.value })
                    }
                />

                <textarea
                    placeholder="Scope EN"
                    value={form.scope_en}
                    onChange={(e) =>
                        setForm({ ...form, scope_en: e.target.value })
                    }
                />

                <textarea
                    placeholder="Deliverables AR"
                    value={form.deliverables_ar}
                    onChange={(e) =>
                        setForm({ ...form, deliverables_ar: e.target.value })
                    }
                />

                <textarea
                    placeholder="Deliverables EN"
                    value={form.deliverables_en}
                    onChange={(e) =>
                        setForm({ ...form, deliverables_en: e.target.value })
                    }
                />

                <textarea
                    placeholder="How it works AR"
                    value={form.how_it_works_ar}
                    onChange={(e) =>
                        setForm({ ...form, how_it_works_ar: e.target.value })
                    }
                />

                <textarea
                    placeholder="How it works EN"
                    value={form.how_it_works_en}
                    onChange={(e) =>
                        setForm({ ...form, how_it_works_en: e.target.value })
                    }
                />
                <select
                    multiple
                    value={form.faqs}
                    onChange={(e) => {
                        const values = Array.from(
                            e.target.selectedOptions,
                            (option) => Number(option.value)
                        );
                        setForm({ ...form, faqs: values });
                    }}
                >
                    {faqs.map((f) => (
                        <option key={f.id} value={f.id}>
                            {f.question_ar}
                        </option>
                    ))}
                </select>

                <button className="cms-btn-primary">
                    {editing ? "تحديث الخدمة" : "إضافة خدمة"}
                </button>
            </form>

            {/* ================= TABLE ================= */}
            <div className="cms-card">
                <table className="cms-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>العنوان</th>
                            <th>المجال</th>
                            <th>الحالة</th>
                            <th>إجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.map((s) => (
                            <tr key={s.id}>
                                <td>{s.id}</td>
                                <td>{s.title_ar}</td>
                                <td>{s.area_data?.name_ar}</td>
                                <td>{s.is_active ? "مفعل" : "موقوف"}</td>
                                <td>
                                    <button
                                        className="cms-btn-secondary"
                                        onClick={() => {
                                            setEditing(s);

                                            setForm({
                                                ...emptyForm,
                                                ...s,
                                                practice_area: s.practice_area || "",
                                                faqs: s.faq_data ? s.faq_data.map(f => f.id) : [],
                                                cover_image: null,
                                            });
                                        }}
                                    >
                                        تعديل
                                    </button>

                                    <button
                                        className="cms-btn-secondary"
                                        onClick={async () => {
                                            const toggleData = new FormData();
                                            toggleData.append("is_active", !s.is_active);

                                            await api.patch(
                                                `services/admin/items/${s.id}/`,
                                                toggleData,
                                                { headers: { "Content-Type": "multipart/form-data" } }
                                            );
                                            load();
                                        }}
                                    >
                                        {s.is_active ? "إيقاف" : "تفعيل"}
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {services.length === 0 && (
                            <tr>
                                <td colSpan="5" style={{ textAlign: "center" }}>
                                    لا توجد خدمات
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}