import React from "react";
import { SingleLead } from "../view-lead.component";
import { formatPhone } from "../../util/formatters";
import LeadSection from "./lead-section.component";

export default function ViewEditLeadContactInfo(
  props: ViewEditLeadContactInfoProps
) {
  const { lead } = props;

  return (
    <LeadSection title="Contact Info">
      <table className="lead-table">
        <tbody>
          <tr>
            <td>Phone:</td>
            <td>{formatPhone(lead.phone)}</td>
          </tr>
          <tr>
            <td>SMS Consent:</td>
            <td>{lead.smsConsent === true ? "yes" : "no"}</td>
          </tr>
          <tr>
            <td>Zip:</td>
            <td>{lead.zip}</td>
          </tr>
        </tbody>
      </table>
    </LeadSection>
  );
}

type ViewEditLeadContactInfoProps = {
  lead: SingleLead;
};
