import React from "react";
import ClientSection from "./client-section.component";
import { SingleClient } from "./view-client.component";
import dayjs from "dayjs";
import { useCss } from "kremling";
import editImg from "../../icons/148705-essential-collection/svg/edit.svg";
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
        body: apiStatus.newClientData
      })
        .then(data => {
          props.clientUpdated(data.client);
          setEditing(false);
        })
        .finally(() => {
          dispatchApiStatus({ type: "reset" });
        });
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
        <div {...scope} className="view-basic-info">
          {client.fullName} - {dayjs(client.birthday).format("M/D/YYYY")} -{" "}
          {client.gender} -{" "}
          <button className="icon" onClick={() => setEditing(true)}>
            <img src={editImg} alt="Edit Basic Information" />
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
& .view-basic-info {
  display: flex;
  justify-content: center;
  align-items: center;
}

& .view-basic-info .icon {

}
`;
