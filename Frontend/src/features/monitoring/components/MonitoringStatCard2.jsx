import React from "react";
import {
    Box,
    Flex,
    Text,
} from "@chakra-ui/react";

const MonitoringStatCard2 = ({
    title,
    value,
    subtitle,
}) => {
    return (
        <Box
            bg="surface.card"
            border="1px solid"
            borderColor="border.default"
            borderRadius="16px"
            boxShadow="card"
            px={5}
            py={4}
            minH="88px"
            h="100%"
            display="flex"
            alignItems="center"
        >
            <Box minW={0} w="100%">
                <Text
                    fontSize="13px"
                    fontWeight="500"
                    color="text.muted"
                    noOfLines={1}
                    mb={1}
                >
                    {title}
                </Text>

                <Text
                    fontSize="24px"
                    fontWeight="600"
                    color="text.primary"
                    lineHeight="1.15"
                    letterSpacing="-0.02em"
                    noOfLines={1}
                >
                    {value}
                </Text>

            </Box>
        </Box>
    );
};

export default MonitoringStatCard2;
