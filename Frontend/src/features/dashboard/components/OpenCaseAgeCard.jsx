import React, { useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import { ChartStatsPopup, SurfaceCard } from "../../../components/ui";

const CX = 100;
const CY = 112;
const RADIUS = 82;
const STROKE = 18;
const VIEW_W = 200;
const VIEW_H = 132;

const polar = (t, radius = RADIUS) => {
  const angle = Math.PI * (1 - t);
  return {
    x: CX + radius * Math.cos(angle),
    y: CY - radius * Math.sin(angle),
  };
};

const arcPath = (t0, t1, radius = RADIUS) => {
  const start = polar(t0, radius);
  const end = polar(t1, radius);
  const largeArc = t1 - t0 > 0.5 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`;
};

const hoursToPosition = (hours) => {
  if (!Number.isFinite(hours) || hours <= 0) return 0;
  if (hours <= 24) return (hours / 24) * (1 / 3);
  if (hours <= 72) return 1 / 3 + ((hours - 24) / 48) * (1 / 3);
  return Math.min(1, 2 / 3 + ((hours - 72) / 240) * (1 / 3));
};

const formatAverage = (hours) => {
  if (!Number.isFinite(hours)) return "—";
  if (hours < 1) return "<1h";
  if (hours < 24) return `${Math.round(hours)}h`;
  const days = hours / 24;
  if (days < 10) return `${days.toFixed(1)}d`;
  return `${Math.round(days)}d`;
};

const OpenCaseAgeCard = ({ data }) => {
  const [hovered, setHovered] = useState(null);
  const needle = useColorModeValue("#1A202C", "#F3F6F4");
  const track = useColorModeValue("#F1F5F2", "#232B27");
  const hubFill = useColorModeValue("#FFFFFF", "#1A211D");

  const buckets = data?.buckets || [];
  const total = Number(data?.total) || 0;
  const averageHours = data?.averageHours;
  const hoveredBucket = buckets.find((bucket) => bucket.label === hovered?.label);

  const showPopup = (event, label) => {
    setHovered({
      label,
      x: event.clientX,
      y: event.clientY,
    });
  };

  const hidePopup = () => setHovered(null);
  const needleT = hoursToPosition(averageHours);
  const markerOuter = polar(needleT, RADIUS + STROKE / 2 + 1);
  const markerLeft = polar(Math.max(0, needleT - 0.02), RADIUS - STROKE / 2 + 1);
  const markerRight = polar(Math.min(1, needleT + 0.02), RADIUS - STROKE / 2 + 1);

  return (
    <SurfaceCard
      p={5}
      minH="280px"
      h="100%"
      overflow="hidden"
      display="flex"
      flexDirection="column"
    >
      <Heading fontSize="14px" fontWeight="600" color="text.primary" mb={2}>
        Open Case Age
      </Heading>

      {total === 0 ? (
        <Flex flex="1" align="center" justify="center">
          <Text fontSize="13px" color="text.muted">
            No open cases with dates
          </Text>
        </Flex>
      ) : (
        <Flex
          flex="1"
          minH={0}
          align="center"
          gap={4}
          direction={{ base: "column", sm: "row" }}
        >
          <Box flex="1" minW={0} minH="170px" h="100%" position="relative">
            <Box
              as="svg"
              position="absolute"
              inset={0}
              w="100%"
              h="100%"
              viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
              preserveAspectRatio="xMidYMid meet"
            >
              <path
                d={arcPath(0, 1)}
                fill="none"
                stroke={track}
                strokeWidth={STROKE}
                strokeLinecap="butt"
              />
              {buckets.map((bucket, index) => {
                const t0 = index / buckets.length;
                const t1 = (index + 1) / buckets.length;
                const gap = 0.008;
                const path = arcPath(t0 + gap, t1 - gap);
                const isActive = hovered?.label === bucket.label;
                const isDimmed = hovered && !isActive;
                return (
                  <g key={bucket.label}>
                    <path
                      d={path}
                      fill="none"
                      stroke={bucket.color}
                      strokeWidth={isActive ? STROKE + 4 : STROKE}
                      strokeLinecap="butt"
                      opacity={isDimmed ? 0.28 : 1}
                      style={{ transition: "opacity 0.15s ease, stroke-width 0.15s ease" }}
                    />
                    <path
                      d={path}
                      fill="none"
                      stroke="transparent"
                      strokeWidth={STROKE + 14}
                      strokeLinecap="butt"
                      style={{ cursor: "pointer" }}
                      onMouseEnter={(event) => showPopup(event, bucket.label)}
                      onMouseMove={(event) => showPopup(event, bucket.label)}
                      onMouseLeave={hidePopup}
                    />
                  </g>
                );
              })}
              <line
                x1={CX}
                y1={CY}
                x2={markerOuter.x}
                y2={markerOuter.y}
                stroke={needle}
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d={`M ${markerOuter.x} ${markerOuter.y} L ${markerLeft.x} ${markerLeft.y} L ${markerRight.x} ${markerRight.y} Z`}
                fill={needle}
              />
              <circle cx={CX} cy={CY} r="5.5" fill={needle} />
              <circle cx={CX} cy={CY} r="2.5" fill={hubFill} />
            </Box>
            <Flex
              position="absolute"
              left="0"
              right="0"
              bottom="30%"
              direction="column"
              align="center"
              pointerEvents="none"
            >
              <Text fontSize="28px" fontWeight="700" color="text.primary" lineHeight="1">
                {formatAverage(averageHours)}
              </Text>
              <Text fontSize="11px" color="text.muted" mt="6px">
                avg open age
              </Text>
            </Flex>
          </Box>

          <Stack
            spacing={2.5}
            flexShrink={0}
            w={{ base: "100%", sm: "118px" }}
            justify="center"
          >
            {buckets.map((row) => {
              const isActive = hovered?.label === row.label;
              const isDimmed = hovered && !isActive;
              return (
                <Flex
                  key={row.label}
                  align="center"
                  gap={2}
                  minW={0}
                  px={1}
                  mx={-1}
                  py={0.5}
                  borderRadius="6px"
                  cursor="pointer"
                  opacity={isDimmed ? 0.45 : 1}
                  bg={isActive ? "surface.subtle" : "transparent"}
                  transition="opacity 0.15s ease, background-color 0.15s ease"
                  onMouseEnter={(event) => showPopup(event, row.label)}
                  onMouseMove={(event) => showPopup(event, row.label)}
                  onMouseLeave={hidePopup}
                >
                  <Box
                    w="8px"
                    h="8px"
                    borderRadius="full"
                    bg={row.color}
                    flexShrink={0}
                  />
                  <Text
                    fontSize="12px"
                    color="text.muted"
                    noOfLines={1}
                    flex="1"
                    minW={0}
                    fontWeight={isActive ? "600" : "400"}
                  >
                    {row.label}
                  </Text>
                  <Text
                    fontSize="12px"
                    fontWeight="600"
                    color="text.primary"
                    flexShrink={0}
                  >
                    {Number.isFinite(row.percent) ? `${row.percent}%` : row.value}
                  </Text>
                </Flex>
              );
            })}
          </Stack>
        </Flex>
      )}
      {hoveredBucket && hovered && (
        <ChartStatsPopup
          title={hoveredBucket.label}
          x={hovered.x}
          y={hovered.y}
          items={[
            {
              label: "Cases",
              value: hoveredBucket.value,
              color: hoveredBucket.color,
            },
            {
              label: "Share",
              value: Number.isFinite(hoveredBucket.percent)
                ? `${hoveredBucket.percent}%`
                : "—",
            },
          ]}
        />
      )}
    </SurfaceCard>
  );
};

export default OpenCaseAgeCard;
