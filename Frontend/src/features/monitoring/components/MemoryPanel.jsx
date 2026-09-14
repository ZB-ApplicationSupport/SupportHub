import React from "react";
import {
    Box,
    Flex,
    Text,
} from "@chakra-ui/react";
import { useChartStatsPopup } from "../../../components/ui";
import { interpretUtilization } from "./MonitoringStatCard";

const clampPercentage = (value) =>
    Math.min(
        Math.max(Number(value) || 0, 0),
        100
    );

const formatGiB = (value) => {
    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "—";
    }

    return number.toFixed(2);
};

const barColorForUsage = (usedPercentage) => {
    if (usedPercentage > 75) return "#D64545";
    if (usedPercentage > 50) return "#F4B41A";
    return "#00843D";
};

const MemoryPanel = ({
                         total,
                         used,
                         free,
                     }) => {
    const safeTotal = Number(total) || 0;
    const safeUsed = Number(used) || 0;
    const safeFree = Number(free) || 0;
    const usedPercentage = safeTotal > 0
        ? clampPercentage((safeUsed / safeTotal) * 100)
        : 0;
    const barColor = barColorForUsage(usedPercentage);
    const status = interpretUtilization(usedPercentage);
    const { showPopup, hidePopup, popupNode } = useChartStatsPopup();
    const popupStats = {
        title: "Memory",
        items: [
            {
                label: "Used",
                value: `${formatGiB(safeUsed)} GiB`,
                color: barColor,
            },
            {
                label: "Free",
                value: `${formatGiB(safeFree)} GiB`,
            },
            {
                label: "Total",
                value: `${formatGiB(safeTotal)} GiB`,
            },
            {
                label: "Usage",
                value: `${Math.round(usedPercentage)}%`,
                color: status?.color,
            },
            status
                ? {
                    label: "Status",
                    value: status.label,
                    color: status.color,
                }
                : null,
        ].filter(Boolean),
    };

    return (
        <Box
            bg="surface.card"
            border="1px solid"
            borderColor="border.default"
            borderRadius="16px"
            boxShadow="card"
            overflow="hidden"
            w="100%"
            display="flex"
            flexDirection="column"
            onMouseEnter={(event) => showPopup(event, popupStats)}
            onMouseMove={(event) => showPopup(event, popupStats)}
            onMouseLeave={hidePopup}
        >
            <Flex
                align="center"
                px={5}
                pt={4}
                pb={2}
                flexShrink={0}
            >
                <Text
                    fontSize="14px"
                    fontWeight="500"
                    color="text.primary"
                >
                    Memory
                </Text>
            </Flex>

            <Flex
                direction="column"
                px={5}
                pb={4}
                gap={3}
            >
                <Text
                    fontSize="22px"
                    fontWeight="600"
                    color="text.primary"
                    letterSpacing="-0.02em"
                >
                    {`${formatGiB(safeUsed)} / ${formatGiB(safeTotal)} GiB`}
                </Text>

                <Box
                    h="12px"
                    borderRadius="full"
                    bg="surface.subtle"
                    overflow="hidden"
                >
                    <Box
                        h="100%"
                        w={`${usedPercentage}%`}
                        bg={barColor}
                        borderRadius="full"
                    />
                </Box>

                <Flex justify="space-between" gap={4}>
                    <Text fontSize="13px" color="text.muted">
                        {`Used ${formatGiB(safeUsed)}`}
                    </Text>
                    <Text fontSize="13px" color="text.muted">
                        {`Free ${formatGiB(safeFree)}`}
                    </Text>
                </Flex>
            </Flex>
            {popupNode}
        </Box>
    );
};

export default MemoryPanel;
