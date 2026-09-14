import React from "react";

import Typography from "@mui/material/Typography";
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
import TimelineRoundedIcon from "@mui/icons-material/TimelineRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import AccountTreeRoundedIcon from "@mui/icons-material/AccountTreeRounded";

import { useLocation, useNavigate } from "react-router-dom";
import { NAV_ITEMS } from "../../utils/constants";
import { useAppContext } from "../../context/AppContext";

const iconMap = {
    dashboard: <DashboardRoundedIcon />,
    home: <HomeRoundedIcon />,
    cases: <AssignmentRoundedIcon />,
    systems: <ComputerRoundedIcon />,
    users: <PeopleRoundedIcon />,
    settings: <SettingsRoundedIcon />,
    server: <DnsRoundedIcon />,
    observability: <TimelineRoundedIcon />,
    passwords: <LockRoundedIcon />,
    reports: <DescriptionRoundedIcon />,
    knowledge: <MenuBookRoundedIcon />,
    automations: <AccountTreeRoundedIcon />,
};

const MENU_PATHS = ["/dashboard", "/server-dashboard", "/automations"];

const sectionLabelSx = (compact) => ({
    px: compact ? 1.2 : 1.5,
    pt: compact ? 0.75 : 1,
    pb: compact ? 0.75 : 1,
    fontSize: compact ? 9 : 11,
    fontWeight: 700,
    letterSpacing: "0.08em",
    color: "rgba(255,255,255,0.48)",
});

const NavItem = ({ compact = false }) => {
    const { user } = useAppContext();
    const location = useLocation();
    const navigate = useNavigate();

    const items = NAV_ITEMS.filter((item) =>
        item.roles?.includes(user?.role)
    );
    const menuItems = items.filter((item) => MENU_PATHS.includes(item.path));
    const generalItems = items.filter((item) => !MENU_PATHS.includes(item.path));

    const renderItems = (sectionItems) =>
        sectionItems.map((item) => {
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
                        minHeight: compact ? 35 : 44,
                        px: compact ? 1.2 : 1.5,
                        mb: compact ? 0.4 : 0.5,
                        borderRadius: compact ? "11px" : "14px",
                        color: "rgba(255,255,255,0.78)",

                        "&:hover": {
                            backgroundColor: "rgba(255,255,255,0.10)",
                            color: "#FFFFFF",
                        },

                        "&.Mui-selected": {
                            backgroundColor: "rgba(255,255,255,0.14)",
                            color: "#FFFFFF",
                            boxShadow: "none",
                            border: "1px solid rgba(255,255,255,0.16)",

                            "&:hover": {
                                backgroundColor: "rgba(255,255,255,0.18)",
                                color: "#FFFFFF",
                            },
                        },
                    }}
                >
                    <ListItemIcon
                        sx={{
                            minWidth: compact ? 28 : 36,
                            color: "inherit",

                            "& svg": {
                                fontSize: compact ? 16 : 20,
                            },
                        }}
                    >
                        {iconMap[iconKey] || <DashboardRoundedIcon />}
                    </ListItemIcon>

                    <ListItemText
                        sx={{
                            "& .MuiListItemText-primary": {
                                fontSize: compact ? 11 : 14,
                                fontWeight: isActive ? 700 : 500,
                                color: "inherit",
                            },
                        }}
                    >
                        {item.label || item.name}
                    </ListItemText>
                </ListItemButton>
            );
        });

    return (
        <>
            {menuItems.length > 0 && (
                <>
                    <Typography sx={sectionLabelSx(compact)}>
                        MENU
                    </Typography>
                    {renderItems(menuItems)}
                </>
            )}

            {generalItems.length > 0 && (
                <>
                    <Typography sx={{ ...sectionLabelSx(compact), pt: compact ? 1.5 : 2 }}>
                        GENERAL
                    </Typography>
                    {renderItems(generalItems)}
                </>
            )}
        </>
    );
};

export default NavItem;
