import React from "react";
import ViewEditBasicInfo from "./view-edit-basic-info.component";
import ViewEditContactInfo from "./view-edit-contact-info.component";
import ViewEditDemographicsInfo from "./view-edit-demographics-info.component";
import ViewEditIntakeInfo from "./view-edit-intake-info.component";
import { SingleClient, AuditSummary } from "../view-client.component";

export default function ClientHome(props: ClientHomeProps) {
  const { client, setClient, auditSummary } = props;

  if (!client || typeof client !== "object") {
    return null;
  }

  return (
    <div style={{ marginBottom: "3.2rem" }}>
      <ViewEditBasicInfo
        client={client}
        clientUpdated={setClient}
        auditSummary={auditSummary}
      />
      <ViewEditContactInfo
        client={client}
        clientUpdated={setClient}
        auditSummary={auditSummary}
      />
      <ViewEditDemographicsInfo
        client={client}
        clientUpdated={setClient}
        auditSummary={auditSummary}
      />
      <ViewEditIntakeInfo
        client={client}
        clientUpdated={setClient}
        auditSummary={auditSummary}
      />
    </div>
  );
}

type ClientHomeProps = {
  path: string;
  exact: boolean;
  client: SingleClient;
  setClient(newClient: SingleClient): any;
  auditSummary: AuditSummary;
};
