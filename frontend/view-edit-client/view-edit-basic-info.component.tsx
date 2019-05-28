import React from "react";
import ClientSection from "./client-section.component";
import { SingleClient } from "./view-client.component";
import dayjs from "dayjs";
import { useCss } from "kremling";
import BasicInformationInputs from "../add-client/form-inputs/basic-information-inputs.component";
import easyFetch from "../util/easy-fetch";

export default function ViewEditBasicInfo(props: ViewEditBasicInfoProps) {
  const [editing, setEditing] = React.useState(false);
  const [apiStatus, dispatchApiStatus] = React.useReducer(updatingReducer, {
    isUpdating: false,
    newClientData: null
  });
  const { client } = props;
  const scope = useCss(css);

  React.useEffect(() => {
    if (apiStatus.isUpdating) {
      const abortController = new AbortController();
      easyFetch(`/api/clients/${props.client.id}`, {
        method: "PATCH",
        body: apiStatus.newClientData,
        signal: abortController.signal
      }).then(data => {
        dispatchApiStatus({ type: "reset" });
        props.clientUpdated(data.client);
        setEditing(false);
      });

      return () => abortController.abort();
    }
  }, [apiStatus]);

  return (
    <ClientSection title="Basic information">
      {editing ? (
        <BasicInformationInputs
          client={{
            firstName: client.firstName,
            lastName: client.lastName,
            birthday: client.birthday,
            gender: client.gender
          }}
          handleSubmit={handleSubmit}
        >
          <div className="actions">
            <button
              type="button"
              className="secondary"
              onClick={() => setEditing(false)}
              disabled={apiStatus.isUpdating}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="primary"
              disabled={apiStatus.isUpdating}
            >
              Update
            </button>
          </div>
        </BasicInformationInputs>
      ) : (
        <div className="view-edit-basic-info" {...scope}>
          <div className="view-basic-info">
            {client.fullName} - {dayjs(client.birthday).format("M/D/YYYY")} -{" "}
            {client.gender}
          </div>
          <button
            className="secondary edit-button"
            onClick={() => setEditing(true)}
          >
            Edit
          </button>
        </div>
      )}
    </ClientSection>
  );

  function handleSubmit(evt, newClientData) {
    evt.preventDefault();
    dispatchApiStatus({ type: "update", newClientData });
  }
}

function updatingReducer(state, action) {
  switch (action.type) {
    case "update":
      return { isUpdating: true, newClientData: action.newClientData };
    case "reset":
      return { isUpdating: false };
    default:
      throw Error();
  }
}

type ViewEditBasicInfoProps = {
  client: SingleClient;
  clientUpdated(client: SingleClient): void;
};

const css = `
& .view-edit-basic-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

& .view-basic-info {
  display: flex;
  justify-content: center;
  align-items: center;
}
`;
