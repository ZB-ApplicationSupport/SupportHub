import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Stack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { FiPlus } from "react-icons/fi";

import UsersTable from "./UsersTable";
import AddUserModal from "./AddUserModal";
import SignupRequestsTable from "./SignupRequestsTable";
import {
  DarkPillButton,
  SettingsSectionHeader,
  UnderlineNav,
} from "../../settings/components/settingsUi";
import {
  approveSignupRequest,
  getSignupRequests,
} from "../../auth/signupRequests.api";
import {
  PLACEHOLDER_SIGNUP_REQUESTS,
  isPlaceholderRequest,
} from "../users.data";

const UsersManagementPanel = ({ searchQuery = "" }) => {
  const addModal = useDisclosure();
  const toast = useToast();
  const [listFilter, setListFilter] = useState("all");

  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState(PLACEHOLDER_SIGNUP_REQUESTS);
  const canEditRole = false;

  const loadRequests = useCallback(async () => {
    try {
      const response = await getSignupRequests();
      const list = Array.isArray(response.data) ? response.data : [];
      setRequests(list.length ? list : PLACEHOLDER_SIGNUP_REQUESTS);
    } catch (error) {
      setRequests(PLACEHOLDER_SIGNUP_REQUESTS);
    }
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const handleApprove = async (request) => {
    try {
      if (!isPlaceholderRequest(request)) {
        await approveSignupRequest(request.id);
        await loadRequests();
      } else {
        setUsers((prev) => [
          ...prev,
          {
            id: `USR-${String(prev.length + 1).padStart(3, "0")}`,
            placeholder: true,
            name: request.email.split("@")[0],
            username: request.email.split("@")[0],
            email: request.email,
            role: "USER",
            enabled: true,
          },
        ]);
      }
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

  const filters = useMemo(
    () => [
      { id: "all", label: "View all" },
      { id: "users", label: "Users" },
      {
        id: "requests",
        label: "Signup requests",
        count: requests.length,
      },
    ],
    [requests.length]
  );

  const showRequests = listFilter === "all" || listFilter === "requests";
  const showUsers = listFilter === "all" || listFilter === "users";

  return (
    <Stack spacing={6} w="100%">
      <SettingsSectionHeader
        title="Users and access"
        description="Manage SupportHub users, account access, and signup requests."
        action={
          <DarkPillButton leftIcon={<FiPlus />} onClick={addModal.onOpen}>
            Add user
          </DarkPillButton>
        }
      />

      <UnderlineNav
        items={filters}
        value={listFilter}
        onChange={setListFilter}
      />

      {showRequests && (
        <SignupRequestsTable
          items={requests}
          onApprove={handleApprove}
          searchQuery={searchQuery}
          hideSearch
        />
      )}

      {showUsers && (
        <UsersTable
          items={users}
          canEditRole={canEditRole}
          searchQuery={searchQuery}
          hideSearch
        />
      )}

      <AddUserModal
        isOpen={addModal.isOpen}
        onClose={addModal.onClose}
        onSuccess={loadRequests}
      />
    </Stack>
  );
};

export default UsersManagementPanel;
