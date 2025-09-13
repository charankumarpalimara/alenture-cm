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
import B2bScreen from "../scenes/commonFiles/b2bscreen";
import B2bDetails from "../scenes/commonFiles/b2bscreen/b2bdetails";
import Contract from "../scenes/commonFiles/contract";
import Viewallcontracts from "../scenes/commonFiles/contract/viewallcontracts";
import ContractAnalysis from "../scenes/commonFiles/contract/analysis";
import Knowledge from "../scenes/commonFiles/knowledge";
import Account from "../scenes/commonFiles/account";
import CustomerInsights from "../scenes/commonFiles/customer-insights";
import ChurnPrediction from "../scenes/commonFiles/churnprediction";
import AllIdeas from "../scenes/commonFiles/allideas";
import RevenueLeak from "../scenes/commonFiles/revenueleak";
import MeetingCoach from "../scenes/commonFiles/meeting-couch";

const crmRoutes = [
  <Route key="knowledge" path="/knowledge" element={<Knowledge />} />,
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
  <Route key="b2bscreen" path="/b2bscreen" element={<B2bScreen />} />,
  <Route key="b2bdetails" path="/b2bdetails" element={<B2bDetails />} />,
  <Route key="contract" path="/contract" element={<Contract />} />,
  <Route key="viewallcontracts" path="/viewallcontracts" element={<Viewallcontracts />} />,
  <Route key="contractanalysis" path="/contract/analysis" element={<ContractAnalysis />} />,
  <Route key="account" path="/account" element={<Account />} />,
  <Route key="customer-insights" path="/customer-insights" element={<CustomerInsights />} />,
  <Route key="churn-prediction" path="/churn-prediction" element={<ChurnPrediction />} />,
  <Route key="allideas" path="/allideas" element={<AllIdeas />} />,
  <Route key="revenue-leak" path="/revenue-leak" element={<RevenueLeak />} />,
  <Route key="meeting-coach" path="/meeting-coach" element={<MeetingCoach />} />,

];

export default crmRoutes; 