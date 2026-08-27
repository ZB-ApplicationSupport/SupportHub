import React from "react";
import {
    Badge,
    Td,
    Tr,
    Text,
} from "@chakra-ui/react";
import {
    PRIORITY_COLORS,
    STATUS_COLORS,
} from "../../utils/constants";

const CaseRow = ({
                     item,
                     onOpen,
                     onEdit,
                 }) => {
    return (
        <Tr
            onClick={onOpen}
            cursor="pointer"
            _hover={{
                bg: "gray.50",
            }}
        >
            <Td>
                <Text fontWeight="600">
                    {item.id}
                </Text>

                <Text
                    fontSize="xs"
                    color="text.muted"
                    noOfLines={1}
                >
                    {item.summary}
                </Text>
            </Td>

            <Td>
                {item.system}
            </Td>

            {/* STATUS */}
            <Td>
                <Badge
                    colorScheme={
                        STATUS_COLORS[item.status] || "gray"
                    }
                    variant="subtle"
                    borderRadius="full"
                    px={2.5}
                    py={1}
                    fontSize="xs"
                    textTransform="none"
                >
                    {item.status}
                </Badge>
            </Td>

            {/* PRIORITY */}
            <Td>
                <Badge
                    colorScheme={
                        PRIORITY_COLORS[item.priority] || "gray"
                    }
                    variant="subtle"
                    borderRadius="full"
                    px={2.5}
                    py={1}
                    fontSize="xs"
                    textTransform="none"
                >
                    {item.priority}
                </Badge>
            </Td>

            <Td>
                {item.assignedTo || "Unassigned"}
            </Td>

            <Td>
                {item.openedAt || "—"}
            </Td>
        </Tr>
    );
};

export default CaseRow;