import React, { useState } from "react";
import {
  Box,
  Button,
  Heading,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import UsersTable from "./UsersTable";
import { users as initialUsers } from "../../data/users";
import AddUserModal from "../../components/modals/AddUserModal";
import { signupRequests as initialRequests } from "../../data/signupRequests";
import SignupRequestsTable from "./SignupRequestsTable";
import { useAppContext } from "../../context/AppContext";

const UsersPage = () => {
  const addModal = useDisclosure();
  const toast = useToast();
  const { user } = useAppContext();
  const [users, setUsers] = useState(initialUsers);
  const [requests, setRequests] = useState(initialRequests);
  const canEditRole = user?.role === "Admin";

  const handleApprove = (request) => {
    const nextUser = {
      id: `USR-${String(users.length + 1).padStart(3, "0")}`,
      name: request.name,
      role: request.roleRequested,
      email: request.email,
      active: true,
    };
    setUsers((prev) => [nextUser, ...prev]);
    setRequests((prev) => prev.filter((item) => item.id !== request.id));
    toast({
      title: "Signup approved",
      description: `${request.name} has been added as ${request.roleRequested}.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleRoleChange = (targetUser, nextRole) => {
    setUsers((prev) =>
      prev.map((item) =>
        item.id === targetUser.id ? { ...item, role: nextRole } : item
      )
    );
    toast({
      title: "Role updated",
      description: `${targetUser.name} is now ${nextRole}.`,
      status: "info",
      duration: 2500,
      isClosable: true,
    });
  };

  return (
    <Stack spacing={6}>
      <Box>
        <Stack direction={{ base: "column", md: "row" }} justify="space-between">
          <Box>
            <Heading size="lg">User Management</Heading>
          </Box>
          <Button onClick={addModal.onOpen}>Add User</Button>
        </Stack>
      </Box>

      <UsersTable
        items={users}
        canEditRole={canEditRole}
        onRoleChange={handleRoleChange}
      />
      <AddUserModal isOpen={addModal.isOpen} onClose={addModal.onClose} />

      <Stack spacing={4}>
        <Box>
          <Heading size="md">Signup Requests</Heading>
        </Box>
        <SignupRequestsTable items={requests} onApprove={handleApprove} />
      </Stack>
    </Stack>
  );
};

export default UsersPage;
