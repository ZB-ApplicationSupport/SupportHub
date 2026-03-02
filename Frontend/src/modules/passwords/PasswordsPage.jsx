import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import { getPasswords, createPassword } from "../../API/passwords.api";
import PasswordsTable from "./PasswordsTable";
import PasswordModal from "./PasswordModal";
import { useAppContext } from "../../context/AppContext";

const PasswordsPage = () => {
  const addModal = useDisclosure();
  const toast = useToast();
  const { user } = useAppContext();
  const [query, setQuery] = useState("");
  const [passwords, setPasswords] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPasswords = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getPasswords();
      setPasswords(data || []);
    } catch (err) {
      toast({
        title: "Failed to load passwords",
        description: err.response?.data?.message || "Please try again.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      setPasswords([]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadPasswords();
  }, [loadPasswords]);

  const filteredPasswords = useMemo(() => {
    const lowerQuery = (query || "").toLowerCase();
    return passwords.filter((item) => {
      if (!lowerQuery) return true;
      return (
        (item.server || "").toLowerCase().includes(lowerQuery) ||
        (item.username || "").toLowerCase().includes(lowerQuery) ||
        (item.hostname || "").toLowerCase().includes(lowerQuery)
      );
    });
  }, [passwords, query]);

  const handleSave = async (formValues) => {
    const createdBy = user?.name || user?.email || "Unknown";
    try {
      await createPassword({
        ...formValues,
        createdBy,
        updatedBy: createdBy,
      });
      toast({
        title: "Password saved",
        description: "The record has been added.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      loadPasswords();
      addModal.onClose();
    } catch (err) {
      toast({
        title: "Failed to save password",
        description: err.response?.data?.message || "Please try again.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
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
