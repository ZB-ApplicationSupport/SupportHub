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

const excelCell = (value) => {
  if (value == null) return "";
  if (Array.isArray(value)) return value.join(", ");
  if (value instanceof Date) return value;
  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch (error) {
      return String(value);
    }
  }
  return value;
};

export const exportRowsToExcel = (
  rows = [],
  { filename = "extract.xlsx", sheetName = "Extract" } = {}
) => {
  const columns = [];
  const seen = new Set();
  rows.forEach((row) => {
    if (!row || typeof row !== "object") return;
    Object.keys(row).forEach((key) => {
      if (seen.has(key)) return;
      seen.add(key);
      columns.push(key);
    });
  });

  const worksheet = XLSX.utils.aoa_to_sheet([
    columns,
    ...rows.map((row) => columns.map((column) => excelCell(row?.[column]))),
  ]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName.slice(0, 31));
  XLSX.writeFile(
    workbook,
    filename.endsWith(".xlsx") ? filename : `${filename}.xlsx`
  );
};

export const exportTimestamp = () => buildTimestamp(new Date());
