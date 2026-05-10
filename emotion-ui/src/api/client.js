const BASE_URL = "http://127.0.0.1:8000";

export async function apiRequest(url, options = {}) {
  const token = localStorage.getItem("token");

  return fetch(BASE_URL + url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
}