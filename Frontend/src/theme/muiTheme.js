import { createTheme } from "@mui/material/styles";

const ZB_GREEN = "#00843D";
const ZB_GREEN_DARK = "#006B32";
const ZB_GREEN_LIGHT = "#2E9B5B";
const PANEL = "#0C5F2C";
const PANEL_DARK = "#0F1914";

export const createAppMuiTheme = (mode = "light") => {
  const isDark = mode === "dark";

  return createTheme({
    palette: {
      mode,

      primary: {
        main: ZB_GREEN,
        dark: ZB_GREEN_DARK,
        light: ZB_GREEN_LIGHT,
        contrastText: "#FFFFFF",
      },

      secondary: {
        main: isDark ? "#8B968F" : "#64748B",
        dark: "#1A202C",
        light: "#94A3B8",
        contrastText: "#FFFFFF",
      },

      background: {
        default: isDark ? "#0C100E" : "#E2E8F0",
        paper: isDark ? "#1A211D" : "#FFFFFF",
      },

      text: {
        primary: isDark ? "#F3F6F4" : "#1A202C",
        secondary: isDark ? "#8B968F" : "#64748B",
      },

      divider: isDark ? "rgba(255,255,255,0.08)" : "#E2E8F0",
    },

    typography: {
      fontFamily: 'Inter, Aptos, "Segoe UI", Arial, sans-serif',

      h1: { fontWeight: 800, letterSpacing: "-0.03em" },
      h2: { fontWeight: 800, letterSpacing: "-0.03em" },
      h3: { fontWeight: 700, letterSpacing: "-0.03em" },
      h4: { fontWeight: 700, letterSpacing: "-0.03em" },
      h5: { fontWeight: 700 },
      h6: { fontWeight: 700 },
      button: { fontWeight: 700 },
    },

    shape: {
      borderRadius: 12,
    },

    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 700,
            borderRadius: 12,
            boxShadow: "none",
          },
        },
      },

      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },

      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 14,
          },
        },
      },

      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },

      MuiMenu: {
        styleOverrides: {
          paper: {
            borderRadius: 16,
            boxShadow: isDark
              ? "0 12px 36px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255,255,255,0.04)"
              : "0 10px 32px rgba(15, 23, 42, 0.10)",
          },
        },
      },

      MuiCssBaseline: {
        styleOverrides: {
          "*": {
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          },
          "*::-webkit-scrollbar": {
            display: "none",
            width: 0,
            height: 0,
          },
          body: {
            backgroundColor: isDark ? "#0C100E" : "#E2E8F0",
            color: isDark ? "#F3F6F4" : "#1A202C",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          },
        },
      },
    },
  });
};

export const BRAND = {
  green: ZB_GREEN,
  greenDark: ZB_GREEN_DARK,
  greenLight: "#E8F5EE",
  panel: PANEL,
  panelDark: PANEL_DARK,
};
