// src/API/users.api.js
import api from "../../services/axios";

const usernameFromEmail = (email = "") => String(email).split("@")[0] || email;

const mapUserWrite = (data = {}) => {
  const username = data.username || usernameFromEmail(data.email);
  return {
    username,
    email: data.email,
    firstName: data.firstName || username,
    lastName: data.lastName || "",
    password: data.password || data.temporaryPassword,
    role: data.role || "USER",
  };
};

// ============================================================
// ADD USER
// ============================================================

export const addUser = async (data) => {
  await api.post("/users", mapUserWrite(data));
};

