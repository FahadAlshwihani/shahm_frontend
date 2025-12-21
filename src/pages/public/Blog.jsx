// src/pages/public/Blog.jsx
import React, { useEffect, useState } from "react";
import { getPublicBlog } from "../../api/publicApi";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const { i18n, t } = useTranslation();
  const isEnglish = i18n.language === "en";

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const res = await getPublicBlog();
    setPosts(res.data || []);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>{t("blog_public.title")}</h1>

      {!posts.length && <p>{t("blog_public.no_posts")}</p>}

      {posts.map((post) => {
        const title =
          isEnglish && post.title_en ? post.title_en : post.title_ar;

        const excerpt =
          isEnglish && post.excerpt_en
            ? post.excerpt_en
            : post.excerpt_ar ||
              (isEnglish
                ? post.content_en?.substring(0, 160)
                : post.content_ar?.substring(0, 160)) + "...";

        return (
          <div
            key={post.id}
            style={{
              borderBottom: "1px solid #eee",
              marginBottom: 20,
              paddingBottom: 20,
            }}
          >
            {/* Title */}
            <h2>{title}</h2>

            {/* Image */}
            {post.cover_image_url && (
              <img
                src={post.cover_image_url}
                alt={title}
                style={{ width: "250px", borderRadius: 8 }}
              />
            )}

            {/* Excerpt */}
            <p>{excerpt}</p>

            <Link to={`/blog/${post.slug}`}>
              {t("blog_public.read_more")}
            </Link>
          </div>
        );
      })}
    </div>
  );
}
