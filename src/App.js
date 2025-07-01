import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { CssBaseline, Box, useMediaQuery } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


// Import Poppins font weights
import "@fontsource/poppins/300.css"; // Light
import "@fontsource/poppins/400.css"; // Regular
import "@fontsource/poppins/500.css"; // Medium
import "@fontsource/poppins/600.css"; // Semi-bold
import "@fontsource/poppins/700.css"; // Bold

//config details 
import { getCreaterRole } from "./config";








//cm dashboard unique files
import CmTopbar from "./scenes/cmDashboard/global/Topbar.jsx";
import CmSidebar from "./scenes/cmDashboard/global/Sidebar.jsx";
import CmTicketDetails from "./scenes/cmDashboard/ticketsdetails";
import CmExperienceRegistrationForm from "./scenes/cmDashboard/experienceForm";
import CmProfile from "./scenes/cmDashboard/profile";





//crm dashboard unique files
import CrmTopbar from "./scenes/crmDashboard/global/Topbar.jsx";
import CrmSidebar from "./scenes/crmDashboard/global/Sidebar";
import CrmProfile from "./scenes/crmDashboard/profile";
import CrmTicketDetails from "./scenes/crmDashboard/ticketdetails";





//hob And admin dashboard uniwue files
import AdminSidebar from "./scenes/hobDashboard/global/Sidebar";
import AdminTopbar from "./scenes/hobDashboard/global/Topbar";
import AdminProfile from "./scenes/hobDashboard/profile";
import AdminTicketDetails from "./scenes/hobDashboard/ticketsdetails";
import HobProfile from "./scenes/hobDashboard/profile/hobProfile";



//common files  in four dashboards
import Calendar from "./scenes/commonFiles/calendar/calendar";
import Dashboard from "./scenes/commonFiles/dashboard";
import Experinces from "./scenes/commonFiles/experiences";
import AllExperiences from "./scenes/commonFiles/experiences/allExperiences";
import NewExperiences from "./scenes/commonFiles/experiences/newExperiences";
import PendingExperiences from "./scenes/commonFiles/experiences/pendingExperiences";
import ResolvedExperiences from "./scenes/commonFiles/experiences/resolvedExperiences";
import Notes from "./scenes/commonFiles/notes"
import Login from "./scenes/commonFiles/login";
import PasswordReset from "./scenes/commonFiles/login/passwordReset";
import ForgotPassword from "./scenes/commonFiles/login/forgotPassword";
import Cm from "./scenes/commonFiles/cm"
import CmForm from "./scenes/commonFiles/cmform";
import CmDetails from "./scenes/commonFiles/cmdetails";
import Crm from "./scenes/commonFiles/crm";
import CrmForm from "./scenes/commonFiles/crmform"
import CrmDetails from "./scenes/commonFiles/crmdetails";
import Hob from "./scenes/commonFiles/hob";
import HobForm from "./scenes/commonFiles/hobform";
import HobDetails from "./scenes/commonFiles/hobdetails";
import Organization from "./scenes/commonFiles/organization";
import OrganizationDetails from "./scenes/commonFiles/organizationdetails";
import TaskDetails from "./scenes/commonFiles/taskdetails";
// import CrmTaskDetails from "./scenes/taskdetails";

// import CrmTicketDetails from "./scenes/commonFiles/ticketsdetails";

// import Organization from "./scenes/organization";
// import OrganizationDetails from "./scenes/organizationdetails";



function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const queryClient = new QueryClient();
  // const [drawer, setDrawerOpen] = useState(true);
  const isMobile = useMediaQuery("(max-width: 900px)"); // Detect mobile screen
const [isAuthenticated, setIsAuthenticated] = useState(
  !!(
    sessionStorage.getItem('cmtoken') ||
    sessionStorage.getItem('crmtoken') ||
    sessionStorage.getItem('hobtoken') ||
    sessionStorage.getItem('token')
  )
);


  const handleLogin = () => {
    setIsAuthenticated(true);
    console.log("getCreaterRole:", getCreaterRole);
  };
  const handlelogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('cmtoken'); // Remove the authentication token
    sessionStorage.removeItem('CmDetails'); // Remove user data

    sessionStorage.removeItem('hobtoken'); // Remove the authentication token
    sessionStorage.removeItem('hobDetails'); // Remove user data

    sessionStorage.removeItem('crmtoken'); // Remove the authentication token
    sessionStorage.removeItem('CrmDetails'); // Remove user data

    sessionStorage.removeItem('token'); // Remove the authentication token
    sessionStorage.removeItem('userDetails'); // Remove user data
  }



  const appTheme = createTheme(theme, {
    typography: {
      fontFamily: [
        "Poppins",
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        "Roboto",
        '"Helvetica Neue"',
        "Arial",
        "sans-serif",
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(","),
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
            fontFamily: "Poppins, sans-serif",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            fontFamily: "Poppins, sans-serif",
            fontWeight: 500,
          },
        },
      },
      MuiTypography: {
        defaultProps: {
          fontFamily: "Poppins, sans-serif",
        },
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={appTheme}>
          <CssBaseline />

          {/* Topbar: Full width at the top */}

          {isAuthenticated && getCreaterRole() === "cm" ? (
            <>
              <Box sx={{ width: "100vw", top: 5, zIndex: 1000 }}>

                <CmTopbar setIsSidebar={setIsSidebar} onLogout={handlelogout} />
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

                  <CmSidebar isSidebar={isSidebar} onLogout={handlelogout} />
                </Box>
              )}
            </>
          ) : getCreaterRole() === "crm" ? (
            <>
              <Box sx={{ width: "100vw", top: 5, zIndex: 1000 }}>

                <CrmTopbar setIsSidebar={setIsSidebar} onLogout={handlelogout} />
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
                  <CrmSidebar isSidebar={isSidebar} onLogout={handlelogout} />
                </Box>
              )}
            </>
          ) : getCreaterRole() === "admin" || getCreaterRole() === "hob" ? (
            <>
              <Box sx={{ width: "100vw", top: 5, zIndex: 1000 }}>

                <AdminTopbar setIsSidebar={setIsSidebar} onLogout={handlelogout} />
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
                  <AdminSidebar isSidebar={isSidebar} onLogout={handlelogout} />
                </Box>
              )}
            </>
          ) : null}
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
              <Route path="/reset-password/:email" element={<PasswordReset />} />
              {!isAuthenticated ? (
                <>
                  <Route path="*" element={<Login onLogin={handleLogin} />} />
                  <Route path='/forgot-password' element={<ForgotPassword />} />
                </>
              ) : getCreaterRole() === "cm" ? (
                <>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/experinces" element={<Experinces />} />
                  <Route path="/experienceRegistrationform" element={<CmExperienceRegistrationForm />} />
                  <Route path="/calendar" element={<Calendar />} />
                  <Route path="/notes" element={<Notes />} />
                  <Route path="/profile" element={<CmProfile />} />
                  <Route path="/ticketdetails" element={<CmTicketDetails />} />
                  <Route path="/allExperiences" element={<AllExperiences />} />
                  <Route path="/newExperiences" element={<NewExperiences />} />
                  <Route path="/pendingExperiences" element={<PendingExperiences />} />
                  <Route path="/resolvedExperiences" element={<ResolvedExperiences />} />
                </>
              ) : getCreaterRole() === "crm" ? (
                <>
                  <Route path="/" element={<Dashboard />} />
                  <Route path='/cm' element={<Cm />} />
                  <Route path="/cmform" element={<CmForm />} />
                  <Route path="/cmdetails" element={<CmDetails />} />
                  <Route path="/experiences" element={<Experinces />} />
                  <Route path="/calendar" element={<Calendar />} />
                  <Route path="/notes" element={<Notes />} />
                  <Route path="/ticketdetails" element={<CrmTicketDetails />} />
                  <Route path="/allExperiences" element={<AllExperiences />} />
                  <Route path="/newExperiences" element={<NewExperiences />} />
                  <Route path="/pendingExperiences" element={<PendingExperiences />} />
                  <Route path="/resolvedExperiences" element={<ResolvedExperiences />} />
                  <Route path="/organization" element={<Organization />} />
                  <Route path="/organizationdetails" element={<OrganizationDetails />} />
                  <Route path="/taskdetails" element={<TaskDetails />} />
                  <Route path="/profile" element={<CrmProfile />} />

                </>
              ) : getCreaterRole() === "admin" ? (
                <>
                  <Route path="/" element={<Dashboard />} />
                  <Route path='/cm' element={<Cm />} />
                  <Route path="/cmform" element={<CmForm />} />
                  <Route path="/cmdetails" element={<CmDetails />} />
                  <Route path='/crm' element={<Crm />} />
                    <Route path='/crmform' element={<CrmForm />} />
                  <Route path="/crmdetails" element={<CrmDetails />} />
                  <Route path="/hob" element={<Hob />} />
                  <Route path="/hobform" element={<HobForm />} />
                  <Route path="/hobdetails" element={<HobDetails />} />
                  <Route path="/profile" element={<AdminProfile />} />
                  <Route path="/hobprofile" element={<HobProfile />} />
                  <Route path="/calendar" element={<Calendar />} />
                  <Route path="/notes" element={<Notes />} />
                  <Route path="/ticketdetails" element={<AdminTicketDetails />} />
                  <Route path="/experiences" element={<Experinces />} />
                  <Route path="/allExperiences" element={<AllExperiences />} />
                  <Route path="/newExperiences" element={<NewExperiences />} />
                  <Route path="/pendingExperiences" element={<PendingExperiences />} />
                  <Route path="/resolvedExperiences" element={<ResolvedExperiences />} />
                  <Route path="/organization" element={<Organization />} />
                  <Route path="/organizationdetails" element={<OrganizationDetails />} />
                  <Route path="/taskdetails" element={<TaskDetails />} />

                </>


              ) : getCreaterRole() === "hob" ? (

                <>       

                  <Route path="/" element={<Dashboard />} />
                  <Route path='/cm' element={<Cm />} />
                  <Route path="/cmform" element={<CmForm />} />
                  <Route path="/cmdetails" element={<CmDetails />} />
                  <Route path='/crm' element={<Crm />} />
                  <Route path='/crmform' element={<CrmForm />} />
                  <Route path="/crmdetails" element={<CrmDetails />} />
                  <Route path="/hob" element={<Hob />} />
                  <Route path="/hobform" element={<HobForm />} />
                  <Route path="/hobdetails" element={<HobDetails />} />
                  {/* <Route path="/profile" element={<AdminProfile />} /> */}
                  <Route path="/profile" element={<HobProfile />} />
                  <Route path="/calendar" element={<Calendar />} />
                  <Route path="/notes" element={<Notes />} />
                  <Route path="/ticketdetails" element={<AdminTicketDetails />} />
                  <Route path="/experiences" element={<Experinces />} />
                  <Route path="/allExperiences" element={<AllExperiences />} />
                  <Route path="/newExperiences" element={<NewExperiences />} />
                  <Route path="/pendingExperiences" element={<PendingExperiences />} />
                  <Route path="/resolvedExperiences" element={<ResolvedExperiences />} />
                  <Route path="/organization" element={<Organization />} />
                  <Route path="/organizationdetails" element={<OrganizationDetails />} />
                  <Route path="/taskdetails" element={<TaskDetails />} />

                </>
              ) : null}
            </Routes>
          </Box>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </QueryClientProvider>
  );
}

export default App;
