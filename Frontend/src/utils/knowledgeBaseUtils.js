export const filterArticles = (items, query, system, category, tag) => {
  return items.filter((item) => {
    const keywords = item.keywords || [];
    const matchesQuery =
      !query ||
      (item.title || "").toLowerCase().includes(query.toLowerCase()) ||
      (item.summary || "").toLowerCase().includes(query.toLowerCase()) ||
      keywords.some((word) =>
        String(word).toLowerCase().includes(query.toLowerCase())
      );
    const matchesSystem = !system || item.system === system;
    const matchesCategory = !category || item.category === category;
    const tags = item.tags || [];
    const matchesTag = !tag || tags.includes(tag);
    return matchesQuery && matchesSystem && matchesCategory && matchesTag;
  });
};

export const sortArticles = (items, sortKey) => {
  const sorted = [...items];
  if (sortKey === "recent") {
    return sorted.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
  }
  if (sortKey === "views") {
    return sorted.sort((a, b) => b.views - a.views);
  }
  if (sortKey === "rating") {
    return sorted.sort((a, b) => b.rating - a.rating);
  }
  return sorted;
};

export const getRelatedArticles = (items, relatedMap, currentId) => {
  const relatedIds = relatedMap[currentId] || [];
  return items.filter((item) => relatedIds.includes(item.id));
};
