import axios from "axios";
import api from "../../services/axios";
import { appConfig } from "../../config/appConfig";

const KEYCLOAK_BASE = appConfig.keycloakBaseUrl;
const KEYCLOAK_REALM = appConfig.keycloakRealm;
const KEYCLOAK_CLIENT_ID = appConfig.keycloakClientId;
const KEYCLOAK_CLIENT_SECRET = appConfig.keycloakClientSecret;

const KEYCLOAK_REALMS_BASE =
  process.env.NODE_ENV === "development" || !KEYCLOAK_BASE
    ? "/realms"
    : `${KEYCLOAK_BASE}/realms`;

const TOKEN_PATH = `${KEYCLOAK_REALMS_BASE}/${KEYCLOAK_REALM}/protocol/openid-connect/token`;

const parseJwtPayload = (token) => {
  if (!token || typeof token !== "string") {
    return null;
  }

  const parts = token.split(".");
  if (parts.length !== 3) {
    return null;
  }

  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "="
    );
    return JSON.parse(atob(padded));
  } catch (error) {
    return null;
  }
};

const collectRoles = (payload) => {
  const realmRoles = payload?.realm_access?.roles || [];
  const resourceRoles = Object.values(payload?.resource_access || {}).flatMap(
    (entry) => entry?.roles || []
  );
  return [...realmRoles, ...resourceRoles].map((role) =>
    String(role).toLowerCase()
  );
};

const mapAppRole = (payload) => {
  const roles = collectRoles(payload);
  if (roles.includes("admin") || roles.includes("realm-admin")) {
    return "ADMIN";
  }
  return "USER";
};

const mapLoginSession = (tokenResponse) => {
  const accessToken = tokenResponse.access_token;
  const payload = parseJwtPayload(accessToken) || {};
  const username =
    payload.preferred_username ||
    payload.username ||
    payload.email ||
    "";

  return {
    accessToken,
    refreshToken: tokenResponse.refresh_token || "",
    role: mapAppRole(payload),
    user: {
      id: payload.sub || "",
      name: payload.name || username.split("@")[0] || username,
      email: payload.email || username,
      username,
    },
  };
};

const requestToken = (params) =>
  axios.post(TOKEN_PATH, params, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    timeout: 15000,
  });

const requiresClientSecret = /confidential/i.test(KEYCLOAK_CLIENT_ID || "");

const missingClientSecretError = () => {
  const error = new Error(
    "Keycloak confidential client requires REACT_APP_KEYCLOAK_CLIENT_SECRET."
  );
  error.response = {
    status: 401,
    data: {
      error: "invalid_client",
      error_description:
        "Keycloak confidential client requires REACT_APP_KEYCLOAK_CLIENT_SECRET.",
    },
  };
  return error;
};

const tokenParams = () => {
  const params = new URLSearchParams();
  params.set("client_id", KEYCLOAK_CLIENT_ID);
  if (KEYCLOAK_CLIENT_SECRET) {
    params.set("client_secret", KEYCLOAK_CLIENT_SECRET);
  }
  return params;
};

export const login = async ({ username, password }) => {
  if (requiresClientSecret && !KEYCLOAK_CLIENT_SECRET) {
    throw missingClientSecretError();
  }

  const params = tokenParams();
  params.set("grant_type", "password");
  params.set("username", username);
  params.set("password", password);
  params.set("scope", "openid profile email");

  const { data } = await requestToken(params);
  const session = mapLoginSession(data);

  localStorage.setItem("token", session.accessToken);
  if (session.refreshToken) {
    localStorage.setItem("refreshToken", session.refreshToken);
  }

  try {
    await api.get("/case-tracker/jobs", {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
      skipAuthRedirect: true,
    });
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      throw error;
    }
  }

  return session;
};

export const refreshSession = async (refreshToken) => {
  if (requiresClientSecret && !KEYCLOAK_CLIENT_SECRET) {
    throw missingClientSecretError();
  }

  const params = tokenParams();
  params.set("grant_type", "refresh_token");
  params.set("refresh_token", refreshToken);

  const { data } = await requestToken(params);
  return mapLoginSession(data);
};
