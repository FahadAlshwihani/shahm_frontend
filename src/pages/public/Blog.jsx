// src/pages/public/Blog.jsx
import React, { useEffect, useState } from "react";
import { getPublicBlog, getPublicSEO } from "../../api/publicApi";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [seo, setSEO] = useState(null);

  useEffect(() => {
    load();
    loadSEO();
  }, []);

  async function load() {
    const res = await getPublicBlog();
    setPosts(res.data || []);
  }

  async function loadSEO() {
    const res = await getPublicSEO("blog");
    setSEO(res.data);
  }

  return (
    <div style={{ padding: 20 }}>
      {seo && (
        <Helmet>
          <title>{seo.meta_title}</title>
        </Helmet>
      )}

      <h1>المدونة</h1>

      {!posts.length && <p>لا يوجد مقالات.</p>}

      {posts.map((post) => (
        <div
          key={post.id}
          style={{ borderBottom: "1px solid #eee", marginBottom: 20 }}
        >
          <h2>{post.title_ar}</h2>
          <p>{post.excerpt_ar}</p>
          <Link to={`/blog/${post.slug}`}>اقرأ المزيد</Link>
        </div>
      ))}
    </div>
  );
}
