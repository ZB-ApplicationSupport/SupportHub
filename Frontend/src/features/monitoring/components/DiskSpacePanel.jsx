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

const barColorForUsage = (usedPercentage) => {
    if (usedPercentage > 75) return "#D64545";
    if (usedPercentage > 50) return "#F4B41A";
    return "#00843D";
};

const DiskRow = ({ disk, onHover, onLeave }) => {
    const usedPercentage = clampPercentage(disk.usedPercentage);
    const barColor = barColorForUsage(usedPercentage);
    const status = interpretUtilization(usedPercentage);
    const popupStats = {
        title: disk.name,
        items: [
            {
                label: "Used",
                value: `${Math.round(usedPercentage)}%`,
                color: barColor,
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
        <Flex
            align="center"
            gap={3}
            onMouseEnter={(event) => onHover(event, popupStats)}
            onMouseMove={(event) => onHover(event, popupStats)}
            onMouseLeave={onLeave}
        >
            <Text
                fontSize="13px"
                color="text.muted"
                minW="64px"
                maxW="72px"
                noOfLines={1}
                title={disk.name}
            >
                {disk.name}
            </Text>

            <Box
                flex="1"
                h="10px"
                borderRadius="full"
                bg="surface.subtle"
                overflow="hidden"
                minW={0}
            >
                <Box
                    h="100%"
                    w={`${usedPercentage}%`}
                    bg={barColor}
                    borderRadius="full"
                />
            </Box>

            <Text
                fontSize="13px"
                fontWeight="600"
                color="text.primary"
                minW="40px"
                textAlign="right"
            >
                {`${Math.round(usedPercentage)}%`}
            </Text>
        </Flex>
    );
};

const DiskSpacePanel = ({ disks = [] }) => {
    const visibleDisks = disks.slice(0, 6);
    const { showPopup, hidePopup, popupNode } = useChartStatsPopup();

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
                    Disk Space
                </Text>
            </Flex>

            <Flex
                direction="column"
                px={5}
                pb={4}
                gap={3}
            >
                {visibleDisks.length > 0 ? (
                    visibleDisks.map((disk) => (
                        <DiskRow
                            key={disk.name}
                            disk={disk}
                            onHover={showPopup}
                            onLeave={hidePopup}
                        />
                    ))
                ) : (
                    <Text fontSize="13px" color="text.muted">
                        Disk usage data unavailable
                    </Text>
                )}
            </Flex>
            {popupNode}
        </Box>
    );
};

export default DiskSpacePanel;
