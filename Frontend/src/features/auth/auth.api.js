// src/api/auth.api.js
import api from "./../../services/axios";

export const login = (data) =>
  api.post("/auth/login", data);
