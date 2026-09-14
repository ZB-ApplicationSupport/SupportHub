import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Heading,
  Icon,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import {
  FiActivity,
  FiAlertTriangle,
  FiClock,
  FiFileText,
  FiRefreshCw,
} from "react-icons/fi";
import {
  CompactDesktopScale,
  PageHeader,
  PageOutlineButton,
  SurfaceCard,
} from "../../../components/ui";
import {
  AUTOMATION_STATS,
  PIPELINE_LEGEND,
  severityForCount,
} from "../automations.data";
import { getAutomationStats } from "../automations.api";
import { AutomationsMixCard } from "../components/AutomationsCharts";
import AutomationExtractModal from "../components/AutomationExtractModal";
import MonitorStatCard from "../components/MonitorStatCard";

const formatCount = (value) =>
  value == null ? "—" : Number(value).toLocaleString("en-GB");

const formatStamp = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Africa/Harare",
  });
};

const formatTime = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Africa/Harare",
  });
};

const VIEWS = [
  { id: "overview", label: "Dashboard" },
  { id: "loans", label: "Loan extracts" },
  { id: "accounts", label: "Account extracts" },
];

const TABLE_HEAD = {
  fontSize: "10px",
  fontWeight: "700",
  color: "text.muted",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};

const SectionTitle = ({ icon, iconColor = "brand.500", children }) => (
  <Flex align="center" gap={2} mb={4}>
    {icon ? <Icon as={icon} color={iconColor} boxSize={4} /> : null}
    <Heading fontSize="14px" fontWeight="600">
      {children}
    </Heading>
  </Flex>
);

const EMPTY_STATS = AUTOMATION_STATS.map((stat) => ({
  id: stat.id,
  label: stat.label,
  hint: stat.hint,
  component: stat.component,
  acronym: stat.acronym,
  group: stat.group,
  classifications: stat.classifications || [],
  count: null,
  unavailable: true,
}));

const OVERVIEW_CARD_ORDER = [
  "loans-without-settlement",
  "loans-without-schedule",
  "static-holds-to-place",
  "static-holds-to-unblock",
  "loans-incorrect-status",
  "account-service-fees",
  "unknown-holds",
  "minimum-balance",
];

const ACTIVITY_FEED_LIMIT = 3;

const ActivityFeed = ({ stats, fetchedAt, loading }) => (
  <SurfaceCard p={5} h="100%" display="flex" flexDirection="column">
    <SectionTitle icon={FiClock}>Activity feed</SectionTitle>
    <Stack spacing={3} flex="1">
      {stats.slice(0, ACTIVITY_FEED_LIMIT).map((stat) => (
        <Flex key={stat.id} align="flex-start" gap={3}>
          <Flex
            w="28px"
            h="28px"
            borderRadius="full"
            align="center"
            justify="center"
            bg="surface.subtle"
            fontSize="10px"
            fontWeight="700"
            flexShrink={0}
          >
            {(stat.acronym || stat.label).slice(0, 2)}
          </Flex>
          <Box minW={0} flex="1">
            <Text fontSize="13px" fontWeight="600" noOfLines={1}>
              {stat.label}
            </Text>
            <Text fontSize="11px" color="text.muted">
              {loading
                ? "Loading count…"
                : stat.unavailable
                  ? "Count failed"
                  : `${formatCount(stat.count)} records`}
            </Text>
          </Box>
          <Text fontSize="12px" color="text.muted" flexShrink={0}>
            {formatTime(fetchedAt)}
          </Text>
        </Flex>
      ))}
    </Stack>
  </SurfaceCard>
);

const SystemStatus = ({ items }) => (
  <SurfaceCard p={5} h="100%" display="flex" flexDirection="column">
    <SectionTitle icon={FiActivity}>System status</SectionTitle>
    <Stack spacing={4} flex="1" justify="center">
      {items.map((item) => (
        <Flex key={item.label} align="center" justify="space-between">
          <Flex align="center" gap={2}>
            <Box
              w="8px"
              h="8px"
              borderRadius="full"
              bg={item.ok ? "#12B76A" : "#D64545"}
            />
            <Text fontSize="13px">{item.label}</Text>
          </Flex>
          <Text
            fontSize="12px"
            fontWeight="600"
            color={item.ok ? "brand.500" : "danger.onWash"}
          >
            {item.ok ? "Operational" : "Unavailable"}
          </Text>
        </Flex>
      ))}
    </Stack>
  </SurfaceCard>
);

const RequiresAttention = ({ rows, onOpen }) => (
  <SurfaceCard p={5} h="100%" display="flex" flexDirection="column">
    <SectionTitle icon={FiAlertTriangle} iconColor="#BE123C">
      Requires attention
    </SectionTitle>
    {rows.length ? (
      <Stack spacing={0} flex="1">
        {rows.map((stat) => {
          const severity = severityForCount(stat.count, stat.unavailable);
          return (
            <Flex
              key={stat.id}
              align="center"
              gap={3}
              py={3}
              borderTop="1px solid"
              borderColor="border.default"
            >
              <Text
                w="64px"
                fontSize="13px"
                fontWeight="700"
                color={severity.color}
              >
                {formatCount(stat.count)}
              </Text>
              <Text flex="1" fontSize="13px" noOfLines={1}>
                {stat.label}
              </Text>
              <Text
                fontSize="11px"
                fontWeight="600"
                color={severity.color}
                bg={severity.bg}
                px={2}
                py={0.5}
                borderRadius="full"
                flexShrink={0}
              >
                {severity.label}
              </Text>
              <Box
                as="button"
                type="button"
                fontSize="12px"
                fontWeight="600"
                color="brand.500"
                flexShrink={0}
                onClick={() => onOpen(stat)}
              >
                View →
              </Box>
            </Flex>
          );
        })}
      </Stack>
    ) : (
      <Text fontSize="13px" color="text.muted">
        No monitors currently need attention.
      </Text>
    )}
  </SurfaceCard>
);

const AutomationsPage = () => {
  const [stats, setStats] = useState(EMPTY_STATS);
  const [source, setSource] = useState("fallback");
  const [loading, setLoading] = useState(true);
  const [fetchedAt, setFetchedAt] = useState(null);
  const [selected, setSelected] = useState({ stat: null, classificationId: "" });
  const [view, setView] = useState("overview");

  const load = useCallback(async ({ fresh = false } = {}) => {
    setLoading(true);
    try {
      const result = await getAutomationStats(undefined, { fresh });
      setFetchedAt(result.fetchedAt);
      if (result.live && result.stats?.length) {
        setStats(result.stats);
        setSource("live");
      } else {
        setStats(EMPTY_STATS);
        setSource("fallback");
      }
    } catch (error) {
      setFetchedAt(null);
      setStats(EMPTY_STATS);
      setSource("fallback");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const visibleStats = useMemo(() => {
    if (view === "loans") return stats.filter((stat) => stat.group === "loans");
    if (view === "accounts") return stats.filter((stat) => stat.group === "accounts");
    return stats;
  }, [stats, view]);

  const overviewStats = useMemo(() => {
    const byId = Object.fromEntries(stats.map((stat) => [stat.id, stat]));
    return OVERVIEW_CARD_ORDER.map((id) => byId[id]).filter(Boolean);
  }, [stats]);

  const attentionRows = useMemo(
    () =>
      visibleStats
        .filter((stat) => !stat.unavailable && Number(stat.count) > 0)
        .sort((a, b) => Number(b.count) - Number(a.count)),
    [visibleStats]
  );

  const statusItems = [
    {
      label: "Ops Report API",
      ok: source === "live",
    },
    {
      label: "Loan counts",
      ok: stats
        .filter((stat) => stat.group === "loans")
        .every((stat) => !stat.unavailable),
    },
    {
      label: "Account counts",
      ok: stats
        .filter((stat) => stat.group === "accounts")
        .every((stat) => !stat.unavailable),
    },
    {
      label: "Extract jobs",
      ok: source === "live" && stats.some((stat) => !stat.unavailable),
    },
  ];

  const openStat = (stat, classificationId) => {
    if (!stat?.classifications?.length) return;
    setSelected({ stat, classificationId: classificationId || "" });
  };

  return (
    <CompactDesktopScale>
      <Stack spacing={4} w="100%">
        <PageHeader
          title="Automations"
          subtitle="Live exception monitors across loans and accounts"
          mb={1}
          actions={
            <Flex align="center" gap={4} flexWrap="wrap">
              <Flex align="center" gap={3}>
                {PIPELINE_LEGEND.map((item) => (
                  <Flex key={item.key} align="center" gap={1.5}>
                    <Box w="8px" h="8px" borderRadius="full" bg={item.accent} />
                    <Text fontSize="12px" color="text.muted">
                      {item.label}
                    </Text>
                  </Flex>
                ))}
              </Flex>
              <Flex align="center" gap={2}>
                <Box
                  w="8px"
                  h="8px"
                  borderRadius="full"
                  bg={source === "live" ? "#12B76A" : "#D64545"}
                />
                <Text fontSize="12px" color="text.muted">
                  {source === "live" ? "Live" : "Waiting for Ops Report"}
                </Text>
              </Flex>
              <Box>
                <Text fontSize="10px" color="text.muted" textTransform="uppercase">
                  Last updated
                </Text>
                <Text fontSize="12px" fontWeight="600">
                  {formatStamp(fetchedAt)}
                </Text>
              </Box>
              <PageOutlineButton
                h="36px"
                leftIcon={<FiRefreshCw />}
                isLoading={loading}
                loadingText="Refreshing"
                onClick={() => load({ fresh: true })}
              >
                Refresh
              </PageOutlineButton>
            </Flex>
          }
        />

        <Flex
          gap={6}
          borderBottom="1px solid"
          borderColor="border.default"
          mb={1}
        >
          {VIEWS.map((item) => {
            const active = view === item.id;
            return (
              <Box
                key={item.id}
                as="button"
                type="button"
                onClick={() => setView(item.id)}
                pb={3}
                mb="-1px"
                borderBottom="2px solid"
                borderColor={active ? "text.primary" : "transparent"}
                color={active ? "text.primary" : "text.muted"}
                fontSize="14px"
                fontWeight={active ? "700" : "500"}
              >
                {item.label}
              </Box>
            );
          })}
        </Flex>

        {view === "overview" ? (
          <Grid
            templateColumns={{
              base: "1fr",
              xl: "minmax(0, 2.2fr) minmax(260px, 0.85fr) minmax(280px, 0.95fr)",
            }}
            templateRows={{ xl: "auto minmax(240px, 1fr)" }}
            gap={4}
            alignItems="stretch"
          >
            <GridItem>
              <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={4} alignItems="start">
                {overviewStats.map((stat) => (
                  <MonitorStatCard
                    key={stat.id}
                    stat={stat}
                    loading={loading}
                    onOpen={
                      stat.classifications?.length
                        ? () => openStat(stat)
                        : undefined
                    }
                  />
                ))}
              </SimpleGrid>
            </GridItem>

            <GridItem>
              <ActivityFeed
                stats={stats}
                fetchedAt={fetchedAt}
                loading={loading}
              />
            </GridItem>

            <GridItem rowSpan={{ xl: 2 }}>
              <RequiresAttention rows={attentionRows} onOpen={openStat} />
            </GridItem>

            <GridItem>
              <AutomationsMixCard data={stats} />
            </GridItem>

            <GridItem>
              <SystemStatus items={statusItems} />
            </GridItem>
          </Grid>
        ) : (
          <>
            <SimpleGrid columns={{ base: 1, sm: 2, xl: 4 }} spacing={4} alignItems="start">
              {visibleStats.map((stat) => (
                <MonitorStatCard
                  key={stat.id}
                  stat={stat}
                  loading={loading}
                  onOpen={
                    stat.classifications?.length ? () => openStat(stat) : undefined
                  }
                />
              ))}
            </SimpleGrid>

            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={4}>
              <RequiresAttention rows={attentionRows} onOpen={openStat} />
              <SurfaceCard p={5}>
                <SectionTitle icon={FiFileText}>Recent extracts</SectionTitle>
                <Stack spacing={0}>
                  <Flex {...TABLE_HEAD} gap={3} pb={2}>
                    <Text flex="1">Extract</Text>
                    <Text w="72px" textAlign="right">
                      Records
                    </Text>
                    <Text w="88px">Status</Text>
                    <Text w="48px" textAlign="right">
                      Last run
                    </Text>
                  </Flex>
                  {visibleStats.map((stat) => (
                    <Flex
                      key={stat.id}
                      as={stat.classifications?.length ? "button" : undefined}
                      type={stat.classifications?.length ? "button" : undefined}
                      onClick={
                        stat.classifications?.length
                          ? () => openStat(stat)
                          : undefined
                      }
                      align="center"
                      gap={3}
                      py={3}
                      w="100%"
                      textAlign="left"
                      borderTop="1px solid"
                      borderColor="border.default"
                      cursor={stat.classifications?.length ? "pointer" : "default"}
                    >
                      <Text flex="1" fontSize="13px" fontWeight="600" noOfLines={1}>
                        {stat.acronym || stat.label}
                      </Text>
                      <Text
                        fontSize="12px"
                        color="text.muted"
                        w="72px"
                        textAlign="right"
                      >
                        {formatCount(stat.count)}
                      </Text>
                      <Flex w="88px" align="center" gap={1.5}>
                        <Box
                          w="6px"
                          h="6px"
                          borderRadius="full"
                          bg={stat.unavailable ? "#D64545" : "#12B76A"}
                        />
                        <Text
                          fontSize="11px"
                          fontWeight="600"
                          color={stat.unavailable ? "danger.onWash" : "brand.500"}
                        >
                          {stat.unavailable ? "Failed" : "Completed"}
                        </Text>
                      </Flex>
                      <Text
                        fontSize="12px"
                        color="text.muted"
                        w="48px"
                        textAlign="right"
                      >
                        {formatTime(fetchedAt)}
                      </Text>
                    </Flex>
                  ))}
                </Stack>
              </SurfaceCard>
            </SimpleGrid>
          </>
        )}

        <AutomationExtractModal
          isOpen={Boolean(selected.stat)}
          onClose={() => setSelected({ stat: null, classificationId: "" })}
          stat={selected.stat}
          initialClassificationId={selected.classificationId}
        />
      </Stack>
    </CompactDesktopScale>
  );
};

export default AutomationsPage;
