import React from "react";
import { useTheme } from "@mui/material/styles";

import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import NavItem from "./NavItem";
import BrandLogo from "./BrandLogo";
import { BRAND } from "../../theme/muiTheme";
import { compactPx, useCompactDesktop } from "../../utils/compactDesktop";

const DRAWER_WIDTH = 248;

const Sidebar = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const panel = isDark ? BRAND.panelDark : BRAND.panel;
    const compact = useCompactDesktop();
    const drawerWidth = compactPx(DRAWER_WIDTH, compact);

    return (
        <Drawer
            variant="permanent"
            sx={{
                display: {
                    xs: "none",
                    md: "block",
                },

                width: drawerWidth,
                flexShrink: 0,

                "& .MuiDrawer-paper": {
                    width: drawerWidth,
                    boxSizing: "border-box",
                    backgroundColor: panel,
                    color: "#FFFFFF",
                    borderRight: "none",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                },
            }}
        >
            <Box
                sx={{
                    position: "absolute",
                    width: 280,
                    height: 280,
                    borderRadius: "50%",
                    background: "rgba(0, 132, 61, 0.45)",
                    top: -90,
                    right: -90,
                    pointerEvents: "none",
                }}
            />
            <Box
                sx={{
                    position: "absolute",
                    width: 200,
                    height: 200,
                    borderRadius: "50%",
                    background: "rgba(20, 143, 65, 0.28)",
                    bottom: 120,
                    left: -80,
                    pointerEvents: "none",
                }}
            />

            <Box
                sx={{
                    minHeight: compactPx(112, compact),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    px: compact ? 1.2 : 1.5,
                    py: compact ? 1.2 : 1.5,
                    position: "relative",
                    zIndex: 1,
                }}
            >
                <BrandLogo
                    onDark
                    height={`${compactPx(52, compact)}px`}
                    maxW={`${compactPx(180, compact)}px`}
                />
            </Box>

            <Stack
                spacing={compact ? 0.4 : 0.5}
                sx={{
                    flexGrow: 1,
                    px: compact ? 1.2 : 1.5,
                    pb: compact ? 1.5 : 2,
                    position: "relative",
                    zIndex: 1,
                }}
            >
                <NavItem compact={compact} />
            </Stack>

            <Box
                sx={{
                    p: compact ? 1.2 : 1.5,
                    pb: compact ? 1.5 : 2,
                    position: "relative",
                    zIndex: 1,
                }}
            >
            </Box>
        </Drawer>
    );
};

export default Sidebar;
