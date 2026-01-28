import React, { useMemo, useState } from "react";
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
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { supportedSystems, systemCategories } from "../../data/systems";
import SystemsTable from "./SystemsTable";
import SystemFormModal from "./SystemFormModal";
import SystemDeleteModal from "./SystemDeleteModal";

const SystemsPage = () => {
  const createModal = useDisclosure();
  const editModal = useDisclosure();
  const deleteModal = useDisclosure();
  const [selectedSystem, setSelectedSystem] = useState(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [systems, setSystems] = useState(supportedSystems);

  const filteredSystems = useMemo(() => {
    return systems.filter((item) => {
      const matchesQuery =
        !query ||
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase());
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

  const handleToggle = (item, nextValue) => {
    setSystems((prev) =>
      prev.map((system) =>
        system.id === item.id
          ? { ...system, status: nextValue ? "Active" : "Inactive" }
          : system
      )
    );
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
        <Text color="text.muted">
          Manage the list of platforms covered by case operations.
        </Text>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} alignItems="center">
        <InputGroup>
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
      />
      <SystemFormModal
        isOpen={editModal.isOpen}
        onClose={editModal.onClose}
        title="Edit System"
        description="Update system metadata and ownership."
        categories={systemCategories}
        initialValues={
          selectedSystem || {
            name: "",
            category: systemCategories[0],
            owner: "",
            status: "Active",
          }
        }
      />
      <SystemDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.onClose}
        systemName={selectedSystem?.name || "this system"}
      />
    </Stack>
  );
};

export default SystemsPage;
