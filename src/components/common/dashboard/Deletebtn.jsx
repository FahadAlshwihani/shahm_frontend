// src/components/common/dashboard/DeleteBtn.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import "../../../styles/dashboard/content/dashboard-common.css"

const IconTrash = () => (
  <svg width="15" height="15" viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 2C18.355 2 17 3.355 17 5L17 7L4 7A1 1 0 1 0 4 9L17.832 9A1 1 0 0 0 18.158 9L29.832 9A1 1 0 0 0 30.158 9L44 9A1 1 0 1 0 44 7L31 7L31 5C31 3.355 29.645 2 28 2L20 2ZM20 4L28 4C28.565 4 29 4.435 29 5L29 7L19 7L19 5C19 4.435 19.435 4 20 4ZM6.98 10.986A1 1 0 0 0 5.994 12.094L8.664 40.463C8.901 43.03 11.061 45 13.641 45L34.359 45C36.939 45 39.099 43.03 39.336 40.463L42.006 12.094A1 1 0 1 0 40.014 11.906L37.344 40.275A1 1 0 0 0 37.344 40.279C37.199 41.851 35.939 43 34.359 43L13.641 43C12.061 43 10.801 41.851 10.656 40.279A1 1 0 0 0 10.656 40.275L7.986 11.906A1 1 0 0 0 6.98 10.986Z" />
  </svg>
);

/**
 * MessageDeleteBtn
 * Props:
 *  - onConfirm  {async fn}   called after user confirms — should do the actual delete + toast
 */
export default function MessageDeleteBtn({ onConfirm }) {
  const { t } = useTranslation();

  return (
    <button
      className="dash-icon-btn dash-icon-btn--delete"
      title={t("messages.delete")}
      onClick={onConfirm}
    >
      <IconTrash />
    </button>
  );
}