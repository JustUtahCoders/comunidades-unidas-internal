import React from "react";
import { SingleLead } from "../view-lead.component";
import LeadSection from "./lead-section.component";

export default function ViewEditLeadServicesInfo(
  props: ViewEditLeadServicesInfoProps
) {
  const { lead } = props;

  return (
    <LeadSection title="Services of Interest">
      <table className="lead-service-table">
        <thead>
          <tr>
            <th>Name of Service</th>
            <th>Program</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {lead.leadServices.map(service => {
            return (
              <tr>
                <td align="left">{service.serviceName}</td>
                <td align="center">{service.programName}</td>
                <td align="center">pending</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </LeadSection>
  );
}

type ViewEditLeadServicesInfoProps = {
  lead: SingleLead;
};
