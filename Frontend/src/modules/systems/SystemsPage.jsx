import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  SimpleGrid,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { systemCategories } from "../../data/systems";
import {
  getSystems,
  createSystem,
  updateSystem,
  deleteSystem,
} from "../../API/systems.api";
import SystemsTable from "./SystemsTable";
import SystemFormModal from "./SystemFormModal";
import SystemDeleteModal from "./SystemDeleteModal";

const SystemsPage = () => {
  const toast = useToast();
  const createModal = useDisclosure();
  const editModal = useDisclosure();
  const deleteModal = useDisclosure();
  const [selectedSystem, setSelectedSystem] = useState(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [systems, setSystems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadSystems = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getSystems();
      setSystems(data || []);
    } catch (err) {
      toast({
        title: "Failed to load systems",
        description: err.response?.data?.message || "Please try again.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      setSystems([]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadSystems();
  }, [loadSystems]);

  const filteredSystems = useMemo(() => {
    return systems.filter((item) => {
      const matchesQuery =
        !query ||
        (item.name || "").toLowerCase().includes(query.toLowerCase()) ||
        (item.category || "").toLowerCase().includes(query.toLowerCase());
      const matchesStatus = !status || item.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [systems, query, status]);

  const handleEdit = (item) => {
    setSelectedSystem(item);
    editModal.onOpen();
  };

  const handleDelete = (item) => {
    setSelectedSystem(item);
    deleteModal.onOpen();
  };

  const handleToggle = async (item, nextValue) => {
    const numId = item.numericId ?? item.id;
    try {
      await updateSystem(numId, {
        ...item,
        status: nextValue ? "Active" : "Inactive",
      });
      await loadSystems();
    } catch (err) {
      toast({
        title: "Failed to update status",
        description: err.response?.data?.message || "Please try again.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const handleSaveCreate = async (values) => {
    try {
      await createSystem(values);
      toast({ title: "System added", status: "success", duration: 3000, isClosable: true });
      loadSystems();
      createModal.onClose();
    } catch (err) {
      toast({
        title: "Failed to add system",
        description: err.response?.data?.message || "Please try again.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const handleSaveEdit = async (values) => {
    if (!selectedSystem) return;
    try {
      await updateSystem(selectedSystem.numericId ?? selectedSystem.id, values);
      toast({ title: "System updated", status: "success", duration: 3000, isClosable: true });
      loadSystems();
      editModal.onClose();
      setSelectedSystem(null);
    } catch (err) {
      toast({
        title: "Failed to update system",
        description: err.response?.data?.message || "Please try again.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedSystem) return;
    try {
      await deleteSystem(selectedSystem.numericId ?? selectedSystem.id);
      toast({ title: "System removed", status: "success", duration: 3000, isClosable: true });
      loadSystems();
      deleteModal.onClose();
      setSelectedSystem(null);
    } catch (err) {
      toast({
        title: "Failed to remove system",
        description: err.response?.data?.message || "Please try again.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const defaultFormValues = {
    name: "",
    category: systemCategories[0],
    owner: "",
    status: "Active",
  };

  return (
    <Stack spacing={6}>
      <Box>
        <Heading size="lg">Supported Systems</Heading>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} alignItems="center">
        <InputGroup bgColor="white" borderRadius="md" boxShadow="sm">
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Search system or category"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </InputGroup>
        <Select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          aria-label="Filter by status"
          bgColor="white"
        >
          <option value="">All statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </Select>
        <Box textAlign={{ base: "left", md: "right" }}>
          <Button onClick={createModal.onOpen}>Add System</Button>
        </Box>
      </SimpleGrid>

      <SystemsTable
        items={filteredSystems}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggle={handleToggle}
      />

      <SystemFormModal
        isOpen={createModal.isOpen}
        onClose={createModal.onClose}
        title="Add System"
        description="Register a new supported platform."
        categories={systemCategories}
        initialValues={defaultFormValues}
        onSave={handleSaveCreate}
      />
      <SystemFormModal
        isOpen={editModal.isOpen}
        onClose={() => { editModal.onClose(); setSelectedSystem(null); }}
        title="Edit System"
        description="Update system metadata and ownership."
        categories={systemCategories}
        initialValues={
          selectedSystem
            ? { name: selectedSystem.name, category: selectedSystem.category, owner: selectedSystem.owner, status: selectedSystem.status }
            : defaultFormValues
        }
        onSave={handleSaveEdit}
      />
      <SystemDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => { deleteModal.onClose(); setSelectedSystem(null); }}
        systemName={selectedSystem?.name || "this system"}
        onConfirm={handleConfirmDelete}
      />
    </Stack>
  );
};

export default SystemsPage;
