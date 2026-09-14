const parseJsonEnv = (name, fallback) => {
  const raw = process.env[name];
  if (!raw) return fallback;

  try {
    return JSON.parse(raw);
  } catch (error) {
    return fallback;
  }
};

export const appConfig = {
  apiBaseUrl: process.env.REACT_APP_API_BASE_URL || "/api",
  keycloakBaseUrl: process.env.REACT_APP_KEYCLOAK_URL || "",
  keycloakRealm: process.env.REACT_APP_KEYCLOAK_REALM || "",
  keycloakClientId: process.env.REACT_APP_KEYCLOAK_CLIENT_ID || "",
  keycloakClientSecret: process.env.REACT_APP_KEYCLOAK_CLIENT_SECRET || "",
  defaultQuickLinks: parseJsonEnv("REACT_APP_DEFAULT_QUICK_LINKS", []),
  defaultSupportedSystems: parseJsonEnv("REACT_APP_DEFAULT_SUPPORTED_SYSTEMS", []),
  monitoringHostLabels: parseJsonEnv("REACT_APP_MONITORING_HOST_LABELS", {}),
  monitoringScrapeTargets: parseJsonEnv("REACT_APP_MONITORING_SCRAPE_TARGETS", []),
  opsReportBaseUrl: process.env.REACT_APP_OPS_REPORT_URL || "/ops-report",
};
