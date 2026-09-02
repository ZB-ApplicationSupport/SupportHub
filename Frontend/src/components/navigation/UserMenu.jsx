import React from "react";

import {
    Avatar,
    Box,
    Divider,
    IconButton,
    Menu,
    MenuItem,
    Typography,
} from "@mui/material";

import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";

import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";

const UserMenu = () => {
    const { user, logout } = useAppContext();
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = React.useState(null);

    const open = Boolean(anchorEl);

    const handleOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleClose();
        logout();
        navigate("/", { replace: true });
    };

    const displayName = user?.name || user?.username || "User";
    const role = user?.role || "USER";
    const email = user?.email || "";

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    ml: 1,
                }}
            >
                <Avatar
                    sx={{
                        width: 36,
                        height: 36,
                        bgcolor: "primary.main",
                        fontSize: 14,
                        fontWeight: 700,
                    }}
                >
                    {displayName.charAt(0).toUpperCase()}
                </Avatar>

                <Box
                    sx={{
                        display: {
                            xs: "none",
                            sm: "block",
                        },
                        minWidth: 100,
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: 600,
                            lineHeight: 1.2,
                        }}
                    >
                        {displayName}
                    </Typography>

                    <Typography
                        variant="caption"
                        sx={{
                            color: "text.secondary",
                            textTransform: "capitalize",
                        }}
                    >
                        {role.toLowerCase()}
                    </Typography>
                </Box>

                <IconButton
                    onClick={handleOpen}
                    aria-label="Open user menu"
                    size="small"
                    sx={{
                        color: "text.secondary",

                        "&:hover": {
                            color: "primary.main",
                            backgroundColor: "#E8F5EE",
                        },
                    }}
                >
                    <MoreVertRoundedIcon />
                </IconButton>
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
            >
                <Box
                    sx={{
                        px: 2,
                        py: 1,
                        minWidth: 220,
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: 700,
                        }}
                    >
                        {displayName}
                    </Typography>

                    {email && (
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            {email}
                        </Typography>
                    )}

                    <Typography
                        variant="caption"
                        sx={{
                            display: "block",
                            mt: 0.5,
                            color: "primary.main",
                            fontWeight: 600,
                        }}
                    >
                        {role}
                    </Typography>
                </Box>

                <Divider />

                <MenuItem onClick={handleClose}>
                    Profile
                </MenuItem>

                <MenuItem onClick={handleClose}>
                    Settings
                </MenuItem>

                <Divider />

                <MenuItem
                    onClick={handleLogout}
                    sx={{
                        color: "error.main",
                        fontWeight: 600,
                    }}
                >
                    Logout
                </MenuItem>
            </Menu>
        </>
    );
};

export default UserMenu;