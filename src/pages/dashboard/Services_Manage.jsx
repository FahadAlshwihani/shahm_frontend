// src/pages/dashboard/Services_Manage.jsx
import React, { useEffect, useState } from "react";
import { useServicesStore } from "../../store/useServicesStore";
import toast from "react-hot-toast";

export default function Services_Manage() {
  const {
    areas,
    services,
    fetchAreas,
    createArea,
    updateArea,
    deleteArea,
    fetchServices,
    createService,
    updateService,
    deleteService,
  } = useServicesStore();

  // ========================= AREA STATE =========================
  const [areaForm, setAreaForm] = useState({
    name_ar: "",
    name_en: "",
    slug: "",
    is_active: true,
  });
  const [editingArea, setEditingArea] = useState(null);

  // ========================= SERVICE STATE =========================
  const [serviceForm, setServiceForm] = useState({
    title_ar: "",
    title_en: "",
    description_ar: "",
    description_en: "",
    area: "",
    is_featured: false,
    is_active: true,
  });
  const [editingService, setEditingService] = useState(null);

  // ========================= LOAD DATA =========================
  useEffect(() => {
    fetchAreas();
    fetchServices();
  }, []);

  // ========================= AREA HANDLERS =========================
  const handleAreaSave = async () => {
    if (!areaForm.name_ar.trim())
      return toast.error("Arabic name is required");

    const payload = {
      name_ar: areaForm.name_ar,
      name_en: areaForm.name_en,
      slug: areaForm.slug.trim() || undefined,
      is_active: true,
    };

    let result = editingArea
      ? await updateArea(editingArea.id, payload)
      : await createArea(payload);

    if (result.success) {
      toast.success("Area saved successfully");
      setAreaForm({ name_ar: "", name_en: "", slug: "" });
      setEditingArea(null);
    } else {
      toast.error("Error saving area");
    }
  };

  const handleAreaEdit = (area) => {
    setEditingArea(area);
    setAreaForm({
      name_ar: area.name_ar,
      name_en: area.name_en,
      slug: area.slug,
    });
  };

  const handleAreaDelete = async (id) => {
    if (!window.confirm("Delete this area?")) return;
    const result = await deleteArea(id);
    if (result.success) toast.success("Area deleted");
    else toast.error("Error deleting area");
  };

  // ========================= SERVICE HANDLERS =========================
  const handleServiceChange = (e) => {
    const { name, value, type, checked } = e.target;

    setServiceForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleServiceSave = async () => {
    if (!serviceForm.title_ar.trim())
      return toast.error("Arabic title is required");

    const payload = {
      title_ar: serviceForm.title_ar,
      title_en: serviceForm.title_en,
      description_ar: serviceForm.description_ar,
      description_en: serviceForm.description_en,
      practice_area: serviceForm.area || null,
      is_featured: serviceForm.is_featured,
      is_active: true,
    };

    let result = editingService
      ? await updateService(editingService.id, payload)
      : await createService(payload);

    if (result.success) {
      toast.success(editingService ? "Service updated" : "Service created");
      setEditingService(null);
      setServiceForm({
        title_ar: "",
        title_en: "",
        description_ar: "",
        description_en: "",
        area: "",
        is_featured: false,
      });
    } else {
      toast.error("Error saving service");
    }
  };

  const handleServiceEdit = (service) => {
    const areaId =
      service.practice_area ||
      service.practice_area_id ||
      service.area_data?.id ||
      "";

    setEditingService(service);

    setServiceForm({
      title_ar: service.title_ar,
      title_en: service.title_en,
      description_ar: service.description_ar,
      description_en: service.description_en,
      area: areaId,
      is_featured: !!service.is_featured,
      is_active: true,
    });
  };

  const handleServiceDelete = async (id) => {
    if (!window.confirm("Delete this service?")) return;
    const result = await deleteService(id);
    if (result.success) toast.success("Service deleted");
    else toast.error("Error deleting service");
  };

  // ========================= UI =========================
  return (
    <div style={{ padding: 20 }}>
      <h1>Services Management</h1>

      {/* ===================== AREAS ===================== */}
      <section style={{ marginBottom: 40 }}>
        <h2>Practice Areas</h2>

        <div style={{ marginBottom: 10 }}>
          <input
            placeholder="Name AR"
            value={areaForm.name_ar}
            onChange={(e) =>
              setAreaForm({ ...areaForm, name_ar: e.target.value })
            }
          />
          <input
            placeholder="Name EN"
            value={areaForm.name_en}
            onChange={(e) =>
              setAreaForm({ ...areaForm, name_en: e.target.value })
            }
            style={{ marginLeft: 8 }}
          />
          <input
            placeholder="Slug (optional)"
            value={areaForm.slug}
            onChange={(e) =>
              setAreaForm({ ...areaForm, slug: e.target.value })
            }
            style={{ marginLeft: 8 }}
          />

          <button onClick={handleAreaSave} style={{ marginLeft: 8 }}>
            {editingArea ? "Update Area" : "Create Area"}
          </button>
        </div>

        <table border={1} width="100%" cellPadding={8}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name AR</th>
              <th>Name EN</th>
              <th>Slug</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {areas.map((a) => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{a.name_ar}</td>
                <td>{a.name_en}</td>
                <td>{a.slug}</td>
                <td>
                  <button onClick={() => handleAreaEdit(a)}>Edit</button>
                  <button onClick={() => handleAreaDelete(a.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {areas.length === 0 && (
              <tr>
                <td colSpan={5}>No areas yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {/* ===================== SERVICES ===================== */}
      <section>
        <h2>Services</h2>

        <div style={{ marginBottom: 10 }}>
          <input
            placeholder="Title AR"
            name="title_ar"
            value={serviceForm.title_ar}
            onChange={handleServiceChange}
          />
          <input
            placeholder="Title EN"
            name="title_en"
            value={serviceForm.title_en}
            onChange={handleServiceChange}
            style={{ marginLeft: 8 }}
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <textarea
            placeholder="Description AR"
            name="description_ar"
            value={serviceForm.description_ar}
            onChange={handleServiceChange}
            style={{ width: "100%", minHeight: 60 }}
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <textarea
            placeholder="Description EN"
            name="description_en"
            value={serviceForm.description_en}
            onChange={handleServiceChange}
            style={{ width: "100%", minHeight: 60 }}
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <select
            name="area"
            value={serviceForm.area}
            onChange={handleServiceChange}
          >
            <option value="">Select Area</option>
            {areas.map((a) => (
              <option value={a.id} key={a.id}>
                {a.name_ar}
              </option>
            ))}
          </select>

          <label style={{ marginLeft: 16 }}>
            <input
              type="checkbox"
              name="is_featured"
              checked={serviceForm.is_featured}
              onChange={handleServiceChange}
            />
            Featured
          </label>
        </div>

        <button onClick={handleServiceSave}>
          {editingService ? "Update Service" : "Create Service"}
        </button>

        <table border={1} width="100%" cellPadding={8} style={{ marginTop: 20 }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title AR</th>
              <th>Area</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {services.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.title_ar}</td>
                <td>{s.area_data?.name_ar || ""}</td>
                <td>{s.is_featured ? "Yes" : "No"}</td>
                <td>
                  <button onClick={() => handleServiceEdit(s)}>Edit</button>
                  <button onClick={() => handleServiceDelete(s.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {services.length === 0 && (
              <tr>
                <td colSpan={5}>No services yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
