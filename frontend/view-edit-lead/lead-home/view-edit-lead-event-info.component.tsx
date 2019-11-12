import React from "react";
import { SingleLead } from "../view-lead.component";
import LeadSection from "./lead-section.component";

export default function ViewEditLeadEventInfo(
  props: ViewEditLeadEventInfoProps
) {
  const { lead } = props;

  return (
    <LeadSection title="Event information">
      <>
        {lead.eventSources.length === 0 &&
          "Lead has not attended any events to date"}
        {lead.eventSources.length === 1 && (
          <table className="lead-table">
            <tbody>
              <tr>
                <td>Event Name:</td>
                <td>{lead.eventSources[0].eventName}</td>
              </tr>
              <tr>
                <td>Event Location:</td>
                <td>{lead.eventSources[0].eventLocation}</td>
              </tr>
              <tr>
                <td>Event Date:</td>
                <td>{lead.eventSources[0].eventDate}</td>
              </tr>
            </tbody>
          </table>
        )}
        {lead.eventSources.length > 1 &&
          lead.eventSources.map((event, i) => {
            return (
              <table className="lead-table events-table" key={event.eventId}>
                <thead>
                  <tr>
                    <th colSpan={2}>Event #{i + 1}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Event Name:</td>
                    <td>{event.eventName}</td>
                  </tr>
                  <tr>
                    <td>Event Location:</td>
                    <td>{event.eventLocation}</td>
                  </tr>
                  <tr>
                    <td>Event Date:</td>
                    <td>{event.eventDate}</td>
                  </tr>
                </tbody>
                <br />
              </table>
            );
          })}
      </>
    </LeadSection>
  );
}

type ViewEditLeadEventInfoProps = {
  lead: SingleLead;
};
