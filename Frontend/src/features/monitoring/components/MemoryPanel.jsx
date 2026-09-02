import React from "react";
import {
    Box,
    CircularProgress,
    CircularProgressLabel,
    Heading,
    HStack,
    SimpleGrid,
    Text,
} from "@chakra-ui/react";

const MemoryGauge = ({
                         value,
                         label,
                         percentage,
                     }) => {
    return (
        <Box textAlign="center">

            <CircularProgress
                value={percentage}
                size="135px"
                thickness="8px"
            >

                <CircularProgressLabel>

                    <Text
                        fontSize="2xl"
                        fontWeight="500"
                    >
                        {value}
                    </Text>

                    <Text
                        fontSize="sm"
                        color="text.muted"
                    >
                        {label}
                    </Text>

                </CircularProgressLabel>

            </CircularProgress>

        </Box>
    );
};

const MemoryPanel = ({
                         total,
                         used,
                         free,
                     }) => {

    const usedPercentage =
        total > 0
            ? (used / total) * 100
            : 0;

    const freePercentage =
        total > 0
            ? (free / total) * 100
            : 0;

    return (
        <Box
            bg="surface.card"
            borderWidth="1px"
            borderRadius="md"
            p={4}
        >

            <Heading
                size="sm"
                mb={5}
            >
                Memory
            </Heading>

            <SimpleGrid
                columns={3}
                spacing={2}
            >

                <MemoryGauge
                    value={`${total} GiB`}
                    label="Total"
                    percentage={100}
                />

                <MemoryGauge
                    value={`${used} GiB`}
                    label="Used"
                    percentage={usedPercentage}
                />

                <MemoryGauge
                    value={`${free} GiB`}
                    label="Free"
                    percentage={freePercentage}
                />

            </SimpleGrid>

        </Box>
    );
};

export default MemoryPanel;