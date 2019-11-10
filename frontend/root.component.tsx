import React from "react";
import { Router } from "@reach/router";
import AddClient from "./add-client/add-client.component";
import Navbars from "./navbar/navbars.component";
import Styleguide from "./styleguide.component";
import Home from "./home/home.component";
import ReportIssue from "./report-issue/report-issue.component";
import ReportIssueSuccess from "./report-issue/report-issue-success.component";
import UserContext from "./util/user.context";
import ViewClient from "./view-edit-client/view-client.component";
import ClientList from "./client-list/client-list.component";
import Growls from "./growls/growls.component";
import AddCaseNote from "./view-edit-client/case-notes/add-case-note.component";
import AddClientInteraction from "./view-edit-client/interactions/add-client-interaction.component";
import AddLeads from "./add-leads/add-leads.component";
import LeadList from "./leads-list/lead-list.component";
import ViewLead from "./view-edit-lead/view-lead.component";

export default function Root() {
  return (
    <UserContext>
      <Styleguide>
        <Router basepath="/" primary>
          <Navbars path="/">
            <Home path="/" />
            <AddClient path="add-client" />
            <ClientList path="client-list" />
            <AddClientInteraction isGlobalAdd path="add-client-interaction" />
            <ViewClient path="clients/:clientId/*" />
            <AddCaseNote isGlobalAdd path="add-case-note" />
            <LeadList path="lead-list" />
            <ViewLead path="leads/:leadId" />
            <ReportIssue path="report-issue" />
            <ReportIssueSuccess path="report-issue/:issueId" />
            <AddLeads path="add-leads/*" />
          </Navbars>
        </Router>
        <Growls />
      </Styleguide>
    </UserContext>
  );
}
