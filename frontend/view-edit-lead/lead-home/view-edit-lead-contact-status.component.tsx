import React from "react";
import dayjs from "dayjs";
import { useCss } from "kremling";
import { SingleLead } from "../view-lead.component";
import LeadSection from "./lead-section.component";

export default function ViewEditLeadContactStatus(
  props: ViewEditLeadContactStatusProps
) {
  const { lead } = props;

  return (
    <LeadSection title="Contact Status">
      <table className="lead-table">
        <tbody>
          <tr>
            <td>Current Status:</td>
            <td>{lead.leadStatus}</td>
          </tr>
          <tr>
            <td>First Attempt:</td>
            <td>
              {lead.contactStage.first === null
                ? "Attempt not yet made"
                : dayjs(lead.contactStage.first).format("YYYY-MM-DD h:mm a")}
            </td>
          </tr>
          <tr>
            <td>Second Attempt:</td>
            <td>
              {lead.contactStage.second === null
                ? "Attempt not yet made"
                : dayjs(lead.contactStage.second).format("YYYY-MM-DD h:mm a")}
            </td>
          </tr>
          <tr>
            <td>Third Attempt:</td>
            <td>
              {lead.contactStage.third === null
                ? "Attempt not yet made"
                : dayjs(lead.contactStage.third).format("YYYY-MM-DD h:mm a")}
            </td>
          </tr>
        </tbody>
      </table>
    </LeadSection>
  );
}

type ViewEditLeadContactStatusProps = {
  lead: SingleLead;
};
