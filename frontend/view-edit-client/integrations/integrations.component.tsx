import React from "react";
import { SingleClient, AuditSummary } from "../view-client.component";

export default function Integrations(props: IntegrationsProps) {
  return <div>Integrations</div>;
}

type IntegrationsProps = {
  path: string;
  clientId: string;
  client: SingleClient;
  setClient: (client: SingleClient) => any;
  auditSummary: AuditSummary;
  refetchClient: () => any;
};
