import React from "react";
import SingleClientSearchInput from "../client-search/single-client/single-client-search-input.component";
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
  const clientRefs = React.useRef<SingleClient[]>([]);

  React.useEffect(() => {
    clientRefs.current = clientRefs.current.slice(0, clients.length);
  }, [clients.length]);

  const removeClientSelect = (index) => {
    let newArr = [...clients];
    newArr.splice(index, 1);
    setClients(newArr);
  };

  return (
    <div>
      {clients.map((client, idx) => (
        <div style={{ display: "flex" }} key={client?.id || idx}>
          <SingleClientSearchInput
            ref={(state) => {
              if (state) {
                clientRefs.current[idx] = state.client;
              }
            }}
            clientChanged={() => {
              let newArr = [...clients];
              newArr[idx] = clientRefs.current[idx];
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
          const newClient =
            clients.length === 0 ? props.initialClients[0] : null;
          setClients([...clients, newClient]);
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
