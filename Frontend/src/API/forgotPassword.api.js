import api from "./axios";

export const requestPasswordReset = (email) =>
  api.post("/auth/forgot-password", { email });

export const resetPassword = (token, newPassword) =>
  api.post("/auth/reset-password", { token, newPassword });