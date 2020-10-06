import React from "react";
import { SingleLead, LeadStatus } from "../view-lead.component";
import ViewEditBasicLeadInfo from "./view-edit-basic-lead-info.component";
import ViewEditLeadEventInfo from "./view-edit-lead-event-info.component";
import ViewEditLeadContactInfo from "./view-edit-lead-contact-info.component";
import ViewEditLeadContactStatus from "./view-edit-lead-contact-status.component";
import ViewEditLeadServicesInfo from "./view-edit-lead-services-info.component";
import ViewEditLeadReferrals from "./view-edit-lead-referrals.component";
import ConvertToClientCard from "./convert-to-client-card.component";

export default function LeadHome(props: LeadHomeProps) {
  const { lead, setLead } = props;

  if (!lead || typeof lead !== "object") {
    return null;
  }

  return (
    <div style={{ marginBottom: "3.2rem" }}>
      {lead.leadStatus !== LeadStatus.convertedToClient && (
        <ConvertToClientCard lead={lead} />
      )}
      <ViewEditBasicLeadInfo lead={lead} leadUpdated={setLead} />
      <ViewEditLeadContactInfo lead={lead} leadUpdated={setLead} />
      <ViewEditLeadContactStatus lead={lead} leadUpdated={setLead} />
      <ViewEditLeadReferrals lead={lead} />
      <ViewEditLeadServicesInfo lead={lead} leadUpdated={setLead} />
      <ViewEditLeadEventInfo lead={lead} leadUpdated={setLead} />
    </div>
  );
}

type LeadHomeProps = {
  path: string;
  lead: SingleLead;
  setLead(newLead: SingleLead): any;
};
