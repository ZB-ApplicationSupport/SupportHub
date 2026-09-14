import React, { useEffect, useMemo, useState } from "react";
import {
  Badge,
  Box,
  Flex,
  SimpleGrid,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { FiDownload } from "react-icons/fi";
import {
  AppModal,
  DataTableShell,
  ModalCancelButton,
  PageOutlineButton,
} from "../../../components/ui";
import { exportRowsToExcel, exportTimestamp } from "../../../utils/exportUtils";
import { attentionForCount } from "../automations.data";
import {
  getAutomationClassificationCounts,
  getAutomationExtract,
} from "../automations.api";

const PAGE_SIZE = 25;

const PREFERRED_COLUMNS = [
  "ACCOUNTID",
  "SETTLEMENTACCOUNTID",
  "FUNDINGACCOUNT",
  "REDUCINGPRINCIPAL",
  "LOANSTATUS",
  "PRODUCTID",
  "LOANSTARTDATE",
  "FINALMATURITYDATE",
  "UBMORATORIUMENDDT",
  "UBOFFEREDMORATORIUM",
  "BRANCHSORTCODE",
  "ISOCURRENCYCODE",
  "CLEAREDBALANCE",
  "BOOKEDBALANCE",
  "BLOCKEDBALANCE",
  "TOTAL_STATIC_BLOCK",
  "UBRETRYAMOUNTDUE",
  "COMBINED_REQUIRED_BLOCK",
  "CREDITLIMIT",
  "LIM_CREDITLIMIT",
  "DEBITLIMIT",
  "PRODUCTCONTEXTCODE",
  "UBACCOUNTSTATUS",
  "SCRIPT",
  "CODE",
  "POSTINGDATE",
  "SCHEDULED_REPAYMENT_AMT",
];

const formatCount = (value) =>
  value == null ? "—" : Number(value).toLocaleString("en-GB");

const formatCell = (value) => {
  if (value == null || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number") return Number(value).toLocaleString("en-GB");
  if (typeof value === "object") {
    if (value instanceof Date) return value.toISOString().slice(0, 10);
    try {
      return JSON.stringify(value);
    } catch (error) {
      return String(value);
    }
  }
  return String(value);
};

const extractColumns = (rows = []) => {
  const keys = new Set();
  rows.slice(0, 20).forEach((row) => {
    if (row && typeof row === "object") {
      Object.keys(row).forEach((key) => keys.add(key));
    }
  });
  const columns = Array.from(keys);
  const accountIndex = columns.findIndex(
    (key) => key.toUpperCase() === "ACCOUNTID"
  );
  if (accountIndex > 0) {
    const [account] = columns.splice(accountIndex, 1);
    columns.unshift(account);
  }
  return columns;
};

const pickDisplayColumns = (columns, showAll) => {
  if (showAll) return columns;
  const byUpper = new Map(columns.map((column) => [column.toUpperCase(), column]));
  const preferred = PREFERRED_COLUMNS.map((name) => byUpper.get(name)).filter(
    Boolean
  );
  if (preferred.length >= 4) return preferred;
  return columns.slice(0, 10);
};

const AutomationExtractModal = ({ isOpen, onClose, stat, initialClassificationId }) => {
  const classifications = stat?.classifications || [];

  const [selectedId, setSelectedId] = useState("");
  const [groups, setGroups] = useState(classifications);
  const [rows, setRows] = useState([]);
  const [countsLoading, setCountsLoading] = useState(false);
  const [rowsLoading, setRowsLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [showAllColumns, setShowAllColumns] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setSelectedId(
      initialClassificationId ||
        (classifications.length === 1 ? classifications[0].id : "")
    );
    setGroups(classifications);
    setRows([]);
    setError("");
    setPage(0);
    setShowAllColumns(false);
  }, [isOpen, stat?.id, initialClassificationId]);

  useEffect(() => {
    if (!isOpen || !classifications.length) return undefined;
    let isMounted = true;

    const loadCounts = async () => {
      setCountsLoading(true);
      try {
        const next = await getAutomationClassificationCounts(classifications);
        if (isMounted) setGroups(next);
      } catch (loadError) {
        if (isMounted) setGroups(classifications);
      } finally {
        if (isMounted) setCountsLoading(false);
      }
    };

    loadCounts();
    return () => {
      isMounted = false;
    };
  }, [isOpen, stat?.id]);

  useEffect(() => {
    if (!isOpen || !selectedId) return undefined;
    const selected = classifications.find((item) => item.id === selectedId);
    if (!selected?.rowsPath) return undefined;

    let isMounted = true;

    const loadRows = async () => {
      setRowsLoading(true);
      setError("");
      setPage(0);
      try {
        const next = await getAutomationExtract(selected.rowsPath);
        if (isMounted) setRows(next);
      } catch (loadError) {
        if (isMounted) {
          setRows([]);
          setError("Could not load this extract.");
        }
      } finally {
        if (isMounted) setRowsLoading(false);
      }
    };

    loadRows();
    return () => {
      isMounted = false;
    };
  }, [isOpen, selectedId, stat?.id]);

  const selected =
    groups.find((item) => item.id === selectedId) ||
    classifications.find((item) => item.id === selectedId);
  const columns = useMemo(() => extractColumns(rows), [rows]);
  const displayColumns = useMemo(
    () => pickDisplayColumns(columns, showAllColumns),
    [columns, showAllColumns]
  );
  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const pageRows = rows.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const handleExport = () => {
    if (!rows.length) return;
    const acronym = (selected?.acronym || "extract").toLowerCase();
    exportRowsToExcel(rows, {
      filename: `${acronym}_extract_${exportTimestamp()}.xlsx`,
      sheetName: selected?.acronym || "Extract",
    });
  };

  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title={stat?.label || "Automation extract"}
      subtitle={
        classifications.length > 1
          ? "Select a classification to load its extract. Export downloads every column."
          : "Extract rows for this monitor. Export downloads every column."
      }
      maxW="1080px"
      footer={<ModalCancelButton onClick={onClose}>Close</ModalCancelButton>}
    >
      {groups.length > 1 ? (
      <SimpleGrid columns={{ base: 2, md: 3 }} spacing={2} mb={4}>
        {groups.map((item) => {
          const active = item.id === selectedId;
          const attention = attentionForCount(item.count || 0);
          return (
            <Box
              key={item.id}
              as="button"
              type="button"
              textAlign="left"
              p={3}
              border="1px solid"
              borderColor={active ? "brand.500" : "border.default"}
              borderRadius="10px"
              bg={active ? "brand.wash" : "surface.card"}
              cursor="pointer"
              onClick={() => setSelectedId(item.id)}
            >
              <Flex align="center" justify="space-between" gap={2} mb={1}>
                <Text fontSize="10px" fontWeight="700" letterSpacing="0.04em">
                  {item.acronym}
                </Text>
                {item.rollup ? (
                  <Badge
                    bg="#E8F5EE"
                    color="#0C5F2C"
                    borderRadius="6px"
                    fontSize="9px"
                    textTransform="none"
                  >
                    Total
                  </Badge>
                ) : (
                  <Badge
                    bg={item.unavailable ? "#F1F5F9" : attention.bg}
                    color={item.unavailable ? "#64748B" : attention.color}
                    borderRadius="6px"
                    fontSize="9px"
                    textTransform="none"
                  >
                    {item.unavailable ? "—" : attention.label}
                  </Badge>
                )}
              </Flex>
              <Text fontSize="12px" color="text.muted" noOfLines={2} mb={1}>
                {item.label}
              </Text>
              <Text fontSize="18px" fontWeight="600" letterSpacing="-0.03em">
                {countsLoading && item.count == null
                  ? "…"
                  : formatCount(item.count)}
              </Text>
            </Box>
          );
        })}
      </SimpleGrid>
      ) : null}

      <DataTableShell
        title={selected ? `${selected.acronym} extract` : "Extract"}
        subtitle={
          !selectedId
            ? "Select a classification to load its extract."
            : selected
              ? `${selected.label}. ${formatCount(selected.count)} accounts. ${formatCount(rows.length)} extract rows. Scroll sideways for more columns.`
              : ""
        }
        sx={{
          table: { w: "max-content", minW: "100%" },
          ".chakra-table__container": {
            w: "100%",
            overflowX: "auto",
            overflowY: "auto",
          },
          th: { py: 2, px: 3, fontSize: "11px" },
          td: { py: 1.5, px: 3, fontSize: "12px" },
        }}
        actions={
          <Flex align="center" gap={2} flexWrap="wrap">
            <PageOutlineButton
              h="32px"
              px={3}
              fontSize="12px"
              leftIcon={<FiDownload />}
              isDisabled={!rows.length || rowsLoading}
              onClick={handleExport}
            >
              Export
            </PageOutlineButton>
            {columns.length > displayColumns.length || showAllColumns ? (
              <PageOutlineButton
                h="32px"
                px={3}
                fontSize="12px"
                isDisabled={!rows.length}
                onClick={() => setShowAllColumns((current) => !current)}
              >
                {showAllColumns ? "Key columns" : "All columns"}
              </PageOutlineButton>
            ) : null}
            {rows.length > PAGE_SIZE ? (
              <>
                <PageOutlineButton
                  h="32px"
                  px={3}
                  fontSize="12px"
                  isDisabled={page === 0}
                  onClick={() => setPage((current) => Math.max(0, current - 1))}
                >
                  Previous
                </PageOutlineButton>
                <Text fontSize="12px" color="text.muted">
                  {page + 1} / {pageCount}
                </Text>
                <PageOutlineButton
                  h="32px"
                  px={3}
                  fontSize="12px"
                  isDisabled={page >= pageCount - 1}
                  onClick={() =>
                    setPage((current) => Math.min(pageCount - 1, current + 1))
                  }
                >
                  Next
                </PageOutlineButton>
              </>
            ) : null}
          </Flex>
        }
      >
        <Box minH="180px">
          {!selectedId ? (
            <Flex h="180px" align="center" justify="center">
              <Text fontSize="13px" color="text.muted">
                Select a classification to load its extract.
              </Text>
            </Flex>
          ) : rowsLoading ? (
            <Flex h="180px" align="center" justify="center">
              <Spinner color="brand.500" />
            </Flex>
          ) : error ? (
            <Flex h="180px" align="center" justify="center">
              <Text fontSize="13px" color="text.muted">
                {error}
              </Text>
            </Flex>
          ) : !rows.length ? (
            <Flex h="180px" align="center" justify="center">
              <Text fontSize="13px" color="text.muted">
                No rows returned for this classification.
              </Text>
            </Flex>
          ) : (
            <TableContainer
              className="extract-table-scroll"
              maxH="32vh"
              overflowX="scroll"
              overflowY="scroll"
              overscrollBehavior="contain"
              pb={1}
            >
              <Table size="sm" w="max-content" minW="100%">
                <Thead>
                  <Tr>
                    {displayColumns.map((column) => (
                      <Th key={column} whiteSpace="nowrap">
                        {column}
                      </Th>
                    ))}
                  </Tr>
                </Thead>
                <Tbody>
                  {pageRows.map((row, index) => (
                    <Tr
                      key={
                        row?.ACCOUNTID || row?.accountid || `${page}-${index}`
                      }
                    >
                      {displayColumns.map((column) => (
                        <Td key={column} whiteSpace="nowrap">
                          {formatCell(row?.[column])}
                        </Td>
                      ))}
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </DataTableShell>
    </AppModal>
  );
};

export default AutomationExtractModal;
