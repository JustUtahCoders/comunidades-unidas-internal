import React from "react";
import { SingleEvent } from "../view-event.component";
import EventSection from "./event-section.component";
import BasicTableReport from "../../reports/shared/basic-table-report.component";
import { Link } from "@reach/router";

export default function ViewEventStats(props: ViewEventStatsProps) {
  const { leads } = props.event;

  return (
    <EventSection title="Leads">
      <BasicTableReport
        headerRows={
          <tr>
            <th>ID</th>
            <th>Name</th>
          </tr>
        }
        contentRows={
          <>
            {leads.map((lead) => (
              <tr>
                <td>
                  <Link to={`/leads/${lead.leadId}`}>{lead.leadId}</Link>
                </td>
                <td>{lead.fullName}</td>
              </tr>
            ))}
          </>
        }
      />
    </EventSection>
  );
}

type ViewEventStatsProps = {
  event: SingleEvent;
};
