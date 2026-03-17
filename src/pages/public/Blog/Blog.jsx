import React, { useEffect, useState } from "react";
import { getPublicBlog } from "../../../api/publicApi";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../../../styles/pages/blog.css";
import { getPublicBlogSettings } from "../../../api/publicApi";


export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [type, setType] = useState("news");
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [pageSettings, setPageSettings] = useState(null);


  const { i18n, t } = useTranslation();
  const isEnglish = i18n.language === "en";
  const isRTL = i18n.dir() === "rtl";

  const renderArrows = () => {
    const prevButton = (
      <button
        key="prev"
        className="blog-slider-arrow blog-slider-arrow-left"
        onClick={prevSlide}
        aria-label="Previous"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M20 12H4M10 6L4 12L10 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    );

    const nextButton = (
      <button
        key="next"
        className="blog-slider-arrow blog-slider-arrow-right"
        onClick={nextSlide}
        aria-label="Next"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M4 12H20M14 6L20 12L14 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    );

    // 🔥 هنا السحر
    return isRTL
      ? [nextButton, prevButton]   // بالعربي نعكس ترتيبهم
      : [prevButton, nextButton];  // بالإنجليزي طبيعي
  };

  useEffect(() => {
    fetchPageSettings();
  }, []);

  async function fetchPageSettings() {
    try {
      const res = await getPublicBlogSettings();
      setPageSettings(res.data);
    } catch (err) {
      console.error(err);
    }
  }



  useEffect(() => {
    load(type);
  }, [type, selectedCategory, selectedTag]);

  useEffect(() => {
    document.body.classList.add("blog-page-active");

    return () => {
      document.body.classList.remove("blog-page-active");
    };
  }, []);


  async function load(postType) {
    const res = await getPublicBlog(postType);
    const allPosts = res.data || [];

    setFeaturedPosts(allPosts.slice(0, 6));
    setPosts(allPosts);

    // Extract category names
    const uniqueCategories = [
      ...new Set(
        allPosts
          .map(p => isEnglish ? p.category_data?.name_en : p.category_data?.name_ar)
          .filter(Boolean)
      )
    ];

    const uniqueTags = [
      ...new Set(
        allPosts.flatMap(p =>
          p.tags?.map(tag => isEnglish ? tag.name_en : tag.name_ar) || []
        )
      )
    ];


    setCategories(uniqueCategories);
    setTags(uniqueTags);
  }

  const nextSlide = () => {
    setCurrentSlide(prev =>
      prev === featuredPosts.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide(prev =>
      prev === 0 ? featuredPosts.length - 1 : prev - 1
    );
  };


  const CARD_WIDTH = 440;

  const offset = currentSlide * CARD_WIDTH;
  const translateValue = isRTL ? offset : -offset;



  const filteredPosts = posts.filter((post) => {

    // Filter by category name
    if (selectedCategory) {
      const postCategoryName = isEnglish
        ? post.category_data?.name_en
        : post.category_data?.name_ar;

      if (postCategoryName !== selectedCategory) return false;
    }

    // Filter by tag name
    if (selectedTag) {
      const hasTag = post.tags?.some(tag =>
        (isEnglish ? tag.name_en : tag.name_ar) === selectedTag
      );

      if (!hasTag) return false;
    }

    return true;
  });


  return (
    <div className="blog-page">
      {/* ROW 1: Hero Section with Dark Background */}
      <section className="blog-hero-section">
        <div className="blog-hero-container">
          {/* Page Title */}
          <h1 className="blog-page-title">
            {isEnglish
              ? pageSettings?.page_title_en
              : pageSettings?.page_title_ar}
          </h1>

          {/* Divider */}
          <div className="blog-hero-divider"></div>

          {/* Last Update Section */}
          <div className="blog-last-update-section">
            <h2 className="blog-last-update-title">
              {isEnglish
                ? pageSettings?.last_update_title_en
                : pageSettings?.last_update_title_ar}
            </h2>
            <p className="blog-last-update-description">
              {isEnglish
                ? pageSettings?.last_update_description_en
                : pageSettings?.last_update_description_ar}
            </p>
          </div>

          {/* Progress Bar - ABOVE the slider */}
          <div className="blog-slider-progress-bar">
            <div
              className="blog-slider-progress-fill"
              style={{
                width: featuredPosts.length
                  ? `${((currentSlide + 1) / featuredPosts.length) * 100}%`
                  : "0%"
              }}
            ></div>
          </div>

          {/* Featured Slider Section */}
          <div className="blog-featured-slider-wrapper">
            {/* Navigation Arrows */}
            <div className="blog-slider-navigation">
              {renderArrows()}
            </div>


            {/* Featured Cards Container */}
            <div className="blog-slider-viewport">
              <div
                className="blog-featured-cards-container"
                style={{
                  transform: `translateX(${translateValue}px)`
                }}
              >

                {featuredPosts.map((post, index) => {
                  const tagList = post.tags
                    ?.map(tag => isEnglish ? tag.name_en : tag.name_ar)
                    .join(", ");
                  const title = isEnglish && post.title_en ? post.title_en : post.title_ar;
                  const description =
                    isEnglish && post.excerpt_en
                      ? post.excerpt_en
                      : post.excerpt_ar;
                  const tags = post.tags?.map(t => isEnglish ? t.name_en : t.name_ar).join(", ") || "";
                  const category = isEnglish
                    ? post.category_data?.name_en
                    : post.category_data?.name_ar;


                  const categoryColor = post.category_data?.color || "#C59A5C";
                  const date = new Date(post.created_at).toLocaleDateString(isEnglish ? 'en-US' : 'ar-SA', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  });


                  return (
                    <Link key={post.id} to={`/blog/${post.slug}`} className="blog-card">

                      {post.cover_image_url && (
                        <div className="blog-card-image">
                          <img src={post.cover_image_url} alt={title} />
                        </div>
                      )}

                      <div className="blog-card-content">

                        {tagList && (
                          <p className="blog-card-tags">
                            {tagList}
                          </p>
                        )}

                        <h3 className="blog-card-title">
                          {title}
                        </h3>

                        <div className="blog-card-meta">

                          <div className="blog-card-category-wrapper">
                            <span
                              className="blog-card-category-bar"
                              style={{ backgroundColor: categoryColor }}
                            />
                            <span className="blog-card-category">
                              {category}
                            </span>
                          </div>

                          <span className="blog-card-date">
                            {date}
                          </span>

                        </div>

                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROW 2: Filters */}
      <section className="blog-filters-section">
        <div className="blog-filters-container">
          {/* Type Filter */}
          <select
            className="blog-filter-select"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="news">{t("blog.filter_news")}</option>
            <option value="article">{t("blog.filter_insights")}</option>
          </select>

          {/* Category Filter */}
          <select
            className="blog-filter-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">{t("blog.filter_category")}</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Tags Filter */}
          <select
            className="blog-filter-select"
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
          >
            <option value="">{t("blog.filter_tags")}</option>
            {tags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>
      </section>

      {/* ROW 3: Blog Cards Grid */}
      <section className="blog-cards-section">
        {!filteredPosts.length && (
          <p className="blog-no-posts">{t("blog.no_posts")}</p>
        )}

        <div className="blog-cards-grid">
          {filteredPosts.map((post) => {
            const title = isEnglish && post.title_en ? post.title_en : post.title_ar;

            const description =
              isEnglish && post.excerpt_en
                ? post.excerpt_en
                : post.excerpt_ar;

            const category = isEnglish
              ? post.category_data?.name_en
              : post.category_data?.name_ar;

            const categoryColor = post.category_data?.color || "#C59A5C";

            const tagList = post.tags
              ?.map(tag => isEnglish ? tag.name_en : tag.name_ar)
              .join(", ");


            const date = new Date(post.created_at).toLocaleDateString(
              isEnglish ? "en-US" : "ar-SA",
              {
                year: "numeric",
                month: "short",
                day: "numeric",
              }
            );

            return (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="blog-card"
              >
                {post.cover_image_url && (
                  <div className="blog-card-image">
                    <img src={post.cover_image_url} alt={title} />
                  </div>
                )}

                <div className="blog-card-content">

                  {tagList && (
                    <p className="blog-card-tags">
                      {tagList}
                    </p>
                  )}

                  {/* Small description */}
                  {description && (
                    <p className="blog-card-description">
                      {description}
                    </p>
                  )}


                  {/* Title */}
                  <h3 className="blog-card-title">
                    {title}
                  </h3>

                  {/* Meta */}
                  <div className="blog-card-meta">

                    <div className="blog-card-category-wrapper">
                      <span
                        className="blog-card-category-bar"
                        style={{ backgroundColor: categoryColor }}
                      />
                      <span className="blog-card-category">
                        {category}
                      </span>
                    </div>

                    <span className="blog-card-date">
                      {date}
                    </span>

                  </div>

                </div>
              </Link>
            );
          })}

        </div>
      </section>
    </div>
  );
}