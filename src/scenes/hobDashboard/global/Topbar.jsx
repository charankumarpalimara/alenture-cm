import {
  Box,
  IconButton,
  useTheme,
  Typography,
  useMediaQuery,
  Modal,
  Backdrop,
  ListItem,
  List,
  ListItemIcon,
  ListItemText,
  Drawer,
} from "@mui/material";
import { useState, useEffect } from "react";
import { tokens } from "../../../theme";
import { Link, useLocation } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import HandshakeOutlinedIcon from "@mui/icons-material/HandshakeOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AnalyticsIcon from '@mui/icons-material/Analytics';
// import TaskOutlinedIcon from "@mui/icons-material/TaskOutlined";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faAngleRight } from "@fortawesome/free-solid-svg-icons";

import { useNavigate } from "react-router-dom";
import Badge from "@mui/material/Badge";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCreaterFirstName, getCreaterRole } from "../../../config";
import {
  getAdminNotifications,
  getHobNotifications,
  markNotificationRead,
  getNotificationsDetails,
} from "../../../utils/http";


import logoLight from "./alentur-logo.avif";

// Shared getActivePage function
const getActivePage = (pathname) => {
  if (pathname.includes("/crm") || pathname.includes("/crmform")) {
    return "/crm";
  } else if (pathname.includes("/cm") || pathname.includes("/cmform")) {
    return "/cm";
  } else if (pathname.includes("/hob") || pathname.includes("/hobform")) {
    return "/hob";
  } else if (pathname.includes("/notes")) {
    return "/notes";
  } else if (pathname.includes("/calendar")) {
    return "/calendar";
  } else if (
    pathname.includes("/tasks") ||
    pathname.includes("/taskform")
  ) {
    return "/tasks";
  } else if (
    pathname.includes("/organization") ||
    pathname.includes("/organizationform") ||
    pathname.includes("/organizationdetails") ||
    pathname.includes("/organizationadd") ||
    pathname.includes("/OrganizationUnitadd")) {
    return "/organization";
  } else if (
    pathname === "/" ||
    pathname.includes("/ticketdetails") ||
    pathname.includes("/allExperiences") ||
    pathname.includes("/newExperiences") ||
    pathname.includes("/profile") ||
    pathname.includes("/taskdetails") ||
    pathname.includes("/pendingExperiences") ||
    pathname.includes("/resolvedExperiences")
  ) {
    return "/"; // Dashboard is active for these routes
  } else if (
    pathname.includes("/account")
  ) {
    return "/account";
  } else {
    return pathname;
  }
};

// Sidebar Item Component (Reused from Sidebar)
const Item = ({ title, to, icon, selected, setSelected, handleClose }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <ListItem
      button
      component={Link}
      to={to}
      selected={selected === to}
      onClick={() => {
        setSelected(to);
        sessionStorage.setItem("selectedSidebarItem", to);
        if (handleClose) handleClose();
      }}
      sx={{
        color: selected === to ? "white" : colors.blueAccent[500],
        fontWeight: selected === to ? "bold" : "regular",
        background: selected === to ? colors.blueAccent[1000] : "inherit",
        borderRadius: "10px",
        marginBottom: "8px",
        "&:hover": {
          backgroundColor: selected === to ? "#3e4396 !important" : "none", // Ensure no hover effect
          color: selected === to ? "white" : colors.blueAccent[500],
        },
      }}
    >
      <ListItemIcon sx={{ color: "inherit" }}>{icon}</ListItemIcon>
      <ListItemText
        primary={title}
        sx={{
          "& .MuiTypography-root": {
            // Target the nested Typography component
            fontWeight: "500 !important", // Ensure text is bold for selected item
            fontSize: "13px",
          },
        }}
      />
    </ListItem>
  );
};

const Topbar = ({ onLogout }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 900px)");
  const location = useLocation();
  const [selected, setSelected] = useState(getActivePage(location.pathname));
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());


  // WebSocket connection for live notifications
  // const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: notificationList,
    isLoading,
    isError,
  } = useQuery({
    queryKey: getCreaterRole() === 'admin' ? ["admin-notifications"] : ["hob-notifications"],
    queryFn: () => getCreaterRole() === 'admin' ? getAdminNotifications() : getHobNotifications(),
  });
  const { mutate: markNotificationReadMutate } = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: (data) => {
      const role = getCreaterRole();
      if (role === 'admin') {
        queryClient.invalidateQueries(["admin-notifications"]);
      } else {
        queryClient.invalidateQueries(["hob-notifications"]);
      }
      console.log("updated");
    },
    onError: (error) => {
      console.log("eror");
    },
  });
  const { mutate, isPending: loading } = useMutation({
    mutationFn: getNotificationsDetails,
    onSuccess: (data) => {
      navigate("/ticketdetails", { state: { ticket: data.data } });

      const role = getCreaterRole();
      if (role === 'admin') {
        queryClient.invalidateQueries(["admin-notifications"]);
      } else {
        queryClient.invalidateQueries(["hob-notifications"]);
      }
    },
    onError: (error) => { },
  });

  useEffect(() => {
    if (!isLoading && !isError && notificationList?.data?.length > 0) {
      const unreadNotifs = notificationList.data.filter(
        (notif) => notif.is_read === 0
      );
      const totalUnread = unreadNotifs.length;
      console.log("Total unread notifications:", totalUnread);
      setUnreadCount(totalUnread);
    }
  }, [isLoading, isError, notificationList]);

  useEffect(() => {
    // Replace with your actual WebSocket server URL
    const ws = new WebSocket(process.env.REACT_APP_WS_URL); // <-- adjust if needed

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("WebSocket data:", data);
        if (data.type === "notification") {
          // setNotifications((prev) => [data, ...prev]);
          // setUnreadCount((prev) => prev + 1);
          const role = getCreaterRole();
          if (role === 'admin') {
            queryClient.invalidateQueries(["admin-notifications"]);
          } else {
            queryClient.invalidateQueries(["hob-notifications"]);
          }
          setSnackbarMsg(data.message);
          setSnackbarOpen(true);
        }
      } catch (e) {
        // Ignore non-JSON or unrelated messages
      }
    };

    return () => ws.close();
  }, []);

  const handleNotificationsClick = () => {
    setDrawerOpen(true);
    // Optionally open a modal/dropdown with notifications
  };
  const notifClick = (data) => {
    setDrawerOpen(false);
    console.log("Clicked notification:", data);

    if (window.location.pathname === "/ticketdetails") {
      navigate("/");
    }

    // Handle different notification types for admin and HOB
    if (data.type === "cm_registration") {
      // Navigate to CM details
      navigate(`/cmdetails/${data.finalExperienceid}`, {
        state: { ticket: { id: data.finalExperienceid } }
      });
    } else if (data.type === "crm_registration") {
      // Navigate to CRM details
      navigate(`/crmdetails/${data.finalExperienceid}`, {
        state: { ticket: { crmid: data.finalExperienceid } }
      });
    } else if (data.type === "hob_registration") {
      // Navigate to HOB details
      navigate(`/hobdetails/${data.finalExperienceid}`, {
        state: { ticket: { hobid: data.finalExperienceid } }
      });
    }

    markNotificationReadMutate({
      id: data.id,
    });
  };

  // const getPageTitle = () => {
  //   switch (location.pathname) {
  //     case "/":
  //       return "Dashboard";
  //     case "/cm":
  //       return "Customer Manager";

  //     case "/crm":
  //       return "Customer Relationship Manager";

  //     case "/cmform":
  //       return "Create a New Customer Manager";

  //     case "/crmform":
  //       return " Create a New Customer Relationship Manager";

  //     case "/hob":
  //       return "Head of the Business";

  //     case "/tasks":
  //       return "Tasks List";

  //     case "/taskdetails":
  //       return "Task Details";

  //     case "/taskform":
  //       return "Create New Task";

  //     case "/crmdetails":
  //       return "Customer Relationship Manager Details";

  //     case "/cmdetails":
  //       return "Customer Manager Details";

  //     case "/organizationdetails":
  //       return " Organization Details";

  //     case "/organizationform":
  //       return "Create a New Organization";

  //     case "/organizationunitadd":
  //        return "Create a New Organization";
  //     case "/organizationadd":
  //       return "Add New Branch";

  //     case "/ticketdetails":
  //       return " Experience Details";

  //     case "/hobform":
  //       return "Create a New Hob";

  //     case "/hobdetails":
  //       return "Head of The Department Details";

  //     case "/allExperiences":
  //       return "All Experiences";

  //     case "/organization":
  //       return "Organizations";

  //     case "/newExperiences":
  //       return "New Experiences";

  //     case "/pendingExperiences":
  //       return "Pending Experiences";

  //     case "/resolvedExperiences":
  //       return "Resolved Experiences";

  //     case "/profile":
  //       return "Profile";

  //     case "/notes":
  //       return "Notes";

  //     case "/calendar":
  //       return "Calendar";
  //     default:
  //       return "Page Not Found";
  //   }
  // };
  // const getPageTitle1 = () => {
  //   switch (location.pathname) {
  //     case "/":
  //       return { primaryTitle: "Dashboard", secondaryTitle: null };
  //     case "/cm":
  //       return { primaryTitle: "Customer Manager", secondaryTitle: null };
  //     case "/crm":
  //       return {
  //         primaryTitle: "Customer Relationship Manager",
  //         secondaryTitle: null,
  //       };
  //     case "/cmdetails":
  //       return {
  //         primaryTitle: "Customer Manager Details ",
  //         secondaryTitle: null,
  //       };
  //     case "/organization":
  //       return { primaryTitle: "Organization", secondaryTitle: null };
  //     case "/ticketdetails":
  //       return { primaryTitle: "Experience Details", secondaryTitle: null };
  //     case "/organizationdetails":
  //       return { primaryTitle: "Organizations Details", secondaryTitle: null };
  //     case "/organizationform":
  //       return {
  //         primaryTitle: "Organization",
  //         secondaryTitle: "Create a New Organization",
  //       };

  //     case "/organizationunitadd":
  //       return {
  //         primaryTitle: "Organization",
  //         secondaryTitle: "Create a New Organization",
  //       };


  //     case "/organizationadd":
  //       return {
  //         primaryTitle: "Organization",
  //         secondaryTitle: " Add New Organization",
  //       };
  //     case "/cmform":
  //       return {
  //         primaryTitle: "Customer Manager",
  //         secondaryTitle: "Create a New Customer Manager",
  //       };
  //     case "/crmdetails":
  //       return {
  //         primaryTitle: "Customer Relationship Manager Details ",
  //         secondaryTitle: null,
  //       };
  //     case "/crmform":
  //       return {
  //         primaryTitle: "Customer Relationship Manager",
  //         secondaryTitle: "Create a New Customer Relationship Manager",
  //       };
  //     case "/hob":
  //       return { primaryTitle: "Head of the Business", secondaryTitle: null };
  //     case "/tasks":
  //       return { primaryTitle: "Tasks List", secondaryTitle: null };
  //     case "/taskform":
  //       return {
  //         primaryTitle: "Tasks List",
  //         secondaryTitle: "Create a New Task",
  //       };
  //     case "/taskdetails":
  //       return { primaryTitle: "Task Details", secondaryTitle: null };
  //     case "/form":
  //       return {
  //         primaryTitle: "Head of the Business",
  //         secondaryTitle: "Create a New Head of the Business Unit",
  //       };
  //     case "/hobdetails":
  //       return {
  //         primaryTitle: "Head of The Business Details",
  //         secondaryTitle: null,
  //       };
  //     case "/allExperiences":
  //       return { primaryTitle: "All Experiences", secondaryTitle: null };
  //     case "/newExperiences":
  //       return { primaryTitle: "New Experiences", secondaryTitle: null };
  //     case "/pendingExperiences":
  //       return { primaryTitle: "Pending Experiences", secondaryTitle: null };
  //     case "/resolvedExperiences":
  //       return { primaryTitle: "Resolved Experiences", secondaryTitle: null };
  //     case "/profile":
  //       return { primaryTitle: "Profile", secondaryTitle: null };
  //     case "/notes":
  //       return { primaryTitle: "Notes", secondaryTitle: null };
  //     case "/calendar":
  //       return { primaryTitle: "Calendar", secondaryTitle: null };
  //     default:
  //       return { primaryTitle: "Page Not Found", secondaryTitle: null };
  //   }
  // };

  // const { primaryTitle, secondaryTitle } = getPageTitle1();

  // const pageTitle = getPageTitle();
  // const [primaryTitle, secondaryTitle] = pageTitle.includes(" / ") ? pageTitle.split(" / ") : [pageTitle, ""];

  // Sync selected state with sessionStorage
  useEffect(() => {
    const storedSelected = sessionStorage.getItem("selectedSidebarItem");
    if (storedSelected) {
      setSelected(storedSelected);
    }
  }, []);

  useEffect(() => {
    setSelected(getActivePage(location.pathname));
    sessionStorage.setItem(
      "selectedSidebarItem",
      getActivePage(location.pathname)
    );
  }, [location.pathname]);

  const logoSrc = logoLight;

  // const getGreeting = () => {
  //   const hour = new Date().getHours();
  //   if (hour < 12) return "Good Morning";
  //   if (hour < 18) return "Good Afternoon";
  //   return "Good Evening";
  // };
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  // const CustomDivider = () => (
  //   <Box
  //     sx={{
  //       width: "20px",
  //       display: "flex",
  //       justifyContent: "center",
  //       alignItems: "center",
  //     }}
  //   >
  //     <FontAwesomeIcon icon={faAngleRight} /> {/* Custom divider icon */}
  //   </Box>
  // );

  // const handleLogout = () => {
  //   // Clear the token from localStorage
  //   localStorage.removeItem('token');

  //   // Call the parent logout handler if provided
  //   if (onLogout) onLogout();

  //   // Navigate to login page
  //   navigate('/login');

  //   // Optional: Force a full page reload to reset the application state

  // };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    onLogout();
    window.location.reload();
    navigate("/login");
  };

  return (
    <Box
      width="100%"
      sx={{
        bgcolor: "#fefefe !important",
        overflowX: "hidden",
      }}
    >
      {/* Topbar Container */}
      <Box
        display="flex"
        flexDirection="column"
        width="100%"
        bgcolor="#ffffff"
        sx={{
          overflowX: "hidden",
          flex: 1,
          marginTop: 1,
          background: "ffffff",
          backgroundColor: "#ffffff",
        }}
      >
        {/* Header Section */}
        {isMobile && (
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexShrink={0}
            width="100%"
            sx={{
              bgcolor: "#fefefe !important",
              boxShadow: "0px 4px 4px -2px rgba(0, 0, 0, 0.1)",
              // marginBottom: 2,
              // padding: null,
            }}
          >
            {/* Logo on Mobile */}
            <Box
              sx={{
                maxWidth: "200px",
                height: "65px",
                backgroundColor: "#fefefe !important",
              }}
            >
              <img
                src={logoSrc}
                alt="logo"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </Box>

            {/* Mobile Menu Icon */}
            <IconButton onClick={() => setIsModalOpen(true)}>
              <MenuOutlinedIcon sx={{ fontSize: 30 }} />
            </IconButton>
          </Box>
        )}

        {/* Greeting and Profile Section */}
        {isMobile ? (
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
            flexShrink={0}
            sx={{
              bgcolor: "transparent",
              paddingX: isMobile ? 2 : 9,
              paddingY: 1,
              boxShadow: "0px 4px 4px -2px rgba(0, 0, 0, 0.1)",
              padding: 1,
            }}
          >
            {/* Greeting Message */}
            <Box
              borderRadius="3px"
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "fit-content",
                padding: "8px",
                paddingLeft: isMobile ? "12px" : "20px",
                textAlign: isMobile ? "center" : "left",
              }}
            >
              {/* <Typography sx={{ color: "#8d8d8d", fontSize: isMobile ? "30px" : "25px" }}>
                {getGreeting()} Delphin
              </Typography> */}
              <Typography
                sx={{ color: "#000000", fontSize: isMobile ? "16px" : "16px" }}
              >
                {currentTime.toLocaleString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                })}
              </Typography>
            </Box>

            {/* Profile Section */}
            <Box
              borderRadius="3px"
              sx={{
                display: "flex",
                width: "fit-content",
                alignItems: "center",
              }}
            >
              <IconButton sx={{ gap: 1 }} onClick={handleNotificationsClick}>
                <Badge badgeContent={unreadCount} color="error">
                  <Box
                    sx={{
                      width: isMobile ? 25 : 30,
                      height: isMobile ? 25 : 30,
                      borderRadius: "50%",
                      background: colors.blueAccent[1000],
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <NotificationsIcon
                      sx={{ fontSize: isMobile ? 18 : 20, color: "#fff" }}
                    />
                  </Box>
                </Badge>
              </IconButton>
              <IconButton
                onClick={() => navigate("/profile")}
                sx={{ gap: 1 }}
              >
                <Box
                  sx={{
                    width: isMobile ? 25 : 30,
                    height: isMobile ? 25 : 30,
                    borderRadius: "50%",
                    background: colors.blueAccent[1000],
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <PersonIcon
                    sx={{ fontSize: isMobile ? 18 : 20, color: "#fff" }}
                  />
                </Box>
                <Typography
                  sx={{ color: "#000", fontSize: isMobile ? 15 : 17 }}
                >
                  {getCreaterFirstName()}
                </Typography>
              </IconButton>
            </Box>
          </Box>
        ) : (
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
            flexShrink={0}
            sx={{
              bgcolor: "#ffffff",
              paddingX: isMobile ? 2 : 4,
              paddingLeft: 35,
            }}
          >
            {/* Greeting Message */}
            <Box
              borderRadius="3px"
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "fit-content",
                padding: "8px",
                paddingRight: "30px",
                paddingLeft: isMobile ? "12px" : "20px",
                textAlign: isMobile ? "center" : "left",
              }}
            >
              {/* <Typography sx={{ color: "#8d8d8d", fontSize: isMobile ? "20px" : "25px" }}>
                {getGreeting()} Delphin
              </Typography> */}
              <Typography
                sx={{ color: "#000000", fontSize: isMobile ? "14px" : "16px" }}
              >
                {currentTime.toLocaleString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                })}
              </Typography>
            </Box>

            {/* Profile Section */}
            <Box
              borderRadius="3px"
              sx={{
                display: "flex",
                width: "fit-content",
                alignItems: "center",
                gap: 1,

              }}
            >
              <IconButton sx={{ gap: 1 }} onClick={handleNotificationsClick}>
                <Badge badgeContent={unreadCount} color="error">
                  <Box
                    sx={{
                      width: isMobile ? 25 : 30,
                      height: isMobile ? 25 : 30,
                      borderRadius: "50%",
                      background: colors.blueAccent[1000],
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <NotificationsIcon
                      sx={{ fontSize: isMobile ? 18 : 20, color: "#fff" }}
                    />
                  </Box>
                </Badge>
              </IconButton>
              <IconButton
                onClick={() => navigate("/profile")}
                sx={{ gap: 1 }}
              >
                <Box
                  sx={{
                    width: isMobile ? 25 : 30,
                    height: isMobile ? 25 : 30,
                    borderRadius: "50%",
                    background: colors.blueAccent[1000],
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <PersonIcon
                    sx={{ fontSize: isMobile ? 18 : 20, color: "#fff" }}
                  />
                </Box>
                <Typography
                  sx={{ color: "#000", fontSize: isMobile ? 15 : 17 }}
                >
                  {getCreaterFirstName()}
                </Typography>
              </IconButton>
              <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <Alert
                  onClose={() => setSnackbarOpen(false)}
                  severity="info"
                  sx={{ width: "100%" }}
                >
                  {snackbarMsg}
                </Alert>
              </Snackbar>
            </Box>
          </Box>
        )}

        {/* Page Title Section */}
        {/* {isMobile ? (
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
            flexShrink={0}
            sx={{
              backgroundColor: colors.blueAccent[700],
              paddingX: isMobile ? 2 : 4,
              boxShadow: "0px 4px 8px -2px rgba(62, 67, 150, 0.5)",
              padding: "20px",
            }}
          >
            <Box
              borderRadius="3px"
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "fit-content",
                padding: "8px",
                paddingLeft: isMobile ? "12px" : "20px",
                textAlign: isMobile ? "text" : "text",
              }}
            >
              <Typography
                sx={{
                  color: "#ffffff",
                  fontSize: isMobile ? "20px" : "20px",
                  fontWeight: "bold",
                }}
              >
                {getPageTitle()}
              </Typography>
              <Box
                sx={{
                  color: "#ffffff",
                  alignItems: "center",
                  gap: 1,
                  display: "flex",
                }}
              >
                <HomeOutlinedIcon
                  onClick={() => navigate("/")}
                  fontSize="small"
                  sx={{ cursor: "pointer" }}
                />

                <CustomDivider />
                <Typography>{getPageTitle()}</Typography>
              </Box>
            </Box>
          </Box>
        ) : (
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
            flexShrink={0}
            sx={{
              backgroundColor: colors.blueAccent[500],
              paddingX: isMobile ? 2 : 4,
              paddingLeft: 35,
            }}
          >
            <Box
              borderRadius="3px"
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "fit-content",
                padding: "8px",
                paddingLeft: isMobile ? "12px" : "20px",
              }}
            >
              <Typography
                sx={{
                  color: "#ffffff",
                  fontSize: isMobile ? "17px" : "20px",
                  fontWeight: "bold",
                }}
              >
                {primaryTitle}
              </Typography>
              <Box
                sx={{
                  color: "#ffffff",
                  alignItems: "center",
                  gap: 1,
                  display: "flex",
                }}
              >
                <HomeOutlinedIcon
                  onClick={() => navigate("/")}
                  fontSize="small"
                  sx={{ cursor: "pointer" }}
                />
                <CustomDivider />
                <Typography
                  sx={{ cursor: "pointer", fontSize: "14px" }}
                  onClick={secondaryTitle ? () => navigate(-1) : undefined}
                >
                  {primaryTitle}
                </Typography>
                {secondaryTitle && (
                  <>
                    <CustomDivider />
                    <Typography
                      sx={{ cursor: "pointer", fontSize: "14px" }}
                      onClick={() => navigate(location.pathname)}
                    >
                      {secondaryTitle}
                    </Typography>
                  </>
                )}
              </Box>
            </Box>
          </Box>
        )} */}
      </Box>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box
          sx={{ 
            width: isMobile ? 250 : 350, 
            padding: 2,
            maxHeight: "80vh",
            overflowY: "auto"
          }}
          role="presentation"
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Notifications
          </Typography>
          <List>
            {notificationList && notificationList.data.length === 0 && (
              <ListItem>
                <ListItemText primary="No notifications yet." />
              </ListItem>
            )}
            {notificationList &&
              notificationList.data.map((notif, idx) => (
                <ListItem
                  sx={{
                    cursor: "pointer",
                    marginBottom: "8px",
                    "&:hover": {
                      backgroundColor: colors.grey[700],
                      color: "white",
                    },
                  }}
                  className=""
                  onClick={() => notifClick(notif)}
                  key={idx}
                  divider
                >
                  <ListItemText
                    primary={notif.title || "Notification"}
                    secondary={
                      <>
                        <span>{notif.message}</span>
                        <br />
                        <span style={{ fontSize: 12, color: "#888" }}>
                          {notif.timestamp
                            ? new Date(notif.created_at).toLocaleString()
                            : ""}
                        </span>
                      </>
                    }
                  />
                </ListItem>
              ))}
          </List>
        </Box>
      </Drawer>
      <Box sx={{ alignItems: "center" }}>
        {/* Mobile Sidebar Modal */}
        <Modal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
            sx: { backgroundColor: "rgba(0, 0, 0, 0.5)" }, // Semi-transparent black backdrop
          }}
        >
          <Box
            width="100%"
            sx={{
              background: colors.primary[400],
              height: "90vh",
              position: "absolute",
              left: 0,
              top: "10%",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              overflowY: "auto",
              overflowX: "hidden",
              boxShadow: "4px 0px 8px rgba(0, 0, 0, 0.2)",
              paddingBottom: "40px",
            }}
          >
            <Item
              title="Dashboard"
              to="/"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              handleClose={() => setIsModalOpen(false)}
            />
            <Item
              title="Customer Manager"
              to="/cm"
              icon={<PeopleAltOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              handleClose={() => setIsModalOpen(false)}
            />
            <Item
              title="Relationship Manager"
              to="/crm"
              icon={<HandshakeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              handleClose={() => setIsModalOpen(false)}
            />
            {getCreaterRole() === "admin" && (
              <Item
                title="Head of the Business"
                to="/hob"
                icon={<StorefrontOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
                handleClose={() => setIsModalOpen(false)}
              />
            )}
            <Item
              title="Organization"
              to="/organization"
              icon={<BusinessOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              handleClose={() => setIsModalOpen(false)}
            />
            <Item
              title="IdeaHub"
              to="/allideas"
              icon={<LightbulbOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              handleClose={() => setIsModalOpen(false)}
            />
            <Item
              title="Revenue Leak"
              to="/revenue-leak"
              icon={<MonetizationOnIcon />}
              selected={selected}
              setSelected={setSelected}
              handleClose={() => setIsModalOpen(false)}
            />
            <Item
              title="Meeting Coach"
              to="/meeting-coach"
              icon={<RecordVoiceOverIcon />}
              selected={selected}
              setSelected={setSelected}
              handleClose={() => setIsModalOpen(false)}
            />
            <Item
              title="Account"
              to="/account"
              icon={<AccountCircleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              handleClose={() => setIsModalOpen(false)}
            />
            <Item
              title="Customer Insights"
              to="/customer-insights"
              icon={<InsightsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              handleClose={() => setIsModalOpen(false)}
            />
            {getCreaterRole() === "hob" && (
              <Item
                title="Churn Prediction"
                to="/churn-prediction"
                icon={<TrendingDownIcon />}
                selected={selected}
                setSelected={setSelected}
                handleClose={() => setIsModalOpen(false)}
              />
            )}
            <Item
              title="Analytics"
              to="/business-growth-analytics"
              icon={<AnalyticsIcon />}
              selected={selected}
              setSelected={setSelected}
              handleClose={() => setIsModalOpen(false)}
            />

            {/* <Item title="Tasks" to="/tasks" icon={<TaskOutlinedIcon />} selected={selected} setSelected={setSelected} handleClose={() => setIsModalOpen(false)} /> */}
            <Item
              title="Notes"
              to="/notes"
              icon={<DescriptionOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              handleClose={() => setIsModalOpen(false)}
            />
            <Item
              title="Calendar"
              to="/calendar"
              icon={<CalendarTodayOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              handleClose={() => setIsModalOpen(false)}
            />
            <ListItem
              button
              onClick={handleLogout}
              sx={{
                color: colors.blueAccent[500],
                borderRadius: "10px",
                marginBottom: "8px",
                "&:hover": {
                  backgroundColor: colors.blueAccent[700],
                  color: "white",
                },
              }}
            >
              <ListItemIcon sx={{ color: "inherit" }}>
                <LogoutOutlinedIcon />
              </ListItemIcon>
              <ListItemText
                primary="Logout"
                sx={{
                  "& .MuiTypography-root": {
                    fontWeight: "600 !important", // Ensure text is bold for selected item
                    fontSize: "12px",
                  },
                }}
              />
            </ListItem>
          </Box>
        </Modal>
      </Box>
    </Box>
  );
};

export default Topbar;
