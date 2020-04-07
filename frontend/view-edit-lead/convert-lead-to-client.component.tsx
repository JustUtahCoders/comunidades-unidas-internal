import React from "react";
import AddClient, { ClientState } from "../add-client/add-client.component";
import easyFetch from "../util/easy-fetch";
import { SingleLead } from "./view-lead.component";

export default function ConvertLeadToClient(props: Props) {
  const [lead, setLead] = React.useState<SingleLead>(null);

  React.useEffect(() => {
    if (props.leadId) {
      const abortController = new AbortController();

      easyFetch(`/api/leads/${props.leadId}`, {
        signal: abortController.signal
      })
        .then(data => setLead(data.lead))
        .catch(err => {
          setTimeout(() => {
            throw err;
          });
        });

      return () => {
        abortController.abort();
      };
    }
  }, [props.leadId]);

  return (
    lead && (
      <AddClient
        path={props.path}
        initialClientState={leadToClientState(lead)}
      />
    )
  );
}

export function leadToClientState(lead: SingleLead): ClientState {
  return {
    firstName: lead.firstName,
    lastName: lead.lastName,
    gender: lead.gender,
    phone: lead.phone,
    smsConsent: lead.smsConsent,
    zip: lead.zip,
    intakeServices: lead.leadServices
  };
}

type Props = {
  leadId?: string;
  path?: string;
};
