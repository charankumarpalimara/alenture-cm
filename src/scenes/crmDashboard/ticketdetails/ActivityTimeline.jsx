import React, { useState } from "react";
import {
  Box,
  Typography,
  Collapse,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";

const ActivityTimeline = ({
  date,
  time,
  processtime,
  processdate,
  resolvedtime,
  resolveddate,
}) => {
  const [open, setOpen] = useState(false);

  const timeline = [
    {
      key: "registered",
      label: "Registered",
      date: date,
      time: time,
      icon: <AccessTimeIcon color="primary" />,
    },
    {
      key: "processed",
      label: "Processed",
      date: processdate,
      time: processtime,
      icon: <HourglassBottomIcon color="info" />,
    },
    {
      key: "resolved",
      label: "Resolved",
      date: resolveddate,
      time: resolvedtime,
      icon: <CheckCircleIcon color="success" />,
    },
  ].filter((item) => item.date || item.time);

  return (
    <Box sx={{ width: "100%", my: 2 }}>
      <Box
        onClick={() => setOpen((prev) => !prev)}
        role="button"
        aria-expanded={open}
        tabIndex={0}
        sx={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          userSelect: "none",
          width: "fit-content",
          color: "#1976d2",
          fontWeight: 600,
          '&:hover': { textDecoration: "underline", color: "#1565c0" },
          outline: "none",
        }}
      >
        <ExpandMoreIcon
          sx={{
            mr: 1,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
            color: "#3e4396",
          }}
        />
        <Typography
          variant="body1"
          component="span"
          sx={{ fontWeight: 600, fontSize: "15px", color: "#3e4396" }}
        >
          {open ? "Hide Activity Timeline" : "Show Activity Timeline"}
        </Typography>
      </Box>
      <Collapse in={open}>
        <Box
          sx={{
            // bgcolor: "#fafafa",
            // border: "1px solid #e0e0e0",
            borderRadius: 2,
            mt: 2,
            // px: 3,
            py: 2,
            maxWidth: 430,
            minWidth: 260,
            width: "100%",      // <-- Ensures it aligns left and fills parent
            // boxShadow: 1,
            // REMOVE mx: { xs: 0, sm: "auto" }
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "600" }}>
            Activity Timeline
          </Typography>
          <Divider sx={{ mb: 1 }} />
          <List dense disablePadding>
            {timeline.map((item) => (
              <ListItem key={item.key} sx={{ pl: 0 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={
                    <span>
                      <Typography  variant="subtitle2" sx={{ fontWeight: "600" }}>{item.label}:</Typography>{" "}
                      {item.date ? item.date : ""}
                      {item.date && item.time ? ", " : ""}
                      {item.time ? item.time : ""}
                    </span>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Collapse>
    </Box>
  );
};

export default ActivityTimeline;