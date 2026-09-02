import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Box,
  Button,
  Heading,
  SimpleGrid,
  Stack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

import CasesTable from "../../components/tables/CasesTable";
import CaseDetailsModal from "../../components/modals/CaseDetailsModal";
import CreateCaseModal from "../../components/modals/CreateCaseModal";

import {
  getCases,
  getAssignees,
} from "../../API/cases.api";

import {
  filterCases,
  sortCases,
} from "../../utils/caseUtils";

import { exportCasesToExcel } from "../../utils/exportUtils";

const CasesPage = () => {
  const toast = useToast();

  const viewModal = useDisclosure();
  const createModal = useDisclosure();

  /*
   * =========================================================
   * DATA
   * =========================================================
   */

  const [cases, setCases] = useState([]);
  const [casesLoading, setCasesLoading] = useState(true);

  const [assignees, setAssignees] = useState([]);
  const [assigneesLoading, setAssigneesLoading] = useState(false);

  const [selectedCase, setSelectedCase] = useState(null);

  /*
   * =========================================================
   * FILTERS
   * =========================================================
   */

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [system, setSystem] = useState("");
  const [assignee, setAssignee] = useState("");

  /*
   * =========================================================
   * SORTING
   * =========================================================
   */

  const [sortKey, setSortKey] = useState("openedAt");
  const [direction, setDirection] = useState("desc");

  /*
   * =========================================================
   * PAGINATION
   * =========================================================
   */

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  /*
   * =========================================================
   * LOAD CASES
   * =========================================================
   */

  const loadCases = useCallback(async () => {
    setCasesLoading(true);

    try {
      const data = await getCases();

      setCases(
          Array.isArray(data)
              ? data
              : []
      );
    } catch (err) {
      console.error("Failed to load cases:", err);

      toast({
        title: "Failed to load cases",
        description:
            err.response?.data?.message ||
            "Please try again.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });

      setCases([]);
    } finally {
      setCasesLoading(false);
    }
  }, [toast]);

  /*
   * =========================================================
   * LOAD ASSIGNEES
   * =========================================================
   */

  const loadAssignees = useCallback(async () => {
    setAssigneesLoading(true);

    try {
      const users = await getAssignees();

      setAssignees(
          Array.isArray(users)
              ? users
              : []
      );
    } catch (err) {
      console.error(
          "Failed to load assignees:",
          err
      );

      setAssignees([]);

      toast({
        title: "Failed to load assignees",
        description:
            err.response?.data?.message ||
            "Unable to load the assignee list.",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setAssigneesLoading(false);
    }
  }, [toast]);

  /*
   * =========================================================
   * INITIAL LOAD
   * =========================================================
   */

  useEffect(() => {
    loadCases();
    loadAssignees();
  }, [
    loadCases,
    loadAssignees,
  ]);

  /*
   * =========================================================
   * FILTER THEN SORT
   * =========================================================
   */

  const filteredCases = useMemo(() => {
    const filtered = filterCases(
        cases,
        query,
        status,
        priority,
        system,
        assignee
    );

    return sortCases(
        filtered,
        sortKey,
        direction
    );
  }, [
    cases,
    query,
    status,
    priority,
    system,
    assignee,
    sortKey,
    direction,
  ]);

  /*
   * =========================================================
   * TOTAL FILTERED RECORDS
   * =========================================================
   */

  const totalItems = filteredCases.length;

  /*
   * =========================================================
   * PAGINATION
   * =========================================================
   */

  const paginatedCases = useMemo(() => {
    const startIndex =
        (currentPage - 1) * pageSize;

    const endIndex =
        startIndex + pageSize;

    return filteredCases.slice(
        startIndex,
        endIndex
    );
  }, [
    filteredCases,
    currentPage,
    pageSize,
  ]);

  /*
   * =========================================================
   * FILTER HANDLERS
   * =========================================================
   */

  const handleQueryChange = (value) => {
    setQuery(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value) => {
    setStatus(value);
    setCurrentPage(1);
  };

  const handlePriorityChange = (value) => {
    setPriority(value);
    setCurrentPage(1);
  };

  const handleSystemChange = (value) => {
    setSystem(value);
    setCurrentPage(1);
  };

  const handleAssigneeChange = (value) => {
    setAssignee(value);
    setCurrentPage(1);
  };

  /*
   * =========================================================
   * PAGE SIZE
   * =========================================================
   */

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  /*
   * =========================================================
   * KEEP CURRENT PAGE VALID
   * =========================================================
   */

  useEffect(() => {
    const totalPages = Math.max(
        1,
        Math.ceil(
            totalItems / pageSize
        )
    );

    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [
    totalItems,
    pageSize,
    currentPage,
  ]);

  /*
   * =========================================================
   * EXPORT
   * =========================================================
   */

  const handleExport = () => {
    exportCasesToExcel(filteredCases);
  };

  /*
   * =========================================================
   * OPEN CASE
   * =========================================================
   */

  const openCase = (item) => {
    console.log("=== OPEN CASE ===");
    console.log(item);

    setSelectedCase(item);
    viewModal.onOpen();
  };

  /*
   * =========================================================
   * CLOSE CASE
   * =========================================================
   */

  const closeView = () => {
    setSelectedCase(null);
    viewModal.onClose();
  };

  /*
   * =========================================================
   * CASE UPDATED
   * =========================================================
   */

  const handleCaseUpdated = async () => {
    await loadCases();
    await loadAssignees();

    setSelectedCase(null);
  };

  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
      <Stack spacing={6}>

        <SimpleGrid
            columns={{
              base: 1,
              md: 2,
            }}
            alignItems="center"
            spacing={4}
        >

          <Box>
            <Heading size="lg">
              Cases
            </Heading>
          </Box>

          <Stack
              direction={{
                base: "column",
                md: "row",
              }}
              justify="flex-end"
          >

            <Button
                onClick={createModal.onOpen}
            >
              Create Case
            </Button>

            <Button
                variant="outline"
                onClick={handleExport}
            >
              Export List
            </Button>

          </Stack>

        </SimpleGrid>

        <CasesTable
            items={paginatedCases}
            isLoading={casesLoading}

            onOpenCase={openCase}
            onRefresh={loadCases}

            query={query}
            status={status}
            priority={priority}
            system={system}
            assignee={assignee}

            assignees={assignees}
            isLoadingAssignees={assigneesLoading}

            onQueryChange={handleQueryChange}
            onStatusChange={handleStatusChange}
            onPriorityChange={handlePriorityChange}
            onSystemChange={handleSystemChange}
            onAssigneeChange={handleAssigneeChange}

            sortKey={sortKey}
            direction={direction}

            onSortChange={setSortKey}
            onDirectionChange={setDirection}

            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={totalItems}

            onPageChange={setCurrentPage}
            onPageSizeChange={handlePageSizeChange}
        />

        <CaseDetailsModal
            isOpen={viewModal.isOpen}
            onClose={closeView}
            item={selectedCase}
            assignees={assignees}
            isLoadingAssignees={assigneesLoading}
            onRefreshAssignees={loadAssignees}
            onSuccess={handleCaseUpdated}
        />

        <CreateCaseModal
            isOpen={createModal.isOpen}
            onClose={createModal.onClose}
            onSuccess={loadCases}
        />

      </Stack>
  );
};

export default CasesPage;