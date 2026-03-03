import api from "./axios";

const splitStr = (s) => {
  if (!s) return [];
  if (Array.isArray(s)) return s;
  return s.split(",").map((x) => x.trim()).filter(Boolean);
};

const formatDate = (d) => (d ? new Date(d).toISOString().slice(0, 10) : "");

export const mapArticleFromApi = (a) => {
  if (!a) return null;
  return {
    id: a.id != null ? `KB-${a.id}` : "",
    numericId: a.id,
    title: a.title || "",
    summary: a.summary || "",
    system: a.systemName || "",
    tags: splitStr(a.tags),
    updatedAt: formatDate(a.updatedAt),
    caseRef: a.caseRef || "",
    jiraRefs: splitStr(a.jiraRefs),
    vendorRefs: splitStr(a.vendorRefs),
    keywords: splitStr(a.keywords),
    content: a.content || "",
  };
};

export const mapArticleToApi = (a) => ({
  title: a.title,
  summary: a.summary,
  systemName: a.system,
  tags: Array.isArray(a.tags) ? a.tags.join(", ") : a.tags,
  caseRef: a.caseRef,
  jiraRefs: Array.isArray(a.jiraRefs) ? a.jiraRefs.join(", ") : a.jiraRefs,
  vendorRefs: Array.isArray(a.vendorRefs) ? a.vendorRefs.join(", ") : a.vendorRefs,
  keywords: Array.isArray(a.keywords) ? a.keywords.join(", ") : a.keywords,
  content: a.content,
});

export const getArticles = async (publishedOnly = false) => {
  const res = await api.get("/knowledge", {
    params: publishedOnly ? { publishedOnly: true } : {},
  });
  return (res.data || []).map(mapArticleFromApi);
};

export const getArticleById = async (id) => {
  const numId = typeof id === "string" && id.startsWith("KB-") ? id.replace("KB-", "") : id;
  const res = await api.get(`/knowledge/${numId}`);
  return mapArticleFromApi(res.data);
};

export const createArticle = async (payload) => {
  const res = await api.post("/knowledge", mapArticleToApi(payload));
  return mapArticleFromApi(res.data);
};

export const updateArticle = async (id, payload) => {
  const numId = typeof id === "string" && id.startsWith("KB-") ? id.replace("KB-", "") : id;
  const res = await api.put(`/knowledge/${numId}`, mapArticleToApi(payload));
  return mapArticleFromApi(res.data);
};

export const deleteArticle = async (id) => {
  const numId = typeof id === "string" && id.startsWith("KB-") ? id.replace("KB-", "") : id;
  await api.delete(`/knowledge/${numId}`);
};
