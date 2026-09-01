import api from "./axios";


// ============================================================
// BACKEND STATUS -> FRONTEND DISPLAY STATUS
// ============================================================

const statusToDisplay = (s) => {
    if (!s) return "";

    const map = {
        IN_PROGRESS: "In progress",
        AWAITING_VENDOR: "Awaiting vendor",
        IN_UAT: "In UAT",
        RESOLVED: "Resolved",
    };

    return map[s] || s;
};


// ============================================================
// FRONTEND DISPLAY STATUS -> BACKEND ENUM
// ============================================================

const statusToApi = (s) => {
    if (!s) return "";

    const map = {
        "In progress": "IN_PROGRESS",
        "Awaiting vendor": "AWAITING_VENDOR",
        "In UAT": "IN_UAT",
        "Resolved": "RESOLVED",
    };

    return (
        map[s] ||
        s
            .toString()
            .toUpperCase()
            .replace(/\s+/g, "_")
    );
};


// ============================================================
// MAP BACKEND CASE -> FRONTEND CASE
// ============================================================

export const mapCaseFromApi = (c) => {
    if (!c) return null;

    const openedAt =
        c.openedAt
            ? new Date(c.openedAt)
                .toISOString()
                .slice(0, 10)
            : c.createdAt
                ? new Date(c.createdAt)
                    .toISOString()
                    .slice(0, 10)
                : "";

    return {
        id:
            c.id != null
                ? String(c.id)
                : "",

        caseId:
        c.id,

        supportSystemId:
            c.supportSystemId != null
                ? Number(c.supportSystemId)
                : null,

        system:
            c.supportSystemName ||
            c.systemName ||
            c.system ||
            "",

        assignedToId:
            c.assignedToId != null
                ? Number(c.assignedToId)
                : null,

        assignedTo:
            c.assignedTo ||
            "Unassigned",

        status:
            statusToDisplay(c.status) ||
            "In progress",

        priority:
            c.priority ||
            "Medium",

        openedAt,

        summary:
            c.summary ||
            c.title ||
            "",

        title:
            c.title ||
            c.summary ||
            "",

        description:
            c.description ||
            "",

        createdAt:
        c.createdAt,

        lastUpdatedAt:
        c.lastUpdatedAt,

        createdByEmail:
        c.createdByEmail,
    };
};


// ============================================================
// MAP FRONTEND CASE -> BACKEND PAYLOAD
// ============================================================

export const mapCaseToApi = (c) => {
    const payload = {};

    /*
     * SUMMARY
     */

    if (
        c.summary !== undefined ||
        c.title !== undefined
    ) {
        payload.summary =
            c.summary ||
            c.title ||
            "";
    }

    /*
     * DESCRIPTION
     */

    if (c.description !== undefined) {
        payload.description =
            c.description || "";
    }

    /*
     * SUPPORT SYSTEM
     */

    if (c.supportSystemId !== undefined) {
        payload.supportSystemId =
            c.supportSystemId !== null &&
            c.supportSystemId !== ""
                ? Number(c.supportSystemId)
                : null;
    }

    /*
     * PRIORITY
     */

    if (c.priority !== undefined) {
        payload.priority =
            c.priority || "Medium";
    }

    /*
     * ASSIGNEE
     *
     * IMPORTANT:
     * Always use assignedToId.
     *
     * Do NOT send username here.
     */

    if (c.assignedToId !== undefined) {
        payload.assignedToId =
            c.assignedToId !== null &&
            c.assignedToId !== ""
                ? Number(c.assignedToId)
                : null;
    }

    /*
     * STATUS
     */

    if (c.status !== undefined) {
        payload.status =
            statusToApi(c.status) ||
            "IN_PROGRESS";
    }

    return payload;
};


// ============================================================
// GET ALL CASES
// ============================================================

export const getCases = async () => {
    const res =
        await api.get("/cases/get");

    const list =
        Array.isArray(res.data)
            ? res.data
            : [];

    return list.map(mapCaseFromApi);
};


// ============================================================
// GET CASE BY ID
// ============================================================

export const getCaseById = async (id) => {
    const numId =
        typeof id === "string" &&
        id.startsWith("CT-")
            ? id.replace("CT-", "")
            : id;

    const res =
        await api.get(
            `/cases/get/${numId}`
        );

    return mapCaseFromApi(
        res.data
    );
};


// ============================================================
// CREATE CASE
// ============================================================

export const createCase = async (payload) => {
    const apiPayload =
        mapCaseToApi(payload);

    console.log(
        "=== CREATE CASE ==="
    );

    console.log(
        "Original payload:",
        payload
    );

    console.log(
        "API payload:",
        apiPayload
    );

    const res =
        await api.post(
            "/cases/add",
            apiPayload
        );

    return mapCaseFromApi(
        res.data
    );
};


// ============================================================
// UPDATE CASE
// ============================================================

export const updateCase = async (
    id,
    payload
) => {
    const numId =
        typeof id === "string" &&
        id.startsWith("CT-")
            ? id.replace("CT-", "")
            : id;

    const apiPayload =
        mapCaseToApi(payload);

    console.log(
        "================================"
    );

    console.log(
        "=== UPDATE CASE ==="
    );

    console.log(
        "CASE ID:",
        numId
    );

    console.log(
        "ORIGINAL PAYLOAD:",
        payload
    );

    console.log(
        "API PAYLOAD:",
        apiPayload
    );

    console.log(
        "ASSIGNED TO ID:",
        apiPayload.assignedToId
    );

    console.log(
        "================================"
    );

    const res =
        await api.put(
            `/cases/update/${numId}`,
            apiPayload
        );

    console.log(
        "UPDATE RESPONSE:",
        res.data
    );

    return mapCaseFromApi(
        res.data
    );
};


// ============================================================
// GET ENABLED USERS / ASSIGNEES
// ============================================================

export const getAssignees = async () => {
    const response =
        await api.get(
            "/users/assignees"
        );

    return Array.isArray(response.data)
        ? response.data
        : [];
};


// ============================================================
// GET SUPPORT SYSTEMS
// ============================================================

export const getSystems = async () => {
    const response =
        await api.get(
            "/systems"
        );

    return Array.isArray(response.data)
        ? response.data
        : [];
};