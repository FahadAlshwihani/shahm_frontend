import React, { useEffect, useState } from "react";
import {
  getAdminJobs,
  createJob,
  deleteJob
} from "../../api/careersApi";

export default function CareersCMS() {

  const [jobs, setJobs] = useState([]);
  const [title_ar, setTitleAr] = useState("");
  const [title_en, setTitleEn] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await getAdminJobs();
    setJobs(res.data);
  };

  const handleCreate = async () => {
    if (!title_ar || !title_en) return;

    await createJob({
      title_ar,
      title_en
    });

    setTitleAr("");
    setTitleEn("");
    load();
  };

  return (
    <div>

      <h2>إدارة الوظائف</h2>

      <input
        value={title_ar}
        onChange={e => setTitleAr(e.target.value)}
        placeholder="اسم الوظيفة (عربي)"
      />

      <input
        value={title_en}
        onChange={e => setTitleEn(e.target.value)}
        placeholder="Job Title (English)"
      />

      <button onClick={handleCreate}>إضافة</button>

      <ul>
        {jobs.map(j => (
          <li key={j.id}>
            {j.title_ar} / {j.title_en}
            <button onClick={() => deleteJob(j.id).then(load)}>حذف</button>
          </li>
        ))}
      </ul>

    </div>
  );
}

