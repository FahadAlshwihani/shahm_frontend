import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  getAdminAppointmentPage,
  updateAdminAppointmentPage,
  getAdminAppointmentSettings,
  updateAdminAppointmentSettings,
  getAdminSlots,
  createSlot,
  updateSlot,
  deleteSlot,
  getAdminBookings,
} from "../../api/appointmentsApi";


export default function AppointmentsCMS() {
  const [loading, setLoading] = useState(true);

  /* ================= PAGE ================= */
  const [page, setPage] = useState({});

  /* ================= SETTINGS ================= */
  const [settings, setSettings] = useState({
    price: "",
    slot_duration: "",
  });

  /* ================= SLOTS ================= */
  const [slots, setSlots] = useState([]);
  const [newSlot, setNewSlot] = useState({
    date: "",
    start_time: "",
    end_time: "",
  });

  /* ================= BOOKINGS ================= */
  const [bookings, setBookings] = useState([]);

  /* ================= LOAD ALL ================= */
  useEffect(() => {
    async function load() {
      try {
        const [
          pageRes,
          settingsRes,
          slotsRes,
          bookingsRes,
        ] = await Promise.all([
          getAdminAppointmentPage(),
          getAdminAppointmentSettings(),
          getAdminSlots(),
          getAdminBookings(),
        ]);

        setPage(pageRes.data || {});
        setSettings(settingsRes.data || {});
        setSlots(slotsRes.data || []);
        setBookings(bookingsRes.data || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load Appointments CMS");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) return null;

  /* ================= PAGE SAVE ================= */
  const savePage = async () => {
    try {
      await updateAdminAppointmentPage(page);
      toast.success("Page content saved");
    } catch {
      toast.error("Failed to save page content");
    }
  };

  /* ================= SETTINGS SAVE ================= */
  const saveSettings = async () => {
    try {
      await updateAdminAppointmentSettings(settings);
      toast.success("Settings saved");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save settings");
    }
  };

  /* ================= SLOT ACTIONS ================= */
  const addSlot = async () => {
    if (!newSlot.date || !newSlot.start_time || !newSlot.end_time) {
      toast.error("Please fill all slot fields");
      return;
    }

    try {
      const res = await createSlot(newSlot);
      setSlots([...slots, res.data]);
      setNewSlot({ date: "", start_time: "", end_time: "" });
      toast.success("Slot added");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add slot");
    }
  };

  const toggleSlot = async (slot) => {
    try {
      const res = await updateSlot(slot.id, {
        is_available: !slot.is_available,
      });

      setSlots(
        slots.map((s) => (s.id === slot.id ? res.data : s))
      );
    } catch {
      toast.error("Failed to update slot");
    }
  };

  const removeSlot = async (id) => {
    if (!window.confirm("Delete this slot?")) return;

    try {
      await deleteSlot(id);
      setSlots(slots.filter((s) => s.id !== id));
      toast.success("Slot deleted");
    } catch {
      toast.error("Failed to delete slot");
    }
  };

  /* ================= UI ================= */
  return (
    <div className="dashboard-page">
      <h1>Appointments CMS</h1>

      {/* =====================================================
          PAGE CONTENT
      ===================================================== */}
      <section className="dashboard-card">
        <h3>Page Content</h3>

        <input
          placeholder="Title (AR)"
          value={page.title_ar || ""}
          onChange={(e) =>
            setPage({ ...page, title_ar: e.target.value })
          }
        />

        <input
          placeholder="Title (EN)"
          value={page.title_en || ""}
          onChange={(e) =>
            setPage({ ...page, title_en: e.target.value })
          }
        />

        <textarea
          placeholder="Description (AR)"
          value={page.description_ar || ""}
          onChange={(e) =>
            setPage({ ...page, description_ar: e.target.value })
          }
        />

        <textarea
          placeholder="Description (EN)"
          value={page.description_en || ""}
          onChange={(e) =>
            setPage({ ...page, description_en: e.target.value })
          }
        />

        <button onClick={savePage}>Save Page</button>
      </section>

      {/* =====================================================
          SETTINGS
      ===================================================== */}
      <section className="dashboard-card">
        <h3>Settings</h3>

        <input
          type="number"
          placeholder="Appointment Price"
          value={settings.price ?? ""}
          onChange={(e) =>
            setSettings({ ...settings, price: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Slot Duration (minutes)"
          value={settings.slot_duration ?? ""}
          onChange={(e) =>
            setSettings({
              ...settings,
              slot_duration: e.target.value,
            })
          }
        />

        <button onClick={saveSettings}>Save Settings</button>
      </section>

      {/* =====================================================
          SLOTS MANAGER
      ===================================================== */}
      <section className="dashboard-card">
        <h3>Slots Manager</h3>

        <div className="slot-form">
          <input
            type="date"
            value={newSlot.date}
            onChange={(e) =>
              setNewSlot({ ...newSlot, date: e.target.value })
            }
          />

          <input
            type="time"
            value={newSlot.start_time}
            onChange={(e) =>
              setNewSlot({
                ...newSlot,
                start_time: e.target.value,
              })
            }
          />

          <input
            type="time"
            value={newSlot.end_time}
            onChange={(e) =>
              setNewSlot({
                ...newSlot,
                end_time: e.target.value,
              })
            }
          />

          <button onClick={addSlot}>Add Slot</button>
        </div>

        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Start</th>
              <th>End</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {slots.map((slot) => (
              <tr key={slot.id}>
                <td>{slot.date}</td>
                <td>{slot.start_time}</td>
                <td>{slot.end_time}</td>
                <td>
                  {slot.is_available ? "Available" : "Disabled"}
                </td>
                <td>
                  <button onClick={() => toggleSlot(slot)}>
                    {slot.is_available ? "Disable" : "Enable"}
                  </button>
                  <button
                    className="danger"
                    onClick={() => removeSlot(slot.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* =====================================================
          BOOKINGS
      ===================================================== */}
      <section className="dashboard-card">
        <h3>Bookings</h3>

        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Date</th>
              <th>Time</th>
              <th>Email</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                <td>
                  {b.first_name} {b.last_name}
                </td>
                <td>{b.slot?.date}</td>
                <td>
                  {b.slot?.start_time} – {b.slot?.end_time}
                </td>
                <td>{b.email}</td>
                <td>
                  <span
                    className={`status ${
                      b.status === "paid"
                        ? "paid"
                        : b.status === "pending"
                        ? "pending"
                        : "cancelled"
                    }`}
                  >
                    {b.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
