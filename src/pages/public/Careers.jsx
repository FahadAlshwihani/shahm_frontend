import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import "../../styles/pages/careers.css";
import axiosClient from "../../api/axiosClient";
import ApplyModal from "./ApplyModal";

// Import or define your images here (replace with actual paths)
const careerHeroImage = "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80";
const applyButtonImage = "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&q=80";

export default function Careers() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === "en";

  const [jobs, setJobs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get("/services/public/careers/jobs/");
      setJobs(res.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  if (loading) {
    return <p>{t("careers.loading")}</p>;
  }

  return (
    <div className="careers-page" dir={isEn ? "ltr" : "rtl"}>
      <Helmet>
        <title>{t("careers.page_title")}</title>
        <meta name="description" content={t("careers.meta_description")} />
      </Helmet>

      {/* ROW 1: Title and Description */}
      <section className="careers-header">
        <h1>{t("careers.title")}</h1>
        <p>{t("careers.description")}</p>
      </section>

      {/* Divider */}
      <div className="careers-header-divider"></div>

      {/* ROW 2: Full Width Image */}
      <section className="careers-hero-image">
        <img
          src={careerHeroImage}
          alt={t("careers.hero_image_alt")}
        />
      </section>

      {/* ROW 3: Benefits Title with Grid/Table in 4 Sections */}
      <section className="careers-benefits">
        <h2>{t("careers.benefits_title")}</h2>

        <div className="benefits-container">
          {/* First Row */}
          <div className="benefits-row">
            {/* Column 1 */}
            <div className="benefit-col">
              <div className="benefit-divider"></div>
              <div className="benefit-item">
                <span className="benefit-number">{t("careers.benefit_1_number")}</span>
                <p>{t("careers.benefit_1_text")}</p>
              </div>
            </div>

            {/* Column 2 */}
            <div className="benefit-col">
              <div className="benefit-divider"></div>
              <div className="benefit-item">
                <span className="benefit-number">{t("careers.benefit_2_number")}</span>
                <p>{t("careers.benefit_2_text")}</p>
              </div>
            </div>
          </div>

          {/* Second Row */}
          <div className="benefits-row">
            {/* Column 3 */}
            <div className="benefit-col">
              <div className="benefit-divider"></div>
              <div className="benefit-item">
                <span className="benefit-number">{t("careers.benefit_3_number")}</span>
                <p>{t("careers.benefit_3_text")}</p>
              </div>
            </div>

            {/* Column 4 */}
            <div className="benefit-col">
              <div className="benefit-divider"></div>
              <div className="benefit-item">
                <span className="benefit-number">{t("careers.benefit_4_number")}</span>
                <p>{t("careers.benefit_4_text")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROW 4: Picture with Title and Text Button */}
      <section className="careers-apply-section">
        <div className="apply-image-container">
          <img
            src={applyButtonImage}
            alt={t("careers.apply_image_alt")}
            className="apply-image"
          />
        </div>
        <h3 className="apply-section-title">{t("careers.apply_section_title")}</h3>
        <button
          className="apply-text-link"
          onClick={() => setShowModal(true)}
        >
          {t("careers.send_cv")}
        </button>
      </section>

      {/* Apply Modal */}
      {showModal && (
        <ApplyModal onClose={closeModal} isEn={isEn} jobs={jobs} />
      )}
    </div>
  );
}