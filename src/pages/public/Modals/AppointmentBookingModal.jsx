import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

import {
    getAppointmentPage,
    getAvailableSlots,
    bookAppointment,
    getAppointmentSettings
} from "../../../api/appointmentsApi";

import { getPublicSettings } from "../../../api/publicApi";


import LogoImage from "../../../assets/images/logo.png";
import "../../../styles/pages/ServiceRequestModal.css";

export default function AppointmentBookingModal({
    isOpen,
    onClose,
    openServiceModal,
}) {
    const { i18n, t } = useTranslation();
    const isEn = i18n.language === "en";
    const isRTL = i18n.dir() === "rtl";

    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState({});
    const [settings, setSettings] = useState({});
    const [slots, setSlots] = useState([]);

    const [showThankYou, setShowThankYou] = useState(false);

    const [selectedSlot, setSelectedSlot] = useState("");
    const [appointmentType, setAppointmentType] = useState("in_person");
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedSession, setSelectedSession] = useState("");
    const [visitors, setVisitors] = useState(1);

    const [attachment, setAttachment] = useState(null);
    const [voiceNote, setVoiceNote] = useState(null);

    const [form, setForm] = useState({
        title: "",
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        message: "",
    });

    const [fieldErrors, setFieldErrors] = useState({});
    const [openDropdowns, setOpenDropdowns] = useState({});
    const [showFullIntro, setShowFullIntro] = useState(true);

    const MAX_MESSAGE_LENGTH = 450;

    // Scroll lock
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

    useEffect(() => {
        if (!isOpen) return;

        async function load() {
            try {
                setLoading(true);

                const [pageRes, appointmentSettingsRes, publicSettingsRes, slotsRes] = await Promise.all([
                    getAppointmentPage(),
                    getAppointmentSettings(),
                    getPublicSettings(),
                    getAvailableSlots(),
                ]);

                const pageData = pageRes.data || {};
                const appointmentSettingsData = appointmentSettingsRes.data || {};
                const publicSettingsData = publicSettingsRes.data || {};
                const slotsData = Array.isArray(slotsRes.data) ? slotsRes.data : [];

                setPage(pageData);
                setSettings({
                    ...appointmentSettingsData,
                    whatsapp_number: publicSettingsData?.whatsapp_number || "",
                });
                setSlots(slotsData);

                if (slotsData.length > 0) {
                    const firstDate = slotsData[0]?.date || "";
                    setSelectedDate(firstDate);
                    setSelectedSession("morning");
                } else {
                    setSelectedDate("");
                    setSelectedSession("morning");
                }

            } catch (err) {
                console.error(err);
                toast.error(t("appointment.load_failed"));
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [isOpen, t]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "message" && value.length > MAX_MESSAGE_LENGTH) return;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Validate field
        validateField(name, value);
    };

    const validateField = (name, value) => {
        let error = "";

        if (name === "first_name" && !value) {
            error = t("appointment.first_name_required");
        }

        if (name === "last_name" && !value) {
            error = t("appointment.last_name_required");
        }

        if (name === "email" && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                error = t("appointment.invalid_email");
            }
        }

        if (name === "phone" && value) {
            const phoneDigits = value.replace(/\D/g, '');
            if (phoneDigits.length < 9 || phoneDigits.length > 15) {
                error = t("appointment.invalid_phone");
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

    const toggleDropdown = (key) => {
        setOpenDropdowns(prev => ({
            [key]: !prev[key]
        }));
    };

    const closeAllDropdowns = () => {
        setOpenDropdowns({});
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAttachment(file);
        }
    };

    const handleRemoveFile = () => {
        setAttachment(undefined);
    };

    const handleVoiceUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setVoiceNote(file);
        }
    };

    const handleRemoveVoice = () => {
        setVoiceNote(undefined);
    };

    function normalizeTimeToMinutes(timeValue) {
        if (!timeValue) return 0;

        const raw = String(timeValue).trim();

        if (raw.includes("AM") || raw.includes("PM")) {
            const [time, modifier] = raw.split(" ");
            const [hh, mm] = time.split(":").map(Number);

            let hours = hh;
            if (modifier === "PM" && hours !== 12) hours += 12;
            if (modifier === "AM" && hours === 12) hours = 0;

            return hours * 60 + (mm || 0);
        }

        const [h, m] = raw.split(":").map(Number);
        return (h || 0) * 60 + (m || 0);
    }

    function formatTimeLabel(timeValue) {
        if (!timeValue) return "";

        const minutes = normalizeTimeToMinutes(timeValue);
        const hours24 = Math.floor(minutes / 60);
        const mins = minutes % 60;

        const suffix = hours24 >= 12 ? "PM" : "AM";
        let hours12 = hours24 % 12;
        if (hours12 === 0) hours12 = 12;

        return `${String(hours12).padStart(2, "0")}:${String(mins).padStart(2, "0")} ${suffix}`;
    }

    function getDayName(dateValue) {
        if (!dateValue) return "";

        const dateObj = new Date(dateValue);

        return dateObj.toLocaleDateString(isEn ? "en-US" : "ar-SA", {
            weekday: "long",
        });
    }

    const uniqueDates = useMemo(() => {
        const map = new Map();

        slots.forEach((slot) => {
            if (!map.has(slot.date)) {
                map.set(slot.date, slot.date);
            }
        });

        return Array.from(map.values()).sort((a, b) => new Date(a) - new Date(b));
    }, [slots]);

    const dateSlots = useMemo(() => {
        if (!selectedDate) return [];
        return slots.filter((slot) => slot.date === selectedDate);
    }, [slots, selectedDate]);

    const availableSessions = useMemo(() => {
        return ["morning", "evening"];
    }, []);

    useEffect(() => {
        if (!selectedDate) return;

        if (!selectedSession) {
            setSelectedSession("morning");
            setSelectedSlot("");
        }
    }, [selectedDate, selectedSession]);

    const filteredSlots = useMemo(() => {
        return dateSlots
            .filter((slot) => {
                const shift = String(slot.shift || "").toLowerCase().trim();

                if (selectedSession === "morning") {
                    return shift === "morning";
                }

                if (selectedSession === "evening") {
                    return shift === "evening";
                }

                return true;
            })
            .sort(
                (a, b) =>
                    normalizeTimeToMinutes(a.start_time) -
                    normalizeTimeToMinutes(b.start_time)
            );
    }, [dateSlots, selectedSession]);

    const isFormValid = () =>
        form.first_name &&
        form.last_name &&
        form.email &&
        form.phone &&
        selectedDate &&
        selectedSession &&
        selectedSlot &&
        Number(visitors) >= 1;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedSlot) {
            toast.error(t("appointment.select_slot"));
            return;
        }

        try {
            const data = new FormData();

            data.append("slot", selectedSlot);
            data.append("appointment_type", appointmentType);
            data.append("visitors", Number(visitors));

            Object.entries(form).forEach(([key, val]) => {
                if (val) data.append(key, val);
            });

            if (attachment instanceof File) {
                data.append("attachment", attachment, attachment.name);
            }

            if (voiceNote instanceof File) {
                data.append("voice_note", voiceNote, voiceNote.name);
            }

            const res = await bookAppointment(data);

            if (res?.data?.booking_id) {
                setShowThankYou(true);
            }

            // reset form
            setForm({
                title: "",
                first_name: "",
                last_name: "",
                email: "",
                phone: "",
                message: "",
            });

            setSelectedSlot("");
            setAttachment(null);
            setVoiceNote(null);
            setVisitors(1);

        } catch (err) {
            console.error(err);
            toast.error(t("appointment.booking_failed"));
        }
    };

    const handleClose = () => {
        setShowThankYou(false);
        onClose();
    };

    const remainingChars = MAX_MESSAGE_LENGTH - form.message.length;

    const priceInPerson =
        settings?.price_in_person ??
        settings?.appointment_price_in_person ??
        settings?.in_person_price ??
        0;

    const priceOnline =
        settings?.price_online ??
        settings?.appointment_price_online ??
        settings?.online_price ??
        0;

    if (!isOpen) return null;
    if (loading) return null;

    // Thank You Screen
    if (showThankYou) {
        return (
            <div className="srm-overlay" onClick={handleClose}>
                <div
                    className="srm-container srm-thankyou"
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <div className="srm-thankyou-logo">
                        <img src={LogoImage} alt="Logo" />
                    </div>

                    <h2 className="srm-thankyou-title">
                        {t("appointment.thank_you_title")}
                    </h2>

                    <p className="srm-thankyou-message">
                        {t("appointment.thank_you_message")}
                    </p>

                    <button onClick={handleClose} className="srm-thankyou-button">
                        {t("appointment.home_button")}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="srm-overlay" onClick={handleClose}>
            <div
                className="srm-container"
                onClick={(e) => {
                    e.stopPropagation();
                }}
                dir={isRTL ? "rtl" : "ltr"}
            >
                {/* Header */}
                <div className="srm-header">
                    <img src={LogoImage} alt="logo" className="srm-logo" />
                    <button onClick={handleClose} className="srm-close-button">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>

                <div className="srm-divider"></div>

                {/* Detailed Intro Section */}
                <div className="srm-section">
                    <div className="appointment-intro">
                        <h3 className="appointment-intro-title">
                            {isEn ? "Before Submitting Your Appointment" : "قبل تقديم طلب الموعد"}
                        </h3>

                        <p className="appointment-intro-text">
                            {isEn ? (
                                <>
                                    Booking an appointment is a paid session intended for clients who
                                    need a live discussion before proceeding.
                                    <br />
                                    <br />
                                    It is typically suitable if you:
                                    <br />
                                    <br />
                                    • Prefer to explain your matter verbally due to extensive details.
                                    <br />
                                    • Want to get to know the firm before assigning any work
                                    (individuals/businesses).
                                    <br />• Have multiple matters/cases and need to define the
                                    direction and priorities.
                                    <br />
                                    <br />
                                    If your required service is available in the website's service
                                    list, you can receive a fee quote by submitting a{" "}
                                    <span
                                        className="appointment-link"
                                        onClick={() => {
                                            onClose();
                                            if (typeof openServiceModal === "function") {
                                                setTimeout(() => openServiceModal(), 150);
                                            }
                                        }}
                                    >
                                        Legal Service Request
                                    </span>
                                    ; therefore, this option is more appropriate than booking an
                                    appointment. If you cannot find your service among the available
                                    options, you may contact our Customer Service team via{" "}
                                    <a
                                        className="appointment-link"
                                        href={`https://wa.me/${settings?.whatsapp_number || ""}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        WhatsApp
                                    </a>{" "}
                                    for guidance.
                                    <br />
                                    <br />
                                    Appointment fees:{" "}
                                    <span className="appointment-price">
                                        In-person SAR {priceInPerson}
                                    </span>{" "}
                                    |{" "}
                                    <span className="appointment-price">
                                        Online SAR {priceOnline}
                                    </span>{" "}
                                    <span className="appointment-vat">Exclusive of VAT.</span>

                                    {showFullIntro && (
                                        <>
                                            <br />
                                            <br />
                                            If the appointment results in assigning any work to{" "}
                                            <span className="appointment-firm">
                                                Shahm Attorneys &amp; Consultants
                                            </span>
                                            , the appointment fee will be credited toward the legal fees and
                                            deducted from the total fees for the agreed scope of work. For
                                            more details on appointment booking terms, please refer to the{" "}
                                            <a href="/appointment-terms" className="appointment-policy">
                                                Appointment Booking Policy.
                                            </a>
                                        </>
                                    )}
                                </>
                            ) : (
                                <>
                                    حجز الموعد هو جلسة مدفوعة مخصصة للعملاء الذين يحتاجون إلى مناقشة مباشرة قبل المتابعة.
                                    <br />
                                    <br />
                                    عادةً ما يكون مناسبًا إذا كنت:
                                    <br />
                                    <br />
                                    • تفضل شرح مسألتك شفهيًا بسبب التفاصيل الواسعة.
                                    <br />
                                    • تريد التعرف على المكتب قبل تكليفه بأي عمل (أفراد/شركات).
                                    <br />
                                    • لديك عدة مسائل/قضايا وتحتاج لتحديد الاتجاه والأولويات.
                                    <br />
                                    <br />
                                    إذا كانت الخدمة المطلوبة متاحة في قائمة خدمات الموقع، يمكنك الحصول على عرض أسعار من خلال تقديم{" "}
                                    <span
                                        className="appointment-link"
                                        onClick={() => {
                                            onClose();
                                            if (typeof openServiceModal === "function") {
                                                setTimeout(() => openServiceModal(), 150);
                                            }
                                        }}
                                    >
                                        طلب خدمة قانونية
                                    </span>
                                    ؛ لذا هذا الخيار أكثر ملاءمة من حجز موعد. إذا لم تتمكن من العثور على خدمتك ضمن الخيارات المتاحة، يمكنك التواصل مع فريق خدمة العملاء عبر{" "}
                                    <a
                                        className="appointment-link"
                                        href={`https://wa.me/${settings?.whatsapp_number || ""}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        واتساب
                                    </a>{" "}
                                    للحصول على التوجيه.
                                    <br />
                                    <br />
                                    رسوم الموعد:{" "}
                                    <span className="appointment-price">
                                        حضوري {priceInPerson} ريال
                                    </span>{" "}
                                    |{" "}
                                    <span className="appointment-price">
                                        عن بعد {priceOnline} ريال
                                    </span>{" "}
                                    <span className="appointment-vat">غير شامل ضريبة القيمة المضافة.</span>

                                    {showFullIntro && (
                                        <>
                                            <br />
                                            <br />
                                            إذا أدى الموعد إلى تكليف أي عمل لـ{" "}
                                            <span className="appointment-firm">
                                                شهم للمحاماة والاستشارات
                                            </span>
                                            ، سيتم احتساب رسوم الموعد ضمن الأتعاب القانونية وخصمها من إجمالي الأتعاب للنطاق المتفق عليه. لمزيد من التفاصيل حول شروط حجز المواعيد، يرجى الرجوع إلى{" "}
                                            <a href="/appointment-terms" className="appointment-policy">
                                                سياسة حجز المواعيد.
                                            </a>
                                        </>
                                    )}
                                </>
                            )}
                        </p>

                        <button
                            type="button"
                            className="appointment-toggle-btn"
                            onClick={() => setShowFullIntro(!showFullIntro)}
                        >
                            {showFullIntro
                                ? (isEn ? "See Less" : "عرض أقل")
                                : (isEn ? "See More" : "عرض المزيد")
                            }
                        </button>
                    </div>
                </div>

                <div className="srm-divider"></div>

                <form onSubmit={handleSubmit}>
                    {/* Appointment Details Section */}
                    <div className="srm-section">
                        <h3 className="srm-section-title">
                            {t("appointment.appointment_details")}
                        </h3>

                        <p className="srm-section-subtitle">
                            {t("appointment.required_fields")}
                        </p>

                        <div className="srm-form-row">
                            <div className="srm-form-field">
                                <label>{t("appointment.appointment_type")}</label>
                                <div className="srm-custom-select" onClick={() => toggleDropdown('appointmentType')}>
                                    <div className="srm-custom-select-trigger">
                                        <span>
                                            {appointmentType === 'in_person' ? t("appointment.in_person") : t("appointment.online")}
                                        </span>
                                        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" className={`srm-dropdown-arrow ${openDropdowns['appointmentType'] ? 'open' : ''}`}>
                                            <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    {openDropdowns['appointmentType'] && (
                                        <div className="srm-custom-select-dropdown">
                                            <div
                                                className="srm-custom-select-option"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setAppointmentType('in_person');
                                                    closeAllDropdowns();
                                                }}
                                            >
                                                {t("appointment.in_person")}
                                            </div>
                                            <div
                                                className="srm-custom-select-option"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setAppointmentType('online');
                                                    closeAllDropdowns();
                                                }}
                                            >
                                                {t("appointment.online")}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="srm-form-field">
                                <label>{t("appointment.visitors")}</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={visitors}
                                    onChange={(e) => setVisitors(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="srm-form-row">
                            <div className="srm-form-field">
                                <label>{t("appointment.date")}</label>
                                <div className="srm-custom-select" onClick={() => toggleDropdown('date')}>
                                    <div className="srm-custom-select-trigger">
                                        <span className={!selectedDate ? 'placeholder' : ''}>
                                            {selectedDate
                                                ? `${getDayName(selectedDate)}, ${selectedDate}`
                                                : t("appointment.choose_date")
                                            }
                                        </span>
                                        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" className={`srm-dropdown-arrow ${openDropdowns['date'] ? 'open' : ''}`}>
                                            <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    {openDropdowns['date'] && (
                                        <div className="srm-custom-select-dropdown">
                                            {uniqueDates.map((date) => (
                                                <div
                                                    key={date}
                                                    className="srm-custom-select-option"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedDate(date);
                                                        setSelectedSlot("");
                                                        closeAllDropdowns();
                                                    }}
                                                >
                                                    {`${getDayName(date)}, ${date}`}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="srm-form-field">
                                <label>{t("appointment.session")}</label>
                                <div className="srm-custom-select" onClick={() => toggleDropdown('session')}>
                                    <div className="srm-custom-select-trigger">
                                        <span className={!selectedSession ? 'placeholder' : ''}>
                                            {selectedSession
                                                ? (selectedSession === 'morning' ? t("appointment.morning") : t("appointment.evening"))
                                                : t("appointment.choose_session")
                                            }
                                        </span>
                                        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" className={`srm-dropdown-arrow ${openDropdowns['session'] ? 'open' : ''}`}>
                                            <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    {openDropdowns['session'] && (
                                        <div className="srm-custom-select-dropdown">
                                            {availableSessions.includes("morning") && (
                                                <div
                                                    className="srm-custom-select-option"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedSession("morning");
                                                        setSelectedSlot("");
                                                        closeAllDropdowns();
                                                    }}
                                                >
                                                    {t("appointment.morning")}
                                                </div>
                                            )}
                                            {availableSessions.includes("evening") && (
                                                <div
                                                    className="srm-custom-select-option"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedSession("evening");
                                                        setSelectedSlot("");
                                                        closeAllDropdowns();
                                                    }}
                                                >
                                                    {t("appointment.evening")}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Time Slots Grid */}
                        <div className="appointment-slots-grid">
                            {filteredSlots.length > 0 ? (
                                filteredSlots.map((slot) => {
                                    const isSelected = String(selectedSlot) === String(slot.id);
                                    const isAvailable = Boolean(slot.is_available);

                                    return (
                                        <button
                                            key={slot.id}
                                            type="button"
                                            disabled={!isAvailable}
                                            onClick={() => setSelectedSlot(slot.id)}
                                            className={`appointment-slot ${isAvailable ? "available" : "disabled"} ${isSelected ? "selected" : ""}`}
                                        >
                                            {formatTimeLabel(slot.start_time)}
                                        </button>
                                    );
                                })
                            ) : (
                                <div className="appointment-no-slots">
                                    {t("appointment.no_slots")}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="srm-divider"></div>

                    {/* Your Information Section */}
                    <div className="srm-section">
                        <h3 className="srm-section-title">
                            {t("appointment.your_information")}
                        </h3>

                        <div className="srm-form-row">
                            <div className="srm-form-field">
                                <label>{t("appointment.title")}</label>
                                <div className="srm-custom-select" onClick={() => toggleDropdown('title')}>
                                    <div className="srm-custom-select-trigger">
                                        <span className={!form.title ? 'placeholder' : ''}>
                                            {form.title
                                                ? (form.title === 'mr' ? t("appointment.mr") :
                                                    form.title === 'mrs' ? t("appointment.mrs") :
                                                        t("appointment.ms"))
                                                : t("appointment.select_title")
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
                                                {t("appointment.select_title")}
                                            </div>
                                            <div
                                                className="srm-custom-select-option"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setForm({ ...form, title: 'mr' });
                                                    closeAllDropdowns();
                                                }}
                                            >
                                                {t("appointment.mr")}
                                            </div>
                                            <div
                                                className="srm-custom-select-option"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setForm({ ...form, title: 'mrs' });
                                                    closeAllDropdowns();
                                                }}
                                            >
                                                {t("appointment.mrs")}
                                            </div>
                                            <div
                                                className="srm-custom-select-option"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setForm({ ...form, title: 'ms' });
                                                    closeAllDropdowns();
                                                }}
                                            >
                                                {t("appointment.ms")}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div></div>
                        </div>

                        <div className="srm-form-row">
                            <div className="srm-form-field">
                                <label>{t("appointment.first_name")}</label>
                                <div className="srm-input-wrapper">
                                    <input
                                        name="first_name"
                                        value={form.first_name}
                                        onChange={handleChange}
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
                                <label>{t("appointment.last_name")}</label>
                                <div className="srm-input-wrapper">
                                    <input
                                        name="last_name"
                                        value={form.last_name}
                                        onChange={handleChange}
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
                                <label>{t("appointment.contact_number")}</label>
                                <div className="srm-input-wrapper">
                                    <input
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleChange}
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
                                <label>{t("appointment.email_address")}</label>
                                <div className="srm-input-wrapper">
                                    <input
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
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
                                <label>{t("appointment.your_message")}</label>
                                <textarea
                                    name="message"
                                    value={form.message}
                                    maxLength={MAX_MESSAGE_LENGTH}
                                    onChange={handleChange}
                                />
                                <p className="srm-char-counter">
                                    {t("appointment.characters_remaining", { count: remainingChars })}
                                </p>
                            </div>
                        </div>

                        {/* Submit Row */}
                        <div className="srm-submit-row">
                            <button
                                type="submit"
                                className={`srm-submit-button ${isFormValid() ? "active" : ""}`}
                                disabled={!isFormValid()}
                            >
                                {t("appointment.submit")}
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
                                            name="voice_note"
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
                                    {voiceNote && (
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
                                            name="attachment"
                                            onChange={handleFileUpload}
                                        />
                                    </label>
                                    {attachment && (
                                        <div className="srm-upload-remove" onClick={handleRemoveFile}>
                                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                                <path d="M9 3L3 9M3 3L9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                            </svg>
                                        </div>
                                    )}
                                    {attachment && (
                                        <div className="srm-upload-preview">
                                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                                <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Policy Text */}
                        <div className="srm-policy-text">
                            {t("appointment.policy_text_part1")}{" "}
                            <span className="srm-policy-link">{t("appointment.data_policy")}</span>{" "}
                            {t("appointment.policy_text_part2")}{" "}
                            <span className="srm-policy-link">{t("appointment.appointment_policy")}</span>,{" "}
                            {t("appointment.policy_text_part3")}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}