import React from "react";
import { LastUpdate } from "../view-client.component";
import { format } from "timeago.js";

export default function AuditSummarySection({
  auditSection
}: AuditSummarySectionProps) {
  return (
    <div>
      Last updated by {auditSection.lastUpdate.fullName}{" "}
      {format(auditSection.lastUpdate.timestamp)}
      {typeof auditSection.numWrites === "number" && (
        <>
          {" ("}
          {auditSection.numWrites} total update
          {auditSection.numWrites === 1 ? "" : "s"})
        </>
      )}
    </div>
  );
}

type AuditSummarySectionProps = {
  auditSection: {
    numWrites?: number;
    lastUpdate: LastUpdate;
  };
};
