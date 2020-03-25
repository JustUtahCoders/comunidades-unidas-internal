import React from "react";
import AddEventStep from "./add-event-step.component";
import AddLeadsStep from "./add-leads-step.component";
import ReportIssue from "../report-issue/report-issue.component";
import PageHeader from "../page-header.component";
import { Router } from "@reach/router";

export default function AddLeads(props: AddLeadsProps) {
  if (window.location.pathname === "/add-leads") {
    props["navigate"]("/add-leads/event");
  }

  return (
    <>
      <PageHeader
        title="Add new leads"
        fullScreen={/\/add-leads\/event\/.+/.test(window.location.pathname)}
      />
      <div className="card">
        <Router>
          <AddLeadsStep path="event/:eventId" />
          <AddLeadsStep path="no-event" />
          <AddEventStep path="event" />
        </Router>
      </div>
    </>
  );
}

type AddLeadsProps = {
  path: string;
};
