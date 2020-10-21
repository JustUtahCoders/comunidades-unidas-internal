import { maybe } from "kremling";
import { cloneDeep } from "lodash-es";
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
  const clientRef = React.useRef();

  const removeClientSelect = (index) => {
    let newArr = [...clients];
    newArr.splice(index, 1);
    setClients(newArr);
  };

  return (
    <div>
      {clients.map((client, idx) => (
        <div style={{ display: "flex" }}>
          <SingleClientSearchInput
            ref={clientRef}
            clientChanged={() => {
              let newArr = [...clients];
              // @ts-ignore
              newArr[idx] = clientRef.current.clientId;
              setClients(newArr);
            }}
            initialClient={client}
            required
          />
          <div style={{ alignSelf: "center", marginTop: "8%" }}>
            <CloseIconButton close={() => removeClientSelect(idx)} />
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
