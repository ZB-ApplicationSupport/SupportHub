import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Stack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

import CasesTable from "../components/CasesTable";
import CaseDetailsModal from "../components/CaseDetailsModal";
import CreateCaseModal from "../components/CreateCaseModal";
import IngestJiraModal from "../components/IngestJiraModal";

import { getCases } from "../cases.api";
import { useAppContext } from "../../../context/AppContext";

import {
  filterCases,
  sortCases,
} from "../case.utils";

import { FiDownload, FiPlus } from "react-icons/fi";
import { exportCasesToExcel } from "../../../utils/exportUtils";
import {
  CompactDesktopScale,
  PageHeader,
  PageOutlineButton,
  PagePrimaryButton,
} from "../../../components/ui";

const CasesPage = () => {
  const toast = useToast();
  const { user } = useAppContext();
  const isAdmin = user?.role === "ADMIN";

  const viewModal = useDisclosure();
  const createModal = useDisclosure();
  const ingestModal = useDisclosure();

  const [cases, setCases] = useState([]);
  const [casesLoading, setCasesLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState(null);

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [system, setSystem] = useState("");
  const [assignee, setAssignee] = useState("");

  const [sortKey, setSortKey] = useState("openedAt");
  const [direction, setDirection] = useState("desc");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const loadCases = useCallback(async () => {
    setCasesLoading(true);

    try {
      const data = await getCases();
      setCases(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load cases:", err);
      toast({
        title: "Failed to load jobs",
        description:
          err.response?.data?.message || "Please try again.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      setCases([]);
    } finally {
      setCasesLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadCases();
  }, [loadCases]);

  const assignees = useMemo(() => {
    const names = new Set();
    cases.forEach((item) => {
      if (item.assignedTo && item.assignedTo !== "Unassigned") {
        names.add(item.assignedTo);
      }
    });
    return [...names].sort().map((username) => ({ username }));
  }, [cases]);

  const systems = useMemo(() => {
    const names = new Set();
    cases.forEach((item) => {
      if (item.system && item.system !== "Unspecified") {
        names.add(item.system);
      }
    });
    return [...names].sort();
  }, [cases]);

  const filteredCases = useMemo(() => {
    const filtered = filterCases(
      cases,
      query,
      status,
      priority,
      system,
      assignee
    );
    return sortCases(filtered, sortKey, direction);
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

  const totalItems = filteredCases.length;

  const paginatedCases = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredCases.slice(startIndex, startIndex + pageSize);
  }, [filteredCases, currentPage, pageSize]);

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

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalItems, pageSize, currentPage]);

  const handleExport = () => {
    exportCasesToExcel(filteredCases);
  };

  const openCase = (item) => {
    setSelectedCase(item);
    viewModal.onOpen();
  };

  const closeView = () => {
    setSelectedCase(null);
    viewModal.onClose();
  };

  const handleCaseUpdated = async () => {
    await loadCases();
    setSelectedCase(null);
  };

  return (
    <CompactDesktopScale>
      <Stack spacing={6} w="100%">
        <PageHeader
          title="Cases"
          subtitle="Case Tracker jobs: open, assign, close, and ingest from Jira."
          actions={
            <>
              <PageOutlineButton
                leftIcon={<FiDownload />}
                onClick={handleExport}
              >
                Export
              </PageOutlineButton>
              {isAdmin && (
                <PageOutlineButton onClick={ingestModal.onOpen}>
                  Ingest Jira
                </PageOutlineButton>
              )}
              <PagePrimaryButton
                leftIcon={<FiPlus />}
                onClick={createModal.onOpen}
              >
                Create Job
              </PagePrimaryButton>
            </>
          }
          mb={0}
        />

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
          systems={systems}
          isLoadingAssignees={false}
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
      </Stack>

      <CaseDetailsModal
        isOpen={viewModal.isOpen}
        onClose={closeView}
        item={selectedCase}
        isAdmin={isAdmin}
        onSuccess={handleCaseUpdated}
      />

      <CreateCaseModal
        isOpen={createModal.isOpen}
        onClose={createModal.onClose}
        onSuccess={loadCases}
      />

      <IngestJiraModal
        isOpen={ingestModal.isOpen}
        onClose={ingestModal.onClose}
        onSuccess={loadCases}
      />
    </CompactDesktopScale>
  );
};

export default CasesPage;
