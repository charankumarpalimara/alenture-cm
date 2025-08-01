import React from "react";
import { Route } from "react-router-dom";
import Dashboard from "../scenes/commonFiles/dashboard";
import Cm from "../scenes/commonFiles/cm";
import CmForm from "../scenes/commonFiles/cmform";
import CmDetails from "../scenes/commonFiles/cmdetails";
import Experinces from "../scenes/commonFiles/experiences";
import Calendar from "../scenes/commonFiles/calendar/calendar";
import Notes from "../scenes/commonFiles/notes";
import CrmTicketDetails from "../scenes/crmDashboard/ticketdetails";
import AllExperiences from "../scenes/commonFiles/experiences/allExperiences";
import NewExperiences from "../scenes/commonFiles/experiences/newExperiences";
import PendingExperiences from "../scenes/commonFiles/experiences/pendingExperiences";
import ResolvedExperiences from "../scenes/commonFiles/experiences/resolvedExperiences";
import Organization from "../scenes/commonFiles/organization";
import OrganizationDetails from "../scenes/commonFiles/organizationdetails";
import CmDataByOrganization from "../scenes/commonFiles/organizationdetails/CmDataByOrganization";
import TaskDetails from "../scenes/commonFiles/taskdetails";
import CrmProfile from "../scenes/crmDashboard/profile";

const crmRoutes = [
  <Route key="dashboard" path="/" element={<Dashboard />} />,
  <Route key="cm" path="/cm" element={<Cm />} />,
  <Route key="cmform" path="/cmform" element={<CmForm />} />,
  <Route key="cmdetails" path="/cmdetails/:createdCmId" element={<CmDetails />} />,
  <Route key="experiences" path="/experiences" element={<Experinces />} />,
  <Route key="calendar" path="/calendar" element={<Calendar />} />,
  <Route key="notes" path="/notes" element={<Notes />} />,
  <Route key="ticketdetails" path="/ticketdetails/:experienceid" element={<CrmTicketDetails />} />,
  <Route key="allExperiences" path="/allExperiences" element={<AllExperiences />} />,
  <Route key="newExperiences" path="/newExperiences" element={<NewExperiences />} />,
  <Route key="pendingExperiences" path="/pendingExperiences" element={<PendingExperiences />} />,
  <Route key="resolvedExperiences" path="/resolvedExperiences" element={<ResolvedExperiences />} />,
  <Route key="organization" path="/organization" element={<Organization />} />,
  <Route key="organizationdetails" path="/organizationdetails" element={<OrganizationDetails />} />,
  <Route key="cmDataByOrganization" path="/cmDataByOrganization" element={<CmDataByOrganization />} />,
  <Route key="taskdetails" path="/taskdetails" element={<TaskDetails />} />,
  <Route key="profile" path="/profile" element={<CrmProfile />} />,
];

export default crmRoutes; 