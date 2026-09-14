import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";

const formatAppServerLabel = (process) => {
    if (!process) return "App server";
    const match = String(process).match(/^server\s*(\d+)$/i);
    if (match) {
        return `Server ${match[1]}`;
    }
    return String(process);
};

const formatPercent = (value) => {
    if (!Number.isFinite(Number(value))) {
        return "—";
    }
    return `${Math.round(Number(value))}%`;
};

const ServerHealthCard = ({ item, cpuBusy, ramUsage, diskUsage }) => {
    const up = Number(item.status) === 1;

    return (
        <Flex
            align="center"
            gap={3}
            h="48px"
            px={3}
            borderRadius="10px"
            border="1px solid"
            borderColor="border.default"
            bg="surface.card"
            minW="168px"
            flexShrink={0}
        >
            <Box
                w="8px"
                h="8px"
                borderRadius="full"
                bg={up ? "#00843D" : "#D64545"}
                flexShrink={0}
            />
            <Box minW={0}>
                <Flex align="center" gap={2}>
                    <Text
                        fontSize="13px"
                        fontWeight="600"
                        color="text.primary"
                        noOfLines={1}
                    >
                        {formatAppServerLabel(item.process)}
                    </Text>
                    <Text
                        fontSize="12px"
                        fontWeight="500"
                        color={up ? "#00843D" : "#D64545"}
                    >
                        {up ? "Healthy" : "Down"}
                    </Text>
                </Flex>
                <Text fontSize="11px" color="text.muted" noOfLines={1}>
                    {`CPU ${formatPercent(cpuBusy)}  RAM ${formatPercent(ramUsage)}  Disk ${formatPercent(diskUsage)}`}
                </Text>
            </Box>
        </Flex>
    );
};

const ServerHealthPanel = ({
    statuses = [],
    cpuBusy,
    ramUsage,
    diskUsage,
    loading = false,
}) => {
    const rows = statuses.length > 0 ? statuses : [];

    if (loading && rows.length === 0) {
        return (
            <Flex
                align="center"
                h="48px"
                px={3}
                borderRadius="10px"
                border="1px solid"
                borderColor="border.default"
                bg="surface.card"
            >
                <Text fontSize="12px" color="text.muted">
                    Loading servers
                </Text>
            </Flex>
        );
    }

    if (rows.length === 0) {
        return null;
    }

    return (
        <Flex
            align="center"
            gap={2}
            flexWrap="wrap"
        >
            {rows.map((item) => (
                <ServerHealthCard
                    key={item.process}
                    item={item}
                    cpuBusy={cpuBusy}
                    ramUsage={ramUsage}
                    diskUsage={diskUsage}
                />
            ))}
        </Flex>
    );
};

export default ServerHealthPanel;
