import React from "react";
import {
  Box,
  Flex,
  Text,
} from "@chakra-ui/react";
import SurfaceCard from "./SurfaceCard";

const DataTableShell = ({
  title,
  subtitle,
  actions,
  children,
  p = 0,
  sx,
  ...props
}) => {
  return (
    <SurfaceCard
      p={p}
      w="100%"
      sx={{
        w: "100%",
        ".chakra-table__container": {
          w: "100%",
        },
        table: {
          w: "100%",
        },
        "thead tr": {
          bg: "surface.card",
        },
        th: {
          py: 3.5,
          px: 5,
          textTransform: "none",
          bg: "surface.card",
          color: "text.muted",
          borderColor: "border.default",
        },
        td: {
          px: 5,
          py: 3,
          color: "text.primary",
          borderColor: "border.default",
        },
        "tbody tr": {
          transition: "background 0.15s ease",
        },
        "tbody tr:hover": {
          bg: "surface.subtle",
        },
        ...sx,
      }}
      {...props}
    >
      {(title || subtitle || actions) && (
        <Flex
          align={{ base: "flex-start", md: "center" }}
          justify="space-between"
          direction={{ base: "column", md: "row" }}
          gap={3}
          px={5}
          py={4}
          borderBottom="1px solid"
          borderColor="border.default"
        >
          <Box>
            {title && (
              <Text
                fontSize="13px"
                fontWeight="700"
                color="text.primary"
              >
                {title}
              </Text>
            )}

            {subtitle && (
              <Text
                fontSize="11px"
                color="text.muted"
                mt={1}
              >
                {subtitle}
              </Text>
            )}
          </Box>

          {actions}
        </Flex>
      )}

      {children}
    </SurfaceCard>
  );
};

export default DataTableShell;
