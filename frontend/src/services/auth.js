import api from "./api";

export const login = async (credentials) => {
  const response = await api.post("/users/login", credentials);
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
  }
  return response.data;
};

export const register = async (userData) => {
  const response = await api.post("/users/register", userData);
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};
export const isAdmin = () => {
  const user = localStorage.getItem("user");
  return JSON.parse(user).role === "admin" ? true : false;
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const updateProfile = async (userData) => {
  const response = await api.put("/users/profile", userData);
  if (response.data.user) {
    localStorage.setItem("user", JSON.stringify(response.data.user));
  }
  return response.data;
};

export const changePassword = async (passwordData) => {
  return await api.put("/users/change-password", passwordData);
};
export const getUserIdFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    // atob decodifica base64, pero puede fallar si el token está mal formado
    const decoded = JSON.parse(atob(payload));
    return decoded.id || null;
    // eslint-disable-next-line no-unused-vars
  } catch (err) {
    return null;
  }
};
