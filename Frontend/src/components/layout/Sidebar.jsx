import React from "react";

import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";

import { useAppContext } from "../../context/AppContext";

import NavItem from "./NavItem";
import UserMenu from "./UserMenu";

import logo from "../../assets/logos/logoWhite.png";

const drawerWidth = 240;

const Sidebar = () => {
    const { user } = useAppContext();

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

                    backgroundColor: "#263238",
                    color: "#FFFFFF",

                    borderRight: "none",

                    backgroundImage:
                        "linear-gradient(180deg, #263238 0%, #1F292D 100%)",
                },
            }}
        >
            {/* Logo */}
            <Box
                sx={{
                    height: 100,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    px: 2,
                }}
            >
                <Box
                    component="img"
                    src={logo}
                    alt="ZB Bank"
                    sx={{
                        width: 150,
                        height: "auto",
                    }}
                />
            </Box>

            <Divider
                sx={{
                    borderColor: "rgba(255,255,255,0.12)",
                }}
            />

            {/* Navigation */}
            <Stack
                spacing={0.5}
                sx={{
                    flexGrow: 1,
                    p: 1.5,
                }}
            >
                <NavItem />
            </Stack>

            <Divider
                sx={{
                    borderColor: "rgba(255,255,255,0.12)",
                }}
            />

            {/* User */}
            <Stack
                direction="row"
                alignItems="center"
                spacing={1.5}
                sx={{
                    p: 1.5,
                }}
            >
                <UserMenu />
            </Stack>
        </Drawer>
    );
};

export default Sidebar;