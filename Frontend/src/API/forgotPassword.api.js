import api from "./axios";

export const requestPasswordReset = (email) => api.post("/forgot-password", { email });

export const resetPassword = (token, newPassword) =>
  api.post("/reset-password", { token, newPassword });