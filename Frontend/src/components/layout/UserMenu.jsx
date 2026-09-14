import React from "react";

import {
    Avatar,
    Box,
    Divider,
    ListItemIcon,
    Menu,
    MenuItem,
    Typography,
} from "@mui/material";

import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";

import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { compactPx, useCompactDesktop } from "../../utils/compactDesktop";

const roleLabel = (role) => {
    if (role === "ADMIN") return "Administrator";
    if (role === "USER") return "User";
    return role || "User";
};

const initialsFor = (name) => {
    const parts = String(name || "")
        .trim()
        .split(/\s+/)
        .filter(Boolean);
    if (parts.length >= 2) {
        return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return String(name || "U").slice(0, 2).toUpperCase();
};

const UserMenu = () => {
    const { user, logout } = useAppContext();
    const navigate = useNavigate();
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    const [anchorEl, setAnchorEl] = React.useState(null);
    const compact = useCompactDesktop();

    const open = Boolean(anchorEl);

    const handleOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const goTo = (path) => {
        handleClose();
        navigate(path);
    };

    const handleLogout = () => {
        handleClose();
        logout();
        navigate("/", { replace: true });
    };

    const displayName = user?.name || user?.username || "User";
    const role = user?.role || "USER";
    const initials = initialsFor(displayName);

    return (
        <>
            <Box
                onClick={handleOpen}
                role="button"
                tabIndex={0}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        handleOpen(event);
                    }
                }}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: compact ? 1 : 1.25,
                    ml: compact ? 0.25 : 0.5,
                    px: compact ? 0.75 : 1,
                    py: compact ? 0.4 : 0.5,
                    borderRadius: "999px",
                    cursor: "pointer",
                    backgroundColor: open
                        ? isDark
                            ? "rgba(0, 132, 61, 0.16)"
                            : "#E8F5EE"
                        : "transparent",
                    "&:hover": {
                        backgroundColor: isDark
                            ? "rgba(0, 132, 61, 0.16)"
                            : "#F3F4F6",
                    },
                }}
            >
                <Avatar
                    sx={{
                        width: compactPx(36, compact),
                        height: compactPx(36, compact),
                        bgcolor: "primary.main",
                        fontSize: compactPx(13, compact),
                        fontWeight: 700,
                    }}
                >
                    {initials}
                </Avatar>

                <Box
                    sx={{
                        display: {
                            xs: "none",
                            sm: "block",
                        },
                        minWidth: 0,
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: 700,
                            lineHeight: 1.2,
                            fontSize: compactPx(14, compact),
                        }}
                    >
                        {displayName}
                    </Typography>

                    <Typography
                        variant="caption"
                        sx={{
                            color: "text.secondary",
                            fontSize: compactPx(12, compact),
                        }}
                    >
                        {roleLabel(role)}
                    </Typography>
                </Box>

                <KeyboardArrowDownRoundedIcon
                    sx={{
                        color: "text.secondary",
                        fontSize: compactPx(20, compact),
                        display: {
                            xs: "none",
                            sm: "block",
                        },
                    }}
                />
            </Box>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                slotProps={{
                    paper: {
                        sx: {
                            mt: 1,
                            minWidth: compactPx(260, compact),
                            borderRadius: compact ? "12px" : "16px",
                            border: "1px solid",
                            borderColor: "divider",
                            transform: compact ? "scale(0.8)" : "none",
                            transformOrigin: "top right",
                            boxShadow: isDark
                                ? "0 16px 40px rgba(0, 0, 0, 0.45)"
                                : "0 16px 40px rgba(15, 23, 42, 0.12)",
                        },
                    },
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        px: 2,
                        py: 1.5,
                        minWidth: 220,
                    }}
                >
                    <Avatar
                        sx={{
                            width: compactPx(40, compact),
                            height: compactPx(40, compact),
                            bgcolor: "primary.main",
                            fontSize: compactPx(14, compact),
                            fontWeight: 700,
                        }}
                    >
                        {initials}
                    </Avatar>
                    <Box minWidth={0}>
                        <Typography
                            variant="body2"
                            sx={{
                                fontWeight: 700,
                                fontSize: compactPx(14, compact),
                            }}
                            noWrap
                        >
                            {displayName}
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{
                                color: "text.secondary",
                                fontSize: compactPx(12, compact),
                            }}
                        >
                            {roleLabel(role)}
                        </Typography>
                    </Box>
                </Box>

                <Divider />

                <MenuItem
                    onClick={() => goTo("/settings?section=account")}
                    sx={{ py: 1.1, fontSize: compactPx(14, compact) }}
                >
                    <ListItemIcon sx={{ minWidth: 36, color: "text.secondary" }}>
                        <PersonOutlineRoundedIcon fontSize="small" />
                    </ListItemIcon>
                    My Profile
                </MenuItem>

                <MenuItem
                    onClick={() => goTo("/settings")}
                    sx={{ py: 1.1, fontSize: compactPx(14, compact) }}
                >
                    <ListItemIcon sx={{ minWidth: 36, color: "text.secondary" }}>
                        <SettingsOutlinedIcon fontSize="small" />
                    </ListItemIcon>
                    Settings
                </MenuItem>

                <MenuItem
                    onClick={() => goTo("/knowledge")}
                    sx={{ py: 1.1, fontSize: compactPx(14, compact) }}
                >
                    <ListItemIcon sx={{ minWidth: 36, color: "text.secondary" }}>
                        <HelpOutlineRoundedIcon fontSize="small" />
                    </ListItemIcon>
                    Help & Support
                </MenuItem>

                <Divider />

                <MenuItem
                    onClick={handleLogout}
                    sx={{ py: 1.1, fontSize: compactPx(14, compact) }}
                >
                    <ListItemIcon sx={{ minWidth: 36, color: "text.secondary" }}>
                        <LogoutRoundedIcon fontSize="small" />
                    </ListItemIcon>
                    Sign Out
                </MenuItem>
            </Menu>
        </>
    );
};

export default UserMenu;
