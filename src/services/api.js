import axios from "axios";

const api = axios.create({
  baseURL: "https://invrec.monsalvepanaderia.online/api",
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

export const login = (credentials) => api.post("/auth/login", credentials);

export const getProfile = () =>
  api.get("/users/profile/me").then((profile) => ({
    ...profile,
    subscription: {
      name: profile.subscription?.name,
      duration: profile.subscription?.duration,
    },
  }));

export const createUser = (bodyUser) => api.post("/users", bodyUser);
