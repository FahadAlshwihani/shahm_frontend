import React, { useEffect, useState } from "react";
import { getPublicBlogPost } from "../../api/publicApi";
import { useParams } from "react-router-dom";

export default function BlogDetails() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    load();
  }, [slug]);

  async function load() {
    const res = await getPublicBlogPost(slug);
    setPost(res.data);
  }

  if (!post) return <p>جاري التحميل...</p>;

  return (
    <div style={{ padding: 20 }}>

      {/* صورة */}
      {post.cover_image_url && (
        <img 
          src={post.cover_image_url}
          alt={post.title_ar}
          style={{ width: "100%", borderRadius: 8 }}
        />
      )}

      <h1>{post.title_ar}</h1>

      <div dangerouslySetInnerHTML={{ __html: post.content_ar }} />
    </div>
  );
}
