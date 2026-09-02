import React from "react";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";

import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";

import UserMenu from "./UserMenu";

const TopNav = () => {
    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                backgroundColor: "#FFFFFF",
                color: "#263238",
                backgroundImage: "none",

                borderBottom: "1px solid",
                borderColor: "#E1E7E3",
            }}
        >
            <Toolbar
                sx={{
                    minHeight: "68px !important",
                    px: {
                        xs: 2,
                        md: 3,
                    },
                }}
            >
                <Stack
                    direction="row"
                    alignItems="center"
                    sx={{
                        width: "100%",
                    }}
                >
                    {/* LEFT */}
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1.5}
                    >
                        <IconButton
                            sx={{
                                display: {
                                    xs: "flex",
                                    md: "none",
                                },
                            }}
                        >
                            <MenuRoundedIcon />
                        </IconButton>

                        <Box>
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    fontWeight: 700,
                                    lineHeight: 1.2,
                                }}
                            >
                                Banking Systems Support
                            </Typography>

                            <Typography
                                variant="caption"
                                sx={{
                                    color: "text.secondary",
                                }}
                            >
                                ZB Financial Holdings
                            </Typography>
                        </Box>
                    </Stack>

                    {/* RIGHT */}
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sx={{
                            ml: "auto",
                        }}
                    >
                        <IconButton
                            aria-label="Notifications"
                            sx={{
                                color: "text.secondary",

                                "&:hover": {
                                    color: "primary.main",
                                    backgroundColor: "#E8F5EE",
                                },
                            }}
                        >
                            <NotificationsRoundedIcon />
                        </IconButton>

                        <UserMenu />
                    </Stack>
                </Stack>
            </Toolbar>
        </AppBar>
    );
};

export default TopNav;