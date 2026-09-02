import React from "react";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const StatsCard = ({ label, value, helper }) => {
  return (
    <Card
      elevation={0}
      sx={{
        width: "100%",
        height: "100%",
        minHeight: 100,

        backgroundColor: "background.paper",

        border: "1px solid",
        borderColor: "divider",

        borderRadius: 2,

        transition: "all 0.2s ease",

        "&:hover": {
          borderColor: "primary.main",
          boxShadow: "0 4px 14px rgba(0, 132, 61, 0.08)",
        },
      }}
    >
      <CardContent
        sx={{
          height: "100%",
          p: 2.5,

          "&:last-child": {
            pb: 2.5,
          },

          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* Label */}
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            fontWeight: 500,
          }}
        >
          {label}
        </Typography>

        {/* Value */}
        <Typography
          variant="h3"
          sx={{
            mt: 1,
            fontWeight: 700,
            color: "text.primary",
            lineHeight: 1.2,
          }}
        >
          {value}
        </Typography>

        {/* Optional helper text */}
        {helper && (
          <Box sx={{ mt: 1 }}>
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
              }}
            >
              {helper}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;
