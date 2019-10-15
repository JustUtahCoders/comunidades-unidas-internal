import React from "react";
import { useFullWidth } from "../navbar/use-full-width.hook";
import PageHeader from "../page-header.component";
import ReportIssue from "../report-issue/report-issue.component";

export default function LeadList() {
  useFullWidth();

  return (
    <>
      <PageHeader title="Lead list" />
      <ReportIssue missingFeature hideHeader />
    </>
  );
}
