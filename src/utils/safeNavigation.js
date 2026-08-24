const EXTERNAL_PROTOCOLS = new Set(["http:", "https:", "mailto:", "tel:"]);

export function getSafeExternalUrl(value) {
  if (typeof value !== "string" || !value.trim()) return null;

  try {
    const target = value.trim();
    const url = new URL(target);
    return EXTERNAL_PROTOCOLS.has(url.protocol) ? target : null;
  } catch {
    return null;
  }
}

export function openExternalUrl(value) {
  const target = getSafeExternalUrl(value);
  if (!target) return false;

  window.open(target, "_blank", "noopener,noreferrer");
  return true;
}

export function navigateToConfiguredUrl(value, navigate) {
  if (typeof value !== "string" || !value.trim() || value === "#") {
    return false;
  }

  const target = value.trim();
  if (/^(?:https?:|mailto:|tel:)/i.test(target)) {
    return openExternalUrl(target);
  }

  if (!target.startsWith("/") || target.startsWith("//") || target.includes("\\")) {
    return false;
  }

  navigate(target);
  return true;
}
