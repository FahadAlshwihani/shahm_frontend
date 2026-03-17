import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { submitServiceAdvisory } from "../../../api/serviceAdvisoryApi";
import { getPublicServices } from "../../../api/publicApi";
import toast from "react-hot-toast";
import LogoImage from "../../../assets/images/logo.png"; // Adjust path as needed
import "../../../styles/pages/ServiceRequestModal.css";
import { getPublicSettings } from "../../../api/publicApi";

export default function ServiceRequestModal({
  isOpen,
  onClose,
  preSelectedService = null,
  openAppointmentModal
}) {
  const { i18n, t } = useTranslation();
  const isEn = i18n.language === "en";
  const isRTL = i18n.dir() === "rtl";
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [areas, setAreas] = useState([]);
  const [showThankYou, setShowThankYou] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const [expandedOverviews, setExpandedOverviews] = useState({});
  const [settings, setSettings] = useState(null);

  const [form, setForm] = useState({
    title: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    message: "",
    attachment: null,
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [voiceNote, setVoiceNote] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [openDropdowns, setOpenDropdowns] = useState({});

  const MAX_MESSAGE_LENGTH = 450;

  useEffect(() => {
    async function loadServices() {
      try {
        const res = await getPublicServices();
        const allServices = res.data || [];
        setServices(allServices);

        // Extract unique areas from services
        const uniqueAreas = [];
        const areaMap = new Map();

        allServices.forEach(service => {
          if (service.area_data && !areaMap.has(service.area_data.id)) {
            areaMap.set(service.area_data.id, {
              id: service.area_data.id,
              name_en: service.area_data.name_en,
              name_ar: service.area_data.name_ar,
            });
          }
        });


        setAreas(Array.from(areaMap.values()));


        // Add pre-selected service if provided
        if (preSelectedService) {
          const today = new Date();
          const gregorianDate = today.toLocaleDateString('en-CA'); // YYYY-MM-DD
          const hijriDate = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          }).format(today);

          setSelectedServices([{
            id: Date.now(),
            service_type: preSelectedService.area_data?.name_en || preSelectedService.area_data?.name_ar,
            service_type_ar: preSelectedService.area_data?.name_ar,
            service_type_en: preSelectedService.area_data?.name_en,
            main_category: isEn ? preSelectedService.title_en : preSelectedService.title_ar,
            main_category_en: preSelectedService.title_en,
            main_category_ar: preSelectedService.title_ar,
            service_id: preSelectedService.id,
            overview: isEn ? preSelectedService.description_en : preSelectedService.description_ar,
            overview_en: preSelectedService.description_en,
            overview_ar: preSelectedService.description_ar,
            reference_id: preSelectedService.serial_number,
            gregorian_date: gregorianDate,
            hijri_date: hijriDate,
            is_priced: preSelectedService.is_priced,
            price: preSelectedService.price
          }]);
        }
      } catch (e) {
        console.error(e);
      }
    }

    if (isOpen) {
      loadServices();
    }
  }, [isOpen, preSelectedService, isEn]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "message") {
      if (value.length <= MAX_MESSAGE_LENGTH) {
        setForm({ ...form, [name]: value });
      }
    } else {
      setForm({ ...form, [name]: files ? files[0] : value });
    }

    // Validate field
    if (!files) {
      validateField(name, value);
    }
  };

  const validateField = (name, value) => {
    let error = "";

    if (name === "first_name" && !value) {
      error = t("serviceRequest.first_name_required");
    }

    if (name === "last_name" && !value) {
      error = t("serviceRequest.last_name_required");
    }

    if (name === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        error = t("serviceRequest.invalid_email");
      }
    }

    if (name === "phone" && value) {
      const phoneDigits = value.replace(/\D/g, '');
      if (phoneDigits.length < 9 || phoneDigits.length > 15) {
        error = t("serviceRequest.invalid_phone");
      }
    }

    setFieldErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const isFieldValid = (name) => {
    return form[name] && !fieldErrors[name];
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      setForm({ ...form, attachment: file });
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setForm({ ...form, attachment: null });
  };

  const handleVoiceUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVoiceNote(file);
    }
  };

  const handleRemoveVoice = () => {
    setVoiceNote(null);
  };

  const toggleDropdown = (key) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const closeAllDropdowns = () => {
    setOpenDropdowns({});
  };

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await getPublicSettings();
        setSettings(res.data);
      } catch (err) {
        console.error("Failed to load settings", err);
      }
    }

    if (isOpen) {
      loadSettings();
    }
  }, [isOpen]);


  const handleAddService = () => {
    const today = new Date();
    const gregorianDate = today.toLocaleDateString('en-CA');
    const hijriDate = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(today);


    setSelectedServices([...selectedServices, {
      id: Date.now(),
      area_id: null,
      service_type: "",
      main_category: "",
      service_id: null,
      overview: "",
      reference_id: "",
      gregorian_date: gregorianDate,
      hijri_date: hijriDate,
      is_priced: false,
      price: null
    }]);
  };

  useEffect(() => {
    if (isOpen && selectedServices.length === 0) {
      handleAddService()
    }
  }, [isOpen])

  const handleServiceChange = (serviceIndex, field, value) => {
    const updated = [...selectedServices];

    updated[serviceIndex][field] = value;

    // USER SELECTED CATEGORY
    if (field === "area_id") {

      const selectedArea = areas.find(a => a.id === Number(value));

      updated[serviceIndex] = {
        ...updated[serviceIndex],

        area_id: value,

        service_type_en: selectedArea?.name_en || "",
        service_type_ar: selectedArea?.name_ar || "",
        service_type: isEn ? selectedArea?.name_en : selectedArea?.name_ar,

        // reset selected service
        service_id: null,
        main_category: "",
        main_category_en: "",
        main_category_ar: "",

        overview: "",
        reference_id: "",
        is_priced: false,
        price: null
      };
    }

    // USER SELECTED SERVICE
    if (field === "service_id") {

      const selected = services.find(s => s.id === Number(value));

      if (selected) {

        updated[serviceIndex] = {
          ...updated[serviceIndex],

          service_id: value,

          // AUTO SET CATEGORY
          area_id: selected.area_data?.id,

          service_type_en: selected.area_data?.name_en,
          service_type_ar: selected.area_data?.name_ar,
          service_type: isEn
            ? selected.area_data?.name_en
            : selected.area_data?.name_ar,

          main_category_en: selected.title_en,
          main_category_ar: selected.title_ar,
          main_category: isEn
            ? selected.title_en
            : selected.title_ar,

          overview_en: selected.description_en,
          overview_ar: selected.description_ar,
          overview: isEn
            ? selected.description_en
            : selected.description_ar,

          reference_id: selected.serial_number,

          is_priced: selected.is_priced,
          price: selected.price
        };
      }
    }

    setSelectedServices(updated);
  };

  // Get filtered services based on selected category
  const getFilteredServices = (service) => {
    if (!service.area_id) {
      return services; // Show all if no category selected
    }
    return services.filter(s => s.area_data?.id === Number(service.area_id));
  };

  // Get filtered categories based on selected service
  const getFilteredAreas = (service) => {
    if (!service.service_id) {
      return areas; // Show all if no service selected
    }
    const selectedService = services.find(s => s.id === Number(service.service_id));
    if (selectedService && selectedService.area_data) {
      return areas.filter(a => a.id === selectedService.area_data.id);
    }
    return areas;
  };

  const toggleOverview = (serviceId) => {
    setExpandedOverviews(prev => ({
      ...prev,
      [serviceId]: !prev[serviceId]
    }));
  };

  const handleDeleteService = (index) => {
    if (selectedServices.length > 1) {
      const updated = selectedServices.filter((_, i) => i !== index);
      setSelectedServices(updated);
    }
  };

  const isFormValid = () => {
    return (
      form.title &&
      form.first_name &&
      form.last_name &&
      form.email &&
      form.phone &&
      form.message &&
      selectedServices.length > 0 &&
      selectedServices.every(s => s.service_id)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      toast.error(t("serviceRequest.fill_required"));
      return;
    }

    // Check if any service is priced
    const pricedService = selectedServices.find(s => s.is_priced);

    if (pricedService) {
      const payload = {
        ...form,
        services: selectedServices,
        total_price: selectedServices.reduce((sum, s) => sum + (s.price || 0), 0)
      };

      localStorage.setItem("payment_payload", JSON.stringify(payload));
      navigate("/payment", { state: payload });
      onClose();
      return;
    }

    // =============================
    // FORM DATA
    // =============================

    const data = new FormData();

    Object.entries(form).forEach(([key, val]) => {
      if (val) data.append(key, val);
    });

    // voice note
    if (voiceNote) {
      data.append("voice_note", voiceNote);
    }

    // multiple services
    selectedServices.forEach((s) => {
      if (s.service_id) {
        data.append("service_ids", s.service_id);
      }
    });

    try {
      await submitServiceAdvisory(data);
      setShowThankYou(true);
    } catch (err) {
      console.error(err?.response?.data);
      toast.error(t("serviceRequest.submission_failed"));
    }
  };

  const handleClose = () => {
    setShowThankYou(false);
    setForm({
      title: "",
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      message: "",
      attachment: null,
    });
    setSelectedServices([]);
    onClose();
  };

  const remainingChars = MAX_MESSAGE_LENGTH - form.message.length;

  if (!isOpen) return null;

  // Thank You Screen
  if (showThankYou) {
    return (
      <div className="srm-overlay" onClick={handleClose}>
        <div className="srm-container srm-thankyou" onClick={(e) => e.stopPropagation()}>
          <div className="srm-thankyou-logo">
            <img src={LogoImage} alt="Logo" />
          </div>

          <h2 className="srm-thankyou-title">
            {t("serviceRequest.thank_you_title")}
          </h2>

          <p className="srm-thankyou-message">
            {t("serviceRequest.thank_you_message")}
          </p>

          <button onClick={handleClose} className="srm-thankyou-button">
            {t("serviceRequest.home_button")}
          </button>
        </div>
      </div>
    );
  }

  const whatsappLink = settings?.whatsapp_number
    ? `https://wa.me/${settings.whatsapp_number}`
    : "#";

  // Main Form Modal
  return (
    <div className="srm-overlay" onClick={handleClose}>
      <div className="srm-container" onClick={(e) => e.stopPropagation()} dir={isRTL ? "rtl" : "ltr"}>

        {/* Row 1: Logo + Close Button */}
        <div className="srm-header">
          <img src={LogoImage} alt="Logo" className="srm-logo" />
          <button onClick={handleClose} className="srm-close-button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Divider */}
        <div className="srm-divider"></div>

        {/* Terms Section */}
        <div className="srm-terms">
          <h3 className="srm-terms-title">{t("serviceRequest.terms_title")}</h3>
          <p className="srm-terms-description">
            {t("serviceRequest.terms_description_part1")}{" "}
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="srm-terms-link"
            >
              {t("serviceRequest.whatsapp")}
            </a>{" "}
            {t("serviceRequest.terms_description_part2")}{" "}
            <span
              className="srm-terms-link"
              onClick={() => {
                onClose();
                if (typeof openAppointmentModal === "function") {
                  setTimeout(() => openAppointmentModal(), 150);
                }
              }}
            >
              {t("serviceRequest.book_appointment")}
            </span>
            {" "}
            {t("serviceRequest.terms_description_part3")}
          </p>
        </div>

        {/* Divider */}
        <div className="srm-divider"></div>

        {/* Form Content */}
        <div className="srm-content">
          <form onSubmit={handleSubmit}>

            {/* Your Legal Request Section */}
            <div className="srm-section">
              <h3 className="srm-section-title">{t("serviceRequest.legal_request_title")}</h3>
              <p className="srm-section-subtitle">{t("serviceRequest.required_fields")}</p>

              {/* Selected Services */}
              <div className="srm-services-list">
                {selectedServices.map((service, index) => (
                  <div key={service.id} className="srm-service-item">

                    {/* Delete Button - Only show if more than 1 service */}
                    {selectedServices.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDeleteService(index)}
                        className="srm-delete-service"
                        aria-label="Delete service"
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    )}

                    {/* ROW 1: Service Type + Main Category */}
                    <div className="srm-service-row-1">

                      <div>
                        <p className="srm-service-field-label">{t("serviceRequest.service_type")}</p>

                        <div className="srm-custom-select" onClick={() => toggleDropdown(`service_${index}`)}>

                          <div className="srm-custom-select-trigger">
                            <span className={!service.service_id ? "placeholder" : ""}>
                              {service.service_id
                                ? (isEn
                                  ? services.find(s => s.id === Number(service.service_id))?.title_en
                                  : services.find(s => s.id === Number(service.service_id))?.title_ar)
                                : t("serviceRequest.select_service")}
                            </span>

                            <svg width="12" height="8" viewBox="0 0 12 8" fill="none"
                              className={`srm-dropdown-arrow ${openDropdowns[`service_${index}`] ? "open" : ""}`}>
                              <path d="M1 1.5L6 6.5L11 1.5"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>

                          {openDropdowns[`service_${index}`] && (
                            <div className="srm-custom-select-dropdown">

                              <div
                                className="srm-custom-select-option"
                                onClick={() => {
                                  handleServiceChange(index, "service_id", "");
                                  closeAllDropdowns();
                                }}
                              >
                                {t("serviceRequest.select_service")}
                              </div>

                              {getFilteredServices(service).map(s => (
                                <div
                                  key={s.id}
                                  className="srm-custom-select-option"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleServiceChange(index, "service_id", s.id);
                                    closeAllDropdowns();
                                  }}
                                >
                                  {isEn ? s.title_en : s.title_ar}
                                </div>
                              ))}

                            </div>
                          )}

                        </div>
                      </div>

                      {/* Main Category Custom Dropdown - Shows SPECIFIC SERVICE */}
                      {/* Main Category - Auto Filled */}
                      <div>
                        <p className="srm-service-field-label">
                          {t("serviceRequest.main_category")}
                        </p>

                        <div className="srm-category-display">
                          {service.service_id
                            ? (isEn
                              ? services.find(s => s.id === Number(service.service_id))?.area_data?.name_en
                              : services.find(s => s.id === Number(service.service_id))?.area_data?.name_ar)
                            : "-"
                          }
                        </div>
                      </div>
                    </div>

                    {/* ROW 2: Overview + Details Grid */}
                    <div className="srm-service-row-2">
                      {/* Overview Column */}
                      <div className="srm-overview-col">
                        <h4 className="srm-overview-title">{t("serviceRequest.service_overview")}</h4>
                        <p className={`srm-overview-content ${expandedOverviews[service.id] ? 'expanded' : ''}`}>
                          {service.overview}
                        </p>
                        {service.overview && service.overview.length > 150 && (
                          <button
                            type="button"
                            className="srm-see-more-btn"
                            onClick={() => toggleOverview(service.id)}
                          >
                            {expandedOverviews[service.id]
                              ? t("serviceRequest.see_less")
                              : t("serviceRequest.see_more")}
                          </button>
                        )}
                      </div>

                      {/* Details Grid */}
                      <div className="srm-details-grid">
                        <div className="srm-detail-item">
                          <p className="srm-detail-label">{t("serviceRequest.reference_id")}</p>
                          <p className="srm-detail-value">{service.reference_id}</p>
                        </div>

                        <div className="srm-detail-item">
                          <p className="srm-detail-label">{t("serviceRequest.gregorian_date")}</p>
                          <p className="srm-detail-value">{service.gregorian_date}</p>
                        </div>

                        <div className="srm-detail-item">
                          <p className="srm-detail-label">{t("serviceRequest.hijri_date")}</p>
                          <p className="srm-detail-value">{service.hijri_date}</p>
                        </div>
                      </div>
                    </div>

                  </div>
                ))}
              </div>

              {/* Add Another Service Button */}
              <button type="button" onClick={handleAddService} className="srm-add-service">
                <div className="srm-add-service-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span>{t("serviceRequest.add_another_service")}</span>
              </button>
            </div>

            {/* Divider */}
            <div className="srm-divider"></div>

            {/* Your Information Section */}
            <div className="srm-section">
              <h3 className="srm-section-title">{t("serviceRequest.your_information")}</h3>

              <div className="srm-form-row">
                <div className="srm-form-field">
                  <label>{t("serviceRequest.title")}</label>
                  <div className="srm-custom-select" onClick={() => toggleDropdown('title')}>
                    <div className="srm-custom-select-trigger">
                      <span className={!form.title ? 'placeholder' : ''}>
                        {form.title
                          ? (form.title === 'mr' ? t("serviceRequest.mr") :
                            form.title === 'mrs' ? t("serviceRequest.mrs") :
                              t("serviceRequest.ms"))
                          : t("serviceRequest.select_title")
                        }
                      </span>
                      <svg width="12" height="8" viewBox="0 0 12 8" fill="none" className={`srm-dropdown-arrow ${openDropdowns['title'] ? 'open' : ''}`}>
                        <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    {openDropdowns['title'] && (
                      <div className="srm-custom-select-dropdown">
                        <div
                          className="srm-custom-select-option"
                          onClick={() => {
                            setForm({ ...form, title: '' });
                            closeAllDropdowns();
                          }}
                        >
                          {t("serviceRequest.select_title")}
                        </div>
                        <div
                          className="srm-custom-select-option"
                          onClick={() => {
                            setForm({ ...form, title: 'mr' });
                            closeAllDropdowns();
                          }}
                        >
                          {t("serviceRequest.mr")}
                        </div>
                        <div
                          className="srm-custom-select-option"
                          onClick={() => {
                            setForm({ ...form, title: 'mrs' });
                            closeAllDropdowns();
                          }}
                        >
                          {t("serviceRequest.mrs")}
                        </div>
                        <div
                          className="srm-custom-select-option"
                          onClick={() => {
                            setForm({ ...form, title: 'ms' });
                            closeAllDropdowns();
                          }}
                        >
                          {t("serviceRequest.ms")}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Empty div to maintain grid structure */}
                <div></div>
              </div>

              <div className="srm-form-row">
                <div className="srm-form-field">
                  <label>{t("serviceRequest.first_name")}</label>
                  <div className="srm-input-wrapper">
                    <input
                      type="text"
                      name="first_name"
                      value={form.first_name}
                      onChange={handleChange}
                      required
                    />
                    {isFieldValid("first_name") && (
                      <div className="srm-validation-icon valid">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M16.6667 5L7.5 14.1667L3.33334 10" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    )}
                  </div>
                  {fieldErrors.first_name && (
                    <p className="srm-field-error">{fieldErrors.first_name}</p>
                  )}
                </div>

                <div className="srm-form-field">
                  <label>{t("serviceRequest.last_name")}</label>
                  <div className="srm-input-wrapper">
                    <input
                      type="text"
                      name="last_name"
                      value={form.last_name}
                      onChange={handleChange}
                      required
                    />
                    {isFieldValid("last_name") && (
                      <div className="srm-validation-icon valid">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M16.6667 5L7.5 14.1667L3.33334 10" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    )}
                  </div>
                  {fieldErrors.last_name && (
                    <p className="srm-field-error">{fieldErrors.last_name}</p>
                  )}
                </div>
              </div>

              <div className="srm-form-row">
                <div className="srm-form-field">
                  <label>{t("serviceRequest.contact_number")}</label>
                  <div className="srm-input-wrapper">
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      required
                    />
                    {isFieldValid("phone") && (
                      <div className="srm-validation-icon valid">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M16.6667 5L7.5 14.1667L3.33334 10" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    )}
                  </div>
                  {fieldErrors.phone && (
                    <p className="srm-field-error">{fieldErrors.phone}</p>
                  )}
                </div>

                <div className="srm-form-field">
                  <label>{t("serviceRequest.email_address")}</label>
                  <div className="srm-input-wrapper">
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                    {isFieldValid("email") && (
                      <div className="srm-validation-icon valid">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M16.6667 5L7.5 14.1667L3.33334 10" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    )}
                  </div>
                  {fieldErrors.email && (
                    <p className="srm-field-error">{fieldErrors.email}</p>
                  )}
                </div>
              </div>

              <div className="srm-form-row">
                <div className="srm-form-field">
                  <label>{t("serviceRequest.your_message")}</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows="4"
                    maxLength={MAX_MESSAGE_LENGTH}
                    required
                  />
                  <p className="srm-char-counter">
                    {t("serviceRequest.characters_remaining", { count: remainingChars })}
                  </p>
                </div>
              </div>

              {/* Submit Row - Button + Upload Icons */}
              <div className="srm-submit-row">
                <button
                  type="submit"
                  className={`srm-submit-button ${isFormValid() ? 'active' : ''}`}
                  disabled={!isFormValid()}
                >
                  {t("serviceRequest.submit")}
                </button>

                <div className="srm-upload-icons">
                  {/* Voice Note Upload */}
                  <div className="srm-upload-icon-wrapper">
                    <label className="srm-upload-icon-button">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M12 1C10.3431 1 9 2.34315 9 4V12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12V4C15 2.34315 13.6569 1 12 1Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M19 10V12C19 15.866 15.866 19 12 19C8.13401 19 5 15.866 5 12V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 19V23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M8 23H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={handleVoiceUpload}
                      />
                    </label>
                    {voiceNote && (
                      <div className="srm-upload-remove" onClick={handleRemoveVoice}>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M9 3L3 9M3 3L9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </div>
                    )}
                    {voiceNote && !voiceNote.removed && (
                      <div className="srm-upload-preview">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* File Upload */}
                  <div className="srm-upload-icon-wrapper">
                    <label className="srm-upload-icon-button">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M21.44 11.05L12.25 20.24C11.1242 21.3658 9.59723 21.9983 8.005 21.9983C6.41277 21.9983 4.88581 21.3658 3.76 20.24C2.63419 19.1142 2.00166 17.5872 2.00166 15.995C2.00166 14.4028 2.63419 12.8758 3.76 11.75L12.33 3.18C13.0806 2.42944 14.0999 2.00667 15.1625 2.00667C16.2251 2.00667 17.2444 2.42944 17.995 3.18C18.7456 3.93056 19.1684 4.94989 19.1684 6.0125C19.1684 7.07511 18.7456 8.09444 17.995 8.845L9.41 17.41C9.03472 17.7853 8.52513 17.9967 7.995 17.9967C7.46487 17.9967 6.95528 17.7853 6.58 17.41C6.20472 17.0347 5.99335 16.5251 5.99335 15.995C5.99335 15.4649 6.20472 14.9553 6.58 14.58L14.07 7.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <input
                        type="file"
                        onChange={handleFileUpload}
                      />
                    </label>
                    {uploadedFile && (
                      <div className="srm-upload-remove" onClick={handleRemoveFile}>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M9 3L3 9M3 3L9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </div>
                    )}
                    {uploadedFile && !uploadedFile.removed && (
                      <div className="srm-upload-preview">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Policy Text - Below Submit Row */}
              <div className="srm-policy-text">
                {t("serviceRequest.policy_text_part1")}{" "}
                <span className="srm-policy-link">{t("serviceRequest.data_policy")}</span>{" "}
                {t("serviceRequest.policy_text_part2")}{" "}
                <span className="srm-policy-link">{t("serviceRequest.legal_policy")}</span>,{" "}
                {t("serviceRequest.policy_text_part3")}
              </div>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}