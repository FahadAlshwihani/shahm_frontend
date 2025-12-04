// src/pages/public/BlogDetails.jsx
import React, { useEffect, useState } from "react";
import { getPublicBlogPost, getPublicSEO } from "../../api/publicApi";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";

export default function BlogDetails() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [seo, setSEO] = useState(null);

  useEffect(() => {
    load();
    loadSEO();
  }, [slug]);

  async function load() {
    const res = await getPublicBlogPost(slug);
    setPost(res.data);
  }

  async function loadSEO() {
    const res = await getPublicSEO(slug);
    setSEO(res.data);
  }

  return (
    <div style={{ padding: 20 }}>
      {seo && (
        <Helmet>
          <title>{seo.meta_title}</title>
        </Helmet>
      )}

      <h1>{post?.title_ar}</h1>

      <div dangerouslySetInnerHTML={{ __html: post?.content_ar }} />
    </div>
  );
}
