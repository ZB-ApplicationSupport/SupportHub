import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Heading,
  SimpleGrid,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import CasesTable from "../../components/tables/CasesTable";
import CaseDetailsModal from "../../components/modals/CaseDetailsModal";
import CreateCaseModal from "../../components/modals/CreateCaseModal";
import EditCaseModal from "../../components/modals/EditCaseModal";
import { cases } from "../../data/cases";
import { filterCases, sortCases } from "../../utils/caseUtils";
import { useSearchParams } from "react-router-dom";

const CasesPage = () => {
  const viewModal = useDisclosure();
  const createModal = useDisclosure();
  const editModal = useDisclosure();
  const [selectedCase, setSelectedCase] = useState(null);
  const [editCase, setEditCase] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [system, setSystem] = useState("");
  const [sortKey, setSortKey] = useState("openedAt");
  const [direction, setDirection] = useState("desc");

  const filteredCases = useMemo(() => {
    const filtered = filterCases(cases, query, status, priority, system);
    return sortCases(filtered, sortKey, direction);
  }, [query, status, priority, system, sortKey, direction]);

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
          <Text color="text.muted">
            Manage incidents across critical banking systems.
          </Text>
        </Box>
        <Stack direction={{ base: "column", md: "row" }} justify="flex-end">
          <Button onClick={createModal.onOpen}>
            Create Case
          </Button>
          <Button variant="outline">Export List</Button>
        </Stack>
      </SimpleGrid>

      <CasesTable
        items={filteredCases}
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
      />
      <EditCaseModal
        isOpen={editModal.isOpen}
        onClose={closeEdit}
        item={editCase}
      />
    </Stack>
  );
};

export default CasesPage;
