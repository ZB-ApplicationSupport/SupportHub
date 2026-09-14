import { extendTheme } from "@chakra-ui/react";
import colors from "./colors";
import components from "./components";

const theme = extendTheme({
  colors,
  components,
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
  semanticTokens: {
    colors: {
      "surface.bg": { default: "#E2E8F0", _dark: "#0C100E" },
      "surface.card": { default: "white", _dark: "#1A211D" },
      "surface.subtle": { default: "#F1F5F2", _dark: "#232B27" },
      "surface.input": { default: "white", _dark: "#141A17" },
      "surface.brand": { default: "#0C5F2C", _dark: "#0F1914" },
      "text.primary": { default: "#1A202C", _dark: "#F3F6F4" },
      "text.muted": { default: "#64748B", _dark: "#8B968F" },
      "text.brand": { default: "brand.500", _dark: "brand.300" },
      "border.default": { default: "#E2E8F0", _dark: "#2F3A35" },
      "brand.wash": { default: "#e7f5ed", _dark: "rgba(0, 132, 61, 0.20)" },
      "brand.washHover": { default: "#C3E7D0", _dark: "rgba(0, 132, 61, 0.32)" },
      "brand.onWash": { default: "#0C5F2C", _dark: "#7bc995" },
      "danger.wash": { default: "#FEF2F2", _dark: "rgba(214, 69, 69, 0.16)" },
      "danger.onWash": { default: "#D64545", _dark: "#FCA5A5" },
    },
    shadows: {
      card: {
        default: "0 8px 28px rgba(15, 23, 42, 0.08)",
        _dark: "0 8px 28px rgba(0, 0, 0, 0.38), 0 0 0 1px rgba(255,255,255,0.04)",
      },
      cardHover: {
        default: "0 12px 32px rgba(15, 23, 42, 0.12)",
        _dark: "0 12px 36px rgba(0, 132, 61, 0.18), 0 0 0 1px rgba(0, 132, 61, 0.16)",
      },
    },
  },
  radii: {
    none: "0",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "20px",
    "2xl": "24px",
    card: "20px",
    full: "9999px",
  },
  shadows: {
    outline: "0 0 0 3px rgba(20, 143, 65, 0.16)",
  },
  fonts: {
    heading: "Inter, Aptos, Segoe UI, Arial, sans-serif",
    body: "Inter, Aptos, Segoe UI, Arial, sans-serif",
  },
  styles: {
    global: (props) => ({
      "*": {
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      },
      "*::-webkit-scrollbar": {
        display: "none",
        width: "0",
        height: "0",
      },
      ".extract-table-scroll": {
        scrollbarWidth: "thin",
        scrollbarColor:
          props.colorMode === "dark" ? "#8B968F #232B27" : "#94A3B8 #E2E8F0",
        msOverflowStyle: "auto",
      },
      ".extract-table-scroll::-webkit-scrollbar": {
        display: "block",
        width: "12px",
        height: "12px",
      },
      ".extract-table-scroll::-webkit-scrollbar-track": {
        background: props.colorMode === "dark" ? "#232B27" : "#F1F5F2",
        borderRadius: "8px",
      },
      ".extract-table-scroll::-webkit-scrollbar-thumb": {
        background: props.colorMode === "dark" ? "#8B968F" : "#94A3B8",
        borderRadius: "8px",
        border: props.colorMode === "dark" ? "2px solid #232B27" : "2px solid #F1F5F2",
      },
      ".extract-table-scroll::-webkit-scrollbar-thumb:hover": {
        background: props.colorMode === "dark" ? "#F3F6F4" : "#64748B",
      },
      ".extract-table-scroll::-webkit-scrollbar-corner": {
        background: props.colorMode === "dark" ? "#232B27" : "#F1F5F2",
      },
      body: {
        bg: props.colorMode === "dark" ? "#0C100E" : "#E2E8F0",
        color: "text.primary",
        fontWeight: 400,
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      },
      "body.compact-desktop [id^='chakra-toast-manager-top'] .chakra-toast": {
        transform: "scale(0.8)",
        transformOrigin: "top center",
      },
      "body.compact-desktop [id^='chakra-toast-manager-bottom'] .chakra-toast": {
        transform: "scale(0.8)",
        transformOrigin: "bottom center",
      },
      "body.compact-desktop [id^='chakra-toast-manager-top-left'] .chakra-toast, body.compact-desktop [id^='chakra-toast-manager-bottom-left'] .chakra-toast": {
        transformOrigin: "left center",
      },
      "body.compact-desktop [id^='chakra-toast-manager-top-right'] .chakra-toast, body.compact-desktop [id^='chakra-toast-manager-bottom-right'] .chakra-toast": {
        transformOrigin: "right center",
      },
    }),
  },
});

export default theme;
