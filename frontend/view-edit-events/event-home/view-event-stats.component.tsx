import React from "react";
import { useCss } from "kremling";
import { SingleEvent } from "../view-event.component";
import EventSection from "./event-section.component";

export default function ViewEventStats(props: ViewEventStatsProps) {
  const { event } = props;
  const scope = useCss(css);

  return (
    <EventSection title="Statistics">
      <table {...scope}>
        <tbody>
          <tr>
            <td># of Clients</td>
            <td>{event.totalConvertedToClients}</td>
          </tr>
          <tr>
            <td># of Leads:</td>
            <td>
              {event.totalConvertedToClients / event.totalAttendance || 0}
            </td>
          </tr>
          <tr>
            <td>Total Attendance:</td>
            <td>{event.totalLeads / event.totalAttendance || 0}</td>
          </tr>
        </tbody>
      </table>
    </EventSection>
  );
}

const css = `
& td {
  padding: 1.6rem;
}
`;

type ViewEventStatsProps = {
  event: SingleEvent;
};
