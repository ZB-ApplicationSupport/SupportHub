import React from "react";
import {
  Box,
  Flex,
  Heading,
  Icon,
  SimpleGrid,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiBarChart2 } from "react-icons/fi";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { SurfaceCard } from "../../../components/ui";
import { ATTENTION_COLORS, attentionForCount, severityForCount } from "../automations.data";

const formatCount = (value) => Number(value || 0).toLocaleString("en-GB");

const ChartTooltip = ({
  active,
  payload,
  label,
  tooltipBg,
  tooltipColor,
  tooltipBorder,
}) => {
  if (!active || !payload?.length) return null;
  const title =
    label && typeof label === "string"
      ? label
      : payload[0]?.payload?.label || payload[0]?.name || label;

  return (
    <Box
      bg={tooltipBg}
      color={tooltipColor}
      border="1px solid"
      borderColor={tooltipBorder}
      borderRadius="12px"
      boxShadow="0 8px 24px rgba(15, 23, 42, 0.12)"
      px={3}
      py={2.5}
      minW="140px"
    >
      <Text fontSize="12px" fontWeight="600" mb={1.5}>
        {title}
      </Text>
      {payload.map((entry) => (
        <Flex
          key={entry.dataKey || entry.name}
          align="center"
          justify="space-between"
          gap={4}
          py="2px"
        >
          <Flex align="center" gap={2}>
            <Box
              w="8px"
              h="8px"
              borderRadius="full"
              bg={entry.color || entry.fill}
            />
            <Text fontSize="12px" color="text.muted">
              {entry.name}
            </Text>
          </Flex>
          <Text fontSize="12px" fontWeight="600">
            {formatCount(entry.value)}
          </Text>
        </Flex>
      ))}
    </Box>
  );
};

const useChartTheme = () => {
  const gridStroke = useColorModeValue("#E2E8F0", "#2A332E");
  const tickFill = useColorModeValue("#64748B", "#8B968F");
  const tooltipBg = useColorModeValue("#FFFFFF", "#1A211D");
  const tooltipColor = useColorModeValue("#1A202C", "#F3F6F4");
  const tooltipBorder = useColorModeValue("#E2E8F0", "#2F3A35");
  return { gridStroke, tickFill, tooltipBg, tooltipColor, tooltipBorder };
};

export const AutomationsCompositionCard = ({ data = [] }) => {
  const theme = useChartTheme();
  const hasData = data.some((item) => Number(item.count) > 0);

  return (
    <SurfaceCard p={5} minH="300px" h="100%" display="flex" flexDirection="column">
      <Heading fontSize="14px" fontWeight="500" color="text.primary">
        Exception volume by component
      </Heading>
      <Text fontSize="12px" color="text.muted" mt={1} mb={4}>
        Stacked by High / Watch / Clear bands on each query bucket.
      </Text>
      <Box flex="1" minH="220px" h="220px">
        {!hasData ? (
          <Flex h="100%" align="center" justify="center">
            <Text fontSize="13px" color="text.muted">
              No exception counts for this filter.
            </Text>
          </Flex>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={theme.gridStroke}
                vertical={false}
              />
              <XAxis
                dataKey="component"
                tick={{ fill: theme.tickFill, fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: theme.tickFill, fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={36}
              />
              <Tooltip
                isAnimationActive={false}
                cursor={{ fill: "rgba(0, 132, 61, 0.06)" }}
                content={<ChartTooltip {...theme} />}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} iconType="circle" />
              <Bar
                dataKey="High"
                name="High"
                stackId="volume"
                fill={ATTENTION_COLORS.High.bar}
                maxBarSize={28}
                isAnimationActive={false}
              />
              <Bar
                dataKey="Watch"
                name="Watch"
                stackId="volume"
                fill={ATTENTION_COLORS.Watch.bar}
                maxBarSize={28}
                isAnimationActive={false}
              />
              <Bar
                dataKey="Clear"
                name="Clear"
                stackId="volume"
                fill={ATTENTION_COLORS.Clear.bar}
                radius={[4, 4, 0, 0]}
                maxBarSize={28}
                isAnimationActive={false}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Box>
    </SurfaceCard>
  );
};

export const AutomationsAttentionCard = ({ data = [], total = 0 }) => {
  const theme = useChartTheme();
  const hasData = data.some((item) => Number(item.count) > 0);
  const donutData = data.filter((item) => Number(item.count) > 0);

  return (
    <SurfaceCard p={5} minH="300px" h="100%" display="flex" flexDirection="column">
      <Heading fontSize="14px" fontWeight="500" color="text.primary">
        Attention mix
      </Heading>
      <Text fontSize="12px" color="text.muted" mt={1} mb={4}>
        Share of exception volume sitting in High, Watch, and Clear buckets.
      </Text>
      <Flex flex="1" align="center" gap={4} minH="220px">
        {!hasData ? (
          <Flex w="100%" h="100%" align="center" justify="center">
            <Text fontSize="13px" color="text.muted">
              No exception counts for this filter.
            </Text>
          </Flex>
        ) : (
          <>
            <Box flex="1" minW="0" h="220px" position="relative">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={donutData}
                    dataKey="count"
                    nameKey="label"
                    innerRadius={58}
                    outerRadius={82}
                    paddingAngle={2}
                    stroke="none"
                    isAnimationActive={false}
                  >
                    {donutData.map((entry) => (
                      <Cell key={entry.label} fill={entry.bar} />
                    ))}
                  </Pie>
                  <Tooltip
                    isAnimationActive={false}
                    content={<ChartTooltip {...theme} />}
                  />
                </PieChart>
              </ResponsiveContainer>
              <Flex
                position="absolute"
                inset="0"
                align="center"
                justify="center"
                pointerEvents="none"
                direction="column"
              >
                <Text fontSize="22px" fontWeight="600" lineHeight="1.1">
                  {formatCount(total)}
                </Text>
                <Text fontSize="11px" color="text.muted">
                  exceptions
                </Text>
              </Flex>
            </Box>
            <Box flexShrink={0} minW="112px">
              {data.map((item) => {
                const share =
                  total > 0 ? Math.round((item.count / total) * 100) : 0;
                return (
                  <Box key={item.label} mb={3}>
                    <Flex align="center" gap={2} mb={0.5}>
                      <Box w="8px" h="8px" borderRadius="full" bg={item.bar} />
                      <Text fontSize="12px" fontWeight="600">
                        {item.label}
                      </Text>
                    </Flex>
                    <Text fontSize="13px" fontWeight="600" pl={4}>
                      {formatCount(item.count)}
                      <Text as="span" color="text.muted" fontWeight="500" ml={1}>
                        {share}%
                      </Text>
                    </Text>
                  </Box>
                );
              })}
            </Box>
          </>
        )}
      </Flex>
    </SurfaceCard>
  );
};

export const AutomationsIssueRankCard = ({ data = [] }) => {
  const max = Math.max(...data.map((item) => Number(item.count) || 0), 1);
  const total = data.reduce((sum, item) => sum + (Number(item.count) || 0), 0);
  const top = data[0];

  return (
    <SurfaceCard p={5} minH="300px" h="100%" display="flex" flexDirection="column">
      <Heading fontSize="14px" fontWeight="500" color="text.primary">
        Issues ranked
      </Heading>
      <Text fontSize="12px" color="text.muted" mt={1} mb={4}>
        {top
          ? `${top.issue} is the largest issue (${formatCount(top.count)}).`
          : "No issues for this filter."}
      </Text>
      <Box flex="1">
        {!data.length ? (
          <Flex minH="160px" align="center" justify="center">
            <Text fontSize="13px" color="text.muted">
              No issue counts for this filter.
            </Text>
          </Flex>
        ) : (
          data.map((item) => {
            const count = Number(item.count) || 0;
            const share = total > 0 ? Math.round((count / total) * 100) : 0;
            const width = `${Math.max((count / max) * 100, count > 0 ? 6 : 0)}%`;
            return (
              <Box key={`${item.component}::${item.issue}`} py={2}>
                <Flex justify="space-between" gap={3} mb={1.5}>
                  <Box minW={0}>
                    <Text fontSize="13px" fontWeight="600" noOfLines={1}>
                      {item.issue}
                    </Text>
                    <Text fontSize="11px" color="text.muted" noOfLines={1}>
                      {item.component}
                    </Text>
                  </Box>
                  <Text fontSize="13px" fontWeight="600" flexShrink={0}>
                    {formatCount(count)}
                    <Text as="span" color="text.muted" fontWeight="500" ml={1}>
                      {share}%
                    </Text>
                  </Text>
                </Flex>
                <Box h="8px" bg="surface.subtle" borderRadius="999px" overflow="hidden">
                  <Box
                    h="100%"
                    w={width}
                    bg={attentionForCount(count).bar}
                    borderRadius="999px"
                  />
                </Box>
              </Box>
            );
          })
        )}
      </Box>
    </SurfaceCard>
  );
};

export const AutomationsMixCard = ({ data = [] }) => {
  const theme = useChartTheme();
  const chartData = data
    .filter((item) => !item.unavailable)
    .map((item) => ({
      label: item.acronym || item.label,
      count: Number(item.count) || 0,
      fill: severityForCount(item.count, item.unavailable).accent,
    }));
  const hasData = chartData.some((item) => item.count > 0);

  return (
    <SurfaceCard p={5} minH="280px" h="100%" display="flex" flexDirection="column">
      <Flex align="center" gap={2}>
        <Icon as={FiBarChart2} color="brand.500" boxSize={4} />
        <Heading fontSize="14px" fontWeight="600" color="text.primary">
          Exceptions graph
        </Heading>
      </Flex>
      <Text fontSize="12px" color="text.muted" mt={1} mb={4}>
        Live counts from the Ops Report APIs. Historical trend is not available.
      </Text>
      <Box flex="1" minH="200px">
        {!hasData ? (
          <Flex h="200px" align="center" justify="center">
            <Text fontSize="13px" color="text.muted">
              No live exception counts yet.
            </Text>
          </Flex>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={chartData}
              margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={theme.gridStroke}
                vertical={false}
              />
              <XAxis
                dataKey="label"
                tick={{ fill: theme.tickFill, fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: theme.tickFill, fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <Tooltip
                isAnimationActive={false}
                cursor={{ fill: "rgba(0, 132, 61, 0.06)" }}
                content={<ChartTooltip {...theme} />}
              />
              <Bar
                dataKey="count"
                name="Records"
                maxBarSize={28}
                radius={[6, 6, 0, 0]}
                isAnimationActive={false}
              >
                {chartData.map((item) => (
                  <Cell key={item.label} fill={item.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </Box>
    </SurfaceCard>
  );
};

export const AutomationsHealthCard = ({ data = [], loading }) => {
  const track = useColorModeValue("#E8F5EE", "#1F3328");
  const available = data.filter((item) => !item.unavailable);
  const healthy = available.filter((item) => Number(item.count) <= 0).length;
  const critical = available.filter((item) => Number(item.count) >= 100).length;
  const attention = Math.max(available.length - healthy - critical, 0);
  const total = available.length;
  const share = (value) =>
    total > 0 ? `${Math.round((value / total) * 100)}%` : "—";
  const chartData = [
    { name: "Clear", value: healthy, fill: "#12B76A" },
    { name: "Other", value: Math.max(total - healthy, 0), fill: track },
  ].filter((item) => item.value > 0);

  return (
    <SurfaceCard p={5} minH="280px" h="100%" display="flex" flexDirection="column">
      <Heading fontSize="14px" fontWeight="600">
        Monitor health
      </Heading>
      <Text fontSize="12px" color="text.muted" mt={1}>
        Share of live monitors with no outstanding records.
      </Text>
      <Flex flex="1" align="center" justify="center" position="relative" minH="180px">
        {loading || !total ? (
          <Text fontSize="13px" color="text.muted">
            {loading ? "Loading live counts…" : "No live monitors yet."}
          </Text>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  startAngle={180}
                  endAngle={0}
                  innerRadius={72}
                  outerRadius={96}
                  stroke="none"
                  isAnimationActive={false}
                >
                  {chartData.map((item) => (
                    <Cell key={item.name} fill={item.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <Box position="absolute" textAlign="center" pt={6}>
              <Text fontSize="28px" fontWeight="700" letterSpacing="-0.04em">
                {healthy}/{total}
              </Text>
              <Text fontSize="12px" color="text.muted">
                monitors clear
              </Text>
            </Box>
          </>
        )}
      </Flex>
      <SimpleGrid columns={3} spacing={2} mt={2}>
        {[
          { label: "Healthy", value: share(healthy), color: "#0C5F2C" },
          { label: "Attention", value: share(attention), color: "#B45309" },
          { label: "Action needed", value: share(critical), color: "#BE123C" },
        ].map((item) => (
          <Box key={item.label} bg="surface.subtle" borderRadius="12px" px={2} py={2}>
            <Text fontSize="11px" color="text.muted">
              {item.label}
            </Text>
            <Text fontSize="14px" fontWeight="700" color={item.color}>
              {item.value}
            </Text>
          </Box>
        ))}
      </SimpleGrid>
    </SurfaceCard>
  );
};

export const AutomationsBreakdownCard = ({ data = [], onOpen }) => {
  const [tab, setTab] = React.useState("loans");
  const items = data
    .filter((item) => item.group === tab)
    .slice()
    .sort((a, b) => Number(b.count || 0) - Number(a.count || 0));
  const featured = items[0];
  const rest = items.slice(1, 4);

  return (
    <SurfaceCard p={5} minH="280px" h="100%" display="flex" flexDirection="column">
      <Heading fontSize="14px" fontWeight="600">
        Exception breakdown
      </Heading>
      <Text fontSize="12px" color="text.muted" mt={1} mb={3}>
        Live counts grouped by loan and account monitors.
      </Text>
      <Flex gap={2} mb={4}>
        {[
          { id: "loans", label: "Loans" },
          { id: "accounts", label: "Accounts" },
        ].map((item) => {
          const active = tab === item.id;
          return (
            <Box
              key={item.id}
              as="button"
              type="button"
              onClick={() => setTab(item.id)}
              px={3}
              py={1.5}
              borderRadius="10px"
              fontSize="12px"
              fontWeight="700"
              bg={active ? "brand.500" : "surface.subtle"}
              color={active ? "white" : "text.muted"}
            >
              {item.label}
            </Box>
          );
        })}
      </Flex>
      {featured ? (
        <SimpleGrid columns={2} spacing={3} flex="1">
          <Box
            as={featured.classifications?.length ? "button" : undefined}
            type={featured.classifications?.length ? "button" : undefined}
            onClick={
              featured.classifications?.length ? () => onOpen(featured) : undefined
            }
            bg="brand.500"
            color="white"
            borderRadius="16px"
            p={4}
            textAlign="left"
          >
            <Text fontSize="12px" opacity={0.85} noOfLines={1}>
              {featured.label}
            </Text>
            <Text fontSize="28px" fontWeight="700" letterSpacing="-0.04em" mt={2}>
              {formatCount(featured.count)}
            </Text>
          </Box>
          {rest.map((item) => (
            <Box
              key={item.id}
              as={item.classifications?.length ? "button" : undefined}
              type={item.classifications?.length ? "button" : undefined}
              onClick={
                item.classifications?.length ? () => onOpen(item) : undefined
              }
              bg="surface.subtle"
              borderRadius="16px"
              p={4}
              textAlign="left"
            >
              <Text fontSize="12px" color="text.muted" noOfLines={1}>
                {item.label}
              </Text>
              <Text fontSize="22px" fontWeight="700" letterSpacing="-0.03em" mt={1}>
                {formatCount(item.count)}
              </Text>
            </Box>
          ))}
        </SimpleGrid>
      ) : (
        <Flex flex="1" align="center" justify="center">
          <Text fontSize="13px" color="text.muted">
            No live counts for this group.
          </Text>
        </Flex>
      )}
    </SurfaceCard>
  );
};


