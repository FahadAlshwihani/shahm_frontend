// src/pages/dashboard/CMS_Footer.jsx
import React, { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import toast from "react-hot-toast";

export default function CMS_Footer() {
  const [columns, setColumns] = useState([]);
  const [pages, setPages] = useState([]);

  // Protected columns (user cannot add links inside them)
  const PROTECTED_COLUMNS = [
    "أرغب في تلقي كل جديد",
    "تابعنا",
    "خريطة الموقع",
  ];

  // ============================
  // Column Form
  // ============================
  const [colForm, setColForm] = useState({
    title_ar: "",
    title_en: "",
    order: 0,
    is_active: true,
  });

  const [editColumnId, setEditColumnId] = useState(null);

  // ============================
  // Link Form
  // ============================
  const [linkForm, setLinkForm] = useState({
    column: "",
    label_ar: "",
    label_en: "",
    url: "",
    page: "",
    order: 0,
    is_active: true,
  });

  const [editLinkId, setEditLinkId] = useState(null);

  // ============================
  // Load columns + pages
  // ============================
  const loadData = async () => {
    try {
      const colRes = await api.get("public/footer/");
      setColumns(colRes.data);

      const pagesRes = await api.get("cms/admin/pages/");
      setPages(pagesRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ============================
  // Add / Update Column
  // ============================
  const submitColumn = async (e) => {
    e.preventDefault();

    if (PROTECTED_COLUMNS.includes(colForm.title_ar)) {
      toast.error("هذا العمود محمي ولا يمكن تعديله من هنا");
      return;
    }

    try {
      if (editColumnId) {
        await api.patch(`cms/admin/columns/${editColumnId}/`, colForm);
        toast.success("تم تحديث العمود");
      } else {
        await api.post("cms/admin/columns/", colForm);
        toast.success("تم إضافة العمود");
      }

      setColForm({ title_ar: "", title_en: "", order: 0, is_active: true });
      setEditColumnId(null);
      loadData();
    } catch (err) {
      toast.error("خطأ أثناء حفظ العمود");
    }
  };

  // ============================
  // Add / Update Link
  // ============================
  const submitLink = async (e) => {
    e.preventDefault();

    const columnObj = columns.find((c) => c.id == linkForm.column);

    if (!columnObj) return toast.error("اختر عمودًا أولًا");

    if (PROTECTED_COLUMNS.includes(columnObj.title_ar)) {
      toast.error("لا يمكن إضافة روابط داخل هذا العمود");
      return;
    }

    if (linkForm.url && linkForm.page) {
      toast.error("لا يمكن استخدام رابط + صفحة معًا");
      return;
    }

    try {
      if (editLinkId) {
        await api.patch(
          `cms/admin/footer-links/${editLinkId}/`,
          linkForm
        );
        toast.success("تم تحديث الرابط");
      } else {
        await api.post("cms/admin/footer-links/", linkForm);
        toast.success("تم إضافة الرابط");
      }

      setLinkForm({
        column: "",
        label_ar: "",
        label_en: "",
        url: "",
        page: "",
        order: 0,
        is_active: true,
      });

      setEditLinkId(null);
      loadData();
    } catch (err) {
      toast.error("خطأ أثناء حفظ الرابط");
    }
  };

  // ============================
  // Edit Column
  // ============================
  const startEditColumn = (col) => {
    if (PROTECTED_COLUMNS.includes(col.title_ar)) {
      toast.error("هذا العمود محمي ولا يمكن تعديله");
      return;
    }

    setEditColumnId(col.id);
    setColForm({
      title_ar: col.title_ar,
      title_en: col.title_en,
      order: col.order,
      is_active: col.is_active,
    });
  };

  // ============================
  // Edit Link
  // ============================
  const startEditLink = (lnk, col) => {
    if (PROTECTED_COLUMNS.includes(col.title_ar)) {
      toast.error("لا يمكن تعديل روابط داخل عمود محمي");
      return;
    }

    setEditLinkId(lnk.id);
    setLinkForm({
      column: col.id,
      label_ar: lnk.label_ar,
      label_en: lnk.label_en,
      url: lnk.url,
      page: lnk.page,
      order: lnk.order,
      is_active: lnk.is_active,
    });
  };

  // ============================
  // Render UI
  // ============================
  return (
    <div style={{ padding: "20px" }}>
      <h1>إدارة الفوتر</h1>

      {/* ============= ADD / EDIT COLUMN ============== */}
      <h2>الأعمدة</h2>

      <form onSubmit={submitColumn}>
        <input
          placeholder="العنوان عربي"
          value={colForm.title_ar}
          onChange={(e) => setColForm({ ...colForm, title_ar: e.target.value })}
        />

        <input
          placeholder="العنوان إنجليزي"
          value={colForm.title_en}
          onChange={(e) => setColForm({ ...colForm, title_en: e.target.value })}
        />

        <input
          type="number"
          placeholder="الترتيب"
          value={colForm.order}
          onChange={(e) => setColForm({ ...colForm, order: e.target.value })}
        />

        <label>
          Active
          <input
            type="checkbox"
            checked={colForm.is_active}
            onChange={(e) =>
              setColForm({ ...colForm, is_active: e.target.checked })
            }
          />
        </label>

        <button>{editColumnId ? "تحديث العمود" : "إضافة عمود"}</button>
      </form>

      <hr />

      {/* ============= LIST COLUMNS + LINKS ============== */}
      {columns.map((col) => (
        <div key={col.id} style={{ padding: "10px 0" }}>
          <h3>
            {col.title_ar} — {col.title_en}
          </h3>

          {!PROTECTED_COLUMNS.includes(col.title_ar) && (
            <button onClick={() => startEditColumn(col)}>تعديل العمود</button>
          )}

          <div style={{ marginLeft: 20 }}>
            {col.links?.map((lnk) => (
              <div key={lnk.id} style={{ padding: "5px 0" }}>
                🔗 {lnk.label_ar} → {lnk.url}
                {!PROTECTED_COLUMNS.includes(col.title_ar) && (
                  <button
                    onClick={() => startEditLink(lnk, col)}
                    style={{ marginLeft: 10 }}
                  >
                    تعديل
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* ADD LINK ONLY IF COLUMN IS NOT PROTECTED */}
          {!PROTECTED_COLUMNS.includes(col.title_ar) && (
            <>
              <h4>إضافة رابط داخل {col.title_ar}</h4>

              <form
                onSubmit={submitLink}
                onFocus={() =>
                  setLinkForm({
                    ...linkForm,
                    column: col.id,
                  })
                }
              >
                <input
                  placeholder="النص بالعربي"
                  value={linkForm.label_ar}
                  onChange={(e) =>
                    setLinkForm({ ...linkForm, label_ar: e.target.value })
                  }
                />

                <input
                  placeholder="النص بالإنجليزي"
                  value={linkForm.label_en}
                  onChange={(e) =>
                    setLinkForm({ ...linkForm, label_en: e.target.value })
                  }
                />

                <input
                  placeholder="رابط URL"
                  value={linkForm.url}
                  onChange={(e) =>
                    setLinkForm({ ...linkForm, url: e.target.value })
                  }
                />

                <select
                  value={linkForm.page}
                  onChange={(e) => {
                    const val = e.target.value;
                    const selected = pages.find((p) => p.id == val);

                    setLinkForm({
                      ...linkForm,
                      page: val,
                      url: selected ? `/page/${selected.slug}` : "",
                    });
                  }}
                >
                  <option value="">اختر صفحة من CMS</option>
                  {pages.map((p) => (
                    <option value={p.id} key={p.id}>
                      {p.title_ar}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  placeholder="الترتيب"
                  value={linkForm.order}
                  onChange={(e) =>
                    setLinkForm({ ...linkForm, order: e.target.value })
                  }
                />

                <label>
                  Active
                  <input
                    type="checkbox"
                    checked={linkForm.is_active}
                    onChange={(e) =>
                      setLinkForm({
                        ...linkForm,
                        is_active: e.target.checked,
                      })
                    }
                  />
                </label>

                <button>{editLinkId ? "تحديث الرابط" : "إضافة رابط"}</button>
              </form>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
