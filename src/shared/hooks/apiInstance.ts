import axios from "axios";

// Helper to safely access localStorage (works in both browser and server environments)
const isClient = typeof window !== "undefined";

const getToken = () => {
  if (!isClient) return null;
  return localStorage.getItem("token");
};

const getLang = () => {
  if (!isClient) return "en";
  return localStorage.getItem("i18nextLng") || "en";
};

const token = getToken();

export const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    "Content-type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    "ngrok-skip-browser-warning": "true",
  },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers["x-lang"] = getLang();
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (!isClient || !error.response || error.response.status !== 403) {
      return Promise.reject(error);
    }

    if (
      (error.response.data.message === "Authorization token malformed" ||
        error.response.data.message === "Bearer token malformed") &&
      !token
    ) {
      if (isClient) {
        localStorage.removeItem("token");
        localStorage.removeItem("expires");
        window.location.href = "/login";
      }
      return;
    }
    return Promise.reject(error);
  }
);

export default api;
