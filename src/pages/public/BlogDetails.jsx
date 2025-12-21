// src/pages/public/BlogDetails.jsx
import React, { useEffect, useState } from "react";
import { getPublicBlogPost } from "../../api/publicApi";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function BlogDetails() {
  const { slug } = useParams();
  const { i18n, t } = useTranslation();
  const isEnglish = i18n.language === "en";

  const [post, setPost] = useState(null);

  useEffect(() => {
    load();
  }, [slug]);

  async function load() {
    const res = await getPublicBlogPost(slug);
    setPost(res.data);
  }

  if (!post) return <p>{t("blog_public.loading")}</p>;

  const title =
    isEnglish && post.title_en ? post.title_en : post.title_ar;

  const content =
    isEnglish && post.content_en ? post.content_en : post.content_ar;

  return (
    <div style={{ padding: 20 }}>
      {/* Cover */}
      {post.cover_image_url && (
        <img
          src={post.cover_image_url}
          alt={title}
          style={{ width: "100%", borderRadius: 8 }}
        />
      )}

      <h1>{title}</h1>

      <div
        dangerouslySetInnerHTML={{
          __html: content || "",
        }}
      />
    </div>
  );
}
