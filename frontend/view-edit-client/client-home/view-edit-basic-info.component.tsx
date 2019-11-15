import React from "react";
import ClientSection from "./client-section.component";
import { SingleClient, AuditSummary } from "../view-client.component";
import dayjs from "dayjs";
import BasicInformationInputs from "../../add-client/form-inputs/basic-information-inputs.component";
import easyFetch from "../../util/easy-fetch";
import { capitalize } from "lodash-es";

export default function ViewEditBasicInfo(props: ViewEditBasicInfoProps) {
  const [editing, setEditing] = React.useState(false);
  const [apiStatus, dispatchApiStatus] = React.useReducer(updatingReducer, {
    isUpdating: false,
    newClientData: null
  });
  const { client } = props;

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
    <ClientSection
      title="Basic information"
      auditSection={props.auditSummary && props.auditSummary.client}
    >
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
        <>
          <table className="client-table">
            <tbody>
              <tr>
                <td>Name:</td>
                <td>{client.fullName}</td>
              </tr>
              <tr>
                <td>Birthday:</td>
                <td>{dayjs(client.birthday).format("M/D/YYYY")}</td>
              </tr>
              <tr>
                <td>Gender:</td>
                <td>{capitalize(client.gender)}</td>
              </tr>
            </tbody>
          </table>
          {props.editable && (
            <button
              className="secondary edit-button"
              onClick={() => setEditing(true)}
            >
              Edit
            </button>
          )}
        </>
      )}
    </ClientSection>
  );

  function handleSubmit(evt, newClientData) {
    evt.preventDefault();
    dispatchApiStatus({ type: "update", newClientData });
  }
}

ViewEditBasicInfo.defaultProps = {
  editable: true
};

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
  clientUpdated?(client: SingleClient): void;
  auditSummary?: AuditSummary;
  editable?: boolean;
};
