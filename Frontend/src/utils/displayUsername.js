const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const looksLikeJwt = (value) => {
  const str = String(value || "").replace(/^Bearer\s+/i, "").trim();
  const parts = str.split(".");
  return str.startsWith("eyJ") && parts.length === 3;
};

const parseJwtPayload = (token) => {
  if (!token || typeof token !== "string") {
    return null;
  }

  const raw = token.replace(/^Bearer\s+/i, "").trim();
  const parts = raw.split(".");
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

const readSessionUser = () => {
  if (typeof localStorage === "undefined") {
    return null;
  }

  try {
    const stored = JSON.parse(
      localStorage.getItem("case-tracker-user") || "null"
    );
    const tokenPayload = parseJwtPayload(localStorage.getItem("token") || "");
    return {
      id: stored?.id || tokenPayload?.sub || "",
      username:
        stored?.username ||
        tokenPayload?.preferred_username ||
        tokenPayload?.username ||
        "",
      name: stored?.name || tokenPayload?.name || "",
      email: stored?.email || tokenPayload?.email || "",
    };
  } catch (error) {
    return null;
  }
};

const isDisplayableUsername = (value) => {
  const str = String(value || "").trim();
  if (!str) {
    return false;
  }
  if (looksLikeJwt(str) || UUID_RE.test(str)) {
    return false;
  }
  return true;
};

const usernameFromEmail = (value) => {
  const str = String(value || "").trim();
  if (!str.includes("@")) {
    return str;
  }
  return str.split("@")[0];
};

const usernameFromPayload = (payload, sessionUser) => {
  if (!payload || typeof payload !== "object") {
    return "";
  }

  const direct =
    payload.preferred_username ||
    payload.username ||
    payload.userName ||
    payload.createdByUsername ||
    "";

  if (isDisplayableUsername(direct)) {
    return String(direct).trim();
  }

  if (payload.sub && sessionUser?.id && payload.sub === sessionUser.id) {
    return sessionUser.username || sessionUser.name || "";
  }

  if (isDisplayableUsername(payload.email)) {
    if (
      sessionUser?.email &&
      String(payload.email).toLowerCase() ===
        String(sessionUser.email).toLowerCase()
    ) {
      return sessionUser.username || usernameFromEmail(payload.email);
    }
    return usernameFromEmail(payload.email);
  }

  if (isDisplayableUsername(payload.name)) {
    return String(payload.name).trim();
  }

  return "";
};

export const displayUsername = (...candidates) => {
  const sessionUser = readSessionUser();

  for (const candidate of candidates) {
    if (candidate == null || candidate === "") {
      continue;
    }

    if (typeof candidate === "object") {
      const nested = displayUsername(
        candidate.preferred_username,
        candidate.username,
        candidate.userName,
        candidate.createdByUsername,
        candidate.name,
        candidate.email,
        candidate.sub,
        candidate.id
      );
      if (nested) {
        return nested;
      }
      continue;
    }

    const str = String(candidate).trim();
    if (!str) {
      continue;
    }

    if (looksLikeJwt(str)) {
      const fromJwt = usernameFromPayload(parseJwtPayload(str), sessionUser);
      if (fromJwt) {
        return fromJwt;
      }
      continue;
    }

    if (UUID_RE.test(str)) {
      if (sessionUser?.id && str === sessionUser.id) {
        return sessionUser.username || sessionUser.name || "";
      }
      continue;
    }

    if (str.includes("@")) {
      if (
        sessionUser?.email &&
        str.toLowerCase() === String(sessionUser.email).toLowerCase()
      ) {
        return sessionUser.username || usernameFromEmail(str);
      }
      return usernameFromEmail(str);
    }

    return str;
  }

  return "";
};
