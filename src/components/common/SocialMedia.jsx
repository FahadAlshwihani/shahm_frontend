import React from "react";
import "../../styles/common/SocialMedia.css";
import { getSafeExternalUrl } from "../../utils/safeNavigation";

/* ── X (Twitter) ── */
const XIcon = () => (
  <svg
    className="social-icon social-icon--x"
    viewBox="0 0 22 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M17.244 0h3.308l-7.227 8.26 8.502 11.24H15.17l-5.214-6.817L3.99 19.5H.68l7.73-8.835L.257 0h6.772l4.716 6.231L17.244 0zm-1.161 17.52h1.833L6.018 1.876H4.05L16.083 17.52z"
      fill="currentColor"
    />
  </svg>
);

/* ── TikTok ── */
const TikTokIcon = () => (
  <svg
    className="social-icon social-icon--tiktok"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M16.656 1.029c1.637-0.025 3.262-0.012 4.886-0.025 0.054 2.031 0.878 3.859 2.189 5.213l-0.002-0.002c1.411 1.271 3.247 2.095 5.271 2.235l0.028 0.002v5.036c-1.912-0.048-3.71-0.489-5.331-1.247l0.082 0.034c-0.784-0.377-1.447-0.764-2.077-1.196l0.052 0.034c-0.012 3.649 0.012 7.298-0.025 10.934-0.103 1.853-0.719 3.543-1.707 4.954l0.020-0.031c-1.652 2.366-4.328 3.919-7.371 4.011l-0.014 0c-0.123 0.006-0.268 0.009-0.414 0.009-1.73 0-3.347-0.482-4.725-1.319l0.040 0.023c-2.508-1.509-4.238-4.091-4.558-7.094l-0.004-0.041c-0.025-0.625-0.037-1.25-0.012-1.862 0.49-4.779 4.494-8.476 9.361-8.476 0.547 0 1.083 0.047 1.604 0.136l-0.056-0.008c0.025 1.849-0.050 3.699-0.050 5.548-0.423-0.153-0.911-0.242-1.42-0.242-1.868 0-3.457 1.194-4.045 2.861l-0.009 0.030c-0.133 0.427-0.21 0.918-0.21 1.426 0 0.206 0.013 0.41 0.037 0.61l-0.002-0.024c0.332 2.046 2.086 3.59 4.201 3.59 0.061 0 0.121-0.001 0.181-0.004l-0.009 0c1.463-0.044 2.733-0.831 3.451-1.994l0.010-0.018c0.267-0.372 0.45-0.822 0.511-1.311l0.001-0.014c0.125-2.237 0.075-4.461 0.087-6.698 0.012-5.036-0.012-10.060 0.025-15.083z"
      fill="currentColor"
    />
  </svg>
);

/* ── Instagram — rounded square frame + circle ring + corner dot ── */
const InstagramIcon = () => (
  <svg
    className="social-icon social-icon--instagram"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <rect
      x="1.25"
      y="1.25"
      width="17.5"
      height="17.5"
      rx="4.75"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="10" cy="10" r="3.6" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="15" cy="5" r="0.9" fill="currentColor" />
  </svg>
);

const PLATFORMS = [
  { key: "x_url",         label: "X (Twitter)", Icon: XIcon },
  { key: "tiktok_url",    label: "TikTok",       Icon: TikTokIcon },
  { key: "instagram_url", label: "Instagram",    Icon: InstagramIcon },
];

/**
 * SocialMedia
 * @param {object}  settings  — generalSettings from CMS (x_url, tiktok_url, instagram_url)
 * @param {boolean} isMobile  — switches desktop / mobile sizing via CSS class
 */
export default function SocialMedia({ settings, isMobile = false }) {
  const activeLinks = PLATFORMS.map((platform) => ({
    ...platform,
    href: getSafeExternalUrl(settings?.[platform.key]),
  })).filter(({ href }) => href);
  if (!activeLinks.length) return null;

  return (
    <div className={`social-media${isMobile ? " social-media--mobile" : ""}`}>
      {activeLinks.map(({ key, label, Icon, href }) => (
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="social-media__link"
        >
          <Icon />
        </a>
      ))}
    </div>
  );
}
