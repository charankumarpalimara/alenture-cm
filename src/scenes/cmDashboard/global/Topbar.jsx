import {
  Box,
  IconButton,
  useTheme,
  Typography,
  useMediaQuery,
  Modal,
  Backdrop,
  List,
  Drawer,
  ListItem,
  ListItemIcon,
  ListItemText,
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
import Badge from "@mui/material/Badge";
// import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
// import HandshakeOutlinedIcon from "@mui/icons-material/HandshakeOutlined";
// import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import logoLight from "./logo.png";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { markNotificationRead } from "../../../utils/http";
import { getCreaterId } from "../../../config";
import { getCmNotifications } from "../../../utils/http";
import { getNotificationsDetails } from "../../../utils/http";

// Shared getActivePage function
const getActivePage = (pathname) => {
  if (pathname.includes("/crmform")) {
    return "/allExperiences";
  } else if (pathname.includes("/notes")) {
    return "/notes";
  } else if (pathname.includes("/calendar")) {
    return "/calendar";
  } else if (
    pathname.includes("/allExperiences") ||
    pathname.includes("/experiences") ||
    pathname.includes("/CmExperienceRegistrationForm") ||
    pathname.includes("/taskdetails") ||
    pathname.includes("/ticketdetails") ||
    pathname.includes("/newExperiences") ||
    pathname.includes("/pendingExperiences") ||
    pathname.includes("/resolvedExperiences")
  ) {
    return "/experiences"; // Ensure this matches the `to` prop of the Experiences Item
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
        backgroundColor: selected === to ? colors.blueAccent[700] : "inherit",
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
            fontWeight: "bold !important", // Ensure text is bold for selected item
            fontSize: "15px",
          },
        }}
      />
    </ListItem>
  );
};

const Topbar = ({ isSidebar, onLogout }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 900px)");
  const location = useLocation();
  const [selected, setSelected] = useState(getActivePage(location.pathname));
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  const userDetails = JSON.parse(sessionStorage.getItem("CmDetails")) || {}; // Retrieve user details from sessionStorage
  const username = userDetails.firstname
    ? `${userDetails.firstname} ${userDetails.lastname}`
    : "Guest"; // Construct username or fallback to 'Guest'

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/":
        return "Dashboard";
      case "/experiences":
        return "Experiences";
      case "/crm":
        return "Customer Relationship Manager";
      case "/hob":
        return "Head of The Business";
      case "/cmform":
        return "Create a New Experience";
      case "/crmform":
        return "Allot New Experience";
      case "/ticketdetails":
        return "Experience Details";
      case "/tasks":
        return "Tasks List";
      case "/form":
        return "";
      case "/allExperiences":
        return "All Experiences";
      case "/newExperiences":
        return "New Experiences";
      case "/pendingExperiences":
        return "Pending Experiences";
      case "/resolvedExperiences":
        return "Resolved Experiences";
      case "/profile":
        return "Profile";
      case "/notes":
        return "Notes";
      case "/calendar":
        return "Calendar";
      default:
        return "Page Not Found";
    }
  };
  const getPageTitle1 = () => {
    switch (location.pathname) {
      case "/":
        return { primaryTitle: "Dashboard", secondaryTitle: null };
      case "/cm":
        return { primaryTitle: "Experiences", secondaryTitle: null };
      case "/crm":
        return {
          primaryTitle: "Customer Relationship Manager",
          secondaryTitle: null,
        };
      case "/hob":
        return { primaryTitle: "Head of The Business", secondaryTitle: null };
      case "/ticketdetails":
        return { primaryTitle: "Experience Details", secondaryTitle: null };
      case "/taskdetails":
        return { primaryTitle: "Task Details", secondaryTitle: null };
      case "/CmExperienceRegistrationForm":
        return {
          primaryTitle: "Experiences",
          secondaryTitle: "Create a New Experience",
        };
      case "/crmform":
        return {
          primaryTitle: "Experiences",
          secondaryTitle: "Create a New Customer Relationship Manager",
        };
      case "/form":
        return {
          primaryTitle: "Head of the Business",
          secondaryTitle: "Create a New Head of the Business Unit",
        };
      case "/allExperiences":
        return {
          primaryTitle: "Experiences",
          secondaryTitle: "All Experiences",
        };
      case "/newExperiences":
        return {
          primaryTitle: "Experiences",
          secondaryTitle: "New Experiences",
        };
      case "/pendingExperiences":
        return {
          primaryTitle: "Experiences",
          secondaryTitle: "Pending Experiences",
        };
      case "/resolvedExperiences":
        return {
          primaryTitle: "Experiences",
          secondaryTitle: "Resolved Experiences",
        };
      case "/profile":
        return { primaryTitle: "Profile", secondaryTitle: null };
      case "/notes":
        return { primaryTitle: "Notes", secondaryTitle: null };
      case "/calendar":
        return { primaryTitle: "Calendar", secondaryTitle: null };
      default:
        return { primaryTitle: "Page Not Found", secondaryTitle: null };
    }
  };

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
    queryKey: ["cm-notifications"],
    queryFn: () => getCmNotifications({ cmId: getCreaterId() }),
  });
  const { mutate: markNotificationReadMutate } = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: (data) => {
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

      queryClient.invalidateQueries("cm-notifications");
    },
    onError: (error) => {},
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

  // WebSocket connection for live notifications
  useEffect(() => {
    // const WS_URL = "ws://147.182.163.213:3000/ws/";
    const ws = new WebSocket(process.env.REACT_APP_WS_URL);
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("WebSocket data:", data); // Debug incoming messages
        if (data.type === "notification" && data.cmid === getCreaterId()) {
          // setNotifications((prev) => [data, ...prev]);
          // setUnreadCount((prev) => prev + 1);
          queryClient.invalidateQueries("cm-notifications");
          setSnackbarMsg(data.message);
          setSnackbarOpen(true);
        }
      } catch (e) {}
    };
    return () => ws.close();
  }, []);

  const handleNotificationsClick = () => {
    // setUnreadCount(0);
    setDrawerOpen(true);
  };
  const notifClick = (data) => {
    setDrawerOpen(false);
    console.log(window.location.pathname);
    if (window.location.pathname === "/ticketdetails") {
      navigate("/");
    }
    if (data.type === "experience_resolved") {
      mutate({
        id: data.finalExperienceid,
      });
    }
    markNotificationReadMutate({
      id: data.id,
    });
  };

  const { primaryTitle, secondaryTitle } = getPageTitle1();

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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const CustomDivider = () => (
    <Box
      sx={{
        width: "20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <FontAwesomeIcon icon={faAngleRight} /> {/* Custom divider icon */}
    </Box>
  );

  const handleLogout = () => {
    sessionStorage.removeItem("cmtoken");
    onLogout();
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
              marginBottom: 2,
              padding: 2,
            }}
          >
            {/* Logo on Mobile */}
            <Box
              sx={{
                maxWidth: "180px",
                height: "50px",
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
                sx={{ color: "#8d8d8d", fontSize: isMobile ? "16px" : "16px" }}
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
              <IconButton sx={{ gap: 1 }}>
                <Box
                  sx={{
                    width: isMobile ? 25 : 30,
                    height: isMobile ? 25 : 30,
                    borderRadius: "50%",
                    backgroundColor: colors.blueAccent[500],
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <NotificationsIcon
                    sx={{ fontSize: isMobile ? 18 : 20, color: "#fff" }}
                  />
                </Box>
                {/* <Typography sx={{ color: "#000", fontSize: isMobile ? 15 : 17 }}>
                  Delphin
                </Typography> */}
              </IconButton>
              <IconButton onClick={() => navigate("profile")} sx={{ gap: 1 }}>
                <Box
                  sx={{
                    width: isMobile ? 25 : 30,
                    height: isMobile ? 25 : 30,
                    borderRadius: "50%",
                    backgroundColor: colors.blueAccent[500],
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
                  {username}
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
                sx={{ color: "#8d8d8d", fontSize: isMobile ? "14px" : "16px" }}
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
                      backgroundColor: colors.blueAccent[500],
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
                {/* <Typography sx={{ color: "#000", fontSize: isMobile ? 15 : 17 }}>
                  Delphin
                </Typography> */}
              </IconButton>
              <IconButton onClick={() => navigate("profile")} sx={{ gap: 1 }}>
                <Box
                  sx={{
                    width: isMobile ? 25 : 30,
                    height: isMobile ? 25 : 30,
                    borderRadius: "50%",
                    backgroundColor: colors.blueAccent[500],
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
                  {username}
                </Typography>
              </IconButton>
            </Box>
          </Box>
        )}

        {/* Page Title Section */}
        {isMobile ? (
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
            {/* Greeting Message */}
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
                  fontSize: isMobile ? "20px" : "25px",
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
            {/* Greeting Message */}
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
        )}
      </Box>
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
              height: "100vh",
              position: "absolute",
              left: 0,
              top: "10%",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              overflow: "hidden",
              boxShadow: "4px 0px 8px rgba(0, 0, 0, 0.2)",
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
              title="Experinces"
              to="/experiences"
              icon={<WorkOutlineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              handleClose={() => setIsModalOpen(false)}
            />
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
                    fontWeight: "bold !important",
                    fontSize: "15px",
                  },
                }}
              />
            </ListItem>
          </Box>
        </Modal>
      </Box>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box
          sx={{ width: isMobile ? 250 : 350, padding: 2 }}
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
    </Box>
  );
};

export default Topbar;