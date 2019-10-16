import React from "react";
import { useFullWidth } from "../navbar/use-full-width.hook";
import PageHeader from "../page-header.component";
import ReportIssue from "../report-issue/report-issue.component";
import LeadsTable from "./table/leads-table.component";

export default function LeadList() {
  if (localStorage.getItem("leads") !== null) {
    useFullWidth();
  }

  return (
    <>
      <PageHeader title="Lead list" fullScreen />
      {localStorage.getItem("leads") ? (
        <LeadsTable leads={[]} />
      ) : (
        <ReportIssue missingFeature hideHeader />
      )}
    </>
  );
}
