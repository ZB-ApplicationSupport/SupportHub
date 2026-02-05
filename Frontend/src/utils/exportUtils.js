import * as XLSX from "xlsx";

const pad = (value) => String(value).padStart(2, "0");

const buildTimestamp = (date) =>
  `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}_${pad(
    date.getHours()
  )}${pad(date.getMinutes())}`;

export const exportCasesToExcel = (items) => {
  const columns = [
    { label: "Case ID", key: "id" },
    { label: "Summary", key: "summary" },
    { label: "System", key: "system" },
    { label: "Status", key: "status" },
    { label: "Priority", key: "priority" },
    { label: "Assigned To", key: "assignedTo" },
    { label: "Date Opened", key: "openedAt" },
    { label: "Jira Refs", key: "jiraRefs" },
    { label: "Vendor Refs", key: "vendorRefs" },
  ];

  const rows = items.map((item) =>
    columns.map((column) => {
      const value = item[column.key];
      if (Array.isArray(value)) {
        return value.join(", ");
      }
      return value ?? "";
    })
  );

  const worksheet = XLSX.utils.aoa_to_sheet([
    columns.map((column) => column.label),
    ...rows,
  ]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Cases");

  const filename = `cases_export_${buildTimestamp(new Date())}.xlsx`;
  XLSX.writeFile(workbook, filename);
};
