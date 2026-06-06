// src/pages/dashboard/services/requests/hooks/useRequestAccess.js
import { useState, useCallback } from "react";
import {
  getServiceRequestAccessLinks,
  createServiceRequestAccessLink,
  revokeServiceRequestAccessLink,
  regenerateServiceRequestAccessLink,
} from "../../../../../api/servicesApi";

/**
 * Encapsulates all access-link operations for a service advisory request.
 *
 * Usage:
 *   const {
 *     links, linksLoading, linksError,
 *     fetchLinks, createLink, revokeLink, regenerateLink,
 *     actionLoading,
 *   } = useRequestAccess();
 */
export default function useRequestAccess() {
  const [links, setLinks] = useState([]);
  const [linksLoading, setLinksLoading] = useState(false);
  const [linksError, setLinksError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState(null);

  // ── Fetch links for a given requestId ────────────────────────────────────
  const fetchLinks = useCallback(async (requestId) => {
    if (!requestId) return;
    setLinksLoading(true);
    setLinksError(null);
    try {
      const res = await getServiceRequestAccessLinks(requestId);
      const data = res.data;
      setLinks(Array.isArray(data) ? data : data?.results ?? []);
    } catch (err) {
      setLinksError(err?.response?.data?.detail || "Failed to load access links.");
      setLinks([]);
    } finally {
      setLinksLoading(false);
    }
  }, []);

  // ── Create a new access link ──────────────────────────────────────────────
  const createLink = useCallback(async (requestId, payload = {}) => {
    setActionLoading(true);
    setActionError(null);
    try {
      const res = await createServiceRequestAccessLink(requestId, {
        form_id: payload.form_id,
        editable_fields: payload.editable_fields || [],
        expires_in_hours: payload.expires_in_hours ?? 72,
        max_edits: payload.max_edits ?? 3,
      });
      const newLink = res.data;
      setLinks((prev) => [newLink, ...prev]);
      return { success: true, link: newLink };
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.non_field_errors?.[0] ||
        "Failed to create access link.";
      setActionError(msg);
      return { success: false, error: msg };
    } finally {
      setActionLoading(false);
    }
  }, []);

  // ── Revoke a link ─────────────────────────────────────────────────────────
  const revokeLink = useCallback(async (linkId) => {
    setActionLoading(true);
    setActionError(null);
    try {
      await revokeServiceRequestAccessLink(linkId);
      setLinks((prev) =>
        prev.map((l) =>
          l.id === linkId ? { ...l, status: "revoked" } : l
        )
      );
      return { success: true };
    } catch (err) {
      const msg = err?.response?.data?.detail || "Failed to revoke link.";
      setActionError(msg);
      return { success: false, error: msg };
    } finally {
      setActionLoading(false);
    }
  }, []);

  // ── Regenerate a link ─────────────────────────────────────────────────────
  const regenerateLink = useCallback(async (linkId) => {
    setActionLoading(true);
    setActionError(null);
    try {
      const res = await regenerateServiceRequestAccessLink(linkId);
      const newLink = res.data;
      // Replace old link with revoked status, prepend new link
      setLinks((prev) => {
        const updated = prev.map((l) =>
          l.id === linkId ? { ...l, status: "revoked" } : l
        );
        return [newLink, ...updated];
      });
      return { success: true, link: newLink };
    } catch (err) {
      const msg = err?.response?.data?.detail || "Failed to regenerate link.";
      setActionError(msg);
      return { success: false, error: msg };
    } finally {
      setActionLoading(false);
    }
  }, []);

  // ── Reset state ───────────────────────────────────────────────────────────
  const resetLinks = useCallback(() => {
    setLinks([]);
    setLinksError(null);
    setActionError(null);
  }, []);

  return {
    links,
    linksLoading,
    linksError,
    actionLoading,
    actionError,
    fetchLinks,
    createLink,
    revokeLink,
    regenerateLink,
    resetLinks,
  };
}