import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";

import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

import UserMenu from "./UserMenu";
import ColorModeToggle from "./ColorModeToggle";
import { useNotificationDrawer } from "../../context/NotificationDrawerContext";
import { compactPx, useCompactDesktop } from "../../utils/compactDesktop";

const TopNav = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const navigate = useNavigate();
    const searchRef = useRef(null);
    const { open, toggle, unreadCount } = useNotificationDrawer();
    const compact = useCompactDesktop();
    const iconSize = compactPx(40, compact);
    const iconButtonSx = {
        color: "text.secondary",
        backgroundColor: isDark ? "transparent" : "#F3F4F6",
        border: "1px solid",
        borderColor: isDark ? "rgba(255,255,255,0.12)" : "#E5E7EB",
        boxShadow: "none",
        width: iconSize,
        height: iconSize,
        borderRadius: "50%",
        "&:hover": {
            color: "primary.main",
            backgroundColor: isDark ? "rgba(0, 132, 61, 0.18)" : "#E8F5EE",
            borderColor: isDark ? "rgba(0, 132, 61, 0.35)" : "#C3E7D0",
            boxShadow: "none",
        },
    };

    useEffect(() => {
        const onKeyDown = (event) => {
            if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
                event.preventDefault();
                searchRef.current?.focus();
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                backgroundColor: isDark ? "background.paper" : "#FFFFFF",
                color: "text.primary",
                backgroundImage: "none",
                overflow: "visible",
                borderBottom: "1px solid",
                borderColor: isDark ? "rgba(255,255,255,0.08)" : "#E5E7EB",
                boxShadow: "none",
            }}
        >
            <Toolbar
                sx={{
                    minHeight: `${compactPx(68, compact)}px !important`,
                    overflow: "visible",
                    px: {
                        xs: compact ? 1.5 : 2,
                        md: compact ? 2 : 3,
                    },
                }}
            >
                <Stack
                    direction="row"
                    sx={{
                        alignItems: "center",
                        width: "100%",
                        gap: compact ? 1.5 : 2,
                    }}
                >
                    <IconButton
                        sx={{
                            ...iconButtonSx,
                            display: {
                                xs: "flex",
                                md: "none",
                            },
                        }}
                    >
                        <MenuRoundedIcon />
                    </IconButton>

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            flex: 1,
                            maxWidth: compactPx(440, compact),
                            height: compactPx(44, compact),
                            px: compact ? 1.75 : 2,
                            borderRadius: "999px",
                            backgroundColor: isDark
                                ? "rgba(255,255,255,0.06)"
                                : "#F3F4F6",
                            border: "1px solid",
                            borderColor: isDark ? "transparent" : "#EEF0F2",
                        }}
                    >
                        <SearchRoundedIcon
                            sx={{
                                color: "#9CA3AF",
                                fontSize: compactPx(20, compact),
                                mr: compact ? 0.75 : 1,
                            }}
                        />
                        <InputBase
                            inputRef={searchRef}
                            placeholder="Search cases, systems, or users..."
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    const query = event.target.value.trim();
                                    navigate(query ? `/cases?q=${encodeURIComponent(query)}` : "/cases");
                                }
                            }}
                            sx={{
                                flex: 1,
                                fontSize: compactPx(14, compact),
                                color: "text.primary",
                                "& input::placeholder": {
                                    color: "#9CA3AF",
                                    opacity: 1,
                                },
                            }}
                        />
                        <Box
                            sx={{
                                display: {
                                    xs: "none",
                                    sm: "inline-flex",
                                },
                                px: 1,
                                py: 0.15,
                                borderRadius: "8px",
                                backgroundColor: isDark
                                    ? "rgba(255,255,255,0.08)"
                                    : "#E5E7EB",
                                color: "text.secondary",
                                fontSize: compactPx(11, compact),
                                fontWeight: 600,
                            }}
                        >
                            ⌘ K
                        </Box>
                    </Box>

                    <Stack
                        direction="row"
                        spacing={compact ? 1 : 1.25}
                        sx={{
                            alignItems: "center",
                            ml: "auto",
                        }}
                    >
                        <IconButton
                            aria-label="Messages"
                            sx={iconButtonSx}
                        >
                            <MailOutlineRoundedIcon sx={{ fontSize: compactPx(20, compact) }} />
                        </IconButton>

                        <IconButton
                            aria-label="Notifications"
                            aria-haspopup="true"
                            aria-expanded={open ? "true" : undefined}
                            aria-controls={open ? "notifications-menu" : undefined}
                            onClick={toggle}
                            sx={{
                                ...iconButtonSx,
                                color: open ? "primary.main" : "text.secondary",
                            }}
                        >
                            <Badge
                                badgeContent={unreadCount}
                                color="error"
                                max={9}
                                sx={{
                                    "& .MuiBadge-badge": {
                                        fontSize: 10,
                                        minWidth: 16,
                                        height: 16,
                                        top: 2,
                                        right: 2,
                                    },
                                }}
                            >
                                <NotificationsNoneRoundedIcon sx={{ fontSize: compactPx(20, compact) }} />
                            </Badge>
                        </IconButton>

                        <ColorModeToggle />

                        <UserMenu />
                    </Stack>
                </Stack>
            </Toolbar>
        </AppBar>
    );
};

export default TopNav;
