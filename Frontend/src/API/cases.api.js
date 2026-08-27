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


    const jiraRefs =
        Array.isArray(c.jiraRefs)
            ? c.jiraRefs
            : [];


    const vendorRefs =
        Array.isArray(c.vendorRefs)
            ? c.vendorRefs
            : [];


    return {

        id:
            c.id != null
                ? String(c.id)
                : "",

        caseId:
        c.id,

        system:
            c.systemName ||
            c.system ||
            "",

        status:
            statusToDisplay(c.status) ||
            "In progress",

        priority:
            c.priority ||
            "Medium",

        assignedTo:
            c.assignedTo ||
            "Unassigned",

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

        jiraRefs,

        vendorRefs,

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

    const jiraRefs =
        typeof c.jiraRefs === "string"

            ? c.jiraRefs
                .split(",")
                .map((x) => x.trim())
                .filter(Boolean)

            : Array.isArray(c.jiraRefs)
                ? c.jiraRefs
                : [];


    const vendorRefs =
        typeof c.vendorRefs === "string"

            ? c.vendorRefs
                .split(",")
                .map((x) => x.trim())
                .filter(Boolean)

            : Array.isArray(c.vendorRefs)
                ? c.vendorRefs
                : [];


    return {

        title:
            c.summary ||
            c.title ||
            "",

        summary:
            c.summary ||
            c.title ||
            "",

        description:
            c.description ||
            "",

        systemName:
            c.system ||
            c.systemName ||
            "",

        priority:
            c.priority ||
            "Medium",

        assignedTo:
            c.assignedTo === "Unassigned"
                ? null
                : c.assignedTo ||
                null,

        status:
            statusToApi(c.status) ||
            "IN_PROGRESS",

        jiraRefs,

        vendorRefs,

        openedAt:
            c.openedAt
                ? new Date(c.openedAt).toISOString()
                : null,
    };
};


// ============================================================
// GET ALL CASES
// ============================================================

export const getCases = async () => {

    const res =
        await api.get("/cases/get");

    const list =
        res.data || [];

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

    const res =
        await api.post(
            "/cases/add",
            mapCaseToApi(payload)
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


    const res =
        await api.put(
            `/cases/update/${numId}`,
            mapCaseToApi(payload)
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

    return response.data;
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