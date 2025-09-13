import React from "react";
import { Route } from "react-router-dom";
import Dashboard from "../scenes/commonFiles/dashboard";
import Cm from "../scenes/commonFiles/cm";
import CmForm from "../scenes/commonFiles/cmform";
import CmDetails from "../scenes/commonFiles/cmdetails";
import Crm from "../scenes/commonFiles/crm";
import CrmForm from "../scenes/commonFiles/crmform";
import CrmDetails from "../scenes/commonFiles/crmdetails";
import Hob from "../scenes/commonFiles/hob";
import HobForm from "../scenes/commonFiles/hobform";
import HobDetails from "../scenes/commonFiles/hobdetails";
import HobProfile from "../scenes/hobDashboard/profile/hobProfile";
import Calendar from "../scenes/commonFiles/calendar/calendar";
import Notes from "../scenes/commonFiles/notes";
import AdminTicketDetails from "../scenes/hobDashboard/ticketsdetails";
import Experinces from "../scenes/commonFiles/experiences";
import AllExperiences from "../scenes/commonFiles/experiences/allExperiences";
import NewExperiences from "../scenes/commonFiles/experiences/newExperiences";
import PendingExperiences from "../scenes/commonFiles/experiences/pendingExperiences";
import ResolvedExperiences from "../scenes/commonFiles/experiences/resolvedExperiences";
import Organization from "../scenes/commonFiles/organization";
import OrganizationForm from "../scenes/commonFiles/organizationform/index.jsx";
import OrganizationDetails from "../scenes/commonFiles/organizationdetails";
import Organizationadd from "../scenes/commonFiles/organizationdetails/organizationadd";
import OrganizationUnitadd from "../scenes/commonFiles/organizationform/organizationUnitadd.jsx";
import CmDataByOrganization from "../scenes/commonFiles/organizationdetails/CmDataByOrganization";
import TaskDetails from "../scenes/commonFiles/taskdetails";
import Account from "../scenes/commonFiles/account";
import CustomerInsights from "../scenes/commonFiles/customer-insights";
import ChurnPrediction from "../scenes/commonFiles/churnprediction";
import AllIdeas from "../scenes/commonFiles/allideas";
import RevenueLeak from "../scenes/commonFiles/revenueleak";
import MeetingCoach from "../scenes/commonFiles/meeting-couch/index.jsx";
import BusinessGrowthAnalytics from "../scenes/commonFiles/business-growth-analytics";

const hobRoutes = [
  <Route key="dashboard" path="/" element={<Dashboard />} />,
  <Route key="cm" path="/cm" element={<Cm />} />,
  <Route key="cmform" path="/cmform" element={<CmForm />} />,
  <Route key="cmdetails" path="/cmdetails/:createdCmId" element={<CmDetails />} />,
  <Route key="crm" path="/crm" element={<Crm />} />,
  <Route key="crmform" path="/crmform" element={<CrmForm />} />,
  <Route key="crmdetails" path="/crmdetails/:createdCrmId" element={<CrmDetails />} />,
  <Route key="hob" path="/hob" element={<Hob />} />,
  <Route key="hobform" path="/hobform" element={<HobForm />} />,
  <Route key="hobdetails" path="/hobdetails/:createdHobId" element={<HobDetails />} />,
  <Route key="profile" path="/profile" element={<HobProfile />} />,
  <Route key="calendar" path="/calendar" element={<Calendar />} />,
  <Route key="notes" path="/notes" element={<Notes />} />,
  <Route key="ticketdetails" path="/ticketdetails" element={<AdminTicketDetails />} />,
  <Route key="experiences" path="/experiences" element={<Experinces />} />,
  <Route key="allExperiences" path="/allExperiences" element={<AllExperiences />} />,
  <Route key="newExperiences" path="/newExperiences" element={<NewExperiences />} />,
  <Route key="pendingExperiences" path="/pendingExperiences" element={<PendingExperiences />} />,
  <Route key="resolvedExperiences" path="/resolvedExperiences" element={<ResolvedExperiences />} />,
  <Route key="organization" path="/organization" element={<Organization />} />,
  <Route key="organizationform" path="/organizationform" element={<OrganizationForm />} />,
  <Route key="organizationdetails" path="/organizationdetails" element={<OrganizationDetails />} />,
  <Route key="organizationadd" path="/organizationadd" element={<Organizationadd />} />,
  <Route key="organizationunitadd" path="/organizationunitadd" element={<OrganizationUnitadd />} />,
  <Route key="cmDataByOrganization" path="/cmDataByOrganization" element={<CmDataByOrganization />} />,
  <Route key="taskdetails" path="/taskdetails" element={<TaskDetails />} />,
  <Route key="account" path="/account" element={<Account />} />,
  <Route key="customer-insights" path="/customer-insights" element={<CustomerInsights />} />,
  <Route key="churn-prediction" path="/churn-prediction" element={<ChurnPrediction />} />,
  <Route key="allideas" path="/allideas" element={<AllIdeas />} />,
  <Route key="revenue-leak" path="/revenue-leak" element={<RevenueLeak />} />,
  <Route key="meeting-coach" path="/meeting-coach" element={<MeetingCoach />} />,
  <Route key="business-growth-analytics" path="/business-growth-analytics" element={<BusinessGrowthAnalytics />} />,
];

export default hobRoutes; 