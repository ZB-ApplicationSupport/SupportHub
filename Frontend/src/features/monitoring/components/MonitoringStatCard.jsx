import React from "react";
import {
    Box,
    CircularProgress,
    CircularProgressLabel,
    Flex,
    Text,
} from "@chakra-ui/react";

const MonitoringStatCard = ({
                                title,
                                value,
                                type = "value",
                                percentage = 0,
                            }) => {
    return (
        <Box
            bg="surface.card"
            borderWidth="1px"
            borderRadius="md"
            minH="125px"
            px={4}
            py={3}
        >

            <Text
                fontSize="xs"
                fontWeight="500"
                mb={2}
            >
                {title}
            </Text>


            {type === "gauge" ? (

                <Flex
                    justify="center"
                    align="center"
                    h="85px"
                >

                    <CircularProgress
                        value={percentage}
                        size="80px"
                        thickness="8px"
                    >
                        <CircularProgressLabel
                            fontSize="sm"
                        >
                            {value}
                        </CircularProgressLabel>
                    </CircularProgress>

                </Flex>

            ) : (

                <Flex
                    justify="center"
                    align="center"
                    h="85px"
                >
                    <Text
                        fontSize="4xl"
                        fontWeight="500"
                        lineHeight="1"
                    >
                        {value}
                    </Text>
                </Flex>

            )}

        </Box>
    );
};

export default MonitoringStatCard;