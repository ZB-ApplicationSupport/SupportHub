import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Popover from "@mui/material/Popover";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

import { useNotificationDrawer } from "../../context/NotificationDrawerContext";
import { compactPx, useCompactDesktop } from "../../utils/compactDesktop";

const SEVERITY_STYLE = {
  critical: { color: "#FFFFFF", bg: "#D64545", icon: ErrorOutlineRoundedIcon },
  warning: { color: "#1A202C", bg: "#F4B41A", icon: WarningAmberRoundedIcon },
  info: { color: "#FFFFFF", bg: "#00843D", icon: InfoOutlinedIcon },
  ok: { color: "#FFFFFF", bg: "#00843D", icon: CheckRoundedIcon },
};

const formatRelativeTime = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const minutes = Math.max(0, Math.round((Date.now() - date.getTime()) / 60000));
  if (minutes < 1) return "Just now";
  if (minutes === 1) return "1 minute ago";
  if (minutes < 60) return `${minutes} minutes ago`;

  const hours = Math.round(minutes / 60);
  if (hours === 1) return "1 hour ago";
  if (hours < 24) return `${hours} hours ago`;

  const days = Math.round(hours / 24);
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
};

const severityFor = (note) => {
  if (note.severity && SEVERITY_STYLE[note.severity]) {
    return note.severity;
  }
  if (note.acknowledged) return "ok";
  return "warning";
};

const NotificationDrawer = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const navigate = useNavigate();
  const compact = useCompactDesktop();
  const { open, anchorEl, close, items, unreadCount, markAllRead } =
    useNotificationDrawer();

  const openObservability = () => {
    close();
    navigate("/settings?section=observability&tab=Alerts");
  };

  return (
    <Popover
      id="notifications-menu"
      open={open}
      anchorEl={anchorEl}
      onClose={close}
      disableScrollLock
      marginThreshold={12}
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
            width: compactPx(360, compact),
            maxWidth: "calc(100vw - 24px)",
            maxHeight: compactPx(440, compact),
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            borderRadius: compact ? "12px" : "16px",
            backgroundColor: "background.paper",
            backgroundImage: "none",
            border: "1px solid",
            borderColor: "divider",
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
          justifyContent: "space-between",
          gap: 2,
          px: compact ? 2 : 2.5,
          pt: compact ? 1.5 : 2,
          pb: compact ? 1.25 : 1.5,
        }}
      >
        <Typography
          sx={{
            fontSize: compactPx(15, compact),
            fontWeight: 700,
          }}
        >
          Notifications
        </Typography>
        <Button
          onClick={markAllRead}
          disabled={unreadCount === 0}
          sx={{
            minWidth: 0,
            px: 0,
            fontSize: compactPx(13, compact),
            fontWeight: 600,
            color: "primary.main",
            "&:disabled": {
              color: "text.secondary",
            },
          }}
        >
          Mark all as read
        </Button>
      </Box>

      <Divider />

      <Box sx={{ overflowY: "auto", flex: 1, minHeight: 0 }}>
        {items.length === 0 ? (
          <Box
            sx={{
              minHeight: compactPx(120, compact),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              px: 2,
            }}
          >
            <Typography sx={{ fontSize: compactPx(13, compact), color: "text.secondary" }}>
              No notifications
            </Typography>
          </Box>
        ) : (
          <Stack spacing={0}>
            {items.map((note) => {
              const acknowledged = Boolean(note.acknowledged);
              const severity = severityFor(note);
              const style = SEVERITY_STYLE[severity] || SEVERITY_STYLE.info;
              const Icon = style.icon;
              const title =
                note.title ||
                note.message ||
                note.name ||
                "Notification";
              const body = note.message && note.message !== title ? note.message : "";
              const occurredAt = formatRelativeTime(
                note.createdAt || note.updatedAt || note.sentAt
              );

              return (
                <Box
                  key={note.id}
                  onClick={openObservability}
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: compact ? 1.25 : 1.5,
                    px: compact ? 2 : 2.5,
                    py: compact ? 1.25 : 1.5,
                    cursor: "pointer",
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    "&:last-of-type": {
                      borderBottom: "none",
                    },
                    "&:hover": {
                      backgroundColor: isDark
                        ? "rgba(0, 132, 61, 0.16)"
                        : "#F8FAF9",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: compactPx(36, compact),
                      height: compactPx(36, compact),
                      borderRadius: "50%",
                      backgroundColor: style.bg,
                      color: style.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon sx={{ fontSize: compactPx(18, compact) }} />
                  </Box>
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography
                      sx={{
                        fontSize: compactPx(13, compact),
                        fontWeight: 700,
                        color: "text.primary",
                        display: "-webkit-box",
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {title}
                    </Typography>
                    {body ? (
                      <Typography
                        sx={{
                          fontSize: compactPx(12, compact),
                          color: "text.secondary",
                          mt: 0.25,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {body}
                      </Typography>
                    ) : null}
                    <Typography
                      sx={{
                        fontSize: compactPx(12, compact),
                        color: "text.secondary",
                        mt: 0.35,
                      }}
                    >
                      {occurredAt}
                    </Typography>
                  </Box>
                  {!acknowledged ? (
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: "primary.main",
                        flexShrink: 0,
                        mt: 1.25,
                      }}
                    />
                  ) : null}
                </Box>
              );
            })}
          </Stack>
        )}
      </Box>

      <Divider />

      <Box
        sx={{
          px: compact ? 1.25 : 1.5,
          py: compact ? 0.75 : 1,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Button
          onClick={openObservability}
          endIcon={<ArrowForwardRoundedIcon />}
          sx={{
            minWidth: 0,
            px: 1,
            fontSize: compactPx(13, compact),
            fontWeight: 700,
            color: "primary.main",
          }}
        >
          View all notifications
        </Button>
      </Box>
    </Popover>
  );
};

export default NotificationDrawer;
