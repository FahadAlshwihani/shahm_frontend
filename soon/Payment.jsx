import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../../styles/pages/payment.css";

export default function Payment() {
    const location = useLocation();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const isEn = i18n.language === "en";

    const [method, setMethod] = useState(null);
    const [data, setData] = useState(null);

    useEffect(() => {
        const payload =
            location.state ||
            JSON.parse(localStorage.getItem("payment_payload"));

        if (!payload) {
            navigate("/service-advisory");
            return;
        }

        setData(payload);
    }, [location.state, navigate]);

    if (!data) return null;

    const handlePayment = () => {
        const paymentPayload = {
            ...data,
            payment_method: method,
        };

        console.log("READY FOR PAYMENT API:", paymentPayload);
        // createPaymentIntent(paymentPayload)
    };

    const handleEdit = () => {
        navigate("/service-advisory", { state: data });
    };

    return (
        <div className="payment-page" dir={isEn ? "ltr" : "rtl"}>
            <h1 className="payment-title">{t("payment.title")}</h1>
            
            {/* Title Divider */}
            <div className="payment-title-divider"></div>

            <div className="payment-layout">
                {/* ORDER SUMMARY */}
                <div className="order-summary">
                    <div className="summary-header">
                        <h3 className="summary-title">{t("payment.yourOrder")}</h3>
                        <button className="edit-btn" onClick={handleEdit}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="#999999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke="#999999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span>{t("payment.edit")}</span>
                        </button>
                    </div>

                    <div className="summary-card">
                        <h4 className="summary-card-title">{data.service_title}</h4>

                        <div className="summary-detail-row">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#7b8487" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#7b8487" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span className="summary-detail-value">{`${data.first_name} ${data.last_name}`}</span>
                        </div>

                        <div className="summary-detail-row">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="#7b8487" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M22 6L12 13L2 6" stroke="#7b8487" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span className="summary-detail-value">{data.email}</span>
                        </div>

                        <div className="summary-detail-row">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M22 16.92V19.92C22 20.4728 21.5523 20.9205 21 20.9205H18C8.61116 20.9205 1 13.3093 1 3.9205V1C1 0.447715 1.44772 0 2 0H5C5.55228 0 6 0.447715 6 1V5.5C6 6.05228 5.55228 6.5 5 6.5H3.5C3.5 11.7467 7.75329 16 13 16V14.5C13 13.9477 13.4477 13.5 14 13.5H18.5C19.0523 13.5 19.5 13.9477 19.5 14.5V16.92C19.5 17.4728 19.9477 17.9205 20.5 17.9205H22Z" stroke="#7b8487" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span className="summary-detail-value">{data.phone}</span>
                        </div>

                        <div className="summary-detail-row">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#7b8487" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M14 2V8H20" stroke="#7b8487" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span className="summary-detail-value">{data.service_title}</span>
                        </div>

                        {data.attachment && (
                            <div className="summary-detail-row">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path d="M21.44 11.05L12.25 20.24C11.1242 21.3658 9.59723 21.9983 8.005 21.9983C6.41277 21.9983 4.88581 21.3658 3.76 20.24C2.63419 19.1142 2.00166 17.5872 2.00166 15.995C2.00166 14.4028 2.63419 12.8758 3.76 11.75L12.95 2.56C13.7006 1.80944 14.7186 1.38782 15.78 1.38782C16.8414 1.38782 17.8594 1.80944 18.61 2.56C19.3606 3.31056 19.7822 4.32863 19.7822 5.39C19.7822 6.45137 19.3606 7.46944 18.61 8.22L9.41 17.41C9.03472 17.7853 8.52573 17.9961 7.995 17.9961C7.46427 17.9961 6.95528 17.7853 6.58 17.41C6.20472 17.0347 5.99391 16.5257 5.99391 15.995C5.99391 15.4643 6.20472 14.9553 6.58 14.58L15.07 6.1" stroke="#7b8487" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span className="summary-detail-value">{data.attachment.name}</span>
                            </div>
                        )}

                        <div className="summary-detail-row">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <rect x="2" y="5" width="20" height="14" rx="2" stroke="#7b8487" strokeWidth="2" />
                                <path d="M2 10H22" stroke="#7b8487" strokeWidth="2" />
                            </svg>
                              <div className="price-with-currency">
    <span className="summary-detail-value price-value">
      {data.service_price}
    </span>
    <img
      src="https://res.cloudinary.com/dxgqcmf7j/image/upload/v1767264322/kozbcmabgagay41nmd2w.png"
      alt="SAR"
      className="riyal-icon-summary"
    />
  </div>
                        </div>
                    </div>

                    <div className="order-total">
                        <span className="total-label">{t("payment.orderTotal")}</span>
                        <div className="total-amount">
                            <span className="total-price">{data.service_price}</span>
                            <img
                                src="https://res.cloudinary.com/dxgqcmf7j/image/upload/v1767264322/kozbcmabgagay41nmd2w.png"
                                alt="SAR"
                                className="riyal-icon"
                            />
                        </div>
                    </div>
                </div>

                {/* PAYMENT METHODS */}
                <div className="payment-methods">
                    <h3 className="payment-methods-title">{t("payment.paymentMethod")}</h3>

                    <PaymentOption
                        label={t("payment.madaCard")}
                        value="mada"
                        icon="https://res.cloudinary.com/dxgqcmf7j/image/upload/v1767269718/rroup5smbaehccatpfgr.png"
                        selected={method}
                        onSelect={setMethod}
                    />

                    <PaymentOption
                        label={t("payment.visaMaster")}
                        value="visa"
                        icon="https://res.cloudinary.com/dxgqcmf7j/image/upload/v1767269721/kpre8ed3xznksorrvapj.png"
                        selected={method}
                        onSelect={setMethod}
                    />

                    <PaymentOption
                        label={t("payment.applePay")}
                        value="apple"
                        icon="https://res.cloudinary.com/dxgqcmf7j/image/upload/v1767269719/qz1gvexsoilnuetsnnyl.png"
                        selected={method}
                        onSelect={setMethod}
                    />

                    <PaymentOption
                        label={t("payment.tabbyInstallment")}
                        value="tabby"
                        icon="https://res.cloudinary.com/dxgqcmf7j/image/upload/v1767270082/ka6un7e40chz0snrdxi6.png"
                        selected={method}
                        onSelect={setMethod}
                    />

                    <button
                        className="pay-btn"
                        disabled={!method}
                        onClick={handlePayment}
                    >
                        {t("payment.completePurchase")}
                    </button>
                </div>
            </div>
                        {/* Title Divider */}
            <div className="payment-footer-divider"></div>

        </div>
    );
}

function PaymentOption({ label, value, icon, selected, onSelect }) {
    return (
        <label className={`payment-option ${selected === value ? "active" : ""}`}>
            <input
                type="radio"
                name="payment"
                checked={selected === value}
                onChange={() => onSelect(value)}
            />
            <span className="payment-label">{label}</span>
            <img src={icon} alt={label} className="payment-icon" />
        </label>
    );
}