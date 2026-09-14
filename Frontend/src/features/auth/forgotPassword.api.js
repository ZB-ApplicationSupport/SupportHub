import api from "../../services/axios";

export const requestPasswordReset = (email) =>
  api.post("/users/password-reset/request", { email });

export const resetPassword = ({ email, code, newPassword }) =>
  api.post("/users/password-reset/confirm", { email, code, newPassword });