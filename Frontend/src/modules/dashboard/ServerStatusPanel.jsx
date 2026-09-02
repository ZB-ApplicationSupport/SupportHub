import React from "react";
import {
    Box,
    Flex,
    Text,
} from "@chakra-ui/react";

const ServerStatusPanel = () => {
    return (
        <Box
            bg="surface.card"
            borderWidth="1px"
            borderRadius="md"
            overflow="hidden"
        >

            <Box px={4} py={3}>
                <Text
                    fontSize="sm"
                    fontWeight="500"
                >
                    Application Status
                </Text>
            </Box>


            <Box
                px={4}
                pb={4}
            >

                <Flex
                    align="center"
                    justify="space-between"
                    minH="110px"
                    borderRadius="sm"
                    bg="#00843D"
                    color="white"
                    px={6}
                >

                    <Text
                        fontSize="sm"
                    >
                        FE DEV - SERVER 1
                    </Text>

                    <Text
                        fontSize="lg"
                        fontWeight="600"
                    >
                        Up
                    </Text>

                    <Text
                        fontSize="xs"
                    >
                        ● Up
                    </Text>

                </Flex>

            </Box>

        </Box>
    );
};

export default ServerStatusPanel;