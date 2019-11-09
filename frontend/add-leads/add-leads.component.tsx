import React from "react";
import AddEventStep from "./add-event-step.component";
import AddLeadsStep from "./add-leads-step.component";
import ReportIssue from "../report-issue/report-issue.component";
import PageHeader from "../page-header.component";
import { Router } from "@reach/router";

export default function AddLeads(props: AddLeadsProps) {
  const featureEnabled = localStorage.getItem("leads");

  if (window.location.pathname === "/add-leads") {
    props["navigate"]("/add-leads/event");
  }

  return (
    <>
      <PageHeader title="Add new leads" />
      {featureEnabled ? (
        <div className="card">
          <Router>
            <AddLeadsStep path="event/:eventId" />
            <AddEventStep path="event" />
          </Router>
        </div>
      ) : (
        <ReportIssue missingFeature hideHeader />
      )}
    </>
  );
}

type AddLeadsProps = {
  path: string;
};
