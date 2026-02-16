import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { passwords as initialPasswords } from "../../data/passwords";
import PasswordsTable from "./PasswordsTable";
import PasswordModal from "./PasswordModal";
import { useAppContext } from "../../context/AppContext";

const formatDate = (date) => {
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const PasswordsPage = () => {
  const addModal = useDisclosure();
  const toast = useToast();
  const { user } = useAppContext();
  const [query, setQuery] = useState("");
  const [passwords, setPasswords] = useState(initialPasswords);

  const filteredPasswords = useMemo(() => {
    const lowerQuery = query.toLowerCase();
    return passwords.filter((item) => {
      if (!lowerQuery) return true;
      return (
        item.server.toLowerCase().includes(lowerQuery) ||
        item.username.toLowerCase().includes(lowerQuery) ||
        item.hostname.toLowerCase().includes(lowerQuery)
      );
    });
  }, [passwords, query]);

  const handleSave = (formValues) => {
    const now = formatDate(new Date());
    const createdBy = user?.name || "Unknown";
    const nextItem = {
      id: `PWD-${String(passwords.length + 1).padStart(3, "0")}`,
      server: formValues.server,
      username: formValues.username,
      password: formValues.password,
      hostname: formValues.hostname,
      createdAt: now,
      updatedAt: now,
      createdBy,
      updatedBy: createdBy,
    };
    setPasswords((prev) => [nextItem, ...prev]);
    toast({
      title: "Password saved",
      description: "The record has been added (mocked).",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    addModal.onClose();
  };

  return (
    <Stack spacing={6}>
      <Box>
        <Heading size="lg">Passwords</Heading>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} alignItems="center">
        <InputGroup bgColor="white" borderRadius="md" boxShadow="sm">
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Search server, username, or hostname"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </InputGroup>
        <Box textAlign={{ base: "left", md: "right" }}>
          <Button onClick={addModal.onOpen}>Add Password</Button>
        </Box>
      </SimpleGrid>

      <PasswordsTable items={filteredPasswords} />

      <PasswordModal
        isOpen={addModal.isOpen}
        onClose={addModal.onClose}
        onSave={handleSave}
      />
    </Stack>
  );
};

export default PasswordsPage;
