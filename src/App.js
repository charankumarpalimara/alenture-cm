import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { CssBaseline, Box, useMediaQuery } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { ThemeProvider, createTheme } from '@mui/material/styles';


// Import Poppins font weights
import '@fontsource/poppins/300.css'; // Light
import '@fontsource/poppins/400.css'; // Regular
import '@fontsource/poppins/500.css'; // Medium
import '@fontsource/poppins/600.css'; // Semi-bold
import '@fontsource/poppins/700.css'; // Bold


import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Cm from "./scenes/cm";
// import Hob from "./scenes/hob";
import Crm from "./scenes/crm";
import Bar from "./scenes/bar";
import Form from "./scenes/form";
import CmForm from "./scenes/cmform";
// import CrmForm from "./scenes/crmform";
// import BsuForm from "./scenes/bsuform";
// import Line from "./scenes/line";
// import Pie from "./scenes/pie";
// import FAQ from "./scenes/faq";
import Geography from "./scenes/geography";
import Calendar from "./scenes/calendar/calendar";
import Profile from "./scenes/profile";
import AllExperiences from "./scenes/experiences/allExperiences";
import NewExperiences from "./scenes/experiences/newExperiences";
import PendingExperiences from "./scenes/experiences/pendingExperiences";
import ResolvedExperiences from "./scenes/experiences/resolvedExperiences";
import Notes from "./scenes/notes"
import TicketDetails from "./scenes/ticketsdetails";
// import TaskDetails from "./scenes/taskdetails";
import Login from "./scenes/login";
// import TicketDetails from "./scenes/ticketsdetails";
// import Organization from "./scenes/organization";
// import OrganizationDetails from "./scenes/organizationdetails";
// import Tasks from "./scenes/tasks";
// import TaskForm from "./scenes/taskform";
// import TaskDetails from "./scenes/taskdetails";
import PasswordReset from "./scenes/login/passwordReset";


function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  // const [drawer, setDrawerOpen] = useState(true);
  const isMobile = useMediaQuery("(max-width: 900px)"); // Detect mobile screen
    const [isAuthenticated, setIsAuthenticated] = useState(!!sessionStorage.getItem('cmtoken'));
  
    const handleLogin = () => {
      setIsAuthenticated(true);
    };
    const handlelogout = () => {
      setIsAuthenticated(false);
      sessionStorage.removeItem('cmtoken'); // Remove the authentication token
      sessionStorage.removeItem('CmDetails'); // Remove user data
    }


  const appTheme = createTheme(theme, {
    typography: {
      fontFamily: [
        'Poppins',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
      h1: { fontWeight: 700 },
      h2: { fontWeight: 700 },
      h3: { fontWeight: 600 },
      h4: { fontWeight: 600 },
      h5: { fontWeight: 500 },
      h6: { fontWeight: 500 },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            fontFamily: 'Poppins, sans-serif',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 500,
          },
        },
      },
      MuiTypography: {
        defaultProps: {
          fontFamily: 'Poppins, sans-serif',
        },
      },
    },
  });

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={appTheme}>
        <CssBaseline />

        {/* Topbar: Full width at the top */}
    {isAuthenticated && (
          <>
            <Box sx={{ width: "100vw", top: 5, zIndex: 1000 }}>
              <Topbar setIsSidebar={setIsSidebar} onLogout={handlelogout} />
            </Box>

            {!isMobile && isSidebar && (
              <Box
                sx={{
                  position: "fixed",
                  left: 0,
                  top: "64px",
                  height: "calc(100vh - 64px)",
                  width: "260px",
                  zIndex: 900,
                }}
              >
                <Sidebar isSidebar={isSidebar} onLogout={handlelogout}  />
              </Box>
            )}
          </>
        )}
        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
          marginLeft: isMobile ? "0px" : isSidebar && isAuthenticated ? "260px" : "0px",
            marginTop: isAuthenticated ? "0px" : "60px",
            padding: "20px 20px 20px",
            overflowY: "auto",
            transition: "margin 0.3s ease-in-out",
            "&::-webkit-scrollbar": {
              width: "1px",
              height: "5px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#000000",
              borderRadius: "4px",
            },
            fontFamily: 'Poppins, sans-serif !important',
          }}
        >
          <Routes>
        <Route path="/reset-password/:cmid" element={<PasswordReset />} />
       {!isAuthenticated ? (
        <>
              <Route path="*" element={<Login onLogin={handleLogin} />} />
       </>       
       ) : (
          <>
            <Route path="/" element={<Dashboard />} />
            <Route path="/cm" element={<Cm />} />
            <Route path="/crm" element={<Crm />} />
            {/* <Route path="/tasks" element={<Tasks />} /> */}
            {/* <Route path="/hob" element={<Hob />} /> */}
            <Route path="/form" element={<Form />} />
            <Route path="/cmform" element={<CmForm />} />
            {/* <Route path="/taskform" element={<TaskForm />} /> */}
            {/* <Route path="/crmform" element={<CrmForm />} /> */}
            {/* <Route path="/bsuform" element={<BsuForm />} /> */}
            <Route path="/bar" element={<Bar />} />
            {/* <Route path="/pie" element={<Pie />} /> */}
            {/* <Route path="/line" element={<Line />} /> */}
            {/* <Route path="/faq" element={<FAQ />} /> */}
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/geography" element={<Geography />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/ticketdetails" element={<TicketDetails />} />
            {/* <Route path="/taskdetails" element={<TaskDetails />} /> */}
            {/* <Route path="/organization" element={<Organization />} /> */}
            {/* <Route path="/organizationdetails" element={<OrganizationDetails />} /> */}
            {/* <Route path="/cmdetails" element={<CmDetails />} /> */}
            
            {/* Experience Routes */}
            <Route path="/allExperiences" element={<AllExperiences />} />
            <Route path="/newExperiences" element={<NewExperiences />} />
            <Route path="/pendingExperiences" element={<PendingExperiences />} />
            <Route path="/resolvedExperiences" element={<ResolvedExperiences />} />
            </>
              )}
          </Routes>
        </Box>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
