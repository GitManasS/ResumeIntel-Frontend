/** REST API base URL (includes /api/v1) */
export function getApiBaseUrl() {
  return import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
}

/**
 * Socket.IO server origin (no path). Derived from VITE_API_URL in production
 * so Netlify only needs VITE_API_URL, not a separate socket variable.
 */
export function getSocketUrl() {
  const explicit = import.meta.env.VITE_SOCKET_URL;
  if (explicit) {
    return explicit.trim().replace(/\/+$/, '');
  }

  try {
    const api = getApiBaseUrl();
    const url = new URL(api);
    return url.origin;
  } catch {
    return 'http://localhost:5000';
  }
}
