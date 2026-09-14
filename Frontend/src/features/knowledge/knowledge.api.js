import api from "../../services/axios";
import { displayUsername } from "../../utils/displayUsername";

const KB_PATH = "/knowledge-base";

const unwrapList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.documents)) return data.documents;
  return [];
};

const unwrapItem = (data) => {
  if (!data) return null;
  if (data.data && typeof data.data === "object" && !Array.isArray(data.data)) {
    return data.data;
  }
  return data;
};

const splitStr = (s) => {
  if (!s) return [];
  if (Array.isArray(s)) return s;
  return String(s)
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
};

export const mapDocumentFromApi = (a) => {
  if (!a) return null;
  return {
    id: a.id,
    title: a.title || "",
    content: a.content || "",
    system: a.system || a.systemName || a.category || "",
    category: a.system || a.systemName || a.category || "",
    author: displayUsername(
      a.authorUsername,
      a.author,
      a.createdByUsername,
      a.createdBy
    ),
    documentType: a.documentType || "ARTICLE",
    published: a.published !== false,
    tags: splitStr(a.tags),
    tagsRaw: Array.isArray(a.tags) ? a.tags.join(", ") : a.tags || "",
    fileName:
      a.fileName ||
      a.filename ||
      a.originalFilename ||
      a.originalFileName ||
      "",
    fileUrl: a.fileUrl || a.url || a.downloadUrl || "",
    mimeType: a.mimeType || a.contentType || a.fileType || "",
    createdAt: a.createdAt || "",
    updatedAt: a.updatedAt || "",
  };
};

const mapDocumentWrite = (a = {}, file) => {
  const category = a.category || a.system || a.systemName || "";
  const content =
    a.content ||
    (file ? `Uploaded file: ${file.name}` : "");
  return {
    title: a.title || "",
    content,
    category,
    author: a.author || "",
    documentType: a.documentType || "ARTICLE",
    published: a.published !== false,
    tags: Array.isArray(a.tags) ? a.tags.join(",") : a.tagsRaw || a.tags || "",
  };
};

export const getDocuments = async () => {
  const res = await api.get(`${KB_PATH}/documents`);
  return unwrapList(res.data).map(mapDocumentFromApi);
};

export const getDocumentById = async (id) => {
  const res = await api.get(`${KB_PATH}/documents/${id}`);
  return mapDocumentFromApi(unwrapItem(res.data));
};

export const getDocumentsByCategory = async (category) => {
  const res = await api.get(
    `${KB_PATH}/documents/category/${encodeURIComponent(category)}`
  );
  return unwrapList(res.data).map(mapDocumentFromApi);
};

export const createDocument = async (payload, file) => {
  const res = await api.post(
    `${KB_PATH}/documents`,
    mapDocumentWrite(payload, file)
  );
  return mapDocumentFromApi(unwrapItem(res.data));
};

export const updateDocument = async (id, payload, file) => {
  const res = await api.put(
    `${KB_PATH}/documents/${id}`,
    mapDocumentWrite(payload, file)
  );
  return mapDocumentFromApi(unwrapItem(res.data));
};

export const deleteDocument = async (id) => {
  await api.delete(`${KB_PATH}/documents/${id}`);
};

export const downloadDocumentFile = async (doc) => {
  if (doc?.fileUrl) {
    window.open(doc.fileUrl, "_blank", "noopener,noreferrer");
    return;
  }

  const res = await api.get(`${KB_PATH}/documents/${doc.id}/file`, {
    responseType: "blob",
  });
  const disposition = String(res.headers?.["content-disposition"] || "");
  const match = disposition.match(/filename\*?=(?:UTF-8''|"?)([^";]+)/i);
  const fileName =
    (match && decodeURIComponent(match[1].replace(/"/g, ""))) ||
    doc.fileName ||
    `${doc.title || "document"}`;
  const url = window.URL.createObjectURL(res.data);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export const searchDocuments = async (q) => {
  const res = await api.get(`${KB_PATH}/search`, { params: { q } });
  return unwrapList(res.data).map(mapDocumentFromApi);
};

export const aiSearchDocuments = async (question) => {
  const res = await api.post(`${KB_PATH}/ai-search`, null, {
    params: { question },
  });
  const data = unwrapItem(res.data);
  if (typeof data === "string") {
    return { answer: data, documents: [] };
  }
  return {
    answer: data?.answer || data?.response || data?.content || "",
    documents: unwrapList(data?.documents || data?.results).map(mapDocumentFromApi),
  };
};
