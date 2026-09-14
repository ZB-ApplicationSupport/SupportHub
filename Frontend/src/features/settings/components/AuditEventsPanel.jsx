import React, { useEffect, useState } from "react";
import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";

import { DataTableShell } from "../../../components/ui";
import { getAuditEvents } from "../../audit.api";
import { formatCaseOpenedAt } from "../../cases/case.utils";
import { SettingsSectionHeader } from "./settingsUi";

const headerProps = {
  fontSize: "xs",
  fontWeight: "700",
  letterSpacing: "0.02em",
  color: "text.muted",
};

const AuditEventsPanel = ({ searchQuery = "" }) => {
  const toast = useToast();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const loadEvents = async () => {
      try {
        const next = await getAuditEvents();
        if (isMounted) {
          setEvents(next);
        }
      } catch (error) {
        toast({
          title: "Failed to load audit events",
          description: error.response?.data?.message || "Please try again.",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      }
    };

    loadEvents();

    return () => {
      isMounted = false;
    };
  }, [toast]);

  const term = searchQuery.trim().toLowerCase();
  const filtered = term
    ? events.filter((event) =>
        [
          event.action,
          event.eventType,
          event.username,
          event.user,
          event.entityType,
          event.description,
        ]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(term))
      )
    : events;

  return (
    <>
      <SettingsSectionHeader
        title="Audit events"
        description="Review backend audit events recorded by SupportHub."
      />
      <DataTableShell>
        <TableContainer w="100%" overflowX="auto">
          <Table variant="simple" size="sm" w="100%">
            <Thead bg="surface.card">
              <Tr>
                <Th {...headerProps}>Time</Th>
                <Th {...headerProps}>User</Th>
                <Th {...headerProps}>Action</Th>
                <Th {...headerProps}>Entity</Th>
                <Th {...headerProps}>Description</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filtered.length === 0 ? (
                <Tr>
                  <Td colSpan={5} py={12}>
                    <Text fontSize="sm" color="text.muted">
                      No audit events found.
                    </Text>
                  </Td>
                </Tr>
              ) : (
                filtered.map((event, index) => (
                  <Tr key={event.id || index}>
                    <Td whiteSpace="nowrap">
                      <Text fontSize="13px" color="text.muted">
                        {event.createdAt || event.timestamp
                          ? formatCaseOpenedAt(event.createdAt || event.timestamp)
                          : "N/A"}
                      </Text>
                    </Td>
                    <Td>
                      <Text fontSize="13px" color="text.primary">
                        {event.username || event.user || "System"}
                      </Text>
                    </Td>
                    <Td>
                      <Text fontSize="13px" color="text.primary">
                        {event.action || event.eventType || "N/A"}
                      </Text>
                    </Td>
                    <Td>
                      <Text fontSize="13px" color="text.muted">
                        {event.entityType || event.entity || "N/A"}
                      </Text>
                    </Td>
                    <Td>
                      <Text fontSize="13px" color="text.muted" noOfLines={2}>
                        {event.description || event.message || "N/A"}
                      </Text>
                    </Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </DataTableShell>
    </>
  );
};

export default AuditEventsPanel;
