import React, { useEffect } from "react";
import { useDashboardStore } from "../../store/useDashboardStore";

export default function DashboardHome() {
  const { stats, loadStats } = useDashboardStore();

  useEffect(() => {
    loadStats();
  }, []);

  if (!stats) return <p>Loading stats...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Dashboard Overview</h1>

      {/* ==================== CARDS ==================== */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 20,
        marginTop: 20,
      }}>
        
        <Card title="زيارات اليوم" value={stats.visits.today} />
        <Card title="زيارات الأسبوع" value={stats.visits.week} />
        <Card title="عدد رسائل التواصل" value={stats.messages.total} />
        <Card title="عدد المشتركين بالنشرة" value={stats.subscribers.total} />

      </div>

      {/* ==================== آخر الرسائل ==================== */}
      <h2 style={{ marginTop: 40 }}>آخر الرسائل</h2>
      <ListBox items={stats.messages.latest} />

      {/* ==================== أحدث المشتركين ==================== */}
      <h2 style={{ marginTop: 40 }}>أحدث المشتركين</h2>
      <ListBox items={stats.subscribers.latest} />

      {/* ==================== الصفحات الأكثر زيارة ==================== */}
      <h2 style={{ marginTop: 40 }}>أكثر الصفحات زيارة</h2>
      <ul>
        {stats.visits.top_pages.map((p, i) => (
          <li key={i}>{p.path} — {p.count} زيارة</li>
        ))}
      </ul>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div style={{
      padding: 20,
      background: "#f7f7f7",
      borderRadius: 10,
      textAlign: "center",
      boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
    }}>
      <h3>{title}</h3>
      <h1>{value}</h1>
    </div>
  );
}

function ListBox({ items }) {
  return (
    <div style={{
      padding: 15,
      border: "1px solid #ddd",
      borderRadius: 8,
      background: "#fff"
    }}>
      {!items.length && <p>لا يوجد بيانات.</p>}

      {items.map((item) => (
        <div
          key={item.id || item.email}
          style={{ padding: "10px 0", borderBottom: "1px solid #eee" }}
        >
          {item.name && <b>{item.name}</b>}
          {item.email && <p>{item.email}</p>}
          {item.subject && <p>{item.subject}</p>}
          {item.created_at && (
            <small>{new Date(item.created_at).toLocaleString()}</small>
          )}
        </div>
      ))}
    </div>
  );
}
