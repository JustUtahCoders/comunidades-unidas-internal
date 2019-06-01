import React from "react";
import { LastUpdate } from "./view-client.component";
import { format } from "timeago.js";

export default function AuditSummarySection({
  auditSection
}: AuditSummarySectionProps) {
  return (
    <section>
      {typeof auditSection.numWrites === "number" && (
        <div>
          {auditSection.numWrites} update
          {auditSection.numWrites === 1 ? "" : "s"}
        </div>
      )}
      <div>
        Last updated {format(auditSection.lastUpdate.timestamp)} by{" "}
        {auditSection.lastUpdate.fullName}
      </div>
    </section>
  );
}

type AuditSummarySectionProps = {
  auditSection: {
    numWrites?: number;
    lastUpdate: LastUpdate;
  };
};
