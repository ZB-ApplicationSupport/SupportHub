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

const ACTIVITY_STYLE = {
  created: { verb: "created", color: "#94A3B8" },
  updated: { verb: "updated", color: "#00843D" },
  resolved: { verb: "resolved", color: "#64748B" },
};

const looksLikeUuid = (value) => {
  const compact = String(value || "").replace(/\s+/g, "");
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}/i.test(compact);
};

const formatCaseRef = (item) => {
  const raw = String(item.reference || item.caseId || item.id || "").trim();
  if (!raw) return "Case";
  if (/^JOB-/i.test(raw)) return raw;
  if (looksLikeUuid(raw)) {
    return raw.replace(/\s+/g, "").slice(0, 8).toUpperCase();
  }
  return raw;
};

const formatActivityTime = (value) => {
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

const activityKind = (item) => {
  if (item.status === "Closed") {
    return "resolved";
  }

  const created = item.createdAt ? new Date(item.createdAt).getTime() : NaN;
  const updated = new Date(
    item.lastUpdatedAt || item.updatedAt || item.createdAt || 0
  ).getTime();

  if (
    Number.isFinite(created) &&
    Number.isFinite(updated) &&
    Math.abs(updated - created) < 60 * 1000
  ) {
    return "created";
  }

  if (!item.lastUpdatedAt && !item.updatedAt) {
    return "created";
  }

  return "updated";
};

const ActivityPanel = ({ cases = [] }) => {
  const navigate = useNavigate();
  const recentCases = [...cases]
    .sort(
      (a, b) =>
        new Date(b.lastUpdatedAt || b.updatedAt || b.createdAt || 0) -
        new Date(a.lastUpdatedAt || a.updatedAt || a.createdAt || 0)
    )
    .slice(0, 4);

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
        <Heading fontSize="14px" fontWeight="600" color="text.primary">
          Recent Activity
        </Heading>
        <Text
          fontSize="12px"
          fontWeight="600"
          color="text.brand"
          cursor="pointer"
          onClick={() => navigate("/cases")}
        >
          View all
        </Text>
      </Flex>

      <Box px={5} pb={4} flex="1" minH={0} overflowY="auto">
        {recentCases.length === 0 ? (
          <Flex minH="140px" align="center" justify="center">
            <Text fontSize="13px" color="text.muted">
              No recent activity
            </Text>
          </Flex>
        ) : (
          <Stack spacing={0}>
            {recentCases.map((item, index) => {
              const kind = activityKind(item);
              const style = ACTIVITY_STYLE[kind];
              const caseRef = formatCaseRef(item);
              const occurredAt = formatActivityTime(
                item.lastUpdatedAt || item.updatedAt || item.createdAt
              );
              const secondary = item.system || "";

              return (
                <Flex
                  key={item.id || index}
                  align="flex-start"
                  gap={3}
                  py={3}
                  borderTopWidth={index === 0 ? 0 : "1px"}
                  borderColor="border.default"
                  cursor="pointer"
                  onClick={() => navigate("/cases")}
                >
                  <Box
                    w="7px"
                    h="7px"
                    mt="6px"
                    borderRadius="full"
                    bg={style.color}
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
                        {caseRef} {style.verb}
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
                    {secondary && (
                      <Text fontSize="12px" color="text.muted" mt={0.5} noOfLines={1}>
                        {secondary}
                      </Text>
                    )}
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

export default ActivityPanel;
