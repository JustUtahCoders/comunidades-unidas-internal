import React from "react";
import { SingleLead } from "../view-lead.component";
import ViewEditBasicLeadInfo from "./view-edit-basic-lead-info.component";
import ViewEditLeadEventInfo from "./view-edit-lead-event-info.component";
import ViewEditLeadContactInfo from "./view-edit-lead-contact-info.component";
import ViewEditLeadContactStatus from "./view-edit-lead-contact-status.component";
import ViewEditLeadServicesInfo from "./view-edit-lead-services-info.component";

export default function LeadHome(props: LeadHomeProps) {
  const { lead, setLead } = props;

  if (!lead || typeof lead !== "object") {
    return null;
  }

  return (
    <div style={{ marginBottom: "3.2rem" }}>
      <ViewEditBasicLeadInfo lead={lead} leadUpdated={setLead} />
      <ViewEditLeadContactInfo lead={lead} leadUpdated={setLead} />
      <ViewEditLeadContactStatus lead={lead} />
      <ViewEditLeadServicesInfo lead={lead} leadUpdated={setLead} />
      <ViewEditLeadEventInfo lead={lead} />
    </div>
  );
}

type LeadHomeProps = {
  path: string;
  lead: SingleLead;
  setLead(newLead: SingleLead): any;
};
