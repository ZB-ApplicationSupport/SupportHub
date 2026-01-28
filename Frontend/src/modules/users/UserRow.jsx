import React from "react";
import { Badge, Td, Text, Tr } from "@chakra-ui/react";
import RoleBadge from "./RoleBadge";
import UserStatusToggle from "./UserStatusToggle";

const UserRow = ({ user }) => {
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
        <RoleBadge role={user.role} />
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
