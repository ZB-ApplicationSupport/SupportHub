import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Heading,
  SimpleGrid,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import CasesTable from "../../components/tables/CasesTable";
import CaseDetailsModal from "../../components/modals/CaseDetailsModal";
import CreateCaseModal from "../../components/modals/CreateCaseModal";
import EditCaseModal from "../../components/modals/EditCaseModal";
import { getCases } from "../../API/cases.api";
import { filterCases, sortCases } from "../../utils/caseUtils";
import { exportCasesToExcel } from "../../utils/exportUtils";
import { useSearchParams } from "react-router-dom";

const CasesPage = () => {
  const toast = useToast();
  const viewModal = useDisclosure();
  const createModal = useDisclosure();
  const editModal = useDisclosure();
  const [cases, setCases] = useState([]);
  const [casesLoading, setCasesLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState(null);
  const [editCase, setEditCase] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [system, setSystem] = useState("");
  const [sortKey, setSortKey] = useState("openedAt");
  const [direction, setDirection] = useState("desc");

  const loadCases = useCallback(async () => {
    setCasesLoading(true);
    try {
      const data = await getCases();
      setCases(data || []);
    } catch (err) {
      toast({
        title: "Failed to load cases",
        description: err.response?.data?.message || "Please try again.",
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

  const filteredCases = useMemo(() => {
    const filtered = filterCases(cases, query, status, priority, system);
    return sortCases(filtered, sortKey, direction);
  }, [cases, query, status, priority, system, sortKey, direction]);

  const handleExport = () => {
    exportCasesToExcel(filteredCases);
  };

  const openCase = (item) => {
    setSelectedCase(item);
    viewModal.onOpen();
  };

  const openEdit = (item) => {
    setEditCase(item);
    editModal.onOpen();
  };

  const closeView = () => {
    const nextParams = new URLSearchParams(searchParams);
    if (nextParams.has("caseId")) {
      nextParams.delete("caseId");
      setSearchParams(nextParams);
    }
    setSelectedCase(null);
    viewModal.onClose();
  };

  const closeEdit = () => {
    setEditCase(null);
    editModal.onClose();
  };

  useEffect(() => {
    const caseId = searchParams.get("caseId");
    if (!caseId) return;
    const match = cases.find((item) => item.id === caseId);
    if (!match) return;
    if (!selectedCase || selectedCase.id !== match.id) {
      setSelectedCase(match);
    }
    if (!viewModal.isOpen) {
      viewModal.onOpen();
    }
  }, [searchParams, selectedCase, viewModal]);

  return (
    <Stack spacing={6}>
      <SimpleGrid columns={{ base: 1, md: 2 }} alignItems="center" spacing={4}>
        <Box>
          <Heading size="lg">Cases</Heading>
        </Box>
        <Stack direction={{ base: "column", md: "row" }} justify="flex-end">
          <Button onClick={createModal.onOpen}>
            Create Case
          </Button>
          <Button variant="outline" onClick={handleExport}>
            Export List
          </Button>
        </Stack>
      </SimpleGrid>

      <CasesTable
        items={filteredCases}
        isLoading={casesLoading}
        onOpenCase={openCase}
        onEditCase={openEdit}
        query={query}
        status={status}
        priority={priority}
        system={system}
        onQueryChange={setQuery}
        onStatusChange={setStatus}
        onPriorityChange={setPriority}
        onSystemChange={setSystem}
        sortKey={sortKey}
        direction={direction}
        onSortChange={setSortKey}
        onDirectionChange={setDirection}
      />

      <CaseDetailsModal
        isOpen={viewModal.isOpen}
        onClose={closeView}
        item={selectedCase}
      />
      <CreateCaseModal
        isOpen={createModal.isOpen}
        onClose={createModal.onClose}
        onSuccess={loadCases}
      />
      <EditCaseModal
        isOpen={editModal.isOpen}
        onClose={closeEdit}
        item={editCase}
        onSuccess={loadCases}
      />
    </Stack>
  );
};

export default CasesPage;
