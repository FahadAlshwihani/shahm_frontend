import React, { useEffect, useState } from "react";
import { getPublicBlog, getPublicSEO } from "../../api/publicApi";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

export default function Blog() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const res = await getPublicBlog();
    setPosts(res.data || []);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>المدونة</h1>

      {!posts.length && <p>لا يوجد مقالات.</p>}

      {posts.map((post) => (
        <div key={post.id} style={{ borderBottom: "1px solid #eee", marginBottom: 20 }}>
          
          {/* عنوان */}
          <h2>{post.title_ar}</h2>

          {/* صورة */}
          {post.cover_image_url && (
            <img 
              src={post.cover_image_url} 
              alt={post.title_ar}
              style={{ width: "250px", borderRadius: 8 }} 
            />
          )}

          {/* مقتطف */}
          <p>{post.excerpt_ar || post.content_ar?.substring(0, 160) + "..."}</p>

          <Link to={`/blog/${post.slug}`}>اقرأ المزيد</Link>
        </div>
      ))}
    </div>
  );
}
