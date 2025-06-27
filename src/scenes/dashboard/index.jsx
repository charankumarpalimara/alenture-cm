import { Box, Grid, Typography } from "@mui/material";
// import { tokens } from "../../theme";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
// import Header from "../../components/Header";
// import LineChart from "../../components/LineChart";
// import BarChart from "../../components/BarChart";
// import PieChart from "../../components/PieChart";
import StatBox from "../../components/StatBox";
// import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import React, {useState, useEffect, useRef} from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { message } from "antd";

const Dashboard = () => {
  // const theme = useTheme();
  // const colors = tokens(theme.palette.mode); // Get theme colors


    const [counts, setCounts] = useState(null);
  const ws = useRef(null);


  // AllExperiencesCountByCrmid

    useEffect(() => {
    const fetchCounts = async () => {
      // setLoading(true);
       const userDetails = JSON.parse(sessionStorage.getItem('CmDetails')) || {};
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/v1/AllExperiencesCountByCmid/${userDetails.cmid}`);
                // const res = await axios.get(`http://127.0.0.1:8080/v1/AllExperiencesCountByCmid/${userDetails.cmid}`);
        setCounts(res.data);
      } catch (err) {
        message.error("Failed to fetch experience counts");
      } finally {
        // setLoading(false);
      }
    };
    fetchCounts();
    ws.current = new window.WebSocket(process.env.REACT_APP_WS_URL);
    ws.current.onmessage = (event) => {
      // Optionally, check event.data for specific update types
      fetchCounts();
    };
    ws.current.onerror = (err) => {
      // Optionally handle error
    };
    return () => {
      if (ws.current) ws.current.close();
    };
  }, []);






  


  const data = [
    {
      title: `${counts?.total ?? 0}`,
      subtitle: "ALL EXPERIENCE",
      progress: counts?.total > 0 ? 1 : 0,
      icon: <ReceiptLongIcon />,
      link: "/allExperiences",
    },
    {
      title: `${counts?.new ?? 0}`,
      subtitle: "NEW EXPERIENCE",
      progress: counts?.new > 0 ? counts?.new / counts?.total : 0,
      icon: <NewReleasesIcon />,
      link: "/newExperiences",
    },
    {
      title: `${counts?.resolved ?? 0}`,
      subtitle: "RESOLVED EXPERIENCE",
      progress: counts?.resolved > 0 ? counts?.resolved / counts?.total : 0,
      icon: <CheckCircleIcon />,
      link: "/resolvedExperiences",
    },
    {
      title: `${counts?.processing ?? 0}`,
      subtitle: "PENDING EXPERIENCE",
      progress: counts?.processing > 0 ? counts?.processing / counts?.total : 0,
      icon: <HourglassEmptyIcon />,
      link: "/pendingExperiences",
    },
  ];

  return (
    <Box m={2} >
      {/* HEADER */}
      {/* <Box mb={3} p={2} borderRadius={2} sx={{ backgroundColor:"#ffffff" }}>
        <Grid container justifyContent="space-between" alignItems="center" >
          <Grid item xs={12} sm={6}>
            <Header title="Good Morning" subtitle="Welcome to your dashboard" />
          </Grid>
          <Grid item>
            <Button
              sx={{
                backgroundColor: '#3e4396',
                // color: colors.grey[100],
                color: '#fff',
                fontSize: { xs: "12px", sm: "14px" },
                fontWeight: "bold",
                padding: { xs: "8px 12px", sm: "10px 20px" },
                textTransform:"none"
              }}
            >
              <DownloadOutlinedIcon sx={{ mr: "10px" }} />
              Download Reports
            </Button>
          </Grid>
        </Grid>
      </Box> */}

      {/* EXPERIENCE STATISTICS (FIXED CIRCLE INSIDE BOX) */}
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

      {/* REVENUE & EXPERIENCE CHARTS */}
      <Grid container spacing={2} mt={3}>
        {/* <Grid item xs={12} md={8}>
          <Box p={2} borderRadius={2} sx={{ bgcolor: colors.primary[400] }}>
            <Typography variant="h6" color={colors.grey[100]} mb={1}>
              Revenue Generated
            </Typography>
            <Typography
              variant="h4"
              fontWeight="bold"
              color={colors.greenAccent[500]}
            >
              $59,342.32
            </Typography>
            <Box height="250px">
              <LineChart isDashboard={true} />
            </Box>
          </Box>
           </Grid> */}

        {/* <Grid item xs={12} md={4}>
          <Box p={2} borderRadius={2} sx={{ bgcolor: colors.primary[400] }}>
            <Typography variant="h6" color={colors.grey[100]} mb={1}>
              Experience Quantity
            </Typography>
            <Box height="250px">
              <BarChart isDashboard={true} />
            </Box>
          </Box>
        </Grid> */}

        <Grid item xs={12} md={4}>
          <Box p={2} borderRadius={2} sx={{bgcolor:"#ffffff" }} >
            <Typography variant="h6"  mb={1} fontWeight="bold">
              Experience Quantity
            </Typography>
            <Box height="250px"   >
              {/* <PieChart isDashboard={true} /> */}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
