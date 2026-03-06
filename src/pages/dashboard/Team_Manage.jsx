import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import {
  adminTeamList,
  adminAddMember,
  adminUpdateMember,
  adminDeleteMember,
  adminGetTeamPage,
  adminSaveTeamPage,
} from "../../api/teamApi";


/* ======================================================
   Quill Editor (بديل SunEditor / React-Quill)
   - بدون findDOMNode
   - يدعم: خط/حجم/ألوان/محاذاة/قوائم/روابط
====================================================== */
function QuillEditor({
  value,
  onChange,
  placeholder = "",
  height = 250,
}) {
  const containerRef = useRef(null);
  const quillRef = useRef(null);
  const lastHtmlRef = useRef(value || "");

  // init once
  useEffect(() => {
    let mounted = true;

    async function init() {
      if (!containerRef.current || quillRef.current) return;

      const Quill = (await import("quill")).default;

      const toolbarOptions = [
        ["bold", "italic", "underline"],
        [{ size: ["small", false, "large", "huge"] }],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link"],
        ["clean"],
      ];

      const quill = new Quill(containerRef.current, {
        theme: "snow",
        placeholder,
        modules: {
          toolbar: toolbarOptions,
        },
      });

      // Height
      const editor = containerRef.current.querySelector(".ql-editor");
      if (editor) editor.style.minHeight = `${height}px`;

      // initial content
      if (value) {
        quill.clipboard.dangerouslyPasteHTML(value);
        lastHtmlRef.current = value;
      } else {
        lastHtmlRef.current = "";
      }

      quill.on("text-change", () => {
        const html = quill.root.innerHTML;

        // منع spam updates (يقلل اللخبطة)
        if (html !== lastHtmlRef.current) {
          lastHtmlRef.current = html;
          onChange?.(html);
        }
      });

      if (!mounted) {
        quill.off("text-change");
      }

      quillRef.current = quill;
    }

    init();

    return () => {
      mounted = false;
      // Quill ما يحتاج destroy رسميًا
      quillRef.current = null;
    };
  }, []);

  // keep editor in sync when value changes externally (load/edit)
  useEffect(() => {
    const quill = quillRef.current;
    const next = value || "";

    if (!quill) {
      lastHtmlRef.current = next;
      return;
    }

    const current = quill.root.innerHTML;
    if (next !== current) {
      const sel = quill.getSelection();
      quill.clipboard.dangerouslyPasteHTML(next);
      lastHtmlRef.current = next;
      if (sel) quill.setSelection(sel);
    }
  }, [value]);

  return (
    <div style={{ marginTop: 10 }}>
      {/* Quill يحتاج CSS بنفسه */}
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/quill@1.3.7/dist/quill.snow.css"
      />
      <div ref={containerRef} />
    </div>
  );
}

export default function Team_Manage() {
  /* ======================================================
      STATES
  ====================================================== */

  const [tab, setTab] = useState("page");

  const [page, setPage] = useState({});
  const [members, setMembers] = useState([]);

  const [editing, setEditing] = useState(null);

  const [memberForm, setMemberForm] = useState({
    name_ar: "",
    name_en: "",
    experience_ar: "",
    experience_en: "",
    profile_image: null,
    field_ar: "",
    field_en: "",
    order: 0,
    is_active: true,
  });

  /* ======================================================
      LOAD
  ====================================================== */

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    const [m, p] = await Promise.all([
      adminTeamList(),
      adminGetTeamPage(),
    ]);

    setMembers(m.data || []);
    setPage(p.data || {});
  }


  /* ======================================================
      PAGE SAVE
  ====================================================== */

  async function savePage() {
    const fd = new FormData();

    Object.entries(page).forEach(([k, v]) => {
      // لو القيمة null لا ترسلها
      if (v === null || v === undefined) return;

      // لو صورة وكانت string (قديمة) لا ترسلها
      if (
        (k === "hero_image" || k === "bottom_image") &&
        typeof v === "string"
      ) {
        return;
      }

      fd.append(k, v);
    });

    await adminSaveTeamPage(fd);
    toast.success("تم حفظ الصفحة");
  }

  /* ======================================================
      MEMBER SAVE
  ====================================================== */

  async function saveMember() {
    const fd = new FormData();

    Object.entries(memberForm).forEach(([k, v]) => {
      if (v !== null) fd.append(k, v);
    });


    if (editing) await adminUpdateMember(editing.id, fd);
    else await adminAddMember(fd);

    toast.success("تم الحفظ");

    setEditing(null);

    setMemberForm({
      name_ar: "",
      name_en: "",
      experience_ar: "",
      experience_en: "",
      profile_image: null,
      order: 0,
      is_active: true,
    });

    loadAll();
  }

  /* ======================================================
      UI
  ====================================================== */

  return (
    <div style={{ padding: 30, maxWidth: 1200, margin: "auto" }}>
      <h1>👥 Team CMS</h1>

      {/* =========================================
          TABS
      ========================================= */}
      <div style={{ marginBottom: 30 }}>
        <button onClick={() => setTab("page")}>📄 Page</button>
        <button onClick={() => setTab("members")}>👤 Members</button>
      </div>

      {/* =========================================
          1️⃣ PAGE SETTINGS
      ========================================= */}
      {tab === "page" && (
        <>
          <h2>Page Settings</h2>

          <input
            placeholder="Title AR"
            value={page.title_ar || ""}
            onChange={(e) => setPage({ ...page, title_ar: e.target.value })}
          />

          <input
            placeholder="Title EN"
            value={page.title_en || ""}
            onChange={(e) => setPage({ ...page, title_en: e.target.value })}
          />

          {/* بدل SunEditor: description_ar */}
          <h3 style={{ marginTop: 16 }}>Description AR</h3>
          <QuillEditor
            value={page.description_ar || ""}
            onChange={(v) => setPage((prev) => ({ ...prev, description_ar: v }))}
            height={200}
            placeholder="اكتب وصف الصفحة بالعربية..."
          />

          {/* (اختياري) لو عندك description_en بالسيرفر، خله جاهز */}
          <h3 style={{ marginTop: 16 }}>Description EN</h3>
          <QuillEditor
            value={page.description_en || ""}
            onChange={(v) => setPage((prev) => ({ ...prev, description_en: v }))}
            height={200}
            placeholder="Write page description in English..."
          />

          <h3 style={{ marginTop: 20 }}>Hero Top</h3>
          <input
            type="file"
            onChange={(e) => setPage({ ...page, hero_image: e.target.files[0] })}
          />

          {/* بدل SunEditor: hero_description_ar */}
          <h3 style={{ marginTop: 16 }}>Hero Description AR</h3>
          <QuillEditor
            value={page.hero_description_ar || ""}
            onChange={(v) =>
              setPage((prev) => ({ ...prev, hero_description_ar: v }))
            }
            height={200}
            placeholder="وصف الهيرو بالعربية..."
          />

          <h3 style={{ marginTop: 16 }}>Hero Description EN</h3>
          <QuillEditor
            value={page.hero_description_en || ""}
            onChange={(v) =>
              setPage((prev) => ({ ...prev, hero_description_en: v }))
            }
            height={200}
            placeholder="Hero description in English..."
          />

          <h3 style={{ marginTop: 20 }}>Middle Content</h3>

          {/* بدل SunEditor: content_ar */}
          <h3 style={{ marginTop: 12 }}>Content AR</h3>
          <QuillEditor
            value={page.content_ar || ""}
            onChange={(v) => setPage((prev) => ({ ...prev, content_ar: v }))}
            height={250}
            placeholder="محتوى منتصف الصفحة بالعربية..."
          />

          <h3 style={{ marginTop: 12 }}>Content EN</h3>
          <QuillEditor
            value={page.content_en || ""}
            onChange={(v) => setPage((prev) => ({ ...prev, content_en: v }))}
            height={250}
            placeholder="Middle content in English..."
          />

          <h3 style={{ marginTop: 20 }}>Bottom Hero</h3>
          <input
            type="file"
            onChange={(e) =>
              setPage({ ...page, bottom_image: e.target.files[0] })
            }
          />

          <h3 style={{ marginTop: 20 }}>Right Button Title AR</h3>
          <QuillEditor
            value={page.right_cta_title_ar || ""}
            onChange={(v) =>
              setPage((prev) => ({ ...prev, right_cta_title_ar: v }))
            }
            height={100}
          />

          <h3 style={{ marginTop: 16 }}>Right Button Title EN</h3>
          <QuillEditor
            value={page.right_cta_title_en || ""}
            onChange={(v) =>
              setPage((prev) => ({ ...prev, right_cta_title_en: v }))
            }
            height={100}
          />

          <hr style={{ margin: "25px 0" }} />

          <h3>Left Button Title AR</h3>
          <QuillEditor
            value={page.left_cta_title_ar || ""}
            onChange={(v) =>
              setPage((prev) => ({ ...prev, left_cta_title_ar: v }))
            }
            height={100}
          />

          <h3 style={{ marginTop: 16 }}>Left Button Title EN</h3>
          <QuillEditor
            value={page.left_cta_title_en || ""}
            onChange={(v) =>
              setPage((prev) => ({ ...prev, left_cta_title_en: v }))
            }
            height={100}
          />


          <h3 style={{ marginTop: 20 }}>CTA Buttons</h3>

          <input
            placeholder="Left Text AR"
            value={page.left_link_text_ar || ""}
            onChange={(e) =>
              setPage({ ...page, left_link_text_ar: e.target.value })
            }
          />

          <input
            placeholder="Left Text EN"
            value={page.left_link_text_en || ""}
            onChange={(e) =>
              setPage({ ...page, left_link_text_en: e.target.value })
            }
          />

          <input
            placeholder="Left URL"
            value={page.left_link_url || ""}
            onChange={(e) => setPage({ ...page, left_link_url: e.target.value })}
          />

          <label>
            <input
              type="checkbox"
              checked={!!page.left_link_visible}
              onChange={(e) =>
                setPage({ ...page, left_link_visible: e.target.checked })
              }
            />
            Visible
          </label>

          <hr style={{ margin: "25px 0" }} />

          <h3>Right Button</h3>

          <input
            placeholder="Right Text AR"
            value={page.right_link_text_ar || ""}
            onChange={(e) =>
              setPage({ ...page, right_link_text_ar: e.target.value })
            }
          />

          <input
            placeholder="Right Text EN"
            value={page.right_link_text_en || ""}
            onChange={(e) =>
              setPage({ ...page, right_link_text_en: e.target.value })
            }
          />

          <input
            placeholder="Right URL"
            value={page.right_link_url || ""}
            onChange={(e) =>
              setPage({ ...page, right_link_url: e.target.value })
            }
          />

          <label>
            <input
              type="checkbox"
              checked={!!page.right_link_visible}
              onChange={(e) =>
                setPage({ ...page, right_link_visible: e.target.checked })
              }
            />
            Visible
          </label>


          <br />

          <button onClick={savePage}>💾 حفظ الصفحة</button>
        </>
      )}


      {/* =========================================
          3️⃣ MEMBERS
      ========================================= */}
      {tab === "members" && (
        <>
          <h2>Members</h2>

          <input
            placeholder="الاسم عربي"
            value={memberForm.name_ar}
            onChange={(e) =>
              setMemberForm({ ...memberForm, name_ar: e.target.value })
            }
          />

          <input
            placeholder="Name EN"
            value={memberForm.name_en}
            onChange={(e) =>
              setMemberForm({ ...memberForm, name_en: e.target.value })
            }
          />

          <input
            placeholder="المجال عربي"
            value={memberForm.field_ar}
            onChange={(e) => setMemberForm({ ...memberForm, field_ar: e.target.value })}
          />

          <input
            placeholder="Field EN"
            value={memberForm.field_en}
            onChange={(e) => setMemberForm({ ...memberForm, field_en: e.target.value })}
          />

          <input
            placeholder="القطاع عربي"
            value={memberForm.sector_ar}
            onChange={(e) => setMemberForm({ ...memberForm, sector_ar: e.target.value })}
          />

          <input
            placeholder="Sector EN"
            value={memberForm.sector_en}
            onChange={(e) => setMemberForm({ ...memberForm, sector_en: e.target.value })}
          />



          {/* بدل SunEditor: experience_ar */}
          <h3 style={{ marginTop: 12 }}>Experience AR</h3>
          <QuillEditor
            value={memberForm.experience_ar || ""}
            onChange={(v) =>
              setMemberForm((prev) => ({ ...prev, experience_ar: v }))
            }
            height={200}
            placeholder="خبرة العضو بالعربية..."
          />

          {/* (اختياري) experience_en */}
          <h3 style={{ marginTop: 12 }}>Experience EN</h3>
          <QuillEditor
            value={memberForm.experience_en || ""}
            onChange={(v) =>
              setMemberForm((prev) => ({ ...prev, experience_en: v }))
            }
            height={200}
            placeholder="Member experience in English..."
          />

          <input
            style={{ marginTop: 12 }}
            type="file"
            onChange={(e) =>
              setMemberForm({
                ...memberForm,
                profile_image: e.target.files[0],
              })
            }
          />

          <button onClick={saveMember}>
            {editing ? "تحديث" : "إضافة عضو"}
          </button>

          <hr />

          {members.map((m) => (
            <div key={m.id}>
              {m.name_ar}
              <button onClick={() => adminDeleteMember(m.id)}>حذف</button>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
