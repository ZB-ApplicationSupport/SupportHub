export const filterCases = (items, query, status, priority, system) => {
  return items.filter((item) => {
    const matchesQuery =
      !query ||
      item.id.toLowerCase().includes(query.toLowerCase()) ||
      item.summary.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = !status || item.status === status;
    const matchesPriority = !priority || item.priority === priority;
    const matchesSystem = !system || item.system === system;
    return matchesQuery && matchesStatus && matchesPriority && matchesSystem;
  });
};

export const sortCases = (items, sortKey, direction) => {
  const sorted = [...items].sort((a, b) => {
    if (a[sortKey] < b[sortKey]) return direction === "asc" ? -1 : 1;
    if (a[sortKey] > b[sortKey]) return direction === "asc" ? 1 : -1;
    return 0;
  });
  return sorted;
};
