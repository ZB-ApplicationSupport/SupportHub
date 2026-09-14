import React from "react";
import { Box, Button, Flex, Heading, Icon, Text, chakra } from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";

export const SettingsSearch = ({
  value,
  onChange,
  placeholder = "Search",
}) => (
  <Box position="relative" w={{ base: "100%", sm: "240px" }} h="40px">
    <Icon
      as={FiSearch}
      position="absolute"
      left="14px"
      top="50%"
      transform="translateY(-50%)"
      color="text.muted"
      boxSize={4}
      pointerEvents="none"
      zIndex={1}
    />
    <chakra.input
      h="40px"
      w="100%"
      pl="40px"
      pr="14px"
      fontSize="13px"
      fontWeight="500"
      color="text.primary"
      bg="brand.wash"
      border="0"
      borderRadius="999px"
      outline="none"
      boxShadow="none"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      _placeholder={{ color: "text.muted" }}
      _focus={{
        boxShadow: "0 0 0 3px rgba(20, 143, 65, 0.16)",
      }}
    />
  </Box>
);

export const UnderlineNav = ({ items, value, onChange }) => (
  <Flex
    gap={{ base: 5, md: 7 }}
    borderBottom="1px solid"
    borderColor="border.default"
    overflowX="auto"
    css={{
      scrollbarWidth: "none",
      "&::-webkit-scrollbar": { display: "none" },
    }}
  >
    {items.map((item) => {
      const active = value === item.id;
      return (
        <Box
          key={item.id}
          as="button"
          type="button"
          onClick={() => onChange(item.id)}
          pb={3}
          mb="-1px"
          borderBottom="2px solid"
          borderColor={active ? "text.primary" : "transparent"}
          color={active ? "text.primary" : "text.muted"}
          fontSize="14px"
          fontWeight={active ? "700" : "500"}
          whiteSpace="nowrap"
          _hover={{ color: "text.primary" }}
        >
          {item.label}
          {item.count != null && item.count > 0 ? ` (${item.count})` : ""}
        </Box>
      );
    })}
  </Flex>
);

export const SettingsSectionHeader = ({ title, description, action }) => (
  <Flex
    align={{ base: "flex-start", md: "center" }}
    justify="space-between"
    direction={{ base: "column", md: "row" }}
    gap={4}
  >
    <Box minW={0}>
      <Heading
        as="h2"
        fontSize="18px"
        fontWeight="700"
        color="text.primary"
        letterSpacing="-0.02em"
        lineHeight="1.3"
      >
        {title}
      </Heading>
      {description && (
        <Text mt={1} fontSize="13px" color="text.muted" maxW="640px">
          {description}
        </Text>
      )}
    </Box>
    {action}
  </Flex>
);

export const DarkPillButton = ({ children, ...props }) => (
  <Button
    variant="unstyled"
    h="36px"
    px={4}
    display="inline-flex"
    alignItems="center"
    bg="text.primary"
    color="surface.card"
    borderRadius="999px"
    fontSize="13px"
    fontWeight="600"
    boxShadow="none"
    _hover={{ opacity: 0.88 }}
    _disabled={{ opacity: 0.5, cursor: "not-allowed" }}
    {...props}
  >
    {children}
  </Button>
);
