import React from "react";
import { Route } from "react-router-dom";
import Dashboard from "../scenes/commonFiles/dashboard";
import Experinces from "../scenes/commonFiles/experiences";
import CmExperienceRegistrationForm from "../scenes/cmDashboard/experienceForm";
import Calendar from "../scenes/commonFiles/calendar/calendar";
import Notes from "../scenes/commonFiles/notes";
import CmProfile from "../scenes/cmDashboard/profile";
import CmTicketDetails from "../scenes/cmDashboard/ticketsdetails";
import AllExperiences from "../scenes/commonFiles/experiences/allExperiences";
import NewExperiences from "../scenes/commonFiles/experiences/newExperiences";
import PendingExperiences from "../scenes/commonFiles/experiences/pendingExperiences";
import ResolvedExperiences from "../scenes/commonFiles/experiences/resolvedExperiences";

const cmRoutes = [
  <Route key="dashboard" path="/" element={<Dashboard />} />,
  <Route key="experiences" path="/experiences" element={<Experinces />} />,
  <Route key="experienceRegistrationform" path="/experienceRegistrationform" element={<CmExperienceRegistrationForm />} />,
  <Route key="calendar" path="/calendar" element={<Calendar />} />,
  <Route key="notes" path="/notes" element={<Notes />} />,
  <Route key="profile" path="/profile" element={<CmProfile />} />,
  <Route key="ticketdetails" path="/ticketdetails/:experienceid" element={<CmTicketDetails />} />,
  <Route key="allExperiences" path="/allExperiences" element={<AllExperiences />} />,
  <Route key="newExperiences" path="/newExperiences" element={<NewExperiences />} />,
  <Route key="pendingExperiences" path="/pendingExperiences" element={<PendingExperiences />} />,
  <Route key="resolvedExperiences" path="/resolvedExperiences" element={<ResolvedExperiences />} />,
];

export default cmRoutes; 