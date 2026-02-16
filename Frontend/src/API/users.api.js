// src/API/users.api.js
import api from "./axios"; // import your axios instance

export const getUsers = async () => {
  const response = await api.get("/admin/get/users"); // interceptor adds Authorization header
  return response.data;
};

export const toggleUserStatus = async (userId, enable) => {
  const response = await api.put(`/admin/users/${userId}/status`, {
    enabled: enable,
  });
  return response.data; // updated user
};
