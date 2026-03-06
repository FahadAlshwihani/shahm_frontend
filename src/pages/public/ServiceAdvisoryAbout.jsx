import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { submitServiceAdvisory } from "../../api/serviceAdvisoryApi";
import { getPublicServices } from "../../api/publicApi";
import toast from "react-hot-toast";
import LogoImage from "../../assets/images/logo.png"; // Adjust path as needed
import "../../styles/pages/ServiceRequestModal.css";

export default function ServiceRequestModal({
    isOpen,
    onClose,
    preSelectedService = null
}) {
    const { i18n, t } = useTranslation();
    const isEn = i18n.language === "en";
    const isRTL = i18n.dir() === "rtl";
    const navigate = useNavigate();

    const [services, setServices] = useState([]);
    const [areas, setAreas] = useState([]);
    const [showThankYou, setShowThankYou] = useState(false);
    const [selectedServices, setSelectedServices] = useState([]);

    const [form, setForm] = useState({
        title: "",
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        message: "",
        attachment: null,
    });

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

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "message") {
            if (value.length <= MAX_MESSAGE_LENGTH) {
                setForm({ ...form, [name]: value });
            }
        } else {
            setForm({ ...form, [name]: files ? files[0] : value });
        }
    };

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

    const handleServiceChange = (serviceIndex, field, value) => {
        const updated = [...selectedServices];
        updated[serviceIndex][field] = value;

        // If category (area_id) changed, update category info
        if (field === "area_id") {
            const selectedArea = areas.find(a => a.id === Number(value));
            if (selectedArea) {
                updated[serviceIndex] = {
                    ...updated[serviceIndex],
                    area_id: value,
                    service_type_en: selectedArea.name_en,
                    service_type_ar: selectedArea.name_ar,
                    service_type: isEn ? selectedArea.name_en : selectedArea.name_ar,
                    // Reset service when category changes
                    service_id: null,
                    main_category: "",
                    main_category_en: "",
                    main_category_ar: "",
                    overview: "",
                    overview_en: "",
                    overview_ar: "",
                    reference_id: "",
                    is_priced: false,
                    price: null
                };
            }
        }

        // If service_id changed, update all related fields
        if (field === "service_id") {
            const selected = services.find(s => s.id === Number(value));
            if (selected) {
                updated[serviceIndex] = {
                    ...updated[serviceIndex],
                    service_id: value,
                    area_id: selected.area_data?.id,
                    service_type_en: selected.area_data?.name_en,
                    service_type_ar: selected.area_data?.name_ar,
                    service_type: isEn ? selected.area_data?.name_en : selected.area_data?.name_ar,
                    main_category_en: selected.title_en,
                    main_category_ar: selected.title_ar,
                    main_category: isEn ? selected.title_en : selected.title_ar,
                    overview_en: selected.description_en,
                    overview_ar: selected.description_ar,
                    overview: isEn ? selected.description_en : selected.description_ar,
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
            // Navigate to payment with all data
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

        // No priced services - submit directly
        const data = new FormData();
        Object.entries(form).forEach(([key, val]) => {
            if (val) data.append(key, val);
        });

        // Add primary service
        if (selectedServices[0]?.service_id) {
            data.append("service_id", selectedServices[0].service_id);
        }

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
                        <span className="srm-terms-link">{t("serviceRequest.whatsapp")}</span>{" "}
                        {t("serviceRequest.terms_description_part2")}{" "}
                        <span className="srm-terms-link">{t("serviceRequest.book_appointment")}</span>{" "}
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
                                        <div className="srm-service-row">
                                            <div className="srm-service-field">
                                                <label>{t("serviceRequest.service_type")}</label>
                                                <select
                                                    value={service.area_id || ""}
                                                    onChange={(e) => handleServiceChange(index, "area_id", e.target.value)}
                                                >
                                                    <option value="">{t("serviceRequest.select_category")}</option>
                                                    {getFilteredAreas(service).map(area => (
                                                        <option key={area.id} value={area.id}>
                                                            {isEn ? area.name_en : area.name_ar}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="srm-service-field">
                                                <label>{t("serviceRequest.main_category")}</label>
                                                <select
                                                    value={service.service_id || ""}
                                                    onChange={(e) => handleServiceChange(index, "service_id", e.target.value)}
                                                >
                                                    <option value="">{t("serviceRequest.select_service")}</option>
                                                    {getFilteredServices(service).map(s => (
                                                        <option key={s.id} value={s.id}>
                                                            {isEn ? s.title_en : s.title_ar}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="srm-service-row">
                                            <div className="srm-service-field">
                                                <label>{t("serviceRequest.service_overview")}</label>
                                                <textarea
                                                    value={service.overview}
                                                    disabled
                                                    rows="2"
                                                />
                                            </div>
                                        </div>

                                        <div className="srm-service-row">
                                            <div className="srm-service-field">
                                                <label>{t("serviceRequest.reference_id")}</label>
                                                <input
                                                    type="text"
                                                    value={service.reference_id}
                                                    disabled
                                                />
                                            </div>

                                            <div className="srm-service-field">
                                                <label>{t("serviceRequest.gregorian_date")}</label>
                                                <input
                                                    type="text"
                                                    value={service.gregorian_date}
                                                    disabled
                                                />
                                            </div>

                                            <div className="srm-service-field">
                                                <label>{t("serviceRequest.hijri_date")}</label>
                                                <input
                                                    type="text"
                                                    value={service.hijri_date}
                                                    disabled
                                                />
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

                        {/* Your Information Section */}
                        <div className="srm-section">
                            <h3 className="srm-section-title">{t("serviceRequest.your_information")}</h3>

                            <div className="srm-form-row">
                                <div className="srm-form-field">
                                    <label>{t("serviceRequest.title")}</label>
                                    <select name="title" value={form.title} onChange={handleChange} required>
                                        <option value="">{t("serviceRequest.select_title")}</option>
                                        <option value="mr">{t("serviceRequest.mr")}</option>
                                        <option value="mrs">{t("serviceRequest.mrs")}</option>
                                        <option value="ms">{t("serviceRequest.ms")}</option>
                                    </select>
                                </div>
                            </div>

                            <div className="srm-form-row">
                                <div className="srm-form-field">
                                    <label>{t("serviceRequest.first_name")}</label>
                                    <input
                                        type="text"
                                        name="first_name"
                                        value={form.first_name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="srm-form-field">
                                    <label>{t("serviceRequest.last_name")}</label>
                                    <input
                                        type="text"
                                        name="last_name"
                                        value={form.last_name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="srm-form-row">
                                <div className="srm-form-field">
                                    <label>{t("serviceRequest.contact_number")}</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="srm-form-field">
                                    <label>{t("serviceRequest.email_address")}</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        required
                                    />
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

                            <div className="srm-policy-text">
                                {t("serviceRequest.policy_text_part1")}{" "}
                                <span className="srm-policy-link">{t("serviceRequest.data_policy")}</span>{" "}
                                {t("serviceRequest.policy_text_part2")}{" "}
                                <span className="srm-policy-link">{t("serviceRequest.legal_policy")}</span>,{" "}
                                {t("serviceRequest.policy_text_part3")}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className={`srm-submit-button ${!isFormValid() ? 'disabled' : ''}`}
                            disabled={!isFormValid()}
                        >
                            {t("serviceRequest.submit")}
                        </button>

                    </form>
                </div>

            </div>
        </div>
    );
}