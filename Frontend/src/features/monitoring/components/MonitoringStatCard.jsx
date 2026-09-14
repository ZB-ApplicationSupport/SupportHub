import React from "react";
import {
    Box,
    Flex,
    Text,
    useColorModeValue,
} from "@chakra-ui/react";
import { useChartStatsPopup } from "../../../components/ui";

const ARC_SEGMENTS = 34;

const DEFAULT_THRESHOLDS = [
    { max: 50, color: "#00843D", label: "Normal" },
    { max: 75, color: "#F4B41A", label: "Attention" },
    { max: 100, color: "#D64545", label: "Critical" },
];

const getThresholdForValue = (percentage, thresholds = DEFAULT_THRESHOLDS) => {
    if (!Number.isFinite(percentage)) {
        return null;
    }

    return (
        thresholds.find(({ max }) => percentage <= max) ||
        thresholds[thresholds.length - 1] ||
        null
    );
};

const getSegmentColor = (segmentPercentage, thresholds) => {
    const threshold = getThresholdForValue(segmentPercentage, thresholds);
    return threshold?.color || "#00843D";
};

export const interpretUtilization = (percentage, thresholds = DEFAULT_THRESHOLDS) =>
    getThresholdForValue(percentage, thresholds);

const ArcGauge = ({
                      percentage,
                      active,
                      thresholds = DEFAULT_THRESHOLDS,
                  }) => {
    const trackColor = useColorModeValue("#C5CDD6", "#B0B0B0");
    const activeSegments = active
        ? Math.round((percentage / 100) * ARC_SEGMENTS)
        : 0;

    return (
        <Box
            position="relative"
            width="230px"
            maxW="100%"
            height="100px"
            mx="auto"
            mt={1}
            aria-hidden="true"
        >
            {Array.from({ length: ARC_SEGMENTS }, (_, index) => {
                const angle = -86 + (index * 172) / (ARC_SEGMENTS - 1);
                const isActive = index < activeSegments;
                const segmentPercentage =
                    ((index + 1) / ARC_SEGMENTS) * 100;

                return (
                    <Box
                        key={index}
                        position="absolute"
                        left="50%"
                        top="4px"
                        width="7px"
                        height="28px"
                        borderRadius="5px"
                        bg={
                            isActive
                                ? getSegmentColor(segmentPercentage, thresholds)
                                : trackColor
                        }
                        transform={`translateX(-50%) rotate(${angle}deg)`}
                        transformOrigin="50% 104px"
                    />
                );
            })}
        </Box>
    );
};

const MonitoringStatCard = ({
                                title,
                                value,
                                type = "value",
                                percentage = 0,
                                subtitle,
                                caption,
                                thresholds,
                                showInterpretation = true,
                            }) => {
    const safePercentage = Math.min(
        Math.max(Number(percentage) || 0, 0),
        100
    );
    const hasReading =
        Number.isFinite(Number(percentage)) &&
        value !== "Loading..." &&
        value !== "Unavailable";
    const interpretation =
        showInterpretation && hasReading
            ? interpretUtilization(safePercentage, thresholds)
            : null;
    const statusText = subtitle || interpretation?.label;
    const { showPopup, hidePopup, popupNode } = useChartStatsPopup();
    const popupStats = {
        title,
        items: [
            {
                label: "Reading",
                value,
                color: interpretation?.color,
            },
            hasReading
                ? {
                    label: "Utilization",
                    value: `${safePercentage.toFixed(1)}%`,
                }
                : null,
            statusText
                ? {
                    label: "Status",
                    value: statusText,
                    color: interpretation?.color,
                }
                : null,
            caption
                ? {
                    label: "Detail",
                    value: caption,
                }
                : null,
        ].filter(Boolean),
    };

    if (type === "gauge") {
        return (
            <Box
                bg="surface.card"
                border="1px solid"
                borderColor="border.default"
                borderRadius="16px"
                boxShadow="card"
                minH="180px"
                h="100%"
                px={5}
                py={5}
                cursor="default"
                onMouseEnter={(event) => showPopup(event, popupStats)}
                onMouseMove={(event) => showPopup(event, popupStats)}
                onMouseLeave={hidePopup}
            >
                <Text
                    fontSize="13px"
                    fontWeight="500"
                    color="text.primary"
                    mb={1}
                >
                    {title}
                </Text>

                <Box>
                    <ArcGauge
                        percentage={safePercentage}
                        active={hasReading}
                        thresholds={thresholds}
                    />
                </Box>

                <Flex
                    direction="column"
                    align="center"
                    mt="-40px"
                    position="relative"
                >
                    <Text
                        fontSize="28px"
                        fontWeight="600"
                        color="text.primary"
                        lineHeight="1"
                        letterSpacing="-0.02em"
                    >
                        {value}
                    </Text>

                    {statusText && (
                        <Flex align="center" justify="center" gap={2} mt={2}>
                            {interpretation?.color && (
                                <Box
                                    w="7px"
                                    h="7px"
                                    borderRadius="full"
                                    bg={interpretation.color}
                                    flexShrink={0}
                                />
                            )}
                            <Text
                                fontSize="12px"
                                fontWeight="500"
                                color={interpretation?.color || "text.muted"}
                            >
                                {statusText}
                            </Text>
                        </Flex>
                    )}
                </Flex>
                {popupNode}
            </Box>
        );
    }

    return (
        <Box
            bg="surface.card"
            border="1px solid"
            borderColor="border.default"
            borderRadius="16px"
            boxShadow="card"
            minH="166px"
            px={4}
            py={3}
        >
            <Text
                fontSize="13px"
                fontWeight="500"
                color="text.muted"
                mb={1}
            >
                {title}
            </Text>

            <Flex
                direction="column"
                align="flex-start"
                justify="center"
                minH="110px"
            >
                <Text
                    fontSize="26px"
                    fontWeight="600"
                    color="text.primary"
                    lineHeight="1"
                >
                    {value}
                </Text>

                {subtitle && (
                    <Text
                        fontSize="12px"
                        color="text.muted"
                        mt={2}
                    >
                        {subtitle}
                    </Text>
                )}
            </Flex>
        </Box>
    );
};

export default MonitoringStatCard;
