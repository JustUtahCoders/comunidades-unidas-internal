import React from "react";
import { SingleLead } from "../view-lead.component";
import LeadSection from "./lead-section.component";

export default function ViewEditBasicLeadInfo(
  props: ViewEditBasicLeadInfoProps
) {
  const { lead } = props;

  return (
    <LeadSection title="Basic information">
      <table className="lead-table">
        <tbody>
          <tr>
            <td>Name:</td>
            <td>{lead.fullName}</td>
          </tr>
          <tr>
            <td>Age:</td>
            <td>{lead.age}</td>
          </tr>
          <tr>
            <td>Gender:</td>
            <td>{lead.gender}</td>
          </tr>
        </tbody>
      </table>
    </LeadSection>
  );
}

type ViewEditBasicLeadInfoProps = {
  lead: SingleLead;
};
