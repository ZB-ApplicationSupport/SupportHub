export const knowledgeCategories = [
  "Incident Response",
  "Payments",
  "Digital Channels",
  "Core Banking",
  "Treasury",
  "Operations",
];

export const knowledgeTags = [
  "SLA",
  "API",
  "Latency",
  "Authentication",
  "Reconciliation",
  "Monitoring",
  "Access",
  "Compliance",
];

export const knowledgeArticles = [
  {
    id: "KB-1001",
    title: "Restoring failed overnight settlement jobs",
    summary:
      "Step-by-step recovery actions for settlement batch failures and downstream dependencies.",
    system: "Core Banking",
    category: "Incident Response",
    tags: ["SLA", "Monitoring"],
    updatedAt: "2026-01-18",
    readTime: "7 min read",
    views: 1240,
    rating: 4.6,
    ratingCount: 86,
    caseRef: "CT-1042",
    jiraRefs: ["JIRA-OPS-221", "JIRA-CORE-118"],
    vendorRefs: ["VEND-FIS-3321"],
    keywords: ["settlement", "batch", "recovery", "scheduler"],
    isPublished: true,
    content: `# Restoring failed overnight settlement jobs

## Overview
Use this guide when the overnight settlement batch fails due to dependency timeouts.

## Checklist
- Confirm upstream data feeds completed
- Re-run failed steps in sequence
- Validate reconciliation totals

## Step-by-step
1. Verify the scheduler status in the operations console.
2. Restart the settlement job with the **resume** option.
3. Monitor for downstream confirmation events.

## Code snippet
\`\`\`bash
settlement-cli resume --job "overnight-settlement"
\`\`\`

## Validation
- Compare posting totals to the control report
- Notify treasury stakeholders once confirmed`,
  },
  {
    id: "KB-1002",
    title: "Investigating API latency spikes for corporate transfers",
    summary:
      "Triaging high latency and request timeouts in the Payments Hub API.",
    system: "Payments Hub",
    category: "Payments",
    tags: ["API", "Latency", "Monitoring"],
    updatedAt: "2026-01-16",
    readTime: "6 min read",
    views: 980,
    rating: 4.2,
    ratingCount: 64,
    caseRef: "CT-1043",
    jiraRefs: ["JIRA-PAY-402"],
    vendorRefs: ["VEND-VISA-874"],
    keywords: ["latency", "timeouts", "transfers", "payments"],
    isPublished: true,
    content: `# Investigating API latency spikes

## Symptoms
- 95th percentile latency above 3s
- Increased timeout errors for large corporate payloads

## Diagnostics
1. Check API gateway metrics for saturation.
2. Inspect recent deployment notes and feature flags.
3. Review database connection pool utilization.

## Mitigations
- Temporarily increase worker concurrency
- Enable rate limiting for low priority endpoints
- Escalate to infrastructure if saturation persists`,
  },
  {
    id: "KB-1003",
    title: "Resolving mobile login failures",
    summary:
      "Root causes and fixes for intermittent authentication failures on mobile.",
    system: "Digital Channels",
    category: "Digital Channels",
    tags: ["Authentication", "Monitoring"],
    updatedAt: "2026-01-15",
    readTime: "5 min read",
    views: 760,
    rating: 4.4,
    ratingCount: 51,
    caseRef: "CT-1044",
    jiraRefs: ["JIRA-DIGI-198"],
    vendorRefs: [],
    keywords: ["login", "mobile", "auth", "token"],
    isPublished: true,
    content: `# Resolving mobile login failures

## What to check
- Identity provider status
- Token expiry thresholds
- Mobile app release notes

## Resolution
1. Clear server-side token cache for affected tenants.
2. Reissue refresh tokens where applicable.
3. Confirm login success across Android and iOS.`,
  },
  {
    id: "KB-1004",
    title: "Treasury reconciliation mismatch playbook",
    summary:
      "Handling mismatches between daily reconciliation totals and treasury feeds.",
    system: "Treasury",
    category: "Treasury",
    tags: ["Reconciliation", "Compliance"],
    updatedAt: "2026-01-12",
    readTime: "8 min read",
    views: 530,
    rating: 4.1,
    ratingCount: 38,
    caseRef: "CT-1045",
    jiraRefs: ["JIRA-TREAS-77"],
    vendorRefs: ["VEND-REUTERS-2201"],
    keywords: ["reconciliation", "treasury", "fx", "feeds"],
    isPublished: true,
    content: `# Treasury reconciliation mismatch playbook

## Required inputs
- Daily control report
- Treasury FX feed snapshot

## Steps
1. Identify missing or duplicated entries.
2. Validate FX rates against trusted sources.
3. Re-run reconciliation after correcting feed issues.`,
  },
  {
    id: "KB-1005",
    title: "ATM switch outage quick response",
    summary:
      "Immediate actions for ATM balance inquiry outages and switch failures.",
    system: "ATM Switch",
    category: "Incident Response",
    tags: ["SLA", "Monitoring"],
    updatedAt: "2026-01-10",
    readTime: "4 min read",
    views: 690,
    rating: 4.0,
    ratingCount: 45,
    caseRef: "CT-1047",
    jiraRefs: ["JIRA-ATM-35"],
    vendorRefs: ["VEND-NCR-556"],
    keywords: ["atm", "switch", "outage", "balance"],
    isPublished: true,
    content: `# ATM switch outage quick response

## Immediate actions
- Validate switch health checks
- Failover to secondary route if primary is degraded
- Notify branch operations of expected delays`,
  },
  {
    id: "KB-1006",
    title: "User access requests for incident consoles",
    summary:
      "Granting and auditing access to incident management consoles.",
    system: "Core Banking",
    category: "Operations",
    tags: ["Access", "Compliance"],
    updatedAt: "2026-01-08",
    readTime: "6 min read",
    views: 410,
    rating: 4.7,
    ratingCount: 29,
    caseRef: "CT-1046",
    jiraRefs: ["JIRA-OPS-88"],
    vendorRefs: [],
    keywords: ["access", "roles", "audit", "permissions"],
    isPublished: false,
    content: `# User access requests for incident consoles

## Access levels
- Viewer
- Responder
- Admin

## Approval
All admin access requests require compliance approval and logging.`,
  },
];

export const knowledgeRelatedMap = {
  "KB-1001": ["KB-1004", "KB-1005"],
  "KB-1002": ["KB-1003"],
  "KB-1003": ["KB-1002"],
  "KB-1004": ["KB-1001"],
  "KB-1005": ["KB-1001"],
};
