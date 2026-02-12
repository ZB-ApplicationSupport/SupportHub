import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Heading,
  Stack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import UsersTable from "./UsersTable";
import { users as initialUsers } from "../../data/users";
import AddUserModal from "../../components/modals/AddUserModal";
import SignupRequestsTable from "./SignupRequestsTable";
import { useAppContext } from "../../context/AppContext";
import {
  approveSignupRequest,
  rejectSignupRequest,
  getSignupRequests,
} from "../../API/signupRequests.api";
import { toggleUserStatus } from "../../API/users.api";
import { getUsers } from "../../API/users.api"; // import your API call

const UsersPage = () => {
  const addModal = useDisclosure();
  const toast = useToast();
  const { user } = useAppContext();
  const [users, setUsers] = useState(initialUsers);
  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const canEditRole = user?.role === "ADMIN";

  useEffect(() => {
    let isMounted = true;
    const loadRequests = async () => {
      setRequestsLoading(true);
      try {
        const response = await getSignupRequests();
        if (isMounted) {
          setRequests(response.data || []);
        }
      } catch (error) {
        toast({
          title: "Failed to load signup requests",
          description:
            error.response?.data?.message ||
            error.response?.data ||
            "Please try again.",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      } finally {
        if (isMounted) {
          setRequestsLoading(false);
        }
      }
    };
    loadRequests();
    return () => {
      isMounted = false;
    };
  }, [toast]);

  // Load users from backend
  useEffect(() => {
    let isMounted = true;
    const loadUsers = async () => {
      try {
        const data = await getUsers(); // API call
        if (isMounted) setUsers(data); // set state with backend users
      } catch (error) {
        toast({
          title: "Failed to load users",
          description:
            error.response?.data?.message ||
            error.response?.data ||
            "Please try again.",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      }
    };
    loadUsers();
    return () => {
      isMounted = false;
    };
  }, [toast]);

  const handleToggleStatus = async (user) => {
  try {
    const response = await toggleUserStatus(user.id, !user.enabled); // send opposite
    setUsers((prev) =>
      prev.map((u) =>
        u.id === user.id ? { ...u, enabled: response.enabled } : u
      )
    );
  } catch (error) {
    toast({
      title: "Failed to toggle status",
      description: error.response?.data?.message || "Please try again.",
      status: "error",
      duration: 4000,
      isClosable: true,
    });
  }
};



  const handleApprove = async (request) => {
    try {
      await approveSignupRequest(request.id);
      setRequests((prev) => prev.filter((item) => item.id !== request.id));
      toast({
        title: "Signup approved",
        description: `${request.email} has been approved.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Signup approval failed",
        description:
          error.response?.data?.message ||
          error.response?.data ||
          "Please try again.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const handleReject = async (request) => {
    try {
      await rejectSignupRequest(request.id);
      setRequests((prev) => prev.filter((item) => item.id !== request.id));
      toast({
        title: "Signup rejected",
        description: `${request.email} has been rejected.`,
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Signup rejection failed",
        description:
          error.response?.data?.message ||
          error.response?.data ||
          "Please try again.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
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
      <Stack spacing={4}>
        <Box>
          <Heading size="md">Signup Requests</Heading>
        </Box>
        <SignupRequestsTable
          items={requests}
          isLoading={requestsLoading}
          onApprove={handleApprove}
          onReject={handleReject} // Pass the reject handler
        />
      </Stack>
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
        onToggleStatus={handleToggleStatus}
      />

      <AddUserModal isOpen={addModal.isOpen} onClose={addModal.onClose} />

      
    </Stack>
  );
};

export default UsersPage;
