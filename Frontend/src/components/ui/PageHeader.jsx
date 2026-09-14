import React from "react";
import {
  Box,
  Flex,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";

const PageHeader = ({
  title,
  subtitle,
  actions,
  filters,
  leading,
  mb = 6,
  gap = 4,
}) => {
  return (
    <Flex
      align={{ base: "flex-start", md: "center" }}
      justify="space-between"
      direction={{ base: "column", md: "row" }}
      gap={gap}
      mb={mb}
    >
      <Flex align="center" gap={4} minW={0} flex="1" flexWrap="wrap">
        <Box minW={0}>
          <Heading
            fontSize={{ base: "22px", md: "24px" }}
            fontWeight="700"
            lineHeight="1.25"
            color="text.primary"
            letterSpacing="-0.03em"
            mb={subtitle ? 1 : 0}
          >
            {title}
          </Heading>

          {subtitle && (
            <Text
              fontSize="13px"
              color="text.muted"
            >
              {subtitle}
            </Text>
          )}
        </Box>
        {leading}
      </Flex>

      {(filters || actions) && (
        <Stack
          direction={{ base: "column", sm: "row" }}
          spacing={3}
          w={{ base: "100%", md: "auto" }}
          align={{ base: "stretch", sm: "center" }}
        >
          {filters}
          {actions}
        </Stack>
      )}
    </Flex>
  );
};

export default PageHeader;
