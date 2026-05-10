// Centralized API base URL — import this in every file instead of hardcoding
export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

/**
 * Build a full image URL from a relative server path.
 * e.g. "/uploads/photo.jpg"  →  "http://localhost:5000/uploads/photo.jpg"
 */
export const buildImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("data:") || path.startsWith("blob:")) return path;
  return `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
};

/**
 * Return the stored auth token from localStorage.
 */
export const getAuthToken = () => localStorage.getItem("token") || "";

/**
 * Return an Axios-compatible headers object with the Bearer token.
 */
export const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${getAuthToken()}` },
});
