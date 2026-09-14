import {
    DIRECT_PROMETHEUS_PATH,
    normalizeSourceUrl,
    resolveMonitoringPrometheusSource,
} from "./observability.api";
import { queryPrometheusDataSource } from "./prometheusBackend.api";
import { appConfig } from "../../config/appConfig";

const RATE_INTERVAL = "5m";
const NODE_EXPORTER_JOB = "node";
const ROOT_FS_MOUNTPOINT = "/opt";
const BYTES_PER_GIB = 1024 ** 3;
const HISTORY_RANGES = {
    "5m": 5 * 60,
    "15m": 15 * 60,
    "30m": 30 * 60,
    "1h": 60 * 60,
    "24h": 24 * 60 * 60,
};

export const HOST_LABEL_BY_INSTANCE = appConfig.monitoringHostLabels;

export const MONITORING_SCRAPE_TARGETS = appConfig.monitoringScrapeTargets;

const toPrometheusString = (value) =>
    String(value)
        .replace(/\\/g, "\\\\")
        .replace(/"/g, '\\"');

const hostSelector = (host) =>
    `host="${toPrometheusString(host)}"`;

const instanceSelector = (host) =>
    `instance="${toPrometheusString(host)}"`;

const hostLabelFor = (host) =>
    HOST_LABEL_BY_INSTANCE[String(host)] ||
    (String(host).includes(":") ? undefined : String(host));

const instancesForHost = (host) => {
    const raw = String(host);
    if (raw.includes(":")) {
        return [raw];
    }

    const fromTargets = MONITORING_SCRAPE_TARGETS.find(
        (target) => target.host === raw
    );
    if (fromTargets?.instances?.length) {
        return fromTargets.instances.filter(
            (item) => item && !String(item).includes("::")
        );
    }

    return Object.entries(HOST_LABEL_BY_INSTANCE)
        .filter(([, label]) => label === raw)
        .map(([instance]) => instance)
        .filter((item) => item && !String(item).includes("::"));
};

const grafanaNodeInstance = (host) => {
    const instances = instancesForHost(host);
    return (
        instances.find((item) => String(item).endsWith(":9200")) ||
        instances[0] ||
        null
    );
};

const grafanaSelector = (host) => {
    const node = grafanaNodeInstance(host);
    if (!node) {
        return null;
    }
    return `${instanceSelector(node)}, job="${NODE_EXPORTER_JOB}"`;
};

const aixHostSelector = (host) => {
    const label = hostLabelFor(host);
    return label ? hostSelector(label) : null;
};

const scrapeTargetFor = (host) => {
    const label = hostLabelFor(host) || String(host);
    return MONITORING_SCRAPE_TARGETS.find((target) => target.host === label);
};

export const applicationProcessesFor = (host) => {
    const processes = scrapeTargetFor(host)?.processes;
    if (processes?.length) {
        return processes;
    }
    return ["server1"];
};

const sortServerProcesses = (items) =>
    [...items].sort((a, b) => {
        const aNumber = Number(String(a).match(/\d+$/)?.[0] || 0);
        const bNumber = Number(String(b).match(/\d+$/)?.[0] || 0);
        return aNumber - bNumber || String(a).localeCompare(String(b));
    });

export const getApplicationProcessesForHost = async (host) => {
    const label = hostLabelFor(host) || String(host);
    const instance = appInstanceFor(host);
    const queries = [
        label && `
            app_process_running{
                host="${toPrometheusString(label)}",
                process=~"server[0-9]+"
            } == 1
        `,
        instance && `
            app_process_running{
                instance="${toPrometheusString(instance)}",
                process=~"server[0-9]+"
            } == 1
        `,
    ];

    const processes = new Set();

    for (const query of queries) {
        if (!query) continue;
        try {
            const result = await queryPrometheus(query);
            result.forEach((row) => {
                if (Number(row.value?.[1]) === 1 && row.metric?.process) {
                    processes.add(row.metric.process);
                }
            });
        } catch (error) {
            // Try the next selector before falling back to configured processes.
        }
    }

    return processes.size
        ? sortServerProcesses(processes)
        : applicationProcessesFor(host);
};

const appInstanceFor = (host) => {
    const instances = scrapeTargetFor(host)?.instances || instancesForHost(host);
    return (
        instances.find((item) => String(item).endsWith(":9220")) ||
        instances.find((item) => String(item).endsWith(":9200")) ||
        instances[0] ||
        null
    );
};

const nodeSelector = (host) =>
    aixHostSelector(host) ||
    `${instanceSelector(host)}, job="${NODE_EXPORTER_JOB}"`;

const appProcessSelector = (host, process) => {
    const parts = [];
    const aix = aixHostSelector(host);
    const instance = appInstanceFor(host);
    if (aix) {
        parts.push(aix);
    }
    if (instance) {
        parts.push(instanceSelector(instance));
    }
    parts.push(`process="${toPrometheusString(process)}"`);
    return parts.join(", ");
};

const readFirstValue = (result, errorMessage) => {
    if (!result.length) {
        throw new Error(errorMessage);
    }

    const value = Number(result[0].value?.[1]);

    if (!Number.isFinite(value)) {
        throw new Error(errorMessage);
    }

    return value;
};

const readOptionalValue = (result) => {
    if (!result.length) {
        return null;
    }

    const value = Number(result[0].value?.[1]);
    return Number.isFinite(value) ? value : null;
};

const optionalPercentage = (result) => {
    const value = readOptionalValue(result);
    return value == null ? null : percentage(value);
};

const bytesToGiB = (bytes) =>
    Number((bytes / BYTES_PER_GIB).toFixed(2));

const percentage = (value) =>
    Number(value.toFixed(1));

const getHistoryRange = (range) => {
    const seconds = HISTORY_RANGES[range] || HISTORY_RANGES["5m"];

    return {
        seconds,
        step: Math.max(Math.floor(seconds / 120), 5),
    };
};

const formatDuration = (seconds) => {
    const totalSeconds = Math.max(Math.floor(seconds), 0);

    const days = Math.floor(totalSeconds / 86400);

    const hours = Math.floor(
        (totalSeconds % 86400) / 3600
    );

    const minutes = Math.floor(
        (totalSeconds % 3600) / 60
    );

    if (days > 0) {
        return `${days}d ${hours}h`;
    }

    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }

    return `${minutes}m`;
};

const formatStatusTimestamp = (sampledAt) =>
    sampledAt.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });

const toStatusPoint = (sampleTime, rawValue, process) => {
    const isUp = Number(rawValue) === 1;
    const sampledAt = new Date(Number(sampleTime) * 1000);

    return {
        timestamp: formatStatusTimestamp(sampledAt),
        sampledAt: sampledAt.toISOString(),
        sampleTime: Number(sampleTime),
        status: isUp ? 1 : 0,
        statusValue: isUp ? 1 : 0,
        statusLabel: isUp ? "Up" : "Down",
        process,
    };
};

const collectStatusSamples = (result) => {
    const samples = new Map();

    (result || []).forEach((series) => {
        (series?.values || []).forEach(([sampleTime, rawValue]) => {
            const timestamp = Number(sampleTime);
            if (!Number.isFinite(timestamp)) {
                return;
            }

            const isUp = Number(rawValue) === 1;
            const previous = samples.get(timestamp);
            if (previous == null || isUp) {
                samples.set(timestamp, isUp ? 1 : 0);
            }
        });
    });

    return samples;
};

const lookupStatusSample = (samples, timestamp, step) => {
    if (samples.has(timestamp)) {
        return samples.get(timestamp);
    }

    const tolerance = Math.max(step / 2, 1);
    let nearestValue = null;
    let nearestDistance = Infinity;

    samples.forEach((value, sampleTime) => {
        const distance = Math.abs(sampleTime - timestamp);
        if (distance <= tolerance && distance < nearestDistance) {
            nearestDistance = distance;
            nearestValue = value;
        }
    });

    return nearestValue;
};

const buildFilledStatusHistory = (
    samples,
    start,
    end,
    step,
    process
) => {
    const history = [];
    const safeStep = Math.max(Number(step) || 5, 1);
    const rangeStart = Number(start);
    const rangeEnd = Number(end);

    if (!Number.isFinite(rangeStart) || !Number.isFinite(rangeEnd)) {
        return history;
    }

    for (let timestamp = rangeStart; timestamp <= rangeEnd; timestamp += safeStep) {
        const value = lookupStatusSample(samples, timestamp, safeStep);
        history.push(toStatusPoint(timestamp, value, process));
    }

    return history;
};


const unwrapPrometheusSeries = (payload) => {
    if (!payload) {
        return [];
    }
    if (Array.isArray(payload)) {
        return payload;
    }

    const nested =
        payload.data?.result ??
        payload.data?.data?.result ??
        payload.result ??
        payload.data;

    if (Array.isArray(nested)) {
        return nested;
    }
    if (Array.isArray(nested?.result)) {
        return nested.result;
    }

    return [];
};

const asInstantVector = (series) =>
    (series || [])
        .map((item) => {
            if (item?.value) {
                return item;
            }
            const values = item?.values;
            if (Array.isArray(values) && values.length) {
                return {
                    ...item,
                    value: values[values.length - 1],
                };
            }
            return item;
        })
        .filter((item) => item?.value);

const asRangeMatrix = (series) =>
    (series || [])
        .map((item) => {
            if (Array.isArray(item?.values) && item.values.length) {
                return item;
            }
            if (item?.value) {
                return {
                    ...item,
                    values: [item.value],
                };
            }
            return item;
        })
        .filter((item) => Array.isArray(item?.values) && item.values.length);

const latestSampleTime = (series) => {
    let latest = NaN;

    (series || []).forEach((item) => {
        const points = Array.isArray(item?.values) && item.values.length
            ? item.values
            : item?.value
                ? [item.value]
                : [];

        points.forEach((point) => {
            const timestamp = Number(point?.[0]);
            if (Number.isFinite(timestamp) && (Number.isNaN(latest) || timestamp > latest)) {
                latest = timestamp;
            }
        });
    });

    return latest;
};

const readPrometheusJson = async (response, errorMessage) => {
    if (!response.ok) {
        throw new Error(`${errorMessage}: ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== "success") {
        throw new Error(errorMessage);
    }

    return data.data?.result || [];
};

const queryBackendPrometheus = async (query, rangeOptions = {}) => {
    const source = await resolveMonitoringPrometheusSource();
    if (!source?.id) {
        throw new Error("No backend Prometheus data source is configured");
    }

    const payload = await queryPrometheusDataSource(source.id, query, rangeOptions);
    return unwrapPrometheusSeries(payload);
};

const prometheusQueryUrl = (baseUrl, path) =>
    `${normalizeSourceUrl(baseUrl)}/api/v1/${path}`;

const prometheusUrlsFor = () =>
    [normalizeSourceUrl(DIRECT_PROMETHEUS_PATH)].filter(Boolean);

const queryPrometheusAtUrl = async (baseUrl, query) => {
    const response = await fetch(
        `${prometheusQueryUrl(baseUrl, "query")}?query=${encodeURIComponent(
            query.trim()
        )}`
    );

    return readPrometheusJson(
        response,
        "Prometheus request failed"
    );
};

const queryPrometheusRangeAtUrl = async (
    baseUrl,
    query,
    start,
    end,
    step
) => {
    const params = new URLSearchParams({
        query: query.trim(),
        start: String(start),
        end: String(end),
        step: String(step),
    });

    const response = await fetch(
        `${prometheusQueryUrl(baseUrl, "query_range")}?${params.toString()}`
    );

    return readPrometheusJson(
        response,
        "Prometheus range request failed"
    );
};

/**
 * Instant PromQL against the BSS Prometheus data-source API.
 */
export const queryPrometheus = async (query) => {
    let lastError = null;

    try {
        const backendResult = asInstantVector(await queryBackendPrometheus(query));
        if (backendResult.length) {
            return backendResult;
        }
    } catch (error) {
        lastError = error;
    }

    for (const url of prometheusUrlsFor()) {
        try {
            return await queryPrometheusAtUrl(url, query);
        } catch (error) {
            lastError = error;
        }
    }

    throw lastError || new Error("Prometheus request failed");
};

const queryPrometheusRangeWindow = async (
    query,
    range = "5m",
    anchorQuery = query
) => {
    const { seconds, step } = getHistoryRange(range);
    let result = [];

    const latestResult = await queryPrometheus(query);
    const anchorResult = latestResult.length > 0
        ? latestResult
        : await queryPrometheus(anchorQuery);
    const latestTimestamp = Number(
        anchorResult[0]?.value?.[0] ?? latestSampleTime(result)
    );
    const end = Number.isFinite(latestTimestamp)
        ? Math.floor(latestTimestamp)
        : Math.floor(Date.now() / 1000);
    const start = end - seconds;

    const hasRange = result.some(
        (series) => (series.values?.length || 0) > 1
    );

    if (!hasRange) {
        try {
            result = asRangeMatrix(
                await queryBackendPrometheus(query, { start, end, step })
            );
            if (!result.length) {
                throw new Error("Backend Prometheus range query returned no data");
            }
        } catch (error) {
            for (const url of prometheusUrlsFor()) {
                try {
                    result = asRangeMatrix(
                        await queryPrometheusRangeAtUrl(
                            url,
                            query,
                            start,
                            end,
                            step
                        )
                    );
                    if (result.length) {
                        break;
                    }
                } catch (fallbackError) {
                    // Try the next Prometheus URL.
                }
            }
        }
    }

    return {
        result,
        start,
        end,
        step,
    };
};

export const queryPrometheusRange = async (
    query,
    range = "5m",
    anchorQuery = query
) => {
    const window = await queryPrometheusRangeWindow(
        query,
        range,
        anchorQuery
    );

    return window.result;
};

const firstOptionalValueFromQueries = async (queries) => {
    for (const query of queries) {
        if (!query) {
            continue;
        }
        const result = await queryPrometheus(query);
        const value = readOptionalValue(result);
        if (value != null) {
            return value;
        }
    }
    return null;
};

const firstSeriesFromQueries = async (queries) => {
    for (const query of queries) {
        if (!query) {
            continue;
        }
        const result = await queryPrometheus(query);
        if (result.length) {
            return result;
        }
    }
    return [];
};

const grafanaCpuBusyQuery = (host) => {
    const selector = grafanaSelector(host);
    if (!selector) {
        return null;
    }
    return `
        100 * (
            1 - avg(
                rate(
                    node_cpu_seconds_total{
                        mode="idle",
                        ${selector}
                    }[${RATE_INTERVAL}]
                )
            )
        )
    `;
};

const grafanaSystemLoadQuery = (node) => {
    if (!node) {
        return null;
    }
    const instance = toPrometheusString(node);
    return `
        scalar(
            node_load1{
                instance="${instance}",
                job="${NODE_EXPORTER_JOB}"
            }
        ) * 100
        /
        count(
            count(
                node_cpu_seconds_total{
                    instance="${instance}",
                    job="${NODE_EXPORTER_JOB}"
                }
            ) by (cpu)
        )
    `;
};


/**
 * Total physical RAM.
 *
 * Grafana node exporter uses node_memory_total_bytes on :9200.
 * AIX exporter uses node_memory_MemTotal_bytes with host=.
 *
 * Returns GiB.
 */
export const getRamTotal = async (host) => {
    const grafana = grafanaSelector(host);
    const aix = aixHostSelector(host);
    const bytes = await firstOptionalValueFromQueries([
        grafana && `node_memory_total_bytes{${grafana}}`,
        aix && `node_memory_MemTotal_bytes{${aix}}`,
        grafana && `node_memory_MemTotal_bytes{${grafana}}`,
    ]);

    return bytes == null ? null : bytesToGiB(bytes);
};


/**
 * Total /opt filesystem size.
 *
 * Returns GiB.
 */
export const getRootFSTotal = async (host) => {
    const grafana = grafanaSelector(host);
    const aix = aixHostSelector(host);
    const bytes = await firstOptionalValueFromQueries([
        grafana && `
            node_filesystem_size_bytes{
                ${grafana},
                mountpoint="${ROOT_FS_MOUNTPOINT}"
            }
        `,
        aix && `
            node_filesystem_size_bytes{
                ${aix},
                mountpoint="${ROOT_FS_MOUNTPOINT}"
            }
        `,
    ]);

    return bytes == null ? null : bytesToGiB(bytes);
};


/**
 * Number of CPU cores.
 */
export const getCPUCores = async (host) => {
    const grafana = grafanaSelector(host);
    const aix = aixHostSelector(host);

    return firstOptionalValueFromQueries([
        grafana && `
            count(
                count(
                    node_cpu_seconds_total{
                        ${grafana}
                    }
                ) by (cpu)
            )
        `,
        aix && `
            node_cpu_logical_count{
                ${aix}
            }
        `,
    ]);
};


/**
 * Application/server uptime.
 *
 * The node exporter host is :9220.
 * The application metrics host is :9090.
 *
 * Returns seconds.
 */
export const getServerUptimeSeconds = async (host) => {
    const aix = aixHostSelector(host);
    const grafana = grafanaSelector(host);

    return firstOptionalValueFromQueries([
        aix && `
            node_uptime_seconds{
                ${aix}
            }
        `,
        grafana && `
            node_uptime_seconds{
                ${grafana}
            }
        `,
    ]);
};


/**
 * Formatted uptime for the overview card.
 */
export const getServerUptime = async (host) => {
    const seconds =
        await getServerUptimeSeconds(host);

    if (seconds == null) {
        return "Unavailable";
    }

    return formatDuration(seconds);
};


/**
 * CPU Busy from the AIX exporter snapshot:
 * 100 - node_cpu_percent{host="$host",mode="idle"}
 *
 * Grafana rate() on :9200 is a windowed average and does not match
 * that panel, so it is only used when node_cpu_percent is absent.
 */
export const getCpuUsage = async (host) => {
    const aix = aixHostSelector(host);
    const value = await firstOptionalValueFromQueries([
        aix && `
            100 - node_cpu_percent{
                ${aix},
                mode="idle"
            }
        `,
        grafanaCpuBusyQuery(host),
    ]);

    return value == null ? null : percentage(value);
};


/**
 * System load as a percentage of CPU cores.
 *
 * Grafana:
 * scalar(node_load1{instance="$node",job="$job"}) * 100
 *   / count(count(node_cpu_seconds_total{instance="$node",job="$job"}) by (cpu))
 *
 * $job is node. $node is the configured node-exporter scrape target.
 * Some environments do not export node_load1 or node_cpu_seconds_total.
 */
export const getSystemLoad = async (host) => {
    const aix = aixHostSelector(host);
    const nodes = [];
    const preferred = grafanaNodeInstance(host);
    if (preferred) {
        nodes.push(preferred);
    }
    instancesForHost(host).forEach((instance) => {
        if (!nodes.includes(instance)) {
            nodes.push(instance);
        }
    });

    const value = await firstOptionalValueFromQueries([
        ...nodes.map((node) => grafanaSystemLoadQuery(node)),
        aix && `
            (
                node_load1{
                    ${aix}
                }
                /
                node_cpu_logical_count{
                    ${aix}
                }
            ) * 100
        `,
        aix && `
            100 - node_cpu_percent{
                ${aix},
                mode="idle"
            }
        `,
    ]);

    return value == null ? null : percentage(value);
};

/**
 * Raw 1-minute load average from node_load1.
 */
export const getSystemLoadAverage = async (host) => {
    const grafana = grafanaSelector(host);
    const aix = aixHostSelector(host);
    const value = await firstOptionalValueFromQueries([
        grafana && `node_load1{${grafana}}`,
        aix && `node_load1{${aix}}`,
    ]);

    return value == null ? null : Number(value.toFixed(2));
};


/**
 * RAM usage percentage.
 *
 * Grafana: (1 - available / total) * 100
 * AIX: MemUsed / MemTotal * 100
 */
export const getRAMUsage = async (host) => {
    const grafana = grafanaSelector(host);
    const aix = aixHostSelector(host);
    const value = await firstOptionalValueFromQueries([
        grafana && `
            clamp_min(
                (
                    1 - (
                        node_memory_available_bytes{
                            ${grafana}
                        }
                        /
                        node_memory_total_bytes{
                            ${grafana}
                        }
                    )
                ) * 100,
                0
            )
        `,
        aix && `
            (
                node_memory_MemUsed_bytes{
                    ${aix}
                }
                /
                node_memory_MemTotal_bytes{
                    ${aix}
                }
            ) * 100
        `,
    ]);

    return value == null ? null : percentage(value);
};


/**
 * Root filesystem usage percentage.
 */
export const getRootFSUsage = async (host) => {
    const grafana = grafanaSelector(host);
    const aix = aixHostSelector(host);
    const value = await firstOptionalValueFromQueries([
        grafana && `
            (
                (
                    node_filesystem_size_bytes{
                        ${grafana},
                        mountpoint="${ROOT_FS_MOUNTPOINT}"
                    }
                    -
                    node_filesystem_avail_bytes{
                        ${grafana},
                        mountpoint="${ROOT_FS_MOUNTPOINT}"
                    }
                )
                /
                node_filesystem_size_bytes{
                    ${grafana},
                    mountpoint="${ROOT_FS_MOUNTPOINT}"
                }
            ) * 100
        `,
        aix && `
            (
                node_filesystem_used_bytes{
                    ${aix},
                    mountpoint="${ROOT_FS_MOUNTPOINT}"
                }
                /
                node_filesystem_size_bytes{
                    ${aix},
                    mountpoint="${ROOT_FS_MOUNTPOINT}"
                }
            ) * 100
        `,
    ]);

    return value == null ? null : percentage(value);
};


/**
 * Application running status.
 *
 * Returns:
 *   1 = running
 *   0 = not running
 */
export const getApplicationStatus = async (
    host,
    process = "server1"
) => {
    const result = await queryPrometheus(`
        app_process_running{
            ${appProcessSelector(host, process)}
        }
    `);

    const value = readOptionalValue(result);
    return value == null ? 0 : value;
};

export const getApplicationStatusHistory = async (
    host,
    process = "server1",
    range = "5m"
) => {
    const query = `
        app_process_running{
            ${appProcessSelector(host, process)}
        }
    `;

    const window = await queryPrometheusRangeWindow(query, range);
    const samples = collectStatusSamples(window.result);

    return buildFilledStatusHistory(
        samples,
        window.start,
        window.end,
        window.step,
        process
    );
};


/**
 * Existing compatibility helpers.
 */
export const getMemoryUsage = async (host) => {
    return getRamTotal(host);
};

export const getDiskUsage = async (host) => {
    const rows = await getDiskUsageBreakdown(host);
    if (!rows.length) {
        return null;
    }
    return rows[0].usedPercentage;
};

const mapDiskBreakdown = (result) =>
    result
        .map((item) => {
            const usedPercentage = Number(item.value?.[1]);
            const name =
                item.metric?.mountpoint ||
                item.metric?.device ||
                "Unknown";

            return {
                name,
                usedPercentage: percentage(usedPercentage),
                freePercentage: percentage(100 - usedPercentage),
            };
        })
        .filter((item) =>
            item.name !== "/proc" &&
            item.name !== "/aha" &&
            Number.isFinite(item.usedPercentage) &&
            Number.isFinite(item.freePercentage)
        )
        .sort((a, b) => b.usedPercentage - a.usedPercentage);

export const getDiskUsageBreakdown = async (host) => {
    const grafana = grafanaSelector(host);
    const aix = aixHostSelector(host);
    const result = await firstSeriesFromQueries([
        grafana && `
            (
                (
                    node_filesystem_size_bytes{
                        ${grafana},
                        device!~"rootfs"
                    }
                    -
                    node_filesystem_avail_bytes{
                        ${grafana},
                        device!~"rootfs"
                    }
                )
                /
                node_filesystem_size_bytes{
                    ${grafana},
                    device!~"rootfs"
                }
            ) * 100
        `,
        aix && `
            (
                node_filesystem_used_bytes{
                    ${aix}
                }
                /
                node_filesystem_size_bytes{
                    ${aix}
                }
            ) * 100
        `,
    ]);

    return mapDiskBreakdown(result);
};


/**
 * Export the formatter so the dashboard can format
 * uptime-history values consistently.
 */
export { formatDuration };