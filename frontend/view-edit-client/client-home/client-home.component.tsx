import React from "react";
import ViewEditBasicInfo from "./view-edit-basic-info.component";
import ViewEditContactInfo from "./view-edit-contact-info.component";
import ViewEditDemographicsInfo from "./view-edit-demographics-info.component";
import ViewEditIntakeInfo from "./view-edit-intake-info.component";
import { SingleClient, AuditSummary } from "../view-client.component";
import easyFetch from "../../util/easy-fetch";
import { handlePromiseError } from "../../util/error-helpers";

export default function ClientHome(props: ClientHomeProps) {
  const { client, setClient, auditSummary } = props;
  const [clientIntakeSettings, setClientIntakeSettings] = React.useState();

  React.useEffect(() => {
    const ac = new AbortController();

    easyFetch(`/api/client-intake-questions`, {
      signal: ac.signal,
    })
      .then((d) => setClientIntakeSettings(d.sections))
      .catch(handlePromiseError);

    return () => {
      ac.abort();
    };
  }, []);

  if (!client || typeof client !== "object" || !clientIntakeSettings) {
    return null;
  }

  return (
    <div style={{ marginBottom: "3.2rem" }}>
      <ViewEditBasicInfo
        client={client}
        clientUpdated={setClient}
        auditSummary={auditSummary}
        clientIntakeSettings={clientIntakeSettings}
      />
      <ViewEditContactInfo
        client={client}
        clientUpdated={setClient}
        auditSummary={auditSummary}
        clientIntakeSettings={clientIntakeSettings}
      />
      <ViewEditDemographicsInfo
        client={client}
        clientUpdated={setClient}
        auditSummary={auditSummary}
        clientIntakeSettings={clientIntakeSettings}
      />
      <ViewEditIntakeInfo
        client={client}
        clientUpdated={setClient}
        auditSummary={auditSummary}
        clientIntakeSettings={clientIntakeSettings}
      />
    </div>
  );
}

type ClientHomeProps = {
  path: string;
  client: SingleClient;
  setClient(newClient: SingleClient): any;
  auditSummary: AuditSummary;
};
