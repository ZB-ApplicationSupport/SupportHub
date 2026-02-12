import api from "./axios";

export const requestSignup = (data) => api.post("/signup-request", data);

export const getSignupRequests = () => api.get("/admin/signup-requests");

export const approveSignupRequest = (id) =>
  api.put(`/admin/signup-requests/${id}/approve`);

export const rejectSignupRequest = (id) =>
  api.put(`/admin/signup-requests/${id}/reject`);
