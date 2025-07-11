import { Box, Grid, Typography } from "@mui/material";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import StatBox from "../../../components/StatBox";
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { message } from "antd";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
const { getCreaterRole, getCreaterId } = require("../../../config");

const Dashboard = () => {
  const [counts, setCounts] = useState(null);
  const ws = useRef(null);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const role = getCreaterRole();
        const id = getCreaterId();

        let url = "";
        if (role === "cm") {
          url = `${process.env.REACT_APP_API_URL}/v1/AllExperiencesCountByCmid/${id}`;
        } else if (role === "crm") {
          url = `${process.env.REACT_APP_API_URL}/v1/AllExperiencesCountByCrmid/${id}`;
        } else if (role === "hob" || role === "admin") {
          url = `${process.env.REACT_APP_API_URL}/v1/getAllExperienceCount`;
        } else {
          message.error("Invalid user role");
          return;
        }

        const res = await axios.get(url);
        setCounts(res.data);
      } catch (err) {
        console.error("API error:", err);
        message.error("Failed to fetch experience counts");
      }
    };

    fetchCounts();
    ws.current = new window.WebSocket(process.env.REACT_APP_WS_URL);
    ws.current.onmessage = (event) => {
      fetchCounts();
    };
    ws.current.onerror = (err) => {};
    return () => {
      if (ws.current) ws.current.close();
    };
  }, []);

  // Defensive fallback for zero
  const total = Number(counts?.total) || 0;
  const newCount = Number(counts?.new) || 0;
  const resolvedCount = Number(counts?.resolved) || 0;
  const pendingCount = Number(counts?.processing) || 0;

  const data = [
    {
      title: `${total}`,
      subtitle: "ALL EXPERIENCE",
      progress: total > 0 ? 1 : 0,
      icon: <ReceiptLongIcon />,
      link: "/allExperiences",
    },
    {
      title: `${newCount}`,
      subtitle: "NEW EXPERIENCE",
      progress: total > 0 ? newCount / total : 0,
      icon: <NewReleasesIcon />,
      link: "/newExperiences",
    },
    {
      title: `${resolvedCount}`,
      subtitle: "RESOLVED EXPERIENCE",
      progress: total > 0 ? resolvedCount / total : 0,
      icon: <CheckCircleIcon />,
      link: "/resolvedExperiences",
    },
    {
      title: `${pendingCount}`,
      subtitle: "PENDING EXPERIENCE",
      progress: total > 0 ? pendingCount / total : 0,
      icon: <HourglassEmptyIcon />,
      link: "/pendingExperiences",
    },
  ];

  return (
    <Box m={2}>
      <Grid container spacing={2}>
        {data.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Link to={item.link} style={{ textDecoration: "none" }}>
              <Box
                p={2}
                borderRadius={2}
                sx={{
                  bgcolor: '#ffffff',
                  minHeight: "80px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  transition: "transform 0.2s",
                  "&:hover": { transform: "scale(1.05)" },
                }}
              >
                <StatBox
                  subtitle={item.subtitle}
                  title={item.title}
                  color='#3e4396'
                  progress={item.progress}
                  icon={React.cloneElement(item.icon, {
                    fontSize: "large",
                    sx: { color: '#3e4396' },
                  })}
                />
              </Box>
            </Link>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2} mt={3}>
        <Grid item xs={12} md={4}>
          <Box p={2} borderRadius={2} sx={{ bgcolor: "#ffffff" }}>
            <Typography variant="h6" mb={1} fontWeight="bold">
              Experience Quantity
            </Typography>
            <Box height="250px">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "New", value: newCount },
                      { name: "Resolved", value: resolvedCount },
                      { name: "Pending", value: pendingCount },
                    ]}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    <Cell key="cell-new" fill="#1976d2" />
                    <Cell key="cell-resolved" fill="#43a047" />
                    <Cell key="cell-pending" fill="#fbc02d" />
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;