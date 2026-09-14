import React, { useMemo } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useColorMode } from "@chakra-ui/react";

import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";

import { useAppContext } from "../context/AppContext";
import { createAppMuiTheme } from "../theme/muiTheme";
import { compactPx, useCompactDesktop } from "../utils/compactDesktop";

import Sidebar from "../components/layout/Sidebar";
import TopNav from "../components/layout/TopNav";
import NotificationDrawer from "../components/layout/NotificationDrawer";
import { NotificationDrawerProvider } from "../context/NotificationDrawerContext";

const DashboardLayout = () => {
  const { user } = useAppContext();
  const token = localStorage.getItem("token");
  const { colorMode } = useColorMode();
  const compact = useCompactDesktop();
  const muiTheme = useMemo(
    () => createAppMuiTheme(colorMode),
    [colorMode]
  );

  if (!user || !token) {
    return <Navigate to="/" replace />;
  }

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <NotificationDrawerProvider>
        <Box
          sx={{
            display: "flex",
            height: "100vh",
            overflow: "hidden",
            backgroundColor: "background.default",
          }}
        >
          <Sidebar />

          <Box
            component="main"
            sx={{
              flexGrow: 1,
              minWidth: 0,
              width: "100%",
              height: "100vh",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <TopNav />

            <Box
              sx={{
                flex: 1,
                minHeight: 0,
                width: "100%",
                overflow: "auto",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                "&::-webkit-scrollbar": {
                  display: "none",
                  width: 0,
                  height: 0,
                },
                display: "flex",
                flexDirection: "column",
                px: {
                  xs: `${compactPx(16, compact)}px`,
                  sm: `${compactPx(20, compact)}px`,
                  md: `${compactPx(24, compact)}px`,
                },
                pt: {
                  xs: "24px",
                  md: "40px",
                },
                pb: {
                  xs: `${compactPx(16, compact)}px`,
                  md: `${compactPx(24, compact)}px`,
                },
              }}
            >
              <Outlet />
            </Box>
          </Box>
        </Box>
        <NotificationDrawer />
      </NotificationDrawerProvider>
    </ThemeProvider>
  );
};

export default DashboardLayout;
