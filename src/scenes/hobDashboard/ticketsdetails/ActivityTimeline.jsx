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

// Helper to convert UTC date and time to local string, fallback to N/A if missing or invalid
const getLocalDateTimeString = (date, time) => {
  // Check for empty, null, undefined, or whitespace
  if (!date || !time || !date.trim() || !time.trim()) return "N/A";
  // Combine as UTC
  const utcIso = `${date}T${time}Z`;
  const d = new Date(utcIso);
  if (isNaN(d.getTime())) return "N/A"; // Invalid date
  return d.toLocaleString();
};

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
  ];

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
          "&:hover": { textDecoration: "underline", color: "#1565c0" },
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
          component="span"
          variant="subtitle2" 
          sx={{ fontWeight: "600", color: "#3e4396" }}
          // sx={{ color: "#3e4396" }}
        >
          {open ? "Hide Activity Timeline" : "Show Activity Timeline"}
        </Typography>
      </Box>
      <Collapse in={open}>
        <Box
          sx={{
            borderRadius: 2,
            mt: 2,
            py: 2,
            maxWidth: 430,
            minWidth: 260,
            width: "100%",
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: "600", color: "#000" }}
          >
            Activity Timeline
          </Typography>
          <Divider sx={{ mb: 1 }} />
          <List dense disablePadding>
            {timeline.map((item) => (
              <ListItem key={item.key} sx={{ pl: 0 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={
                    <>
                      <Typography        
                         variant="subtitle2"
                         sx={{ fontWeight: "600", color: "#000" }}>
                        {item.label}:
                      </Typography>{" "}
                     <Typography variant="subtitle2">
                       {getLocalDateTimeString(item.date, item.time)}
                     </Typography>
                    </>
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