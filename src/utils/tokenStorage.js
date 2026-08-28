/**
 * The single place that reads and writes the stored session tokens.
 *
 * The Axios client and the authentication store both used to write
 * `localStorage` directly, so a refresh could update one and not the other.
 * Every access goes through here instead, and every access tolerates a browser
 * that refuses storage, such as Safari in private browsing.
 */

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

function readKey(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeKey(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // A browser that refuses storage still keeps the session in memory.
  }
}

function removeKey(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    // Nothing to clean up when storage is unavailable.
  }
}

export const readAccessToken = () => readKey(ACCESS_TOKEN_KEY);

export const readRefreshToken = () => readKey(REFRESH_TOKEN_KEY);

export const saveAccessToken = (token) => writeKey(ACCESS_TOKEN_KEY, token);

export function saveTokens({ access, refresh }) {
  if (access) writeKey(ACCESS_TOKEN_KEY, access);
  if (refresh) writeKey(REFRESH_TOKEN_KEY, refresh);
}

export function clearTokens() {
  removeKey(ACCESS_TOKEN_KEY);
  removeKey(REFRESH_TOKEN_KEY);
}
