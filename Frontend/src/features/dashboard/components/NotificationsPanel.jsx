import React from "react";
import {
  Box,
  Flex,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import { SurfaceCard } from "../../../components/ui";
import { formatCaseOpenedAt } from "../../cases/case.utils";

const formatNoteTime = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return formatCaseOpenedAt(value);
  }

  const now = new Date();
  const sameDay =
    date.toLocaleDateString("en-GB", { timeZone: "Africa/Harare" }) ===
    now.toLocaleDateString("en-GB", { timeZone: "Africa/Harare" });

  if (sameDay) {
    return date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Africa/Harare",
    });
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    timeZone: "Africa/Harare",
  });
};

const DUMMY_NOTIFICATIONS = [
  {
    id: "dummy-1",
    title: "UAT application server2 is down",
    createdAt: new Date().toISOString(),
    acknowledged: false,
  },
  {
    id: "dummy-2",
    title: "/opt disk usage above 70%",
    createdAt: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    acknowledged: false,
  },
  {
    id: "dummy-3",
    title: "FE DEV node exporter is unreachable",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    acknowledged: true,
  },
  {
    id: "dummy-4",
    title: "Memory utilization returned to normal",
    createdAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
    acknowledged: true,
  },
];

const NotificationsPanel = ({ notifications = [] }) => {
  const navigate = useNavigate();
  const source = notifications.length > 0 ? notifications : DUMMY_NOTIFICATIONS;
  const items = [...source]
    .sort((a, b) => {
      const ackDelta = Number(Boolean(a.acknowledged)) - Number(Boolean(b.acknowledged));
      if (ackDelta !== 0) return ackDelta;
      return (
        new Date(b.createdAt || b.updatedAt || 0) -
        new Date(a.createdAt || a.updatedAt || 0)
      );
    })
    .slice(0, 5);

  return (
    <SurfaceCard
      p={0}
      minH="280px"
      h="100%"
      overflow="hidden"
      display="flex"
      flexDirection="column"
    >
      <Flex align="center" justify="space-between" px={5} pt={5} pb={3}>
        <Heading fontSize="14px" fontWeight="500" color="text.primary">
          Notifications
        </Heading>
        <Text
          fontSize="12px"
          fontWeight="600"
          color="text.brand"
          cursor="pointer"
          onClick={() => navigate("/settings?section=observability&tab=Alerts")}
        >
          View all
        </Text>
      </Flex>

      <Box px={5} pb={4} flex="1" minH={0} overflowY="auto">
        {items.length === 0 ? (
          <Flex minH="140px" align="center" justify="center">
            <Text fontSize="13px" color="text.muted">
              No notifications
            </Text>
          </Flex>
        ) : (
          <Stack spacing={0}>
            {items.map((note, index) => {
              const acknowledged = Boolean(note.acknowledged);
              const title =
                note.title ||
                note.message ||
                note.name ||
                `Notification ${note.id || ""}`.trim();
              const occurredAt = formatNoteTime(
                note.createdAt || note.updatedAt || note.sentAt
              );

              return (
                <Flex
                  key={note.id || index}
                  align="flex-start"
                  gap={3}
                  py={3}
                  borderTopWidth={index === 0 ? 0 : "1px"}
                  borderColor="border.default"
                  cursor="pointer"
                  onClick={() => navigate("/settings?section=observability&tab=Alerts")}
                >
                  <Box
                    w="7px"
                    h="7px"
                    mt="6px"
                    borderRadius="full"
                    bg={acknowledged ? "#00843D" : "#D64545"}
                    flexShrink={0}
                  />
                  <Box minW={0} flex="1">
                    <Flex align="flex-start" justify="space-between" gap={3}>
                      <Text
                        fontSize="13px"
                        fontWeight="600"
                        color="text.primary"
                        noOfLines={1}
                      >
                        {title}
                      </Text>
                      <Text
                        fontSize="12px"
                        color="text.muted"
                        whiteSpace="nowrap"
                        flexShrink={0}
                      >
                        {occurredAt}
                      </Text>
                    </Flex>
                    <Text fontSize="12px" color="text.muted" mt={0.5} noOfLines={1}>
                      {acknowledged ? "Acknowledged" : "Unacknowledged"}
                    </Text>
                  </Box>
                </Flex>
              );
            })}
          </Stack>
        )}
      </Box>
    </SurfaceCard>
  );
};

export default NotificationsPanel;
