import React, { useEffect, useState } from "react";
import { getApplications } from "../../api/careersApi";

export default function CareerApplicationsCMS() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await getApplications();
    setItems(res.data);
  };

  return (
    <div style={{ overflowX: "auto" }}>

      <h2 style={{ marginBottom: 20 }}>طلبات التوظيف</h2>

      <table className="cms-table">
        <thead>
          <tr>
            <th>الاسم EN</th>
            <th>الاسم AR</th>
            <th>الجوال</th>
            <th>البريد</th>
            <th>الجنسية</th>
            <th>الجنس</th>
            <th>الموقع</th>
            <th>المصدر</th>
            <th>الوظيفة</th>
            <th>الهوية</th>
            <th>LinkedIn</th>
            <th>الشهادات</th>
            <th>الرسالة</th>
            <th>CV</th>
            <th>ملفات إضافية</th>
            <th>التاريخ</th>
          </tr>
        </thead>

        <tbody>
          {items.map((a) => (
            <tr key={a.id}>

              <td>{a.first_name} {a.last_name}</td>
              <td>{a.first_name_ar} {a.last_name_ar}</td>

              <td>{a.phone}</td>
              <td>{a.email}</td>

              <td>{a.nationality}</td>
              <td>{a.gender}</td>
              <td>{a.location}</td>
              <td>{a.source}</td>

              <td>{a.job_title}</td>

              <td>{a.id_number}</td>

              <td>
                {a.linkedin && (
                  <a
                    href={
                      a.linkedin?.startsWith("http")
                        ? a.linkedin
                        : `https://${a.linkedin}`
                    }
                    target="_blank"
                    rel="noreferrer"
                  >
                    فتح
                  </a>
                )}
              </td>

              <td>{a.certifications}</td>

              <td style={{ maxWidth: 200, whiteSpace: "pre-wrap" }}>
                {a.notes}
              </td>

              <td>
                {a.cv_file && (
                  <a href={`http://127.0.0.1:8000${a.cv_file}`} target="_blank" rel="noreferrer">تحميل</a>
                )}
              </td>

              <td>
                {a.cover_letter && (
                  <a href={`http://127.0.0.1:8000${a.cover_letter}`} target="_blank" rel="noreferrer">تحميل</a>
                )}
              </td>

              <td>{new Date(a.created_at).toLocaleDateString()}</td>

            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
}
