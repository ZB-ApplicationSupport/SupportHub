import React from "react";
import { Navigate, Outlet } from "react-router-dom";

import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import { useAppContext } from "../context/AppContext";

import Sidebar from "../components/navigation/Sidebar";
import TopNav from "../components/navigation/TopNav";

const muiTheme = createTheme({
  palette: {
    mode: "light",

    primary: {
      main: "#00843D",
      dark: "#006B32",
      light: "#2E9B5B",
      contrastText: "#FFFFFF",
    },

    secondary: {
      main: "#263238",
      dark: "#1F2933",
      light: "#546E7A",
      contrastText: "#FFFFFF",
    },

    background: {
      default: "#F5F7F6",
      paper: "#FFFFFF",
    },

    text: {
      primary: "#263238",
      secondary: "#6B7280",
    },

    divider: "#E1E7E3",
  },

  typography: {
    fontFamily:
      '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',

    h1: {
      fontWeight: 700,
    },

    h2: {
      fontWeight: 700,
    },

    h3: {
      fontWeight: 700,
    },

    h4: {
      fontWeight: 700,
    },

    h5: {
      fontWeight: 600,
    },

    h6: {
      fontWeight: 600,
    },
  },

  shape: {
    borderRadius: 10,
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
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
  },
});

const DashboardLayout = () => {
  const { user } = useAppContext();
  const token = localStorage.getItem("token");

  if (!user || !token) {
    return <Navigate to="/" replace />;
  }

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />

      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          backgroundColor: "background.default",
        }}
      >
        {/* Sidebar */}
        <Sidebar />

        {/* Main application area */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            minWidth: 0,
            width: "100%",
          }}
        >
          {/* Top navigation */}
          <TopNav />

          {/* Page content */}
          <Box
            sx={{
              width: "100%",
              maxWidth: "1700px",
              mx: "auto",
              px: {
                xs: 2,
                sm: 3,
                md: 4,
              },
              py: {
                xs: 2,
                md: 3,
              },
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default DashboardLayout;

