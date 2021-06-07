import React from "react";
import { SingleEvent } from "../view-event.component";
import EventSection from "./event-section.component";
import BasicTableReport from "../../reports/shared/basic-table-report.component";

export default function ViewEventStats(props: ViewEventStatsProps) {
  const { event } = props;

  return (
    <EventSection title="Statistics">
      <BasicTableReport
        headerRows={
          <tr>
            <th></th>
            <th>Men</th>
            <th>Women</th>
            <th>All Genders</th>
            <th>Conversion</th>
          </tr>
        }
        contentRows={
          <>
            <tr>
              <td>Leads</td>
              <td>{event.leadGenders.male || 0}</td>
              <td>{event.leadGenders.female || 0}</td>
              <td>{event.totalLeads || 0}</td>
              <td>{toPercentage(event.totalLeads, event.totalAttendance)}</td>
            </tr>
            <tr>
              <td>Clients</td>
              <td>{event.clientGenders.male || 0}</td>
              <td>{event.clientGenders.female || 0}</td>
              <td>{event.totalConvertedToClients || 0}</td>
              <td>
                {toPercentage(
                  event.totalConvertedToClients,
                  event.totalAttendance
                )}
              </td>
            </tr>
          </>
        }
        footerRows={
          <tr>
            <td>All Event Attendees</td>
            <td>{event.attendanceMale}</td>
            <td>{event.attendanceFemale}</td>
            <td>{event.totalAttendance || 0}</td>
            <td>100%</td>
          </tr>
        }
      />
    </EventSection>
  );
}

function toPercentage(nominator, denominator) {
  const percentage = Math.round((10000 * nominator) / denominator || 0) / 100;
  return percentage + "%";
}

type ViewEventStatsProps = {
  event: SingleEvent;
};
