import React from "react";
import { Box } from "@chakra-ui/react";

const SurfaceCard = ({
  children,
  compact = false,
  interactive = false,
  ...props
}) => {
  return (
    <Box
      bg="surface.card"
      borderRadius="20px"
      border="1px solid"
      borderColor="border.default"
      boxShadow="card"
      overflow="hidden"
      p={compact ? 4 : 6}
      transition="all 0.2s ease"
      _hover={
        interactive
          ? {
              boxShadow: "cardHover",
              transform: "translateY(-2px)",
            }
          : undefined
      }
      {...props}
    >
      {children}
    </Box>
  );
};

export default SurfaceCard;
