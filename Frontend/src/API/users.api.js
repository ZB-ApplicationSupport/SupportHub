// src/API/users.api.js
import api from "./axios";

export const getUsers = async () => {
  const response = await api.get("/admin/get/users");
  return response.data;
};

export const addUser = async (data) => {
  await api.post("/admin/add/users", {
    email: data.email,
    temporaryPassword: data.temporaryPassword,
    role: data.role || "USER",
  });
};

export const toggleUserStatus = async (userId, enable) => {
  const response = await api.put(`/admin/users/${userId}/status`, {
    enabled: enable,
  });
  return response.data;
};
