import React from "react";
import { Badge, Select, Td, Text, Tr } from "@chakra-ui/react";
import RoleBadge from "./RoleBadge";
import UserStatusToggle from "./UserStatusToggle";
import { ROLES } from "../../utils/constants";

const UserRow = ({ user, canEditRole, onRoleChange }) => {
  return (
    <Tr>
      <Td>
        <Text fontWeight="600">{user.name}</Text>
        <Text fontSize="xs" color="text.muted">
          {user.id}
        </Text>
      </Td>
      <Td>{user.email}</Td>
      <Td>
        {canEditRole ? (
          <Select
            size="sm"
            value={user.role}
            onChange={(event) => onRoleChange(user, event.target.value)}
            maxW="140px"
          >
            {ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </Select>
        ) : (
          <RoleBadge role={user.role} />
        )}
      </Td>
      <Td>
        <Badge colorScheme={user.active ? "green" : "red"}>
          {user.active ? "Active" : "Disabled"}
        </Badge>
      </Td>
      <Td>
        <UserStatusToggle active={user.active} />
      </Td>
    </Tr>
  );
};

export default UserRow;
