import React from "react";
import { Badge, Select, Td, Text, Tr } from "@chakra-ui/react";
import RoleBadge from "./RoleBadge";
import UserStatusToggle from "./UserStatusToggle";
import { ROLES } from "../../utils/constants";

const UserRow = ({ user, canEditRole, onRoleChange, onToggleStatus }) => {
  return (
    <Tr>
      <Td>
        <Text fontWeight="600">{user.name || user.email}</Text> {/* fallback */}
      </Td>
      <Td>
        {canEditRole ? (
          <Select
            size="sm"
            value={user.role}
            onChange={(event) => onRoleChange(user, event.target.value)}
            maxW="200px"
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
        <Badge colorScheme={user.enabled ? "green" : "red"}>
          {user.enabled ? "Active" : "Disabled"}
        </Badge>

      </Td>
      <Td>
        <UserStatusToggle 
          active={user.enabled} 
          onChange={() => onToggleStatus(user)}
        />
      </Td>
    </Tr>
  );
};

export default UserRow;
