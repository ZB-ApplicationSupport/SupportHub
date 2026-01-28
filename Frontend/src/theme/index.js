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
      "surface.bg": { default: "white", _dark: "slate.800" },
      "surface.card": { default: "white", _dark: "slate.900" },
      "surface.subtle": { default: "slate.50", _dark: "slate.800" },
      "text.primary": { default: "slate.900", _dark: "whiteAlpha.900" },
      "text.muted": { default: "slate.600", _dark: "slate.300" },
      "border.default": { default: "slate.200", _dark: "whiteAlpha.200" },
    },
  },
  fonts: {
    heading: "Inter, system-ui, sans-serif",
    body: "Inter, system-ui, sans-serif",
  },
  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === "dark" ? "slate.900" : "slate.50",
        color: "text.primary",
      },
    }),
  },
});

export default theme;
