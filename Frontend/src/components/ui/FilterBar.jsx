import React from "react";
import {
  Flex,
  Stack,
} from "@chakra-ui/react";
import SurfaceCard from "./SurfaceCard";

const FilterBar = ({
  children,
  actions,
  ...props
}) => {
  return (
    <SurfaceCard compact p={4} {...props}>
      <Flex
        align={{ base: "stretch", md: "center" }}
        justify="space-between"
        direction={{ base: "column", md: "row" }}
        gap={3}
      >
        <Stack
          direction={{ base: "column", md: "row" }}
          spacing={3}
          flex="1"
        >
          {children}
        </Stack>

        {actions && (
          <Stack
            direction="row"
            spacing={2}
            justify={{ base: "flex-end", md: "center" }}
          >
            {actions}
          </Stack>
        )}
      </Flex>
    </SurfaceCard>
  );
};

export default FilterBar;
