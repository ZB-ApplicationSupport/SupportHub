import {
    getRamTotal,
    getRootFSTotal,
    getCPUCores,
    getServerUptime,
    getServerUptimeSeconds,
    getCpuUsage,
    getSystemLoad,
    getSystemLoadAverage,
    getRAMUsage,
    getRootFSUsage,
    getApplicationStatus,
    getApplicationStatusHistory,
    getMemoryUsage,
    getDiskUsage,
    getDiskUsageBreakdown,
} from "./prometheus.api";


export const getServerRamTotal = async (host) => {
    return getRamTotal(host);
};


export const getServerRootFSTotal = async (host) => {
    return getRootFSTotal(host);
};


export const getServerCPUCores = async (host) => {
    return getCPUCores(host);
};


export const getAppServerUptime = async (host) => {
    return getServerUptime(host);
};


/**
 * Raw uptime in seconds.
 *
 * Used by the real-time uptime graph.
 */
export const getAppServerUptimeSeconds = async (host) => {
    return getServerUptimeSeconds(host);
};


export const getServerCpuUsage = async (host) => {
    return getCpuUsage(host);
};


export const getServerSystemLoad = async (host) => {
    return getSystemLoad(host);
};

export const getServerSystemLoadAverage = async (host) => {
    return getSystemLoadAverage(host);
};


export const getServerRAMUsage = async (host) => {
    return getRAMUsage(host);
};


export const getServerRootFSUsage = async (host) => {
    return getRootFSUsage(host);
};


export const getServerAppStatus = async (
    host,
    process
) => {
    return getApplicationStatus(host, process);
};


export const getServerAppStatusHistory = async (
    host,
    process,
    range
) => {
    return getApplicationStatusHistory(
        host,
        process,
        range
    );
};


export const getServerMemoryUsage = async (host) => {
    return getMemoryUsage(host);
};


export const getServerDiskSpaceUsage = async (host) => {
    return getDiskUsage(host);
};


export const getServerDiskUsageBreakdown = async (host) => {
    return getDiskUsageBreakdown(host);
};