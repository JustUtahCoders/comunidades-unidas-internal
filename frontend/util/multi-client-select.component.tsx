import { maybe } from "kremling";
import React from "react";
import SingleClientSearchInput from "../client-search/single-client/single-client-search-input.component";
import CUProgramInputs from "../programs-and-services/cu-program-inputs.component";
import { SingleClient } from "../view-edit-client/view-client.component";
import CloseIconButton from "./close-icon-button.component";

const MultiClientSelect = React.forwardRef<
  MultiClientSelectRef,
  MultiClientSelectProps
>((props, ref) => {
  const [clients, setClients] = React.useState(props.initialClients);
  React.useImperativeHandle(ref, () => ({
    getClients() {
      return clients;
    },
  }));

  const removeClientSelect = (clientId) => {
    let newArr = [...clients];
    newArr.pop();
    setClients(newArr);
  };

  return (
    <div>
      {clients.map((client, idx) => (
        <div key={idx} style={{ display: "flex" }}>
          <SingleClientSearchInput
            clientChanged={(...args) => {
              let newArr = [...clients];
              newArr[idx] = args[0];
              setClients(newArr);
            }}
            initialClient={client}
            required
          />
          <div style={{ alignSelf: "center", marginTop: "8%" }}>
            <CloseIconButton close={() => removeClientSelect(client.id)} />
          </div>
        </div>
      ))}
      <button
        className="secondary"
        onClick={(e) => {
          e.preventDefault();
          setClients([...clients, props.initialClients[0]]);
        }}
      >
        Add client
      </button>
    </div>
  );
});

export default MultiClientSelect;

type MultiClientSelectProps = {
  initialClients: SingleClient[];
  containerClass?: string;
  clientClass?: string;
};

export type MultiClientSelectRef = {
  getClients(): SingleClient[];
};
