import React from "react";
import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Text,
} from "@chakra-ui/react";
import { FaChevronDown } from "react-icons/fa";
import { useCompactDesktop } from "../../utils/compactDesktop";

const DropdownSelect = ({
  label,
  value,
  onChange,
  options = [],
  w,
  minW = "180px",
  size = "md",
  variant = "outline",
  isDisabled = false,
}) => {
  const compact = useCompactDesktop({ desktopOnly: true });
  const selectedOption =
    options.find((option) => String(option.value) === String(value)) ||
    options[0];

  const height = size === "sm" ? "40px" : "48px";
  const fontSize = size === "sm" ? "13px" : "13px";
  const isOutline = variant === "outline";
  const isPlain = variant === "plain";
  const hasValue = value !== "" && value != null;

  const emitChange = (nextValue) => {
    onChange?.({
      target: {
        value: nextValue,
      },
    });
  };

  const triggerStyles = isPlain
    ? {
        h: "auto",
        minH: "28px",
        px: 0,
        bg: "transparent",
        border: "0",
        borderRadius: "0",
        boxShadow: "none",
        color: "text.primary",
        fontSize: "14px",
        fontWeight: "500",
        _hover: {
          bg: "transparent",
        },
        _active: {
          bg: "transparent",
        },
      }
    : isOutline
    ? {
        h: height,
        px: 3.5,
        bg: hasValue ? "brand.wash" : "surface.input",
        border: "1px solid",
        borderColor: hasValue ? "brand.200" : "border.default",
        borderRadius: "10px",
        boxShadow: "none",
        color: hasValue ? "brand.onWash" : "text.primary",
        fontSize,
        fontWeight: "500",
        _hover: {
          bg: hasValue ? "brand.wash" : "surface.subtle",
          borderColor: "brand.200",
        },
        _active: {
          bg: "brand.wash",
        },
        _disabled: {
          opacity: 0.6,
          cursor: "not-allowed",
        },
      }
    : {
        h: height,
        px: 4,
        bg: "surface.card",
        border: "0",
        borderRadius: "full",
        boxShadow: "card",
        color: "text.primary",
        fontSize,
        fontWeight: "600",
        _hover: {
          bg: "brand.wash",
          boxShadow: "cardHover",
        },
        _active: {
          bg: "brand.wash",
        },
      };

  return (
    <Box w={w} minW={minW}>
      <Menu matchWidth gutter={8} isLazy strategy="fixed">
        {({ isOpen }) => (
          <>
            <MenuButton
              as={Button}
              aria-label={label}
              isDisabled={isDisabled}
              rightIcon={
                <Box
                  as={FaChevronDown}
                  fontSize="11px"
                  color="text.muted"
                  transition="transform 0.2s ease"
                  transform={isOpen ? "rotate(180deg)" : "rotate(0deg)"}
                />
              }
              w="100%"
              justifyContent="space-between"
              textAlign="left"
              variant="unstyled"
              display="inline-flex"
              alignItems="center"
              _focusVisible={{
                boxShadow: "outline",
              }}
              sx={{
                ".chakra-button__icon": {
                  ml: 2,
                },
              }}
              {...triggerStyles}
            >
              <Text as="span" noOfLines={1}>
                {selectedOption?.label || label}
              </Text>
            </MenuButton>

            <Portal>
              <MenuList
                p={0}
                bg="transparent"
                border="0"
                boxShadow="none"
                minW="100%"
                overflow="visible"
                zIndex={3000}
              >
                <Box
                  bg="surface.card"
                  border="1px solid"
                  borderColor="border.default"
                  borderRadius="16px"
                  boxShadow="cardHover"
                  maxH="280px"
                  overflowY="auto"
                  py={1}
                  transform={compact ? "scale(0.8)" : "none"}
                  transformOrigin="top left"
                >
                  {options.map((option) => {
                    const isSelected = String(option.value) === String(value);

                    return (
                      <MenuItem
                        key={String(option.value)}
                        value={option.value}
                        h={size === "sm" ? "40px" : "48px"}
                        px={4}
                        mx={1}
                        w="calc(100% - 8px)"
                        borderRadius="10px"
                        bg={isSelected ? "brand.wash" : "transparent"}
                        color="text.primary"
                        fontSize="14px"
                        fontWeight={isSelected ? "600" : "500"}
                        textAlign="left"
                        justifyContent="flex-start"
                        _hover={{
                          bg: "brand.wash",
                        }}
                        _focus={{
                          bg: "brand.wash",
                        }}
                        onClick={() => emitChange(option.value)}
                      >
                        {option.label}
                      </MenuItem>
                    );
                  })}
                </Box>
              </MenuList>
            </Portal>
          </>
        )}
      </Menu>
    </Box>
  );
};

export default DropdownSelect;

