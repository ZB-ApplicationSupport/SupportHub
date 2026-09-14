export const AUTOMATION_LAST_RUN = "2026-09-08T04:15:00+02:00";

export const ATTENTION_COLORS = {
  High: { label: "High", color: "#D64545", bg: "#FEF2F2", bar: "#D64545" },
  Watch: { label: "Watch", color: "#B45309", bg: "#FFF7E6", bar: "#F4B41A" },
  Clear: { label: "Clear", color: "#0C5F2C", bg: "#E8F5EE", bar: "#00843D" },
};

export const AUTOMATION_STATS = [
  {
    id: "loans-without-settlement",
    component: "Loans",
    label: "No settlement accounts",
    hint: "Total loans missing a settlement account",
    acronym: "TL",
    group: "loans",
    countPath: "/api/loans/tl/count",
    countStat: "TOTAL LOANS WITHOUT SETTLEMENT ACCOUNTS",
    enabled: true,
    classifications: [
      {
        id: "ntlpm",
        acronym: "NTLPM",
        label: "Non-term loans past moratorium",
        countPath: "/api/loans/ntlpm/count",
        countStat: "NON TERM LOANS PAST MORATORIUM",
        rowsPath: "/api/loans/ntlpm",
      },
      {
        id: "tlpm",
        acronym: "TLPM",
        label: "Term loans past moratorium",
        countPath: "/api/loans/tlpm/count",
        countStat: "TERM LOANS PAST MORATORIUM",
        rowsPath: "/api/loans/tlpm",
      },
      {
        id: "ntlwm",
        acronym: "NTLWM",
        label: "Non-term loans within moratorium",
        countPath: "/api/loans/ntlwm/count",
        countStat: "NON TERM LOANS WITHIN MORATORIUM",
        rowsPath: "/api/loans/ntlwm",
      },
      {
        id: "tlwm",
        acronym: "TLWM",
        label: "Term loans within moratorium",
        countPath: "/api/loans/tlwm/count",
        countStat: "TERM LOANS WITHIN MORATORIUM",
        rowsPath: "/api/loans/tlwm",
      },
      {
        id: "ldeom",
        acronym: "LDEOM",
        label: "Loans due end of month",
        countPath: "/api/loans/ldeom/count",
        countStat: "ALL LOANS DUE EOM WITHOUT SETTLEMENT ACCOUNTS",
        rowsPath: "/api/loans/ldeom",
      },
      {
        id: "tl",
        acronym: "TL",
        label: "Total loans without settlement accounts",
        countPath: "/api/loans/tl/count",
        countStat: "TOTAL LOANS WITHOUT SETTLEMENT ACCOUNTS",
        rowsPath: "/api/loans/tl",
        rollup: true,
      },
    ],
  },
  {
    id: "loans-without-schedule",
    component: "Loans",
    label: "Loans without schedule",
    hint: "Matured loans with no repayment schedule",
    acronym: "LWS",
    group: "loans",
    countPath: "/api/loan/status/count",
    enabled: true,
    classifications: [
      {
        id: "lws",
        acronym: "LWS",
        label: "Loans without schedule",
        countPath: "/api/loan/status/count",
        rowsPath: "/api/loan/status",
        rollup: true,
      },
    ],
  },
  {
    id: "loans-incorrect-status",
    component: "Loans",
    label: "Loans Incorrect status",
    hint: "Status does not match the loan balance",
    acronym: "ILS",
    group: "loans",
    countPath: "/api/loan/ils/count",
    enabled: true,
    classifications: [
      {
        id: "ils",
        acronym: "ILS",
        label: "Loans Incorrect status",
        countPath: "/api/loan/ils/count",
        rowsPath: "/api/loan/ils",
        rollup: true,
      },
    ],
  },
  {
    id: "account-service-fees",
    component: "Fees",
    label: "Account service fees",
    hint: "Accounts not collected account fees",
    acronym: "ANCAF",
    group: "accounts",
    countPath: "/api/acc/ancaf/count",
    enabled: true,
    classifications: [
      {
        id: "charged",
        acronym: "CHARGED",
        label: "Service fees charged",
        countPath: "/api/acc/charged/count",
        rowsPath: "/api/acc/charged",
      },
      {
        id: "sfrirq",
        acronym: "SFRIRQ",
        label: "Service fee records in retry queue",
        countPath: "/api/acc/sfrirq/count",
        rowsPath: "/api/acc/sfrirq",
      },
      {
        id: "sfrirh",
        acronym: "SFRIRH",
        label: "Service fee records in retry history",
        countPath: "/api/acc/sfrirh/count",
        rowsPath: "/api/acc/sfrirh",
      },
      {
        id: "ancaf",
        acronym: "ANCAF",
        label: "Accounts not collected account fees",
        countPath: "/api/acc/ancaf/count",
        rowsPath: "/api/acc/ancaf",
        rollup: true,
      },
    ],
  },
  {
    id: "static-holds-to-place",
    component: "Account Blocks",
    label: "Static holds to place",
    hint: "Salary-based holds that still need to be placed",
    acronym: "HTBP",
    group: "accounts",
    countPath: "/api/acc/htbp/count",
    enabled: true,
    classifications: [
      {
        id: "htbp",
        acronym: "HTBP",
        label: "Holds to be placed",
        countPath: "/api/acc/htbp/count",
        rowsPath: "/api/acc/htbp",
        rollup: true,
      },
    ],
  },
  {
    id: "static-holds-to-unblock",
    component: "Account Blocks",
    label: "Static holds to unblock",
    hint: "Salary-based holds due to be released",
    acronym: "HTBU",
    group: "accounts",
    countPath: "/api/acc/htbu/count",
    enabled: true,
    classifications: [
      {
        id: "htbu",
        acronym: "HTBU",
        label: "Holds to be unblocked",
        countPath: "/api/acc/htbu/count",
        rowsPath: "/api/acc/htbu",
        rollup: true,
      },
    ],
  },
  {
    id: "unknown-holds",
    component: "Account Blocks",
    label: "Unknown blocks",
    hint: "Blocks that could not be classified",
    acronym: "UH",
    group: "accounts",
    countPath: "/api/blocks/uh/stats",
    enabled: true,
    classifications: [
      {
        id: "uh",
        acronym: "UH",
        label: "Unknown blocks",
        countPath: "/api/blocks/uh/stats",
        rowsPath: "/api/blocks/uh",
        rollup: true,
      },
    ],
  },
  {
    id: "minimum-balance",
    component: "Balances",
    label: "Accounts below minimum",
    hint: "Accounts under the minimum balance",
    acronym: "MB",
    group: "accounts",
    countPath: "/api/acc/count",
    enabled: true,
    classifications: [
      {
        id: "mb",
        acronym: "MB",
        label: "Accounts below minimum",
        countPath: "/api/acc/count",
        rowsPath: "/api/acc/mb",
        rollup: true,
      },
    ],
  },
];

export const AUTOMATION_PIPELINES = [
  {
    id: "loan-settlement",
    title: "Loan settlement",
    hint: "Loans missing a settlement account",
    headlineStatId: "loans-without-settlement",
    headlineMode: "stat",
    stages: [
      {
        id: "ntlpm",
        label: "NTLPM",
        statId: "loans-without-settlement",
        classificationId: "ntlpm",
      },
      {
        id: "tlpm",
        label: "TLPM",
        statId: "loans-without-settlement",
        classificationId: "tlpm",
      },
      {
        id: "ntlwm",
        label: "NTLWM",
        statId: "loans-without-settlement",
        classificationId: "ntlwm",
      },
      {
        id: "tlwm",
        label: "TLWM",
        statId: "loans-without-settlement",
        classificationId: "tlwm",
      },
    ],
  },
  {
    id: "loan-status",
    title: "Loan status",
    hint: "Schedule and incorrect-status exceptions",
    headlineStatId: "loans-without-schedule",
    headlineMode: "sum",
    stages: [
      { id: "lws", label: "LWS", statId: "loans-without-schedule" },
      { id: "ils", label: "ILS", statId: "loans-incorrect-status" },
    ],
  },
  {
    id: "account-monitors",
    title: "Account monitors",
    hint: "Holds, fees and minimum balance",
    headlineStatId: "minimum-balance",
    headlineMode: "sum",
    stages: [
      { id: "htbp", label: "HTBP", statId: "static-holds-to-place" },
      { id: "htbu", label: "HTBU", statId: "static-holds-to-unblock" },
      { id: "ancaf", label: "ANCAF", statId: "account-service-fees" },
      { id: "mb", label: "MB", statId: "minimum-balance" },
    ],
  },
];

export const AUTOMATION_CATALOGUE = [
  {
    component: "Loans",
    issues: [
      {
        id: "loans-without-settlement",
        issue: "No settlement accounts",
        categories: [
          { category: "NON TERM LOANS PAST MORATORIUM", count: 142 },
          { category: "TERM LOANS PAST MORATORIUM", count: 88 },
          { category: "NON TERM LOANS WITHIN MORATORIUM", count: 31 },
          { category: "TERM LOANS WITHIN MORATORIUM", count: 19 },
          {
            category: "TOTAL LOANS WITHOUT SETTLEMENT ACCOUNTS",
            count: 280,
            rollup: true,
          },
        ],
      },
      {
        id: "loans-without-schedule",
        issue: "Loans without schedule",
        categories: [
          { category: "Matured", count: 24 },
          { category: "Running", count: 67 },
        ],
      },
      {
        id: "loans-incorrect-status",
        issue: "Loans Incorrect status",
        categories: [
          { category: "Settled Loans with balances", count: 12 },
          { category: "Normal loans with 0 balances", count: 9 },
        ],
      },
    ],
  },
  {
    component: "Fees",
    issues: [
      {
        id: "account-service-fees",
        issue: "Account service fees",
        categories: [{ category: "Account service fees", count: 22 }],
      },
    ],
  },
  {
    component: "Account Blocks",
    issues: [
      {
        id: "static-holds-to-place",
        issue: "Static holds to place",
        categories: [{ category: "Static holds to place", count: 36 }],
      },
      {
        id: "static-holds-to-unblock",
        issue: "Static holds to unblock",
        categories: [{ category: "Static holds to unblock", count: 18 }],
      },
      {
        id: "unknown-holds",
        issue: "Unknown blocks",
        categories: [{ category: "Unknown blocks", count: 11 }],
      },
    ],
  },
  {
    component: "Balances",
    issues: [
      {
        id: "minimum-balance",
        issue: "Accounts without minimum balance",
        categories: [{ category: "Accounts below minimum", count: 44 }],
      },
    ],
  },
];

export const sumIssueCount = (issue = {}) =>
  (issue.categories || [])
    .filter((item) => !item.rollup)
    .reduce((total, item) => total + (Number(item.count) || 0), 0);

export const statsFromCatalogue = (
  catalogue = AUTOMATION_CATALOGUE,
  stats = AUTOMATION_STATS
) => {
  const issues = catalogue.flatMap((item) =>
    (item.issues || []).map((issue) => ({
      ...issue,
      component: item.component,
    }))
  );

  return stats.map((stat) => {
    const issue = issues.find(
      (item) => item.id === stat.id || item.issue === stat.label
    );
    return {
      id: stat.id,
      label: stat.label,
      hint: stat.hint,
      component: stat.component,
      issue: stat.label,
      count: issue ? sumIssueCount(issue) : 0,
      unavailable: false,
    };
  });
};

export const flattenAutomationRows = (catalogue = AUTOMATION_CATALOGUE) => {
  const rows = [];

  catalogue.forEach((component) => {
    component.issues.forEach((issue) => {
      issue.categories.forEach((item) => {
        rows.push({
          id: `${component.component}::${issue.id || issue.issue}::${item.category}`,
          statId: issue.id || issue.issue,
          component: component.component,
          issue: issue.issue,
          category: item.category,
          count: Number(item.count) || 0,
          rollup: Boolean(item.rollup),
        });
      });
    });
  });

  return rows;
};

export const metricRows = (rows = []) => rows.filter((row) => !row.rollup);

export const sumCounts = (rows = []) =>
  rows.reduce((total, row) => total + (Number(row.count) || 0), 0);

export const attentionForCount = (count) => {
  if (count >= 100) return ATTENTION_COLORS.High;
  if (count >= 20) return ATTENTION_COLORS.Watch;
  return ATTENTION_COLORS.Clear;
};

export const SEVERITY = {
  Critical: {
    key: "Critical",
    label: "Action needed",
    color: "#BE123C",
    bg: "#FFF1F2",
    accent: "#F43F5E",
    chipBg: "#FFF1F2",
    chipBorder: "#FECDD3",
  },
  Attention: {
    key: "Attention",
    label: "Attention",
    color: "#B45309",
    bg: "#FFFBEB",
    accent: "#F59E0B",
    chipBg: "#FFFBEB",
    chipBorder: "#FDE68A",
  },
  Healthy: {
    key: "Healthy",
    label: "Healthy",
    color: "#0C5F2C",
    bg: "#ECFDF3",
    accent: "#12B76A",
    chipBg: "#ECFDF3",
    chipBorder: "#BBF7D0",
  },
  Unavailable: {
    key: "Unavailable",
    label: "Unavailable",
    color: "#64748B",
    bg: "#F8FAFC",
    accent: "#94A3B8",
    chipBg: "#F8FAFC",
    chipBorder: "#E2E8F0",
  },
};

export const PIPELINE_LEGEND = [
  SEVERITY.Healthy,
  SEVERITY.Attention,
  SEVERITY.Critical,
];

export const severityForCount = (count, unavailable = false) => {
  if (unavailable || count == null) return SEVERITY.Unavailable;
  if (Number(count) <= 0) return SEVERITY.Healthy;
  if (Number(count) >= 100) return SEVERITY.Critical;
  return SEVERITY.Attention;
};

export const pipelineStatusFromItems = (items = []) => {
  const available = items.filter((item) => !item.unavailable && item.count != null);
  if (!available.length) return SEVERITY.Unavailable;
  if (available.some((item) => Number(item.count) >= 100)) return SEVERITY.Critical;
  if (available.some((item) => Number(item.count) > 0)) return SEVERITY.Attention;
  return SEVERITY.Healthy;
};

export const buildAutomationPipelines = (stats = []) => {
  const byId = Object.fromEntries(stats.map((stat) => [stat.id, stat]));

  return AUTOMATION_PIPELINES.map((pipeline) => {
    const stages = pipeline.stages.map((stage) => {
      const stat = byId[stage.statId];
      if (stage.classificationId) {
        const item = (stat?.classifications || []).find(
          (entry) => entry.id === stage.classificationId
        );
        return {
          ...stage,
          count: item?.count ?? null,
          unavailable: item?.unavailable ?? true,
          stat,
        };
      }
      return {
        ...stage,
        count: stat?.count ?? null,
        unavailable: stat?.unavailable ?? true,
        stat,
      };
    });

    const headlineStat = byId[pipeline.headlineStatId] || stages[0]?.stat;
    const summed = stages.filter((stage) => !stage.unavailable && stage.count != null);
    const count =
      pipeline.headlineMode === "sum"
        ? summed.length
          ? summed.reduce((total, stage) => total + Number(stage.count || 0), 0)
          : null
        : headlineStat?.count ?? null;
    const unavailable =
      pipeline.headlineMode === "sum"
        ? summed.length === 0
        : Boolean(headlineStat?.unavailable) || headlineStat?.count == null;

    return {
      ...pipeline,
      stages,
      count,
      unavailable,
      status: pipelineStatusFromItems(stages),
      stat: headlineStat,
    };
  });
};

export const countsByComponent = (rows = []) => {
  const map = {};
  metricRows(rows).forEach((row) => {
    map[row.component] = (map[row.component] || 0) + (Number(row.count) || 0);
  });
  return Object.keys(map)
    .map((component) => ({
      component,
      count: map[component],
      attention: attentionForCount(map[component]),
    }))
    .sort((a, b) => b.count - a.count);
};

export const countsByIssue = (rows = []) => {
  const map = {};
  metricRows(rows).forEach((row) => {
    const key = `${row.component}::${row.issue}`;
    if (!map[key]) {
      map[key] = {
        component: row.component,
        issue: row.issue,
        count: 0,
      };
    }
    map[key].count += Number(row.count) || 0;
  });
  return Object.values(map).sort((a, b) => b.count - a.count);
};

export const attentionMix = (rows = []) => {
  const mix = { High: 0, Watch: 0, Clear: 0 };
  metricRows(rows).forEach((row) => {
    mix[attentionForCount(row.count).label] += Number(row.count) || 0;
  });
  return ["High", "Watch", "Clear"].map((label) => ({
    label,
    count: mix[label],
    ...ATTENTION_COLORS[label],
  }));
};

export const compositionByComponent = (rows = []) => {
  const map = {};
  metricRows(rows).forEach((row) => {
    if (!map[row.component]) {
      map[row.component] = {
        component: row.component,
        High: 0,
        Watch: 0,
        Clear: 0,
        count: 0,
      };
    }
    const band = attentionForCount(row.count).label;
    const count = Number(row.count) || 0;
    map[row.component][band] += count;
    map[row.component].count += count;
  });
  return Object.values(map).sort((a, b) => b.count - a.count);
};

export const buildAutomationKpis = (rows = []) => {
  const metrics = metricRows(rows);
  const total = sumCounts(metrics);
  const mix = attentionMix(metrics);
  const high = mix.find((item) => item.label === "High")?.count || 0;
  const watch = mix.find((item) => item.label === "Watch")?.count || 0;
  const components = countsByComponent(metrics);
  const top = components[0];
  const issues = countsByIssue(metrics);

  return {
    total,
    high,
    watch,
    queryCount: metrics.length,
    issueCount: issues.length,
    topComponent: top?.component || "—",
    topShare: total > 0 && top ? Math.round((top.count / total) * 100) : 0,
    highShare: total > 0 ? Math.round((high / total) * 100) : 0,
  };
};

export const AUTOMATION_COMPONENTS = AUTOMATION_CATALOGUE.map(
  (item) => item.component
);
