import React from "react";
import { Box, Button, Heading, Stack, Text, useDisclosure } from "@chakra-ui/react";
import UsersTable from "./UsersTable";
import { users } from "../../data/users";
import AddUserModal from "../../components/modals/AddUserModal";

const UsersPage = () => {
  const addModal = useDisclosure();

  return (
    <Stack spacing={6}>
      <Box>
        <Stack direction={{ base: "column", md: "row" }} justify="space-between">
          <Box>
            <Heading size="lg">User Management</Heading>
            <Text color="text.muted">
              Control access and monitor user status across the platform.
            </Text>
          </Box>
          <Button onClick={addModal.onOpen}>Add User</Button>
        </Stack>
      </Box>
      <UsersTable items={users} />
      <AddUserModal isOpen={addModal.isOpen} onClose={addModal.onClose} />
    </Stack>
  );
};

export default UsersPage;
