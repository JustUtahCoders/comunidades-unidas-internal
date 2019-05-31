import React, { useState } from "react";
import { ClientSources } from "../add-client.component";

export default React.forwardRef<ClientSourceRef, ClientSourceInputsProps>(
  function ClientSourceInputs(props: ClientSourceInputsProps, ref) {
    const getInitialClientSource = () => {
      if (
        props.client.clientSource &&
        !ClientSources[props.client.clientSource]
      ) {
        return "other";
      } else if (ClientSources[props.client.clientSource]) {
        return ClientSources[props.client.clientSource];
      } else {
        return "friend";
      }
    };

    const [clientSource, setClientSource] = useState(getInitialClientSource());
    const [otherSource, setOtherSource] = useState(
      ClientSources[props.client.clientSource] ? "" : props.client.clientSource
    );
    const [couldVolunteer, setCouldVolunteer] = useState(
      props.client.couldVolunteer || false
    );

    React.useEffect(() => {
      if (ref) {
        // @ts-ignore
        ref.current = {
          clientSource: clientSource === "other" ? otherSource : clientSource,
          couldVolunteer
        };
      }
    });

    return (
      <>
        <div>
          <label>
            <span>How did they hear about Comunidades Unidas</span>
            <select
              value={clientSource}
              onChange={evt => setClientSource(evt.target.value)}
              autoFocus
              required
            >
              {Object.keys(clientSources).map(clientSource => (
                <option key={clientSource} value={clientSource}>
                  {clientSources[clientSource]}
                </option>
              ))}
              <option value="other">Other</option>
            </select>
          </label>
        </div>
        {clientSource === "other" && (
          <div>
            <label>
              <span>Other source</span>
              <input
                type="text"
                value={otherSource}
                onChange={evt => setOtherSource(evt.target.value)}
                required
              />
            </label>
          </div>
        )}
        <div>
          <label>
            <span>Would they like to volunteer for Comunidades Unidas?</span>
            <input
              type="checkbox"
              name="couldVolunteer"
              checked={couldVolunteer}
              onChange={evt => setCouldVolunteer(Boolean(evt.target.checked))}
            />
          </label>
        </div>
      </>
    );
  }
);

export const clientSources = {
  facebook: "Facebook",
  instagram: "Instagram",
  website: "Website",
  promotionalMaterial: "Promotional Material",
  consulate: "Consulate",
  friend: "Friend",
  previousClient: "C.U. client",
  employee: "C.U. employee",
  sms: "Text message",
  radio: "Radio",
  tv: "tv"
};

type ClientSourceInputsProps = {
  client: ClientSourceInputClient;
};

type ClientSourceInputClient = {
  clientSource?: string;
  couldVolunteer?: boolean;
};

type ClientSourceRef = {
  clientSource: string;
  couldVolunteer: boolean;
};
