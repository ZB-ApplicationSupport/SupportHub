import React from "react";
import {
    Box,
    Heading,
    SimpleGrid,
    Text,
} from "@chakra-ui/react";

const disks = [
    { name: "/audit", value: 26.2 },
    { name: "/home", value: 63.8 },
    { name: "/opt", value: 100 },
    { name: "/admin", value: 0.0496 },
    { name: "/usr", value: 20.4 },
    { name: "/tmp", value: 0.464 },
    { name: "/", value: 1.8 },
    { name: "/var", value: 18.8 },
    { name: "/var/adm/ras/...", value: 0.0465 },
];

const DiskSpacePanel = () => {
    return (
        <Box
            bg="surface.card"
            borderWidth="1px"
            borderRadius="md"
            p={4}
            overflow="hidden"
        >

            <Heading
                size="sm"
                mb={5}
            >
                Disk Space Used
            </Heading>

            <SimpleGrid
                columns={9}
                spacing={2}
                alignItems="end"
                minH="170px"
            >

                {disks.map((disk) => (

                    <Box
                        key={disk.name}
                        textAlign="center"
                    >

                        <Text
                            fontSize="xs"
                            mb={1}
                        >
                            {disk.value}%
                        </Text>

                        <Box
                            h="115px"
                            bg="gray.100"
                            borderRadius="sm"
                            position="relative"
                            display="flex"
                            alignItems="flex-end"
                        >

                            <Box
                                w="100%"
                                h={`${Math.min(disk.value, 100)}%`}
                                bg="gray.400"
                                borderRadius="sm"
                            />

                        </Box>

                        <Text
                            fontSize="10px"
                            mt={1}
                            noOfLines={1}
                        >
                            {disk.name}
                        </Text>

                    </Box>

                ))}

            </SimpleGrid>

        </Box>
    );
};

export default DiskSpacePanel;