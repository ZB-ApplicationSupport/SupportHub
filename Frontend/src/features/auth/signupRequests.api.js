import api from "../../services/axios";

const usernameFromEmail = (email = "") => String(email).split("@")[0] || email;

const mapAccountPayload = (data = {}) => {
  const username = data.username || usernameFromEmail(data.email);
  return {
    username,
    email: data.email,
    firstName: data.firstName || username,
    lastName: data.lastName || "",
    password: data.password,
    role: data.role,
  };
};

export const requestSignup = (data) =>
  api.post("/users/register", mapAccountPayload(data));

export const getSignupRequests = () => api.get("/users/pending");

export const approveSignupRequest = (id) =>
  api.post(`/users/${id}/approve`, null, { params: { role: "USER" } });
