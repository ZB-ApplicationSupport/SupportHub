import React from "react";

import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import ComputerRoundedIcon from "@mui/icons-material/ComputerRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import DnsRoundedIcon from "@mui/icons-material/DnsRounded";

import { useLocation, useNavigate } from "react-router-dom";
import { NAV_ITEMS } from "../../utils/constants";
import { useAppContext } from "../../context/AppContext";

const ZB_GREEN = "#00843D";
const ZB_GREEN_DARK = "#006B32";
const ZB_GREEN_LIGHT = "#E8F5EE";

const iconMap = {
    dashboard: <DashboardRoundedIcon />,
    home: <HomeRoundedIcon />,
    cases: <AssignmentRoundedIcon />,
    systems: <ComputerRoundedIcon />,
    users: <PeopleRoundedIcon />,
    settings: <SettingsRoundedIcon />,
    server: <DnsRoundedIcon />,
};

const NavItem = () => {
    const { user } = useAppContext();
    const location = useLocation();
    const navigate = useNavigate();

    const items = NAV_ITEMS.filter((item) =>
        item.roles?.includes(user?.role)
    );

    return (
        <>
            {items.map((item) => {
                const isActive =
                    location.pathname === item.path ||
                    location.pathname.startsWith(`${item.path}/`);

                const iconKey =
                    item.icon ||
                    item.label?.toLowerCase() ||
                    item.name?.toLowerCase();

                return (
                    <ListItemButton
                        key={item.path}
                        selected={isActive}
                        onClick={() => navigate(item.path)}
                        sx={{
                            minHeight: 44,
                            px: 1.5,
                            mb: 0.5,

                            color: "rgba(255,255,255,0.78)",

                            "&:hover": {
                                backgroundColor: "rgba(255,255,255,0.10)",
                                color: "#FFFFFF",
                            },

                            "&.Mui-selected": {
                                backgroundColor: "rgba(255,255,255,0.15)",
                                color: "#FFFFFF",

                                borderLeft: `3px solid ${ZB_GREEN}`,

                                "&:hover": {
                                    backgroundColor: "rgba(255,255,255,0.20)",
                                },
                            },
                        }}
                    >
                        <ListItemIcon
                            sx={{
                                minWidth: 40,
                                color: "inherit",

                                "& svg": {
                                    fontSize: 21,
                                },
                            }}
                        >
                            {iconMap[iconKey] || <DashboardRoundedIcon />}
                        </ListItemIcon>

                        <ListItemText
                            primary={item.label || item.name}
                            primaryTypographyProps={{
                                fontSize: 14,
                                fontWeight: isActive ? 600 : 400,
                            }}
                        />
                    </ListItemButton>
                );
            })}
        </>
    );
};

export default NavItem;