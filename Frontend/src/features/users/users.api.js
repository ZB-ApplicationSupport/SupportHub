// src/API/users.api.js
import api from "../../services/axios";

// ============================================================
// GET ALL USERS
// ============================================================

export const getUsers = async () => {
  const response = await api.get("/admin/get/users");
  return response.data;
};


// ============================================================
// GET ENABLED USERS FOR CASE ASSIGNMENT
// ============================================================

export const getAssignees = async () => {
  const response = await api.get("/users/assignees");
  return response.data;
};


// ============================================================
// ADD USER
// ============================================================

export const addUser = async (data) => {
  await api.post("/admin/add/users", {
    email: data.email,
    temporaryPassword: data.temporaryPassword,
    role: data.role || "USER",
  });
};


// ============================================================
// TOGGLE USER STATUS
// ============================================================

export const toggleUserStatus = async (userId, enable) => {
  const response = await api.put(
      `/admin/users/${userId}/status`,
      {
        enabled: enable,
      }
  );

  return response.data;
};