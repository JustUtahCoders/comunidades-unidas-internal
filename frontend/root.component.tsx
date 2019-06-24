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
import RecordVisit from "./record-client-visit/record-client-visit.component";
import MakeSuggestionSuccess from "./record-client-visit/make-suggestion-success.component";

export default function Root() {
  return (
    <UserContext>
      <Styleguide>
        <Router basepath="/">
          <Navbars path="/">
            <Home path="/" exact />
            <AddClient path="/add-client" />
            <ClientList path="client-list" />
            <ViewClient path="/clients/:clientId" />
            <RecordVisit path="/record-client-visit" exact />
            <MakeSuggestionSuccess path="/make-suggestion/:issueId" />
            <ReportIssue path="/report-issue" exact />
            <ReportIssueSuccess path="/report-issue/:issueId" />
          </Navbars>
        </Router>
        <Growls />
      </Styleguide>
    </UserContext>
  );
}
