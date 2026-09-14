import React from "react";
import {
  Box,
  Button,
  HStack,
  Icon,
  IconButton,
  Portal,
  Text,
  chakra,
  useMediaQuery,
} from "@chakra-ui/react";
import { FiSearch, FiX } from "react-icons/fi";
import DropdownSelect from "./DropdownSelect";

export const MODAL = {
  card: "#FFFFFF",
  cardDark: "#1A211D",
  text: "#1A202C",
  muted: "#64748B",
  border: "#E2E8F0",
  mint: "#E8F5EE",
  mintHover: "#C3E7D0",
  mintText: "#0C5F2C",
  green: "#00843D",
  greenHover: "#006B32",
};

export const FieldGroup = ({ label, children, tall = false }) => (
  <Box w="100%">
    {label && (
      <Text
        fontSize="11px"
        fontWeight="600"
        letterSpacing="0.06em"
        textTransform="uppercase"
        color="text.muted"
        mb={2}
      >
        {label}
      </Text>
    )}
    <Box
      w="100%"
      minH={tall ? "96px" : "48px"}
      border="1px solid"
      borderColor="border.default"
      borderRadius="12px"
      px={4}
      py={3}
      bg="white"
      _dark={{ bg: "surface.subtle" }}
      display="flex"
      alignItems={tall ? "flex-start" : "center"}
    >
      {children}
    </Box>
  </Box>
);

const childLabel = (node) => {
  if (node == null || node === false) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(childLabel).join("");
  if (React.isValidElement(node)) return childLabel(node.props.children);
  return "";
};

const optionsFromSelectChildren = (children) =>
  React.Children.toArray(children)
    .filter((child) => React.isValidElement(child) && child.props.value != null)
    .map((child) => ({
      value: String(child.props.value),
      label: childLabel(child.props.children) || String(child.props.value),
    }));

export const FieldSelect = ({
  name,
  value,
  onChange,
  children,
  isDisabled,
  label,
}) => {
  const options = optionsFromSelectChildren(children);
  const stringValue =
    value === true ? "true" : value === false ? "false" : value != null ? String(value) : "";

  return (
    <DropdownSelect
      label={label}
      value={stringValue}
      options={options}
      isDisabled={isDisabled}
      variant="plain"
      size="sm"
      w="100%"
      minW="0"
      onChange={(event) =>
        onChange?.({
          target: {
            name,
            value: event.target.value,
          },
        })
      }
    />
  );
};

export const FieldInput = (props) => (
  <chakra.input
    w="100%"
    h="28px"
    bg="transparent"
    border="0"
    outline="none"
    fontSize="14px"
    fontWeight="500"
    color="text.primary"
    _placeholder={{ color: "text.muted" }}
    {...props}
  />
);

export const FieldTextarea = (props) => (
  <chakra.textarea
    w="100%"
    minH="88px"
    bg="transparent"
    border="0"
    outline="none"
    fontSize="14px"
    fontWeight="500"
    color="text.primary"
    resize="vertical"
    _placeholder={{ color: "text.muted" }}
    {...props}
  />
);

export const ModalCancelButton = ({ children = "Cancel", ...props }) => (
  <Button
    variant="unstyled"
    h="40px"
    px={5}
    display="inline-flex"
    alignItems="center"
    justifyContent="center"
    bg="brand.wash"
    color="brand.onWash"
    fontSize="14px"
    fontWeight="600"
    borderRadius="12px"
    _hover={{ bg: "brand.washHover" }}
    _disabled={{ opacity: 0.6, cursor: "not-allowed" }}
    {...props}
  >
    {children}
  </Button>
);

export const ModalPrimaryButton = ({ children, ...props }) => (
  <Button
    variant="unstyled"
    h="40px"
    px={5}
    display="inline-flex"
    alignItems="center"
    justifyContent="center"
    bg={MODAL.green}
    color="#FFFFFF"
    fontSize="14px"
    fontWeight="600"
    borderRadius="12px"
    _hover={{ bg: MODAL.greenHover }}
    _disabled={{ opacity: 0.6, cursor: "not-allowed" }}
    {...props}
  >
    {children}
  </Button>
);

const AppModal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxW = "700px",
  compact = true,
}) => {
  const [belowFullHd] = useMediaQuery(
    "(max-width: 1919px), (max-height: 1079px)",
    { ssr: false }
  );
  const scaled = compact && belowFullHd;

  if (!isOpen) {
    return null;
  }

  return (
    <Portal>
      <Box
        position="fixed"
        inset={0}
        zIndex={2000}
        bg="rgba(15, 23, 42, 0.55)"
        display="flex"
        alignItems="center"
        justifyContent="center"
        px={4}
        onClick={onClose}
      >
        <Box
          bg="surface.card"
          color="text.primary"
          w="100%"
          maxW={maxW}
          maxH="90vh"
          overflowY="auto"
          overflowX="hidden"
          borderRadius="16px"
          boxShadow="0 24px 64px rgba(15, 23, 42, 0.28)"
          transform={scaled ? "scale(0.8)" : "none"}
          transformOrigin="center center"
          onClick={(event) => event.stopPropagation()}
        >
          <HStack
            align="flex-start"
            justify="space-between"
            px={8}
            pt={6}
            pb={5}
            borderBottom="1px solid"
            borderColor="border.default"
            spacing={4}
          >
            <Box minW={0}>
              <Text fontSize="lg" fontWeight="700" noOfLines={2}>
                {title}
              </Text>
              {subtitle && (
                <Text fontSize="sm" color="text.muted" mt={1}>
                  {subtitle}
                </Text>
              )}
            </Box>
            <IconButton
              aria-label="Close"
              icon={<FiX />}
              size="sm"
              variant="ghost"
              color="text.muted"
              borderRadius="full"
              flexShrink={0}
              onClick={onClose}
            />
          </HStack>

          <Box px={8} py={6}>
            {children}
          </Box>

          {footer && (
            <HStack
              justify="flex-end"
              spacing={3}
              px={8}
              py={5}
              borderTop="1px solid"
              borderColor="border.default"
            >
              {footer}
            </HStack>
          )}
        </Box>
      </Box>
    </Portal>
  );
};

export const PageOutlineButton = ({ children, ...props }) => (
  <Button
    variant="unstyled"
    h="40px"
    px={5}
    display="inline-flex"
    alignItems="center"
    bg="surface.input"
    color="text.primary"
    border="1px solid"
    borderColor="border.default"
    borderRadius="12px"
    fontSize="14px"
    fontWeight="600"
    boxShadow="none"
    _hover={{ bg: "surface.subtle", borderColor: "brand.200" }}
    {...props}
  >
    {children}
  </Button>
);

export const PagePrimaryButton = ({ children, ...props }) => (
  <Button
    variant="unstyled"
    h="40px"
    px={5}
    display="inline-flex"
    alignItems="center"
    bg={MODAL.green}
    color="#FFFFFF"
    borderRadius="12px"
    fontSize="14px"
    fontWeight="700"
    boxShadow="none"
    _hover={{ bg: MODAL.greenHover }}
    {...props}
  >
    {children}
  </Button>
);

export const TableSearch = ({
  value,
  onChange,
  placeholder = "Search...",
}) => (
  <Box position="relative" flex="1" maxW="360px" minW="200px" h="40px">
    <Icon
      as={FiSearch}
      position="absolute"
      left="12px"
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
      pr="12px"
      fontSize="13px"
      fontWeight="500"
      color="text.primary"
      bg="surface.input"
      border="1px solid"
      borderColor="border.default"
      borderRadius="12px"
      outline="none"
      boxShadow="none"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      _placeholder={{ color: "text.muted" }}
      _hover={{ borderColor: "brand.200" }}
      _focus={{
        borderColor: "brand.300",
        boxShadow: "0 0 0 3px rgba(20, 143, 65, 0.16)",
      }}
    />
  </Box>
);

export const StatusDot = ({ color, label }) => (
  <HStack
    spacing={2}
    px={2.5}
    py={1}
    w="fit-content"
    borderRadius="full"
    bg={`${color}1F`}
  >
    <Box w="7px" h="7px" borderRadius="full" bg={color} />
    <Text fontSize="xs" fontWeight="600" color={color}>
      {label}
    </Text>
  </HStack>
);

export default AppModal;
