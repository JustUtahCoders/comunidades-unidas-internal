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
  const [showEmptyRow, setShowEmptyRow] = React.useState(
    props.initialClients.length === 0
  );
  React.useImperativeHandle(ref, () => ({
    getClients() {
      return clients;
    },
  }));

  const removeClientSelect = () => {
    let newArr = [...clients];
    newArr.pop();
    setClients(newArr);
  };

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
          style={{ display: "flex" }}
        >
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
            <CloseIconButton close={removeClientSelect} />
          </div>
        </div>
      ))}
      <button
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
