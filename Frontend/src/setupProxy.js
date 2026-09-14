const { createProxyMiddleware } = require("http-proxy-middleware");

const stripTrailingSlash = (value = "") => value.replace(/\/+$/, "");
const apiOrigin = (value = "") =>
  stripTrailingSlash(value).replace(/\/api$/i, "");

const keycloakUrl = stripTrailingSlash(
  process.env.KEYCLOAK_URL || process.env.REACT_APP_KEYCLOAK_URL || ""
);
const bssApiUrl = apiOrigin(
  process.env.BSS_API_URL || process.env.REACT_APP_BSS_API_URL || ""
);
const legacyApiUrl = apiOrigin(
  process.env.LEGACY_API_URL || process.env.REACT_APP_LEGACY_API_URL || ""
);
const prometheusUrl = stripTrailingSlash(process.env.PROMETHEUS_URL || "");
const opsReportUrl = stripTrailingSlash(process.env.OPS_REPORT_URL || "");

const proxyOptions = (target) => ({
  target,
  changeOrigin: true,
  timeout: 15000,
  proxyTimeout: 15000,
  onProxyReq: (proxyReq, req) => {
    const authorization = req.headers.authorization;
    if (authorization) {
      proxyReq.setHeader("Authorization", authorization);
    }
  },
});

const BSS_PATHS = [
  "/api/case-tracker",
  "/api/passwords",
  "/api/observability",
  "/api/knowledge-base",
  "/api/users",
  "/api/prometheus",
  "/api/loki",
  "/api/quick-links",
  "/api/files",
  "/api/audit-events",
];

module.exports = function (app) {
  if (keycloakUrl) {
    app.use("/realms", createProxyMiddleware(proxyOptions(keycloakUrl)));
  }

  BSS_PATHS.forEach((path) => {
    if (bssApiUrl) {
      app.use(path, createProxyMiddleware(proxyOptions(bssApiUrl)));
    }
  });

  if (/^https?:\/\//i.test(opsReportUrl)) {
    app.use(
      "/ops-report",
      createProxyMiddleware({
        ...proxyOptions(opsReportUrl),
        timeout: 180000,
        proxyTimeout: 180000,
        pathRewrite: { "^/ops-report": "" },
      })
    );
  }

  if (prometheusUrl) {
    app.use(
      "/prometheus",
      createProxyMiddleware({
        target: prometheusUrl,
        changeOrigin: true,
        timeout: 15000,
        proxyTimeout: 15000,
        pathRewrite: { "^/prometheus": "" },
      })
    );
  }

  if (legacyApiUrl) {
    app.use("/api", createProxyMiddleware(proxyOptions(legacyApiUrl)));
  }
};
