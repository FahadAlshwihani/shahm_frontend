import React from "react";

export default function ServiceIcon({ name }) {

  switch (name) {

    case "gavel":
      return (
        <svg width="32" height="30" viewBox="0 0 24 24">
          <path d="M14 2L20 8L18 10L12 4L14 2Z" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M3 21L10 14" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      );

    case "scale":
      return (
        <svg width="32" height="30" viewBox="0 0 24 24">
          <path d="M12 3V21" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M4 7H20" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M6 7L3 13H9L6 7Z" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M18 7L15 13H21L18 7Z" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      );

    case "briefcase":
      return (
        <svg width="32" height="30" viewBox="0 0 24 24">
          <rect x="3" y="7" width="18" height="14" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M8 7V5H16V7" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      );

    case "contract":
      return (
        <svg width="32" height="30" viewBox="0 0 24 24">
          <rect x="5" y="3" width="14" height="18" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M8 8H16M8 12H16M8 16H12" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      );

    case "shield":
      return (
        <svg width="32" height="30" viewBox="0 0 24 24">
          <path d="M12 2L20 6V12C20 17 16 20 12 22C8 20 4 17 4 12V6L12 2Z" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      );

    default:
      return null;
  }
}