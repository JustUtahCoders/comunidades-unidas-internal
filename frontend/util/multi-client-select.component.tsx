import { maybe } from "kremling";
import React from "react";
import SingleClientSearchInput from "../client-search/single-client/single-client-search-input.component";
import CUProgramInputs from "../programs-and-services/cu-program-inputs.component";
import { SingleClient } from "../view-edit-client/view-client.component";

export default function MultiClientSelect(props: MultiClientSelectProps) {
  const [clients, setClients] = React.useState(props.initialClients);
  const [showEmptyRow, setShowEmptyRow] = React.useState(
    props.initialClients.length === 0
  );

  return (
    <div
      className={maybe(
        props.containerClass || "",
        Boolean(props.containerClass)
      )}
    >
      {clients.map((client, idx) => (
        <div
          className={maybe(props.clientClass || "", Boolean(props.clientClass))}
          key={idx}
        >
          <SingleClientSearchInput
            clientChanged={(...args) => {
              console.log("client changed", ...args);
            }}
            initialClient={client}
            required
            ref={SingleClientSearchInput[0]}
          />
        </div>
      ))}
      <button
        onClick={(e) => {
          setClients([...clients, props.initialClients[0]]);
        }}
      >
        Add client
      </button>
    </div>
  );
}

type MultiClientSelectProps = {
  initialClients: SingleClient[];
  containerClass?: string;
  clientClass?: string;
};
