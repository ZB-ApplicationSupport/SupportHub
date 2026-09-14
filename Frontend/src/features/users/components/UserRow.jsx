import React from "react";
import {
  Box,
  Flex,
  HStack,
  Td,
  Text,
  Tr,
} from "@chakra-ui/react";

import UserStatusToggle from "./UserStatusToggle";
import RoleBadge from "./RoleBadge";
import { DropdownSelect, StatusDot } from "../../../components/ui";
import { ROLES } from "../../../utils/constants";

const initialsFrom = (user) => {
  const source = user.name || user.username || user.email || "?";
  const parts = String(source).replace(/@.*$/, "").split(/[.\s_-]+/).filter(Boolean);
  return parts.slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "?";
};

const UserRow = ({
  user,
  canEditRole,
  onRoleChange,
  onToggleStatus,
  isToggling,
}) => {
  const displayName = user.name || user.username || user.email;

  return (
    <Tr
      _hover={{
        bg: "surface.subtle",
      }}
      transition="background 0.15s ease"
    >
      <Td whiteSpace="nowrap">
        <HStack spacing={3}>
          <Flex
            align="center"
            justify="center"
            w="28px"
            h="28px"
            borderRadius="full"
            bg="rgba(0, 132, 61, 0.14)"
            color="#00843D"
            fontSize="11px"
            fontWeight="700"
            flexShrink={0}
          >
            {initialsFrom(user)}
          </Flex>
          <Box minW={0}>
            <Text fontSize="sm" fontWeight="600" noOfLines={1}>
              {displayName}
            </Text>
            {user.email && displayName !== user.email && (
              <Text fontSize="11px" color="text.muted" noOfLines={1}>
                {user.email}
              </Text>
            )}
          </Box>
        </HStack>
      </Td>

      <Td whiteSpace="nowrap">
        {canEditRole ? (
          <DropdownSelect
            size="sm"
            variant="outline"
            w="140px"
            minW="140px"
            label="Role"
            value={user.role || "USER"}
            onChange={(event) => onRoleChange(user, event.target.value)}
            options={ROLES.map((role) => ({ value: role, label: role }))}
          />
        ) : (
          <RoleBadge role={user.role} />
        )}
      </Td>

      <Td whiteSpace="nowrap">
        <StatusDot
          color={user.enabled ? "#00843D" : "#6B7280"}
          label={user.enabled ? "Active" : "Disabled"}
        />
      </Td>

      <Td>
        <HStack justify="center">
          {onToggleStatus ? (
            <UserStatusToggle
              active={user.enabled}
              onChange={() => onToggleStatus(user)}
              isLoading={isToggling}
            />
          ) : (
            <Text fontSize="12px" color="text.muted">
              N/A
            </Text>
          )}
        </HStack>
      </Td>
    </Tr>
  );
};

export default UserRow;
